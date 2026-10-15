import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {newPlan,validatePlan,safe,digest,writeNew,conclusionBinding,registerCSV,fillCSV} from '../.agents/skills/security-planner/scripts/security-lib.mjs';
import {enableExecution,runJob,executionBinding,reviewBinding,validateExecution} from '../.agents/skills/security-planner/scripts/execution-lib.mjs';
const api={safe,digest,writeNew};
function fixture(t){
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'mingming-execution-'));
  t.after(()=>{if(!root.startsWith(path.resolve(os.tmpdir())+path.sep)||!path.basename(root).startsWith('mingming-execution-'))throw Error('unsafe cleanup');fs.rmSync(root,{recursive:true,force:true});});
  const p=newPlan('普');p.execution.target={environment:'local',identifier:'isolated-fixture',version:'fixture-1'};
  fs.writeFileSync(path.join(root,'scope.md'),'Synthetic test authorization: run local fixture only; no external target.');
  fs.writeFileSync(path.join(root,'input.json'),JSON.stringify({pass:true}));
  fs.writeFileSync(path.join(root,'check.mjs'),`import fs from 'node:fs';const x=JSON.parse(fs.readFileSync('input.json'));fs.writeFileSync('observation.txt',JSON.stringify(x));console.log(JSON.stringify({schema_version:1,target:${JSON.stringify(p.execution.target)},checks:[{id:'C1',status:x.pass?'pass':'fail',observed:'Read actual fixture input: '+x.pass,evidence_paths:['observation.txt']}]}));`);
  const j={id:'backup',kind:'command',control_ids:['BASE-10-N02'],owner:'qa-tester',implementation_paths:['input.json'],steps:['Read actual input and observe result'],expected_evidence:['observation.txt'],checks:[{id:'C1',criterion:'Fixture must report pass=true'}],command:[process.execPath,'check.mjs'],input_files:['check.mjs','input.json'],timeout_ms:5000,receipt:null,review:{status:'pending'}};
  p.execution.jobs.push(j);const entry=name=>({path:name,sha256:digest(safe(root,name))});
  const authorize=()=>j.authorization={basis:'User authorized local fixture validation',artifact:entry('scope.md'),binding:executionBinding(p,j)};authorize();
  return {root,p,j,entry,authorize};
}
function reviewed(f){
  const result=runJob(f.root,f.p,f.j.id,'attempt.json',api);assert.equal(result.passed,true);f.j.receipt=result.receipt;
  fs.writeFileSync(path.join(f.root,'review.md'),'Synthetic self-review: compared actual observation to the criterion and current input.');
  f.j.review={status:'pass',reviewer:'fixture-agent',mode:'self-review',reviewed_at:new Date().toISOString(),findings:[{check_id:'C1',result:'pass',observed:'input.pass=true and observation records true',reason:'Directly compared generated output to criterion'}],artifact:f.entry('review.md')};
  f.j.review.binding=reviewBinding(f.p,f.j);return f;
}
test('new plans require execution and legacy v2 can explicitly upgrade',()=>{
  const p=newPlan('普');assert.equal(p.execution_required,true);delete p.execution;
  assert.ok(validatePlan(process.cwd(),p).some(x=>x.includes('required profile')));
  delete p.execution_required;assert.deepEqual(validatePlan(process.cwd(),p),[]);
  const q=enableExecution(p);assert.equal(q.execution_required,true);assert.throws(()=>enableExecution(q),/already/);
});
test('planning requires a job for each applicable clause',t=>{const f=fixture(t);f.p.controls.find(c=>c.id==='BASE-10-N01').applicability='applicable';assert.ok(validateExecution(f.root,f.p,'planning',api).some(x=>x.includes('no execution job')));});
test('real command receipt and semantic review pass focused execution gate',t=>{const f=reviewed(fixture(t));assert.deepEqual(validateExecution(f.root,f.p,'delivery',api),[]);assert.deepEqual(validatePlan(f.root,f.p),[]);});
test('zero exit with a failed finding is still a failed job',t=>{const f=fixture(t);fs.writeFileSync(path.join(f.root,'input.json'),'{"pass":false}');const r=runJob(f.root,f.p,f.j.id,'fail.json',api);assert.equal(r.passed,false);const receipt=JSON.parse(fs.readFileSync(path.join(f.root,'fail.json')));assert.equal(receipt.exit_code,0);assert.equal(receipt.output.checks[0].status,'fail');});
test('real command failure is preserved with stdout and stderr',t=>{const f=fixture(t);fs.writeFileSync(path.join(f.root,'check.mjs'),"console.error('fixture failure');process.exit(3)");const r=runJob(f.root,f.p,f.j.id,'fail.json',api);assert.equal(r.passed,false);assert.equal(JSON.parse(fs.readFileSync(path.join(f.root,'fail.json'))).exit_code,3);assert.match(fs.readFileSync(path.join(f.root,'fail.json.log.json'),'utf8'),/fixture failure/);});
for(const variant of ['malformed','missing-check','wrong-target','missing-evidence'])test('rejects result '+variant,t=>{
  const f=fixture(t);const payload={schema_version:1,target:structuredClone(f.p.execution.target),checks:[{id:'C1',status:'pass',observed:'observation',evidence_paths:['scope.md']}]};
  if(variant==='missing-check')payload.checks=[];if(variant==='wrong-target')payload.target.version='wrong';if(variant==='missing-evidence')payload.checks[0].evidence_paths=['missing.txt'];
  fs.writeFileSync(path.join(f.root,'check.mjs'),variant==='malformed'?"console.log('not JSON')":'console.log('+JSON.stringify(JSON.stringify(payload))+')');
  assert.equal(runJob(f.root,f.p,f.j.id,'bad.json',api).passed,false);
});
test('timeout returns failure and never approves an incomplete process',t=>{const f=fixture(t);f.j.timeout_ms=100;f.authorize();fs.writeFileSync(path.join(f.root,'check.mjs'),'setInterval(()=>{},1000)');assert.equal(runJob(f.root,f.p,f.j.id,'timeout.json',api).passed,false);});
test('authorization target/command edits require renewed scope verification',t=>{const f=fixture(t);f.j.command.push('changed');assert.throws(()=>runJob(f.root,f.p,f.j.id,'bad.json',api),/authorization/);});
test('path escape and overwriting an attempt are rejected',t=>{const f=fixture(t);assert.throws(()=>runJob(f.root,f.p,f.j.id,'../bad.json',api),/unsafe/);runJob(f.root,f.p,f.j.id,'attempt.json',api);assert.throws(()=>runJob(f.root,f.p,f.j.id,'attempt.json',api),/exists/);});
test('changed input during the check is a failure',t=>{const f=fixture(t);fs.appendFileSync(path.join(f.root,'check.mjs'),"fs.writeFileSync('input.json','{}');");assert.equal(runJob(f.root,f.p,f.j.id,'mutation.json',api).passed,false);});
for(const name of ['input.json','observation.txt','review.md','attempt.json.log.json'])test('changed '+name+' invalidates evidence',t=>{const f=reviewed(fixture(t));fs.appendFileSync(path.join(f.root,name),'changed');assert.ok(validateExecution(f.root,f.p,'delivery',api).length);});
test('changed criterion and incomplete semantic review block success',t=>{const f=reviewed(fixture(t));f.j.review.findings=[];f.j.review.binding=reviewBinding(f.p,f.j);assert.ok(validateExecution(f.root,f.p,'delivery',api).some(x=>x.includes('semantic')));f.j.checks[0].criterion='Changed';assert.ok(validateExecution(f.root,f.p,'delivery',api).some(x=>x.includes('changed')));});
test('unresolved external input blocks affected job and cannot auto-resolve',t=>{const f=fixture(t);f.p.execution.blockers=[{id:'B1',status:'open',blocks:'planning',control_ids:f.j.control_ids,question:'Need agency scope',owner:'agency'}];assert.throws(()=>runJob(f.root,f.p,f.j.id,'bad.json',api),/blockers/);assert.ok(validateExecution(f.root,f.p,'planning',api).some(x=>x.includes('unresolved')));f.p.execution.blockers[0].status='resolved';assert.ok(validateExecution(f.root,f.p,'delivery',api).some(x=>x.includes('resolution')));});
test('external work cannot be completed by an AI self-review label',t=>{const f=fixture(t);f.j.kind='external';f.j.documents=[f.entry('scope.md')];f.j.review={status:'pass',reviewer:'AI',mode:'self-review',reviewed_at:new Date().toISOString(),findings:[{check_id:'C1',result:'pass',observed:'fixture',reason:'fixture'}],artifact:f.entry('scope.md')};f.j.review.binding=reviewBinding(f.p,f.j);assert.ok(validateExecution(f.root,f.p,'delivery',api).some(x=>x.includes('external reviewer')));});
test('conformity is blocked until execution evidence is reviewed',t=>{const f=fixture(t);const c=f.p.controls.find(c=>c.id==='BASE-10-N02');Object.assign(c,{applicability:'applicable',progress:'verified',conclusion:'conformant',evidence:[f.entry('scope.md')],input_files:[f.entry('input.json')]});c.conclusion_binding_sha256=conclusionBinding(f.p,c);assert.ok(validatePlan(f.root,f.p).some(x=>x.includes('execution not reviewed')));});
test('focused check success cannot bypass unresolved whole-project delivery',t=>{const f=reviewed(fixture(t));fs.writeFileSync(path.join(f.root,'form.csv'),'id,question,result\n1,backup,yes\n');f.p=registerCSV(f.root,f.p,{id:'F',file:'form.csv',key:'id',column:'result'});const form=f.p.forms[0];Object.assign(form.rows[0],{disposition:'mapped',required_ids:['BASE-10-N02']});form.mappings=[{field:'1',column:'result',control_ids:['BASE-10-N02'],value_kind:'conclusion'}];assert.match(fillCSV(f.root,f.p,'F','id'),/待覆核/);assert.throws(()=>fillCSV(f.root,f.p,'F','id','final'),/source review incomplete/);});
test('CLI records actual execution without automatically approving the plan',t=>{const f=fixture(t);fs.writeFileSync(path.join(f.root,'plan.json'),JSON.stringify(f.p));const cli=fileURLToPath(new URL('../.agents/skills/security-planner/scripts/security-plan.mjs',import.meta.url));const r=spawnSync(process.execPath,[cli,'run','--plan','plan.json','--job',f.j.id,'--out','cli.json'],{cwd:f.root,encoding:'utf8',windowsHide:true});assert.equal(r.status,0,r.stderr);assert.equal(JSON.parse(fs.readFileSync(path.join(f.root,'cli.json'))).output.checks[0].status,'pass');assert.equal(JSON.parse(fs.readFileSync(path.join(f.root,'plan.json'))).execution.jobs[0].review.status,'pending');});
test('upgrade preserves old evidence without carrying conformity to new execution gates',()=>{const p=newPlan('普');delete p.execution;delete p.execution_required;p.controls[0].conclusion='conformant';p.controls[0].evidence=[{path:'old.txt',sha256:'old'}];const q=enableExecution(p);assert.equal(p.controls[0].conclusion,'conformant');assert.equal(q.controls[0].conclusion,'pending');assert.deepEqual(q.controls[0].evidence,p.controls[0].evidence);});
