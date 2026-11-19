# AI Tool Collection｜分類規則 v0.1

> **歷史設計稿／非最新操作規範**：本頁保留 2026-11-19 初步分類設計與統計，當時「尚未上線」及試行欄位的敘述已被後續進度取代。現行唯一受控詞彙來源為 [`data/taxonomy-v1.json`](../data/taxonomy-v1.json)，正式欄位與品質規則請依 [分類架構 v1](CLASSIFICATION_ARCHITECTURE_V2.md)、[Schema V2](../SCHEMA_V2.md)；不可用本文舊草案覆寫已收錄分類。

> 狀態：2026-11-19 已進行 548 筆首輪候選分類並更新網站 Domain 篩選。六種 Entity、Schema V2 必備欄位、ID、關聯、原有 Category／Tags 保留；仍有待複核的規則指派。詳見 [全庫分類報告](CLASSIFICATION_ROLLOUT_20261119.md)。
> 現有六種 Entity、穩定 ID、Typed References、原始 Tags、原始 Category 均保留。
> 本文件只定義分類層級、命名與試行驗收；正式欄位與 UI 須待小樣本審查後決定。

## 1. 現況與要修正的問題

以 GitHub `data/catalog-v2.json` 的 548 筆 Entity 及 `catalog-app.js` 的九個 `TOPICS` 正規表示式進行盤點：

| 指標 | 現況 |
|---|---:|
| Resource／Skill／Concept／Prompt／Combination／Workflow | 270／123／68／34／17／36 |
| 同時符合兩個以上主題 | 498 筆 |
| 同時符合四個以上主題 | 225 筆 |
| 不符合任何主題 | 2 筆 |
| 不同 Category 字串 | 82 種 |
| 不同 Tag 字串 | 2,431 種 |
| 只出現一次的 Tag | 1,670 種 |

以上屬於**現行規則命中次數**，不是人工判定的錯誤數。現行 `matchTopic` 將 title／category／resourceType／tags／purpose／goal／problem 等混合以 Regex 搜尋，容易被 `skill`、`search`、`risk`、`ui` 等泛用詞誤判；某筆收藏的「安全審查」標籤也不代表它的主要領域就是安全。

## 2. 把五件事分開

| 維度 | 回答的問題 | 應如何管理 |
|---|---|---|
| **Entity Type** | 這是什麼知識？ | 保留六種正式資料類型，不新增 Repo 或 Learning 為第七類 |
| **Domain** | 主要解決哪種領域問題？ | **一個 Primary**；必要時 **零到兩個 Secondary** |
| **Format / Purpose** | 是 Repo、文章、教程、範本、產品、參考文件？是否偏學習用途？ | 獨立 Facet，**「學習與教材」退出領域清單** |
| **Capability** | 這筆資料具體能做什麼？ | 有證據的動詞＋Input／Output／Gate；不能只從 Tag 猜 |
| **Metadata** | 技術棧、Host、授權、驗證、風險、安裝狀態？ | 獨立 Facet；保留原始 Tags，不把狀態當領域 |

**Domain 的核心規則是解決的問題，不是採用的技術或執行環境。** 使用 Claude Code 開發的履歷審查 Skill 主要屬於職涯，不因包含 `Skill`／`Claude` 一律歸入 Agent 工程。

## 3. 建議十個頂層 Domain

> 以下為候選詞彙，不會直接覆寫目前九個網站分類。十類是便於探索的上層；需要更細的研究主題時使用子領域與 Capability，不再無限制增加首頁大分類。

| ID | 繁體中文 | 收錄問題／邊界 |
|---|---|---|
| `ai-agent` | AI 系統與 Agent | 模型應用、Agent 架構、工具調用、協作、Context、評估、模型行為 |
| `software` | 程式開發與品質 | 程式設計、除錯、測試、Code Review、Developer Tools、Git、CI |
| `design` | UI／UX 與前端 | 網頁介面、互動設計、元件、設計系統、可用性、前端工程 |
| `data` | 資料、分析與知識 | BI、SQL、資料工程、資料品質、搜尋、RAG、知識系統 |
| `automation` | 自動化與整合 | 流程串接、排程、RPA、系統整合、跨服務資料流 |
| `cloud` | 雲端與基礎設施 | Azure、AWS、部署、運算、儲存、網路、容器、Infra Ops |
| `security` | 安全與治理 | 安全機制、Prompt Injection、憑證、權限、法遵、風險控制 |
| `content` | 內容、媒體與行銷 | 文字編修、內容生成、圖片、影片、社群、SEO、行銷素材 |
| `career` | 職涯、招聘與面試 | 履歷、求職、面試、招募、職涯學習與人才評估 |
| `business` | 商業與金融 | 商業模型、產品營運、投資、金融分析、財務績效、商業決策 |

