# Concepts Phase 2 — Batch 01（第 1–20 筆）內容審查
2026-11-22（Asia/Taipei）｜Base main `ddf890b7dc7b262934f84fe29e009eb9adaa4a68`｜Branch `concept-content-batch01-20261122`

## 範圍及保留原則
- 依 68 筆 Canonical ID 排序第 1–20 筆逐項整理，20 筆均更新；沒有新建、合併或刪除 Concept。
- 保留既有 `coreProblem`、`solutionMethods`、`examples`、原始使用者內容、來源、Tags、分類、Typed References；僅增補缺少的 `definition`、`tradeoffs`、`signals`、`antiPatterns`、候選跨領域場景及判斷問題、Intake 與日期。
- AI Coding Stack 既有相對完整內容不重寫，僅補跨領域情境／驗證問題及 Intake。
- 所有跨領域情境均以「示意：」開頭，與 `examples` 中的「已記錄案例」分開；不能冒充實測、正式 Workflow、可直接整合或取得授權。
- 所有新 `intakeReview` 都是 `sourceStatus=provided-material`、`dedupeReview=update`、`verification.status=not-tested`；沒有逐筆核實外部原始作者／授權。
- 不變更 Tags、Domain、Capability、Typed References；Graph 預期無新增正式邊，必須由 CI 核對。

## 逐筆 Review
| # | Canonical ID | 內容補強 | 來源與執行 |
|---:|---|---|---|
| 1 | `agent-credential-isolation` | 新增／補強定義、取捨、適用訊號、反模式、跨域情境、驗證問題、Intake | provided-material／not-tested |
| 2 | `agent-native-tool-abstraction` | 新增／補強定義、取捨、適用訊號、反模式、跨域情境、驗證問題、Intake | provided-material／not-tested |
| 3 | `agent-organization-control-plane` | 新增／補強定義、取捨、適用訊號、反模式、跨域情境、驗證問題、Intake | provided-material／not-tested |
| 4 | `agent-runtime-harness` | 新增／補強定義、取捨、適用訊號、反模式、跨域情境、驗證問題、Intake | provided-material／not-tested |
| 5 | `agentic-ci-workflow-compilation` | 新增／補強定義、取捨、適用訊號、反模式、跨域情境、驗證問題、Intake | provided-material／not-tested |
| 6 | `agentic-media-pipeline` | 新增／補強定義、取捨、適用訊號、反模式、跨域情境、驗證問題、Intake | provided-material／not-tested |
| 7 | `ai-coding-stack-agent-ade-model-gateway-spec-architecture-knowledge` | 保留原有完整分析，新增候選跨域情境、驗證問題、Intake | provided-material／not-tested |
| 8 | `capability-aggregation-gateway` | 新增／補強定義、取捨、適用訊號、反模式、跨域情境、驗證問題、Intake | provided-material／not-tested |
| 9 | `capability-cost-routing` | 新增／補強定義、取捨、適用訊號、反模式、跨域情境、驗證問題、Intake | provided-material／not-tested |
| 10 | `closed-loop-social-content-system` | 新增／補強定義、取捨、適用訊號、反模式、跨域情境、驗證問題、Intake | provided-material／not-tested |
| 11 | `codebase-knowledge-graph` | 新增／補強定義、取捨、適用訊號、反模式、跨域情境、驗證問題、Intake | provided-material／not-tested |
| 12 | `cognitive-skill-transfer-loop` | 新增／補強定義、取捨、適用訊號、反模式、跨域情境、驗證問題、Intake | provided-material／not-tested |
| 13 | `component-primitives-design-system` | 新增／補強定義、取捨、適用訊號、反模式、跨域情境、驗證問題、Intake | provided-material／not-tested |
| 14 | `confidence-gated-automation` | 新增／補強定義、取捨、適用訊號、反模式、跨域情境、驗證問題、Intake | provided-material／not-tested |
| 15 | `constrained-generative-ui` | 新增／補強定義、取捨、適用訊號、反模式、跨域情境、驗證問題、Intake | provided-material／not-tested |
| 16 | `constraint-bounded-editing` | 新增／補強定義、取捨、適用訊號、反模式、跨域情境、驗證問題、Intake | provided-material／not-tested |
| 17 | `content-production-pipeline` | 新增／補強定義、取捨、適用訊號、反模式、跨域情境、驗證問題、Intake | provided-material／not-tested |
| 18 | `context-governance` | 新增／補強定義、取捨、適用訊號、反模式、跨域情境、驗證問題、Intake | provided-material／not-tested |
| 19 | `continuity-driven-motion-design` | 新增／補強定義、取捨、適用訊號、反模式、跨域情境、驗證問題、Intake | provided-material／not-tested |
| 20 | `cross-agent-harness-portability` | 新增／補強定義、取捨、適用訊號、反模式、跨域情境、驗證問題、Intake | provided-material／not-tested |

## 可驗證與未驗證邊界
- 新增 `scripts/test-concept-guides.mjs` 檢查前 20 筆內容、候選情境標籤及來源／執行狀態。
- `knowledge-app.js`、`catalog-app.js` 顯示候選跨領域場景、驗證問題，與原有實際案例分開。
- P1 Graph Workflow 對 Concept 變更觸發，並加入 Concept 專屬靜態檢查；保留原有 Browser／Responsive 回歸。
- **GitHub PR、CI、main 合併、Pages Deploy、部署後 Live Smoke 於本版文件建立時尚未驗證；均為 PENDING。**
- 實際模型輸出、案例成效、外部工具串接、作者與商用授權查核：NOT_TESTED。
- 驗收後應記錄真實 PR、Commit、CI、Pages 與 Smoke Run，失敗需留下 Fail→Fix→Regression 證據。

## 下一步
Concepts Batch 02：排序後第 21–40 筆；依最新 main 與 Session Handoff 接續，不憑名稱推測正式 Graph Edge。
