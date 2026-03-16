# 第一章遊玩邏輯深層審查報告

**審查日期**：2026-03-12  
**審查範圍**：`data/gameDataCh1.ts`、`app/play/[chapterId]/[sceneId]/page.tsx`（ch1 相關段落）、`data/ch1ReportConfig.ts`、`data/reasoningByChapter.ts`（ch1）

---

## 第一章遊戲流程解讀與完全探索／推理破關方法

以下為「完全探索 + 完全推理」的破關路徑解讀，供測試與文件對照用。

### 一、整體流程概觀

```
序章／主選單 → 第一章 intro（章節介紹）→ 開始調查
    → 放映廳（起點）→ 播映室 ↔ 廁所（三場景自由切換，無閘門）
    → 收集 2 件背包道具 + 完成 4 項現場檢視（線索） + 4 位 NPC 敏感對話
    → 劉隊中段問候出現
    → 點劉隊選「我想向你報告」→ 報告編輯器（時間線／態度宣言）
    → 態度宣言(句子填空)選完 → 推理句 +「進入第二章」→ 第二章 intro
```

第一章**沒有**使用「向劉隊回報」的填空面板（ReasoningPanel）；破關核心是**報告編輯器**（Ch1ReportEditor）。

---

### 二、進入第一章與起點

- **入口**：從首頁或序章依流程進入 `ch1_intro`（章節介紹頁），點「開始調查」後進入 `ch1_explore`，第一個場景為 **放映廳**（`scene_ch1_cinema_a_hall`）。
- **劉隊開場簡報**：進入放映廳後，若尚未觸發過，會自動排隊播放劉隊的章節開場台詞（`ch1_police_intro_shown`），說明現場狀況與影城人員將到等。
- **場景切換**：左／右箭頭或場景列表可在「放映廳 ↔ 播映室 ↔ 廁所」之間自由切換，**目前無解鎖閘門**（`projection_room_unlocked`、`restroom_unlocked` 僅被寫入，未用來阻擋切換）。

---

### 三、完全探索：三場景互動與道具

#### 放映廳

| 互動 | 結果 |
|------|------|
| **死者座位**（hotspot_victim_seat） | KK 旁白；設 `observed_victim_seat`、`projection_room_unlocked`（僅記錄用）。 |
| **電影票根**（hotspot_ticket_stub） | 獲得道具 `item_ticket_stub`；設 `ticket_stub_collected`。 |
| 其他（爆米花、空杯、外套、銀幕、冷氣、散場告示、座位號、地毯、爆米花桶） | 僅旁白，無道具、無關鍵 flag。 |
| **NPC 林瑞堂** | 一般對話後可選「問敏感」→ 二選一：① 燈與流程 ② 他怕誰；跑完選內心旁白（procedure／human／evidence）→ `npc_lin_sensitive_done`。 |
| **NPC 阿順** | 同上，敏感二選一：① 散場空窗 ② 監視器死角 → `npc_ashun_sensitive_done`。 |
| **NPC 劉隊** | 需完成至少 3 位敏感對話且觸發過中段問候後才會出現頭像；見下方「向劉隊報告」段落。 |

#### 播映室

| 互動 | 結果 |
|------|------|
| **播映時間表**（hotspot_screening_schedule） | 檢視對話；設 `schedule_modified_found`。（*規劃：不進背包*） |
| **燈控面板**（hotspot_light_control_panel） | 檢視對話；設 `clue_manual_light_control`。（*規劃：不進背包*） |
| **放映員的筆記**（hotspot_projector_notes） | 檢視對話；設 `projector_notes_found`。（*規劃：不進背包*） |
| **監視器畫面**（hotspot_security_monitor） | 旁白；設 `security_monitor_viewed`、`clue_fast_exit`、`restroom_unlocked`。 |
| 其他（咖啡杯、零食、椅子輪子、貼紙、遙控器、雜誌、白板） | 僅旁白。 |
| **NPC 小張** | 敏感二選一：① 表格與權限 ② 口頭指示 → `npc_xiaozhang_sensitive_done`。 |

#### 廁所

| 互動 | 結果 |
|------|------|
| **洗手台下方**（hotspot_sink_below） | 獲得 `item_black_plastic_fragment`；設 `black_fragment_found`。 |
| **垃圾桶**（hotspot_trash_bin） | 檢視對話；設 `clue_clean_trash`。（*規劃：不進背包*） |
| **鏡子**（hotspot_mirror） | KK 旁白；設 `clue_killer_calm`。 |
| 其他（烘手機、洗手乳、擦手紙、標語、芳香劑、水龍頭、地板） | 僅旁白。 |
| **NPC 周姊** | 敏感二選一：① 哪裡太乾淨 ② 你找到什麼／燈晚亮；若已從洗手台取得碎片則走「已有碎片」分支 → `npc_zhou_jie_sensitive_done`。 |

**完全探索時**：**背包 2 件**（電影票根、黑色塑膠碎片）；**4 項現場檢視**（播映時間表、燈控、筆記、清潔備忘）僅設 flag、不進背包（見下方「第一章道具精簡建議」）。

---

### 四、敏感對話與劉隊出現條件

