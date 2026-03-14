# 第一章程式與玩法檢查報告

本文件記錄第一章（城市影城）的現況玩法、資料與程式對應，以及已確認與待修正項目。撰寫日期：依審查時程更新。

---

## 一、玩法總覽

### 1.1 章節與場景

| 項目 | 內容 |
|------|------|
| 章節 id | `ch1` |
| 場景數 | 3 |
| 場景列表 | `scene_ch1_cinema_a_hall`（放映廳）、`scene_ch1_projection_room`（播映室）、`scene_ch1_restroom`（廁所） |
| 定義位置 | `data/chapters.ts`、`data/gameDataCh1.ts` |

玩家可於三場景間以左右箭頭切換，依序探索線索、與 NPC 對話，並在滿足條件後向劉隊報告。

### 1.2 道具與「僅檢視」線索（精簡後）

第一章採「背包 2 件 + 檢視發現 4 項」設計：

| 類型 | 項目 | 說明 |
|------|------|------|
| **進背包** | `item_ticket_stub`（電影票根） | 放映廳地上，點擊取得 |
| **進背包** | `item_black_plastic_fragment`（黑色塑膠碎片） | 廁所洗手台下方，點擊取得 |
| **僅檢視** | 播映時間表（塗改） | 播映室 hotspot，檢視後設 `schedule_modified_found` |
| **僅檢視** | 燈控紀錄 | 播映室 hotspot，檢視後設 `clue_manual_light_control` |
| **僅檢視** | 放映員的筆記 | 播映室 hotspot，檢視後設 `projector_notes_found` |
| **僅檢視** | 清潔備忘 | 廁所垃圾桶 hotspot，檢視後設 `clue_clean_trash` |

- 背包僅會出現上述 2 件道具；其餘 4 項不會加入背包，僅以 flag 記錄「已發現」。
- 報告編輯器證據卡解鎖條件：**背包擁有該道具** 或 **對應發現 flag 為 true**（對照表在 `data/ch1ReportConfig.ts` 的 `CH1_ITEM_ID_TO_DISCOVER_FLAG`）。

### 1.3 主要流程

1. **進入第一章**：intro 後進入放映廳（或由 play 路由載入）。
2. **放映廳**：觀察死者座位 → 解鎖播映室；取得票根（進背包）。
3. **播映室**：檢視時間表、燈控、放映員筆記、監視器 → 解鎖廁所；監視器會設 `security_monitor_viewed`、`clue_fast_exit`、`restroom_unlocked`。
4. **廁所**：檢視洗手台下方（取得黑色碎片進背包）、垃圾桶（清潔線索 flag）、鏡子（`clue_killer_calm`）。
5. **NPC 敏感話題**：與林瑞堂、阿順、小張、周姊各完成敏感對話（至少 3 人完成後觸發劉隊中段對話；`flowController` 以 `ch1CoreSensitivesDone` 與 `ch1_liu_mid_shown` 判斷）。
6. **燈延遲線索**：`clue_light_delay_confirmed` 由 gameEngine 在周姊（周雅雯）相關對話結束時設定，用於解鎖「兇手手法」輸入謎題。
7. **向劉隊報告**：點劉隊選「我想向你報告」→ 開啟報告編輯器（證據桌／時間線／態度宣言）；條件由 `flowController.shouldAllowAction(st, 'ch1', 'show_liu_report_entry')` 控制，需 `ch1_liu_mid_shown` 且 3 人敏感完成、且尚未 `ch1_reasoning_done`。
8. **報告完成後**：態度宣言等結算後，可進入內心獨白、推理句與第二章解鎖等後續流程。

---

## 二、關鍵檔案與職責

| 檔案 | 職責 |
|------|------|
| `data/gameDataCh1.ts` | 場景、道具（含 collectible 與僅檢視）、hotspot、events、謎題、NPC 隨機對話 |
| `data/ch1ReportConfig.ts` | 報告編輯器：證據卡、時間線、態度宣言設定；`CH1_EVIDENCE_CATEGORIES`、`CH1_ITEM_ID_TO_DISCOVER_FLAG` |
| `data/ch1PasswordPresets.ts` | 第一章 20 階段密碼預設（inventory 僅 2 件，其餘以 flags 表示） |
| `data/flagTestConfig.ts` | 旗標測試面板；`ch1ReportCoreFlagIds`、`ch1ReportEvidenceItemIds`、`flagToItemIds`（僅 2 件道具同步） |
| `components/Ch1ReportEditor.tsx` | 報告 UI；證據卡可選條件為 `canUseEvidenceCard`（背包 OR 對應發現 flag） |
| `lib/flowController.ts` | 章節里程碑；`show_liu_report_entry` / `open_report_editor` 僅 ch1，條件為 `canEnterReport && !reasoningDone` |
| `app/play/[chapterId]/[sceneId]/page.tsx` | 劉隊對話、報告入口、開發者一鍵全開（見下方修正） |

