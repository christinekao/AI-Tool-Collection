# Resource 內容品質稽核 Batch 06｜20 筆（2026-11-26）

## Scope / Evidence
基於 PR #126 Head 745348b7a47d304a0eafa5d74c4e1298943feb7f；開始時 main 3c6a927e5cb9621257b0bdf7d0ef1545a04861e6。#126 Unified Intake 45776923260、V2 Data Validate 45776923293、Live Pages Smoke 45776923321 PASS；P1 45776923386 四尺寸 Browser Smoke 尚執行。#125 合併後 Catalog Sync 45776939334、Pages 45776962524 PASS；main P1 45776939429 尚執行。已比對 #126 與實際 main 的共同祖先，main 端僅生成 catalog-v2.json 與 knowledge-graph-v1.json 變更。正式 deployed Chromium 未驗收。

依 main 286 個 Canonical ID 排序讀取第 101–120 筆完整 JSON。逐筆核對 purpose、用途、案例 I/O/steps/destination、start、limits、來源範圍、Agent evidence locator/limitations/runtime。本輪沿用既有證據，未重讀全部上游、未安裝或執行第三方。先準備下一批，待 #126 合併後將本 PR 指向 main 並執行四項 CI。

| ID | 結果 | 修正或保留理由 | 既有來源錨點 |
|---|---|---|---|
| google-flow | 保留 | 分鏡、參考素材、方案額度、場景編排與後製已明確 | 官方 Flow help |
| google-fonts | 保留 | 中英文字、字重、字集、載入方式及實際裝置 | Fonts API / 字型授權 |
| google-pagespeed-insights | 保留 | 現場與模擬數據區別、同條件重測 | PSI methodology / API v5 |
| google-stitch | 保留 | 合成資料、介面迭代、匯出與工程缺口 | Google Stitch 公告 |
| googlechrome-modern-web-guidance | P1 修正 | 抽屜與側欄、dialog/popover、焦點與相容性；限制全庫掃描 | navigation-drawer / SKILL.md |
| graft | P1 修正 | 工作區、Context 預算、拒絕與用量估算界線 | safe-read.ts / receipt.ts / workspace-authorizations.ts |
| graphify-labs-graphify | P1 修正 | 固定 v3、AST 與推論、屬性覆蓋、來源及外送 | extract.py / build.py / export.py / serve.py |
| gsap-skills | 保留 | 按需選技能、動畫時序、清理與獨立瀏覽器測試 | gsap-core / timeline / scrolltrigger / react |
| guizang-product-video-skill | P1 修正 | 產品影片、音效起始峰值、畫面節奏及人工驗收 | check_environment.py / sfx_landmarks.py / check_delivery.py |
| gzh-design-skill | P1 修正 | 原稿、主題、正文與預覽分離、警告及貼上驗收 | SKILL.md / component_lint.py / validate_gzh_html.py |
| hao0321-editkin | P1 修正 | 舊版渲染圖、下游依賴、白平衡與新版證據區隔 | validate.rs / white_balance.rs |
| harry0703-moneyprinterturbo | P1 修正 | 任務中斷、方向判定、產物及認證邊界 | task_artifacts.py / video_orientation.py / video.py |
| hbai-ltd-toonflow-app | P1 修正 | 工作區隔離、任務狀態、resume 與取消的實際邊界 | generate.ts / status.ts / cancel.ts |
| herdr-mods-gallery | P1 修正 | 白話目錄用途、配方、預覽及公開範圍 | Gallery / Share yours |
| herdrdev-herdr | P1 修正 | 終端狀態、detach 與重啟恢復、SSH 及交付證據 | agent_resume.rs / agents API / remote attach |
| hermes-backsearch | P1 修正 | 歷史截止日、crawl_date、封存缺漏及引用 | backsearch_tools.py / __init__.py |
| hermes-memory-wiki | P1 修正 | 舊版 profile、主題、每日活動及唯讀保密界線 | memory_wiki_core.py / plugin_api.py |
| hermes-snyk-plugin | P1 修正，deferred 保留 | 新庫局部查核、CLI pin、schema 與外送驗收；未讀取憑證或執行掃描 | 新庫 manifest / README / SKILL.md；既有 6 筆證據 |
| hesreallyhim-awesome-claude-code | P1 修正 | 依問題選官方、記憶與測試候選並回查個別來源 | README From Anthropic / Memory / Testing |
| heydamir-unslop | P1 修正 | 前後畫面、內容保留、預覽路徑、功能與可及性 | snapshot.mjs / story-path.mjs / story.mjs |

## Change Integrity / Verification
- 20/20 已讀取；15 筆候選修正（含 1 筆 deferred）、5 筆保留。更新 readerGuide.start 15 筆、purpose 1 筆；逐筆還原允許欄位後完整 JSON 相同。案例、來源、Evidence、ID、分類、Tags、Typed References、Graph 關係與 mapping/runtime 狀態不變。
- 新增 15 筆單元與瀏覽器文字回歸；Snyk 另檢查 deferred、即時 schema 未驗及 analytics 非離線。候選需四項 CI 通過。未重新查證時效性資料或測試第三方。
- P2：既有部分制式 useCase.detail、重複 limits 與歷史審查語氣保留；Snyk 原 config evidence 的「新版官方插件未查核」是封存版本歷史文字，與現行 scope、後續證據及 Reader 指引分開，不刪除歷史來源。

## Progress / Next
- 起始正式審查 80/286，含 #126 及本批候選 120/286；知識映射基準 268/286、14 deferred、4 source-blocked 不變。下一批 heygen-com-hyperframes 起，按正式 main 確認第 121–140 筆。
- 依序完成合併、Catalog Sync、Pages 與獨立正式網站 Chromium 驗收。
