# P5｜全部收藏作為底層，Knowledge／Playground／Implementation 逐層加值

> 日期：2026-11-18。此文件是增量改善規格，不表示網站已具備自動 URL 擷取、程式執行或遠端機器存取能力。

## 不可退讓的資料保留規則

1. **全部收藏是永久可見的完整入口**：列出六種 V2 Canonical Entity，不依是否有 Problem、教程、Recipe 或 Implementation 狀態而隱藏。
2. **Canonical Source 不因介面改版被搬移或刪掉**：每個實體的穩定 `id` 與 `data/<type>/<id>.json` 是唯一維護來源；UI／Graph／Catalog／Learning 都是引用或投影。
3. **紀錄原始使用者連結與來源鏈**：保留 `url`、實際上游 Repo、來源快照 commit、審查日期與來源類別；文章與上游程式碼不混稱同一著作。
4. **不要把未驗證等同已實作**：收藏成功、來源已讀、可依文獻規劃、編譯通過、Live 驗收通過是不同狀態。
5. **資料修改必須可回復**：新增需去重、Schema/Typed References 驗證、PR/CI；大規模刪除、重命名與更改資料邊界先取得同意，保留 Git History／備份／可查 Diff。
6. **六類型維持不變**：Resource／Skill／Concept／Prompt／Workflow／Combination。Problem Layer 與 Implementation Notes 是附加的策展內容，不另立會破壞索引的新資料系統。

## 導覽與資料讀取

| 入口 | 責任 | 既有／此次 |
| --- | --- | --- |
| 全部收藏 `index.html#/browse/all` | 無主題前置條件，展示所有六種資料原件；完整搜尋與型別篩選 | 本輪新增獨立深連結與導覽 |
| 主題探索 `index.html#/explore` | 九個跨類型主題，探索與推薦 | 保留 |
| Knowledge `knowledge.html` | Problem、Concept、來源教學、閱讀與證據 | 保留 |
| Workflow Playground `playground.html` | 參考 Recipe、自由草稿與依賴條件 | 保留，僅規劃 |
| Implementation（規劃） | 以可取得的 Repo/文件進行 Preflight、Spec、Code Map、Plan、Tests、Evidence | 尚未建為網站功能 |

**不是「只看經策展的少數精品」：** 不論是否經學習內容審查，新增 Resource 都應即時出現在全部收藏。

## 此次兩筆收藏

### 1. AI 郵報 × sraodev Awesome Open-Source AI Cheat Sheets

- 使用者原始文章：<https://www.aiposthub.com/sraodev-awesome-opensource-ai-cheat-sheets-guide/>
- 官方 Repo：<https://github.com/sraodev/awesome-opensource-ai-cheat-sheets>
- 資料原件：`data/resources/aiposthub-awesome-opensource-ai-cheat-sheets-guide.json`
- 類型：Resource（文章＋原始學習專案）。不把十份速查表虛構為已部署 Workflow；保留各份內容路徑與已核對上游 Commit。
- 可延伸輸出：設計決策、System Contract、Evals、Threat Model、Release Gates。未直接對任何真實系統實施測試。

### 2. tip31812/ai-usage-bar

- 原始 Repo：<https://github.com/tip31812/ai-usage-bar>
- 資料原件：`data/resources/tip31812-ai-usage-bar.json`
- 類型：Resource（可編譯的 macOS Swift／SwiftUI 專案），附上版本與檔案地圖、擴充方案、建置／驗收方式。
- 安裝需 macOS 14+ 與 Xcode CLT；讀取本機 OAuth 登入／對話紀錄檔尾，透過非公開用量端點；非官方、ad-hoc 簽章、非 Notarized。新增功能必須先查證資料來源及權限。**本次不執行安裝、下載、憑證讀取、Hooks 設定或真實用量呼叫。**

## 建議後續改善順序

**P5a — 收藏可靠性**：網址去重（canonical URL＋Repo 別名）、來源快照版本、資料完整度分級、可以回讀最初來源、全部收藏資料筆數與六型一致性保護。這一項最優先。

**P5b — URL → Knowledge Extraction（尚未實作）**：使用者貼入 URL 後，以類型判斷選擇適合的擷取方式；擷取 README／LICENSE／關鍵文件或文章正文，標示可驗證事實與推論；避免一律產生多個空泛 Concept。

**P5c — Implementation Readiness（尚未實作）**：可從已存的 GitHub Repo 進入安裝、客製化、重做三種入口。每一個 Plan 都含版本、執行環境、可修改檔案、依賴、資料／權限風險、實際測試與未驗證事項。

**P5d — Learning／Problem／Flow 維護（既有＋迭代）**：從完整收藏關聯到可閱讀的實作教材。只有真實驗證依據時才能聲稱某組工具在資料輸出／輸入層相容。

**P5e — 安全交付（尚未實作）**：執行環境與 GitHub 寫入權限獨立管理，所有外部安裝、憑證、正式環境與不可逆操作先取得使用者核准，並完成 Show-Me／Regression／Cold Review。

## 驗收標準

1. 原先 546 筆正式 Entity 不被修改或刪減；新增兩筆後應有 548 筆，Resources 從 268 變成 270，其餘五類數量不變。
2. 全部收藏從導覽可直接到達，看到所有六種型別；能用兩個 ID 或標題搜尋到新增資源。
3. 原始文章 URL、兩個 GitHub Repo 路徑及各自版本都可從 JSON 回讀。
4. `node scripts/build-v2.mjs` 後 `node scripts/validate-v2.mjs` PASS；Graph 與 Source 同步且沒有 dangling references。
5. `node scripts/test-knowledge-browser.mjs` 驗證新入口、原先學習與 Playground 流程仍正常。
6. 正式 GitHub Pages 部署後再獨立確認兩筆新 Resource 已出現在產生的 Catalog；不可拿 PR 綠燈取代 Live 驗證。
