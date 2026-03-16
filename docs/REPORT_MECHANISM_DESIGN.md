# KK 流程偵探｜向劉隊回報機制 技術設計文件

**版本**：v1.0  
**日期**：2026-03-14  
**負責範圍**：雙空格浮動填空整合進推理回報流程（六章統一）

---

## 一、現況分析

### 1.1 現行系統架構

| 元件 / 資料 | 路徑 | 功能 |
|---|---|---|
| `FloatingFillBlankCore.ts` | `components/` | 型別定義、評分邏輯 |
| `ReasoningPanel.tsx` | `components/` | 向劉隊回報，步驟 Q1→Q2→Q3→Outro |
| `reasoningByChapter.ts` | `data/` | 各章題目與劉隊對話文案 |
| `page.tsx` | `app/play/.../` | 按鈕控制，顯示/隱藏兩套UI |

### 1.2 現行流程問題

1. **功能割裂**：推理回報與各章填空（ch1 態度、ch2 結算等）需流程一致。
2. **填空只有單一空格**：思考深度不足，無法表達「兩個觀點的組合」。
3. **Q2 文字輸入缺乏引導**：自由輸入對玩家回饋弱，容易跳過。
4. **各章體驗不一致**：ch2 有特殊句子補齊流程，缺乏統一感。

### 1.3 改動目標

- 將填空整合為推理回報流程的**前導步驟**，每章兩道雙空格填空 → Q1 → Q3 → 劉隊結語
- 六章玩法邏輯相同，文案與答案各自對應本章核心線索
- 獨立填空測試按鈕已移除；正式填空僅在報告／結算流程內

---

## 二、新流程設計

### 2.1 完整回報步驟順序

```
玩家完成章節探索
        ↓
「向劉隊回報」按鈕出現（原「推理分析」按鈕）
        ↓
Step 0：劉隊 introLine 對話（1~2 則）
        ↓
Step 1：第一道雙空格浮動填空（核心洞見一）
        ↓  ← 填完兩個空格後，顯示 KK 旁白 + 劉隊簡短回應
Step 2：第二道雙空格浮動填空（核心洞見二）
        ↓  ← 填完後，顯示 KK 旁白 + 劉隊銜接語
Step 3：Q1 三選一判斷題（既有機制，保留）
        ↓
Step 4：Q3 線索連連看（既有機制，保留）
        ↓
Step 5：劉隊 outroStandard（可寫進報告的版本）
        ↓
Step 6：玩家補充句選擇（outroPlayerLines，1~3 項）
        ↓
回報結束，章節結算
```

> **Q2 文字輸入**：移除為獨立步驟。其功能由雙空格填空取代，文案精神保留至 outroPlayerLines。

### 2.2 視覺層次設計

```
┌─────────────────────────────────────────────────────┐
│  [背景：昏暗環境光，偵探辦公室/警局/停車場感]          │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  【KK 報告筆記本卡片】  石板深色 + amber 邊框   │   │
│  │                                              │   │
│  │  步驟說明：第 1 / 2 道洞見                    │   │
│  │                                              │   │
│  │  句子顯示區（三段拼合）：                      │   │
│  │  「散場的燈不是 ┌──────┐ 晚，                │   │
│  │               │ 自然  │                      │   │
│  │               └──────┘                      │   │
│  │   那個黑暗是一個被 ┌──────┐ 好的空窗。」      │   │
│  │                   │ ___  │ ← 待填             │   │
│  │                   └──────┘                  │   │
│  │                                              │   │
│  │  進度：● ● ○  （空格1已填 / 空格2待填 / 確認） │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  【浮動字詞卡區（全螢幕飄浮）】                        │
│  ┌──────┐   ┌──────┐   ┌──────┐                    │
│  │ 設計  │   │ 忽略  │   │ 允許  │                    │
│  └──────┘   └──────┘   └──────┘                    │
│       ┌──────┐   ┌──────┐   ┌──────┐               │
│       │ 測試  │   │ 安排  │   │ 調整  │               │
│       └──────┘   └──────┘   └──────┘               │
│                                                      │
│  [打散重排 🔀]         [確認填入 →]                   │
└─────────────────────────────────────────────────────┘
```

---

## 三、TypeScript 型別定義

### 3.1 新增：`TwoBlankFillConfig`（加入 `FloatingFillBlankCore.ts`）

