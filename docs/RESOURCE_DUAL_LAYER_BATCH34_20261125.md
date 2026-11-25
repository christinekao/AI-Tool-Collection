# Resource 雙層知識 Batch 34｜成本與治理

共同驗收基線 `fde96af41f63a655290afd95879f188d83167383`；Batch 29–35 集中同一 PR，逐組保存紀錄，不把候選計入已合併。

## aws-samples-sample-agent-cost-bench

- 版本 `22ee6ed9f2a8b287e7201110ebaa16d3abfccc3d`；授權 MIT No Attribution（MIT-0）
- 用途：用相同開發任務及驗收條件比較不同 Coding Agent 或模型的成本、品質與耗時。
- 案例：規劃跨 Coding Agent 的成本與功能品質對照；相同合成任務、固定程式基線、測試腳本與核准的模型配置 → 可重現的功能分數、成本、耗時及失敗紀錄 → 自有 AI 工具採用與成本品質評估
- 局部能力及證據：
  - 用獨立測試驗收任務結果：agent_cost_bench/evaluator/functional.py (FunctionalEvaluator,evaluate,_RESULT_MARKERS)；graduated 分數來自測試結果，無 marker 退回二元退出碼；需保持測試獨立並防止資料或測試遭污染。
  - 為非程式產物設計評分規格：agent_cost_bench/evaluator/rubric.py (_INCLUDE_EXTS,_SKIP_DIRS,_usage_artifact_names)；judge 可能讀取檔案且包含 .env 類副檔名，須先使用合成資料；模型評分不可替代獨立事實驗收。
  - 以共同單位保存成本與品質：agent_cost_bench/reporter/json_reporter.py (JSONReporter,write)；USD 與原生額度分開呈現；缺資料或無限值不能轉成零成本，結果不等同供應商實際帳單。

## gggodlin-cc-harness

- 版本 `2fbf00ebc862da15456f1fc50423edddbdbb2315`；授權 MIT；私有接線未公開
- 用途：參考如何將 AI 開發的授權、工作規則與驗收證據變成可檢查的 Hooks，而不只是提示詞要求。
- 案例：規劃 Agent 修改工作規則時的授權與證據閘門；合成 Agent 規則、測試紀錄、Git staged 變更與人工核准 → 可查證的准入判斷、版本綁定的核准與測試收據 → 自有 AI Cowork 治理與獨立驗收機制
- 局部能力及證據：
  - 保護關鍵規則不被誤改：hooks/agent-contract-validator-gate.sh (Locked surface lifecycle（程式註解）,Permit binding（程式註解）)；同 UID Agent 能繞過未覆蓋入口；此為 drift guard，不是安全邊界，也不保證完整 Shell 語意。
  - 在修改契約後要求新的測試證據：hooks/contract-test-receipt-gate.sh (CONTRACT_TEST_RUNS_DIR,CONTRACT_TEST_PENDING_DIR,PostToolUse)；裸測試指令不產生收據；收據仍可能被偽造，且連續阻擋達門檻會放行，不能冒稱硬安全 Gate。
  - 保護人員控制的自動模式開關：hooks/auto-mode-write-guard.py (protected,segments,require_text)；只辨識常見命令形式，不能防蓄意規避；完整權限須依外部安全邊界與人工控制。

## cloudflare-cloudflare-os

- 版本 `b355717f54c7c35a360107a8bee64976da7fc3c8`；授權 Apache-2.0；Cloudflare 服務費用與第三方整合條款另查
- 用途：讓企業員工使用具工作知識的 AI Agent，並建立可分享的小型工具，透過獨立 Gatekeeper 控制可讀取與可操作的資源。
- 案例：規劃企業知識工作區的讀取與外部寫入核准；合成知識集合、使用者角色、受保護文件與待核准的修改 → 集合權限、可讀資料範圍、待核准動作與執行紀錄 → 自有企業 Agent 工作區與資料權限設計
- 局部能力及證據：
  - 依集合權限限制可讀資料：packages/gatekeeper-context/src/collection-access.ts (CollectionAccess,canReadCollection,collectionPermissions)；私人集合角色需保持權限；權限變更需實測，不能只依 UI 隱藏判斷。
  - 提供 Agent 受控的知識集合入口：packages/gatekeeper-context/src/library-read.ts (LibraryReadSession,ContextLibrary)；不可把工作區內所有資料當成預設可讀；實際 RBAC、資源選擇及跨租戶隔離另測。
  - 將外部系統修改放進核准流程：packages/gatekeeper-confluence/src/confluence-actions.ts (stageAction,autoApprovalOf,ConfluenceStore)；自動核准規則可能在回覆前執行，須確認實際狀態；資源 ID 不等於授權，未知 ID 不應猜測回退。

3 mapped 候選；9 用途、3 design-only 案例。第三方未實測；共同 PR CI 待驗收。
