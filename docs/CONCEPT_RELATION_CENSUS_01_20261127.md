# Knowledge Relationship Census 01｜全庫結構盤點與優先證據審查（2026-11-27）

基準 main 12b337de4b6e56d33555090063a49e9ab0116e8f（Review 01–03 已正式合併）。Resource 286／286 內容審查完成；#137 主線 P1 45792186860、Pages 45792185579、Live Smoke 45792186980 PASS，job 139813711631 記錄「deployed catalog matches all six canonical collections」286/123/68/35/17/36（attempt 1），後續正式站 Chromium PASS。Review 02 #138、Review 03 #139 均為純文件，依 path filters 無適用 PR CI，已確認各僅一份報告後合併；文件版 Pages 另確認。

## 1. 不混淆三種驗證

- **結構盤點**：565 個六類 Canonical 紀錄、所有涉及 Concept 的 explicit Typed Reference（含 nested fields）。利用既有 Graph Builder，對同一方向、同一對 ID 的多個欄位計為一組，同時保留原路徑。單向、反向、雙向和無直接關聯各自可查。
- **語意證據**：來源的可觀察機制、輸入輸出、失敗邊界能否支持 Concept。ID 合法、Tag 相似、Resource local mapping PASS 都不能證明 Concept 關聯成立。
- **執行證據**：API、模型、工具真正互通與安全／授權，另行驗證；本輪沒有執行第三方。

新增只讀 `scripts/audit-concept-relations.mjs`，與現有 `scripts/audit-knowledge-relations.mjs`（Combo/Workflow）分工，不重做既有 Audit06–08。執行 `node scripts/audit-concept-relations.mjs` 得總數及審查佇列，`--details` 得每個 Concept/Resource 與原始引用路徑。既有 Graph CI 新增正負例與全庫一致性測試，記錄 `CONCEPT_RELATION_CENSUS`。本提交前未取得 CI 實際統計，不能把盤點程式存在當成已完成全庫數量驗收。Graph JSON 超出 Connector 直接讀取大小，不新增寫入權限、不直接修改 Graph。

## 2. 優先審查全部 18 筆既有來源缺口

原 #137 計數為 178 mapped、90 evidence-linked、14 deferred、4 source-blocked。Review 01–03 已局部對照 18 筆 Resource，其中 hindsight、orca、rea 為 deferred；本輪實際讀取其餘 11 deferred＋4 source-blocked 的 Canonical source、features、conceptRefs、agentEvidence、gap/nextAction，累計 33 個不重複 Resource 局部證據個案。18 個來源缺口全數納入此輪關聯優先佇列，但未修復全部來源或重跑上游。

