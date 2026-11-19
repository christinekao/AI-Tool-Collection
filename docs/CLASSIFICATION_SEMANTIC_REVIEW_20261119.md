# 全庫語意分類複核｜用途優先修正（2026-11-19）

> 本輪閱讀 548 筆 Canonical 已收錄的 Title、Purpose／Goal／Core Problem／Problem 及既有分類。此為**描述層級的語意複核**，並非逐筆重新查證外部來源或執行工具。證據不足就保留原分類／待複核，不為滿足覆蓋率創造標籤。

## 判斷方式

1. 優先回答「使用者用它解決哪個問題、取得什麼輸出」，再判斷 Primary Domain。
2. Agent、MCP、Claude、Codex、GitHub、React、Cloudflare 等技術名稱不是 Domain 的充分證據。
3. 僅修正用途證據足夠的分類；Secondary 不能只因底層技術而累加。
4. 保留原始內容、ID、Tags、Typed References、能力及圖譜結構，並同步 Canonical 和 Catalog。

## Before／After

全數掃描 **548 筆**，修正 **24 筆 Primary Domain**；其餘 **524 筆** 本輪保留原分類（不等於逐筆上游驗證已通過）。

| Domain | Before | After |
|---|---:|---:|
| `ai-agent` | 184 | 167 |
| `automation` | 12 | 12 |
| `business` | 30 | 31 |
| `career` | 14 | 15 |
| `cloud` | 6 | 5 |
| `content` | 94 | 99 |
| `data` | 32 | 30 |
| `design` | 98 | 100 |
| `security` | 25 | 30 |
| `software` | 53 | 59 |

## 本輪修正

| Entity ID | 原分類 → 新分類 | 依據 |
|---|---|---|
| `anthropics-sandbox-runtime` | `ai-agent` → `security` | Filesystem and network access restrictions are the core security boundary |
| `blave-agent` | `ai-agent` → `business` | Trading research, backtesting and order-execution risk are the goal |
| `bobyu89-codex-ppt-style-expanded` | `ai-agent` → `content` | Presentation and proposal production is the deliverable |
| `cloudflare-cloudflare-os` | `cloud` → `security` | Credential isolation and gatekeeping are security controls |
| `google-pagespeed-insights` | `content` → `software` | Web performance and Core Web Vitals audit are the engineering problem |
| `hkuds-vimax` | `ai-agent` → `content` | Multi-shot narrative video production is the output; Agent is the implementation |
| `april-zhu-minicharts` | `data` → `design` | Interactive chart design is the main output; the source data remains secondary |
| `rea` | `ai-agent` → `software` | Investigation and reconstruction of software behavior is the use case |
| `react-frontend-backend-for-beginners` | `design` → `software` | Teaching Web App frontend/backend architecture is software development learning |
| `strelov1-freehire-mcp` | `ai-agent` → `career` | Job discovery and application tracking are the user problem; MCP is the protocol |
| `twood2024-prelaunch-check-defense` | `ai-agent` → `security` | Prelaunch security assessments and defensive checks are the deliverable |
| `bobyu89-codex-ppt-style-expanded` | `ai-agent` → `content` | Presentation and proposal production, not Agent engineering |
| `minimax-code-community-interactive-visualization-architect` | `data` → `design` | Interactive HTML demonstrations and visual controls are the output |
| `onetake` | `ai-agent` → `content` | Motion films and product launch videos are the deliverable |
| `rea-reverse-engineer-anything` | `ai-agent` → `software` | Software reverse-engineering evidence and reconstruction are the target |
| `seokwoooo-lucian-uxui` | `ai-agent` → `design` | UI components, themes and interface integration are the output |
| `agent-credential-isolation` | `ai-agent` → `security` | Secret access, least privilege and prompt injection are security governance |
| `agentic-ci-workflow-compilation` | `ai-agent` → `software` | Compilation of auditable repository CI workflows is the engineering problem |
| `agentic-media-pipeline` | `ai-agent` → `content` | Video and multimedia production pipeline is the actual target |
| `editable-agentic-timeline` | `ai-agent` → `content` | Editable video timeline and post-production handoff is the central problem |
| `evidence-backed-agent-investigation` | `ai-agent` → `software` | Evidence-based investigation of software without full source is the target |
| `risk-adaptive-agent-code-review` | `ai-agent` → `software` | PR and code review quality and engineering guardrails are the goal |
| `agent-api-key-budget-and-revocation-guardrails` | `ai-agent` → `security` | Credential separation, revocation and abuse safeguards are the security problem |
| `github-ai-skill-discovery-and-risk-comparison` | `software` → `ai-agent` | Discovery and evaluation of Agent Skills, not general source-code engineering |

## 未確認與後續查核

- `kkkkhazix-khazix-skills`（Resource／Skill）只有「多種 AI Skills」，保留 `needs-review`，不推測用途。
- 反思／個人成長及教學資源不一定吻合現有十種 Domain：先保留資料，不硬新增頂層分類。
- 這一輪沒有對 548 筆逐一進行上游原始來源查核、安裝測試或可用性驗證；下一階段 Resources／Skills／Prompts 內容規格重寫時需補做。
- `april-zhu-minicharts` 由資料轉成互動圖表，Primary 為 `design`，`data` 是有直接輸入與資料轉換證據的合理 Secondary；回歸測試允許**逐案明列**的 Secondary，而非一律禁止舊 Primary 變成 Secondary。
- `data/classification-regression-v1.json` 保存前次 `grill-me` 與本次高信心錯例，後續 CI 會偵測回歸。關鍵字只能提出候選，不代表語意驗證。

## 自動驗證

- `scripts/audit-domain-classification.mjs`：檢視 548 筆 Domain 分布、Career 證據與修正案例。
- `scripts/test-taxonomy-v1.mjs`：確認修正案例的 ID、Primary、Secondary 與 evidence 欄位。
- `scripts/validate-v2.mjs`：驗證 Catalog／Canonical、Tag Index、Knowledge Graph 與 Typed Refs；以實際 CI 狀態為準。


## 後續新增資料防誤判

分類器新增以 `purpose`／`goal`／`coreProblem`／`problem` 為依據的少量高辨識度用途候選，目的為避免將工具環境（Agent、MCP、Provider 名稱）誤當問題領域；當用途候選和原始關鍵字排名不一致時，仍標記 `needs-review`，不得宣稱來源已驗證。新增跨六個 Domain 的 Synthetic Regression Cases。分類必須配合來源及使用者的真實目標覆核；字面規則不是完備語意模型。
