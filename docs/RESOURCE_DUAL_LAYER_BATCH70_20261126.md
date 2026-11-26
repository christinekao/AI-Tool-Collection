# Resource 雙層知識 Batch 70｜Agent 委派、型別化決策及事件可視化

固定版本局部查核；保留原始用途、分類領域、Tags 與關聯。未實測第三方工具。

## irons163-three-tier-agent-orchestrator

- 固定版本 `86108395a5df3743b9e2b7d0499ef4319bc7494a`；授權：未見根授權檔；僅閱讀與原創摘要；evidence-linked
- 用途：三層 Agent 分工的操作文件：明確啟用、能力前置檢查、獨立任務契約與主線驗收。
- 案例：規劃自有 AI Cowork 的委派與獨立驗收；合成任務、可用工具宣告及寫入範圍 → 分工計畫、委派契約及驗收證據規格 → 自有 AI Cowork 設計工作區，經資料權利及人工覆核後使用。
- 來源證據：
  - 確認委派前提與啟用：[SKILL.md](https://github.com/irons163/three-tier-agent-orchestrator/blob/86108395a5df3743b9e2b7d0499ef4319bc7494a/SKILL.md)（啟用條件 / 1. 委派前確認 subagent 能力）；來源指定的模型名稱與 reasoning 不代表目前可用；未啟動子代理。
  - 建立可獨立驗收的子任務：[SKILL.md](https://github.com/irons163/three-tier-agent-orchestrator/blob/86108395a5df3743b9e2b7d0499ef4319bc7494a/SKILL.md)（3. 用明確契約委派 / 4. 控制並行寫入）；並行只限互不依賴工作；共享狀態須隔離，工具權限另查。
  - 以主線核對實際成果：[SKILL.md](https://github.com/irons163/three-tier-agent-orchestrator/blob/86108395a5df3743b9e2b7d0499ef4319bc7494a/SKILL.md)（5. 驗收並整合）；文件規則不是實際測試；未宣稱多代理協作已完成。

## laya

- 固定版本 `5b32bd39bd775d28dfb0138c62687f5084e91824`；授權：Apache-2.0；模型另查；mapped
- 用途：本機型別化模型決策；本次查核 C++ 選項標籤、序列前提及 .NET 校準溫度契約。
- 案例：規劃本機分類器的輸入契約與信心驗收；合成選項、Token 序列預算及模型分數 → 標籤拒絕原因、序列前提及溫度規格 → 自有分類器離線測試環境，經資料權利及人工覆核後使用。
- 來源證據：
  - 驗證選項標籤及重複：[laya-cpp/src/schema.cpp](https://github.com/NandhaKishorM/laya/blob/5b32bd39bd775d28dfb0138c62687f5084e91824/laya-cpp/src/schema.cpp)（Label::Of / Label::EqKey / CheckDistinct / Question::Choice）；Python 相等語意會影響數值與布林比較；未測所有語言實作。
  - 檢查序列預算與特殊標記：[laya-cpp/src/sequence.cpp](https://github.com/NandhaKishorM/laya/blob/5b32bd39bd775d28dfb0138c62687f5084e91824/laya-cpp/src/sequence.cpp)（GetSpecials / CheckBudget / SerializeState）；序列預算合法不代表模型能正確推論；未載入模型。
  - 限制校準溫度的輸入值：[laya-dotnet/src/Laya/Calibration.cs](https://github.com/NandhaKishorM/laya/blob/5b32bd39bd775d28dfb0138c62687f5084e91824/laya-dotnet/src/Laya/Calibration.cs)（TempMin / TempMax / ClampTemperature）；限制值不能保證信心已校準；需用獨立標註資料評估。

## cyyeh-agent-loop-visualizer

- 固定版本 `2077de5bbacc3fb550aad2dbe59a1ca4813040f7`；授權：Apache-2.0；模型另查；mapped
- 用途：Agent 迴圈教學介面的事件折疊、工具狀態與可觀測性缺口。
- 案例：規劃 Agent 迴圈教學的事件與狀態驗收；合成步驟、工具呼叫及核准事件 → 步驟摘要、核准狀態及未觀測欄位 → 自有 Agent 教材與教學原型，經資料權利及人工覆核後使用。
- 來源證據：
  - 由事件重建步驟視圖：[app/render.py](https://github.com/Agentic-System-Lab/agent-loop-visualizer/blob/2077de5bbacc3fb550aad2dbe59a1ca4813040f7/app/render.py)（build）；依事件順序折疊，缺漏事件可能無法呈現；不是獨立執行證據。
  - 呈現工具核准與執行狀態：[app/render.py](https://github.com/Agentic-System-Lab/agent-loop-visualizer/blob/2077de5bbacc3fb550aad2dbe59a1ca4813040f7/app/render.py)（build / STOP_REASONS）；畫面狀態不等於工具權限已落實；需核對底層執行。
  - 保留模型回傳的可觀測差異：[app/render.py](https://github.com/Agentic-System-Lab/agent-loop-visualizer/blob/2077de5bbacc3fb550aad2dbe59a1ca4813040f7/app/render.py)（with_drafts / TOKEN_DETAILS）；僅呈現後端提供資訊；不補造未提供的 Token 或模型內部資訊。
