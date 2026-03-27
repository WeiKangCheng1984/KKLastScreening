import type { TwoBlankFillConfig } from '@/components/FloatingFillBlankCore';

/**
 * 第二章章尾：向劉隊報告
 * - 雙格填空：`ReportFillBlank`（僅 2 題）
 * - 手機省電謎：`Ch2CrowPhoneRiddle`（電池→省電→顯影→「已讀」確認）
 * - 第二輪章尾：**烏鴉**（鍵盤）＋ **WRC 三格轉盤**；顯影帶出梁以安導演隱藏訊息線
 */

/** 與 `acceptablePenNameAnswers` 比對前使用（trim、全形半形、去空白） */
export function normalizeCh2KeywordAnswer(raw: string): string {
  return raw
    .trim()
    .replace(/[\uFF01-\uFF5E]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0))
    .replace(/\s+/g, '');
}

/** 三館代號正解（左→右），與轉盤選取比對 */
export const ch2TriWheelCorrect = ['W', 'R', 'C'] as const;

/** 假目標：僅本地切換，不觸發過關 */
export interface Ch2PhoneDecoy {
  id: string;
  label: string;
  ariaLabel: string;
  feedbackWhenOff: string;
  feedbackWhenOn: string;
}

export interface Ch2PhoneWrongFeedback {
  /** 尚未開啟低耗顯影就按「已讀」時 */
  hintWhenNoReveal: string;
}

export interface Ch2PhoneRiddleConfig {
  /** 裝置頂部一行（背包內預覽） */
  deviceScreenTitle: string;
  /** 草稿區：表層（亂碼／混淆字） */
  draftSurfaceLines: string[];
  /** 草稿區：省電顯影後可讀線索（宜含蓄；不直寫謎底字串） */
  draftRevealLines: string[];
  /** 顯影後主按鈕（確認已讀備忘） */
  confirmReadLabel: string;
  /** 按鈕上方一句補充（可選） */
  confirmReadHint?: string;
  /** 第二輪章尾：筆名輸入 */
  round2PenNameLabel: string;
  round2PenNamePlaceholder: string;
  /** 筆名與 `acceptablePenNameAnswers` 不符時 */
  round2PenNameWrongHint: string;
  /** 可接受筆名（比對用 `normalizeCh2KeywordAnswer`） */
  acceptablePenNameAnswers: string[];
  /** 筆名對但三館轉盤未對齊時 */
  round2TriWheelWrongHint: string;
  /** 左→右三格標籤（教學／無障礙） */
  triWheelColumns: [string, string, string];
  /** 每格可選字母（含 W、R、C 與干擾字元） */
  triWheelAlphabet: string[];
  /** 正解三元組（通常為 `ch2TriWheelCorrect`） */
  triWheelCorrect: readonly [string, string, string];
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
  /** 封存已讀後、關閉道具前顯示的成功回饋 */
  successTitle: string;
  successMessage: string;
  /** 成功態主按鈕（再呼叫 onSuccess） */
  successContinueLabel: string;
}

/** 第二輪章尾 overlay 文案（與驗證字無關） */
export interface Ch2ReportRound2PanelCopy {
  liuClosing: string;
  supplement: string;
  finalizeButtonLabel: string;
}

/** 第一輪完成後、尚未讀畢手機時的提示 */
export interface Ch2ReportInterstitialCopy {
  afterRound1NeedPhone: string;
}

export interface Ch2ReportConfig {
  ch2ReportFillBlanks: TwoBlankFillConfig[];
  ch2PhoneRiddle: Ch2PhoneRiddleConfig;
  ch2ReportRound2Panel: Ch2ReportRound2PanelCopy;
  ch2ReportInterstitial: Ch2ReportInterstitialCopy;
}

export const ch2ReportFillBlanks: TwoBlankFillConfig[] = [
  {
    id: 'ch2_report_q1',
    sentenceParts: [
      '卷宗很乖，只認戶籍那兩個字；城市不乖，抬頭、署名、口徑可以多線並存。（口頭流傳的那套先不進卷。）你要寫進報告、能對上對外稿與署名欄的「那一格」是「',
      '」；把它折成職能，他是拿筆去撞流程的人，也就是「',
      '」。',
    ],
    blank1: {
      hintLabel: 'KK：紙上先認得的，是哪一個名字？',
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
      hintLabel: 'KK：筆尖撞的是哪一類現場？',
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
      liu: '寫能對卷的。嘴上的不算。',
    },
    wrongFallback:
      'KK：風裡喊的、紙上印的，別混成同一個人。',
  },
  {
    id: 'ch2_report_q2',
    sentenceParts: [
      '手機私訊很吵，情緒會幫你配音。可比較像推理的問法是：這條線為何讀起來「太順」？太順通常是「',
      '」。掩護後面那根冷的座標，比較會和「',
      '」疊在一起。',
    ],
    blank1: {
      hintLabel: 'KK：太順的，多半是什麼？',
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
        ch2r2_1k1: '貼圖戰很精彩，但精彩很少能當呈堂證供，除非你想呈的是青少年。',
      },
    },
    blank2: {
      hintLabel: 'KK：冷的那條，會跟什麼疊在一起？',
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
      kk: '你越讀越像愛情片，地圖卻越讀越像內部文件，這種落差，才叫線索。',
      liu: '動機欄留空。先把代號與舊案寫成能對的。',
    },
    wrongFallback:
      'KK：故事好讀，地圖未必好走。別用醋意去釘權限。',
  },
];

