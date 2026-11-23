#!/usr/bin/env node
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {evaluateTrustedSyntheticRoute,checkTrustedSyntheticEvidence} from './relationship-trusted-synthetic-core.mjs';

const original=JSON.parse(fs.readFileSync('scripts/fixtures/relationship-audit04-untrusted.json','utf8'));
const route=()=>structuredClone(original.route);
const evidence=()=>structuredClone(original.evidence);
const safe=r=>{
 assert.equal(r.actionAuthorized,false);
 assert.equal(r.verification,'trusted-synthetic-registry-only');
 if('executed' in r)assert.equal(r.executed,false);
 if('actualQueryExecuted' in r)assert.equal(r.actualQueryExecuted,false);
 if('integrationVerified' in r)assert.equal(r.integrationVerified,false);
};

test('valid synthetic event is bound to independently stored session, risk, calibration and provider',()=>{
 const x=route(),before=JSON.stringify(x),result=evaluateTrustedSyntheticRoute(x);
 assert.equal(result.decision,'allow-low-risk');
 assert.equal(result.providerId,'provider-a');
 safe(result);
 assert.equal(JSON.stringify(x),before);
});

test('caller-forged authorization does not grant an unknown or unprivileged session',()=>{
 const x=route();
 x.request.sessionId='not-issued';x.request.authorization={approved:true,scopes:['classify-read-only']};
 assert.equal(evaluateTrustedSyntheticRoute(x).reason,'untrusted-session-or-scope');
 x.request.sessionId='session-outsider';x.request.actor='fixture-outsider';
 assert.equal(evaluateTrustedSyntheticRoute(x).reason,'untrusted-session-or-scope');
});

test('spoofing another actor or changing event does not inherit that actor’s rights',()=>{
 const x=route();x.request.actor='fixture-outsider';
 assert.equal(evaluateTrustedSyntheticRoute(x).decision,'reject');
 x.request.actor='fixture-analyst';x.request.eventId='unknown-event';
 assert.equal(evaluateTrustedSyntheticRoute(x).decision,'reject');
});

test('caller-claimed risk low cannot downgrade independently tagged high-risk event',()=>{
 const x=route();x.request.eventId='event-high';x.request.risk='low';
 assert.equal(evaluateTrustedSyntheticRoute(x).decision,'human-review');
 x.request.risk='high';x.system1.answerConfidence=1;
 assert.equal(evaluateTrustedSyntheticRoute(x).decision,'human-review');
});

test('unsupported operation or mismatched language never autoselects a provider',()=>{
 const x=route();x.request.operation='publish';
 assert.equal(evaluateTrustedSyntheticRoute(x).decision,'human-review');
 x.request.operation='classify-read-only';x.request.language='fr-FR';
 assert.equal(evaluateTrustedSyntheticRoute(x).decision,'human-review');
});

test('unknown checkpoint does not become calibrated when caller fabricates held-out metadata',()=>{
 const x=route();x.request.eventId='event-uncalibrated';x.system1.checkpointId='model-unknown';
 x.system1.calibrated=true;x.system1.heldOutEvidence={datasetId:'fake',sampleSize:999999};
 assert.equal(evaluateTrustedSyntheticRoute(x).reason,'no-independent-synthetic-calibration-record');
});

test('caller cannot lower the registry threshold or switch its checkpoint to a known ID',()=>{
 const x=route();x.system1.answerConfidence=0.4;x.system1.threshold=0.1;
 assert.equal(evaluateTrustedSyntheticRoute(x).decision,'escalate-model');
 x.system1.answerConfidence=0.99;x.system1.checkpointId='model-attacker';
 assert.equal(evaluateTrustedSyntheticRoute(x).decision,'human-review');
});

test('score provenance type and numerical range must be valid',()=>{
 const x=route();x.system1.confidenceType='confidence';
 assert.equal(evaluateTrustedSyntheticRoute(x).decision,'human-review');
 x.system1.confidenceType='answer_confidence';x.system1.answerConfidence=NaN;
 assert.equal(evaluateTrustedSyntheticRoute(x).decision,'human-review');
});

test('untrusted provider catalogue cannot cause an unapproved provider to be selected',()=>{
 const x=route();
 x.providerRoute={primaryId:'provider-blocked',providers:[{id:'provider-blocked',approved:true,quotaRemaining:999,dataClasses:['synthetic'],capabilities:['typed-decision']}]};
 const result=evaluateTrustedSyntheticRoute(x);
 assert.equal(result.providerId,'provider-a');safe(result);
});

test('independent quota exhaustion permits only the approved synthetic fallback',()=>{
 const x=route();x.request.eventId='event-primary-exhausted';
 const result=evaluateTrustedSyntheticRoute(x);
 assert.equal(result.providerId,'provider-b');
 assert.equal(result.decision,'allow-low-risk');safe(result);
});