### 邊界案例

| 收藏／案例 | Primary | Secondary | 形式／其他 Facet |
|---|---|---|---|
| Hiring Panel | career | 無需強制 | Skill；執行環境 Claude Code |
| Humanizer | content | 視內容可不填 | Skill；文字編修 |
| STAR 履歷改寫 | career | 不需要 | Prompt |
| AI Usage Bar | ai-agent | software（可選） | Resource；GitHub Repo；額度監控 |
| AI Cheat Sheets 教學 | ai-agent（依核心課題複核） | 可選 data | Resource；Learning Guide |
| Azure 入門教材 | cloud | 可選 | Resource；Learning Guide |
| IBKR 投資績效分析 | business | data（有實際分析任務時） | Prompt |
| AI 影片自動製作 | content | automation（如確有串接流程） | Resource 或 Workflow，以本體判定 |

以上是**分類政策示例**，尚未逐筆核實或改動現有收藏。

## 4. Format、Tags 與 Capability 的規則

### Format／Purpose 獨立於 Domain

- Resource：`repository`、`application`、`documentation`、`article`、`course`、`reference` 等形式，選最能描述原始物件的值。
- `learning`／`reference`／`implementation` 是閱讀目的，可以與任意 Domain 並存。
- Skill、Prompt、Concept、Combination、Workflow 屬 Entity Type，不應再次當作 Domain。
- 同一 Repo 可連結數個 Skill，但不能把整個 Repo 當成任意一個子 Skill。

### 受控標籤（Controlled Tags）

- 既有 `tags` **不得直接批次刪除或改名**；保留原始資訊及搜尋能力。
- 新增的**標準化標籤層**僅用於明確的技術、方法、輸出及使用情境，例如 `swiftui`、`power-automate`、`resume-review`；先訂別名對照字典，避免 `skills`／`skill`／`agent-skills` 混用。
- `security-review`、`source-verified`、`uninstalled`、`mit` 等為安全／驗證／授權 Metadata，不作為 Domain 或 Capability。
- 避免從全文機械推導數十個標籤；Tags 應能具體幫助搜尋，不能拿來代替來源證據。

### Capability

只在已核對功能時建立有意義的能力描述：**動作／用途、輸入、輸出、前提、限制、來源**。有共同技術或關鍵字，不等於能替代、互補或串成 Workflow。

## 5. 分類決策流程

1. **先辨識 Entity Type**：按 `SCHEMA_V2.md` 的六種類型；保留既有 ID 和引用。
2. **讀用途與真實執行行為**：先看 problem、goal、purpose、輸入與輸出；必要時回查原始文件。Tag 只能幫忙找候選，不能直接決定主題。
3. **選唯一 Primary Domain**：使用者最可能為哪個核心問題尋找這筆資料？其餘交叉領域只能作為有內容證據的 Secondary（最多兩個）。
4. **另填 Format、Host、Tech、驗證與風險 Metadata**：不把學習材料當成 Knowledge Domain，也不把任何 Skill 一律算 AI Agent。
5. **抽取可證明的 Capability**：能否說明輸入與輸出？沒有就標示待補，不假裝可直接執行。
6. **不確定就待審**：允許 `needsReview`，不得為了達成覆蓋率強迫分類；保留判定依據及原始內容。
7. **驗證相鄰分類**：人工檢查 Primary 是否真的能與相近 Domain 區分，避免一項被不必要地放進四、五個大類。

## 6. 建議的資料草案（尚未改 Schema）

可選的單筆分類投影（具體欄位名待試行時決定）：

```json
{
  "classification": {
    "primaryDomain": "career",
    "secondaryDomains": [],
    "format": "skill",
    "purposeFacets": ["implementation"],
    "normalizedTags": ["resume-review", "interview-preparation"],
    "status": "proposed",
    "evidenceFields": ["problem", "purpose", "inputs", "outputs"]
  }
}
```

**注意**：此為欄位設計示意；不可直接宣稱已納入 Schema 或已在網站支援。正式設計應以 `SCHEMA_V2.md`、`data/schema-v2.json` 為 Single Source of Truth，避免規格衝突。

## 7. 導覽與搜尋規則

