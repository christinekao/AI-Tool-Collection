# 2026-11-24｜本 Session 21 筆收藏收錄紀錄

## 統計與範圍

- 使用者提供 **21 筆收藏項目**；19 筆有原始 URL，1 筆 Session 內文未提供，1 筆 PostX 標題及正文未辨識。
- 基於 main 的 270 筆 Resource 逐一以來源及名稱查重：**16 筆新增 Resource、2 筆沿用既有 Resource（RAGFlow、Anime.js）、1 筆既有 Resource 擴充替代來源（HyperFrames）、2 筆保留 Pending Source**。
- 若合併並完成衍生 Catalog 同步，Resource 將由 270 增至 **286**；不應將 Pending Sources 算入 Resource 數量。
- 本批只完成基本收藏與來源概要，不聲稱深度 Guide 完成；Resource Phase 3 四類閱讀模板的 Pilot 對象及規劃仍保持不變。

## 新增的 16 筆正式 Resource

| 名稱 | ID | 型態 |
|---|---|---|
| Microsoft AI Agents for Beginners | `microsoft-ai-agents-for-beginners` | `learning-guide` |
| GenAI_Agents | `nirdiamant-genai-agents` | `collection` |
| Pydantic AI | `pydantic-pydantic-ai` | `repository` |
| smolagents | `huggingface-smolagents` | `repository` |
| Microsoft AutoGen（歷史架構參考） | `microsoft-autogen` | `repository` |
| AFFiNE | `toeverything-affine` | `repository` |
| Roo Code（已封存） | `roocodeinc-roo-code` | `repository` |
| Designed to Scale | `designed-to-scale` | `interactive-tutorial` |
| motion-design-skill | `theatlasteam-motion-design-skill` | `repository` |
| ComfyUI | `comfy-org-comfyui` | `repository` |
| dotlottie-web | `lottiefiles-dotlottie-web` | `library` |
| Manim | `manimcommunity-manim` | `repository` |
| Three.js | `mrdoob-three-js` | `library` |
| Blender | `blender-blender` | `repository` |
| faster-whisper | `systran-faster-whisper` | `repository` |
| FFmpeg | `ffmpeg` | `documentation` |

## 沿用現有項目

- `infiniflow-ragflow`：來源與用途已存在，未變動 Canonical。
- `anime-js`：已收藏 Anime.js，未重複新增。
- `heygen-com-hyperframes`：新增 `KentwareDemo/hyperframes` 為額外收藏來源。KentwareDemo README 引向 HeyGen 原始安裝與說明，但兩個 Repo 的 Git commit／完整沿革尚未比對，保留來源差異。

## 暫存待查的 2 筆

- `github-beginners-session-guide-20261124`：原文尚未在本輪取得，不依概述杜撰文章內容。
- `postx-287fc54f-d1ab-4b09-86ed-59f43c5e6792`：標題、正文待確認，不強制進正式六類 Entity。

## 內容深度與驗證

- GitHub repo、官方網站的 basic intake 不等於逐檔 Repo Guide；教材未完成逐章學習驗收。
- `microsoft/autogen`、`RooCodeInc/Roo-Code` 上游已封存，保留為歷史參考；本輪未安裝或實測。
- 用戶提供的十個動畫工具僅作工作流程候選；商用授權須分別核對軟體、模型、素材、音樂以及字型。
- 產生繁體中文字幕後必須人工覆核專有名詞、人名、品牌、斷句與時間同步。
- 尚未檢查上游原始碼完整行為、實際 Build/Runtime/Security/License/Integration；僅標註 `not-tested`。
- Release Gate 應以 PR Intake、V2 Validate、Graph、合併後 Catalog Sync、Pages Build 與 Live Smoke 的實際工作紀錄分別判斷。

## Phase 3 內容方向

延續四類差異化閱讀契約：Repo 重點為架構與重建；Product 重點為選型與操作；Collection 重點為篩選與比較；Learning 重點為原理、練習與驗收。不要為本批 16 筆以固定段落生成虛假的深度教程。
