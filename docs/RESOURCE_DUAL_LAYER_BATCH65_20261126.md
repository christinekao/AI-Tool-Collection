# Resource 雙層知識 Batch 65｜影音處理與生成素材索引

固定版本局部查核；原分類領域、Tags、關聯保留。文件型資源校正 Content Format 並留存原分類。未執行第三方工具。

## onetake

- 固定版本 `4e024be4c6c696b260f39a35aee6bd56d303b679`；授權：PolyForm Noncommercial 1.0.0；僅非商業許可；mapped
- 用途：連續動態構圖的畫面差異、節奏與跨段承接檢查。
- 案例：規劃非商業產品動效練習的畫面回歸驗收；自製合成構圖及已授權比較畫面 → 指定時間畫面差異、節奏檢核與連續性指標 → 非商業學習與測試流程，經資料權利與人工覆核後使用。
- 來源證據：
  - 比較固定時間的兩版畫面：[scripts/frame_diff.py](https://github.com/feitangyuan/onetake/blob/4e024be4c6c696b260f39a35aee6bd56d303b679/scripts/frame_diff.py)（frames / url）；需瀏覽器及相依素材；差異值非視覺品質判定。
  - 核對節奏與音訊檢查項目：[scripts/verify_promo.py](https://github.com/feitangyuan/onetake/blob/4e024be4c6c696b260f39a35aee6bd56d303b679/scripts/verify_promo.py)（audio_stats / PEAK_PX）；門檻為作者規則，可能誤判；未執行影片檢查。
  - 檢查畫面承接與運動：[scripts/probe.py](https://github.com/feitangyuan/onetake/blob/4e024be4c6c696b260f39a35aee6bd56d303b679/scripts/probe.py)（TRACKER_JS）；遮罩及裁切存在量測限制；非商業授權不得視為商用許可。

## jub0t-concat

- 固定版本 `c0a87a239677deded9bdc2147c3b15c4c8751d0e`；授權：AGPL-3.0-or-later；mapped
- 用途：跨平台影片剪輯器 Android 端的工作事件、匯出狀態與媒體快取契約。
- 案例：規劃影片剪輯工作與匯出狀態驗收；合成工作事件及已授權短片 → 事件對應、匯出狀態與快取行為 → 自有影音應用設計驗收，經資料權利與人工覆核後使用。
- 來源證據：
  - 處理早於工作識別的事件：[android-native/app/src/main/java/app/concat/editor/api/Jobs.kt](https://github.com/jub0t/Concat/blob/c0a87a239677deded9bdc2147c3b15c4c8751d0e/android-native/app/src/main/java/app/concat/editor/api/Jobs.kt)（JobTracker / expect / start / offer）；早期事件暫存有 256 筆上限；需測試溢位及取消。
  - 建模影片匯出狀態：[android-native/app/src/main/java/app/concat/editor/export/ExportManager.kt](https://github.com/jub0t/Concat/blob/c0a87a239677deded9bdc2147c3b15c4c8751d0e/android-native/app/src/main/java/app/concat/editor/export/ExportManager.kt)（ExportState / EXPORT_PRESETS / ExportManager）；未驗證 Android 權限、影片品質或寫入成功；不得操作真實媒體。
  - 以媒體快取支援時間軸：[android-native/app/src/main/java/app/concat/editor/media/MediaCache.kt](https://github.com/jub0t/Concat/blob/c0a87a239677deded9bdc2147c3b15c4c8751d0e/android-native/app/src/main/java/app/concat/editor/media/MediaCache.kt)（StripKey / MediaCache / strip / peaks）；僅局部快取契約；需實測記憶體、請求失敗與效能。

## awesome-gpt-image-2

- 固定版本 `eb985ee5200d641069ab818a7be1eb5395861f6b`；授權：CC BY 4.0；社群素材權利需另查；mapped
- 用途：社群影像提示詞目錄的多語生成、分類呈現與在地化文字。
- 案例：規劃自有提示詞收藏目錄的多語索引；自行撰寫提示詞、合成分類與授權紀錄 → 多語目錄、分類與來源欄位規格 → 自有提示詞知識庫，經資料權利與人工覆核後使用。
- 來源證據：
  - 依語言產生目錄：[scripts/generate-readme.ts](https://github.com/YouMind-OpenLab/awesome-gpt-image-2/blob/eb985ee5200d641069ab818a7be1eb5395861f6b/scripts/generate-readme.ts)（main）；原程式連接 CMS 並寫檔；未執行，需另核准憑證及覆寫範圍。
  - 組合分類與提示詞內容：[scripts/utils/markdown-generator.ts](https://github.com/YouMind-OpenLab/awesome-gpt-image-2/blob/eb985ee5200d641069ab818a7be1eb5395861f6b/scripts/utils/markdown-generator.ts)（generateMarkdown / generatePromptSection / SUPPORTED_LANGUAGES）；一般提示詞顯示有上限；不代表已擁有所有社群內容權利。
  - 解析多語介面文字：[scripts/utils/i18n.ts](https://github.com/YouMind-OpenLab/awesome-gpt-image-2/blob/eb985ee5200d641069ab818a7be1eb5395861f6b/scripts/utils/i18n.ts)（Translation / t）；需獨立核對翻譯與在地化；非影像生成能力。
