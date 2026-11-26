# Resource 雙層知識 Batch 53｜安全治理、報告證據與會議資料

3 mapped 候選、9 用途、9 局部程式能力、3 design-only 案例。原分類領域、Tags、關聯保留。安全資源僅查核防禦性報告與治理契約，不執行測試。Zeabur 安裝指南網站可讀，但對應 GitHub 文件路徑 404，無固定版本證據，本批不修改，改選 Cicada。

## akto-api-security-akto

- 固定版本 `4c4d9e664701b1f2f54ecad2e9f00df175048d1c`；根授權：MIT；企業產品功能與相依授權另查
- 用途：提供企業 API 與 Agent 安全治理相關程式；本次聚焦資料遮罩、裝置盤點分類與政策覆蓋檢視。
- 案例：規劃企業 AI 工具盤點與安全政策覆蓋驗收；合成 API 樣本、已授權的裝置清單及政策統計資料。 → 遮罩結果、分類後盤點清單與政策覆蓋問題的驗收規格。 → 自有安全治理儀表板，經資料擁有者與安全團隊覆核。
- 來源證據：
  - 檢查 API 樣本的敏感資料遮罩：[apps/api-runtime/src/main/java/com/akto/utils/RedactSampleData.java](https://github.com/akto-api-security/akto/blob/4c4d9e664701b1f2f54ecad2e9f00df175048d1c/apps/api-runtime/src/main/java/com/akto/utils/RedactSampleData.java)（redactIfRequired / redactCookie / handleHeaders）；遮罩是依資料來源與設定而定，不是全面匿名化保證；各匯入來源須以合成資料獨立檢查，原始資料不可直接分享。
  - 依裝置種類縮小盤點範圍：[apps/dashboard/src/main/java/com/akto/service/atlas/AtlasDeviceScope.java](https://github.com/akto-api-security/akto/blob/4c4d9e664701b1f2f54ecad2e9f00df175048d1c/apps/dashboard/src/main/java/com/akto/service/atlas/AtlasDeviceScope.java)（browserDevices / apply / narrowFlags）；依瀏覽器名稱 Metadata 分類，並調整範圍內的標記；資料缺漏可能造成錯分，不是裝置身分驗證。
  - 區分未觸發政策與未覆蓋資產：[apps/dashboard/src/main/java/com/akto/service/insights/providers/PolicyHygieneProvider.java](https://github.com/akto-api-security/akto/blob/4c4d9e664701b1f2f54ecad2e9f00df175048d1c/apps/dashboard/src/main/java/com/akto/service/insights/providers/PolicyHygieneProvider.java)（compute / policyCoversHost）；上游資料不可用時須區分查詢失敗與真實零值；盤點及政策匹配需獨立驗收，不視為已完成合規稽核。

## usestrix-strix

- 固定版本 `9ed84f99c8f13fc921baebc59e0c696108cfab3e`；根授權：Apache-2.0；測試目標授權與相依另查
- 用途：提供授權安全測試的報告及覆蓋證據；本次聚焦區分 Agent 自述與機器觀測、標準化發現及安全匯出。
- 案例：規劃安全報告的覆蓋證據與匯出品質驗收；合成安全發現、模擬執行狀態及自有測試程式庫版本。 → 覆蓋缺口、SARIF 報告及安全匯出的驗收規格。 → 自有安全審查流程，由授權維護者核對證據後使用。
- 來源證據：
  - 區分安全測試覆蓋與發現數量：[strix/report/coverage.py](https://github.com/usestrix/strix/blob/9ed84f99c8f13fc921baebc59e0c696108cfab3e/strix/report/coverage.py)（build_coverage_document / skill_coverage_gaps / _completeness）；Agent 自述與執行觀測分開；未完成狀態不能宣告完整覆蓋，來源文字與實際測試證據仍須人工核對。
  - 標準化已取得的安全發現：[strix/report/sarif.py](https://github.com/usestrix/strix/blob/9ed84f99c8f13fc921baebc59e0c696108cfab3e/strix/report/sarif.py)（build_sarif_document / write_sarif / _build_locations）；不安全位置不直接當成原始碼位置，合成位置須明確標記；輸出相容性及發現真實性須另驗。
  - 避免報告文字被當成可執行內容：[strix/report/writer.py](https://github.com/usestrix/strix/blob/9ed84f99c8f13fc921baebc59e0c696108cfab3e/strix/report/writer.py)（csv_safe / safe_fence）；此為輸出層局部防護，不能取代完整渲染安全驗收；勿將來源中的程式片段自動執行。

## wquguru-cicada

- 固定版本 `be9785d562dfcfd22e3d1753a991400c5781f330`；根授權：Apache-2.0；語音模型、參與者同意及外部服務另查
- 用途：支援會議逐字稿與翻譯；本次查核本機逐字稿搜尋、Markdown 格式及指定資料夾匯出。
- 案例：規劃已授權會議紀錄的搜尋與私人知識庫匯出；合成雙語逐字稿、測試會議識別及核准的本機資料夾。 → 搜尋命中、Markdown Metadata 及資料夾匯出驗收規格。 → 私人知識庫的會議紀錄區，經本人與資料擁有者確認。
- 來源證據：
  - 依逐字稿及已知名稱變體搜尋：[Sources/Cicada/TranscriptSearch.swift](https://github.com/wquguru/cicada/blob/be9785d562dfcfd22e3d1753a991400c5781f330/Sources/Cicada/TranscriptSearch.swift)（TranscriptSearch.terms / TranscriptSearch.matches）；採文字包含比對及已知名稱變體，不是語意搜尋；命中不代表轉錄內容正確。
  - 將會議整理成可回查的 Markdown：[Sources/Cicada/FolderExport.swift](https://github.com/wquguru/cicada/blob/be9785d562dfcfd22e3d1753a991400c5781f330/Sources/Cicada/FolderExport.swift)（FolderExportFormat.safeName / FolderExportFormat.frontmatter / FolderExportFormat.document）；檔名處理不等於內容去識別化；Metadata 及逐字稿仍可能含隱私，需依資料分級確認。
  - 驗證指定資料夾的匯出與更新：[Sources/Cicada/FolderExport.swift](https://github.com/wquguru/cicada/blob/be9785d562dfcfd22e3d1753a991400c5781f330/Sources/Cicada/FolderExport.swift)（write / ensure / probe）；以原子寫入及名稱避碰處理；重新命名時可能移除舊檔，探查亦會寫入測試檔；須核准目標與備份，不能視為唯讀。