- **敏感對話**：每位 NPC 先進行一般（隨機）對話，達到條件後會出現「問敏感／再聊聊」選項；選「問敏感」後再從**兩個主題二選一**，問完該 NPC 即設為 `npc_*_sensitive_done`。每位 NPC 只會完成一次敏感對話。
- **劉隊中段問候**：當 **至少 3 位** NPC 敏感對話完成時，設 `ch1_liu_mid_ready = true`。若此時玩家在**放映廳**，會自動排隊播放劉隊中段問候台詞，並設 `ch1_liu_mid_shown = true`；若不在放映廳，則下次進入放映廳時不再自動播放（需依實作確認是否改為進入時補播）。此後**劉隊頭像**會在放映廳右側 NPC 條出現。
---

### 五、向劉隊報告與報告編輯器

- **「我想向你報告」出現條件**（`shouldAllowAction(ch1, 'show_liu_report_entry')`）：  
  - 至少 3 位 NPC 敏感對話完成（`ch1_liu_mid_ready`）  
  - 已觸發劉隊中段問候（`ch1_liu_mid_shown`）  
  - 本章尚未標記推理完成（`!ch1_reasoning_done`）  
  滿足時，點擊**劉隊**會出現「還想再繞繞」與「我想向你報告」；選「我想向你報告」即開啟報告編輯器。

- **報告編輯器（Ch1ReportEditor）四步驟**：  
  1. **證據**：從 6 張證據卡中選 **3 張**，且須涵蓋三類各至少一張（時間支點 TimeAnchor、流程／權限 ProcessAnchor、痕跡 PhysicalTrace）；選錯類別會提示缺哪一類。  
  2. **時間線**：將 5 張事件卡排成**正確順序**（開演 → 原訂亮燈 → 實際亮燈 → 監視器陰影 → 報案）；另有犯罪時間區間可選（若實作有撥鈕）。  
  3. **版本**：從 4 句補充句中選一句寫入報告，或選「先不用，就照你寫的版本」。  
  4. **態度宣言**：依設定為**詞組填空**（phrasePuzzle，六句分次呈現）或**拖曳 4 張態度卡**到「警用報告封套／KK 私人備忘錄」；完成後出現**四選一**態度（體制要查到底／先畫動線／誰在幫兇手擦地板／兩邊都留），選完會寫入洞察並設 `ch1_attitude_declared`。

- **破關**：態度宣言四選一後，畫面顯示一句**推理句**（依當前洞察最高維度擇一），並出現「進入第二章」按鈕。點擊後設 `navigate_to_ch2_intro`，由路由導向第二章 intro 頁，第一章結束。

---

### 六、完全推理破關檢查清單（模擬用）

| 步驟 | 內容 | 備註 |
|------|------|------|
| 1 | 進入 ch1 intro，點「開始調查」 | 進入放映廳 |
| 2 | 放映廳：點死者座位、點電影票根 | 取得票根，觸發觀察 |
| 3 | 放映廳：與林瑞堂、阿順各完成一次敏感對話（二選一） | 2/4 敏感完成 |
| 4 | 播映室：點時間表、燈控、筆記、監視器；與小張完成敏感對話 | 3/4 敏感 + 4 項檢視（flag） |
| 5 | 廁所：點洗手台下、垃圾桶、鏡子；與周姊完成敏感對話 | 4/4 敏感 + 2 背包道具 + 4 項檢視 |
| 6 | 回到放映廳：觸發或確認劉隊中段問候，點劉隊出現「我想向你報告」 | 若尚未觸發中段，需先進放映廳一次 |
| 7 | 點劉隊 →「我想向你報告」→ 打開報告編輯器 |  |
| 8 | 證據：選 3 張且涵蓋時間／流程／痕跡三類 | 2 張來自背包，4 張由檢視 flag 解鎖（見道具精簡建議） |
| 9 | 時間線：5 張卡排成正確順序 | T1→T2→T3→T4→T5 |
| 10 | 版本：選一句補充或「先不用」 |  |
| 11 | 態度宣言：完成詞組填空或拖曳後，四選一態度 |  |
| 12 | 點「進入第二章」 | 導向 ch2 intro，第一章破關 |

以上為第一章在「完全探索 + 完全推理」前提下的遊戲流程與破關方法；實際程式邏輯以 `flowController`、`gameDataCh1`、`ch1ReportConfig` 及 play 頁 ch1 分支為準。

---

## 第一章道具精簡建議：背包僅保留兩件實質道具

以下為「第一章實質道具過多，希望僅有兩件放入背包」的綜合修正建議，待確認後一併修改程式與資料。

### 一、設計目標與整體考量

- **目標**：第一章結束時，玩家背包裡**只有 2 件**可收集道具；其餘線索改為「現場檢視／發現」，仍可觸發敘事與 flag，但**不**加入背包。
- **整體遊戲**：第一章建立「規定的黑暗」與「流程被人利用」；後續章節再疊加錄音、整理版、三分鐘黑暗等。第一章不宜一次塞滿 6 件實體證物，保留 2 件可強化「關鍵證物」的記憶點，其餘改為「KK 在現場看到的東西」即可。
- **報告編輯器**：目前證據步驟是「從背包 6 選 3、且涵蓋三類」。改為 2 件背包後，證據卡來源改為「本章已發現的線索」（依 flag 解鎖），報告時仍可從多張卡中選 3 張涵蓋三類，但卡片解鎖條件改為「有對應發現 flag」而非「背包擁有該 item」。

