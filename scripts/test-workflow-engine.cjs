const test=require('node:test');
const assert=require('node:assert/strict');
const engine=require('../workflow-engine.js');
const fs=require('node:fs');
const recipe=JSON.parse(fs.readFileSync('data/workflow-recipes/website-build-review.json','utf8'));
const catalog=JSON.parse(fs.readFileSync('data/catalog-v2.json','utf8'));
test('source-backed recipe has existing stages, tools and evidence',()=>assert.equal(engine.validateRecipe(recipe,catalog),true));
test('planned route is not confused with executed tool compatibility',()=>{
 const plan=engine.compose(recipe,engine.defaultChoices(recipe));
 assert.equal(plan.structurallyPlanned,true);assert.equal(plan.verified,false);
 assert.equal(plan.steps.every(x=>x.status==='planned'),true);
});
test('dropping optional visual design allows scope → build → review',()=>{
 const choices=engine.defaultChoices(recipe);choices.visual=null;
 const plan=engine.compose(recipe,choices);
 assert.equal(plan.steps[1].status,'skipped');
 assert.equal(plan.steps[2].status,'planned');assert.equal(plan.steps[3].status,'planned');
 assert.equal(plan.structurallyPlanned,true);
});
test('removing required build blocks downstream review; cannot silently connect stages',()=>{
 const choices=engine.defaultChoices(recipe);choices.build=null;
 const plan=engine.compose(recipe,choices);
 assert.equal(plan.steps[2].status,'missing');
 assert.equal(plan.steps[3].status,'blocked');
 assert.ok(plan.steps[3].missingInputs.includes('website-code'));
 assert.equal(plan.structurallyPlanned,false);
});
test('switching the implementation candidate re-evaluates and reconnects valid stages',()=>{
 const choices=engine.defaultChoices(recipe);choices.build=null;
 assert.equal(engine.compose(recipe,choices).structurallyPlanned,false);
 choices.build='resource:openai-codex';
 assert.equal(engine.compose(recipe,choices).structurallyPlanned,true);
});
test('reject unknown tool and forward dependency',()=>{
 const choices=engine.defaultChoices(recipe);choices.build='resource:invented';
 assert.throws(()=>engine.compose(recipe,choices),/Unknown option/);
 const changed=structuredClone(recipe);changed.stages[0].requires=['website-code'];
 assert.throws(()=>engine.validateRecipe(changed,catalog),/unavailable earlier output/);
});

const curatedRecipeIds=['website-build-review','agent-delivery-qa','enterprise-knowledge-qa'];
const loadRecipe=id=>JSON.parse(fs.readFileSync('data/workflow-recipes/'+id+'.json','utf8'));
test('all recommended recipes have traceable candidates and a structurally complete default plan',()=>{
 for(const id of curatedRecipeIds){
  const current=loadRecipe(id);
  assert.equal(engine.validateRecipe(current,catalog),true,id+' has invalid evidence');
  const plan=engine.compose(current,engine.defaultChoices(current));
  assert.equal(plan.structurallyPlanned,true,id+' missing a required stage');
  assert.equal(plan.verified,false,id+' must never claim executed verification');
 }
});
test('agent delivery removing implementation prevents independent QA and delivery',()=>{
 const current=loadRecipe('agent-delivery-qa');
 const selections=engine.defaultChoices(current);
 selections.coding=null;
 const plan=engine.compose(current,selections);
 assert.equal(plan.structurallyPlanned,false);
 assert.equal(plan.steps.find(s=>s.id==='review').status,'blocked');
 assert.equal(plan.steps.find(s=>s.id==='qa').status,'blocked');
 assert.equal(plan.steps.find(s=>s.id==='delivery').status,'blocked');
});
test('enterprise knowledge without ingestion cannot complete retrieval or source review',()=>{
 const current=loadRecipe('enterprise-knowledge-qa');
 const selections=engine.defaultChoices(current);
 selections.ingest=null;
 const plan=engine.compose(current,selections);
 assert.equal(plan.structurallyPlanned,false);
 for(const id of ['index','answer','review'])assert.equal(plan.steps.find(s=>s.id===id).status,'blocked');
});
