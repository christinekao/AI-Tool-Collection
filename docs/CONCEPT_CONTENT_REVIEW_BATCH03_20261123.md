# Concepts Phase 2｜Batch 03（ID 41–60）逐筆審查

2026-11-23（Asia/Taipei）｜Base main `62b81f55a0cd655ad76d5512122575bce5574cf5`｜Branch `concept-content-batch03-20261123`

## 範圍與方法

- 依 Canonical Concept ID 排序更新 **20/20 筆**；完成後內容改善目標 **60/68**，尚餘 8 筆。此文件記錄內容審查，**不宣稱 CI 或部署已通過**。
- 既有 `coreProblem`、`solutionMethods`、原始案例／來源、標題、Tags、Classification、正式 Typed References 均保存；僅在缺漏時補 `definition`、`tradeoffs`、`signals`、`antiPatterns`；非空陣列保留原有順序與內容前綴。保留原有複雜記錄（43、58）而非模板重寫。
- 每筆新增兩個以「示意：」開頭的 `applicationScenarios`、兩個 `validationQuestions`；示意與原始 `examples` 保持獨立。
- `intakeReview.sourceStatus=provided-material`、`dedupeReview.decision=update`、`verification.status=not-tested`。來源僅按 Canonical 素材整理，並非完成第三方原始作者、商用授權或實際工具驗證。
- 編輯時使用 baseline Catalog 與新增記錄逐欄比對，對原有欄位只容許日期和上述內容補強欄位更新；Trade-offs／Signals／Anti-patterns 舊內容只可當作前綴保留。最終完整性仍須經 CI、Graph 和獨立差異覆核。

## 相鄰 Concept 的語意邊界

- `persistent-agent-memory`：持久存續；`outcome-weighted-agent-memory`：依使用結果調整排序；`progressive-context-recall`：按需載入上下文；`reflective-agent-learning`：從經驗推導可修訂規則。互相搭配但不可直接合併。
- `reference-application-pattern-mining`：拆解完整產品架構；`reference-as-prompt-evidence`：將參考作品轉為設計訊號；`reference-backed-pattern-mining`：由多個案例歸納跨案例模式。相似標題不表示相同責任。
- `point-in-time-retrieval` 保證資訊時效邊界，`robust-backtest-validation` 檢查統計和交易假設；兩者不能互相替代。
- `quality-gates-verification` 是普遍證據與交付驗證；`security-as-workflow-gate` 是授權、秘密、供應鏈及權限的獨立放行限制。

## 逐筆結果

| # | Canonical ID | 本批改善重點 | 外部實效／授權 |
|---:|---|---|---|
| 41 | `motion-interaction-layer` | 互動狀態、動態節奏、效能與 reduced-motion | NOT_TESTED |
| 42 | `outbound-private-tool-bridge` | Outbound relay 與本機工具授權分界 | NOT_TESTED |
| 43 | `outcome-first-minimal-brief-ai-web-design` | 保留既有完整定義／來源，只補候選示意與驗證問題 | NOT_TESTED |
| 44 | `outcome-weighted-agent-memory` | 結果權重與可靠性分離；保留原有 Trade-offs | NOT_TESTED |
| 45 | `persistent-agent-memory` | 長期存續不同於移植或召回排序 | NOT_TESTED |
| 46 | `point-in-time-retrieval` | 發布時間、快照與未來資訊洩漏 | NOT_TESTED |
| 47 | `progressive-context-recall` | 索引→摘要→全文的按需揭露 | NOT_TESTED |
| 48 | `prompt-to-output-comparative-learning` | Prompt、環境、輸出配對與控制變因 | NOT_TESTED |
| 49 | `quality-gates-verification` | 證據 Gate 與真實部署／外部驗證分層 | NOT_TESTED |
| 50 | `reference-application-pattern-mining` | 應用架構與產品流程模式萃取 | NOT_TESTED |
| 51 | `reference-as-prompt-evidence` | 參考作品轉成可觀察設計訊號 | NOT_TESTED |
| 52 | `reference-backed-pattern-mining` | 多案例歸納、反例與來源保存 | NOT_TESTED |
| 53 | `reflective-agent-learning` | 經驗轉規則，推論不能冒充事實 | NOT_TESTED |
| 54 | `research-to-structured-visualization` | 研究證據到可編輯關係圖 | NOT_TESTED |
| 55 | `retrieval-grounded-knowledge-layer` | 來源、ACL、版本與文件指令注入 | NOT_TESTED |
| 56 | `reusable-agent-skills` | 可攜 Skill 的 Trigger、風險和回歸 | NOT_TESTED |
| 57 | `reversible-privacy-boundary` | 本機映射、可逆遮罩與間接識別 | NOT_TESTED |
| 58 | `risk-adaptive-agent-code-review` | 保留既有完整 Review 機制，只補跨域情境 | NOT_TESTED |
| 59 | `robust-backtest-validation` | 樣本外、成本、調參與可得時間 | NOT_TESTED |
| 60 | `security-as-workflow-gate` | Security Gate 與一般功能品質 Gate 分離 | NOT_TESTED |

## 驗收範圍與待完成證據

- `scripts/test-concept-guides.mjs` 覆蓋 ID 1–60，且保留前兩批回歸；檢查定義、取捨、訊號、反例、候選情境、驗證問題、Intake 和正式 Typed Refs 的邊界。
- `scripts/test-knowledge-browser.mjs` 增加 3 筆 Batch03 概念的 Knowledge 展示與 Catalog 深連結，檢查 375／430／768／1440px，保留舊測試。
- 需要真實 CI：Unified Intake、V2 Data Validate、P1 Graph／Browser；需要 Canonical→Derived 正規重建，不能僅靠手動變更 Catalog。
- PR CI、正式 `main` CI、Catalog Sync、Pages Deploy 和部署後 Live Smoke 應各自記錄連結、Commit、實際結果及失敗證據。**此版文件尚未把它們標示 PASS。**
- 六類基準數量為 270／123／68／35／17／36；Graph 基準為 569 Nodes／1816 Edges。變更後必須重新執行測試核對，不能預設基準持續成立。
- 真實模型、第三方 API 整合、原作者與授權、使用成效均屬 **NOT_TESTED**，不得被內部 CI PASS 冒充驗證完成。

## 下一步

待 PR 實際驗收通過才可合併；正式站部署後再驗收，最後更新 Handoff。下一批為剩餘 ID 61–68。

## CI Failure → Fix（保留失敗證據）

- PR #50 首次 [Unified Intake Gate #45127459267](https://github.com/christinekao/AI-Tool-Collection/actions/runs/45127459267) **FAIL**：20 筆的 `tagReview.reason`、`capabilityReview.reason` 低於現有欄位長度契約；不是資料遺失或分類變更。
- 修正：只延長兩個 Review 理由文字，補足保留既有 Tags 和不建立未實測 Capability 的邏輯；原始欄位、分類和 Typed References 不變。
- 修正後 PR CI、回歸與部署結果需另以實際 Run 驗證；此處不提前標 PASS。
