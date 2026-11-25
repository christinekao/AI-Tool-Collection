# Resource 雙層改善 Batch 13（2026-11-25）

基線 main `1d139b33c5c1e5d67f006e1aa32fb7627cdb26dd`；PR #77 四項 CI 通過並合併 `202ba4295456bf23f433b18749bddfd0ecb6d921`，Catalog Sync 確認。70/286 已合併審查（64 完成對應、6 deferred）。

| Resource | 人類應用 | 固定版本及查核範圍 | 審查 |
|---|---|---|---|
| shadcn-ui | 履歷管理系統共用元件 | 055aa6b7837b1808456a24beb4c97a677864aa82；README、LICENSE.md、packages/shadcn/src/commands/add.ts、utils/dry-run.ts | mapped；舊安裝器路徑 404，實際 registry 安裝器及初始化未完整查核 |
| motion-dev | 知識庫詳情面板動效 | 1fa0e141f7b3f0a4eea258d5debc7dfbe5af6ffc；README、LICENSE.md、animation/animate/index.ts、hooks/use-animate.ts、utils/reduced-motion/use-reduced-motion.ts | mapped；Timeline 候選路徑 404，完整引擎及各框架未查 |
| magicuidesign-magicui | 作品集成果數字與功能展示 | d13c6101da1165f7309c6281447c25f121ef0ca9；README、LICENSE.md、apps/www/registry/magicui 下 animated-list、number-ticker、marquee | mapped；完整 registry、CSS 動畫與依賴未查 |

三筆改寫，9 個用途、9 個局部能力及 3 個 design-only 案例。寫入前核對原 ID、Repo、URL、Tags、分類、features、requirements、limitations 與既有 Typed Refs 不變；保留 implementationKnowledge 與歷史用途快照。不新增全域 Graph Entity 或 Edge。

## 重要界線

- shadcn/ui：固定版本 add.ts 的 dry-run 分流在缺 config 或空專案的初始化分支之後。不能假定整個命令無寫入；此為原始碼路徑查核，未實際執行以驗證副作用。
- Motion：useReducedMotion 註解描述即時更新，但固定版本以 useState 取得初始值且未使用 setter，故不可宣稱設定會即時更新；未實測。useAnimate 有卸載時停止其 scope.animations 的清理。
- Magic UI：AnimatedList delay 為毫秒；NumberTicker 以秒乘 1000 並固定 en-US 格式；Marquee 預設 repeat=4，hover 暫停預設 false。動效不等於真實資料或無障礙。
- 所有第三方工具未安裝、執行或渲染。Kokonut UI 尚未查核，不計入本批。

## Gate 與接續

新增 Catalog 等值、雙向解析、固定來源、未實測與四尺寸瀏覽器回歸測試。CI、合併、Pages 依實際結果。合併前 70/286；驗收合併後 73/286（67 完成對應、6 deferred），213 尚未改寫。既有六筆 deferred 與三筆來源阻塞維持追蹤。下一批接續 Kokonut UI、Anime.js、其他可確認的前端及設計資源。排程停用，直接執行。
