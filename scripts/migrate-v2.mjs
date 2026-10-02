import fs from 'node:fs';
import path from 'node:path';

const ROOT=process.cwd(), TODAY='2026-10-02';
const read=(p)=>fs.existsSync(p)?JSON.parse(fs.readFileSync(p,'utf8')):[];
const slug=(s='')=>s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,100)||'item';
const uniq=(a=[])=>[...new Set(a.filter(Boolean))];
const write=(dir,id,obj)=>{fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,`${id}.json`),JSON.stringify(obj,null,2)+'\n')};
const cleanDir=(d)=>{fs.rmSync(d,{recursive:true,force:true});fs.mkdirSync(d,{recursive:true})};
const merge=(a,b)=>{const out={...a};for(const [k,v] of Object.entries(b||{})){if(v===undefined||v===null||v==='')continue;if(Array.isArray(v))out[k]=uniq([...(Array.isArray(out[k])?out[k]:[]),...v]);else out[k]=v}return out};

for(const d of ['data/resources','data/skills','data/concepts','data/prompts','data/combinations','data/workflows']) cleanDir(d);

// Resources: canonical aggregate -> updates -> intake -> standalone intake.
const resourceSources=[read('resources.json'),read('resources.updates.json'),read('resources.intake.json')];
const standalone=read('social-post-intake.json'); if(standalone?.resource) resourceSources.push([standalone.resource]);
const rmap=new Map();
const rkey=(r)=>String(r.repo||r.url||r.canonicalName||r.name||'').toLowerCase();
for(const src of resourceSources) for(const r of Array.isArray(src)?src:[]) { const k=rkey(r); if(!k)continue; rmap.set(k,merge(rmap.get(k)||{},r)); }
const used=new Set(); const ridByAlias=new Map(); const resources=[];
for(const r of rmap.values()){
 let id=slug(r.canonicalName||r.name||r.repo); let base=id,n=2; while(used.has(id))id=`${base}-${n++}`; used.add(id);
 const rec={schemaVersion:2,id,entityType:'resource',title:r.canonicalName||r.name||id,canonicalName:r.canonicalName||r.name||id,category:r.category||'Uncategorized',resourceType:r.type||'',purpose:r.purpose||'',recommendation:r.recommendation||'',url:r.url||'',repo:r.repo||'',notes:r.notes||'',status:r.status==='archived'?'archived':'active',addedAt:r.addedAt||TODAY,updatedAt:r.updatedAt||r.conceptReviewedAt||TODAY,tags:uniq(r.tags||[]),conceptRefs:uniq(r.concepts||[]).map(id=>({type:'concept',id}))};
 resources.push(rec); write('data/resources',id,rec);
 for(const a of [r.name,r.canonicalName,r.repo,r.url,id]) if(a) ridByAlias.set(String(a).toLowerCase(),id);
}

// Concepts: apply append patches without losing base fields.
const cmap=new Map();
for(const c of read('concepts.json')) cmap.set(c.id,{...c});
for(const p of read('concepts.intake.json')){
 if(!p.id)continue; const c=cmap.get(p.id)||{id:p.id,title:p.title||p.id,coreProblem:p.coreProblem||'',solutionMethods:[],examples:[],tags:[],addedAt:p.addedAt||TODAY};
 const next=merge(c,Object.fromEntries(Object.entries(p).filter(([k])=>!k.endsWith('Append'))));
 for(const [k,v] of Object.entries(p)) if(k.endsWith('Append')) { const base=k.slice(0,-6); next[base]=uniq([...(next[base]||[]),...(v||[])]); }
 cmap.set(p.id,next);
}
if(standalone?.concept) cmap.set(standalone.concept.id,merge(cmap.get(standalone.concept.id)||{},standalone.concept));
const concepts=[];
for(const c of cmap.values()) { const rec={schemaVersion:2,id:c.id,entityType:'concept',title:c.title||c.id,coreProblem:c.coreProblem||'',solutionMethods:uniq(c.solutionMethods||[]),tradeoffs:c.tradeoffs||[],signals:c.signals||[],antiPatterns:c.antiPatterns||[],examples:uniq(c.examples||[]),status:'active',addedAt:c.addedAt||TODAY,updatedAt:c.updatedAt||TODAY,tags:uniq(c.tags||[])}; concepts.push(rec); write('data/concepts',rec.id,rec); }
const conceptIds=new Set(concepts.map(x=>x.id));
for(const r of resources){r.conceptRefs=(r.conceptRefs||[]).filter(x=>conceptIds.has(x.id));write('data/resources',r.id,r)}

// Skills: only records explicitly described/category-tagged as skills.
const skills=[];
for(const r of resources){ if(!/skill/i.test(`${r.category} ${r.resourceType}`)) continue; const id=r.id; const rec={schemaVersion:2,id,entityType:'skill',title:r.title,purpose:r.purpose,problem:'',inputs:[],outputs:[],execution:'See source resource and its skill/protocol documentation.',resourceRefs:[{type:'resource',id:r.id}],conceptRefs:r.conceptRefs||[],status:'active',addedAt:r.addedAt,updatedAt:r.updatedAt,tags:uniq([...(r.tags||[]),'skill'])}; skills.push(rec); write('data/skills',id,rec); }

