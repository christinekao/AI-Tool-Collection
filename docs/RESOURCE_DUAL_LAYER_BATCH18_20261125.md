# Resource 雙層改善 Batch 18（2026-11-25）

基線 main `b76891adace9b98bb6b61f39511028680780b9a5`；PR #82 四項 CI 通過，合併 `a26b4c9e1e701391dfc7b384019bdcbc3690fec9`，Catalog Sync 通過，Pages 查核時排隊。87/286 已合併（81 完成對應、6 deferred）。

| Resource | 前台案例 | 固定版本與查核範圍 |
|---|---|---|
| gzh-design-skill | 規劃技術教學長文的公眾號排版 | 750a50dffdc4abb5e853b98136dad13a57e64ce3；README、SKILL.md 的格式正規化、主題選擇與 HTML 輸出流程，及兩個 Python 檢查腳本的規則與 LICENSE。 |
| baoyu-skill | 規劃 AI 教材文章的封面與插圖發布 | bf1ff076e25f8da4a339eb1c8cf03361fea5ea4c；README、LICENSE、封面、文章插圖及微信發布三份 SKILL.md 的局部文件契約；其他技能及底層服務未核對。 |
| ui-ux-gold-standard | 規劃資料分析 Dashboard 的共用設計規則 | d864143780094c5761e9acce5f61399f8b7d81e2；README、SKILL.md、scripts/search.py CLI 及 scripts/design_system.py 的設計系統生成與保存入口；未逐項查核 CSV、技法及授權。 |

三筆 mapped 候選、9 個用途、9 個局部能力、3 個 design-only 案例。保留原 ID、URL、Tags、分類、features、requirements、limitations、Typed Refs 及原用途與推薦；補齊空白 repo。不新增全域 Graph Edge。

## 重要界線

- gzh-design-skill：不負責撰寫原始文章，亦非一般網頁產生器。 檢查腳本的退出碼 0 不保證所有警告清除或平台實際貼上成功。 AGPL-3.0 授權義務、第三方圖片權利與平台格式仍需另行核對；未執行腳本。
- baoyu-skill：只核對三個技能，不代表整個技能包已完成深度審查。 封面與插圖需可用點陣圖生成服務，預設需確認後才能生成。 模型費用、帳號、憑證與素材權利需另外核准；本批未安裝、生成或發文。
- ui-ux-gold-standard：搜尋結果與設計建議不是使用者研究或實測結果。 未逐項核查 CSV 規則、動效技法、瀏覽器相容性與依賴。 README 標示 MIT，但未找到獨立 LICENSE；再散布前須核對授權及參考網站素材。

## Gate 與接續

新增 Catalog 等值、雙向解析、固定版本、案例欄位及四尺寸瀏覽器回歸。CI 尚待執行；未進行第三方實測。合併前 87/286；通過合併後 90/286（84 完成對應、6 deferred），196 尚未改寫。下一批依 manifest 選擇其他未改寫設計、開發及教材資源。排程停用，直接執行。
