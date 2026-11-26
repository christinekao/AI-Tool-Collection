# Resource 內容品質稽核 Batch 07｜20 筆（2026-11-26）

## Scope / Evidence
基於 PR #127 Head 7f36ed0508bd25dc5246c1240fb616939aec7388，開始時 main 803ef4e982d9945cd5e7263abbd6b3a571a77b54。#127 V2 Data Validate 45777437637、Unified Intake 45777437703、Live Pages Smoke 45777437797 PASS；P1 45777437585 四尺寸 Browser Smoke 步驟已 PASS，整個 workflow 尚未結束。#126 合併後 Catalog Sync 45777457884、Pages 45777480938 PASS。比對共同基線，main 端僅有生成 catalog 與 graph 變更；正式 deployed Chromium 未驗收。依 main 286 個 Canonical ID 排序讀取第 121–140 筆完整 JSON；核對用途、案例 I/O、步驟、來源與證據、入門指引、限制及 runtime 狀態。沿用既有來源，未重新查閱全部上游或執行第三方。

| ID | 結果 | 修正或保留理由 | 既有來源錨點 |
|---|---|---|---|
| heygen-com-hyperframes | 保留 | 時間軸契約、代表畫格與渲染驗收已具體 | runtimeContract.ts / render.ts / check.ts |
| higgsfield-ai | 保留 | 三鏡頭、合法素材、方案及畫面一致性 | 官方產品與權利文件 |
| hindsight | P1 修正，deferred 保留 | 兩 bank 設計；補既有案例引用與步驟、同步 process/note，明確直接引擎及完整刪除缺口 | bank-validator-coverage / reflect-cited-id-filter / missing-bank-delete-test |
| hirakujira-pokeep | P1 修正 | 白話收藏用途、合成備份、排序及本人決策 | backup.ts / collection.ts / categorize.ts |
| hkuds-vimax | P1 修正 | 白話媒體後端用途、YAML、解析、比例與費用 | render_backend.py / image_response.py / image_orientation.py |
| huggingface-smolagents | 保留 | 合成只讀工具、步數與程式碼執行隔離已具體 | agents.py / local_python_executor.py |
| humanlayer | P1 修正 | 多 Repo 基準、Task/Session、Worktree、同步範圍與獨立審查 | tasks / workflow-phases / workspace-model / remote-daemons |
| ibkr-portfolioanalyst | 保留 | 幣別、期間、報表與計算口徑已具體 | PortfolioAnalyst / Statement / Flex Query |
| ice1187-tw-security-and-ctf-resource | P1 修正 | 基礎、防禦、合法練習及負責任通報 | README Basics / Wargame / 漏洞通報 |
| impeccable | P1 修正 | 產品背景、獨立 audit、優先順序及誤報 | SKILL.src.md / audit.md |
| infiniflow-ragflow | P1 修正，deferred 保留 | Go 匯入、權限及引用反例；完整 parser/index 未查 | ingestion-task-state / retrieval-dependency-permission / citation-marker-filter |
| inspora | 保留 | 原始連結、作者與原創設計原則已具體 | Gallery / collection |
| irons163-orchestrate-sol-terra-luna | P1 修正，deferred 保留 | 現行轉址與歷史身分分離，不合併 ID、不啟動代理 | identity / candidate-delegation 證據 |
| irons163-three-tier-agent-orchestrator | P1 修正 | 白話委派、互斥寫入、主線驗收與能力不足 | README / SKILL.md |
| jakeschincariol-day-trader-skill | P1 修正 | 離線合成計畫、拒絕、回放缺漏，非交易推薦 | size.py / check.py / timemachine.py |
| jit-learning-loop | P1 修正 | 學習者自行回答、版本證據、知識遷移與同意寫入 | installed.mjs / learning-log.mjs / checkpoint |
| jub0t-concat | P1 修正 | 白話 Android 事件、匯出及快取、實際檔案驗收 | Jobs.kt / ExportManager.kt / MediaCache.kt |
| juneyaooo-rea-video | P1 修正 | 來源線索與簽章驗證區分、OCR、候選製作路徑 | probe.py / packaging.py / plan.py |
| k-dense-ai-scientific-agent-skills | P1 修正 | 最小研究需求、方法假設、候選來源與安全審查 | README 科學資料庫 / Python Package Skills |
| kepano-40-questions | P1 修正 | 私人年度／十年反思、來源版本、可跳過與權利 | year.md / decade.md / README |

## Change Integrity / Verification
- 20/20 已讀取；15 筆候選修正（含 3 筆 deferred）、5 筆保留。更新 readerGuide.start 15 筆、purpose 5 筆。Hindsight 的既有 bank-citation-deletion-audit 用途原先未列入案例：追加該 useCaseRef 及對應的三個既有 evidenceRefs 的步驟，保留所有原步驟與順序，更新 process/note 以明確反映靜態審查及未驗證範圍。未新增來源或能力。逐筆還原允許欄位後完整 JSON 相同；其他案例、證據、ID、分類、Tags、Typed References、Graph 關係與狀態不變。
- 新增 15 筆單元與瀏覽器文字回歸及 Hindsight 連結檢查；候選需四項 CI 通過。P2 既有片段式 useCase.detail、重複 limits 與歷史措辭保留。未重新查證時效性資料，未執行第三方，未提升任何 deferred。

## Progress / Next
- 起始正式審查 100/286，含 #127 及本批候選 140/286；知識映射基準 268/286、14 deferred、4 source-blocked 不變。下一批 kepano-obsidian-minimal 起，按 main 確認第 141–160 筆。
- 先合併 #127，再將本 PR 指向 main，確認四項 CI、Catalog Sync、Pages 與獨立正式網站 Chromium 驗收。
