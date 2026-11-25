# Resource 雙層知識 Batch 35｜工程角色與驗收指引

共同驗收基線 `fde96af41f63a655290afd95879f188d83167383`；Batch 29–35 集中同一 PR，逐組保存紀錄，不把候選計入已合併。

## michael-denyer-pstack-claude

- 版本 `103a68d9a9aa23759d00ad95b01cb78cb8f57772`；授權 MIT；另附不同來源授權，逐件核對
- 用途：把 pstack 的工程工作指引移植到多種 Coding Agent，讓 Agent 依任務選擇工作方式並建立真正可操作的驗收流程。
- 案例：規劃跨 Claude Code 與 Codex 的專案驗收技能；合成 UI 或 CLI 專案、預期行為與兩種 Host 的工具清單 → Host 對應表、專案驗收 Skill 規格與行為測試 → 自有 AI Cowork 的跨 Host 驗收工作流
- 局部文件證據：
  - 按任務及 Host 選擇工程工作方式：plugins/pstack/skills/poteto-mode/SKILL.md (README.md)；各平台映射分開，不將一種 Host 的工具名稱套到另一種；避免重複安裝技能。
  - 建立專案專屬的實際操作驗收：plugins/pstack/skills/create-verification-skill/SKILL.md ()；先查 repo 啟動、隔離與證據；不能在未核准的使用者真實 Session 中雙重操作。
  - 確保測試驗證外部行為而非內部實作：plugins/pstack/skills/principle-test-behavior-not-implementation/SKILL.md ()；測試須在行為破壞時失敗、僅內部變化時保持通過；實際測試仍須另行執行。

## cursor-pstack-poteto

- 版本 `41e400932eca14f289e7db717a70455256b6d388`；授權 MIT（harness/pstack/claude-code/LICENSE）；其他插件另查
- 用途：以 pstack 的角色化工程指引協助決定何時先做架構設計、用子 Agent 探索或建立實際操作驗收。
- 案例：規劃複雜功能的架構選型與實際操作驗收；合成需求、既有程式資料模型與可測試的應用入口 → 兩種設計比較、確認的資料責任邊界與驗收 Skill 規格 → 自有開發規格、程式架構與交付驗收
- 局部文件證據：
  - 依問題選擇工程指引：harness/pstack/claude-code/skills/poteto-mode/SKILL.md (harness/pstack/README.md)；Claude Code 生成樹需要對應 adapter，不能假設 Cursor 工具直接可用；任務路由不代表已執行。
  - 先比較資料與模組設計：harness/pstack/claude-code/skills/architect/SKILL.md ()；每個 state 應有清楚 owner；大型爭議設計需另做比較，不以草圖取代可執行測試。
  - 以實際應用入口建立驗收：harness/pstack/claude-code/skills/create-verification-skill/SKILL.md ()；優先使用既有測試工具，不能雙重驅動共享實例；缺環境時如實報告，不製造成功證據。

## agency-agents

- 版本 `8ae6164602c95ca78828b148b9052460ee426885`；授權 MIT（角色集合）；獨立桌面 App 另查
- 用途：從不同職能的 Agent 角色範本挑選適合的工作指引，指定輸出、品質要求與審查尺度。
- 案例：規劃資料管線與儀表板的跨角色交付審查；合成資料來源、管線需求、圖表問題及程式差異 → 資料品質規格、視覺設計規格與程式審查問題 → 自有 Data 與 BI 專案的角色分工
- 局部文件證據：
  - 按資料工程角色設計可靠管線：engineering/engineering-data-engineer.md ()；角色文字並非實際 pipeline 或技能認證；須用合成資料測試重跑、Schema 漂移及資料缺漏。
  - 依問題選擇正確圖表與呈現：engineering/engineering-data-visualization-engineer.md ()；圖表必須與實際資料與問題相符，需核對座標及色彩；角色描述不能保證圖表正確。
  - 以角色審查功能正確性及風險：engineering/engineering-code-reviewer.md ()；僅建議，不代表合併核准；必須對應實際檔案與測試，不能採信角色虛構的經驗敘述。

3 evidence-linked；三筆均以實際 Skill／角色集合校正 Content Format 候選；9 用途、3 design-only 案例。第三方未實測；共同 PR CI 待驗收。
