# 全庫分類第二輪｜AI 描述複核（2026-11-19）

> 本輪僅對前次 161 筆 `needs-review` 的已收錄描述進行 AI 複核，並調整少數用途標籤。**不等於人工逐筆驗證、獨立來源查核或工具實測。**

## 統計

| 項目 | 數量 |
|---|---:|
| Canonical V2 總數 | 548 |
| 前次待複核 | 161 |
| 新增 `ai-description-reviewed` | 159 |
| 保留 `needs-review`（內容太籠統） | 2 |
| Primary Domain 更正 | 38 |
| Secondary Domain 異動 | 68 |
| 學習與教材用途標籤：前 → 後 | 15 → 26 |

保留待補資料：`resources/kkkkhazix-khazix-skills`、`skills/kkkkhazix-khazix-skills`，現有描述僅「多種 AI Skills」，無法判斷更具體的主要問題。

## 主要更正實例

| Entity | 原 → 新 | 主因 |
|---|---|---|
| `resource:hermes-backsearch` | ai-agent → data | 時點限定的歷史檢索是核心功能，Hermes 是使用環境 |
| `resource:graphify-labs-graphify` | software → data | 可查詢的跨程式碼／文件知識圖譜是主要產出 |
| `resource:ecpay-ecpay-api-skill` 與相應 Skill | ai-agent → automation | 支付 API 串接是核心用途 |
| `resource:nvidia-skillspector` | ai-agent → security | 檢測 Agent Skill 安全風險 |
| `resource:zed-industries-zed` | ai-agent → software | 程式碼編輯器，而非通用 Agent 平台 |
| `resource:zhulinsen-daily-stock-analysis` | data → business | 股票決策是目標，資料分析是實作技術 |
| `prompt:evidence-first-visual-abstraction` | ai-agent → design | 有證據的視覺抽象與造型設計 |
| `concept:file-first-memory-source-of-truth` | software → data | 可稽核、可遷移的記憶與知識來源 |

## 規範與驗證界線

- `ai-description-reviewed` 表示 AI 讀過 Canonical 記錄中的 Title／Purpose／Problem／Core Problem 等內容並校正；不代表來源已驗證或人類覆核。
- `rulesVersion=v0.2-review` 標示本輪狀態；分類器需尊重已複核狀態，不覆寫為純關鍵字推斷。
- 「學習與教材」是跨領域用途，只有主題或方法有教學、實作練習、模擬或學習用途時才標記；有技術文件或影片並不足以成立。
- 六類 Entity、IDs、原 category、tags、typed refs、Concept／Workflow／Combination 結構均保留。未對其餘 387 筆宣稱人工或 AI 逐筆複核。
- 本次程序檢查：Domain 有效值、分類以外欄位不變、總數、待複核數與 ID 相容。GitHub Pages、完整 Node build／validate、獨立 Browser QA 仍需另行驗證；未執行不得標為 PASS。

## Primary Domain 更改清單

- `resources/aws-samples-sample-agent-cost-bench`：`ai-agent` → `software`
- `resources/ecpay-ecpay-api-skill`：`ai-agent` → `automation`
- `resources/engineering-leadership-adobe-tech-lead-ai`：`career` → `business`
- `resources/graphify-labs-graphify`：`software` → `data`
- `resources/hermes-backsearch`：`ai-agent` → `data`
- `resources/mattpocock-skills`：`ai-agent` → `software`
- `resources/nvidia-skillspector`：`ai-agent` → `security`
- `resources/ryanhanwu-how-to-ask-questions-the-smart-way`：`ai-agent` → `software`
- `resources/unclebob-ub-mode`：`ai-agent` → `software`
- `resources/zed-industries-zed`：`ai-agent` → `software`
- `resources/zhulinsen-daily-stock-analysis`：`data` → `business`
- `resources/zichuanlan-freebie-radar`：`data` → `automation`
- `skills/allanyiin-documa-maintenance`：`ai-agent` → `software`
- `skills/ayueh0102-ronnier-skill`：`ai-agent` → `design`
- `skills/baoyu-skill`：`ai-agent` → `content`
- `skills/blogger-distiller`：`ai-agent` → `content`
- `skills/coreyhaines31-marketingskills`：`ai-agent` → `content`
- `skills/cursor-pstack-create-verification-skill`：`ai-agent` → `software`
- `skills/cursor-pstack-maintain-verification-skill`：`ai-agent` → `software`
- `skills/debpalash-voicestudio-voicestudio-maintainer`：`content` → `software`
- `skills/ecpay-ecpay-api-skill`：`ai-agent` → `automation`
- `skills/gzh-design-skill`：`design` → `content`
- `skills/littlehole2025-token-saver-handoff`：`software` → `ai-agent`
- `skills/mattpocock-grill-with-docs`：`ai-agent` → `software`
- `skills/mattpocock-skills`：`ai-agent` → `software`
- `skills/mattpocock-triage`：`ai-agent` → `software`
- `skills/qingyuna-answer-me-with-html-skill`：`ai-agent` → `design`
- `concepts/deterministic-execution-boundary`：`ai-agent` → `security`
- `concepts/file-first-memory-source-of-truth`：`software` → `data`
- `concepts/outbound-private-tool-bridge`：`ai-agent` → `security`
- `concepts/reference-application-pattern-mining`：`design` → `software`
- `concepts/reference-backed-pattern-mining`：`ai-agent` → `data`
- `concepts/web-to-desktop-application-shell`：`design` → `software`
- `prompts/coding-agent-18-failure-modes-audit`：`ai-agent` → `software`
- `prompts/evidence-first-visual-abstraction`：`ai-agent` → `design`
- `combinations/codebase-agent-context-stack`：`ai-agent` → `software`
- `workflows/codebase-agent-context-stack`：`ai-agent` → `software`
- `workflows/evidence-backed-software-reconstruction`：`ai-agent` → `software`
