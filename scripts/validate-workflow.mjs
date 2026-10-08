import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readJson,validateState,roles,safePath} from './workflow-lib.mjs';
export function validateDocs(root) {
  const errors=[];
  const required=['AGENTS.md','VERSION','.agents/skills/mingming-workflow/SKILL.md','docs/adoption.md','docs/pilot-plan.md',...roles.map(r=>'skills/'+r+'.skill.md')];
  for(const p of required)try{safePath(root,p);}catch(e){errors.push(e.message);}
  function walk(dir) {
    for(const ent of fs.readdirSync(dir,{withFileTypes:true})) {
      if(['.git','node_modules'].includes(ent.name)||ent.isSymbolicLink())continue;
      const full=path.join(dir,ent.name);
      if(ent.isDirectory())walk(full);
      else if(ent.name.endsWith('.md')){
        const content=fs.readFileSync(full,'utf8').replace(/```[\s\S]*?```/g,'');
        for(const m of content.matchAll(/!?\[[^\]]*\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g)){
          const link=m[1].replace(/^<|>$/g,'');
          if(/^(https?:|mailto:|#|app:|codex:)/.test(link))continue;
          try{
            const rel=path.relative(root,path.resolve(path.dirname(full),decodeURIComponent(link.split('#')[0]))).split(path.sep).join('/');
            safePath(root,rel);
          }catch(e){errors.push(path.relative(root,full)+': broken link '+link);}
        }
      }
    }
  }
  walk(root); return errors;
}
export function main(args=process.argv.slice(2)) {
  const root=process.cwd();
  let statePath='tasks/current/state.json', requireActive=false, docs=true;
  for(let i=0;i<args.length;i++){
    if(args[i]==='--state' && args[i+1])statePath=args[++i];
    else if(args[i]==='--require-active')requireActive=true;
    else if(args[i]==='--state-only')docs=false;
    else throw Error('Unknown/missing argument: '+args[i]);
  }
  const state=readJson(root,statePath);
  const errors=[...validateState(root,state,{requireActive}),...(docs?validateDocs(root):[])];
  if(errors.length){console.error(errors.map(e=>'FAIL '+e).join('\n'));return 1;}
  console.log(state.mode==='template'?'PASS template structure; no active feature or product validation claimed.':'PASS active workflow state and referenced evidence integrity; semantic review still required.');
  return 0;
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try{process.exitCode=main();}catch(e){console.error('FAIL '+e.message);process.exitCode=1;}
}

