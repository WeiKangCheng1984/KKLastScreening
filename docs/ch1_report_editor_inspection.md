# Ch1 章末流程／旗標檢查清單（報告編輯器改版）

## 入口與旗標現況

| 項目 | 位置 | 說明 |
|------|------|------|
| **劉隊「向劉隊報告」** | `page.tsx` handleDialogChoice `ch1_liu_report_now` | 點選後僅：關閉當前對話、刷新 `refreshKey`、設 `showCh1ReportEditor(true)`，直接開啟 Ch1 報告編輯器，不再經過舊解謎／推理面板。 |
| **劉隊 readyToReport** | `page.tsx` npc_liu 點擊 | `readyToReport = hasCh1CoreClues && allScenesVisited`，其中 `hasCh1CoreClues` 由 `ticket_stub_collected` +（`clue_light_delay_confirmed` 或 `security_monitor_viewed`）+（`black_fragment_found` 或 `cleaning_note_found` 或 `clue_clean_trash`）決定。 |
| **推理分析按鈕** | `page.tsx` `showReasoningButton` | `showReasoningButton` 僅在 `chapterId !== 'ch1'` 且本章全場景已訪、尚未完成該章推理時顯示；ch1 明確被排除，因此不會透過右下角按鈕進入 ReasoningPanel。 |
| **ReasoningPanel** | `page.tsx`、`ReasoningPanel.tsx` | 保留作為 ch2/ch3 的一般推理面板（Q1/Q2/Q3 + 劉隊結語）；ch1 不再使用 ReasoningPanel 作為章末入口，而是改用 `Ch1ReportEditor`。 |
| **ch1_puzzle_done** | `gameDataCh1.ts`、`GameEngine.solvePuzzle` | 仍由舊的 `ch1_pair_matching`／PickThree 謎題 onSolve 寫入，目前主線 UI 已沒有開啟此謎題的入口，視為保留型旗標。 |
| **ch1_reasoning_done** | `gameDataCh1.ts`、`GameEngine.setReasoningComplete` | 舊版 arrangement 謎題 `ch1_reasoning_3` onSolve 會設為 true；新版流程則在 Ch1ReportEditor 完成態度宣言後，由 `setReasoningComplete('ch1')` 統一寫入。 |

## ch1 主要旗標與關係（更新後）

- **核心線索收集**
  - 票根：`ticket_stub_collected`（放映廳）。
  - 燈光／時間：`clue_light_delay_confirmed` 或 `security_monitor_viewed`（播映室／周姊敏感對話）。
  - 殘留／清潔：`black_fragment_found` 或 `cleaning_note_found` 或 `clue_clean_trash`（廁所）。
  - 以上三類同時為真 → `hasCh1CoreClues = true`，再配合 `allScenesVisited` 解鎖劉隊報告入口。

- **敏感對話與劉隊中段**
  - 每位 NPC 完成一次敏感對話（透過 `SensitiveGateOverlay` 選分支 → 進入 `npcDialogs` 對話樹）後，寫入對應旗標：`npc_lin_sensitive_done`、`npc_ashun_sensitive_done`、`npc_xiaozhang_sensitive_done`、`npc_zhou_jie_sensitive_done`，同時依內心旁白選項調整 `insights`（procedure/human/evidence）。
  - 完成數量累計達 3 人時，`handleSensitiveGateChoice` 內會設 `ch1_liu_mid_ready = true`；若當下場景為 `scene_ch1_cinema_a_hall`，立即播放劉隊中段問候並設 `ch1_liu_mid_shown = true`。

- **劉隊報告與進入 ch2**
  - 點擊劉隊頭像（`NpcRightStrip`）：
    - 若 `hasCh1CoreClues && allScenesVisited` 為真，顯示包含「我想向你報告」（`ch1_liu_report_now`）的對話；選該項 → 開啟 `Ch1ReportEditor`。
    - 若條件尚未達成，顯示僅引導玩家「再繞繞／先整理」的對話，不出現報告選項。
  - `Ch1ReportEditor` 四步驟依序寫入：
    - Step0：`ch1_report_evidence`（三張證據，涵蓋時間／流程／殘留）。
    - Step1：`ch1_report_timeline`（五張時間線事件，正確排序）。
    - Step2：`ch1_police_note`（玩家選擇是否補一句交給劉隊寫進報告）。
    - Step3：`ch1_attitude_declared`（態度四選一），同時透過 `engine.handleDialogChoice` 更新 `insights`。
  - 在 Step3 按下「進入第二章」時：
    - 呼叫 `setReasoningComplete('ch1')` → 寫入 `ch1_reasoning_done = true` 及 `navigate_to_ch2_intro = true`。
    - `page.tsx` 在 `Ch1ReportEditor` onComplete 內偵測 `navigate_to_ch2_intro`，重置該 flag 並 `router.push('/play/ch2/intro')`。

## 需移除／停用（歷史計畫，已完成）