| Resource ID | 既有／候選 Concept；來源依據 | 處置與缺口 |
|---|---|---|
| anomalyco-opencode | 無出向 conceptRefs；README plan/build/general、子 session 規則、shell 拒絕與 MCP 入口 | 候選 agent-runtime-harness、security-as-workflow-gate；角色繼承與全部入口授權未證，待覆核，不升格 |
| designed-to-scale | 無出向 conceptRefs；作者作品集描述快取、分區、一致性、非同步 | 課程本體尚未擷取；不強制匹配 Agent Concept，待取得教材；單一來源不足新建系統設計概念 |
| hermes-snyk-plugin | 既有 security-as-workflow-gate、quality-gates-verification；config/choose/review evidence | 靜態插件、掃描選擇及覆核契約支持局部對照；不等於所有掃描器、即時 schema、外送及安全放行驗證 |
| infiniflow-ragflow | 既有 retrieval-grounded-knowledge-layer、context-governance、quality-gates-verification；README chunking/citations、局部 DAO 與權限測試 | 支持檢索原理局部；完整 parser→index→retrieval、引用正確性與治理範圍缺口保留 |
| irons163-orchestrate-sol-terra-luna | 既有 vendor-agnostic-orchestration、capability-cost-routing；舊 Repo redirect ID 與候選 roles/accept 文件 | 角色／成本原理可研究，早期收藏身分未核實；不合併、改名或遷移 ref |
| land-book-design-inspiration | 無出向 conceptRefs；官方索引 filter/page/quality | 候選 reference-application-pattern-mining；目錄篩選不等於已萃取或可重製作品，403/作者/授權待查 |
| particles-casberry | 既有 explicit-visual-system、motion-interaction-layer；索引 visual/density/export | 支持參數與互動概念的局部文件，未取得實際輸出、效能或授權；不升格 |
| reverse-skill | 既有 reusable-agent-skills；歷史原始 V2 無來源、候選 case-review Skill | 只支持候選實作原理；同名同 URL 不足以證明原收藏身分，保留兩筆 |
| stitch-mcp | 既有 explicit-visual-system、design-to-code-loop；SDK tools/screen/review | MCP 可探索、產出畫面契約局部支持 design-to-code；無實際設計迭代或服務端版本／授權證據 |
| toeverything-affine | 無出向 conceptRefs；documents-canvas/local-collaboration/hosting-license，局部 update merge/auth | Local-first 協作不等於敏感資料遮罩；可能研究版本衝突／合併原理，但仍缺 client 同步與獨立第二來源，不新增 Concept |
| wellmade | 既有 explicit-visual-system、reference-as-prompt-evidence；taxonomy/select/credit 索引 | 可作參考來源，目錄不等於明確設計規則或 Prompt evidence；待核對個別作品 |
| codex-router | 既有 vendor-agnostic-orchestration、capability-cost-routing | 原收藏名稱不唯一；兩條既有 ref 不代表找到原產品，維持 source-blocked |
| skillgodak-hgtv | 既有 reference-application-pattern-mining | 歷史 README/Release 記錄，原 Repo 404；可作歷史 UX 例，不能當現行可用工具 |
| viral-hook-title | 既有 content-production-pipeline | 原始通用 Skill 名稱不唯一，不能以相近候選當已核實來源 |
| whisper-ui | 既有 content-production-pipeline、quality-gates-verification | 原始截圖／Repo 缺失，候選 UI 不證明原收藏的轉錄驗收功能 |

此前三筆保留判定：hindsight（記憶、反思局部；跨 Harness 移植待驗）；orca（取消、程序終止、Git 清理分開；端到端未測）；rea（錯誤契約、客戶端驗收、義務結案；全入口實作未證）。詳細證據見 Review 01–03。

## 3. Gap Analysis：先不增加 Concept

- 4 筆本輪無 Resource 出向 conceptRefs 不等於無反向引用；需待 census。課程或靈感庫也可以有獨立 Resource 價值，不強迫每筆建立 Concept。
- 4 筆 source-blocked 均已存在出向 Concept refs，這正顯示「有關聯」與「來源證實」不同，不自動提升 mapping 或 runtime。
- AFFiNE 的 local-first 協作可能涉及 CRDT、同步衝突及狀態合併，不應硬塞進 local-first-sensitive-data-processing 或跨 Agent 共享記憶；尚未有足夠兩個獨立來源及完整可重現機制，記為待研究而非新增 ID。
- 原有 68 個 Concept 保留；優先檢查無直接關聯、單一來源、來源身分缺失及跨產品泛化過度的關聯。不得以機械計數提出刪除。

## 4. 下一階段與驗收

取得全庫 census 的 CI 實際收據，依 queues 切成「Resource 無直接關聯」「Concept 無 Resource 來源」「有關聯但來源 deferred/blocked」「已具 source evidence 仍待語意對照」。全庫入向／出向涵蓋 Resource、Skill、Prompt、Combination、Workflow、Concept，Problem curated links 不列本次分母。除既有 33 個局部證據個案外，尚有 253 Resource 待此階段語意審查；不宣稱所有現存邊已逐條驗證。沒有更動 Canonical、Graph、Schema、Tags、權限或網站功能。
