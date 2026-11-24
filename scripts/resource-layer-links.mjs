import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const arr=x=>Array.isArray(x)?x:[];
const idPattern=/^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const meaningful=v=>typeof v==='string'&&v.trim().length>=12;
const fieldValue=(x,p)=>p.split('.').reduce((v,k)=>v?.[k],x);
const present=v=>v!==undefined&&v!==null&&v!==''&&(!Array.isArray(v)||v.length>0);
const codeFormats=new Set(['repository','library']);
export function validateResourceLayerLinks(resource){
 const g=resource.readerGuide;
 if(!g)return [];
 if(g.mappingVersion===2)return validateEvidenceLinks(resource);
 if(g.mappingVersion!==1)return g.mappingVersion===undefined?[]:[resource.id+': unsupported mappingVersion'];
 const errors=[],prefix=resource.id+': ';
 const add=s=>errors.push(prefix+s);
 const caps=arr(resource.repoGuide?.capabilities);
 const cases=arr(g.useCases),example=g.example,steps=arr(example?.steps);
 function index(items,label){
  const map=new Map();
  for(const x of items){
   if(!idPattern.test(x?.id||'')){add(label+' requires a stable local ID');continue;}
   if(map.has(x.id))add('duplicate '+label+' '+x.id);
   map.set(x.id,x);
  }
  return map;
 }
 const ci=index(caps,'capability'),ui=index(cases,'use case');
 index(steps,'example step');
 const used=new Set();
 function refs(value,target,label,required=true,track=false){
  if(!Array.isArray(value)||required&&!value.length){add(label+' requires references');return;}
  if(new Set(value).size!==value.length)add(label+' contains duplicate references');
  for(const r of value){
   if(!target.has(r))add(label+' dangling reference '+r);
   else if(track)used.add(r);
  }
 }
 if(!cases.length)add('mapped readerGuide needs at least one use case');
 for(const c of cases)refs(c.capabilityRefs,ci,'use case '+c.id,true,true);
 if(example){
  if(!idPattern.test(example.id||''))add('example requires stable local ID');
  refs(example.useCaseRefs,ui,'example '+example.id+' use cases');
  if(!steps.length)add('example requires mapped steps');
  if(!['design-only','runtime-tested'].includes(example.verificationStatus))add('example must disclose verification status');
  if(example.verificationStatus==='runtime-tested'&&(!example.verificationEvidence||resource.intakeReview?.verification?.status!=='tested'))add('runtime-tested example needs its own evidence and verified intake');
  for(const s of steps){
   refs(s.capabilityRefs,ci,'example step '+s.id,!s.externalDependency,true);
   if(s.externalDependency&&typeof s.externalDependency!=='string')add('external dependency must explain missing integration');
  }
 }
 for(const c of caps){
  if(!used.has(c.id)&&c.visibility!=='agent-only')add('orphan capability '+c.id+' (link or explicitly mark agent-only)');
  if(!arr(c.sourceFiles).length||!arr(c.symbols).length||!c.gate)add('capability '+c.id+' lacks source anchors or implementation boundaries');
  if(c.evidenceStatus!=='source-reviewed')add('capability '+c.id+' lacks supported source review');
  if(c.runtimeStatus!=='not-tested'&&!(c.runtimeStatus==='verified'&&c.runtimeEvidence&&resource.intakeReview?.verification?.status==='tested'))add('capability '+c.id+' invalid runtime claim');
 }
 if(!/^[a-f0-9]{40}$/.test(resource.source?.upstreamCommit||''))add('mapped repository requires pinned upstream commit');
 if(resource.repoGuide?.workflow?.readerExampleRef&&resource.repoGuide.workflow.readerExampleRef!==example?.id)add('workflow has dangling reader example');
 return errors;
}


/** For products, collections, learning materials, datasets and partial source review.
 * Stable local IDs reference actual existing canonical knowledge, not invented code symbols.
 */
