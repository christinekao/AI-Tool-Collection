# Resource 雙層改善 Batch 21（2026-11-25）

基線 main `dcae00e5ce8795651b6a6cddbd3bda91e9c0004b`；PR #85 修正 Content Format 後四項 CI 通過，合併 `c4f0ef10384f4cd355ba1f2b294fb3cf80db700e`，Catalog Sync 通過，Pages 查核時進行中。96/286 已合併（90 完成對應、6 deferred）。

| Resource | 前台案例 | 查核範圍 |
|---|---|---|
| research-to-diagram | 規劃 AI Agent 元件關係的研究圖解 | c13ec59f3c894da607d7d5b17a18fccdba0bc389；固定版本 README、LICENSE、skills/research-to-diagram/SKILL.md 的文件工作流；未執行 WebSearch、Graphviz 或核對作者展示成果。 |
| kubai087-kubai-icons | 規劃履歷管理系統的統一功能圖示 | aebcb2a28aec6f0e7c52da7d9e990c0bb499c124；固定版本 LICENSE、LICENSE-ICONS、LICENSE-SITE 及公開 MIT 套件 README、React create.js、Core element.js、Static package.json；僅整理套件事實，不重製 Skill 或網站。 |
| claude-svg-animation-logo-loading-chart-tutorial | 規劃資料分析網站的動畫與靜態替代方案 | 2026-11-25 公開文章；2026-11-25 查閱 AI 郵報公開文章全文，未執行作者提示詞、Claude Artifacts 或動畫成品。 |

兩筆 mapped、一筆 evidence-linked 候選，9 個用途、6 個局部能力、3 個教材證據、3 個 design-only 案例。原 ID、URL、Tags、分類、Typed Refs、歷史用途、推薦及原始欄位保留；Kubai 授權分區補正並保存原紀錄。不新增全域 Graph Edge。

## 重要界線

- research-to-diagram：多輪搜尋不能保證來源正確或涵蓋完整，需逐條核對圖中關係。 來源清單在文件中可為選用輸出；本案例要求保留，並非工具強制功能。 README 與 SKILL.md 對預設儲存位置描述不同，實作時應明訂目的地。 未執行研究、Graphviz、字型或 PDF 生成測試；作者宣稱的速度未驗證。
- kubai087-kubai-icons：圖示套件 MIT 不等於整個 Repo MIT；Skill 與網站各有獨立限制。 Skill 可商用製作圖示，但不可擅自再散布修改或翻譯版規則；不重製其規則。 未知圖示名稱在 Web Component 實作可能呈現空白；應測試替代文字。 未安裝套件，未測試 SSR、可及性、動畫效能及 CDN 可用性。
- claude-svg-animation-logo-loading-chart-tutorial：動畫不能改變真實數值、比例與標籤；等待提示不是實際進度證據。 需保留無動畫時的必要資訊並核對減少動態效果偏好。 HTML 與 MP4、GIF 不等價；影片轉換及平台相容性另行驗收。

## Gate 與接續

新增 Catalog 等值、雙向映射、固定版本、授權邊界、教材章節及四尺寸回歸。CI 待執行，第三方未實測。合併前 96/286；通過後 99/286（93 完成對應、6 deferred），187 尚未改寫。下一批優先 code-graph、reactive-resume 與其他開發資源，依 Canonical 查核；排程停用。
