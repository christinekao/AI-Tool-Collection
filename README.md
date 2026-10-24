# AI Tool Collection V2

> **AI 工具、Skills、Concepts、Prompts、Combinations、Workflows 的可追溯知識庫。**
>
> 這份 README 同時是 **跨 ChatGPT／Claude／Codex Session 的工作交接文件**。新的 AI 助理必須先閱讀本文件及現行 Schema，再繼續收錄，不能只依賴前一段聊天的記憶。

- **網站：** https://christinekao.github.io/AI-Tool-Collection/
- **GitHub：** https://github.com/christinekao/AI-Tool-Collection
- **主要分支：** `main`
- **介面：** `index.html`（GitHub Pages 靜態網站）
- **主要任務：** 接收使用者提供的工具名稱、GitHub 連結、官網、文章、截圖或 Prompt，依既有格式核實、分類、去重、收錄並發布

## 1. 最重要的工作範圍

**此專案的日常工作只有「維護 AI 工具與方法知識庫」。**

可以進行：

1. 查證使用者提供的來源、維護狀態、授權、功能、價格及安全/資料出站限制。
2. 與現有資料去重，更新舊項目或新增真正獨立的實體。
3. 按 Schema V2 編寫單筆 JSON，建立適當的既有 Concept 關聯。
4. 依實際素材保留可複用的 Skill、Prompt、Combination 或 Workflow；不是每次都全部新增。
5. 驗證 JSON、Reference、GitHub Actions Catalog Sync 及 GitHub Pages 部署。
6. 簡短回報「收錄了什麼、資料連結、數量變化、Commit、部署狀態及尚未驗證的部分」。

**除非使用者另有明確要求，不要：**

- 安裝或執行收錄的外部工具、Skill、腳本、Agent、模型或交易策略。
- 建立帳號、提供 API Key、連接私人系統或執行付費 API。
- 修改網站 UI、CSS、`index.html`、架構、Schema 或自動化流程。
- 大量重構、清理或刪除既有資料。
- 把開源 Repo 的作者宣稱、社群貼文、測試範例誤說成已經實測成功。
- 只因為某篇文章提到多種用途，就製造無關的 Concept／Skill／Workflow。

使用者可能只貼 **一個名字或網址**；在可判定時自行查證和收錄，不必要求使用者重複介紹。

## 2. 新 Session 應先讀哪些檔案

**以現行 V2 原始檔及執行中的程式碼為準，不靠舊聊天中的筆數猜測。**

| 優先順序 | 檔案 | 作用 |
|---|---|---|
| 1 | [README.md](README.md) | 任務範圍與跨 Session 工作方式 |
| 2 | [SCHEMA_V2.md](SCHEMA_V2.md) | 六種 Entity、欄位、Typed References 與分離規則 |
| 3 | [data/schema-v2.json](data/schema-v2.json) | 機器可讀的 V2 類型與必備欄位 |
| 4 | [data/](data/) | **唯一 V2 Canonical Source**：一筆實體一個 JSON |
| 5 | [scripts/build-v2.mjs](scripts/build-v2.mjs) | 驗證單筆原始檔並產生 Catalog／Manifest |
| 6 | [.github/workflows/v2-catalog-sync.yml](.github/workflows/v2-catalog-sync.yml) | `main` 分支更新原始檔時的自動同步 |
| 7 | [COLLECTION_WORKFLOW.md](COLLECTION_WORKFLOW.md) | 長期整理理念與早期收錄原則；有部分 **Legacy V1 描述** |

**規則衝突時：**以當前 `data/` Canonical Entity、`SCHEMA_V2.md`、`data/schema-v2.json`、`scripts/build-v2.mjs` 的現行實作為準。尤其 `COLLECTION_WORKFLOW.md` 仍提過「Workflow 嵌在 Combination」及直接修改舊版 `*.json`：**這是舊版設計，現在 Workflow 已是 V2 獨立實體。**

## 3. V2 資料結構與分類

每筆資料是一個 UTF-8 JSON，檔案路徑和 `id` 一致：

```text
data/
├── resources/<id>.json      # Resource：具體工具、Repo、產品、模型、API、服務
├── skills/<id>.json         # Skill：可獨立辨識且可重用的 Agent 能力／執行規程
├── concepts/<id>.json       # Concept：跨工具仍成立的問題／解決模式
├── prompts/<id>.json        # Prompt：可獨立複用的指令或模板
├── combinations/<id>.json   # Combination：哪些工具／能力可以互補
├── workflows/<id>.json      # Workflow：有目標、策略和執行順序的流程
├── catalog-v2.json          # 自動建置的完整網站資料，非手動 Source of Truth
└── manifest-v2.json         # 自動建置的 Entity ID 索引，非手動 Source of Truth
```

必要共同欄位：

```json
{
  "schemaVersion": 2,
  "id": "stable-kebab-case-id",
  "entityType": "resource",
  "title": "Readable title",
  "status": "active",
  "addedAt": "YYYY-MM-DD",
  "updatedAt": "YYYY-MM-DD",
  "tags": []
}
```

