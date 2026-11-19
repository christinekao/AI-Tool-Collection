# Concept 與 Capability 候選關聯紀錄（2026-11-19）
> 僅作為後續查核佇列；**本輪不新增、不移除任何正式 Concept／Workflow／Combination Typed Reference**。

| Capability | 已存在樣本 | 後續查核 |
|---|---|---|
| point-in-time-retrieval | resource:hermes-backsearch | 核對現有 Concept `point-in-time-retrieval` 的語意、資料截點與回測洩漏條件 |
| usage-monitoring | resource:tip31812-ai-usage-bar | API/Provider 資料口徑、憑證、安全；確認是否需要獨立 Concept |
| workflow-automation | resource:n8n-io-n8n | Trigger、I/O、Connector、權限及副作用，不能只因名稱有 Workflow 就建立連結 |
| resume-review | skill:alexyc9381-hiring-panel | 模擬 ATS 與真實 ATS 差異、資料來源與產出品質 |
| resume-rewriting | skill:alexyc9381-hiring-panel、prompt:star-resume-experience-three-rewrites | 相同能力標籤不代表可直接替換 Skill 和 Prompt |
| learning-progress-analysis | skill:akas333-tysa-axiom-learn | 資料輸入、唯讀權限、學習紀錄代表的證據層級 |
| risk-performance-analysis | prompt:ibkr-weekly-risk-adjusted-performance | 計算口徑、資料缺漏、樣本期間、是否需金融 Concept |

每筆整理紀錄：原來源／版本、Domain／Format／Capability、能力的 Input／Output／Gate、Concept 候選或既有 ID、相容性與反例、來源與 Runtime 差異、仍待核實之 Gap。驗證完整後才決定建立正式關聯或新的 Concept。
