# Resource 內容品質稽核 Batch 05｜20 筆（2026-11-26）

## Scope / Evidence
基於 PR #125 Head 5940f0d0fdf04154933038b3ebad8585e6952e0d；開始時 main 為 e8024628cd9e3fc27ab531da359b59642ded7856。#125 Unified Intake 45776434100、V2 Data Validate 45776434091、Live Pages Smoke 45776434180 PASS；P1 45776434136 單元步驟通過，四尺寸 Browser Smoke 尚執行。前一批 #124 合併後 P1 45776100708、Catalog Sync 45776100838、Pages 45776135334 均 PASS；實際 deployed Chromium 仍待驗收。

依 main 的 286 個 Canonical ID 排序，讀取第 81–100 筆完整 JSON。逐筆核對 purpose、useCases、example I/O/steps/destination、start、limits、source scope、Agent evidence locator/limitations/runtime。沿用既有來源證據；未重新查閱全部上游、未安裝或執行第三方。為避免閒置，基於 #125 Head 準備下一批，先完成 #125 合併，再將本批指向 main 及驗收。

| ID | 結果 | 修正或保留理由 | 既有來源錨點 |
|---|---|---|---|
| deepseek-dsh-superagent-prototype | P1 修正 | 明確請求與候選分離、回覆收據、重複及重試；准入不是授權 | admission.ts / outbox.ts / retry-health.ts |
| designed-to-scale | P1 修正，deferred 保留 | 自有系統設計學習題、閱讀路線與獨立容量驗證；互動章節未讀 | 作者作品集 System Design |
| df3011212-codex-local-board | P1 修正 | 多對話關卡、證據、dry-run、未知執行及本機隱私 | agent_report.mjs / sync-all.mjs / board-node.mjs |
| dominicrico-jev-router | P1 修正 | 同一批任務、模型池、effort、cache 與費用限制 | register.tsx / OPTIONS.md |
| dslab-lessons | P1 修正 | 影音學習目標、節點環境、素材權利與輸出比較 | lesson-h3 課程總覽 |
| ecpay-ecpay-api-skill | P1 修正 | 白話服務選型、官方即時規格、測試與正式交易隔離 | SKILL.md / references/README.md |
| elayadesign-ai-design-skills | P1 修正 | 產品首頁、真實文案、Figma tokens、元件與實際畫面驗收 | landing-page-design / figma-designer |
| electron | P1 修正 | 最小桌面知識庫、main/preload/renderer 與 IPC 來源驗收 | process-model / context-isolation / ipc / security |
| engineering-leadership-adobe-tech-lead-ai | P1 修正 | 需求決策、風險提報、AI 初稿及小規模試行；非官方政策 | 訪談 clarity / risk / AI draft |
| ffmpeg | 保留 | 已明確版本、編碼器、備份、輸出及播放驗收 | 官方 CLI / ffprobe / legal |
| fomofly-ai | P1 修正 | 教學長片、語意、直式取景、字幕與上傳授權 | 官方自動剪輯、風格、重新取景 |
| forget-c-jellyfish | P1 修正 | 白話章節與媒體任務用途、路徑、task id、採用狀態 | chapters.py / generation_tasks.py / task_status.py |
| frontend-design | P1 修正 | 真實作品、訪客與首屏、視覺方向、響應式及焦點 | frontend-design/SKILL.md |
| gagansd-herdr-insights | P1 修正 | 跨 Agent 合成日誌、快取、fork 與每日聚合驗證 | adapters.mjs / collector.mjs / analytics.js |
| garrytan-gbrain | P1 修正 | 事實關聯、按時間回查、撤回與清除範圍區分 | facts.ts / recall.ts / forget-purge.ts |
| garrytan-gstack | P1 修正 | 有界評審、Git 版本綁定、非敏感 QA 證據及獨立驗收 | office-hours / review / qa-evidence |
| gbro-collage-broll | P1 修正 | 白話紙拼貼短片用途、首尾影格、URI、模型與費用 | check_setup.sh / generate_video.py / generate_veo_first_last.py |
| gbro-cover-design | P1 修正 | 白話封面提示詞用途、三輪選擇、比例、裁切與肖像權 | SKILL.md / references/examples.md |
| gggodlin-cc-harness | P1 修正 | 規則、人工許可、收據及 Hook 防漂移而非安全沙箱 | contract-validator / receipt-gate / auto-mode guard |
| github-agentic-workflows | P1 修正 | CI 診斷與受控寫入分離、歷史漏洞與現行修補核對 | compiler / safe outputs job / validation |

## Change Integrity / Verification
- 20/20 已讀取；19 筆候選修正（含 1 筆 deferred）、1 筆保留。更新 readerGuide.start 19 筆、purpose 4 筆；逐筆還原允許欄位後比對完整 JSON，其他欄位一致。未改案例、來源、Evidence、ID、分類、Tags、Typed References、Graph 關係或狀態。
- 新增 19 筆單元與瀏覽器文字回歸，另檢查 Designed to Scale 仍為 deferred、互動章節未讀。候選需四項 CI 驗收；未重新查證時效性資料，不宣稱第三方 runtime PASS。
- P2 保留既有片段式 useCase.detail、重複警語與歷史審查措辭。未重新下載、安裝或執行工具；實際採用前另查版本、費用、授權及資料邊界。

## Progress / Next
- 起始正式審查 60/286，#125 候選 20 筆，含本批候選累計 100/286；既有映射基準 268/286、14 deferred、4 source-blocked 不變。下一批 google-flow 起，依正式 main 確認第 101–120 筆。
- #125 與本批依序完成四項驗收、合併、Catalog Sync 與 Pages；正式 deployed Chromium 另列。
