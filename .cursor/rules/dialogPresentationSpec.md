# 對話框一致化規格（思考稿）

> **定位**：以**第一章、第二章**的體驗與資料結構為**主要模板**，整理一套可複製到全章的**分類、計數、呈現（Dock／Zoom）**規則。  
> **用途**：後續改版時對照；**不**等同現有程式已 100% 實作，文中會標註「現況」與「建議對齊」。

---

## 一、三層架構（先分清楚再談 UI）

| 層級 | 說明 | 典型來源 |
|------|------|----------|
| **資料** | `gameDataChX.ts` 的 `events.effects.showDialog`、`Scene.initialDialog`、`Npc.randomDialogs`、`Hotspot.hint` | 章節檔 |
| **引擎／狀態** | `GameEngine` 觸發事件、旗標、`npcCasualTalkCount` | `lib/gameEngine.ts` |
| **呈現** | `DialogBox`（Dock 或 Zoom 覆蓋層）、章尾 overlay、謎題面板 | `page.tsx`、`HotspotZoomOverlay.tsx` |

改版時優先保證：**資料語意 → 引擎副作用 → 畫面**，單向一致，避免在 `page.tsx` 再堆章節 if-else。

---

## 二、`Dialog.type`（主遊玩／一般對話佇列）

對應 `types/game.ts` 的 `Dialog`。**第一章、第二章**裡最常出現的是 **`narrator`、`character`、`item`**；`system`、`choice`、`broadcast` 依章節擴充。

### 2.1 建議定義（模板）

| `type` | 語意 | 抬頭／視覺預期 | Ch1／Ch2 典型用途 |
|--------|------|----------------|-------------------|
| **`narrator`** | KK／第三人稱旁白、場景敘述、無配音色的說明 | 抬頭顯示「旁白」或留給副標 `title` | 場景 `initialDialog`、熱點檢視敘事、無意義互動 `fun_*` |
| **`character`** | 具名角色說話（含劉隊、NPC 樹、頭像隨機句） | 抬頭顯示**角色顯示名**（`characterName`） | `showDialog` 帶立繪欄位、`triggerRandomNpcDialog` 產生的框 |
| **`item`** | 與背包道具綁定的說明／取得提示 | 抬頭「道具」+ 可選 SVG | 撿取票根、碎片等 |
| **`system`** | 規則提示、錯誤、教學、**不屬於世界內敘事**的 meta 訊息 | 抬頭「系統」 | 建議：**少用旁白冒充**；與劇情混用時需格外一致 |
| **`choice`** | 需選項分支的純 UI 步驟 | 抬頭「選擇」 | 少數內嵌在 `Dialog` 的選擇 |
| **`broadcast`** | 警廣、全場通知感 | 抬頭「廣播」+ 可選紅點動效 | 依章節 |

### 2.2 與「線索」的關係

- **線索（clue）不是單獨的 `Dialog.type`**。  
- **呈現上**：線索＝**旁白或角色台詞內容** + 可能設旗標／進背包。  
- **模板約定**：  
  - **物件敘事**（「你注意到…」）→ 優先 **`narrator`**。  
  - **某人講出來的線索** → **`character`** + `characterId`／`characterName`。

---

## 三、NPC 頭像：`randomDialogs` 與「閒聊／提示」

### 3.1 資料欄位（`RandomDialog`）

| 欄位 | 用途（模板） |
|------|----------------|
| `type: 'casual'` | 氛圍、人設、**不推進主線**的碎念 |
| `type: 'hint'` | 仍用頭像框播放，但語意上**偏向導向／可當提示**（與 casual 區隔供權重或 UI 使用） |

### 3.2 第一章模板（敏感線門檻）

- `sensitiveGatesByChapter.ch1`：林瑞堂、阿順、小張、周姊各有 **`casualTalkThreshold: 3`**（與 `observed_*` 等並用）。  
- **語意**：玩家先與該 NPC **閒聊足夠次數**，再出現「要不要往深問」的門檻。  
- **劉隊**：**不**走同一套 `randomDialogs` 閒聊計數門檻；劉隊點擊由 **`liuReportFlowByChapter.ch1` + `resolveLiuNpcClick`** 決定是任務對話或隨機句（見第五節）。

### 3.3 第二章模板（阿蘇）

- 車內 **`npc_asu`**：`casualTalkThreshold: 1`，且敏感線僅 **`scene_ch2_asu_car`**。  
- **語意**：第二章把「先談一輪再深問」壓得很短，與第一章「繞三句」不同，但**分類相同**：都是 **gate + random pool**。

### 3.4 建議的「一致化計數規則」（目標）

以下為**思考用目標**，方便之後改引擎一次對齊：

1. **計數對象**：每次成功播放 **`triggerRandomNpcDialog` 的台詞**（不含敏感樹、不含劉隊任務框），**一律 +1**（或依章節設定 `incrementPolicy`）。  
2. **劉隊**：是否計入「閒聊」由 **`liuReportFlow`** 單獨規定（例如：僅 `random_liu` 計入）。  
3. **資料 `hint`／`casual`**：不影響是否 +1；僅影響**權重**或**未來**的次要樣式（例如小圖示）。

---

## 四、Dock 與 Zoom（`DialogPresentation`）

### 4.1 概念

| 模式 | 行為概要 | 玩家體感 |
|------|-----------|----------|
| **`zoom`** | `HotspotZoomOverlay`：全螢幕底圖 + 對話框（可帶熱點名稱作副標） | 聚焦「點了場上某一點」的讀取感 |
| **`dock`** | `BottomDock` 內嵌 `DialogBox`：不蓋滿全圖，與場景並存 | 輕量提示、連續點擊、與立繪並排 |