- 首頁的 Domain 是**領域分類**；Entity Type 是另一組篩選；「找教材」是 Format／Purpose Facet。
- **先依明確分類顯示**；Regex／文字比對僅用於搜尋排名或提出待人工確認的候選，不得自動宣稱確切分類。
- Domain 篩選允許 Primary 或經證實 Secondary 命中，但主要分類應視覺上優先。
- 搜尋仍應涵蓋原文 Tags、標題、用途、來源及舊分類別名，避免改版後找不到舊資料。
- 「全部收藏」始終包含所有六種 Entity；待分類也必須可以在全部收藏中找到。
- Problem、Concept、Combination、Workflow 的正式語意關聯只能由 Typed Reference＋證據確認；不能從同 Domain 自動建立可執行組合。

## 8. 試行與驗收（先做，不批次遷移）

**Phase A：候選規則**

- 先固定十類 Domain 的定義、邊界與別名；排除過度廣泛的分類 Regex。
- 從 548 筆中挑 **30–50 筆**，包含六種 Entity、跨域內容、Resource／Skill 同名、Learning Guide、金融與安全案例。

**Phase B：人工核對與比較**

- 對每筆記錄舊主題命中、新 Primary／Secondary、Format、分類依據、未確認處。
- 至少安排「容易誤判」的回歸集：Humanizer 不因 Skill 變成 Agent；Hiring Panel 主要是 Career；安全審查 Tag 不把所有資源歸 Security；AI Usage Bar 能被找到；IBKR 有 Finance 入口；Code Graph 不能因沒有命中既有主題就遺失。
- 人工標記每個分類的合理性；若經常無法決定 Primary，先修詞彙邊界而不是多加 Secondary。

**Phase C：實作與驗收**

- 經確認才新增 Schema 字段、遷移腳本、正式主題 Filter 與標籤別名；**禁止同時刪除或改名既有記錄**。
- 驗證：548 筆可完整回讀、ID／Typed References 無變更、舊 URL 不失效；新主題分類與樣本人工答案一致。
- 回歸測試：主題探索、全部收藏、搜尋、Resource／Skill／Prompt 詳情頁、Knowledge Graph、Workflow Playground；375／430／768／1440px 視覺及互動檢查。
- 以 Before／After 顯示誤分類改善和分類覆蓋；沒跑過的瀏覽器／部署測試不可標為 PASS。

**Phase D：後續內容收斂**

Resources／Skills／Prompts 批次重寫時，依此規格逐筆補完整分類與能力。Concepts／Combinations／Workflows 的全面語意重整放在後段，但現在發現無來源或錯誤連結就記錄並修正高風險問題；不靠新增空泛 Concept 來填分類空缺。

## 9. Release Gate

- **Scope**：這一輪只保存候選分類規格；不變更任何 Canonical、Schema、Filter、路由或 Catalog。
- **Integrity**：六種類型、所有現有 ID、原始資料、Typed References 均不動。
- **Evidence**：現況統計來自現行 GitHub Catalog／App；候選分類案例只作設計示例，未逐筆人工驗證。
- **Decision Boundary**：大規模遷移、Schema 變更及首頁主題改版，先用試行集驗收後再決定。

## 2026-11-19｜分類誤判回歸（訪談不等於求職面試）

- `mattpocock-grill-me` 曾因 `interview`（需求釐清訪談）被放進 `career`。上游 `skills/productivity/grill-me/SKILL.md` 指向 `grilling` Skill；專案 README 明確指出 `/grill-me` 用於非程式碼需求的釐清。更正為 `ai-agent`；不因 Skill 執行環境自動增加 Software 或 Career Secondary。
- 強制區分 **需求訪談／使用者研究／產品發現** 與 **求職面試／招募／履歷**。孤立 `interview` 不再作為 Career 強訊號；應由實際目的、輸入和輸出判定。
- `scripts/audit-domain-classification.mjs` 在 CI 讀取 548 筆 Canonical，產出各 Domain 分布及 Career 來源證據佇列。Career 無求職／招募／面試準備的明確脈絡時 Gate 失敗，須覆核而非為通過 CI 強加 Tags。
- 本輪 Career 共 14 筆；需釐清的兩個自動候選 `interactive-one-question-mock-interview`（輸入是 JD／履歷、候選人應答）和 `portfolio-case-study-storytelling-presentation`（目的為 45–60 分鐘求職面試）經現有內容核對後保留 Career。
- 本關卡專門攔截一類高風險誤判，**不表示其他九個 Domain 或全庫 548 筆已完成來源層級的人工語意審核**。後續應分批擴大到其他 Domain，並保留反例與已知例外的實際理由。
