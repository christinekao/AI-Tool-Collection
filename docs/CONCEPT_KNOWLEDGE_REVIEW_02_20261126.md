# Concept 知識關聯｜Review 02：Agent architecture、orchestration、skill routing（2026-11-26）

基準 main `c2cfd5ed5f1c3aaf48e6a4c87192756104feb1f9`。前輪 Review 01 於 PR #137（尚待完整 CI），已列出 20 個定義；本輪 17 個 ID 與該名單無交集，累計 37/68，剩餘 31。讀取各 Concept 的 definition、coreProblem、solutionMethods、validationQuestions、現有 exampleRefs/relatedConceptRefs。以下是語意審查候選，非 Graph promotion。保留全部 Canonical。

## 1. 逐筆語意邊界

| Concept ID | 問題、機制與可檢查輸出 | 不等價反例／決策 |
|---|---|---|
| agent-native-tool-abstraction | 跨 Provider I/O、錯誤及 Adapter 契約；輸出可替換的 Agent-facing interface | 統一 API 不等於管理整個能力目錄；保留 |
| capability-aggregation-gateway | 多類能力集中發現、權限與延遲載入；輸出 scoped capability catalog | 目錄可列出異質工具而不提供統一業務語意；保留 |
| agent-runtime-harness | 模型與工具、檔案、權限及工作狀態接合；輸出受控工具執行與 trace | 單 Agent Harness 不需要組織預算或多 Agent 治理；保留 |
| agent-organization-control-plane | 組織級所有權、成本、心跳、審批、RBAC；輸出治理狀態及 audit | 有治理服務不代表它能執行模型工具；保留 |
| agentic-ci-workflow-compilation | 宣告式 Agent CI source 編譯成可重現 Workflow，隔離 scoped writes | 決定性執行不必使用 CI 編譯器；保留 |
| deterministic-execution-boundary | 將非決定性計畫與正式 action 分開；狀態機、審批與回讀 | 即使 CI 編譯正確，若讓模型直接付款仍違反邊界；保留 |
| ai-coding-stack-agent-ade-model-gateway-spec-architecture-knowledge | 五種 AI coding 工具職責：Harness、ADE、Gateway、Spec、ADR；輸出責任比較 | 工具分類不是所有部署的必要拓撲；保留為解釋型架構 Concept |
| workflow-agent-system-agent-os-three-layer-architecture | 固定流程、情境決策、Runtime/治理三層責任；輸出責任與權限邊界 | 非 coding 業務流程也可使用三層，無須 ADE 或 ADR；保留 |
| vendor-agnostic-orchestration | 定義角色及協作 contract 再綁 Provider；輸出可替換的 workflow mapping | 固定成本路由也可能被鎖在單一 Provider；保留 |
| capability-cost-routing | 按風險、難度、成本與延遲分配模型或工具；輸出路由選擇及 fallback | 可攜流程未必成本最適；保留 |
| reusable-agent-skills | 封裝版本化程序、工具契約與驗收；輸出可載入的 Skill | 有 Skill package 不代表能正確選中；保留 |
| task-aware-skill-routing | 按意圖、授權、可用性選擇 Skill 與 fallback；輸出路由結果 | 選中 Skill 不等於已安裝或安全執行；保留 |
| cross-agent-harness-portability | 盤點兩環境語意，轉譯設定並驗證 drift／回滾 | Provider 可替換不等於 Hooks/Skills 設定可移植；保留 |
| lease-based-agent-task-coordination | Task Lease／heartbeat、advisory file claim 與 Git handoff | 共用 memory 或控制面不等於具備原子 Claim；file claim 不等於寫入鎖；保留 |
| eval-gated-subagent-consolidation | 基準、held-out case、逐步整併與回歸；輸出保留／折疊／合併決策 | 減少 Agent 可能破壞獨立驗證；保留 |
| heterogeneous-model-review | 獨立資訊／模型／context 審查，降低共同盲點；輸出可驗證 findings | 異模型可能有共同偏誤，不能取代測試；保留 |
| outbound-private-tool-bridge | 本機主動建立 outbound relay，分別驗證通道及工具授權 | Gateway 不一定跨網路邊界，TLS 不等於工具授權；保留 |

