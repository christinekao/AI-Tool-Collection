# Batch 85｜Microsoft Agent 課程補證據（2026-11-26）

固定版本：`3bee2ddf8e7aab27b17ef9e1d4a3f2c541a1913e`。原 01、04、06 章保留；新增 15 個 README 章節核心段落、重點、設計練習、證據映射。00 Setup 另記記憶體知識庫及金鑰／RBAC 差異。18 章均有固定來源及練習，升級 evidence-linked（文件知識，不等於完整程式實作驗收）。

| 章 | 知識 | 練習產物 |
|---|---|---|
| [02-explore-agentic-frameworks](https://github.com/microsoft/ai-agents-for-beginners/blob/3bee2ddf8e7aab27b17ef9e1d4a3f2c541a1913e/02-explore-agentic-frameworks/README.md) | 比較 Agent Framework 與託管服務 | 架構選型表與不採用理由。 |
| [03-agentic-design-patterns](https://github.com/microsoft/ai-agents-for-beginners/blob/3bee2ddf8e7aab27b17ef9e1d4a3f2c541a1913e/03-agentic-design-patterns/README.md) | 以人為中心的 Agent 設計 | 三個介面狀態及可操作驗收條件。 |
| [05-agentic-rag](https://github.com/microsoft/ai-agents-for-beginners/blob/3bee2ddf8e7aab27b17ef9e1d4a3f2c541a1913e/05-agentic-rag/README.md) | Agentic RAG 的查詢與校正 | 查詢紀錄、來源引用與拒答規格。 |
| [07-planning-design](https://github.com/microsoft/ai-agents-for-beginners/blob/3bee2ddf8e7aab27b17ef9e1d4a3f2c541a1913e/07-planning-design/README.md) | 任務分解與重新規劃 | 帶依賴與驗收條件的任務計畫。 |
| [08-multi-agent](https://github.com/microsoft/ai-agents-for-beginners/blob/3bee2ddf8e7aab27b17ef9e1d4a3f2c541a1913e/08-multi-agent/README.md) | 多 Agent 的分工與可視化 | 角色 I/O 表與兩種架構的取捨。 |
| [09-metacognition](https://github.com/microsoft/ai-agents-for-beginners/blob/3bee2ddf8e7aab27b17ef9e1d4a3f2c541a1913e/09-metacognition/README.md) | 自我檢查與修正 | 檢查規則、重試上限與人工轉介條件。 |
| [10-ai-agents-production](https://github.com/microsoft/ai-agents-for-beginners/blob/3bee2ddf8e7aab27b17ef9e1d4a3f2c541a1913e/10-ai-agents-production/README.md) | 可觀測性與評估 | 離線驗收表、監控欄位與成本上限。 |
| [11-agentic-protocols](https://github.com/microsoft/ai-agents-for-beginners/blob/3bee2ddf8e7aab27b17ef9e1d4a3f2c541a1913e/11-agentic-protocols/README.md) | MCP、A2A 與 NLWeb | 協定選型及各連線授權矩陣。 |
| [12-context-engineering](https://github.com/microsoft/ai-agents-for-beginners/blob/3bee2ddf8e7aab27b17ef9e1d4a3f2c541a1913e/12-context-engineering/README.md) | Context Engineering | 資料來源圖、內容選擇規則與污染反例。 |
| [13-agent-memory](https://github.com/microsoft/ai-agents-for-beginners/blob/3bee2ddf8e7aab27b17ef9e1d4a3f2c541a1913e/13-agent-memory/README.md) | Agent 記憶的種類與生命週期 | 記憶分類、保存期限及刪除驗收規格。 |
| [14-microsoft-agent-framework](https://github.com/microsoft/ai-agents-for-beginners/blob/3bee2ddf8e7aab27b17ef9e1d4a3f2c541a1913e/14-microsoft-agent-framework/README.md) | Microsoft Agent Framework 工作流 | 狀態轉移圖、恢復及錯誤案例。 |
| [15-browser-use](https://github.com/microsoft/ai-agents-for-beginners/blob/3bee2ddf8e7aab27b17ef9e1d4a3f2c541a1913e/15-browser-use/README.md) | 瀏覽器 Agent 與固定 Actor | 選型理由、欄位驗收及停止條件。 |
| [16-deploying-scalable-agents](https://github.com/microsoft/ai-agents-for-beginners/blob/3bee2ddf8e7aab27b17ef9e1d4a3f2c541a1913e/16-deploying-scalable-agents/README.md) | 可擴展部署與發布閘道 | 環境矩陣、發布閘道與回滾驗收表。 |
| [17-creating-local-ai-agents](https://github.com/microsoft/ai-agents-for-beginners/blob/3bee2ddf8e7aab27b17ef9e1d4a3f2c541a1913e/17-creating-local-ai-agents/README.md) | 本機 Agent 與混合架構 | 資料流圖、資源需求與離線驗收規格。 |
| [18-securing-ai-agents](https://github.com/microsoft/ai-agents-for-beginners/blob/3bee2ddf8e7aab27b17ef9e1d4a3f2c541a1913e/18-securing-ai-agents/README.md) | 加密簽章與動作證據 | 證據欄位、獨立驗證規格及限制清單。 |

原 3 章與原案例、ID、Tags、分類與 Typed References 保留。新增 4 組用途、15 局部證據、15 練習。回歸測試改為 18 章精確覆蓋，既有 4 尺寸瀏覽器測試不降低。

## 其他 Deferred 的固定來源定位（本輪僅定位，未升級）

- Hindsight：原固定 SHA `550ef5e304623be2a456913acbac1b1a834fb2c3` 實際 Python 路徑位於 hindsight-api-slim/hindsight_api/engine/；找到 memories/pg/banks.py、recall.py、retain.py、reflect/agent.py 及 tests/test_delete_bank_leaves_no_rows.py。尚未審查函式與權限、刪除契約。
- OpenCode：固定 SHA `e54fbacb3d3aebc85f0e5ada0a5c490cc9333a91` 的實際位置 packages/core/src/permission.ts、permission/policy.ts、permission/saved.ts、packages/core/test/permission.test.ts。尚未審查實際規則及角色契約。
- Orca：固定 SHA `a9ccd3042c4373579d5a48ccf045b0139deeb50d` 取得完整目錄樹，發現 mobile 與 cloud 模組；仍須定位主要 Desktop Worktree 程式及程序權限，不宣稱完成。

合併後預計 282/286 已審查；268 完成知識對應、14 deferred、4 來源阻塞。第三方未執行。
