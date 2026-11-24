# Phase 3 Audit 06｜Combination／Workflow 知識層分工審查

日期：2026-11-24｜來源 main：`dc6702deab02a3a42b041f79393a1a8c2587bc05`

本階段回到 `Problem → Concept → Workflow → Implementation Options` 的核心目標，逐筆比較 17 個 Combination 與同 ID Workflow。**所有正式紀錄、ID、Graph、Tags、Typed Refs、分類保持不變。**

## 資料與證據界線

- Repo Canonical 的 17 個 Combination、36 個 Workflow、68 個 Concept；逐筆對應既有 `members` 與 `stages[].title/purpose`。
- 17／17 同 ID／同 Title／同 Goal／互引，14／17 缺 rationale；3 筆雖有理由但少於兩個正式成員。
- 17／17 無被其他 Workflow 正式引用的跨流程重用證據；無 Alternatives。**沒有證據不等於永不可能重用**。
- 只有 `stack` 與 `system-1-system-2-agent-routing-stack` 延用 [Audit02 已審閱的上游文件](RELATIONSHIP_AUDIT_PHASE02_20261123.md)；其實際 API、權限或相容性仍 **NOT_TESTED**。
- 新增 [審查 JSON](RELATIONSHIP_AUDIT06_OPTIONS_REVIEW_20261124.json) 供其他 Agent／工具檢索，所有 `options` 僅從已有正式 Resource IDs 提出，`interoperabilityVerified:false`。沒有擅自把 `unresolvedMembers` 宣告為可用工具。

## 17 筆分類與下一步

| Combination ID | 已有 Member | 審查動線 | 缺口 |
|---|---:|---|---|
| `agent-stack` | 4 | `composition-interface-review` | 角色、路由、worktree、Codex 的整合介面與跨流程重用尚無證據 |
| `agentic-video-production-stack` | 4 | `composition-interface-review` | 腳本、素材、轉錄品質與 DaVinci 時間軸交接規格尚未驗證 |
| `ai-vector-asset-code-stack` | 4 | `workflow-options-first` | 偏向 SVG→Code→Motion 的 Workflow 工具配置，缺跨流程 I/O 合約 |
| `codebase-agent-context-stack` | 4 | `composition-interface-review` | 程式碼視圖、持久圖譜、CLI 壓縮屬不同能力，尚無共通介面 |
| `coding-agent-stack` | 4 | `composition-interface-review` | 與大型 Codebase 組合有多個共用工具，但成本／Fallback 是不同問題 |
| `cross-agent-continuity-stack` | 4 | `composition-interface-review` | 版本 Handoff Stage 已有 Gate，但跨 Host Memory／Permission 無實測 |
| `generative-ui-stack` | 4 | `composition-interface-review` | OpenUI／shadcn／Stitch 不具已證明的 Component Schema 互通性 |
| `goal-build-evidence-learning-loop` | 0 | `workflow-options-first` | 零正式成員，核心是可重複的學習驗收程序，不是已證明的工具組合 |
| `local-pii-ai-processing-loop` | 1 | `workflow-options-first` | 僅一個正式 Resource，敏感資料處理 Gate 比組合名稱重要 |
| `long-running-agent-foundation-stack` | 3 | `composition-interface-review` | 記憶、掃描、時點研究的 Hermes Runtime 接線與版本尚未查明 |
| `reference-agent-implementation` | 9 | `workflow-options-first` | 參考網站與 Agent／QA 工具混用，適合先整理分 Stage 選項 |
| `spec-multi-agent-delivery-evidence-qa-stack` | 3 | `composition-interface-review` | Matt Skills、LoopAgentTeams 與 HCOM 的跨工具執行契約未齊 |
| `stack` | 4 | `safety-boundary-first` | Onyx 文件 ACL 與 WrenAI SQL 的版本及權限隔離未實測 |
| `stateful-repository-agent-automation-stack` | 3 | `safety-boundary-first` | 原始 notes 明確不宣稱 gh-aw／Hindsight 官方整合，GitHub 寫入另有授權 |
| `system-1-system-2-agent-routing-stack` | 3 | `safety-boundary-first` | 未有真正 Laya 校準或 OmniRoute／Codex 實測，先保留 Risk-first Gate |
| `voice-publish-evidence-social-content-loop` | 1 | `workflow-options-first` | 只有 social-post 為正式成員，發布與成效分析要獨立安全 Gate |
| `web-research-agent-stack` | 3 | `composition-interface-review` | 平台存取、Crawl4AI 抽取、LLM 整理缺可重跑、可核對之介面 |