const ch2TriWheelAlphabet = ['W', 'R', 'C', 'A', 'B', 'D', 'M', 'K'];

export const ch2PhoneRiddle: Ch2PhoneRiddleConfig = {
  deviceScreenTitle: '未同步備忘 · 吳亞',
  draftSurfaceLines: [
    '【導言｜刪】節能那套上線後，散場像被遙控，（此段語氣太硬，暫不寄）',
    '私訊殘句：壓節能稿；「她也在」；三起不是數字，是欄位名。',
    'W／R／C 在腦中亂跳，像在試哪一段路最常寫進新聞。',
    '不能寄。寄了就是幫他們把喪事收成喜訊。',
  ],
  draftRevealLines: [
    '螢幕暗下來，才聽見自己怕什麼：不是死，是名字被別人先填進欄位。',
    '鎖著一則標題刺眼的備忘片斷，跟梁以安導演、跟現場壓不下的情緒有關；要開它，對外得先叫對筆名，三館代號也要轉到那晚他心裡對的位置。',
    '這支機子不認勇氣，只認你願不願意把「烏鴉」兩個字與 W、R、C 對齊，對齊了，藏著的那行字才肯浮上來。',
  ],
  confirmReadLabel: '讀完了',
  confirmReadHint: '心裡先對齊筆名與三館，再回劉隊那邊開口。',
  round2PenNameLabel: '對外筆名',
  round2PenNamePlaceholder: '兩個字',
  round2PenNameWrongHint: '劉隊眉頭一皺：「抬頭那兩個字，跟他對外用的不一致。」',
  acceptablePenNameAnswers: ['烏鴉'],
  round2TriWheelWrongHint: '劉隊：「三館那三格，你在地圖上不是繞過？」',
  triWheelColumns: ['左格', '中格', '右格'] as [string, string, string],
  triWheelAlphabet: ch2TriWheelAlphabet,
  triWheelCorrect: ch2TriWheelCorrect,
  powerSaveDialogTitle: '螢幕太亮',
  powerSaveDialogMessage:
    '電量見底了。要不要把螢幕壓暗？暗下來，有些字才肯從雜訊裡浮上來，也省一點電。',
  powerSaveConfirmLabel: '壓暗',
  powerSaveCancelLabel: '先不要',
  powerOffDialogTitle: '拉回亮度',
  powerOffDialogMessage: '亮度一回來，剛剛浮出來那層字會先沉回去。',
  powerOffConfirmLabel: '拉回',
  powerOffCancelLabel: '維持暗的',
  statusBarPowerSaveHint: '暗屏',
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
    hintWhenNoReveal: '亮度還太誠實，字不會跟你講真話。先把螢幕壓暗。',
  },
  successTitle: '備忘已封存',
  successMessage:
    '暗屏下讀到的線索已記下。回劉隊那邊開口前，筆名與三館代號先在心裡對齊。',
  successContinueLabel: '繼續',
};

export const ch2ReportRound2Panel: Ch2ReportRound2PanelCopy = {
  liuClosing:
    '劉隊把筆記本闔上。\n\n「手機裡還壓著一則跟梁以安導演有關的東西，情緒很尖。名字與三館對不對，決定我們進大廳要叫住誰。」',
  supplement:
    '「筆名對了，轉盤對了，那條才讀得到。別讓我拿猜的去問人。」',
  finalizeButtonLabel: '就這版，往上遞',
};

export const ch2ReportInterstitial: Ch2ReportInterstitialCopy = {
  afterRound1NeedPhone:
    '阿蘇那邊還扣著一支機子：劉隊點頭前她不願意讓螢幕上的東西被多看一眼。等你能從終端旁領走它、把暗下來才讀得到的讀完，再回劉隊把話收乾淨。',
};

export const ch2ReportConfig: Ch2ReportConfig = {
  ch2ReportFillBlanks,
  ch2PhoneRiddle,
  ch2ReportRound2Panel,
  ch2ReportInterstitial,
};
