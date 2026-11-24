#!/usr/bin/env node
/**
 * Shared, forward-looking intake contract for all six Canonical entity types.
 * CLI: node scripts/check-intake-gate.mjs --base <git-sha> --head <git-sha>
 * Does not change files. Historical records are exempt until content changes.
 */
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {resolve, dirname} from 'node:path';
import {isDeepStrictEqual} from 'node:util';
import {normalizeTags,normalizeTagKey,vocabularyIndex} from './tag-taxonomy-core.mjs';
import {validateResourceIntakeLayers} from './resource-layer-links.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const types={resources:'resource',skills:'skill',concepts:'concept',prompts:'prompt',combinations:'combination',workflows:'workflow'};
const isCanonical=p=>/^data\/(resources|skills|concepts|prompts|combinations|workflows)\/[^/]+\.json$/.test(p);
const nonempty=v=>typeof v==='string'&&v.trim().length>=12;
const sourceField=p=>/^(source(?:\.|$)|url$|repo$|prompt$|originalSharedText$|(?:resource|skill|prompt|concept|workflow|combination|example)Refs$)/.test(p);
const evidenceValue=(x,p)=>p.split('.').reduce((v,k)=>v?.[k],x);
const isPresent=v=>v!==undefined&&v!==null&&v!==''&&(!Array.isArray(v)||v.length>0);
export function isContentChange(before,after){
 if(!before)return true;
 const stripped=x=>{
   const y=structuredClone(x);
   for(const k of ['classification','updatedAt','tags'])delete y[k];
   return y;
 };
 return !isDeepStrictEqual(stripped(before),stripped(after));
}
/** Preserve legacy Tag cleanup, but require review for extra or new Tags. */
export function needsTagReview(before,after,taxonomy){
 if(!before)return true;
 const lookup=vocabularyIndex(taxonomy);
 const stable=tags=>new Set((tags||[]).map(raw=>{
  const key=normalizeTagKey(raw);
  return lookup.get(key)?.id||'raw:'+key;
 }));
 const prior=stable(before.tags);
 return [...stable(after.tags)].some(key=>!prior.has(key))||(after.tags||[]).length>(before.tags||[]).length;
}
export function reviewErrors(x,mode='new',taxonomy=null,previous=null){
 const problems=[],flag=(ok,label)=>{if(!ok)problems.push(label);};
 const type=x?.entityType, c=x?.classification, r=x?.intakeReview;
 flag(Object.values(types).includes(type),'entityType must be canonical');
 flag(c&&typeof c.primaryDomain==='string'&&c.primaryDomain.length>0,'classification.primaryDomain required');
 if(taxonomy){
   flag(taxonomy.domains.some(d=>d.id===c?.primaryDomain),'unknown primaryDomain');
   flag((c?.secondaryDomains||[]).every(d=>taxonomy.domains.some(t=>t.id===d.id||t.id===d)&&d!==c?.primaryDomain),'unknown secondaryDomain');
 }
 if(type==='resource')flag(c?.contentFormat&&(!taxonomy||taxonomy.contentFormats.some(f=>f.id===c.contentFormat)),'Resource requires known contentFormat');
 if(!r||typeof r!=='object'){problems.push('intakeReview required');return problems;}
 flag(r.policyVersion==='1.0','policyVersion must be 1.0');
 flag(['source-checked','provided-material','partial'].includes(r.sourceStatus),'sourceStatus invalid');
 flag(Array.isArray(r.sourceEvidenceFields)&&r.sourceEvidenceFields.length>0,'sourceEvidenceFields required');
 for(const p of r.sourceEvidenceFields||[]){
   flag(typeof p==='string'&&sourceField(p),'invalid sourceEvidenceFields path: '+p);
   flag(isPresent(evidenceValue(x,p)),'missing source evidence at: '+p);
 }
 if(r.sourceStatus==='source-checked')flag(/^\d{4}-\d{2}-\d{2}$/.test(r.sourceCheckedAt||''),'source-checked requires sourceCheckedAt');
 if(r.sourceStatus==='partial')flag(nonempty(r.sourceGap),'partial requires meaningful sourceGap');
 flag(r.dedupeReview?.decision===mode,'dedupeReview.decision must be '+mode);
 flag(Array.isArray(r.dedupeReview?.checkedFields)&&r.dedupeReview.checkedFields.length>=2,'dedupe checkedFields must contain >=2 fields');
 for(const p of r.dedupeReview?.checkedFields||[])flag(typeof p==='string'&&isPresent(evidenceValue(x,p)),'dedupe checked field missing: '+p);
 flag(nonempty(r.dedupeReview?.reason),'dedupeReview.reason too short');
 flag(nonempty(r.classificationReason),'classificationReason too short');
 const tagReview=r.tagReview;
 flag(['all-mapped','retain-unmapped','new-vocabulary-proposed'].includes(tagReview?.decision),'tagReview.decision required');
 flag(nonempty(tagReview?.reason),'tagReview.reason too short');
 flag(Array.isArray(x.tags),'tags must be an array');
 if(taxonomy&&Array.isArray(x.tags)){
  const normalized=normalizeTags(x.tags,taxonomy);
  if(tagReview?.decision==='all-mapped')flag(normalized.unmapped.length===0,'all-mapped conflicts with unmapped Tags');
  if(tagReview?.decision==='retain-unmapped')flag(normalized.unmapped.length>0,'retain-unmapped requires unresolved Tags');
  if(tagReview?.decision==='new-vocabulary-proposed'){
   flag(normalized.unmapped.length>0,'new-vocabulary-proposed requires unresolved Tags');
   flag(Array.isArray(tagReview.proposedTerms)&&tagReview.proposedTerms.length>0&&tagReview.proposedTerms.every(term=>normalized.unmapped.includes(term)),'proposedTerms must name unresolved Tags');
  }
  const previousRaw=new Set((previous?.tags||[]).map(normalizeTagKey));
  const newlyUnmapped=normalized.unmapped.filter(raw=>mode==='new'||!previous||!previousRaw.has(normalizeTagKey(raw)));
  for(const raw of newlyUnmapped)flag(nonempty(tagReview?.unmappedJustifications?.[raw]),'unmapped Tag needs individual justification: '+raw);
  if(mode==='new'){
   const lookup=vocabularyIndex(taxonomy),seen=new Set();
   for(const raw of x.tags){
    const key=normalizeTagKey(raw),id=lookup.get(key)?.id||'raw:'+key;
    flag(!seen.has(id),'redundant normalized Tag: '+raw);
    seen.add(id);
   }
  }
 }
 const reading=r.readingSpec, format=reading?.id;
 const allowedByType={resource:['repo','learning','standard'],skill:['skill'],prompt:['prompt'],concept:['standard'],workflow:['standard'],combination:['standard']};
 flag(Boolean(allowedByType[type]?.includes(format)),'readingSpec.id does not match Entity Type');
 flag(['applied','deferred'].includes(reading?.status),'readingSpec.status invalid');
 if(reading?.status==='deferred')flag(nonempty(reading.reason),'deferred readingSpec needs reason');
 const guides={repo:'repoGuide',learning:'learningGuide',skill:'skillGuide',prompt:'promptGuide'};
 if(reading?.status==='applied'&&guides[format])flag(isPresent(x[guides[format]]),'applied '+format+' requires '+guides[format]);
 const cap=r.capabilityReview;
 flag(['mapped','none'].includes(cap?.decision),'capabilityReview.decision invalid');
 flag(nonempty(cap?.reason),'capabilityReview.reason too short');
 if(cap?.decision==='mapped')flag(Array.isArray(c?.capabilities)&&c.capabilities.length>0,'mapped requires evidence-backed capabilities');
 if(cap?.decision==='none')flag(!c?.capabilities?.length,'none conflicts with mapped capabilities');
 flag(['reused','candidate','none'].includes(r.conceptReview?.decision),'conceptReview.decision invalid');
 flag(nonempty(r.conceptReview?.reason),'conceptReview.reason too short');
 flag(nonempty(r.riskNotes),'riskNotes too short');
 flag(['not-tested','tested'].includes(r.verification?.status),'verification.status invalid');
 flag(nonempty(r.verification?.evidence),'verification evidence/limitation required');
 if(r.verification?.status==='tested')flag(Boolean(r.verification?.testRun?.executedAt&&r.verification?.testRun?.scenario&&r.verification?.testRun?.result),'tested requires actual testRun evidence');
 const layerContentChange=!previous||isContentChange({...previous,intakeReview:undefined},{...x,intakeReview:undefined});
 const layerAlreadyReviewed=Boolean(previous?.intakeReview?.layerReview||r.layerReview||previous?.readerGuide?.mappingVersion||x.readerGuide?.mappingVersion);
 if(type==='resource'&&(mode==='new'||layerContentChange||layerAlreadyReviewed))problems.push(...validateResourceIntakeLayers(x,previous));
 return problems;
}
/** Do not revalidate a previously reviewed record solely for a classification-only edit. */
export function shouldCheckIntake(previous,current,taxonomy){
 return isContentChange(previous,current)||needsTagReview(previous,current,taxonomy)||
  Boolean(previous&&!isDeepStrictEqual(previous.intakeReview,current.intakeReview));
}
export function reviewChanges(base,head,readCurrent,readBase,taxonomy){
 const changes=execFileSync('git',['diff','--name-only','--diff-filter=AM','--no-renames',base,head,'--',
   ...Object.keys(types).map(p=>'data/'+p+'/')],{cwd:root,encoding:'utf8'}).trim().split('\n').filter(isCanonical);
 const outcomes=[],errors=[];
 for(const path of changes){
  const current=readCurrent(path),previous=readBase(path);
  const enforce=shouldCheckIntake(previous,current,taxonomy);
  if(!enforce){outcomes.push({path,status:'legacy-classification-or-tag-cleanup-exempt'});continue;}
  const status=previous?'update':'new';
  const issues=reviewErrors(current,status,taxonomy,previous);
  if(issues.length)errors.push(...issues.map(msg=>path+': '+msg));
  outcomes.push({path,status:issues.length?'FAIL':'PASS',changeType:status});
 }
 return {changed:changes.length,checked:outcomes.filter(x=>x.status!=='unchanged-content-exempt').length,errors,outcomes};
}
const invoked=process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(invoked){
 const args=process.argv.slice(2),base=args[args.indexOf('--base')+1],head=args[args.indexOf('--head')+1];
 if(!base||!head||base.startsWith('--')||head.startsWith('--'))throw Error('Usage: --base SHA --head SHA');
 const get=p=>JSON.parse(fs.readFileSync(resolve(root,p),'utf8'));
 const readBase=p=>{try{return JSON.parse(execFileSync('git',['show',base+':'+p],{cwd:root,encoding:'utf8',stdio:['ignore','pipe','ignore']}));}catch{return null;}};
 const result=reviewChanges(base,head,get,readBase,get('data/taxonomy-v1.json'));
 process.stdout.write(JSON.stringify({ok:result.errors.length===0,...result},null,2)+'\n');
 if(result.errors.length)process.exitCode=1;
}