```typescript
/**
 * 雙空格浮動填空設定
 * sentenceParts[0] + [BLANK_1] + sentenceParts[1] + [BLANK_2] + sentenceParts[2]
 */
export type TwoBlankFillConfig = {
  id: string;

  /** 句子分三段，blank 在各段之間 */
  sentenceParts: [string, string, string];

  /** 空格1：題目說明 + 選項 + 正解 + 填對後 KK 旁白 */
  blank1: {
    hintLabel: string;           // 浮動區上方提示文字，如「關於那段黑暗⋯」
    options: FloatingOption[];   // 5~7 張牌
    correctIds: string[];        // 通常只有 1 個
    replyOnCorrect: string;      // KK 旁白（一段，填對後顯示）
  };

  /** 空格2：同上結構 */
  blank2: {
    hintLabel: string;
    options: FloatingOption[];
    correctIds: string[];
    replyOnCorrect: string;
  };

  /** 兩格都填對後：劉隊對 KK 的回應 */
  bothCorrectDialogue: {
    kk: string;    // KK 補充一句
    liu: string;   // 劉隊確認一句
  };

  /** 任一格填錯時的提示（共用，不區分哪格錯） */
  wrongFallback: string;
};
```

### 3.2 修改：`ChapterReasoning`（`reasoningByChapter.ts`）

```typescript
export interface ChapterReasoning {
  q1: ReasoningQ1;
  q2: ReasoningQ2;      // 保留型別，但流程中不顯示為獨立步驟
  q3: ReasoningQ3;
  police?: ChapterPoliceConfig;

  /** 新增：向劉隊回報的兩道雙空格填空 */
  reportFills?: [TwoBlankFillConfig, TwoBlankFillConfig];
}
```

### 3.3 `ReasoningPanel` 步驟型別修改

```typescript
// 舊版
type Step = 0 | 1 | 2 | 3;  // Q1 / Q2 / Q3 / Outro

// 新版
type ReasoningStep =
  | 'intro'    // 劉隊 introLine（新增）
  | 'fill1'   // 第一道雙空格填空（新增）
  | 'fill2'   // 第二道雙空格填空（新增）
  | 'q1'      // 三選一（原 step 0）
  | 'q3'      // 連連看（原 step 2）
  | 'outro';  // 劉隊結語 + 補充（原 step 3）
```

---

## 四、新元件規格：`ReportFillBlank.tsx`

### 4.1 Props

```typescript
interface ReportFillBlankProps {
  config: TwoBlankFillConfig;
  onComplete: (result: { blank1Correct: boolean; blank2Correct: boolean }) => void;
}
```

### 4.2 內部狀態機

```
IDLE
  → 顯示句子（blank1 高亮，blank2 灰色）
  → 浮動卡池 A（blank1 選項）
  ↓ 玩家選牌
BLANK1_PENDING
  → 句子 blank1 顯示選中詞（amber 高亮）
  → 顯示「確認填入」按鈕
  ↓ 確認
BLANK1_CONFIRMED（正確）
  → 顯示 blank1.replyOnCorrect（KK 旁白，短暫 1.5s）
  → blank1 鎖定，blank2 高亮啟動
  → 浮動卡池 B（blank2 選項）以 scatter 動畫進場
  ↓ 玩家選牌
BLANK1_CONFIRMED（錯誤）
  → 顯示 wrongFallback
  → blank1 重置，可重新選
BLANK2_PENDING
  → 確認按鈕
  ↓ 確認
COMPLETED（兩格均正確）
  → 顯示 bothCorrectDialogue（KK + 劉隊各一句）
  → 0.5s 後顯示「繼續」按鈕
  ↓ 玩家點繼續 → onComplete({ blank1Correct: true, blank2Correct: true })
COMPLETED（有錯誤）
  → wrongFallback + 「繼續」按鈕（允許帶錯誤繼續，不封鎖進度）
  → onComplete({ blank1Correct: false/true, blank2Correct: false/true })
```

### 4.3 視覺設計規格

