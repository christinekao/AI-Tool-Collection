# Knowledge Relations｜Phase 3 Audit 02 — 雙案例來源／契約深度審查

日期：2026-11-23｜Base main `106be4d37cb9ee7c38dab25c75ff7979ee7ed618`｜狀態：**Documented evidence + candidate contracts；Runtime NOT_TESTED**。

## 目標與決策範圍

本批依 [Audit 01](RELATIONSHIP_AUDIT_PHASE01_20261123.md) 的優先順序，專門審查同名的 Combination／Workflow：`stack` 與 `system-1-system-2-agent-routing-stack`。先讀 Canonical 原文、7 筆 Resource 的既有來源與 2026-11-23 可取得的上游公開文件，辨認功能交接與限制，然後提供 **9 個候選 Stage Contract**（Input、Output、Gate、失敗時處理）；沒有進行第三方執行、Token/Secret 存取、資料外送或額外安裝。

機器可讀的逐階段候選契約：[`RELATIONSHIP_AUDIT02_PROPOSALS_20261123.json`](RELATIONSHIP_AUDIT02_PROPOSALS_20261123.json)，其 `status=proposal-not-implemented`。新 [回歸測試](../scripts/test-relationship-proposals.mjs) 檢查 2 組 Pair／7 個 Resource／9 個 Stage 的實際 ID、可核對來源、No-Mutation、禁止 Typed Link 自動升級、風險優先 Gate、以及破壞性操作負向案例。

### 兩組 Combo／Workflow 原始證據

| 指標 | `stack` | `system-1-system-2-agent-routing-stack` |
|---|---|---|
| 同名 Combo 與 Workflow | 是 | 是 |
| Combo 正式成員 | 4：Onyx、WrenAI、Crawl4AI、MinerU | 3：Laya、OmniRoute、Codex |
| Stage | 4 | 5 |
| 原始 Stage `outputs` 非空 | 0 | 0 |
| 原始 Stage `gate` 非空 | 0 | 0 |
| 原始 Combo `rationale` | 空 | 空 |
| 他份 Workflow 正式引用 Combo | 0 | 0 |
| 原始正式 `conceptRefs` | 空 | 空 |
| 決策 | **暫保留、待證明獨立重用價值** | **暫保留、執行安全需重設 Gate** |

以上是 Repo Canonical 現況，不代表 API 能直接互通。沒有編修任何原始 Canonical、Typed Reference、Tag、Classification、Generated Catalog 或 Graph。

## 案例 A：企業知識問答（ID `stack`）

**責任邊界**：MinerU／Crawl4AI 解決文件或網站 ingestion；Onyx 提供文件索引、權限化查詢與 RAG；WrenAI 提供以 MDL 模型定義的商業語意層、SQL Planning／Dry-run；最後才由明確的 Agent／人工整合檢索與 SQL 結果。這四種角色互補但不意味四個工具有共同資料 Schema 或原生端到端整合。

**上游文件查核（Documentation Review，非 Runtime Test）**：