### 二、建議保留為「背包道具」的兩件

| 道具 | 理由 |
|------|------|
| **電影票根**（item_ticket_stub） | 死者遺留、可觸摸、象徵「這個人在這裡」；確立場次與座位，全章起點物證，敘事與後續章節都可能沿用。 |
| **黑色塑膠碎片**（item_black_plastic_fragment） | 唯一實體殘留物（疑似手套）、周姊線核心、暗示兇手曾處理痕跡；具象、好辨識，且與「急著乾淨的人」推理直接掛鉤。 |

兩件分別代表：**時間／身分支點**（票根）與**痕跡支點**（碎片），一在放映廳、一在廁所，探索動線自然。

### 三、改為「僅檢視、不進背包」的四項

以下四項改為：點擊 hotspot 時**仍觸發對話／旁白並設置 flag**，**不再** `addItem`，不進入背包。

| 現有道具 | 對應 hotspot／事件 | 建議保留的 flag（用於報告解鎖） | 說明 |
|----------|--------------------|----------------------------------|------|
| 播映時間表（塗改） | 播映室・播映時間表 | `schedule_modified_found` | 仍顯示「獲得：播映時間表…」風格對話，但改為僅 setFlag，不 addItem。報告編輯器改為「有此 flag 即解鎖該證據卡」。 |
| 燈控紀錄 | 播映室・燈控面板 | `clue_manual_light_control` | 同上，檢視即視為「發現」，不進背包。 |
| 放映員的筆記 | 播映室・放映員的筆記 | `projector_notes_found` | 同上。 |
| 清潔備忘 | 廁所・垃圾桶 | `clue_clean_trash` | 同上。 |

敘事上可維持「KK 看到了、記住了」，只是不當成可反覆從背包拿出的「實體道具」。

### 四、報告編輯器證據步驟的調整

- **現狀**：證據卡可否被選取，依 `inventory.includes(itemId)` 判斷（Ch1ReportEditor 內 `hasItem`）。
- **建議**：改為「可選取條件」= **背包擁有該 item** 或 **該線索已發現（對應 flag 為 true）**。
  - 2 件背包道具：`item_ticket_stub`、`item_black_plastic_fragment` → 仍以 `inventory` 判斷。
  - 4 件僅檢視線索：建立 `itemId → flag` 對照，例如  
    `item_schedule_modified` → `schedule_modified_found`，  
    `item_light_control_note` → `clue_manual_light_control`，  
    `item_projector_notes` → `projector_notes_found`，  
    `item_cleaning_note` → `clue_clean_trash`。  
  報告編輯器內「可選證據卡」改為：`hasItem(itemId) || flags[config.flagForItem(itemId)]`（或同等邏輯），如此仍可「6 張卡選 3 張、涵蓋三類」，只是解鎖來源從「全在背包」改為「2 在背包、4 由發現 flag 解鎖」。

### 五、資料與程式修改清單（待一併實作）

| 項目 | 檔案／位置 | 內容 |
|------|------------|------|
| 1 | `data/gameDataCh1.ts` | `item_schedule_modified`、`item_light_control_note`、`item_projector_notes`、`item_cleaning_note` 四筆：改為 `collectible: false`，或從各場景 `items` 陣列移除；對應事件改為僅 `showDialog` + `setFlag`，**移除** `addItem` 效果。 |
| 2 | `data/gameDataCh1.ts` | 各場景 `items` 陣列：只保留 `item_ticket_stub`（放映廳）、`item_black_plastic_fragment`（廁所）；播映室不再列出上述 3 件為可收集 item。 |
| 3 | `data/ch1ReportConfig.ts` | 維持 6 張 evidenceCards 與三類不變；新增或註明「線索解鎖方式」：哪 2 個依 inventory、哪 4 個依 flag（見上表）。 |
| 4 | `components/Ch1ReportEditor.tsx` | 證據步驟：可選取邏輯改為 `hasItem(itemId) || state.flags[itemIdToFlag(itemId)]`；實作 `itemIdToFlag` 對照（或從 ch1ReportConfig 讀入）。 |
| 5 | 其他引用 | 若有 `hasItem('item_schedule_modified')` 等條件（如謎題、hasCh1CoreClues），改為對應的 flag 檢查（如 `schedule_modified_found`）。 |
| 6 | `docs/CH1_AUDIT_REPORT.md` | 流程與檢查清單：將「6 件道具」改為「2 件背包道具 + 4 項現場發現」；完全探索說明改為「取得 2 件道具，並在播映室／廁所完成 4 項檢視（設 flag）」。 |

### 六、小結

- **背包僅 2 件**：電影票根、黑色塑膠碎片。  
- **其餘 4 項**：播映時間表（塗改）、燈控紀錄、放映員的筆記、清潔備忘改為「檢視即發現」、不進背包，報告時仍以 flag 解鎖對應證據卡。  
- **報告編輯器**：證據選 3 張、涵蓋三類的玩法不變，改為「解鎖條件 = 背包 OR 發現 flag」。  

