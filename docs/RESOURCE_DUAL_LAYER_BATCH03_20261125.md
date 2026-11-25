# Resource 雙層改善 Batch 03（2026-11-25）

Base main: 74650def53973a433352362d88290ac60aa9c248；PR #67 已合併 06904349bc627ef4860d7b6d7a0247c3882a8666、Catalog Sync 已確認。使用者要求停止排程並直接接續，排程已停用。逐筆依現行雙層規格審查。

| Resource | Human Layer / 案例 | Agent Layer / 來源 | 缺口 |
|---|---|---|---|
| tip31812-ai-usage-bar | 剩餘額度、選擇工具及提醒；安排 Coding Agent 工作 | 4 個既有 capability 逐一補固定版本 Swift 檔案及符號；重讀 Models、Store、Views、Notifier、ClaudeProvider、CodexProvider | 未安裝、存取憑證或實測；內部非公開端點風險 |
| aiposthub-awesome-opensource-ai-cheat-sheets-guide | 架構、模型、契約、發布；設計內部文件問答 | 10 個證據單元對應既有十章固定版本教材 | 沿用既有來源審查，未重新逐章或實作 |
| google-fonts | 選字體、套用、載入；雙語作品集 | 官方 Fonts API、既有字型目錄及授權指引 | FAQ 無可讀文字；個別授權、字集、載入未測 |
| coolors | 產生配色、圖片取色、對比檢查；作品集色彩 | 原網址 403，改查官方 Help Center 與 Coolors app 對比及方案文件 | 未操作或登入 |
| artlist | 配樂、商業素材權利、AI 產物；產品介紹影片 | 官方 license，區分素材庫及自行生成 AI 輸出與訂閱期滿 | 未購買、下載或審核特定專案權利 |
| davinci-resolve | 剪輯、調色音訊、匯出；產品影片 | 官方頁面分工、Free/Studio 及 Deliver 文件 | 未安裝、渲染或檢查硬體 |
| google-flow | 生成、修改、編排；三鏡頭概念短片 | 官方模型功能、編輯及 Scenebuilder 文件 | 模型、區域、方案、點數變動；未生成 |
| ffmpeg | 批次轉檔、音軌、輸出流程；短影片交付 | 官方 CLI、ffprobe 與授權文件 | 未執行命令、驗收影音或確認個別 binary 授權 |

合計 8 筆（1 mapped、7 evidence-linked）、25 個人類用途、33 個局部技術／文件對應單元、8 個設計示例。已逐筆比對原 ID、Tags、classification、URL、repo、typed refs、features、requirements、limitations、learningGuide 均不變；AI Usage Bar 原始 Repo Guide 其他章節完整保留，能力只補來源與驗證狀態。非程式碼資源 5 筆的錯誤 repo:deferred 改為 standard:applied，原分類不改。FFmpeg 已是 standard。無新增正式 Graph Edge。全數第三方 runtime not-tested。

前台保留 AI Usage Bar 原官方截圖（固定 SHA，非實測畫面）及 AI 工程速查表完整十章教材；技術架構及重建契約不再預設渲染，仍保留 Canonical。更新八筆等值／雙向證據測試，六個額外路由與原兩頁在四種寬度回歸。CI 與部署依實際 PR 狀態，不事先標 PASS。

## 進度
本批以前 main 11/286 有雙層審查（10 完成對應、1 deferred）。本批通過並合併後 19/286（18 完成對應、1 deferred），267 尚未改寫；deferred 另追蹤。下一批先處理近期新增知識管理與 RAG、動畫／影音程式碼資源，按實際來源決定 mapped 或保留明確缺口的 deferred；不將單純 README 查閱等同完整程式碼審查。
