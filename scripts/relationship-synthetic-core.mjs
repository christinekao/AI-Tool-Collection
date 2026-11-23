/**
 * Phase 3 Audit 03: deterministic synthetic contract simulation.
 * Deliberately no Node imports, network, filesystem, model API or effectful executor.
 * A route decision is NOT permission to perform a real-world action.
 */
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const string=x=>typeof x==='string'&&x.trim().length>0;
const date=x=>string(x)&&/^\d{4}-\d{2}-\d{2}$/.test(x)&&Number.isFinite(Date.parse(x+'T00:00:00Z'));
const scope=['classify-read-only'];
const languages=['en-US','zh-TW'];
const output=(decision,reason,providerId=null)=>Object.freeze({
 decision,reason,providerId,actionAuthorized:false,executed:false,verification:'synthetic-contract-only'
});

export function evaluateSyntheticRoute(input){
 if(!object(input)||input.environment!=='synthetic-offline')return output('reject','environment-not-synthetic');
 const {request:r,system1:s,providerRoute:p}=input;
 if(!object(r)||!object(s)||!object(p))return output('reject','missing-contract');
 if(r.dataClass!=='synthetic')return output('reject','non-synthetic-data-rejected');
 if(!string(r.actor)||!object(r.authorization)||r.authorization.approved!==true||
   !Array.isArray(r.authorization.scopes)||!r.authorization.scopes.includes(r.operation))
   return output('reject','authorization-or-scope-missing');
 if(!scope.includes(r.operation))return output('human-review','operation-not-low-risk');
 if(!['low','medium','high'].includes(r.risk))return output('human-review','risk-unknown');
 if(r.risk!=='low')return output('human-review','risk-requires-human');
 if(!languages.includes(r.language))return output('human-review','language-out-of-distribution');
 if(s.confidenceType!=='answer_confidence'||s.calibrated!==true||
   !object(s.heldOutEvidence)||!string(s.heldOutEvidence.datasetId)||
   !Number.isInteger(s.heldOutEvidence.sampleSize)||s.heldOutEvidence.sampleSize<30||
   s.heldOutEvidence.checkpointId!==s.checkpointId||s.heldOutEvidence.task!==r.operation)
   return output('human-review','calibration-not-established');
 if(typeof s.answerConfidence!=='number'||!Number.isFinite(s.answerConfidence)||
   s.answerConfidence<0||s.answerConfidence>1||
   typeof s.threshold!=='number'||!Number.isFinite(s.threshold)||
   s.threshold<0||s.threshold>1)
   return output('human-review','confidence-out-of-range');
 if(s.answerConfidence<s.threshold)return output('escalate-model','confidence-below-calibrated-threshold');
 const catalog=Array.isArray(p.providers)?p.providers:[];
 const eligible=id=>{
  const x=catalog.find(v=>object(v)&&v.id===id);
  return x&&x.approved===true&&x.available===true&&
   Number.isFinite(x.quotaRemaining)&&x.quotaRemaining>0&&
   Array.isArray(x.dataClasses)&&x.dataClasses.includes('synthetic')&&
   Array.isArray(x.capabilities)&&x.capabilities.includes('typed-decision')?x:null;
 };
 const primary=eligible(p.primaryId);
 if(primary)return output('allow-low-risk','synthetic-classification-route-only',primary.id);
 if(p.fallbackApproved!==true||!Array.isArray(p.fallbackIds))return output('human-review','no-approved-provider');
 for(const id of p.fallbackIds){
  if(id===p.primaryId)continue;
  const alt=eligible(id);
  if(alt)return output('allow-low-risk','approved-fallback-route-only',alt.id);
 }
 return output('human-review','no-eligible-fallback-provider');
}

const blocked=(reason)=>Object.freeze({
 decision:'blocked',reason,citations:[],actualQueryExecuted:false,integrationVerified:false
});
const citation=(kind,id,version,asOf,locator)=>Object.freeze({kind,id,version,asOf,locator});
export function checkSyntheticAnswerEvidence(input){
 if(!object(input)||input.environment!=='synthetic-offline')return blocked('environment-not-synthetic');
 const {actor,documents,sql}=input;
 if(!string(actor)||!Array.isArray(documents)||!documents.length||!object(sql))
   return blocked('missing-actor-documents-or-sql');
 const seen=new Set(),citations=[];
 for(const doc of documents){
  if(!object(doc)||!['mineru','crawl4ai'].includes(doc.parser)||!object(doc.source)||
   !string(doc.source.id)||!string(doc.source.version)||!date(doc.source.asOf)||
   !string(doc.source.locator)||!string(doc.source.uri)||
   !doc.source.uri.startsWith('synthetic://')||
   (doc.parser==='mineru'&&!/^page:[1-9]\d*$/.test(doc.source.locator))||
   (doc.parser==='crawl4ai'&&!/^section:[a-z0-9-]+$/.test(doc.source.locator)))
   return blocked('document-source-provenance-invalid');
  if(seen.has(doc.source.id))return blocked('duplicate-document-source-id');
  seen.add(doc.source.id);
  if(!object(doc.access)||!['public','source-acl'].includes(doc.access.mode))
   return blocked('document-acl-unknown');
  if(doc.access.mode==='source-acl'&&
   (doc.access.edition!=='enterprise'||doc.access.sourceAclSynced!==true||
    !Array.isArray(doc.access.allowedActors)||!doc.access.allowedActors.includes(actor)))
   return blocked('document-access-not-proven');
  citations.push(citation(doc.parser,doc.source.id,doc.source.version,doc.source.asOf,doc.source.locator));
 }
 if(!string(sql.queryId)||!string(sql.metricId)||!string(sql.metricVersion)||
   !string(sql.modelVersion)||!string(sql.sourceSnapshotId)||!date(sql.asOf)||
   sql.dataClass!=='synthetic'||sql.readOnly!==true||
   sql.dryRunValidated!==true||sql.resultSynthetic!==true||
   !Array.isArray(sql.allowedActors)||!sql.allowedActors.includes(actor))
   return blocked('sql-provenance-or-authorization-invalid');
 citations.push(citation('sql',sql.queryId,sql.modelVersion,sql.asOf,sql.metricId+'@'+sql.metricVersion));
 if(documents.some(doc=>doc.source.asOf!==sql.asOf))
  return Object.freeze({decision:'separate-sources',reason:'as-of-cutoff-mismatch',
   citations,actualQueryExecuted:false,integrationVerified:false});
 return Object.freeze({decision:'candidate-supported',reason:'synthetic-source-metadata-valid',
  citations,actualQueryExecuted:false,integrationVerified:false});
}