---

## 三、報告編輯器與證據解鎖

- **證據卡**：共 6 張（票根、時間表、燈控、放映員筆記、黑色碎片、清潔備忘）；玩家需選 3 張且涵蓋三類（TimeAnchor / ProcessAnchor / PhysicalTrace）。
- **可選條件**：`canUseEvidenceCard(itemId)` = `inventory.includes(itemId)` 或 `flags[CH1_ITEM_ID_TO_DISCOVER_FLAG[itemId]]`。
- 票根、黑色碎片只看背包；其餘 4 項為「背包有 或 對應發現 flag 為 true」。

---

## 四、已確認一致之處

- 放映廳：`items` 僅含票根；`examine_ticket_stub` 會 `addItem` + `setFlag('ticket_stub_collected')`。
- 播映室：`items: []`；時間表／燈控／放映員筆記事件僅 `showDialog` + `setFlag`，無 `addItem`。
- 廁所：`items` 僅含 `item_black_plastic_fragment`；洗手台下方 `addItem` + `black_fragment_found`；垃圾桶僅 `showDialog` + `clue_clean_trash`。
- 謎題 `puzzle_ch1_how_murder_happened` 解鎖條件為 `schedule_modified_found`、`clue_light_delay_confirmed`、`security_monitor_viewed`（無 hasItem）。
- 謎題 `ch1_pair_matching` 條件為 2 hasItem（票根、黑色碎片）+ 4 hasFlag（四項檢視發現）。
- `hasCh1CoreClues`（推理按鈕）：`ticket_stub_collected` 且（`security_monitor_viewed` 或 `clue_manual_light_control` 或 `black_fragment_found` 或 `clue_clean_trash`），與「2 件背包 + 4 項檢視」設計一致。
- 開發者「一鍵全開（含報告用道具）」已改為：設定核心旗標 + 四項檢視發現旗標 + 標記三場景已拜訪 + 僅加入 `item_ticket_stub`、`item_black_plastic_fragment`，不再將 6 樣道具全部加入背包。

---

## 五、已修正項目（本次檢查）

| 項目 | 說明 |
|------|------|
| 開發者一鍵全開 | 原以 `ch1ReportEvidenceItemIds` 將 6 樣道具加入背包；已改為僅加入 2 件道具，並以 `CH1_ITEM_ID_TO_DISCOVER_FLAG` 設定四項檢視發現旗標，與遊戲內實際設計一致。 |

---

## 六、建議後續可檢視項目（非必改）

1. **Hotspot 座標**：規則要求座標為 0～1 比例；`gameDataCh1.ts` 中部分 coords 出現大於 1 的數值（例如 `[1.19, 1.62, 0.15, 0.15]`）。若專案使用之座標系統為其他比例（如 1.8），則可註解說明；否則建議改為 0～1 以符合規則。
2. **page.tsx 中的 ch1_sc2 / ch1_sc3 / ch1_sc4 / ch1_sc5**：play 頁內有多處 `scene?.id === 'ch1_sc2'` 等判斷；第一章實際場景 id 為 `scene_ch1_cinema_a_hall`、`scene_ch1_projection_room`、`scene_ch1_restroom`。這些分支對 ch1 目前不會成立，可能為他章或舊版殘留，可集中註解或移除以免混淆。
3. **ch1ReportEvidenceItemIds**：仍於 `flagTestConfig.ts` 匯出，供文件或測試參考；目前 play 頁已不再使用，無需為報告解鎖而改動。

---

## 七、總結

- 第一章目前玩法為：三場景探索 → 2 件道具進背包、4 項僅檢視並以 flag 記錄 → NPC 敏感對話與劉隊中段 → 向劉隊報告（證據卡解鎖 = 背包 OR 發現 flag）→ 態度宣言與後續流程。
- 程式面已與「第一章道具精簡」及「報告證據解鎖條件」一致；開發者一鍵全開已同步為只加 2 件道具並設定四項發現旗標。

若之後調整場景或事件，建議同步更新本文件「一、玩法總覽」與「二、關鍵檔案與職責」。