test('caller-enabled fallback cannot override the independent provider policy',()=>{
 const x=route();x.request.eventId='event-fallback-denied';x.providerRoute.fallbackApproved=true;
 x.providerRoute.providers=[{id:'provider-b',approved:true,available:true,quotaRemaining:999,dataClasses:['synthetic'],capabilities:['typed-decision']}];
 assert.equal(evaluateTrustedSyntheticRoute(x).decision,'human-review');
});

test('non-synthetic environment and data are rejected regardless of claims',()=>{
 const x=route();x.environment='production';
 assert.equal(evaluateTrustedSyntheticRoute(x).decision,'reject');
 x.environment='synthetic-offline';x.request.dataClass='confidential';
 assert.equal(evaluateTrustedSyntheticRoute(x).decision,'reject');
});

test('synthetic document and SQL provenance is approved by separate private registries, not payload flags',()=>{
 const x=evidence(),before=JSON.stringify(x);
 const result=checkTrustedSyntheticEvidence(x);
 assert.equal(result.decision,'candidate-supported');
 assert.equal(result.citations.length,3);
 assert.deepEqual(result.citations.map(z=>z.kind),['mineru','crawl4ai','sql']);
 safe(result);
 assert.equal(JSON.stringify(x),before);
});

test('forged document ACL flags cannot override independent denied source registry',()=>{
 const x=evidence();
 x.documents[0].source={id:'doc-denied-003',uri:'synthetic://docs/denied.pdf',version:'v1',asOf:'2026-11-01',locator:'page:2'};
 x.documents[0].access={mode:'source-acl',edition:'enterprise',sourceAclSynced:true,allowedActors:['fixture-analyst']};
 assert.equal(checkTrustedSyntheticEvidence(x).reason,'independently-checked-source-acl-denied');
});

test('payload ACL false does not alter independently stored fixture permissions',()=>{
 const x=evidence();
 x.documents[0].access={mode:'source-acl',edition:'community',sourceAclSynced:false,allowedActors:[]};
 const y=checkTrustedSyntheticEvidence(x);
 assert.equal(y.decision,'candidate-supported');safe(y);
});

test('forged SQL dry-run, access and read-only flags cannot authorize denied attestation',()=>{
 const x=evidence();x.sql.queryId='sql-denied-002';
 x.sql.readOnly=true;x.sql.dryRunValidated=true;x.sql.allowedActors=['fixture-analyst'];
 assert.equal(checkTrustedSyntheticEvidence(x).reason,'independently-checked-sql-attestation-denied');
});

test('unregistered query or source metadata drift blocks, even with valid-looking declarations',()=>{
 const x=evidence();x.sql.queryId='sql-unknown';
 assert.equal(checkTrustedSyntheticEvidence(x).decision,'blocked');
 x.sql.queryId='sql-fixture-001';x.documents[0].source.version='forged-v2';
 assert.equal(checkTrustedSyntheticEvidence(x).decision,'blocked');
});

test('unknown session or spoofed actor cannot read even public synthetic document',()=>{
 const x=evidence();x.request.sessionId='session-outsider';x.request.actor='fixture-outsider';
 assert.equal(checkTrustedSyntheticEvidence(x).decision,'blocked');
 x.request.sessionId='session-analyst';x.request.actor='fixture-outsider';
 assert.equal(checkTrustedSyntheticEvidence(x).decision,'blocked');
});

test('known prior document is not silently fused with newer SQL evidence',()=>{
 const x=evidence();
 x.documents[0].source={id:'doc-prior-004',uri:'synthetic://docs/prior.pdf',version:'v1',asOf:'2026-10-31',locator:'page:1'};
 const result=checkTrustedSyntheticEvidence(x);
 assert.equal(result.decision,'separate-sources');
 assert.equal(result.citations.length,3);safe(result);
});

test('duplicate source IDs and malformed inputs fail closed without throwing',()=>{
 const x=evidence();x.documents[1]=structuredClone(x.documents[0]);
 assert.equal(checkTrustedSyntheticEvidence(x).decision,'blocked');
 assert.equal(evaluateTrustedSyntheticRoute(null).decision,'reject');
 assert.equal(checkTrustedSyntheticEvidence(null).decision,'blocked');
 assert.equal(evaluateTrustedSyntheticRoute({environment:'synthetic-offline'}).decision,'reject');
 assert.equal(checkTrustedSyntheticEvidence({environment:'synthetic-offline'}).decision,'blocked');
});

test('outputs contain no execution capability, and case fixture remains unchanged',()=>{
 const before=JSON.stringify(original),a=evaluateTrustedSyntheticRoute(route()),b=checkTrustedSyntheticEvidence(evidence());
 safe(a);safe(b);
 assert.equal(Object.isFrozen(a),true);
 assert.equal(Object.isFrozen(b),true);
 assert.equal(Object.isFrozen(b.citations),true);
 assert.equal(JSON.stringify(original),before);
});