- [MinerU Output Files](https://github.com/opendatalab/MinerU/blob/master/docs/en/reference/output_files.md)：不同入口的 Markdown、Middle JSON、Structured Content 等輸出並非相同 JSON Schema。解析內容必須帶來源頁碼／範圍及版本，不能直接把 JSON 混送成 Onyx 的文件標準。
- [Crawl4AI Quickstart](https://github.com/unclecode/crawl4ai/blob/main/docs/md_v2/core/quickstart.md)：網頁→Markdown／結構化擷取；網頁規則與個資不得因擷取方便而被跳過。
- [Onyx Connectors](https://github.com/onyx-dot-app/onyx/blob/main/documentation/overview/core_features/connectors.mdx)：索引可以保留 metadata，但**來源文件權限同步需要 Enterprise Edition**；Community 路徑不可預設等價權限保障。
- [WrenAI Architecture](https://github.com/Canner/WrenAI/blob/main/docs/core/reference/architecture.md)：MDL、Schema Linking、Dry-plan、Dry-run、Connector Execution 是受治理 BI 的不同步驟；不能把資料庫連線或 SQL 生成視為 SQL 結果已正確。
- **尚未查核證實**：Onyx→WrenAI 的直接 Connector／雙向 SDK Contract、SQL 與 RAG 來源的身份傳遞、對應的授權政策、資料駐留與同時間點一致性。

| Stage | 候選輸入 | 候選輸出 | 必要 Gate／異常處理 |
|---|---|---|---|
| 1. Ingest | 核准 URL／PDF、權限規則 | 有來源 ID、時間、版本的 Markdown／Structured Data | OCR／網頁來源、敏感資料、擷取失敗皆需標記，不得無憑據寫入索引 |
| 2. Retrieve | 合規索引文檔、群組權限 | 有文件 ID／索引版本的 RAG 結果 | 區分 Edition；不具來源權限同步則不得套用保密資料 |
| 3. Semantic Query | 商業問題、MDL、唯讀資料庫 | SQL 計畫／驗證結果／資料截止時間 | Dry-plan／Dry-run、口徑、SQL 權限、無定義 KPI 的澄清 |
| 4. Integrate | 文件引用與資料庫查詢證據 | 含引用、口徑、缺口的整合回答 | 驗證引用與 SQL 口徑；不相容或不同時間點時分開呈現，拒絕虛構合併 |

**Combination 的獨立性判定**：目前看得到四個角色，但沒有可跨其他 Workflow 重用的、版本化的 I/O 與 Adapter、來源同步權限合約，故 **RETAIN PENDING PROOF**；若後續只服務同名 Workflow，優先考慮其 Implementation Options 層，而非立刻合併／刪除。原始 ID `stack` 過於泛化，可先研究顯示名稱改善，但不改 ID／Typed Refs。

## 案例 B：System 1 → System 2（ID `system-1-system-2-agent-routing-stack`）

**關鍵安全問題：原 Stage 2「高信心決策直接進自動流程」不足以作為高風險執行 Gate。**

- [Laya 官方 Q&A（Reading confidence）](https://github.com/NandhaKishorM/laya/blob/main/docs/questions-and-answers.md) 說明 `answer_confidence` 與 `confidence` 意義不同，出廠模型未通過充分校準；門檻必須依任務、選項數及 Held-out Data 校準與驗證。**不能因信心值大就觸發寫入、退款、提交或外送資訊**。
- [Laya 官方 Benchmark](https://github.com/NandhaKishorM/laya/blob/main/BENCHMARKS.md) 的作者數值與不同 Checkpoint、Task 存在明顯限制；不能用宣傳 Benchmark 當此案子已實測結果。
- [OmniRoute Resilience Guide](https://github.com/cheaper-inference/OmniRoute/wiki/Resilience-Guide) 描述 Provider 的 Fallback、Cooldown 與路由策略，但備援**不保證**相同 Tool Schema、資料政策與執行權限。原始 Source `diegosouzapw/OmniRoute` 已導向 `cheaper-inference/OmniRoute`，舊 Repo Canonical 身分／Aliases 應另開維護項目，這次不直接改寫。
- [Codex 官方 Repo](https://github.com/openai/codex/blob/main/README.md)：Coding Agent 的本機工具操作與 Provider API 是不同能力，不能假設 OmniRoute 能把 Codex 工作環境當作任意 Model Backend 原生替換。
- **尚未查核證實**：Laya 的企業任務校準、System 1 與 OmniRoute 的真正整合、OmniRoute → Codex 的任務／權限傳遞、安全人工核准強制機制。

| Stage | 候選輸入 | 候選輸出 | 必要 Gate／異常處理 |
|---|---|---|---|
| 1. Typed Decision | 最小化、可分類的任務輸入 | Intent／Risk／不確定性分類 | 資料或語言分布外、未知類型立即保守升級 |
| 2. **Risk-first Gate** | Risk、政策、已校準 `answer_confidence` | `allow-low-risk`／`escalate-model`／`human-review`／`reject` | **權限與風險先行**；未校準、敏感或高風險：Fail Closed |
| 3. Route Provider | 受核准 Provider／模型、Quota／成本 | Provider／Model／Fallback 選擇、可支援 API Contract | 不可對未知 Provider 外送個資；不相容則拒絕備援 |
| 4. Deep Reasoning | 具授權與驗收條件的任務 | 可測試的推理或 Coding Agent 交付證據 | 模型生成和 OS 工具執行有獨立權限邊界 |
| 5. Human Review | 高風險與缺證據紀錄 | 人工簽核／退回／拒絕、Trace | 不許模型自動越過核准或無人簽核執行 |

**Combination 的獨立性判定**：Laya、OmniRoute 與 Codex 代表不同責任層；其互補**概念**成立，但目前沒有端到端統一接口、跨 Workflow 使用證據或受核准的高風險執行 Gate，因此 **RETAIN PENDING PROOF**。先將安全修訂列為 Workflow 候選契約，不把尚未測過的模型信心或 Provider 支援升格成事實。

## 可調整的方案與正式決策條件

| 案例 | 保留獨立 Combination | 補強 Workflow Contract | 改列 Implementation Options |
|---|---|---|---|
| `stack` | 只有找到第二個使用情境且可驗證權限／I/O 才有充分證據 | **建議先做**：來源 Metadata、文件權限、MDL／SQL Trace、Citation 對照 | 如只服務同名 Workflow 且無獨立協作契約，未來考慮 |
| `system-1-system-2-agent-routing-stack` | 只有 Provider／決策／執行三層契約可被多流程安全重用才保留獨立設計 | **P0 建議先做**：Risk-first／Calibration／Human Approval／Fallback Permissions | 如只有不同工具候選而非可替換組合，未來考慮 |

**本批決策**：不刪除、不合併、不重命名、不建立正式 Concept Link。先獨立記錄候選契約，下一次只在有真實測試／Adapter 證據時推進至 Canonical Workflow／Combination；高風險動作仍須明確核准。候選 Concept：`stack` 可追溯到 `semantic-layer-for-ai`、`retrieval-grounded-knowledge-layer`；System 1 Routing 可對照 `system-1-decision-layer`、`confidence-gated-automation`、`vendor-agnostic-orchestration`。這些均未寫入 `conceptRefs`。

## 實際驗收、回歸與未驗範圍

- **Source Level**：官方公開文檔有文字依據；上游 Repo 變更／來源身份核對與可用功能可能隨版本演進。沒有對各 Repo 及商用授權做完整版本鎖定／法律審查。
- **Runtime Level**：所有 9 個階段仍 `proposal-not-implemented`；未部署、未測 Provider API、未評估 Calibration 或資料安全的真實防護；全部 **NOT_TESTED**。
- **Repo Integrity**：原始 2× Combo／Workflow、7× Resources、5×候選 Concepts 都保持不變，Graph 新增 0，原始 Stage 排序及 ID 不變。
- **CI**：新增 4 組 Source-backed Proposal Contracts（正常狀態、不修改 Canonical、拒絕偽造執行、拒絕未校準 Gate／無效 ID），使用 V2 Data Validate Workflow 驗證；實際 PASS／FAIL Run 應在完成驗證後追加。
- **NEXT**：先以合成資料建立一個最小可測的流程（不接公司資料、不使用真實模型帳號或外部付費服務），重點檢查 `high-risk` 不會直接執行，以及 `document`、`SQL` 來源引用可回溯，再依證據決定是否需要正式 Canonical 修改。
