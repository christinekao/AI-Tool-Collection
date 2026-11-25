# Resource 雙層改善 Batch 05（2026-11-25）

基線 main `f0188548854f853cae69eb1a3db00c514125c8be`，PR #69 四項 CI 成功、已合併 `90f4115f07dc02a92d69dc67ca97f8dad7018667`，Catalog Sync 已確認。26/286 筆已有雙層審查結果（23 完成對應、3 deferred）。

| Resource | 新增用途及應用 | 固定版本與來源範圍 | 缺口 |
|---|---|---|---|
| blender-blender | 3D 產品示意、動畫、重複渲染；旋轉預覽 | 85d42f7cebbffe9c1da5febb7ad370414e5236c6；README、COPYING、rna_scene.cc、render_internal.cc | 建模、完整 Python 綁定及渲染後端未查核 |
| heygen-com-hyperframes | 可編輯影片、批次版本、輸出前檢查；三段式產品影片 | 4864ade2838704b92c69d37ec5ffe554ddca4114；README、Skill、render.ts、check.ts、runtimeContract.ts、LICENSE | 逐格引擎、混音編碼、Studio、telemetry 實際行為未測；舊 7 個 Skill 數字僅為歷史快照 |
| theatlasteam-motion-design-skill | 文字動效、介面控制、固定畫格；數字滾動示意 | 26101808ab09f220f339bd59c8d36a49ae986b8f；SKILL.md、motion-core.mjs、motion-controls.html、deterministic-rendering.md、README、LICENSE | 3D、MIDI、SoundFont、完整輸出未測；外部模型授權不隨 Repo |
| microsoft-autogen | 輪替、停止、遷移；撰稿與審查角色 | 8390985108cb1e3881f5f7297765758d8ad2540c；README、LICENSE、LICENSE-CODE、round robin、base manager、terminations | 封存專案，優先研究／遷移；完整 runtime、模型、工具及遷移未測 |
| roocodeinc-roo-code | 工具組、核准、停止；規劃與開發模式 | b867ec9145750d0ae1ff7f02d35406e9bf2a0b16；README、LICENSE、modes.ts、Task.ts | 封存專案；完整 auto-approval 策略、工具執行及權限尚未查核 |

五筆皆 mapped，15 個用途、15 個局部能力、5 個 design-only 案例。更新前逐筆核對原 ID、Repo、URL、Tags、分類、features、requirements、limitations 及所有既有 Typed Refs 不變。保留既有 implementationKnowledge，新增 priorPurposeSnapshot 保存歷史資訊；不以舊功能數字當現況。無新增全域 Graph Entity 或 Edge。未安裝或執行第三方工具，未送出 telemetry、素材或使用付費服務。

## 驗收及接續

新增五筆雙向解析、固定版本來源、歷史內容、封存限制與前台 rendering 測試，擴充既有四尺寸瀏覽器測試。CI、合併及 Pages 以真實狀態為準，不事先標 PASS。合併前 26/286；通過並合併後為 31/286（28 完成對應、3 deferred），255 未改寫。後續應由 manifest/Canonical 盤點其餘項目，優先其他來源明確的非程式碼 Resource 及近期新收錄；持續追蹤三筆既有 deferred，不使用排程。
