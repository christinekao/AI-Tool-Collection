# Resource 雙層改善 Batch 16（2026-11-25）

基線 main `e2ffe1ba7bed31074771ea31ba092c1474c3466d`；PR #80 四項 CI 通過並合併 `468b2807526ed604b5e3218c76ced519a88d7d49`，Catalog Sync 確認。79/286 已合併（73 完成對應、6 deferred）。

| Resource | 前台案例 | 固定版本與範圍 |
|---|---|---|
| elayadesign-ai-design-skills | 產品首頁與 Figma 設計規則 | 456d9e0d3e2d84c748bb143c6ca3d90c45e16213；README、LICENSE、landing-page-design/SKILL.md、figma-designer/SKILL.md |
| leonxlnx-taste-skill | 企業首頁設計與驗收 | d1a2bb41d927083ac7118f60cfc9cdf711810ea0；README、LICENSE、skills/taste-skill/SKILL.md、scripts/gate.mjs（該 skill 目錄下） |
| impeccable | 履歷管理系統頁面審查 | 9e460a87ef338ee9d12c7beed8fedc597a5af5f7；README、LICENSE、skill/SKILL.src.md、skill/reference/audit.md |
| frontend-design | 主題明確的作品集首頁 | e4bb5d960d87126ff3b3a8af1a104b7db67560ba；skills/frontend-design/SKILL.md、LICENSE.txt（子目錄） |
| pcottle-learn-git-branching | Local Git 分支與合併 | f51af0e8e373fd9b0ffb7287656e6e01348f4c9e；README、LICENSE.md、src/js/git/index.js 的 branch、checkout、merge/rebase 入口及 staging 模型 |

五筆 mapped 候選，15 個用途、15 個局部能力、5 個 design-only 案例。保留原 ID、Repo、URL、分類、Tags、features、requirements、limitations、既有 Typed Refs、歷史用途及既有 implementationKnowledge。無新增全域 Graph Edge。

## 重要限制

- Elaya 兩份技能為設計指引；固定視覺規則、單一 CTA 及 tagline 動效需按實際產品選擇。Figma token 色票可綁定，但 hex 文字標籤仍需同步。未連接 Figma。
- Taste Skill gate 有瀏覽器、子程序、狀態與 waiver 規則，僅查部分核心程式及檔首契約；未驗證完整 hook 或子檢查器，PASS 不是完整功能與無障礙保證。
- Impeccable 的技術 audit 與 UX critique 分開，README 宣稱的規則數量不等於已稽核 Rust detector。未執行 CLI、掃描或 hook。mapped 僅代表已讀技能契約的用途對應，不代表整套工具實作已查。
- Anthropic frontend-design 是原有子資源，保留身分，不與 anthropics-skills 重複合併；本次查核技能本體，未執行。
- Learn Git Branching 是模擬器，固定版本的 staging 模型須由關卡啟用；不是完整真實 Git、PR 或 CI/CD。未操作網站。
- 全部第三方工具均未安裝、執行或修改。新增來源映射、Catalog 等值與四尺寸回歸測試，CI 與部署以實際狀態為準。

合併前 79/286；本批通過合併後 84/286（78 完成對應、6 deferred），202 未改寫。下一批優先其他 UI 設計技能與開發學習資源。既有缺口保留，排程停用。
