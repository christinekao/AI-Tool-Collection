# Resource 全庫內容品質稽核｜第一輪（2026-11-26）

## 基準與範圍
- PR #120 已合併 5e45a2b9983ce8dd4e9b43ded370fb7b727b69cb，四項 PR CI PASS；Catalog Sync 45771137162 PASS，生成資料提交 c6099c50bb6b4fa80311b7c3bdad830c112d9a0a 僅改 catalog-v2.json；Pages 45771155866 PASS。正式站直接讀取受限，最新 deployed Chromium 尚未確認。
- GitHub Canonical 目錄共 286 個 JSON。此輪是內容品質稽核的起點，不是重新執行 Batch 95–105，也不是全庫語意審查完成。既有正式映射基準 268/286；14 deferred、4 source-blocked。14 筆已重新讀取並核對 gap/nextAction、局部 evidence refs 與孤立 evidence，均無缺失或孤立；不提升狀態。
- 14 筆 Deferred 全數保留：核心實作／授權 6（hindsight、anomalyco-opencode、orca、infiniflow-ragflow、toeverything-affine、rea）；外部服務契約 2（hermes-snyk-plugin、stitch-mcp）；互動瀏覽 3（land-book-design-inspiration、particles-casberry、designed-to-scale）；歷史收藏身分 3（reverse-skill、irons163-orchestrate-sol-terra-luna、wellmade）。詳細缺口見 RESOURCE_DEFERRED_FINAL_AUDIT_20261126.md。不重複追加無法解除核心阻塞的次要證據。

## 已定位的品質問題與候選修正
| 優先級 | Resource／欄位 | 實際發現 | 本分支修正 |
|---|---|---|---|
| P0 | hermes-snyk-plugin / readerGuide.limits、intakeReview.riskNotes | 11/25「新版官方插件未查核」與 11/26 局部查核同時出現，未明示時間差 | 標記歷史狀態、現行查核及外部 CLI 未實測；前三個 use case 的斷句改為具體情境，保留 ID 與證據引用 |
| P1 | infiniflow-ragflow / readerGuide.example.note | 仍說只確認文件層證據，但已新增 Go 原始碼與上游測試閱讀 | 明示局部靜態證據、未執行與完整鏈缺口 |
| P1 | stitch-mcp / readerGuide.start | 泛用合成測試模板，未交代實際畫面需求、SDK 與服務端差異 | 自編作品集畫面、工具探索、正式授權與產物驗收 |
| P1 | land-book-design-inspiration / readerGuide.start | 泛用合成測試模板，不適合設計案例收藏 | 先定義頁面需求、人工挑選來源與原作者、獨立驗收設計 |
| P1 | particles-casberry / readerGuide.start | 泛用模板未突出動效、匯出和裝置負載 | 明確自有圖形、版本索引、隔離後匯出與效能驗收 |
| P2 | land-book-design-inspiration、particles-casberry、stitch-mcp / intakeReview.riskNotes | 重複警語，非新的安全結論 | 下一輪整理文字呈現；保留原證據與安全邊界，不刪除歷史知識 |
| P2 | orca、infiniflow-ragflow / 早期限制及 sourceReview | 部分舊敘述仍使用尚未查核字樣，可能需要歷史日期或局部範圍限定 | 逐欄對照舊證據和新增來源後修正，不以字串全庫替換 |

## 全庫可執行修正佇列
1. 先以已合併 main 的 Canonical ID 清單為單一來源，按 ID 排序，每輪最多 20 筆；跳過已完成的同一品質檢查，不跳過未審查的 ID。14 筆的狀態核對不代表完整語意稽核，五筆候選修正也不代表整筆完成。
2. 每筆檢查 purpose 的五秒理解、use case 的實際問題／輸入／輸出、example steps 與 process 對應、start 是否能採取具體行動、limits 是否重複或過時；保留 design-only 與 runtime 的差異。教材、集合、服務、Repo 按實際內容類型審查。
3. Agent Layer 對照現有 evidenceFields、固定版本／文件段落、sourceStatus、原始碼與上游測試閱讀的邊界；對有實際矛盾的來源優先查核，不為每筆重做所有上游研究。
4. 每筆記錄 ID、檢查結果、具體欄位與證據、P0/P1/P2、修正或保留理由，獨立統計審查完成與正式映射完成；每 20 筆保存 immutable per-batch report 及 rolling handoff。
5. P0：誤導的安全、授權、實測或來源身分宣告；P1：用途／案例／操作／證據矛盾；P2：重複、易讀性與一致性。Source-blocked 保留，不猜測替代來源。
6. 內容品質完成後才進 Concept、Combination、Workflow 審查；本輪不建立或修改 Graph Edge、分類、Tags 或 Canonical ID。

## 候選驗收
- 5 筆 Canonical 文字修正；原 agentEvidence、source、implementationKnowledge、局部 ID、example steps、分類與 Graph 關聯完整保留。新增單元及真實頁面回歸測試，不改既有驗收條件。
- 四項 CI 尚待候選 Head 實際驗收；前一輪正式 deployed Chromium 未確認，不能將本分支算入正式內容品質進度。第三方未執行。
