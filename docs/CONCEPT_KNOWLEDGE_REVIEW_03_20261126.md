# Concept 知識關聯｜Review 03：Design、Media、Data、Security、Learning（2026-11-26）

基準 main dc16a4f23861f2041771bf39c3b458f8ef9d9317。Review 01（#137，已合併）20 筆；Review 02（#138，尚未合併）17 筆；本輪以 data/concepts 目錄 68 個 ID 減去前兩輪的 37 個不重複 ID，得到以下 31 筆，已逐一讀取 definition、coreProblem、solutionMethods、validationQuestions、exampleRefs/relatedConceptRefs。累計語意審查 68/68；非完整上游或關係驗收。分組僅供審查，不更改分類。

## 1. 逐筆知識邊界

| Concept ID | 獨立機制、輸出及不等價反例 | 結論 |
|---|---|---|
| component-primitives-design-system | tokens、可重用元件、狀態與可及性契約；即使無 AI 仍有價值，不等於生成 Schema | 保留 |
| constrained-generative-ui | 模型產生白名單 Schema，由 renderer 組裝；有元件庫不等於模型只能使用白名單 | 保留 |
| continuity-driven-motion-design | 相鄰 Beat 延續元素、camera grammar、連續性 oracle；hover 動畫不代表跨鏡頭連續 | 保留 |
| design-to-code-loop | design、editable artifact、code、browser 差異驗收迭代；風格規格本身不證明實作一致 | 保留 |
| evidence-preserving-visual-abstraction | 來源視覺事實與風格分離，保留數量、空間、尺度等不變量；漂亮風格不等於事實保真 | 保留 |
| explicit-visual-system | 明確版本化色彩、排版、節奏等視覺規則；有規則不等於已有可執行元件 | 保留 |
| motion-interaction-layer | trigger、state、timing、easing、reduced motion；靜態設計 tokens 不足以驗證互動 | 保留 |
| outcome-first-minimal-brief-ai-web-design | 目標、受眾、事實約束與創意授權分離；短 Brief 不代表免除安全、SEO 與驗收 | 保留 |
| web-to-desktop-application-shell | renderer/main 分離與窄 IPC；Web UI 包裝不等於可取得完整 OS 權限 | 保留 |
| agentic-media-pipeline | 影音腳本、素材、剪輯、字幕、音訊、render 及獨立 gate；文字內容流程不必有時間碼或 NLE | 保留 |
| closed-loop-social-content-system | 批准、發布、實際成效與策略修正分離；產製影片不等於有平台成效閉環 | 保留 |
| constraint-bounded-editing | whitelist 最小 Diff，保留未授權段落及數據；產製流程不等於局部編輯守約 | 保留 |
| content-production-pipeline | 通用研究、草稿、素材、審查、匯出及 artifact contract；不限制影音 | 保留 |
| editable-agentic-timeline | clip、track、字幕、時間碼、NLE interchange；MP4 或 SVG 不代表有可重開時間軸 | 保留 |
| editable-generative-assets | 可修改 vector/path/layer 等結構；素材可編輯不代表時間軸可編輯 | 保留 |
| episodic-character-asset-consistency | 角色、場景、道具 ID 與版本、跨鏡狀態驗收；轉場流暢不代表角色一致 | 保留 |
| source-grounded-product-media | 真實功能、元件、release 作為宣傳事實來源；角色一致的影片仍可能虛構產品功能 | 保留 |
| codebase-knowledge-graph | 版本化 symbol、module、dependency 索引；靜態依賴不等於 runtime 行為 | 保留 |
| cross-layer-software-reconstruction | 從產品行為跨 UI/native/runtime 重建契約，標記推論；證據調查未必需重建 | 保留 |
| evidence-backed-agent-investigation | 結論對應來源、觀察方法、時間、可信度；有 graph 不等於結論可重現 | 保留 |
| local-first-sensitive-data-processing | 本機辨識、最小化、遮罩、外送契約；不一定需還原 | 保留 |
| point-in-time-retrieval | as_of、歷史版本及實際可得時間；有來源引用仍可能洩漏未來資訊 | 保留 |
| research-to-structured-visualization | 來源 → entity/relation → 可編輯圖與可追溯 evidence；不等於一般 RAG 回答 | 保留 |
| retrieval-grounded-knowledge-layer | 受權限約束的 ingestion/index/retrieval 與引用；不保證歷史時間正確或所有答案真實 | 保留 |
| reversible-privacy-boundary | 本機 mapping 與 placeholder 還原；本機處理可以永久刪除而不需可逆 | 保留 |
| risk-adaptive-agent-code-review | blast radius 分級、人工核准、review round、事故 regression；不同模型審查不等於風險治理 | 保留 |
| source-first-job-intelligence | ATS 身分、去重、open/closed lifecycle、CV evidence 與投遞權限；一般 ingestion 不含求職決策契約 | 保留為領域原理 |
| cognitive-skill-transfer-loop | gap、prediction、evidence、transfer 與 assistance fading；比較輸出不代表學習者能力遷移 | 保留 |
| prompt-to-output-comparative-learning | 保存 prompt/input/environment/output、控制變因比較；好成品不代表掌握因果 | 保留 |
| robust-backtest-validation | 樣本外、費用、參數 plateau、調參歷史與 drift；時間正確資料不等於策略可靠 | 保留 |
| system-1-decision-layer | 低歧義 typed decision、校準及升級；路由政策不一定需要小模型 | 保留 |

## 2. 層次與互補關聯候選（不升格）

