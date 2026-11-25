# Resource 雙層知識 Batch 43｜專業職能技能集合

3 evidence-linked 候選、9 用途、9 文件證據、3 design-only 案例；只審查集合索引，不冒充個別來源實測；Content Format 依來源校正，其他分類與關係保留。

## mukul975-anthropic-cybersecurity-skills

- 版本 `54a798831d2266a3ca61ce68a7acb80b81160d57`；授權 Apache-2.0；各來源與依賴另查
- 用途：依資安防禦領域與 MITRE、NIST 等框架，查找適用的安全分析及治理技能參考。
- 案例：規劃企業 Agent 的安全治理與事件審查技能選型；合成安全事件、測試環境及組織政策 → 防禦技能候選、框架對應及人工審查規格 → 自有 AI Security 與防禦工作流
- 文件證據：
  - 依防禦任務選擇技能領域：README.md (What's inside — 34 security domains)；領域名稱只表示索引分類；本次未審計個別技能或執行程式，所有測試需限於授權環境。
  - 對照適用的防禦框架：README.md (Six frameworks, one skill library)；來源的框架標籤不等於正式合規或完整覆蓋；須比對官方框架條文及實際證據。
  - 審查技能輸入輸出與驗收規則：README.md (Skill anatomy)；技能可能包含程式和外部工具；先閱讀原始檔、依賴與權限，不執行未知指令或對外測試。

## k-dense-ai-scientific-agent-skills

- 版本 `c21d13b3cc2894680229ba9959a53281acb9200e`；授權 MIT（LICENSE.md）；資料庫及科學套件各自條款
- 用途：按科學資料庫、分析套件與研究流程挑選 Agent Skills，協助規劃可追溯的科學資料處理。
- 案例：規劃公開研究資料的查詢與分析技能；合成研究問題、公開資料來源及分析驗收條件 → 資料庫、套件與適用 Host 的技能候選 → 自有研究資料分析的學習與選型
- 文件證據：
  - 尋找適用的科學資料庫：README.md (What's Included / Scientific & Financial Databases)；資料庫可能需註冊或授權，來源、版本、分頁與資料完整性需另外核實。
  - 選擇分析套件的工作指引：README.md (What's Included / Optimized Python Package Skills)；未執行單一套件工作流；需以獨立基準檢查資料、統計假設及結果。
  - 限制技能安裝與執行範圍：README.md (Getting Started / Security Disclaimer)；作者明示不能保證全面審查；避免全量安裝，須逐件確認程式、資料外送及費用。

## coreyhaines31-marketingskills

- 版本 `8fd2fcade2fd6629026e9dfe6d133b55b36968b9`；授權 MIT
- 用途：以共用產品與受眾背景為基礎，按文案、轉換、SEO、成效衡量等任務選擇行銷工作技能。
- 案例：規劃產品頁的定位、文案與轉換實驗；合成產品介紹、目標受眾、現有頁面及轉換目標 → 共用產品背景、文案與測量實驗規格 → 自有產品網站及行銷工作流
- 文件證據：
  - 先整理共同的產品背景：README.md (How Skills Work Together)；共用背景需保持最新且由人員確認，不把模型推測當作客戶或產品事實。
  - 依轉換目標挑選文案與頁面技能：README.md (Conversion Optimization / Content & Copy)；文案與頁面建議須符合真實產品能力；未驗證的廣告承諾不可發布。
  - 選擇事件追蹤與實驗規格：README.md (Measurement & Testing)；實驗效果需實際資料及獨立評估；追蹤可能涉及同意、個資及外部服務，需另核准。
