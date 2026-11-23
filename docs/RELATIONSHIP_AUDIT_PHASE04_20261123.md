# Knowledge Relations｜Phase 3 Audit 04｜獨立合成證據來源與信任邊界

日期：2026-11-23｜Base main `10fea1e2dcd16a073242b6da318137f35699af59`

## 問題與這次實際修正

Audit 03 的合成判斷有規則，但是把呼叫端送進來的 \`authorization.approved\`、\`system1.calibrated\`、\`heldOutEvidence\`、\`providerRoute.providers\`、\`documents[].access\`、\`sql.dryRunValidated\` 等欄位直接用來判斷是否放行。**這是信任來源不分離的設計缺口**：只要輸入的欄位被偽造，該合成決策函式可能誤判允許。

Audit 04 新增**獨立的純合成註冊紀錄**，將「要求者可以宣稱」與「測試端另存的核准、風險、校準、供應商政策與文件／SQL 證據」分開。

核心成果：

- `scripts/relationship-trusted-synthetic-core.mjs`：只提供兩個純函式 `evaluateTrustedSyntheticRoute` 與 `checkTrustedSyntheticEvidence`，不匯入網路／檔案工具、不呼叫模型、沒有執行器。
- `scripts/fixtures/relationship-audit04-untrusted.json`：呼叫端可以提交的 **不可信** Synthetic Payload。此檔刻意包含與可信紀錄相反的校準、閾值、Provider、ACL 與 SQL 欄位，證明不會依它們直接獲得權限。
- 模組內部用私有固定表隔離 **Session Scope、Trusted Event Risk、合成校準記錄、Provider 資料政策／額度、Source ACL、SQL Attestation**。只供合成實驗，不接受呼叫端透過參數重寫此表。
- `scripts/test-relationship-trusted-synthetic.mjs`：21 個獨立回歸 Test；包含冒名 Session、偷換 Event、High Risk 降級、偽造 Held-out、降低閾值、假 Provider、Fallback、偽造 ACL、假 SQL 驗證、日期不一致與輸入不變性。

## 實驗與實際執行之間的界線

**本測試不能被用作真實安全證明：**

1. 測試 Session ID／Event ID 是公開字串，**沒有密碼學驗證，也無法防止重播**；正式系統必須由已驗證的 Server Identity／Policy Engine 在可信邊界核發並綁定 Request ID、Operation、資料範圍、時效及風險。
2. 模組內部的 "calibration registry" 只是**合成參考表**。就算有 Fixture held-out ID，也**沒有真正用 Laya 評估任何校準資料**；不能在真實 Workflow 啟用高風險自動化。
3. Provider Quota／Data Policy 是合成設定，**不代表 OmniRoute 的實時資料、合約或 Codex Runtime 權限已核對**；回傳 Candidate 並不執行 API。
4. 文件來源與 ACL、SQL Dry-run 在本實驗由離線 Registry 註記，**沒有呼叫 Onyx EE 權限端點或 WrenAI 資料庫**；只驗證實驗中不同信任來源的可隔離性。
5. 返回 `allow-low-risk` 也始終為 `actionAuthorized:false`、`executed:false`；文件查核則 `actualQueryExecuted:false`、`integrationVerified:false`。

本次目標是**避免低信任度的輸入直接決定安全 Gate**，不是建立 production-ready 的身份驗證或加密授權框架。

## 可重現與驗收

```sh
node --test scripts/test-relationship-trusted-synthetic.mjs
node --test scripts/test-relationship-synthetic.mjs
node scripts/validate-v2.mjs
```

- Audit 04 的 21 個 Test 同時包含允許與拒絕情境，並保留 Audit 03 的 14 個回歸案例。
- 新增內容進入既有 `V2 Data Validate` CI。
- 本批不修改任何 `data/` Canonical、Graph、Tags、Typed References、網站程式碼，也不新增 Skill 或正式 Workflow。
- **正式 Integration／Security、第三方模型精度、Provider Data Policy、上游商用授權、Chrome Live Production Smoke**：全部 \`NOT_TESTED\`。

## 後續判定

只有當可信服務端對動態 Request 綁定、來源權限、模型校準、Provider 可用性與失敗重試有真正可重現的獨立測試後，才有條件考慮更新原始 Workflow；尚未達到驗收條件前不可宣稱 Combination 可互換／可正式執行，也不能基於標題相同就刪除。原有 17 個 Combination 全數保留。

## PR、CI 與 Release 結果

尚待 GitHub PR／CI 回執；開始時不宣稱 PASS。
