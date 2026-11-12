# P1｜Problem-Centric Knowledge Graph MVP

> 狀態：**MVP IMPLEMENTED** · 日期：2026-11-12 · 分支：`main`  
> 目標：所有主題都能搜尋 Resource、Concept、Skill、Prompt、Combination、Workflow，並探索既有引用。人工整理的 Problem 是品質較高的補充入口，不是網站必要前提；**AI 影片製作只是示範**。

## 已上線的體驗

- **跨領域通用入口**：開啟頁面預設為全庫探索（不是影片專區），可搜尋任何既有資料（例如 AI Agent、前端、資料分析、自動化、影片）。
- **從任意節點展開**：不用先建立該領域的 Problem，也能從搜尋結果開啟一筆 Resource、Skill、Concept、Prompt、Combination 或 Workflow，探索它實際存在的入站／出站引用。
- **區分搜尋與證實的關聯**：文字相似的項目是「搜尋結果」，不產生推測的 SOLVES、COMPLEMENTS 或替代關係。真正的 Problem 關聯仍需有原因及來源欄位。

- [問題探索頁](https://christinekao.github.io/AI-Tool-Collection/knowledge.html)
- 入口已加入首頁與網站導覽列，舊版全部收藏與詳情頁仍保留。
- **僅作為示範案例**的五個影片製作 Problem（預設收合，不決定搜尋範圍）：
  - 學習與製作 AI 影片（總覽）
  - 從文字與參考素材生成 AI 影片
  - 將長影片剪成 Shorts／Reels
  - 製作可修改的產品宣傳影片
  - 製作角色與場景一致的 AI 短劇
- 互動：搜尋所有知識 → 開啟任意節點 → 查看雙向引用與詳情；也可以展開示範 Problem → 查看人工確認的跨類型關聯。
- Mobile：選擇問題後自動定位到相應內容，並將焦點移到所選問題。

## 資料責任邊界

`data/{resources,skills,concepts,prompts,combinations,workflows}/<id>.json`
是既有 **V2 Canonical Source**，不可被 Graph 複製為第二份可維護的資料。

`data/problems/<id>.json` 是新增的、可以逐筆維護的 Problem Layer。每筆問題保存：

| 欄位 | 用途 |
|---|---|
| `id`、`title`、`question` | 使用者可理解的問題與搜尋入口 |
| `description`、`outcome` | 問題背景、學習或執行目標 |
| `links[]` | 指向原有六種 V2 實體的明確關聯 |
| `links[].relation` | 說明它是原理、工具、執行方法或組合 |
| `links[].why` | 為什麼與此問題相關 |
| `links[].evidenceField` | 既有資料中支持這個關聯的欄位 |
| `relatedProblems[]` | 相關子問題與探索路徑 |

**允許的經審查 Problem Relations：**

| Relation | 目標類型 | 語意 |
|---|---|---|
| `explained_by` | Concept | 相關原理 |
| `supported_by` | Resource、Skill | 有用的工具或技能 |
| `guided_by` | Workflow、Prompt | 可研究的執行流程或提示詞 |
| `combined_in` | Combination | 可研究的搭配組合 |
| `has_subproblem` | Problem | 從大問題進入具體需求 |

原有 V2 Typed References 以 **`declared_reference`** 保留在 Graph 中，不自動升格成「可替代」、「等價」或「已驗證能解決某問題」。不同工具的替代性、成本與品質比較需未來加入可核對的證據，不得從文字相似度推測。

## 自動建置與維護

`scripts/knowledge-graph-core.mjs` 從既有 V2 資料與 Problem Layer 產生 Graph：
`data/knowledge-graph-v1.json`。這是**生成的索引，不是可手動修改的原始資料**。

~~~bash
# 新增／編輯 data/problems/<id>.json 或六種 Canonical Entity 之後：
node scripts/build-v2.mjs
node scripts/validate-v2.mjs
node --test scripts/test-knowledge-graph.mjs

# 當執行環境有 Chrome / Chromium：
node scripts/test-knowledge-browser.mjs
~~~

`.github/workflows/v2-catalog-sync.yml` 監聽資料／Graph Build 程式更新並提交聚合索引。`.github/workflows/v2-data-validate.yml` 會驗證 Source／Catalog／Manifest／Graph 的一致性。

`.github/workflows/p1-graph-tests.yml` 對 Graph 連結與網站互動執行測試，並保存 375px、1440px 等寬度的瀏覽器截圖。

## P1 MVP 驗證證據

- **545 筆現有 V2 Canonical Entity**（沒有將 Resource 與 Skill 名稱相同誤判為同一筆）。
- **5 個 Problem 節點**（另外以小型 JSON 維護）。
- **550 個 Graph 節點**、**1,734 條 Graph 邊**：1,702 條 V2 引用、32 條經審查的 Problem 關聯。
- Graph 生成器及 Validator：對不存在目標、錯誤 Relation、欠缺來源依據等情境會拒絕建置。
- [V2 Data Validate #43187988677](https://github.com/christinekao/AI-Tool-Collection/actions/runs/43187988677)：**SUCCESS**。
- [P1 Graph Unit + Browser Tests #43189693908](https://github.com/christinekao/AI-Tool-Collection/actions/runs/43189693908)：**SUCCESS**。實際 Chrome 測試涵蓋問題選擇、雙向引用、節點詳情連結、手機捲動、375/430/768/1440px 水平溢出與 JavaScript 例外。
- QA 截圖已由上述 GitHub Actions 保留；截圖中繁體中文已透過測試環境 CJK 字型檢查確認可以辨識。
- 以上是 GitHub Actions **本機 HTTP 測試伺服器**執行的實際瀏覽器驗證；不能直接視為公開 GitHub Pages 的全面端對端實測。部署紀錄需另外核對。

## 已知限制與後續工作

1. **Problem Coverage**：目前只整理影片製作的五個示範問題；其他主題雖然可透過通用搜尋與原始 Typed References 探索，但**尚未建立經人工審查的正式 Problem 解決路徑**。
2. **Alternatives / Capabilities**：尚未建立有來源的 `ALTERNATIVE_TO`、`COMPLEMENTS` 等語意邊；不把現有 Combinations 或推薦工具誤當成互換工具。
3. **Source Freshness**：Graph 表示已收藏內容的關聯，不會自動查證第三方工具目前是否停更、價格或功能已改變。
4. **Knowledge Quality**：初期保留全部 V2 Typed References；高價值節點未來仍應依據來源補充有意義的 Relation、限制與實際使用情境。
5. **Graph Visualization**：目前使用以所選 Problem 為中心的局部關聯圖與可點選鄰居，不在單一畫布塞進 550 個節點，避免難以操作。

下一階段可依使用者需求擴展「網站開發」、「AI Agent／Skills」、「資料分析」等 Problem 範例，而不是預先認定某一領域優先；另外設計可追溯的能力比較與替代方案模型。在更新 Schema 前先定義驗證條件與資料維護成本，避免重複資料來源。
