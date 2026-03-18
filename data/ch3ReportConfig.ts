import type { TwoBlankFillConfig } from '@/components/FloatingFillBlankCore';

/**
 * 第三章章尾：向劉隊報告（5 題雙格填空）
 * - 玩法：兩格一次填完 → 一次送出判定（由 ReportFillBlank 實作）
 * - 判定：每格 correctIds 可多組（同精神即可）
 * - 特定 KUSO 錯誤：用 wrongRepliesByChoiceId 給專屬回饋；其餘錯誤走 wrongFallback
 */
export const ch3ReportFillBlanks: TwoBlankFillConfig[] = [
  {
    id: 'ch3_report_q1',
    sentenceParts: [
      '白板被擦過兩次。第一次為了',
      '，第二次為了讓它看起來像',
      '。',
    ],
    blank1: {
      hintLabel: '第一格：第一次擦白板是為了什麼？',
      options: [
        { id: 'ch3q1_1a', label: '改內容', fullText: '改內容', x: 0.2, y: 0.2, rotation: -8 },
        { id: 'ch3q1_1b', label: '修正', fullText: '修正', x: 0.46, y: 0.14, rotation: 6 },
        { id: 'ch3q1_1c', label: '更動', fullText: '更動', x: 0.72, y: 0.22, rotation: -6 },
        { id: 'ch3q1_1d', label: '掩飾', fullText: '掩飾', x: 0.3, y: 0.38, rotation: 10 },
        { id: 'ch3q1_1e', label: '抹掉痕跡', fullText: '抹掉痕跡', x: 0.6, y: 0.34, rotation: -10 },
        // KUSO
        { id: 'ch3q1_1k1', label: '測試筆能不能寫', fullText: '測試筆能不能寫', x: 0.22, y: 0.58, rotation: -12 },
        { id: 'ch3q1_1k2', label: '練字', fullText: '練字', x: 0.52, y: 0.66, rotation: 9 },
        { id: 'ch3q1_1k3', label: '畫可愛表情', fullText: '畫可愛表情', x: 0.8, y: 0.6, rotation: -9 },
      ],
      correctIds: ['ch3q1_1a', 'ch3q1_1b', 'ch3q1_1c'],
      replyOnCorrect: '第一次是為了改。改的動作本身才是重點。',
      wrongRepliesByChoiceId: {
        ch3q1_1k1: '如果只是測試筆，那第二次就不用擦得那麼乾淨。有人在測試的不是筆，是你會不會追。',
        ch3q1_1k2: '練字的話會留著欣賞。這種擦法，是怕別人看懂。',
        ch3q1_1k3: '可愛表情會被拍照上傳，不會被擦兩次。',
      },
    },
    blank2: {
      hintLabel: '第二格：第二次擦白板，是想讓它看起來像什麼？',
      options: [
        { id: 'ch3q1_2a', label: '沒改過', fullText: '沒改過', x: 0.2, y: 0.2, rotation: -7 },
        { id: 'ch3q1_2b', label: '一直都這樣', fullText: '一直都這樣', x: 0.5, y: 0.14, rotation: 7 },
        { id: 'ch3q1_2c', label: '原本就這樣', fullText: '原本就這樣', x: 0.78, y: 0.2, rotation: -8 },
        { id: 'ch3q1_2d', label: '流程正常', fullText: '流程正常', x: 0.3, y: 0.36, rotation: 10 },
        // KUSO
        { id: 'ch3q1_2k1', label: '像沒發生過', fullText: '像沒發生過', x: 0.22, y: 0.6, rotation: -10 },
        { id: 'ch3q1_2k2', label: '像是上天安排', fullText: '像是上天安排', x: 0.52, y: 0.66, rotation: 9 },
        { id: 'ch3q1_2k3', label: '像是清潔太認真', fullText: '像是清潔太認真', x: 0.82, y: 0.6, rotation: -8 },
      ],
      correctIds: ['ch3q1_2a', 'ch3q1_2b', 'ch3q1_2c'],
      replyOnCorrect: '第二次不是為了乾淨，是為了「像從來沒動過」。',
      wrongRepliesByChoiceId: {
        ch3q1_2k2: '上天不改白板，改白板的是人。人想要的是你把它當天意。',
        ch3q1_2k3: '清潔只會擦一次。第二次那麼用力，是怕你回頭對照。',
      },
    },
    bothCorrectDialogue: {
      kk: '第一次是改，第二次是讓你以為沒改。兩個動作，先做後掩。',
      liu: '目前能寫的是「交接紀錄有異動」。至於誰動的，要靠你把缺口補起來。',
    },
    wrongFallback: '白板擦兩次不是潔癖，是工序。第一次改，第二次掩。你要把這個動作說清楚。',
  },
  {
    id: 'ch3_report_q2',
    sentenceParts: [
      '整理版 log 的問題，不在它說了什麼，而在它',
      '了哪些欄位，讓你沒辦法問清楚操作從',
      '發出。',
    ],
    blank1: {
      hintLabel: '第一格：整理版 log 做了什麼？',
      options: [
        { id: 'ch3q2_1a', label: '選擇性遺漏', fullText: '選擇性遺漏', x: 0.22, y: 0.18, rotation: -8 },
        { id: 'ch3q2_1b', label: '刪掉', fullText: '刪掉', x: 0.5, y: 0.14, rotation: 7 },
        { id: 'ch3q2_1c', label: '剪裁', fullText: '剪裁', x: 0.76, y: 0.2, rotation: -6 },
        { id: 'ch3q2_1d', label: '漏記', fullText: '漏記', x: 0.3, y: 0.36, rotation: 10 },
        // KUSO
        { id: 'ch3q2_1k1', label: '美編排版', fullText: '美編排版', x: 0.2, y: 0.62, rotation: -12 },
        { id: 'ch3q2_1k2', label: '貼金箔', fullText: '貼金箔', x: 0.52, y: 0.66, rotation: 9 },
        { id: 'ch3q2_1k3', label: '幫它加濾鏡', fullText: '幫它加濾鏡', x: 0.82, y: 0.6, rotation: -9 },
      ],
      correctIds: ['ch3q2_1a', 'ch3q2_1b', 'ch3q2_1c'],
      replyOnCorrect: '不是錯誤，是決定：哪些欄位重要、哪些不重要。',
      wrongRepliesByChoiceId: {
        ch3q2_1k1: '排版再漂亮也不會讓欄位消失。這不是設計，是挑選。',
        ch3q2_1k2: '金箔只能讓人相信你很貴，不能讓人相信你很真。',
        ch3q2_1k3: '濾鏡會改色，這份是改責任。你別把它當修圖。',
      },
    },
    blank2: {
      hintLabel: '第二格：缺了什麼，才會不知道操作從哪來？',
      options: [
        { id: 'ch3q2_2a', label: '遠端', fullText: '遠端', x: 0.22, y: 0.2, rotation: -7 },
        { id: 'ch3q2_2b', label: '本機', fullText: '本機', x: 0.5, y: 0.14, rotation: 8 },
        { id: 'ch3q2_2c', label: 'IP', fullText: 'IP', x: 0.76, y: 0.22, rotation: -6 },
        { id: 'ch3q2_2d', label: '來源', fullText: '來源', x: 0.3, y: 0.36, rotation: 11 },
        // KUSO
        { id: 'ch3q2_2k1', label: '宇宙訊號', fullText: '宇宙訊號', x: 0.2, y: 0.63, rotation: -12 },
        { id: 'ch3q2_2k2', label: '風向', fullText: '風向', x: 0.52, y: 0.67, rotation: 10 },
        { id: 'ch3q2_2k3', label: '靈魂', fullText: '靈魂', x: 0.82, y: 0.62, rotation: -8 },
      ],
      correctIds: ['ch3q2_2a', 'ch3q2_2b', 'ch3q2_2c', 'ch3q2_2d'],
      replyOnCorrect: '缺的不是「幾欄」，是剛好能讓你問清楚來源的那一欄。',
      wrongRepliesByChoiceId: {
        ch3q2_2k1: '宇宙訊號不會被刪欄位。被刪的是能追到人的證據。',
        ch3q2_2k3: '帳號在場不代表人也在場。靈魂更不是欄位。',
      },
    },
    bothCorrectDialogue: {
      kk: 'log 不是沒寫，是寫到你問不了「從哪裡」。這種缺口，是設計。',
      liu: '目前能寫的是「紀錄不完整」。你把缺的欄位講清楚，我們才有下一步。',
    },
    wrongFallback: '整理版最可怕的不是它錯，是它剛好讓你追不到來源。想想：哪一欄能回答「從哪裡操作」。',
  },
  {
    id: 'ch3_report_q3',
    sentenceParts: [
      '城市 W 與光芒 R 在同一插件版本序列，這不是',
      '，而是有人在兩館之間具備',
      '。',
    ],
    blank1: {
      hintLabel: '第一格：這不是什麼？',
      options: [
        { id: 'ch3q3_1a', label: '單點故障', fullText: '單點故障', x: 0.22, y: 0.18, rotation: -8 },
        { id: 'ch3q3_1b', label: '偶發', fullText: '偶發', x: 0.5, y: 0.14, rotation: 7 },
        { id: 'ch3q3_1c', label: '巧合', fullText: '巧合', x: 0.76, y: 0.2, rotation: -6 },
        // KUSO
        { id: 'ch3q3_1k1', label: '命運安排', fullText: '命運安排', x: 0.2, y: 0.62, rotation: -12 },
        { id: 'ch3q3_1k2', label: '水逆', fullText: '水逆', x: 0.52, y: 0.66, rotation: 9 },
        { id: 'ch3q3_1k3', label: '玄學', fullText: '玄學', x: 0.82, y: 0.6, rotation: -9 },
      ],
      correctIds: ['ch3q3_1a', 'ch3q3_1b', 'ch3q3_1c'],
      replyOnCorrect: '版本序列不是自己長出來的。這不是偶然。',
      wrongRepliesByChoiceId: {
        ch3q3_1k1: '命運不會把兩館的版本更新排到 15 分鐘內。那是人手。',
        ch3q3_1k2: '水逆最多讓人心情差，這種同步讓人睡不好。',
      },
    },
    blank2: {
      hintLabel: '第二格：這代表對兩館都有什麼？',
      options: [
        { id: 'ch3q3_2a', label: '存取權', fullText: '存取權', x: 0.24, y: 0.16, rotation: -7 },
        { id: 'ch3q3_2b', label: '權限', fullText: '權限', x: 0.52, y: 0.12, rotation: 9 },
        { id: 'ch3q3_2c', label: '操作入口', fullText: '操作入口', x: 0.78, y: 0.18, rotation: -6 },
        { id: 'ch3q3_2d', label: '通道', fullText: '通道', x: 0.28, y: 0.34, rotation: 10 },
        // KUSO
        { id: 'ch3q3_2k1', label: 'VIP 通行證', fullText: 'VIP 通行證', x: 0.2, y: 0.63, rotation: -11 },
        { id: 'ch3q3_2k2', label: '人脈', fullText: '人脈', x: 0.52, y: 0.67, rotation: 10 },
        { id: 'ch3q3_2k3', label: '氣場', fullText: '氣場', x: 0.82, y: 0.62, rotation: -8 },
      ],
      correctIds: ['ch3q3_2a', 'ch3q3_2b', 'ch3q3_2c', 'ch3q3_2d'],
      replyOnCorrect: '能跨館動的不是「熟悉」，是權限與入口。',
      wrongRepliesByChoiceId: {
        ch3q3_2k3: '氣場再強也開不了面板。能開面板的叫權限。',
      },
    },
    bothCorrectDialogue: {
      kk: '跨館同步不是故障，是有人知道兩邊會一起響，然後讓它一起響。',
      liu: '這條可以寫成「疑似跨館權限或通道存在」。再往下，就要追到誰握著那把鑰匙。',
    },
    wrongFallback: '版本序列的同步不是巧合。想想：誰能同時在兩館動手？那代表什麼權限或通道存在？',
  },
  {
    id: 'ch3_report_q4',
    sentenceParts: [
      '品牌話術把災難說成瑕疵：一間出事是',
      '，三間被聯想就變成',
      '。',
    ],
    blank1: {
      hintLabel: '第一格：一間出事被說成什麼？',
      options: [
        { id: 'ch3q4_1a', label: '事故', fullText: '事故', x: 0.22, y: 0.18, rotation: -8 },
        { id: 'ch3q4_1b', label: '個案', fullText: '個案', x: 0.5, y: 0.14, rotation: 7 },
        { id: 'ch3q4_1c', label: '瑕疵', fullText: '瑕疵', x: 0.76, y: 0.2, rotation: -6 },
        // KUSO
        { id: 'ch3q4_1k1', label: '小插曲', fullText: '小插曲', x: 0.2, y: 0.62, rotation: -12 },
        { id: 'ch3q4_1k2', label: '彩蛋', fullText: '彩蛋', x: 0.52, y: 0.66, rotation: 9 },
        { id: 'ch3q4_1k3', label: '驚喜活動', fullText: '驚喜活動', x: 0.82, y: 0.6, rotation: -9 },
      ],
      correctIds: ['ch3q4_1a', 'ch3q4_1b', 'ch3q4_1c'],
      replyOnCorrect: '語言會把事情變小。品牌最擅長的就是這件事。',
      wrongRepliesByChoiceId: {
        ch3q4_1k2: '彩蛋通常讓人開心。這個彩蛋讓人去醫院。',
        ch3q4_1k3: '驚喜活動不會附帶封鎖線。',
      },
    },
    blank2: {
      hintLabel: '第二格：三間一起被聯想，會變成什麼？',
      options: [
        { id: 'ch3q4_2a', label: '品牌問題', fullText: '品牌問題', x: 0.22, y: 0.2, rotation: -7 },
        { id: 'ch3q4_2b', label: '系統性風險', fullText: '系統性風險', x: 0.52, y: 0.14, rotation: 8 },
        { id: 'ch3q4_2c', label: '結構問題', fullText: '結構問題', x: 0.78, y: 0.22, rotation: -6 },
        // KUSO
        { id: 'ch3q4_2k1', label: '熱搜', fullText: '熱搜', x: 0.2, y: 0.63, rotation: -11 },
        { id: 'ch3q4_2k2', label: '社群梗圖', fullText: '社群梗圖', x: 0.52, y: 0.67, rotation: 10 },
        { id: 'ch3q4_2k3', label: '年度迷因', fullText: '年度迷因', x: 0.82, y: 0.62, rotation: -8 },
      ],
      correctIds: ['ch3q4_2a', 'ch3q4_2b', 'ch3q4_2c'],
      replyOnCorrect: '品牌怕的不是單點，怕的是它看起來像結構。',
      wrongRepliesByChoiceId: {
        ch3q4_2k1: '熱搜只是結果。品牌怕的是原因被串起來。',
        ch3q4_2k2: '梗圖傷形象，但系統性風險會傷整個結算。',
      },
    },
    bothCorrectDialogue: {
      kk: '他們不是在否認事實，是在管理語氣。讓你說不出口「系統」。',
      liu: '這段我會寫成「對外口徑傾向單點化」。但你要我寫進去的，是那個口徑在保什麼。',
    },
    wrongFallback: '品牌話術的核心不是內容，是把「結構」拆成「個案」。想想他們最怕哪個詞被放大。',
  },
  {
    id: 'ch3_report_q5',
    sentenceParts: [
      '顧乃謙說：要整理版，今天就能',
      '；要原始檔，今晚很多人睡不',
      '。',
    ],
    blank1: {
      hintLabel: '第一格：整理版帶來什麼？',
      options: [
        { id: 'ch3q5_1a', label: '結案', fullText: '結案', x: 0.22, y: 0.18, rotation: -8 },
        { id: 'ch3q5_1b', label: '收束', fullText: '收束', x: 0.5, y: 0.14, rotation: 7 },
        { id: 'ch3q5_1c', label: '交代', fullText: '交代', x: 0.76, y: 0.2, rotation: -6 },
        // KUSO
        { id: 'ch3q5_1k1', label: '圓滿大結局', fullText: '圓滿大結局', x: 0.2, y: 0.62, rotation: -12 },
        { id: 'ch3q5_1k2', label: '感動收尾', fullText: '感動收尾', x: 0.52, y: 0.66, rotation: 9 },
        { id: 'ch3q5_1k3', label: '最佳剪輯獎', fullText: '最佳剪輯獎', x: 0.82, y: 0.6, rotation: -9 },
      ],
      correctIds: ['ch3q5_1a', 'ch3q5_1b', 'ch3q5_1c'],
      replyOnCorrect: '整理版的功能不是找真相，是讓事情可以被交代。',
      wrongRepliesByChoiceId: {
        ch3q5_1k1: '圓滿只存在於稿子裡。案件要的是能追的欄位。',
        ch3q5_1k3: '剪輯獎是電影的，欄位被剪是案件的。',
      },
    },
    blank2: {
      hintLabel: '第二格：原始檔會讓很多人睡不什麼？',
      options: [
        { id: 'ch3q5_2a', label: '好', fullText: '好', x: 0.22, y: 0.2, rotation: -7 },
        { id: 'ch3q5_2b', label: '著', fullText: '著', x: 0.52, y: 0.14, rotation: 8 },
        { id: 'ch3q5_2c', label: '安穩', fullText: '安穩', x: 0.78, y: 0.22, rotation: -6 },
        // KUSO
        { id: 'ch3q5_2k1', label: '到天亮', fullText: '到天亮', x: 0.2, y: 0.63, rotation: -11 },
        { id: 'ch3q5_2k2', label: '像嬰兒', fullText: '像嬰兒', x: 0.52, y: 0.67, rotation: 10 },
        { id: 'ch3q5_2k3', label: '得體', fullText: '得體', x: 0.82, y: 0.62, rotation: -8 },
      ],
      correctIds: ['ch3q5_2a', 'ch3q5_2b', 'ch3q5_2c'],
      replyOnCorrect: '原始檔會讓人睡不好，是因為它會把人從流程裡叫出來。',
      wrongRepliesByChoiceId: {
        ch3q5_2k2: '像嬰兒睡覺的前提是你沒做過需要被追的事。',
        ch3q5_2k3: '得體是公關的字。原始檔追的是不體面。',
      },
    },
    bothCorrectDialogue: {
      kk: '整理版能讓今天結束；原始檔會讓明天開始追。差別不在檔案，在人。',
      liu: '好。你把「整理版」跟「原始檔」的差別說出來了。我們接下來就要找誰有能力把差別藏起來。',
    },
    wrongFallback: '顧乃謙那句話的核心是選擇：要快、要能交代；或要原始、要能追責。',
  },
];

