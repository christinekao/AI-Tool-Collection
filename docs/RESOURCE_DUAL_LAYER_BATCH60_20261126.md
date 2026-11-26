# Resource 雙層知識 Batch 60｜Agent 用量與協作基礎設施

3 mapped 候選、9 用途、9 局部程式能力、3 design-only 案例。原分類領域、Tags、關聯保留。

## nanako0129-syrtis

- 固定版本 `995615549c5b9c9eedf93fb9d54a90f8062db90c`；授權：MIT；供應商憑證與服務另查
- 用途：在 macOS 彙整 Agent 用量與額度；本次聚焦額度週期證據、帳號範圍與憑證讀取同意。
- 案例：規劃 AI 用量監測的週期證據與隱私驗收；合成額度時間、匿名帳號識別及同意設定 → 週期判定、帳號識別邊界及同意檢查 → 自有用量監測測試環境，經資料權利與人工覆核後使用。
- 來源證據：
  - 區分額度週期的證據來源：[crates/tb_core_ffi/src/agent_quota_duration.rs](https://github.com/Nanako0129/syrtis/blob/995615549c5b9c9eedf93fb9d54a90f8062db90c/crates/tb_core_ffi/src/agent_quota_duration.rs)（resolve_duration / valid_evidence）；優先級固定；無效的已提供證據不靜默替代。未核對實際供應商額度。
  - 隔離額度歷史的安裝識別：[crates/tb_core_ffi/src/agent_account_scope.rs](https://github.com/Nanako0129/syrtis/blob/995615549c5b9c9eedf93fb9d54a90f8062db90c/crates/tb_core_ffi/src/agent_account_scope.rs)（ensure_installation_key / ensure_installation_key_locked）；本次只查安裝金鑰生命週期局部契約；涉及寫檔與孤立資料處置，須核准及備份，不讀真實憑證。
  - 保存有範圍的憑證讀取同意：[crates/tb_core_ffi/src/keychain_consent.rs](https://github.com/Nanako0129/syrtis/blob/995615549c5b9c9eedf93fb9d54a90f8062db90c/crates/tb_core_ffi/src/keychain_consent.rs)（allowed / set_from_json）；預設未授權，完整替換而非合併；僅為程序內登記，不能視為全部 Keychain 存取安全。

## block-buzz

- 固定版本 `ddc3585a3a83a616d3720cc52723765e840ffea7`；授權：Apache-2.0
- 用途：支援人員與 Agent 的頻道協作；本次查核訂閱範圍、事件佇列及編輯訊息的回覆路由。
- 案例：規劃多 Agent 頻道事件的路由與佇列驗收；合成頻道、訊息事件及訂閱設定 → 匹配範圍、佇列狀態與原始訊息路由 → 自有 Agent 協作測試工作區，經資料權利與人工覆核後使用。
- 來源證據：
  - 限制訂閱頻道：[crates/buzz-acp/src/filter.rs](https://github.com/block/buzz/blob/ddc3585a3a83a616d3720cc52723765e840ffea7/crates/buzz-acp/src/filter.rs)（ChannelScope::matches / FilterContext::from_event）；頻道匹配不等於身分或授權驗證；訊息內容須依不可信資料處理。
  - 界定事件佇列容量與去重政策：[crates/buzz-acp/src/queue.rs](https://github.com/block/buzz/blob/ddc3585a3a83a616d3720cc52723765e840ffea7/crates/buzz-acp/src/queue.rs)（MAX_PENDING_PER_SCOPE / MAX_PENDING_PER_CHANNEL / push / flush_next）；本次只查政策說明與符號；Drop 與 Queue 語意不同，須驗證溢位、重試及資料遺失。
  - 辨識訊息編輯的原始目標：[crates/buzz-acp/src/edit_routing.rs](https://github.com/block/buzz/blob/ddc3585a3a83a616d3720cc52723765e840ffea7/crates/buzz-acp/src/edit_routing.rs)（resolve_edit / resolve_edit_with）；只查局部路由與範圍定義，未測 relay 讀取及驗證；不得代替權限控制。

## makecindy-cindy

- 固定版本 `a5029cae95a0b1bf9578c554df5035fa8e95d6fc`；授權：Apache-2.0；外部 Harness 另查
- 用途：整合不同 Agent Harness；本次聚焦 headless 能力登記、專案上下文載入及 Session 持久化。
- 案例：規劃跨 Harness Agent 的能力與 Session 驗收；合成能力登記、專案目錄及 Session 資料 → 能力契約、上下文摘要及 Session 保存規格 → 自有 Agent 執行工作區，經資料權利與人工覆核後使用。
- 來源證據：
  - 檢查能力登記的版本契約：[apps/cindy-headless/src/compatibility.ts](https://github.com/makecindy/cindy/blob/a5029cae95a0b1bf9578c554df5035fa8e95d6fc/apps/cindy-headless/src/compatibility.ts)（validateCapabilityRegistry / HEADLESS_CONTRACT_VERSION）；結構檢查不代表每個 adapter 實際支援；未測外部執行環境。
  - 按需讀取專案知識入口：[apps/cindy-headless/src/project-context.ts](https://github.com/makecindy/cindy/blob/a5029cae95a0b1bf9578c554df5035fa8e95d6fc/apps/cindy-headless/src/project-context.ts)（readProjectContext）；讀取錯誤被歸為無檔案，非完整錯誤分類；不得將機密 TOC 送至外部。
  - 以 SQLite 保存 Session 資料：[apps/cindy-headless/src/session-storage.ts](https://github.com/makecindy/cindy/blob/a5029cae95a0b1bf9578c554df5035fa8e95d6fc/apps/cindy-headless/src/session-storage.ts)（SqliteSessionStorage.create / SqliteSessionStorage.get / SqliteSessionStorage.update）；涉及本機資料寫入，WAL 及逾時不保證所有並行更新安全；需驗證復原與權限。
