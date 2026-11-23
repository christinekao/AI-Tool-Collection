# Concepts Phase 2｜Batch 04（第 61–68 筆）逐筆審查

2026-11-23（Asia/Taipei）｜Base main `c8f426d1233fac19278f51ebf6f3238001e77ae4`｜Branch `concept-content-batch04-20261123`

## 範圍與保存原則

- 本批只更新既有 Canonical Concept **8/8**，完成內容改善目標 **68/68**；不新增、刪除、合併任何 Concept。
- 原始 `coreProblem`、`solutionMethods`、`examples`、`exampleRefs`、`layers`、`originalNote`、`source`、Tags、Classification、ID 和所有 Typed References 全部保留；原有 Trade-offs／Signals／Anti-patterns 一律保留為相同順序的前綴。
- 缺漏才補 `definition`、Trade-offs／Signals／Anti-patterns；第 62 與 68 筆已具長篇內容，不重寫原本方法與關係。
- 每筆新增兩項 `applicationScenarios`（均以「示意：」標示）與兩個 `validationQuestions`，僅是假設的跨領域應用及驗證問題，不表示已完成外部執行。
- 每筆 `intakeReview` 設 `sourceStatus=provided-material`、`dedupeReview=update`、`verification.status=not-tested`；沒有單獨完成外部來源、作者或商業授權查核。不新增 Tags、Capability 或 Graph Edge。
- 編輯時使用原始 8 筆 Canonical 作為 Before，逐欄比較所有非允許修改欄位、確認原有陣列的值和順序保持不變。GitHub CI 與後續獨立審核仍須另行驗證。

## 相鄰概念界線

- `semantic-layer-for-ai` 是 **商業語意／指標定義的治理**，`retrieval-grounded-knowledge-layer` 是 **有來源的知識檢索**，不因均支援 AI 回答就合併。
- `system-1-decision-layer` 回答 **結構化快速判斷**；`task-aware-skill-routing` 回答 **根據任務選擇及驗證 Skill**；`vendor-agnostic-orchestration` 回答 **協作角色與 Provider 替換**。
- `workflow-agent-system-agent-os-three-layer-architecture` 討論 **固定步驟、自主決策與治理 Runtime 的責任邊界**，不是特定 Orchestrator 產品的實測能力。
- `source-first-job-intelligence` 規範 **來源可追溯的職缺資料與投遞決策**，不應當成所有職缺已確認仍開放或能自動投遞的實證。

## 逐筆結果

| # | Canonical ID | 補強重點 | 外部 Runtime／授權 |
|---:|---|---|---|
| 61 | `semantic-layer-for-ai` | 統一商業指標與 Join 定義；避免 LLM 從 Schema 猜口徑 | NOT_TESTED |
| 62 | `source-first-job-intelligence` | 來源／去重／有效職缺／履歷真實性；保留原完整 ATS 方法及 exampleRefs | NOT_TESTED |
| 63 | `source-grounded-product-media` | 產品實際功能和影片畫面關聯；不虛構產品介面 | NOT_TESTED |
| 64 | `system-1-decision-layer` | 小型 typed decision 的成本與誤判升級邊界 | NOT_TESTED |
| 65 | `task-aware-skill-routing` | 按 Task／Tool／Permission 導向 Skill；重點是路由回歸 | NOT_TESTED |
| 66 | `vendor-agnostic-orchestration` | 模型與 Agent 的可換接契約、Fallback 與資料流向 | NOT_TESTED |
| 67 | `web-to-desktop-application-shell` | Renderer／Main Process／IPC 隔離與桌面權限 | NOT_TESTED |
| 68 | `workflow-agent-system-agent-os-three-layer-architecture` | 保留原有 Layers、Scenario、Concept Refs；只補跨領域示意和判斷問題 | NOT_TESTED |

## 測試與交付條件（結果須由實際 Run 更新）

- `scripts/test-concept-guides.mjs` 擴增到全部 **68/68**；同時保留前三批 60 筆的 regression。每筆至少兩組取捨、訊號、反例、候選情境與驗證問題。
- `scripts/test-knowledge-browser.mjs` 增加 Batch04 三筆代表性的 Knowledge 真實顯示與 Catalog 詳情深連結、375／430／768／1440px 無水平溢出；不得移除既有其他頁面或 Prompt／Graph／Playground 測試。
- 要求 Unified Intake、V2 Validate、P1 Graph／Browser、Source Integrity、Canonical→Derived 重建、PR/main CI、Catalog Sync、Pages Deploy、部署後 Live Smoke 全數留下實際執行證據；不能把 PR CI 當成部署結果。
- 基準數量：六類 270／123／68／35／17／36；Graph 569 Nodes／1816 Edges。上述是上一批已核實基準，須再次檢查新版本。
- 外部模型效果、第三方 API 整合、原始作者與商用授權：**NOT_TESTED**。

## 下一步

完成 PR 實際 CI 和審核才可合併；部署後驗收通過，再更新最終 Session Handoff，確認 Phase 2 Concepts **68/68** 封帳。
