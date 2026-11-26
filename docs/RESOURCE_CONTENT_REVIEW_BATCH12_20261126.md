# Resource 內容品質稽核 Batch 12｜20 筆（2026-11-26）

## Scope / Evidence
基於 main 60bce701cbc82a9082392aeaf1f93f204c95d8fd；#132 四項 CI（P1 45786380968、V2 45786380934、Intake 45786381124、Live Pages 45786380925）及四尺寸 Browser Smoke PASS，已合併。#131 Catalog Sync 45786062442、Pages 45786123496 PASS。正式 deployed Chromium 尚未獨立驗收。

依 main 286 個 Canonical ID 排序讀取第 221–240 筆完整 JSON；核對用途、案例 I/O、步驟、限制、來源證據及 runtime 狀態。沿用既有來源，未重讀全部上游或執行第三方。

| ID | 結果 | 修正或保留理由 | 既有來源錨點 |
|---|---|---|---|
| qingyuna-answer-me-with-html | P1 修正 | 三項用途完整化；引用警告、HTML 轉義、CSP 與離線安全 | refs.js / raw-html.js / csp.js |
| r0x0r-pywebview | 保留 | 自有 HTML、最小 Bridge 與跨 OS 驗收已具體 | webview/__init__.py / window.py |
| rankupgames-spectra | P1 修正 | 白話索引、增量證據、Hook 保留與靜態關係 | context_state.rs / git_sync.rs / adapters/python.rs |
| rea | P1 修正，deferred 保留 | 義務結案、證據權威、錯誤 Schema、客戶端與授權界線 | reconstruction-readiness / closure test / client-verification |
| react-frontend-backend-for-beginners | P1 修正 | 具體履歷網站練習、請求流程、部署及權限 | 原文三章 evidence |
| reactive-resume | P1 修正 | 母版、JD、已寄版本、match score 寫入及三用途完整化 | resume router / application schema / MCP guide |
| recraft | 保留 | 向量選型、素材權利、路徑與 API 費用已具體 | 官方模型／Vectorizer／API |
| remove-bg | 保留 | 區分單次去背與遷移風險；未重新查證未來服務變更 | 官方 API 與遷移文件 |
| research-to-diagram | P1 修正 | 關係證據、可編輯 DOT、PDF 及輸出位置 | SKILL.md / README |
| reverse-skill | P1 修正，deferred 保留 | 歷史身分、候選證據與引用遷移核准分離 | 原始 V2 / PR114 / SECURITY.md / case-review |
| reverse-skill-2 | P1 修正 | 合成 scope、引用、雜湊與獨立證據驗收 | review_case.py / test_review_case.py |
| rive | 保留 | 狀態、View Model、Runtime 與動態減量已具體 | 官方 data binding / game UI |
| rociiu-talorys | P1 修正 | 白話記憶版本、文字啟發式及核准期限 | conflict.ts / lifecycle.ts / pending-actions.ts |
| roocodeinc-roo-code | 保留 | 封存版角色、核准、停止及替代方案已具體 | modes.ts / Task.ts |
| rtk | P1 修正 | 完整日誌對照、退出碼、估算及選配 Proxy 外送 | runner.rs / gain.rs / tracking.rs / pipeline schema |
| ryanhanwu-how-to-ask-questions-the-smart-way | P1 修正 | 可重現問題、去識別日誌及解決後回填 | 固定版本 README 三類段落 |
| saadeghi-daisyui | 保留 | 版本、樣式範圍、主題及互動驗收已具體 | index.js / pluginOptionsHandler.js |
| seokwoooo-lucian-uxui-prompt | P1 修正 | 白話元件選型、確認取消、字元計數與真實操作 | build.mjs / hold-to-confirm / autogrow-textarea-counter |
| shadcn-ui | 保留 | registry、基準、覆寫及 dry-run 初始化限制已具體 | add.ts / dry-run.ts |
| shubhamsaboo-awesome-llm-apps | 保留 | 最小候選選型、固定版本及個別授權已具體 | README Starter AI Agents / RAG / Memory |

## Change Integrity / Verification
- 20/20 已讀取；12 筆候選修正、8 筆保留。readerGuide.start 12 筆、purpose 3 筆；HTML 教材與 Reactive Resume 各三項 useCase.detail 具體化。逐筆還原允許欄位後完整 JSON 一致，保留所有 example、ID、refs、來源、Evidence、分類、Tags、Typed References、Graph 關係及 mapping/runtime 狀態。
- REA 與 Reverse Skill 維持 deferred；Reverse Skill 2 不合併。新增 12 筆單元與瀏覽器文字回歸，另檢查兩筆 deferred、六項用途、引用警告及 match score 副作用。
- 未重新核對時效性資料、未安裝或執行第三方。其餘片段式 detail、重複 limits 與歷史措辭留 P2。四項 CI 通過才合併。

## Progress / Next
- 正式 220/286；含本批候選 240/286。映射基準 268/286、14 deferred、4 source-blocked 不變。下一批 shubhamsaboo-needle 起，按 main 核對第 241–260 筆。
- 完成 CI、合併、Catalog Sync、Pages 及正式網站獨立 Chromium 驗收。