`entityType` 只能是 `resource`、`skill`、`concept`、`prompt`、`combination`、`workflow`。複製最接近的現有 JSON 作為樣板，**保留原有 ID 和既有關聯，不任意更名**。

關聯使用 Typed Reference，不複製另一筆完整資料：

```json
{
  "conceptRefs": [
    { "type": "concept", "id": "quality-gates-verification" }
  ]
}
```

引用的 ID 必須真實存在；`workflow.stages[].uses` 等內部引用也要檢查。

### 如何決定新增什麼

| 輸入 | 預設處理 |
|---|---|
| 一個 GitHub Repo、官網或工具名稱 | **Resource**，除非它已收錄 |
| 有獨立的 `SKILL.md`、可呼叫 Skill 或具體可重用執行規範 | 評估另建 **Skill**，並以 `resourceRefs` 關聯 |
| 一段可以直接交給 AI 執行的 Prompt | **Prompt**；盡量保留原始指令內容 |
| 分步執行、具有清楚 Goal／Stages／驗收條件的方法 | 評估另建 **Workflow** |
| 多個能力彼此互補，但沒有固定執行順序 | 視需要建立／更新 **Combination** |
| 跨多個工具都適用、具有獨立價值的問題／解決模式 | 先找既有 **Concept**，只有真正缺乏合適模式才新增 |

**重點：**一篇文章可以同時產出不同實體，但不是一篇文章必然有六筆實體。`Resource ≠ Skill`、`Combination ≠ Workflow`、`Prompt ≠ Skill`。

## 4. 每次收錄的標準作業程序（SOP）

1. **Read current state** — 重新讀取 `main` 的 Catalog/原始資料與最新 Actions；不要沿用前次回答的筆數。
2. **Source research** — 優先官方網站、原始 GitHub README／LICENSE／SKILL.md、官方文件、Pricing、Security。查清楚來源與版本日期。無法核實的部分標記 `unreviewed` 或清楚註明，而非補猜測 URL。
3. **Dedupe** — 依 `id`、標準化名稱、`canonicalName`、`repo`、`url` 及實際產品身分查詢。已有相同項目就更新原檔，不另建重複 Resource。Repo 包含多個實際獨立工具時才評估分開收錄。
4. **Classify** — 判斷 Resource／Skill／Prompt／Workflow／Combination／Concept 是否真的各具獨立價值。
5. **Concept mapping** — 優先重用既有 Concept IDs；避免一個工具創一個概念。查核各種 Typed References 有效。
6. **Write canonical JSON** — 新增或更新 `data/<type>/<id>.json`。保留原始 `addedAt`，更新既有項目的 `updatedAt`；不要破壞既有欄位、Tags、Refs。
7. **Validate and publish** — 確認 Script 的實際 Schema、ID/檔名一致、無重複或 dangling refs；推送後追蹤 Catalog Sync 和 GitHub Pages，取得成功結果才宣稱部署完成。
8. **Report** — 只回報實際完成的步驟和證據。

### 研究與風險註記

- 功能：區分「官網聲明」、「程式碼可見」、「已人工實測」，不可混淆。
- 授權：核對 `LICENSE`，注意有些 Repo 為非商用或 Source-Available，不可一律當 MIT 或可商用。
- 安全：描述安裝後可讀取的檔案、執行命令、外部網路、API Key、資料出站、個資與可寫入權限。
- 價格：價格/方案屬時效資訊，寫明查核時間；未核實不要編造。
- AI／投資／回測：模型結果、社群獲利截圖和 README 自稱的績效不構成已驗證證據。
- 本 Session **只收錄**，不為了評估工具去實際運行陌生程式碼。

### Prompt、圖片與社群貼文

- 有**完整原始 Prompt** 時，`prompt` 欄位應保存原文（可做必要字元清理，但不可悄悄改寫）。
- 補充的使用說明、限制、Source Summary 應放在獨立欄位。
- 若截圖只露出部分句子，可另整理一份可重用模板，但必須註明「改寫／整理範本，非逐字原文」。
- 社群作者的推廣、LINE 招募碼、未經確認的收入或投資報酬，不當作功能規格或安全保證。
- 對使用者已貼出的圖片／文字先直接分析；沒有必要就不索取重複資料。

## 5. 發布與 GitHub Actions：最容易出錯的地方

**V2 單筆 `data/{resources,skills,concepts,prompts,combinations,workflows}/` JSON 才是 Source of Truth。**

`scripts/build-v2.mjs` 會依各資料夾內檔名排序讀取 JSON，檢查共同欄位、`id`／檔名／`entityType`／`schemaVersion` 一致性及 Typed References，然後產生：

- `data/catalog-v2.json`
- `data/manifest-v2.json`

`main` 的 **V2 Catalog Sync** GitHub Action 監聽這些 V2 原始資料夾，採 Node 22 執行 `node scripts/build-v2.mjs`，成功後視變更由 `github-actions[bot]` 自動 Commit 這兩份索引。