export function validateEvidenceLinks(resource){
 const g=resource.readerGuide||{},units=arr(resource.agentEvidence),errors=[],add=m=>errors.push(resource.id+': '+m);
 const ids=new Set(),caseIds=new Set(),used=new Set(),stepIds=new Set();
 for(const u of units){
  if(!idPattern.test(u?.id||'')||ids.has(u.id))add('missing or duplicate evidence unit ID');else ids.add(u.id);
  if(!meaningful(u.detail)||!meaningful(u.locator)||!meaningful(u.limitations))add('evidence unit '+u.id+' requires detail, source locator and limits');
  if(!arr(u.evidenceFields).length)add('evidence unit '+u.id+' requires evidenceFields');
  for(const p of arr(u.evidenceFields)){
   if(typeof p!=='string'||!/^(features|requirements|limitations|learningGuide|implementationKnowledge|repoGuide|notes|source)(\.|$)/.test(p)||!present(fieldValue(resource,p)))add('evidence unit '+u.id+' invalid evidence field '+p);
  }
  if(!['source-reviewed','provided-material','partial'].includes(u.evidenceStatus))add('evidence unit '+u.id+' invalid evidence status');
  const sourceStatus=resource.intakeReview?.sourceStatus;
  if((u.evidenceStatus==='source-reviewed'&&sourceStatus!=='source-checked')||(u.evidenceStatus==='provided-material'&&sourceStatus!=='provided-material'))add('evidence unit '+u.id+' source status mismatch');
  if(u.runtimeStatus!=='not-tested'&&!(u.runtimeStatus==='verified'&&meaningful(u.runtimeEvidence)&&resource.intakeReview?.verification?.status==='tested'))add('evidence unit '+u.id+' invalid runtime claim');
 }
 function links(refs,label,required=true){
  if(!Array.isArray(refs)||required&&!refs.length){add(label+' requires evidenceRefs');return;}
  if(new Set(refs).size!==refs.length)add(label+' contains duplicate references');
  for(const ref of refs){if(!ids.has(ref))add(label+' dangling evidence reference '+ref);else used.add(ref);}
 }
 if(!units.length)add('evidence mapping requires agentEvidence');
 for(const c of arr(g.useCases)){
  if(!idPattern.test(c?.id||'')||caseIds.has(c.id))add('missing or duplicate use case ID');else caseIds.add(c.id);
  links(c.evidenceRefs,'use case '+c.id);
 }
 if(g.example){
  const e=g.example;
  if(!idPattern.test(e.id||'')||!arr(e.useCaseRefs).length||arr(e.useCaseRefs).some(id=>!caseIds.has(id)))add('example requires stable ID and valid useCaseRefs');
  if(!['design-only','runtime-tested'].includes(e.verificationStatus))add('example must disclose verification status');
  if(e.verificationStatus==='runtime-tested'&&(!meaningful(e.verificationEvidence)||resource.intakeReview?.verification?.status!=='tested'))add('runtime-tested example needs its own evidence and tested intake');
  if(!arr(e.steps).length)add('example requires mapped steps');
  for(const step of arr(e.steps)){
   if(!idPattern.test(step?.id||'')||stepIds.has(step.id))add('missing or duplicate example step ID');else stepIds.add(step.id);
   if(step.externalDependency&&!meaningful(step.externalDependency))add('external dependency must explain missing integration');
   links(step.evidenceRefs,'example step '+step.id,!meaningful(step.externalDependency));
  }
 }
 for(const u of units)if(!used.has(u.id)&&u.visibility!=='agent-only')add('orphan evidence unit '+u.id);
 return errors;
}

