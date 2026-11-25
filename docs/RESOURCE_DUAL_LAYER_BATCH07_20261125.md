# Resource 雙層改善 Batch 07（2026-11-25）

基線 main `e2dc7ac51072f0dd8ca01330a0d15c2e03416cb4`；PR #71 四項 CI 通過並合併 `76d728e5006659d66b87a7bd83ecff7997fc7329`，Catalog Sync 確認。41/286 筆已合併雙層審查（38 完成對應、3 deferred）。

| Resource | 具體應用 | 本輪查核範圍 |
|---|---|---|
| higgsfield-ai | 三鏡頭商品宣傳短片 | [官方網站](https://higgsfield.ai/)；[輸出權利說明](https://higgsfield.ai/creator-hub/help-center/account/who-owns-my-generations-and-can-i-use-them-commercially)；未生成，資料授權與第三方權利須分開查核 |
| inspora | 產品品牌風格參考表 | [官方目錄](https://www.inspora.design/)；只確認分類與收藏入口，作品未完整載入 |
| chatcut | 產品操作示範影片剪輯 | [Editor](https://chatcut.io/docs/editor-overview)、[Web/Desktop/Plugin](https://chatcut.io/docs/chatcut-products)；本地渲染不等於全離線 |
| motionsites-ai | 投遞管理 Dashboard | [官方目錄](https://motionsites.ai/)、[2026-11-22 條款](https://motionsites.ai/terms)；同名網域無關，不得散布原 Prompt 庫 |
| vercel-skills-sh | 選擇程式審查 Skill | [Docs](https://www.skills.sh/docs)、[CLI](https://www.skills.sh/docs/cli)；榜單非安全保證，預設安裝遙測及退出設定 |
| meigen-ai | 商品海報生成測試 | [公開介面](https://www.meigen.ai/)、[2026-10-12 條款](https://www.meigen.ai/terms)；Plugin 使用已購點數、OAuth 準備媒體公開 URL、逾時與重送限制 |
| openai-codex-security | 合成表單專案安全審查 | [Help Center](https://help.openai.com/en/articles/20001107-codex-security)；威脅模型、掃描、隔離驗證、修補審查、研究預覽及計費，未啟用 |
| ibkr-portfolioanalyst | 每月資產與交易回顧 | [Reporting](https://www.interactivebrokers.com/en/whyib/reporting.php)、[Dashboard](https://www.ibkrguides.com/orgportal/performanceandstatements/pa_viewingaccountperformance.htm)；Statement PDF 與 Flex Query 文字/XML 分開，不推定所有報表支援 CSV |

八筆 evidence-linked 候選，24 個前台用途、24 個底層文件證據、8 個 design-only 案例。寫入前檢查各原 ID、Repo、URL、Tags、分類、features、requirements、limitations、既有 Typed Refs 不變，證據欄位存在；保留歷史 purpose 與原 implementationKnowledge。無新增全域 Graph Entity 或 Edge。未登入、上傳、安裝、掃描、生成、付費或連接投資帳戶。

## 未改寫的來源缺口
- Wellmade 官方首頁逾時。
- Land-book 再查仍回傳 403。
- Designed to Scale 僅提供需 JavaScript 的外層頁面，未取得章節內容，不能宣稱教材已審查。

三筆保留既有資料，未算入本批完成數；後續透過可合法存取的官方文件核對。另追蹤先前三筆 deferred（Microsoft AI Agents for Beginners、RAGFlow、AFFiNE）。

## Gate
新增 Catalog 等值、雙向映射、來源欄位、未實測、條款限制與四尺寸瀏覽器測試。CI 與 Pages 以實際結果為準。合併前 41/286；若本批驗收並合併，49/286（46 完成對應、3 deferred），237 尚未改寫。下一批優先 Agent runtime、CLI 及工具整合的限定範圍程式碼審查。排程維持停用。
