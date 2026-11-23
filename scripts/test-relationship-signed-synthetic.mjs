#!/usr/bin/env node
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {randomBytes} from 'node:crypto';
import {createSyntheticIssuer,createSyntheticGate} from './relationship-signed-synthetic-core.mjs';

const fixture=JSON.parse(fs.readFileSync('scripts/fixtures/relationship-audit04-untrusted.json','utf8'));
const route=()=>structuredClone(fixture.route);
const evidence=()=>structuredClone(fixture.evidence);
const start=Date.UTC(2026,10,23,12,0,0);
const setup=()=>{
 let t=start;
 const now=()=>t,key=randomBytes(32),usedNonces=new Set();
 return {
  issuer:createSyntheticIssuer({key,now}),
  gate:createSyntheticGate({key,now,usedNonces}),
  newGate:()=>createSyntheticGate({key,now,usedNonces}),
  independentGate:()=>createSyntheticGate({key,now}),
  advance:n=>{t+=n;},
  rewind:n=>{t-=n;},
  key,usedNonces
 };
};
const safe=x=>{
 assert.equal(x.actionAuthorized,false);
 if('executed' in x)assert.equal(x.executed,false);
 if('actualQueryExecuted' in x)assert.equal(x.actualQueryExecuted,false);
 if('integrationVerified' in x)assert.equal(x.integrationVerified,false);
 assert.equal(x.verification,'synthetic-signed-request-only');
};
const issued=(s,scope,payload,ttlMs)=>s.issuer.issue({scope,payload,ttlMs});

