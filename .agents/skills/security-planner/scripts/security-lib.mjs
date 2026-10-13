import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const assets = new URL('../assets/', import.meta.url);
export const catalog = JSON.parse(fs.readFileSync(new URL('baseline.json', assets), 'utf8'));
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
  level = ({高:'high', 中:'medium', 普:'normal', 尚未確認:'unknown'})[level] || level;
  if (!['high','medium','normal','unknown'].includes(level)) throw Error('invalid level');
  return {
    schema_version: 1, catalog_version: catalog.version,
    profile: {government_project:'yes', level, level_basis:'', policy_scope:'assess', system_scope:'', context:{custom_development:null, core_system:null, contract_amount_twd:null}},
    source_review: {status:'pending', reviewer:'', reviewed_at:'', artifact:null},
    sources: structuredClone(sources),
    controls: catalog.controls.map(c => ({id:c.id, title:c.title, source_refs:[{source_id:c.source_id, locator:c.locator}],
      baseline_requirement: level === 'unknown' ? null : c.levels[level], requirement: level === 'unknown' ? '' : c.levels[level],
      applicability:'pending', rationale:'', owner:'', node_ids:[], measure:'', verification:'', progress:'planned', conclusion:'pending',
      evidence:[], input_files:[], exception_approval:[], external_required:false, external_evidence:[]})), forms:[]
  };
}
export function validatePlan(root, plan, gate = 'draft', nodeIds) {
  const errors = [], need = (ok, msg) => { if (!ok) errors.push(msg); };
  const obj = (v, label) => { const ok = v && typeof v === 'object' && !Array.isArray(v); need(ok, label+' must be object'); return ok ? v : {}; };
  const arr = (v, label) => { need(Array.isArray(v), label+' must be array'); return Array.isArray(v) ? v : []; };
  const hashEntry = (v, label) => { v = obj(v,label); try { need(/^[a-f0-9]{64}$/.test(v.sha256) && digest(safe(root,v.path)) === v.sha256, label+' stale hash: '+v.path); } catch(e) { errors.push(label+': '+e.message); } };
  need(['draft','planning','delivery'].includes(gate), 'invalid gate');
  plan = obj(plan,'plan'); const p = obj(plan.profile,'profile'), ctx = obj(p.context,'context');
  need(plan.schema_version === 1, 'unsupported schema_version');
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
  }
  const sourceIds = new Set();
  for (let s of arr(plan.sources,'sources')) {
    s = obj(s,'source'); need(meaningful(s.id) && !sourceIds.has(s.id), 'duplicate/empty source id'); sourceIds.add(s.id);
    need(meaningful(s.title) && meaningful(s.version) && Number.isFinite(Date.parse(s.checked_at)), 'source metadata required');
    need((typeof s.url === 'string' && /^https:\/\//.test(s.url)) || meaningful(s.local_path), 'source location required');
    if (s.local_path) try {safe(root,s.local_path);} catch(e) {errors.push(e.message);}
  }
  const controls = arr(plan.controls,'controls'), ids = new Set();
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
    const base = catalog.controls.find(x => x.id === c.id);
    if (base) {
      const expected = p.level === 'unknown' ? null : base.levels[p.level];
      need(c.baseline_requirement === expected, tag+' level/baseline mismatch; regenerate and merge');
      need(refs.some(r => r?.source_id === base.source_id && r.locator === base.locator), tag+' baseline source missing');
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
    if (c.id === 'OUT-04' && p.government_project === 'yes' && ctx.custom_development && (ctx.core_system || ctx.contract_amount_twd >= 10000000)) {
      need(c.external_required,tag+' agency/independent testing required by context');
      if (planning) need(applicable,tag+' cannot bypass independent testing by N/A');
    }
  }
  for (const c of catalog.controls) need(ids.has(c.id),'missing catalog control '+c.id);
  const formIds = new Set();
  for (let f of arr(plan.forms,'forms')) {
    f = obj(f,'form'); need(meaningful(f.id) && !formIds.has(f.id),'duplicate/empty form id'); formIds.add(f.id);
    hashEntry(f.original,'original form'); const cells = new Set();
    for (let m of arr(f.mappings,'mappings')) {
      m = obj(m,'mapping'); const cell = JSON.stringify([m.field,m.column]);
      need(meaningful(m.field) && meaningful(m.column) && !cells.has(cell),'duplicate/empty form mapping'); cells.add(cell);
      need(Array.isArray(m.control_ids) && m.control_ids.length > 0 && m.control_ids.every(id => ids.has(id)),'mapping unknown control');
      need(m.value_kind === undefined || ['conclusion','statement','evidence'].includes(m.value_kind),'invalid value_kind');
    }
  }
  return [...new Set(errors)];
}
export function assertPlan(root, plan, gate = 'draft') { const e = validatePlan(root,plan,gate); if (e.length) throw Error(e.join('\n')); }
const label = {pending:'待確認',conformant:'符合',nonconformant:'不符合',partial:'部分符合',not_applicable:'不適用'};
export function render(plan) {
  const esc = v => String(v ?? '').replace(/\|/g,'\\|').replace(/[\r\n]+/g,'<br>');
  return '# 資安要求追蹤表（內部草稿）\n\n防護等級：'+plan.profile.level+'；來源覆核：'+plan.source_review.status+'。本表不是機關驗收或第三方證明。\n\n| ID | 要求 | 適用性 | 措施 | 查核結果 | 證據 |\n|---|---|---|---|---|---|\n'+plan.controls.map(c => '|'+[c.id,c.requirement || '該等級原列無要求或等級未定，仍須核對其他來源',c.applicability,c.measure,label[c.conclusion],c.evidence.map(x=>x.path).join('; ')].map(esc).join('|')+'|').join('\n')+'\n\n## 來源\n\n'+plan.sources.map(s=>'- '+esc(s.id)+'：'+esc(s.title)+'（'+esc(s.version)+'，查核 '+s.checked_at+'） '+(s.url || s.local_path)).join('\n')+'\n';
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
export function fillCSV(root, plan, formId, key) {
  assertPlan(root,plan);
  const form=plan.forms.find(f=>f.id===formId); if(!form)throw Error('unknown form');
  const rows=parseCSV(fs.readFileSync(safe(root,form.original.path),'utf8'));
  const header=rows[0] || [], keyIndex=header.indexOf(key);
  if(keyIndex<0 || new Set(header).size!==header.length)throw Error('missing key or duplicate headers');
  const byKey=new Map();
  for(const row of rows.slice(1)) { if(row.length!==header.length || !row[keyIndex] || byKey.has(row[keyIndex]))throw Error('invalid width or duplicate/empty row key');byKey.set(row[keyIndex],row); }
  for(const m of form.mappings) {
    const row=byKey.get(m.field), column=header.indexOf(m.column); if(!row || column<0 || column===keyIndex)throw Error('mapping row/column missing or key column protected');
    const cs=m.control_ids.map(id=>plan.controls.find(c=>c.id===id));
    const result=cs.every(c=>c.conclusion==='not_applicable')?'不適用':cs.every(c=>['conformant','not_applicable'].includes(c.conclusion))?'符合':cs.some(c=>c.conclusion==='nonconformant')?'不符合':'待確認';
    let value=m.value_kind==='conclusion'?result:m.value_kind==='evidence'?cs.flatMap(c=>c.evidence.map(e=>e.path)).join('; '):result+'；'+cs.map(c=>c.id+' '+(c.measure||'措施待補')+'；證據：'+(c.evidence.map(e=>e.path).join(', ')||'待補')).join(' / ');
    if(/^[\s]*[=+@-]/.test(value))value="'"+value;
    row[column]=value;
  }
  return '\uFEFF'+rows.map(row=>row.map(c=>'"'+c.replace(/"/g,'""')+'"').join(',')).join('\r\n')+'\r\n';
}
