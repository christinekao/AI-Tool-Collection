# Resource 雙層知識 Batch 58｜Agent 記憶、工作模式與內容治理

3 mapped 候選、9 用途、9 局部程式能力、3 design-only 案例。原分類領域、Tags、關聯保留。

## rociiu-talorys

- 固定版本 `fff3510ca1bfc74b33d02818a889e8d354a071e3`；授權：MIT；Cloudflare 及模型服務另查
- 用途：個人 AI 助理以記憶版本、衝突判定及待核准動作管理長期資料；本次查核局部資料生命週期。
- 案例：規劃私人 Agent 記憶版本與待核准動作驗收；合成記憶、版本關係與待核准動作 → 衝突判定、歷史狀態及待核准紀錄 → 私人 Agent 測試工作區，經資料權利與人工覆核後使用。
- 來源證據：
  - 萃取記憶比較的文字線索：[apps/agent/src/memory/conflict.ts](https://github.com/rociiu/talorys/blob/fff3510ca1bfc74b33d02818a889e8d354a071e3/apps/agent/src/memory/conflict.ts)（tokens / AUTO_SUPERSEDE_CONFIDENCE）；英文詞彙啟發式不等於語意正確；信心門檻及跨語言能力需獨立驗證。
  - 保存被更新的歷史記憶：[apps/agent/src/memory/lifecycle.ts](https://github.com/rociiu/talorys/blob/fff3510ca1bfc74b33d02818a889e8d354a071e3/apps/agent/src/memory/lifecycle.ts)（MemoryLifecycle.supersede / MemoryLifecycle.wouldCycle）；檢查既有記憶及有限深度循環；不宣稱超過深度的所有環狀關係均可攔截。
  - 保存有期限的待核准操作：[apps/agent/src/db/repositories/pending-actions.ts](https://github.com/rociiu/talorys/blob/fff3510ca1bfc74b33d02818a889e8d354a071e3/apps/agent/src/db/repositories/pending-actions.ts)（PendingActionRepository.create / present / PENDING_ACTION_TTL_MS）；本檔僅為資料契約，不等於下游核准執行已安全；不得以待核准紀錄當成授權。

## danyuchn-claude-work-mode

- 固定版本 `e19eda1e8465308bd79a74fad295cf9b6d9cdf71`；授權：MIT
- 用途：以 Session 工作模式協調自主、委派與收斂，並提供 hook 判定及待決事項格式檢查。
- 案例：規劃 Coding Agent 工作模式與決策邊界驗收；合成模式指令、Session 狀態及待決事項 → 模式解析、狀態判定及決策格式檢查規格 → 自有 AI Cowork 流程，經資料權利與人工覆核後使用。
- 來源證據：
  - 解析可組合的工作模式：[plugins/work-mode/hooks/tempo.ts](https://github.com/danyuchn/claude-work-mode/blob/e19eda1e8465308bd79a74fad295cf9b6d9cdf71/plugins/work-mode/hooks/tempo.ts)（parseTempo / pickedArgs）；模式解析不等於所有工具權限自動改變；未知字詞拒絕。
  - 讓工具前置檢查讀取 Session 模式：[plugins/work-mode-gates/hooks/lib/tempo-auto.sh](https://github.com/danyuchn/claude-work-mode/blob/e19eda1e8465308bd79a74fad295cf9b6d9cdf71/plugins/work-mode-gates/hooks/lib/tempo-auto.sh)（tempo_mode_on / tempo_deny）；缺失或錯誤狀態視為關閉；硬性權限邊界仍須獨立維持。
  - 檢查需本人決策的回報格式：[plugins/work-mode-gates/hooks/decision-label-guard.py](https://github.com/danyuchn/claude-work-mode/blob/e19eda1e8465308bd79a74fad295cf9b6d9cdf71/plugins/work-mode-gates/hooks/decision-label-guard.py)（unlabeled / one_sided）；本次只核對文件說明及函式位置，文字規則無法判定真正授權、風險或取捨品質。

## social-post

- 固定版本 `a4832ae06ed82e59d40e8859a086c21ec23512f9`；授權：MIT；平台規則與內容權利另查
- 用途：支援社群內容規劃與證據管理；本次聚焦規則索引、授權資料及瀏覽器回覆收據的來源契約。
- 案例：規劃社群內容工作流的授權與證據驗收；虛構內容、規則文件、合成核准與回覆紀錄 → 規則索引、範圍驗證及收據綁定規格 → 自有社群內容工作區，經資料權利與人工覆核後使用。
- 來源證據：
  - 建立可追溯的內容規則索引：[social-post/scripts/build_rule_registry.py](https://github.com/Hao0321/claude-skill-social-post/blob/a4832ae06ed82e59d40e8859a086c21ec23512f9/social-post/scripts/build_rule_registry.py)（build）；樣本提及數不是實驗有效性證明；重複識別及缺 Metadata 拒絕。
  - 核對社群互動的授權資料：[social-post/scripts/comment_authorization.py](https://github.com/Hao0321/claude-skill-social-post/blob/a4832ae06ed82e59d40e8859a086c21ec23512f9/social-post/scripts/comment_authorization.py)（validate_scope / validate_expiry / event_time_is_monotonic）；資料格式通過不等於真正授權；未連線、未讀取、未發送任何真實留言。
  - 綁定回覆結果與原始授權紀錄：[social-post/scripts/comment_browser_provenance.py](https://github.com/Hao0321/claude-skill-social-post/blob/a4832ae06ed82e59d40e8859a086c21ec23512f9/social-post/scripts/comment_browser_provenance.py)（build_receipt_binding）；局部綁定欄位不能證明平台真實送達；正式送出與人工驗收另行核准。
