# Resource 雙層改善 Batch 23（2026-11-25）

基線 main `8482172c57cf886e04158e63f9ad59bd9e8a20c5`；PR #87 四項 CI 通過合併 `a347d59e9587dd5c5732bf5ce2842bdecd285068`；Catalog Sync 通過，Pages 查核時進行中。102/286 已合併（96 完成對應、6 deferred）。

| Resource | 前台案例 | 查核範圍 |
|---|---|---|
| codebase-memory-mcp | 規劃跨模組功能與部署路徑的追蹤 | 9a4da7a314833d8d965b74612e1f25fef5371861；固定版本 README、LICENSE 與 src/mcp/mcp.c 的工具登錄及 handler 識別；未全面審查 C 實作、解析器、網路或發行檔安全。 |
| graphify-labs-graphify | 規劃程式碼與公開技術筆記的知識圖譜 | e03c4604fb782d84cdb0e53e81d31707e54152a3；維持原 v3 固定 commit；查 README、LICENSE、graphify/skill.md、extract.py 的部分 AST 擷取、build.py、export.py 與 serve.py 的局部契約。未檢查 v8、完整語言支援或執行安全。 |
| anthropic-solving-code-review-at-anthropic | 規劃 AI 修改表單功能的風險分級驗收 | 2026-10-15 文章；2026-11-25 查閱 Claude Code 團隊 2026-10-15 公開文章；原團隊成果及內部流程未獨立稽核，案例及練習為自訂。 |

2 mapped、1 evidence-linked 候選；9 個用途、6 個局部能力、3 個教材證據、3 個 design-only 案例。保留分類、Tags、Typed Refs、原欄位、歷史用途及推薦，不新增 Graph Edge。Graphify 保留使用者原 v3 固定版本。

## 重要界線

- codebase-memory-mcp：check_index_coverage 沒有回報缺口不代表完整；先確認索引及版本。 圖譜靜態路徑不是實際執行紀錄；跨服務與部署關係仍需查配置及測試。 索引可能長時間執行；queued/running 不能當作完成。 安裝器會修改 Agent 設定，選配 Lens 模型下載及索引範圍須另核准；本機處理聲明未獨立稽核。
- graphify-labs-graphify：本筆固定 v3，不套用其他分支授權或功能。 AST 擷取與模型語意推論有不同可靠度；不得把 INFERRED 或 AMBIGUOUS 當事實。 build 預設為無向 Graph，保留 _src/_tgt；同 ID 節點後寫屬性覆蓋，外部端點邊可能被略過。 語意處理可能把資料提供給 Agent 模型；敏感資料、外送及設定修改需另核准，效能數字未重現。
- anthropic-solving-code-review-at-anthropic：文章描述特定團隊的經驗，非所有專案的通用核准政策。 人工核准不得由 Agent 冒充；核准應綁定明確版本。 審查及測試通過不代表無缺陷；仍須可回復發布及追蹤事故。

## Gate 與接續

新增雙向對應、Catalog 等值、版本與四尺寸回歸。CI 待執行；未執行第三方工具。合併前 102/286；通過後 105/286（99 完成對應、6 deferred），181 尚未改寫。下一批優先其他 Coding Agent 開發資源。排程停用。
