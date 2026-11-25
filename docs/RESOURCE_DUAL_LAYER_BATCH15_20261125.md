# Resource 雙層改善 Batch 15（2026-11-25）

基線 main `1efe5513afb767866a396b041e77e8eb7b21d934`；PR #79 四項 CI 通過並合併 `60ce62bd0b82469a89dd9f9d7541acd5d208ab60`，Catalog Sync 確認。76/286 已合併（70 完成對應、6 deferred）。

| Resource | 前台案例 | 固定版本及查核 |
|---|---|---|
| uiverse-io-galaxy | 知識庫搜尋欄與卡片樣式 | adbd2adde0a299a3956ea288fb444ec01891ca41；README、LICENSE、Buttons/0x-Sarthak_hungry-penguin-30.html、Cards/05akalan57_thin-sloth-31.html、Inputs/0xnihilism_calm-baboon-55.html |
| motion-dev-animations-skill | 作品集卡片動效驗收 | 3feedfb4dba8adae40fc9a5f9a23e3dda2121205；README、LICENSE、SKILL.md、examples/card-hover.md、scripts/validate_motion_config.py、schema/motion-config.schema.json |
| googlechrome-modern-web-guidance | 知識庫原生響應式導覽 | 2b4aa13a72dd47cd135b06ce5abfccd92e19b24f；README、LICENSE、skills/modern-web-guidance/SKILL.md、guides/ui-components/navigation-drawer.md（該 skill 目錄下） |

三筆 mapped 候選、9 個用途、9 個局部能力、3 個 design-only 案例。原 ID、URL、Tags、分類、features、requirements、limitations 與 Typed Refs 保留，Uiverse 與 Motion Skill 的空白 repo 依既有 URL 補齊同一身分，無新增全域 Graph Edge。歷史用途保留。

## 重要界線

- Uiverse 三個社群範例不是全量稽核。輸入欄 label 未關聯 input，outline 移除、focus 動畫可能無限；按鈕缺 type 與獨立焦點／減少動態規則。MIT 聲明仍應保留，作者署名建議與授權義務分開。
- Motion Skill 的 Python 驗證器讀取 config 中宣告的 FPS、bundleSize 等值，並非量測；警告不使有效設定失敗。Schema 未要求 accessibility 物件；card-hover 示例含 boxShadow 等，不能宣稱 GPU-only 或完整可及性。技能不是 Motion 引擎。
- Modern Web Guidance 的技能源文件描述 search/retrieve、legacy-scan 與原生 drawer；掃描僅約 20% 指引，不是完整靜態分析。原 features 的舊功能數字是歷史快照。CLI 實作、瀏覽器與完整指南未查；@latest 不保證可重現。
- 第三方未安裝、執行、建置或渲染。

新增 Catalog 等值、雙向解析、固定來源及四尺寸瀏覽器回歸；CI、合併、部署依實際狀態。合併前 76/286；若通過合併，79/286（73 完成對應、6 deferred），207 尚未改寫。既有缺口保留。下一批優先其他設計技能與開發教材，排程停用。