/** Mandatory for new/substantively edited Resources; legacy untouched records are exempt. */
export function validateResourceIntakeLayers(resource,previous=null){
 const r=resource.intakeReview||{},g=resource.readerGuide||{},review=r.layerReview||{},errors=[],add=m=>errors.push('layerReview: '+m);
 if(!['mapped','evidence-linked','deferred'].includes(review.status))add('required status mapped / evidence-linked / deferred');
 if(!meaningful(review.reason))add('requires meaningful reason');
 if(!meaningful(resource.purpose)||!meaningful(resource.recommendation))add('requires human-readable purpose and recommendation');
 if(!arr(g.useCases).length||arr(g.useCases).some(c=>!c.title||!meaningful(c.detail)))add('requires concrete readerGuide.useCases');
 if(!arr(g.start).length||arr(g.start).some(s=>!meaningful(s))||!arr(g.limits).length||arr(g.limits).some(s=>!meaningful(s)))add('requires readerGuide.start and limits');
 if(g.example&&(!g.example.title||!meaningful(g.example.input)||!meaningful(g.example.process)||!present(g.example.output)||!meaningful(g.example.destination)||!meaningful(g.example.note)))add('example requires input, process, output, destination and explicit note');
 const code=codeFormats.has(resource.classification?.contentFormat)||r.readingSpec?.id==='repo';
 if(review.status==='mapped'){
  if(g.mappingVersion!==1)add('mapped requires mappingVersion 1');
  if(!g.example)add('mapped code resource requires practical example');
  if(r.readingSpec?.id!=='repo'||r.readingSpec?.status!=='applied')add('mapped requires applied repo reading spec');
  if(r.sourceStatus!=='source-checked')add('mapped requires source-checked');
 }else if(review.status==='evidence-linked'){
  if(g.mappingVersion!==2)add('evidence-linked requires mappingVersion 2');
  if(code)add('repository/library must be mapped or explicitly deferred');
  if(r.sourceStatus==='partial')add('partial source must be deferred');
 }else if(review.status==='deferred'){
  if(g.mappingVersion!==2)add('deferred requires evidence mappingVersion 2 for known claims');
  if(!meaningful(review.gap)||!meaningful(review.nextAction))add('deferred requires specific gap and nextAction');
  if(r.sourceStatus!=='partial'&&!(code&&r.readingSpec?.status==='deferred'))add('deferred requires partial source or deferred code reading spec');
  if(code&&r.readingSpec?.status==='applied')add('applied repo guide cannot defer mapping');
 }
 if(previous?.readerGuide?.mappingVersion===1&&g.mappingVersion!==1)add('cannot remove or downgrade existing mapped repo');
 if(previous?.readerGuide?.mappingVersion===2&&![1,2].includes(g.mappingVersion))add('cannot remove existing evidence mapping');
 if(previous?.readerGuide?.mappingVersion===1&&g.mappingVersion===1){
  const before=arr(previous.repoGuide?.capabilities),after=new Set(arr(resource.repoGuide?.capabilities).map(c=>c.id));
  for(const c of before)if(!after.has(c.id))add('cannot silently remove existing capability '+c.id);
 }
 return [...errors,...validateResourceLayerLinks(resource)];
}

export function resolveEvidenceLinks(resource,query={}){
 const errors=validateEvidenceLinks(resource);if(errors.length)throw new Error(errors.join('\n'));
 const g=resource.readerGuide,units=arr(resource.agentEvidence),cases=arr(g.useCases);
 if(query.caseId&&!cases.some(c=>c.id===query.caseId))throw new Error('Unknown use case '+query.caseId);
 if(query.capabilityId&&!units.some(u=>u.id===query.capabilityId))throw new Error('Unknown evidence unit '+query.capabilityId);
 const selected=cases.filter(c=>(!query.caseId||c.id===query.caseId)&&(!query.capabilityId||c.evidenceRefs.includes(query.capabilityId)));
 const example=g.example&&arr(g.example.useCaseRefs).some(id=>selected.some(c=>c.id===id))?g.example:null;
 const steps=arr(example?.steps);
 const wanted=new Set(query.capabilityId?[query.capabilityId]:[...selected.flatMap(c=>c.evidenceRefs),...steps.flatMap(s=>s.evidenceRefs)]);
 return {resourceId:resource.id,useCases:selected,example:example?{...example,steps:query.capabilityId?steps.filter(s=>s.evidenceRefs.includes(query.capabilityId)):steps}:null,
  evidence:units.filter(u=>wanted.has(u.id)).map(u=>({...u,fields:Object.fromEntries(u.evidenceFields.map(p=>[p,fieldValue(resource,p)])),useCaseIds:cases.filter(c=>c.evidenceRefs.includes(u.id)).map(c=>c.id),exampleStepIds:arr(g.example?.steps).filter(s=>s.evidenceRefs.includes(u.id)).map(s=>s.id)})),
  source:resource.source,sourceEvidenceFields:resource.intakeReview?.sourceEvidenceFields,layerReview:resource.intakeReview?.layerReview,verification:resource.intakeReview?.verification};
}

