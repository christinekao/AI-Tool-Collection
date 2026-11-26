# Resource 內容品質稽核 Batch 01｜20 筆（2026-11-26）

## Scope / Evidence
基準：main `af660edc5f20dcfc48f1586c711282dc6ed5933d`，PR #121 已四項 CI PASS（45771487076、45771487077、45771487161、45771487067），合併 `fa02aa4f4495455b9dd04bea5ce2d13da288c069`；Catalog Sync 45772233575 PASS，生成提交僅改 data/catalog-v2.json；Pages 45772261992 PASS。實際 deployed Chromium 未驗收；PR 的四尺寸本機 Chromium PASS 不等於正式畫面驗收。

本輪按 GitHub Canonical ID 排序讀取首 20 筆完整 JSON，檢視 purpose、useCases、example（輸入／處理／輸出／下一用途／steps）、start、limits、source review scope 及局部能力／證據的來源定位、I/O、限制與 runtimeStatus。這是基於既有固定版本證據的 Canonical 語意稽核；未重新讀取全部上游來源、未操作第三方工具、未獨立驗證實際畫面易讀性。現行功能與外部來源的新版本仍需依需求重查。

| ID | 結果 | 問題／修正或保留理由 | Agent Layer 既有來源錨點 |
|---|---|---|---|
| abi-screenshot-to-code | P1 修正 | 上手及三個用途為片段，改成有權素材、生成候選、事件進度及人工驗收 | generate_code.py / generateCode.ts |
| acheaisuiyimen-ache-life-to-comic-skill | P1 修正 | purpose 混入審查記錄，改成生活手帳、上下文及保真；入門以非商業測試日記為例 | context-pack.mjs / asset-contract.mjs / validate-entry.mjs |
| addyosmani-agent-skills | 保留 | 四份固定技能證據；表單修復、審查、瀏覽器資料讀回，具體且明示外部依賴 | spec-driven-development / code-review-and-quality / browser-testing-with-devtools |
| affaan-m-ecc | P1 修正 | 通用起手改為兩 Worktree、事件與摘要／提醒反例；未把 hook 當沙箱 | hooks.json / pre-compact.js / evaluate-session.js |
| agency-agents | P1 修正 | 以每日銷售資料與儀表板明確分派三角色及產物，區分角色指引與執行 | engineering-data-engineer.md / engineering-data-visualization-engineer.md / engineering-code-reviewer.md |
| agent-reach | 保留 | 三個合法文章網址、通道與錯誤 envelope、下游摘要分離；登入風險已揭露 | runtime/cli.py / dispatch.py / result.py |
| agentic-system-lab-harness-relay | P1 修正 | 明確三協作模式、基準 Commit、各 Agent Diff 與回歸；P2 重複安全警語留待呈現整理 | orchestrator.ts / approvals.ts / sandboxing.md |
| agricidaniel-claude-seo | P1 修正 | 具體 HTML、主張與歷史基準三類輸入，明示英文啟發式與索引限制 | page_checks.py / content_verify.py / drift_compare.py |
| ai-code-acceptance-review-testing-rollout-guide | 保留 | 四階段教學，表單操作、回復條件、可回查證據均明確 | 原文章 01–04 節 |
| ai-memory | P1 修正 | 具體 capture scope、handoff 接收與過期、recall 越界反例 | capture_policy.rs / handoff.rs / recall.rs |
| ai-video-drama-platform | P1 修正 | purpose 改為故事至分鏡及圖片組合；增加模型解析、缺圖、時長與輸出路徑驗收 | storyboard.py / storyboard_generator.py / composer.py |
| aiposthub-awesome-opensource-ai-cheat-sheets-guide | 保留 | 十主題架構、模型、輸出、安全；具體政策問答案例；導讀與原 Repo 授權有區分 | sraodev 十份固定 cheatsheets |
| akas333-tysa | P1 修正 | 用途改為學習課程／題庫／搜尋可用性；SQL JOIN 測試情境與獨立學習驗收 | courses.ts / question-bank.ts / search.ts |
| akseolabs-seo-cinematic-ui | P1 修正 | purpose、三項用途及入門改成可重現畫面狀態、捲動時間軸、多尺寸截圖；contact sheet 白話化 | kit/app.js / kit/reel.js / app-screening.mjs |
| akto-api-security-akto | P1 修正 | 用途移除內部審查語氣；遮罩、裝置分類與政策未覆蓋及零值反例 | RedactSampleData.java / AtlasDeviceScope.java / PolicyHygieneProvider.java |
| alchaincy-huashu-design | P1 修正 | 用途及上手由審查語氣改為品牌規格、三方向、逐輪截圖；保留看圖能力限制 | design-context.md / SKILL.md / polish-loop.md |
| alchaincyf-huashu-motion | P1 修正 | 具體時間戳、渲染、跳動與人工比對，不承諾數值等同品質 | check.js / frames.js / qa.js |
| alexyc9381-hiring-panel-skill | P1 修正 | 具體 JD、本人事實、多角色隔離及保真改寫，不宣稱真實 ATS | hiring-panel SKILL.md §1–7 |
| allanyiin-documa | P1 修正 | 自製 PDF/Word、人工標註、OCR、引用語意及表格完整性 | ir.py / reading.py / citation.py |
| allanyiin-toolanything | P1 修正 | 無副作用查詢、型別、Registry、MCP、授權拒絕及外部操作界線 | registry.py / schema.py / mcp_adapter.py |

## Change Integrity / Definition of Done
- 20/20 已讀取及記錄；16 筆候選內容修正、4 筆保留。僅更新 readerGuide.start（16）、purpose（6）、useCases.detail（2 組）；不更改案例、局部 ID／refs、分類、Tags、全域 Typed References、source、agentEvidence、repoGuide 或其他 Agent Layer 內容，不提高 mapping/runtime 狀態。
- 已比對候選生成前後 JSON，除上述允許欄位外完全一致；單元回歸檢查每筆具體起手句、design-only、映射及未實測狀態；瀏覽器回歸檢查 16 筆新文字，沿用 375/430/768/1440px。尚待最新 Head 四項 CI 實際結果，不提前計入正式品質稽核進度。
- P2 殘留：部分既有 useCase.detail 仍有片段化的輸入輸出文字，Harness Relay limits 重複，舊警語仍須逐條避免失去安全邊界。此輪先處理最影響理解與上手的內容，不宣稱每筆全文最終無缺口。先不建立自動改寫器、不改全域 schema。

## Progress / Next
- 正式知識映射 268/286，14 deferred，4 source-blocked，無狀態提升。全庫固定順序語意稽核此次候選 20/286；此前五筆專項修正不重複計入固定順序進度。
- 合併前確認四項 CI 全通過；Pages Catalog Sync 與實際 deployed Chromium 分開驗收。下一個固定順序批次由 allanyiin-toolanything 之後開始，依 main 目錄確認後取下 20 筆；P2 修正佇列保留，不影響繼續審查。