| 元素 | 樣式 |
|---|---|
| 全屏背景 | `fixed inset-0 bg-black/80 z-[80]` |
| 句子卡片 | `bg-stone-900/85 border border-amber-800/40 rounded-2xl`，寬度 `max-w-lg`，居中偏上 |
| 空格1（填前） | `border-b-2 border-amber-400/60 px-2 text-amber-200/40`，顯示底線佔位 |
| 空格1（填後） | `text-amber-300 underline decoration-amber-400`，Framer Motion scale in |
| 空格2（待填）| `border-b-2 border-stone-600/40 text-stone-500`，灰色低調 |
| 空格2（啟動）| 邊框變 `border-amber-400/60`，小幅 pulse 動畫提示 |
| 進度圓點 | `● ● ○` → `● ● ●`，amber 填色 |
| 浮動卡池 | 沿用 `ReportFillBlank` 樣式（`bg-stone-900/80`，浮動 y 動畫） |
| KK 旁白區 | 句子卡下方，`text-stone-400 text-sm italic`，AnimatePresence 淡入 |
| 打散重排 | 沿用現有 Shuffle 按鈕設計 |

---

## 五、`ReasoningPanel.tsx` 修改規格

### 5.1 步驟渲染邏輯

```
renderIntro()   → 劉隊 introLine，「開始回報」確認按鈕
renderFill1()   → <ReportFillBlank config={fill1} onComplete={handleFill1Done} />（全屏）
renderFill2()   → <ReportFillBlank config={fill2} onComplete={handleFill2Done} />（全屏）
renderQ1()      → 現有 Q1 三選一（保留）
renderQ3()      → 現有 Q3 連連看（保留，ch6 連連看有 4 組）
renderOutro()   → 現有劉隊結語 + outroPlayerLines（保留）
```

### 5.2 fill 步驟嵌入方式

- `ReasoningPanel` 保持為全屏 modal，`fill1` / `fill2` 步驟時內部直接渲染 `ReportFillBlank`（佔滿 panel 空間）
- `fill1` / `fill2` 步驟期間，隱藏 panel 本身的 header 與步驟列，讓填空全屏感更強
- 填空完成後，以 Framer Motion 滑入 → Q1 畫面

### 5.3 無 `reportFills` 的章節（降級處理）

若 `config.reportFills` 不存在（資料尚未加入），直接從 `q1` 開始，流程不變。確保改動不影響現有章節運作。

---

## 六、六章填空資料完整規格

> 格式：`B1` = 空格1正解，`B2` = 空格2正解。
> 牌的座標採用比例值 (0~1)，由 `generateScatteredPositions()` 輔助初始布局，玩家可打散重排。

---

### Ch1｜城市影城

#### Fill 1：黑暗的性質

```
句子（三段）：
  [0] 「散場的燈不是
  [1] 晚，那個黑暗是一個被
  [2] 好的空窗。」

空格1 hintLabel：「那段燈的延遲，是⋯⋯」
空格1 選項（6張）：
  ✓ 自然     B1 正解
  ✗ 故障
  ✗ 意外
  ✗ 設備
  ✗ 緊急
  ✗ 工作
空格1 replyOnCorrect：
  「不是設備問題，也不是意外。它讓人不追，才是它真正的功能。」

空格2 hintLabel：「那個空窗，是被⋯⋯」
空格2 選項（6張）：
  ✓ 設計     B2 正解
  ✗ 忽略
  ✗ 允許
  ✗ 測試
  ✗ 安排
  ✗ 調整
空格2 replyOnCorrect：
  「KK 想：設計，不是失誤，是刻意。」

bothCorrectDialogue：
  kk：「燈不是自然晚。那個黑，是被準備好的。」
  liu：「所以你認為——有人申請了它，或者有人知道它不會被追。」

wrongFallback：
  「再想想。燈的延遲讓人沒辦法責怪任何一個人，這是它存在的意義。」
```

#### Fill 2：兇手特徵

```
句子（三段）：
  [0] 「能把一件事藏進
  [1] 裡，代表那個人對這套
  [2] 很熟悉。」

空格1 hintLabel：「這件事被藏進了什麼裡面？」
空格1 選項（6張）：
  ✓ 流程     B1 正解
  ✗ 報告
  ✗ 場館
  ✗ 紀錄
  ✗ 時間
  ✗ 數字
空格1 replyOnCorrect：
  「流程不是中性的。它能保護人，也能保護動作。」

空格2 hintLabel：「他熟悉這套⋯⋯」
空格2 選項（6張）：
  ✓ 系統     B2 正解
  ✗ 場合
  ✗ 環境
  ✗ 設備
  ✗ 規則
  ✗ 格式
空格2 replyOnCorrect：
  「不是外來者。是一個知道怎麼用這套系統的人。」

bothCorrectDialogue：
  kk：「不是從外面破門的人。是站在門口、知道鑰匙怎麼用的人。」
  liu：「夠了。這句話，我能寫進去。」

wrongFallback：
  「殺人不需要很厲害。但讓死亡看起來像正常結束——這需要對什麼很熟悉？」
```