**日常收錄不要直接手動修改 Catalog／Manifest 作為唯一變更。** 即使當下網站顯示新資料，也可能被下一次自動 Build 依單筆原始檔覆寫。若需要手動同步，應以原始檔為準重新 Build。

在可執行 Node.js 的工作環境：

```bash
node scripts/build-v2.mjs
node scripts/validate-v2.mjs
git diff -- data/catalog-v2.json data/manifest-v2.json
```

`scripts/validate-v2.mjs` 是額外檢查；注意歷史 Migration 報告及相關 Legacy 規則，不要把它當成全面取代 `build-v2.mjs`。

每次 Push 後：

1. 檢查 **V2 Catalog Sync** Job 為 `completed / success`；失敗要查 Logs，不可標 PASS。
2. 注意同步 Bot 可能新增一個 **比你的收錄 Commit 更新的 Commit**；再次讀 `main` HEAD，不要把舊 SHA 當成目前部署版本。
3. 檢查最新 **pages build and deployment** Job 的 `head_sha`、`status`、`conclusion`，直到能證實對應最新版本成功。舊版成功不代表新版部署成功。
4. 若某次 Pages Run 被 `cancelled`，可能是因為 Bot 新同步 Commit 觸發後續部署；要看較新的 Run，不要單憑取消判定整體失敗。
5. **GitHub Actions 成功 ≠ 公開網站 HTTP 與資料完全驗證**；若未直接驗證網頁回應，請分別說明。

README 文件變更不屬於 V2 Catalog Sync 的原始資料路徑；**只改 README 不應觸發資料數量變更或額外建立 JSON**。

## 6. 每次回報格式

使用繁體中文，避免沒有證據的「部署完成」宣稱。建議依序簡短回報：

```text
AI Tool Collection V2｜收錄結果
項目：<Name>
類型：Resource / Skill / Prompt / Workflow / ...
重複檢查：新收錄 / 已更新 / 已存在（無需變更）
資料變更：Resources X→Y、Skills X→Y、Prompts X→Y、Workflows X→Y（僅列有變化者）
驗證：原始資料 / References / Catalog Sync — PASS、FAIL 或未確認
GitHub Pages：完成 / 進行中 / 排隊中 / 失敗 / 未確認
連結：官方來源、收錄 JSON、Commit、GitHub Actions、網站
限制：未安裝、未實測、未修改網站 UI；其他未核實的風險
```

若只完成部分工作，就寫明具體成功、失敗或阻塞點，不要把「預計」、「已觸發」寫成「已成功」。

## 7. 新 Session 啟動 Prompt（複製使用）

以下文字可直接貼到新的 ChatGPT、Claude、Codex 對話：

```text
請接續維護我的 AI Tool Collection V2：

Repository: https://github.com/christinekao/AI-Tool-Collection
Website: https://christinekao.github.io/AI-Tool-Collection/

請先閱讀 Repo 根目錄 README.md、SCHEMA_V2.md、data/schema-v2.json、scripts/build-v2.mjs、.github/workflows/v2-catalog-sync.yml，並讀取 main 最新版本。

這個 Session 只做「收錄新的 AI 工具、GitHub Repo、Skill、Prompt、Concept 或 Workflow」，不安裝、不實測外部工具、不修改網站 UI、不重構專案。

我之後會直接貼網址、工具名稱、文章、截圖或 Prompt。你要：
1. 查核官方來源與授權、功能、成本、安全/隱私限制；
2. 與目前的 V2 Canonical Records 去重；
3. 按實際價值判斷 Entity 類型、建立關聯，必要時更新既有項目；
4. 修改 data/<type>/<id>.json，不要只修改生成的 catalog-v2.json / manifest-v2.json；
5. 驗證 Schema、References、V2 Catalog Sync 和 GitHub Pages；
6. 回報新數量、Source JSON、Commit、Actions、部署狀態及未驗證事項。

不要假設前次聊天的數量、GitHub HEAD 或部署狀態仍是最新。不要自行發明沒有證據的功能、Repo URL 或實測結果。可判斷時直接進行收錄，不必每次詢問我。
```

## 8. 專案持續維護原則

- **保留來源**：官方、社群、推測、未實測分清楚。
- **保留關聯**：Concept 是持久知識，Resource 是當時的具體實作。
- **保留歷史**：既有穩定 ID 不任意修改、合併或刪除。
- **按需擴充**：先重用、再更新，真的有新知識才新增 Entity。
- **維持可重建**：任何 Catalog/Manifest 都應能由 `data/` 原始資料重新 Build 出來。
- **可以交接**：下一個 Agent 應能只靠 Repo 文件與原始資料繼續操作，而不是回來要求使用者重述先前每個決策。

---

**最後核對日期：2026-10-24（Asia/Taipei）**。此文件描述的是當時核實的 Repo 結構，未來若 Schema 或 Actions 改變，應以最新程式碼與 Schema 為準更新 README。