export function resolveResourceLayerLinks(resource,query={}){
 if(resource.readerGuide?.mappingVersion===2)return resolveEvidenceLinks(resource,query);
 const errors=validateResourceLayerLinks(resource);
 if(errors.length)throw new Error(errors.join('\n'));
 const g=resource.readerGuide;
 if(g?.mappingVersion!==1)throw new Error('Resource has no mapped reader guide: '+resource.id);
 const cases=arr(g.useCases),caps=arr(resource.repoGuide?.capabilities),example=g.example;
 let selected=cases;
 if(query.caseId){selected=cases.filter(c=>c.id===query.caseId);if(!selected.length)throw new Error('Unknown use case '+query.caseId);}
 if(query.capabilityId){
  if(!caps.some(c=>c.id===query.capabilityId))throw new Error('Unknown capability '+query.capabilityId);
  selected=selected.filter(c=>c.capabilityRefs.includes(query.capabilityId));
 }
 const relevantExample=example&&arr(example.useCaseRefs).some(id=>selected.some(c=>c.id===id));
 const steps=relevantExample?arr(example.steps):[];
 const relevantSteps=query.capabilityId?steps.filter(s=>s.capabilityRefs.includes(query.capabilityId)):steps;
 const wanted=new Set(query.capabilityId?[query.capabilityId]:[...selected.flatMap(c=>c.capabilityRefs),...relevantSteps.flatMap(s=>s.capabilityRefs)]);
 return {resourceId:resource.id,sourceCommit:resource.source.upstreamCommit,
  useCases:selected,example:relevantExample?{...example,steps:relevantSteps}:null,
  externalDependencies:steps.filter(s=>s.externalDependency).map(s=>({stepId:s.id,detail:s.externalDependency})),
  capabilities:caps.filter(c=>wanted.has(c.id)).map(c=>({...c,
   sourceUrls:c.sourceFiles.map(f=>'https://github.com/'+resource.repo+'/blob/'+resource.source.upstreamCommit+'/'+f),
   useCaseIds:cases.filter(u=>u.capabilityRefs.includes(c.id)).map(u=>u.id),
   exampleStepIds:arr(example?.steps).filter(s=>s.capabilityRefs.includes(c.id)).map(s=>s.id)
  })),
  verification:resource.intakeReview?.verification,implementationGaps:resource.repoGuide?.rebuild?.gaps||[]
 };
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{
  const [id,flag,value,...rest]=process.argv.slice(2);
  if(!idPattern.test(id||'')||rest.length||(flag&&!['--case','--capability'].includes(flag))||(flag&&!value))throw new Error('Usage: node scripts/resource-layer-links.mjs RESOURCE_ID [--case CASE_ID | --capability CAPABILITY_ID]');
  const d=JSON.parse(fs.readFileSync('data/resources/'+id+'.json','utf8'));
  console.log(JSON.stringify(resolveResourceLayerLinks(d,flag==='--case'?{caseId:value}:flag==='--capability'?{capabilityId:value}:{}),null,2));
 }catch(e){console.error(e.message);process.exitCode=1;}
}
