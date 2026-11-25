# Resource 雙層改善 Batch 04（2026-11-25）

基線 main `000993806c1d25061667e54ac1c7408b8fae90d0`：PR #68 已合併、Catalog Sync 已確認。19/286 筆已合併雙層審查（18 mapped/evidence-linked，1 deferred）。本批逐筆查閱固定上游版本，非批次套模板或原始工具執行。

| Resource | 新增用途及應用 | 固定版本／查核範圍 | 狀態與缺口 |
|---|---|---|---|
| systran-faster-whisper | 訪談、字幕時間、批次轉錄；產品影片字幕草稿 | 6cb639e70786aea42b9233006ae60eaf07190bdb；README、transcribe.py、vad.py、LICENSE | mapped；模型、音訊解碼及字幕匯出未測 |
| manimcommunity-manim | 數學、流程圖、重複渲染；幾何變化解說影片 | 37056b0e6e23df7be1f7087a98eb2fb5c81737f2；scene.py、manager.py、transform.py、README、兩份 LICENSE | mapped；渲染器與編碼未追查完整；舊 cairo_renderer.py 路徑未找到，不推斷現行位置 |
| mrdoob-three-js | 3D 展示、動畫片段、渲染清理；網頁產品預覽 | 084ec06444244980752a420f0e1af5cd8f112aa1；Scene.js、WebGLRenderer.js、AnimationMixer.js、README、LICENSE | mapped；Loader、WebGPU、各裝置未測 |
| comfy-org-comfyui | 保存工作流、批次生成、錯誤追蹤；產品概念圖 | 0d0e105153c02261519a6a552c52ec1cd5d9855e；server.py 的 prompt、history、object_info，execution.py 的核心介面、README、LICENSE | mapped；模型、節點、完整圖內部與安全未查核 |
| lottiefiles-dotlottie-web | 動態回饋、畫格控制、播放器生命週期；表單成功動畫 | db3f9b19e8e515aa9e87b7667a899825bb992e13；packages/web/src/dotlottie.ts、README、LICENSE | mapped；WASM、Worker、跨框架／裝置未測 |
| infiniflow-ragflow | 文件問答、解析品質、部署評估；規章問答測試 | 37b63fc3979365ea70f267f290c2f12d93fdbf50；README、docker/README.md、LICENSE | deferred；舊 Python 核心路徑 404，新 Go ingestion、檢索、引用與權限契約待查；文件說明 Linux x86-64，macOS 暫不支援 |
| toeverything-affine | 視覺研究、文件與畫布、協作選型；個人 AI 研究工作區 | 81da59d63d535d72ba677a097d9a0cc9a5871ade；README、根 LICENSE、packages/backend/server/LICENSE | deferred；編輯、同步、匯出及權限實作待查；授權有目錄分區，EE 條件不得被 README 的 CE MIT 描述覆蓋 |

共 7 筆改寫，5 mapped、2 deferred；21 個前台用途、22 個局部能力／證據單元、7 個設計案例。實際比對七筆原 ID、URL、Repo、Tags、分類、Typed Refs、features、requirements、limitations、既有 implementationKnowledge 欄位全部保留。不新增全域 Capability、Concept、Workflow 或 Graph Edge；局部對應不代表跨工具整合可用。

## Gate
新增正反向解析、固定版本來源、未實測、deferred 及 catalog 等值的測試；追加七個 Resource route 的 375/430/768/1440 瀏覽器回歸。CI 與 Pages 狀態須以實際 Actions 查核，不事先標 PASS。所有第三方程式未安裝、未執行，模型未下載，無付費或外部資料操作。

## 進度與接續
合併前 19/286；本批若全部 CI 通過並合併，26/286 有雙層審查結果（23 完成對應、3 deferred），260 筆未改寫。三筆待補為 Microsoft AI Agents for Beginners、RAGFlow、AFFiNE，不算完整對應。下一批優先 Blender、HyperFrames、Motion Design Skill 與近期收錄的 Agent 相關 Repo，再按 manifest 逐筆核對未改寫項目。排程停用，維持直接執行。
