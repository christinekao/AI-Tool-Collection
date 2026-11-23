/**
 * Phase 3 / Audit 04: independent-registry trust-boundary SIMULATION.
 *
 * The request is UNTRUSTED, including its authorization, calibration,
 * provider state, source ACL and SQL-dry-run flags. Simulated authority
 * is held in module-private, fixed synthetic registries.
 *
 * No real authentication, model calibration, external APIs, database, FS,
 * cryptographic attestations, or actual side-effect executor exists here.
 * Registry IDs are public test strings: do NOT deploy as an auth service.
 */
const isObject=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const nonempty=v=>typeof v==='string'&&v.length>0;
const strictDate=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&!Number.isNaN(Date.parse(v+'T00:00:00Z'));
const safeOutput=(decision,reason,providerId=null)=>Object.freeze({
 decision,reason,providerId,actionAuthorized:false,executed:false,
 verification:'trusted-synthetic-registry-only'
});
const blocked=reason=>Object.freeze({
 decision:'blocked',reason,citations:Object.freeze([]),
 actionAuthorized:false,actualQueryExecuted:false,integrationVerified:false,
 verification:'trusted-synthetic-registry-only'
});
const cite=(kind,source)=>Object.freeze({
 kind,id:source.id,version:source.version,asOf:source.asOf,locator:source.locator
});
const answer=(decision,reason,citations)=>Object.freeze({
 decision,reason,citations:Object.freeze(citations),
 actionAuthorized:false,actualQueryExecuted:false,integrationVerified:false,
 verification:'trusted-synthetic-registry-only'
});

// These are independent of, and cannot be replaced by, the caller's payload.
// They are NOT genuine authentication/authorization or runtime attestations.
const sessions=new Map([
 ['session-analyst',{actor:'fixture-analyst',scopes:['classify-read-only','review-synthetic-evidence']}],
 ['session-outsider',{actor:'fixture-outsider',scopes:[]}]
]);
const events=new Map([
 ['event-low',{sessionId:'session-analyst',operation:'classify-read-only',risk:'low',language:'zh-TW',checkpointId:'model-fixture-a',providerPlan:'normal'}],
 ['event-high',{sessionId:'session-analyst',operation:'classify-read-only',risk:'high',language:'zh-TW',checkpointId:'model-fixture-a',providerPlan:'normal'}],
 ['event-uncalibrated',{sessionId:'session-analyst',operation:'classify-read-only',risk:'low',language:'zh-TW',checkpointId:'model-unknown',providerPlan:'normal'}],
 ['event-primary-exhausted',{sessionId:'session-analyst',operation:'classify-read-only',risk:'low',language:'zh-TW',checkpointId:'model-fixture-a',providerPlan:'exhausted'}],
 ['event-fallback-denied',{sessionId:'session-analyst',operation:'classify-read-only',risk:'low',language:'zh-TW',checkpointId:'model-fixture-a',providerPlan:'restricted'}]
]);
const syntheticCalibrations=new Map([
 ['model-fixture-a|classify-read-only|zh-TW',{
  checkpointId:'model-fixture-a',task:'classify-read-only',language:'zh-TW',
  fixtureEvidenceId:'TEST-ONLY-HELDOUT-NOT-ACTUALLY-CALIBRATED',
  fixtureSampleCount:100,threshold:0.85
 }]
]);
const providerPlans=new Map([
 ['normal',{primary:'provider-a',quotaA:2,quotaB:3,fallbackAllowed:true,backupData:'synthetic'}],
 ['exhausted',{primary:'provider-a',quotaA:0,quotaB:3,fallbackAllowed:true,backupData:'synthetic'}],
 ['restricted',{primary:'provider-a',quotaA:0,quotaB:3,fallbackAllowed:false,backupData:'restricted'}]
]);
const providers=new Map([
 ['provider-a',{approved:true,capabilities:['typed-decision'],dataClasses:['synthetic']}],
 ['provider-b',{approved:true,capabilities:['typed-decision'],dataClasses:['synthetic']}],
 ['provider-blocked',{approved:false,capabilities:['typed-decision'],dataClasses:['synthetic']}]
]);