確認此方向後，可依上表一併修改 `gameDataCh1`、`ch1ReportConfig`、`Ch1ReportEditor` 及相關 flag 引用。

---

## Hotspot 座標系統說明

### 為何互動框是圓形，卻用「兩角」定義？

目前畫面上的互動框是**圓形**（`borderRadius: '50%'`），但資料層的 `coords` 卻是**四個數、當成矩形的兩個對角點**來存，再在程式裡算出「中心」與「大小」：

- **中心**：`(coords[0]+coords[2])/2`, `(coords[1]+coords[3])/2`
- **圓的大小**：由 `(coords[2]+coords[3])/2` 再乘係數決定直徑

也就是說：**語意是「矩形兩角」，實際畫的是「圓」**。這樣做的歷史原因多半是：沿用「矩形熱區」的通用格式，或從舊版編輯器匯入。但對「圓形互動框」而言並不直觀，編輯時要心算兩角才能對準圓心，也難以一眼看出半徑。

---

### 現行慣例（第一、二章沿用，可保留）

**rect 型、四數值：`coords = [x1, y1, x2, y2]`（兩角）**

- 中心 x = (第一位 + 第三位) ÷ 2  
- 中心 y = (第二位 + 第四位) ÷ 2  
- 單一數值可 &gt; 1，只要中心落在 0～1 內即可。

**程式依據**：`page.tsx` 的 `getHotspotCenter()`、`SceneView.tsx` 的 `getHotspotStyle()`。  
第一章／第二章現有資料依此設定，**實測已對齊，無需改動**。

---

### 建議新方法：圓心 + 半徑（直接對應圓形互動框）

改為**以圓為本**的定義，方便之後新場景或新章節直接寫「圓心在哪、多大」，不必再換算兩角。

#### 新格式定義

| 項目 | 說明 |
|------|------|
| **語意** | 一個圓：圓心位置 + 半徑（比例） |
| **coords 長度** | **3** 個數值 |
| **coords[0]** | 圓心 x（0～1，左＝0、右＝1） |
| **coords[1]** | 圓心 y（0～1，上＝0、下＝1） |
| **coords[2]** | 半徑 r（0～1，表示「半徑佔容器短邊的比例」） |

**範例**：`coords: [0.25, 0.6, 0.08]`  
→ 圓心在畫面 (25%, 60%)，半徑為容器短邊的 8%。

#### 與現行四數的對應關係（供轉換用）

若舊資料為 `[x1, y1, x2, y2]`，可換算成新格式：

- **圓心**：`cx = (x1 + x2) / 2`，`cy = (y1 + y2) / 2`
- **半徑（比例）**：可取「兩角在 x、y 方向的跨度」較大者再乘係數，例如  
  `r = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)) / 2`  
  再依實際畫面上的圓大小微調（目前 SceneView 的直徑約 `clamp(40px, 4vw, 44px) * sizeFactor`，可對應成一個合理的 r 經驗值，例如 0.06～0.12）。

#### 程式如何同時支援兩種格式

- **若 `coords.length === 3`**：視為新格式 `[cx, cy, r]`  
  - 中心 = (coords[0], coords[1])  
  - 半徑／直徑 = coords[2]（再乘容器短邊或固定係數）
- **若 `coords.length >= 4`**：維持現行解讀 `[x1, y1, x2, y2]`  
  - 中心 = ((coords[0]+coords[2])/2, (coords[1]+coords[3])/2)  
  - 大小邏輯不變

這樣**既有第一、二章資料不必改**，新場景可一律用三數 `[cx, cy, r]` 撰寫，語意與圓形互動框一致。

#### 建議修改的檔案（實作新方法時）

1. **`types/game.ts`**  
   - 在 `Hotspot` 或註解中註明：`coords` 可為 3 數（圓心+半徑）或 4 數（矩形兩角），依 `coords.length` 解讀。
2. **`components/SceneView.tsx`**  
   - 在 `getHotspotStyle()` 內：若 `hotspot.coords.length === 3`，用 `[cx, cy, r]` 算圓心與直徑；否則沿用現有 (x, y, width, height) 邏輯。
3. **`app/play/[chapterId]/[sceneId]/page.tsx`**  
   - 在 `getHotspotCenter()` 內：若 `coords.length === 3`，回傳 `(coords[0], coords[1])`；否則沿用現有兩角平均。

#### 小結

| 項目 | 現行（四數兩角） | 新方法（三數圓心+半徑） |
|------|------------------|--------------------------|
| 語意 | 矩形兩角 → 程式算圓心 | 直接：圓心 + 半徑 |
| 直觀度 | 需心算中心與大小 | 對齊圓形互動框，一眼可讀 |
| 適用 | 第一、二章既有資料 | 新場景、新章節建議使用 |
| 相容 | — | 以 `coords.length` 分支，舊資料無需遷移 |

---

## 一、場景架構總覽

