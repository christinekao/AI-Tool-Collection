# Resource 雙層知識 Batch 40｜技能索引與安全選型

3 evidence-linked 候選、9 用途、9 文件證據、3 design-only 案例；只審查集合索引，不冒充個別來源實測；Content Format 依來源校正，其他分類與關係保留。

## composiohq-awesome-claude-skills

- 版本 `be2a406907dbc61b73e6827ded415c96139d13a2`；授權 README 聲明 Apache-2.0；各技能授權不同，根 LICENSE 未取得
- 用途：依文件、資料分析、開發與企業應用等需求，找出可再評估的 Agent Skill，而非從零撰寫每個流程。
- 案例：規劃文件分析與 CRM 自動化的技能候選清單；合成文件、分析需求與 CRM 任務 → 文件、資料分析及整合技能候選與使用前檢查表 → 自有企業自動化與技能選型
- 文件證據：
  - 尋找文件處理技能：README.md (Document Processing)；列有 docx、pdf、pptx、xlsx 等來源，需另查各技能的版本、授權、支援格式與實際文件操作。
  - 挑選資料分析或研究技能：README.md (Data & Analysis)；清單描述是索引證據，不保證查詢真的唯讀或分析結果正確；需獨立核對資料權限與計算。
  - 尋找企業應用的自動化模板：README.md (App Automation via Composio)；Rube MCP 連線及寫入需另外核准；清單不是已連線帳號，第三方服務的權限與費用另查。

## voltagent-awesome-agent-skills

- 版本 `20c57162c790d59d35e47c1538dc534c5c59e60d`；授權 MIT；個別來源另查
- 用途：依官方提供者、程式語言與社群分類探索 Agent Skills，找出符合目前開發環境的候選。
- 案例：規劃跨 Agent 的技能選用與安裝前審查；合成任務、兩種 Coding Agent 與技能候選條件 → 依來源與 Host 分類的候選、版本及風險清單 → 自有 Agent 技能收錄與選型
- 文件證據：
  - 依提供者查找技能：README.md (Official Skills by)；提供者清單包括 Cloudflare、Supabase、Vercel 等；須逐件核對來源身分、授權與實際適用版本。
  - 尋找專門情境的社群技能：README.md (Community Skills)；清單包含 Qdrant、Milvus 等描述，並未驗證單一技能的行為；不得依分類直接建立等價關係。
  - 確認 Host 路徑與安全檢查：README.md (Skills Paths for Other AI Coding Assistants / Security Notice)；作者明示 curated not audited；Host 路徑會變動，掃描與逐檔查核後才可考慮安裝。

## voltagent-awesome-openclaw-skills

- 版本 `2ddb4d0ee520904c49cfd7f857535174cbd7669b`；授權 MIT；各 ClawHub 項目另查
- 用途：按工作類型找 OpenClaw 社群技能，例如資料分析、文件、搜尋與日常自動化。
- 案例：規劃 OpenClaw 個人知識管理技能選型；合成筆記、文件搜尋及自動化需求 → 按分類、ClawHub 來源與風險整理的候選 → 自有 OpenClaw 技能配置與安全驗收
- 文件證據：
  - 按任務類別篩選技能：README.md (Table of Contents)；分類計數隨索引版本變動，不能保證項目仍可取得或符合需求。
  - 理解清單如何排除部分項目：README.md (Why This List Exists?)；作者排除疑似垃圾、重複及已知惡意等項目，但不是完整審計；未收錄也不代表工具有問題。
  - 在安裝前回查來源與風險：README.md (Security Notice)；VirusTotal 或其他掃描只能補充證據；需要人工檢查指令、依賴、權限及測試環境。
