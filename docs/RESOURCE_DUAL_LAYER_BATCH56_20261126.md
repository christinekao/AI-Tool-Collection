# Resource 雙層知識 Batch 56｜設計驗收、學習管理與架構模擬

3 mapped 候選、9 用途、9 局部程式能力、3 design-only 案例。原分類領域、Tags、關聯保留。

## nutlope-hallmark

- 固定版本 `04977e15f3dfd6ee4b74c887dac3eb52665d6c92`；根授權：MIT；圖片、字型與第三方依賴另查
- 用途：提供網頁設計主題選擇、設計原始碼機械檢查與規則參照一致性檢查。
- 案例：規劃前端設計主題選擇與規則檢查驗收；合成設計需求、測試主題清單及自有 HTML/CSS/JSX。 → 主題候選、原始碼檢查範圍及規則引用結果。 → 自有前端設計工作區，經真實瀏覽器與人工驗收後使用。
- 來源證據：
  - 建立主題索引與差異化候選：[skills/hallmark/scripts/theme.mjs](https://github.com/Nutlope/hallmark/blob/04977e15f3dfd6ee4b74c887dac3eb52665d6c92/skills/hallmark/scripts/theme.mjs)（buildIndex / loadIndex / pickFrom）；索引建立會寫入檔案並拒絕重複 slug；候選差異是啟發式，不等於符合訪客任務。
  - 界定設計原始碼檢查範圍：[skills/hallmark/scripts/sloplint.mjs](https://github.com/Nutlope/hallmark/blob/04977e15f3dfd6ee4b74c887dac3eb52665d6c92/skills/hallmark/scripts/sloplint.mjs)（collectFiles / parseDoc / parseCss）；略過特定建置及隱藏目錄；靜態解析不是完整瀏覽器渲染，動態行為與可及性須另驗。
  - 驗證設計規則引用有效性：[skills/hallmark/scripts/refcheck.mjs](https://github.com/Nutlope/hallmark/blob/04977e15f3dfd6ee4b74c887dac3eb52665d6c92/skills/hallmark/scripts/refcheck.mjs)（gateProblem / walk）；依文件格式和規則識別字串檢查，不代表規則語意正確；執行完整腳本前先核准隔離環境。

## akas333-tysa

- 固定版本 `4484105e310d71b061680c34d538b898fa2b756f`；根授權：AGPL-3.0；題庫與模型授權另查
- 用途：依學習者理解程度提供教學輔助；本次查核題庫載入、課程進度彙整及搜尋服務可用性。
- 案例：規劃個人學習平台的課程進度與題庫驗收；合成課程概念樹、教學紀錄、測試題庫與模擬搜尋設定。 → 課程進度清單、去重題庫及搜尋可用性狀態。 → 自有學習知識庫，經本人覆核及資料授權後整合。
- 來源證據：
  - 彙整概念課程與子課程狀態：[packages/engine/src/server/courses.ts](https://github.com/Akas333/TYSA/blob/4484105e310d71b061680c34d538b898fa2b756f/packages/engine/src/server/courses.ts)（courseEntries / courseOrder / conceptChatStatus）；缺少課程資料時回傳空值；子課程遞迴深度有限，對話狀態完成不等於學習者已掌握。
  - 載入並依來源識別去重題目：[packages/engine/src/store/question-bank.ts](https://github.com/Akas333/TYSA/blob/4484105e310d71b061680c34d538b898fa2b756f/packages/engine/src/store/question-bank.ts)（loadQuestionBank / questionBankAvailable / bankFiles）；無法解析或無效資料略過；依檔案大小與修改時間快取，須另檢查缺漏及題目授權。
  - 明確回報搜尋服務是否可用：[packages/engine/src/server/search.ts](https://github.com/Akas333/TYSA/blob/4484105e310d71b061680c34d538b898fa2b756f/packages/engine/src/server/search.ts)（resolveSearchEngineFor / searchStatus）；指定服務缺憑證時不自動替代；有憑證不等於服務可呼叫，對外搜尋及資料傳輸需核准。

## minchenlee-loadsketch

- 固定版本 `0e30c5b6fdac12aeb2724e0a3cee7b4a8ecf47d9`；根授權：MIT
- 用途：以離散事件模擬探索架構與負載假設，本次聚焦重現隨機情境、延遲統計與模擬 SLO 判定。
- 案例：規劃架構模擬的公平比較與延遲驗收；合成架構、同一情境種子、流量與模擬 SLO。 → 可重現的抽樣序列、延遲摘要與模擬條件判定。 → 自有架構學習與設計實驗，另行執行真實負載測試。
- 來源證據：
  - 建立可重現的隨機抽樣：[src/engine/rng.ts](https://github.com/minchenlee/loadsketch/blob/0e30c5b6fdac12aeb2724e0a3cee7b4a8ecf47d9/src/engine/rng.ts)（makeRng / sampleDuration / sampleExp）；相同種子和標記產生相同序列；不同設計呼叫順序可能影響實際對照，模型分佈仍須確認。
  - 計算模擬延遲分位數：[src/engine/histogram.ts](https://github.com/minchenlee/loadsketch/blob/0e30c5b6fdac12aeb2724e0a3cee7b4a8ecf47d9/src/engine/histogram.ts)（Histogram.add / Histogram.quantile / Histogram.summary）；以對數桶近似分位數，空樣本回傳零不能視為低延遲；須核對樣本數與適用範圍。
  - 比較模擬負載與服務目標：[src/engine/limit.ts](https://github.com/minchenlee/loadsketch/blob/0e30c5b6fdac12aeb2724e0a3cee7b4a8ecf47d9/src/engine/limit.ts)（simulatePeak / peakScenario / sloOf）；使用模擬暖機、觀測與排空條件；樣本不足或背景失敗須另處理，結果只在模型假設下有效。