// Prompts.
const prompts=[];
for(const p of read('prompts.json')) { const id=p.id||slug(p.title); const refs=uniq(p.relatedTools||[]).map(x=>ridByAlias.get(String(x).toLowerCase())).filter(Boolean).map(id=>({type:'resource',id})); const rec={schemaVersion:2,id,entityType:'prompt',title:p.title||id,category:p.category||'',promptType:p.promptType||'',problem:p.problemSolved||'',goal:p.expectedOutput||'',prompt:p.promptContent||'',whenToUse:p.whenToUse||[],inputs:p.variables||[],expectedOutput:p.expectedOutput||'',resourceRefs:refs,source:{url:p.sourceUrl||'',type:p.sourceType||'',summary:p.sourceSummary||''},status:p.status||'active',addedAt:p.addedAt||TODAY,updatedAt:p.updatedAt||TODAY,tags:uniq(p.tags||[])}; prompts.push(rec); write('data/prompts',id,rec); }

// Combinations and first-class Workflows.
const comboSrc=[...read('combinations.json')]; if(standalone?.combination) comboSrc.push(standalone.combination);
const combinations=[],workflows=[]; const comboUsed=new Set();
for(const c of comboSrc){ let id=slug(c.name||c.title||c.goal); let b=id,n=2; while(comboUsed.has(id))id=`${b}-${n++}`;comboUsed.add(id);
 const resolved=uniq(c.components||[]).map(x=>({label:x,id:ridByAlias.get(String(x).toLowerCase())}));
 const members=resolved.filter(x=>x.id).map(x=>({type:'resource',id:x.id})); const unresolved=resolved.filter(x=>!x.id).map(x=>x.label);
 const cref=uniq(c.concepts||[]).filter(x=>conceptIds.has(x)).map(id=>({type:'concept',id}));
 const rec={schemaVersion:2,id,entityType:'combination',title:c.name||c.title||id,goal:c.goal||'',problem:c.problem||'',rationale:c.solutionStrategy||'',members,unresolvedMembers:unresolved,conceptRefs:cref,useCases:c.useCases||[],notes:c.notes||'',status:c.status||'pattern',addedAt:c.addedAt||TODAY,updatedAt:c.updatedAt||TODAY,tags:uniq(c.tags||[])}; combinations.push(rec); write('data/combinations',id,rec);
 const rawStages=Array.isArray(c.workflow)&&c.workflow.length?c.workflow:(c.flow||[]).map((x,i)=>({stage:`Stage ${i+1}`,purpose:x,tools:[]}));
 if(rawStages.length){ const wid=id; const stages=rawStages.map((s,i)=>({id:slug(s.stage||s.title||`stage-${i+1}`),title:s.stage||s.title||`Stage ${i+1}`,purpose:s.purpose||String(s),uses:uniq(s.tools||[]).map(x=>ridByAlias.get(String(x).toLowerCase())).filter(Boolean).map(id=>({type:'resource',id})),unresolvedUses:uniq(s.tools||[]).filter(x=>!ridByAlias.has(String(x).toLowerCase())),outputs:s.outputs||[],gate:s.gate||''})); const w={schemaVersion:2,id:wid,entityType:'workflow',title:c.name||c.title||id,goal:c.goal||'',problem:c.problem||'',solutionStrategy:c.solutionStrategy||'',stages,combinationRefs:[{type:'combination',id}],conceptRefs:cref,useCases:c.useCases||[],notes:c.notes||'',status:'active',addedAt:c.addedAt||TODAY,updatedAt:c.updatedAt||TODAY,tags:uniq([...(c.tags||[]),'workflow'])}; workflows.push(w); write('data/workflows',wid,w); rec.workflowRefs=[{type:'workflow',id:wid}]; write('data/combinations',id,rec); }
}

const manifest={schemaVersion:2,generatedAt:new Date().toISOString(),entities:{resources:resources.map(x=>x.id),skills:skills.map(x=>x.id),concepts:concepts.map(x=>x.id),prompts:prompts.map(x=>x.id),combinations:combinations.map(x=>x.id),workflows:workflows.map(x=>x.id)}};
fs.writeFileSync('data/manifest-v2.json',JSON.stringify(manifest,null,2)+'\n');
fs.writeFileSync('data/catalog-v2.json',JSON.stringify({schemaVersion:2,resources,skills,concepts,prompts,combinations,workflows},null,2)+'\n');
const report={schemaVersion:2,generatedAt:manifest.generatedAt,counts:{resources:resources.length,skills:skills.length,concepts:concepts.length,prompts:prompts.length,combinations:combinations.length,workflows:workflows.length},legacyCounts:{resources:read('resources.json').length,resourceUpdates:read('resources.updates.json').length,resourceIntake:read('resources.intake.json').length,concepts:read('concepts.json').length,conceptIntake:read('concepts.intake.json').length,combinations:read('combinations.json').length,prompts:read('prompts.json').length},unresolvedCombinationMembers:combinations.reduce((n,x)=>n+(x.unresolvedMembers?.length||0),0),danglingConceptRefs:resources.reduce((n,x)=>n+(x.conceptRefs||[]).filter(r=>!conceptIds.has(r.id)).length,0)};
fs.writeFileSync('MIGRATION_V2_REPORT.json',JSON.stringify(report,null,2)+'\n'); console.log(JSON.stringify(report,null,2));
