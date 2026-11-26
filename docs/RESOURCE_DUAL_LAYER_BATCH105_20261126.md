# Batch 105｜irons163-orchestrate-sol-terra-luna 歷史身分與候選來源（2026-11-26）

## 身分判定

原始 V2 無 URL、Repo；舊路徑 API 回傳 Moved Permanently 至 Repository ID 1321139753，現行 Repo 同 ID；mj-siew 同名候選為另一 ID 1320148269。現行重新導向已核對，但早期收藏譜系與引用遷移未核准。

- [原始 V2](https://github.com/christinekao/AI-Tool-Collection/blob/951dd4cf7353f0270f630f24286ad4e677fcc6d6/data/resources/irons163-orchestrate-sol-terra-luna.json)
- 現行候選：`irons163-three-tier-agent-orchestrator`；固定版本 `86108395a5df3743b9e2b7d0499ef4319bc7494a`，僅作對照，不是舊收藏身分證明。
- 保留原 ID、分類、Tags、引用、既有證據；不新增別名、不刪除、不遷移引用，維持 deferred。

| 證據 | 核心知識 | 限制 |
|---|---|---|
| [candidate-explicit-invocation](https://github.com/irons163/three-tier-agent-orchestrator/blob/86108395a5df3743b9e2b7d0499ef4319bc7494a/agents/openai.yaml#L1-L7) | 候選 Skill metadata 明示不允許隱式啟用；工作流須經明確要求。 | 設定文件不證明客戶端實際遵守；非舊版身分證據。 |
| [candidate-isolated-delegation](https://github.com/irons163/three-tier-agent-orchestrator/blob/86108395a5df3743b9e2b7d0499ef4319bc7494a/SKILL.md#L95-L114) | 候選文件要求明確目標、背景、範圍、禁止事項、驗收、回報與工具授權；互斥寫入或循序／隔離工作區，避免共用操作狀態衝突。 | 僅程序性要求，未啟動子代理、測試權限或驗證隔離；非舊版證據。 |
| [candidate-coordinator-acceptance](https://github.com/irons163/three-tier-agent-orchestrator/blob/86108395a5df3743b9e2b7d0499ef4319bc7494a/SKILL.md#L122-L132) | 候選文件要求主線核對實際 diff、檔案與測試，解決矛盾並執行整合驗收；代理摘要不是最終批准。 | 僅文件層，未驗證模型、工具、執行成效或成本。 |

## 讀者應用

驗收候選代理啟用、委派隔離與主線責任：自有合成工作計畫中分離明確啟用、能力預檢、最小必要背景、互斥寫入、直接證據及主線整合；不啟動代理，保留歷史名稱與候選來源差異。

## 待解

取得原始收藏證據；若核准受控別名或整併，再遷移引用與驗收；不以候選模型名稱推論可用性。

第三方、上游測試未執行。