test('valid signed route only selects synthetic provider and never executes',()=>{
 const s=setup(),payload=route(),before=JSON.stringify(payload);
 const result=s.gate.route({envelope:issued(s,'route',payload),payload});
 assert.equal(result.decision,'allow-low-risk');
 assert.equal(result.providerId,'provider-a');safe(result);
 assert.equal(JSON.stringify(payload),before);
});
test('valid signed evidence still uses independent source and SQL registries',()=>{
 const s=setup(),payload=evidence();
 const result=s.gate.evidence({envelope:issued(s,'evidence',payload),payload});
 assert.equal(result.decision,'candidate-supported');
 assert.equal(result.citations.length,3);safe(result);
});
test('body mutation after signing is rejected, even if caller claims authorization',()=>{
 const s=setup(),payload=route(),envelope=issued(s,'route',payload);
 payload.request.actor='fixture-attacker';
 payload.request.authorization={approved:true,scopes:['*']};
 const result=s.gate.route({envelope,payload});
 assert.equal(result.reason,'request-body-mismatch');safe(result);
});
test('high risk signed by synthetic issuer is still human review',()=>{
 const s=setup(),payload=route();
 payload.request.eventId='event-high';payload.request.risk='high';payload.system1.answerConfidence=1;
 const result=s.gate.route({envelope:issued(s,'route',payload),payload});
 assert.equal(result.decision,'human-review');safe(result);
});
test('forged calibration and source ACL do not override Audit 04 registries',()=>{
 const s=setup(),payload=route();
 payload.request.eventId='event-uncalibrated';payload.system1.checkpointId='model-unknown';
 payload.system1.calibrated=true;payload.system1.heldOutEvidence={datasetId:'forged',sampleSize:100000};
 const out=s.gate.route({envelope:issued(s,'route',payload),payload});
 assert.equal(out.decision,'human-review');safe(out);
 const doc=evidence();
 doc.documents[0].source.id='doc-denied-003';doc.documents[0].source.uri='synthetic://docs/denied.pdf';
 doc.documents[0].source.locator='page:2';doc.documents[0].access.sourceAclSynced=true;
 const data=s.gate.evidence({envelope:issued(s,'evidence',doc),payload:doc});
 assert.equal(data.decision,'blocked');safe(data);
});
test('scope cannot be switched from route to evidence',()=>{
 const s=setup(),payload=route(),envelope=issued(s,'route',payload);
 const result=s.gate.evidence({envelope,payload});
 assert.equal(result.reason,'wrong-version-audience-or-scope');safe(result);
});
test('wrong audience and version cannot be accepted',()=>{
 const s=setup(),payload=route(),envelope=issued(s,'route',payload);
 assert.equal(s.gate.route({envelope:{...envelope,claims:{...envelope.claims,audience:'other'}},payload}).decision,'reject');
 assert.equal(s.gate.route({envelope:{...envelope,claims:{...envelope.claims,version:'x'}},payload}).decision,'reject');
});
test('tampered HMAC is rejected and does not consume the original nonce',()=>{
 const s=setup(),payload=route(),envelope=issued(s,'route',payload);
 const forged={...envelope,signature:'f'.repeat(64)};
 assert.equal(s.gate.route({envelope:forged,payload}).decision,'reject');
 assert.equal(s.usedNonces.size,0);
 assert.equal(s.gate.route({envelope,payload}).decision,'allow-low-risk');
});
test('wrong ephemeral key fails signature verification',()=>{
 const s=setup(),payload=route(),envelope=issued(s,'route',payload);
 const other=createSyntheticGate({key:randomBytes(32),now:()=>start});
 assert.equal(other.route({envelope,payload}).reason,'signature-invalid');
});
test('expired envelope rejects even if all synthetic registry inputs were valid',()=>{
 const s=setup(),payload=route(),envelope=issued(s,'route',payload,1000);
 s.advance(1001);
 assert.equal(s.gate.route({envelope,payload}).reason,'expired');
});
test('not-before time prevents use before synthetic issuer time',()=>{
 const s=setup(),payload=route(),envelope=issued(s,'route',payload);
 s.rewind(1000);
 assert.equal(s.gate.route({envelope,payload}).reason,'not-yet-valid');
});
test('long-lived or malformed envelope lifetimes cannot bypass max TTL',()=>{
 const s=setup(),payload=route(),envelope=issued(s,'route',payload);
 const over={...envelope,claims:{...envelope.claims,expiresAt:envelope.claims.issuedAt+900000}};
 assert.equal(s.gate.route({envelope:over,payload}).reason,'invalid-lifetime');
 assert.throws(()=>issued(s,'route',payload,100000));
 assert.throws(()=>issued(s,'route',payload,0));
});
test('same sealed token is one-use in one verifier',()=>{
 const s=setup(),payload=route(),envelope=issued(s,'route',payload);
 assert.equal(s.gate.route({envelope,payload}).decision,'allow-low-risk');
 const duplicate=s.gate.route({envelope,payload});
 assert.equal(duplicate.reason,'replay-detected');safe(duplicate);
});
test('sequential competing calls with identical token produce exactly one route decision',async()=>{
 const s=setup(),payload=route(),envelope=issued(s,'route',payload);
 const results=await Promise.all([Promise.resolve().then(()=>s.gate.route({envelope,payload})),Promise.resolve().then(()=>s.gate.route({envelope,payload}))]);
 assert.deepEqual(results.map(x=>x.decision).sort(),['allow-low-risk','reject']);
});
test('shared in-memory replay state blocks reuse across synthetic verifier instances',()=>{
 const s=setup(),payload=route(),envelope=issued(s,'route',payload);
 assert.equal(s.gate.route({envelope,payload}).decision,'allow-low-risk');
 assert.equal(s.newGate().route({envelope,payload}).reason,'replay-detected');
});
test('independent verifier instances lack distributed replay protection (documented gap)',()=>{
 const s=setup(),payload=route(),envelope=issued(s,'route',payload);
 assert.equal(s.gate.route({envelope,payload}).decision,'allow-low-risk');
 const separate=s.independentGate().route({envelope,payload});
 assert.equal(separate.decision,'allow-low-risk');
 // This is evidence of a LIMITATION, NOT a production-safe property.
 safe(separate);
});
test('failed body-hash check does not burn valid one-use token',()=>{
 const s=setup(),payload=route(),envelope=issued(s,'route',payload),modified=structuredClone(payload);
 modified.request.risk='high';
 assert.equal(s.gate.route({envelope,payload:modified}).reason,'request-body-mismatch');
 assert.equal(s.gate.route({envelope,payload}).decision,'allow-low-risk');
});
test('reused signed evidence envelope does not reveal evidence twice',()=>{
 const s=setup(),payload=evidence(),envelope=issued(s,'evidence',payload);
 assert.equal(s.gate.evidence({envelope,payload}).decision,'candidate-supported');
 assert.equal(s.gate.evidence({envelope,payload}).reason,'replay-detected');
});
test('changing an SQL metric or document version after signing is rejected',()=>{
 const s=setup(),payload=evidence(),envelope=issued(s,'evidence',payload);
 payload.sql.metricVersion='fake';
 assert.equal(s.gate.evidence({envelope,payload}).reason,'request-body-mismatch');
});
test('non-synthetic or unknown session cannot get a successful simulated decision even when signed',()=>{
 const s=setup(),payload=route();payload.environment='production';
 assert.equal(s.gate.route({envelope:issued(s,'route',payload),payload}).decision,'reject');
 const second=route();second.request.sessionId='unknown';
 assert.equal(s.gate.route({envelope:issued(s,'route',second),payload:second}).decision,'reject');
});
test('invalid payload objects and malformed envelopes fail closed',()=>{
 const s=setup();
 assert.equal(s.gate.route({payload:route(),envelope:null}).reason,'invalid-envelope');
 assert.equal(s.gate.evidence({payload:evidence(),envelope:{}}).decision,'blocked');
 assert.throws(()=>issued(s,'route',{nan:NaN}));
 assert.throws(()=>issued(s,'route',{'__proto__':null,bad:undefined}));
 const payload=route(),envelope=issued(s,'route',payload);
 const malformed={...envelope,signature:'nope'};
 assert.equal(s.gate.route({payload,envelope:malformed}).decision,'reject');
});
test('signing payload is immutable and tokens carry no key material',()=>{
 const s=setup(),payload=route(),before=JSON.stringify(payload),envelope=issued(s,'route',payload);
 assert.equal(Object.hasOwn(envelope,'key'),false);
 assert.equal(envelope.claims.scope,'route');
 assert.equal(envelope.claims.bodyHash.length,64);
 assert.equal(envelope.signature.length,64);
 assert.equal(JSON.stringify(payload),before);
});
