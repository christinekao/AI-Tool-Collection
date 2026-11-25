# Resource 雙層改善 Batch 22（2026-11-25）

基線 main `f83a7c243d76dcc028f06097168452c8116cd713`；PR #86 四項 CI 通過並合併，Catalog Sync／Pages 尚待查核。99/286 已合併（93 完成對應、6 deferred）。

| Resource | 前台案例 | 查核範圍 |
|---|---|---|
| reactive-resume | 規劃職缺專屬履歷版本及面試追蹤 | 897bcf8e740a4ee918ac27d0dc17e1edd105446a；固定版本 README、LICENSE、MCP application guide、resume router 與 application schema；查核文件契約及路由、資料表，不宣稱完整服務端、權限或 AI 實作稽核。 |
| codebase-index | 規劃修改履歷表單前的程式影響分析 | 03683cc14ba303002f3069f44f5931b43e001e95；固定版本 README、LICENSE、MCP server.py 的搜尋、引用、影響與證據驗證函式，以及 SQLite schema；未查完整索引器、語言覆蓋與網路行為。 |
| code-graph | 規劃共用驗證函式的修改影響檢查 | 2026-11-25 Qodo Glossary；2026-11-25 Qodo Glossary 技術概念段落：圖型比較、建圖、查詢與限制；排除供應商產品宣傳、性能主張及未獨立核對的研究數值。 |

兩筆 mapped、一筆 evidence-linked 候選，9 個用途、6 個局部能力、3 個概念證據、3 個 design-only 案例。保留原 ID、URL、Tags、分類、Typed Refs、歷史用途、推薦及原始欄位；Code Graph 維持概念型 Resource、原空白 URL 與 repo，不和同名產品合併。不新增全域 Graph Edge。

## 重要界線

- reactive-resume：MCP 文件所述部分讀似操作也會寫入，例如 match score 會覆蓋舊評分。 AI tailoring 需連接 provider，可能送出履歷與 JD；生成建議必須人工核准，分數不是錄取機率。 更新 contacts 或 tags 等清單可能整體替換；先讀回當前值再更新。 未安裝、登入或送出文件；未查服務端權限、分享安全、PDF 排版及 ATS 實際接受率。
- codebase-index：缺少索引會回傳 no-index 資料；索引可能過期或語言覆蓋不完整。 圖中 extracted、inferred、ambiguous 邊不能一律當真；靜態依賴不等於所有 runtime 行為。 verify_evidence 確認來源片段狀態，不證明程式行為正確。 README 的本機／無網路聲明未完整稽核；初始化或全域 hook 可能修改設定，須另行核准。
- code-graph：不是特定 Repo 或工具，不提供可呼叫的 API。 靜態圖可能漏掉動態呼叫、反射與執行期配置。 圖的版本及覆蓋程度必須確認；沒有找到邊不等於沒有依賴。 結構不能證明業務意圖或測試成功；需核對來源及獨立測試。

## Gate 與接續

新增 Catalog 等值、雙向映射、固定版本、概念身分及四尺寸回歸。CI 待執行，第三方未實測。合併前 99/286；通過後 102/286（96 完成對應、6 deferred），184 尚未改寫。下一批優先 codebase-memory-mcp、graphify-labs-graphify 等尚未改寫的開發資源；核對原 v3 分支及固定版本。排程停用。
