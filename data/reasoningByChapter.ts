/**
 * 每章推理分析題目（ch1～ch6）
 * 三題型：Q1 三選一、Q2 字詞推理、Q3 道具分析連連看
 * 另附 reportFills：向劉隊回報的雙空格浮動填空（各章兩道）
 */
import { TwoBlankFillConfig } from '@/components/FloatingFillBlankCore';
import { ch3ReportFillBlanks } from '@/data/ch3ReportConfig';

export interface ReasoningQ1 {
  question: string;
  options: { id: string; text: string }[];
}

export interface ReasoningQ2 {
  question: string;
  type: 'input';
  placeholder?: string;
}

export interface ReasoningQ3 {
  question: string;
  leftItems: { id: string; label: string }[];
  rightItems: { id: string; label: string }[];
  correctPairs: [string, string][]; // [leftId, rightId]
}

export interface ChapterPoliceConfig {
  /**
   * 劉隊在章節開始時給 KK 的簡短交代／任務說明（不劇透結論）。
   */
  introLine: string;
  /**
   * 若提供，第一章開場會拆成兩段顯示（兩則對話依序）；未提供時使用 introLine 單則。
   */
  introLines?: string[];
  /**
   * 在玩家完成推理後，劉隊給出的「可寫進報告」的標準結論。
   */
  outroStandard: string;
  /**
   * 玩家可以要求劉隊加進紀錄／報告裡的句子（例如流程、人性、證據三種角度）。
   * 尚未在 UI 中實作選項時，可先當作文案庫使用。
   */
  outroPlayerLines?: { id: string; text: string }[];
}

export interface ChapterReasoning {
  q1: ReasoningQ1;
  q2: ReasoningQ2;
  q3: ReasoningQ3;
  /**
   * 每章與警方角色（劉隊）相關的互動文案與邏輯設定。
   */
  police?: ChapterPoliceConfig;
  /**
   * 向劉隊回報機制的雙空格浮動填空（兩道，出現在 Q1 之前）。
   * 若未提供，回報流程直接從 Q1 開始（降級相容）。
   */
  reportFills?: [TwoBlankFillConfig, TwoBlankFillConfig];
}

// ─────────────────────────────────────────────────────────────────────────────
// 向劉隊回報：雙空格浮動填空資料（六章）
// sentenceParts: [段落0] + BLANK1 + [段落1] + BLANK2 + [段落2]
// ─────────────────────────────────────────────────────────────────────────────

const reportFillsCh1: [TwoBlankFillConfig, TwoBlankFillConfig] = [
  {
    id: 'ch1_fill1',
    sentenceParts: ['「散場的燈不是', '晚，\n那個黑暗是一個被', '好的空窗。」'],
    blank1: {
      hintLabel: '那段燈的延遲，是⋯⋯',
      options: [
        { id: 'ch1_f1_A', label: '自然',  fullText: '自然',  x: 0.18, y: 0.18, rotation: -9  },
        { id: 'ch1_f1_B', label: '故障',  fullText: '故障',  x: 0.44, y: 0.13, rotation:  7  },
        { id: 'ch1_f1_C', label: '意外',  fullText: '意外',  x: 0.70, y: 0.19, rotation: -5  },
        { id: 'ch1_f1_D', label: '設備',  fullText: '設備',  x: 0.82, y: 0.31, rotation:  9  },
        { id: 'ch1_f1_E', label: '緊急',  fullText: '緊急',  x: 0.28, y: 0.34, rotation:  4  },
        { id: 'ch1_f1_F', label: '工作',  fullText: '工作',  x: 0.60, y: 0.38, rotation:-12  },
      ],
      correctIds: ['ch1_f1_A'],
      replyOnCorrect: '不是設備問題，也不是意外。它讓人不追，才是它真正的功能。',
    },
    blank2: {
      hintLabel: '那個空窗，是被⋯⋯好的？',
      options: [
        { id: 'ch1_f2_A', label: '設計',  fullText: '設計',  x: 0.22, y: 0.17, rotation: -8  },
        { id: 'ch1_f2_B', label: '忽略',  fullText: '忽略',  x: 0.50, y: 0.12, rotation:  7  },
        { id: 'ch1_f2_C', label: '允許',  fullText: '允許',  x: 0.74, y: 0.20, rotation: -6  },
        { id: 'ch1_f2_D', label: '測試',  fullText: '測試',  x: 0.30, y: 0.35, rotation: 11  },
        { id: 'ch1_f2_E', label: '安排',  fullText: '安排',  x: 0.60, y: 0.30, rotation: -9  },
        { id: 'ch1_f2_F', label: '調整',  fullText: '調整',  x: 0.82, y: 0.37, rotation:  5  },
      ],
      correctIds: ['ch1_f2_A'],
      replyOnCorrect: 'KK 想：設計，不是失誤，是刻意。',
    },
    bothCorrectDialogue: {
      kk: '燈不是自然晚。那個黑，是被準備好的。',
      liu: '所以你認為——有人申請了它，或者有人知道它不會被追。',
    },
    wrongFallback: '再想想。燈的延遲讓人沒辦法責怪任何一個人，這是它存在的意義。',
  },
  {
    id: 'ch1_fill2',
    sentenceParts: ['「能把一件事藏進', '裡，\n代表那個人對這套', '很熟悉。」'],
    blank1: {
      hintLabel: '這件事被藏進了什麼裡面？',
      options: [
        { id: 'ch1_g1_A', label: '流程',  fullText: '流程',  x: 0.20, y: 0.20, rotation: -8  },
        { id: 'ch1_g1_B', label: '報告',  fullText: '報告',  x: 0.46, y: 0.14, rotation:  6  },
        { id: 'ch1_g1_C', label: '場館',  fullText: '場館',  x: 0.72, y: 0.19, rotation: -5  },
        { id: 'ch1_g1_D', label: '紀錄',  fullText: '紀錄',  x: 0.30, y: 0.36, rotation: 10  },
        { id: 'ch1_g1_E', label: '時間',  fullText: '時間',  x: 0.60, y: 0.31, rotation: -9  },
        { id: 'ch1_g1_F', label: '數字',  fullText: '數字',  x: 0.83, y: 0.35, rotation:  6  },
      ],
      correctIds: ['ch1_g1_A'],
      replyOnCorrect: '流程不是中性的。它能保護人，也能保護動作。',
    },
    blank2: {
      hintLabel: '他熟悉這套⋯⋯',
      options: [
        { id: 'ch1_g2_A', label: '系統',  fullText: '系統',  x: 0.22, y: 0.17, rotation: -7  },
        { id: 'ch1_g2_B', label: '場合',  fullText: '場合',  x: 0.48, y: 0.12, rotation:  9  },
        { id: 'ch1_g2_C', label: '環境',  fullText: '環境',  x: 0.75, y: 0.19, rotation: -5  },
        { id: 'ch1_g2_D', label: '設備',  fullText: '設備',  x: 0.28, y: 0.35, rotation: 11  },
        { id: 'ch1_g2_E', label: '規則',  fullText: '規則',  x: 0.60, y: 0.30, rotation: -8  },
        { id: 'ch1_g2_F', label: '格式',  fullText: '格式',  x: 0.84, y: 0.36, rotation:  5  },
      ],
      correctIds: ['ch1_g2_A'],
      replyOnCorrect: '不是外來者。是一個知道怎麼用這套系統的人。',
    },
    bothCorrectDialogue: {
      kk: '不是從外面破門的人。是站在門口、知道鑰匙怎麼用的人。',
      liu: '夠了。這句話，我能寫進去。',
    },
    wrongFallback: '殺人不需要很厲害。但讓死亡看起來像正常結束——這需要對什麼很熟悉？',
  },
];

