import {enableExecution,runJob,executionBinding,reviewBinding} from './execution-lib.mjs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {newPlan,readPlan,writeNew,assertPlan,render,fillCSV,registerCSV,migrate,sourceBinding,formBinding,conclusionBinding,safe,digest} from './security-lib.mjs';
export function main(root=process.cwd(), args=process.argv.slice(2)) {
  const [command,...rest]=args;
  const allowed={init:['level','out'],validate:['plan','gate'],render:['plan','out'],'fill-csv':['plan','form','key','out','mode'],'register-csv':['plan','form','file','key','column','out'],migrate:['plan','out'],bindings:['plan'],'enable-execution':['plan','out'],run:['plan','job','out']};
  if(!allowed[command])throw Error('command: init | validate | render | register-csv | fill-csv | migrate | bindings | enable-execution | run');
  const options={};
  for(let i=0;i<rest.length;i+=2){const name=rest[i].replace(/^--/,'');if(!rest[i].startsWith('--')||!allowed[command].includes(name)||options[name]!==undefined||!rest[i+1]||rest[i+1].startsWith('--'))throw Error('invalid argument '+rest[i]);options[name]=rest[i+1];}
  for(const key of allowed[command].filter(x=>!['gate','mode'].includes(x)))if(!options[key])throw Error('required --'+key);
  if(command==='init')writeNew(root,options.out,JSON.stringify(newPlan(options.level),null,2)+'\n');
  else if(command==='migrate')writeNew(root,options.out,JSON.stringify(migrate(root,options.plan),null,2)+'\n');
  else {
    const plan=readPlan(root,options.plan);
    if(command==='bindings'){
      if(plan.schema_version!==2)throw Error('schema_version 2 required');
      console.log(JSON.stringify({execution:(plan.execution?.jobs||[]).map(j=>({id:j.id,authorization:executionBinding(plan,j),review:reviewBinding(plan,j)})),source:sourceBinding(plan),forms:plan.forms.map(f=>({id:f.id,binding:formBinding(plan,f)})),conclusions:plan.controls.filter(c=>['conformant','not_applicable'].includes(c.conclusion)).map(c=>({id:c.id,binding:conclusionBinding(plan,c)}))},null,2));return;
    }
    assertPlan(root,plan,command==='validate'?(options.gate||'draft'):'draft');
    if(command==='enable-execution')writeNew(root,options.out,JSON.stringify(enableExecution(plan),null,2)+'\n');
    if(command==='run'){const r=runJob(root,plan,options.job,options.out,{safe,digest,writeNew});console.log(JSON.stringify(r));if(!r.passed)throw Error('job failed; receipt saved, inspect evidence before retry');}
    if(command==='render')writeNew(root,options.out,render(plan));
    if(command==='register-csv')writeNew(root,options.out,JSON.stringify(registerCSV(root,plan,{id:options.form,file:options.file,key:options.key,column:options.column}),null,2)+'\n');
    if(command==='fill-csv')writeNew(root,options.out,fillCSV(root,plan,options.form,options.key,options.mode||'draft'));
  }
  console.log('PASS '+command+'; structure/evidence integrity only, not security certification.');
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url))try{main();}catch(e){console.error('FAIL '+e.message);process.exitCode=1;}
