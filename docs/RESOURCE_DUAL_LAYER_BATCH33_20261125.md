# Resource 雙層知識 Batch 33｜職能插件與受控 Bot

共同驗收基線 `fde96af41f63a655290afd95879f188d83167383`；Batch 29–35 集中同一 PR，逐組保存紀錄，不把候選計入已合併。

## anthropics-knowledge-work-plugins

- 版本 `5e504ae11498f2b8daa30d86b7dab97b2ecd8092`；授權 Apache-2.0；連接的外部服務條款另查
- 用途：按職能選擇 Claude 工作插件，把分析、程式審查、產品規劃等常用工作流程與資料工具組合起來。
- 案例：規劃企業資料分析與審查的職能插件組合；合成資料、分析問題、程式差異與已允許的資料來源 → 資料驗收清單、程式審查紀錄與連線權限規格 → 自有企業 AI 工作流程與插件設計
- 局部文件證據：
  - 檢查資料分析是否可信：data/skills/validate-data/SKILL.md ()；先查母體、分母、Join grain、比較期間與替代解釋；信心評估不等於資料已正確。
  - 依工程角色審查程式變更：engineering/skills/code-review/SKILL.md ()；外部工具連線並非必備，但未取得 diff 或 CI 時不能聲稱已驗證；最終合併須獨立核准。
  - 選擇職能插件與資料工具：data/.mcp.json (README.md)；部分端點是空白 placeholder；需另外設定與授權，不把 .mcp.json 視為已連線或已獲權限。

## anthropics-financial-services

- 版本 `3e32c2287dcb637c184c01cc0ad82d6af7e9bb0f`；授權 Apache-2.0；模型、資料供應商與金融資料條款另查
- 用途：提供金融業的參考 Agent 與技能模板，協助準備對帳、財務報告、投資研究與客戶審查的待覆核產物。
- 案例：規劃金融對帳差異的分層讀取與覆核；合成總帳、明細帳、外部報表及對帳規則 → 差異資料、受控交接、待主管核准的例外清單 → 自有財務流程的證據化審查與人工簽核
- 局部能力及證據：
  - 先驗證不受信任文件的結構化結果：scripts/validate.py (main,_load,jsonschema.validate)；Schema 通過只驗證形狀；對帳數值須由獨立 reviewer 比對可信來源。
  - 將核准範圍內的資料交接給另一 Agent：scripts/orchestrate.py (extract_handoff,HANDOFF_PAYLOAD_SCHEMA,run)；允許清單與 Schema 不能取代權限驗證；不可讓外部文件直接接觸寫入工具或系統紀錄。
  - 將模板轉成可部署的角色契約：scripts/deploy-managed-agent.sh (resolve_manifest,create_agent,DRY_RUN)；dry-run 與真實部署分開；帳務入帳、投資決策、KYC 審核仍需專業人員決定，不能由 Agent 自行批准。

## pramoddutta-botskills

- 版本 `ed17ebcead177b91dfca57d5df3d7c9872cb77fd`；授權 MIT；個別 BOT 模板的授權欄位另查
- 用途：從現成的 Bot 設定模板選擇任務，並用統一 BOT.md 格式記錄角色、工具、工作步驟及不可越過的操作界線。
- 案例：規劃只在測試環境運作的 Bug 重現 Bot；合成 Bug 報告、測試環境描述及明確不可操作的範圍 → BOT.md 設定、格式驗收結果與重現證據清單 → 自有 Bot 設計目錄與受控任務流程
- 局部能力及證據：
  - 建立統一可解析的 Bot 設定：packages/shared/src/index.ts (parseBotMd,botFrontmatterSchema,serializeBotMd)；Frontmatter 必填 boundary 與 runtime；解析成功不代表 Bot 遵守該界線。
  - 檢查 Bot 目錄的品質欄位：scripts/validate-bots.mjs (parseBotMd,CATEGORY_IDS,fails)；檢查 boundary 長度、分類及格式是靜態 Gate；不能證明實際副作用已被阻止。
  - 以明確界線設計工作案例：seed-bots/bug-repro-pack-builder/BOT.md (boundary（文件欄位）,Per report（文件步驟）)；模板明定不得使用 production 客戶資料；財務範例也禁止入帳。實際執行須另驗證工具權限與拒絕路徑。

2 mapped、1 evidence-linked；Knowledge Work Plugins 僅校正 Content Format 候選；9 用途、3 design-only 案例。第三方未實測；共同 PR CI 待驗收。
