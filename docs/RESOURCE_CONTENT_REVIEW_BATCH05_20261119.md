# Phase 2 Resources Batch 05（2026-11-19）

## 範圍
- 官方上游 README／專案指引查核 **20 個不同的既有 Resources**，保留既有正確 Purpose／Recommendation，只增補官方文件支持的主要功能、使用前提與限制。
- 只更新 Canonical Resource 20 筆、由 Canonical 派生的 Catalog 和 Graph，以及本報告；原始 Tags、Category、所有 Typed References 和既有 IDs 不變。
- 全庫 549 筆、270 Resources 不變；沒有新增 Tag、Graph Edge、Concept、Skill 或其他 Entity。
- Source Reviewed 不代表第三方 Build、Runtime、Integration、Security 或 License 已檢驗。

## Before／After
每列列出「功能／使用前提／限制」三個欄位改善前後的項目數：

| # | Resource | Before → After | 本批補充的主要限制 | 官方上游 |
|---:|---|---|---|---|
| 1 | `hindsight` | 0/0/0 → 2/2/2 | README Benchmark 是作者測量，非自身環境保證 | [來源](https://github.com/vectorize-io/hindsight/blob/main/README.md) |
| 2 | `hirakujira-pokeep` | 0/0/0 → 2/2/2 | 自動化手機操作須遵守遊戲服務條款 | [來源](https://github.com/hirakujira/Pokeep/blob/main/README.md) |
| 3 | `ice1187-tw-security-and-ctf-resource` | 0/0/0 → 2/2/2 | 外部活動連結與日期可能過期 | [來源](https://github.com/Ice1187/TW-Security-and-CTF-Resource/blob/main/README.md) |
| 4 | `impeccable` | 0/0/0 → 2/2/2 | 美學規則無法替代產品需求與人工設計判斷 | [來源](https://github.com/pbakaus/impeccable/blob/main/README.md) |
| 5 | `jakeschincariol-day-trader-skill` | 0/0/0 → 2/2/2 | 回測績效不代表未來獲利 | [來源](https://github.com/Jakeschincariol/day-trader-skill/blob/main/README.md) |
| 6 | `jit-learning-loop` | 0/0/0 → 2/2/2 | Agent 直接代做可能繞過學習目標 | [來源](https://github.com/cyyeh/jit-learning-loop/blob/main/README.md) |
| 7 | `jub0t-concat` | 0/0/0 → 2/2/2 | README 將部分功能標為開發或待驗證 | [來源](https://github.com/jub0t/Concat/blob/main/README.md) |
| 8 | `kerr20801-taiwan-stock-ai-analyzer` | 0/0/0 → 2/2/2 | 模型預測不保證獲利 | [來源](https://github.com/kerr20801/taiwan-stock-ai-analyzer/blob/main/README.md) |
| 9 | `lawpowen-ui-design-codex-bundle` | 0/0/0 → 2/2/2 | 不會也不應複製另一台電腦的 Token 與設定 | [來源](https://github.com/lawpowen/agent-skills/blob/main/codex/bundles/ui-design.md) |
| 10 | `laya` | 0/0/0 → 2/2/2 | 作者 Benchmark 不能替代正式的獨立驗證 | [來源](https://github.com/NandhaKishorM/laya/blob/main/README.md) |
| 11 | `leemysw-yovoice` | 0/0/0 → 2/2/2 | 本機模型品質受語言及硬體影響 | [來源](https://github.com/leemysw/yovoice/blob/main/README.md) |
| 12 | `lemomo-ai-lemo-opuscar` | 0/0/0 → 2/2/2 | 創作可能消耗大量 Agent Token 與時間 | [來源](https://github.com/lemomo-ai/lemo-opuscar/blob/main/README.md) |
| 13 | `leonxlnx-taste-skill` | 0/0/0 → 2/2/2 | 過時的 Skill 名稱可能指向已移動的其他 Repo | [來源](https://github.com/Leonxlnx/taste-skill/blob/main/README.md) |
| 14 | `lieflat-less-ai-tone` | 0/0/0 → 2/2/2 | README 標示 CC BY-NC 4.0，商用前需另行授權 | [來源](https://github.com/larashero3-dotcom/lieflat-less-ai-tone/blob/main/README.md) |
| 15 | `loopagentteams` | 0/0/0 → 2/2/2 | Repo 含改造過的上游 Skills 副本，不能無差別替換 | [來源](https://github.com/ouob-tw/LoopAgentTeams/blob/main/README.md) |
| 16 | `lucasmarkes-hairline` | 0/0/0 → 2/2/2 | 裝飾性圖形不能替代重要資訊文字 | [來源](https://github.com/lucasmarkes/hairline/blob/main/README.md) |
| 17 | `madebypan-figcc` | 0/0/0 → 2/2/2 | 本機 Bridge 的 Token 與權限須妥善保護 | [來源](https://github.com/madebypan/FigCC/blob/main/README.md) |
| 18 | `makecindy-cindy` | 0/0/0 → 2/2/2 | 跨裝置模型請求可能經過 Cindy 服務及供應商 | [來源](https://github.com/makecindy/cindy/blob/main/README.md) |
| 19 | `mattpocock-skills` | 0/0/0 → 2/2/2 | Skills 是工作方法，不保證任何程式正確 | [來源](https://github.com/mattpocock/skills/blob/main/README.md) |
| 20 | `microsoft-tokeneconomizer` | 0/0/0 → 2/2/2 | README 的節省比例是作者實驗，不能當成所有環境的保證 | [來源](https://github.com/microsoft/TokenEconomizer/blob/main/README.md) |

## 與來源不符者不強行補寫
- `hkuds-vimax` 上游 README 查詢失敗、`littlehole2025-token-saver` 的 README 內容不足，未將兩筆標示為 Source Reviewed；待後續來源檢查。
- 對於第三方軟體、財務模型及聲音複製工具，都保留獨立的權限、風險、授權與隱私限制。

## 驗收與證據邊界
- 於 PR CI 中檢查 Unified Intake Gate、V2 Data Validate、P1 Graph Unit Tests，合併後再核對 Catalog／GitHub Pages／Live Smoke。
- 不執行外部來源的安裝、模型呼叫、付費操作或憑證存取。
