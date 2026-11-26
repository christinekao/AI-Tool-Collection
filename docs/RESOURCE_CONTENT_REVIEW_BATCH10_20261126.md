# Resource 內容品質稽核 Batch 10｜20 筆（2026-11-26）

## Scope / Evidence
基於 PR #130 Head 80a65f114b10b53848d06a80c9ade1c9c29163c8。#129 已合併 4684914f68a2fb7090477e32d3fb4aa7c12e4507；#129 與 #130 四項 CI 皆 PASS，四尺寸 Browser Smoke 步驟亦 PASS。#130 已改為 main，尚待 mergeable 狀態與最新 base 核對。main 040fd4f26e8ed3e2dfa0e7ab80405dbb94611c9d 與 #129 Head 比對僅有生成 catalog 與 graph 變更。正式 deployed Chromium 未驗收。

依 main 286 個 Canonical ID 排序，讀取第 181–200 筆完整 JSON；核對 purpose、用途、案例 I/O/steps/destination、start、limits、來源範圍、Agent evidence locator/limitations/runtime。沿用既有來源，未重讀全部上游或執行第三方。

| ID | 結果 | 修正或保留理由 | 既有來源錨點 |
|---|---|---|---|
| motion-dev-animations-skill | 保留 | CSS 選型、設定驗證與實際效能區分已具體 | SKILL.md / validate_motion_config.py |
| motion-sites | 保留 | 動效參考、來源、觸控及靜態替代已具體 | motionsites.org/motion |
| motionsites-ai | 保留 | 自有需求、個別授權、同名網站區隔已具體 | 官方目錄及條款 |
| mrdoob-three-js | 保留 | 最小場景、資產、渲染與清理已具體 | Scene.js / WebGLRenderer.js / AnimationMixer.js |
| mukul975-anthropic-cybersecurity-skills | P1 修正 | 防禦需求、框架、個別選型與非官方認證 | README domains / frameworks / skill anatomy |
| n8n-io-n8n | 保留 | 合成只讀流程、授權、重送與實際寫入已具體 | workflow-execute.ts / workflow.ts |
| nanako0129-syrtis | P1 修正 | 白話額度、週期證據、同意與真實帳單界線 | agent_quota_duration.rs / agent_account_scope.rs / keychain_consent.rs |
| nirdiamant-genai-agents | 保留 | 索引、Notebook 前提與同資料比較已具體 | README notebook index |
| nutlope-hallmark | P1 修正 | 白話主題、靜態掃描、退役規則及瀏覽器驗收 | theme.mjs / sloplint.mjs / refcheck.mjs |
| nvidia-auto-ontology | P1 修正 | 入門與三用途改為完整情境；資料目錄、識別、lineage 與獨立指標驗收 | catalog/extract.py / model/schema.py / sql_parse.py |
| nvidia-skillspector | P1 修正 | 入門與三用途改為完整情境；掃描覆蓋、未完成及模型外送 | input_handler.py / inspection_ledger.py / llm_analyzer_base.py |
| oh-my-mermaid | P1 修正 | 階層圖、原始碼、節點一致性與本機／雲端分離 | omm-scan / omm-view / omm-push |
| ollama-ollama | 保留 | 模型權重、硬體、串流與本機／遠端區分已具體 | api/types.go / server/routes.go |
| omniroute | P1 修正 | 白話模型目錄、快取、匹配與實際可用性區分 | catalog-freshness.ts / cache.ts / model-filter.ts |
| onetake | P1 修正 | 白話前後畫面與連續性、非商業授權及人工觀看 | frame_diff.py / verify_promo.py / probe.py |
| onyx | P1 修正 | 入門與三用途改為完整情境；ACL、檢索及引用原文驗收 | access_filters.py / pipeline.py / citation_processor.py |
| open-webui-open-webui | 保留 | 端點、管理者、使用者清單與真實推論已具體 | ollama.py / openai.py |
| openai-codex | 保留 | 基準、限定檔案、核准、差異與背景工作已具體 | protocol.rs / exec.rs |
| openai-codex-security | 保留 | 授權掃描、威脅模型、修補及回歸已具體 | 官方產品文件 |
| openchatx | P1 修正 | 白話載入去重、指定環境欄位、Context 警示及隔離界線 | load-deduper.ts / child-environment.ts / context-budget.ts |

## Change Integrity / Verification
- 20/20 已讀取，10 筆候選修正、10 筆保留。readerGuide.start 10 筆、purpose 5 筆，另改 3 筆資源共 9 個 useCase.detail，使原有片段描述具體化。逐筆還原允許欄位後完整 JSON 一致；保留 useCase IDs、refs、所有 example、來源、Evidence、分類、Tags、Typed References、Graph 關係及 mapping/runtime 狀態。
- 新增 10 筆單元與瀏覽器文字回歸，檢查三筆完整用途輸出及 SkillSpector 零 findings 非安全保證；四項 CI 通過才合併。
- 未重新查證時效性資料、未執行第三方；部分其他片段式 detail、重複 limits 與歷史措辭留 P2。未修改既有課程或分類架構。

## Progress / Next
- 起始正式審查 160/286，含 #130 及本批候選累計 200/286；映射基準 268/286、14 deferred、4 source-blocked 不變。下一批 openclaw-openclaw 起，依 main 確認第 201–220 筆。
- 依序完成 #130 合併、本批指向 main、CI、Catalog Sync、Pages 及獨立正式網站 Chromium 驗收。
