# Concepts Phase 2｜Batch 02（第 21–40 筆）逐筆內容審查

2026-11-23（Asia/Taipei）｜Base main `c80c70cb5d7dd6c2412519bf5d65e5ebd2e5d74e`｜Branch `concept-content-batch02-20261123`

## 範圍與保存原則

- **20/20 既有 Canonical** 依 ID 排序更新；累計 40/68，尚餘 28。未新建、刪除或合併任何 Concept。
- 只補缺漏的 `definition`、`tradeoffs`、`signals`、`antiPatterns`；既有非空陣列的內容逐項保留，缺少第二個要點時僅追加；不替換原有 `coreProblem`／`solutionMethods`、`examples`、原始備註、Tags、分類或 Typed References。
- 新增 `applicationScenarios`（全部明示「示意：」）及 `validationQuestions`，作為**待驗證的跨領域應用與檢驗問題**，不是已執行 Workflow、已核實技術相容性或真實測試結果。
- 新增 20 筆 `intakeReview`，`sourceStatus=provided-material`、`dedupeReview=update`、`verification.status=not-tested`。本輪依既有 Canonical 敘述整理，**未完成 20 個外部原始作者／上游文件的獨立查核**。必要時新增 `source.type=previously-collected-material`，僅描述來源層級，**不是外部來源證明**。
- `classification`、Tags、Entity IDs、正式 Typed References 均保持不變；不可將標題相似或同一 Domain 當作可建立新 Graph Edge 的證據。

## 重複／相鄰 Concept 的語意界線

- `cross-agent-memory-portability` 專注 **Handoff 在不同 Harness 間移植的契約**；`cross-agent-shared-memory` 專注 **跨 Session 共用可追溯記憶資料**。兩者互補，但不直接合併。
- `evidence-backed-agent-investigation` 處理 **調查結論能否追溯證據**；`evidence-before-execution` 處理 **有效性證明是否足以進下一個執行階段**。證據充足不代表獲得真實寫入權限。
- `editable-agentic-timeline` 保存影音剪輯 **Track／Clip／Timeline 的專業後製契約**；`editable-generative-assets` 保存 **向量與圖形素材的可編輯結構**。素材與時間軸 I/O 仍待特定工具驗證。
- `deterministic-execution-boundary` 與 `local-first-sensitive-data-processing` 分別是 **執行決定性** 與 **敏感資料邊界**，不能由單一護欄替代另一個。

## 第 21–40 筆逐筆審查

| # | Canonical ID | 本批補強 | 外部來源／執行 |
|---:|---|---|---|
| 21 | `cross-agent-memory-portability` | 補原理／風險／適用訊號／反例與跨域示意，原有完整欄位僅保留或補足 | provided-material／NOT_TESTED |
| 22 | `cross-agent-shared-memory` | 補原理／風險／適用訊號／反例與跨域示意，原有完整欄位僅保留或補足 | provided-material／NOT_TESTED |
| 23 | `cross-layer-software-reconstruction` | 補原理／風險／適用訊號／反例與跨域示意，原有完整欄位僅保留或補足 | provided-material／NOT_TESTED |
| 24 | `data-ingestion-normalization` | 補原理／風險／適用訊號／反例與跨域示意，原有完整欄位僅保留或補足 | provided-material／NOT_TESTED |
| 25 | `design-to-code-loop` | 補原理／風險／適用訊號／反例與跨域示意，原有完整欄位僅保留或補足 | provided-material／NOT_TESTED |
| 26 | `deterministic-execution-boundary` | 補原理／風險／適用訊號／反例與跨域示意，原有完整欄位僅保留或補足 | provided-material／NOT_TESTED |
| 27 | `editable-agentic-timeline` | 補原理／風險／適用訊號／反例與跨域示意，原有完整欄位僅保留或補足 | provided-material／NOT_TESTED |
| 28 | `editable-generative-assets` | 補原理／風險／適用訊號／反例與跨域示意，原有完整欄位僅保留或補足 | provided-material／NOT_TESTED |
| 29 | `episodic-character-asset-consistency` | 補原理／風險／適用訊號／反例與跨域示意，原有完整欄位僅保留或補足 | provided-material／NOT_TESTED |
| 30 | `eval-gated-subagent-consolidation` | 補原理／風險／適用訊號／反例與跨域示意，原有完整欄位僅保留或補足 | provided-material／NOT_TESTED |
| 31 | `evidence-backed-agent-investigation` | 補原理／風險／適用訊號／反例與跨域示意，原有完整欄位僅保留或補足 | provided-material／NOT_TESTED |
| 32 | `evidence-before-execution` | 補原理／風險／適用訊號／反例與跨域示意，原有完整欄位僅保留或補足 | provided-material／NOT_TESTED |
| 33 | `evidence-preserving-visual-abstraction` | 補原理／風險／適用訊號／反例與跨域示意，原有完整欄位僅保留或補足 | provided-material／NOT_TESTED |
| 34 | `explicit-visual-system` | 補原理／風險／適用訊號／反例與跨域示意，原有完整欄位僅保留或補足 | provided-material／NOT_TESTED |
| 35 | `file-first-memory-source-of-truth` | 補原理／風險／適用訊號／反例與跨域示意，原有完整欄位僅保留或補足 | provided-material／NOT_TESTED |
| 36 | `heterogeneous-model-review` | 補原理／風險／適用訊號／反例與跨域示意，原有完整欄位僅保留或補足 | provided-material／NOT_TESTED |
| 37 | `lease-based-agent-task-coordination` | 補原理／風險／適用訊號／反例與跨域示意，原有完整欄位僅保留或補足 | provided-material／NOT_TESTED |
| 38 | `local-first-sensitive-data-processing` | 補原理／風險／適用訊號／反例與跨域示意，原有完整欄位僅保留或補足 | provided-material／NOT_TESTED |
| 39 | `long-running-agent-operations` | 補原理／風險／適用訊號／反例與跨域示意，原有完整欄位僅保留或補足 | provided-material／NOT_TESTED |
| 40 | `memory-observability` | 補原理／風險／適用訊號／反例與跨域示意，原有完整欄位僅保留或補足 | provided-material／NOT_TESTED |

## 已設計的驗收（實際結果須依 CI 更新）
- 將 `scripts/test-concept-guides.mjs` 擴增至 **40/68**，涵蓋 ID 範圍、定義、取捨、反例、示意／原案例分離、來源與執行宣告。
- 瀏覽器檢查三個新 Concept 在 Knowledge 的實際文字顯示、Catalog 深連結與 375／430／768／1440px 無水平溢出，保留其餘所有舊回歸。
- 驗證 20 筆原資料未被覆寫、Graph Nodes/Edges 及 Canonical 六類總數不漂移，Derived Catalog 必須由 `scripts/build-v2.mjs` 產生；不可直接把衍生資料當手動主來源。
- **目前初稿：PR CI、main CI、GitHub Pages 與部署後 Live Smoke 尚未執行或核對，均為 PENDING。** 不能先填 PASS。

## 仍未驗證
第三方原文／作者與商用授權、各情境的真實效果、外部 Provider API 或執行整合、跨模型獨立評估、Prompt／Agent Runtime：一律 NOT_TESTED。CI 通過只代表資料與網頁契約未退步，不能代表外部有效。

## 下一步
Batch 03：Concepts 第 41–60 筆；先查 [Session Handoff](CONCEPT_CONTENT_HANDOFF.md) 的最新 main 與實際驗收證據。
