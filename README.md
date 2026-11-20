# AI Tool Collection V2

> **AI 工具、Skills、Concepts、Prompts、Combinations、Workflows 的可追溯知識庫。**
>
> 本 README 保存長期架構；**Phase 2 Resources 的最新工作進度與接手步驟**以 [Session Handoff](docs/RESOURCE_CONTENT_HANDOFF.md) 為準。新的 ChatGPT／Claude／Codex Session 應先讀取該交接檔、AGENTS.md 與現行 Schema，並核對 GitHub main 最新狀態，不可只依賴前一段聊天的記憶。

- **網站：** https://christinekao.github.io/AI-Tool-Collection/
- **GitHub：** https://github.com/christinekao/AI-Tool-Collection
- **主要分支：** `main`
- **介面：** `index.html`（GitHub Pages 靜態網站）
- **主要任務：** 接收使用者提供的工具名稱、GitHub 連結、官網、文章、截圖或 Prompt，依既有格式核實、分類、去重、收錄並發布

## 長期知識層次與萃取原則（2026-11-19）

工具更新速度快，因此收藏原始 Resource／Skill／Prompt 後，應優先萃取跨工具有效的 Concept、辨識可重用 Workflow，再按 Input／Output／Gate 和證據選擇目前可用的實作工具。**Problem → Concept → Workflow → Implementation Options** 是主要理解路徑，不是要求每篇來源都產生四筆資料。

Combination 保留為六種 V2 Entity 之一，但改採**有獨立重用價值才建立**；原有資料不因分類改版自動合併、刪除或更名。完整使用邊界與驗收詳見 [Knowledge Layers Policy](docs/KNOWLEDGE_LAYERS_POLICY.md)。首輪 548 筆的領域註記已寫入每筆 V2 Canonical 的可選 `classification`，保留原始 `category`／`tags` 與六種 Entity；詳見 [全庫分類報告](docs/CLASSIFICATION_ROLLOUT_20261119.md) 與 [主題、來源形式、能力分類架構](docs/CLASSIFICATION_ARCHITECTURE_V2.md)。分類目前均為候選，需複核項目不代表已驗證。

## 核心理念｜Problem-Centric Knowledge Graph（以問題為核心的知識關聯圖）

因為 AI 工具更新太快，真正值得長期保存的不是工具本身，而是：

- **Problem**：當初要解決什麼問題？
- **Concept**：背後有哪些長期有效的原理？
- **Solution**：有哪些解決方式與取捨？
- **Resource / Skill**：目前有哪些工具可以實現？
- **Workflow / Prompt**：實際如何完成任務？
- **Combination**：不同工具如何互補或替換？

**Problems are durable. Concepts explain. Workflows operationalize. Tools implement.**

### 設計原則

1. **從問題出發，而不是從工具名稱出發。** 對每個新工具先分析它解決的問題、使用條件、實際能力與限制，再決定要連結哪些 Concept、Workflow、Skill、Prompt 或 Combination。
2. **問題與方法長久保留，工具可以替換。** 工具停更、改版、收費或被取代時，更新其狀態、替代方案與相關關聯，不抹除仍有價值的 Concept／Workflow。
3. **採多對多、可追溯的知識關聯。** 同一個 Problem 可以有多種解法；同一 Resource 可以參與多個 Workflow 或 Combination。關聯必須有實際依據，不能只憑標題、Tag 或關鍵字相似。
4. **避免重複維護資料。** 一筆 Resource／Concept／Skill／Prompt／Combination／Workflow 只維護一個 V2 Canonical JSON；其他實體透過 Typed Reference 指向它。
5. **從需求探索到實作。** 網站應協助使用者由「我想做什麼？」找到可用工具、相關 Concept、學習資源、完整 Workflow、可複用 Prompt 及不同解法的取捨。

**架構現況：** 正式 V2 Entity 仍只有六種；此外有獨立但不屬於 V2 Entity 的人工策展 Problem Layer，以及由原始資料產生的 Knowledge Graph 投影。