兩個架構 Concept 為不同視角（開發工具職責 vs 通用自動化責任），避免用同一個「Agent OS」名稱推導產品相容性。Harness、Control Plane、Orchestration、Routing、Gateway、Adapter 為可組合的責任切面，不規定強制拓撲。17 筆均暫保留；未新增、合併或更名。

## 2. 四筆 Resource 的現有關聯與證據

下列為本庫保存的 source.reviewScope、referenceUrls、features、既有 Typed Refs 及局部契約；不是本輪獨立重跑上游。

| Resource ID | 既有證據／固定版本 | 判定與缺口 |
|---|---|---|
| rea | 0aca049128687828bddc32e8c4c0a39d7544c1ff；error-contract.schema.json 的 category/retryable/remediation；client-verification.md | 雙向 ref：agent-native-tool-abstraction ↔ rea；可補強錯誤契約與客戶端驗收，未證明全部 Adapter、CLI/MCP 路徑一致。維持 deferred。 |
| claude-codex-harness-sync | 1652082d36017d89729d17d517d1012556739fb2；inventory.py、classify_drift.py、validate_codex.py | 雙向 ref：cross-agent-harness-portability ↔ resource；盤點、差異分類與驗證屬可重用遷移原理，未核對兩平台所有現行語意或實際同步。 |
| arumwu-agentrelay | d49ef59de1330209d93f6ade9dc38b83e66671e9；src/store.ts、src/git.ts、src/terminal.ts | 雙向 ref：lease-based-agent-task-coordination ↔ resource；心跳、Lease、Git Handoff 可作具體案例，尚未執行併發或失效回收測試，不把 advisory claim 當成鎖。 |
| anthropics-single-agent-loop-kit | c43796287b83bec847db923f07131d1cc8de750d；compare.py、chain_coverage.py、04-as-tool.md、reference_loop/loop.py | 雙向 ref：eval-gated-subagent-consolidation ↔ resource；另有 reusable-agent-skills 入向 ref；評估基準及鏈覆蓋支持逐步精簡的設計。未執行模型、評估、測試，不能推論實際效益。 |

## 3. 現有 Concept 出向引用與限制

- AI coding stack 已連 agent-runtime-harness、vendor-agnostic-orchestration、workflow-agent-system-agent-os-three-layer-architecture、quality-gates-verification；三層架構已連 agent-runtime-harness、vendor-agnostic-orchestration、security-as-workflow-gate。
- Eval-gated consolidation 另有既有 Workflow exampleRef `eval-gated-subagent-consolidation-workflow`，本輪未核實該 Workflow 的階段證據。
- 其他本輪 ID 未見 exampleRefs/relatedConceptRefs 者不代表沒有入向引用，也不以空欄位判定知識無價值。
- 完整 `data/knowledge-graph-v1.json` 讀取受 Connector 限制：fetch_file 回傳空內容、raw fetch 拒絕檔案過大；未完成全庫入向／出向關係統計。後續按 Canonical 分類批次查核或使用既有 CI 生成的統計，無需新增永久權限。
- 目前無足夠證據提出新的 Concept。特別是 Model Gateway 與 Skill router 不因單一工具 feature 直接生成新 ID。

## 4. 下一批

剩餘 31 個 Concept 定義：設計與媒體、資料與安全、其他決策原理。延續 Review 01 的逐筆邊界、反例、來源、關聯缺口；待全部語意審查與 Typed References 盤點完成，再評估缺少的可跨來源原理。保留原有 Combination/Workflow 與 Audit06–08 的證據界線。未執行第三方 Runtime、整合、授權查核，也未變更任何 Canonical、Tags、正式 Graph、Schema 或權限。