**審查動線合計**：`workflow-options-first` 5 筆；`composition-interface-review` 9 筆；`safety-boundary-first` 3 筆。全部的正式處置是 `retain-original-pending-evidence`，不是授權搬移或刪除。

## 每筆 Resource → Workflow Stage 候選

**`agent-stack`**：角色、路由、worktree、Codex 的整合介面與跨流程重用尚無證據。下一步：核對可重播的多 Agent 交接、Provider capability 與隔離驗證。候選 Resource／Stage：`agency-agents`（Stage 1）、`omniroute`（Stage 2）、`orca`（Stage 3）、`openai-codex`（Stage 4）。

**`agentic-video-production-stack`**：腳本、素材、轉錄品質與 DaVinci 時間軸交接規格尚未驗證。下一步：取得具格式、版本與 QA 的影音輸出交換樣本。候選 Resource／Stage：`openmontage`（Stage 1）、`gbro-collage-broll`（Stage 2）、`vulture-s-whisper-guard`（Stage 3）、`davinci-resolve`（Stage 4）。

**`ai-vector-asset-code-stack`**：偏向 SVG→Code→Motion 的 Workflow 工具配置，缺跨流程 I/O 合約。下一步：驗證可編輯 SVG 在程式、動態效果與 Stitch 專案的相容性。候選 Resource／Stage：`arrow-2`（Stage 1）、`openai-codex`（Stage 2）、`motion-dev`（Stage 3）、`google-stitch`（Stage 4）。

**`codebase-agent-context-stack`**：程式碼視圖、持久圖譜、CLI 壓縮屬不同能力，尚無共通介面。下一步：檢查大型 Repo 的 Context 節省、記憶新鮮度與輸出驗證。候選 Resource／Stage：`graft`（Stage 1）、`codebase-memory-mcp`（Stage 2）、`rtk`（Stage 3）、`openai-codex`（Stage 4）。

**`coding-agent-stack`**：與大型 Codebase 組合有多個共用工具，但成本／Fallback 是不同問題。下一步：核對 Agent Host 與 Provider 能力及相同任務的 Token／成本基線。候選 Resource／Stage：`omniroute`（Stage 1）、`graft`（Stage 2）、`rtk`（Stage 3）、`openai-codex`（Stage 4）。

**`cross-agent-continuity-stack`**：版本 Handoff Stage 已有 Gate，但跨 Host Memory／Permission 無實測。下一步：核對不同 Agent 的讀寫入口、權限及版本化 Handoff 交接。候選 Resource／Stage：`ai-memory`（Stage 1）、`orca`（Stage 2）、`omniroute`（Stage 3）、`openai-codex`（Stage 4）。

**`generative-ui-stack`**：OpenUI／shadcn／Stitch 不具已證明的 Component Schema 互通性。下一步：取得允許元件 Schema、Renderer、A11y 與互動驗證案例。候選 Resource／Stage：`openui`（Stage 3）、`shadcn-ui`（Stage 2）、`google-stitch`（Stage 1）、`frontend-design`（Stage 1）。

**`goal-build-evidence-learning-loop`**：零正式成員，核心是可重複的學習驗收程序，不是已證明的工具組合。下一步：先核實 unresolved 技能來源，再於 Workflow 提出工具候選，不創造 Resource。候選 Resource／Stage：無已正式關聯的 Resource；不補入 unresolvedMembers。

**`local-pii-ai-processing-loop`**：僅一個正式 Resource，敏感資料處理 Gate 比組合名稱重要。下一步：先驗證本機 Mapping、漏遮罩測試與雲端資料出站政策。候選 Resource／Stage：`pii-guard`（Stage 1、2、4、5）。

**`long-running-agent-foundation-stack`**：記憶、掃描、時點研究的 Hermes Runtime 接線與版本尚未查明。下一步：核對三種 Plugin 的 Host 版本、權限與 API 介面。候選 Resource／Stage：`hermes-memory-wiki`（Stage 1）、`hermes-snyk-plugin`（Stage 2）、`hermes-backsearch`（Stage 3）。

