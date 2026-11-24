const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const view=require('../workflow-review.js');
const review=JSON.parse(fs.readFileSync('docs/RELATIONSHIP_AUDIT06_OPTIONS_REVIEW_20261124.json','utf8'));
const read=folder=>fs.readdirSync(path.join('data',folder)).filter(f=>f.endsWith('.json')).map(f=>JSON.parse(fs.readFileSync(path.join('data',folder,f),'utf8')));
const canonical={workflows:read('workflows'),combinations:read('combinations')};
const copy=()=>structuredClone(review);
const inspect=r=>view.inspect(r,canonical);

test('17 reviews and 58 existing Resource options are valid and read only',()=>{
 const before=JSON.stringify(canonical),a=inspect(review);
 assert.equal(a.ok,true,a.errors.join('; '));
 assert.equal(a.summary.reviewed,17);
 assert.equal(a.summary.memberOptions,58);
 assert.equal(a.byWorkflow.size,17);
 assert.equal(JSON.stringify(canonical),before);
});
test('all 17 original Resource IDs match source members, never unresolved labels',()=>{
 const a=inspect(review);
 for(const row of a.byWorkflow.values()){
  const combo=canonical.combinations.find(c=>c.id===row.id);
  assert.deepEqual(row.options.map(x=>x.resourceId).sort(),combo.members.map(x=>x.id).sort());
  for(const label of combo.unresolvedMembers||[])assert.ok(!row.options.some(x=>x.resourceId===label));
 }
});
test('stage-specific options preserve source order and are not presented as compatibility',()=>{
 const a=inspect(review);
 const stack=a.byWorkflow.get('stack');
 assert.deepEqual(view.optionsForStage(stack,0).map(x=>x.resourceId),['unclecode-crawl4ai','opendatalab-mineru']);
 assert.deepEqual(view.optionsForStage(stack,1).map(x=>x.resourceId),['onyx']);
 assert.deepEqual(view.optionsForStage(stack,2).map(x=>x.resourceId),['wrenai']);
 assert.equal(view.optionsForStage(stack,3).length,0);
 assert.ok(stack.options.every(x=>x.interoperabilityVerified===false));
});
test('unmapped member is shown as unresolved, not attached to a fabricated stage',()=>{
 const a=inspect(review),row=a.byWorkflow.get('spec-multi-agent-delivery-evidence-qa-stack');
 assert.deepEqual(view.unassignedOptions(row).map(x=>x.resourceId),['mattpocock-skills']);
 for(let i=0;i<6;i++)assert.ok(!view.optionsForStage(row,i).some(x=>x.resourceId==='mattpocock-skills'));
});
test('zero Resource workflows remain reviewable without fabricating candidates',()=>{
 const row=inspect(review).byWorkflow.get('goal-build-evidence-learning-loop');
 assert.equal(row.options.length,0);
 assert.deepEqual(view.optionsForStage(row,0),[]);
 assert.deepEqual(view.unassignedOptions(row),[]);
});
test('review JSON is missing: preview disabled, not an empty verified review',()=>{
 const a=view.inspect(null,canonical);
 assert.equal(a.ok,false);assert.equal(a.byWorkflow.size,0);
 assert.ok(a.errors.includes('missing-review-or-catalog'));
});
test('source missing: preview disabled rather than inventing tool references',()=>{
 const a=view.inspect(review,{combinations:[],workflows:[]});
 assert.equal(a.ok,false);assert.equal(a.byWorkflow.size,0);
});
test('unsafe migration or Graph promotion flags reject the entire review',()=>{
 for(const field of ['migrationApproved','graphPromotionApproved']){
  const r=copy();r[field]=true;assert.equal(inspect(r).ok,false);
 }
});
test('fake interoperability and cross-Workflow reuse claims cannot render as reviewed',()=>{
 const a=copy();a.cases[0].options[0].interoperabilityVerified=true;assert.equal(inspect(a).ok,false);
 const b=copy();b.cases[0].crossWorkflowReuseVerified=true;assert.equal(inspect(b).ok,false);
});
test('forged stage and source identity must fail closed',()=>{
 const a=copy();a.cases[0].options[0].stageIndexes=[999];assert.equal(inspect(a).ok,false);
 const b=copy();b.cases[0].title='fake';assert.equal(inspect(b).ok,false);
});
test('mismatched member, missing row or duplicate row rejects whole review',()=>{
 const a=copy();a.cases[0].options[0].resourceId='unknown';assert.equal(inspect(a).ok,false);
 const b=copy();b.cases.pop();assert.equal(inspect(b).ok,false);
 const c=copy();c.cases.push(c.cases[0]);assert.equal(inspect(c).ok,false);
});
test('invalid candidate status, unsupported review lane and missing next evidence reject',()=>{
 const a=copy();a.cases[0].options[0].mappingStatus='runtime-verified';assert.equal(inspect(a).ok,false);
 const b=copy();b.cases[0].reviewLane='automatic-delete';assert.equal(inspect(b).ok,false);
 const c=copy();c.cases[0].nextEvidence='';assert.equal(inspect(c).ok,false);
});
test('helpers gracefully handle unknown stage and missing row',()=>{
 const a=inspect(review).byWorkflow.get('stack');
 assert.deepEqual(view.optionsForStage(a,-1),[]);
 assert.deepEqual(view.optionsForStage(null,0),[]);
 assert.deepEqual(view.unassignedOptions(null),[]);
 assert.match(view.laneLabel('safety-boundary-first'),/權限/);
 assert.match(view.sourceLabel('canonical-stage-text-only'),/原始 Workflow/);
});
