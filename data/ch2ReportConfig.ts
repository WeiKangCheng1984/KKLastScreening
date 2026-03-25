import type { TwoBlankFillConfig } from '@/components/FloatingFillBlankCore';

/**
 * 第二章章尾：向劉隊報告
 * - 雙格填空：`ReportFillBlank`（僅 2 題）
 * - 手機省電謎：`Ch2CrowPhoneRiddle`（電池→省電→顯影→字詞輸入）
 */

/** 假目標：僅本地切換，不觸發過關 */
export interface Ch2PhoneDecoy {
  id: string;
  label: string;
  ariaLabel: string;
  feedbackWhenOff: string;
  feedbackWhenOn: string;
}

export interface Ch2PhoneWrongFeedback {
  kk: string;
  liu: string;
  /** 尚未讀過顯影層就送出時的含蓄提示（可選） */
  hintWhenNoReveal?: string;
}

export interface Ch2PhoneRiddleConfig {
  /** 草稿區：表層（亂碼／混淆字） */
  draftSurfaceLines: string[];
  /** 草稿區：省電顯影後可讀線索（語意上應呼應 `acceptableAnswers`，宜含蓄） */
  draftRevealLines: string[];
  /** 輸入框標籤／提示 */
  inputLabel: string;
  inputPlaceholder: string;
  /** 可接受字詞（比對前會 trim、全形半形簡化） */
  acceptableAnswers: string[];
  /** 狀態列電池：開啟省電確認 */
  powerSaveDialogTitle: string;
  powerSaveDialogMessage: string;
  powerSaveConfirmLabel: string;
  powerSaveCancelLabel: string;
  /** 關閉省電確認 */
  powerOffDialogTitle: string;
  powerOffDialogMessage: string;
  powerOffConfirmLabel: string;
  powerOffCancelLabel: string;
  /** 省電模式開啟後狀態列顯示 */
  statusBarPowerSaveHint: string;
  decoys: Ch2PhoneDecoy[];
  wrongFeedback: Ch2PhoneWrongFeedback;
}

export interface Ch2ReportConfig {
  ch2ReportFillBlanks: TwoBlankFillConfig[];
  ch2PhoneRiddle: Ch2PhoneRiddleConfig;
}

