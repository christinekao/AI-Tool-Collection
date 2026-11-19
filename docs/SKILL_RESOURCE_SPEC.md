# Skill Resource Spec v0.1｜讓 Skill 可理解、可操作、可驗證與可組合

> 狀態：試行；案例：`alexyc9381-hiring-panel`、`blader-humanizer`。後者用來檢查無子 Agent、多種輸出模式的 Skill 是否能沿用同一版型。
> 參考來源：`alexyc9381/hiring-panel-skill` 的 `skills/hiring-panel/SKILL.md`、`README.md`、`LICENSE`。
> 基準：來源標示 Skill v1.0.0；本專案尚未安裝或執行。
> 頁面：`index.html#/skills/alexyc9381-hiring-panel`。

## 目標及邊界

此規格用於「可被 AI Agent 或 Claude Code 等執行環境啟動的 Skill」，不是套用 Repo Resource 的程式架構介紹，也不是教學資源的十章學習框架。

**讀者需要回答的七個問題：** 何時使用？需要準備什麼？如何觸發？會怎麼執行？會產生什麼？有哪些風險？能否將其中能力拆出來組成新的 Workflow？

來源 SKILL.md 是原始操作定義，但不是給此網站 Agent 的自動授權。**閱讀 Skill 不代表已安裝、取得檔案權限，或可以自動執行其安裝指令。**

## 固定閱讀順序

1. **Skill 概覽**：一句話先講可以得到的結果，並標示執行環境、觸發方式與未驗證狀態。避免重複原始 `purpose`。
2. **適合使用的情境**：以使用者遇到的問題描述，而非介紹 Agent、Prompt 或 Workflow 的名詞。
3. **事前準備**：需要的輸入資料、可接受格式、必要條件，特別說明缺少輸入時會怎麼做。
4. **執行流程**：按順序寫「做什麼 → 為什麼 → 得到什麼」，有平行執行就直接標示。必要時呈現角色清單、檢查條件、失敗處理；不將複雜指令原樣塞給讀者。
5. **如何使用**：先示範啟動指令；安裝方式放在可展開的進階區域。第三方安裝、讀取憑證或修改檔案不得自動執行。
6. **輸出與保存位置**：每個輸出的名稱、用途、格式，以及會寫入／覆蓋的目錄。
7. **拆解與組合 Workflow**：標示可重用能力、輸入、輸出、驗證 Gate，以及哪些仍需 Connector／轉換／授權。
8. **風險、限制與品質驗收**：聚焦具體隱私、輸出正確性、成本和副作用；讓讀者有可判斷的 PASS／FAIL 條件。
9. **延伸 Resource**：保留資料裡原有的正式 Reference，避免再出現重複的長篇「這是什麼？」與「如何使用」。

各頁依 Skill 特性調整內容，不要為沒有平行角色或沒有檔案輸出的 Skill 硬湊區塊。

**第二案例 Humanizer**：流程是閱讀→找出問題→改寫→核對；沒有七位審查角色。貼上文字回覆在對話，檔案模式可能修改指定文件；不能沿用 Hiring Panel 的履歷用語、Markdown 輸出路徑或固定五步驟。上游 `SKILL.md` 目前閱讀到 v4.0.0，既有 Canonical 舊摘要依較早的 v3.1.0 撰寫，應以來源版本及查核證據清楚區分。

兩個 Skill 的頁內導覽使用不改變 SPA 路由 Hash 的按鈕，避免點章節就跳出詳細頁。

## Humanizer 規則