const reportFillsCh2: [TwoBlankFillConfig, TwoBlankFillConfig] = [
  {
    id: 'ch2_fill1',
    sentenceParts: ['「烏鴉的名字被', '，\n不是因為案情需要保密，\n而是因為他在追的那條線', '了。」'],
    blank1: {
      hintLabel: '他的名字，被⋯⋯',
      options: [
        { id: 'ch2_f1_A', label: '壓住',  fullText: '壓住',  x: 0.20, y: 0.18, rotation: -8  },
        { id: 'ch2_f1_B', label: '確認',  fullText: '確認',  x: 0.46, y: 0.13, rotation:  7  },
        { id: 'ch2_f1_C', label: '保護',  fullText: '保護',  x: 0.70, y: 0.20, rotation: -5  },
        { id: 'ch2_f1_D', label: '公開',  fullText: '公開',  x: 0.30, y: 0.35, rotation: 10  },
        { id: 'ch2_f1_E', label: '調查',  fullText: '調查',  x: 0.58, y: 0.31, rotation: -9  },
        { id: 'ch2_f1_F', label: '記錄',  fullText: '記錄',  x: 0.84, y: 0.36, rotation:  5  },
      ],
      correctIds: ['ch2_f1_A'],
      replyOnCorrect: '不是程序問題。是有人不希望他的名字和他在追的事同時出現。',
    },
    blank2: {
      hintLabel: '他追的那條線⋯⋯了',
      options: [
        { id: 'ch2_f2_A', label: '傷到人', fullText: '傷到人', x: 0.22, y: 0.17, rotation: -7  },
        { id: 'ch2_f2_B', label: '中斷',   fullText: '中斷',   x: 0.48, y: 0.12, rotation:  8  },
        { id: 'ch2_f2_C', label: '消失',   fullText: '消失',   x: 0.74, y: 0.19, rotation: -5  },
        { id: 'ch2_f2_D', label: '曝光',   fullText: '曝光',   x: 0.28, y: 0.35, rotation: 11  },
        { id: 'ch2_f2_E', label: '複雜',   fullText: '複雜',   x: 0.60, y: 0.30, rotation: -8  },
        { id: 'ch2_f2_F', label: '失敗',   fullText: '失敗',   x: 0.83, y: 0.37, rotation:  6  },
      ],
      correctIds: ['ch2_f2_A'],
      replyOnCorrect: 'KK 停了一下：不是他的名字危險，是他知道的東西危險。',
    },
    bothCorrectDialogue: {
      kk: '他的身份不重要，重要的是他快要說出什麼了。',
      liu: '三起事故。他知道這個說法，而且知道它不只是說法。',
    },
    wrongFallback: '阿蘇說：我給你資料，不給你結論。再看一次他的錄音時間戳。',
  },
  {
    id: 'ch2_fill2',
    sentenceParts: ['「他用', '的聲音錄下那段話，\n代表他知道這件事如果', '，\n會讓某些人不舒服。」'],
    blank1: {
      hintLabel: '那段錄音的聲音是⋯⋯',
      options: [
        { id: 'ch2_g1_A', label: '處理過', fullText: '處理過', x: 0.20, y: 0.18, rotation: -8  },
        { id: 'ch2_g1_B', label: '加密',   fullText: '加密',   x: 0.46, y: 0.13, rotation:  7  },
        { id: 'ch2_g1_C', label: '低沉',   fullText: '低沉',   x: 0.72, y: 0.19, rotation: -5  },
        { id: 'ch2_g1_D', label: '模糊',   fullText: '模糊',   x: 0.30, y: 0.36, rotation: 10  },
        { id: 'ch2_g1_E', label: '偽裝',   fullText: '偽裝',   x: 0.58, y: 0.31, rotation: -9  },
        { id: 'ch2_g1_F', label: '陌生',   fullText: '陌生',   x: 0.84, y: 0.36, rotation:  5  },
      ],
      correctIds: ['ch2_g1_A'],
      replyOnCorrect: '刻意改過的聲音，是在說：我要被聽見，但不要被辨認出來。',
    },
    blank2: {
      hintLabel: '這件事如果⋯⋯，會讓人不舒服',
      options: [
        { id: 'ch2_g2_A', label: '被聽到', fullText: '被聽到', x: 0.22, y: 0.17, rotation: -7  },
        { id: 'ch2_g2_B', label: '消失',   fullText: '消失',   x: 0.48, y: 0.13, rotation:  8  },
        { id: 'ch2_g2_C', label: '出現',   fullText: '出現',   x: 0.74, y: 0.19, rotation: -5  },
        { id: 'ch2_g2_D', label: '傳出去', fullText: '傳出去', x: 0.28, y: 0.36, rotation: 11  },
        { id: 'ch2_g2_E', label: '公開',   fullText: '公開',   x: 0.60, y: 0.31, rotation: -8  },
        { id: 'ch2_g2_F', label: '曝光',   fullText: '曝光',   x: 0.84, y: 0.37, rotation:  5  },
      ],
      correctIds: ['ch2_g2_A'],
      replyOnCorrect: '他知道風險。他還是錄了。然後他去城市影城確認最後一件事。',
    },
    bothCorrectDialogue: {
      kk: '他很怕。但他不打算讓這件事跟他一起消失。',
      liu: '值得我們怕的，正是這個。他已經知道，而且快說出來了。',
    },
    wrongFallback: '阿蘇說：這份錄音不是技術問題造成的模糊。它是被刻意做成這樣的。',
  },
];

