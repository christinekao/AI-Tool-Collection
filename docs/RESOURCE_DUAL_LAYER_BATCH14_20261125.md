# Resource 雙層改善 Batch 14（2026-11-25）

基線 main `daf1ab33fa53fb45f73c23f7494672f822dada15`；PR #78 四項 CI 通過並合併 `e530c3c8278ee579abc69f08b42ef139378a683c`，Catalog Sync 確認。73/286 已合併審查（67 完成對應、6 deferred）。

| Resource | 前台案例 | 固定版本與範圍 |
|---|---|---|
| anime-js | 作品集功能展示動畫 | 01b81be1df6843ccfe0a71c0699a746bf740dd77；README、LICENSE.md、src/animation/animation.js、src/timeline/timeline.js、src/scope/scope.js |
| kokonut-ui | AI 研究助理操作核准介面 | 7e4bd770ca3f1ff4d93b9c1d0a61b11c3a51cbce；README、LICENSE、package.json、components/kokonutui/ai-tool-approval.tsx、gradient-button.tsx |
| gsap-skills | 產品首頁滾動展示 Agent 任務 | aed9cfd3277740755f6bfc1155c7aa645403b760；README、LICENSE、skills/gsap-core、gsap-timeline、gsap-scrolltrigger、gsap-react 的 SKILL.md |

三筆 mapped 候選，9 個用途、9 個局部能力、3 個 design-only 案例。保留原 ID、URL、Tags、分類、features、requirements、limitations 及 Typed Refs。Kokonut UI 的 repo 原為空字串，依原有 URL 與已確認的固定上游版本補成 kokonut-labs/kokonutui，使 sourceUrls 正確；不改變實體身分。無新增全域 Capability 或 Graph Edge。

## 實作界線

- Anime.js：Scope root 無法解析時可回退 document，並非權限邊界；Scope.revert 清除追蹤項目與媒體監聽。渲染器、WAAPI、完整插值及裝置未查。
- Kokonut UI：未提供 calls 時是 demo；controlled 模式透過 onRespond 交由呼叫端處理，UI 核准與真實服務端授權不可混淆。完整 registry、Pro、實際鍵盤及服務端未驗證。舊 gradient-button 候選路徑 404，已取得 components/kokonutui/ 現行檔案。
- GSAP Skills：查核的是四份技能的實際指引源文件，symbols 明示為文件章節或文件 API；不是 GSAP 引擎原始碼，也不是執行測試。MIT 僅為 Skill Repo，底層 GSAP 與插件授權另查。
- 第三方工具未安裝、執行、建置或渲染，未連線任何正式資料。

## Gate 與接續

新增三筆 Catalog 等值、雙向解析、固定來源、未實測、核准／Scope 邊界及四尺寸瀏覽器回歸。CI 與部署依實際結果。合併前 73/286；本批若驗收並合併，76/286（70 完成對應、6 deferred），210 尚未改寫。下一批接續 Uiverse、Motion.dev Animations Skill 與其他明確來源的設計工具。既有缺口保留，排程停用。