---

### Ch2｜死者是誰

#### Fill 1：死者身份的敏感性

```
句子（三段）：
  [0] 「烏鴉的名字被
  [1] ，不是因為案情需要保密，而是因為他在追的那條線
  [2] 了。」

空格1 hintLabel：「他的名字，被⋯⋯」
空格1 選項（6張）：
  ✓ 壓住     B1 正解
  ✗ 確認
  ✗ 保護
  ✗ 公開
  ✗ 調查
  ✗ 記錄
空格1 replyOnCorrect：
  「不是程序問題。是有人不希望他的名字和他在追的事同時出現。」

空格2 hintLabel：「他追的那條線⋯⋯」
空格2 選項（6張）：
  ✓ 傷到人   B2 正解
  ✗ 中斷
  ✗ 消失
  ✗ 曝光
  ✗ 複雜
  ✗ 失敗
空格2 replyOnCorrect：
  「KK 停了一下：不是他的名字危險，是他知道的東西危險。」

bothCorrectDialogue：
  kk：「他的身份不重要，重要的是他快要說出什麼了。」
  liu：「三起事故。他知道這個說法，而且知道它不只是說法。」

wrongFallback：
  「阿蘇說：我給你資料，不給你結論。再看一次他的錄音時間戳。」
```

#### Fill 2：錄音的意義

```
句子（三段）：
  [0] 「他用
  [1] 的聲音錄下那段話，代表他知道這件事如果
  [2] ，會讓某些人不舒服。」

空格1 hintLabel：「那段錄音的聲音是⋯⋯」
空格1 選項（6張）：
  ✓ 處理過   B1 正解
  ✗ 加密
  ✗ 低沉
  ✗ 模糊
  ✗ 偽裝
  ✗ 陌生
空格1 replyOnCorrect：
  「刻意改過的聲音，是在說：我要被聽見，但不要被辨認出來。」

空格2 hintLabel：「這件事如果⋯⋯」
空格2 選項（6張）：
  ✓ 被聽到   B2 正解
  ✗ 消失
  ✗ 出現
  ✗ 傳出去
  ✗ 公開
  ✗ 曝光
空格2 replyOnCorrect：
  「他知道風險。他還是錄了。然後他去城市影城確認最後一件事。」

bothCorrectDialogue：
  kk：「他很怕。但他不打算讓這件事跟他一起消失。」
  liu：「值得我們怕的，正是這個。他已經知道，而且快說出來了。」

wrongFallback：
  「阿蘇說：這份錄音不是技術問題造成的模糊。它是被刻意做成這樣的。」
```

---

### Ch3｜封鎖的大廳

#### Fill 1：整理版的目的

```
句子（三段）：
  [0] 「整理版存在的目的，不是讓資料更
  [1] ，而是讓某些欄位
  [2] 地消失。」

空格1 hintLabel：「整理版讓資料看起來更⋯⋯」
空格1 選項（6張）：
  ✓ 好讀     B1 正解（表面理由，揭示反諷）
  ✗ 完整
  ✗ 真實
  ✗ 精準
  ✗ 安全
  ✗ 正確
空格1 replyOnCorrect：
  「『好讀』是對的。但好讀的代價，是你不會去問那些不見的欄位在哪裡。」

空格2 hintLabel：「那些消失的欄位，是⋯⋯消失的？」
空格2 選項（6張）：
  ✓ 自然     B2 正解
  ✗ 徹底
  ✗ 安靜
  ✗ 合理
  ✗ 乾淨
  ✗ 精準
空格2 replyOnCorrect：
  「顧乃謙說：它讓刪除看起來像選擇，讓隱藏看起來像分類。」

bothCorrectDialogue：
  kk：「整理版最高明的地方——你很難追問一個感覺已經很整齊的東西。」
  liu：「所以那幾個欄位，是選擇性遺漏，不是格式問題。我會在報告裡這樣寫。」

wrongFallback：
  「顧乃謙說：你要整理版，今天就能結案；你要原始檔，今晚很多人睡不好。你選哪個，它就變成哪個樣子。」
```

#### Fill 2：跨館同步的意義

