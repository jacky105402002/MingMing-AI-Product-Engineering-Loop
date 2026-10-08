import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {readJson,safePath,snapshot,requiredFiles,kinds,meaningful} from './workflow-lib.mjs';
export function record(root,args) {
  const opts={state:'tasks/current/state.json'}, command=[];
  for(let i=0;i<args.length;i++){
    if(args[i]==='--'){command.push(...args.slice(i+1));break;}
    if(!['--state','--node','--kind','--out','--artifact','--result','--reviewer-mode'].includes(args[i]) || !args[i+1])throw Error('Unknown/missing argument '+args[i]);
    opts[args[i].slice(2)]=args[++i];
  }
  const state=readJson(root,opts.state);
  if(state.mode!=='active')throw Error('Cannot record evidence for a template');
  const node=state.nodes.find(n=>n.id===opts.node);
  if(!node || !meaningful(node.revision) || !kinds.includes(opts.kind))throw Error('Valid node, revision and kind required');
  const out=safePath(root,opts.out,false);
  if(fs.existsSync(out))throw Error('Evidence already exists; use a new attempt');
  const files=snapshot(root,requiredFiles(state,node)); // snapshot BEFORE command
  let artifacts, result, exit_code=null;
  if(['review','docs'].includes(opts.kind)){
    if(command.length || !['pass','fail','blocked'].includes(opts.result))throw Error('Manual review/docs requires --artifact and --result; no command');
    const report=fs.readFileSync(safePath(root,opts.artifact),'utf8');
    if(report.trim().length<40 || /\bTBD\b|\bTODO\b/.test(report))throw Error('Complete the review/docs report first');
    if(opts.kind==='review'&&!['self-review','independent'].includes(opts['reviewer-mode']))throw Error('--reviewer-mode required');
    artifacts=snapshot(root,[opts.artifact]);result=opts.result;
  } else {
    if(!command.length || opts.result || opts.artifact)throw Error('Execution kind requires a command after --; result comes from exit code');
    const logRelative=opts.out+'.log', log=safePath(root,logRelative,false);
    if(fs.existsSync(log))throw Error('Log already exists; use a new attempt');
    const run=spawnSync(command[0],command.slice(1),{cwd:root,encoding:'utf8',shell:false,maxBuffer:16*1024*1024,windowsHide:true});
    exit_code=Number.isInteger(run.status)?run.status:-1;result=exit_code===0?'pass':'fail';
    fs.mkdirSync(path.dirname(log),{recursive:true});
    fs.writeFileSync(log,JSON.stringify(command)+'\n'+(run.stdout||'')+(run.stderr||'')+(run.error?String(run.error):''),{flag:'wx'});
    artifacts=snapshot(root,[logRelative]);
  }
  const after=snapshot(root,requiredFiles(state,node));
  if(JSON.stringify(after)!==JSON.stringify(files))throw Error('Source changed during evidence capture; rerun after stabilizing files');
  const evidence={node_id:node.id,revision:node.revision,kind:opts.kind,result,created_at:new Date().toISOString(),command:command.length?command:null,exit_code,ac_ids:node.ac_ids,artifacts,files};
  if(opts.kind==='review')evidence.reviewer_mode=opts['reviewer-mode'];
  fs.mkdirSync(path.dirname(out),{recursive:true});
  fs.writeFileSync(out,JSON.stringify(evidence,null,2)+'\n',{flag:'wx'});
  return evidence;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try{const e=record(process.cwd(),process.argv.slice(2));console.log(e.result+' evidence recorded; inspect then link check.evidence in state.json');process.exitCode=e.result==='pass'?0:1;}
  catch(e){console.error('FAIL '+e.message);process.exitCode=1;}
}