1. **page.tsx**
   - **移除** `showCh1PairPuzzle` / `setShowCh1PairPuzzle` 的開啟邏輯：`ch1_liu_report_now` 內不再 `setShowCh1PairPuzzle(true)` / `setShowCh1ReasoningPuzzle(true)`。
   - **移除** `ch1_liu_report_now` 對 `ch1_puzzle_done`、`ch1_reasoning_done` 的檢查；改為直接 `setShowCh1ReportEditor(true)`。
   - **移除** `ch1_liu_try_reasoning` 分支（744–747）：不再開 showCh1ReasoningPuzzle。
   - **隱藏 ch1 推理分析按鈕**：`showReasoningButton` 在 `chapterId === 'ch1'` 時改為 false（僅 ch2/ch3 顯示）。
   - **移除**整塊 `showCh1PairPuzzle` 的 AnimatePresence + PickThreePuzzle/PairMatchingPuzzle 渲染（約 3641–3735）。
   - **移除**整塊 `showCh1ReasoningPuzzle` 的 AnimatePresence + ArrangementPuzzle 渲染（約 3748–3812）。
   - **移除** DeveloperPanel 內「解謎／推理」兩顆 ch1 專用按鈕（開 showCh1PairPuzzle / showCh1ReasoningPuzzle）及對應的 ch1_puzzle_done / ch1_reasoning_done 顯示（約 3368–3406）。
   - **可選**：移除 state `ch1ReasoningStep` / `setCh1ReasoningStep`（僅舊推理謎題使用）。

2. **保留但不再主線使用**
   - `data/gameDataCh1.ts` 的 `ch1_puzzle_done` / `ch1_reasoning_done` 事件 effect、`ch1_pair_matching`、`ch1_reasoning_1~3` 謎題：保留不刪，供日後清理或備用。

## 需改寫（歷史計畫，已完成）

1. **page.tsx**
   - **ch1_liu_report_now**：改為只做 `setCurrentDialog(null)`、`setRefreshKey(+1)`、`setShowCh1ReportEditor(true)`（不再檢查 puzzle/reasoning，不顯示態度對話）。
   - **npc_liu readyToReport**：改為依「核心線索＋場景條件」判斷（沿用 hasCh1CoreClues + allScenesVisited），不再依賴 `puzzleDone && reasoningDone`。即：`readyToReport = hasCh1CoreClues && allScenesVisited`（且 chapterId === 'ch1' 時）。
   - **態度宣言與進入 ch2**：改為只在 Ch1ReportEditor 內完成 Step3 時觸發（寫入 ch1_attitude_declared、setReasoningComplete('ch1')、顯示章末句＋「進入第二章」按鈕）；從 handleDialogChoice 的 ch1_attitude_* 與 to_ch2 邏輯可保留，供非報告編輯器路徑的 fallback，或改為僅由報告編輯器呼叫。
   - **showReasoningButton**：條件改為 `(chapterId !== 'ch1') && hasReasoningForChapter && allScenesVisited && !reasoningDone && !showSceneName`，使 ch1 不顯示右下角推理分析按鈕。

2. **新增**
   - **Ch1ReportEditor**：四步驟 UI（證據桌、時間線、版本深度、態度宣言），完成時寫入 `ch1_report_evidence`、`ch1_report_timeline`、`ch1_police_note`、`ch1_attitude_declared` 並呼叫 `engine.setReasoningComplete('ch1')`。

## 衝突點摘要（舊 → 新）

- **雙入口**：目前「向劉隊報告」與「推理分析按鈕」皆可進章末；改版後 ch1 只保留「向劉隊報告 → Ch1ReportEditor」單一路徑，推理按鈕在 ch1 隱藏。
- **旗標**：新流程不再依賴 ch1_puzzle_done / ch1_reasoning_done 作為報告入口條件；完成報告時改寫 ch1_reasoning_done（經 setReasoningComplete）並新增 ch1_report_evidence、ch1_report_timeline、ch1_police_note、ch1_attitude_declared。

---

## 手動驗收清單（ch1 端到端）

1. **進章**：進入第一章 intro → 任一場景，確認場景與 NPC 頭像正常。
2. **核心線索**：取得票根（`ticket_stub_collected`）、燈/監視器線索（`clue_light_delay_confirmed` 或 `security_monitor_viewed`）、殘留線索（`black_fragment_found` 或 `cleaning_note_found` 或 `clue_clean_trash`）；拜訪所有 ch1 場景（`allScenesVisited`）。
3. **劉隊入口**：未達條件時點劉隊 → 應為「再繞繞/先整理」提示，**不**出現「我想向你報告」。
4. **達條件後**：點劉隊 → 出現「我想向你報告」→ 點選後**直接**開啟報告編輯器（全螢幕模態），不開舊解謎/推理。
5. **報告編輯器**  
   - Step0 證據桌：選 3 張證據，須涵蓋時間/流程/殘留各一；選錯類別時顯示缺哪種支點；下一頁寫入 `ch1_report_evidence`。  
   - Step1 時間線：依序點選 5 張事件卡；順序錯誤時顯示 KK 吐槽；下一頁寫入 `ch1_report_timeline`。  
   - Step2 版本深度：左側標準版、右側可補一句（含「先不用」）；下一頁寫入 `ch1_police_note`（lineId 或 `none`）。  
   - Step3 態度宣言：四選一 → 顯示章末推理句 →「進入第二章」→ 寫入 `ch1_attitude_declared` 並呼叫 `setReasoningComplete('ch1')`，導向 `/play/ch2/intro`。
6. **ch1 不顯示**：右下角「推理分析」按鈕在 ch1 隱藏；ch2/ch3 仍顯示。
7. **無死路**：全程無分岔死路、無 UI 遮擋（報告編輯器開啟時其他模態不顯示）。

