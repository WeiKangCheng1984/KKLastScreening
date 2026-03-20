## 目標與原則（ch3～ch6 快速完工）

### 目標
- **第三～第六章的遊玩方式**盡量沿用第一章 / 第二章的既有模式（場景探索 + Hotspot + 對話 + 謎題 + 章尾 overlay）。
- **NPC 對話先簡單處理**：可用單輪/少分支、必要旗標到位即可。
- **重點放各章尾聲「向劉隊報告」**：可重玩、回饋有資訊、資料驅動、避免把章特化邏輯塞進 `app/play/[chapterId]/[sceneId]/page.tsx`。

### 約束（依 `rules.mdc`）
- 新互動優先走 `scene.hotspotEventMap + events.effects` 或 `npcDialogs`，**不要**在 `page.tsx` 堆章節 if-else。
- Engine 在 render 主體不可有副作用呼叫（不要新增）。
- 章尾 overlay 期間要阻擋場景點擊（沿用現況做法）。

---

## 現況可沿用的章尾模組（已存在）

### 模組 A：雙格填空（ch1 版本）
- **元件**：`components/ReportFillBlank.tsx`
- **入口**：`components/Ch1ReportEditor.tsx`（目前只給 ch1 用，但題型元件可共用）
- **資料結構**：`TwoBlankFillConfig`（`components/FloatingFillBlankCore.ts`）
- **過關**：兩格都在各自 `correctIds` 內才算過；可多組正解；可針對特定錯誤選項顯示專屬回饋（`wrongRepliesByChoiceId`）。

### 模組 B：殘句推理（選配／舊 ch2 節奏）
- **說明**：ch2 章尾已改為與 ch1/ch3 相同的**雙格填空**（`Ch2ReportEditor` + `ch2ReportConfig`）。若某章要「單格殘句 + 一題一回饋」，可另做小型元件 + config，不必再綁 `getChapterData` 額外欄位。

> 快速策略：ch3～ch6 章尾以模組 A（雙格）為主；必要時縮成 3 題。

---

## 建議的統一落地方式（最少改動、可擴充）

### 1) 新增每章一份「章尾報告 config」
在 `data/` 新增：
- `data/ch3ReportConfig.ts`
- `data/ch4ReportConfig.ts`
- `data/ch5ReportConfig.ts`
- `data/ch6ReportConfig.ts`

每份檔案只放「章尾報告」需要的題目、選項、正解集合、回饋文案（KK / 劉隊）、以及完成後要設的旗標。

**推薦 config 結構（章別可選 A 或 B）**
- `reportMode: 'two_blank' | 'sentence_completion'`
- `readyFlagId`：允許出現「我要向你報告」的旗標（例：`ch3_liu_report_ready`）
- `doneFlagId`：章尾完成旗標（例：`ch3_reasoning_done` 或 `ch3_liu_report_done`）
- `closingTextByDimension`（選配）：延續 ch1 依洞察收尾
- `twoBlankQuestions?: TwoBlankFillConfig[]`（模組 A 用）
- `sentenceQuestions?: Ch2QuestionConfigsLike`（模組 B 用；可沿用 ch2 的格式）

> 注意：先不追求「完全抽象成通用章尾元件」，先用 config 驅動把內容補齊，達到可玩可過關。

### 2) 在 `data/getChapterConfig.ts` 加入 reportConfig 對應
現況已有 `getChapterConfig` 被 play 頁引用（`page.tsx` import 了它）。
- 在 `getChapterConfig(chapterId)` 回傳值加上 `reportConfig`（或 `chapterReportConfig`）欄位。
- `reportConfig` 指向上述 `ch3ReportConfig`…`ch6ReportConfig`。

### 3) Play 頁只做「打開對應章尾 overlay」
維持現況的開關 state（類似 ch1 用 `showCh1ReportEditor`、ch2 用 `showCh2ReportEditor`）。

快速交付版本建議：
- ch3～ch6 先做 **一個共用 overlay**：`components/ChapterReportOverlay.tsx`
  - 讀 `reportConfig.reportMode`
  - `two_blank`：用 `ReportFillBlank` 逐題跑（3 題或 5 題）
  - `sentence_completion`：若需殘句節奏可另做專用元件（資料來自 reportConfig）
  - 完成後設 `doneFlagId=true`，呼叫 `onComplete()`（導向下一章 intro）

> 若你想更快：可以先不做共用 overlay，先複製 ch1/ch2 的章尾元件各做一份 ch3～ch6；但長期會膨脹。這份規劃以「最少新增但避免複製爆炸」為主。

---

## 各章章尾報告的建議玩法（以快速完成為優先）

### 第三章（ch3）：三題雙格填空（模組 A，縮成 3 題）
**定位**：反證／排除錯法（像在寫「這不是 X，因為 Y」）

