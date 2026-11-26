# Resource 雙層知識 Batch 52｜Agent 協作、事件與模型路由

3 mapped 候選、9 用途、9 局部程式能力、3 design-only 案例。原分類領域、Tags、關聯保留。

## loopagentteams

- 固定版本 `5c90894b682868d2ed99c063b7e5faf1fba91054`；根授權：MIT；外部 Skills 與協作工具另查
- 用途：以已核准的 Spec 串接多 Agent 派工、獨立審查、整合與 QA，並以本機 Session 紀錄協助主控恢復工作。
- 案例：規劃多 Agent 任務的進度保存與主控恢復驗收；自有測試 Git worktree、已確認的 Spec、進度與待決紀錄。 → Session 記錄、必要檔案查核、恢復指引及進度一致性驗收規格。 → 自有 Agent 協作流程，經主控與獨立 QA 覆核後使用。
- 來源證據：
  - 建立主控 Session 恢復紀錄：[skills/local/lat/scripts/codex-lat-session.py](https://github.com/ouob-tw/LoopAgentTeams/blob/5c90894b682868d2ed99c063b7e5faf1fba91054/skills/local/lat/scripts/codex-lat-session.py)（session_id / workspace_root / activate）；限定格式的 Session ID 與 Git 根目錄；既有不同紀錄拒絕重綁，寫入前須有使用者授權。
  - 核對恢復所需的實際檔案：[skills/local/lat/scripts/codex-lat-session.py](https://github.com/ouob-tw/LoopAgentTeams/blob/5c90894b682868d2ed99c063b7e5faf1fba91054/skills/local/lat/scripts/codex-lat-session.py)（dependencies / pointer）；要求絕對路徑、必要檔案及決策目錄存在；pointer 要求重讀與核對授權，不自行證明 tracker 狀態正確。
  - 保存紀錄並偵測部分並行修改：[skills/local/lat/scripts/codex-lat-session.py](https://github.com/ouob-tw/LoopAgentTeams/blob/5c90894b682868d2ed99c063b7e5faf1fba91054/skills/local/lat/scripts/codex-lat-session.py)（current_bytes / write_json）；寫入暫存檔、同步及比較原始位元組後替換；檢查到替換之間仍可能有競爭，不宣稱跨程序交易安全。

## deepseek-dsh-superagent-prototype

- 固定版本 `8c32a9dc5d72c033816c6a8110b37f40cf94fba4`；根授權：MIT；外部服務與權限另查
- 用途：研究單一程式庫的事件驅動 Agent，以訊息准入、持久化回覆與模型預算重試狀態支援任務協調。
- 案例：規劃事件驅動 Agent 的准入與回覆可靠性驗收；合成 GitHub 事件、測試訊息、回覆識別與模型重試事件。 → 准入政策、回覆收據與重試健康狀態的測試規格。 → 自有 Agent 任務平台，僅在權限與可靠性驗收後整合。
- 來源證據：
  - 區分明確請求與推測候選：[src/admission.ts](https://github.com/deepseek-ai/dsh-superagent-prototype/blob/8c32a9dc5d72c033816c6a8110b37f40cf94fba4/src/admission.ts)（ADMISSION_OPTIONS / ADMISSION_DEFAULTS）；此檔為准入矩陣定義而非完整授權實作；推測候選不等於可執行，須核對下游授權。
  - 管理可重試的對話回覆：[src/app/outbox.ts](https://github.com/deepseek-ai/dsh-superagent-prototype/blob/8c32a9dc5d72c033816c6a8110b37f40cf94fba4/src/app/outbox.ts)（Outbox.send / Outbox.withdraw / Outbox.deliver）；重複識別忽略，來源暫停時等待，對話不允許或消失時結束；外部服務重送與實際交付保證仍需驗證。
  - 投影模型預算重試健康狀態：[src/app/retry-health.ts](https://github.com/deepseek-ai/dsh-superagent-prototype/blob/8c32a9dc5d72c033816c6a8110b37f40cf94fba4/src/app/retry-health.ts)（budgetFailure / RetryHealth.restore / RetryHealth.observe / RetryHealth.clear）；忽略無效或過時序號，排除部分權限及速率錯誤；重試啟動不等於恢復，此投影不修改底層重試政策。

## dominicrico-jev-router

- 固定版本 `57cde5799e66d10a6e6164a639ecbee11ebe82b6`；根授權：MIT；模型與外部路由服務另查
- 用途：依任務需求與成本偏好選擇 Claude Code 模型及推理程度，並考量快取狀態、允許模型與上下界。
- 案例：規劃 Coding Agent 的模型路由與快取策略驗收；合成任務文字、允許模型池、推理上限與模擬快取狀態。 → 模型選擇、推理上限與快取保留決策的測試規格。 → 自有模型路由測試環境，先驗證資料傳輸、費用與品質。
- 來源證據：
  - 限制推理程度及單次任務偏好：[hooks/register.tsx](https://github.com/dominicrico/jev-router/blob/57cde5799e66d10a6e6164a639ecbee11ebe82b6/hooks/register.tsx)（capEffort / markers）；cap none 不限制，單次標記解析與實際模型執行須分開測試；不宣稱可保證費用上限。
  - 限制路由候選模型上下界：[hooks/register.tsx](https://github.com/dominicrico/jev-router/blob/57cde5799e66d10a6e6164a639ecbee11ebe82b6/hooks/register.tsx)（limit / PRESETS）；上界可依信心門檻突破，若模型池無適合替代值可能不調整；不是強制授權或絕對費用控制。
  - 權衡模型切換與快取重用：[hooks/register.tsx](https://github.com/dominicrico/jev-router/blob/57cde5799e66d10a6e6164a639ecbee11ebe82b6/hooks/register.tsx)（isWarm / decide）；auto 在符合信心的升級時可切換；strict 保留暖快取；實際延遲、帳單及品質需用同一批測試比較。
