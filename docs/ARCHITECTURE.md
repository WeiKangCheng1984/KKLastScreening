# KK 流程偵探 — 程式架構與邏輯（現況）

> 本文件描述目前程式實際運作方式，供維護與擴章時對齊。劇情文案與 walkthrough 請以遊戲內 `data/` 為準。

---

## 1. 技術棧

| 項目 | 說明 |
|------|------|
| 框架 | Next.js 14+（App Router） |
| 語言 | TypeScript |
| 樣式 | Tailwind CSS；共用語意見 `app/globals.css`（如 `.hotspot-glass`、`.report-card`） |
| 動畫 | Framer Motion（`LazyMotionProvider` 於 `app/layout.tsx`） |
| 圖示 | Lucide React |

---

## 2. 目錄導覽（高層）

```
app/                    # 頁面與路由
  layout.tsx            # 全域 Provider、AudioUnlockOnInteraction
  page.tsx              # 首頁
  play/
    prologue/           # 序章
    [chapterId]/intro/  # 章介（ChapterIntro）
    [chapterId]/[sceneId]/page.tsx   # 主遊玩（核心整合，檔案大）
components/             # UI 元件（對話、場景、謎題、章尾等）
data/                   # 章節清單、分章劇情資料、報告設定、推理文案資料
hooks/                  # useChapterData、useDialogQueue、useInventoryDetail
lib/                    # GameEngine、章節行為、劉隊流程、對話工具等
types/game.ts           # Scene / Event / Dialog / Puzzle / Effect 等結構
public/                 # 靜態資產（背景、立繪 WEBP、SVG 等）
```

---

## 3. 路由與頁面職責

| 路徑 | 職責 |
|------|------|
| `/` | 首頁、讀檔（PasswordLoadModal） |
| `/play/prologue` | 序章敘事 |
| `/play/[chapterId]/intro` | 章節導讀／CTA（`ChapterIntro`） |
| `/play/[chapterId]/[sceneId]` | **主遊玩**：場景、熱點、對話、NPC、謎題、章尾 overlay、部分模態 |
| `/dev/simulate` | 開發用模擬（若存在） |

---

## 4. 遊戲狀態核心：`GameEngine`

- **檔案**：`lib/gameEngine.ts`
- **實例**：Play 頁以 `useRef` 持有單一 `GameEngine`，必要時從 `localStorage` 還原 `gameState`。
- **資料注入**：不直接 import 章節資料；透過 `loadChapterData({ scenes, items, npcDialogs })` 合併進引擎。
- **狀態**：`flags`、`inventory`、`interactions`、`visitedScenes`、章節／場景指標、`npcDialogs` 進行中節點、`insights`／`preferences` 等。
- **常用能力**：
  - `applyEffect`：統一入口（換場、`setFlag`、`showDialog` 在資料層定義、道具、`startNpcDialog` 等）。
  - `triggerEvent` / `checkEventRequirements`：依場景 `events` 與 `hotspotEventMap` 驅動。
  - `getCurrentScene()`、`getScenes()`、`getItems()`。
  - NPC：`startNpcDialog`、`getCurrentNpcDialogNode`、`handleNpcDialogChoice`、`endNpcDialog`、`triggerRandomNpcDialog`。
  - 章尾相關：`setReasoningComplete` 等（與各章 `ChXReportEditor` 完成時呼叫一致）。

**原則**：新劇情與互動優先寫在 `data/gameDataChX.ts`（`scene.hotspotEventMap`、`events.effects`、`npcDialogs`），避免在 Play 頁堆疊章節專用 if-else。

---

## 5. 資料層

### 5.1 章節清單

- **`data/chapters.ts`**：每章 id、名稱、場景 id 列表、intro 用 meta。路由與 intro 依賴此檔。

### 5.2 分章載入

- **`data/getChapterData.ts`**：依 `chapterId` 動態 `import('./gameDataChX')`，回傳 `{ scenes, items, npcDialogs }`，縮小首包。
- **`hooks/useChapterData.ts`**：`getChapterData` → `engine.loadChapterData` → `changeScene` 到 URL 對應場景，並暴露 `chapterDataReady`、`scenes`、`items`。

### 5.3 場景與事件（各章檔案）

- **`data/gameDataCh1.ts` … `gameDataCh6.ts`**：劇情與互動的單一來源（已移除舊版整包 `gameData.ts`，避免與分章檔重複、分叉）。
- 典型結構：`Scene` 含 `hotspots`、`hotspotEventMap`、`events`、`puzzles`、`npcs`、`initialDialog` 等。
- **對話呈現（資料可選）**：
  - `Effect.dialogPresentation`：`zoom` | `dock`
  - `Scene.defaultDialogPresentation`、`Hotspot.hintPresentation`  
  Play 頁依此決定 `HotspotZoomOverlay` 或 BottomDock `DialogBox`。

### 5.4 章節設定與報告

- **`data/getChapterConfig.ts`**：`getChapterConfig(chapterId)` → `reasoning?`（見下）、`report.postComplete`（章尾完成後導向下一章 intro 的 flag + href）。
- **`data/reasoningByChapter.ts`**：每章結構化資料（含 `police.introLine` / `introLines` 等）。**Play 頁目前仍用 `chapterConfig.reasoning?.police` 做 ch1／ch2 開場劉隊簡報**；其餘 Q1/Q3 等欄位保留於資料，UI 以章尾編輯器為主。
- **`data/chXReportConfig.ts`** + **`components/ChXReportEditor.tsx`**：各章向劉隊報告／結算（`ReportFillBlank`、Ch1 特殊多階段等）。
- **`components/ChapterReportEditorHost.tsx`**：依章掛載 `Ch1ReportEditor`～`Ch6ReportEditor`，外層 `ChapterConclusionOverlay`。