export const ch2ReportFillBlanks: TwoBlankFillConfig[] = [
  {
    id: 'ch2_report_q1',
    sentenceParts: [
      '卷宗很乖，只認戶籍那兩個字；城市不乖，會用抬頭、署名、讀者口頭的稱呼。（圈內有人喊他烏鴉——你不必跟風，但耳朵要聽見。）你要寫進報告的「對外名字」是「',
      '」；把它折成職能，他是拿筆去撞流程的人——也就是「',
      '」。',
    ],
    blank1: {
      hintLabel: 'KK：大家先認得的，是哪一種「對外名字」？',
      options: [
        { id: 'ch2r1_1a', label: '烏鴉', fullText: '烏鴉', x: 0.22, y: 0.18, rotation: -8 },
        { id: 'ch2r1_1b', label: '專欄抬頭那個名字', fullText: '專欄抬頭那個名字', x: 0.48, y: 0.14, rotation: 7 },
        { id: 'ch2r1_1c', label: '調查欄固定署名', fullText: '調查欄固定署名', x: 0.74, y: 0.2, rotation: -6 },
        {
          id: 'ch2r1_1d',
          label: '讀者／圈內先認得的那個稱呼',
          fullText: '讀者／圈內先認得的那個稱呼',
          x: 0.26,
          y: 0.34,
          rotation: 9,
        },
        { id: 'ch2r1_1k1', label: '爆料小編 ID', fullText: '爆料小編 ID', x: 0.2, y: 0.58, rotation: -11 },
        { id: 'ch2r1_1k2', label: '外送備註：放警衛室', fullText: '外送備註：放警衛室', x: 0.52, y: 0.62, rotation: 8 },
        { id: 'ch2r1_1k3', label: '論壇十七樓樓主', fullText: '論壇十七樓樓主', x: 0.8, y: 0.58, rotation: -7 },
      ],
      correctIds: ['ch2r1_1a', 'ch2r1_1b', 'ch2r1_1c', 'ch2r1_1d'],
      replyOnCorrect: '對。門牌對了，才知道他敲的是哪一戶系統。',
      wrongRepliesByChoiceId: {
        ch2r1_1k2: '外送備註也能寫得很像遺言，但它通常只對準你的胃。',
        ch2r1_1k3: '樓主很會蓋樓，但蓋不出能對卷的署名。',
      },
    },
    blank2: {
      hintLabel: 'KK：把名字折成職能——他拿筆尖去撞哪一類現場？',
      options: [
        {
          id: 'ch2r1_2a',
          label: '寫公共流程／外包驗證敘事的人',
          fullText: '寫公共流程／外包驗證敘事的人',
          x: 0.2,
          y: 0.16,
          rotation: -7,
        },
        { id: 'ch2r1_2b', label: '把事故寫成議題的人', fullText: '把事故寫成議題的人', x: 0.52, y: 0.12, rotation: 8 },
        {
          id: 'ch2r1_2c',
          label: '調查型專欄書寫者',
          fullText: '調查型專欄書寫者',
          x: 0.78,
          y: 0.18,
          rotation: -5,
        },
        {
          id: 'ch2r1_2d',
          label: '監督欄位與對外敘事的人',
          fullText: '監督欄位與對外敘事的人',
          x: 0.28,
          y: 0.32,
          rotation: 10,
        },
        { id: 'ch2r1_2k1', label: '寫星座週運的人', fullText: '寫星座週運的人', x: 0.22, y: 0.56, rotation: -10 },
        { id: 'ch2r1_2k2', label: '寫業配的人', fullText: '寫業配的人', x: 0.52, y: 0.6, rotation: 9 },
        { id: 'ch2r1_2k3', label: '開團連結主', fullText: '開團連結主', x: 0.8, y: 0.56, rotation: -8 },
      ],
      correctIds: ['ch2r1_2a', 'ch2r1_2b', 'ch2r1_2c', 'ch2r1_2d'],
      replyOnCorrect: '可以。這樣寫，第三章進大廳你才知道怕的不是文章，是欄位。',
      wrongRepliesByChoiceId: {
        ch2r1_2k2: '業配也能寫得很有良心，但它撞的是轉換率，不是責任鏈。',
      },
    },
    bothCorrectDialogue: {
      kk: '名字像門牌。門牌越多，越要問：他到底想讓誰開門。',
      liu: '寫能對卷的。別把綽號當成就。',
    },
    wrongFallback:
      'KK：先對「外面怎麼叫他」，再對「他拿這個叫法幹嘛」。順序亂了，你會以為自己在寫粉絲應援。',
  },
  {
    id: 'ch2_report_q2',
    sentenceParts: [
      '手機私訊很吵，情緒會幫你配音。可比較像推理的問法是：這條線為何讀起來「太順」？太順通常是「',
      '」。掩護後面那根冷的座標，比較會和「',
      '」疊在一起。',
    ],
    blank1: {
      hintLabel: 'KK：太順、太完整，通常不是生活，是——',
      options: [
        { id: 'ch2r2_1a', label: '像被先剪過情緒', fullText: '像被先剪過情緒', x: 0.22, y: 0.18, rotation: -8 },
        { id: 'ch2r2_1b', label: '表層故事被排好順序', fullText: '表層故事被排好順序', x: 0.48, y: 0.14, rotation: 7 },
        {
          id: 'ch2r2_1c',
          label: '讀起來像劇本而非生活殘渣',
          fullText: '讀起來像劇本而非生活殘渣',
          x: 0.72,
          y: 0.2,
          rotation: -6,
        },
        {
          id: 'ch2r2_1d',
          label: '最好吞的解釋被放最前面',
          fullText: '最好吞的解釋被放最前面',
          x: 0.28,
          y: 0.34,
          rotation: 9,
        },
        { id: 'ch2r2_1k1', label: '貼圖戰太精彩', fullText: '貼圖戰太精彩', x: 0.2, y: 0.58, rotation: -11 },
        { id: 'ch2r2_1k2', label: '他已讀不回職業級', fullText: '他已讀不回職業級', x: 0.52, y: 0.62, rotation: 8 },
        { id: 'ch2r2_1k3', label: '分行很像在寫詩', fullText: '分行很像在寫詩', x: 0.8, y: 0.58, rotation: -7 },
      ],
      correctIds: ['ch2r2_1a', 'ch2r2_1b', 'ch2r2_1c', 'ch2r2_1d'],
      replyOnCorrect: '對。完整常常是陷阱；缺口才是座標。',
      wrongRepliesByChoiceId: {
        ch2r2_1k1: '貼圖戰很精彩，但精彩很少能當呈堂證供——除非你想呈的是青少年。',
      },
    },
    blank2: {
      hintLabel: 'KK：跟那條冷線疊在一起的硬座標是——',
      options: [
        { id: 'ch2r2_2a', label: '幾個館的代號／縮寫', fullText: '幾個館的代號／縮寫', x: 0.2, y: 0.16, rotation: -7 },
        { id: 'ch2r2_2b', label: '跨館節點與轉折點', fullText: '跨館節點與轉折點', x: 0.48, y: 0.12, rotation: 8 },
        {
          id: 'ch2r2_2c',
          label: '兩年前樓梯間那套說法的殘影',
          fullText: '兩年前樓梯間那套說法的殘影',
          x: 0.74,
          y: 0.18,
          rotation: -5,
        },
        {
          id: 'ch2r2_2d',
          label: '舊傷在流程圖上的接點',
          fullText: '舊傷在流程圖上的接點',
          x: 0.28,
          y: 0.32,
          rotation: 10,
        },
        { id: 'ch2r2_2k1', label: '健身房課表', fullText: '健身房課表', x: 0.22, y: 0.56, rotation: -10 },
        { id: 'ch2r2_2k2', label: '感情紀念日', fullText: '感情紀念日', x: 0.52, y: 0.6, rotation: 9 },
        { id: 'ch2r2_2k3', label: '停車月租到期日', fullText: '停車月租到期日', x: 0.78, y: 0.56, rotation: -8 },
      ],
      correctIds: ['ch2r2_2a', 'ch2r2_2b', 'ch2r2_2c', 'ch2r2_2d'],
      replyOnCorrect: '對。私事能解釋醋意，解釋不了「為什麼剛好跨好幾個館」。',
      wrongRepliesByChoiceId: {
        ch2r2_2k2: '紀念日很硬，但硬的是你的心，不是權限表。',
      },
    },
    bothCorrectDialogue: {
      kk: '你越讀越像愛情片，地圖卻越讀越像內部文件——這種落差，才叫線索。',
      liu: '動機欄留空。先把代號與舊案寫成能對的。',
    },
    wrongFallback:
      'KK：第一格處理「誰幫你把故事變好讀」；第二格才落地。別用八卦當釘子，釘子會歪。',
  },
];