**P0 已完成（2026-11-12）：** 已通過舊資料一致性稽核並退役根目錄的 V1 資料與過時遷移流程。原始檔保留於 [清理前備份分支](https://github.com/christinekao/AI-Tool-Collection/tree/backup/p0-before-legacy-cleanup-20261112)，詳細證據參見 [P0 Data Audit](docs/P0_DATA_AUDIT.md)。正式 Source of Truth 只有各個 V2 單筆 JSON。

---

### P1｜Problem Layer 與 Knowledge Graph（互動探索 MVP）

- `data/problems/<id>.json`：針對重要問題逐筆策展的可維護資料；**原有五筆影片製作案例已保留，另有跨領域 Problem；它們都不是知識庫的唯一主題**。
- **互動網站：** [跨領域知識探索](https://christinekao.github.io/AI-Tool-Collection/knowledge.html)：預設搜尋全部 Resource、Concept、Skill、Prompt、Combination、Workflow，並可從任一節點查看雙向關聯。人工策展的跨領域 Problem 放在可選的「已整理的 Problem 範例」內。搜尋文字相符不等於已確認問題適配。
- **完整維護與驗證紀錄：** [docs/P1_KNOWLEDGE_GRAPH.md](docs/P1_KNOWLEDGE_GRAPH.md)。
- `scripts/knowledge-graph-core.mjs`：驗證 Problem 與現有六類實體的 Typed References，產生雙向可探索的 Graph 投影。
- `data/knowledge-graph-v1.json`：自動產生的索引，**不可當成新的維護來源**。
- `node scripts/build-v2.mjs`：同時重建 Catalog、Manifest 及 Knowledge Graph。
- `node scripts/validate-v2.mjs`：同步檢查三份輸出與 Canonical Source 是否一致。

**防止誤分類：** Graph 不會把所有文字相近的工具視為替代品；新 Problem 關聯必須說明原因，並指定可追溯的既有欄位。


## P2｜知識詳情優先 × Dynamic Workflow Builder

**目標：** 從「找到收藏」前進到「理解它解決什麼問題、如何使用，以及能否與其他工具組成 Workflow」，不把 Graph 當成唯一的知識呈現方式。

- **閱讀完整知識：** [Knowledge Explorer](https://christinekao.github.io/AI-Tool-Collection/knowledge.html) 會從 V2 Catalog 讀取已存在的 `coreProblem`、`solutionMethods`、`inputs`、`outputs`、`execution`、`features`、`limitations`、Workflow stages，並呈現完整 Prompt 及來源。Graph 移到可展開區塊，避免只有摘要與箭頭。
- **自由組合：** 選擇任意 Resource／Skill 後，利用同 Concept 或同 Workflow 的來源引用尋找可繼續研究的工具，逐步加入、移除、排序；**尚無輸入／輸出契約時一律標示「未驗證」**，不把共同概念誤認為可直接整合。
- **有依賴條件的組合：** `data/workflow-recipes/<id>.json` 是**可逐筆維護的人工策展範本**，定義步驟的 `requires`、`produces`、`optional`、候選工具與來源欄位。組合器會動態重算，選掉必要工具時停止下游步驟，而非直接連箭頭。
- **第一個驗證範例：** `website-build-review.json`（需求 → 可選的設計 → 實作 → QA），只是驗證 Workflow Engine 的一個案例，**不限定網站的主題範圍**。
- **測試：** `node --test scripts/test-workflow-engine.cjs` 檢查依賴、替代候選工具、略過步驟及錯誤資料；`node scripts/test-knowledge-browser.mjs` 檢查真實頁面互動。
- **設計紀錄：** [docs/P2_DYNAMIC_WORKFLOW.md](docs/P2_DYNAMIC_WORKFLOW.md)。

**重要限制：** 這是規劃工具，不會執行、安裝或自動串接候選 Tool。即使內部條件判斷為「結構可接續」，也**不代表實際 API、檔案格式、權限或輸出品質已驗證**。

### P3｜獨立 Workflow Playground 與跨領域 Problem 策展（2026-11-17）

> 本階段開發於 feature branch，合併及 GitHub Pages 部署須以實際 CI／PR 核准為準。

- **[Knowledge Explorer](knowledge.html)：** 閱讀正式原始知識、查看 Graph、選擇已整理的跨領域 Problem。知識詳情不再嵌入編輯器，保留前往 Playground 的節點 Deep Link。
- **[Workflow Playground](playground.html)：** 優先展示 Problem 連結的推薦 Flow，保留原本 36 筆 Workflow 階段可讀性；其中 3 筆有可編輯 Recipe（網站建置、Agent 開發交付、企業知識問答）。自由草稿可新增／移除／排序工具並在目前瀏覽器保存。
- **原始六類維持不變：** 270 Resources／123 Skills／68 Concepts／34 Prompts／36 Workflows／17 Combinations，總共 548 筆 V2 Entity。原五筆 Problem 加 15 筆跨領域 Problem，共 20 筆；Problem 不屬於第七種 V2 Entity。
- **保留證據界線：** Recipe 的 requires／produces 僅驗證規劃依賴；其他 Workflow 不虛構 Stage Tool，相關候選不等於可直接串接。
- **完整盤點、變更邊界、待驗證項目：** [docs/P3_WORKFLOW_PLAYGROUND.md](docs/P3_WORKFLOW_PLAYGROUND.md)。



---

## P4｜以學會方法為目標的閱讀體驗

- **[Learning-first Knowledge Explorer](knowledge.html)**：首頁提供明確的學習入口，而不是只展示資料型態及工具清單；從 Problem 進入「核心原理 → 來源 Concept → 可操作步驟／產物／驗收 → 情境選擇 → 虛構範例 → 實際練習 → 來源與限制」。
- **已有十份完整的跨領域問題教學**，寫在原本 `data/problems/<id>.json` 的可選 `learning` 欄位中；其他十個 Problem 仍能閱讀來源支持的 Concept／Workflow，但會標示為尚未補完整教學。
- **六種 V2 Canonical Entity、Graph 與獨立 Playground 原有資料全部保留**。這個階段是以內容理解和可驗收練習為主的增量改版，不是驗證所有第三方工具的最新能力。
- 文件與測試詳見 [P4 Learning-first 設計及驗收](docs/P4_LEARNING_FIRST.md)。

---

## P5｜全部收藏不變，Knowledge 與 Implementation 逐步加值（2026-11-18）

**不可用新的問題篩選、Workflow 或教學頁面取代「全部收藏」。** 六種 V2 Canonical Entity 與原始使用者 URL 必須可完整回讀；沒有被策展成 Problem 的 Resource 也必須在 `index.html#/browse/all` 顯示。正式資料只能以新增、核對、去重、可追溯修改的方式維護；不得因為介面重整而自動刪除或變更既有 ID。

- **獨立入口：** [全部收藏](index.html#/browse/all)（全部六種型別、搜尋、篩選）和 [主題探索](index.html#/explore)（九個主題）並行。
- **新增來源 1：** [AI 郵報／awesome-opensource-ai-cheat-sheets 導讀](data/resources/aiposthub-awesome-opensource-ai-cheat-sheets-guide.json)；保留原始文章 URL、上游 GitHub Repo、版本、十大速查表的用途與可延伸的工程驗收方法。
- **新增來源 2：** [tip31812/ai-usage-bar](data/resources/tip31812-ai-usage-bar.json)；保留 Repo、Swift／SwiftUI 程式結構、安裝條件、可擴充的 Provider、敏感憑證與非公開用量 API 風險、未執行狀態。
- **Implementation 是方向，不是已部署的功能：** 未來可從收藏進入 Preflight → Spec → Plan → Execute → Verify，但執行需要相應環境、可用工具與授權。
- **完整邊界及驗收：** [P5 Collection Foundation](docs/P5_COLLECTION_FOUNDATION.md)。

---

## P6｜需求導向的知識回答入口（2026-11-18）

- **[依需求查知識](ask.html)**：用自己的話描述要學習、比較、尋找或實作什麼。先跨全部六種 V2 資料及既有 Problem 檢索，再依需求整理已有來源的原理、用途、方法、限制與可執行前的規劃參考。
- **不把收藏庫縮成 20 個 Problem 或 10 篇固定教材**，且不把文字搜尋結果誤認為已經驗證的工具互補關係；結果中的每項事實附可檢視的正式來源。
- **完整收藏永遠獨立**：`index.html#/browse/all` 繼續列出所有 Canonical JSON；此功能不修改任何現有資料。
- **明確能力邊界**：這版是靜態頁面使用的來源支持檢索與欄位組織，**不是** LLM 推理、向量搜尋、第三方即時研究或有權限執行器。當收藏不足或未記載相容性，直接顯示缺口。
- 介面、搜尋流程、測試與後續真正語意檢索／LLM 後端計畫：[P6 規格](docs/P6_INTENT_AWARE_KNOWLEDGE.md)。

---

## P7｜教學型 Resource 的「學習重點」而非主題清單（2026-11-18）

- **完整教材案例：** [Awesome Open-Source AI Cheat Sheets](data/resources/aiposthub-awesome-opensource-ai-cheat-sheets-guide.json) 提供十篇來源支持的主題。2026-11-18 已以「AI 系統設計」作為品質基準，補完其餘九章的判斷表、三個原則與整合式檢查、案例、練習與可驗收產物。
- **最新版頁面順序：** 「適合什麼情境？ → 主要功能 → 使用條件 → 限制與注意事項 → 十個主題的重點筆記」，再顯示整體練習、來源與相關延伸。避免重複的頂部用途摘要、「學完能掌握什麼？」和「先看哪裡？」。
- **固定寫作與設計規格（往後優先遵守）：** [LEARNING_CONTENT_SPEC.md](docs/LEARNING_CONTENT_SPEC.md)；此文件是教學型 Resource 的 Single Source of Truth。舊版 P7 設計紀錄僅供參照，不覆寫新版順序與去重規則。
- **資料保留：** 其他 Resource 不硬套教學章節；沿用原 ID、Canonical Source、原始章節與版本化連結。
- **設計歷史與驗收：** [P7 Resource Learning Outcomes](docs/P7_RESOURCE_LEARNING_OBJECTIVES.md)。

---

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
| 7 | [scripts/validate-v2.mjs](scripts/validate-v2.mjs) | 只讀驗證 Source／Catalog／Manifest 與 Typed References |
| 8 | [docs/P0_DATA_AUDIT.md](docs/P0_DATA_AUDIT.md) | V1 退役核對、備份分支及資料保留紀錄 |

**唯一維護規則：**以 `data/` 的 Canonical JSON、`SCHEMA_V2.md`、`data/schema-v2.json` 與 `scripts/build-v2.mjs` 為準。舊版直接寫入根目錄 `*.json`、把 Workflow 嵌入 Combination 的流程均已退役。歷史內容可從備份分支查閱。

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

## 所有 AI 協作者共用的收錄與驗收政策（2026-11-19）

原始 5,407 個 Tag 使用次數／2,431 個不同 Tag 與 82 種舊 Category 已建立可回溯的 [標準化規則](docs/TAG_STANDARDIZATION_V1.md)；標準 Domain 已覆蓋全部 548 筆，`data/tag-index-v1.json` 會從未修改的原始 Tags 自動生成受控維度與待覆核清單。Tag 只作為原始線索，不能自動當成已驗證能力、授權或測試結果；新增 Tag 必須接受共用 Intake Gate 審查，僅刪減或替換為相同受控 ID 的別名可免重審。

不論使用 ChatGPT、Claude、Codex 或其他 Agent，新增／實質修改 Canonical 記錄都必須先遵守 [Unified Intake Policy](docs/UNIFIED_INTAKE_POLICY.md) 與根目錄 [AGENTS.md](AGENTS.md)。同一套來源查核、去重、Domain／Format／Capability、Concept 審查及 CI Release Gate；Resource／Skill／Prompt 依適用的專門閱讀規格，**不是每筆硬套四套**。新增或實質改寫資料須保存 `intakeReview`，GitHub Actions [Unified Intake Gate](.github/workflows/unified-intake-gate.yml) 會執行檢查。無來源時使用 Pending Sources，不虛構資料。

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

### 無法讀取內容的來源：Pending Sources

若使用者要求先「存」某個來源，但 X 貼文、文章或影片內容無法可靠存取，先存入 `data/pending-sources/<source-id>.json`，**不要根據網址虛構功能、標籤或 Graph 關聯**。

- Pending Sources 是**待查證來源收件匣**，不是 V2 的第七種正式實體；不會自動進入 `catalog-v2.json` 或網站卡片。
- 一個來源一個 JSON，保留原始來源網址、收藏日期與查證狀態；核實後去重，再決定是否建立或更新正式 V2 Entity。
- 確認正式收錄之後，可在 Pending 項目保留對應 Canonical Entity ID 供追蹤，避免重新匯入和資訊遺失。

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

`scripts/validate-v2.mjs` 是獨立、只讀的完整性驗證工具，不再依賴歷史 Migration Report。`build-v2.mjs` 負責從單筆資料重建索引；兩者用途不同。GitHub Actions 會對正式 V2 資料自動執行檢查。

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

### 精簡版：新 Session 直接複製

以下是使用者確認的**快速接續 Prompt**。只需貼這段，新 Session 就能依本 README 的詳細規格開始收錄：

```text
請繼續維護我的 AI Tool Collection V2：

https://github.com/christinekao/AI-Tool-Collection

請先閱讀 Repository 根目錄的 README.md，並依照其中的「新 Session 啟動 Prompt」及現行 Schema V2 規則繼續工作。

這個 Session **只負責收錄新工具、GitHub Repo、Skills、Prompts、Concepts 與 Workflows**。

之後我會直接貼名稱、網址、文章或截圖。請自行研究、查重、分類、更新 Canonical JSON，並驗證 GitHub Actions 與 Pages 部署。

不要修改網站 UI、安裝或實測外部工具，也不要重複建立既有資料。

請從 GitHub 最新狀態接續，不要假設前次對話的收錄數量或部署版本仍然有效。
```

### 完整版：包含詳細檢查項目

以下文字是詳細版，也可以直接貼到新的 ChatGPT、Claude、Codex 對話：

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

**最後核對日期：2026-11-17（Asia/Taipei）**。此文件描述的是當時核實的 Repo 結構，未來若 Schema 或 Actions 改變，應以最新程式碼與 Schema 為準更新 README。