const documents=new Map([
 ['doc-fixture-001',{
  parser:'mineru',source:{id:'doc-fixture-001',uri:'synthetic://docs/manual.pdf',version:'v1',asOf:'2026-11-01',locator:'page:3'},
  access:{mode:'source-acl',edition:'enterprise',syncVerifiedInFixture:true,allowedActors:['fixture-analyst']}
 }],
 ['web-fixture-002',{
  parser:'crawl4ai',source:{id:'web-fixture-002',uri:'synthetic://web/help-page',version:'hash-abc',asOf:'2026-11-01',locator:'section:overview'},
  access:{mode:'public'}
 }],
 ['doc-denied-003',{
  parser:'mineru',source:{id:'doc-denied-003',uri:'synthetic://docs/denied.pdf',version:'v1',asOf:'2026-11-01',locator:'page:2'},
  access:{mode:'source-acl',edition:'community',syncVerifiedInFixture:false,allowedActors:[]}
 }],
 ['doc-prior-004',{
  parser:'mineru',source:{id:'doc-prior-004',uri:'synthetic://docs/prior.pdf',version:'v1',asOf:'2026-10-31',locator:'page:1'},
  access:{mode:'source-acl',edition:'enterprise',syncVerifiedInFixture:true,allowedActors:['fixture-analyst']}
 }]
]);
const sqlAttestations=new Map([
 ['sql-fixture-001',{
  queryId:'sql-fixture-001',metricId:'ticket-resolution-rate',metricVersion:'v1',
  modelVersion:'mdl-v1',sourceSnapshotId:'synthetic-snapshot-2026-11-01',asOf:'2026-11-01',
  readOnlyValidatedInFixture:true,dryRunValidatedInFixture:true,
  allowedActors:['fixture-analyst']
 }],
 ['sql-denied-002',{
  queryId:'sql-denied-002',metricId:'ticket-resolution-rate',metricVersion:'v1',
  modelVersion:'mdl-v1',sourceSnapshotId:'synthetic-snapshot-2026-11-01',asOf:'2026-11-01',
  readOnlyValidatedInFixture:false,dryRunValidatedInFixture:false,
  allowedActors:[]
 }]
]);
const sourceFields=['id','uri','version','asOf','locator'];
const sqlFields=['queryId','metricId','metricVersion','modelVersion','sourceSnapshotId','asOf'];

function sessionFor(payload,requiredScope){
 const s=sessions.get(payload.sessionId);
 if(!s||s.actor!==payload.actor||!s.scopes.includes(requiredScope))return null;
 return s;
}

