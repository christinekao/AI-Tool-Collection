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

- [ ] `node --test scripts/test-workflow-review.cjs`：13 項 Source Integrity／Failure Path／No-Promotion Test。
- [ ] `node scripts/test-playground-review-browser.mjs`：用真實本機 Chromium 端對端測首頁篩選、兩種 Workflow 模式、零候選、未映射工具、注入字串 HTML escaping、375／430／768／1440 響應式。
- [ ] PR V2 CI + Local Browser Smoke CI 實際 PASS。
- [ ] PR Diff 不含 `data/`／Derived Catalog／Graph。
- [ ] Main V2 CI + Live Pages + GitHub Pages Deployment 實際 PASS。
- [ ] 真實新 UI 的 deployed Chromium Test（若未執行須標示 NOT_TESTED），以及 Handoff 實際回執。

`Browser local smoke` 只代表 **從 GitHub checkout 的網站資產**執行，不能當成正式 Pages 已發布；Pages Deployment / deployed Chromium 必須各自驗證。

## Known Limits / Future Decisions

- 真正第三方工具相容、不同 Provider 的權限與資料出站、跨 Workflow 重用與商用授權仍 **NOT_TESTED**。
- 如果上游修改了 Canonical，這份 Audit06 Review JSON 可能變舊，Preview 應停用並要求重新審核，不應自動修正或提升正式 Graph Edge。
- 尚未授權刪除／合併／更名任何 17 個 Combination，或將這 58 筆候選移入 Canonical。
- 下一個使用者可驗收問題是「從 Problem 到 Workflow，是否能在一頁清楚讀懂各階段可選工具與證據缺口」，可用少量真實案例評估，而不是繼續堆疊合成安全模擬。
