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
