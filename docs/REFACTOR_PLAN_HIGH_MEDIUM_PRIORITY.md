# KK 流程偵探 — 高優先與中優先級優化執行計畫

本文件為「檔案結構與資料流」優化的分階段執行藍圖。實際執行時請依階段順序進行，每階段結束後執行 build 與手動驗證，再進入下一階段。

---

## 一、背景與目標

### 1.1 現況摘要

- **主遊玩頁** `app/play/[chapterId]/[sceneId]/page.tsx` 約 4900+ 行、56 個 import、60+ 個 useState/useCallback/useEffect，職責過重。
- **章節／NPC 邏輯** 以 `chapterId === 'ch1'`、`npcId === 'npc_lin_ruitang'` 等硬編碼散落在 page 多處（約 15+ 處）。
- **謎題渲染** 為一長串 `currentPuzzle.type === 'xxx' ? <XxxPuzzle ... /> : ...`，新增謎題類型需改動主頁。
- **填空 UI**：`Ch2ReportEditor`／`Ch3ReportEditor`…（章尾雙格）、`ReportFillBlank`（共用題型），題目來源為各章 `*ReportConfig.ts`。
- **資料檔** 分散：play 頁直接 import 多個 data 檔，缺少「依 chapterId 取得本章設定」的單一入口。

### 1.2 本計畫涵蓋項目

| 優先級 | 項目 | 對應階段 |
|--------|------|----------|
| 高 | 謎題層統一（PuzzleRenderer + type→組件 map） | 階段 1 |
| 高 | 章節行為表（NPC/章節分支集中） | 階段 3 |
| 高 | Play 頁抽出 Hooks（場景／對話／道具等） | 階段 4 |
| 中 | 填空 UI 共用底層（Ch2 / ReportFillBlank 等） | 階段 2 |
| 中 | 章節資料／設定單一入口 | 階段 5 |

---

## 二、階段 0：前置準備（每次開始前可重複執行）

| 步驟 | 內容 |
|------|------|
| 0.1 | 執行 `npm run build`，確認目前專案可成功建置。 |
| 0.2 | 手動跑一輪 ch1（進入場景、NPC 閒聊、敏感對話、劉隊報告入口、Ch1ReportEditor 完成）與 ch2（車內線索、阿蘇敏感、劉隊結算、Ch2ReportEditor 五題雙格），確認主線行為正常。 |
| 0.3 | 建議為 `app/play/[chapterId]/[sceneId]/page.tsx` 建立 git 分支或標籤，方便比對與還原。 |

**完成標準**：build 通過、主線 ch1/ch2 流程可完整跑通。

---

## 三、階段 1：謎題層統一（高優先）

### 3.1 目標

以「型別 → 組件」對應取代 page 內一長串 `currentPuzzle.type === 'xxx'` 分支，使新增謎題類型時只需改一處（PuzzleRenderer 的 map）。

### 3.2 步驟

| 步驟 | 內容 | 備註 |
|------|------|------|
| 1.1 | **新增** `components/PuzzleRenderer.tsx`。 | 單一元件，接收 `puzzle`、`onSolve`、`onClose`、`error`、`onErrorClear`。內部以 `puzzle.type` 對應到既有謎題組件（PuzzleInput、ArrangementPuzzle、CombinationLock、WordScramble、WireConnection、JigsawPuzzle、RotatingDial、SequenceMemory、SlidingPuzzle、SymbolMatching、MazePath、LogicSwitches、VisualSelectionPuzzle 等），統一轉傳上述 props。不支援的 type 可 fallback 到 PuzzleInput 或顯示 null。 |
| 1.2 | 在 `app/play/[chapterId]/[sceneId]/page.tsx` 中，將現有約 4385～4530 行的謎題分支（`currentPuzzle && ( currentPuzzle.type === 'arrangement' ? ... : ... )`）替換為單一呼叫：`<PuzzleRenderer puzzle={currentPuzzle} onSolve={handlePuzzleSolve} onClose={...} error={puzzleError} onErrorClear={...} />`。 | 保持 `handlePuzzleSolve`、`setCurrentPuzzle(null)`、`setPuzzleError` 等行為不變。 |
| 1.3 | 移除 page 中不再需要的各謎題元件 import（PuzzleInput、ArrangementPuzzle、CombinationLock 等），僅保留 `PuzzleRenderer`。 | 若其他區塊仍使用某謎題元件（例如某章節專用 UI），則保留該 import。 |
| 1.4 | 執行 `npm run build`。手動進入含有謎題的場景，觸發各類型謎題，確認解謎、關閉、錯誤提示行為與改動前一致。 | 可依專案內實際有使用的謎題類型逐項點擊測試。 |

