# 第一章 小張（放映員）敏感問題觸發條件 盤查報告

## 一、目前邏輯摘要

### 1. 觸發條件（play 頁 NpcRightStrip onNpcClick）

- **出現「問敏感問題」選項**需同時滿足：
  - `projection_room_unlocked === true`
  - `projection_room_observed === true`
  - `getNpcCasualTalkCount('npc_xiaozhang') >= 3`
  - `npc_xiaozhang_sensitive_done !== true`

### 2. 兩個 flag 的來源

| Flag | 設定時機 |
|------|----------|
| **projection_room_unlocked** | 僅在 **放映廳（大廳）** 點擊「側走道與出口燈箱」時設定（gameData 約 364–365 行，與 observed_light、observed_any_ch1 一併設定）。 |
| **projection_room_observed** | 在 **播映室** 內觸發以下任一事項時設定：① 檢查播映時間表、② 檢查燈控面板、③ 觀看監視器畫面。**檢查「放映員的筆記」不會**設定此 flag。 |

### 3. 敏感完成時機

- 玩家點「我想問一些比較敏感的問題」→ 出現二選一（表格與權限 / 口頭指示）。
- 玩家選 **任一分支** 時，在 `handleChoice` 裡會**先** `setFlag('npc_xiaozhang_sensitive_done', true)`，**再** `startNpcDialog(..., node_xiaozhang_table_1 或 node_xiaozhang_oral_1)`。
- 對話樹跑完後，insight 節點的 effects 也會設一次 `npc_xiaozhang_sensitive_done`（重複設、無副作用）。

---

## 二、可能造成「怪」的點

### 問題 A：unlocked 與「人在播映室」可能不同步

- **projection_room_unlocked** 只在大廳點「燈箱」時設為 true。
- 進入播映室是透過**章節場景列表 + 左右箭頭**，目前**沒有**用 `projection_room_unlocked` 阻擋進入播映室。
- 因此可能出現：
  - 玩家**沒點大廳燈箱**就用箭頭切到播映室 → 和小張閒聊 3 次、也點了時間表/燈控/監視器（`projection_room_observed === true`），但 `projection_room_unlocked` 仍為 false → **敏感選項永遠不出現**。
  - 或玩家**先**進播映室探索、**後**才回大廳點燈箱 → 行為上「已經觀察過播映室」，但若沒點燈箱，敏感選項一樣不出現。

**結論**：若設計是「先解鎖再進播映室」，目前入口沒檢查 unlocked，容易讓玩家覺得「條件怪」或「不知道缺哪一步」。

---

### 問題 B：「觀察」門檻與直覺不符

- 文件（ch1_npc_dialogue_plan）定義：播映室觀察 = 點過「播映時間表／燈控面板／監視器」**其一**即設 `projection_room_observed`。
- 「放映員的筆記」**沒有**設 `projection_room_observed`。劇情上筆記和燈/表高度相關，玩家可能認為「看過筆記」也算對播映室的觀察，但現況不算。

**結論**：若希望「看過筆記」也算對小張問敏感問題的前置，目前會少一途徑，可能感覺門檻偏嚴或不一致。

---

### 問題 C：敏感「完成」時機在選分支時就鎖定

- 一選「表格」或「口頭」就立刻設 `npc_xiaozhang_sensitive_done`，對話樹尚未跑完。
- 與林瑞堂一致（選敏感題目就鎖定），好處是不會重複選另一條；若設計是「跑完內心旁白才算完成」，則應改為只在對話樹最後的 insight 節點設 flag。

**結論**：目前是「選了就鎖定」，與林瑞堂一致；若無特別需求可維持，若有「完成感」需求可改為僅在 insight 節點設 flag。

---

## 三、建議方案（供你決定是否修正）

### 建議 1：放寬「解鎖」對敏感選項的影響（推薦先考慮）

- **作法**：小張敏感選項的條件改為只檢查 **`projection_room_observed` + 閒聊 ≥ 3 + 未完成敏感**，**不再**要求 `projection_room_unlocked`。
- **理由**：玩家人都能在播映室跟小張聊天了，再要求「大廳點過燈箱」才給敏感選項，容易讓人不解；「有在播映室內觀察過（時間表/燈控/監視器之一）」已足以代表有做功課。
- **注意**：若你希望「沒點燈箱就不能進播映室」，需另外在**場景入口或箭頭**上加條件（例如播映室箭頭在未 unlocked 時不顯示或點擊時提示），與小張敏感條件分開處理。

### 建議 2：讓「放映員的筆記」也算觀察

- **作法**：在 gameData 的 `examine_projector_notes` 事件 effects 中，加上  
  `{ type: 'setFlag', flag: 'projection_room_observed', value: true }`。
- **理由**：筆記內容與燈/表強相關，算進「對播映室的觀察」較符合劇情直覺，也多一條取得敏感選項的途徑。

### 建議 3：維持 unlocked + observed，但補齊入口邏輯

- **作法**：不改小張條件，改為「進入播映室」必須先滿足 `projection_room_unlocked`（例如：箭頭或場景選擇器在未 unlocked 時不顯示播映室，或點擊時顯示「先到放映廳查看燈箱」）。
- **理由**：若你希望流程嚴格「先大廳燈箱 → 再進播映室 → 再觀察 → 再問小張」，這樣條件與動線一致，玩家較不會困惑「為什麼不能問」。

### 建議 4：敏感完成時機改為「跑完旁白才鎖定」（可選）

- **作法**：在 play 頁 `handleChoice` 裡，對 `xiaozhang_branch_table` / `xiaozhang_branch_oral` **移除** `setFlag('npc_xiaozhang_sensitive_done', true)`，只保留 npcDialogs 裡各 insight 節點 effects 的 setFlag。
- **理由**：完成感較足；缺點是若玩家選了分支後中途關閉對話，需決定是否仍算「已選」（目前一選就鎖另一條，若改為僅 insight 設 flag，可再決定「選分支時」是否設一個「已選題目」的 flag 避免重選另一條）。

---

## 四、建議優先順序

1. **先釐清設計**：播映室是否要「點過大廳燈箱才能進」？若是，補入口條件（建議 3）；若否，小張敏感改為不檢查 unlocked（建議 1）。
2. **再視需求**：要不要讓「放映員的筆記」也算觀察（建議 2）。
3. 敏感完成要「選了就鎖」還是「跑完旁白才鎖」依你體驗決定（建議 4 可選）。

以上供你決定是否修正與要採哪幾項。
