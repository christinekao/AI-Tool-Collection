# Resource 雙層知識 Batch 41｜Claude／Cursor 生態與應用案例

3 evidence-linked 候選、9 用途、9 文件證據、3 design-only 案例；只審查集合索引，不冒充個別來源實測；Content Format 依來源校正，其他分類與關係保留。

## hesreallyhim-awesome-claude-code

- 版本 `6ac774dad266918c55b59e7118efdf6ec4b57c41`；授權 CC BY-NC-ND 4.0（清單）；外部工具各自授權
- 用途：從 Claude Code 的開發流程、記憶、測試與其他工具索引尋找適合目前問題的參考資源。
- 案例：規劃 Claude Code 專案的記憶與驗收工具選型；合成專案、跨 Session 需求與回歸測試要求 → 官方參考、記憶與測試工具候選及選型條件 → 自有開發工作流的工具研究
- 文件證據：
  - 先找官方 Agent 開發參考：README.md (From Anthropic)；清單只指向官方資料，不代表本次已重讀全部外部文件，採用前核對原始版本。
  - 尋找跨 Session 紀錄工具：README.md (Memory & Context Persistence)；項目描述不保證資料不外送或全平台相容，須逐件驗證保存與刪除機制。
  - 尋找開發驗收輔助工具：README.md (Testing)；工具清單的推薦不等於實際測試通過；需以獨立預期結果驗證。

## shubhamsaboo-awesome-llm-apps

- 版本 `14c5f8ff0094659f321801385d2b52ccc65fea3b`；授權 Apache-2.0（集合）；模型及外部 API 另查
- 用途：依 Agent、RAG、記憶與應用類型探索可作為開發起點的程式範例。
- 案例：規劃從 CSV 問答到有引用與記憶的 AI 應用原型；合成 CSV、公開文件、記憶需求及固定問題 → 入門 Agent、RAG、記憶案例的選型與對照測試規格 → 自有 AI 應用學習與原型規劃
- 文件證據：
  - 選擇最小 Agent 範例：README.md (Starter AI Agents)；單檔範例仍可能需 API key 或付費模型；未執行其程式，不能宣稱輸出正確。
  - 比較不同檢索流程：README.md (RAG (Retrieval Augmented Generation))；索引描述只用於選型；引用、拒答、資料權限與檢索品質需要另外驗收。
  - 比較跨 Session 的記憶範例：README.md (LLM Apps with Memory)；各範例的記憶隔離及資料保留方式不同，未逐個驗證；不得導入真實私人資料。

## cursor-plugins

- 版本 `41e400932eca14f289e7db717a70455256b6d388`；授權 各插件獨立授權；pstack manifest 標示 MIT；未查全庫授權
- 用途：從 Cursor 官方插件目錄挑選程式開發、文件、企業應用與 Agent 協作的擴充方式。
- 案例：規劃開發團隊的 Cursor 插件選用與治理；合成開發需求、文件任務及可用 Host → 插件候選、來源 manifest 與權限審查規格 → 自有 Agent 插件目錄與工作流程選型
- 文件證據：
  - 依 Marketplace Manifest 查找插件：.cursor-plugin/marketplace.json (plugins[] / metadata)；Manifest 是目錄資料，不代表插件已安裝、已連線或經過安全測試。
  - 選擇工程工作方式：README.md (Plugins)；同一插件集合可能有重複用途，須按任務挑選，不把名稱相近當作功能等價。
  - 核對個別插件的範圍：pstack/.cursor-plugin/plugin.json (name / version / skills / agents / license)；pstack 的 MIT 不可套到其他插件；需逐件查核 Host、權限、外部資料寫入與相依。
