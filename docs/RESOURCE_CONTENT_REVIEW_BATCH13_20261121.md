# Phase 2｜Resources Batch 13 — 20 筆來源審查與內容補強（2026-11-21）

## 範圍與來源層級
- 開始時 main HEAD `727228cc2cb16b7128435993eb291b874bc332ff`；前 12 批已合併 240 個不重複 Resource ID。
- 本批只修改另外 20 個 Canonical JSON、生成的 Catalog／Graph，以及本報告與 Rolling Handoff；原分類、原 Tags、Title、ID、Typed References 不變。
- 來源為正式產品網站、上游 GitHub README 或原始文章；只代表文件層級審查，不代表實際安裝、Runtime、Security、License 或 Integration 測試。
- Stitch MCP 官方設定頁無法擷取完整正文，`sourceStatus=partial`；原 token-saver 上游更名為 claude-saver；Mythos 原標題 5.1，但官方已列 5.2。
- 預期仍為 270 Resources、549 Canonical、569 Graph Nodes／1816 Edges。

## 逐筆 Before → After（Features／Requirements／Limitations）
| # | ID | Before → After | 新增內容／保留內容 | 官方來源 |
|---:|---|---|---|---|
| 1 | `aiposthub-awesome-opensource-ai-cheat-sheets-guide` | 5/2/4 → 5/2/4 | 十份工程速查表涵蓋設計、開源分類、模型推論、訓練、Prompt、檢索、Agent／MCP、多模態、評測與安全治理。；AI 系統設計的判斷表：先比較規則、單次模型、RAG、固定 Workflow、Agent 與多 Agent 的必要 | [來源](https://www.aiposthub.com/sraodev-awesome-opensource-ai-cheat-sheets-guide/) |
| 2 | `anthropic-claude-mythos-cybersecurity` | 0/0/0 → 3/2/2 | Mythos 系列用於受控的資安與生命科學研究。；官方 2026 年 11 月資訊已列 Mythos 5.2。；Cyber Verification Program 提供符合資格團隊的申請途徑。 | [來源](https://www.anthropic.com/claude/mythos) |
| 3 | `baoyu-skill` | 0/0/0 → 3/2/2 | 提供封面、漫畫、圖卡及資訊圖等內容生成 Skills。；包含文章處理與跨平台內容發布類工作流程。；可依獨立任務選擇特定 Skill 而非全套安裝。 | [來源](https://github.com/JimLiu/baoyu-skills/blob/main/README.md) |
| 4 | `blogger-distiller` | 0/0/0 → 3/2/2 | 研究公開創作者內容的選題與受眾策略。；將多個作品彙整為內容架構與可參考的創作模式。；把分析結果整理成 Agent 可使用的研究素材。 | [來源](https://github.com/otter1101/blogger-distiller) |
| 5 | `claude-svg-animation-logo-loading-chart-tutorial` | 0/0/0 → 3/2/2 | 介紹 Logo、Loading 與動態圖表三種 SVG 練習。；使用單檔 HTML 搭配 SVG、CSS 與 JavaScript 製作動畫。；區分 HTML、GIF、MP4 輸出並檢查圖表比例。 | [來源](https://www.aiposthub.com/claude-svg-animation-logo-loading-chart-tutorial/) |
| 6 | `gzh-design-skill` | 0/0/0 → 3/2/2 | 將 Markdown 轉為可貼進公眾號編輯器的 HTML。；提供排版主題與樣式內嵌轉換。；使用檢查腳本降低平台 HTML 格式相容問題。 | [來源](https://github.com/isjiamu/gzh-design-skill) |
| 7 | `kokonut-ui` | 0/0/0 → 3/2/2 | 提供 React、Tailwind、shadcn/ui 與 Motion 元件。；展示可選用的互動式 UI 與動態效果。；可依產品需求個別引入元件。 | [來源](https://github.com/kokonut-labs/kokonutui) |
| 8 | `littlehole2025-token-saver` | 0/0/0 → 3/2/2 | 提供 Claude Code 長上下文時的新任務提示。；建立新對話與完整 Session Handoff 摘要。；支援舊對話封存及對話名稱管理。 | [來源](https://github.com/littlehole2025/claude-saver) |
| 9 | `motion-dev-animations-skill` | 0/0/0 → 3/2/2 | 向 Coding Agent 提供 Motion.dev 動畫指引。；涵蓋 Spring、Gesture、Scroll 及介面時序。；協助將互動需求寫成可驗收的前端行為。 | [來源](https://github.com/199-biotechnologies/motion-dev-animations-skill) |
| 10 | `motion-sites` | 0/0/0 → 3/2/2 | 按 Scroll、Parallax、Hover 等類別瀏覽網站動效。；展示網頁轉場與微互動的視覺參考。；協助挑選符合產品資訊架構的動畫方法。 | [來源](https://motionsites.org/motion) |
| 11 | `pinterest-visual-reference` | 0/0/0 → 3/2/2 | 依圖片與影片主題搜尋視覺靈感。；以看板彙整構圖、鏡位與品牌調性。；把 Moodboard 作為設計需求討論的參考。 | [來源](https://www.pinterest.com/) |
| 12 | `rankupgames-spectra` | 0/0/0 → 3/2/2 | 建立程式庫拓樸與關聯索引供 Coding Agent 使用。；以 Code Anchor 和依賴資訊縮短 Codebase 探索流程。；支援大型程式庫理解與修改影響評估。 | [來源](https://github.com/rankupgames/Spectra) |
| 13 | `react-frontend-backend-for-beginners` | 0/0/0 → 3/2/2 | 解釋 React 前端與後端各自負責的工作。；建立 Browser、API、Server 與資料的互動概念。；適合配合小型 Web App 範例自學。 | [來源](https://sunzhi-will.github.io/blog/2026-10-06-react-frontend-backend-for-beginners) |
| 14 | `reverse-skill` | 0/0/0 → 3/2/2 | 提供逆向分析與獲授權安全研究的 Skill 路由。；根據目標類型選擇工具與研究流程。；協助保存調查依據及分析結果。 | [來源](https://github.com/zhaoxuya520/reverse-skill) |
| 15 | `skillry-opus-5-5-video-pattern-library` | 0/0/0 → 3/2/2 | 整理 Claude Opus 5.5 影片案例與原提示詞。；比較原始影片與 Skillry remake。；用案例拆解動態、敘事與生成策略。 | [來源](https://skillry.dev/ai-videos/opus-5-5) |
| 16 | `stitch-mcp` | 0/0/0 → 3/2/2 | 以 MCP 讓 Coding Agent 連接 Google Stitch。；提供設計資源與 Agent 工作流程的整合入口。；可作為設計到前端程式的連接層。 | [來源](https://stitch.google.com/docs/mcp/setup)（partial） |
| 17 | `stitch-skills` | 0/0/0 → 3/2/2 | 提供 Stitch 相關的 Agent Skills 與 Plugins。；透過 Stitch MCP 串接設計與前端實作工作流。；支援相容的 Codex、Claude Code 等 Agent。 | [來源](https://github.com/google-labs-code/stitch-skills) |
| 18 | `uiverse-io-galaxy` | 0/0/0 → 3/2/2 | 收錄社群提供的 CSS 與 Tailwind UI 元件。；包含 Buttons、Cards、Inputs、Forms 等分類。；可在 Uiverse 平台尋找局部元件與範例。 | [來源](https://github.com/uiverse-io/galaxy) |
| 19 | `ui-ux-gold-standard` | 0/0/0 → 3/2/2 | 提供介面比例、排版與動效的 Agent Skill 知識。；收錄可供前端設計決策參考的視覺方法。；協助把設計規則整理成檢查清單。 | [來源](https://github.com/migueljnew-droid/ui-ux-gold-standard) |
| 20 | `wellmade` | 0/0/0 → 3/2/2 | 按 UI、圖示、品牌、網站與動畫分類欣賞作品。；以 Latest 或 Top 等排序方式探索創意參考。；比較產品形象與行銷視覺的跨媒介呈現。 | [來源](https://wellmade.fyi/) |

## 逐筆使用前提與限制
### 1. `aiposthub-awesome-opensource-ai-cheat-sheets-guide`
- **Requirements**：閱讀原文無需安裝；實際導入需先定義自己的 AI 系統需求、風險與評估門檻。；需要具體專案後，才決定應採用哪些檢核表及如何實作相關測試。
- **Limitations**：文章是第三方導讀，不是 sraodev 專案正式內容；內容有差異時以原始文件與引用的一手標準為準。；原始 Repo 的 MIT License 只涵蓋其原創內容；AI 郵報文章及連結資源各自有授權，不能假設同樣適用 MIT。
- **Source**：[官方／原始頁](https://www.aiposthub.com/sraodev-awesome-opensource-ai-cheat-sheets-guide/)

### 2. `anthropic-claude-mythos-cybersecurity`
- **Requirements**：先取得官方方案與所需模型的合法存取資格。；僅分析獲授權的研究對象，保存安全範圍與審核紀錄。
- **Limitations**：原 Canonical Title 為 5.1 歷史識別，最新官方頁已列 5.2。；進階資安模型具有雙重用途，不可把輸出當作無須專家查證的結論。
- **Source**：[官方／原始頁](https://www.anthropic.com/claude/mythos)

### 3. `baoyu-skill`
- **Requirements**：逐項檢查選用的 SKILL.md 與依賴。；涉及帳號發布及外部模型時先核准權限、素材與費用。
- **Limitations**：不同 Skills 的風險及依賴並不相同。；模型費用、素材著作權及發文結果仍需審查。
- **Source**：[官方／原始頁](https://github.com/JimLiu/baoyu-skills/blob/main/README.md)

### 4. `blogger-distiller`
- **Requirements**：只使用有權存取的公開資料並保留原文連結。；先核對網站擷取政策及本機 Skill 權限。
- **Limitations**：對創作者思路的歸納是推論，不等於本人認可。；不可繞過登入限制或重製未獲授權的內容。
- **Source**：[官方／原始頁](https://github.com/otter1101/blogger-distiller)

### 5. `claude-svg-animation-logo-loading-chart-tutorial`
- **Requirements**：事先給出動作、時序、尺寸與輸出格式。；用瀏覽器實測互動、響應式與 reduced-motion。
- **Limitations**：教學提示詞不代表作品已通過執行驗收。；簡易 SVG 不足以取代複雜 3D 或專業影片剪輯。
- **Source**：[官方／原始頁](https://www.aiposthub.com/claude-svg-animation-logo-loading-chart-tutorial/)

### 6. `gzh-design-skill`
- **Requirements**：需相容的 Agent 環境並先核查依賴。；用有權發布的文章在目標編輯器實際貼上測試。
- **Limitations**：平台貼上與樣式限制可能變更。；第三方 Skill 不代表已完成依賴、授權和安全驗證。
- **Source**：[官方／原始頁](https://github.com/isjiamu/gzh-design-skill)

### 7. `kokonut-ui`
- **Requirements**：先確認 React、Tailwind 與 Motion 相依版本。；用桌面和手機實測 Focus、鍵盤、效能與 reduced-motion。
- **Limitations**：示範效果不能保證在所有裝置維持效能。；元件可能有 CSS 衝突、依賴與無障礙缺口。
- **Source**：[官方／原始頁](https://github.com/kokonut-labs/kokonutui)

### 8. `littlehole2025-token-saver`
- **Requirements**：以新 repo 名 claude-saver 檢查安裝與 Hook 權限。；事先確認敏感對話摘要的存放與封存邊界。
- **Limitations**：原 Repo token-saver 已更名為 claude-saver，舊名稱非最新版本識別。；此功能屬 Claude Code 外掛，不表示其他聊天產品可直接使用。
- **Source**：[官方／原始頁](https://github.com/littlehole2025/claude-saver)

### 9. `motion-dev-animations-skill`
- **Requirements**：需相容的 Agent 與 Motion 前端開發環境。；明確指定互動狀態、動畫節奏、效能與無障礙要求。
- **Limitations**：展示的動態品質不是跨瀏覽器實測證據。；上游 Skill 指示不構成安裝或修改本機環境的授權。
- **Source**：[官方／原始頁](https://github.com/199-biotechnologies/motion-dev-animations-skill)

### 10. `motion-sites`
- **Requirements**：以瀏覽器查看作品並記錄原始來源。；先確認目標網站的效能與 reduced-motion 要求。
- **Limitations**：範例動效不代表有可重用程式碼或授權。；過度動畫可能犧牲可讀性及互動效能。
- **Source**：[官方／原始頁](https://motionsites.org/motion)

### 11. `pinterest-visual-reference`
- **Requirements**：使用帳戶功能時保留圖片原作者及來源連結。；商用或 AI 重製前先取得相應素材授權。
- **Limitations**：釘選不等於取得圖片使用權。；搜尋結果可能包含再轉載或缺乏來源的素材。
- **Source**：[官方／原始頁](https://www.pinterest.com/)

### 12. `rankupgames-spectra`
- **Requirements**：需合法取得程式庫的讀取權限並確認工具鏈。；確定索引快取及來源程式碼能否存取或傳輸。
- **Limitations**：靜態拓樸無法證明完整 Runtime 呼叫鏈。；本批未測量 Token 節省或執行程式索引。
- **Source**：[官方／原始頁](https://github.com/rankupgames/Spectra)

### 13. `react-frontend-backend-for-beginners`
- **Requirements**：需具備基本 JavaScript 與 HTTP Request 概念。；搭配能實際執行的表單與 API 範例驗證理解。
- **Limitations**：入門文章未涵蓋完整生產環境資安與部署。；具體框架版本與實作方式應核對官方文件。
- **Source**：[官方／原始頁](https://sunzhi-will.github.io/blog/2026-10-06-react-frontend-backend-for-beginners)

### 14. `reverse-skill`
- **Requirements**：先取得目標所有者的明確授權與工作範圍。；使用隔離環境審查工具鏈、腳本與資料權限。
- **Limitations**：第三方安全 Skill 未經本批安裝或資安審核。；不得將流程用於未授權入侵或外洩資料。
- **Source**：[官方／原始頁](https://github.com/zhaoxuya520/reverse-skill)

### 15. `skillry-opus-5-5-video-pattern-library`
- **Requirements**：需記錄模型版本、素材及 Prompt 設定。；多次實測以評估可重現性而非僅看展示影片。
- **Limitations**：公開提示詞無法保證相同輸出。；範例素材與音訊不一定授權商用或改作。
- **Source**：[官方／原始頁](https://skillry.dev/ai-videos/opus-5-5)

### 16. `stitch-mcp`
- **Requirements**：先依官方設定頁建立 MCP 連線與專案權限。；檢查 Agent 的實際操作權限與來源資料範圍。
- **Limitations**：MCP 端點及身分驗證方式可能隨版本變更。；本批未實際連線，且官方頁缺少可完整擷取正文。
- **Source**：[官方／原始頁](https://stitch.google.com/docs/mcp/setup)；頁面未能完整抽取，不宣稱完整查核。

### 17. `stitch-skills`
- **Requirements**：先依官方說明設定 Stitch MCP 與相容 Plugin。；確認安裝範圍、設計檔案及工程專案權限。
- **Limitations**：存在 Skills 不代表相應服務已連線成功。；上游功能與工具授權可能改變，需實測和版本檢查。
- **Source**：[官方／原始頁](https://github.com/google-labs-code/stitch-skills)

### 18. `uiverse-io-galaxy`
- **Requirements**：核對選定元件的來源、授權與樣式相容性。；在實際網站確認手機、鍵盤及可存取性。
- **Limitations**：社群元件品質不一致，不能直接視為生產等級。；大量套用第三方 CSS 可能造成衝突與效能問題。
- **Source**：[官方／原始頁](https://github.com/uiverse-io/galaxy)

### 19. `ui-ux-gold-standard`
- **Requirements**：先確認支援的 Agent 與安裝來源。；在產品真實資料與裝置上驗收設計效果。
- **Limitations**：作者列出的技法數量不是逐項成功驗證證據。；不能取代效能、可存取性與需求驗收。
- **Source**：[官方／原始頁](https://github.com/migueljnew-droid/ui-ux-gold-standard)

### 20. `wellmade`
- **Requirements**：保留作品作者、來源和取得日期。；引用圖片、Logo、影片前須取得適當授權。
- **Limitations**：展示作品不代表可下載原始碼或自由改作。；第三方素材或網站連結可能隨時變動。
- **Source**：[官方／原始頁](https://wellmade.fyi/)

## Release Gate
- ID、Title、Category、Tags、Primary Domain 和既有 Typed References 維持不變，Graph Edge 不新增。
- 在本 PR 最新 Head 取得 Unified Intake Gate、V2 Data Validate、P1 Graph Unit Tests 的實際 CI 證據後才可合併。
- 合併後需獨立查 main Push、Catalog Sync、Pages Deploy 與 Live Smoke；若 Smoke 先於 Deploy，不能當事後部署驗收。
- 沒有第三方程式碼執行、授權掃描、資安掃描、整合驗證或使用者帳號操作。
- 候選合併後為 260/270，剩 10 筆；**PR Merge 前 main 仍是 240/270**。