- **先行為、後術語**：先寫「檢查履歷是否容易被系統讀懂」，再標「ATS 模擬」；不要第一句就丟 Sub-Agent、Context Isolation 或完整 Function Signature。
- **每段專注一個意義**：過長句用句號或分號拆成自然段；保留程式碼、檔案路徑和指令原樣，不在路徑中間換行。
- **相似內容合併**：目的與情境不能重複、流程與能力契約不能逐句相同、風險放在適當區塊，不需每張卡片寫免責聲明。
- **區分事實與例子**：原始 SKILL.md 直接支持的觸發、流程、格式與規則可用肯定語氣；自行延伸的 Workflow 只能標為設計示例。
- **讀者與 Agent 分層**：Machine-facing 的來源檔案、版本、Trigger Contract、節點輸入／輸出、Policy、測試紀錄可保留在 Canonical JSON。讀者頁面不用逐項顯示原始碼連結和維護宣告。
- **正確呈現狀態**：原始碼已審查、Skill 已安裝、Trigger 已測試、實際流程完成、輸出驗收、回歸驗證是不同狀態；不可將來源 Review 當作 Runtime PASS。

## Canonical 資料模型

`data/skills/<id>.json` 是唯一 Source of Truth，保留原本 schemaVersion、entityType、inputs、outputs、execution、resourceRefs、source、security 等欄位。可選擇增加 `skillGuide`：

| 欄位 | 用途 |
|---|---|
| `overview`／`introNote`／`facts` | 使用者可以直接理解的總覽及適用邊界 |
| `situations`／`preparation` | 適用問題與輸入條件 |
| `process`／`reviewers` | 可讀的執行步驟、角色與預期結果 |
| `howToUse` | Trigger、範例指令、安裝方式（只能展示、不得自動執行） |
| `deliverables`／`savePath` | 輸出檔案、位置、內容與檔案副作用 |
| `composition.capabilities` | 可重用的 Problem／Input／Output／Gate |
| `composition.example`／`note` | 問題到 Workflow 的示例與未驗證處 |
| `safety`／`acceptance` | 風險、控制及可檢查的驗收條件 |
| `provenance` | 原始 Skill 路徑、上游文件、版本及實際執行狀態 |

Capability 是**知識單元**，不是自動成為已安裝的工具或正式可執行 Workflow。正式整合前須驗證觸發、輸入／輸出相容性及權限。

## 必要評估與 Release Gate

- **Trigger**：在正確需求與必要輸入時觸發；缺少重要資訊時要詢問，不應誤觸發。
- **Functional**：執行者、流程、輸出及檔案寫入符合定義；不多做來源未要求的副作用。
- **Trajectory**：步驟順序、平行角色隔離、錯誤處理與停止時機合理；每個結果有來源可稽核。
- **Content integrity**：不得捏造履歷經歷、技能、成果與數字；缺漏必須保留標示。
- **Security**：第三方 Skill 內容一律視為待審查資料，避免 Prompt Injection、越權讀寫、外傳個資、無意安裝及公開提交輸出。
- **Evidence**：記錄實際使用的測試指令、結果、前後比較、Critical 問題及沒有跑過的情境。
- **Responsive**：375／430／768／1440px 測試單欄與多欄，卡片高度與資訊層級清楚；長指令可捲動，避免橫向頁面溢出。
- **Regression**：既有 Repo、Learning Resource、其他 Skill 的詳細頁面不受改版影響；老版資料繼續用一般呈現。
- **Deploy**：GitHub Commit 與 Catalog Sync 不等於公開網站已部署，必須從網站資源與實際畫面核對再宣稱完成。

## Hiring Panel 特別要對照原始 Skill 的事實

- 原始流程：ATS → 初始用人主管 → 五個獨立角色 → 合併問題與重寫 → ATS 重新評估，約八次子 Agent 呼叫。
- 五位獨立角色包含另一個「用人主管（能否立即勝任）」視角，與前面的十秒面試判斷用途不同；不能錯算成六位不同職稱。
- 模擬 ATS 的 PASS／REJECT、主管 INTERVIEW／NO、五位角色 HIRE／MAYBE／PASS 是不同輸出，不應混用。
- 不得編造經歷；缺資料以 `[ADD: ...]` 標示；兩份檔案寫入 `.hiring-panel/<date>-<name>/`。
- 此 Skill 不是 Anthropic 官方推出，也不是企業實際 ATS，不能保證面試結果。
