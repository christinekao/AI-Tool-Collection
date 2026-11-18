# P6｜依需求動態整理現有收藏（Intent-aware Knowledge Answers）

> 2026-11-18 | 狀態：開發分支功能，CI 與實際 Browser／Pages 結果另行核對。

## 核心需求

使用者不該必須先知道 Resource、Concept、Skill，也不應只被限制在 20 個人工策展 Problem 或 10 個固定教學中。

真正的操作流程：

**自然語言問題 → 判定需求類型 → 從全部收藏檢索 → 依需求選擇資料欄位 → 組合可核對的閱讀內容 → 呈現缺口與實作界線**

這是「從已有知識回答」，不是「只要輸入任何題目就虛構答案」。

## P6 MVP 已做

- `ask.html`、`knowledge-answer.css`：獨立的自然語言需求入口，問題範例，引用原始來源的回答區。支援可分享的 `?q=` URL 與複製含引用的整理結果。
- `knowledge-answer-core.mjs`：純函式，從全部六種 V2 Canonical JSON 的產生索引與現有 Problem Layer 製作資料集合，辨識「學習／理解、比較、實作、搜尋」意圖。以標題、ID、標籤、原始用途與重要欄位做相關度搜尋；關鍵字擴充只影響尋找候選，絕不能當作語意關聯證據。
- `knowledge-answer-app.mjs`：載入現有 Catalog + Graph，只有當 Problem 文字匹配時才按需補讀原始 Problem JSON 的學習筆記。所有輸出在 UI escape，沒有第三方 API／Token；回答中的句子均可回到實際 V2 Entity 或 Problem。
- 當資料不足：告知缺口，**不**將不存在的 GitHub 教材或 Framework 說成已保存；沒有實作紀錄時不得稱為已完成。
- 既有的 `index.html#/browse/all`、主題探索、Knowledge Explorer、20 個 Problem、Workflow Playground、全部 548 筆正式 Canonical Entity、來源及 Typed References 保留。

## 依需求改變內容

| 需求 | 來源內容與呈現方式 |
| --- | --- |
| 我想了解 AI Security | 對應問題／Concept／Workflow 的核心問題、方法、原始資料限制、延伸來源 |
| 我想學 Agent | 優先找 Concept 與 Problem 教學；有教學時補練習，沒有則不強行產生練習 |
| 我想比較兩種方案 | 找到可獨立對照的 Resource、各自優勢、功能與限制；證據不足時不判定最佳 |
| 我想實作 AI Usage Bar | 使用保存的 `implementationKnowledge`、原始建置條件與風險；不自行執行安裝 |
| 我想學 GitHub | 只使用目前收藏有來源的內容；若沒有足夠基礎學習資料，明確顯示知識缺口 |
| 不存在的技術名稱 | 顯示「目前收藏沒有足夠資料」，不虛構引用 |

## 重要限制（未完成能力）

**這不是 LLM Chat、不是向量搜尋、沒有閱讀站外新網頁的能力，也沒有產生新知識。** 目前的答案是採用可解釋的詞彙相關度和來源欄位自動整理；對同義詞、複雜推理或跨文件矛盾的理解仍有限。若要支援更可靠的深度推理、中文問題語意檢索、跨來源知識合成及持續對話，需要獨立建置取得授權的檢索／生成後端與 Evals。不能從靜態 GitHub Pages 偷偷接外部模型或暴露 API Key。

**安全邊界：** 瀏覽器搜尋目前只從同網域已公開的收藏 JSON 讀取內容，不傳送使用者問題到第三方 AI；URL 可分享但含使用者輸入，不建議放入任何機密。

## 驗收

1. 所有 548 筆正式 V2 Entity 與現有 Problem 都參與候選檢索；無更動 Canonical JSON。
2. 判定至少四種不同意圖，對同一領域呈現不同欄位，不固定一套教學模版。
3. AI Security、Agent Framework、AI Usage Bar、RAG vs Agent 與無資料關鍵字具有可追溯的回應；沒有證據時不自造答案。
4. Source 的本地連結只指向現有正式資料；步驟明確呈現產物與資料原記錄的 Gate，否則標明未定義。
5. Original Catalog／Graph／Problem、Prompt 複製、Playground、全部收藏無回歸。
6. Chromium 375／430／768／1440px 無水平溢出與 JS 例外；正式網站部署需另行檢查。

## 後續計畫（不在此 PR）

- 引入混合檢索（關鍵字 + 語意向量）並評估 MRR、Recall、Citation Precision、Coverage、Abstention。
- 用有權限控管的服務端連接 LLM，嚴格約束輸入引用、輸出 Claim-Source 對照、驗證與失敗回退；公開網站不放金鑰。
- 增加「先保存 URL、後補研究與學習內容」的攝取流程，讓擷取失敗不會使原始收藏遺失。
- Implementation Workspace 需另行設計有權限、工具與實際測試的執行環境。
