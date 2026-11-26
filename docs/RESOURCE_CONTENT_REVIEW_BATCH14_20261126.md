# Resource 內容品質稽核 Batch 14｜20 筆（2026-11-26）

## Scope / Evidence
基於 main ef021a4f45890d807938594040f3e3d4e56f9b06；#134 四項 CI（P1 45787880344、V2 45787880218、Intake 45787880287、Live Pages 45787880234）及四尺寸 Browser Smoke PASS，已合併。#133 Catalog Sync 45787919949、Pages 45787966338 PASS。正式 deployed Chromium 尚未獨立驗收。

依 main 286 個 Canonical ID 排序讀取第 261–280 筆完整 JSON；核對用途、案例 I/O、步驟、限制、來源證據及 runtime 狀態。沿用既有來源，未重新查核全部上游或執行第三方。

| ID | 結果 | 修正或保留理由 | 既有來源錨點 |
|---|---|---|---|
| ui-ux-gold-standard | P1 修正 | Dashboard 任務、MASTER.md、頁面例外及實際可用性 | search.py / design_system.py |
| uiverse-io-galaxy | 保留 | 單一元件、授權、CSS 衝突及鍵盤已具體 | Buttons / Cards / Inputs |
| unclebob-ub-mode | P1 修正 | 最小失敗測試、根因與行為、品質門檻及 PR | SKILL.md 三階段 |
| unclecode-crawl4ai | 保留 | 授權來源、Markdown、逐筆錯誤與清理已具體 | async_webcrawler.py / models.py |
| usestrix-strix | P1 修正 | Agent 自述／觀測、覆蓋、SARIF、輸出安全 | coverage.py / sarif.py / writer.py |
| vercel-ai-gateway | 保留 | 認證、order/only、供應商及故障成本已具體 | 官方 Gateway 文件 |
| vercel-labs-skills-cli | 保留 | 固定來源、目標 Agent、project/global、回復已具體 | skills.ts / installer.ts / cli.ts |
| vercel-skills-sh | 保留 | 搜尋、來源、遙測及安裝核准已具體 | 官方目錄／CLI 文件 |
| viral-hook-title | Source-blocked 保留 | 通用名稱，缺原始實作身分 | sourceGap / riskNotes |
| voltagent-awesome-agent-skills | P1 修正 | 依任務選型、來源、Host 及逐件安全驗收 | 固定版本 README |
| voltagent-awesome-openclaw-skills | P1 修正 | 最小工具集合、ClawHub、排除規則及掃描界線 | 固定版本 README |
| vulture-s-whisper-guard | P1 修正 | 片段誤刪、重複語意、獨立標註及三用途完整化 | guard.py / benchmark.py |
| waooai-waoowaoo | P1 修正 | 白話模型、媒體、寫入及靜態檢查限制 | 三個 check scripts |
| wellmade | P1 修正，deferred 保留 | 原始截圖身分、候選分類、作者與個別授權 | 官網索引／第三方摘要 |
| whisper-ui | Source-blocked 保留 | 多個不同同名實作，原收藏身分未確認 | sourceGap / riskNotes |
| wilsonfreitas-awesome-quant | P1 修正 | 資料時點、回測洩漏、風險及離線選型 | 固定版本 README |
| wquguru-cicada | P1 修正 | 白話逐字稿搜尋、Markdown、檔名與真實保存 | TranscriptSearch.swift / FolderExport.swift |
| wrenai | P1 修正 | BI 語意、指標計算、取消及三用途完整化 | factory.py / query_semantics.py / governed_query.py |
| yanliudesign-mono-color-skill | 保留 | 媒介、文字、色彩與印刷驗收已具體 | SKILL.md / colors.json / ASSET-LICENSE |
| yusufkaraaslan-skill-seekers | P1 修正 | 知識來源、覆蓋、封裝及外送；三用途完整化 | detect_command.py / create_command.py / package_skill.py |

## Change Integrity / Verification
- 20/20 已讀取；12 筆候選修正、6 筆具 readerGuide 保留、2 筆 source-blocked 保留。readerGuide.start 12 筆、purpose 2 筆；Whisper Guard、WrenAI、Skill Seekers 各三項 useCase.detail 共九項具體化。
- 逐筆還原允許欄位後完整 JSON 一致；保留所有 example、ID、refs、來源、Evidence、分類、Tags、Typed References、Graph 關係及 mapping/runtime 狀態。Wellmade 維持 deferred，兩筆 source-blocked 不補猜測來源。
- 新增 12 筆單元與瀏覽器文字回歸、九項用途、兩筆 blocked、WrenAI 取消及封裝／上傳區分檢查。四項 CI 通過才合併。
- 未重新查核時效性資料、未安裝或執行第三方。其他片段式 detail、重複 limits 及歷史措辭列 P2。

## Progress / Next
- 正式 260/286；含本批候選 280/286。映射基準 268/286、14 deferred、4 source-blocked 不變。最後一批 zeabur-oss-ai-agent-installer-guide 至 zichuanlan-freebie-radar 共六筆。
- 完成 CI、合併、Catalog Sync、Pages 及正式網站獨立 Chromium 後，進行全庫最終驗收與 Concept 層銜接；不將未解來源視為已完成映射。
