# Resource 內容品質稽核 Batch 02｜20 筆（2026-11-26）

## Scope / Evidence
基準 main `1638076455f4dbfbeb41dc8fafa4bbfe3e90c995`；PR #122 最新 Head 9dd74be86883806cecd1c5586e6a01a9e7842ab0 四項 CI PASS（45772573844、45772573867、45772573829、45772573839），四尺寸本機 Browser PASS；合併 91d42d4c8c367eea042ccaf5b6386dcc8324c42f。Catalog Sync 45774603696 PASS；生成提交僅改 catalog-v2.json 與 knowledge-graph-v1.json，後者只更新六筆既有節點 summary/searchText，無新增或刪除 Graph 關係。Pages 45774623195 PASS；合併後 P1 45774603690 尚在執行；實際 deployed Chromium 未驗收。

依固定 Canonical ID 順序讀取第 21–40 筆，共 20 筆完整 JSON。逐筆比較 purpose、useCases、example I/O/steps/destination、start、limits、source review scope、Agent Layer 既有 evidence locator、限制與 runtimeStatus。此輪依既有來源證據進行內容審查；未重新讀取全部上游、未安裝或執行第三方、未宣稱實際成果。

| ID | 結果 | 問題／修正或保留理由 | 既有來源錨點 |
|---|---|---|---|
| alsyundawy-microsoft-office-for-macos | P1 修正 | 具體官方版本、授權與渠道核對；原封存索引只作治理風險案例 | Microsoft update history / deployment / install |
| amp-agent-memory-protocol | P1 修正 | 兩個測試專案、權重非事實、過期／跨專案／隱私反例 | compile_index.ts / amp-recall.mjs / secret-scan.mjs |
| anime-js | 保留 | 三張功能卡片、時間軸、Scope 還原及靜態替代已明確 | animation.js / timeline.js / scope.js |
| anomalyco-opencode | P1 修正 | Batch 93 既有 child-shell-mcp-audit 用途未納入 example；新增同名步驟及既有引用、同步 process，釐清歷史及現行局部證據，不升級 deferred | subagent.ts / session.ts / permissions.ts / mcp/index.ts |
| ant-design-ant-design | 保留 | 申請表、管理清單、手機閱讀及前後端權限區隔具體 | Form.tsx / InternalTable.tsx |
| anthropic-claude-mythos-cybersecurity | P1 修正 | purpose 聚焦防禦採用與治理，將 5.1/5.2 比對明確標記為 2026-11-26 已查閱的歷史頁面；未核准不申請或執行 | 官方 Mythos availability / safeguards / benchmarks |
| anthropic-solving-code-review-at-anthropic | P1 修正 | 以表單修復、Commit 綁定核准與可回復發布替代泛用起手 | Layer by layer / Human approval / Merge and after |
| anthropics-financial-services | P1 修正 | 對帳差異、Reader/審查、結構與數字區分、專業核准 | validate.py / orchestrate.py / deploy-managed-agent.sh |
| anthropics-knowledge-work-plugins | P1 修正 | 具體 SQL、分母、Join 粒度、PR Diff，分離技能選用與連線授權 | validate-data / code-review / data/.mcp.json |
| anthropics-sandbox-runtime | P1 修正 | 測試路徑與網路、啟動政策與動態更新區分、實際隔離仍待測 | cli.ts / sandbox-manager.ts / schema |
| anthropics-single-agent-loop-kit | P1 修正 | 同一客服評估集、品質與成本基準、逐次改動與回退條件 | compare.py / chain_coverage.py / as-tool / loop.py |
| anthropics-skills | 保留 | 重複工作、觸發、四種案例與有無 Skill 比較明確 | template / skill-creator / webapp-testing |
| anti-gambling-trader-tw | P1 修正 | 白話用途，合成交易紀錄、缺值／打平、序數風險非機率 | performance.py / breakeven.py / checklist.py |
| april-zhu-minicharts | P1 修正 | 主題數值圖表與 Tinycharts 區分，以合成支出圖表核對比例和單位；不宣稱下載或已生成 | 作者 Minicharts how to use / chart type / accuracy |
| arrow-2 | 保留 | SVG 生成、向量化、修改及圖示規格具體；API、權利與安全仍待驗收 | Quiver API / prompt guide |
| artlist | 保留 | 素材用途、訂閱期限、客戶發布權與 AI 自生成區分 | 官方 Artlist license overview |
| arumwu-agentrelay | P1 修正 | 具體租約、檔案範圍、Git 狀態、失聯交接及終端信任限制 | store.ts / git.ts / terminal.ts |
| ath-maas-pixelle-video | P1 修正 | 三分鏡、旁白時長、版型／逾時／日誌隱私及發布權 | content.py / tts.py / video.py |
| awesome-agentic-ai-zh | P1 修正 | Track A 與 B 是按目標分流而非必須依序完成；同步 example 摘要與 note，保留比較用 steps/refs | README Stage 0–2 / Track A / Track B |
| awesome-gpt-image-2 | P1 修正 | 目錄與實際影像生成分離，自撰提示詞、多語、CMS 與來源邊界 | generate-readme.ts / markdown-generator.ts / i18n.ts |

## Change Integrity / Definition of Done
- 20/20 已讀取並記錄；15 筆候選修正、5 筆保留。更新 readerGuide.start 15 筆、purpose 4 筆；OpenCode 增加一個已存在用途的案例引用及步驟，保留原始 step IDs、順序、引用、案例 I/O；整理兩則 limits 的歷史與後續範圍，未提升 deferred。學習地圖只修正 example.process/note，原有步驟及引用保留。
- 候選生成時已比較每筆完整 JSON 的非允許修改範圍，以及原有用途、案例與原始步驟/refs；無 Source、Agent Evidence、repoGuide、implementationKnowledge、Canonical ID、分類、Tags、Typed References 或 Graph 結構變更。新增 15 筆單元與瀏覽器文字回歸，另驗證 OpenCode 既有 evidence refs 與最後獨立驗收步驟、學習路線分流。需最新 Head 四項 CI 全通過方可合併。
- P2 保留既有模板式 useCase.detail、部分重複 limits 與 source scope 歷史文字；不將此批視為全 upstream 深度重審或第三方 runtime PASS。未重新核對時效性頁面，正式採用前須重新查核。

## Progress / Next
- 固定順序已正式審查 20/286，候選累計 40/286；正式映射基準 268/286、14 deferred、4 source-blocked，不升級。下一批起點 aws-samples-sample-agent-cost-bench，按已合併 main 確認下一組 20 個 ID。先驗收本 PR、合併、Catalog Sync 及部署；正式 deployed Chromium 不得由本機結果取代。