- **題數**：3 題，每題 2 格，一次填完兩格再判定。
- **正解策略**：每格 `correctIds` 放 2～4 個同義詞（放寬判定）。
- **錯誤回饋**：
  - 一般錯：提示缺哪種支點（時間 / 權限 / 現場痕跡 / 動機）
  - 特定 KUSO 錯：用 `wrongRepliesByChoiceId` 做冷面吐槽（和 ch1 風格一致）

**建議旗標**
- `ch3_liu_report_ready`（達到 ≥N 里程碑顯示報告選項）
- `ch3_liu_report_done`（章尾完成）

### 第四章（ch4）：五題殘句推理（模組 B）
**定位**：像盤問，逐題逼近「責任鏈/遮蔽點」。

- **題數**：5 題（沿用 ch2 的節奏最省工）
- **正解策略**：每題正解可 2～3 個（同方向即可）
- **錯誤回饋**：劉隊冷一句 + KK 補一句（資訊導向，不要只說錯）

**建議旗標**
- `ch4_liu_report_ready`
- `ch4_liu_report_done`

### 第五章（ch5）：三題雙格填空（模組 A）
**定位**：動線/時間窗口重建，但先用文字化（避免做新 UI 模組 D 才能趕工）。

- **題數**：3 題
- **題幹方向**：入口/轉角/消失點（用兩格描述「在哪裡」+「為什麼拍不到」）
- **正解策略**：同義詞放寬，核心是「死角/窗口/掩護」類。

**建議旗標**
- `ch5_liu_report_ready`
- `ch5_liu_report_done`

### 第六章（ch6）：三題殘句推理（模組 B，縮成 3 題）
**定位**：極簡三句定稿（事實/責任鏈/危險猜測但寫成待查）

- **題數**：3 題（節奏快、收束感強）
- **第 3 題**：不要求唯一正解，但必須「寫得能交出去」：用 options 限制措辭（避免玩家直接寫死結論）。

**建議旗標**
- `ch6_liu_report_ready`
- `ch6_liu_report_done`

---

## NPC 對話（快速版做法）

### 原則
- 每章每個 NPC 先做最小可用：**1 個閒聊節點 + 1 個敏感節點（選配）**。
- 敏感節點完成就設 `npc_*_sensitive_done`（沿用 `flagTestConfig.ts` 的模式，後續易測）。
- 需要「進度門檻」時，用：
  - `npcCasualTalkCount[npcId] >= 3`（若現況有）
  - 或用簡單里程碑旗標 `chX_milestone_*` 取代複雜條件

### 建議每章最少里程碑旗標（用來解鎖章尾報告）
- `chX_milestone_time`（時間支點）
- `chX_milestone_access`（權限/流程支點）
- `chX_milestone_trace`（現場痕跡支點）

達成其中至少 2～3 個 → 設 `chX_liu_report_ready=true`。

---

## 旗標測試面板（快速測試）

在 `data/flagTestConfig.ts`：
- ch3～ch6 各加一組最小測試旗標：
  - `chX_liu_report_ready`
  - `chX_liu_report_done`
  - `chX_milestone_time / access / trace`
  - 各章主要 NPC 的 `npc_*_sensitive_done`（若有）

目的：你可以用「旗標測試面板」直接點出各狀態，快速驗證章尾 overlay 是否能打開、能完成、能導向下一章。

---

## 實作順序（建議以 2～3 天可交付的節奏）

### Phase 0：骨架打通（先讓 ch3～ch6 都能進遊戲）
- `data/chapters.ts`：補齊 ch3～ch6 的 `scenes` 列表與 intro meta（若未完整）
- `data/getChapterData.ts`：確保可動態 import ch3～ch6 的 gameData 檔案
- `data/gameDataCh3.ts`～`gameDataCh6.ts`：先用最小場景數（每章 3～5 個場景）與最小 Hotspot，能跑完整流程即可

### Phase 1：章尾報告先做完（最重要）
- 先做 `components/ChapterReportOverlay.tsx`（共用）
- 先做 `data/ch3ReportConfig.ts`（A/3 題）與接入
- 再做 `data/ch4ReportConfig.ts`（B/5 題）
- 再做 `data/ch5ReportConfig.ts`（A/3 題）
- 最後 `data/ch6ReportConfig.ts`（B/3 題）

### Phase 2：NPC 最小補齊
- 每章每 NPC 1～2 個節點 + 旗標收斂
- 以里程碑旗標驅動章尾報告 ready

### Phase 3：測試與收斂
- 用旗標測試面板快速驗證：
  - ready → 能出現報告選項
  - 報告完成 → done 旗標設立 + 導向下一章 intro
  - 章尾 overlay 期間 hotspotBlocked 正常

---

## 交付清單（你驗收用）
- ch3～ch6：每章都能從 intro 進入遊玩頁，場景可切換
- 每章至少 2～3 個里程碑可以拿到（或用旗標測試面板直接打開）
- 每章章尾「向劉隊報告」可順利完成並導向下一章
- NPC 對話有最小可用（至少不會卡死流程）

