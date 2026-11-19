# Phase 2 Resources Batch 04（2026-11-19）

## 實作方式
- 從尚未執行 Phase 2 Source Review 的 Resource 選出 20 筆；已對照各自官方 GitHub README，保留原本正確的用途和推薦內容，只針對缺漏欄位增補使用知識。
- 新增重點：每筆 3 項可追溯功能、2 項使用前提、2 項具體限制／風險；完整 Intake Review + Source Review。原本已有內容不予覆寫。
- 僅更新 20 個 Canonical JSON、派生 Catalog／Graph 與本報告；不修改 Entity、分類、Raw Tags、Concept／Skill／Workflow 引用，也不新增 Tags。
- 來源閱讀不等同已安裝、可重建或 Security／License／Runtime／Integration PASS。

## Before → After
| # | Resource | 缺漏欄位改善 | 新增的關鍵限制與風險 | 上游來源 |
|---:|---|---|---|---|
| 1 | `cursor-plugins` | 功能 0→3；使用前提 0→2；限制 0→2 | 同一 Marketplace 中有第三方維護的項目，不代表全部由 Cursor 官方直接測試。；插件可能包含 MCP、指令與可修改檔案的動作，需核對實際授權邊界。 | [上游 README](https://github.com/cursor/plugins/blob/main/README.md) |
| 2 | `cursor-pstack-poteto` | 功能 0→3；使用前提 0→2；限制 0→2 | 多模型流程可能增加成本與延遲，不能以角色或模型數量代替驗收。；Claude Code 等 Host 的指令命名與自動更新方式不同，需檢查適配文件。 | [上游 README](https://github.com/cursor/plugins/blob/main/pstack/README.md) |
| 3 | `debpalash-voicestudio` | 功能 0→3；使用前提 0→2；限制 0→2 | README 標示 AGPL-3.0，商業使用或再散布需核對對應條件及選配授權。；多種語言與模型支援是作者主張，實際音質、速度及 GPU 相容性仍需測試。 | [上游 README](https://github.com/debpalash/VoiceStudio/blob/main/README.md) |
| 4 | `deepseek-dsh-superagent-prototype` | 功能 0→3；使用前提 0→2；限制 0→2 | 作者明示公開版並非內部研究系統的完全相同實作。；此為 Prototype，不能直接推論生產可靠性或無需維運。 | [上游 README](https://github.com/deepseek-ai/dsh-superagent-prototype/blob/main/README.md) |
| 5 | `df3011212-codex-local-board` | 功能 0→3；使用前提 0→2；限制 0→2 | 沒有真實完成標準的對話不能推算進度百分比。；歷史對話紀錄及本機路徑可能包含敏感資料，不應公開連結或誤當獨立驗證。 | [上游 README](https://github.com/df3011212/codex-local-board/blob/main/README.md) |
| 6 | `dominicrico-jev-router` | 功能 0→3；使用前提 0→2；限制 0→2 | README 指出長時間 Session 中模型切換未必省錢，作者 Benchmarks 不能概化。；外部路由會向供應商端點傳送 Prompt／部分對話，機敏內容須另行限制。 | [上游 README](https://github.com/dominicrico/jev-router/blob/main/README.md) |
| 7 | `elayadesign-ai-design-skills` | 功能 0→3；使用前提 0→2；限制 0→2 | Skill 是指令集，不能保證產出可用於正式產品的設計或程式。；視覺結果仍需在實際畫面檢查可及性、響應式與字型授權。 | [上游 README](https://github.com/elayadesign/ai-design-skills/blob/main/README.md) |
| 8 | `forget-c-jellyfish` | 功能 0→3；使用前提 0→2；限制 0→2 | 多模型依賴和影片生成費用需另評估，且需自行保護 API Key。；生成內容的角色一致性與分鏡品質需以具體試片測試。 | [上游 README](https://github.com/Forget-C/Jellyfish/blob/main/README.md) |
| 9 | `garrytan-gbrain` | 功能 0→3；使用前提 0→2；限制 0→2 | 同名 npm gbrain 套件與上游專案無關，不能直接安裝替代。；跨 Agent 檢索可能返回過時或含機密資訊，需檢查引用、存取控制及同步範圍。 | [上游 README](https://github.com/garrytan/gbrain/blob/main/README.md) |
| 10 | `garrytan-gstack` | 功能 0→3；使用前提 0→2；限制 0→2 | 不同 Host 的支援層級不一致，有些整合仍屬實驗性。；角色化流程和自動檢查仍須保存真實測試證據，不能取代人工 Release Gate。 | [上游 README](https://github.com/garrytan/gstack/blob/main/README.md) |
| 11 | `gggodlin-cc-harness` | 功能 0→3；使用前提 0→2；限制 0→2 | README 明確說明這是個人治理架構公開參考版，非一鍵安裝產品。；部分內部接線已移除，路徑與依賴無法直接照搬到其他電腦。 | [上游 README](https://github.com/GGGODLIN/gggodlin-cc-harness/blob/main/README.md) |
| 12 | `github-agentic-workflows` | 功能 0→3；使用前提 0→2；限制 0→2 | 官方公告特定 0.83.3–0.85.3 範圍版本有安全漏洞，應避開並核對修補版本。；Agent 可能遭受 Repository 內容與 Issue Prompt Injection，CI 成功不代表安全審查充分。 | [上游 README](https://github.com/github/gh-aw/blob/main/README.md) |
| 13 | `gsap-skills` | 功能 0→3；使用前提 0→2；限制 0→2 | Skills 不能替代真實瀏覽器動畫測試與減少動態效果偏好。；複雜 ScrollTrigger／互動動畫仍需檢查行動裝置效能與可及性。 | [上游 README](https://github.com/greensock/gsap-skills/blob/main/README.md) |
| 14 | `guizang-product-video-skill` | 功能 0→3；使用前提 0→2；限制 0→2 | 主專案採 AGPL-3.0，部分預設素材另有 Business Source License，不能混認為 MIT。；使用程式碼與產品素材產片需確認機密、品牌權與影片音樂授權。 | [上游 README](https://github.com/op7418/guizang-product-video-skill/blob/main/README.md) |
| 15 | `hbai-ltd-toonflow-app` | 功能 0→3；使用前提 0→2；限制 0→2 | Docker 刪除資料卷可能遺失工作區，須先備份並避免誤用 down -v。；展示素材與生成影片的商用權利取決於來源及第三方模型條款。 | [上游 README](https://github.com/HBAI-Ltd/Toonflow-app/blob/main/README.md) |
| 16 | `hermes-backsearch` | 功能 0→3；使用前提 0→2；限制 0→2 | API 查詢可能計費，過去資料的可用性和索引覆蓋不保證完整。；時間過濾無法單獨證明內容在當時已可取得，仍需比對來源。 | [上游 README](https://github.com/NousResearch/hermes-plugin-backsearch/blob/main/README.md) |
| 17 | `hermes-memory-wiki` | 功能 0→3；使用前提 0→2；限制 0→2 | README 指出此 Plugin 偏 Dashboard 呈現，不新增模型 Tool 或 Hooks。；記憶頁面可能帶敏感工作資訊，分享畫面與遠端存取需受控。 | [上游 README](https://github.com/NousResearch/hermes-memory-wiki/blob/main/README.md) |
| 18 | `hermes-snyk-plugin` | 功能 0→3；使用前提 0→2；限制 0→2 | 工具執行會涉及外部掃描服務及可能敏感程式庫資料。；安全掃描結果需要人工分類與版本核實，不能保證不存在其他漏洞。 | [上游 README](https://github.com/NousResearch/hermes-plugin-snyk/blob/main/README.md) |
| 19 | `heygen-com-hyperframes` | 功能 0→3；使用前提 0→2；限制 0→2 | 程式可渲染不代表時間軸、畫格、音訊與最終影片已視覺驗收。；Studio 的 Pro 功能與外部生成模型可能涉及額外費用。 | [上游 README](https://github.com/heygen-com/hyperframes/blob/main/README.md) |
| 20 | `ollama-ollama` | 功能 0→3；使用前提 0→2；限制 0→2 | 本機執行品質和速度由硬體與模型決定；Cloud 模型可能另有計費與資料政策。；本機服務不等同完整的企業認證、存取控制或多租戶隔離方案。 | [上游 README](https://github.com/ollama/ollama/blob/main/README.md) |

## 特別注意
- `github-agentic-workflows`：上游 README 明列 `>=0.83.3, <0.85.4` 曾有安全漏洞，版本安全需獨立核對，不得直接採用舊版。
- `garrytan-gbrain`：上游強調同名 npm Package 不屬於此專案，應辨識 GitHub stable 安裝來源。
- `dominicrico-jev-router`：模型選路會把 Prompt／上下文送往第三方服務，且作者指出長 Session 不一定節省費用。
- `guizang-product-video-skill`：AGPL-3.0 主授權和部分 BSL 素材不得混同。
- `hbai-ltd-toonflow-app`：容器資料卷與使用者工作區須先備份。
- `cyyeh-agent-loop-visualizer`：官方 README 資料不足，未在本批冒稱核對完成，保留待後續來源追查。

## 驗收
- 20 個不同 Canonical Resource ID；549 六類實體、270 Resources 不變；所有關聯保留。
- Schema／Intake／Knowledge Graph 等 GitHub Actions 結果以 PR 與正式 `main` 的實際執行紀錄為準。
- 未安裝第三方軟體，未執行風險指令，也未讀取 Secrets。
