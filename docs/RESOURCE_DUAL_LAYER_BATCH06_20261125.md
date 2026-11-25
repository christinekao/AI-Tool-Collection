# Resource 雙層改善 Batch 06（2026-11-25）

基線 main `41c0aa02c87665bb034731b2d6da150b9819f184`；PR #70 四項 CI 通過並合併 `47fd1418383c815bfa9d23644725256298bffef5`，Catalog Sync 確認。31/286 筆已合併雙層審查（28 完成對應、3 deferred）。

本批實際閱讀官方公開文件及目錄，十筆非程式碼 Resource 均 evidence-linked（30 個用途、30 個局部證據、10 個 design-only 案例）。不假造第三方程式內部結構、不宣稱 Runtime、Security、Integration 已驗證。

| Resource | 新增應用 | 官方來源 |
|---|---|---|
| recraft | 製作網站分類圖示 | https://www.recraft.ai/ai-models/recraft；https://www.recraft.ai/blog/vectorizer-pro；https://www.recraft.ai/api |
| remove-bg | 整理電商商品去背流程 | https://www.remove.bg/api |
| rive | 設計表單儲存狀態動畫 | https://rive.app/blog/getting-started-with-data-binding；https://rive.app/game-ui |
| pinterest-visual-reference | 建立作品集視覺靈感看板 | https://help.pinterest.com/en/article/create-a-board；https://help.pinterest.com/en/article/save-pins-with-the-pinterest-browser-button；https://help.pinterest.com/en/article/copyright |
| landing-love | 研究作品集首頁滾動動效 | https://www.landing.love/ |
| maxibestof | 規劃編輯式作品集首頁 | https://maxibestof.one/ |
| motion-sites | 設計知識庫卡片的微互動 | https://motionsites.org/motion |
| google-stitch | 規劃履歷投遞管理介面 | https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-updates/ |
| vercel-ai-gateway | 驗證摘要服務的模型備援 | https://vercel.com/docs/ai-gateway/authentication-and-byok；https://vercel.com/docs/ai-gateway/models-and-providers/provider-options |
| pythonanywhere | 部署簡單的公開筆記展示頁 | https://help.pythonanywhere.com/pages/Flask/ |

## 重要邊界

- remove.bg 官方 API 頁於本輪顯示 2026-12-01 起背景移除移往 Leonardo.Ai。舊 POST /v1.0/removebg 僅作文件快照；不保證金鑰、端點或舊流程續用，新契約仍需核對。沒有上傳圖片。
- Vercel Gateway 的 order 是供應商偏好、only 是硬限制；BYOK 不取代 Gateway 認證。未呼叫 API。
- Rive 以官方 Data Binding 說明及產品資料為依據，未確認個別 Runtime API；Google Stitch 依 2026-05-19 公告，不宣稱帳號功能或發布可用。
- 設計目錄僅人工閱讀公開資訊；不下載素材、不爬取、不複製案例。Land-book 首頁及條款頁本輪回傳 403，原 Canonical 不變，列為後續來源待核對，未算入本批。
- 逐筆比對原 ID、Repo、URL、Tags、分類、features、requirements、limitations、所有 Typed Refs 與既有 implementationKnowledge，確認保留。新增 priorPurposeSnapshot。無新增全域 Graph Entity 或 Edge。

## Gate 與進度

增加十筆 Catalog 等值、雙向映射、未實測、遷移警示與四尺寸瀏覽器回歸測試。CI、合併與 Pages 以真實 Actions 為準，不預先標 PASS。合併前 31/286；若本批通過並合併則 41/286（38 完成對應、3 deferred），245 未改寫。Land-book 屬尚未改寫。下一批按 manifest 選取其他來源明確的服務、設計資料及教材；三筆 deferred 持續追蹤。排程停用、直接執行。
