# Knowledge Relations｜Phase 3 Audit 01（2026-11-23）

**範圍：68 Concept／36 Workflow／17 Combination。檢查來源為 GitHub main `b38cffbba03b59f6574d3902a7c0981a97f05014`。**
本階段是**只讀語意稽核與候選決策清單**：不改動任何 Canonical Entity、ID、Tags、分類、Typed References、Graph、Catalog，亦不刪除或合併資料。

## 目標與決策規範

- 維持 `Problem → Concept → Workflow → Implementation Options` 的使用路徑。
- **Combination** 必須能表達不同元件互補／替代的原因、可核對 I/O 與相容限制，以及多個 Workflow 或情境的獨立重用價值；沒有證據就不宣稱可直接組合。
- **Workflow** 強調有序步驟與輸入／輸出／Gate；**Concept** 保存跨工具有效的原理，不依相同標籤自動建立 Typed Reference。
- 合併、刪除、改名、重定向 ID 及增加未經證實的正式 Graph Edge 均不在本次授權範圍內。

## 可重現的量化觀察

| 指標 | 此輪結果 | 判讀 |
|---|---:|---|
| Canonical Concepts | 68 | 前期內容整理已完成；不代表外部原始來源已核實 |
| Canonical Workflows | 36 | 本輪納入獨立與同名 Workflow |
| Canonical Combinations | 17 | 原始全部保留 |
| 同 ID 且 Title／Goal 相同的 Combo–Workflow Pair | 17 | 可能合理分層，不能直接判定重複 |
| 同名雙向 Typed References | 17 | 目前互相指向同一筆，構成可追蹤關係 |
| Combination 沒有 rationale | 14 | 缺獨立組合價值說明 |
| 有 rationale，但 typed members 少於 2 筆 | 3 | 仍無法由此證明多元件可互補或互換 |
| 同時具 rationale 與 2 筆以上 typed members | **0** | 依現有欄位，尚無完整組合主張的基本前提 |
| 有 alternatives | **0** | 替代條件未建模 |
| 被其他不同 Workflow 正式引用的 Combination | **0** | 尚無多 Workflow 重用證據 |
| 同名 Workflow 缺結構化 Outputs／Gate | **16／17** | 只有 `cross-agent-continuity-stack` 的交接階段具結構化 Outputs／Gate；不能以這個欄位單獨判定可執行性 |
| 非同名的 19 個 Workflow 有結構化 Outputs | **19／19** | 與前述 16/17 形成值得後續補強的資料契約落差 |
| 擁有正式 Concept Refs 的 Workflow／Combination | **19／36、3／17** | 其他是未建立關係，不等於經審查後確認不適用 |
| 目前 Typed Reference 錯誤 | **0** | 靜態檢查 PASS，並非證明外部工具互通 |
| 狀態 | **REVIEW REQUIRED** | 所有 17 筆保留，不標記為可安全刪除 |

上面是**現有欄位的可觀測事實**，不等同實際上不存在相容工具或跨流程用途。真正的元件 I/O、版本、風險、上游資料與授權尚未全面獨立驗證。量化檢查由 `node scripts/audit-knowledge-relations.mjs` 以 Canonical 即時重算（摘要輸出）；加入 `--details` 顯示 17 筆逐筆 Review Flags。若資料變更，以即時輸出為準。

## 17 筆 Combination 逐筆審查佇列