### 3.3 產出與驗收

- **產出**：`components/PuzzleRenderer.tsx` 存在且涵蓋目前所有使用中的謎題 type；page 中謎題區塊縮為單一 `<PuzzleRenderer />`。
- **驗收**：build 通過；各謎題類型觸發、解題、關閉、錯誤顯示正常，無 regression。

### 3.4 涉及檔案

- 新增：`components/PuzzleRenderer.tsx`
- 修改：`app/play/[chapterId]/[sceneId]/page.tsx`（謎題區塊 + import）

---

## 四、階段 2：填空 UI 單一化（中優先）

### 4.1 目標

ch1／ch2／ch3～ch6 章尾已統一走 `ReportFillBlank` + 各章 `*ReportEditor`；本階段目標改為：避免再新增平行填空實作、新章僅加 config。（註：獨立填空測試按鈕與 `TestFloatingFillBlank` 已移除。）

### 4.2 步驟

| 步驟 | 內容 | 備註 |
|------|------|------|
| 2.1 | **共用元件**：沿用既有 `FloatingFillBlankCore.ts` 型別與 `ReportFillBlank` 雙格填空 UI。必要時擴充為 Ch2 五題輪流可複用。 | 介面需滿足 Ch2 五題與 ch1 態度五題雙格填空等用法。 |
| 2.2 | **（已完成）** `components/Ch2ReportEditor.tsx` + `data/ch2ReportConfig.ts`，與 ch1/ch3 同款雙格流程。 | 旗標 `ch2_q*_done`、`ch2_qa_reviewed_with_liu`、`setReasoningComplete('ch2')`。 |
| 2.3 | 執行 `npm run build`。測試 ch2 劉隊結算完成五題、ch1 報告態度五題填空，確認無 regression。 | 可對照 `ch2ReportFillBlanks` 與 ch1AttitudeFillBlanks 逐題檢查。 |

### 4.3 產出與驗收

- **產出**：章尾填空以 ReportFillBlank 為單一核心，各章 *ReportEditor 為薄包裝。
- **驗收**：build 通過；ch2 五題流程與 ch1 態度填空流程皆正常。

### 4.4 涉及檔案

- 沿用：`components/FloatingFillBlankCore.ts`、`components/ReportFillBlank.tsx`
- 沿用：`components/Ch2ReportEditor.tsx`、`data/ch2ReportConfig.ts`

---

## 五、階段 3：章節行為表（高優先）

### 5.1 目標

將「依 chapterId / npcId 決定點擊後做什麼」的邏輯自 page 抽離，改為資料驅動（或單一模組），減少 page 內散落的 `if (npcId === 'npc_lin_ruitang') { ... }` 等分支。新增章節或 NPC 時，主要改動集中在行為表，而非主頁。

### 5.2 步驟