const reportFillsCh4: [TwoBlankFillConfig, TwoBlankFillConfig] = [
  {
    id: 'ch4_fill1',
    sentenceParts: ['「那三分鐘的黑，\n不是', '的故障，\n而是一個有', '的操作窗口。」'],
    blank1: {
      hintLabel: '那段黑暗，不是什麼的故障？',
      options: [
        { id: 'ch4_f1_A', label: '設備',  fullText: '設備',  x: 0.20, y: 0.18, rotation: -8  },
        { id: 'ch4_f1_B', label: '流程',  fullText: '流程',  x: 0.46, y: 0.13, rotation:  7  },
        { id: 'ch4_f1_C', label: '偶發',  fullText: '偶發',  x: 0.72, y: 0.19, rotation: -5  },
        { id: 'ch4_f1_D', label: '排程',  fullText: '排程',  x: 0.30, y: 0.35, rotation: 10  },
        { id: 'ch4_f1_E', label: '節能',  fullText: '節能',  x: 0.58, y: 0.31, rotation: -9  },
        { id: 'ch4_f1_F', label: '系統',  fullText: '系統',  x: 0.84, y: 0.36, rotation:  5  },
      ],
      correctIds: ['ch4_f1_A'],
      replyOnCorrect: '梁以安說黑得太早。不是太早，是剛好對的時間。',
    },
    blank2: {
      hintLabel: '有⋯⋯的操作窗口',
      options: [
        { id: 'ch4_f2_A', label: '目標',    fullText: '目標',    x: 0.22, y: 0.17, rotation: -7  },
        { id: 'ch4_f2_B', label: '節能指令', fullText: '節能指令', x: 0.48, y: 0.12, rotation:  8  },
        { id: 'ch4_f2_C', label: '操作失誤', fullText: '操作失誤', x: 0.74, y: 0.19, rotation: -5  },
        { id: 'ch4_f2_D', label: '排程設定', fullText: '排程設定', x: 0.28, y: 0.36, rotation: 11  },
        { id: 'ch4_f2_E', label: '技術原因', fullText: '技術原因', x: 0.60, y: 0.31, rotation: -8  },
        { id: 'ch4_f2_F', label: '管理疏失', fullText: '管理疏失', x: 0.84, y: 0.37, rotation:  5  },
      ],
      correctIds: ['ch4_f2_A'],
      replyOnCorrect: '樓梯轉角的監視死角——有人選了那裡。不是偶然進去的。',
    },
    bothCorrectDialogue: {
      kk: '人群踩上去，燈滅了，混亂出現了。不是事故，是一次有控制條件的測試。',
      liu: '你說的那份操作記錄，現在就是關鍵。',
    },
    wrongFallback: '差一點。這不是意外，它太剛好了。梁以安說：有人老說是節能，我聽起來比較像測試。',
  },
  {
    id: 'ch4_fill2',
    sentenceParts: ['「三份格式完整的回報，\n全部消失在', '流程裡，\n代表擱置它們是一個', '，不是遺忘。」'],
    blank1: {
      hintLabel: '回報消失在什麼流程裡？',
      options: [
        { id: 'ch4_g1_A', label: '審核',  fullText: '審核',  x: 0.20, y: 0.18, rotation: -8  },
        { id: 'ch4_g1_B', label: '維護',  fullText: '維護',  x: 0.46, y: 0.13, rotation:  7  },
        { id: 'ch4_g1_C', label: '申請',  fullText: '申請',  x: 0.72, y: 0.19, rotation: -5  },
        { id: 'ch4_g1_D', label: '管理',  fullText: '管理',  x: 0.30, y: 0.35, rotation: 10  },
        { id: 'ch4_g1_E', label: '技術',  fullText: '技術',  x: 0.58, y: 0.31, rotation: -9  },
        { id: 'ch4_g1_F', label: '上報',  fullText: '上報',  x: 0.84, y: 0.36, rotation:  5  },
      ],
      correctIds: ['ch4_g1_A'],
      replyOnCorrect: '格式對，優先級對，卻每次都沒有批示。不是沒人看到。',
    },
    blank2: {
      hintLabel: '擱置是一個⋯⋯，不是遺忘',
      options: [
        { id: 'ch4_g2_A', label: '決定',  fullText: '決定',  x: 0.22, y: 0.17, rotation: -7  },
        { id: 'ch4_g2_B', label: '失誤',  fullText: '失誤',  x: 0.48, y: 0.12, rotation:  8  },
        { id: 'ch4_g2_C', label: '疏忽',  fullText: '疏忽',  x: 0.74, y: 0.19, rotation: -5  },
        { id: 'ch4_g2_D', label: '錯誤',  fullText: '錯誤',  x: 0.28, y: 0.36, rotation: 11  },
        { id: 'ch4_g2_E', label: '問題',  fullText: '問題',  x: 0.60, y: 0.31, rotation: -8  },
        { id: 'ch4_g2_F', label: '習慣',  fullText: '習慣',  x: 0.84, y: 0.37, rotation:  5  },
      ],
      correctIds: ['ch4_g2_A'],
      replyOnCorrect: '有些擱置，不是因為太忙，是因為不希望那個洞被補起來。',
    },
    bothCorrectDialogue: {
      kk: '陳佑誠說：系統不怕壞，怕的是壞得剛剛好，像正常老化。三份回報都這樣消失，這是模式，不是疏失。',
      liu: '這條批示鏈的決定，在某個地方就停下來了。我想知道是哪裡。',
    },
    wrongFallback: '陳佑誠說：回報過，不是一次，格式都對，優先級也對，消失得更對。為什麼消失？',
  },
];

