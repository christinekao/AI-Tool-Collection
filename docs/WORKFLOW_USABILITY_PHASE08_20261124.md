# Workflow Usability Walkthrough｜Phase 3 Audit 08（2026-11-24）

目的：以真正已上線的 Workflow Playground 為對象，執行 3 個具體任務的**自動化操作路徑驗證**。不宣稱進行過真實使用者訪談，也不以瀏覽器跑通來替代可用性研究。

## Baseline 實際問題

1. **選擇 Workflow 後網址不更新**：首頁卡片或側欄選取 `pOpenWorkflow(id)` 只更新 JS state，分享連結仍指向舊 Workflow／首頁；使用瀏覽器上一頁無法復原 UI。
2. **網址含 `problem` 和 `workflow` 時前者優先**：既有初始化先選 Problem 的第一個 Workflow，忽略使用者指定 Workflow，造成直連錯誤。
3. **篩選條件疊加時無明確復原操作**：選 Problem + 搜尋 + Review-only 後若找不到任何結果，使用者需手動逐一取消。
4. **證據連結無法直達該案例**：原本所有 Workflow Review 只連到 17 案例報告開頭，需要自行搜尋。

## 本輪實際 UI 修正

- 在每次**使用者點選** Workflow 後更新 `?workflow=<id>`，保留合法的 `?problem=<id>`；網址可複製或分享，Browser Back／Forward 依 URL 還原選中的 Workflow。
- 若 URL 同時包含衝突的 Problem/Workflow，以**明確指定的 Workflow 為準**，移除不相符的 Problem 篩選；既有 Seeded Draft 保留。
- Sidebar 增加「清除搜尋與篩選」，零結果時顯示明確恢復按鈕；不刪除任何 Source Record 或草稿。
- 17 個 Audit06 逐筆審查項目改成可定位的 Markdown Heading，Workflow Review 的「審查依據」直接連到對應 `#<workflow-id>`，方便驗證與追蹤。

## 3 個自動化任務（不是人類可用性測試）

| 任務 | 起點 → 完成判斷 | 範圍 |
|---|---|---|
| A：企業知識問答 | 首頁 `stack` 卡片 → 原始 Stage 候選 → Audit06 `#stack` → 可分享連結 → Browser Back/Forward | 可發現性、來源定位、深連結 |
| B：AI SVG 資產實作 | Workflow Search → `ai-vector-asset-code-stack` → 4 階段 4 個 Tool Candidate → Reset Filters | 工具對應、迷失復原、來源 Link |
| C：學習流程零工具與衝突網址 | `goal-build-evidence-learning-loop` 無正式 Resource 的空狀態 → 混合 `problem` + `workflow` URL → 明確 Workflow 優先 | 不虛構成員、URL 決策 |

## 不可跨越的界線

- `data/` Canonical／Tags／Graph／Typed References／Catalog 原檔、所有 17 Combination 不變。
- 本次只改善導覽、可理解的資訊展示與證據連結；**沒有**更新 Audit06 Candidate 的核實狀態。
- 原有 Recipe 選擇、自由草稿與工具能力不被自動修改。第三方工具 API、權限、相容性、商業授權及真正使用者完成率仍 **NOT_TESTED**。
- 嚴禁將自動化操作路徑 PASS 改寫為「真實使用者 5 秒理解度已通過」。

## Acceptance Gates

- [ ] 本機 Chromium 3 任務、URL History／Reset／Report Anchor、Responsive、XSS 邊界 PASS
- [ ] 原有 Source／Recipe／Workflow／Graph Tests PASS
- [ ] PR/main CI、真正 GitHub Pages 發布及 deployed Chromium PASS
- [ ] PR Diff 檢查不含 Canonical；Rolling Handoff 取得實際證據

請參閱 [Audit 07 已上線介面與保留資料原則](WORKFLOW_REVIEW_UI_PHASE07_20261124.md)。
