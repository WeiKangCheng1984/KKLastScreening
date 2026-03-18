import type { TwoBlankFillConfig } from '@/components/FloatingFillBlankCore';

/**
 * 第四章章尾：向劉隊報告（5 題雙格填空）
 * - 玩法：兩格一次填完 → 一次送出判定（由 ReportFillBlank 實作）
 * - 判定：每格 correctIds 可多組（同精神即可）
 * - 特定 KUSO 錯誤：用 wrongRepliesByChoiceId 給專屬回饋；其餘錯誤走 wrongFallback
 */
export const ch4ReportFillBlanks: TwoBlankFillConfig[] = [
  {
    id: 'ch4_report_q1',
    sentenceParts: [
      '節能燈提前切換的那 3 分鐘，對兇手來說是',
      '，不是',
      '。',
    ],
    blank1: {
      hintLabel: '第一格：那 3 分鐘比較像什麼？',
      options: [
        { id: 'c4q1_1a', label: '窗口', fullText: '窗口', x: 0.22, y: 0.18, rotation: -8 },
        { id: 'c4q1_1b', label: '空檔', fullText: '空檔', x: 0.5, y: 0.14, rotation: 7 },
        { id: 'c4q1_1c', label: '掩護', fullText: '掩護', x: 0.76, y: 0.2, rotation: -6 },
        { id: 'c4q1_1d', label: '測試窗口', fullText: '測試窗口', x: 0.3, y: 0.36, rotation: 10 },
        // KUSO
        { id: 'c4q1_1k1', label: '下班倒數', fullText: '下班倒數', x: 0.2, y: 0.62, rotation: -12 },
        { id: 'c4q1_1k2', label: '靈魂出竅時間', fullText: '靈魂出竅時間', x: 0.52, y: 0.66, rotation: 9 },
        { id: 'c4q1_1k3', label: '觀眾冷笑話時段', fullText: '觀眾冷笑話時段', x: 0.82, y: 0.6, rotation: -9 },
      ],
      correctIds: ['c4q1_1a', 'c4q1_1b', 'c4q1_1c', 'c4q1_1d'],
      replyOnCorrect: '那是被設計出來的黑暗窗口，不是偶然。',
      wrongRepliesByChoiceId: {
        c4q1_1k1: '如果只是下班倒數，燈不會剛好早三分鐘。這叫做有人在算你。',
        c4q1_1k2: '靈魂出竅交給恐怖片。這裡只有人為切換。',
      },
    },
    blank2: {
      hintLabel: '第二格：它不是什麼？',
      options: [
        { id: 'c4q1_2a', label: '意外', fullText: '意外', x: 0.24, y: 0.16, rotation: -7 },
        { id: 'c4q1_2b', label: '疏失', fullText: '疏失', x: 0.52, y: 0.12, rotation: 9 },
        { id: 'c4q1_2c', label: '節能', fullText: '節能', x: 0.78, y: 0.18, rotation: -6 },
        { id: 'c4q1_2d', label: '巧合', fullText: '巧合', x: 0.28, y: 0.34, rotation: 10 },
        // KUSO
        { id: 'c4q1_2k1', label: '天氣太好', fullText: '天氣太好', x: 0.2, y: 0.63, rotation: -11 },
        { id: 'c4q1_2k2', label: '水逆', fullText: '水逆', x: 0.52, y: 0.67, rotation: 10 },
        { id: 'c4q1_2k3', label: '電費心情不好', fullText: '電費心情不好', x: 0.82, y: 0.62, rotation: -8 },
      ],
      correctIds: ['c4q1_2a', 'c4q1_2b', 'c4q1_2d', 'c4q1_2c'],
      replyOnCorrect: '三分鐘太準，準到不像意外。',
      wrongRepliesByChoiceId: {
        c4q1_2k2: '水逆不會把燈切到剛好。剛好通常是人。',
        c4q1_2k3: '電費不會簽核。簽核的人會。',
      },
    },
    bothCorrectDialogue: {
      kk: '那 3 分鐘是窗口。窗口被放出來，就會有人走進去。',
      liu: '我可以寫「提前切換造成黑暗窗口」。下一句要寫的是：誰能讓它提前。',
    },
    wrongFallback: '重點是「早 3 分鐘」的精準：那更像一個窗口，不像節能或疏失。',
  },
  {
    id: 'ch4_report_q2',
    sentenceParts: [
      '事故當下的順序是「燈先滅、廣播後響」——這不是設備故障，是',
      '被',
      '過。',
    ],
    blank1: {
      hintLabel: '第一格：被改的是什麼？',
      options: [
        { id: 'c4q2_1a', label: '序列', fullText: '序列', x: 0.22, y: 0.18, rotation: -8 },
        { id: 'c4q2_1b', label: '順序', fullText: '順序', x: 0.5, y: 0.14, rotation: 7 },
        { id: 'c4q2_1c', label: '流程', fullText: '流程', x: 0.76, y: 0.2, rotation: -6 },
        { id: 'c4q2_1d', label: '腳本', fullText: '腳本', x: 0.3, y: 0.36, rotation: 10 },
        // KUSO
        { id: 'c4q2_1k1', label: '運氣', fullText: '運氣', x: 0.2, y: 0.62, rotation: -12 },
        { id: 'c4q2_1k2', label: '氣氛', fullText: '氣氛', x: 0.52, y: 0.66, rotation: 9 },
        { id: 'c4q2_1k3', label: 'BGM', fullText: 'BGM', x: 0.82, y: 0.6, rotation: -9 },
      ],
      correctIds: ['c4q2_1a', 'c4q2_1b', 'c4q2_1c', 'c4q2_1d'],
      replyOnCorrect: '順序被改，現場就會像故障一樣亂。',
      wrongRepliesByChoiceId: {
        c4q2_1k1: '運氣只會讓人摔一次。被改過的順序會讓人摔很多次。',
        c4q2_1k3: 'BGM 不會讓燈提前。面板會。',
      },
    },
    blank2: {
      hintLabel: '第二格：被怎麼改？',
      options: [
        { id: 'c4q2_2a', label: '調整', fullText: '調整', x: 0.22, y: 0.2, rotation: -7 },
        { id: 'c4q2_2b', label: '更動', fullText: '更動', x: 0.52, y: 0.14, rotation: 8 },
        { id: 'c4q2_2c', label: '改寫', fullText: '改寫', x: 0.78, y: 0.22, rotation: -6 },
        { id: 'c4q2_2d', label: '重排', fullText: '重排', x: 0.28, y: 0.36, rotation: 11 },
        // KUSO
        { id: 'c4q2_2k1', label: '靠心情', fullText: '靠心情', x: 0.2, y: 0.63, rotation: -11 },
        { id: 'c4q2_2k2', label: '靠直覺', fullText: '靠直覺', x: 0.52, y: 0.67, rotation: 10 },
        { id: 'c4q2_2k3', label: '靠玄學', fullText: '靠玄學', x: 0.82, y: 0.62, rotation: -8 },
      ],
      correctIds: ['c4q2_2a', 'c4q2_2b', 'c4q2_2c', 'c4q2_2d'],
      replyOnCorrect: '故障會亂，改寫會準。這個準，是人為。',
      wrongRepliesByChoiceId: {
        c4q2_2k3: '玄學不會留下 8 秒延遲。延遲能被寫進 log。',
      },
    },
    bothCorrectDialogue: {
      kk: '燈先滅、廣播後響，這種錯拍不是老化，是人為順序。',
      liu: '我會寫「疏散序列異常」。但你要幫我指出：這個異常對誰有利。',
    },
    wrongFallback: '記住順序：燈先滅、廣播後響。故障通常不這麼精準，精準的是改寫。',
  },
  {
    id: 'ch4_report_q3',
    sentenceParts: [
      '副面板區的版本號與城市影城一致：v2.3.1-',
      '。這代表這不是單館問題，而是同一套',
      '在跑。',
    ],
    blank1: {
      hintLabel: '第一格：版本後綴是什麼？',
      options: [
        { id: 'c4q3_1a', label: 'patch07', fullText: 'patch07', x: 0.22, y: 0.18, rotation: -8 },
        { id: 'c4q3_1b', label: 'patch', fullText: 'patch', x: 0.5, y: 0.14, rotation: 7 },
        { id: 'c4q3_1c', label: '同 patch', fullText: '同 patch', x: 0.76, y: 0.2, rotation: -6 },
        // KUSO
        { id: 'c4q3_1k1', label: 'patchy可愛版', fullText: 'patchy可愛版', x: 0.2, y: 0.62, rotation: -12 },
        { id: 'c4q3_1k2', label: 'patchy快樂版', fullText: 'patchy快樂版', x: 0.52, y: 0.66, rotation: 9 },
        { id: 'c4q3_1k3', label: 'patchy不想上班版', fullText: 'patchy不想上班版', x: 0.82, y: 0.6, rotation: -9 },
      ],
      correctIds: ['c4q3_1a', 'c4q3_1b', 'c4q3_1c'],
      replyOnCorrect: '不是同一套軟體，是同一個 patch 版本。',
      wrongRepliesByChoiceId: {
        c4q3_1k3: '軟體可以不想上班，事故不會。',
      },
    },
    blank2: {
      hintLabel: '第二格：同一套什麼在跑？',
      options: [
        { id: 'c4q3_2a', label: '插件', fullText: '插件', x: 0.24, y: 0.16, rotation: -7 },
        { id: 'c4q3_2b', label: '系統', fullText: '系統', x: 0.52, y: 0.12, rotation: 9 },
        { id: 'c4q3_2c', label: '介面', fullText: '介面', x: 0.78, y: 0.18, rotation: -6 },
        { id: 'c4q3_2d', label: '版本', fullText: '版本', x: 0.28, y: 0.34, rotation: 10 },
        // KUSO
        { id: 'c4q3_2k1', label: '同一個脾氣', fullText: '同一個脾氣', x: 0.2, y: 0.63, rotation: -11 },
        { id: 'c4q3_2k2', label: '同一個傳說', fullText: '同一個傳說', x: 0.52, y: 0.67, rotation: 10 },
        { id: 'c4q3_2k3', label: '同一個鍋', fullText: '同一個鍋', x: 0.82, y: 0.62, rotation: -8 },
      ],
      correctIds: ['c4q3_2a', 'c4q3_2b', 'c4q3_2c', 'c4q3_2d'],
      replyOnCorrect: '同一個版本，代表問題可能在部署鏈上。',
      wrongRepliesByChoiceId: {
        c4q3_2k3: '鍋可以甩，人不一定甩得掉。版本號比較誠實。',
      },
    },
    bothCorrectDialogue: {
      kk: '同 patch 不是巧合。這是同一套東西在不同館重播。',
      liu: '我會寫「同版部署」。接下來要追的是：誰決定這個版本跑在三館。',
    },
    wrongFallback: '版本一致的重點是「同一個 patch」。那代表不是單館故障，是同一套部署。',
  },
  {
    id: 'ch4_report_q4',
    sentenceParts: [
      '陳佑誠的三份風險回報單，格式都對、優先級也對，卻在流程裡被',
      '。這不是遺忘，是',
      '。',
    ],
    blank1: {
      hintLabel: '第一格：它們在流程裡發生了什麼？',
      options: [
        { id: 'c4q4_1a', label: '擱置', fullText: '擱置', x: 0.22, y: 0.18, rotation: -8 },
        { id: 'c4q4_1b', label: '中止', fullText: '中止', x: 0.5, y: 0.14, rotation: 7 },
        { id: 'c4q4_1c', label: '消失', fullText: '消失', x: 0.76, y: 0.2, rotation: -6 },
        { id: 'c4q4_1d', label: '卡住', fullText: '卡住', x: 0.3, y: 0.36, rotation: 10 },
        // KUSO
        { id: 'c4q4_1k1', label: '進垃圾桶', fullText: '進垃圾桶', x: 0.2, y: 0.62, rotation: -12 },
        { id: 'c4q4_1k2', label: '被貓叼走', fullText: '被貓叼走', x: 0.52, y: 0.66, rotation: 9 },
        { id: 'c4q4_1k3', label: '自動蒸發', fullText: '自動蒸發', x: 0.82, y: 0.6, rotation: -9 },
      ],
      correctIds: ['c4q4_1a', 'c4q4_1b', 'c4q4_1c', 'c4q4_1d'],
      replyOnCorrect: '「消失」不是自然現象，通常是流程決策。',
      wrongRepliesByChoiceId: {
        c4q4_1k2: '貓叼走會留下貓毛。這裡什麼都沒留下。',
        c4q4_1k3: '蒸發是物理，這是管理。',
      },
    },
    blank2: {
      hintLabel: '第二格：它更像什麼？',
      options: [
        { id: 'c4q4_2a', label: '決定', fullText: '決定', x: 0.22, y: 0.2, rotation: -7 },
        { id: 'c4q4_2b', label: '選擇', fullText: '選擇', x: 0.52, y: 0.14, rotation: 8 },
        { id: 'c4q4_2c', label: '默許', fullText: '默許', x: 0.78, y: 0.22, rotation: -6 },
        { id: 'c4q4_2d', label: '擱置的習慣', fullText: '擱置的習慣', x: 0.28, y: 0.36, rotation: 11 },
        // KUSO
        { id: 'c4q4_2k1', label: '巧合', fullText: '巧合', x: 0.2, y: 0.63, rotation: -11 },
        { id: 'c4q4_2k2', label: '命運', fullText: '命運', x: 0.52, y: 0.67, rotation: 10 },
        { id: 'c4q4_2k3', label: '宇宙的安排', fullText: '宇宙的安排', x: 0.82, y: 0.62, rotation: -8 },
      ],
      correctIds: ['c4q4_2a', 'c4q4_2b', 'c4q4_2c', 'c4q4_2d'],
      replyOnCorrect: '流程停下來的那一格，就是責任開始的地方。',
      wrongRepliesByChoiceId: {
        c4q4_2k3: '宇宙不簽核。簽核的人會。',
      },
    },
    bothCorrectDialogue: {
      kk: '三份回報不是沒送到，是送到了該停下來的位置。',
      liu: '我會寫「風險回報未被處置」。接下來要查的是：最後一關停在哪裡。',
    },
    wrongFallback: '三份都消失就不是疏忽。流程裡的「停下來」，通常是決定。',
  },
  {
    id: 'ch4_report_q5',
    sentenceParts: [
      '這個 patch 版本的燈控可以被',
      '觸發，不需要',
      '授權。',
    ],
    blank1: {
      hintLabel: '第一格：可以被哪種方式觸發？',
      options: [
        { id: 'c4q5_1a', label: '遠端', fullText: '遠端', x: 0.22, y: 0.18, rotation: -8 },
        { id: 'c4q5_1b', label: '跨館', fullText: '跨館', x: 0.5, y: 0.14, rotation: 7 },
        { id: 'c4q5_1c', label: '非本地', fullText: '非本地', x: 0.76, y: 0.2, rotation: -6 },
        // KUSO
        { id: 'c4q5_1k1', label: '用眼神', fullText: '用眼神', x: 0.2, y: 0.62, rotation: -12 },
        { id: 'c4q5_1k2', label: '用通靈', fullText: '用通靈', x: 0.52, y: 0.66, rotation: 9 },
        { id: 'c4q5_1k3', label: '用意念', fullText: '用意念', x: 0.82, y: 0.6, rotation: -9 },
      ],
      correctIds: ['c4q5_1a', 'c4q5_1b', 'c4q5_1c'],
      replyOnCorrect: '能遠端觸發，就代表操作人不一定在現場。',
      wrongRepliesByChoiceId: {
        c4q5_1k1: '眼神收不到 log。遠端會留下痕跡。',
        c4q5_1k2: '通靈不需要帳號。遠端需要。',
      },
    },
    blank2: {
      hintLabel: '第二格：不需要什麼授權？',
      options: [
        { id: 'c4q5_2a', label: '本地', fullText: '本地', x: 0.22, y: 0.2, rotation: -7 },
        { id: 'c4q5_2b', label: '現場', fullText: '現場', x: 0.52, y: 0.14, rotation: 8 },
        { id: 'c4q5_2c', label: '當館', fullText: '當館', x: 0.78, y: 0.22, rotation: -6 },
        { id: 'c4q5_2d', label: '本機', fullText: '本機', x: 0.28, y: 0.36, rotation: 11 },
        // KUSO
        { id: 'c4q5_2k1', label: '良心', fullText: '良心', x: 0.2, y: 0.63, rotation: -11 },
        { id: 'c4q5_2k2', label: '勇氣', fullText: '勇氣', x: 0.52, y: 0.67, rotation: 10 },
        { id: 'c4q5_2k3', label: '運氣', fullText: '運氣', x: 0.82, y: 0.62, rotation: -8 },
      ],
      correctIds: ['c4q5_2a', 'c4q5_2b', 'c4q5_2c', 'c4q5_2d'],
      replyOnCorrect: '這種權限設計，會把「在場」變成假線索。',
      wrongRepliesByChoiceId: {
        c4q5_2k1: '良心不在權限表裡，本地授權在。',
      },
    },
    bothCorrectDialogue: {
      kk: '遠端觸發讓「誰在現場」變得不重要。重要的是誰能進系統。',
      liu: '我會寫「遠端觸發可能」。但要押人，我們得把那個入口找出來。',
    },
    wrongFallback: '第四章的關鍵是「遠端」。它讓操作者可以不在現場，但一定在系統裡。',
  },
];