const reportFillsCh5: [TwoBlankFillConfig, TwoBlankFillConfig] = [
  {
    id: 'ch5_fill1',
    sentenceParts: ['「高文傑的紀錄完整到讓人', '，\n這不是清白，\n而是一份被', '好的說明書。」'],
    blank1: {
      hintLabel: '完整到讓人⋯⋯',
      options: [
        { id: 'ch5_f1_A', label: '懷疑',  fullText: '懷疑',  x: 0.20, y: 0.18, rotation: -8  },
        { id: 'ch5_f1_B', label: '相信',  fullText: '相信',  x: 0.46, y: 0.13, rotation:  7  },
        { id: 'ch5_f1_C', label: '放心',  fullText: '放心',  x: 0.72, y: 0.19, rotation: -5  },
        { id: 'ch5_f1_D', label: '確定',  fullText: '確定',  x: 0.30, y: 0.35, rotation: 10  },
        { id: 'ch5_f1_E', label: '誤解',  fullText: '誤解',  x: 0.58, y: 0.31, rotation: -9  },
        { id: 'ch5_f1_F', label: '分析',  fullText: '分析',  x: 0.84, y: 0.36, rotation:  5  },
      ],
      correctIds: ['ch5_f1_A'],
      replyOnCorrect: '阿蘇說：登入紀錄只證明帳號在場，不保證靈魂也在場。太整齊，反而可疑。',
    },
    blank2: {
      hintLabel: '一份被⋯⋯好的說明書',
      options: [
        { id: 'ch5_f2_A', label: '設計',  fullText: '設計',  x: 0.22, y: 0.17, rotation: -7  },
        { id: 'ch5_f2_B', label: '整理',  fullText: '整理',  x: 0.48, y: 0.12, rotation:  8  },
        { id: 'ch5_f2_C', label: '安排',  fullText: '安排',  x: 0.74, y: 0.19, rotation: -5  },
        { id: 'ch5_f2_D', label: '準備',  fullText: '準備',  x: 0.28, y: 0.36, rotation: 11  },
        { id: 'ch5_f2_E', label: '規劃',  fullText: '規劃',  x: 0.60, y: 0.31, rotation: -8  },
        { id: 'ch5_f2_F', label: '建立',  fullText: '建立',  x: 0.84, y: 0.37, rotation:  5  },
      ],
      correctIds: ['ch5_f2_A'],
      replyOnCorrect: '這份紀錄不是給你查案用的，是給你收案用的。',
    },
    bothCorrectDialogue: {
      kk: '帳號在場，不代表靈魂也在場。他的紀錄告訴我的，是有人需要這份紀錄存在。',
      liu: '那真正的操作者，在哪個層級？',
    },
    wrongFallback: '阿蘇說：我給你資料，不給你結論。這份紀錄可以讀出很多東西，再想一次你看到的。',
  },
  {
    id: 'ch5_fill2',
    sentenceParts: ['「插件權限樹的頂端靠近技術長，\n代表真正能', '插件的人\n不在執行層，\n而是在', '層。」'],
    blank1: {
      hintLabel: '能⋯⋯插件的人',
      options: [
        { id: 'ch5_g1_A', label: '修改',  fullText: '修改',  x: 0.20, y: 0.18, rotation: -8  },
        { id: 'ch5_g1_B', label: '使用',  fullText: '使用',  x: 0.46, y: 0.13, rotation:  7  },
        { id: 'ch5_g1_C', label: '操作',  fullText: '操作',  x: 0.72, y: 0.19, rotation: -5  },
        { id: 'ch5_g1_D', label: '維護',  fullText: '維護',  x: 0.30, y: 0.35, rotation: 10  },
        { id: 'ch5_g1_E', label: '更新',  fullText: '更新',  x: 0.58, y: 0.31, rotation: -9  },
        { id: 'ch5_g1_F', label: '部署',  fullText: '部署',  x: 0.84, y: 0.36, rotation:  5  },
      ],
      correctIds: ['ch5_g1_A'],
      replyOnCorrect: '顧乃謙說：真正能改插件的人，不需要每次自己登入。',
    },
    blank2: {
      hintLabel: '不在執行層，在⋯⋯層',
      options: [
        { id: 'ch5_g2_A', label: '決策',  fullText: '決策',  x: 0.22, y: 0.17, rotation: -7  },
        { id: 'ch5_g2_B', label: '技術',  fullText: '技術',  x: 0.48, y: 0.12, rotation:  8  },
        { id: 'ch5_g2_C', label: '管理',  fullText: '管理',  x: 0.74, y: 0.19, rotation: -5  },
        { id: 'ch5_g2_D', label: '系統',  fullText: '系統',  x: 0.28, y: 0.36, rotation: 11  },
        { id: 'ch5_g2_E', label: '維護',  fullText: '維護',  x: 0.60, y: 0.31, rotation: -8  },
        { id: 'ch5_g2_F', label: '監控',  fullText: '監控',  x: 0.84, y: 0.37, rotation:  5  },
      ],
      correctIds: ['ch5_g2_A'],
      replyOnCorrect: '手，和腦，不在同一層。這句話，現在說得出來了。',
    },
    bothCorrectDialogue: {
      kk: '高文傑是手。但真正能動插件的人，在決策層——靠近林子睿的位置。',
      liu: '嫌疑矩陣上面要名單，不要小說。你把這個告訴我，我知道怎麼寫了。',
    },
    wrongFallback: '顧乃謙說：時間軸一拉開，高文傑像手；把權限樹一打開，他又太像被借來的手。',
  },
];

