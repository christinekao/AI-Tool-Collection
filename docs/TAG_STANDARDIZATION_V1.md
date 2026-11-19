# Tags 與分類標準化 v1（全六類，2026-11-19）

## 問題與盤點

針對 548 筆 Canonical（2026-11-19 分支快照）：5,407 個 Raw Tag 使用次數、2,431 個不同名稱；304 筆含舊 `category`，共 82 種 Category 名稱。第一輪已建立 10 個標準 Domain，但 **Tag 還未全庫標準化**，且只有 17 筆 Content Format／Capability 試點。

本輪先把「如何標準化」做成**全庫可執行、可回溯機制**。並非聲稱 2,431 個不同 Tag 都已逐一語意審核或已能自動歸類。受控詞彙以高信度術語與明確別名優先，未知的長尾標籤留待後續審核。

## 唯一來源與維度

- `entityType`：六種 Canonical 知識形式，唯一正式實體分類，不依原 Tag 猜測。
- `classification.primaryDomain`：10 個問題領域（必有唯一主題，Secondary 最多 2）。**已對所有 548 筆標註候選 Domain**；其中 2 筆資料不足仍保留待複核。
- `classification.contentFormat`：來源形式（Resource Repo、Article、Application、Documentation 等），不是正式 Entity Type。
- `classification.capabilities`：證據支持的具體可執行動作，與標籤只是「提及」不同。不能從 Tag 自動建立 Capability。
- `classification.purposeFacets`：學習與參考用途，不屬於 Domain。
- `tags`：**歷史原始關鍵字，不是受控分類值**；保留在 Canonical 以免遺失來源用語。
- `category`：舊分類顯示文字，不再新增任意的 Category 作為主分類；正式分類只讀 Domain，原值保留供查閱。
- `tagDimensions` + `tagVocabulary`：集中於 [data/taxonomy-v1.json](../data/taxonomy-v1.json)。Tag 可變成 Agent Host、Technology、Protocol、Method、Deployment、Risk Review、License Mention、Record Hint、Purpose Hint、Legacy Status、Locale 等**具型別的歷史線索**。

## 標準化範例

| 舊 Tag | 正規 ID | 維度 | 注意 |
|---|---|---|---|
| `MIT`／`mit-license` | `mit` | license-mention | 僅顯示歷史授權名稱，**未核對 LICENSE** |
| `agent-skill`／`agent-skills` | `agent-skill` | record-hint | 不能把 Resource 自動變 Skill |
| `skill`／`skills` | `skill-mention` | record-hint | 不能當成正式 Skill 實體 |
| `CLI`／`cli` | `cli` | technology | 不表示已安裝 |
| `source-verified` | `source-verified` | legacy-status | **絕不等同 source-reviewed** |
| `uninstalled` | `uninstalled` | legacy-status | 只是舊版狀態紀錄 |
| `security-review` | `security-review` | risk-review | 代表「需要審查」，不是 Security PASS |
| 未知專案名／特殊術語 | 不自動映射 | unresolved | 完整保留原始 Tags，列待複核 |

## 與新增流程的關係

1. 先查來源、去重、實際用途與 Entity Type。
2. 用受控 Domain／Content Format／Capability（有證據時）分類。
3. 先保留原始 Tag。只有單義、可驗證的別名才加入受控詞彙；跨義詞與來源專有名稱不硬塞進 Domain。
4. `scripts/tag-taxonomy-core.mjs` 從六類 Canonical 產出 `data/tag-index-v1.json`，每筆包含 `normalized: [{id,dimension,sourceTags}]` 與 `unmapped`。後者仍能從 Canonical Search 找到。
5. 新增或實質改寫的紀錄，`intakeReview.tagReview` 要註記所有 Tag 已匹配、未匹配但保留、或候選新增詞彙的理由；透過共用 Intake Gate 檢查。
6. `node scripts/build-v2.mjs` 會重建 Tag Index；`node scripts/validate-v2.mjs`、`node --test scripts/test-tag-taxonomy.mjs` 必須一致。不得手動改生成索引代替 Canonical 更新。

## 規模與尚未完成的內容

`data/tag-index-v1.json.summary` 是目前基準分支下**即時計算**的覆蓋統計；`commonUnmapped` 是值得優先語意複核的高頻未匹配 Tag。原始 Tags 和舊 Category 的完整性本輪沒有重寫／刪除，主題分類是否正確仍以資料證據另行確認。Content Format 和 Capability 原 17 筆試行範圍不因本次標籤映射自動擴大。

後續每批 Resources → Skills → Prompts 更新時，從 `commonUnmapped` 高頻項目開始做語意審查，逐步擴充詞庫與 Capability，而非一次假裝 2,431 個 Tag 全部已人工驗證。


## 標籤精簡治理（Lean Tags）｜適用所有 Agent

原則：**Tag 是補充搜尋線索，不是資料的摘要全文。先重用，再建別名；沒有確切需要就不新增。** 不追求每筆 Tag 數量，也不以覆蓋率上升作為目標。分類應優先放在 Domain、Content Format、Purpose、Capability、Source、Technology 等適當欄位；重複描述的 Tag 不值得新增。

- 不從標題／介紹／文章關鍵字逐字自動產生 Tags；不因遇到新工具、產品名、Repo Owner、泛用詞就擴充全域詞庫。
- 新增資料建議 **3–5 個有辨識價值的 Tags**；CI 暫以最多 **6 個**作為防膨脹上限。可以少於 3 個甚至 0 個；不為填滿配額而添加。
- 既有紀錄每次更新，最多只能**新增 2 個** Raw Tags；原有 20+ Tags 不會被強迫刪除，也不會僅因歷史較多而驗收失敗。
- 不允許新增 `misc`／`important`／`day` 等沒有分類意義的泛用詞；不能將既有 Domain 再重複當 Tag，也不能用同義別名在同一筆內重複計數。
- 未對應受控詞彙的特定來源術語保留為 Raw Tags／`unmapped`，不會因其存在就自動建立新分類。
- 想擴充**全域 Tag Vocabulary** 時，必須已有至少 **3 筆不同 Canonical 實際使用該詞／別名**，並說明「為何現有 Tag 無法表達」、「改善哪種搜尋／使用情境」、記錄至少 3 個具體 Entity IDs；CI 會交叉比對；語意必要性仍須獨立審查。只出現一次或兩次的專有名稱繼續保留，不升格全域 Tag。
- 既有 Vocabulary 只補真正有用且出現在資料中的別名；不為別名製造額外 Canonical ID。
- `data/taxonomy-v1.json` 的 `tagGovernance` 是統一數量與治理門檻；`scripts/check-tag-governance.mjs` 是差異檢查、`scripts/test-tag-governance.mjs` 是負案例／回歸檢驗。**測試通過不表示語意正確，也不等於允許 Agent 自行核准擴充標準。**
- 以上預設上限針對**新資料與新增的 Tag**，不是回溯改寫或刪除 548 筆舊資料；如少量具體例外確有必要，先提政策修改供審查，不自行繞過 Gate。
