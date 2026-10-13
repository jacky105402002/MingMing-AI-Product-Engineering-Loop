import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {newPlan,readPlan,writeNew,assertPlan,render,fillCSV} from './security-lib.mjs';
export function main(root=process.cwd(), args=process.argv.slice(2)) {
  const [command,...rest]=args;
  const allowed={init:['level','out'],validate:['plan','gate'],render:['plan','out'],'fill-csv':['plan','form','key','out']};
  if(!allowed[command])throw Error('command: init | validate | render | fill-csv');
  const options={};
  for(let i=0;i<rest.length;i+=2){const name=rest[i].replace(/^--/,'');if(!rest[i].startsWith('--')||!allowed[command].includes(name)||options[name]!==undefined||!rest[i+1]||rest[i+1].startsWith('--'))throw Error('invalid argument '+rest[i]);options[name]=rest[i+1];}
  for(const key of allowed[command].filter(x=>x!=='gate'))if(!options[key])throw Error('required --'+key);
  if(command==='init')writeNew(root,options.out,JSON.stringify(newPlan(options.level),null,2)+'\n');
  else {
    const plan=readPlan(root,options.plan); assertPlan(root,plan,command==='validate'?(options.gate||'draft'):'draft');
    if(command==='render')writeNew(root,options.out,render(plan));
    if(command==='fill-csv')writeNew(root,options.out,fillCSV(root,plan,options.form,options.key));
  }
  console.log('PASS '+command+'; structure/evidence integrity only, not security certification.');
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url))try{main();}catch(e){console.error('FAIL '+e.message);process.exitCode=1;}
