import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const arr=x=>Array.isArray(x)?x:[];
const idPattern=/^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export function validateResourceLayerLinks(resource){
 const g=resource.readerGuide;
 if(!g || g.mappingVersion!==1)return [];
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
  if(example.verificationStatus==='runtime-tested'&&(!example.verificationEvidence||resource.intakeReview?.verification?.status!=='verified'))add('runtime-tested example needs its own evidence and verified intake');
  for(const s of steps){
   refs(s.capabilityRefs,ci,'example step '+s.id,!s.externalDependency,true);
   if(s.externalDependency&&typeof s.externalDependency!=='string')add('external dependency must explain missing integration');
  }
 }
 for(const c of caps){
  if(!used.has(c.id)&&c.visibility!=='agent-only')add('orphan capability '+c.id+' (link or explicitly mark agent-only)');
  if(!arr(c.sourceFiles).length||!arr(c.symbols).length||!c.gate)add('capability '+c.id+' lacks source anchors or implementation boundaries');
  if(c.evidenceStatus!=='source-reviewed')add('capability '+c.id+' lacks supported source review');
  if(c.runtimeStatus!=='not-tested'&&!(c.runtimeStatus==='verified'&&c.runtimeEvidence&&resource.intakeReview?.verification?.status==='verified'))add('capability '+c.id+' invalid runtime claim');
 }
 if(!/^[a-f0-9]{40}$/.test(resource.source?.upstreamCommit||''))add('mapped repository requires pinned upstream commit');
 if(resource.repoGuide?.workflow?.readerExampleRef&&resource.repoGuide.workflow.readerExampleRef!==example?.id)add('workflow has dangling reader example');
 return errors;
}

export function resolveResourceLayerLinks(resource,query={}){
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