export const ch2PhoneRiddle: Ch2PhoneRiddleConfig = {
  draftSurfaceLines: [
    '■□◇※＃＠ 同步失敗 0x7F2A · 重試排隊中',
    '備忘：欄位抬頭／署名欄／讀者口徑（多線並存）',
    '路由片段：▓▓▓ → ▒▒▒ → （此列僅索引）',
    '系統提示：長稿可折行；短稿請對齊欄位。',
  ],
  draftRevealLines: [
    '備忘（低耗對比）：',
    '對外欄位先填「圈內先喊開的那個稱呼」——與卷宗抬頭能對上的寫法。',
    '館名與代號往後排；這一筆只負責讓人知道你在寫誰。',
  ],
  inputLabel: '依備忘可讀線索，輸入對外稱呼（詞）',
  inputPlaceholder: '輸入詞語',
  acceptableAnswers: ['烏鴉', '乌鸦'],
  powerSaveDialogTitle: '低耗顯示',
  powerSaveDialogMessage: '電量偏低。是否改為低耗顯示？對比會調整，較省電。',
  powerSaveConfirmLabel: '確定',
  powerSaveCancelLabel: '取消',
  powerOffDialogTitle: '關閉低耗顯示',
  powerOffDialogMessage: '恢復一般顯示。備忘的另一層會先隱藏。',
  powerOffConfirmLabel: '關閉',
  powerOffCancelLabel: '保留',
  statusBarPowerSaveHint: '低耗',
  decoys: [
    {
      id: 'wifi',
      label: 'Wi‑Fi',
      ariaLabel: '切換 Wi‑Fi',
      feedbackWhenOff: 'Wi‑Fi 已關。',
      feedbackWhenOn: 'Wi‑Fi 已開，連線正常。',
    },
    {
      id: 'bt',
      label: '藍牙',
      ariaLabel: '切換藍牙',
      feedbackWhenOff: '藍牙已關。',
      feedbackWhenOn: '藍牙已開。',
    },
    {
      id: 'dnd',
      label: '勿擾',
      ariaLabel: '切換勿擾模式',
      feedbackWhenOff: '勿擾已關。',
      feedbackWhenOn: '勿擾已開。',
    },
    {
      id: 'fake_restore',
      label: '還原',
      ariaLabel: '嘗試還原',
      feedbackWhenOff: '無可用備份還原。',
      feedbackWhenOn: '仍無可用版本。',
    },
  ],
  wrongFeedback: {
    kk: '欄位對了，字才上得了紙。你剛剛那句，卷宗不認。',
    liu: '報告用詞要能和系統對上。再想。',
    hintWhenNoReveal: '草稿好像還有一層沒對齊；對照備忘再看一次。',
  },
};

export const ch2ReportConfig: Ch2ReportConfig = {
  ch2ReportFillBlanks,
  ch2PhoneRiddle,
};
