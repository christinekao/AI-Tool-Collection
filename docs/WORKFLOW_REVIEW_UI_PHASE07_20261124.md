# Workflow Review UI｜Phase 3 Audit 07（2026-11-24）

**目標：把 Audit 06 的 17 組／58 個 Implementation Options 候選，放到真正可使用的 Workflow Playground，而不是只留在 JSON 或報告。**

## 交付範圍

- 既有 `playground.html` 加入搜尋側欄篩選（只顯示 17 筆已有候選對應的 Workflow），預設仍顯示原本 36 筆，不刪除或隱藏其他資料。
- `playground-app.js` 增加首頁的 3 個入口案例，並在使用者開啟 Workflow 時顯示來源證據、候選工具數、目前缺口、下一個驗證步驟與原始 Resource 詳情連結。
- 沒有 Recipe 的 Workflow：按原始 `stages` 分段顯示已對應的工具；零正式成員時顯示**無候選**而不虛構。
- 有互動 Recipe 的 Workflow：Recipe 編輯區仍維持原有控制，另用開啟的 `details` 顯示**原始 Workflow Stage** 的候選工具，明確聲明不與 Recipe 選項一對一對應，也不自動修改選擇。
- `workflow-review.js` 是純瀏覽器／Node 雙用的 **只讀檢查層**：以 Audit06 審查 JSON 與原始 Catalog 的 Combo Members、Workflow IDs／Title／Goal、Stage Index、Unverified Flags 做交叉驗證。只要 Review 檔遺失、過時或不一致，整個 Preview 關閉，原有 Workflow 可照常瀏覽，**不默默展示偽造的候選**。
- 原始 UI 隱藏式資料 `data/`、Canonical、Typed Refs、Graph、Tags、Source Field，全部不變。沒有任何候選工具自動加入自由草稿／真正執行／外送。

## Read-only Source of Truth

審查來源固定為 `docs/RELATIONSHIP_AUDIT06_OPTIONS_REVIEW_20261124.json`；只表示**現有 Resource 的候選對應**。由 `data/catalog-v2.json` 提供原始 Workflow 與 Resource 的實際名稱及 Source Detail。

**清楚區分：**

1. `Review-only candidate`：已從 Canonical Tool ID 與 Workflow 原文中提出候選，但未測試 I/O。
2. `Curated Recipe`：本來就有獨立來源和 Requires／Produces／Gate 的互動草稿，但仍未實測 API；不會被 Review JSON 改寫。
3. `Recorded Workflow`：正式儲存的原始階段資料，不等於完整可執行流程。
4. `No source mapping`：有原始 Resource 但未能對上階段，或完全沒有正式成員；不可自行補上 unresolved labels。

## Test and Release Gates

- [x] `node --test scripts/test-workflow-review.cjs`：13 項 Source Integrity／Failure Path／No-Promotion Test。
- [x] `node scripts/test-playground-review-browser.mjs`：用真實本機 Chromium 端對端測首頁篩選、兩種 Workflow 模式、零候選、未映射工具、注入字串 HTML escaping、375／430／768／1440 響應式。
- [x] PR V2 CI + Local Browser Smoke CI 實際 PASS。
- [x] PR Diff 不含 `data/`／Derived Catalog／Graph。
- [x] Main V2 CI + Live Pages + GitHub Pages Deployment 實際 PASS。
- [x] 真實新 UI 的 deployed Chromium Test 與 Handoff 實際回執均確認。

`Browser local smoke` 只代表 **從 GitHub checkout 的網站資產**執行，不能當成正式 Pages 已發布；Pages Deployment / deployed Chromium 必須各自驗證。

## Known Limits / Future Decisions

- 真正第三方工具相容、不同 Provider 的權限與資料出站、跨 Workflow 重用與商用授權仍 **NOT_TESTED**。
- 如果上游修改了 Canonical，這份 Audit06 Review JSON 可能變舊，Preview 應停用並要求重新審核，不應自動修正或提升正式 Graph Edge。
- 尚未授權刪除／合併／更名任何 17 個 Combination，或將這 58 筆候選移入 Canonical。
- 下一個使用者可驗收問題是「從 Problem 到 Workflow，是否能在一頁清楚讀懂各階段可選工具與證據缺口」，可用少量真實案例評估，而不是繼續堆疊合成安全模擬。

## Audit 07 正式驗收回執（2026-11-24）

**PASS WITH GAPS**：已在正式 Pages 透過 Chromium 驗證新版 UI；第三方工具互通與商用授權仍未實測。

| 項目 | 驗證結果 |
|---|---|
| [PR #58](https://github.com/christinekao/AI-Tool-Collection/pull/58) | Squash Merge，Head `6b323959cfd524681b42ac5028e56aa17277b6c0`，Merge `25ba958ac08ede340d35fc18f86fada9abc1166a` |
| [PR V2 CI #45314496570](https://github.com/christinekao/AI-Tool-Collection/actions/runs/45314496570) | **PASS**；新模型測試 **13／13** |
| [PR Local Browser #45314496517](https://github.com/christinekao/AI-Tool-Collection/actions/runs/45314496517) | **PASS**；17 篩選、Recipe/Recorded、未映射、惡意顯示字串 escaping、375/430/768/1440 響應式 |
| [PR P1 Graph #45314496527](https://github.com/christinekao/AI-Tool-Collection/actions/runs/45314496527) | **PASS** |
| [main V2 CI #45314661281](https://github.com/christinekao/AI-Tool-Collection/actions/runs/45314661281) | **PASS** |
| [main P1 Graph #45314661298](https://github.com/christinekao/AI-Tool-Collection/actions/runs/45314661298) | **PASS** |
| [main Pages Deploy #45314660599](https://github.com/christinekao/AI-Tool-Collection/actions/runs/45314660599) | **PASS**，02:45:55 UTC |
| [main deployed Chromium #45314661451 Attempt 2](https://github.com/christinekao/AI-Tool-Collection/actions/runs/45314661451) | **PASS**，真實正式站有 17 筆 Review 與 `stack` 4 個原始 Resource 候選 |
| Canonical／Graph／Tags／Typed Refs | **0 改動，原始 68／36／17 保留** |
| 真實 Tool/API Runtime／授權／License／重用 | **NOT_TESTED** |

### 實際修復與重測記錄

- 初次 PR Browser Smoke 因頁面切換時過早存取 JS 狀態而失敗，改以明確檢查初始化。
- 第二次發現 Unmapped Resource 沒有顯示原始 ID，補上 `Resource ID + 待確認 Stage`。
- 一次 CI Chromium 啟動受執行環境影響，增補 3 次隔離 Profile Retry。
- 最終 PR 本地 Chromium **PASS**；main 的 deployed Chromium 在 Pages 完成後重新執行 **PASS**。

最後 Docs-only Commit 重新部署時，最終 Deploy 證據在 [PR #58 留言](https://github.com/christinekao/AI-Tool-Collection/pull/58) 留存，不為了追記每個時間再次改寫文件。
