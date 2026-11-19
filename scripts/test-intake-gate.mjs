#!/usr/bin/env node
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {reviewErrors,isContentChange,needsTagReview,shouldCheckIntake} from './check-intake-gate.mjs';
const taxonomy=JSON.parse(fs.readFileSync('data/taxonomy-v1.json','utf8'));
const sample=()=>({
 id:'sample-entry',title:'Sample',entityType:'resource',tags:[],classification:{primaryDomain:'software',secondaryDomains:[],contentFormat:'repository',capabilities:[]},
 source:{url:'https://example.org/source'},
 intakeReview:{
  policyVersion:'1.0',sourceStatus:'source-checked',sourceEvidenceFields:['source.url'],sourceCheckedAt:'2026-11-19',
  dedupeReview:{decision:'new',checkedFields:['id','title'],reason:'已比對既有資料的名稱及來源，確認沒有相同項目。'},
  classificationReason:'根據原始問題與主要輸出判斷 Domain，不按 Host 名稱歸類。',
  tagReview:{decision:'all-mapped',reason:'原始 Tags 已依受控詞彙檢查，且沒有未匹配的標記。'},
  readingSpec:{id:'repo',status:'deferred',reason:'已有來源說明，但尚缺程式架構與可重建證據，不冒充完整 Repo Guide。'},
  capabilityReview:{decision:'none',reason:'目前尚無來源支援完整的 Input／Output 與驗收 Gate。'},
  conceptReview:{decision:'candidate',reason:'比對既有 Concept 後先留下候選關聯，未宣稱相容。'},
  riskNotes:'需在實際安裝前核對授權與外部資料傳送風險，不會自動執行。',
  verification:{status:'not-tested',evidence:'尚未執行原始工具，並無 Runtime 或整合測試結果。'}
 }
});
test('all six Entity Types use one intake-review contract',()=>{
 const x=sample();assert.deepEqual(reviewErrors(x,'new',taxonomy),[]);
 for(const [type,guide] of [['skill','skill'],['prompt','prompt'],['concept','standard'],['workflow','standard'],['combination','standard']]){
  const c=sample();c.entityType=type;c.intakeReview.readingSpec.id=guide;
  delete c.classification.contentFormat;
  assert.deepEqual(reviewErrors(c,'new',taxonomy),[],type);
 }
});
test('new or meaningful update needs the contract',()=>{
 const c=sample();delete c.intakeReview;
 assert.ok(reviewErrors(c,'new',taxonomy).includes('intakeReview required'));
 const valid=sample();valid.intakeReview.dedupeReview.decision='update';
 assert.deepEqual(reviewErrors(valid,'update',taxonomy),[]);
 assert.ok(reviewErrors(valid,'new',taxonomy).some(x=>x.includes('dedupeReview.decision')));
});
test('source and upstream checking may not be invented',()=>{
 const c=sample();c.intakeReview.sourceEvidenceFields=['title'];
 assert.ok(reviewErrors(c,'new',taxonomy).some(x=>x.includes('invalid sourceEvidenceFields')));
 c.intakeReview.sourceEvidenceFields=['source.missing'];
 assert.ok(reviewErrors(c,'new',taxonomy).some(x=>x.includes('missing source evidence')));
 c.intakeReview.sourceEvidenceFields=['source.url'];delete c.intakeReview.sourceCheckedAt;
 assert.ok(reviewErrors(c,'new',taxonomy).some(x=>x.includes('sourceCheckedAt')));
 c.intakeReview.sourceStatus='partial';
 assert.ok(reviewErrors(c,'new',taxonomy).some(x=>x.includes('sourceGap')));
});
test('special reading spec cannot claim applied without actual Guide',()=>{
 const c=sample();c.intakeReview.readingSpec.status='applied';
 assert.ok(reviewErrors(c,'new',taxonomy).some(x=>x.includes('requires repoGuide')));
 c.repoGuide={overview:'Provides a documented overview'};
 assert.deepEqual(reviewErrors(c,'new',taxonomy),[]);
});
test('Capability claims and verified tests require evidence',()=>{
 const c=sample();c.intakeReview.capabilityReview.decision='mapped';
 assert.ok(reviewErrors(c,'new',taxonomy).some(x=>x.includes('mapped requires')));
 c.intakeReview.capabilityReview.decision='none';c.intakeReview.verification.status='tested';
 assert.ok(reviewErrors(c,'new',taxonomy).some(x=>x.includes('testRun evidence')));
});
test('classification-only and original Tags corrections do not trigger legacy rewrite',()=>{
 const prior=sample();delete prior.intakeReview;
 const now=structuredClone(prior);
 now.classification.primaryDomain='data';now.updatedAt='2026-11-19';
 assert.equal(isContentChange(prior,now),false);
 assert.equal(needsTagReview(prior,now,taxonomy),false);
 now.tags.push('new-tag');
 assert.equal(isContentChange(prior,now),false);
 assert.equal(needsTagReview(prior,now,taxonomy),true);
 now.purpose='Can be used for something new';assert.equal(isContentChange(prior,now),true);
});

