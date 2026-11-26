# Batch 84｜最後四筆來源阻塞與歷史恢復（2026-11-26）

此批只查核及保存來源缺口，不把四筆算為雙層知識完成，不修改其 Canonical，不刪除任何 ID 或 Skill，不用相似工具填補原始身分。

| Resource | 可核對證據 | 未解決事項 |
|---|---|---|
| codex-router | [最早 V2 JSON](https://github.com/christinekao/AI-Tool-Collection/blob/951dd4cf7353f0270f630f24286ad4e677fcc6d6/data/resources/codex-router.json)，原始 url/repo 均空，原用途僅 Model / agent routing | 原始網址、作者、截圖；候選 Repo 不是原始身分 |
| viral-hook-title | [最早 V2 JSON](https://github.com/christinekao/AI-Tool-Collection/blob/951dd4cf7353f0270f630f24286ad4e677fcc6d6/data/resources/viral-hook-title.json)，原用途僅 Hook、標題、variants，url/repo 均空 | 原始 Skill 連結、作者；不替換成同類工作流 |
| whisper-ui | [最早 V2 JSON](https://github.com/christinekao/AI-Tool-Collection/blob/951dd4cf7353f0270f630f24286ad4e677fcc6d6/data/resources/whisper-ui.json)，原用途僅 Whisper / ASR 轉錄 UI，url/repo 均空 | 原始截圖或作者、Repo |
| skillgodak-hgtv | [原 Repo](https://github.com/SkillGodAk/HGTV) GitHub API 本次仍 404；既有 Canonical 保留 2026-10-17 的歷史查核紀錄 | 原作者可存取文件或可信歷史快照；僅 UX 歷史用途，不推薦安裝或使用不明片源 |

## 重複身分決策（不執行合併）

原始 V2 歷史確認 reverse-skill 與 irons163-orchestrate-sol-terra-luna 無 URL；後來的現行來源相同不等於早期收藏必定同一身分。保留所有原 ID、原 Tags、Concept refs、各自 Skill 入向引用；詳見 PR #114 comment 7183922110。正式去重須取得身分決策及獨立驗收，不以相似名稱刪除資料。

## 已合併 12 筆 deferred 的補證據工作佇列

- microsoft-ai-agents-for-beginners：固定版本其餘課程逐章學習與練習。
- infiniflow-ragflow：新核心 ingestion、檢索、引用與授權契約。
- toeverything-affine：BlockSuite、同步、存儲、權限與授權。
- orca：固定版本 Worktree、Agent 及遠端權限、程序清理。
- hindsight：固定版本記憶引擎、授權與刪除契約。
- anomalyco-opencode：角色與工具核准程式及測試。
- hermes-snyk-plugin：新插件及外部掃描器契約。
- rea：唯讀驗收／錯誤契約核心實作、完整授權。
- designed-to-scale：可讀互動章節、練習及原始碼。
- stitch-mcp：正式 Setup 文件、即時 Schema、服務端版本及權限。
- land-book-design-inspiration：官方全文、個別作品與授權。
- particles-casberry：官方全文、輸入與匯出契約。

Batch 82–83 新增 3 deferred 候選（reverse-skill、irons163-orchestrate-sol-terra-luna、wellmade）；另 reverse-skill-2 局部 mapped 候選。合併後預計 282/286 已審查（267 完成對應、15 deferred），4 筆原始來源阻塞。不可將 282/286 稱作深度完成。第三方皆未實測。
