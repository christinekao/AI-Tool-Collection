#!/usr/bin/env node
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {evaluateSyntheticRoute,checkSyntheticAnswerEvidence} from './relationship-synthetic-core.mjs';

const fixture=JSON.parse(fs.readFileSync('scripts/fixtures/relationship-audit03-synthetic.json','utf8'));
const route=()=>structuredClone(fixture.route);
const evidence=()=>structuredClone(fixture.evidence);

test('synthetic low-risk classification is routed, never executed or truly authorized',()=>{
 const i=route(),before=JSON.stringify(i);
 const x=evaluateSyntheticRoute(i);
 assert.equal(x.decision,'allow-low-risk');
 assert.equal(x.providerId,'provider-a');
 assert.equal(x.actionAuthorized,false);
 assert.equal(x.executed,false);
 assert.equal(x.verification,'synthetic-contract-only');
 assert.equal(JSON.stringify(i),before);
});
test('high risk overrides even calibrated and maximum confidence',()=>{
 const i=route();i.request.risk='high';i.system1.answerConfidence=1;
 assert.equal(evaluateSyntheticRoute(i).decision,'human-review');
 i.request.risk='medium';
 assert.equal(evaluateSyntheticRoute(i).decision,'human-review');
});
test('unknown risk, language and unapproved operation cannot auto-route',()=>{
 const i=route();i.request.risk='unknown';
 assert.equal(evaluateSyntheticRoute(i).decision,'human-review');
 i.request.risk='low';i.request.language='xx-XX';
 assert.equal(evaluateSyntheticRoute(i).decision,'human-review');
 i.request.language='zh-TW';i.request.operation='publish';
 assert.notEqual(evaluateSyntheticRoute(i).decision,'allow-low-risk');
});
test('rejects real data or missing task-specific permission before provider routing',()=>{
 const i=route();i.request.dataClass='internal';
 assert.equal(evaluateSyntheticRoute(i).reason,'non-synthetic-data-rejected');
 i.request.dataClass='synthetic';i.request.authorization.scopes=[];
 assert.equal(evaluateSyntheticRoute(i).reason,'authorization-or-scope-missing');
 i.request.authorization.scopes=['classify-read-only'];i.environment='real-server';
 assert.equal(evaluateSyntheticRoute(i).decision,'reject');
});
test('uncalibrated confidence, mismatched checkpoint or missing held-out evidence fail closed',()=>{
 const i=route();i.system1.calibrated=false;
 assert.equal(evaluateSyntheticRoute(i).decision,'human-review');
 i.system1.calibrated=true;i.system1.confidenceType='confidence';
 assert.equal(evaluateSyntheticRoute(i).decision,'human-review');
 i.system1.confidenceType='answer_confidence';i.system1.heldOutEvidence.checkpointId='other';
 assert.equal(evaluateSyntheticRoute(i).decision,'human-review');
 i.system1.heldOutEvidence.checkpointId=i.system1.checkpointId;i.system1.heldOutEvidence.sampleSize=5;
 assert.equal(evaluateSyntheticRoute(i).decision,'human-review');
});
test('low confidence escalates, NaN and invalid threshold never auto-allow',()=>{
 const i=route();i.system1.answerConfidence=0.5;
 assert.equal(evaluateSyntheticRoute(i).decision,'escalate-model');
 i.system1.answerConfidence=NaN;
 assert.equal(evaluateSyntheticRoute(i).decision,'human-review');
 i.system1.answerConfidence=0.99;i.system1.threshold=2;
 assert.equal(evaluateSyntheticRoute(i).decision,'human-review');
});
test('quota fallback only selects approved, available and compatible providers',()=>{
 const i=route();i.providerRoute.providers[0].quotaRemaining=0;
 const allowed=evaluateSyntheticRoute(i);
 assert.equal(allowed.decision,'allow-low-risk');
 assert.equal(allowed.providerId,'provider-b');
 assert.equal(allowed.reason,'approved-fallback-route-only');
 i.providerRoute.providers[1].approved=false;
 assert.equal(evaluateSyntheticRoute(i).decision,'human-review');
 i.providerRoute.providers[1].approved=true;i.providerRoute.providers[1].dataClasses=['restricted'];
 assert.equal(evaluateSyntheticRoute(i).decision,'human-review');
 i.providerRoute.providers[1].dataClasses=['synthetic'];i.providerRoute.fallbackApproved=false;
 assert.equal(evaluateSyntheticRoute(i).decision,'human-review');
});
test('provider lacking typed decision capability never selected',()=>{
 const i=route();i.providerRoute.providers[0].capabilities=[];
 i.providerRoute.providers[1].capabilities=[];
 assert.equal(evaluateSyntheticRoute(i).decision,'human-review');
});
test('document and SQL synthetic citations retain immutable, independently inspectable provenance',()=>{
 const i=evidence(),before=JSON.stringify(i);
 const result=checkSyntheticAnswerEvidence(i);
 assert.equal(result.decision,'candidate-supported');
 assert.equal(result.citations.length,3);
 assert.deepEqual(result.citations.map(x=>x.kind),['mineru','crawl4ai','sql']);
 assert.equal(result.actualQueryExecuted,false);
 assert.equal(result.integrationVerified,false);
 assert.equal(JSON.stringify(i),before);
});
test('community-only or denied source ACL blocks the entire candidate answer',()=>{
 const i=evidence();i.documents[0].access.edition='community';
 assert.equal(checkSyntheticAnswerEvidence(i).reason,'document-access-not-proven');
 i.documents[0].access.edition='enterprise';i.documents[0].access.allowedActors=[];
 assert.equal(checkSyntheticAnswerEvidence(i).decision,'blocked');
 i.documents[0].access.allowedActors=['fixture-analyst'];i.documents[0].access.sourceAclSynced=false;
 assert.equal(checkSyntheticAnswerEvidence(i).decision,'blocked');
});
test('unknown or forged document source, wrong locator or duplicate identity fail closed',()=>{
 const i=evidence();i.documents[0].source.uri='https://private.example/doc.pdf';
 assert.equal(checkSyntheticAnswerEvidence(i).decision,'blocked');
 i.documents[0].source.uri='synthetic://docs/manual.pdf';i.documents[0].source.locator='page:0';
 assert.equal(checkSyntheticAnswerEvidence(i).decision,'blocked');
 i.documents[0].source.locator='page:3';i.documents[1].source.id='doc-fixture-001';
 assert.equal(checkSyntheticAnswerEvidence(i).reason,'duplicate-document-source-id');
});
test('SQL without metric version, held-out validation or actor scope is blocked',()=>{
 const i=evidence();i.sql.metricVersion='';
 assert.equal(checkSyntheticAnswerEvidence(i).decision,'blocked');
 i.sql.metricVersion='v1';i.sql.dryRunValidated=false;
 assert.equal(checkSyntheticAnswerEvidence(i).decision,'blocked');
 i.sql.dryRunValidated=true;i.sql.allowedActors=[];
 assert.equal(checkSyntheticAnswerEvidence(i).decision,'blocked');
});
test('as-of mismatch does not unify evidence into one answer',()=>{
 const i=evidence();i.documents[0].source.asOf='2026-10-31';
 const result=checkSyntheticAnswerEvidence(i);
 assert.equal(result.decision,'separate-sources');
 assert.equal(result.reason,'as-of-cutoff-mismatch');
 assert.equal(result.integrationVerified,false);
 assert.equal(result.citations.length,3);
});
test('malformed data contracts fail without side effects or exceptions',()=>{
 assert.equal(evaluateSyntheticRoute(null).decision,'reject');
 assert.equal(evaluateSyntheticRoute({environment:'synthetic-offline'}).decision,'reject');
 assert.equal(checkSyntheticAnswerEvidence(null).decision,'blocked');
 assert.equal(checkSyntheticAnswerEvidence({environment:'synthetic-offline'}).decision,'blocked');
});