```
句子（三段）：
  [0] 「城市 W 和光芒 R 在同一個
  [1] 序列，代表有人知道哪裡按下去，兩個地方會
  [2] 響。」

空格1 hintLabel：「兩館共用的⋯⋯序列」
空格1 選項（6張）：
  ✓ 插件版本  B1 正解
  ✗ 設備型號
  ✗ 網路節點
  ✗ 操作介面
  ✗ 維護記錄
  ✗ 系統版本
空格1 replyOnCorrect：
  「同一個插件版本，代表同樣的入口，同樣的漏洞，同樣的操作方式。」

空格2 hintLabel：「兩個地方會⋯⋯響」
空格2 選項（6張）：
  ✓ 一起     B2 正解
  ✗ 同時
  ✗ 輪流
  ✗ 連鎖
  ✗ 延遲
  ✗ 分別
空格2 replyOnCorrect：
  「不是單點故障，是有人理解這個網路的拓樸。」

bothCorrectDialogue：
  kk：「跨館同步不是偶發故障。是有人知道哪裡按下去，哪裡會一起響。」
  liu：「顧乃謙的說法能支持這個嗎？」

wrongFallback：
  「顧乃謙說：跨館同步不是故障，那比較像⋯⋯有人知道哪裡會一起響。」
```

---

### Ch4｜光芒影城

#### Fill 1：黑暗的性質

```
句子（三段）：
  [0] 「那三分鐘的黑，不是
  [1] 的故障，而是一個有
  [2] 的操作窗口。」

空格1 hintLabel：「那段黑暗，不是什麼的故障？」
空格1 選項（6張）：
  ✓ 設備     B1 正解
  ✗ 流程
  ✗ 偶發
  ✗ 排程
  ✗ 節能
  ✗ 系統
空格1 replyOnCorrect：
  「梁以安說黑得太早。不是太早，是剛好對的時間。」

空格2 hintLabel：「這個窗口，是有⋯⋯的？」
空格2 選項（6張）：
  ✓ 目標     B2 正解
  ✗ 節能指令
  ✗ 操作失誤
  ✗ 排程設定
  ✗ 技術原因
  ✗ 管理疏失
空格2 replyOnCorrect：
  「樓梯轉角的監視死角——有人選了那裡。不是偶然進去的。」

bothCorrectDialogue：
  kk：「人群踩上去，燈滅了，混亂出現了。不是事故，是一次有控制條件的測試。」
  liu：「你說的那份操作記錄，現在就是關鍵。」

wrongFallback：
  「差一點。這不是意外，它太剛好了。梁以安說：有人老說是節能，我聽起來比較像測試。」
```

#### Fill 2：陳佑誠三份回報的意義

```
句子（三段）：
  [0] 「三份格式完整的回報，全部消失在
  [1] 流程裡，代表擱置它們是一個
  [2] ，不是遺忘。」

空格1 hintLabel：「回報消失在什麼流程裡？」
空格1 選項（6張）：
  ✓ 審核     B1 正解
  ✗ 維護
  ✗ 申請
  ✗ 管理
  ✗ 技術
  ✗ 上報
空格1 replyOnCorrect：
  「格式對，優先級對，卻每次都沒有批示。不是沒人看到。」

空格2 hintLabel：「擱置是一個⋯⋯，不是遺忘」
空格2 選項（6張）：
  ✓ 決定     B2 正解
  ✗ 失誤
  ✗ 疏忽
  ✗ 錯誤
  ✗ 問題
  ✗ 習慣
空格2 replyOnCorrect：
  「有些擱置，不是因為太忙，是因為不希望那個洞被補起來。」

bothCorrectDialogue：
  kk：「陳佑誠說：系統不怕壞，怕的是壞得剛剛好，像正常老化。三份回報都這樣消失，這是模式，不是疏失。」
  liu：「這條批示鏈的決定，在某個地方就停下來了。我想知道是哪裡。」

wrongFallback：
  「陳佑誠說：回報過，不是一次，格式都對，優先級也對，消失得更對。為什麼消失？」
```

---

### Ch5｜嫌疑矩陣

#### Fill 1：高文傑的性質

