# Resource 雙層改善 Batch 20（2026-11-25）

基線 main `6b2fe7c171281a8baeef9205ad60092317072b89`；PR #84 四項 CI 通過，合併 `6b2fe7c171281a8baeef9205ad60092317072b89`，Catalog Sync／Pages 查核時進行中。93/286 已合併（87 完成對應、6 deferred）。

| Resource | 前台案例 | 來源與查核範圍 |
|---|---|---|
| react-frontend-backend-for-beginners | 判斷履歷管理網站的前後端及部署方式 | 作者 GitHub 固定版本繁體中文 MDX 全文；公開文章網址讀取失敗，未執行原文互動元件。；https://github.com/SunZhi-Will/sunzhi-will.github.io/blob/f994eb148a3bdadaab2287f9b586d6a992ba5c16/content/blog/2026-10-06-react-frontend-backend-for-beginners/article.zh-TW.mdx |
| ryanhanwu-how-to-ask-questions-the-smart-way | 將無法儲存的表單問題整理成工程除錯單 | 固定版本繁體中文 README 的提問前準備、症狀、目標、最小重現及解決後補充段落；原文語氣及歷史平台案例不照搬，授權再散布範圍未核對。；https://github.com/ryanhanwu/How-To-Ask-Questions-The-Smart-Way/blob/fc6c538e5d833fc16f4ff99a36267c171fb84550/README.md |
| dslab-lessons | 規劃第一支 AI 影音的學習與驗收流程 | 原始 Lesson 索引與 ComfyUI × MiniMax H3 課程總覽；個別課程動態載入內容、工作流檔及影片未逐一查核。；https://dslab.tw/lesson、https://dslab.tw/lesson-h3 |

三筆 evidence-linked 候選、9 章教材、9 個用途、9 個文件證據與 3 個 design-only 案例。依內容而非託管形式選 learning 規格，保留原 ID、URL、分類、Tags、features、requirements、limitations、Typed Refs、歷史用途與推薦。不新增全域 Graph Edge。

## 重要界線

- react-frontend-backend-for-beginners：原文互動元件未執行，本頁提供自訂文字練習。 前端驗證不是安全邊界；後端必須獨立執行重要規則。 SPA、SSR、靜態匯出與託管服務要依實際架構判斷；PM2 並非必要或唯一的程序管理方案。 TypeScript 型別檢查不等於外部資料在執行時已驗證。
- ryanhanwu-how-to-ask-questions-the-smart-way：指南是溝通方法，不保證能獲得回覆或直接修復問題。 原始指南含歷史社群文化及措辭，不當語氣不作為教學規則。 提交錯誤日誌、程式片段或截圖前需去除個資、憑證與公司機密；不複製原文全文。
- dslab-lessons：只閱讀課程總覽，未下載或逐堂檢查工作流、模型與影片。 免費閱讀不等於生成免費；平台、模型、節點及授權須依實際版本確認。 總覽指出基礎與進階課程的 ComfyCloud 相容性不同；作者示例不是本次實測。

## Gate 與接續

新增 Catalog 等值、局部證據映射、案例欄位、教材章節與四尺寸瀏覽器回歸。CI 尚待執行；第三方未實測。合併前 93/286；通過合併後 96/286（90 完成對應、6 deferred），190 尚未改寫。下一批優先 SVG 動畫及其他開發資源；依 Canonical 核對。排程停用。
