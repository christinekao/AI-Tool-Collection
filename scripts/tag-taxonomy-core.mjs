/**
 * Explicit, conservative Tag normalization from the single taxonomy.
 * Raw Canonical tags and category stay unchanged; tag mappings are hints only.
 */
export const normalizeTagKey=value=>String(value).normalize('NFKC').trim().toLowerCase().replace(/[\s_]+/g,'-').replace(/-+/g,'-');
export function vocabularyIndex(taxonomy){
 const dimensions=new Set((taxonomy.tagDimensions||[]).map(v=>v.id));
 const lookup=new Map(),errors=[];
 for(const item of taxonomy.tagVocabulary||[]){
  if(!dimensions.has(item.dimension))errors.push(item.id+': unknown dimension '+item.dimension);
  if(item.id!==normalizeTagKey(item.id))errors.push(item.id+': canonical ID is not normalized');
  for(const raw of [item.id,...(item.aliases||[])]){
   const key=normalizeTagKey(raw),other=lookup.get(key);
   if(other&&other.id!==item.id)errors.push(key+': maps to both '+other.id+' and '+item.id);
   lookup.set(key,item);
  }
 }
 if(errors.length)throw Error('Invalid Tag vocabulary:\n'+errors.join('\n'));
 return lookup;
}
export function normalizeTags(tags,taxonomy){
 const lookup=vocabularyIndex(taxonomy),recognized=new Map(),unmapped=[],rawSeen=new Set();
 for(const raw of tags||[]){
  if(typeof raw!=='string')throw Error('Tag must be string');
  const key=normalizeTagKey(raw);
  if(!key)continue;
  const item=lookup.get(key);
  if(item){
   const existing=recognized.get(item.id)||{id:item.id,dimension:item.dimension,sourceTags:[]};
   if(!existing.sourceTags.includes(raw))existing.sourceTags.push(raw);
   recognized.set(item.id,existing);
  }else if(!rawSeen.has(raw)){unmapped.push(raw);rawSeen.add(raw);}
 }
 return {normalized:[...recognized.values()].sort((a,b)=>a.dimension.localeCompare(b.dimension)||a.id.localeCompare(b.id)),unmapped};
}
export function buildTagIndex(catalog,taxonomy){
 const types=['resources','skills','concepts','prompts','combinations','workflows'],records={};
 const unique=new Set(),mappedUnique=new Set(),unknownCount=new Map();
 let count=0,mapped=0,unknown=0;
 const lookup=vocabularyIndex(taxonomy);
 for(const type of types)for(const item of catalog[type]||[]){
  const result=normalizeTags(item.tags,taxonomy);
  const key=item.entityType+'/'+item.id;
  records[key]={normalized:result.normalized,unmapped:result.unmapped};
  for(const raw of item.tags||[]){
   count++;unique.add(raw);
   if(lookup.has(normalizeTagKey(raw))){mapped++;mappedUnique.add(raw);}
   else{unknown++;unknownCount.set(raw,(unknownCount.get(raw)||0)+1);}
  }
 }
 const unmappedRanking=[...unknownCount].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));
 return {version:'1.0',source:'Canonical V2 tags (unchanged)',taxonomyVersion:taxonomy.version,normalizationVersion:taxonomy.tagNormalization.version,
  evidenceStatus:taxonomy.tagNormalization.provenance,
  summary:{records:Object.keys(records).length,tagInstances:count,uniqueRawTags:unique.size,mappedTagInstances:mapped,mappedUniqueRawTags:mappedUnique.size,unmappedTagInstances:unknown,unmappedUniqueRawTags:unique.size-mappedUnique.size,controlledVocabulary:taxonomy.tagVocabulary.length},
  commonUnmapped:unmappedRanking.slice(0,100).map(([tag,count])=>({tag,count})),records};
}
