# P4 — Learning-first Knowledge Explorer

> 目標：從「找到工具」變成「理解問題、學會方法、實際練習」。本檔記錄開發分支中的內容與驗收邊界；測試是否通過以對應 GitHub Actions 為準。

## 問題與行為差異

| 原本 | 本階段 |
|---|---|
| 首頁主要介紹工具型別、搜尋與圖譜 | 首屏優先展示六個可學習問題，說明完成後會學到什麼；完整原始資料搜尋保留 |
| Problem 頁面只有問題、目標、關聯工具 | 先提供重點、原理、核心 Concept 的原始方法、可操作步驟／產物／檢查、情境選擇、虛構示範、練習、風險與來源 |
| 將所有 Problem 看成同樣完成 | 十份有完整人工整理的教學；其他十份顯示「來源導讀」，根據原始 Workflow 與 Concept 產出已知內容，沒有資料時顯示缺口 |
| 只看得到 Graph 摘要 | Graph 與原始資料依然可展開；學習內容中的來源可直接連至正式知識節點 |
| 想規劃流程仍在閱讀頁面思考 | 教學與 Workflow Playground 分開；從 Problem 跳轉既有推薦 Flow |

## 來源與內容約束

- 原始六類 V2 Entity 的數量、ID、內容不應變更。新增內容寫在 **既有人工策展 Problem** 的可選 `learning` 欄位；Problem 不是第七類 V2 Entity。
- `learning.version: 1` 包含：`takeaway`、`principles`、`prerequisites`、`decisions`、`steps`、`example`、`practice`、`pitfalls`、`sourceRefs`。
- 每份完整學習筆記的 `sourceRefs` 必須指向真實存在的 V2 Entity，且同時存在於該 Problem 的人工策展 `links`。不允許從共同標籤推導相容性。
- `example` 是**假設案例**，只用來解釋方法，不是已測試的工具輸出；技能、服務、效能及 API 能力仍依原始資料與待核實的官方來源判斷。
- 未達完整教學水準的 Problem 不能因為動態組裝了 Workflow 而被標示為「完整學習筆記」。若原始 Workflow 沒有 `outputs` 或 `gate`，畫面要標示尚未定義。
- AI 工具使用前仍須確認資料權限、最新文件、實際串接、成本與安全。教學頁面不執行第三方工具。

## 首輪十個實作教學

1. `ai-coding-spec-delivery` — Spec、Tickets、多 Agent 分工、Review、Evidence QA。
2. `enterprise-knowledge-search` — 分辨文件型 RAG 與 SQL 語意層，具來源問答的驗收。
3. `build-business-website` — Brief、Handoff、Coding、實際 Browser QA。
4. `long-video-to-shorts` — 片段挑選、可編輯時間軸、字幕與授權檢查。
5. `shared-agent-memory` — 記憶擷取、索引、漸進召回、成果回饋。
6. `privacy-safe-ai-documents` — 本機 PII 偵測、可逆遮罩、核准範圍、還原 QA。
7. `automate-email-triage` — 規則優先、模型分類、Dry Run、核准與回復。

首頁先顯示其中六個跨領域入門案例，其餘可從完整 Problem 清單或搜尋找到。

## 變更檔案

- `data/problems/{以上十筆}.json`：保留 Problem 原有欄位與關聯，新增來源支援的閱讀教學。
- `knowledge-learning.js`：獨立的原理／步驟／例子／練習渲染器，無第三方 API 執行。
- `knowledge-app.js`：在選擇 Problem 時按需讀取原始 Problem JSON；保留沒有學習筆記時的來源導讀。
- `knowledge.html`／`knowledge-style.css`：重新安排閱讀先後與響應式樣式。
- `scripts/test-problem-learning.mjs`：逐項驗證教學完整性、引用及六種資料型別未變。
- `scripts/test-knowledge-browser.mjs`：檢查首次使用入口、完整教學、來源導讀、深連結、跨裝置版面。
- `.github/workflows/p1-graph-tests.yml`：加入以上測試。

## 驗收 Gate

1. **Source Integrity**：7 筆完整教學的來源有效，V2 正式資料沒有變更。
2. **Learning Value**：進入首頁可立刻看到要學會什麼；完整教學不是只有工具清單。
3. **Actionability**：每份完整教學有操作步驟、產物、檢查、情境選擇與練習。
4. **Evidence**：所有工具能力仍回指既有官方來源紀錄；虛構例子有清楚標籤。
5. **Fallback**：沒有 `learning` 的 Problem 也能依真實 Workflow 與 Concept 閱讀，沒有資料時顯示缺口。
6. **Regression**：Graph、六類知識閱讀、Prompt 複製、Playground 分離、375/430/768/1440px 與 JS 例外保持驗證。
7. **Release**：本分支為 Draft PR，不自動合併或部署。

## 後續內容工作

本輪只對十個 Problem 完成深入策展。其他十個問題，以及尚未完整記錄用途／限制的工具，仍需逐一補上真實資料支持的教學。後續可以擴充為 Concept 系列課、比較型決策表、可驗證的入門專案及重複練習進度；在缺少證據前不應先宣稱已支援。
