# Resource 雙層改善 Batch 01（2026-11-24）

Base main: e71dc7029396d0f251518b8b24a6ba8b0818a1bb；PR #65 已合併、Canonical Catalog 已同步。依新版 Unified Intake Policy 逐筆改寫，非增加收藏。

| Resource | 人類用途與示例 | Agent 對應 | 驗證缺口 |
|---|---|---|---|
| agent-reach | 跨網站資料蒐集、通道確認、失敗辨識；整理三篇研究文章 | 3 capabilities；固定版本 CLI、Channel、Dispatcher、Result 原始碼 | 平台、登入、通道實測及下游摘要 |
| huggingface-smolagents | 多步查詢、程式組合、步數控制；庫存查詢與缺貨分析 | 3 capabilities；固定版本 agents.py / local_python_executor.py | 模型、遠端執行器、隔離、權限與實際整合 |
| arrow-2 | 生成、向量化、修改；網站圖示設計 | 4 evidence units；官方 SVG 生成、向量化、編輯與 Prompt 文件 | API、輸出品質、安全與使用權 |
| google-pagespeed-insights | 找效能瓶頸、真實訪客體驗、比較版本；首頁改版驗收 | 3 evidence units；官方 Field/Lab 方法與 API v5 | 實際網址測試、API 與前後改善驗收 |

共 4 筆、12 個前台情境、13 個底層對應單元、4 個設計案例。所有案例均 design-only；第三方 runtime not-tested。固定原始碼版本：Agent Reach a8ab1e9a2475957d759eac2dbedfe91b0a1e1021；smolagents 5107d3aec21d26ed808aabd95d93a63d4244226f。原 ID、分類、Tags、Typed Refs、原始 features/requirements/limitations 與原 Repo 技術架構保持完整。現有 Concept 引用及知識關係不變，不因局部 capability 建立 Graph Edge。保留舊技術層，新增 readerGuide、局部映射與 layerReview。

## 驗收

更新 canonical / catalog 等值、雙向解析、案例外部依賴、未實測標記、前台不呈現技術指南、375/430/768/1440 瀏覽器回歸測試。CI 與部署狀態以本批 PR 實際結果為準，不事先標 PASS。

## 進度

基線 286 Resource；本批 4 筆加上 PR #65 Pydantic AI 試作為 5 筆雙層版本候選。舊 Phase 3 的 11 筆改善與雙層改善是不同進度，不重複加總。下一批先完成既有 collection（addyosmani-agent-skills、nirdiamant-genai-agents、anthropics-skills）與 service（openrouter-ai）的人類閱讀／證據映射，再處理兩份學習教材（保留既有教學章節與部分來源缺口）。
