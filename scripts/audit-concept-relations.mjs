#!/usr/bin/env node
/** Read-only explicit Concept relation census. Counts recorded references, NOT semantic verification. */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildKnowledgeGraph} from './knowledge-graph-core.mjs';

const types=['resource','skill','concept','prompt','combination','workflow'];
const byId=(a,b)=>a<b?-1:a>b?1:0;
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export function loadConceptCensusCatalog(rootDir=root){
 const catalog={schemaVersion:2};
 for(const type of types){
  const dir=path.join(rootDir,'data',type+'s');
  catalog[type+'s']=fs.readdirSync(dir).filter(f=>f.endsWith('.json')).sort()
    .map(f=>JSON.parse(fs.readFileSync(path.join(dir,f),'utf8')));
 }
 return catalog;
}
export function auditConceptRelations(catalog){
 // Reuse the graph builder's canonical Typed Reference traversal and dangling-reference gate.
 // Problems, inferred/tag links and local capability/evidence IDs are deliberately excluded.
 const graph=buildKnowledgeGraph(catalog,[]);
 const relevant=graph.edges.filter(e=>e.kind==='canonical'&&(e.from.startsWith('concept:')||e.to.startsWith('concept:')));
 const typeOf=k=>k.split(':')[0];
 const idOf=k=>k.slice(k.indexOf(':')+1);
 const conceptKeys=catalog.concepts.map(x=>'concept:'+x.id);
 const resourceKeys=catalog.resources.map(x=>'resource:'+x.id);
 const pairs=new Map();
 for(const e of relevant){
  const key=JSON.stringify([e.from,e.to]);
  const pair=pairs.get(key)||{from:e.from,to:e.to,paths:[]};
  pair.paths.push(e.via);pairs.set(key,pair);
 }
 const all=[...pairs.values()];
 const incoming=new Map(conceptKeys.map(k=>[k,all.filter(p=>p.to===k)]));
 const outgoing=new Map(conceptKeys.map(k=>[k,all.filter(p=>p.from===k)]));
 const layerStatus=r=>r.intakeReview?.layerReview?.status||
  (r.intakeReview?.sourceStatus==='partial'&&!r.readerGuide?'source-blocked':'unclassified');
 const resourceRows=catalog.resources.map(r=>{
  const key='resource:'+r.id;
  const out=all.filter(p=>p.from===key&&typeOf(p.to)==='concept').map(p=>idOf(p.to)).sort(byId);
  const inc=all.filter(p=>p.to===key&&typeOf(p.from)==='concept').map(p=>idOf(p.from)).sort(byId);
  const union=[...new Set([...out,...inc])].sort(byId);
  return {id:r.id,layerStatus:layerStatus(r),outgoing:out,incoming:inc,distinctConcepts:union,
   linkState:out.length?(inc.length?'both-directions-present':'resource-declares-only'):(inc.length?'concept-cites-only':'no-recorded-direct-link'),
   sourceStatus:r.intakeReview?.sourceStatus||'unclassified',semanticStatus:'not-assessed-by-census'};
 }).sort((a,b)=>byId(a.id,b.id));
 const conceptRows=conceptKeys.map(key=>{
  const ins=incoming.get(key),outs=outgoing.get(key);
  const inbound=Object.fromEntries(types.map(t=>[t,ins.filter(p=>typeOf(p.from)===t).length]));
  const outbound=Object.fromEntries(types.map(t=>[t,outs.filter(p=>typeOf(p.to)===t).length]));
  const resources=[...new Set([...ins.filter(p=>typeOf(p.from)==='resource').map(p=>idOf(p.from)),...outs.filter(p=>typeOf(p.to)==='resource').map(p=>idOf(p.to))])].sort(byId);
  return {id:idOf(key),inbound,outbound,resourceIds:resources,semanticStatus:'not-assessed-by-census'};
 }).sort((a,b)=>byId(a.id,b.id));
 const directedResourcePairs=all.filter(p=>[typeOf(p.from),typeOf(p.to)].includes('resource'));
 const uniqueResourceConceptPairs=new Set(directedResourcePairs.map(p=>JSON.stringify([p.from,p.to].sort(byId))));
 const matrix=Object.fromEntries(types.map(t=>[t,{toConcept:all.filter(p=>typeOf(p.from)===t&&typeOf(p.to)==='concept').length,fromConcept:all.filter(p=>typeOf(p.from)==='concept'&&typeOf(p.to)===t).length}]));
 const statusCounts={};
 for(const r of resourceRows){const counts=statusCounts[r.layerStatus]||={total:0,withDirectLink:0,withoutDirectLink:0};counts.total++;counts[r.distinctConcepts.length?'withDirectLink':'withoutDirectLink']++;}
 const reciprocalResourceConceptPairs=directedResourcePairs.filter(p=>typeOf(p.from)==='resource'&&pairs.has(JSON.stringify([p.to,p.from]))).length;
 return {scope:Object.fromEntries(types.map(t=>[t+'s',catalog[t+'s'].length])),
  summary:{conceptRelatedReferenceOccurrences:relevant.length,distinctDirectedConceptPairs:all.length,
   resourceConceptDirectedPairs:directedResourcePairs.length,uniqueResourceConceptPairs:uniqueResourceConceptPairs.size,
   reciprocalResourceConceptPairs,resourcesWithOutgoingConceptRefs:resourceRows.filter(r=>r.outgoing.length).length,
   resourcesWithAnyDirectConceptLink:resourceRows.filter(r=>r.distinctConcepts.length).length,
   resourcesWithoutDirectConceptLink:resourceRows.filter(r=>!r.distinctConcepts.length).length,
   resourcesCitedOnlyByConcept:resourceRows.filter(r=>!r.outgoing.length&&r.incoming.length).length,
   conceptsWithoutResourceLink:conceptRows.filter(c=>!c.resourceIds.length).length,
   conceptsWithoutAnyCanonicalRelation:conceptRows.filter(c=>!all.some(p=>p.from==='concept:'+c.id||p.to==='concept:'+c.id)).length,
   resourceLayerStatusCounts:statusCounts,matrix},
  queues:{resourcesWithoutDirectConceptLink:resourceRows.filter(r=>!r.distinctConcepts.length).map(r=>r.id),
   conceptsWithoutResourceLink:conceptRows.filter(c=>!c.resourceIds.length).map(c=>c.id),
   deferredOrBlockedResources:resourceRows.filter(r=>['deferred','source-blocked'].includes(r.layerStatus)).map(r=>({id:r.id,layerStatus:r.layerStatus,distinctConcepts:r.distinctConcepts}))},
  resourceRows,conceptRows,paths:all,semanticVerification:'NOT_ASSESSED',action:'manual-review-only'};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const audit=auditConceptRelations(loadConceptCensusCatalog());
 console.log(JSON.stringify(process.argv.includes('--details')?audit:{scope:audit.scope,summary:audit.summary,queues:audit.queues,semanticVerification:audit.semanticVerification},null,2));
}
