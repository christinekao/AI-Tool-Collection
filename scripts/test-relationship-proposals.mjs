#!/usr/bin/env node
/**
 * Audit 02: proposals are review-only, never promotion to executable Workflow facts.
 * Read-only local regression, no external tools or network calls.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const review=read('docs/RELATIONSHIP_AUDIT02_PROPOSALS_20261123.json');
const list=x=>Array.isArray(x)?x:[];
const nonempty=x=>typeof x==='string'&&x.trim().length>=12;
const canonical={
 combinations:Object.fromEntries(review.reviewScope.map(id=>[id,read('data/combinations/'+id+'.json')])),
 workflows:Object.fromEntries(review.reviewScope.map(id=>[id,read('data/workflows/'+id+'.json')])),
 concepts:Object.fromEntries(fs.readdirSync('data/concepts').filter(n=>n.endsWith('.json')).map(n=>[n.slice(0,-5),true])),
 resources:Object.fromEntries(review.sources.map(s=>[s.resourceId,read('data/resources/'+s.resourceId+'.json')]))
};
export function checkProposals(data,records){
 const errors=[];
 const fail=(ok,msg)=>{if(!ok)errors.push(msg);};
 fail(data?.authority==='non-destructive-review-only','Review must never claim execution authority');
 fail(data?.independentExternalExecution==='not-tested','External runtime must remain NOT_TESTED');
 fail(data?.canonicalMutationsAuthorized===false&&data?.typedReferencePromotionAuthorized===false,'Cannot authorize canonical or Graph mutation');
 const stop=data?.releaseBoundary||{};
 for(const field of ['deleteAllowed','mergeAllowed','rewriteIdAllowed','updateCanonicalAllowed','createGraphEdgeAllowed','runExternalToolsAllowed'])fail(stop[field]===false,'Forbidden release power: '+field);
 fail(JSON.stringify(data.reviewScope)===JSON.stringify(['stack','system-1-system-2-agent-routing-stack']),'Scope changed');
 fail(list(data.pairs).length===2,'Expected two distinct audited pairs');
 const covered=new Set(),sourceRefs=new Set();
 for(const source of list(data.sources)){
  const res=records.resources[source.resourceId];sourceRefs.add('resource:'+source.resourceId);
  fail(Boolean(res),'Unknown source Resource: '+source.resourceId);
  if(!res)continue;
  fail(source.repoUrl===res.url||Boolean(res.repo&&source.repoUrl.toLowerCase().includes('/'+res.repo.toLowerCase())),'Source not traceable to Canonical Resource: '+source.resourceId);
  fail(source.documentationUrl?.startsWith('https://github.com/'),'Documentation must be an approved upstream GitHub reference: '+source.resourceId);
  fail(source.sourceLevel==='upstream-documentation-reviewed'&&source.integrationStatus==='not-tested','No source can claim runtime PASS: '+source.resourceId);
  fail(nonempty(source.verifiedClaim),'Missing source interpretation: '+source.resourceId);
 }
 for(const pair of list(data.pairs)){
  const c=records.combinations[pair.id],w=records.workflows[pair.id];
  fail(!covered.has(pair.id),'Duplicate pair: '+pair.id);covered.add(pair.id);
  fail(Boolean(c&&w),'Missing matching Canonical pair: '+pair.id);
  if(!c||!w)continue;
  fail(pair.combinationDecision==='retain-pending-independent-value','Combination may not be deleted or merged automatically: '+pair.id);
  fail(pair.workflowDecision==='strengthen-contract-candidate'||pair.workflowDecision==='safety-redesign-proposal','Invalid recommendation: '+pair.id);
  fail(nonempty(pair.independentCombinationValue)&&nonempty(pair.rehomeOption),'Missing value/rehome decision evidence: '+pair.id);
  fail(JSON.stringify(pair.members)===JSON.stringify(list(c.members).map(r=>r.id)),'Member list drift: '+pair.id);
  fail(JSON.stringify(pair.stageContracts.map(s=>s.stageId))===JSON.stringify(list(w.stages).map(s=>s.id)),'Stage IDs / ordering changed: '+pair.id);
  fail(list(pair.conceptCandidates).length>0,'Missing concept boundary candidates: '+pair.id);
  for(const candidate of list(pair.conceptCandidates)){
   fail(records.concepts[candidate.conceptId]===true,'Unknown candidate Concept: '+candidate.conceptId);
   fail(!list(w.conceptRefs).some(ref=>ref.id===candidate.conceptId),'A candidate has already been promoted: '+candidate.conceptId);
   fail(nonempty(candidate.basis),'Insufficient candidate evidence: '+candidate.conceptId);
  }
  for(const s of list(pair.stageContracts)){
   fail(s.status==='proposal-not-implemented','Stage contract must remain proposed: '+pair.id+'/'+s.stageId);
   for(const f of ['proposedInput','proposedOutput','proposedGate','onFailure'])fail(nonempty(s[f]),'Missing proposed '+f+': '+pair.id+'/'+s.stageId);
   fail(list(s.evidenceRefs).length>0,'Missing evidence for '+pair.id+'/'+s.stageId);
   for(const ref of list(s.evidenceRefs))fail(sourceRefs.has(ref),'Unknown evidence Resource '+ref);
  }
 }
 fail(covered.size===2,'Missing review pair');
 const routing=list(data.pairs).find(x=>x.id==='system-1-system-2-agent-routing-stack');
 const gate=routing?.stageContracts?.find(x=>x.stageId==='stage-2');
 fail(gate?.proposedGate?.includes('風險與權限檢查優先')&&gate.proposedGate.includes('held-out')&&gate.proposedGate.includes('answer_confidence'),'Missing risk-first calibrated confidence boundary');
 fail(gate?.onFailure?.includes('fail closed'),'Missing fail-closed escalation boundary');
 const stack=list(data.pairs).find(x=>x.id==='stack');
 const privacy=stack?.stageContracts?.find(x=>x.stageId==='stage-2');
 fail(privacy?.proposedGate?.includes('Enterprise Edition'),'Missing Onyx enterprise permission-sync edition restriction');
 return errors;
}

test('Two documented pairs, 7 upstream Resources and 9 proposed stage contracts match current Canonical',()=>{
 assert.deepEqual(checkProposals(review,canonical),[]);
 assert.equal(review.sources.length,7);
 assert.equal(review.pairs.reduce((n,x)=>n+x.stageContracts.length,0),9);
});
test('The proposal does not mutate original Canonical records',()=>{
 const before=JSON.stringify(canonical);
 assert.deepEqual(checkProposals(review,canonical),[]);
 assert.equal(JSON.stringify(canonical),before);
});
test('Regression: a fake implemented stage, unapproved destructive change, and unchecked source are rejected',()=>{
 const x=structuredClone(review);
 x.pairs[0].stageContracts[0].status='tested-in-production';
 x.releaseBoundary.deleteAllowed=true;
 x.sources[0].integrationStatus='tested';
 const errors=checkProposals(x,canonical);
 assert.ok(errors.some(s=>s.includes('Forbidden release power')));
 assert.ok(errors.some(s=>s.includes('must remain proposed')));
 assert.ok(errors.some(s=>s.includes('runtime PASS')));
});
test('Regression: uncalibrated high-risk routing, wrong stage and invented Concept link are rejected',()=>{
 const x=structuredClone(review);
 x.pairs[1].stageContracts[1].proposedGate='高信心自動發送';
 x.pairs[1].stageContracts[1].onFailure='繼續自動處理';
 x.pairs[1].stageContracts[0].stageId='unknown-stage';
 x.pairs[0].conceptCandidates[0].conceptId='made-up-link';
 const errors=checkProposals(x,canonical);
 assert.ok(errors.some(s=>s.includes('calibrated confidence')));
 assert.ok(errors.some(s=>s.includes('fail-closed')));
 assert.ok(errors.some(s=>s.includes('Stage IDs')));
 assert.ok(errors.some(s=>s.includes('Unknown candidate Concept')));
});
