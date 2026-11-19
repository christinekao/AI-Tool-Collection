# Tags 清理｜首批 12 個 Resources（2026-11-19）

使用者已明確同意：**不必要的舊 Tags 可以刪除。** 本批直接更新 Canonical JSON，並非僅在介面隱藏。

- 基準：`lean-tags-governance-20261119`，Commit `759650ae5a81806b79881a62234cd4dbbf51608f`。
- 12 個 Resource 原本 318 個 Tag，現保留 60 個、移除 258 個（約 81%）。
- 其他 536 筆實體不動；任何正式 Entity、原始 Prompt、來源欄位、技術內容、Category、Typed References 均未刪除。
- Catalog、Tag Index、Knowledge Graph 同步重新計算，移除的 Tags 不再出現在這些紀錄的搜尋中。
- 每筆精選 5 個具辨識價值的既有 Tags；並未用新的猜測型標籤取代。
- 本批僅使用既有 Canonical 內容複核，尚非獨立查核外部 Repo 版本或 Runtime PASS。所有刪減可透過本 PR 的 Git Diff 回溯。

| 資源 ID | 原 Tag | 保留 | 刪除 |
|---|---:|---:|---:|
| `claude-mem` | 31 | 5 | 26 |
| `microsoft-tokeneconomizer` | 27 | 5 | 22 |
| `aws-samples-sample-agent-cost-bench` | 19 | 5 | 14 |
| `graphify-labs-graphify` | 23 | 5 | 18 |
| `oh-my-mermaid` | 25 | 5 | 20 |
| `humanlayer` | 25 | 5 | 20 |
| `strelov1-freehire` | 27 | 5 | 22 |
| `pingdotgg-t3code` | 28 | 5 | 23 |
| `block-buzz` | 28 | 5 | 23 |
| `cyyeh-agent-loop-visualizer` | 29 | 5 | 24 |
| `anthropics-financial-services` | 28 | 5 | 23 |
| `kieiken-project-hub` | 28 | 5 | 23 |

## 清理依據

- `claude-mem`：保留跨 Session 記憶、內容注入、檢索介面及儲存方式，移除歷史版本與泛用 Agent 名稱的顯示重複。
- `microsoft-tokeneconomizer`：強調 Token 成本控制的三種主要機制，不在顯示標籤重複所有相容 Agent 名稱。
- `aws-samples-sample-agent-cost-bench`：聚焦可比較的成本、品質、CLI 與可重現評估，不顯示每種支援模型名稱。
- `graphify-labs-graphify`：強調 Codebase 知識圖譜與檢索；保留需要查核的資料風險線索，不顯示重複模型名稱。
- `oh-my-mermaid`：顯示架構圖、遞迴瀏覽與可選雲端同步的辨識特點，避免列出多種 Agent Host。
- `humanlayer`：聚焦協作工作台、人工審核及工作樹，不顯示各 Agent 名稱與泛用技術標籤。
- `strelov1-freehire`：聚焦來源匯入、去重、遠端職缺和申請管理，與 Domain 已呈現的職涯主題分開。
- `pingdotgg-t3code`：顯示多 Agent 控制台、本機優先、遠端存取和 Diff 審核，不重複一般平台列表。
- `block-buzz`：聚焦人機協作、訊息、身分、簽署事件與自架運作，減少品牌和 Host 清單。
- `cyyeh-agent-loop-visualizer`：強調 Agent 執行週期、Token 分析、工具呼叫與結構驗證，非每個模型名都需要顯示。
- `anthropics-financial-services`：聚焦金融分析、研究、建模、資料連接及人工簽核，不把每個金融子領域都放在主畫面。
- `kieiken-project-hub`：顯示專案工作台、協作調度、本機模式、任務與交接，省略產品名稱、版本與重複環境詞。

**後續守則：** 若關鍵技術細節只有 Tag 記錄，先補入適當的技術／來源欄位後才刪除該 Tag；不要為了讓每筆都只剩 5 個而破壞唯一知識。保留原始 Commit 方便比對 Before／After。
