# 分類架構 v1：Domain × Format × Capability
> 2026-11-19 試行；本輪是小樣本的**已收錄描述複核**，不是人工／上游來源查核，更不是執行測試。

## 三個維度，各自回答不同問題
| 維度 | 問題 | 欄位 |
|---|---|---|
| Entity Type | 這是哪種知識？ | 原六種類型 `entityType` |
| Domain | 主要解決哪個領域問題？ | `classification.primaryDomain`（唯一）／`secondaryDomains`（最多二個） |
| Content Format | 收藏的**來源形式**是 Repo、文件、文章、服務還是教材？ | `classification.contentFormat`（選填）及 `formatEvidenceFields` |
| Purpose | 用於學習或查詢嗎？ | `purposeFacets`，不是 Domain |
| Capability | 可完成的**具體動作**是什麼？ | `classification.capabilities[].id`、`evidenceFields`、`status` |
| Metadata | 來源、技術、Host、授權、版本及風險？ | 保留原 `source`、`category`、`resourceType`、`tags` 等 |

受控名稱以 [data/taxonomy-v1.json](../data/taxonomy-v1.json) 為唯一來源；分類器與網站讀取同一份十類 Domain。格式不是 Entity Type：一個 Skill 不需要再填「skill」格式，一個 Prompt 不需要再填「prompt」格式。Resource 可以是 Repo、學習教材或兩者兼具，但「學習」應放 Purpose。沒有證據，Format／Capability 寧可空白。

## 能力契約的最低要求
```json
{"capabilities":[{"id":"point-in-time-retrieval","evidenceFields":["purpose"],"status":"canonical-described"}]}
```
- `canonical-described`：文字已收錄且可查到；**不是**來源核查或執行 PASS。
- `source-reviewed`：原始上游版本與來源證據需另存，不等於可執行。
- `runtime-tested`：必須有環境、真實輸入／輸出與測試證據。
- 技術／Agent Host／原始 Tag **不能單獨證明**能力；同一 Capability 的 Resource、Skill、Prompt 不表示 I/O 相容、可直接互換或能組成 Workflow。
- Capability 對應 Concept／Workflow 先建立候選紀錄，不能因共同 Domain 或字串相近新增 Typed Reference。

## 四套閱讀規格持續有效
| 適用 | 規範 | 核心 |
|---|---|---|
| 深度學習教材 | [Learning Content Spec](LEARNING_CONTENT_SPEC.md) | 問題、取捨、例子、練習、可驗收成果 |
| 純 Repo 深入分析 | [Repo Resource Spec](REPO_RESOURCE_SPEC.md) | Understand → Rebuild → Compose |
| Agent Skill | [Skill Resource Spec](SKILL_RESOURCE_SPEC.md) | 觸發、輸入、執行步驟、輸出、風險與 Gate |
| Prompt | [Prompt Resource Spec](PROMPT_RESOURCE_SPEC.md) | Problem → Input → Copy → Output → Test → Compose |

既有 `repoGuide`／`learningGuide`／`skillGuide`／`promptGuide` 不變，且不能以 Format 自動判定應使用哪個完整內容版型。

## 第一輪試行與 Release Gate
先標註 **17 筆：10 Resources、3 Skills、4 Prompts**，其中 10 筆 Resource 具有來源形式，13 個能力指派有可回查欄位。其餘 531 筆既有資料保持不變；原分類與 ID 不刪改。

- `node scripts/test-taxonomy-v1.mjs`：詞彙、548 筆 Domain、17 筆樣本、證據欄位及舊版相容性。
- `node scripts/build-v2.mjs`、`node scripts/validate-v2.mjs`：Catalog、Manifest、Typed Reference 與 Knowledge Graph Integrity。
- 網站 375／430／768／1440px 及部署需另行實測，未測不得宣稱通過。
- 本輪未新增 Format／Capability 網站篩選器（資料尚未完成全庫標準化），不改舊路由。

下一階段依據本表分批豐富 Resources → Skills → Prompts，並同步累積 Concept／Capability 候選關係；每批先核對來源、文字與 I/O，再擴大資料填寫。
