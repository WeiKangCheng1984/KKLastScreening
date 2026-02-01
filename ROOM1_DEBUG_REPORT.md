# ROOM 1 破關邏輯診斷報告

## 發現的問題

### 問題 1：謎題解決後觸發的事件對話沒有顯示 ✅ 已修復
**問題描述**：
- `tv_silent_puzzle` 解決後會觸發 `open_kitchen_drawer` 事件
- 這個事件會添加 `water_stop_tape` 道具並顯示對話
- 但 `triggerEvent` 在 `applyEffect` 中執行，返回的對話沒有被處理

**修復方案**：
- 在 `handlePuzzleSolve` 中檢查 `triggerEvent` 效果
- 處理事件產生的對話和道具獲取對話
- 將所有對話加入對話隊列

### 問題 2：謎題匹配邏輯不完整 ⚠️ 已優化
**問題描述**：
- `tv_silent_puzzle` 沒有 `hasInteracted` tv 需求
- 需要通過名稱匹配來觸發
- 原來的匹配邏輯可能不夠精確

**修復方案**：
- 優化名稱匹配邏輯
- 添加多種匹配模式（完整名稱、去除後綴、去除下劃線）
- 添加調試日誌幫助診斷

### 問題 3：事件優先級可能導致謎題無法觸發 ⚠️ 需要測試
**問題描述**：
- 如果事件先觸發，可能會阻止謎題檢查
- 但現在謎題檢查在事件處理之前，應該沒問題

## 預期的破關流程

### ch1_sc1 (客廳)
1. 點擊 `photo_wall` → 獲得 `faded_photo`，設置 `photos_examined`
2. 點擊 `stove` → 設置 `stove_checked`
3. 點擊 `next_room_sound` → 設置 `sound_heard`
4. 點擊 `cold_tea_spot` → 設置 `tea_noticed`
5. 點擊 `tv` → 設置 `tv_checked` 和 `tv_puzzle_triggered`
6. **再次點擊 `tv`** → 應該觸發 `tv_silent_puzzle`（需要所有上述 flag + faded_photo）
7. 解謎（答案：2413）→ 設置 `tv_puzzle_solved`，觸發 `open_kitchen_drawer` → 獲得 `water_stop_tape`

### ch1_sc2 (廚房)
1. 點擊 `wrench_spot` → 獲得 `rusty_wrench`
2. **點擊 `gas_stove`** → 應該觸發 `stove_stuck_puzzle`（需要 rusty_wrench + water_stop_tape + hasInteracted gas_stove）
3. 解謎（選擇：apply_tape → rotate_counterclockwise）→ 設置 `stove_closed`
4. 點擊 `watch_spot` (ch1_sc3) → 獲得 `stopped_watch`
5. **點擊 `leaky_faucet`** → 應該觸發 `leaky_faucet_puzzle`（需要 stopped_watch + stove_closed + hasInteracted leaky_faucet）
6. 解謎（序列：long, short, short, long, short, short）→ 設置 `faucet_puzzle_solved`

### ch1_sc3 (臥室)
1. 點擊 `watch_spot` → 獲得 `stopped_watch`
2. 點擊 `bedside_table` → 獲得 `bedside_key`
3. 點擊 `wardrobe` → 設置 `wardrobe_label_read`
4. 點擊 `milk_spot` → 獲得 `expired_milk`
5. 點擊 `trash_bin` → 丟棄 `expired_milk`，設置 `milk_discarded`
6. **點擊 `bedroom_door`** → 應該觸發 `bedroom_door_lock`（需要 bedside_key + wardrobe_label_read + hasInteracted bedroom_door）
7. 解謎（組合：bedside_key + milk_discarded）→ 設置 `bedroom_door_opened`，完成 ROOM 1

## 調試建議

1. 打開開發者模式：在 URL 後加上 `?dev=1`
2. 查看控制台日誌：
   - `[謎題檢查]` - 顯示謎題檢查結果
   - `[謎題觸發]` - 顯示謎題觸發
   - `[事件觸發]` - 顯示事件觸發
3. 檢查遊戲狀態：
   - 按 `Ctrl+D` 打開開發者面板
   - 查看當前 flags 和 inventory

## 可能的問題點

1. **tv_silent_puzzle 無法觸發**：
   - 檢查是否所有痕跡都被看過（photos_examined, stove_checked, sound_heard, tea_noticed, tv_checked）
   - 檢查是否有 faded_photo
   - 檢查謎題是否已經解決過

2. **stove_stuck_puzzle 無法觸發**：
   - 檢查是否有 rusty_wrench
   - 檢查是否有 water_stop_tape（需要先解決 tv_silent_puzzle）
   - 檢查是否點擊過 gas_stove

3. **leaky_faucet_puzzle 無法觸發**：
   - 檢查是否有 stopped_watch（在 ch1_sc3 獲得）
   - 檢查是否 stove_closed（需要先解決 stove_stuck_puzzle）
   - 檢查是否點擊過 leaky_faucet

4. **bedroom_door_lock 無法觸發**：
   - 檢查是否有 bedside_key
   - 檢查是否 wardrobe_label_read（需要點擊 wardrobe）
   - 檢查是否點擊過 bedroom_door
   - 檢查是否 milk_discarded（需要丟棄 expired_milk）
