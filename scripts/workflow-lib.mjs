import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
export const roles = ['product-planner','flow-designer','system-architect','data-modeler','uiux-designer','frontend-developer','backend-developer','qa-tester','code-reviewer','docs-maintainer','release-manager'];
export const kinds = ['test','review','docs','build','lint','type','migration'];
export const meaningful = v => typeof v === 'string' && v.trim().length > 0 && !/^(TBD|TODO|待填|待確認|\.\.\.)$/i.test(v.trim());
export const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
export function safePath(root, p, exists = true) {
  if (typeof p !== 'string' || !p || /[\\\\:]/.test(p) || path.isAbsolute(p) || p.split('/').includes('..')) throw Error('unsafe path: '+p);
  const base = fs.realpathSync(root), target = path.resolve(base,p);
  if (!target.startsWith(base+path.sep)) throw Error('path outside root: '+p);
  let current = target;
  while (!fs.existsSync(current)) current = path.dirname(current);
  const resolved = fs.realpathSync(current);
  if (resolved !== base && !resolved.startsWith(base+path.sep)) throw Error('symlink outside root: '+p);
  if (exists && (!fs.existsSync(target) || !fs.statSync(target).isFile())) throw Error('file missing: '+p);
  return target;
}
export function readJson(root,p) { return JSON.parse(fs.readFileSync(safePath(root,p),'utf8')); }
export function requiredFiles(state,node,seen=new Set()) {
  if (seen.has(node.id)) return [];
  seen.add(node.id);
  const out = [state.feature.spec,node.spec,...node.evidence_files];
  for (const id of node.depends_on) {
    const dep = state.nodes.find(n=>n.id===id);
    if (!dep) throw Error('unknown dependency: '+id);
    out.push(...requiredFiles(state,dep,seen));
  }
  return [...new Set(out)].sort();
}
export function snapshot(root,files) { return [...new Set(files)].map(p=>({path:p,sha256:hash(safePath(root,p))})); }
export function validateState(root,state,{requireActive=false}={}) {
  const errors=[];
  const need = (ok,msg) => { if (!ok) errors.push(msg); };
  const list = (v,label) => { need(Array.isArray(v),label+' must be an array'); return Array.isArray(v)?v:[]; };
  const object = (v,label) => { need(v && typeof v==='object' && !Array.isArray(v),label+' must be an object'); return v && typeof v==='object' && !Array.isArray(v)?v:{}; };
  const file = p => { try {safePath(root,p);return true;} catch(e){errors.push(e.message);return false;} };
  state=object(state,'state');
  need(state.schema_version===1,'unsupported schema_version');
  need(['template','active'].includes(state.mode),'invalid mode');
  const nodes=list(state.nodes,'nodes'), questions=list(state.questions,'questions'), decisions=list(state.decisions,'decisions');
  const f=object(state.feature,'feature');
  need(['fast-track','full-loop'].includes(f.route),'invalid route');
  need(['low','medium','high'].includes(f.risk),'invalid risk');
  need(['draft','ready','in_progress','blocked','done'].includes(f.status),'invalid feature status');
  file(f.spec);
  const ac=list(f.acceptance_criteria,'acceptance_criteria'), stages=list(f.stages,'stages');
  const release=object(f.release,'release');
  need(['not_requested','ready','released','verified','archived'].includes(release.status),'invalid release status');
  if(state.mode==='template') {
    need(!requireActive,'template is not an active feature');
    need(nodes.length===0 && questions.length===0 && decisions.length===0 && ac.length===0 && stages.length===0,'template must be empty');
    need(f.id===null && f.status==='draft' && release.status==='not_requested' && release.record===null,'template cannot claim progress');
    return errors;
  }
  need(meaningful(f.id),'feature id required');
  need(f.route!=='fast-track' || f.risk==='low','fast-track requires low risk');
  const acIds=new Set();
  for (let a of ac) { a=object(a,'AC');need(meaningful(a.id)&&meaningful(a.description),'AC id/description required');need(!acIds.has(a.id),'duplicate AC '+a.id);acIds.add(a.id); }
  const stageIds=new Set();
  for (let s of stages) {
    s=object(s,'stage');need(/^(0[1-7])$/.test(s.id),'stage id must be 01..07');
    need(!stageIds.has(s.id),'duplicate stage '+s.id);stageIds.add(s.id);
    need(['applicable','complete','not_applicable'].includes(s.status),'invalid stage status');
    if(s.status==='not_applicable') {need(meaningful(s.reason),'stage N/A reason required');need(!['01','02','07'].includes(s.id),'input/planning/breakdown cannot be N/A');}
    if(s.status==='complete') file(s.artifact);
  }
  if(['ready','in_progress','done'].includes(f.status) || nodes.some(n=>['ready','in_progress','review_needed','done'].includes(n?.status))) {
    need(ac.length>0 && nodes.length>0,'execution requires AC and nodes');
    need(['01','02','03','04','05','06','07'].every(id=>stageIds.has(id)),'execution requires dispositions for stages 01..07');
    need(stages.every(s=>s && s.status!=='applicable'),'implementation design stages unfinished');
  }
  const ids=new Set();
  for(let n of nodes) {n=object(n,'node');need(meaningful(n.id),'node id required');need(!ids.has(n.id),'duplicate node '+n.id);ids.add(n.id);}
  for(let q of questions) {
    q=object(q,'question');
    need(meaningful(q.id)&&meaningful(q.question)&&meaningful(q.impact),'question id/text/impact required');
    need(typeof q.blocking==='boolean','question blocking must be boolean');
    need(['open','resolved'].includes(q.status),'invalid question status');
    list(q.node_ids,'question.node_ids').forEach(id=>need(ids.has(id),'question references unknown node '+id));
    list(q.sources_checked,'sources_checked');
    if(q.status==='resolved') need(meaningful(q.answer)&&meaningful(q.resolution_source),'resolved question requires answer and source');
  }
  for(let d of decisions) {d=object(d,'decision');need(['id','decision','reason','source'].every(k=>meaningful(d[k])),'decision requires id/decision/reason/source');}
  const visiting=new Set(),visited=new Set();
  const visit=id=>{
    if(visiting.has(id)){errors.push('dependency cycle: '+id);return;}
    if(visited.has(id))return;
    visiting.add(id);
    const n=nodes.find(x=>x?.id===id);
    for(const dep of (Array.isArray(n?.depends_on)?n.depends_on:[]))if(ids.has(dep))visit(dep);
    visiting.delete(id);visited.add(id);
  };
  nodes.forEach(n=>visit(n?.id));
  for(let n of nodes) {
    n=object(n,'node');
    const label=n.id||'node';
    need(meaningful(n.goal)&&meaningful(n.revision),label+' goal/revision required');
    need(roles.includes(n.owner),label+' invalid owner');
    need(['pending','ready','in_progress','blocked','review_needed','done'].includes(n.status),label+' invalid status');
    file(n.spec);
    const deps=list(n.depends_on,label+'.depends_on'), mapped=list(n.ac_ids,label+'.ac_ids');
    const allowed=list(n.allowed_files,label+'.allowed_files'), files=list(n.evidence_files,label+'.evidence_files');
    need(allowed.length>0,label+' allowed_files required');
    for(const p of allowed)try{safePath(root,p.replace(/\*.*$/,'' )||'.',false);}catch(e){errors.push(e.message);}
    files.forEach(file);
    need(mapped.length>0 && mapped.every(id=>acIds.has(id)),label+' must map valid AC');
    deps.forEach(id=>need(ids.has(id),label+' unknown dependency '+id));
    if(['ready','in_progress','review_needed','done'].includes(n.status)) {
      need(deps.every(id=>nodes.some(d=>d?.id===id&&d.status==='done')),label+' dependency not done');
      need(!questions.some(q=>q?.blocking&&q.status==='open'&&Array.isArray(q.node_ids)&&(q.node_ids.length===0||q.node_ids.includes(n.id))),label+' blocked by open question');
    }
    const checks=list(n.checks,label+'.checks'), checkIds=new Set();
    for(let c of checks) {
      c=object(c,'check');
      need(meaningful(c.id)&&!checkIds.has(c.id),label+' duplicate/empty check id');checkIds.add(c.id);
      need(kinds.includes(c.kind),label+' invalid check kind');
      need(['pass','fail','blocked','not_run','not_applicable'].includes(c.result),label+' invalid check result');
      if(c.result==='not_applicable') {
        need(!['test','review'].includes(c.kind),label+' test/review cannot be N/A');
        need(meaningful(c.reason),label+' N/A reason required');
      }
      if(n.status==='done')need(['pass','not_applicable'].includes(c.result),label+' unfinished check '+c.id);
      if(c.result==='pass' || c.evidence) {
        try {
          const e=object(readJson(root,c.evidence),'evidence');
          need(e.node_id===n.id && e.revision===n.revision && e.kind===c.kind && e.result===c.result,label+' evidence binding mismatch');
          need(Number.isFinite(Date.parse(e.created_at)),label+' evidence timestamp required');
          const eFiles=list(e.files,'evidence.files'), artifacts=list(e.artifacts,'evidence.artifacts');
          need(artifacts.length>0,label+' evidence artifact required');
          for (const entry of [...eFiles,...artifacts]) {
            const x=object(entry,'hash entry');
            if(file(x.path)) need(/^[a-f0-9]{64}$/.test(x.sha256)&&hash(safePath(root,x.path))===x.sha256,label+' stale evidence: '+x.path);
          }
          if(Array.isArray(n.evidence_files)&&Array.isArray(n.depends_on))for(const p of requiredFiles(state,n))need(eFiles.some(x=>x?.path===p),label+' evidence missing file: '+p);
          if(['test','build','lint','type','migration'].includes(c.kind)) {
            need(Array.isArray(e.command)&&e.command.length>0&&e.command.every(meaningful),label+' executed command required');
            need(Number.isInteger(e.exit_code),label+' exit_code required');
            if(c.result==='pass')need(e.exit_code===0,label+' failed command cannot pass');
          }
          if(c.kind==='test')need(mapped.every(id=>Array.isArray(e.ac_ids)&&e.ac_ids.includes(id)),label+' test evidence misses AC');
          if(c.kind==='review')need(['self-review','independent'].includes(e.reviewer_mode),label+' reviewer_mode required');
        } catch(e){errors.push(label+': '+e.message);}
      }
    }
    if(n.status==='done')need(['test','review','docs'].every(k=>checks.some(c=>c?.kind===k)),label+' missing test/review/docs gate');
  }
  if(['ready','in_progress','done'].includes(f.status))need(!questions.some(q=>q?.blocking&&q.status==='open'&&Array.isArray(q.node_ids)&&q.node_ids.length===0),'feature blocked by global question');
  if(f.status==='done') {
    need(nodes.length>0&&nodes.every(n=>n?.status==='done'),'feature done requires all nodes done');
    need(ac.every(a=>a && nodes.some(n=>n?.status==='done'&&Array.isArray(n.ac_ids)&&n.ac_ids.includes(a.id))),'feature AC not covered');
  }
  if(release.status==='not_requested')need(release.record===null,'not_requested release record must be null');
  else {
    need(f.status==='done','release requires feature done');
    try {
      const r=object(readJson(root,release.record),'release record');
      need(r.status===release.status,'release record status mismatch');
      need(['version','target','authorization_source'].every(k=>meaningful(r[k])),'release identity/authorization required');
      const deployment=list(r.deployment_evidence,'deployment_evidence'), verification=list(r.verification_evidence,'verification_evidence');
      for(const p of [...deployment,...verification])file(p);
      if(['released','verified','archived'].includes(release.status))need(deployment.length>0,'release has no deployment evidence');
      if(['verified','archived'].includes(release.status))need(verification.length>0,'release has no verification evidence');
    }catch(e){errors.push(e.message);}
  }
  return [...new Set(errors)];
}