```
句子（三段）：
  [0] 「高文傑的紀錄完整到讓人
  [1] ，這不是清白，而是一份被
  [2] 好的說明書。」

空格1 hintLabel：「完整到讓人⋯⋯」
空格1 選項（6張）：
  ✓ 懷疑     B1 正解
  ✗ 相信
  ✗ 放心
  ✗ 確定
  ✗ 誤解
  ✗ 分析
空格1 replyOnCorrect：
  「阿蘇說：登入紀錄只證明帳號在場，不保證靈魂也在場。太整齊，反而可疑。」

空格2 hintLabel：「一份被⋯⋯好的說明書」
空格2 選項（6張）：
  ✓ 設計     B2 正解
  ✗ 整理
  ✗ 安排
  ✗ 準備
  ✗ 規劃
  ✗ 建立
空格2 replyOnCorrect：
  「這份紀錄不是給你查案用的，是給你收案用的。」

bothCorrectDialogue：
  kk：「帳號在場，不代表靈魂也在場。他的紀錄告訴我的，是有人需要這份紀錄存在。」
  liu：「那真正的操作者，在哪個層級？」

wrongFallback：
  「阿蘇說：我給你資料，不給你結論。這份紀錄可以讀出很多東西，再想一次你看到的。」
```

#### Fill 2：林子睿的位置

```
句子（三段）：
  [0] 「插件權限樹的頂端靠近技術長，代表真正能
  [1] 插件的人不在執行層，而是在
  [2] 層。」

空格1 hintLabel：「能⋯⋯插件的人」
空格1 選項（6張）：
  ✓ 修改     B1 正解
  ✗ 使用
  ✗ 操作
  ✗ 維護
  ✗ 更新
  ✗ 部署
空格1 replyOnCorrect：
  「顧乃謙說：真正能改插件的人，不需要每次自己登入。」

空格2 hintLabel：「不在執行層，在⋯⋯層」
空格2 選項（6張）：
  ✓ 決策     B2 正解
  ✗ 技術
  ✗ 管理
  ✗ 系統
  ✗ 維護
  ✗ 監控
空格2 replyOnCorrect：
  「手，和腦，不在同一層。這句話，現在說得出來了。」

bothCorrectDialogue：
  kk：「高文傑是手。但真正能動插件的人，在決策層——靠近林子睿的位置。」
  liu：「嫌疑矩陣上面要名單，不要小說。你把這個告訴我，我知道怎麼寫了。」

wrongFallback：
  「顧乃謙說：時間軸一拉開，高文傑像手；把權限樹一打開，他又太像被借來的手。」
```

---

### Ch6｜最後一場放映

#### Fill 1：張景衡的刪除

```
句子（三段）：
  [0] 「張景衡刪掉的那句話，讓整件事從『有人
  [1] 』，變成『系統
  [2] 』。」

空格1 hintLabel：「從『有人⋯⋯』」
空格1 選項（6張）：
  ✓ 這樣做了    B1 正解
  ✗ 下了指令
  ✗ 調整了設定
  ✗ 介入了系統
  ✗ 發出命令
  ✗ 讓它發生
空格1 replyOnCorrect：
  「有人這樣做了——這句話裡有主詞，有動詞，有責任。」

空格2 hintLabel：「變成『系統⋯⋯』」
空格2 選項（6張）：
  ✓ 本來就這樣  B2 正解
  ✗ 發生問題了
  ✗ 需要修復
  ✗ 出現異常
  ✗ 有些落差
  ✗ 管理不當
空格2 replyOnCorrect：
  「系統本來就這樣——這句話裡沒有主詞，沒有動詞，沒有可以追的人。」

bothCorrectDialogue：
  kk：「從『有人這樣做了』到『系統本來就這樣』——兩句話之間，是一個人的責任消失的過程。張景衡刪掉的是主詞，也是追查的起點。」
  liu：「那份說帖修改版本——你手上有嗎？」

wrongFallback：
  「張景衡說：先發出去的那份，就會比較像真的。你不是在跟我爭資料，你是在跟時間爭。想想他刪掉的是什麼。」
```

#### Fill 2：林子睿的沉默

