# Resource 雙層知識 Batch 39｜技能安全與個資防護

2 mapped、1 deferred；9 用途、6 局部能力、3 文件證據、3 design-only 案例；未實測，待 PR CI。Snyk 原庫封存遷移，新庫與外部核心未查核，不算深度完成。

## nvidia-skillspector

- 版本 `0205488a8257869cac3054397ddd5a5d29180aab`；授權 Apache-2.0
- 用途：在安裝 AI Agent Skill 前先掃描來源檔案，辨識可疑指令、資料外洩與工具權限風險，並指出哪些範圍沒有成功檢查。
- 案例：規劃第三方 Skill 安裝前的安全審查；合成正常與可疑 Skill、固定來源、掃描政策及預期報告 → 輸入驗收、掃描覆蓋帳本及待覆核的風險 → 自有 Agent 技能收錄與安裝准入
- 局部證據：
  - 限制不可信技能來源的讀取：src/skillspector/input_handler.py (InputHandler.resolve,INGEST_MAX_BYTES,INGEST_MAX_ZIP_MEMBERS)；100 MiB／10000 ZIP members 是此版本輸入上限；主機及解壓限制不是完整執行沙箱，需以隔離環境驗證。
  - 分開掃描成功與檢查缺口：src/skillspector/inspection_ledger.py (LedgerOutcome,LedgerReason,MAX_FINDING_OUTPUT_RECORDS)；拒絕、截斷、缺少憑證或規則等必須留在 ledger；掃描工作狀態不等於漏洞不存在。
  - 選擇是否加入語意風險檢查：src/skillspector/llm_analyzer_base.py (LLMAnalyzerBase,DEFAULT_MAX_LLM_CONCURRENCY,STRUCTURED_RESPONSE_MAX_RETRIES)；LLM 可能外送內容且費用受 provider 影響；分片和結構化輸出仍可能漏判，未核准不啟用。

## pii-guard

- 版本 `6f10a064aac481b0a356ed3700b19dbd6cd670d7`；授權 MIT
- 用途：在本機將繁體中文文件中的個資換成代號，再讓人員檢查去識別化副本，必要時在本機還原。
- 案例：規劃繁體中文文件送入模型前的去識別化；合成含人名、電話與機構名稱的文件及預期遮蔽範圍 → 去識別副本、隔離的對照表、人工補標與還原驗收 → 自有文件處理與資料保護流程
- 局部證據：
  - 辨識並補正個資遮蔽範圍：src/pii_guard/pipeline/engine.py (SUPPORTED_ENTITIES,validate_org_allowlist,OrgAllowlistError)；機構白名單只應依本次授權與 ORG 判定使用；辨識有誤判與漏報，人工覆核不可省略。
  - 隔離原始文件與對照表：src/pii_guard/local_workflow.py (PRIVATE_MAP_NAME,REDACTED_NAME,PRIVATE_MODE,JOB_MODE)；0700 job 與 0600 私有檔案須在實際平台驗收；可還原資料仍是敏感資訊，不能當匿名公開資料。
  - 限制還原值流向不受控入口：src/pii_guard/hookd/policy.py (NETWORK_DENY_REASON,ENCODER_DENY_REASON,OUTPUT_WITHHELD)；字串規則只約束已接入的入口；不能視為作業系統隔離或防止全部資料外洩，需測試允許及拒絕情境。

## hermes-snyk-plugin

- 版本 `43b8efe6258312456faf57b78124a8395b866303`；授權 MIT（歷史插件）；Snyk CLI 及服務另查
- 用途：從 Hermes 的工作流程選擇 Snyk 掃描原始碼、依賴或部署設定，整理修復與重新掃描所需資訊。原插件庫已封存遷移。
- 案例：規劃開發專案的依賴與程式碼掃描驗收；合成程式庫、依賴清單、核准的測試範圍及版本 → 掃描選型、授權清單與修復前後的驗收規格 → 自有軟體交付的安全審查流程
- 局部證據：
  - 辨識固定掃描器版本與配置：mcp.json (mcpServers.sn)；封存 manifest 固定 1.1306.0；初次 npx 會下載 CLI，非已安裝或已驗證。新版官方插件未查核。
  - 依掃描對象選擇工具：skills/snyk-security-scan/references/tools.md (snyk_code_scan / snyk_sca_scan)；參數表由作者從歷史 CLI 產生，本次未執行 handshake；雲端掃描涉及資料傳輸，需核准。
  - 檢視發現並安排修復與重掃：skills/snyk-security-scan/SKILL.md (When to Use / How to Run)；關閉 analytics 不會使掃描離線；私有程式碼、依賴資料可能送往供應商，僅在核准範圍進行。