| 步驟 | 內容 | 備註 |
|------|------|------|
| 3.1 | **新增** `lib/chapterBehaviours.ts`（或 `data/chapterBehaviours.ts`）。導出函式如 `getNpcClickBehaviour(chapterId, npcId, context)`，其中 context 至少包含：engine state（或 getState() 的關鍵欄位：flags、inventory、npcCasualTalkCount 等）。回傳型別可為：`{ type: 'random_dialog' | 'sensitive_gate' | 'liu_report' | 'ch2_liu_qa' | 'ch2_asu_*' | ... ; payload?: { dialog?, gate?, ... } }`，供 page 依 type 執行對應動作（setCurrentDialog、setSensitiveGate、開啟報告／QA 等）。 | 先以 ch1 四 NPC + ch2 阿蘇、劉隊為實作範圍；其餘章節可後補或回傳 default。 |
| 3.2 | 將 page 內 **ch1 四名 NPC**（林瑞堂、阿順、小張、周姊）的點擊分支改為：呼叫 `getNpcClickBehaviour(chapterId, npcId, context)`，再根據回傳的 type 與 payload 執行 setCurrentDialog / setSensitiveGate / incrementNpcCasualTalk 等。 | 保持現有「閒聊次數 ≥ 3、觀察旗標、敏感對話完成」等條件不變，僅將判斷與結果集中到行為表。 |
| 3.3 | 將 page 內 **ch2 阿蘇、劉隊** 的點擊分支同樣改為依 `getNpcClickBehaviour` 回傳結果處理。 | 含阿蘇敏感門檻、談案情入口、劉隊「先去跟阿蘇講完」／「好，來說一次」與開啟 Ch2ReportEditor 等。 |
| 3.4 | 視需要將「劉隊開場」「敏感完成後劉隊中段問候」等邏輯一併收納到同一模組（或同檔的 helper），避免仍散落在 page 的 useEffect／回調中。 | 若目前由 reasoningByChapter + 旗標驅動，可改為由 chapterBehaviours 導出「該不該播劉隊開場／中段」的判斷。 |
| 3.5 | 執行 `npm run build`。手動跑 ch1 全 NPC（閒聊、敏感門檻、敏感對話、劉隊中段、報告入口）與 ch2（阿蘇閒聊、敏感、劉隊結算），確認行為與改動前一致。 | 重點：敏感 gate 出現時機、報告／QA 入口出現時機、對話內容不變。 |

### 5.3 產出與驗收

- **產出**：`lib/chapterBehaviours.ts`（或 `data/chapterBehaviours.ts`）存在；page 的 NpcRightStrip onNpcClick 改為依行為表結果分支，不再內嵌大段 ch1/ch2 專用 if。
- **驗收**：build 通過；ch1/ch2 所有 NPC 與劉隊互動流程與改動前一致，無 regression。

### 5.4 涉及檔案

- 新增：`lib/chapterBehaviours.ts` 或 `data/chapterBehaviours.ts`
- 修改：`app/play/[chapterId]/[sceneId]/page.tsx`（NpcRightStrip 的 onNpcClick 及相關 useEffect／回調）

---

## 六、階段 4：Play 頁抽出 Hooks（高優先）

### 6.1 目標

將「場景載入／對話隊列／道具詳解／謎題開關」等自 page 抽成自訂 hooks，縮小 page 體積、理清職責，後續修改對話或道具邏輯時多數只需改動 hooks。

### 6.2 步驟

| 步驟 | 內容 | 備註 |
|------|------|------|
| 4.1 | **新增** `hooks/useChapterData.ts`。封裝：依 `chapterId` 呼叫 `getChapterData(chapterId)`、`engine.loadChapterData(data)`、`chapterDataReady`、以及由 engine 取得的 `scenes` / `items`。page 只消費 hook 回傳的 `{ chapterDataReady, scenes, items, ... }`，不再在 page 內重複寫載入與 merge 邏輯。 | 需傳入 engineRef 或取得 engine 的方式；注意 SSR/客戶端時序。 |
| 4.2 | **新增** `hooks/useDialogQueue.ts`（或類似名稱）。封裝：`currentDialog`、`dialogQueue`、`addDialogsToQueue`、`setCurrentDialog`，以及「關閉對話時處理隊列、ch2 QA phase 切換」等邏輯。介面盡量與現有 page 使用方式相容，以便最小化 page 改動。 | 若 ch2 的 handleDialogClose 內有複雜 QA 階段邏輯，可一併移入此 hook 或單獨 hook。 |
| 4.3 | **新增** `hooks/useInventoryDetail.ts`。封裝：`activeItemDetail`、`setActiveItemDetail`，以及「取得道具時顯示詳解卡」的邏輯（若目前寫在 handleItemCollection 附近可一併移入）。page 的 handleItemCollection 改為呼叫 hook 提供的方法或 setter。 | 保持與 ItemObtainedNotification / 背包點擊詳解行為一致。 |
| 4.4 | 在 page 中改為使用上述 hooks，移除已搬進 hook 的 state 與重複邏輯。若有必要可保留少數「僅 page 使用」的 state 於 page。 | 注意依賴順序：engineRef、chapterId、sceneId 等需先就緒再傳入 hooks。 |
| 4.5 | 執行 `npm run build`。快速跑 ch1/ch2 一輪：場景切換、對話隊列、道具取得與背包詳解、報告／填空流程，確認無 regression。 | 特別檢查對話關閉後隊列是否正確、ch2 QA 階段是否仍正常。 |

