import fs from 'node:fs';
import crypto from 'node:crypto';
export const catalog = JSON.parse(fs.readFileSync(new URL('../assets/clauses.json',import.meta.url),'utf8'));
export const levels = {normal:'普',medium:'中',high:'高',unknown:'尚未確認'};
export const origins = {normal:'普級基礎',medium:'中級新增',high:'高級新增',shared:'共用要求',context:'個案條件候選'};
export function normalizeLevel(value) {
  const result=({普:'normal',中:'medium',高:'high',尚未確認:'unknown'})[value] || value;
  if(!Object.hasOwn(levels,result))throw Error('invalid level');return result;
}
export function expand(level) {
  level=normalizeLevel(level);
  if(level==='unknown')return structuredClone(catalog.clauses);
  return structuredClone(catalog.clauses.filter(c=>{
    if(c.origin==='context'||c.origin==='shared')return true;
    const group=catalog.groups.find(g=>g.id===c.parent_id), included=new Set(['shared']);
    const visit=x=>{if(included.has(x))return;included.add(x);for(const edge of group.inheritance||[])if(edge.at===x)visit(edge.from);};
    visit(level);return included.has(c.origin);
  }));
}
export const binding = value => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function sourceBinding(plan) {
  return binding({profile:plan.profile,sources:plan.sources,requirements:plan.controls.map(c=>({id:c.id,parent_id:c.parent_id,origin:c.origin,source_refs:c.source_refs,requirement:c.requirement,condition:c.condition,project_requirement:c.project_requirement,applicability:c.applicability,rationale:c.rationale})).sort((a,b)=>a.id.localeCompare(b.id))});
}
export function conclusionBinding(plan,c) {
  return binding({profile:plan.profile,sources:plan.sources,id:c.id,requirement:c.requirement,condition:c.condition,project_requirement:c.project_requirement,applicability:c.applicability,rationale:c.rationale,owner:c.owner,node_ids:c.node_ids,measure:c.measure,verification:c.verification,progress:c.progress,conclusion:c.conclusion,evidence:c.evidence,input_files:c.input_files,exception_approval:c.exception_approval,external_required:c.external_required,external_evidence:c.external_evidence});
}
export function formBinding(plan,form) {
  return binding({source:sourceBinding(plan),original:form.original,kind:form.kind,key:form.key,result_column:form.result_column,rows:form.rows,mappings:form.mappings});
}
export function scopeIds(plan,row) {
  return [...new Set([...(row.required_ids||[]),...plan.controls.filter(c=>(row.scope_groups||[]).includes(c.parent_id)).map(c=>c.id)])].sort();
}
