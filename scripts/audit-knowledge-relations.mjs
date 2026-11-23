#!/usr/bin/env node
/**
 * Read-only Concept / Workflow / Combination relationship audit.
 * Risk signals are review queues, NOT authorization to delete/merge or create Typed References.
 * No network calls, generated files, mutations or tag-based inferred links.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const list=value=>Array.isArray(value)?value:[];
const nonempty=value=>typeof value==='string'&&value.trim().length>0;
const references=(record,field,type)=>list(record?.[field]).filter(r=>r?.type===type).map(r=>r.id);
const unique=values=>[...new Set(values)];

export function auditKnowledgeRelations({concepts,combinations,workflows}){
 const conceptIDs=new Set(concepts.map(x=>x.id));
 const workflowIDs=new Set(workflows.map(x=>x.id));
 const combinationIDs=new Set(combinations.map(x=>x.id));
 const byWorkflow=new Map(workflows.map(w=>[w.id,w]));
 const errors=[];
 const validate=(records,field,type,target)=>{
  for(const record of records){
   for(const ref of list(record[field])){
    if(ref?.type!==type||!target.has(ref.id))
     errors.push(record.entityType+':'+record.id+' '+field+' invalid target '+JSON.stringify(ref));
   }
  }
 };
 validate(combinations,'workflowRefs','workflow',workflowIDs);
 validate(combinations,'conceptRefs','concept',conceptIDs);
 validate(workflows,'combinationRefs','combination',combinationIDs);
 validate(workflows,'conceptRefs','concept',conceptIDs);
 const pairs=combinations.map(c=>{
  const w=byWorkflow.get(c.id);
  const selfWorkflowReference=references(c,'workflowRefs','workflow').includes(c.id);
  const reciprocal=Boolean(w)&&selfWorkflowReference&&references(w,'combinationRefs','combination').includes(c.id);
  const referencingWorkflows=workflows.filter(x=>references(x,'combinationRefs','combination').includes(c.id)).map(x=>x.id).sort();
  const externalWorkflowReuse=referencingWorkflows.filter(id=>id!==c.id);
  const stages=list(w?.stages);
  const rationale=nonempty(c.rationale);
  const memberCount=list(c.members).length;
  const multiMember=memberCount>=2;
  const alternatives=list(c.alternatives).length>0;
  const outputs=stages.filter(s=>list(s.outputs).length>0).length;
  const gates=stages.filter(s=>nonempty(s.gate)).length;
  const typedUses=stages.filter(s=>list(s.uses).length>0).length;
  const flags=[
   ...(!rationale?['missing-composition-rationale']:[]),
   ...(!multiMember?['fewer-than-two-typed-members']:[]),
   ...(!alternatives?['no-recorded-alternatives']:[]),
   ...(!externalWorkflowReuse.length?['no-recorded-cross-workflow-reuse']:[]),
   ...(!outputs&&!gates?['no-structured-stage-output-or-gate']:[])
  ];
  return {id:c.id,hasMatchingWorkflow:Boolean(w),sameTitle:Boolean(w)&&c.title===w.title,
   sameGoal:Boolean(w)&&c.goal===w.goal,reciprocal,memberCount,rationalePresent:rationale,
   alternativeCount:list(c.alternatives).length,conceptRefCount:references(c,'conceptRefs','concept').length,
   workflowConceptRefCount:references(w,'conceptRefs','concept').length,referencingWorkflows,
   externalWorkflowReuse,stageCount:stages.length,stagesWithTypedUses:typedUses,stagesWithOutputs:outputs,
   stagesWithGates:gates,reviewFlags:flags,action:'manual-review-only'};
 }).sort((a,b)=>a.id.localeCompare(b.id,'en'));
 const matchedIDs=new Set(pairs.filter(x=>x.hasMatchingWorkflow).map(x=>x.id));
 const independentWorkflows=workflows.filter(w=>!matchedIDs.has(w.id));
 return {
  scope:{concepts:concepts.length,combinations:combinations.length,workflows:workflows.length},
  summary:{
   matchedSameID:pairs.filter(x=>x.hasMatchingWorkflow).length,
   exactTitleAndGoal:pairs.filter(x=>x.sameTitle&&x.sameGoal).length,
   reciprocalPairs:pairs.filter(x=>x.reciprocal).length,
   withoutRationale:pairs.filter(x=>!x.rationalePresent).length,
   withRationaleButFewerThanTwoMembers:pairs.filter(x=>x.rationalePresent&&x.memberCount<2).length,
   withRationaleAndMultipleMembers:pairs.filter(x=>x.rationalePresent&&x.memberCount>=2).length,
   withoutAlternatives:pairs.filter(x=>!x.alternativeCount).length,
   withoutRecordedCrossWorkflowReuse:pairs.filter(x=>!x.externalWorkflowReuse.length).length,
   pairedWorkflowsWithoutStructuredOutputOrGate:pairs.filter(x=>x.hasMatchingWorkflow&&!x.stagesWithOutputs&&!x.stagesWithGates).length,
   independentWorkflows:independentWorkflows.length,
   independentWorkflowsWithStructuredOutputs:independentWorkflows.filter(w=>list(w.stages).some(s=>list(s.outputs).length)).length,
   workflowsWithConceptRefs:workflows.filter(w=>references(w,'conceptRefs','concept').length>0).length,
   combinationsWithConceptRefs:combinations.filter(c=>references(c,'conceptRefs','concept').length>0).length
  },
  integrityErrors:unique(errors),
  pairs
 };
}

export function loadCanonical(rootDir=root){
 const read=plural=>fs.readdirSync(path.join(rootDir,'data',plural))
   .filter(name=>name.endsWith('.json')).sort()
   .map(name=>JSON.parse(fs.readFileSync(path.join(rootDir,'data',plural,name),'utf8')));
 return {concepts:read('concepts'),combinations:read('combinations'),workflows:read('workflows')};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const audit=auditKnowledgeRelations(loadCanonical());
 console.log(JSON.stringify(audit,null,2));
 if(audit.integrityErrors.length){process.exitCode=1;}
}