export function evaluateTrustedSyntheticRoute(payload){
 if(!isObject(payload)||payload.environment!=='synthetic-offline')
  return safeOutput('reject','environment-not-synthetic');
 const r=payload.request,s=payload.system1;
 if(!isObject(r)||!isObject(s))return safeOutput('reject','missing-input');
 const session=sessionFor(r,'classify-read-only');
 if(!session)return safeOutput('reject','untrusted-session-or-scope');
 if(r.dataClass!=='synthetic')return safeOutput('reject','non-synthetic-data');
 const event=events.get(r.eventId);
 if(!event||event.sessionId!==r.sessionId)return safeOutput('reject','unbound-or-unknown-event');
 if(r.operation!==event.operation||r.language!==event.language||r.risk!==event.risk)
  return safeOutput('human-review','request-does-not-match-trusted-event');
 if(event.risk!=='low'||event.operation!=='classify-read-only')
  return safeOutput('human-review','trusted-risk-or-operation-not-low');
 const calibration=syntheticCalibrations.get(event.checkpointId+'|'+event.operation+'|'+event.language);
 if(!calibration||!nonempty(calibration.fixtureEvidenceId)||calibration.fixtureSampleCount<30)
  return safeOutput('human-review','no-independent-synthetic-calibration-record');
 if(s.checkpointId!==event.checkpointId||s.confidenceType!=='answer_confidence')
  return safeOutput('human-review','score-provenance-mismatch');
 if(typeof s.answerConfidence!=='number'||!Number.isFinite(s.answerConfidence)||
    s.answerConfidence<0||s.answerConfidence>1)
  return safeOutput('human-review','invalid-confidence');
 if(s.answerConfidence<calibration.threshold)
  return safeOutput('escalate-model','below-registry-threshold');
 const plan=providerPlans.get(event.providerPlan);
 if(!plan)return safeOutput('human-review','no-trusted-provider-plan');
 const eligible=(id,quota,dataClass)=>{
  const provider=providers.get(id);
  return Boolean(provider&&provider.approved&&
   Number.isInteger(quota)&&quota>0&&
   provider.capabilities.includes('typed-decision')&&
   provider.dataClasses.includes(dataClass)&&dataClass==='synthetic');
 };
 if(eligible(plan.primary,plan.quotaA,'synthetic'))
  return safeOutput('allow-low-risk','registry-approved-synthetic-primary',plan.primary);
 if(plan.fallbackAllowed&&eligible('provider-b',plan.quotaB,plan.backupData))
  return safeOutput('allow-low-risk','registry-approved-synthetic-fallback','provider-b');
 return safeOutput('human-review','no-policy-compliant-provider');
}

export function checkTrustedSyntheticEvidence(payload){
 if(!isObject(payload)||payload.environment!=='synthetic-offline')
  return blocked('environment-not-synthetic');
 if(!isObject(payload.request)||!sessionFor(payload.request,'review-synthetic-evidence'))
  return blocked('untrusted-session-or-scope');
 const {request:r,documents:docs,sql}=payload;
 if(!Array.isArray(docs)||docs.length===0||!isObject(sql))
  return blocked('missing-sources-or-sql');
 const seen=new Set(),citations=[];
 for(const candidate of docs){
  if(!isObject(candidate)||!isObject(candidate.source))
   return blocked('invalid-document-shape');
  const trusted=documents.get(candidate.source.id);
  if(!trusted||candidate.parser!==trusted.parser||
     !sourceFields.every(k=>candidate.source[k]===trusted.source[k])||
     !strictDate(trusted.source.asOf)||!trusted.source.uri.startsWith('synthetic://'))
   return blocked('document-provenance-not-registered');
  if(seen.has(candidate.source.id))return blocked('duplicate-document-identity');
  seen.add(candidate.source.id);
  const acl=trusted.access;
  if(acl.mode==='source-acl'&&
    (acl.edition!=='enterprise'||acl.syncVerifiedInFixture!==true||
     !acl.allowedActors.includes(r.actor)))
   return blocked('independently-checked-source-acl-denied');
  citations.push(cite(trusted.parser,trusted.source));
 }
 const trustedSql=sqlAttestations.get(sql.queryId);
 if(!trustedSql||!sqlFields.every(k=>sql[k]===trustedSql[k])||
  !trustedSql.readOnlyValidatedInFixture||!trustedSql.dryRunValidatedInFixture||
  !trustedSql.allowedActors.includes(r.actor)||!strictDate(trustedSql.asOf))
  return blocked('independently-checked-sql-attestation-denied');
 // Caller assertions about access, sourceAclSynced, dryRunValidated,
 // readOnly, calibrated etc. never grant access.
 citations.push(Object.freeze({
  kind:'sql',id:trustedSql.queryId,version:trustedSql.modelVersion,
  asOf:trustedSql.asOf,locator:trustedSql.metricId+'@'+trustedSql.metricVersion
 }));
 if(citations.some(x=>x.asOf!==trustedSql.asOf))
  return answer('separate-sources','verified-fixture-cutoff-mismatch',citations);
 return answer('candidate-supported','independent-fixture-provenance-checked',citations);
}
