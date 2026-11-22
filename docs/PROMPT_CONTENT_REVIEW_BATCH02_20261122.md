# Prompts Phase 2 — Batch 02（第 21–35 筆）逐筆審查

2026-11-22（Asia/Taipei）｜Base `8d3c3878ff984fc53f87ba790266645a2de71279`｜Branch `prompt-content-batch02-20261122`

## 範圍／保存

- 第 21–35 筆，15/15 Canonical 已進行內容整理：**13 新 Guide、14 新 Intake Review、1 份既有 STAR Guide 保留、Stepwise Guide 補獨立 Adapted 版**。
- `prompt`、`originalSharedText`、`originalUserInput`、`originalUserNote`、Tags、分類、來源與 Typed Refs 皆原樣保留。部分原有 prompt 本來就是依社群截圖改寫的版本，不能認定為社群作者逐字原文；改良版獨立並標明來源狀態。
- 已實際閱讀上游 [cursor/pstack create-verification-skill SKILL.md](https://github.com/cursor/plugins/blob/main/pstack/skills/create-verification-skill/SKILL.md)，包括 Launch／Doctor／Drive／Evidence／Cleanup；但 **沒有實際操作 Todo App**。source-checked 只代表上游方法文件已讀，非 Runtime／授權完整查驗。
- 其餘 14 筆為 provided-material，沒有在本批完整查清外部作者、授權、Runtime。所有模型案例均標 `NOT_TESTED`，人工範例不可冒充模型產出。

## 逐筆 Input／Output／Gate

| # | ID | Source tier | Input | Output | Risk / Gate |
|---:|---|---|---|---|---|
| 21 | `knowledge-vault-session-handoff` | provided-material | 專案規範與 CI 證據 | 決策／失敗／下一步可追溯 | 未讀文件不聲稱已讀；Hook 需核准 |
| 22 | `mermaid-happy-error-path-code-test-evidence-audit` | provided-material | 程式與測試來源 | 正常／異常 Mermaid＋Trace | 未實作邏輯不補造 |
| 23 | `multi-agent-content-pipeline-orca` | provided-material | 可用模型、額度、資料邊界 | 角色、成本、Fallback、Review | 不能冒稱 Reviewer 已呼叫 |
| 24 | `portfolio-case-study-storytelling-presentation` | provided-material | 專案與本人貢獻證據 | 兩種口說長度＋追問 | 未量測 Impact 不捏造 |
| 25 | `pstack-create-verification-todo-persistence-example` | source-checked* | 隔離 Todo App 與測試權限 | 新增／Reload／唯一筆數證據 | 未執行持久化測試 |
| 26 | `role-reversal-meta-prompt-generator` | provided-material | 目標、限制、輸出 | 可複製 Meta Prompt＋自檢 | 角色扮演不越權 |
| 27 | `single-file-svg-motion-prototype` | provided-material | Logo／圖表素材、時間軸 | 單檔 HTML 與無障礙驗收 | 未跑 Browser 不標 PASS |
| 28 | `sol-astra-end-user-ui-critique` | provided-material | 畫面、User Journey、Reviewer 能力 | UI Brief／原始意見／差異 | 不能偽造 Astra 意見 |
| 29 | `star-resume-experience-three-rewrites` | provided-material | 履歷事實 | 保留原 Guide，補 Intake | KPI、領導成果不可編造 |
| 30 | `stepwise-ai-work-delegation-discovery` | provided-material | 重複工作目標與流程 | 保留 Guide，補獨立 Adapted | 未確認邊界不得操作或排程 |
| 31 | `tradingview-twstock-rsi-volume-pine-indicator` | provided-material | 標的、RSI、前期均量 | Pine 指標草案與編譯規格 | 不可使用當根均量或未來資料 |
| 32 | `tradingview-twstock-signal-to-backtest-audit` | provided-material | 交易規則、行情、費用 | strategy 回測與樣本外規格 | 未有實測資料不能造績效 |
| 33 | `ui-dissatisfaction-question-by-question` | provided-material | UI 畫面、使用者回覆 | 單題訪談與根因分析 | 未核准不能修改 UI |
| 34 | `web-mcp-existing-systems-skills-design` | provided-material | 系統清單、API／權限 | MCP Tool／Skill 權限矩陣 | 金鑰與寫入需保護／核准 |
| 35 | `weekly-ai-headhunter-job-search` | provided-material | 履歷、職缺來源、排程工具 | 候選職缺與去重報告 | 未搜尋或建排程不可稱完成 |

## 全庫驗收與變更

- 所有 **35/35** Prompt 應有 Guide、Intake Review、原始版、獨立可重用版及明確 `NOT_TESTED`。
- `scripts/test-prompt-guides.mjs` 由前 20 筆擴大到 35 筆：原文／Adapted 獨立、變數宣告、組合契約、Source Status／NOT_TESTED；新增 pstack、Astra、TradingView、排程、Stepwise 安全回歸。
- Browser 新增七種代表情境的原始／改良版切換一致性，保留 375px 檢查。
- 全庫仍應維持 270 Resources／123 Skills／68 Concepts／35 Prompts／17 Combinations／36 Workflows；Graph 569 Nodes／1816 Edges。新建正式 Graph Edge：0。
- **本文件撰寫時 PR CI／main CI／Pages Deploy／Live Smoke 尚未驗收，狀態為 PENDING，不得聲稱 PASS。**

## 未測與後續

- Prompt 實際模型輸出品質、Trigger／Functional／Trajectory、Baseline／Candidate 配對測試、外部整合及完整授權查核未做。
- TradingView Pine 編譯、行情與策略回測；Todo Reload；SVG 瀏覽器；真正 Sol/Astra 跨模型 Review；職缺開放查核與排程均未實測。
- 必須逐一保留案例失敗、改進與回歸證據，CI PASS 只能證明 Repo 契約驗收，不代表外部模型或工具有效。
