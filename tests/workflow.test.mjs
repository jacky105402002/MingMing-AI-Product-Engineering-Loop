import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {validateState,snapshot,safePath} from '../scripts/workflow-lib.mjs';
import {record} from '../scripts/record-evidence.mjs';
import {validateDocs} from '../scripts/validate-workflow.mjs';
const repo=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
function fixture(t){
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'mingming-test-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  for(const [p,c]of Object.entries({'feature.md':'AC-1: verify result','node.md':'Validate result and failures','app.mjs':'export const value=1;','review.md':'Self-review: actual diff and acceptance checked. No blocking findings remain.'}))fs.writeFileSync(path.join(root,p),c);
  const state={schema_version:1,mode:'active',feature:{id:'test-feature',route:'fast-track',risk:'low',status:'done',spec:'feature.md',acceptance_criteria:[{id:'AC-1',description:'Result meets expected behavior'}],stages:['01','02','03','04','05','06','07'].map(id=>({id,status:['01','02','07'].includes(id)?'complete':'not_applicable',reason:'Local maintenance has no product design changes',artifact:'feature.md'})),release:{status:'not_requested',record:null}},nodes:[{id:'node-001',goal:'Verify result',owner:'backend-developer',status:'done',depends_on:[],ac_ids:['AC-1'],spec:'node.md',allowed_files:['app.mjs'],evidence_files:['app.mjs'],revision:'r1',checks:[]}],questions:[],decisions:[]};
  const write=()=>fs.writeFileSync(path.join(root,'state.json'),JSON.stringify(state));
  write();
  const base=['--state','state.json','--node','node-001'];
  record(root,[...base,'--kind','test','--out','reports/test.json','--',process.execPath,'-e','console.log("actual test command ran")']);
  record(root,[...base,'--kind','review','--out','reports/review.json','--artifact','review.md','--result','pass','--reviewer-mode','self-review']);
  state.nodes[0].checks=[{id:'test',kind:'test',result:'pass',evidence:'reports/test.json'},{id:'review',kind:'review',result:'pass',evidence:'reports/review.json'},{id:'docs',kind:'docs',result:'not_applicable',reason:'No product docs changed'}];
  write();
  return {root,state,write,node:state.nodes[0],editEvidence:(p,fn)=>{const e=JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));fn(e);fs.writeFileSync(path.join(root,p),JSON.stringify(e));}};
}
test('real passing command and review produce valid active evidence',t=>{const f=fixture(t);assert.deepEqual(validateState(f.root,f.state),[]);});
test('template passes structure but never active validation',()=>{const s=JSON.parse(fs.readFileSync(path.join(repo,'tasks/current/state.json'),'utf8'));assert.deepEqual(validateState(repo,s),[]);assert.match(validateState(repo,s,{requireActive:true}).join(),/template/);});
test('template cannot claim completed nodes',t=>{const f=fixture(t);f.state.mode='template';assert.match(validateState(f.root,f.state).join(),/template/);});
test('actual nonzero command cannot be passed as success',t=>{const f=fixture(t);const e=record(f.root,['--state','state.json','--node','node-001','--kind','test','--out','reports/fail.json','--',process.execPath,'-e','process.exit(7)']);assert.equal(e.result,'fail');assert.equal(e.exit_code,7);f.node.checks[0].evidence='reports/fail.json';assert.match(validateState(f.root,f.state).join(),/binding|failed command/);});
test('recorder refuses overwriting previous attempt',t=>{const f=fixture(t);assert.throws(()=>record(f.root,['--state','state.json','--node','node-001','--kind','test','--out','reports/test.json','--',process.execPath,'-e','0']),/already exists/);});
for(const [name,change,pattern]of [
  ['wrong revision',e=>e.revision='old',/binding/],
  ['wrong node',e=>e.node_id='other',/binding/],
  ['wrong kind',e=>e.kind='build',/binding/],
  ['failed exit',e=>e.exit_code=1,/failed command/],
  ['missing command',e=>e.command=null,/command/],
  ['missing source coverage',e=>e.files=[],/missing file/],
  ['missing AC coverage',e=>e.ac_ids=[],/misses AC/],
  ['missing artifacts',e=>e.artifacts=[],/artifact/]
])test(name+' rejected',t=>{const f=fixture(t);f.editEvidence('reports/test.json',change);assert.match(validateState(f.root,f.state).join(),pattern);});
test('source modification invalidates evidence',t=>{const f=fixture(t);fs.appendFileSync(path.join(f.root,'app.mjs'),'//changed');assert.match(validateState(f.root,f.state).join(),/stale/);});
test('feature requirement modification invalidates evidence',t=>{const f=fixture(t);fs.appendFileSync(path.join(f.root,'feature.md'),'new requirement');assert.match(validateState(f.root,f.state).join(),/stale/);});
test('report modification invalidates evidence',t=>{const f=fixture(t);fs.appendFileSync(path.join(f.root,'review.md'),'changed');assert.match(validateState(f.root,f.state).join(),/stale/);});
test('missing QA gate rejected',t=>{const f=fixture(t);f.node.checks=f.node.checks.filter(c=>c.kind!=='test');assert.match(validateState(f.root,f.state).join(),/missing test/);});
test('test/review N/A cannot bypass gate',t=>{const f=fixture(t);f.node.checks[0]={id:'test',kind:'test',result:'not_applicable',reason:'skip'};assert.match(validateState(f.root,f.state).join(),/cannot be N\/A/);});
test('N/A requires meaningful reason',t=>{const f=fixture(t);f.node.checks[2].reason='TBD';assert.match(validateState(f.root,f.state).join(),/reason/);});
test('blocking question prevents affected node completion',t=>{const f=fixture(t);f.state.questions=[{id:'Q1',question:'Which behavior?',impact:'Changes output',blocking:true,node_ids:['node-001'],status:'open',sources_checked:['feature.md']}];assert.match(validateState(f.root,f.state).join(),/blocked by open question/);});
test('resolved question requires actual answer and source',t=>{const f=fixture(t);f.state.questions=[{id:'Q1',question:'Which behavior?',impact:'Changes output',blocking:true,node_ids:[],status:'resolved',sources_checked:[],answer:'TBD',resolution_source:''}];assert.match(validateState(f.root,f.state).join(),/requires answer/);});
test('cycles and unfinished dependencies rejected',t=>{const f=fixture(t);f.node.depends_on=['node-001'];assert.match(validateState(f.root,f.state).join(),/cycle/);});
test('dependency sources must be included transitively',t=>{const f=fixture(t);fs.writeFileSync(path.join(f.root,'dep.md'),'dependency spec');f.state.nodes.push({...structuredClone(f.node),id:'node-002',spec:'dep.md',status:'pending',checks:[]});f.node.depends_on=['node-002'];assert.match(validateState(f.root,f.state).join(),/dependency not done/);assert.match(validateState(f.root,f.state).join(),/missing file: dep.md/);});
test('path traversal and Windows absolute paths rejected',t=>{const f=fixture(t);for(const p of ['../secret','C:/secret','C:\\secret','/secret'])assert.throws(()=>safePath(f.root,p),/unsafe|outside/);});
test('malformed state yields errors without crashing',t=>{const f=fixture(t);for(const s of [null,{}, {...f.state,nodes:[null]}, {...f.state,questions:[null]}, {...f.state,nodes:[{...f.node,checks:[null]}]}])assert.ok(validateState(f.root,s).length>0);});
test('high risk cannot use fast-track',t=>{const f=fixture(t);f.state.feature.risk='high';assert.match(validateState(f.root,f.state).join(),/fast-track/);});
test('unfinished design stage cannot pass execution',t=>{const f=fixture(t);f.state.feature.stages[0].status='applicable';assert.match(validateState(f.root,f.state).join(),/unfinished/);});
test('release cannot be verified without deployment and smoke evidence',t=>{const f=fixture(t);f.state.feature.release={status:'verified',record:'release.json'};fs.writeFileSync(path.join(f.root,'release.json'),JSON.stringify({status:'verified',version:'1.1.0',target:'repository release',authorization_source:'user requested release',deployment_evidence:[],verification_evidence:[]}));assert.match(validateState(f.root,f.state).join(),/deployment evidence/);assert.match(validateState(f.root,f.state).join(),/verification evidence/);});
test('recorder detects source mutation during test',t=>{const f=fixture(t);assert.throws(()=>record(f.root,['--state','state.json','--node','node-001','--kind','test','--out','reports/mutation.json','--',process.execPath,'-e','require("fs").appendFileSync("app.mjs","//mutation")']),/Source changed/);});
test('CLI requires active state and fails malformed JSON',t=>{const f=fixture(t);let run=spawnSync(process.execPath,[path.join(repo,'scripts/validate-workflow.mjs'),'--state','state.json','--state-only','--require-active'],{cwd:f.root,encoding:'utf8'});assert.equal(run.status,0,run.stderr);fs.writeFileSync(path.join(f.root,'state.json'),'{');run=spawnSync(process.execPath,[path.join(repo,'scripts/validate-workflow.mjs'),'--state','state.json','--state-only'],{cwd:f.root,encoding:'utf8'});assert.equal(run.status,1);});
test('draft feature cannot hide executing nodes with unfinished design',t=>{const f=fixture(t);f.state.feature.status='draft';f.state.feature.stages=[];assert.match(validateState(f.root,f.state).join(),/dispositions/);});
test('null acceptance criteria produces diagnostics',t=>{const f=fixture(t);f.state.feature.acceptance_criteria=[null];assert.ok(validateState(f.root,f.state).length>0);});
test('documentation check finds missing relative targets',t=>{const f=fixture(t);fs.writeFileSync(path.join(f.root,'broken.md'),'[broken](missing.md)');assert.match(validateDocs(f.root).join(),/broken link missing.md/);});
test('minimal example is a valid draft, not a completed feature',()=>{const s=JSON.parse(fs.readFileSync(path.join(repo,'examples/minimal-state.json'),'utf8'));assert.equal(s.feature.status,'draft');assert.deepEqual(validateState(repo,s),[]);});