| 場景 ID | 場景名 | NPC | 道具數 | 互動點數 |
|---|---|---|---|---|
| `scene_ch1_cinema_a_hall` | 放映廳 | 林瑞堂、劉隊（延遲出現）、阿順 | 1（電影票根） | 11 |
| `scene_ch1_projection_room` | 播映室 | 小張 | 3（時間表、筆記、燈控） | 11 |
| `scene_ch1_restroom` | 廁所 | 周姊 | 2（碎片、清潔備忘） | 10 |
| ~~`scene_ch1_park`~~ | ~~公園~~（已被注解） | ~~阿蘇~~ | ~~未完成~~ | ~~8~~ |

---

## 二、關鍵問題清單

### 🔴 P0 嚴重錯誤（直接阻斷遊玩）

---

#### 問題 1：`clue_light_delay_confirmed` Flag 從未被設置

**位置**：`gameDataCh1.ts` → `puzzle_ch1_how_murder_happened` 需求條件  
**描述**：  
`puzzle_ch1_how_murder_happened` 謎題要求三個條件：
```
hasItem: item_schedule_modified
hasFlag: clue_light_delay_confirmed = true   ← 這個 flag 沒有任何事件可以設置
hasFlag: security_monitor_viewed = true
```
全章搜查所有事件的 `effects`，沒有任何地方設置 `clue_light_delay_confirmed`。  
**結果**：這個謎題永遠無法觸發，相當於死碼。

**建議修正方案**：  
- **方案 A（推薦）**：刪除此謎題要求，改為只需 `hasItem: item_schedule_modified` + `security_monitor_viewed`  
- **方案 B**：在 `examine_light_control` 事件的 effects 裡加上 `setFlag: clue_light_delay_confirmed = true`  
- **方案 C**：直接將整個 `puzzle_ch1_how_murder_happened` 謎題移除（如果目前的流程已改用報告編輯器取代）

---

#### 問題 2：`puzzle_ch1_how_murder_happened` 無觸發機制

**位置**：`gameDataCh1.ts` → `scene_ch1_cinema_a_hall.puzzles[0]`  
**描述**：  
此謎題雖然定義在場景的 `puzzles` 陣列中，但：
- 沒有任何 hotspot 的事件路由到這個謎題
- 沒有任何 `triggerEvent` 效果指向它
- 玩家完全無法觸發這個謎題

**結果**：死碼，永遠不可見。

**建議**：評估此謎題是否仍有意義。若已被報告編輯器（Ch1ReportEditor）取代，請直接移除以保持資料整潔。

---

### 🟠 P1 邏輯斷層（流程可完成但體驗破損）

---

#### 問題 3：場景導航未設置解鎖閘門

**位置**：`app/play/[chapterId]/[sceneId]/page.tsx` → `handleSceneNavigation`  
**描述**：  
事件中有以下 flag 設置：
- `observe_victim_seat` → `projection_room_unlocked = true`
- `view_security_monitor` → `restroom_unlocked = true`

但 `handleSceneNavigation` 函數中，ch1 沒有任何對應的閘門檢查（不像 ch2 和 ch6 有明確的 gating 邏輯）。

**結果**：玩家可以無視 flag，直接在三個場景間自由切換，使「解鎖」設計失效。

**建議**：  
- **方案 A（維持現狀）**：直接刪除這兩個 `setFlag` 效果（避免混淆），接受玩家可自由探索  
- **方案 B（加閘門）**：在 `handleSceneNavigation` 中為 ch1 添加類似 ch2 的邏輯，要求必須先看死者座位才能進入播映室，先查看監視器才能進入廁所

---

#### 問題 4：`ch1_reasoning_1/2/3` 三道排列謎題孤立無觸發

**位置**：`gameDataCh1.ts` → `scene_ch1_cinema_a_hall.puzzles[2~4]`  
**描述**：  
有三道 `arrangement` 類型的推理謎題（把打亂字詞排成句子），但：
- `requirements` 全部為空 `[]`
- 沒有任何事件或 hotspot 觸發這些謎題
- 沒有任何 UI 元素連結到它們

**結果**：這三道謎題完全孤立，無法在正常遊玩中出現。

**建議**：確認這是否是未完成的設計。若要保留，需定義明確的觸發機制（例如在劉隊對話後顯示）。若已被報告編輯器的 phrasePuzzle 取代，則應刪除。

---

#### 問題 5：`ch1_pair_matching` 謎題孤立無觸發

**位置**：`gameDataCh1.ts` → `scene_ch1_cinema_a_hall.puzzles[1]`  
**描述**：  
`pick_three` 類型謎題，需要玩家集齊所有 6 件道具後完成三組配對。  
但同樣地：
- 沒有 hotspot 事件觸發
- 沒有 UI 入口
- 沒有明確的觸發時機說明

**建議**：若此謎題是報告流程的一部分，需確定它在何時、由什麼觸發。

---

### 🟡 P2 文案不一致與內容問題

---

#### 問題 6：`observe_victim_seat` 事件的 requirement 冗餘

**位置**：`gameDataCh1.ts` → `scene_ch1_cinema_a_hall.events[0]`  
**描述**：  
```javascript
requirements: [
  { type: 'hasInteracted', hotspotId: 'hotspot_victim_seat' },
  { type: 'custom', customCheck: (state) => !state.flags.observed_victim_seat },
]
```
這個事件已設置 `oneTime: true`，第二個 requirement 的自訂檢查（`!state.flags.observed_victim_seat`）是冗餘的，因為 `oneTime` 機制已確保事件只觸發一次。

