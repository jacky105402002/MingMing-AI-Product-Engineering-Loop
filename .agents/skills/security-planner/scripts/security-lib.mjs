import {validateExecution,renderExecution} from './execution-lib.mjs';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const assets = new URL('../assets/', import.meta.url);
import {catalog,levels,origins,normalizeLevel,expand,sourceBinding,formBinding,scopeIds,conclusionBinding} from './clause-catalog.mjs';
export {catalog,expand,sourceBinding,formBinding,scopeIds,conclusionBinding};
export const sources = JSON.parse(fs.readFileSync(new URL('sources.json', assets), 'utf8'));
export const digest = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
export const meaningful = value => typeof value === 'string' && value.trim() !== '' && !/^(TBD|TODO|待確認|待填)$/i.test(value.trim());
export function safe(root, name, exists = true) {
  if (typeof name !== 'string' || !name || /[\\:]/.test(name) || path.isAbsolute(name) || name.split('/').includes('..')) throw Error('unsafe path: ' + name);
  const base = fs.realpathSync(root), target = path.resolve(base, name);
  if (!target.startsWith(base + path.sep)) throw Error('path outside root: ' + name);
  let ancestor = target;
  while (!fs.existsSync(ancestor)) ancestor = path.dirname(ancestor);
  const real = fs.realpathSync(ancestor);
  if (real !== base && !real.startsWith(base + path.sep)) throw Error('symlink outside root: ' + name);
  if (exists && (!fs.existsSync(target) || !fs.statSync(target).isFile())) throw Error('file missing: ' + name);
  return target;
}
export function writeNew(root, name, text) {
  const target = safe(root, name, false);
  fs.mkdirSync(path.dirname(target), {recursive: true});
  safe(root, name, false);
  fs.writeFileSync(target, text, {encoding: 'utf8', flag: 'wx'});
}
export function readPlan(root, name) { return JSON.parse(fs.readFileSync(safe(root, name), 'utf8').replace(/^\uFEFF/, '')); }
export function newPlan(level) {
  level=normalizeLevel(level);
  return {
    schema_version:2, catalog_version:catalog.version,
    execution_required:true, execution:{schema_version:1,target:{environment:"local",identifier:"",version:""},jobs:[],blockers:[]},
    profile:{government_project:'yes',level,level_basis:'',policy_scope:'assess',system_scope:'',context:{custom_development:null,core_system:null,contract_amount_twd:null}},
    source_review:{status:'pending',reviewer:'',reviewed_at:'',artifact:null,binding_sha256:null},sources:structuredClone(sources),
    controls:expand(level).map(c=>({...c,baseline_requirement:c.requirement,project_requirement:'',applicability:'pending',rationale:'',owner:'',node_ids:[],measure:'',verification:'',progress:'planned',conclusion:'pending',evidence:[],input_files:[],exception_approval:[],external_required:false,external_evidence:[]})),forms:[]
  };
}
export function validatePlan(root, plan, gate = 'draft', nodeIds) {
  const errors = [], need = (ok, msg) => { if (!ok) errors.push(msg); };
  const obj = (v, label) => { const ok = v && typeof v === 'object' && !Array.isArray(v); need(ok, label+' must be object'); return ok ? v : {}; };
  const arr = (v, label) => { need(Array.isArray(v), label+' must be array'); return Array.isArray(v) ? v : []; };
  const hashEntry = (v, label) => { v = obj(v,label); try { need(/^[a-f0-9]{64}$/.test(v.sha256) && digest(safe(root,v.path)) === v.sha256, label+' stale hash: '+v.path); } catch(e) { errors.push(label+': '+e.message); } };
  need(['draft','planning','delivery'].includes(gate), 'invalid gate');
  plan = obj(plan,'plan'); const p = obj(plan.profile,'profile'), ctx = obj(p.context,'context');
  if(plan.schema_version !== 2)return ['schema_version 2 required; use migrate to preserve the original v1 plan'];
  need(plan.catalog_version === catalog.version, 'catalog version mismatch; re-evaluate sources');
  need(['yes','no','unknown'].includes(p.government_project), 'invalid government_project');
  need(['high','medium','normal','unknown'].includes(p.level), 'invalid level');
  need(['extended','mandatory_only','assess'].includes(p.policy_scope), 'invalid policy_scope');
  for (const k of ['custom_development','core_system']) need(ctx[k] === null || typeof ctx[k] === 'boolean', 'invalid context '+k);
  need(ctx.contract_amount_twd === null || (Number.isFinite(ctx.contract_amount_twd) && ctx.contract_amount_twd >= 0), 'invalid contract amount');
  const review = obj(plan.source_review,'source_review');
  need(['pending','complete'].includes(review.status), 'invalid source review');
  if (review.status === 'complete') {
    need(meaningful(review.reviewer) && Number.isFinite(Date.parse(review.reviewed_at)), 'source reviewer/date required');
    hashEntry(review.artifact,'source review artifact');
    try {need(review.binding_sha256===sourceBinding(plan),'source review binding stale; requirements/profile changed');}catch{errors.push('source review binding invalid');}
  }
  const sourceIds = new Set();
  for (let s of arr(plan.sources,'sources')) {
    s = obj(s,'source'); need(meaningful(s.id) && !sourceIds.has(s.id), 'duplicate/empty source id'); sourceIds.add(s.id);
    need(meaningful(s.title) && meaningful(s.version) && Number.isFinite(Date.parse(s.checked_at)), 'source metadata required');
    need((typeof s.url === 'string' && /^https:\/\//.test(s.url)) || meaningful(s.local_path), 'source location required');
    if (s.local_path) hashEntry({path:s.local_path,sha256:s.sha256},'local source');
  }
  const controls = arr(plan.controls,'controls'), ids = new Set();
  let expected=[];try {expected=expand(p.level);}catch(e){errors.push(e.message);}
  const expectedIds=new Set(expected.map(c=>c.id));
  const planning = gate === 'planning' || gate === 'delivery';
  if (planning) {
    need(p.government_project !== 'unknown' && p.level !== 'unknown', 'project/level confirmation required');
    need(meaningful(p.level_basis) && meaningful(p.system_scope), 'level basis/system scope required');
    need(review.status === 'complete', 'source review incomplete');
    need(p.policy_scope !== 'assess', 'policy scope unresolved');
    if (p.government_project === 'yes') {
      need(typeof ctx.custom_development === 'boolean', 'custom development context unresolved');
      if (ctx.custom_development) need(typeof ctx.core_system === 'boolean' && (ctx.core_system || Number.isFinite(ctx.contract_amount_twd)), 'independent testing context unresolved');
    }
  }
  for (let c of controls) {
    c = obj(c,'control'); const tag = c.id || 'control';
    need(meaningful(c.id) && !ids.has(c.id), 'duplicate/empty control id'); ids.add(c.id);
    need(meaningful(c.title),tag+' title required');
    const refs = arr(c.source_refs,tag+'.source_refs');
    need(refs.length > 0 && refs.every(r => r && sourceIds.has(r.source_id) && meaningful(r.locator)), tag+' invalid source reference');
    const base=catalog.clauses.find(x=>x.id===c.id);
    if(base) {
      need(expectedIds.has(c.id),tag+' outside selected level; use a PROJECT clause for contract additions');
      for(const key of ['parent_id','origin','requirement','condition','basis'])need(c[key]===base[key],tag+' catalog '+key+' mismatch');
      need(c.baseline_requirement===base.requirement,tag+' baseline mismatch');
      need(base.source_refs.every(r=>refs.some(x=>x?.source_id===r.source_id&&x.locator===r.locator)),tag+' clause source missing');
    } else {
      need(/^PROJECT-[A-Za-z0-9-]+$/.test(c.id),tag+' unknown clause ID; parent IDs cannot hold results');
      need(meaningful(c.requirement)&&meaningful(c.condition),tag+' project requirement/condition required');
    }
    need(['pending','applicable','not_applicable'].includes(c.applicability),tag+' invalid applicability');
    need(['planned','implemented','verified'].includes(c.progress),tag+' invalid progress');
    need(['pending','conformant','nonconformant','partial','not_applicable'].includes(c.conclusion),tag+' invalid conclusion');
    need(typeof c.external_required === 'boolean',tag+' external_required must be boolean');
    const nodes = arr(c.node_ids,tag+'.node_ids');
    if (nodeIds) need(nodes.every(id => nodeIds.includes(id)),tag+' unknown node');
    for (const key of ['evidence','input_files','exception_approval','external_evidence']) arr(c[key],tag+'.'+key).forEach(v => hashEntry(v,tag+'.'+key));
    const applicable = c.applicability === 'applicable', na = c.applicability === 'not_applicable';
    if (planning) {
      need(applicable || na,tag+' applicability pending');
      need(meaningful(c.rationale),tag+' rationale required');
      if (applicable) {
        need(['requirement','owner','measure','verification'].every(k => meaningful(c[k])),tag+' planning incomplete');
        if (nodeIds) need(nodes.length > 0,tag+' Node mapping required');
      }
    }
    if (na) {
      need(c.conclusion === 'not_applicable' && meaningful(c.rationale),tag+' N/A disposition required');
      need(c.evidence?.length > 0 || c.exception_approval?.length > 0,tag+' N/A supporting evidence required');
    } else need(c.conclusion !== 'not_applicable',tag+' contradictory N/A');
    if (c.conclusion === 'conformant' || (gate === 'delivery' && applicable)) {
      need(applicable && c.progress === 'verified' && c.conclusion === 'conformant',tag+' verified conformity required');
      need(c.evidence?.length > 0 && c.input_files?.length > 0,tag+' actual evidence and inputs required');
      if (c.external_required) need(c.external_evidence?.length > 0,tag+' external evidence required');
    }
    if(['conformant','not_applicable'].includes(c.conclusion))need(c.conclusion_binding_sha256===conclusionBinding(plan,c),tag+' conclusion binding stale; re-evaluate changed measures/evidence');
    if (c.id === 'OUT-04-C02' && p.government_project === 'yes' && ctx.custom_development && (ctx.core_system || p.level==='high' || ctx.contract_amount_twd >= 10000000)) {
      need(c.external_required,tag+' agency/independent testing required by context');
      if (planning) need(applicable,tag+' cannot bypass independent testing by N/A');
    }
  }
  for (const c of expected) need(ids.has(c.id),'missing required clause '+c.id);
  const formIds = new Set();
  for (let f of arr(plan.forms,'forms')) {
    f=obj(f,'form');need(meaningful(f.id)&&!formIds.has(f.id),'duplicate/empty form id');formIds.add(f.id);
    hashEntry(f.original,'original form');need(['csv','document'].includes(f.kind),'form kind required');
    const rows=arr(f.rows,'form rows'),rowIds=new Set(),mappings=arr(f.mappings,'form mappings'),cells=new Set();
    for(let row of rows){
      row=obj(row,'form row');need(meaningful(row.field)&&!rowIds.has(row.field),'duplicate/empty form row');rowIds.add(row.field);
      need(meaningful(row.source_text),'original row text required');
      need(['pending','mapped','excluded'].includes(row.disposition),'invalid row disposition');
      const groups=arr(row.scope_groups,'row.scope_groups'),required=arr(row.required_ids,'row.required_ids');
      need(groups.every(id=>catalog.groups.some(g=>g.id===id)),'unknown scope group');
      need(required.every(id=>ids.has(id)),'row requires unknown clause');
      if(planning)need(row.disposition!=='pending','form row coverage pending: '+row.field);
      if(row.disposition==='excluded')need(meaningful(row.reason),'excluded row reason required');
      if(row.disposition==='mapped') {
        const requiredIds=scopeIds(plan,row),mapped=[...new Set(mappings.filter(m=>m?.field===row.field).flatMap(m=>m.control_ids||[]))];
        need(requiredIds.length>0,'mapped row needs defined scope');
        need(requiredIds.every(id=>mapped.includes(id)) && mapped.every(id=>requiredIds.includes(id)),'incomplete row clause coverage: '+row.field);
      }
    }
    for(let m of mappings){
      m=obj(m,'mapping');const cell=JSON.stringify([m.field,m.column]);
      need(rowIds.has(m.field)&&meaningful(m.column)&&!cells.has(cell),'duplicate/unknown form mapping');cells.add(cell);
      need(rows.some(r=>r?.field===m.field&&r.disposition==='mapped'),'mapping row not mapped');
      need(Array.isArray(m.control_ids)&&m.control_ids.length>0&&m.control_ids.every(id=>ids.has(id)),'mapping unknown clause; parent IDs not accepted');
      const row=rows.find(r=>r?.field===m.field);
      if(row&&Array.isArray(m.control_ids)&&m.value_kind!=='evidence')need(scopeIds(plan,row).every(id=>m.control_ids.includes(id)),'result column misses required clauses');
      need(m.value_kind===undefined||['conclusion','statement','evidence'].includes(m.value_kind),'invalid value_kind');
    }
    if(f.kind==='csv')try{
      const table=loadCSV(root,f.original.path,f.key),actual=table.rows.map(row=>row[table.keyIndex]);
      need(table.header.includes(f.result_column)&&f.result_column!==f.key,'invalid result column');
      need(actual.length===rows.length&&actual.every(key=>rowIds.has(key)),'form inventory must include every original CSV row');
      for(const row of rows)need(row.source_text===JSON.stringify(table.rows.find(r=>r[table.keyIndex]===row.field)),'original row text mismatch');
      for(const m of mappings)need(table.header.includes(m?.column)&&m.column!==f.key,'mapping column missing or key protected');
      for(const row of rows.filter(r=>r?.disposition==='mapped'))need(mappings.some(m=>m?.field===row.field&&m.column===f.result_column&&['conclusion','statement'].includes(m.value_kind||'statement')),'result column mapping required');
    }catch(e){errors.push(e.message);}
    const coverage=obj(f.coverage,'form coverage');need(['pending','complete'].includes(coverage.status),'invalid coverage status');
    if(planning)need(coverage.status==='complete','form coverage review incomplete');
    if(coverage.status==='complete'){
      need(rows.length>0&&rows.every(r=>r?.disposition!=='pending'),'form coverage cannot complete with pending rows');
      need(meaningful(coverage.reviewer)&&Number.isFinite(Date.parse(coverage.reviewed_at)),'coverage reviewer/date required');
      hashEntry(coverage.artifact,'form coverage artifact');
      try{need(coverage.binding_sha256===formBinding(plan,f),'form coverage binding stale');}catch{errors.push('invalid form coverage binding');}
    }
  }
  if(plan.migration){
    hashEntry(plan.migration.original,'migration original');
    if(planning){
      need(Array.isArray(plan.migration.form_ids)&&plan.migration.form_ids.every(id=>formIds.has(id)),'migrated forms must be registered again');
      for(const m of arr(plan.migration.project_mappings,'migration project mappings'))need(Array.isArray(m?.target_ids)&&m.target_ids.length>0&&m.target_ids.every(id=>ids.has(id)),'legacy project requirement unresolved');
    }
  }
  errors.push(...validateExecution(root,plan,gate,{safe,digest,writeNew}));
  return [...new Set(errors)];
}
export function assertPlan(root, plan, gate = 'draft') { const e = validatePlan(root,plan,gate); if (e.length) throw Error(e.join('\n')); }
const label = {pending:'待確認',conformant:'符合',nonconformant:'不符合',partial:'部分符合',not_applicable:'不適用'};
export function render(plan) {
  const esc=v=>String(v??'').replace(/\|/g,'\\|').replace(/[\r\n]+/g,'<br>');
  const status={pending:'待確認',applicable:'適用',not_applicable:'不適用'};
  const basis=c=>origins[c.origin]+(c.origin==='context'||c.origin==='shared'||c.origin===plan.profile.level||plan.profile.level==='unknown'?'':'（由'+levels[c.origin]+'級納入）');
  const counts=Object.keys(origins).map(o=>origins[o]+' '+plan.controls.filter(c=>c.origin===o).length+' 項').join('；');
  const omitted=catalog.groups.filter(g=>g.id.startsWith('BASE')&&!plan.controls.some(c=>c.parent_id===g.id)).map(g=>g.title).join('、');
  return '# 資安要求逐款追蹤表（內部草稿）\n\n防護等級：'+levels[plan.profile.level]+'；本案來源與適用性：'+(plan.source_review.status==='complete'?'已覆核':'待確認')+'。本表不是機關驗收或第三方證明。\n\n'+counts+'。細項編號是內部識別碼，原條款定位另列。\n\n'+(omitted?'本等級原表未要求的構面：'+omitted+'；仍須盤點個案契約追加要求。\n\n':'')+'| 細項 ID | 等級來源 | 要求與條件 | 原條款 | 適用性／理由 | 本案補充要求 | 責任／開發節點 | 措施／驗證 | 結果 | 證據 |\n|---|---|---|---|---|---|---|---|---|---|\n'+plan.controls.map(c=>'|'+[c.id,basis(c),c.requirement+' '+c.condition,c.source_refs.map(s=>s.source_id+' '+s.locator).join('; '),status[c.applicability]+'／'+(c.rationale||'理由待確認'),c.project_requirement||'待盤點', (c.owner||'責任待指定')+'／'+(c.node_ids.join(', ')||'節點待指定'),(c.measure||'措施待規劃')+'／'+(c.verification||'驗證待規劃'),label[c.conclusion],c.evidence.map(e=>e.path).join('; ')||'待補'].map(esc).join('|')+'|').join('\n')+'\n\n## 表單覆蓋\n\n'+(plan.forms.length?plan.forms.map(f=>'- '+f.id+'：'+f.rows.filter(r=>r.disposition==='mapped').length+'/'+f.rows.length+' 列已對照；覆核'+(f.coverage.status==='complete'?'完成':'待處理')).join('\n'):'尚未匯入表單，不能宣稱已完成表單查核。')+'\n\n## 來源\n\n'+plan.sources.map(s=>'- '+s.id+'：'+s.title+'（'+s.version+'） '+(s.url||s.local_path)).join('\n')+'\n'+renderExecution(plan);
}
export function parseCSV(text) {
  text = text.replace(/^\uFEFF/,''); const rows = []; let row = [], cell = '', quoted = false, closed = false;
  for (let i=0;i<text.length;i++) {
    const ch=text[i];
    if (quoted) { if (ch==='"') { if(text[i+1]==='"'){cell+='"';i++;}else{quoted=false;closed=true;} }else cell+=ch; }
    else if (ch==='"') { if(cell || closed)throw Error('invalid CSV quote');quoted=true; }
    else if (ch===',' || ch==='\n' || ch==='\r') { row.push(cell);cell='';closed=false;if(ch!==','){rows.push(row);row=[];if(ch==='\r'&&text[i+1]==='\n')i++;} }
    else { if(closed)throw Error('invalid CSV trailing text');cell+=ch; }
  }
  if(quoted)throw Error('unterminated CSV quote');
  if(cell || closed || row.length)rows.push([...row,cell]);
  return rows;
}
export function loadCSV(root,file,key) {
  const table=parseCSV(fs.readFileSync(safe(root,file),'utf8')),header=table[0]||[],keyIndex=header.indexOf(key),rows=table.slice(1);
  if(keyIndex<0||new Set(header).size!==header.length)throw Error('missing key or duplicate headers');
  const keys=new Set();for(const row of rows){if(row.length!==header.length||!row[keyIndex]||keys.has(row[keyIndex]))throw Error('invalid width or duplicate/empty row key');keys.add(row[keyIndex]);}
  return {header,keyIndex,rows};
}
export function registerCSV(root,plan,{id,file,key,column}) {
  assertPlan(root,plan);if(plan.forms.some(f=>f.id===id))throw Error('form already registered');
  const table=loadCSV(root,file,key);if(!table.header.includes(column)||column===key)throw Error('invalid result column');
  const result=structuredClone(plan);
  result.forms.push({id,kind:'csv',original:{path:file,sha256:digest(safe(root,file))},key,result_column:column,
    rows:table.rows.map(row=>({field:row[table.keyIndex],source_text:JSON.stringify(row),disposition:'pending',scope_groups:[],required_ids:[],reason:''})),mappings:[],coverage:{status:'pending',reviewer:'',reviewed_at:'',artifact:null,binding_sha256:null}});
  return result;
}
export function fillCSV(root,plan,formId,key,mode='draft') {
  if(!['draft','final'].includes(mode))throw Error('invalid fill mode');
  assertPlan(root,plan,mode==='final'?'delivery':'draft');
  const form=plan.forms.find(f=>f.id===formId);if(!form||form.kind!=='csv'||form.key!==key)throw Error('unknown CSV form/key');
  const table=loadCSV(root,form.original.path,key),byKey=new Map(table.rows.map(row=>[row[table.keyIndex],row]));
  const resultIndex=table.header.indexOf(form.result_column);
  for(const row of form.rows)byKey.get(row.field)[resultIndex]=row.disposition==='excluded'?(mode==='final'?'不適用':'排除待覆核'):'待對照';
  for(const m of form.mappings){
    const row=byKey.get(m.field),column=table.header.indexOf(m.column),cs=m.control_ids.map(id=>plan.controls.find(c=>c.id===id));
    const reviewed=form.coverage.status==='complete'&&plan.source_review.status==='complete';
    const result=!reviewed?'待覆核':cs.every(c=>c.conclusion==='not_applicable')?'不適用':cs.every(c=>['conformant','not_applicable'].includes(c.conclusion))?'符合':cs.some(c=>c.conclusion==='nonconformant')?'不符合':cs.some(c=>c.conclusion==='partial')?'部分符合':'待確認';
    let value=m.value_kind==='conclusion'?result:m.value_kind==='evidence'?cs.flatMap(c=>c.evidence.map(e=>e.path)).join('; '):result+'；'+cs.map(c=>c.id+' '+(c.measure||'措施待補')+'；證據：'+(c.evidence.map(e=>e.path).join(', ')||'待補')).join(' / ');
    if(/^[\s]*[=+@-]/.test(value))value="'"+value;row[column]=value;
  }
  return '\uFEFF'+[table.header,...table.rows].map(row=>row.map(c=>'"'+c.replace(/"/g,'""')+'"').join(',')).join('\r\n')+'\r\n';
}
export function migrate(root,name) {
  const old=readPlan(root,name);if(old.schema_version!==1)throw Error('migrate accepts schema_version 1 only');
  const next=newPlan(old.profile?.level);next.profile=structuredClone(old.profile);
  for(const s of old.sources||[])if(!next.sources.some(x=>x.id===s.id))next.sources.push(s);
  next.migration={original:{path:name,sha256:digest(safe(root,name))},form_ids:(old.forms||[]).map(f=>f.id),project_mappings:(old.controls||[]).filter(c=>!catalog.groups.some(g=>g.id===c.id)).map(c=>({legacy_id:c.id,target_ids:[]})),note:'舊結論、措施、證據及表單映射留在原檔；逐款覆核後重新登錄，不自動轉為符合。'};
  return next;
}