const reportFillsCh6: [TwoBlankFillConfig, TwoBlankFillConfig] = [
  {
    id: 'ch6_fill1',
    sentenceParts: ['「張景衡刪掉的那句話，\n讓整件事從『有人', '』，\n變成『系統', '』。」'],
    blank1: {
      hintLabel: '從「有人⋯⋯」',
      options: [
        { id: 'ch6_f1_A', label: '這樣做了',    fullText: '這樣做了',    x: 0.18, y: 0.18, rotation: -8  },
        { id: 'ch6_f1_B', label: '下了指令',    fullText: '下了指令',    x: 0.46, y: 0.13, rotation:  7  },
        { id: 'ch6_f1_C', label: '調整了設定',  fullText: '調整了設定',  x: 0.72, y: 0.19, rotation: -5  },
        { id: 'ch6_f1_D', label: '介入了系統',  fullText: '介入了系統',  x: 0.28, y: 0.35, rotation: 10  },
        { id: 'ch6_f1_E', label: '發出命令',    fullText: '發出命令',    x: 0.58, y: 0.31, rotation: -9  },
        { id: 'ch6_f1_F', label: '讓它發生',    fullText: '讓它發生',    x: 0.84, y: 0.36, rotation:  5  },
      ],
      correctIds: ['ch6_f1_A'],
      replyOnCorrect: '有人這樣做了——這句話裡有主詞，有動詞，有責任。',
    },
    blank2: {
      hintLabel: '變成「系統⋯⋯」',
      options: [
        { id: 'ch6_f2_A', label: '本來就這樣', fullText: '本來就這樣', x: 0.20, y: 0.17, rotation: -7  },
        { id: 'ch6_f2_B', label: '發生問題了', fullText: '發生問題了', x: 0.48, y: 0.12, rotation:  8  },
        { id: 'ch6_f2_C', label: '需要修復',   fullText: '需要修復',   x: 0.74, y: 0.19, rotation: -5  },
        { id: 'ch6_f2_D', label: '出現異常',   fullText: '出現異常',   x: 0.28, y: 0.36, rotation: 11  },
        { id: 'ch6_f2_E', label: '有些落差',   fullText: '有些落差',   x: 0.60, y: 0.31, rotation: -8  },
        { id: 'ch6_f2_F', label: '管理不當',   fullText: '管理不當',   x: 0.84, y: 0.37, rotation:  5  },
      ],
      correctIds: ['ch6_f2_A'],
      replyOnCorrect: '系統本來就這樣——這句話裡沒有主詞，沒有動詞，沒有可以追的人。',
    },
    bothCorrectDialogue: {
      kk: '從「有人這樣做了」到「系統本來就這樣」——兩句話之間，是一個人的責任消失的過程。張景衡刪掉的是主詞，也是追查的起點。',
      liu: '那份說帖修改版本——你手上有嗎？',
    },
    wrongFallback: '張景衡說：先發出去的那份，就會比較像真的。你不是在跟我爭資料，你是在跟時間爭。想想他刪掉的是什麼。',
  },
  {
    id: 'ch6_fill2',
    sentenceParts: ['「林子睿說『讓一個洞繼續存在』，\n那句話的意思是——', '也是一種', '。」'],
    blank1: {
      hintLabel: '什麼也是一種指令？',
      options: [
        { id: 'ch6_g1_A', label: '沉默',  fullText: '沉默',  x: 0.20, y: 0.18, rotation: -8  },
        { id: 'ch6_g1_B', label: '等待',  fullText: '等待',  x: 0.46, y: 0.13, rotation:  7  },
        { id: 'ch6_g1_C', label: '忽略',  fullText: '忽略',  x: 0.72, y: 0.19, rotation: -5  },
        { id: 'ch6_g1_D', label: '放棄',  fullText: '放棄',  x: 0.30, y: 0.35, rotation: 10  },
        { id: 'ch6_g1_E', label: '放手',  fullText: '放手',  x: 0.58, y: 0.31, rotation: -9  },
        { id: 'ch6_g1_F', label: '不說',  fullText: '不說',  x: 0.84, y: 0.36, rotation:  5  },
      ],
      correctIds: ['ch6_g1_A'],
      replyOnCorrect: '他沒有按下任何按鈕。他只是讓某個已經存在的洞，繼續存在。',
    },
    blank2: {
      hintLabel: '沉默也是一種⋯⋯',
      options: [
        { id: 'ch6_g2_A', label: '指令',  fullText: '指令',  x: 0.22, y: 0.17, rotation: -7  },
        { id: 'ch6_g2_B', label: '選擇',  fullText: '選擇',  x: 0.48, y: 0.12, rotation:  8  },
        { id: 'ch6_g2_C', label: '決定',  fullText: '決定',  x: 0.74, y: 0.19, rotation: -5  },
        { id: 'ch6_g2_D', label: '答案',  fullText: '答案',  x: 0.28, y: 0.36, rotation: 11  },
        { id: 'ch6_g2_E', label: '方式',  fullText: '方式',  x: 0.60, y: 0.31, rotation: -8  },
        { id: 'ch6_g2_F', label: '默許',  fullText: '默許',  x: 0.84, y: 0.37, rotation:  5  },
      ],
      correctIds: ['ch6_g2_A'],
      replyOnCorrect: '不動，也是一個命令。讓洞存在到對的時機被看見——這是主動的。',
    },
    bothCorrectDialogue: {
      kk: '沉默也是一種指令。他不需要自己動手。他只要不阻止。',
      liu: '林子睿對那三份回報的擱置——他說那是決定，不是疏漏。你記下來了？',
    },
    wrongFallback: '林子睿說：系統複雜，不代表陰謀存在。多半只是管理落後。但你看他說了幾次「管理落後」，那是答案還是台詞？',
  },
];