**建議**：移除 custom requirement，保留 `oneTime: true` 即可。

---

#### 問題 7：道具取得文案格式不一致

**位置**：多個事件的 `showDialog` 效果  
**描述**：  
目前道具取得的 dialog text 格式為「獲得：XXX\n\n[描述]」，這會被送入一般對話框（`type: 'item'`）。  
但根據現行規則（規則文件 9.2），道具收集應使用**浮動提示**（`ItemObtainedNotification`）而非排入一般對話佇列。  
目前的實作是：
- 事件效果先 `addItem`，再 `showDialog`（type: item）
- 但 `addItem` 效果本身應已觸發 ItemObtainedNotification

**結果**：玩家可能看到兩次道具取得提示（浮動提示 + 一般對話框），或是只看到其中一種。

**建議**：  
- 若系統已由 `ItemObtainedNotification` 處理取得提示，則刪除事件中的 `showDialog`（type: item）效果  
- 若系統需要保留描述性對話，確認兩者之間的優先順序

---

#### 問題 8：`ch1ReportConfig` 時間線的電影場次時間矛盾

**位置**：`data/ch1ReportConfig.ts` → `timeline.events`  
**描述**：  
時間線卡片第一張：`T1_movie_start_2240`（22:40 電影開演）  
但 `item_ticket_stub` 的描述寫：「場次時間：22:30」

**結果**：場次開演時間不一致（票根說 22:30，時間線說 22:40）。

**建議**：統一為同一個時間。票根作為第一手物件，建議以票根為準（22:30），修正時間線卡片。

---

#### 問題 9：`item_light_control_note` 使用錯誤的 SVG

**位置**：`gameDataCh1.ts` → `items.item_light_control_note`  
**描述**：  
```javascript
item_light_control_note: {
  svgImage: '/svg/items/schedule_modified.svg',  ← 使用的是時間表的 SVG
}
```
燈控紀錄使用的是「塗改時間表」的 SVG 圖。

**建議**：  
- 製作專屬的 `light_control_note.svg`，或  
- 改用其他合適的佔位 SVG（如 `projector_notes.svg`）

---

#### 問題 10：`item_cleaning_note` 使用錯誤的 SVG

**位置**：`gameDataCh1.ts` → `items.item_cleaning_note`  
**描述**：  
```javascript
item_cleaning_note: {
  svgImage: '/svg/items/black_plastic_fragment.svg',  ← 使用的是塑膠碎片的 SVG
}
```
清潔備忘用的是「黑色塑膠碎片」的 SVG 圖。

**建議**：製作專屬的 `cleaning_note.svg`，或改用 `schedule_modified.svg` 作為臨時備案。

---

### 🔵 P3 設計缺口與未完成功能

---

#### 問題 11：第四場景（公園）被完整注解，含 阿蘇首次登場

**位置**：`gameDataCh1.ts` 末尾的大段注解（行 811 ～ 976）  
**描述**：  
有一個完整設計但被注解掉的「公園場景」，包含：
- 8 個 hotspot（長椅、傳單、紙杯「烏」字、影城招牌、手機通知、販賣機、流浪貓、告示牌）
- 阿蘇（警方技術組）作為場景 NPC
- 手機訊息解密情節（`victim_phone_decrypt_ready` flag）
- 從死者手機出發進入案件的完整敘事 InitialDialog

**敘事意義**：這個場景描述了 KK 在現場調查之前，先到公園接到阿蘇的通知，理解受害者背景（「三起事故」脈絡）。

**目前狀態**：完全棄用，阿蘇在第二章才首次出現。第一章缺少阿蘇登場的鋪墊。

**建議**：  
- **方案 A**：正式移除此場景（保持三場景結構）  
- **方案 B**：重新啟用此場景作為第一章的前言場景  
- **方案 C**：將公園場景的核心敘事（手機解密、阿蘇登場）移至序章或第二章開頭

---

#### 問題 12：`showReasoningButton` 明確排除 ch1，使 `reportFills` 永不觸發

**位置**：`page.tsx` 第 3307～3314 行  
**描述**：  
```javascript
const showReasoningButton =
  hasReasoningForChapter &&
  chapterId !== 'ch1' &&   ← 明確排除第一章
  chapterId !== 'ch2' &&
  ...
```
第一章有自己的回報流程（報告編輯器 `Ch1ReportEditor`）。但我們剛剛為 reasoningByChapter.ch1 新增了 `reportFills`，這些填空將永遠不會被執行（因為 ch1 不顯示「向劉隊回報」按鈕）。

**建議**：  
- 確認 ch1 的填空題（`reportFillsCh1`）是否要整合進報告編輯器流程，而非 ReasoningPanel  
- 若報告編輯器是 ch1 的主要回報機制，則 ch1 的 `reportFills` 可能需要以不同方式嵌入

---

#### 問題 13：`npc_liu` 在放映廳的出現條件與初始對話衝突

