import fs from 'node:fs';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';

const hash = x => crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const text = x => typeof x === 'string' && x.trim().length > 0;
const list = x => Array.isArray(x) ? x : [];
const sameTarget = (a,b) => ['environment','identifier','version'].every(k=>a?.[k]===b?.[k]);
export function executionBinding(plan, job) {
  return hash({target:plan.execution.target, id:job.id, control_ids:job.control_ids,
    kind:job.kind, owner:job.owner, implementation_paths:job.implementation_paths,
    steps:job.steps, checks:job.checks, expected_evidence:job.expected_evidence,
    command:job.command, input_files:job.input_files, timeout_ms:job.timeout_ms});
}
export function reviewBinding(plan,job) {
  return hash({job:executionBinding(plan,job),receipt:job.receipt,documents:job.documents,findings:job.review?.findings});
}
export function enableExecution(plan) {
  if(plan.execution)throw Error('execution already enabled');
  const next={...structuredClone(plan),execution_required:true,execution:{schema_version:1,
    target:{environment:'local',identifier:'',version:''},jobs:[],blockers:[]}};
  for(const c of next.controls)if(c.conclusion==='conformant'){c.conclusion='pending';c.progress='implemented';delete c.conclusion_binding_sha256;}
  return next;
}
export function renderExecution(plan) {
  if(!plan.execution)return '\n## 執行與覆核\n\n舊計畫尚未啟用執行契約；目前檢查不包含此門檻。\n';
  const esc=x=>String(x??'').replace(/\|/g,'\\|').replace(/[\r\n]+/g,' ');
  const e=plan.execution;
  return '\n## 執行與覆核\n\n目標：'+esc(e.target.identifier||'待確認')+'；版本：'+esc(e.target.version||'待確認')+'。\n\n|任務／責任|細項|通過條件|收據／文件|內容覆核|\n|---|---|---|---|---|\n'+e.jobs.map(j=>'|'+[j.id+'／'+j.owner,j.control_ids.join(', '),j.checks.map(c=>c.id+'：'+c.criterion).join('；'),j.receipt?.path||list(j.documents).map(d=>d.path).join(', ')||'待補',j.review?.status==='pass'?'已覆核':j.review?.status==='fail'?'未通過':'待覆核'].map(esc).join('|')+'|').join('\n')+'\n\n待確認事項：\n'+(e.blockers.filter(b=>b.status==='open').map(b=>'- '+esc(b.id+'：'+b.question+'；負責：'+b.owner)).join('\n')||'無已登錄的未解事項；仍須核對來源及表單完整性。')+'\n';
}
function fileEntry(root, entry, api) {
  if(!entry || !/^[a-f0-9]{64}$/.test(entry.sha256) || api.digest(api.safe(root,entry.path))!==entry.sha256)throw Error('missing/stale evidence '+entry?.path);
}
function receiptData(root, plan, job, api) {
  fileEntry(root,job.receipt,api);
  const r=JSON.parse(fs.readFileSync(api.safe(root,job.receipt.path),'utf8'));
  if(r.schema_version!==1||r.job_id!==job.id||r.binding!==executionBinding(plan,job))throw Error('receipt target/job changed');
  if(!Number.isFinite(Date.parse(r.started_at))||!Number.isFinite(Date.parse(r.finished_at)))throw Error('receipt dates missing');
  fileEntry(root,r.log,api);
  fileEntry(root,r.authorization?.artifact,api);
  if(r.authorization?.binding!==r.binding||!text(r.authorization?.basis))throw Error('receipt authorization missing');
  if(!Array.isArray(r.inputs)||r.inputs.length!==job.input_files.length||!job.input_files.every(p=>r.inputs.some(e=>e.path===p)))throw Error('receipt input coverage mismatch');
  r.inputs.forEach(e=>fileEntry(root,e,api));
  if(r.output) {
    if(!sameTarget(r.output.target,plan.execution.target))throw Error('result target mismatch');
    const checks=list(r.output.checks), ids=checks.map(c=>c.id);
    if(checks.length!==job.checks.length||new Set(ids).size!==ids.length||!job.checks.every(c=>ids.includes(c.id)))throw Error('result check coverage mismatch');
    for(const c of checks){
      if(!['pass','fail'].includes(c.status)||!text(c.observed)||!Array.isArray(c.artifacts)||!c.artifacts.length)throw Error('observations/evidence missing');
      c.artifacts.forEach(e=>fileEntry(root,e,api));
    }
  }
  return r;
}
export function validateExecution(root,plan,gate,api) {
  const errors=[],need=(ok,msg)=>{if(!ok)errors.push('execution: '+msg);};
  if(!plan.execution){need(!plan.execution_required,'required profile missing');return errors;}
  const e=plan.execution, ids=new Set(list(plan.controls).map(c=>c?.id)), jobIds=new Set();
  need(e.schema_version===1,'invalid version');
  need(['local','staging','production'].includes(e.target?.environment),'invalid environment');
  need(Array.isArray(e.jobs)&&Array.isArray(e.blockers),'jobs/blockers arrays required');
  const planning=gate!=='draft';
  if(planning)need(text(e.target?.identifier)&&text(e.target?.version),'target/version required');
  const ready=new Set();
  for(const j of list(e.jobs))try{
    need(j&&text(j.id)&&!jobIds.has(j.id),'duplicate/empty job id');jobIds.add(j?.id);
    need(['command','document','external'].includes(j.kind),j.id+' invalid kind');
    need(list(j.control_ids).length>0&&j.control_ids.every(id=>ids.has(id)),j.id+' unknown controls');
    need(text(j.owner)&&list(j.steps).length>0&&j.steps.every(text),j.id+' owner/steps required');
    need(list(j.expected_evidence).length>0&&j.expected_evidence.every(text),j.id+' expected evidence required');
    need(Array.isArray(j.implementation_paths),j.id+' implementation paths required');
    j.implementation_paths?.forEach(p=>api.safe(root,p,false));
    const checks=list(j.checks),checkIds=checks.map(c=>c.id);
    need(checks.length>0&&new Set(checkIds).size===checks.length&&checks.every(c=>text(c.id)&&text(c.criterion)),j.id+' unique checks/pass criteria required');
    if(j.kind==='command') {
      need(Array.isArray(j.command)&&j.command.length>0&&j.command.every(text),j.id+' argv required');
      need(Array.isArray(j.input_files)&&j.input_files.length>0&&new Set(j.input_files).size===j.input_files.length,j.id+' inputs required');
      j.input_files?.forEach(p=>api.safe(root,p,false));
      need(Number.isInteger(j.timeout_ms)&&j.timeout_ms>0&&j.timeout_ms<=60000,j.id+' timeout must be 1..60000 ms');
    }
    let verified=false;
    if(j.kind==='command'&&j.receipt){const r=receiptData(root,plan,j,api);verified=r.exit_code===0&&!r.error&&r.output?.checks?.every(c=>c.status==='pass');}
    if(j.kind!=='command'&&list(j.documents).length){j.documents.forEach(d=>fileEntry(root,d,api));verified=true;}
    const review=j.review;
    need(!review||['pending','pass','fail'].includes(review.status),j.id+' invalid review');
    if(review?.status==='pass') {
      need(verified,j.id+' positive review without successful evidence');
      need(text(review.reviewer)&&['self-review','independent','external'].includes(review.mode)&&Number.isFinite(Date.parse(review.reviewed_at)),j.id+' reviewer/mode/date required');
      const findings=list(review.findings);
      need(findings.length===checks.length&&new Set(findings.map(f=>f.check_id)).size===checks.length&&checks.every(c=>findings.some(f=>f.check_id===c.id&&f.result==='pass'&&text(f.observed)&&text(f.reason))),j.id+' semantic findings incomplete');
      fileEntry(root,review.artifact,api);
      need(review.binding===reviewBinding(plan,j),j.id+' review stale');
      if(j.kind==='external')need(review.mode==='external'&&text(review.provider),j.id+' actual external reviewer/provider required');
      if(verified)ready.add(j.id);
    }
    if(gate==='delivery')need(ready.has(j.id),j.id+' evidence/review incomplete');
  }catch(err){errors.push('execution: '+(j?.id||'job')+' '+err.message);}
  for(const c of list(plan.controls))if(c?.applicability==='applicable'){
    const jobs=list(e.jobs).filter(j=>list(j?.control_ids).includes(c.id));
    if(planning||c.conclusion==='conformant')need(jobs.length>0,c.id+' has no execution job');
    if(c.conclusion==='conformant')need(jobs.length>0&&jobs.every(j=>ready.has(j.id)),c.id+' execution not reviewed');
  }
  const blockerIds=new Set();
  for(const b of list(e.blockers))try{
    need(text(b.id)&&!blockerIds.has(b.id),'duplicate/empty blocker id');blockerIds.add(b.id);
    need(['open','resolved'].includes(b.status)&&['planning','delivery'].includes(b.blocks),b.id+' invalid blocker');
    need(text(b.question)&&text(b.owner)&&list(b.control_ids).length>0&&b.control_ids.every(id=>ids.has(id)),b.id+' question/owner/scope required');
    if(b.status==='resolved'){need(text(b.answer),b.id+' resolution required');fileEntry(root,b.evidence,api);}
    else {
      if(gate==='delivery'||(gate==='planning'&&b.blocks==='planning'))need(false,b.id+' unresolved: '+b.question);
      need(!list(plan.controls).some(c=>b.control_ids.includes(c.id)&&c.conclusion==='conformant'),b.id+' unresolved blocker cannot claim conformity');
    }
  }catch(err){errors.push('execution: '+err.message);}
  return [...new Set(errors)];
}

