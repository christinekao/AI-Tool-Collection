# Phase 2 — Resource Batch 07（2026-11-19）

## 本批範圍
- 查核 16 筆正式 GitHub Repository README（含不同 README 路徑）及 4 筆官方產品網站：Coolors、DaVinci Resolve、Artlist、Google Flow。
- 僅補原本缺失的具體功能、使用條件、限制及風險；保留原本正確的 Purpose、Recommendation、分類與知識引用。
- 20 個 Resource Canonical + 派生 Catalog、Graph；不新增刪除 Entity、Tags、Typed References 或 Graph 關聯。全庫 549 筆／Resources 270 筆保持不變。
- 內容層級為 **Source Reviewed**，不是第三方 Runtime、Build、Integrations、License 或 Security 的正式實測。

## Before／After
欄位數量以「功能／前提／限制」表示：

| # | Resource ID | Before→After | 本批補上的限制與風險 | 官方文件 |
|---:|---|---|---|---|
| 1 | `alsyundawy-microsoft-office-for-macos` | 0/0/0→2/2/2 | README 提供第三方授權序號及 Serializer，可能涉及非法繞過授權或惡意程式；第三方安裝器、Telemetry 修改及系統權限變更不能視為 Microsoft 官方支援 | [官方來源](https://github.com/alsyundawy/Microsoft-Office-For-MacOS/blob/master/README.md) |
| 2 | `anti-gambling-trader-tw` | 0/0/0→2/2/2 | 此工具不提供真實下單，任何示範績效不等於未來可獲利；本機暫存檔和唯讀憑證仍需清理，意外退出可能留有暫存資訊 | [官方來源](https://github.com/mars-tw/anti-gambling-trader-tw/blob/main/README.md) |
| 3 | `shubhamsaboo-awesome-llm-apps` | 0/0/0→2/2/2 | 整個合集不是單一可安裝 App，子專案的維護和版本成熟度不同；部分示例涉及外部服務、金鑰、費用或 Agent 副作用，須逐個驗證 | [官方來源](https://github.com/Shubhamsaboo/awesome-llm-apps/blob/main/README.md) |
| 4 | `shubhamsaboo-needle` | 0/0/0→2/2/2 | 部分頁面文字會送往 AI Gateway，可能涉及隱私、授權與費用；健康檢查只確認服務可達或配置狀態，不等於模型金鑰、帳戶額度及語意準確性已驗證 | [官方來源](https://github.com/Shubhamsaboo/awesome-llm-apps/blob/main/advanced_llm_apps/needle/README.md) |
| 5 | `social-post` | 0/0/0→2/2/2 | README 標示本機 Workbench 不是已部署的商用多租戶 SaaS；不會預設 24 小時監聽，Cookie、Session 與 Token 必須排除於記錄及匯出 | [官方來源](https://github.com/Hao0321/claude-skill-social-post/blob/main/README.md) |
| 6 | `storytold-artcraft` | 0/0/0→2/2/2 | 第三方模型與素材受各自授權及服務條款約束；README 宣稱支援的供應商和 3D 功能可能隨版本及硬體條件變更 | [官方來源](https://github.com/storytold/artcraft/blob/main/README.md) |
| 7 | `storytold-filmcraft` | 0/0/0→2/2/2 | 不是所有媒體格式／Codec 已經支援，特定編碼要先測試；隨附字型、Icon 與其他資產有獨立授權，不可只看主 Repo 授權 | [官方來源](https://github.com/storytold/filmcraft/blob/main/README.md) |
| 8 | `strelov1-freehire-mcp` | 0/0/0→2/2/2 | OAuth 連接器可能接觸求職者個資與帳戶操作，不宜給過大權限；自動投遞與工作流程不可因 MCP 可用就預設被授權 | [官方來源](https://github.com/strelov1/freehire-mcp/blob/main/README.md) |
| 9 | `strelov1-freehire` | 0/0/0→2/2/2 | 抓取頻率及資料來源可能造成延遲、遺漏或已下架職缺；Docker 資料卷若遭移除會刪除索引及帳戶資料，須先備份 | [官方來源](https://github.com/strelov1/freehire/blob/main/README.md) |
| 10 | `unclebob-ub-mode` | 0/0/0→2/2/2 | 不同語言與專案未必適用同一門檻，品質工具結果須結合實際行為；裝配相關工具需分別核對環境與工具版本，不能把規則當成已執行測試 | [官方來源](https://github.com/unclebob/ub-mode/blob/main/README.md) |
| 11 | `usestrix-strix` | 0/0/0→2/2/2 | 自動安全測試可能產生大量請求或修改狀態，嚴禁對未授權目標執行；作者示範 PoC 不代表所有漏洞已驗證或已修復 | [官方來源](https://github.com/usestrix/strix/blob/main/README.md) |
| 12 | `voltagent-awesome-agent-skills` | 0/0/0→2/2/2 | 合集收錄不代表所有第三方 Skill 皆經獨立安全驗證；上游 Skill 路徑、Host 相容性和依賴可隨時間改變 | [官方來源](https://github.com/VoltAgent/awesome-agent-skills/blob/main/README.md) |
| 13 | `waooai-waoowaoo` | 0/0/0→2/2/2 | 上游標示 Preview Release，仍可能有 Bug 或不完整功能；v0.5.0-beta.1 起採 Elastic License 2.0，不可誤稱全功能自由開源 | [官方來源](https://github.com/waooAI/waoowaoo/blob/main/README.md) |
| 14 | `wilsonfreitas-awesome-quant` | 0/0/0→2/2/2 | 合集不是已測試的單一量化平台，所列工具可能停更或過期；歷史回測不等於投資保證，個別資料供應商或市場有不同限制 | [官方來源](https://github.com/wilsonfreitas/awesome-quant/blob/main/README.md) |
| 15 | `wrenai` | 0/0/0→2/2/2 | 舊版 Docker 聊天 BI 產品使用方式已變動，不能沿用舊部署假設；開源 CLI 與 Enterprise 功能、權限或支援範圍不同 | [官方來源](https://github.com/Canner/WrenAI/blob/main/README.md) |
| 16 | `zhouxiaoka-autoclip` | 0/0/0→2/2/2 | 若選雲端分析會傳送字幕、抽樣畫面或音訊等輸入資料；Intel Mac 無對應桌面安裝包，特定平台需 Docker 或 CLI | [官方來源](https://github.com/zhouxiaoka/autoclip/blob/main/README.md) |
| 17 | `coolors` | 0/0/0→2/2/2 | 部分進階功能及使用額度可能依免費或付費方案不同；配色對比工具不會替整體介面自動保證 WCAG 合規或品牌一致性 | [官方來源](https://coolors.co/) |
| 18 | `davinci-resolve` | 0/0/0→2/2/2 | 許多 AI Neural Engine、進階 Resolve FX 和部分功能限 Studio 版本；大型素材及 GPU 運算可能需求較高硬體，不同格式支援需另核對 | [官方來源](https://www.blackmagicdesign.com/products/davinciresolve/) |
| 19 | `artlist` | 0/0/0→2/2/2 | 素材授權不代表可將原始素材獨立轉售、再分發或當資料庫提供；生成服務及訂閱 Credit、付費下載與帳戶期限可能有限制 | [官方來源](https://artlist.io/) |
| 20 | `google-flow` | 0/0/0→2/2/2 | 官方各功能和模型依 Google AI 方案、區域及每日 Credit 額度不同；生成與上傳的角色、素材、肖像需符合平台政策及使用權利 | [官方來源](https://labs.google/fx/tools/flow) |

## 重點查核
- `alsyundawy-microsoft-office-for-macos`：包含第三方授權工具及序號，不能作為 Microsoft 官方授權來源。
- `social-post`：說明 6 Modes、Local Workbench、送出開關與 Cookie／Session 隱私邊界，不把它宣稱為已部署商業服務。
- `shubhamsaboo-needle`：Vercel AI Gateway 費用、模型存取和伺服器 Access Token 必須分開確認。
- `wrenai`：現行官方 README 以 WrenAI CLI／Semantic Layer 為主要入口，避免誤用舊版 Docker Chat BI 指令。
- `waooai-waoowaoo`：Preview 及 Elastic License 2.0 限制。
- `google-flow`：功能與 Credit 會隨免費／付費方案及可用區域不同，未將官方費率截圖當成永久數字。
- `artlist`：授權內容需嵌入成片，不能將音樂素材獨立轉售或作資料庫。

## Gate
- Unified Intake Gate、V2 Data Validate、P1 Graph Unit Tests 檢查 Schema 與可追溯欄位。
- PR 合併後應另查 Main Catalog Sync、Pages Deployment 及 Live Smoke；來源查核與真正的工具安裝／授權／Security Audit 必須分開。
