# Resource 內容品質稽核 Batch 13｜20 筆（2026-11-26）

## Scope / Evidence
基於 #133 Head fb1d14e01ae57a87d5cd52c1ecc562f469be594b，開始時 main 0e3c32fdce8c9e5e7b899ce6f9c87f6742df715c。#133 V2 45787262942、Intake 45787262859、Live Pages 45787262950 PASS；P1 45787262966 Browser Smoke 尚執行。#132 Catalog Sync 45787014315、Pages 45787040771 PASS。正式 deployed Chromium 尚未獨立驗收。

依 main 286 個 Canonical ID 排序讀取第 241–260 筆完整 JSON；核對用途、案例 I/O、步驟、限制、來源證據及 runtime 狀態。沿用既有來源，未重新查核全部上游或執行第三方。

| ID | 結果 | 修正或保留理由 | 既有來源錨點 |
|---|---|---|---|
| shubhamsaboo-needle | P1 修正 | 檢索標註、門檻、UTF-16 原句位置及外送 | search.mjs / sentences.mjs |
| skillgodak-hgtv | Source-blocked 保留 | 歷史 README/Release 記錄，原 Repo 404；不以同名替代 | sourceGap / riskNotes |
| skillry-opus-5-5-video-pattern-library | P1 修正 | 自有腳本、動效模式、比較與素材權利 | 既有影片目錄證據 |
| skillry-web-design-template-skills | P1 修正 | 版型選擇、設計規格、個別 Skill 與實際 HTML | 既有網站設計目錄證據 |
| social-post | P1 修正 | 白話規則索引、操作核准與收據；三用途完整化 | build_rule_registry.py / comment_authorization.py / comment_browser_provenance.py |
| sona-orbit-parroting | P1 修正 | 中英同測試集、本機 ASR、雲端改寫與語氣分離 | speech-models / guide / model |
| stitch-mcp | Deferred 保留 | SDK、正式 Setup 缺口、即時 schema、下載已具體 | SDK README / auth.ts / client.ts / download-hardening.test.ts |
| stitch-skills | 保留 | 專案設計規則、畫面任務與 MCP 權限已具體 | generate-design/SKILL.md |
| storytold-artcraft | P1 修正 | 白話參照媒體、工作去重、快取清理與實際成果 | refs.rs / feed/store.rs / media_cache.rs |
| storytold-filmcraft | P1 修正 | 白話快照、下載與選檔；實際復原驗收 | recovery_policy.rs / download_pacing.rs / file_filters.rs |
| strelov1-freehire | P1 修正 | 白話企業名稱與職稱正規化、忽略條件與原始資料 | company.go / title.go / search_params.go |
| strelov1-freehire-mcp | P1 修正 | 搜尋條件、CV 證據、credit、OAuth 及送件界線；三用途完整化 | tools.ts / client.ts / config.ts |
| systran-faster-whisper | 保留 | 音訊權利、generator 迭代、時間戳及批次比較已具體 | transcribe.py / vad.py |
| theatlasteam-motion-design-skill | 保留 | 最小動效、鍵盤、減少動態及畫格驗收已具體 | motion-core.mjs / motion-controls.html |
| thu-maic-openmaic | P1 修正 | 自動確認入口與人工大綱流程分離，工作、擁有者及版本；三用途完整化 | generate-classroom / jobId / confirm-outline routes |
| tip31812-ai-usage-bar | 保留 | 額度來源、憑證風險與實際用量核對已具體 | Provider / Models / Store / Views / Notifier |
| toeverything-affine | P1 修正，deferred 保留 | 工作區隔離、部分寫入、同步及分區授權缺口 | writer.ts / merge-updates.ts / permission/service.ts |
| tradingview-pine-screener-strategy-tester | P1 修正 | 掃描、回測、資料長度及成交假設分離 | 既有官方 Screener / strategies 文件 |
| twood2024-prelaunch-check-defense | P1 修正 | 部署實際回應、機密及 AI 權限；非掃描器 | 三項固定版本 playbooks |
| typesafe-ai-jev | P1 修正 | 客服布林判定、人工標註與操作授權分離 | 既有官方模型頁 |

## Change Integrity / Verification
- 20/20 已讀取；14 筆候選修正、5 筆具 readerGuide 保留、1 筆 source-blocked 保留。readerGuide.start 14 筆、purpose 4 筆；Social Post、FreeHire MCP、OpenMAIC 各三項 useCase.detail 共九項具體化。逐筆還原允許欄位後完整 JSON 一致；保留所有 example、ID、refs、來源、Evidence、分類、Tags、Typed References、Graph 關係及 mapping/runtime 狀態。
- Stitch MCP、AFFiNE 維持 deferred；HGTV 維持 source-blocked，不補猜測來源。新增 14 筆單元與瀏覽器文字回歸、三組用途與狀態、apply 及大綱分流檢查。四項 CI 通過才合併。
- 未重新核對時效性資料、未安裝或執行第三方；其他片段式 detail、重複 limits 及歷史措辭留 P2。

## Progress / Next
- 起始正式 220/286；含 #133 及本批候選 260/286。映射基準 268/286、14 deferred、4 source-blocked 不變。下一批 ui-ux-gold-standard 起，按 main 核對第 261–280 筆。
- 先完成 #133 合併，將本批指向 main，再驗收 CI、合併、Catalog Sync、Pages 及正式網站獨立 Chromium。
