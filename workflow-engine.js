/* Pure workflow planner. It validates structural plans, never claims execution or real-world tool compatibility. */
(function(factory){
 const api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(typeof window!=='undefined')window.WorkflowEngine=api;
})(function(){
 'use strict';
 const TYPES={resource:'resources',skill:'skills',concept:'concepts',prompt:'prompts',workflow:'workflows',combination:'combinations'};
 const key=ref=>ref.type+':'+ref.id;
 function indexCatalog(catalog){
  const idx=new Map();
  for(const [type,plural] of Object.entries(TYPES)){
   for(const item of catalog?.[plural]||[])idx.set(type+':'+item.id,item);
  }
  return idx;
 }
 function validateRecipe(recipe,catalog){
  if(recipe?.schemaVersion!==1||!Array.isArray(recipe.stages)||!recipe.stages.length)throw Error('Invalid workflow recipe');
  const idx=indexCatalog(catalog),ids=new Set(),outputs=new Set();
  const allOutputs=new Set(recipe.stages.flatMap(s=>s.produces||[]));
  for(const stage of recipe.stages){
   if(!stage.id||ids.has(stage.id))throw Error('Duplicate or missing stage ID');
   ids.add(stage.id);
   if(!Array.isArray(stage.requires)||!Array.isArray(stage.produces)||!Array.isArray(stage.candidates)||!stage.candidates.length)throw Error('Invalid stage '+stage.id);
   if(new Set(stage.produces).size!==stage.produces.length)throw Error('Repeated stage output '+stage.id);
   for(const required of stage.requires)if(!outputs.has(required))throw Error('Stage requires unavailable earlier output: '+stage.id+'/'+required);
   for(const produced of stage.produces){if(outputs.has(produced))throw Error('Repeated workflow output: '+produced);outputs.add(produced)}
   const seen=new Set();
   for(const candidate of stage.candidates){
    if(!TYPES[candidate.type]||!candidate.id||!candidate.why||!candidate.evidenceField)throw Error('Incomplete candidate at '+stage.id);
    const k=key(candidate),rec=idx.get(k);
    if(seen.has(k))throw Error('Duplicate candidate at '+stage.id);
    seen.add(k);
    if(!rec||!String(rec[candidate.evidenceField]||'').trim())throw Error('Candidate lacks source-backed evidence: '+k);
   }
  }
  if(recipe.sourceWorkflowRef&&!idx.has(key(recipe.sourceWorkflowRef)))throw Error('Recipe source Workflow does not exist');
  return true;
 }
 function defaultChoices(recipe){return Object.fromEntries(recipe.stages.map(s=>[s.id,key(s.candidates[0])]))}
 function compose(recipe,choices={}){
  const produced=new Set(),steps=[],gaps=[];
  for(const stage of recipe.stages){
   const choice=Object.prototype.hasOwnProperty.call(choices,stage.id)?choices[stage.id]:key(stage.candidates[0]);
   const known=stage.candidates.some(x=>key(x)===choice);
   if(choice!==null&&!known)throw Error('Unknown option for '+stage.id+': '+choice);
   const missingInputs=stage.requires.filter(x=>!produced.has(x));
   let status;
   if(choice===null)status=stage.optional?'skipped':'missing';
   else if(missingInputs.length)status='blocked';
   else status='planned';
   if(status==='planned')stage.produces.forEach(x=>produced.add(x));
   if(status==='missing')gaps.push(stage.title+'：尚未選擇必要工具');
   if(status==='blocked')gaps.push(stage.title+'：缺少 '+missingInputs.join('、'));
   steps.push({...stage,selection:choice,status,missingInputs});
  }
  return {steps,gaps,structurallyPlanned:gaps.length===0,produced:[...produced],verified:false};
 }
 return {indexCatalog,validateRecipe,defaultChoices,compose,key};
});