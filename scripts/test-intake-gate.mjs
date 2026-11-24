#!/usr/bin/env node
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {reviewErrors,isContentChange,needsTagReview,shouldCheckIntake} from './check-intake-gate.mjs';
import {resolveResourceLayerLinks} from './resource-layer-links.mjs';
const taxonomy=JSON.parse(fs.readFileSync('data/taxonomy-v1.json','utf8'));
const sample=()=>({
 id:'sample-entry',title:'Sample',entityType:'resource',tags:[],classification:{primaryDomain:'software',secondaryDomains:[],contentFormat:'repository',capabilities:[]},
 source:{url:'https://example.org/source'},
 purpose:'從來源說明了解如何將指定格式的文字轉成可使用資料。',
 recommendation:'適合先評估文件資料轉換需求，尚未確認可直接安裝。',
 features:['來源文件說明能夠依指定格式轉換文字資料。'],
 readerGuide:{version:2,mappingVersion:2,useCases:[{id:'convert-text',title:'文字轉換',detail:'將來源描述中的文字資料轉成可供後續處理的格式。',evidenceRefs:['documented-conversion']}],start:['先閱讀來源說明確認實際支援的資料格式。'],limits:['目前僅查核文件，尚未確認實作及可安裝版本。']},
 agentEvidence:[{id:'documented-conversion',detail:'原始文件說明文字格式轉換的用途及適用情境。',locator:'原始來源文件的功能說明段落，尚未取得程式碼。',limitations:'僅有來源文字，未檢查實際程式碼及執行。',evidenceFields:['features.0','source.url'],evidenceStatus:'source-reviewed',runtimeStatus:'not-tested'}],
 intakeReview:{
  policyVersion:'1.0',sourceStatus:'source-checked',sourceEvidenceFields:['source.url'],sourceCheckedAt:'2026-11-19',
  dedupeReview:{decision:'new',checkedFields:['id','title'],reason:'已比對既有資料的名稱及來源，確認沒有相同項目。'},
  classificationReason:'根據原始問題與主要輸出判斷 Domain，不按 Host 名稱歸類。',
  tagReview:{decision:'all-mapped',reason:'原始 Tags 已依受控詞彙檢查，且沒有未匹配的標記。'},
  readingSpec:{id:'repo',status:'deferred',reason:'已有來源說明，但尚缺程式架構與可重建證據，不冒充完整 Repo Guide。'},
  layerReview:{status:'deferred',reason:'已有來源功能說明，先保留人類用途與可追溯的文件證據。',gap:'尚未取得固定版本程式碼與實際輸入輸出契約。',nextAction:'補查上游固定版本程式碼、介面、授權及測試方式。'},
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
 assert.ok(reviewErrors(c,'new',taxonomy).some(x=>x.includes('applied repo guide cannot defer mapping')));
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

test('Batch 03 regression: Intake rejects abbreviated tag and capability explanations',()=>{
 const p=sample();p.intakeReview.dedupeReview.decision='update';
 p.intakeReview.tagReview.reason='保留全部原始標籤。';
 p.intakeReview.capabilityReview.reason='尚未實測操作能力。';
 const failures=reviewErrors(p,'update',taxonomy);
 assert.ok(failures.some(s=>s.includes('tagReview.reason too short')));
 assert.ok(failures.some(s=>s.includes('capabilityReview.reason too short')));
 p.intakeReview.tagReview.reason='原有的 Tags 保留供歷史索引與檢索，不在此批新增、刪除或重分類任何標籤。';
 p.intakeReview.capabilityReview.reason='現階段沒有可實測的輸入輸出與操作契約，因此只記錄概念而不新增 Capability。';
 assert.deepEqual(reviewErrors(p,'update',taxonomy),[]);
});

test('New and substantively changed Resources cannot skip human/agent review',()=>{
 const x=sample();delete x.intakeReview.layerReview;
 assert.ok(reviewErrors(x,'new',taxonomy).some(e=>e.includes('layerReview: required status')));
 const legacy=structuredClone(x),edit=structuredClone(x);edit.purpose+=' 補充內容。';edit.intakeReview.dedupeReview.decision='update';
 assert.ok(reviewErrors(edit,'update',taxonomy,legacy).some(e=>e.includes('layerReview: required status')));
 const tagsOnly=structuredClone(legacy);tagsOnly.tags=['python'];tagsOnly.intakeReview.dedupeReview.decision='update';
 assert.deepEqual(reviewErrors(tagsOnly,'update',taxonomy,legacy),[]);
});
test('Mapped repositories retain real capability references and cannot downgrade',()=>{
 const x=JSON.parse(fs.readFileSync('data/resources/pydantic-pydantic-ai.json','utf8'));
 assert.deepEqual(reviewErrors(x,'update',taxonomy,x),[]);
 const fresh=structuredClone(x);fresh.intakeReview.dedupeReview.decision='new';
 assert.deepEqual(reviewErrors(fresh,'new',taxonomy),[]);
 delete fresh.readerGuide.mappingVersion;
 assert.ok(reviewErrors(fresh,'new',taxonomy).some(e=>e.includes('mapped requires mappingVersion')));
 const down=structuredClone(x);delete down.readerGuide.mappingVersion;down.intakeReview.layerReview.status='deferred';
 assert.ok(reviewErrors(down,'update',taxonomy,x).some(e=>e.includes('cannot remove or downgrade')));
 const broken=structuredClone(x);broken.readerGuide.useCases[0].capabilityRefs=['missing'];
 assert.ok(reviewErrors(broken,'update',taxonomy,x).some(e=>e.includes('dangling reference')));
});
test('Deferred source review needs an explicit gap, next action and evidence mapping',()=>{
 const x=sample();assert.deepEqual(reviewErrors(x,'new',taxonomy),[]);
 delete x.intakeReview.layerReview.nextAction;
 assert.ok(reviewErrors(x,'new',taxonomy).some(e=>e.includes('gap and nextAction')));
 const y=sample();delete y.readerGuide.mappingVersion;
 assert.ok(reviewErrors(y,'new',taxonomy).some(e=>e.includes('deferred requires evidence mappingVersion')));
 const z=sample();z.readerGuide.useCases[0].evidenceRefs=['unfounded'];
 assert.ok(reviewErrors(z,'new',taxonomy).some(e=>e.includes('dangling evidence reference')));
 const w=sample();w.agentEvidence[0].evidenceFields=['features.99'];
 assert.ok(reviewErrors(w,'new',taxonomy).some(e=>e.includes('invalid evidence field')));
});
test('Non-code Resources use local evidence links without invented source symbols',()=>{
 for(const format of ['service','application','collection','article','learning-guide','dataset','model','video']){
  const x=sample();x.classification.contentFormat=format;x.intakeReview.readingSpec={id:'standard',status:'applied'};
  x.intakeReview.layerReview={status:'evidence-linked',reason:'此資源的主要價值是使用情境與來源文件，不是重建程式碼。'};
  assert.deepEqual(reviewErrors(x,'new',taxonomy),[],format);
  const forward=resolveResourceLayerLinks(x,{caseId:'convert-text'});
  assert.equal(forward.evidence[0].id,'documented-conversion');
  assert.equal(forward.evidence[0].fields['features.0'],x.features[0]);
  assert.deepEqual(resolveResourceLayerLinks(x,{capabilityId:'documented-conversion'}).evidence[0].useCaseIds,['convert-text']);
  delete x.readerGuide.useCases[0].evidenceRefs;
  assert.ok(reviewErrors(x,'new',taxonomy).some(e=>e.includes('requires evidenceRefs')));
 }
 const repo=sample();repo.intakeReview.layerReview.status='evidence-linked';
 assert.ok(reviewErrors(repo,'new',taxonomy).some(e=>e.includes('repository/library must be mapped')));
});
test('Runtime claims use tested intake evidence, never source review alone',()=>{
 const x=sample();x.agentEvidence[0].runtimeStatus='verified';x.agentEvidence[0].runtimeEvidence='在隔離環境實際執行文字轉換案例並保留輸出。';
 assert.ok(reviewErrors(x,'new',taxonomy).some(e=>e.includes('invalid runtime claim')));
 x.intakeReview.verification={status:'tested',evidence:'使用合成文字資料進行實際格式轉換並保留結果。',testRun:{executedAt:'2026-11-24',scenario:'synthetic text conversion',result:'expected output observed'}};
 assert.deepEqual(reviewErrors(x,'new',taxonomy),[]);
});
