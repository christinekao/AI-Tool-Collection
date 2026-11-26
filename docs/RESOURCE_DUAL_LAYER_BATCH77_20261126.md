# Resource 雙層知識 Batch 77｜互動元件、影片剪輯與語音輸入

公開來源逐筆查核；日期化文件證據，第三方未實測。3 筆 evidence-linked、9 用途、9 局部證據、3 design-only 案例。

## bencho

- evidence-linked；2026-11-26 公開第一方網頁及可讀文件查核；無可核對上游 Git SHA；未安裝、執行、登入、付費、傳送資料或實測第三方項目。
- 用途：從互動 React 元件目錄挑選合適的介面行為，再建立自己的互動驗收規格。
- 案例（design-only）：設計作品集的互動操作與回饋；自有作品集的操作需求、狀態與可及性條件 → 互動規格、元件候選及驗收矩陣 → 自有前端設計收藏庫，審查後交由開發。
- 來源證據：
  - 設計高風險操作的確認回饋：[Hold to delete / Confirm send](https://bencho.dev/)；目錄列出互動範例，未操作元件；不保證能防止誤刪。
  - 設計載入與進度狀態：[Thinking loader / Progress tracker](https://bencho.dev/)；未驗證元件與實際任務狀態綁定。
  - 規劃可調整的工作台面板：[Resizable panels / Split view](https://bencho.dev/)；展示項目不等同可直接重用程式；授權與可及性需查。
- 原始欄位、分類、Tags、Typed References 保留；授權與第三方執行品質另行核對。

## fomofly-ai

- evidence-linked；2026-11-26 公開第一方網頁及可讀文件查核；無可核對上游 Git SHA；未安裝、執行、登入、付費、傳送資料或實測第三方項目。
- 用途：將長影片整理為短影音候選，並由人工確認片段語意、版面及畫面焦點。
- 案例（design-only）：從一段自有教學影片規劃短影音交付；有授權的合成教學影片及品牌規範 → 短片候選清單、品牌規格及逐支審核表 → 自有影音製作流程，經人工驗收再發布。
- 來源證據：
  - 抽取有完整語意的片段：[自動智慧型剪輯](https://www.fomofly.ai/)；未上傳影片，片段是否保留原意需人工確認。
  - 規劃一致的短片樣式：[自動風格設計](https://www.fomofly.ai/)；未驗證實際字體與品牌套用效果。
  - 檢查重新取景與主體：[自動重新取景](https://www.fomofly.ai/)；未生成短片；多人或畫面切換時仍須人工檢查。
- 原始欄位、分類、Tags、Typed References 保留；授權與第三方執行品質另行核對。

## sona-orbit-parroting

- evidence-linked；2026-11-26 公開第一方網頁及可讀文件查核；無可核對上游 Git SHA；未安裝、執行、登入、付費、傳送資料或實測第三方項目。
- 用途：研究 Mac 本機語音辨識、個人詞典及語氣提醒的分工，設計可比較與回復的語音輸入流程。
- 案例（design-only）：規劃中英混合語音輸入的品質比較；非敏感自編中英句子與標準逐字稿 → 模型選擇紀錄、辨識誤差與語氣提醒驗收表 → 自有語音輸入測試區，不使用真實機密錄音。
- 來源證據：
  - 依語言及裝置選擇辨識模型：[Comparison](https://sona-orbit.github.io/parroting/en/speech-models)；公開中文評估條件與本機環境不同；未驗證自身辨識率。
  - 設計個人辨識模型比較與回退：[Speech models / Test with your read-aloud recordings](https://sona-orbit.github.io/parroting/en/guide)；未匯入模型；錄音保存與刪除設定需另驗。
  - 建立語氣回饋及驗收流程：[What personal training trains / Check the result](https://sona-orbit.github.io/parroting/en/model)；語氣個人化不同於語音辨識訓練；未測試模型。
- 原始欄位、分類、Tags、Typed References 保留；授權與第三方執行品質另行核對。
