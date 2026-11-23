#!/usr/bin/env node
import test from 'node:test';
import assert from 'node:assert/strict';
import {auditKnowledgeRelations,loadCanonical} from './audit-knowledge-relations.mjs';
const original=loadCanonical();

test('Audit is read-only, complete and never equates duplicate signals with deletion approval',()=>{
 const result=auditKnowledgeRelations(original);
 assert.deepEqual(result.scope,{concepts:68,combinations:17,workflows:36});
 assert.deepEqual(result.integrityErrors,[]);
 assert.equal(result.summary.matchedSameID,17);
 assert.equal(result.summary.reciprocalPairs,17);
 assert.equal(result.pairs.length,17);
 assert.ok(result.pairs.every(p=>p.action==='manual-review-only'));
 assert.ok(result.pairs.every(p=>p.reviewFlags.every(f=>typeof f==='string')));
});

test('Rationale, composition, reuse and stage evidence are distinct decision fields',()=>{
 const result=auditKnowledgeRelations(original);
 assert.equal(result.summary.withoutRationale,14);
 assert.equal(result.summary.withRationaleButFewerThanTwoMembers,3);
 assert.equal(result.summary.withRationaleAndMultipleMembers,0);
 assert.equal(result.summary.withoutRecordedCrossWorkflowReuse,17);
 assert.equal(result.summary.withoutAlternatives,17);
 assert.equal(result.summary.independentWorkflows,19);
 const withRationale=result.pairs.filter(p=>p.rationalePresent).map(p=>p.id).sort();
 assert.deepEqual(withRationale,['goal-build-evidence-learning-loop','local-pii-ai-processing-loop','voice-publish-evidence-social-content-loop']);
 assert.ok(result.pairs.find(p=>p.id==='cross-agent-continuity-stack').stagesWithOutputs>0);
});

test('Audit never infers formal Concept links from titles, domains or tags',()=>{
 const records=structuredClone(original);
 const before=JSON.stringify(records);
 const result=auditKnowledgeRelations(records);
 assert.equal(JSON.stringify(records),before,'audit must not mutate any record');
 assert.ok(result.pairs.find(p=>p.id==='system-1-system-2-agent-routing-stack').conceptRefCount===0);
 assert.ok(result.pairs.find(p=>p.id==='goal-build-evidence-learning-loop').conceptRefCount>0);
});

test('Broken explicit typed references fail independently of semantic review flags',()=>{
 const data=structuredClone(original);
 data.combinations[0].workflowRefs.push({type:'workflow',id:'never-existing-workflow'});
 data.workflows[0].combinationRefs.push({type:'concept',id:'wrong-type'});
 const result=auditKnowledgeRelations(data);
 assert.ok(result.integrityErrors.some(x=>x.includes('never-existing-workflow')));
 assert.ok(result.integrityErrors.some(x=>x.includes('wrong-type')));
});