| Combination ID | 現有證據缺口 | 處置 |
|---|---|---|
| `agent-stack` | 無組合理由；成員 4 筆，Workflow stage 契約需補 | **保留，待審** |
| `agentic-video-production-stack` | 無組合理由；工具從概念到輸出缺相容性證據 | **保留，待審** |
| `ai-vector-asset-code-stack` | 無組合理由；SVG→Motion 介面仍需驗證 | **保留，待審** |
| `codebase-agent-context-stack` | 無組合理由；Context 元件角色需釐清 | **保留，待審** |
| `coding-agent-stack` | 無組合理由；與 agent-stack／codebase-agent-context-stack 的適用邊界待辨 | **保留，待審** |
| `cross-agent-continuity-stack` | 無組合理由；只有 Handoff Stage 有結構化輸出／Gate | **保留，待審** |
| `generative-ui-stack` | 無組合理由；元件 Schema、工具相容性需證據 | **保留，待審** |
| `goal-build-evidence-learning-loop` | 已有理由；但 members 為 0，組合成分未建立 | **保留，待審** |
| `local-pii-ai-processing-loop` | 已有理由；members 只有 1 筆，外部替代元件未核證 | **保留，待審** |
| `long-running-agent-foundation-stack` | 無組合理由；多種 Hermes 插件是否可共用需核證 | **保留，待審** |
| `reference-agent-implementation` | 無組合理由；參考站、技能和實作工具混用需釐清 | **保留，待審** |
| `spec-multi-agent-delivery-evidence-qa-stack` | 無組合理由；HCOM 與多 Agent 互通仍只是流程描述 | **保留，待審** |
| `stack` | 無組合理由且 ID 過於泛化；不同知識來源的組合介面需審查 | **保留，待審** |
| `stateful-repository-agent-automation-stack` | 無組合理由；原 notes 明說非官方 gh-aw／Hindsight 整合 | **保留，待審** |
| `system-1-system-2-agent-routing-stack` | 無組合理由；分數校準／路由契約尚需實測 | **保留，待審** |
| `voice-publish-evidence-social-content-loop` | 已有理由；members 只有 1 筆且發佈權限需驗證 | **保留，待審** |
| `web-research-agent-stack` | 無組合理由；平台 Access 與 Crawl/LLM 契約待審 | **保留，待審** |

分類優先順序：**第一級 14 筆**沒有 `rationale`，需先回答與同名 Workflow 不同的獨立價值；**第二級 3 筆**有理念但沒有至少兩個正式成員，需確認應維持 Combination、補有證據的實際成員，或將相關說明改為 Workflow 的 Implementation Options。任何處置前先做來源核對與依賴影響分析，不直接清除。

## 跨類 Concept 連結候選（NOT VERIFIED，非正式 Typed References）

以下只比對既有 `Workflow.stages[].purpose` 與 `Concept.solutionMethods` 的具體語意；**沒有**更新任何 `conceptRefs`，也未承諾工具可在實際環境互換。

| Workflow | 候選 Concept | 文字證據 | 正式建立前 Gate |
|---|---|---|---|
| `stack` | `semantic-layer-for-ai` | workflow.stages[2].purpose：WrenAI governed SQL；concept.solutionMethods：business metrics、Join 治理 | 先核對 WrenAI 真實支援的語意定義、版本與權限 |
| `stack` | `retrieval-grounded-knowledge-layer` | workflow.stages[1].purpose：Onyx 索引與 RAG；concept.solutionMethods：connector／retrieval／權限 | 先驗證檢索來源與權限，不以同一 Workflow 視為兩系統兼容 |
| `system-1-system-2-agent-routing-stack` | `system-1-decision-layer` | workflow.stages[0].purpose：typed decision；concept.solutionMethods：choice／score／boolean | 先核對低信心與風險 Gate，不直接依模型分數執行敏感動作 |
| `agentic-video-production-stack` | `agentic-media-pipeline` | workflow.stages[0/2].purpose：orchestration／transcription QA；concept.solutionMethods：research→render／quality gate | 核對專業工具間 I/O、輸出規格與實際執行 |
| `ai-vector-asset-code-stack` | `editable-generative-assets` | workflow.stages[0].purpose：editable SVG；concept.solutionMethods：SVG／vector、可編輯格式 | 驗證不同工具產生的 SVG 可編輯性與動畫匯入 |
| `cross-agent-continuity-stack` | `cross-agent-shared-memory` | workflow.stages[0].purpose：shared memory；concept.solutionMethods：共享儲存／跨 Agent | 先核對隱私、跨 Session 實際讀取、分區與版本 |
| `generative-ui-stack` | `constrained-generative-ui` | workflow.stages[2].purpose：allowed component schema；concept.solutionMethods：schema／design system | 先核對 component schema、產出 renderer 和可及性 |
| `reference-agent-implementation` | `reference-as-prompt-evidence` | workflow.stages[0/1].purpose：visual／motion reference 與 design signals；concept.solutionMethods：reference→design signals | 不能把 reference 當成可複製他人 UI 的授權 |

候選 8 個（其中 `stack` 兩個）；只是可供獨立審核的清單，**Graph 新增正式 Edge：0**。若未來確定要加入 `Workflow.conceptRefs`，要補明確的來源和相容說明，再走 Canonical Intake、Build、Validation、Graph／Browser regression；不要以 Tag match 自動新增。

## 關鍵風險與下一輪任務