### 5.5 劉隊與 NPC 點擊（表驅動）

- **`lib/liuReportFlow.ts`**：`resolveLiuNpcClick` — 劉隊頭像點擊後回傳對話或開報告等（減少 Play 頁長鏈 if）。
- **`lib/chapterBehaviours.ts`**：`getNpcClickBehaviour` — 敏感門檻、`random_dialog` 等行為。

---

## 6. 主遊玩頁整合：`app/play/[chapterId]/[sceneId]/page.tsx`

職責概覽（**高風險大檔**，新邏輯仍應盡量下沉到 data / lib）：

1. **場景渲染**：`SceneView`（背景、hotspot、`?debug=1` 顯示框）。
2. **熱點**：`handleHotspotClick` → 道具收集、事件 `triggerEvent`、`showDialog` 走 **zoom** 或 **dock**。
3. **對話**：
   - **Dock**：`BottomDock` + `DialogBox`（`embedInParent`、`variant="hotspot"`）。
   - **Zoom**：`HotspotZoomOverlay` 內 `DialogBox`（`containedInOverlay` 使立繪層級正確）+ `NpcScenePortrait`。
4. **立繪**：場景內與 Zoom 共用 **`components/NpcScenePortrait.tsx`**（比例一致）；Dock 外殼 `z-30`，立繪預設 `z-40`；Zoom 內對話殼 `z-10`、立繪 `z-20`。
5. **NPC 列**：`NpcRightStrip`；敏感流程 **`SensitiveGateOverlay`**；對話樹節點由 **`buildDialogFromNpcNode`** 轉成 `Dialog` 給 `DialogBox`。
6. **佇列**：`useDialogQueue` — `currentDialog`、`dialogQueue`、`addDialogsToQueue`。
7. **謎題**：`currentPuzzle` + **`PuzzleRenderer`**（依 `puzzle.type` 分派；資料未使用的 type 會 fallback **`PuzzleInput`**）。
8. **章尾**：`activeReportChapterId` 等 → `ChapterReportEditorHost`；ch6 結局 `EndingOverlay`。
9. **其他模態**：背包 `Inventory`、道具詳解 `ItemObtainedNotification`、`PulseClipReader`、`UVLightPanel`、開發者 `DeveloperPanel` 等。

**禁止**：在 React render 主體直接呼叫 `engine.applyEffect`（應在 effect／callback 內）。

---

## 7. 元件分類（`components/`）

| 類別 | 代表檔案 |
|------|----------|
| 場景／熱點 | `SceneView.tsx` |
| 對話 | `DialogBox.tsx`、`DialogChoice.tsx`、`HotspotZoomOverlay.tsx`、`BottomDock.tsx`、`NpcScenePortrait.tsx`、`SensitiveGateOverlay.tsx` |
| NPC | `NpcRightStrip.tsx` |
| 謎題 | `PuzzleRenderer.tsx`、`PuzzleInput.tsx`、`ArrangementPuzzle.tsx`、`VisualSelectionPuzzle.tsx`、`RotatingDial.tsx`、`SequenceMemory.tsx` |
| 章尾／報告 | `ChapterReportEditorHost.tsx`、`ChapterConclusionOverlay.tsx`、`Ch1ReportEditor.tsx`～`Ch6ReportEditor.tsx`、`ReportFillBlank.tsx`；型別與填空結構 `FloatingFillBlankCore.ts` |
| 章介／序章 | `ChapterIntro.tsx`、`SceneNameDisplay.tsx`、`animations/FadeIn.tsx`、`animations/ParticleEffect.tsx` |
| 效果 | `effects/BeamEffect.tsx`、`RippleEffect.tsx`、`GlitchText.tsx` |
| 全域／首頁 | `LazyMotionProvider.tsx`、`AudioUnlockOnInteraction.tsx`、`PasswordLoadModal.tsx`、`PasswordWheelInput.tsx`、`DigitWheel.tsx` |
| 其他 | `Inventory.tsx`、`ItemObtainedNotification.tsx`、`SVGImage.tsx`、`OverlayCard.tsx`、`DeveloperPanel.tsx`、`EndingOverlay.tsx` 等 |

---

## 8. 型別

- **`types/game.ts`**：`Scene`、`Hotspot`、`Event`、`Effect`、`Dialog`、`Puzzle`、`Npc`、`NpcDialogNode`、`Requirement` 等為單一真相來源。
- Puzzle 的 `type` 聯集可能含歷史／預留字串；**執行時**以 `PuzzleRenderer` 的 `switch` + `default` 為準。

---

## 9. 樣式與無障礙小抄

- **對話玻璃態**：`.hotspot-glass` / `.hotspot-glass-npc`（`app/globals.css`），與 `DialogBox` `variant="hotspot"` 搭配。
- **Hotspot 座標**：比例 0～1，主流 `circle`；縮放見 `globals.css` `--hotspot-scale` 與 `SceneView` inline transform（專案規則文件另有細節時以程式為準）。

---

## 10. 除錯

- `?debug=1`：顯示 hotspot 框與 id（`debug=0` 關閉）。
- 開發者模式：選單／快捷鍵開啟 `DeveloperPanel`（場景跳轉等）。

---

## 11. 延伸閱讀（非 docs）

- 協作規範與高風險約束：**`.cursor/rules/rules.mdc`**
- 設計 token 與章尾視覺：**`DESIGN_SYSTEM.md`**（專案根目錄）

---

*文件產生方式：對應目錄與引擎／Play 頁整合關係之靜態盤點；若程式變更請同步更新本檔。*