**位置**：`gameDataCh1.ts` → `scene_ch1_cinema_a_hall.npcs[1]`  
**描述**：  
劉隊在放映廳的 NPC 設定：
```javascript
{
  id: 'npc_liu',
  availabilityRequirement: {
    type: 'hasFlag',
    flag: 'ch1_liu_mid_shown',
    value: true,
  },
}
```
劉隊須等到完成 3 位 NPC 敏感對話後才會在場景中可見（`ch1_liu_mid_shown = true`）。

但初始 dialog（進入場景後）描述：「影城那邊負責品牌、設備與排程的人已在路上，很快就到。」這並未說明劉隊也在場。

**問題**：章節開場的劉隊簡報（`ch1_police_intro_shown` 觸發的 dialog）使玩家知道劉隊在場，但又看不到他的頭像，直到觸發條件滿足。

**建議**：
- 調整初始 dialog，提示劉隊在場但正在忙其他事，稍後再找他回報
- 或降低劉隊出現的門檻（例如：只要完成 1 位 NPC 敏感對話即可）

---

#### 問題 14：`npc_liu` randomDialogs 只有一條「提示」文案

**位置**：`gameDataCh1.ts` → `scene_ch1_cinema_a_hall.npcs[1].randomDialogs`  
**描述**：  
```javascript
randomDialogs: [
  { id: 'ch1_briefing', text: '「現場我們會先封著...」', type: 'hint', weight: 1 }
]
```
劉隊只有一條隨機對話。玩家反覆點擊劉隊時只會看到同一句話。

**建議**：新增 2~3 條隨機對話，例如：
- 「「還有沒有看漏什麼？你慢慢來，不急。」」
- 「「那幾個人的說法，你覺得有哪裡對不上？」」
- 「「現場的東西你先全部過一遍。」」

---

#### 問題 15：`npc_ashun` 定義在放映廳，卻是廁所場景的邏輯相關 NPC

**位置**：`gameDataCh1.ts` → `scene_ch1_cinema_a_hall.npcs[2]`  
**描述**：  
阿順（巡場保全）在遊戲設定中會去廁所附近巡場，洗手台碎片也跟他的工作動線有關。但他被定義在放映廳（`scene_ch1_cinema_a_hall`）的 NPCs 陣列裡。

**敘事上**：玩家需要進入廁所才能找到碎片，但需要回到放映廳才能跟阿順對話。這個邏輯並不自然。

**建議**：  
- 可接受（放映廳是集中詢問的場所）；但若要改善，可考慮在廁所也放置阿順的 NPC（或在廁所加一個他的旁白提示）

---

### 🔵 P3 文案微調建議（可手工調整）

---

#### 問題 16：`hotspot_victim_seat` 文案與 `observe_victim_seat` 事件文案重複

**位置**：  
- Hotspot hint：「H 排 12 號。散場後唯一沒有站起來的那個位子。」  
- Event dialog text：「H 排 12 號。散場後唯一沒有站起來的那個位子。椅背微微後傾⋯⋯」

**問題**：玩家先看到 hint（懸停提示），再觸發事件，看到幾乎相同的開頭，體驗重複。

**建議**：修改 hotspot hint 為更簡短的描述，例如：「死者的座位。」或「H12 號。」

---

#### 問題 17：廁所 `initialDialog` 與描述（description）幾乎相同

**位置**：`gameDataCh1.ts` → `scene_ch1_restroom`  
**描述**：  
```
scene.description：「廁所裡很乾淨，幾乎是空的。但在這片乾淨中，你感覺到一種說不上來的異樣。」
initialDialog.text：「廁所裡很乾淨，幾乎是空的。\n\n但在這片乾淨中，你感覺到一種說不上來的異樣。」
```
兩段文字幾乎完全相同，場景描述作為抬頭、initialDialog 又作為開場白，玩家看兩次幾乎一樣的字。

**建議**：修改 `initialDialog` 加入更多具體細節，例如：
「廁所燈光比放映廳亮很多。周姊在角落整理清潔車，低著頭，沒有抬眼看你。」

---

#### 問題 18：播映室 `initialDialog` 提到「負責設備與排程的人稍後會到場」，但 NPC 小張已在場

**位置**：`gameDataCh1.ts` → `scene_ch1_projection_room.initialDialog`  
**描述**：  
「負責設備與排程的人稍後也會到場。」  
但 `npcs` 陣列裡的 `npc_xiaozhang`（小張）是 `available: true`，進場就能立刻對話。

**建議**：修改 initialDialog：「小張（放映員）在控制台邊整理設備，眼神往下，沒看你。」

---

#### 問題 19：阿順的隨機對話與敏感對話主題不夠連貫

**位置**：`gameDataCh1.ts` → `scene_ch1_cinema_a_hall.npcs[2].randomDialogs`  
**描述**：  
阿順的 casual 隨機對話以「散場很亂」、「監視器很多」為主，這些都是有用的暗示。  
但敏感對話主題是「90 秒空窗」和「監視器死角」——這兩個主題在 casual 對話中沒有明確的前置鋪墊，會讓玩家在選擇敏感問題時缺少動機。

**建議**：在 casual 對話中加入一條像這樣的：
「那一兩分鐘……你說的那段，我其實也說不清楚誰在看、誰沒在看。」  
這樣玩家自然會想問更深的問題。