1. **無根據的重複判定**：17 筆同名不代表可自動刪除。暫保留所有組合及原來的正反向 References。
2. **跨 Workflow 重用缺口**：目前沒有第二個 Workflow 正式引用同一 Combination，需找實際跨流程的 I/O、授權、可替代條件，並與原始來源核對。
3. **Workflow 執行契約薄弱**：同名 17 Workflow 的 Stage 多以 `purpose` 敘述工具，缺結構化 `outputs` 和 `gate`；下一輪優先挑 1–2 個具真實來源的案例做細節補強，不把想像流程視為可執行整合。
4. **Generic ID `stack`**：名稱難辨識，但 ID 必須保留。可以先改善使用端顯示名稱或描述，正式更名牽涉引用遷移，需另行授權。
5. **分辨測試等級**：本次 Node tests、GitHub CI 是 Schema／分類關係／靜態回歸證據；外部 Provider 的真實功能、跨工具 I/O、商用授權均 **NOT_TESTED**。

## 非破壞性交付與驗收

- 新增只讀 `scripts/audit-knowledge-relations.mjs`（包含逐筆審查旗標與明確 Typed Refs 完整性檢查）、`scripts/test-knowledge-relations-audit.mjs`（原有紀錄與負向 Broken References Regression）。
- 加入既有 V2 Data Validate Workflow 作為獨立 Test Gate。報告旗標不會直接讓 Workflow Fail；只有引用破損／程式測試失敗才 FAIL。
- 不改動 `data/` 任何檔案；無須重建 Derived Catalog。完成時須核對 PR Diff、CI 與 main CI，並記錄實際驗收證據。
- 後續針對 `stack`、`system-1-system-2-agent-routing-stack` 等代表案例做來源／契約 Review，未查證前不能把候選關聯升格成正式 Graph Edge。

## PR #52 初次實際驗收（靜態／無正式站變更）

- [V2 Data Validate PR Run #45143105771](https://github.com/christinekao/AI-Tool-Collection/actions/runs/45143105771)：**PASS**，包含既有 Taxonomy、Tags、Workflow Engine、Graph、68 Concepts、Canonical→Derived 的回歸及新增 4 個關聯稽核 Test。
- 新增關聯測試 4/4 PASS，包含「不能依同名自動刪除」、「不能從 Tag／名稱推導正式 Graph」、「Explicit Typed Ref 損壞的負向案例」。實際掃描的 Integrity Errors 為 0。
- 實際 CI 掃描 68／36／17，17/17 同 ID 互引；14 筆無 rationale、3 筆有理由但少於兩個正式成員，17/17 無 alternatives／跨 Workflow 正式重用；16/17 同名 Workflow 沒有 Stage Outputs 或 Gate，而另外 19/19 個 Workflow 有結構化 Outputs。
- PR Diff 不含任何 `data/` 路徑；修改僅限 Audit scripts／test／既有 V2 Workflow／Docs。未實測 Provider / API。
- 因後續會再補一版較精簡的 CLI 輸出與本審查紀錄，**此處 Run 是前一 PR Head 的 PASS**；最新 PR Head 仍須實際重跑 CI。

## 最終 PR／main／部署收據（2026-11-23）

- 最終 PR Head `23ccb89ce5098b9826892cd43689bccd29d5afcb`，[PR V2 Data Validate #45143353941](https://github.com/christinekao/AI-Tool-Collection/actions/runs/45143353941) **PASS**。
- [PR #52](https://github.com/christinekao/AI-Tool-Collection/pull/52) Squash Merge `d930671d9a4a83209028c5ed139e4fdd56d5dc67`，其 [main V2 Data Validate #45143458363](https://github.com/christinekao/AI-Tool-Collection/actions/runs/45143458363) **PASS**；新測試 4/4 PASS，全部引用 Integrity Errors 0。
- [Pages Deploy #45143457510](https://github.com/christinekao/AI-Tool-Collection/actions/runs/45143457510) **PASS**（2026-11-23 09:03:10 UTC）。本 PR 未修改網站 UI、Canonical 或 Generated Catalog，並沒有觸發新一輪獨立的正式站 Chromium Live Smoke；故 **Live Smoke NOT_TESTED（本階段）**。
- 最後的 Docs-only Commit 又會觸發 Pages Deploy；為避免反覆更新文件，最新版本的 Deploy 回執將附在 [PR #52 留言](https://github.com/christinekao/AI-Tool-Collection/pull/52) 中。所有外部整合、上游授權與真實效益維持 NOT_TESTED。
