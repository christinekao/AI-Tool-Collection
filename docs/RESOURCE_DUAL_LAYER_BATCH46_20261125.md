# Resource 雙層整理 Batch 46

日期：2026-11-25。三筆既有 Resource，僅查核固定來源；未執行第三方工具。保留既有 ID、關聯及標籤。設計案例非實測。CI 待驗收。

## vulture-s-whisper-guard
- 來源：https://github.com/vulture-s/whisper-guard
- 固定版本：`196b7cea946f6c45ea4cdb2527b45cf81b0c37da`
- 授權：MIT
- 狀態：mapped；Runtime 未驗證
- 案例：規劃中文轉錄幻覺過濾與誤刪驗收
- 檢查低可信或靜音片段：`whisper_guard/guard.py`（WhisperGuard.process,_filter_segments,GuardConfig）；高無語音機率也可能是真實語音；須驗證含背景音、短句及低語音量案例。
- 處理異常重複文字：`whisper_guard/guard.py`（is_repetitive,remove_char_loops,_is_numeric_data）；刻意重複與數字可能有語意；正常說話與連貫幻覺需獨立人工抽查。
- 建立過濾品質基準：`bench/benchmark.py`（run_suite_a,run_suite_b）；作者測試為人工挑選的 fixtures，非獨立真實音訊成效；不得外推其準確度。

## shubhamsaboo-needle
- 來源：https://github.com/Shubhamsaboo/awesome-llm-apps/tree/main/advanced_llm_apps/needle
- 固定版本：`14c5f8ff0094659f321801385d2b52ccc65fea3b`
- 授權：Apache-2.0（上游根授權）
- 狀態：mapped；Runtime 未驗證
- 案例：規劃長文件語意定位及原句回查
- 限制查詢與文件輸入：`advanced_llm_apps/needle/server/search.mjs`（validate）；程式限制查詢 400 字元、段落 160 筆及總長 60000 字元；不代表資料可對外傳送。
- 評分並選擇相關原句：`advanced_llm_apps/needle/server/search.mjs`（makePayload,parseAnswers,search,THRESHOLD）；Jev 透過外部 AI Gateway，需核准資料與費用；0.58 是排序門檻，不是召回率保證。
- 保留原始句子位置：`advanced_llm_apps/needle/server/sentences.mjs`（sentenceSpans）；使用英文 Intl.Segmenter；繁體中文斷句及 DOM 映射需獨立測試。

## openhands-agent-canvas
- 來源：https://github.com/OpenHands/OpenHands
- 固定版本：`55c7b719e72adc42451fe3ad03b29f560577bee0`
- 授權：MIT（上游根授權）
- 狀態：mapped；Runtime 未驗證
- 案例：規劃多 Agent 執行環境與擴充介面治理
- 確認不同 Agent 的登入狀態：`src/api/acp-service/acp-service.api.ts`（classifyClaude,classifyCodex,AcpService）；未知不得視為已登入；實際金鑰、權限及後端設定不得出現在報告。
- 統一執行環境的命令結果：`src/api/runtime-service/agent-server-runtime-service.ts`（AgentServerRuntimeService.executeCommand）；命令接口不是沙箱保證；遠端會話、檔案與權限隔離須另測，不執行未知命令。
- 確認擴充模組的入口：`src/extensions/canvas-extension-module-loader.ts`（assertCanvasExtensionModule,loadCanvasExtensionModule）；動態 import 會執行模組程式，入口檢查不等於安全審計；僅在隔離環境載入已審查來源。
