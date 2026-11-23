# Phase 3 Audit 05｜簽章請求、期限與重複使用防護（純合成）

日期：2026-11-23｜Base `d44ec9edbb124ea67740442a7ec10a8a58d7f8f7`｜範圍：Audit 04 既有離線可信 Registry 的最小延伸。

## 目的與威脅模型

Audit 04 把不可信 Request 與註冊的合成政策分開，但沒有 Request 完整性、有效期限或防止同一請求重複使用的機制。本批增加 **固定 HMAC-SHA256、短效簽章 Envelope、Body Hash、Audience／Scope 綁定與單次 Nonce 登記**，進一步測試假資料在跨步驟交接時不會被偷偷調換。

這是**可執行的離線安全概念驗證**，不是可上線的使用者身分驗證或授權服務。測試 Key 由 Node 測試使用 `randomBytes(32)` 在執行時產生，不寫入版本庫；不能替代經審核的 KMS、Server Identity、Access Token 管理或發行者驗證。

## 實作界線

- 新增 `scripts/relationship-signed-synthetic-core.mjs`：`createSyntheticIssuer` 模擬可信端簽發 `scope+payload hash+issuedAt+notBefore+expiresAt+nonce+audience`；`createSyntheticGate` 以 HMAC 與常數時間比較驗簽後才進 Audit 04 的獨立合成 Registry。
- 新增 `scripts/test-relationship-signed-synthetic.mjs`，23 個正向／負向測試，並保留 Audit 03 的 14 個與 Audit 04 的 21 個回歸案例。
- 測試 `ttlMs` 最長一分鐘；每次簽章包含隨機 Nonce。單一 Gate 同步使用 Set 檢查 One-use；也可明確提供**同進程共享**的 Set。
- 保留 `scripts/relationship-trusted-synthetic-core.mjs` 的既有測試來源／權限規則，不另建真實 Provider 接口、Credential、SQL 或外部動作。
- `allow-low-risk` 永遠只是合成路由候選；所有結果 `actionAuthorized:false`，絕不執行工具、查詢資料或外送。

## 驗收矩陣

| 對照項 | 預期 |
|---|---|
| 正確簽章／期限／Audience／Scope／Body | 進入獨立合成 Registry 查核 |
| Payload 簽後竄改、來源／SQL 版本更動、HMAC 被修改或用錯 Key | `reject`／`blocked` |
| 改 Audience／Scope／Version | 拒絕 |
| 過期、尚未到有效時間、超過最長 TTL | 拒絕 |
| 同一 Gate 重複請求或共用同進程 Set | 第二次拒絕 |
| 不共用 Replay Store 的另一 Gate | **仍可接受**；明確紀錄這是分散式部署安全缺口 |
| High Risk、未知 Session、偽造 Calibration／ACL | 即使簽章正確，也交回 Audit 04 的保守規則 |
| 測試 Key／Fixture | 不提交金鑰、不呼叫 Provider、不宣稱真實使用者身份 |

## 已知重要缺口

1. **Issuer 與 Gate 都是公開可建構的測試函式**，呼叫端如果掌握 Key，仍能自己簽章。正式系統必須由真正可信的 Server 簽發，Key 不可交給 Request Caller。
2. **同進程 Set 不具跨節點原子性、持久化或重啟後保留能力**。在不同實例中驗同一 Envelope 可能各自通過；需要有 TTL 與 Atomic Consume 的外部可信儲存，本批刻意以負向測試揭露此問題。
3. HMAC 簽章只保護測試內 Payload 完整性，**不證明其內容本來就可信、模型有正確校準或資料 ACL 正確**；發行者必須先完成真實身份與政策查驗。
4. 時鐘由測試函式提供，正式系統需可信時間與時鐘偏差政策，並防止重播、密鑰輪替及撤銷問題。
5. 本批沒有實作實際校準、身份服務、Onyx／WrenAI 資料存取、Provider API、Codex Runtime、真正 SQL 或商用授權稽核。

## 執行與驗收方式

```sh
node --test scripts/test-relationship-signed-synthetic.mjs
node --test scripts/test-relationship-trusted-synthetic.mjs
node --test scripts/test-relationship-synthetic.mjs
node scripts/validate-v2.mjs
```

CI 加入既有 V2 Data Validate；**不得修改原始 `data/`、Graph、Tags、Typed Refs 或任何前端檔案**。新 Test 的執行結果、原始失敗與修正紀錄、PR／main／Pages 實際狀態應在驗證後更新。

## Release 狀態

**PASS WITH GAPS**：最終 PR 與 main CI、程式合併 Pages Deploy 已 PASS（詳見下列收據）。但真正 Production Security／身份認證／Key 管理／跨實例 Replay／第三方系統仍 **NOT_TESTED**。

## Audit 05 最終 PR／main／部署收據（2026-11-23）

| 驗收項目 | 結果 |
|---|---|
| [PR #56](https://github.com/christinekao/AI-Tool-Collection/pull/56) | 已 Squash Merge；最終 Head `9f2e0c076c00f32783f14c8c63d013fd79105fad`；Merge `6f6ce950705352c4949fb912602a89f163c02d99` |
| [第一次 PR V2 Data Validate #45177335544](https://github.com/christinekao/AI-Tool-Collection/actions/runs/45177335544) | PASS，22／22 新增測試。後續 Cold Review 發現 Null Input 例外未涵蓋，故非最終驗收版 |
| [最終 PR V2 Data Validate #45177588867](https://github.com/christinekao/AI-Tool-Collection/actions/runs/45177588867) | **PASS，23／23，0 FAIL**，加上原有 14+21 項合成測試及現有全庫 V2 回歸 |
| [main V2 Data Validate #45177722412](https://github.com/christinekao/AI-Tool-Collection/actions/runs/45177722412) | **PASS** |
| [Main Merge Pages Deploy #45177721287](https://github.com/christinekao/AI-Tool-Collection/actions/runs/45177721287) | **PASS**，完成 **12:48:43 UTC** |
| 原始 Canonical／Graph／Typed References／網站 UI | **全部保留；無改動** |
| 真實 Server Auth、分散式原子 Replay、Provider／SQL／ACL | **NOT_TESTED** |
| 本批獨立正式站 Chromium Live Smoke | **NOT_TESTED** |

### Failure → Improvement → Regression

- **Before**：Audit 05 第一版 `route({envelope,payload}={})` 和 `evidence({envelope,payload}={})` 對直接傳入 `null` 會在解構參數時拋出 TypeError。
- **Fix**：入口先驗證是否為普通物件，不符合則改為空合約後安全拒絕。
- **Retest**：新增第 23 項測試覆蓋 `null`、`undefined`、字串、數字、Array 和空物件，並重新執行完整 PR CI **PASS**。之前 22 項全部保留。
- **Remaining gap**：不共享 Replay Set 的兩個實例依然會各自接受同一有效 Token；不能以本批宣稱真正跨節點安全。

最終 Docs-only Main Commit 再觸發 Pages。為避免「寫入 Deploy 時間 → 再次 Deploy」循環，最後一個部署回執只在 [PR #56 留言](https://github.com/christinekao/AI-Tool-Collection/pull/56) 記錄。

**驗收結論：PASS WITH GAPS**，限於合成安全規則、靜態 CI 與無破壞式 Repo 修改。
