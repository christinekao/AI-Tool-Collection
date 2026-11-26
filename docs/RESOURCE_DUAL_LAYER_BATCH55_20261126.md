# Resource 雙層知識 Batch 55｜影片渲染與互動動效

3 mapped 候選、9 用途、9 局部程式能力、3 design-only 案例。原分類領域、Tags、關聯保留。

## alchaincyf-huashu-motion

- 固定版本 `f4f38bfe295a3f768753857be9236cc3277c7dad`；根授權：MIT；音樂、字型與第三方元件另查
- 用途：以可編輯的網頁程式碼製作動效影片，支援渲染前檢查、影片素材時間定位與成片品質量測。
- 案例：規劃程式動效影片的渲染與品質檢查；自有合成 HTML 動效、測試影片及分鏡時間規格。 → 來源檢查、時間戳資訊與成片異常檢視規格。 → 自有影片製作工作區，經人工覆核後使用。
- 來源證據：
  - 檢查渲染來源與畫面問題：[cli/lib/check.js](https://github.com/alchaincyf/huashu-motion/blob/f4f38bfe295a3f768753857be9236cc3277c7dad/cli/lib/check.js)（checkSource / checkPage / check）；來源檢查與實際頁面檢查不同；頁面抽樣不能保證所有畫面，需核准可信瀏覽器環境。
  - 依影片時間戳規劃素材畫面：[cli/lib/frames.js](https://github.com/alchaincyf/huashu-motion/blob/f4f38bfe295a3f768753857be9236cc3277c7dad/cli/lib/frames.js)（probeVideo / matrixFor）；依 FFprobe 回傳及檔案標記；缺少時間戳或影片流會失敗，色彩轉換及實際同步仍須驗證。
  - 量測成片的瞬間跳動與靜止：[cli/lib/qa.js](https://github.com/alchaincyf/huashu-motion/blob/f4f38bfe295a3f768753857be9236cc3277c7dad/cli/lib/qa.js)（qa / probe / frames）；以灰階低解析度差值估算，可能遺漏局部錯誤或誤判有意轉場，須人工播放核對。

## hao0321-editkin

- 固定版本 `51b1e3172142fffcf8da1d7110377caa3b42f9f4`；根授權：GPL-3.0 公開舊版；0.16.0 起為專有軟體
- 用途：提供可編輯時間軸與影片處理；本次僅查核公開舊版的渲染圖驗證、增量更新及白平衡契約。
- 案例：規劃剪輯渲染圖與色彩處理的契約驗收；合成渲染圖、節點變更與測試 RGB 資料。 → 合法圖結構、受影響節點與白平衡驗收規格。 → 自有剪輯系統的設計與回歸測試，遵守來源授權。
- 來源證據：
  - 驗證渲染圖的結構契約：[native/hao-core/src/engine/validate.rs](https://github.com/Hao0321/Editkin/blob/51b1e3172142fffcf8da1d7110377caa3b42f9f4/native/hao-core/src/engine/validate.rs)（compile_graph / valid_frame_range / topological_order）；檢查識別、尺寸、時間基準與輸出節點；編譯合法不代表畫面正確。
  - 追蹤節點修改影響的下游：[native/hao-core/src/engine/validate.rs](https://github.com/Hao0321/Editkin/blob/51b1e3172142fffcf8da1d7110377caa3b42f9f4/native/hao-core/src/engine/validate.rs)（dirty_descendants / topological_order）；拒絕未知節點；僅依圖中已宣告的依賴計算，未驗證快取實際失效或新版行為。
  - 驗證版本化白平衡參數：[native/hao-core/src/engine/white_balance.rs](https://github.com/Hao0321/Editkin/blob/51b1e3172142fffcf8da1d7110377caa3b42f9f4/native/hao-core/src/engine/white_balance.rs)（validate_contract / apply_linear / apply_encoded_rec709）；限制有限數值與處理器版本；這是公開舊版局部色彩運算，不等於完整色彩管理或新版結果。

## lucasmarkes-hairline

- 固定版本 `034f4bf9902c6adcf3cf39d82f85e6010cb4e094`；根授權：MIT
- 用途：提供可互動的等角線條 SVG 圖形，並以統一強度參數、動效模型及 React 元件生命週期管理呈現。
- 案例：規劃互動線條圖形的參數與動效驗收；合成產品頁面、互動強度及減少動態設定。 → 強度映射、動畫狀態與元件更新驗收規格。 → 自有前端展示頁面，保留重要資訊的文字替代。
- 來源證據：
  - 統一不同圖形的互動強度：[packages/hairline/src/intensity.ts](https://github.com/lucasmarkes/hairline/blob/034f4bf9902c6adcf3cf39d82f85e6010cb4e094/packages/hairline/src/intensity.ts)（intensity / parameter / TABLE）；非法數值回到預設；映射依各圖形設定，不代表感知強度一致。
  - 依互動類型更新動效：[packages/hairline/src/core/motion.ts](https://github.com/lucasmarkes/hairline/blob/034f4bf9902c6adcf3cf39d82f85e6010cb4e094/packages/hairline/src/core/motion.ts)（spring / stepS / setReducedMotion / tween）；減少動態時直接到達目標；旗標與瀏覽器設定同步及高負載下效能仍須實測。
  - 管理互動圖形元件生命週期：[packages/hairline/src/react.tsx](https://github.com/lucasmarkes/hairline/blob/034f4bf9902c6adcf3cf39d82f85e6010cb4e094/packages/hairline/src/react.tsx)（make / useIsoLayoutEffect）；依 React effect 掛載及銷毀；伺服器端先呈現容器，鍵盤操作、SSR hydration 與可及性仍需驗證。