### 4.2 資料約定（`types/game.ts`）

- **`Scene.defaultDialogPresentation`**：該場景未指定時的預設。  
- **`Hotspot.hintPresentation`**：僅有 `hint`、走「熱點 fallback」時覆寫。  
- **`Effect.dialogPresentation`**：`showDialog` 時覆寫該則。

### 4.3 第一章／第二章模板行為

- 兩章資料**未**普遍設定 `defaultDialogPresentation` 時，引擎端對「熱點僅 hint」的 fallback **預設為 `zoom`**（與現行 play 頁邏輯一致）。  
- **角色主導、長台詞、與立繪並排**：主遊玩頁慣例為 **Dock + `variant="hotspot"`**（與 `NpcScenePortrait` 層級搭配）。

### 4.4 建議決策樹（思考用）

```
是否為「點熱點但無獨立 event、只有 hint 字串」？
  ├─ 是 → 預設 Zoom（除非場景改為 dock）
  └─ 否（有 showDialog 的劇情事件）
        ├─ 需要全畫面沉浸、多段 queue → 傾向 Zoom 或 overlay
        └─ 需要與底部操作區連續互動 → 傾向 Dock
```

---

## 五、劉隊（`npc_liu`）— Ch1／Ch2 模板

### 5.1 與一般 NPC 的差異

- 劉隊**不**依賴 `getNpcClickBehaviour` 的 `random_dialog` 分支作為唯一路徑；**優先** `resolveLiuNpcClick`。  
- **Ch1**：是否出現「報告」相關選項，與 **`flowController` / `shouldAllowAction`**、旗標連動。  
- **Ch2**：有 **阻擋步**（例如未完成阿蘇敏感線）、**報告階段**（填空／手機謎／第二輪）等 **硬編排對話**，完成後才 **`random_liu`**。

### 5.2 模板結論

- **劉隊 = 任務／進度框** + **完成後才混入 randomDialogs**（若該章有設定）。  
- 與**敏感 NPC 閒聊計數**分軌，避免同一個 `npcCasualTalkCount` 混用兩種語意。

---

## 六、敏感線（Sensitive gate）— 以 Ch1／Ch2 為範式

### 6.1 流程

1. 玩家點 NPC 頭像。  
2. **`getNpcClickBehaviour`**：若該 NPC 在 `sensitiveGatesByChapter` 有設定，且**未**完成敏感線、且**達成**觀察旗標 + 閾值 → 出現 **gate UI**（問／略過）。  
3. 選「深問」→ 進 **`sensitiveBranchesByChapter`** 的 pick-one → `startNpcDialog`／節點。  
4. 選「略過」或完成敏感線後 → **僅**隨機 `randomDialogs`。

### 6.2 Ch1／Ch2 差異（模板並存）

| 項目 | Ch1 感 | Ch2（阿蘇） |
|------|--------|-------------|
| 閒聊閾值 | 多為 **3** | **1** |
| 場景限制 | 依各 NPC 觀察旗標 | **僅車內** `allowedScenes` |
| 觀察條件 | 例如 `observed_any_ch1`、`projection_room_observed` | 車內四線索檢視 + `minObservedCount` |

---

## 七、章尾／報告 overlay

- **不**走 `DialogBox` 的 Dock／Zoom 分類；使用 **`ChapterReportEditorHost`** 等獨立 overlay。  
- **與本文件的關係**：章尾＝**第四層**，避免與場景 `showDialog` 混在同一套「線索框」規則裡修文案。

---

## 八、實作對齊檢查清單（之後改版用）

- [ ] `Dialog.type === 'narrator'` 時，抬頭是否一律可讀（「旁白」或明確 `title`）？  
- [ ] 熱點純 hint：Zoom 是否一律帶**互動名稱**作副標，避免空白抬頭？  
- [ ] `RandomDialog.type`（casual／hint）是否在 UI 或權重上**有可觀察的差異**（或明定「僅資料註記」）？  
- [ ] `incrementNpcCasualTalk` 是否在**所有「算閒聊」的路徑**一致（含無 sensitive 條目的 NPC、劉隊 random 是否排除）？  
- [ ] 新章節複製 Ch1／Ch2 時：**先**填 `sensitiveGatesByChapter` / `liuReportFlowByChapter`，**再**寫 `randomDialogs`，避免流程死鎖。

---

## 九、檔案索引（實作對應）

| 主題 | 主要檔案 |
|------|-----------|
| 型別 | `types/game.ts`（`Dialog`、`RandomDialog`、`Effect.dialogPresentation`） |
| 隨機 NPC 句 → `Dialog` | `lib/gameEngine.ts`（`triggerRandomNpcDialog`） |
| 劉隊點擊 | `lib/liuReportFlow.ts`、`data/chapterBehaviourConfigs.ts`（`liuReportFlowByChapter`） |
| 敏感門檻與分支 | `lib/chapterBehaviours.ts`、`data/chapterBehaviourConfigs.ts` |
| 熱點事件／Zoom／Dock | `app/play/[chapterId]/[sceneId]/page.tsx`（`handleHotspotClick`） |
| 對話框 UI | `components/DialogBox.tsx`、`components/HotspotZoomOverlay.tsx`、`components/BottomDock.tsx` |

---

*本稿為設計思考用，修程式時請以 repo 內實際程式碼為準，並更新本檔「現況」段落。*
