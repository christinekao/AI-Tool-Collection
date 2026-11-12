/**
 * P1 Knowledge Graph: deterministic, read-only projection of V2 canonical records
 * plus curated Problem records. The graph is NOT a second source of truth.
 */
import fs from 'node:fs';
import path from 'node:path';

export const TYPES = Object.freeze({
  resources:'resource',skills:'skill',concepts:'concept',
  prompts:'prompt',combinations:'combination',workflows:'workflow'
});
const PLURAL=Object.fromEntries(Object.entries(TYPES).map(([many,one])=>[one,many]));
const RELATIONS={
  explained_by:['concept'],supported_by:['resource','skill'],
  guided_by:['workflow','prompt'],combined_in:['combination']
};
const clean=s=>String(s??'').trim();
const key=(type,id)=>type+':'+id;
const sort=(a,b)=>a.localeCompare(b,'en');
const snippet=(s,n=360)=>clean(s).replace(/\s+/g,' ').slice(0,n);

export function readProblems(folder='data/problems'){
 if(!fs.existsSync(folder))return [];
 return fs.readdirSync(folder).filter(name=>name.endsWith('.json')).sort().map(name=>{
  const doc=JSON.parse(fs.readFileSync(path.join(folder,name),'utf8'));
  if(doc.id+'.json'!==name)throw Error('Problem filename mismatch: '+name);
  return doc;
 });
}
export function buildKnowledgeGraph(catalog,problems=[]){
 if(catalog?.schemaVersion!==2)throw Error('Expected V2 catalog');
 if(!Array.isArray(problems))throw Error('Problem records must be an array');
 const nodes=[],nodeIndex=new Map(),recordIndex=new Map(),edges=[],edgeIndex=new Set();
 function node(obj){
  if(nodeIndex.has(obj.key))throw Error('Duplicate graph node '+obj.key);
  nodeIndex.set(obj.key,obj);nodes.push(obj);
 }
 for(const [plural,type] of Object.entries(TYPES)){
  if(!Array.isArray(catalog[plural]))throw Error('Missing catalog collection '+plural);
  for(const rec of catalog[plural]){
   if(rec.entityType!==type||!clean(rec.id)||!clean(rec.title))throw Error('Invalid '+plural+' record');
   const name=key(type,rec.id);
   recordIndex.set(name,rec);
   node({key:name,type,id:rec.id,title:rec.title,summary:snippet(rec.coreProblem||rec.problem||rec.goal||rec.purpose||rec.recommendation),
    tags:Array.isArray(rec.tags)?rec.tags.filter(t=>typeof t==='string'):[],
    searchText:snippet([rec.title,rec.canonicalName,rec.category,rec.resourceType,rec.purpose,rec.goal,rec.problem,rec.coreProblem,rec.recommendation,...(Array.isArray(rec.tags)?rec.tags:[]),...(Array.isArray(rec.useCases)?rec.useCases:[])].filter(v=>typeof v==='string').join(' '),1800),
    updatedAt:clean(rec.updatedAt),
    ...(clean(rec.url)?{url:rec.url}:{})});
  }
 }
 for(const p of problems){
  if(p.schemaVersion!==1||!clean(p.id)||!clean(p.title)||!clean(p.question)||!clean(p.description)||!clean(p.outcome))
   throw Error('Incomplete Problem record: '+(p.id||'<missing id>'));
  if(!Array.isArray(p.links)||!Array.isArray(p.relatedProblems)||!Array.isArray(p.tags))
   throw Error('Problem must contain links, relatedProblems and tags: '+p.id);
  node({key:key('problem',p.id),type:'problem',id:p.id,title:p.title,summary:snippet(p.description),question:p.question,outcome:p.outcome,tags:p.tags,searchText:snippet([p.title,p.question,p.description,p.outcome,...p.tags].join(' '),1800)});
 }
 function addEdge(edge){
  if(!nodeIndex.has(edge.from)||!nodeIndex.has(edge.to))throw Error('Dangling graph edge '+edge.from+' → '+edge.to+' at '+edge.via);
  const identity=[edge.from,edge.to,edge.relation,edge.via].join('|');
  if(edgeIndex.has(identity))throw Error('Repeated edge '+identity);
  edgeIndex.add(identity);edges.push(edge);
 }
 function discoverRefs(value,source,via){
  if(Array.isArray(value))return value.forEach((v,i)=>discoverRefs(v,source,via+'['+i+']'));
  if(!value||typeof value!=='object')return;
  if(typeof value.type==='string'&&PLURAL[value.type]&&typeof value.id==='string'){
   addEdge({from:source,to:key(value.type,value.id),relation:'declared_reference',kind:'canonical',via});
   return;
  }
  for(const [field,v] of Object.entries(value))discoverRefs(v,source,via?via+'.'+field:field);
 }
 for(const [name,rec] of recordIndex)discoverRefs(rec,name,'');
 for(const p of problems){
  const source=key('problem',p.id),seen=new Set();
  p.links.forEach((ref,i)=>{
   if(!ref||!PLURAL[ref.type]||!RELATIONS[ref.relation]?.includes(ref.type)||!clean(ref.id)||!clean(ref.why)||!clean(ref.evidenceField))
    throw Error('Invalid curated link: '+p.id+'['+i+']');
   const record=recordIndex.get(key(ref.type,ref.id));
   if(!record)throw Error('Curated link references unknown node: '+ref.type+':'+ref.id);
   if(!clean(record[ref.evidenceField]))throw Error('Missing cited record field '+ref.type+':'+ref.id+'/'+ref.evidenceField);
   const id=key(ref.type,ref.id);
   if(seen.has(id))throw Error('Duplicate curated target '+p.id+' → '+id);
   seen.add(id);
   addEdge({from:source,to:id,relation:ref.relation,kind:'curated',why:ref.why,via:'links['+i+']',evidenceField:ref.evidenceField});
  });
  p.relatedProblems.forEach((ref,i)=>{
   if(!ref||!clean(ref.id)||!clean(ref.why)||ref.id===p.id)
    throw Error('Invalid Problem relationship: '+p.id);
   addEdge({from:source,to:key('problem',ref.id),relation:'has_subproblem',kind:'curated',why:ref.why,via:'relatedProblems['+i+']'});
  });
 }
 nodes.sort((a,b)=>sort(a.key,b.key));
 edges.sort((a,b)=>sort(a.from,b.from)||sort(a.to,b.to)||sort(a.relation,b.relation)||sort(a.via,b.via));
 return {
  schemaVersion:1,sourceSchemaVersion:2,
  counts:{nodes:nodes.length,problems:problems.length,canonicalEdges:edges.filter(x=>x.kind==='canonical').length,curatedEdges:edges.filter(x=>x.kind==='curated').length},
  nodes,edges
 };
}
