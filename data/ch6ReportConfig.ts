import type { TwoBlankFillConfig } from '@/components/FloatingFillBlankCore';

/**
 * 第六章章尾：向劉隊報告（5 題雙格填空）
 * - 玩法：兩格一次填完 → 一次送出判定（由 ReportFillBlank 實作）
 * - 判定：每格 correctIds 可多組（同精神即可）
 * - 特定 KUSO 錯誤：用 wrongRepliesByChoiceId 給專屬回饋；其餘錯誤走 wrongFallback
 */
export const ch6ReportFillBlanks: TwoBlankFillConfig[] = [
  {
    id: 'ch6_report_q1',
    sentenceParts: [
      '第三起事故的時序和第二起一致。這不是',
      '，是同一套操作邏輯被',
      '。',
    ],
    blank1: {
      hintLabel: '第一格：這不是什麼？',
      options: [
        { id: 'c6q1_1a', label: '巧合', fullText: '巧合', x: 0.22, y: 0.18, rotation: -8 },
        { id: 'c6q1_1b', label: '故障復發', fullText: '故障復發', x: 0.5, y: 0.14, rotation: 7 },
        { id: 'c6q1_1c', label: '老化', fullText: '老化', x: 0.76, y: 0.2, rotation: -6 },
        // KUSO
        { id: 'c6q1_1k1', label: '水逆', fullText: '水逆', x: 0.2, y: 0.62, rotation: -12 },
        { id: 'c6q1_1k2', label: '宇宙的幽默', fullText: '宇宙的幽默', x: 0.52, y: 0.66, rotation: 9 },
        { id: 'c6q1_1k3', label: '劇本需要', fullText: '劇本需要', x: 0.82, y: 0.6, rotation: -9 },
      ],
      correctIds: ['c6q1_1a', 'c6q1_1b', 'c6q1_1c'],
      replyOnCorrect: '同樣的順序出現三次，通常不是設備，是人。',
      wrongRepliesByChoiceId: {
        c6q1_1k1: '水逆不會把 11 秒和 4 秒寫得一模一樣。這是人為。',
        c6q1_1k3: '你說對了一半：確實是劇本。只是編劇不是宇宙。',
      },
    },
    blank2: {
      hintLabel: '第二格：它被怎麼做？',
      options: [
        { id: 'c6q1_2a', label: '再次執行', fullText: '再次執行', x: 0.22, y: 0.2, rotation: -7 },
        { id: 'c6q1_2b', label: '重演', fullText: '重演', x: 0.52, y: 0.14, rotation: 8 },
        { id: 'c6q1_2c', label: '套用', fullText: '套用', x: 0.78, y: 0.22, rotation: -6 },
        { id: 'c6q1_2d', label: '重排', fullText: '重排', x: 0.28, y: 0.36, rotation: 11 },
        // KUSO
        { id: 'c6q1_2k1', label: '隨緣', fullText: '隨緣', x: 0.2, y: 0.63, rotation: -11 },
        { id: 'c6q1_2k2', label: '靠心情', fullText: '靠心情', x: 0.52, y: 0.67, rotation: 10 },
        { id: 'c6q1_2k3', label: '靠氣場', fullText: '靠氣場', x: 0.82, y: 0.62, rotation: -8 },
      ],
      correctIds: ['c6q1_2a', 'c6q1_2b', 'c6q1_2c', 'c6q1_2d'],
      replyOnCorrect: '故障會亂，重演會準。準，是線索。',
      wrongRepliesByChoiceId: {
        c6q1_2k3: '氣場不會留下時間序列。人會。',
      },
    },
    bothCorrectDialogue: {
      kk: '第三次不是復發，是重演。有人在把事故做成一種「可重播」。',
      liu: '我可以寫「時序與前案高度一致」。但你要我寫的是：一致到不可能是偶發。',
    },
    wrongFallback: '抓住「一致」：同樣的邏輯被執行三次，這叫做重演，不叫巧合。',
  },
  {
    id: 'ch6_report_q2',
    sentenceParts: [
      '面板操作記錄顯示：觸發來源是',
      '，不是',
      '。',
    ],
    blank1: {
      hintLabel: '第一格：來源是什麼？',
      options: [
        { id: 'c6q2_1a', label: '遠端連線', fullText: '遠端連線', x: 0.22, y: 0.18, rotation: -8 },
        { id: 'c6q2_1b', label: '非本地', fullText: '非本地', x: 0.5, y: 0.14, rotation: 7 },
        { id: 'c6q2_1c', label: '外部節點', fullText: '外部節點', x: 0.76, y: 0.2, rotation: -6 },
        // KUSO
        { id: 'c6q2_1k1', label: '意念', fullText: '意念', x: 0.2, y: 0.62, rotation: -12 },
        { id: 'c6q2_1k2', label: '通靈', fullText: '通靈', x: 0.52, y: 0.66, rotation: 9 },
        { id: 'c6q2_1k3', label: '眼神', fullText: '眼神', x: 0.82, y: 0.6, rotation: -9 },
      ],
      correctIds: ['c6q2_1a', 'c6q2_1b', 'c6q2_1c'],
      replyOnCorrect: '這讓「在場」變成假線索。',
      wrongRepliesByChoiceId: {
        c6q2_1k2: '通靈不會留節點識別碼。遠端會。',
      },
    },
    blank2: {
      hintLabel: '第二格：它不是什麼？',
      options: [
        { id: 'c6q2_2a', label: '本地操作', fullText: '本地操作', x: 0.22, y: 0.2, rotation: -7 },
        { id: 'c6q2_2b', label: '現場按鍵', fullText: '現場按鍵', x: 0.52, y: 0.14, rotation: 8 },
        { id: 'c6q2_2c', label: '當館授權', fullText: '當館授權', x: 0.78, y: 0.22, rotation: -6 },
        { id: 'c6q2_2d', label: '本機', fullText: '本機', x: 0.28, y: 0.36, rotation: 11 },
        // KUSO
        { id: 'c6q2_2k1', label: '良心', fullText: '良心', x: 0.2, y: 0.63, rotation: -11 },
        { id: 'c6q2_2k2', label: '勇氣', fullText: '勇氣', x: 0.52, y: 0.67, rotation: 10 },
        { id: 'c6q2_2k3', label: '運氣', fullText: '運氣', x: 0.82, y: 0.62, rotation: -8 },
      ],
      correctIds: ['c6q2_2a', 'c6q2_2b', 'c6q2_2c', 'c6q2_2d'],
      replyOnCorrect: '遠端連線，代表操作者可以不在鏡頭裡。',
      wrongRepliesByChoiceId: {
        c6q2_2k1: '良心不在權限表裡。本地授權在。',
      },
    },
    bothCorrectDialogue: {
      kk: '遠端意味著：你找不到那雙手，只能找到那條線。',
      liu: '我可以寫「疑似遠端觸發」。下一句要寫的是：那條線從哪裡進來。',
    },
    wrongFallback: '這題的核心是「遠端」。它讓操作者可以不在現場，但一定在系統裡。',
  },
  {
    id: 'ch6_report_q3',
    sentenceParts: [
      '原始 log 的價值在於欄位完整：來源 IP、失敗登入、遠端節點、以及',
      '。沒有它，你只能拿整理版去做',
      '。',
    ],
    blank1: {
      hintLabel: '第一格：原始 log 還包含什麼關鍵欄位？',
      options: [
        { id: 'c6q3_1a', label: '覆寫前原始值', fullText: '覆寫前原始值', x: 0.22, y: 0.18, rotation: -8 },
        { id: 'c6q3_1b', label: '操作前狀態', fullText: '操作前狀態', x: 0.5, y: 0.14, rotation: 7 },
        { id: 'c6q3_1c', label: '原始值', fullText: '原始值', x: 0.76, y: 0.2, rotation: -6 },
        // KUSO
        { id: 'c6q3_1k1', label: '作者心情', fullText: '作者心情', x: 0.2, y: 0.62, rotation: -12 },
        { id: 'c6q3_1k2', label: '宇宙註解', fullText: '宇宙註解', x: 0.52, y: 0.66, rotation: 9 },
        { id: 'c6q3_1k3', label: '可愛貼圖', fullText: '可愛貼圖', x: 0.82, y: 0.6, rotation: -9 },
      ],
      correctIds: ['c6q3_1a', 'c6q3_1b', 'c6q3_1c'],
      replyOnCorrect: '這欄讓你知道「改之前是什麼」，也讓你知道「改的是誰」。',
      wrongRepliesByChoiceId: {
        c6q3_1k3: '貼圖只會讓人放鬆。欄位會讓人坐牢。',
      },
    },
    blank2: {
      hintLabel: '第二格：沒有原始 log，你只能做什麼？',
      options: [
        { id: 'c6q3_2a', label: '猜測', fullText: '猜測', x: 0.22, y: 0.2, rotation: -7 },
        { id: 'c6q3_2b', label: '敘事', fullText: '敘事', x: 0.52, y: 0.14, rotation: 8 },
        { id: 'c6q3_2c', label: '交代', fullText: '交代', x: 0.78, y: 0.22, rotation: -6 },
        { id: 'c6q3_2d', label: '收束', fullText: '收束', x: 0.28, y: 0.36, rotation: 11 },
        // KUSO
        { id: 'c6q3_2k1', label: '祈禱', fullText: '祈禱', x: 0.2, y: 0.63, rotation: -11 },
        { id: 'c6q3_2k2', label: '許願', fullText: '許願', x: 0.52, y: 0.67, rotation: 10 },
        { id: 'c6q3_2k3', label: '裝沒事', fullText: '裝沒事', x: 0.82, y: 0.62, rotation: -8 },
      ],
      correctIds: ['c6q3_2a', 'c6q3_2b', 'c6q3_2c', 'c6q3_2d'],
      replyOnCorrect: '整理版是能交出去的版本，但不是能追責的版本。',
      wrongRepliesByChoiceId: {
        c6q3_2k1: '祈禱不會補欄位。封存才會。',
        c6q3_2k3: '裝沒事會很順。順到你以為結案了。',
      },
    },
    bothCorrectDialogue: {
      kk: '原始 log 不是資料，是門：門開著，你才走得進去。',
      liu: '我可以寫「原始 log 可比對剪裁」。你要我寫的是：沒有它，我們只能靠口徑。',
    },
    wrongFallback: '原始 log 的用途是「比對剪裁」。缺它，你就只能用整理版把故事說完。',
  },
  {
    id: 'ch6_report_q4',
    sentenceParts: [
      '張景衡把「遠端操作存在可能性」刪掉，讓敘事從「人為操作」變成',
      '，讓操作者從文字裡',
      '。',
    ],
    blank1: {
      hintLabel: '第一格：變成什麼？',
      options: [
        { id: 'c6q4_1a', label: '系統問題', fullText: '系統問題', x: 0.22, y: 0.18, rotation: -8 },
        { id: 'c6q4_1b', label: '管理落後', fullText: '管理落後', x: 0.5, y: 0.14, rotation: 7 },
        { id: 'c6q4_1c', label: '個案', fullText: '個案', x: 0.76, y: 0.2, rotation: -6 },
        { id: 'c6q4_1d', label: '流程疏漏', fullText: '流程疏漏', x: 0.3, y: 0.36, rotation: 10 },
        // KUSO
        { id: 'c6q4_1k1', label: '天氣不好', fullText: '天氣不好', x: 0.2, y: 0.62, rotation: -12 },
        { id: 'c6q4_1k2', label: '水逆', fullText: '水逆', x: 0.52, y: 0.66, rotation: 9 },
      ],
      correctIds: ['c6q4_1a', 'c6q4_1b', 'c6q4_1c', 'c6q4_1d'],
      replyOnCorrect: '系統問題是最好的責任消音器。',
      wrongRepliesByChoiceId: {
        c6q4_1k2: '水逆不會刪整句話。刪話的是人。',
      },
    },
    blank2: {
      hintLabel: '第二格：操作者從文字裡怎麼了？',
      options: [
        { id: 'c6q4_2a', label: '消失', fullText: '消失', x: 0.22, y: 0.2, rotation: -7 },
        { id: 'c6q4_2b', label: '被抹掉', fullText: '被抹掉', x: 0.52, y: 0.14, rotation: 8 },
        { id: 'c6q4_2c', label: '不再存在', fullText: '不再存在', x: 0.78, y: 0.22, rotation: -6 },
        { id: 'c6q4_2d', label: '被動化', fullText: '被動化', x: 0.28, y: 0.36, rotation: 11 },
        // KUSO
        { id: 'c6q4_2k1', label: '上天堂', fullText: '上天堂', x: 0.2, y: 0.63, rotation: -11 },
        { id: 'c6q4_2k2', label: '下班', fullText: '下班', x: 0.52, y: 0.67, rotation: 10 },
        { id: 'c6q4_2k3', label: '轉生', fullText: '轉生', x: 0.82, y: 0.62, rotation: -8 },
      ],
      correctIds: ['c6q4_2a', 'c6q4_2b', 'c6q4_2c', 'c6q4_2d'],
      replyOnCorrect: '主語消失的那一刻，責任就跟著變薄。',
      wrongRepliesByChoiceId: {
        c6q4_2k2: '下班的是人。被下班的是責任。',
      },
    },
    bothCorrectDialogue: {
      kk: '他不是在修稿，他在修現實：把人修成系統。',
      liu: '我可以寫「敘事框架轉換」。你要我寫的是：這個轉換，讓誰安全。',
    },
    wrongFallback: '這題抓的是「刪一句話」的效果：把人為改成系統，把主語改成被動。',
  },
  {
    id: 'ch6_report_q5',
    sentenceParts: [
      '林子睿說「有人死了大家才願意升級」——這更像一種',
      '，不是',
      '。',
    ],
    blank1: {
      hintLabel: '第一格：它更像什麼？',
      options: [
        { id: 'c6q5_1a', label: '決策', fullText: '決策', x: 0.22, y: 0.18, rotation: -8 },
        { id: 'c6q5_1b', label: '等待時機', fullText: '等待時機', x: 0.5, y: 0.14, rotation: 7 },
        { id: 'c6q5_1c', label: '默許', fullText: '默許', x: 0.76, y: 0.2, rotation: -6 },
        // KUSO
        { id: 'c6q5_1k1', label: '哲學', fullText: '哲學', x: 0.2, y: 0.62, rotation: -12 },
        { id: 'c6q5_1k2', label: '人生雞湯', fullText: '人生雞湯', x: 0.52, y: 0.66, rotation: 9 },
        { id: 'c6q5_1k3', label: '名言佳句', fullText: '名言佳句', x: 0.82, y: 0.6, rotation: -9 },
      ],
      correctIds: ['c6q5_1a', 'c6q5_1b', 'c6q5_1c'],
      replyOnCorrect: '說得越像道理，越像有人想讓它不需要負責。',
      wrongRepliesByChoiceId: {
        c6q5_1k2: '雞湯是給你喝的。這句話是拿來讓你閉嘴的。',
      },
    },
    blank2: {
      hintLabel: '第二格：它不是什麼？',
      options: [
        { id: 'c6q5_2a', label: '意外', fullText: '意外', x: 0.22, y: 0.2, rotation: -7 },
        { id: 'c6q5_2b', label: '無心', fullText: '無心', x: 0.52, y: 0.14, rotation: 8 },
        { id: 'c6q5_2c', label: '巧合', fullText: '巧合', x: 0.78, y: 0.22, rotation: -6 },
        { id: 'c6q5_2d', label: '失誤', fullText: '失誤', x: 0.28, y: 0.36, rotation: 11 },
        // KUSO
        { id: 'c6q5_2k1', label: '上天安排', fullText: '上天安排', x: 0.2, y: 0.63, rotation: -11 },
        { id: 'c6q5_2k2', label: '命運', fullText: '命運', x: 0.52, y: 0.67, rotation: 10 },
      ],
      correctIds: ['c6q5_2a', 'c6q5_2b', 'c6q5_2c', 'c6q5_2d'],
      replyOnCorrect: '等到有人死才升級，不是事故，是決定。',
      wrongRepliesByChoiceId: {
        c6q5_2k1: '上天不簽核。簽核的人會。',
      },
    },
    bothCorrectDialogue: {
      kk: '把人命當升級理由的人，最擅長把責任說成道理。',
      liu: '我可以寫「疑似存在知情不處置」。你要我寫的是：這不是意外，是選擇。',
    },
    wrongFallback: '終章要抓「決策」：不是意外連續三次，是有人讓洞繼續存在，等時機。',
  },
];