export const reasoningByChapter: Record<string, ChapterReasoning> = {
  ch1: {
    q1: {
      question: '散場後亮燈延後，你認為最可能的原因是？',
      options: [
        { id: 'A', text: '流程疏失，排程被誤改' },
        { id: 'B', text: '有人刻意申請延後，製造時間窗口' },
        { id: 'C', text: '設備故障，與人為無關' },
      ],
    },
    q2: {
      question: '根據現場線索，請用一句話寫出你對「兇手特徵」的推論（例如：熟悉流程、能接觸燈控）。',
      type: 'input',
      placeholder: '輸入你的推論…',
    },
    q3: {
      question: '請將左側道具與右側線索意義連連看（點選兩兩配對後確認）。',
      leftItems: [
        { id: 'ticket', label: '電影票根' },
        { id: 'schedule', label: '播映時間表（塗改）' },
        { id: 'fragment', label: '黑色塑膠碎片' },
      ],
      rightItems: [
        { id: 'time', label: '死亡時間與場次吻合' },
        { id: 'window', label: '亮燈延後製造犯案窗口' },
        { id: 'glove', label: '疑似手套殘留' },
      ],
      correctPairs: [
        ['ticket', 'time'],
        ['schedule', 'window'],
        ['fragment', 'glove'],
      ],
    },
    police: {
      introLine:
        '現場我們會先封著，你來看一眼就好。影城那邊我們也通知了，品牌、技術什麼的都在路上，很快就到。你看到什麼，就照實說，我們再決定要不要往下挖。',
      /** 第一章開場若拆成兩段顯示，優先使用此陣列（兩則對話依序） */
      introLines: [
        '現場我們會先封著，你來看一眼就好。影城那邊我們也通知了，品牌、技術什麼的都在路上，很快就到。',
        '你看到什麼，就照實說，我們再決定要不要往下挖。',
      ],
      outroStandard:
        '我的工作是寫得出一份交得出去的報告。就目前資料，我可以寫：流程上有疏漏，現場處理不當。至於是不是「有人故意這樣設計」——那種句子，寫進去要很多證據。',
      outroPlayerLines: [
        {
          id: 'ch1_summary_flow',
          text: '燈不是自然晚，是被人改過。表格、手動模式、口頭指示……流程這次站在兇手那邊。',
        },
        {
          id: 'ch1_summary_scene',
          text: '現場乾淨得太刻意。有人花力氣把痕跡擦掉，卻忘了碎片比血跡難處理。',
        },
        {
          id: 'ch1_extra_report',
          text: '至少寫進去：這樣的燈光調整與清場節奏，未來若不被檢討，仍可能致人於死。',
        },
      ],
    },
    reportFills: reportFillsCh1,
  },
  ch2: {
    q1: {
      question: '關於「死者是誰」，你認為受害者身份被保密的主要原因可能是？',
      options: [
        { id: 'A', text: '警方尚未完成身份確認與家屬通知' },
        { id: 'B', text: '死者身份牽涉敏感線索，有人刻意壓消息' },
        { id: 'C', text: '純屬流程規定，與案情無關' },
      ],
    },
    q2: {
      question: '根據本章線索，請用一句話寫出你對「死者為何被盯上」或「流程與責任」的推論。',
      type: 'input',
      placeholder: '輸入你的推論…',
    },
    q3: {
      question: '請將左側線索與右側意義配對（死者是誰／城市影城外的風）。',
      leftItems: [
        { id: 'victim_info', label: '受害者基礎資料' },
        { id: 'encrypted', label: '加密訊息紀錄' },
        { id: 'column_draft', label: '專欄草稿片段' },
      ],
      rightItems: [
        { id: 'identity', label: '吳亞／烏鴉、專欄與職業' },
        { id: 'threat', label: '「三起事故」等敏感用語' },
        { id: 'unpublished', label: '未發表筆記與立場' },
      ],
      correctPairs: [
        ['victim_info', 'identity'],
        ['encrypted', 'threat'],
        ['column_draft', 'unpublished'],
      ],
    },
    police: {
      introLine:
        '阿蘇在車上，等她一會兒，她有技術組解完密的一部份。看看有什麼異樣值得查。',
      outroStandard:
        '通訊紀錄中多次出現「三起事故」等字眼，目前可視為內部說法或比喻，尚不足以構成具體預告。未完成錄音提到「結案報告有兩個版本」，經比對現有文件，暫時無法證實有正式報告遭到篡改。受害人長期書寫公共安全與外包議題，其焦慮可視為在高壓工作與輿論環境下的主觀反應。',
      outroPlayerLines: [
        {
          id: 'ch2_extra_procedure',
          text: '補一句：相關系統可重複調整散場節奏，未來仍有致人於危險之虞。',
        },
        {
          id: 'ch2_extra_human',
          text: '補一句：受害人的焦慮來源中，包含真實事故記憶與內部說法，不全屬臆測。',
        },
        {
          id: 'ch2_extra_evidence',
          text: '至少寫進去：目前資料不足以排除系統性問題，只是尚未取得完整證據。',
        },
      ],
    },
    reportFills: reportFillsCh2,
  },
  ch3: {
    q1: {
      question: '關於城市影城大廳的「口徑管理」，你認為背後最主要的意圖是？',
      options: [
        { id: 'A', text: '阻止「三起事故」這個說法被媒體串起來' },
        { id: 'B', text: '保護品牌形象，避免個別員工被過度指責' },
        { id: 'C', text: '爭取更多時間完成內部調查，再決定怎麼說' },
      ],
    },
    q2: {
      question: '根據顧乃謙的說法，整理版 log 與原始 log 的差異是什麼？請用一句話描述這個差異對案件調查的影響。',
      type: 'input',
      placeholder: '例如：少了操作來源 IP，無法確認是本機還是遠端操作…',
    },
    q3: {
      question: '請將左側線索與右側意義配對。',
      leftItems: [
        { id: 'whiteboard', label: '交接白板（重寫兩次）' },
        { id: 'filtered_log', label: '張景衡整理版 log' },
        { id: 'cross_venue_sync', label: '跨館同步異常片段' },
      ],
      rightItems: [
        { id: 'cover_up', label: '刻意覆蓋操作痕跡的行為' },
        { id: 'missing_field', label: '遺漏了操作來源與覆寫前原始值' },
        { id: 'shared_access', label: '兩館共用操作入口或同一操作人' },
      ],
      correctPairs: [
        ['whiteboard', 'cover_up'],
        ['filtered_log', 'missing_field'],
        ['cross_venue_sync', 'shared_access'],
      ],
    },
    police: {
      introLine:
        '品牌和技術組都來了，每個人都有一個版本。你去看一下大廳、會議室（含技術角列印區），告訴我——哪一個版本少了什麼。',
      outroStandard:
        '目前可寫進報告的是：場控系統具備分區自動排程功能，與現場說法不符，存在資訊落差。整理版 log 缺少操作來源 IP 及覆寫前原始值，無法完整還原操作路徑。城市 W 與光芒 R 設備位於同一子網段，版本更新記錄具時間相關性，不排除跨館操作存在。',
      outroPlayerLines: [
        {
          id: 'ch3_extra_procedure',
          text: '補一句：整理版 log 的欄位缺失屬選擇性遺漏，非格式問題，建議調取原始檔進行比對。',
        },
        {
          id: 'ch3_extra_human',
          text: '補一句：宋雅甄及張景衡的應對話術草稿顯示，「三起事故」一詞被刻意迴避，建議列為敘事管理的調查對象。',
        },
        {
          id: 'ch3_extra_evidence',
          text: '至少寫進去：跨館同步操作記錄在案發三週前已存在，應調取顧乃謙遠端登入紀錄進行比對。',
        },
      ],
    },
    reportFills: ch3ReportFillBlanks as [TwoBlankFillConfig, TwoBlankFillConfig],
  },
  ch4: {
    q1: {
      question: '節能燈提前切換的那 3 分鐘，對你而言代表什麼？',
      options: [
        { id: 'ch4_q1_a', text: '這是操作失誤，屬偶發事故，沒有針對性。' },
        { id: 'ch4_q1_b', text: '這是一個窗口：黑暗、人群移動、沒有廣播——事故的條件被刻意製造。' },
        { id: 'ch4_q1_c', text: '這是節能政策執行不當，主要是管理問題，與案件無直接關係。' },
      ],
    },
    q2: {
      question: '陳佑誠送出三份風險回報，每份格式正確、優先級標準，但每份都消失在審核流程裡。這件事告訴你什麼？',
      type: 'input',
      placeholder: '有些擱置不是遺忘，是……',
    },
    q3: {
      question: '把下列線索與它所揭露的意涵配對',
      leftItems: [
        { id: 'ch4_clue_1', label: '節能燈提前切換記錄' },
        { id: 'ch4_clue_2', label: '與城市影城同版插件截圖' },
        { id: 'ch4_clue_3', label: '被擱置的三份風險回報' },
        { id: 'ch4_clue_4', label: '面板手動切換區域指紋' },
      ],
      rightItems: [
        { id: 'ch4_mean_1', label: '黑暗是被安排的，不是意外' },
        { id: 'ch4_mean_2', label: '同一漏洞可在多館同步被利用' },
        { id: 'ch4_mean_3', label: '有人不希望漏洞被修掉' },
        { id: 'ch4_mean_4', label: '操作者知道目標位置，且準備好脫身路線' },
      ],
      correctPairs: [
        ['ch4_clue_1', 'ch4_mean_1'],
        ['ch4_clue_2', 'ch4_mean_2'],
        ['ch4_clue_3', 'ch4_mean_3'],
        ['ch4_clue_4', 'ch4_mean_4'],
      ],
    },
    police: {
      introLine:
        '光芒影城那次沒有人死，所以上面很快就關案了。但你看了樓梯間的記錄，聽過陳佑誠的技術線、也對過梁以安的現場證詞之後，我想聽你怎麼說。',
      outroStandard:
        '目前可寫進報告的是：光芒影城散場事故中，燈控操作時間與正常流程有 3 分鐘落差，不符合節能設定邏輯。插件版本與城市影城一致，遠端推送帳號為共用系統維護帳號，無法排除跨館遠端操作可能性。維護技術員陳佑誠前後三次提交風險回報均未獲批示，回報紀錄顯示其知悉遠端燈控觸發漏洞，應調查回報流程中止的決策鏈。',
      outroPlayerLines: [
        {
          id: 'ch4_extra_procedure',
          text: '補一句：三份風險回報的批示鏈中止點應列入調查，若為刻意擱置而非系統性疏漏，可能涉及知情不報。',
        },
        {
          id: 'ch4_extra_human',
          text: '補一句：梁以安的現場證詞與陳佑誠的技術分析互相補強，建議作為第二起事故「非意外」判定的並列佐證。',
        },
        {
          id: 'ch4_extra_evidence',
          text: '至少寫進去：面板手動切換區域指紋與側門鞋印的方向性，指向一名操作後快速脫身的人——不是維修人員的行動模式。',
        },
      ],
    },
    reportFills: reportFillsCh4,
  },
  ch5: {
    q1: {
      question: '高文傑的登入紀錄與命案時間「接近但不完全吻合」。這個描述，對你而言代表什麼？',
      options: [
        { id: 'ch5_q1_a', text: '「接近」已足夠，登入紀錄是直接證據，可以押人。' },
        { id: 'ch5_q1_b', text: '「接近」不夠——帳號在場不等於靈魂在場，需要原始 log 的來源欄位才能確認。' },
        { id: 'ch5_q1_c', text: '「接近」是故意設計的：讓他看起來最可疑，而真正的人不在紀錄裡。' },
      ],
    },
    q2: {
      question: '整理版 log 比原始版少了哪四類欄位？這四個欄位的共同作用是什麼？',
      type: 'input',
      placeholder: '能說清楚誰在哪裡做了什麼的欄位，剛好都不見了……',
    },
    q3: {
      question: '把下列線索與它在嫌疑矩陣中揭露的意涵配對',
      leftItems: [
        { id: 'ch5_clue_1', label: '高文傑登入紀錄（接近但不完整吻合）' },
        { id: 'ch5_clue_2', label: '插件權限樹（頂端靠近技術長）' },
        { id: 'ch5_clue_3', label: 'Unknown 訊息語感 ≈ 張景衡文件語感' },
        { id: 'ch5_clue_4', label: '林子睿通話三次說「管理落後不是陰謀」' },
      ],
      rightItems: [
        { id: 'ch5_mean_1', label: '好用的替身，不是真正的操作者' },
        { id: 'ch5_mean_2', label: '能動插件的人不是在執行層，而在決策層' },
        { id: 'ch5_mean_3', label: 'Unknown 可能是一種職能，不是一個人' },
        { id: 'ch5_mean_4', label: '風險框架被習慣性地壓低，是模式不是失誤' },
      ],
      correctPairs: [
        ['ch5_clue_1', 'ch5_mean_1'],
        ['ch5_clue_2', 'ch5_mean_2'],
        ['ch5_clue_3', 'ch5_mean_3'],
        ['ch5_clue_4', 'ch5_mean_4'],
      ],
    },
    police: {
      introLine:
        '嫌疑矩陣上面要，但我想知道你看完那張表之後的看法——不是表上面寫的，是你自己判斷的。',
      outroStandard:
        '目前可寫進報告的是：高文傑登入紀錄與命案時間有接近性，但整理版 log 缺少操作來源 IP、失敗登入記錄與遠端節點識別碼，無法確認帳號持有者為操作者本人。插件授權結構顯示高文傑層級無插件修改或多館部署權限，該層級授權靠近技術長職位。Unknown 訊息語感與張景衡公關文件具語感相似性，不排除訊息框架來源為同一個利益方向。',
      outroPlayerLines: [
        {
          id: 'ch5_extra_procedure',
          text: '補一句：陳佑誠三份風險回報的批示鏈中止點，應與插件授權結構頂層對應人員進行比對，確認是否存在知情不處理的決策責任。',
        },
        {
          id: 'ch5_extra_human',
          text: '補一句：高文傑的說法具體且自洽，且主動提供追查方向（共用帳號登入來源），行為模式不符合預謀犯罪者的典型迴避模式。',
        },
        {
          id: 'ch5_extra_evidence',
          text: '至少寫進去：若能取得原始 log，應立即核驗操作來源 IP 及失敗登入記錄，這兩個欄位能直接區分「帳號在場」與「操作者在場」。',
        },
      ],
    },
    reportFills: reportFillsCh5,
  },
  ch6: {
    q1: {
      question: '張景衡把說帖裡「遠端操作存在可能性」這整句話刪掉了。這個刪除，代表什麼？',
      options: [
        { id: 'ch6_q1_a', text: '公關稿不需要技術細節，這是正常的編輯決策。' },
        { id: 'ch6_q1_b', text: '刪掉這句話，讓整個敘事框架從「有人操作」變成「系統問題」——這是刻意的。' },
        { id: 'ch6_q1_c', text: '他在替林子睿製造口徑：操作者消失了，剩下一個讓人沒辦法追責的版本。' },
      ],
    },
    q2: {
      question: '林子睿說：「我讓一個已經存在的洞繼續存在，等它在對的時機被看見。」這句話的真正意思是什麼？',
      type: 'input',
      placeholder: '沉默也是一種指令……',
    },
    q3: {
      question: '把下列最終關鍵線索與它在案件中的功能配對',
      leftItems: [
        { id: 'ch6_clue_1', label: '中控室原始 log（D7 封存的意義）' },
        { id: 'ch6_clue_2', label: '張景衡說帖刪除「遠端操作可能性」' },
        { id: 'ch6_clue_3', label: '林子睿「等危機把舊結構燒掉」' },
        { id: 'ch6_clue_4', label: '第三起事故與第二起相同序列' },
      ],
      rightItems: [
        { id: 'ch6_mean_1', label: '唯一能確認操作者身分的物證' },
        { id: 'ch6_mean_2', label: '敘事層的剪裁：讓文字版本取代真相版本' },
        { id: 'ch6_mean_3', label: '結構性動機：用代價換系統升級' },
        { id: 'ch6_mean_4', label: '第三起是驗證，不是意外重演' },
      ],
      correctPairs: [
        ['ch6_clue_1', 'ch6_mean_1'],
        ['ch6_clue_2', 'ch6_mean_2'],
        ['ch6_clue_3', 'ch6_mean_3'],
        ['ch6_clue_4', 'ch6_mean_4'],
      ],
    },
    police: {
      introLine:
        '記者會在等，宋雅甄在等，張景衡在等。你先跟我說你看到了什麼——然後我們再一起決定這份報告裡要寫什麼。',
      outroStandard:
        '目前可寫進報告的是：第三起事故時間序列與第二起高度吻合，面板記錄遠端連線節點識別碼，指向非本地操作。中控室門禁異常顯示事故前後有人進出但未記錄身分。張景衡修改說帖刪除「遠端操作存在可能性」，涉嫌操控對外敘事框架。林子睿於訪談中承認對陳佑誠三份風險回報的擱置為「決定」而非疏漏，且對部分操作時機「不排除非巧合」，應列為重要關係人繼續調查。',
      outroPlayerLines: [
        {
          id: 'ch6_extra_raw',
          text: '補一句：若中控室原始 log 已封存，建議立即與整理版比對遠端節點完整識別碼，此欄位可直接對應操作者連線來源。',
        },
        {
          id: 'ch6_extra_lin',
          text: '補一句：林子睿對「沉默是否等同決定」的回答具體且自指，建議以「知情不處理」為方向展開對其決策鏈的正式調查。',
        },
        {
          id: 'ch6_extra_zhang',
          text: '至少寫進去：張景衡說帖的修改版本與 Unknown 訊息的語感特徵高度吻合，建議將張景衡列為「敘事管理鏈」的重要節點，而非單純的公關執行者。',
        },
      ],
    },
    reportFills: reportFillsCh6,
  },
};