| 候選 | 語意 | 反例／驗收 |
|---|---|---|
| content-production-pipeline → agentic-media-pipeline | 通用產製模式與影音領域特化 | 文字報告不需 clip/track |
| explicit-visual-system ↔ component-primitives-design-system ↔ constrained-generative-ui | 設計規則、實作元件、生成執行約束，三個責任 | 可手工使用 primitives；生成器仍需 schema validation |
| motion-interaction-layer ↔ continuity-driven-motion-design | 互動動效與跨段敘事連續性互補，非必然父子 | 介面 hover 不需鏡頭交界，影片可能無互動 |
| local-first-sensitive-data-processing → reversible-privacy-boundary | 可逆遮罩為本機敏感資料處理的選用機制 | 不需要還原時可採永久刪除；可逆非匿名化 |
| capability-cost-routing ↔ system-1-decision-layer | 決策策略與可選快速分類實作 | 以規則或其他 router 也能做成本路由 |
| quality-gates-verification ↔ risk-adaptive-agent-code-review / robust-backtest-validation | 通用驗收原理與領域化 Gate | 不同評估方法、門檻、失敗成本不能視為同一測試 |
| agentic-media-pipeline ↔ editable-agentic-timeline / editable-generative-assets / episodic-character-asset-consistency / continuity-driven-motion-design / source-grounded-product-media | 分階段流程與可選交付、品質機制 | 不是所有影片都需角色、真實產品 UI 或 NLE |
| point-in-time-retrieval ↔ robust-backtest-validation | 時間一致性是回測資料驗收條件之一 | 正確 cutoff 仍可能過度擬合 |
| evidence-backed-agent-investigation ↔ codebase-knowledge-graph / cross-layer-software-reconstruction | 證據治理、索引及領域重建 | 索引不能代替動態行為驗證 |

維持既有 68 個 ID，不以此表自動新增 Edge、Tags 或分類。不宣稱這些責任固定順序或技術堆疊。

## 3. 六筆 Resource 既有證據對照

| Resource | 本庫已保存的證據 | 判定與缺口 |
|---|---|---|
| chatfire-ai-huobao-drama | 24d4c17612e71cf10c8eeb1a8b6439afa73e2c07；final-prompt.ts、video-prompts.ts、routes/tasks.ts | 已有 agentic-media-pipeline、content-production-pipeline、episodic-character-asset-consistency、continuity-driven-motion-design、quality-gates-verification refs；局部腳本、角色、鏡頭與生成任務證據不證明實際跨鏡一致或完整 NLE |
| hbai-ltd-toonflow-app | eecf51547af47eb504822186bd3f2dee369125ff；media/generate.ts、tasks/status.ts、tasks/cancel.ts | 同上五個既有 refs；生成與狀態/取消契約可供影音 pipeline 對照；不等於鏡頭連續、實際取消退款或完整時間軸互通 |
| skillry-opus-5-5-video-pattern-library | 2026-11-26 公開教學頁；無 Git SHA；original/remake 與 prompt | 已有 prompt-to-output-comparative-learning、reference-backed-pattern-mining refs；案例比較有價值，但模型、環境、變因控制尚未獨立查核 |
| anthropic-solving-code-review-at-anthropic | 2026-11-25 查閱公開文章；作者描述分層 Gate、風險及 incident eval | 已有 risk-adaptive-agent-code-review、quality-gates-verification、security-as-workflow-gate、heterogeneous-model-review refs；內部效益、流程及授權未獨立稽核 |
| strelov1-freehire | 70422c2fcec8460785c6ddd20f1a399fcc2d470b；normalize/company.go、title.go、search_params.go | 已有 source-first-job-intelligence 等 refs；資料正規化與搜尋參數支持職缺資料契約，未證明每筆皆官方、即時開放或無重複 |
| strelov1-freehire-mcp | 883c9cdbe85c1f6e80f8b969218fe69fba7e2ce5；src/tools.ts、client.ts、config.ts | 已有 source-first-job-intelligence、agent-native-tool-abstraction、agent-credential-isolation、quality-gates-verification refs；本機客戶端／Hosted 文件可對照工具與 CV 契約，未查服務端或登入執行，送件須另行批准 |

上游 source.reviewScope、referenceUrls、features 與原有 Typed Refs 為本次證據範圍；沒有重跑外部項目。另有既有 exampleRefs：episodic-character-asset-consistency 共五筆 Resource（本輪查其中兩筆，另三筆尚未在此輪核對）；cross-layer-software-reconstruction、evidence-backed-agent-investigation 均連 rea（前輪局部查核，維持 deferred）。上述六筆加前輪四筆與第一輪八筆，累計 18 個 Resource 局部證據個案，非 286/286 全關係查核。

## 4. 完成與後續

- 語意定義審查 68/68；暫保留全部 Concept，不認定已證明不存在其他重複或缺漏。
- 全庫 286 Resource、Skill、Prompt、Combination、Workflow 入向/出向 Typed References、逐關係證據仍待核對。大 Graph JSON 無法由 Connector 讀取；優先利用 repository 現有 audit/build scripts 或批次 Canonical，分開結構完整性與語意證據，避免把合法 ID 當成充分證明。
- 沒有足夠證據升格新 Concept；下輪從未連結／deferred／source-blocked Resource 中找兩個以上獨立來源支持的可遷移原理，再提出候選，不因單一 feature 建新 ID。
- 無 Canonical、Schema、Tags、Graph、權限或第三方 runtime 修改。Combination / Workflow 保留 Audit06–08 已完成成果，下一步是確認獨立價值與新增證據，不重做舊審查。