---

## 三、完整流程圖（現況）

```
進入第一章 →
  [劉隊開場簡報] → 放映廳
  
放映廳：
  - 互動：死者座位 → 設置 projection_room_unlocked（但無閘門）
  - 互動：電影票根 → 獲得票根
  - NPC：林瑞堂（casual → 敏感問題選一）
  - NPC：阿順（casual → 敏感問題選一）
  - NPC：劉隊（ch1_liu_mid_shown 後才出現）

↕ 自由切換（無閘門）

播映室：
  - 互動：時間表 → 獲得塗改時間表
  - 互動：燈控面板 → 獲得燈控紀錄
  - 互動：放映員筆記 → 獲得筆記
  - 互動：監視器 → 設置 security_monitor_viewed + restroom_unlocked（但無閘門）
  - NPC：小張（casual → 敏感問題選一）

↕ 自由切換（無閘門）

廁所：
  - 互動：洗手台下 → 獲得黑色塑膠碎片
  - 互動：垃圾桶 → 獲得清潔備忘
  - 互動：鏡子 → KK 旁白
  - NPC：周姊（casual → 敏感問題選一）

完成 3 位 NPC 敏感對話：
  → ch1_liu_mid_ready = true
  → 劉隊出現在放映廳

完成 4 位 NPC 敏感對話：
  → 點擊劉隊 → 選擇「我想向你報告」
  → 報告編輯器（Ch1ReportEditor）啟動

報告流程：
  1. 選 3 件道具（需覆蓋三個類別）
  2. 時間線排序（5 張卡）
  3. 版本深度（選補充句）
  4. 態度宣言詞組填空（6 句）

完成報告 → 進入第二章
```

---

## 四、修正優先順序建議

| 優先 | 問題編號 | 工作內容 |
|---|---|---|
| P0 即刻修正 | 問題 1 | 補充 `clue_light_delay_confirmed` 的設置點，或刪除謎題需求 |
| P0 即刻修正 | 問題 2 | 評估並移除死碼謎題 `puzzle_ch1_how_murder_happened` |
| P1 近期修正 | 問題 3 | 決定是否要為 ch1 場景切換加入閘門邏輯 |
| P1 近期修正 | 問題 4/5 | 移除孤立謎題，或設計觸發機制 |
| P2 品質改善 | 問題 6 | 移除冗餘 requirement |
| P2 品質改善 | 問題 7 | 確認道具取得對話的正確呈現方式 |
| P2 品質改善 | 問題 8 | 統一票根場次時間（22:30 vs 22:40） |
| P2 品質改善 | 問題 9/10 | 修正道具的 SVG 圖對應 |
| P3 長期優化 | 問題 11 | 決定公園場景的命運 |
| P3 長期優化 | 問題 12 | 確認 ch1 reportFills 的整合方式 |
| P3 長期優化 | 問題 13～19 | 文案、NPC 設計細節微調 |

---

## 五、可立即手工修正的文案清單

以下文案問題可直接在 `gameDataCh1.ts` 裡手工修正：

### 5.1 時間統一（22:30 vs 22:40）
- `item_ticket_stub.description`：「場次時間：22:30」  
- `ch1ReportConfig.timeline.events[0].label`：改為「22:30 電影開演」

### 5.2 死者座位 Hotspot hint 縮短
```
// 現在
hint: 'H 排 12 號。散場後唯一沒有站起來的那個位子。'
// 建議改為
hint: 'H12 號座位。'
```

### 5.3 廁所 initialDialog 豐富化
```
// 現在
text: '廁所裡很乾淨，幾乎是空的。\n\n但在這片乾淨中，你感覺到一種說不上來的異樣。'
// 建議改為
text: '廁所的燈比放映廳亮很多，幾乎是空的。\n\n周姊低著頭整理清潔車，沒有抬眼看你。\n在這片乾淨中，有什麼說不上來的異樣。'
```

### 5.4 播映室 initialDialog 修正
```
// 現在
text: '播映室裡，控制台和設備都在正常運作。\n\n但在這片正常中，有什麼被改動過。負責設備與排程的人稍後也會到場。'
// 建議改為
text: '播映室裡，設備都在正常運轉。\n\n小張（放映員）站在控制台邊，低著眼，等你開口。\n在這片正常中，有什麼被改動過。'
```

### 5.5 劉隊 randomDialogs 補充（放映廳）
建議在 `npc_liu.randomDialogs` 中補充：
```javascript
{ id: 'casual_2', text: '「還有沒有看漏什麼？你慢慢來，不急。」', type: 'casual', weight: 1 },
{ id: 'casual_3', text: '「那幾個人的說法，你覺得有哪裡對不上？」', type: 'casual', weight: 1 },
```

### 5.6 阿順 randomDialogs 補充（加入空窗暗示）
建議在 `npc_ashun.randomDialogs` 中補充：
```javascript
{ id: 'casual_9', text: '「那一兩分鐘⋯⋯說真的，我也說不清楚誰在看、誰沒在看。散場就是這樣，大家都在動。」', type: 'casual', weight: 2 },
```

---

*本報告為手工調整用參考文件，確認修改方向後再進行程式碼修正。*
