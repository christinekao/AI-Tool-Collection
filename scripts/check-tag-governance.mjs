#!/usr/bin/env node
/**
 * Lean Tags gate: prevent automatic vocabulary sprawl and noisy additions.
 * Historical Canonical tags are preserved, including large existing lists.
 * New controlled vocab requires evidence + explicit adoption review.
 */
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {normalizeTagKey,vocabularyIndex} from './tag-taxonomy-core.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dirs=['resources','skills','concepts','prompts','combinations','workflows'];
const canonical=/^data\/(resources|skills|concepts|prompts|combinations|workflows)\/[^/]+\.json$/;
const uniq=a=>new Set(a).size===a.length;
const meaningful=s=>typeof s==='string'&&s.trim().length>=24;

export function recordTagProblems(before,after,taxonomy){
 const err=[],rule=taxonomy.tagGovernance;
 const previous=new Set((before?.tags||[]).map(normalizeTagKey));
 const proposed=after?.tags||[];
 if(!Array.isArray(proposed)){return ['tags must be an array'];}
 const added=proposed.filter(t=>!previous.has(normalizeTagKey(t)));
 if(!before&&proposed.length>rule.maxTagsForNewRecord)err.push('new Canonical record exceeds '+rule.maxTagsForNewRecord+' raw Tags');
 if(before&&added.length>rule.maxAddedTagsForExistingRecord)err.push('existing record adds more than '+rule.maxAddedTagsForExistingRecord+' Tags in one update');
 const vocab=vocabularyIndex(taxonomy),seen=new Set();
 const candidate=before?added:proposed;
 const rawCanon=new Set();
 for(const t of candidate){
  if(typeof t!=='string'){err.push('Tag is not a string');continue;}
  const key=normalizeTagKey(t),id=vocab.get(key)?.id||key;
  if(!key||rule.genericTagsToReject.includes(key))err.push('new Tag is empty/generic: '+t);
  if(!before&&seen.has(id))err.push('new record repeats canonical Tag or alias: '+id);
  seen.add(id);
  if(before&&(before.tags||[]).some(old=>{const other=normalizeTagKey(old);return (vocab.get(other)?.id||other)===id;}))
   err.push('new Tag duplicates existing canonical Tag or alias: '+t);
  if([after?.classification?.primaryDomain,...(after?.classification?.secondaryDomains||[])].includes(key))
   err.push('Tag repeats Domain already stored in classification: '+t);
  rawCanon.add(key);
 }
 if(!before&& !uniq(proposed.map(t=>normalizeTagKey(t))))err.push('new record has repeated raw Tag');
 return err;
}
export function vocabularyProblems(before,after,catalog){
 const errors=[],baseEntries=new Map((before.tagVocabulary||[]).map(v=>[v.id,v])),
       newEntries=after.tagVocabulary||[],rules=after.tagGovernance;
 if(!rules||rules.policy!=='reuse-first-no-automatic-vocabulary-expansion')return ['missing lean Tag governance'];
 if(newEntries.length<(before.tagVocabulary||[]).length)
  errors.push('removing vocabulary items requires separate review; cannot happen silently');
 const names=new Set();
 const all=dirs.flatMap(type=>catalog[type]||[]);
 const matchingRecords=(item)=>{
  const matches=new Set([item.id,...(item.aliases||[])].map(normalizeTagKey));
  return all.filter(record=>(record.tags||[]).some(x=>matches.has(normalizeTagKey(x)))).map(x=>x.entityType+'/'+x.id);
 };
 for(const item of newEntries){
  if(names.has(item.id))errors.push('duplicate vocabulary ID: '+item.id);
  names.add(item.id);
  const old=baseEntries.get(item.id), addedAliases=(item.aliases||[]).filter(x=>!old?.aliases?.includes(x));
  if(old&&addedAliases.length===0)continue;
  const count=matchingRecords(item);
  if(!old){
   if(rules.genericTagsToReject.includes(item.id))errors.push('generic Tag cannot be adopted: '+item.id);
   if(count.length<rules.minRecordsForNewVocabulary)errors.push('new vocabulary '+item.id+' needs at least '+rules.minRecordsForNewVocabulary+' distinct existing records; currently '+count.length);
   const r=item.adoptionReview;
   if(!meaningful(r?.whyExistingInsufficient)||!meaningful(r?.userBenefit))
    errors.push('new vocabulary '+item.id+' needs rationale explaining why existing tags cannot cover it and how retrieval improves');
   if(!Array.isArray(r?.evidenceRecordIds)||r.evidenceRecordIds.length<rules.minRecordsForNewVocabulary||
      !uniq(r.evidenceRecordIds)||!r.evidenceRecordIds.every(id=>count.includes(id)))
    errors.push('new vocabulary '+item.id+' needs '+rules.minRecordsForNewVocabulary+' real evidenceRecordIds that use its raw Tag or aliases');
  } else {
   if(addedAliases.length>2)errors.push('too many new aliases for '+item.id+' in one update');
   for(const alias of addedAliases){
    const k=normalizeTagKey(alias);
    if(!all.some(x=>(x.tags||[]).some(t=>normalizeTagKey(t)===k)))
     errors.push('alias has no current raw Tag usage: '+alias);
   }
  }
 }
 return errors;
}
export function checkChanges(beforeTax,afterTax,catalog,changes,previousRecords){
 const errors=[],summaries=[];
 errors.push(...vocabularyProblems(beforeTax,afterTax,catalog));
 for(const [filename,current] of changes){
  const prev=previousRecords.get(filename)||null;
  const issues=recordTagProblems(prev,current,afterTax);
  for(const reason of issues)errors.push(filename+': '+reason);
  summaries.push({path:filename,addedTags:current.tags?.filter(x=>!prev?.tags?.includes(x)).length||0});
 }
 return {ok:errors.length===0,errors,reviewedRecords:summaries.length,summaries};
}
const invoked=process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(invoked){
 const args=process.argv.slice(2),base=args[args.indexOf('--base')+1],head=args[args.indexOf('--head')+1];
 if(!base||!head||base.startsWith('--')||head.startsWith('--'))throw Error('Usage: --base SHA --head SHA');
 const git=(args)=>execFileSync('git',args,{cwd:root,encoding:'utf8',stdio:['ignore','pipe','ignore']});
 const at=(ref,p)=>{try{return JSON.parse(git(['show',ref+':'+p]));}catch{return null;}};
 const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
 const oldTax=at(base,'data/taxonomy-v1.json')||read('data/taxonomy-v1.json'),newTax=read('data/taxonomy-v1.json');
 const files=git(['diff','--name-only','--diff-filter=AM','--no-renames',base,head,'--',...dirs.map(x=>'data/'+x+'/')]).trim().split('\n').filter(x=>canonical.test(x));
 const changes=files.map(file=>[file,read(file)]),previous=new Map(files.map(file=>[file,at(base,file)]));
 const result=checkChanges(oldTax,newTax,read('data/catalog-v2.json'),changes,previous);
 process.stdout.write(JSON.stringify(result,null,2)+'\n');
 if(!result.ok)process.exitCode=1;
}
