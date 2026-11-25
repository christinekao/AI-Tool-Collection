# Resource 雙層改善 Batch 02（2026-11-25）

Base main: 5307761173ebd05f6cc888d6355a149b6d0bd6e2；PR #66 已合併，Catalog Sync 已確認。依 PR #65 強制契約逐筆改善既有深度來源；排程先前未寫入，本批由可用 GitHub 連線直接執行。

| Resource | 人類用途與案例 | 底層證據 | 限制 |
|---|---|---|---|
| addyosmani-agent-skills | 規格、程式審查、網頁驗收；表單儲存案例 | 固定版本四份 SKILL.md | 其他技能僅索引，未執行 |
| nirdiamant-genai-agents | 迴圈、路由、進階模式；客服分流比較 | 固定版本 README Notebook 索引 | Notebook 未逐份閱讀或執行 |
| anthropics-skills | 封裝重複工作、測試、尋找文件技能；Resource 整理 Skill | template、skill-creator、webapp-testing、README | 其他技能、授權及 Host 未測 |
| openrouter-ai | 模型比較、備援、資料政策；摘要模型選型 | 官方 provider routing、ZDR 文件 | 未呼叫 API、政策及費用未驗證 |
| ai-code-acceptance-review-testing-rollout-guide | 需求、測試、操作證據、發布；申請表單驗收 | 4 章既有教材與原文 | 設計案例、未執行 |
| microsoft-ai-agents-for-beginners | Agent 必要性、工具契約、權限；只讀客服查詢 | 已讀 01、04、06 章 | deferred：其餘課程尚未逐章查核 |

共六筆改寫：五筆 evidence-linked、一筆 deferred。19 個前台情境、21 個底層證據單元；六個設計案例。保留原 ID、Tags、分類、來源、Typed Refs、features/requirements/limitations 及完整既有教材。無新 Graph Entity 或 Edge。全部未實測第三方工具。使用已查閱的固定版本文件證據，未宣稱本輪重新逐檔查閱或驗證執行。

## 驗收與下一步
擴充 Catalog 等值、雙向引用、未實測及保留七章教材測試；11 頁四種寬度瀏覽器回歸。CI、合併、部署以實際 PR 與 Actions 結果為準。基線 286 筆，main 已合併 5 筆；本批通過並合併後為 11 筆有雙層審查結果（10 筆 mapped/evidence-linked，1 筆 deferred；不是 11 筆全數深度完成）。下一批優先既有 AI Usage Bar 與 AI cheat sheets 專屬指南，再依 manifest 逐筆審查其餘尚未改善的資源。
