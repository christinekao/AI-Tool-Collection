# Resource 雙層改善 Batch 17（2026-11-25）

基線 main `ed98df3348ede824af787283b89ff1b21b874ffa`；PR #81 初次 Intake Gate 未通過（frontend-design 案例 destination 描述過短），修正 commit `9539efc43bc5e0660b509e0057f6bb3fcde1c494` 後四項 CI 通過，合併 `eafd220ded07e943df7ec1ba39bd32c1ed9ad31e`，Catalog Sync 確認。84/286 已合併（78 完成對應、6 deferred）。

| Resource | 前台案例 | 固定版本與查核範圍 |
|---|---|---|
| stitch-skills | 履歷投遞管理畫面設計迭代 | 75f4696f162000fb69fca6a31489b5b21d47a506；README、LICENSE、SECURITY.md、plugins/stitch-design/skills/generate-design/SKILL.md |
| cathrynlavery-diagram-design | 資料管線技術交接圖 | b228c5d77794a84150fca41b22940bb316b1398d；README、LICENSE、PRIVACY.md、skills/diagram-design/SKILL.md |
| yanliudesign-mono-color-skill | 雙色展覽海報視覺配方 | c8ff70597ddedcd65f21a0b528f6a70c35690b0a；README、LICENSE、ASSET-LICENSE.md、SKILL.md、design-system/colors.json |

三筆 mapped 候選、9 個用途、9 個局部能力、3 個 design-only 案例。保留原 ID、URL、Tags、分類、features、requirements、limitations、既有 Typed Refs 與歷史用途。Stitch Skills 依既有 GitHub URL 補齊空白 repo，不變更實體身分。無新增全域 Graph Edge。

## 重要界線

- Stitch Skills：新畫面的 layout/content prompt 與 project-level design tokens 分開；修改畫面與生成新畫面契約不同。SECURITY.md 明示專案不是 Google 正式支援產品。僅核對技能源文件，未確認 MCP 服務端、相依技能或計費。
- Diagram Design：選語意圖型再選版型；可及性、匯入匯出及輸出規格為文件契約。PRIVACY.md 明示 AI Host 仍處理內容，Google Fonts 預設連網；單檔 HTML 不等於完全離線。未核對完整匯入器、self_check 或 export 腳本。
- Mono Color：固定版本 colors.json 預設受控雙色，明確單色則保留單色；底紙不計油墨。ASSET-LICENSE.md 明示 examples 中原始作品不受 MIT 涵蓋，未經書面許可不可複製改作或商用；第三方參考另查權利。生成文字、印刷分色及打樣仍需驗收。
- 本批未安裝、生成、上傳資料、連接帳戶或執行第三方工具。mapped 指限定範圍源文件與用途對應，並非完整實作或 runtime 已驗證。

## Gate 與接續

新增 Catalog 等值、雙向解析、固定版本、案例各欄最少字元、權利／隱私界線及四尺寸瀏覽器回歸。CI、合併、Pages 依真實結果。合併前 84/286；若本批驗收合併，87/286（81 完成對應、6 deferred），199 尚未改寫。既有缺口保留。下一批優先其他設計與內容製作 Skills（gzh-design-skill、baoyu-skill、ui-ux-gold-standard 等），以固定版本來源核對。排程停用。
