/**
 * Audit 05: signed, short-lived, one-use request envelopes for SYNTHETIC fixtures.
 *
 * Issuer and verifier must live on separate trusted sides in a real system.
 * These exported factories are a test harness, NOT a production authentication
 * service. A key from this module is not a real identity; the test controls it.
 * No network, database, OS executor, user data or external provider calls.
 */
import {createHash, createHmac, randomBytes, timingSafeEqual} from 'node:crypto';
import {evaluateTrustedSyntheticRoute,checkTrustedSyntheticEvidence} from './relationship-trusted-synthetic-core.mjs';

const VERSION='synthetic-audit05-v1';
const AUDIENCE='synthetic-audit05-gate';
const MAX_TTL_MS=60_000;
const isObject=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const int=x=>Number.isSafeInteger(x);
const isKey=x=>Buffer.isBuffer(x)&&x.length>=32;

function normalize(x,depth=0){
 if(depth>16)throw Error('payload-too-deep');
 if(x===null||typeof x==='string'||typeof x==='boolean')return x;
 if(typeof x==='number'&&Number.isFinite(x))return x;
 if(Array.isArray(x)){
  if(x.length>150)throw Error('array-too-large');
  return x.map(y=>normalize(y,depth+1));
 }
 if(!isObject(x)||(Object.getPrototypeOf(x)!==Object.prototype&&Object.getPrototypeOf(x)!==null))
  throw Error('non-json-input');
 const keys=Object.keys(x).sort();
 if(keys.length>150||keys.some(k=>['__proto__','prototype','constructor'].includes(k)))
  throw Error('unsafe-object');
 const out=Object.create(null);
 for(const k of keys)out[k]=normalize(x[k],depth+1);
 return out;
}

function encode(x){
 const s=JSON.stringify(normalize(x));
 if(typeof s!=='string'||s.length>16_384)throw Error('payload-too-large');
 return s;
}
const hash=x=>createHash('sha256').update(encode(x),'utf8').digest('hex');
const sign=(key,claims)=>createHmac('sha256',key).update(encode(claims),'utf8').digest('hex');
const rejectRoute=reason=>Object.freeze({
 decision:'reject',reason,providerId:null,actionAuthorized:false,executed:false,
 verification:'synthetic-signed-request-only'
});
const rejectEvidence=reason=>Object.freeze({
 decision:'blocked',reason,citations:Object.freeze([]),actionAuthorized:false,
 actualQueryExecuted:false,integrationVerified:false,
 verification:'synthetic-signed-request-only'
});
const output=(result)=>Object.freeze({...result,verification:'synthetic-signed-request-only'});

export function createSyntheticIssuer({key,now}){
 if(!isKey(key)||typeof now!=='function')throw Error('ephemeral-test-key-required');
 const ownKey=Buffer.from(key);
 return Object.freeze({
  issue({scope,payload,ttlMs=15_000}){
   if(!['route','evidence'].includes(scope)||!int(ttlMs)||ttlMs<1000||ttlMs>MAX_TTL_MS)
    throw Error('invalid-synthetic-envelope-request');
   const issuedAt=now();
   if(!int(issuedAt))throw Error('invalid-clock');
   const claims=Object.freeze({
    version:VERSION,audience:AUDIENCE,scope,issuedAt,
    notBefore:issuedAt,expiresAt:issuedAt+ttlMs,
    nonce:randomBytes(16).toString('hex'),bodyHash:hash(payload)
   });
   return Object.freeze({claims,signature:sign(ownKey,claims)});
  }
 });
}

export function createSyntheticGate({key,now,usedNonces}){
 if(!isKey(key)||typeof now!=='function')throw Error('ephemeral-test-key-required');
 if(usedNonces!==undefined&&!(usedNonces instanceof Set))throw Error('invalid-test-replay-store');
 const ownKey=Buffer.from(key);
 // Single-process only. A distributed service needs a durable, atomic replay store.
 const consumed=usedNonces??new Set();
 function validate(envelope,payload,scope){
  if(!isObject(envelope)||!isObject(envelope.claims)||typeof envelope.signature!=='string')
   return 'invalid-envelope';
  const c=envelope.claims;
  if(Object.keys(c).sort().join(',')!==
     ['audience','bodyHash','expiresAt','issuedAt','nonce','notBefore','scope','version'].join(','))
   return 'invalid-claim-shape';
  if(c.version!==VERSION||c.audience!==AUDIENCE||c.scope!==scope)
   return 'wrong-version-audience-or-scope';
  if(!int(c.issuedAt)||!int(c.notBefore)||!int(c.expiresAt)||
    c.notBefore!==c.issuedAt||c.expiresAt<=c.issuedAt||
    c.expiresAt-c.issuedAt>MAX_TTL_MS)
   return 'invalid-lifetime';
  if(typeof c.nonce!=='string'||!/^[a-f0-9]{32}$/.test(c.nonce)||
    typeof c.bodyHash!=='string'||!/^[a-f0-9]{64}$/.test(c.bodyHash)||
    !/^[a-f0-9]{64}$/.test(envelope.signature))
   return 'invalid-signature-format';
  let actualHash,expected;
  try{
   actualHash=hash(payload);
   expected=sign(ownKey,c);
  }catch{
   return 'invalid-payload';
  }
  if(actualHash!==c.bodyHash)return 'request-body-mismatch';
  if(!timingSafeEqual(Buffer.from(envelope.signature,'hex'),Buffer.from(expected,'hex')))
   return 'signature-invalid';
  const t=now();
  if(!int(t))return 'invalid-clock';
  if(t<c.notBefore)return 'not-yet-valid';
  if(t>=c.expiresAt)return 'expired';
  if(consumed.has(c.nonce))return 'replay-detected';
  // The token is consumed before downstream simulation and never executes actions.
  consumed.add(c.nonce);
  return null;
 }
 return Object.freeze({
  route({envelope,payload}={}){
   const reason=validate(envelope,payload,'route');
   if(reason)return rejectRoute(reason);
   return output(evaluateTrustedSyntheticRoute(payload));
  },
  evidence({envelope,payload}={}){
   const reason=validate(envelope,payload,'evidence');
   if(reason)return rejectEvidence(reason);
   return output(checkTrustedSyntheticEvidence(payload));
  }
 });
}
