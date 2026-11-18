# P7｜讓收藏真正提供可學會的內容：Learning Outcomes

## 問題

原先收藏詳情頁只顯示「這是什麼、適合情境、主要功能」，對於**教學型 Resource** 只能列出十個章節名稱，使用者看完仍不知道各章會學到什麼、該先看哪裡、學完有何產物。

本次先以使用者指出的 `aiposthub-awesome-opensource-ai-cheat-sheets-guide` 做完整的來源導向教學化實例，將可複用的 UI 設計為其他 Resource 的可選內容層。這不是對其他 269 個 Resource 擅自捏造學習內容。

## 新增結構

正式 Resource JSON 的 **可選欄位** `learningGuide` （version 1）：

| 欄位 | 用途 |
| --- | --- |
| `headline` / `takeaway` | 回答：這份資源的核心學習價值是什麼 |
| `audience` | 適用讀者與不需要一次讀完的限制 |
| `outcomes[].title/detail/check` | 能力成果與可檢驗的學會標準 |
| `readingPath[].title/why/sourceUrl` | 建議的閱讀路徑；每一步指回原始章節 |
| `modules[].id/group/title/question/learn/example/output/sourceUrl` | 每個章節要解決的問題、具體概念、應用示例與實際產物 |
| `practice.title/scenario/tasks/check` | 一項**明確標示為假設**的綜合實作練習 |
| `caveat` | 版本、授權、實測與內容限制 |

UI：`catalog-app.js` 的 `learningGuideHtml()` 在該 Resource 的既有功能清單之前顯示學習內容，保留原始元資料。首頁 Hero 在「點開詳情」時隱藏，避免學習重點被推到折疊下方。模組可展開，附可核對的原始章節連結。其他 Resource 沒有此欄位時仍維持原樣。

## 內容與來源

- 使用者原始文章：<https://www.aiposthub.com/sraodev-awesome-opensource-ai-cheat-sheets-guide/>
- 上游 Repository：<https://github.com/sraodev/awesome-opensource-ai-cheat-sheets>
- 核對的版本：`c8275b4bfad40f431cd22b616c74728c18e2b29f`
- 閱讀依據：上游 `README.md`、`READINESS_2027.md` 及相關十個 `cheatsheets/*.md`。學習示例是**根據原文提供的工程原理做情境化詮釋，不是上游文件提供的實測系統**。
- 五個成果：**做技術選擇、定義契約、建立品質評估、設計 Agent 安全邊界、判斷生產就緒**。
- 十個主題不是「十個功能」；每個有問題、核心知識、示例、產物、原始連結。
- 此資源也不是官方法律合規認證或完整 AI 學位課程，閱讀後仍須驗證最新標準與適用性。

## 交付完整性

1. 完整原始 URL、上游 Repo、Commit、舊 `features`、四個 `conceptRefs` 均保留。
2. 只修改此 Resource 的可選 `learningGuide` 與共享 UI、CSS、測試；不變更六種 Canonical Entity 型別，不新增虛構 Problem／Workflow／Concept。
3. `node scripts/build-v2.mjs` 將新欄位同步到 `catalog-v2.json`；現有整庫搜尋照常。
4. 單元測試檢查 5 項成果、10 篇章節、完整版本化來源、練習與原始收藏不遺失。
5. Chromium 實測網頁學習成果、展開模組、連結、375／430／768／1440 響應式畫面；無回歸後才合併部署。

## 下一步（尚未實作）

- 對每次新收藏自動判斷它是「參考工具、教學、程式專案、研究、Prompt」，再提供適切的萃取資訊。**不能把每種資料都強迫填五個學習成果或十個章節。**
- 先做來源映射與引用核對，再加入 LLM 萃取；對缺乏證據的學習點標示缺口，不生成不可信內容。
- 用具體使用者情境追蹤「讀完可回答什麼問題、可交付什麼成果」；這比增加標籤數量更重要。
