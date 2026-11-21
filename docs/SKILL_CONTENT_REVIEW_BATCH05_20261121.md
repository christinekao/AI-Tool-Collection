# Skills Phase 2 — Batch 05 逐筆來源與操作契約審查

2026-11-21（Asia/Taipei）｜Base main `8fb823d054abaa0b2e8b88a9e9ec20c2d43e3fc4`｜Branch `skill-content-batch05-20261121`

## Scope／改動與檢查範圍

- 第 **81–100** 筆，共 **20/20** 既有 Canonical Skill JSON 新增／補強 `skillGuide` 與 `intakeReview`，整理 Trigger、Input、Execution、Output、Risk 和 Gate。
- **15/20** 經官方 GitHub README／SKILL.md 查核；其餘 **5/20** 依 [MiniMax 官方 Skills Catalog](https://agent.minimax.io/skills) 確認名稱與用途，但完整 Package、SKILL.md、版本／命令、完整授權與實際執行依然無法確認（`sourceStatus=partial`、`readingSpec.status=deferred`）。
- 比對 GitHub main 舊資料，**原 ID、Tags、Primary／Secondary Domains、Typed References 全數保留**，沒有自行新增 Concept／Capability／Workflow 的正式 Graph 關係。
- Derived Catalog 更新 20 筆 Skill；Graph 對應 20 個 Node 的內容同步，保留 **569 Nodes／1816 Edges**。集合數字維持 270 Resources／123 Skills／68 Concepts／35 Prompts／17 Combinations／36 Workflows。
- 本批**沒有安裝或執行第三方 Skills**，沒有讀取憑證、修改第三方帳號、取得企業資料或執行任何安全掃描。文件閱讀不是 Runtime／Security／Integration／License 的認證。

## Before／After 概覽

| # | Skill ID | Input/Output 數（前 → 後） | 上游來源證據 |
|---:|---|---|---|
| 81 | `mattpocock-grill-me` | 2/1 → 2/2 | 官方 README／SKILL.md |
| 82 | `mattpocock-grill-with-docs` | 2/1 → 2/2 | 官方 README／SKILL.md |
| 83 | `mattpocock-handoff` | 2/1 → 2/2 | 官方 README／SKILL.md |
| 84 | `mattpocock-skills` | 0/0 → 2/2 | 官方 README／SKILL.md |
| 85 | `mattpocock-tdd` | 2/1 → 2/2 | 官方 README／SKILL.md |
| 86 | `mattpocock-triage` | 2/1 → 2/2 | 官方 README／SKILL.md |
| 87 | `michael-denyer-pstack-claude` | 4/4 → 2/2 | 官方 README／SKILL.md |
| 88 | `minimax-code-community-interactive-visualization-architect` | 1/1 → 2/2 | MiniMax 官方目錄／PARTIAL |
| 89 | `minimax-code-community-landing-page-builder` | 1/1 → 2/2 | MiniMax 官方目錄／PARTIAL |
| 90 | `minimax-code-community-pptx-generator` | 1/1 → 2/2 | MiniMax 官方目錄／PARTIAL |
| 91 | `minimax-code-community-seo-geo-optimization-expert` | 1/1 → 2/2 | MiniMax 官方目錄／PARTIAL |
| 92 | `minimax-code-community-visual-content-generator` | 1/1 → 2/2 | MiniMax 官方目錄／PARTIAL |
| 93 | `motion-dev-animations-skill` | 0/0 → 2/2 | 官方 README／SKILL.md |
| 94 | `mukul975-anthropic-cybersecurity-skills` | 0/0 → 2/2 | 官方 README／SKILL.md |
| 95 | `nutlope-hallmark` | 4/4 → 2/2 | 官方 README／SKILL.md |
| 96 | `nvidia-auto-ontology-management` | 0/0 → 2/2 | 官方 README／SKILL.md |
| 97 | `nvidia-auto-ontology-query` | 0/0 → 2/2 | 官方 README／SKILL.md |
| 98 | `nvidia-auto-ontology-setup` | 0/0 → 2/2 | 官方 README／SKILL.md |
| 99 | `nvidia-skillspector` | 0/0 → 2/2 | 官方 README／SKILL.md |
| 100 | `oh-my-mermaid-omm-push` | 4/3 → 2/2 | 官方 README／SKILL.md |

## 逐筆契約
### 81. `mattpocock-grill-me`
- **Source**：[來源文件](https://github.com/mattpocock/skills/blob/main/skills/productivity/grill-me/SKILL.md)｜官方 user-invoked 小型入口。
- **Trigger**：使用者明確呼叫 /grill-me 釐清產品想法或計畫。
- **Not Trigger / Stop**：已確認的規格不需要重啟訪談；此版本不寫入 ADR／Glossary。
- **Host / Command**：官方 user-invoked /grill-me 呼叫 Skill tool 的 grilling（disable-model-invocation）。
- **Inputs**：待釐清的目標、計畫或產品需求；已有的限制、假設與未決事項。
- **Outputs**：逐輪問題及經確認的決策；未解假設和下一步。
- **Execution**：列出未知：找到重要模糊點和需求邊界 → 執行 grilling：追問方案取捨、反例與成功標準 → 收斂結論：整理共識和未決項，不自動寫文件。
- **Risk**：假設冒充決策：不得自行決定未知需求；文件寫入越界：不得擅自新增 ADR。
- **Gate**：保留實際回答和未決清單；沒有未經同意的文件改動。
- **Evidence**：OFFICIAL SOURCE READ；外部 Runtime／Security／完整 License／Integration **NOT TESTED**。

### 82. `mattpocock-grill-with-docs`
- **Source**：[來源文件](https://github.com/mattpocock/skills/blob/main/skills/engineering/grill-with-docs/SKILL.md)｜官方 grilling + domain-modeling。
- **Trigger**：明確呼叫 /grill-with-docs 並希望保存 Glossary／ADR。
- **Not Trigger / Stop**：只要訪談不要文件時選 /grill-me；未同意的名詞和 ADR 不能直接寫入。
- **Host / Command**：官方 user-invoked，呼叫 Skill tool 的 grilling 與 domain-modeling 兩個技能。
- **Inputs**：待釐清需求及設計決策；現有 Glossary、ADR、專案文件及寫入權限。
- **Outputs**：確認的共用術語與取捨；經核准更新的 GLOSSARY.md 和 ADR。
- **Execution**：閱讀既有文件：先辨識既有術語和已決策事項 → 雙技能追問：grilling 加 domain-modeling 釐清邊界 → 寫入覆核：最小化更新 Glossary／ADR 並顯示 Diff。
- **Risk**：文件副作用：Glossary／ADR 會改變之後的 Agent 理解；過度建模：不可把假設寫成公認術語。
- **Gate**：變更都能連回已確認的回答；舊 ADR 不被無聲覆蓋。
- **Evidence**：OFFICIAL SOURCE READ；外部 Runtime／Security／完整 License／Integration **NOT TESTED**。

### 83. `mattpocock-handoff`
- **Source**：[來源文件](https://github.com/mattpocock/skills/blob/main/skills/productivity/handoff/SKILL.md)｜官方 temporary directory 契約。
- **Trigger**：使用者明確呼叫 /handoff，準備新 Session 或交給另一 Agent。
- **Not Trigger / Stop**：沒有真實進度不可推測完成；來源要求寫 OS 暫存目錄，而非專案。
- **Host / Command**：官方 /handoff [下個 Session 目標]，disable-model-invocation；儲存 $TMPDIR／/tmp／%TEMP%。
- **Inputs**：會話目標、決策、成果與剩餘事項；既有文件、PR、Commit、Issue 和證據 URL。
- **Outputs**：可在暫存目錄找到的交接文件；Suggested Skills 與精確參照。
- **Execution**：盤點現況：整理真正完成、卡住及待驗範圍 → 引用既有成果：連到 Spec、Issue、PR，而不是複製全文 → 敏感資訊清理：遮蔽 API Key、密碼及個資並存 OS 暫存。
- **Risk**：個資與憑證：不可暴露敏感資訊；暫存過期：不是持久保存的位置。
- **Gate**：含下一個 Session 的具體起點；沒有虛構測試或保存證據。
- **Evidence**：OFFICIAL SOURCE READ；外部 Runtime／Security／完整 License／Integration **NOT TESTED**。

### 84. `mattpocock-skills`
- **Source**：[來源文件](https://github.com/mattpocock/skills/blob/main/README.md)｜官方工程 Skills 合集。
- **Trigger**：為需求、設計、測試、Issue、交接等工程任務挑選正式 Skill。
- **Not Trigger / Stop**：合集不等於單一 Slash Command；同一 Agent 不要同時安裝 Plugin 和 skills.sh 副本。
- **Host / Command**：官方 README 列 Plugin／skills.sh 安裝選項及 /setup-matt-pocock-skills，子 Skill 各自區分 user/model-invoked。
- **Inputs**：工作目標和現有 Agent Host；專案 Issue Tracker、文件位置及現有安裝狀態。
- **Outputs**：適合的子 Skill、正確的觸發與環境前提；驗證和操作權限清單。
- **Execution**：分類問題：按需求對齊、測試、設計、交接挑候選 → 核對原文：確認子 SKILL.md 和 user/model-invoked 規則 → 設定環境：在授權後設定 Tracker、Labels、Docs 位置。
- **Risk**：雙重安裝：Plugin／skills.sh 重複觸發；副作用：某些子 Skill 修改 Issue、文件、Repo。
- **Gate**：不把合集當單一可執行 Skill；每個子 Skill 的啟動和權限明確。
- **Evidence**：OFFICIAL SOURCE READ；外部 Runtime／Security／完整 License／Integration **NOT TESTED**。

### 85. `mattpocock-tdd`
- **Source**：[來源文件](https://github.com/mattpocock/skills/blob/main/skills/engineering/tdd/SKILL.md)｜Red → Green；Refactor 不在循環內。
- **Trigger**：要以 Test-first 方式開發功能或修 Bug；官方可 model-invoked。
- **Not Trigger / Stop**：測試 Seam 未經使用者同意前不可開始；Refactor 留到 Code Review。
- **Host / Command**：官方 model-invoked tdd；先協議 public seam，再一個 failing test、一個最小實作。
- **Inputs**：目標行為與獨立預期值；已確認測試 Seam、程式碼和測試環境。
- **Outputs**：Red 和 Green 測試及最小實作；執行紀錄、未覆蓋路徑和回歸證據。
- **Execution**：確認 Seam：先向使用者確認公開介面的測試邊界 → Red：寫一個先失敗的行為測試 → Green：只實作通過此測試的最小行為 → 持續垂直切片：下一個行為再循環，Review 才重構。
- **Risk**：無效斷言：Tautological assertion 或內部 Mock 會掩蓋問題；大量水平測試：先測整批想像的行為可能破壞可用性。
- **Gate**：先有獨立 Red 再有 Green 證據；測的是核准公開 Seam 而非私有實作。
- **Evidence**：OFFICIAL SOURCE READ；外部 Runtime／Security／完整 License／Integration **NOT TESTED**。

### 86. `mattpocock-triage`
- **Source**：[來源文件](https://github.com/mattpocock/skills/blob/main/skills/engineering/triage/SKILL.md)｜2 category／5 state；AI comment disclaimer。
- **Trigger**：Maintainer 明確使用 /triage 處理指定 Issue／PR 或待辦清單。
- **Not Trigger / Stop**：缺 tracker label 對應需先設定；角色衝突先停，未經核准不關閉 Issue。
- **Host / Command**：官方 user-invoked /triage；2 category roles：bug/enhancement；5 state roles：needs-triage／needs-info／ready-for-agent／ready-for-human／wontfix。
- **Inputs**：完整 Issue／PR、討論與 Diff；Issue Tracker 設定、Repo、先前 triage 和維護者決策。
- **Outputs**：分類和狀態的建議與驗證結果；Agent Brief／Needs-info Notes／實際採用的標籤變更。
- **Execution**：蒐集：讀討論、程式和先前結論，查重與 out-of-scope → 建議分類：提供 bug/enhancement 與單一 state role 理由 → 重現和追問：檢 Bug、PR Diff，必要時 grilling＋domain-modeling → 採取授權行動：更新 Tracker 並在 AI 留言前加官方揭露文字。
- **Risk**：誤關閉：wontfix 和 ready-for-human 不能自行決定；遠端副作用：Labels、留言、關閉 Issue 都會改權限範圍外資料。
- **Gate**：每個 Issue 恰有 1 個 category 和 1 個 state；AI 留言具來源要求的聲明與驗證證據。
- **Evidence**：OFFICIAL SOURCE READ；外部 Runtime／Security／完整 License／Integration **NOT TESTED**。

### 87. `michael-denyer-pstack-claude`
- **Source**：[來源文件](https://github.com/michael-denyer/pstack-claude/blob/main/README.md)｜官方跨 Harness README；poteto-mode。
- **Trigger**：需要跨 Host 重用工程 Workflow 或改善多 Agent 工程品質。
- **Not Trigger / Stop**：不能自動安裝 SessionStart Hook；各 Host 工具、版本和模型映射不可假定相同。
- **Host / Command**：官方 README：Claude Code、Codex、Pi、Copilot 等不同安裝入口；Codex 可呼叫 $poteto-mode。
- **Inputs**：Issue 或任務、程式碼及 Acceptance Criteria；Host 版本、批准的 Plugin／Hook 和可用的執行工具。
- **Outputs**：路由後的 Skill／Playbook 和任務計畫；變更、測試、Review、風險與交接證據。
- **Execution**：確認 Host：檢版本、Hook、插件和模型可用性 → 路由：按任務選 poteto-mode 工作流程 → 執行驗證：真正跑測試與獨立 Review → 交付：保留限制與待驗範圍。
- **Risk**：Hook 行為：SessionStart 可能自動路由、改變 Agent 執行；跨工具差異：不同 CLI 的子 Agent 能力可能不相容。
- **Gate**：Host、版本、Hook 權限確實確認；沒有測試結果不聲稱 TDD 或 Review PASS。
- **Evidence**：OFFICIAL SOURCE READ；外部 Runtime／Security／完整 License／Integration **NOT TESTED**。

### 88. `minimax-code-community-interactive-visualization-architect`
- **Source**：[來源文件](https://agent.minimax.io/skills)｜官方 Catalog 已列名；原始 Package PARTIAL。
- **Trigger**：需要可直接操作、修改參數的互動式教學展示。
- **Not Trigger / Stop**：尚無完整 SKILL.md／Package URL，不能宣稱具備正式安裝命令或已輸出分享網址。
- **Host / Command**：MiniMax 官方 Skills Catalog 已列名 interactive-visualization-architect；套件及版本待查。
- **Inputs**：核心概念、參數與受眾；預期互動、數學條件及操作設備。
- **Outputs**：目錄描述的互動 Web Demo（未實測）；驗證數值、互動及分享的測試準則。
- **Execution**：界定模型：釐清參數和互動結果 → 核對目錄：確認名稱和官方描述，保留 Package 缺口 → 規劃驗收：定義可重現輸入與正確性測試。
- **Risk**：錯誤視覺化：漂亮動畫可能不符合原理；來源不足：尚未審查執行權限與外傳風險。
- **Gate**：未取得完整 Package 不執行安裝；真實 Demo 才核對計算及互動。
- **Evidence**：官方 Catalog 可查、Package/SKILL.md 尚未取得；外部 Runtime／Security／完整 License／Integration **NOT TESTED**。

### 89. `minimax-code-community-landing-page-builder`
- **Source**：[來源文件](https://agent.minimax.io/skills)｜官方 Catalog 已列名；SKILL.md／Package PARTIAL。
- **Trigger**：希望根據真實內容與品牌需求製作行銷網站入口頁。
- **Not Trigger / Stop**：公開摘要不證實正式 SPEC.md 輸出或完整 Trigger，不能推測執行命令。
- **Host / Command**：MiniMax 官方 Skills Catalog 已列名 landing-page-builder；完整 SKILL.md 待查。
- **Inputs**：產品價值、使用者、文案和主要 CTA；合法的圖片、Logo、前端框架與響應式需求。
- **Outputs**：目錄描述的 Landing Page 候選成果（未實測）；Browser、內容與可及性驗收門檻。
- **Execution**：建立 Brief：確認受眾、真實內容和 CTA → 核對 Package：官方目錄確認名稱但不推測命令 → 規劃實測：審查內容、鍵盤和四種寬度。
- **Risk**：素材版權：Logo 與圖片需授權；輸出品質：Catalog 不是 Browser QA 證據。
- **Gate**：來源不足時維持 PARTIAL；只有實際渲染才能宣稱響應式通過。
- **Evidence**：官方 Catalog 可查、Package/SKILL.md 尚未取得；外部 Runtime／Security／完整 License／Integration **NOT TESTED**。

### 90. `minimax-code-community-pptx-generator`
- **Source**：[來源文件](https://agent.minimax.io/skills)｜官方 Catalog 已列名；原始 Package PARTIAL。
- **Trigger**：使用者想建立、修改或讀取 PPT／PPTX／Slides。
- **Not Trigger / Stop**：未得到原始 Package，不保證 16:9、字型及 XML 編輯行為或具體輸出文件。
- **Host / Command**：官方 Catalog 列名 pptx-generator，描述 PptxGenJS、XML 與 markitdown；套件待查。
- **Inputs**：簡報內容、受眾、頁數與目標比例；資料來源、圖片、字型和可編輯性需求。
- **Outputs**：目錄宣稱的 PPTX 與內容擷取能力（未實測）；逐頁排版和相容性驗收清單。
- **Execution**：規劃簡報：確認結構、資料和素材權利 → 核對來源：Catalog 記錄能力但缺 SKILL.md → 品質門檻：設計開檔、溢位和內容測試。
- **Risk**：相容性：僅宣稱可生成不代表已測過 Office；著作權：模板、圖表和字型需要另外授權。
- **Gate**：未取得套件不宣稱已執行 PPTX；每頁真實渲染後才能通過驗收。
- **Evidence**：官方 Catalog 可查、Package/SKILL.md 尚未取得；外部 Runtime／Security／完整 License／Integration **NOT TESTED**。

### 91. `minimax-code-community-seo-geo-optimization-expert`
- **Source**：[來源文件](https://agent.minimax.io/skills)｜官方 Catalog 已列名及上游資訊；SKILL.md 未讀。
- **Trigger**：網站需要技術 SEO、內容可見性或生成式引擎引用優化。
- **Not Trigger / Stop**：尚未取得完整 Package／SKILL.md；排名、引用和流量成果不可預先保證。
- **Host / Command**：官方 Catalog 已列名 seo-geo-optimization-expert，標記參考 Aaron He Zhu 的 Apache-2.0 上游；平台套件完整授權待查。
- **Inputs**：網站 URL、內容和目標使用者；SEO 基準線、目標詞、索引資訊及修改權限。
- **Outputs**：目錄描述的 SEO／GEO 改善方向（未實測）；內容、索引、結構化資料和實際成效驗收表。
- **Execution**：界定問題：區分技術 SEO、內容與 GEO 引用 → 來源確認：核對 Catalog 原作者資訊並保留 Package 缺口 → 評估設計：規劃搜尋收錄、引用及轉換指標。
- **Risk**：排名誤導：Skill 不保證搜尋排名或 AI 引用；授權不完整：上游 License 摘要非完整平台套件審核。
- **Gate**：每項建議有網站證據和衡量指標；未取得套件和實測前標為 PARTIAL。
- **Evidence**：官方 Catalog 可查、Package/SKILL.md 尚未取得；外部 Runtime／Security／完整 License／Integration **NOT TESTED**。

### 92. `minimax-code-community-visual-content-generator`
- **Source**：[來源文件](https://agent.minimax.io/skills)｜官方 Catalog 已列名；Package PARTIAL。
- **Trigger**：需要將文字內容製成視覺圖片或概念性資訊圖。
- **Not Trigger / Stop**：圖片不等於可編輯向量圖、精確數據圖或保證正確的文字標籤；缺原始套件。
- **Host / Command**：官方 Skills Catalog 已列名 visual-content-generator，完整 SKILL.md、模型和命令未確認。
- **Inputs**：資訊內容、受眾、尺寸和風格；圖表數值、品牌素材與圖片使用權。
- **Outputs**：目錄宣稱的視覺素材（尚未實測）；文字數字正確性、解析度和版權驗收清單。
- **Execution**：分類需求：區分可計算圖表與概念插圖 → 核對來源：確認目錄功能，完整 Package 待取得 → 設定驗證：對原始數值、文字和素材權利逐項檢查。
- **Risk**：數值錯誤：生成圖片常不能作為準確數據證據；隱私與版權：上傳敏感資料或使用素材需授權。
- **Gate**：缺 SKILL.md 時不宣稱正式輸出介面；真實輸出才逐張核對數字和字詞。
- **Evidence**：官方 Catalog 可查、Package/SKILL.md 尚未取得；外部 Runtime／Security／完整 License／Integration **NOT TESTED**。

### 93. `motion-dev-animations-skill`
- **Source**：[來源文件](https://github.com/199-biotechnologies/motion-dev-animations-skill/blob/main/SKILL.md)｜官方 SKILL.md v3.0.0。
- **Trigger**：需要 Motion.dev 的動畫狀態、Spring、Scroll 或互動操作。
- **Not Trigger / Stop**：CSS-only、靜態無 JS、Vue motion-v、複雜 SVG/Canvas 應選其他工具；120fps 不是已測結果。
- **Host / Command**：官方根目錄 SKILL.md 名稱 motion-dev-animations，metadata v3.0.0，依 Host 描述匹配。
- **Inputs**：現有框架、元件和動畫觸發方式；動效目標、目標裝置及 Reduced Motion 需求。
- **Outputs**：可編輯 Motion.dev 元件和動效設定；效能、CLS、鍵盤和 prefers-reduced-motion 測試證據。
- **Execution**：Clarify：確認框架、動畫種類和效能約束 → Plan：選 Entrance／Gesture／Scroll／Layout 和時間參數 → Implement：增量加入 GPU-friendly 動畫與 Reduced Motion → Verify：以 DevTools、Lighthouse 與手機操作實測。
- **Risk**：效能誇大：上游 120fps、50KB 是目標，不是保證；可及性：忽略 Reduced Motion 或鍵盤會傷害使用者體驗。
- **Gate**：真實裝置或 Browser 測過 FPS／CLS；Reduced Motion 和觸控、鍵盤皆有回歸。
- **Evidence**：OFFICIAL SOURCE READ；外部 Runtime／Security／完整 License／Integration **NOT TESTED**。

### 94. `mukul975-anthropic-cybersecurity-skills`
- **Source**：[來源文件](https://github.com/mukul975/Anthropic-Cybersecurity-Skills/blob/main/README.md)｜社群官方 README：818、34，非 Anthropic 關聯。
- **Trigger**：在合法授權的資安分析、偵測、鑑識或合規工作中查找特定子技能。
- **Not Trigger / Stop**：此專案不是 Anthropic 官方；未取得書面授權不得執行掃描、漏洞利用或攻擊性作業。
- **Host / Command**：官方 README 以社群合集列 818 Skills／34 Domain／六套 Framework；單一合集沒有通用 Slash Command。
- **Inputs**：明確的資產、擁有權、測試範圍及核准；選定子 Skill SKILL.md、環境與證據保存要求。
- **Outputs**：選定子技能、來源、框架及權限限制；調查或防禦驗收與人工 Review 計畫。
- **Execution**：確認授權：限定可測資產、時間窗、攻防邊界 → 挑選原子 Skill：讀該子技能 SKILL.md 及框架映射 → 審查權限：查遠端連線、資料寫入、執行能力 → 驗收：只依已執行與人工複核的證據下結論。
- **Risk**：Dual-use：進攻性步驟只許用於明確核准系統；來源版本：README 同時使用 818 總數及 817 框架描述，不能當審計統計。
- **Gate**：每個子 Skill 有書面範圍和停損邊界；不將社群合集誤標為 Anthropic 官方或已驗證安全。
- **Evidence**：OFFICIAL SOURCE READ；外部 Runtime／Security／完整 License／Integration **NOT TESTED**。

### 95. `nutlope-hallmark`
- **Source**：[來源文件](https://github.com/Nutlope/hallmark/blob/main/skills/hallmark/SKILL.md)｜官方 Hallmark v2.0.0。
- **Trigger**：製作新 Web UI；對既有頁面只有明確指定 /hallmark audit 或 redesign 才觸發。
- **Not Trigger / Stop**：一般既有頁面微調不應自動套完整 redesign；既有 DESIGN.md 優先。
- **Host / Command**：官方 SKILL.md v2.0.0；/hallmark <brief>、/hallmark redesign <path>、/hallmark audit <path>。
- **Inputs**：品牌、內容、受眾與目標 CTA；DESIGN.md、真實素材、專案路徑和安裝權限。
- **Outputs**：具 Tokens 的可編輯頁面與設計決策；Sloplint／渲染檢查、實際錯誤修正或 Audit 報告。
- **Execution**：Preflight：讀既有系統、素材和限制 → Shape：明確頁面受眾與真實內容，先確認 Hero → Build：完成必要元件和設計 Tokens → Sweep：在批准環境執行 sloplint --render，逐項解 FAIL。
- **Risk**：工具副作用：可能安裝依賴、啟動瀏覽器或調用 Together AI；憑空內容：禁止虛構數字、客戶、Logo 和引用。
- **Gate**：DESIGN.md 與既有 Wiring 保留；Fail 逐項修正、Reflex 有證據豁免，未測不宣稱 PASS。
- **Evidence**：OFFICIAL SOURCE READ；外部 Runtime／Security／完整 License／Integration **NOT TESTED**。

### 96. `nvidia-auto-ontology-management`
- **Source**：[來源文件](https://github.com/NVIDIA/auto-ontology/blob/main/skills/nvidia-ontology-management/SKILL.md)｜官方 v0.2.2、Apache-2.0 宣告。
- **Trigger**：需要改寫語意層術語、關係、指標或執行模型 Import／Export。
- **Not Trigger / Stop**：MCP 僅能讀；不可直接連 FastAPI 3001；Replace／Compile Reset 需獨立核准。
- **Host / Command**：官方 nvidia-ontology-management v0.2.2；認證 Next.js REST Gateway 寫入，MCP 只讀。
- **Inputs**：已有具權限的 Auto Ontology 環境與模型；欲變更指標的 source、grain、population、units 和復原備份。
- **Outputs**：模型變更、API 回應和持久化 Readback；SQL／語意問題的正負向檢查與發布 Gate。
- **Execution**：Discover：以 search_terms、get_term 等只讀工具盤點原定義 → Model：寫出人口、粒度、單位、來源及反例 → Validate and Write：先校驗 SQL，經明確許可在 Gateway 走最小寫入 → Readback：重新匯出或查詢比較，檢查回答是否仍正確。
- **Risk**：破壞性操作：Compile Reset 是全域非同步重建，不能當 Cleanup；身分繞過：FastAPI 3001 信任 Header，不能對外作直接入口。
- **Gate**：所有 Replace／Reset 事前核准且有 Backup；真正 Readback 通過才稱模型發布成功。
- **Evidence**：OFFICIAL SOURCE READ；外部 Runtime／Security／完整 License／Integration **NOT TESTED**。

### 97. `nvidia-auto-ontology-query`
- **Source**：[來源文件](https://github.com/NVIDIA/auto-ontology/blob/main/skills/nvidia-ontology-query/SKILL.md)｜官方 v0.2.2、MCP read-only。
- **Trigger**：自然語言問題跨多資料來源，且需治理 Business Metric 的語意一致性。
- **Not Trigger / Stop**：此 Skill 不修改語意模型或暴露 raw Schema；單一固定資料源可用直接查詢。
- **Host / Command**：官方 nvidia-ontology-query v0.2.2，MCP 只讀，REST fallback 僅走認證 Next.js Gateway。
- **Inputs**：已認證、Ready 且編譯完成的 Auto Ontology 實例；資料問題、單位、人口和預期粒度。
- **Outputs**：帶 SQL／Rows／Reasoning／Truncated 的回答；不可回答時的真實 Readiness／Coverage Gap。
- **Execution**：Check readiness：檢 compiled layer 和 DB 連線 → Discover terms：search_terms、check_answerable → Ask：ask_question 或授權 REST 回傳結果 → Validate：查人口、單位、grain、join、lineage 和截斷。
- **Risk**：數值錯判：執行成功不代表計算口徑正確；截斷與會話：100 rows cap、REST 409 等不能忽略。
- **Gate**：Claim-bearing 結果具真實 SQL、口徑和來源檢查；空結果先驗證 readiness 而非編造答案。
- **Evidence**：OFFICIAL SOURCE READ；外部 Runtime／Security／完整 License／Integration **NOT TESTED**。

### 98. `nvidia-auto-ontology-setup`
- **Source**：[來源文件](https://github.com/NVIDIA/auto-ontology/blob/main/skills/nvidia-ontology-setup/SKILL.md)｜官方 v0.3.2、Apache-2.0 宣告。
- **Trigger**：Auto Ontology 尚未安裝、未就緒或需要排查認證與 DB 連線。
- **Not Trigger / Stop**：需先確定 Helm／Docker／既有 MCP 與環境成本；Secrets 不能貼在聊天和指令參數。
- **Host / Command**：官方 nvidia-ontology-setup v0.3.2；Helm 是正式安裝，Compose 單機，dev_tools/setup_env.sh 是開發工具。
- **Inputs**：部署方式、Chart 版本與 appUrl／網路規劃；由使用者在安全檔案中維護的 NIM Key、Admin、DB 資訊。
- **Outputs**：真正的部署、認證及 MCP Readiness 證據；Migration、DB、Port 問題及復原說明。
- **Execution**：確認目標：區分 Helm、Compose、Dev、只用 MCP → 安全設定：使用者自行在 values/.env 保存密鑰，排除 Git → 部署：按經核准的官方流程安裝並查看 Migration → 檢驗：查 OAuth、MCP、編譯與資料庫就緒。
- **Risk**：Secrets 外洩：不得把 Key 放到命令或對話；API 網路風險：FastAPI 3001 必須隔離或防火牆限制。
- **Gate**：Chart／APP_URL 及端口逐項核對；真正確認 Migration、Readiness 與登入才通過。
- **Evidence**：OFFICIAL SOURCE READ；外部 Runtime／Security／完整 License／Integration **NOT TESTED**。

### 99. `nvidia-skillspector`
- **Source**：[來源文件](https://github.com/NVIDIA/SkillSpector/blob/main/README.md)｜官方 README 71 patterns／17 categories；建議 Python 3.12／3.13。
- **Trigger**：審查外來 Skills、Repo、單一檔案或 ZIP 的安全性。
- **Not Trigger / Stop**：掃描 PASS 不是安全保證；雲端 LLM／OSV 網路查詢與 Python 安裝需授權。
- **Host / Command**：官方 NVIDIA SkillSpector README；skillspector scan，可用 --no-llm 和 JSON／Markdown／SARIF。
- **Inputs**：待審查 Skill 的來源、檔案與版本；受核准的 Python／Docker 環境、掃描模式和輸出權限。
- **Outputs**：分類、風險分數、嚴重性和 Finding 證據；Baseline、誤報覆核與阻擋／放行建議。
- **Execution**：限定樣本：固定 Repo、Commit 和輸入格式 → 安全模式：優先離線，只在批准時調外部服務 → 執行掃描：使用 CLI 產出結構化 Findings → 人工複核：判斷誤報、危害與依賴來源，設 Release Gate。
- **Risk**：漏報／誤報：掃描結果不代表全面保證安全；依賴風險：需審查 YARA Wheel／Python 版本和額外套件。
- **Gate**：每筆結果可追來源、版本、規則與風險等級；未實際掃描就不能聲稱安全檢查 PASS。
- **Evidence**：OFFICIAL SOURCE READ；外部 Runtime／Security／完整 License／Integration **NOT TESTED**。

### 100. `oh-my-mermaid-omm-push`
- **Source**：[來源文件](https://github.com/oh-my-mermaid/oh-my-mermaid/blob/main/skills/omm-push/SKILL.md)｜官方 login／link／push 序列。
- **Trigger**：明確呼叫 /omm-push 或要求遠端分享 .omm 架構文件。
- **Not Trigger / Stop**：含公司機密／個資或未經外送授權時必須停止；/omm-view 不代表 Cloud Push。
- **Host / Command**：官方 /omm-push；依序 omm share → 必要時 omm login → omm link → omm push。
- **Inputs**：已完成且已檢敏的 .omm/ 文件；外部上傳與 OAuth 授權、目標 Cloud Project。
- **Outputs**：真正成功時的上傳檔案數和 Project URL；方案允許時的 Share Link 或 401/403 等錯誤。
- **Execution**：資料審核：確認敏感架構和外送同意 → 檢登入：omm share，必要時 GitHub OAuth → 建立連結後 Push：確認 Project Slug 才傳送 → 報告：成功列 URL 和檔數，失敗列 401／403／Network。
- **Risk**：外送機密：內部架構資訊不可默認上傳；權限與費用：OAuth、Project 限額或方案會阻止傳檔。
- **Gate**：每次上傳有明確同意和文件範圍；只有服務真實成功才宣稱 Cloud URL。
- **Evidence**：OFFICIAL SOURCE READ；外部 Runtime／Security／完整 License／Integration **NOT TESTED**。

## 來源差異與風險核對

1. **MiniMax**：相較原始 Threads 截圖證據，已可從官方 Catalog 找到五個相同名稱，仍未取得原始 Package 及完整 Skill Contract；只提供適用情境與候選驗收程序，不能冒稱官方安裝指令或確定可匯出的檔案。
2. **Matt Pocock**：`grill-me` 是使用者啟動的 grilling 訪談；`grill-with-docs` 多呼叫 domain-modeling 並涉及 Glossary／ADR 寫入；`handoff` 是 OS 暫存文件而非 Repo Handoff；`tdd` 先確認 Public Seams，Red → Green 不含 Refactor。
3. **NVIDIA Auto Ontology**：Query MCP 是只讀；Management REST 寫入必須經認證 Next.js Gateway；Setup 的 Helm 與 Docker Compose 不應混為一種。直接公開內部 FastAPI 3001、未授權 Import Replace／Compile Reset 都是高風險。
4. **Hallmark／Motion**：Hallmark v2.0.0 既有頁面的 Redesign 須明確觸發；Sloplint 的 Floor／Reflex／Finish 未執行。Motion.dev v3.0.0 文件的 120fps 等為品質目標，不能視為已達到的測量結果。
5. **資安與傳輸**：mukul975 為社群資安 Skill 合集，不隸屬 Anthropic；NVIDIA SkillSpector 的文件閱讀不等於已掃描本批 Skill；`omm-push` 的 .omm 架構文件外送與 GitHub OAuth 均需另外明確核准。

## GitHub／部署 Gate

本報告為 Documentation Review，**不預先宣稱 GitHub PR CI、main Merge、Pages Deploy 或部署後 Live Smoke 已通過**。待建立 PR 後應驗證 Unified Intake、V2 Data Validate、Graph／Browser，通過後合併，再按 Deploy 完成時間確定獨立正式站 Smoke；任何失敗須保留真正 Log。

## 下一批

Batch 06 為第 **101–120** 筆，從 `oh-my-mermaid-omm-scan` 至 `yanliudesign-mono-color-skill`。最後 3 筆（121–123）另列 Batch 07。精確 IDs 見 Rolling Handoff。