test('New intake must review mapped and unresolved Tags',()=>{
 const x=sample();delete x.intakeReview.tagReview;
 assert.ok(reviewErrors(x,'new',taxonomy).some(s=>s.includes('tagReview.decision')));
 const y=sample();y.tags=['unknown-long-tail-token'];
 assert.ok(reviewErrors(y,'new',taxonomy).some(s=>s.includes('all-mapped conflicts')));
 y.intakeReview.tagReview={decision:'retain-unmapped',reason:'這是來源獨有術語，留在原始 Tags 等待證據後再補受控詞彙。'};
 assert.ok(reviewErrors(y,'new',taxonomy).some(s=>s.includes('individual justification')));
 y.intakeReview.tagReview.unmappedJustifications={'unknown-long-tail-token':'來源專有識別名稱，能協助搜尋但不應成為全域受控分類。'};
 assert.deepEqual(reviewErrors(y,'new',taxonomy),[]);
});

test('Tag additions require Intake Review; removals and alias replacements remain safe',()=>{
 const old=sample();old.tags=['MIT','python','legacy-identifier'];
 const cleaned=structuredClone(old);cleaned.tags=['mit-license','python'];
 assert.equal(needsTagReview(old,cleaned,taxonomy),false);
 const expanded=structuredClone(old);expanded.tags.push('new-identifier');
 assert.equal(needsTagReview(old,expanded,taxonomy),true);
 const redundant=structuredClone(old);redundant.tags.push('mit-license');
 assert.equal(needsTagReview(old,redundant,taxonomy),true);
 const changed=structuredClone(old);changed.tags=['MIT','python','another-identifier'];
 assert.equal(needsTagReview(old,changed,taxonomy),true);
 const reviewed=structuredClone(expanded);
 reviewed.intakeReview.dedupeReview.decision='update';
 reviewed.intakeReview.tagReview={decision:'retain-unmapped',reason:'保留來源獨有名稱供追溯，不把它誤當通用能力分類。'};
 assert.ok(reviewErrors(reviewed,'update',taxonomy,old).some(s=>s.includes('new-identifier')));
 reviewed.intakeReview.tagReview.unmappedJustifications={'new-identifier':'來源獨有辨識名稱，用於追溯原始文件，不建立成通用詞彙。'};
 assert.deepEqual(reviewErrors(reviewed,'update',taxonomy,old),[]);
});
test('New intake rejects redundant synonyms and unexplained proposed vocabulary',()=>{
 const x=sample();x.tags=['MIT','mit-license'];
 assert.ok(reviewErrors(x,'new',taxonomy).some(s=>s.includes('redundant normalized Tag')));
 const y=sample();y.tags=['special-term'];
 y.intakeReview.tagReview={decision:'new-vocabulary-proposed',reason:'特定來源使用的關鍵字，需要複核才可升格成正式標籤。',
  unmappedJustifications:{'special-term':'來源獨有的專案術語，尚需確認是否適合通用使用。'}};
 assert.ok(reviewErrors(y,'new',taxonomy).some(s=>s.includes('proposedTerms')));
 y.intakeReview.tagReview.proposedTerms=['special-term'];
 assert.deepEqual(reviewErrors(y,'new',taxonomy),[]);
});

test('Previously reviewed classification-only updates do not misinterpret original new-decision as update',()=>{
 const old=sample();
 const classified=structuredClone(old);classified.classification.primaryDomain='data';
 assert.equal(shouldCheckIntake(old,classified,taxonomy),false);
 const evidenceEdit=structuredClone(old);evidenceEdit.intakeReview.riskNotes+=' 補充審查。';
 assert.equal(shouldCheckIntake(old,evidenceEdit,taxonomy),true);
 const contentEdit=structuredClone(old);contentEdit.purpose='new objective';
 assert.equal(shouldCheckIntake(old,contentEdit,taxonomy),true);
});