```
句子（三段）：
  [0] 「林子睿說『讓一個洞繼續存在』，那句話的意思是——
  [1] 也是一種
  [2] 。」

空格1 hintLabel：「什麼也是一種指令？」
空格1 選項（6張）：
  ✓ 沉默     B1 正解
  ✗ 等待
  ✗ 忽略
  ✗ 放棄
  ✗ 放手
  ✗ 不說
空格1 replyOnCorrect：
  「他沒有按下任何按鈕。他只是讓某個已經存在的洞，繼續存在。」

空格2 hintLabel：「沉默也是一種⋯⋯」
空格2 選項（6張）：
  ✓ 指令     B2 正解
  ✗ 選擇
  ✗ 決定
  ✗ 答案
  ✗ 方式
  ✗ 默許
空格2 replyOnCorrect：
  「不動，也是一個命令。讓洞存在到對的時機被看見——這是主動的。」

bothCorrectDialogue：
  kk：「沉默也是一種指令。他不需要自己動手。他只要不阻止。」
  liu：「林子睿對那三份回報的擱置——他說那是決定，不是疏漏。你記下來了？」

wrongFallback：
  「林子睿說：系統複雜，不代表陰謀存在。多半只是管理落後。但你看他說了幾次『管理落後』，那是答案還是台詞？」
```

---

## 七、修改清單與執行順序

### Phase 1：型別與資料（無 UI 影響）

| # | 工作項目 | 檔案 | 影響範圍 |
|---|---|---|---|
| 1 | 新增 `TwoBlankFillConfig` 型別 | `FloatingFillBlankCore.ts` | 型別定義 |
| 2 | 新增 `reportFills` 欄位至 `ChapterReasoning` interface | `reasoningByChapter.ts` | 型別 |
| 3 | 為 ch1~ch6 各加入 `reportFills: [fill1, fill2]` 資料 | `reasoningByChapter.ts` | 資料 |

### Phase 2：新元件

| # | 工作項目 | 檔案 | 說明 |
|---|---|---|---|
| 4 | 建立 `ReportFillBlank.tsx` | `components/` | 雙空格浮動填空元件 |
| 5 | 在 `ReportFillBlank` 中整合 `generateScatteredPositions` | 沿用現有函式 | 卡片散佈位置 |

### Phase 3：整合進回報流程

| # | 工作項目 | 檔案 | 說明 |
|---|---|---|---|
| 6 | 修改 `ReasoningPanel` 步驟型別為 `ReasoningStep` | `ReasoningPanel.tsx` | 加入 fill1/fill2 步驟 |
| 7 | 整合 `ReportFillBlank` 至 `ReasoningPanel` fill 步驟 | `ReasoningPanel.tsx` | 有 reportFills 才顯示 |
| 8 | 修改按鈕文字：「推理分析」→「向劉隊回報」 | `page.tsx` | 文案更新 |
| 9 | （已移除獨立填空測試按鈕） | — | 填空僅在報告／結算流程內 |

### Phase 4：驗收與細調

| # | 工作項目 |
|---|---|
| 10 | 各章流程測試（含錯誤填法、打散重排、強制繼續） |
| 11 | 無 `reportFills` 資料時降級為現有流程的相容性確認 |
| 12 | 動畫時序細調（blank1→blank2 卡池切換節奏） |

---

## 八、驗收標準

| 項目 | 標準 |
|---|---|
| 六章一致 | 每章回報流程步驟相同：intro → fill1 → fill2 → Q1 → Q3 → outro |
| 填空 UI 一致 | 使用相同元件，視覺語言與現有浮動卡相同 |
| 雙空格順序 | B1 填完後 B2 才啟動，不可跨越 |
| 錯誤不封鎖 | 填錯可繼續，回報仍能完成（僅影響 flag，不影響進度） |
| 降級相容 | 若章節無 `reportFills` 資料，流程從 Q1 開始，不報錯 |
| 開發模式 | `?dev=1` 顯示旗標測試等開發工具（獨立填空測試已移除） |
| 動畫流暢 | B1→B2 卡池切換有淡出/進場動畫，不閃爍 |
| 打散重排 | 每道填空均可重排，不清除已填的另一格答案 |

---

## 附錄：`ReasoningPanel` 步驟流程圖

```
開始
  │
  ▼
[intro]  劉隊 introLine 顯示
  │  「開始回報」→
  ▼
[fill1]  <ReportFillBlank fill1Config />  ← 全屏填空
  │  onComplete →
  ▼
[fill2]  <ReportFillBlank fill2Config />  ← 全屏填空
  │  onComplete →
  ▼
[q1]  三選一判斷題
  │  確認 →
  ▼
[q3]  線索連連看（Q2 廢除為獨立步驟）
  │  完成配對 →
  ▼
[outro]  劉隊 outroStandard
         ↓
      outroPlayerLines 選擇（0~3 項）
         ↓
      「完成回報」→ onComplete()
  │
  ▼
結束，章節結算
```

---

*文件版本：v1.0｜待確認後進入實作階段*
