# Resource 雙層知識 Batch 31｜工具契約與文件知識

共同驗收基線 `fde96af41f63a655290afd95879f188d83167383`；Batch 29–35 集中同一 PR，逐組保存紀錄，不把候選計入已合併。

## allanyiin-toolanything

- 版本 `16b9f0f9eb6947540a54594a148f1cd32860e287`；授權 MIT
- 用途：把同一份 Python 工具定義提供給 MCP、OpenAI tool calling 與 CLI，避免每個介面重寫一次契約。
- 案例：規劃企業查詢工具的跨協議契約；合成 Python 查詢函式、輸入欄位及核准的測試資料 → 工具 Schema、跨介面呼叫契約與診斷測試 → 自有企業整合與 MCP 工具層
- 局部能力及證據：
  - 統一註冊工具定義：src/toolanything/core/registry.py (ToolRegistry,register,get_tool_contract)；工具註冊不代表已授權執行；檢查重複名稱、執行政策與副作用。
  - 從 Python 類型建立輸入契約：src/toolanything/core/schema.py (build_parameters_schema,python_type_to_schema,to_openai_strict_schema)；Schema 合法不等於業務規則正確；另測錯誤參數與各 Host 相容性。
  - 將工具暴露給 MCP：src/toolanything/adapters/mcp_adapter.py (MCPAdapter,to_schema,to_invocation)；modern discovery 與 legacy initialize 需按版本測試；HTTP、SQL 及外部工具的權限另審。

## allanyiin-documa

- 版本 `a40469484205ef8b0cddee96ee08e59cfa4a5962`；授權 MIT；內含原生元件授權另查
- 用途：把長文件轉成有章節、段落、表格與頁碼的資料，讓 Agent 先找證據再讀取相關片段。
- 案例：規劃長文件知識庫的逐步閱讀與引用；合成 PDF、Word 與已知證據頁碼及問題 → 文件結構、限定內容片段、可回查引用及驗證結果 → 自有知識庫與文件問答流程
- 局部能力及證據：
  - 建立統一文件結構：src/documa/core/ir.py (DocumentIR,BlockIR,PageIR,RelationIR)；解析品質及順序因格式而異；須以原文件圖表、頁碼、段落核對，不假定完整。
  - 只讀取問題需要的文件片段：src/documa/core/reading.py (bounded_window,boundary_end)；索引與讀取不呼叫 LLM 不代表主模型零 Token；有界讀取可能漏掉前後條件。
  - 將答案回溯到文件證據：src/documa/interfaces/citation.py (cite_block,cite_chunk,verify_citations)；引用存在不等於語意支持結論；另核對原文及表格，不能用存在性驗證替代事實查核。

## yusufkaraaslan-skill-seekers

- 版本 `15a67e3c1e7ceb6c63b88f9f3fe480d7b547fe22`；授權 MIT
- 用途：把技術文件、Repo 或其他資料整理成可供 Agent 使用的知識包，再依平台輸出 Skill 或 RAG 資料。
- 案例：規劃公開技術文件的知識包製作；核准的公開文件網址、固定來源版本及目標 Agent 平台 → 來源辨識結果、知識資料包與平台封裝 → 自有 AI 教材與可維護知識資產
- 局部能力及證據：
  - 辨識資料來源類型：src/skill_seekers/cli/detect_command.py (DetectCommand,execute)；先核對來源身分、授權與實際格式；不因辨識成功就認定可合法擷取。
  - 將來源轉成結構化知識：src/skill_seekers/cli/create_command.py (CreateCommand,_route_to_scraper,_build_config,_run_enhancement)；AI enhancement 可能呼叫模型，私有資料、網路、費用需核准；驗證原文與覆蓋。
  - 依不同平台封裝輸出：src/skill_seekers/cli/package_skill.py (package_skill,main,_confirm_packaging)；封裝成功不等於平台已上傳或可執行；auto-upload 為獨立外部寫入，需明確核准。

3 mapped 候選；9 用途、3 design-only 案例。第三方未實測；共同 PR CI 待驗收。