### 6.3 產出與驗收

- **產出**：`hooks/useChapterData.ts`、`hooks/useDialogQueue.ts`、`hooks/useInventoryDetail.ts` 存在；page 明顯變薄，職責以「組合 hooks + 版面 + 章節專用 UI」為主。
- **驗收**：build 通過；場景載入、對話、道具、報告／填空與改動前一致，無 regression。

### 6.4 涉及檔案

- 新增：`hooks/useChapterData.ts`、`hooks/useDialogQueue.ts`、`hooks/useInventoryDetail.ts`
- 修改：`app/play/[chapterId]/[sceneId]/page.tsx`

---

## 七、階段 5：章節資料／設定單一入口（中優先）

### 7.1 目標

play 頁與章節相關元件盡量不直接 import 多個零散 data 檔（如 ch1ReportConfig、reasoningByChapter 等），改由「依 chapterId 取得本章設定」的單一入口取得，降低維護成本與重複依賴。

### 7.2 步驟

| 步驟 | 內容 | 備註 |
|------|------|------|
| 5.1 | **擴充** `getChapterData(chapterId)` 或 **新增** `getChapterConfig(chapterId)`。回傳型別增加（可選）欄位：如 `reportConfig`、`reasoning`（劉隊 intro/outro 等）。若某章沒有則為 undefined。各 `gameDataChX` 或獨立的 config 檔 export 該章設定，由 getChapterData / getChapterConfig 組裝後回傳。 | 可先做 ch1、ch2，ch3+ 之後再補。 |
| 5.2 | 將 page 與章節相關元件（如 Ch1ReportEditor）改為從 `getChapterData` 或 `getChapterConfig` 取得所需設定，移除對 `ch1ReportConfig`、`reasoningByChapter` 等的直接 import（或僅保留一處由 getChapterConfig re-export）。 | 需確認 Ch1ReportEditor、reasoningByChapter 的消費方式，避免循環依賴。 |
| 5.3 | 執行 `npm run build`。確認 ch1 報告編輯器、ch2 劉隊文案與流程仍正常。 | 重點：報告四步驟、劉隊開場／中段／結算文案不變。 |

### 7.3 產出與驗收

- **產出**：章節設定經由 getChapterData 或 getChapterConfig 統一提供；page 與相關元件減少對零散 data 檔的直接依賴。
- **驗收**：build 通過；ch1 報告、ch2 劉隊相關流程與文案正常，無 regression。

### 7.4 涉及檔案

- 修改：`data/getChapterData.ts`（或新增 `data/getChapterConfig.ts`）、`app/play/[chapterId]/[sceneId]/page.tsx`、必要時 `components/Ch1ReportEditor.tsx` 等
- 可能調整：`data/ch1ReportConfig.ts`、`data/reasoningByChapter.ts` 的 export 與被引用處

---

## 八、執行順序與依賴關係

```
階段 0（前置）→ 階段 1（謎題）→ 階段 2（填空 UI）→ 階段 3（行為表）→ 階段 4（Hooks）→ 階段 5（章節設定入口）
```

- **階段 1** 與 **階段 2** 彼此獨立，可先做 1 再做 2，或先做 2 再做 1；建議先做階段 1（改動集中、風險較低）。
- **階段 3** 建議在階段 1、2 之後執行，避免在重構行為表時同時改動謎題與填空邏輯。
- **階段 4** 依賴「章節分支」已收斂到行為表，否則 hook 內會殘留大量 chapterId/npcId 判斷。
- **階段 5** 建議在階段 4 之後執行，避免在抽 hooks 的同時改動 data 入口與多處 import。

---

## 九、每階段完成後檢查清單

- [ ] `npm run build` 通過
- [ ] 該階段涉及的功能手動測試通過（見各階段驗收）
- [ ] 無新增 eslint/TypeScript 錯誤
- [ ] 若為階段 3、4、5，建議再跑一次 ch1 與 ch2 主線從頭到尾

---

## 十、文件修訂紀錄

| 日期 | 修訂內容 |
|------|----------|
| 初版 | 建立高優先與中優先級優化執行計畫，含階段 0～5 與檢查清單。 |

---

*本計畫對應之程式結構分析與問題摘要，可參照先前整理之「檔案結構與資料流整理」討論內容。*