**`reference-agent-implementation`**：參考網站與 Agent／QA 工具混用，適合先整理分 Stage 選項。下一步：核實設計引用授權及 Browse QA，分開 Reference 與實作工具。候選 Resource／Stage：`inspora`（Stage 1）、`wellmade`（Stage 1）、`bencho`（Stage 1）、`landing-love`（Stage 1）、`maxibestof`（Stage 1）、`frontend-design`（Stage 4）、`impeccable`（Stage 3、4、5）、`google-stitch`（Stage 4）、`openai-codex`（Stage 4）。

**`spec-multi-agent-delivery-evidence-qa-stack`**：Matt Skills、LoopAgentTeams 與 HCOM 的跨工具執行契約未齊。下一步：核對 HCOM、工作樹、Spec/Tickets 以及獨立 QA 的實際介面。候選 Resource／Stage：`loopagentteams`（Stage 2）、`mattpocock-skills`（Stage 未建立）、`openai-codex`（Stage 4）。

**`stack`**：Onyx 文件 ACL 與 WrenAI SQL 的版本及權限隔離未實測。下一步：核對 MinerU/Crawl4AI→Onyx、WrenAI 的真實來源權限及證據整合。候選 Resource／Stage：`onyx`（Stage 2）、`wrenai`（Stage 3）、`unclecode-crawl4ai`（Stage 1）、`opendatalab-mineru`（Stage 1）。

**`stateful-repository-agent-automation-stack`**：原始 notes 明確不宣稱 gh-aw／Hindsight 官方整合，GitHub 寫入另有授權。下一步：檢查 Hindsight 介面、gh-aw Safe Outputs 與權限隔離的沙盒案例。候選 Resource／Stage：`github-agentic-workflows`（Stage 1、4）、`hindsight`（Stage 2、5）、`openai-codex`（Stage 3）。

**`system-1-system-2-agent-routing-stack`**：未有真正 Laya 校準或 OmniRoute／Codex 實測，先保留 Risk-first Gate。下一步：做獨立校準與 Provider 介面／資料政策實測；不能以分數直接放行。候選 Resource／Stage：`laya`（Stage 1）、`omniroute`（Stage 3）、`openai-codex`（Stage 4）。

**`voice-publish-evidence-social-content-loop`**：只有 social-post 為正式成員，發布與成效分析要獨立安全 Gate。下一步：確定工具草稿能力及人工核准與平台發布能力後才提正式選項。候選 Resource／Stage：`social-post`（Stage 1、2、3）。

**`web-research-agent-stack`**：平台存取、Crawl4AI 抽取、LLM 整理缺可重跑、可核對之介面。下一步：核對平台條款、抽取來源、時點引用及 SQLite 匯入驗證。候選 Resource／Stage：`agent-reach`（Stage 1）、`unclecode-crawl4ai`（Stage 2）、`llm`（Stage 3）。

## 為何這次不是直接整理掉 Combination

1. **組合是否獨立**要靠具體 I/O、替換條件及跨情境重用，而非 ID 或工具數量相同。
2. **Workflow Options** 應呈現角色、對應階段與可換方案；本批只有第一步的候選對應，**不是已驗證兼容的 Adapter**。
3. **Source & Permissions**：本次沒有外部 Provider Runtime、正式 API、授權或實際 SQL／文件解析測試。
4. **重大修改授權**：移動正式資料、拆分／合併／刪除 Combination、變更 ID 或新增 Typed Refs 都仍需獨立 Intake Review 與明確批准。
5. **安全合成 Audit03–05** 只能證明 Repo 內測試規則，不能當作 17 組工具能互相傳輸的證據。

## 可重現的驗收

```sh
node --test scripts/test-relationship-options.mjs
node scripts/audit-knowledge-relations.mjs --details
node scripts/validate-v2.mjs
```

CI 綁定 `docs/RELATIONSHIP_AUDIT06_OPTIONS_REVIEW_20261124.json`、Review Script 與測試檔；包含 **10 個來源與負向範例**，必須保證 17／17、58 Member 候選完整，以及刪除、偽造 Resource、跨 Workflow 重用、正式相容聲明都會失敗。

## Release 與限制

PR／main CI、Pages Deploy 回執待實際檢查。正式 UI／Canonical 沒有改變，獨立 Browser Live Smoke：**NOT_TESTED**。外部相容、來源授權、安全、成本與商業效益：**NOT_TESTED**。
