# Resource 內容品質稽核 Batch 11｜20 筆（2026-11-26）

## Scope / Evidence
基於 main be57c87c0f06fa72c0cd08319a2a58a9170abd6c；#131 四項 CI（P1 45781079800、V2 45781079772、Intake 45781079713、Live Pages 45781079688）與四尺寸 Browser Smoke PASS，已合併 ebfebc71974a5bf493d30fbd00292f363acd4e5d。#130 Catalog Sync 45781104664 與 Pages 45781134093 PASS。正式 deployed Chromium 未獨立驗收。

依 main 286 個 Canonical ID 排序讀取第 201–220 筆完整 JSON；核對用途、案例 I/O、步驟、來源與證據、入門指引、限制及 runtime 狀態。沿用既有證據，未重新查核全部上游或執行第三方。

| ID | 結果 | 修正或保留理由 | 既有來源錨點 |
|---|---|---|---|
| openclaw-openclaw | 保留 | 可信任操作者、隔離與工具權限已具體 | SECURITY.md / agent-run-handler.ts |
| opendatalab-mineru | 保留 | PDF 原頁、續讀與遠端界線已具體 | doclib/client.py / types.py |
| openhands-agent-canvas | P1 修正 | ACP 狀態、命令與動態載入的授權界線 | acp-service.api.ts / agent-server-runtime-service.ts / canvas-extension-module-loader.ts |
| openmontage | P1 修正 | 白話媒體工作流、報價與輪詢不等於重新提交 | artifacts / schema_media.py / provider_jobs.py |
| openrouter-ai | 保留 | 同條件模型、資料政策、實際供應商及費用 | 官方路由與 ZDR 文件 |
| openui | 保留 | 元件契約、串流解析與工具授權已具體 | library.ts / parser.ts / prompt.ts |
| orca | P1 修正，deferred 保留 | 補既有 remote-worker-stop-audit 案例步驟及四項 evidence refs，分離停止狀態與程序／Git 清理 | mobile-e2ee-auth / paired-device-scope / worker-stop-transaction / exited-terminal-release |
| paperclip | P1 修正 | 派工、Run/Issue、預算、核准與實際驗收；完整三項用途 | heartbeat.ts / budgets.ts / approvals.ts |
| particles-casberry | deferred 保留 | 既有密度、匯出、授權及低效能測試指引已具體，直連 403 未解除 | 2026-06/10 Changelog 索引 |
| pcottle-learn-git-branching | P1 修正 | HEAD、分叉、workingChanges 與真實 Git 分離 | src/js/git/index.js |
| photo-riso-poster | P1 修正 | 白話海報用途、事實、符號、生成與素材權利 | SKILL.md |
| pii-guard | P1 修正 | 三用途完整化；繁中遮蔽、可還原 mapping 及實際入口限制 | engine.py / local_workflow.py / policy.py |
| pingdotgg-t3code | P1 修正 | Full access 預設、完整分支差異、遠端撤銷及跨專案 MCP 範圍 | permission-modes / source-control / remote-access |
| pinterest-visual-reference | 保留 | 參考目的、來源、個別使用權已具體 | 官方看板與著作權文件 |
| playwright | 保留 | 合成帳號、真實讀回、context 與多尺寸驗收已具體 | locator.ts / browserContext.ts |
| pomerado-pomerado | P1 修正 | 白話網站 MCP、遮蔽、參數及 Authority 重審界線 | execution-policy.ts / credential-policy.ts / schema.ts |
| pramoddutta-botskills | P1 修正 | BOT.md、boundary/runtime 與真實重現證據 | shared/index.ts / validate-bots.mjs / seed-bots |
| punk-skill | P1 修正 | 白話封面／頭像規格、比例及非商用授權 | validate-punk-cover.mjs / validate-punk-avatar.mjs / platform-catalog.md |
| pydantic-pydantic-ai | 保留 | 假資料、TestModel、格式／語意及實際成本已具體 | Agent / output / usage / TestModel |
| pythonanywhere | 保留 | 小型 Flask、WSGI、HTTP、錯誤及保存已具體 | 官方 Flask 指引 |

## Change Integrity / Verification
- 20/20 已讀取；11 筆候選修正、9 筆保留。readerGuide.start 11 筆、purpose 4 筆、paperclip 與 pii-guard 共六項 useCase.detail。Orca 追加既有 remote-worker-stop-audit 與四個既有 evidence refs 的步驟，保留原始步驟與順序，更新 process/note 說明驗收缺口。維持兩筆 deferred，未新增證據或能力。
- 逐筆還原允許欄位後完整 JSON 一致；原始來源、證據、ID、分類、Tags、Typed References 與 Graph 關係不變。新增 11 筆單元及瀏覽器文字回歸，另測 Orca 關聯與兩筆 deferred。四項 CI 通過才合併。
- 其他片段式 detail、重複 limits 及歷史措辭留 P2；未重新核對時效性資料、未實測第三方、未提升 deferred。

## Progress / Next
- 正式審查 200/286；含本批候選 220/286。映射基準 268/286、14 deferred、4 source-blocked 不變。下一批 qingyuna-answer-me-with-html 起，按 main 確認第 221–240 筆。
- 依序完成 CI、合併、Catalog Sync、Pages 及獨立正式網站 Chromium 驗收。
