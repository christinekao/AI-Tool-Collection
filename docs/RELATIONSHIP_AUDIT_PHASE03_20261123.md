# Knowledge Relations｜Phase 3 Audit 03｜離線合成安全契約實測

日期：2026-11-23｜Base main `6a6718506d58ae4ec6a871d3b8e10887d670df50`｜驗證範圍：**純 JavaScript 的 Synthetic Contract**，不是實際 Laya／OmniRoute／Codex／Onyx／WrenAI 整合。

## 目標與禁止事項

以 Audit 02 的 [9 項候選 Stage Contract](RELATIONSHIP_AUDIT02_PROPOSALS_20261123.json) 為需求，在隔離、無憑證的合成案例中建立最小的安全決策與來源追溯模擬。檢查 Fail-Closed 的**程式邏輯與負向案例**，不聲稱上游工具具同樣保證。

- **不呼叫** Laya、OmniRoute、Codex、Onyx、WrenAI、MinerU、Crawl4AI 的 API、CLI 或服務；不讀取 Token、不寫檔、不寄信、不執行 SQL、不使用公司資料、不觸發真實外部動作。
- `scripts/relationship-synthetic-core.mjs` 是純函式，沒有任何 Network、FS 或工具執行器依賴；即使回傳 `allow-low-risk`，也永遠回傳 `actionAuthorized:false`、`executed:false`。
- 資料 `scripts/fixtures/relationship-audit03-synthetic.json` 僅包含 `synthetic://` 來源和合成授權。沒有變更 Canonical、Typed Refs、Graph、Tags 或正式網站。
- 可透過 `node --test scripts/test-relationship-synthetic.mjs` 重現全部測試；套用至既有 V2 Data Validate CI。

## A. Risk-first 決策與 Provider 備援

| 情境 | 預期合成決策 | 目的 |
|---|---|---|
| 已授權、低風險、校準已申報、已核准 Provider | `allow-low-risk`，但絕不執行 | 區分決策與實際權限 |
| 高風險，即使信心值 1.0 | `human-review` | 不允許信心繞過風險 |
| 中等風險 | `human-review` | 不擅自升級權限 |
| 未知 Risk、未知 Language | `human-review` | OOD Fail-Closed |
| 缺少 Task-specific 授權／資料不是 Synthetic | `reject` | 權限與資料邊界 |
| `confidence` 非 `answer_confidence`、未校準、未附合成 Held-out、Checkpoint 不符 | `human-review` | 不把錯的數值當 Gate |
| `answerConfidence` 低於門檻 | `escalate-model`（仍不執行） | 明確升級 |
| Quota 耗盡且核准、支援能力與資料政策相符的備援 | 候選備援，仍不執行 | 與任意 fallback 區分 |
| 備援未核准／不支援 Typed Decision／資料政策不符 | `human-review` | 防止偷換 Provider |

重要限制：Fixture 內 `calibrated:true` 與 `heldOutEvidence` 只是**合成測試輸入**，不是真正用 Held-out Data 做過 Laya 校準；安全 Gate 的測試只能證明本測試函式對輸入的處理邏輯，不證明 Laya 的真實分數、模型準確度或 Provider API 效能。

## B. 文件／SQL 來源追溯

| 輸入 | 必要證據 | 缺漏結果 |
|---|---|---|
| MinerU 文件 | `synthetic://` 來源、ID／版本／As-of／頁碼 | `blocked` |
| Crawl4AI 網站 | `synthetic://` 來源、ID／版本／As-of／Section | `blocked` |
| Onyx 的來源權限候選 | Enterprise 來源 ACL 同步與允許 Actor | 缺失時 `blocked` |
| WrenAI 的 SQL 候選 | SQL Query ID、KPI ID／版本、MDL 版本、Snapshot、Read-only、Dry-run、Synthetic Result、Actor Scope | 缺失時 `blocked` |
| 文件與 SQL 截止日不同 | 各自保留 Citation，不併成同一事實 | `separate-sources` |
| 所有合成證據齊全 | 回傳三條 Citation，仍 `integrationVerified:false` | `candidate-supported`（非實測整合） |

**注意**：這裡驗證的是「Metadata 能否完整追溯」；並沒有真正擷取 PDF、查詢 Onyx、生成或執行 SQL，也沒有證明文件內容或數字正確。僅據 Fixture 可回傳 `candidate-supported`，不應在正式產品 UI 上顯示為已確認真實事實。

## 防護與驗收

- 14 個獨立 Node Test：正例、High Risk、Unknown、未授權、未校準、分數格式、Fallback、Provider Capability、來源 ACL、偽造來源、SQL 證據與 As-of mismatch、Malformed Input。
- 使用 `structuredClone` 比對函式前後 Fixture，確保不會修改輸入。
- 負向測試保留作 Regression Case；CI 失敗必須記錄並修正，不可只調整期待值以取得 PASS。
- 合成 Fixture 原始標記為 `syntheticOnly:true`，程式拒絕 `environment !== synthetic-offline` 或 `dataClass !== synthetic`。
- PR Diff 必須沒有任何 `data/` Canonical 或衍生資料、`knowledge-app.js`、`catalog-app.js`，維持原 68／36／17 計數及 Graph 不變。

## 尚未驗證與後續

**NOT_TESTED**：第三方模型實際校準、真實 Runtime 的身分／資料存取強制、Onyx EE ACL 行為、SQL Dry-run 的真實有效性、跨 API／資料格式互通、商用授權、正式站 Browser Smoke。

下一階段如需將概念真正變成 Product Workflow，必須先指定 Runtime、Provider、合成測試環境與授權範圍，完成獨立 Integration／Security 驗收後再決定是否更新 Canonical。**不自動刪除或合併 Combination，不新增未證明的正式 Concept Link**。

## GitHub CI 與交付

待 PR 建立後按實際 CI／main／Deploy 填入收據；在 Run 完成前不宣稱 PASS。
