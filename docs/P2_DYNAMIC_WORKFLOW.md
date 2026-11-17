# P2｜知識優先與動態 Workflow 組合器

> 狀態：開發驗收中（2026-11-17） · 正式分支：`main`

## 目的與原有問題

使用者從「網站」搜尋進入一則旅遊網站 Prompt 時，原版頁面只呈現精簡摘要及三條 Concept 引用。這樣的 Graph 能表示存在關係，卻無法直接學習：完整指令、輸入、預期產物、方法、風險和操作順序都被藏在另一個頁面。

**新設計將資料從「關聯可視化」提升至「閱讀 → 選擇 → 規劃 → 驗證」。** 不再預設所有問題都來自影片或網站主題。

## 互動需求與實作方式

| 使用者動作 | 新版行為 |
|---|---|
| 點擊 Resource、Skill、Concept、Prompt、Workflow、Combination | 優先從原始 V2 Catalog 顯示對應的問題、方法、步驟、限制與來源 |
| 點擊 Prompt | 顯示完整已收錄 Prompt、輸入、預期輸出，提供複製功能 |
| 點擊 Concept | 顯示核心問題、解決方法、取捨、反模式及案例（依實際資料） |
| 點擊 Workflow | 顯示現有階段順序、使用工具、產出與驗收條件 |
| 選擇工具 A | 旁邊顯示有證據的候選工具（同 Concept 或同 Workflow）；「相關」不等於可串接 |
| 加入 B、C、D，移除 C | 自由組合即時移除／重排，保持「未驗證相容性」狀態 |
| 載入有條件的流程範本 | 依步驟輸入、輸出與依賴關係重算，缺必要工具時顯示阻塞和缺失 |
| 換掉某階段工具 | 使用相同階段其他已收錄候選 Tool，重新計算下游狀態，不自動執行 |
| 想深入查看關係 | 可展開原 Knowledge Graph，點擊節點開啟其完整知識與組合器 |

## 架構與資料所有權

- `data/{resources,skills,concepts,prompts,combinations,workflows}/<id>.json`：唯一正式 V2 Knowledge Source。
- `data/catalog-v2.json`：自動生成的聚合檔。Knowledge Explorer 只讀它的完整原始欄位，**不在 Graph 副本填寫另一份正文**。
- `data/knowledge-graph-v1.json`：自動生成的可追溯索引，用來探索已存在的引用。
- `data/workflow-recipes/<id>.json`：人工整理的可選 Workflow 範本（每範本一個小檔），可重複使用已有 Tool／Skill ID，避免維護另一份工具說明。
- `workflow-engine.js`：無外部套件的純函數 Composer，支援 Node 單元測試與瀏覽器互動。
- `knowledge-app.js`、`knowledge.html`、`knowledge-style.css`：知識閱讀與組合編輯器。

### Recipe 欄位規則

```json
{
  "id": "website-build-review",
  "schemaVersion": 1,
  "sourceWorkflowRef": {"type": "workflow", "id": "dual-agent-website-handoff-and-verification"},
  "stages": [{
    "id": "build",
    "title": "實作網站及可執行程式碼",
    "optional": false,
    "requires": ["scoped-brief"],
    "produces": ["website-code"],
    "candidates": [
      {
        "type": "resource",
        "id": "minimax-code",
        "evidenceField": "purpose",
        "why": "現有 Resource 描述支援網站原型與程式碼建置。"
      }
    ]
  }]
}
```

- `requires`：必須由之前**未被省略或阻塞**的階段產生的契約名稱。
- `produces`：該階段在規劃上預期產生的名稱；**不是經實測的實際輸出**。
- `optional`：只有明確可跳過的階段才設為 `true`。
- `candidates`：同一階段適用的候選實體，每筆需要既有 V2 目標、可核實的欄位與理由。
- `sourceWorkflowRef`：已收錄方法的出處，不代表完整 Recipe 每一步都是原文逐字摘錄；新補的 Skill 與階段都要有各自證據。

### 狀態定義

| 狀態 | 意義 |
|---|---|
| `planned` | 選用工具且已滿足本範本的上游契約（**僅規劃層面**） |
| `skipped` | 明確略過允許略過的階段 |
| `missing` | 必要階段沒有選擇工具 |
| `blocked` | 上游必要產物缺失，不可跳過下游仍宣稱可用 |
| `unknown` | 自由組合不具備輸入／輸出合約，無法認定可直接接續 |

範本的 `structurallyPlanned` 與實際 `verified` 是兩種不同結果。**目前沒有工具執行或驗證連接能力，故 `verified=false`**。

## 驗證與後續擴充

```bash
node --test scripts/test-workflow-engine.cjs
node scripts/test-knowledge-browser.mjs
node scripts/validate-v2.mjs
```

所有資源都能建立自由草稿；只有人工整理過依賴合約的範本才能標示「結構可接續」。網站建置只作為第一個驗證範例，其他領域應根據真實需求和資料證據逐筆建立，不要因為某工具和另一工具共用標籤就憑空生成連線。

**未完成事項：** 自動推導 API／檔案格式是否真實相容、跨工具驗證執行、流程保存至 GitHub、工具版本與價格即時查核、全域 Capability Ontology 與替代關係的定期查證。這些不能以畫出箭頭代替。
