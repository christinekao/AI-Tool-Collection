# Phase 2 Skills — Session Handoff

> Main-first：每次接手先查 GitHub main／現有 PR／Actions，再讀 [AGENTS.md](../AGENTS.md)、[Unified Intake Policy](UNIFIED_INTAKE_POLICY.md)、[Skill Spec](SKILL_RESOURCE_SPEC.md) 和 [Batch 01 審查](SKILL_CONTENT_REVIEW_BATCH01_20261121.md)。不可把 PR 的工作進度當成 main 已合併。

## Batch 01（2026-11-21，待 PR／CI／Merge 驗收）
| 指標 | 快照 |
| --- | --- |
| Repository | `christinekao/AI-Tool-Collection` |
| 前階段 Resources | **270/270** 已合併，來源缺口依 Resource Handoff 保留 |
| Skills 總量 | **123** |
| 本批候選 Skills | **20**；若 PR 成功合併則 **20/123（16.3%）**，剩 **103** |
| 基準 Main | `31a3f888249803137d674b15f0e45ccc03d188c2` |
| Working Branch | `skill-content-batch01-20261121` |
| Source Evidence | 20/20 已閱讀上游官方 README／SKILL.md；**第三方 Runtime／Security／License／Integration NOT TESTED** |
| Guide 完整度 | 新建 18 份、保留既有 2 份；所有 20 筆記錄 Trigger／Input／Execution／Output／Risk／Gate |
| 不可變項 | 原 ID／Title／Category／Raw Tags／Domain／Typed References 不動；569 Graph Nodes／1816 Edges |
| 交付 Scope | 20 Canonical Skills + Generated Catalog／Graph + P1 Graph Tests CI Workflow（補 Skills 觸發）+ [Batch 01 報告](SKILL_CONTENT_REVIEW_BATCH01_20261121.md) + 本 Handoff + Resource Handoff 的跨階段索引 |
| PR／CI／Deploy | 首版 Gate 有 Capability 宣告不一致，已保留 Mapping 修復；原 P1 CI 缺少 Skills 觸發已補齊。**仍待最新 Head 完整驗證** |

**本批 IDs**：
1. `acheaisuiyimen-ache-life-to-comic-skill`
2. `addyosmani-agent-skills`
3. `agricidaniel-claude-seo`
4. `akas333-tysa-axiom-learn`
5. `akseolabs-seo-cinematic-ui`
6. `alchaincy-huashu-design`
7. `alchaincyf-huashu-motion-skill`
8. `alexyc9381-hiring-panel`
9. `allanyiin-documa-codegraph`
10. `allanyiin-documa-evidence`
11. `allanyiin-documa-maintenance`
12. `allanyiin-documa-skill-loader`
13. `allanyiin-toolanything-mcp-router`
14. `allanyiin-toolanything-platform-ops`
15. `anthropics-claude-api-prompt-audit`
16. `anthropics-single-agent-loop`
17. `ayueh0102-ronnier-skill`
18. `baoyu-skill`
19. `blader-humanizer`
20. `blogger-distiller`

**關鍵風險**：Claude SEO 官方 Skill 現行 `2.6.2`、Humanizer 現行 `4.0.0`；原有舊版 Guide 不直接當成新版實測。ToolAnything Platform Ops 與 Documa Maintenance 是高權限操作資料；禁止自動安裝、存取 API Key、改寫 AGENTS 或外傳私人資料。

**下批開始條件**：此 PR 真正合併後先核對主分支版本、CI、Catalog Sync、Pages 與 Live Smoke，然後選取 `data/skills/` 的第 21–40 個檔案，生成 `docs/SKILL_CONTENT_REVIEW_BATCH02_YYYYMMDD.md` 和更新本 Handoff；不重複已處理 20 個 Skill ID。