// Executes only the reviewed argv, never an automatically discovered command.
// This is a recorder, not an OS sandbox or a grant of authorization.
export function runJob(root,plan,id,out,api) {
  const errors=validateExecution(root,plan,'draft',api);if(errors.length)throw Error(errors.join('\n'));
  const j=plan.execution.jobs.find(j=>j.id===id);if(j?.kind!=='command')throw Error('command job required');
  if(!text(plan.execution.target.identifier)||!text(plan.execution.target.version))throw Error('target/version required');
  if(plan.execution.blockers.some(b=>b.status==='open'&&b.control_ids.some(c=>j.control_ids.includes(c))))throw Error('job has unresolved blockers');
  if(j.authorization?.binding!==executionBinding(plan,j)||!text(j.authorization?.basis))throw Error('reviewed authorization required');
  fileEntry(root,j.authorization.artifact,api);
  for(const name of [out,out+'.log.json'])if(fs.existsSync(api.safe(root,name,false)))throw Error('output exists: '+name);
  const inputs=j.input_files.map(p=>({path:p,sha256:api.digest(api.safe(root,p))}));
  const started_at=new Date().toISOString();
  const run=spawnSync(j.command[0],j.command.slice(1),{cwd:root,encoding:'utf8',shell:false,windowsHide:true,timeout:j.timeout_ms,maxBuffer:4*1024*1024});
  const r={schema_version:1,job_id:id,binding:executionBinding(plan,j),authorization:structuredClone(j.authorization),started_at,finished_at:new Date().toISOString(),exit_code:Number.isInteger(run.status)?run.status:-1,inputs,output:null,error:run.error?String(run.error):null};
  try {
    for(const input of inputs)fileEntry(root,input,api);
    const output=JSON.parse(run.stdout);
    if(output.schema_version!==1||!sameTarget(output.target,plan.execution.target))throw Error('invalid output target/version');
    const checks=list(output.checks);
    if(checks.length!==j.checks.length||new Set(checks.map(c=>c.id)).size!==checks.length||!j.checks.every(c=>checks.some(x=>x.id===c.id)))throw Error('missing/extra result checks');
    r.output={schema_version:1,target:output.target,checks:checks.map(c=>{
      if(!text(c.observed)||!['pass','fail'].includes(c.status)||!list(c.evidence_paths).length)throw Error('check needs observation and evidence paths');
      return {id:c.id,status:c.status,observed:c.observed,artifacts:c.evidence_paths.map(p=>({path:p,sha256:api.digest(api.safe(root,p))}))};
    })};
  }catch(err){r.error=[r.error,err.message].filter(Boolean).join('; ');}
  api.writeNew(root,out+'.log.json',JSON.stringify({command:j.command,stdout:run.stdout||'',stderr:run.stderr||'',error:run.error?String(run.error):null},null,2)+'\n');
  r.log={path:out+'.log.json',sha256:api.digest(api.safe(root,out+'.log.json'))};
  api.writeNew(root,out,JSON.stringify(r,null,2)+'\n');
  return {receipt:{path:out,sha256:api.digest(api.safe(root,out))},passed:r.exit_code===0&&!r.error&&r.output?.checks.every(c=>c.status==='pass')};
}
