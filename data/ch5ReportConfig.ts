import type { TwoBlankFillConfig } from '@/components/FloatingFillBlankCore';

/**
 * 第五章章尾：向劉隊報告（5 題雙格填空）
 * - 玩法：兩格一次填完 → 一次送出判定（由 ReportFillBlank 實作）
 * - 判定：每格 correctIds 可多組（同精神即可）
 * - 特定 KUSO 錯誤：用 wrongRepliesByChoiceId 給專屬回饋；其餘錯誤走 wrongFallback
 */
export const ch5ReportFillBlanks: TwoBlankFillConfig[] = [
  {
    id: 'ch5_report_q1',
    sentenceParts: [
      '高文傑的登入紀錄與命案時間「接近但不完全吻合」——這代表他是',
      '，不是',
      '。',
    ],
    blank1: {
      hintLabel: '第一格：他比較像什麼？',
      options: [
        { id: 'c5q1_1a', label: '被借名的手', fullText: '被借名的手', x: 0.22, y: 0.18, rotation: -8 },
        { id: 'c5q1_1b', label: '工具', fullText: '工具', x: 0.5, y: 0.14, rotation: 7 },
        { id: 'c5q1_1c', label: '方便的嫌疑人', fullText: '方便的嫌疑人', x: 0.76, y: 0.2, rotation: -6 },
        { id: 'c5q1_1d', label: '可以押的人', fullText: '可以押的人', x: 0.3, y: 0.36, rotation: 10 },
        // KUSO
        { id: 'c5q1_1k1', label: '真愛粉', fullText: '真愛粉', x: 0.2, y: 0.62, rotation: -12 },
        { id: 'c5q1_1k2', label: '背鍋體質', fullText: '背鍋體質', x: 0.52, y: 0.66, rotation: 9 },
        { id: 'c5q1_1k3', label: '走進錯棚的臨演', fullText: '走進錯棚的臨演', x: 0.82, y: 0.6, rotation: -9 },
      ],
      correctIds: ['c5q1_1a', 'c5q1_1b', 'c5q1_1c', 'c5q1_1d'],
      replyOnCorrect: '「接近」最常被拿來當線索，因為它夠像。',
      wrongRepliesByChoiceId: {
        c5q1_1k1: '真愛粉不會讓登入時間「剛好接近」。接近是給你看的。',
        c5q1_1k3: '臨演不會在矩陣裡被填到最滿。這是有人安排的戲份。',
      },
    },
    blank2: {
      hintLabel: '第二格：他不是什麼？',
      options: [
        { id: 'c5q1_2a', label: '真正的操作者', fullText: '真正的操作者', x: 0.22, y: 0.2, rotation: -7 },
        { id: 'c5q1_2b', label: '主謀', fullText: '主謀', x: 0.52, y: 0.14, rotation: 8 },
        { id: 'c5q1_2c', label: '唯一答案', fullText: '唯一答案', x: 0.78, y: 0.22, rotation: -6 },
        { id: 'c5q1_2d', label: '完整結論', fullText: '完整結論', x: 0.28, y: 0.36, rotation: 11 },
        // KUSO
        { id: 'c5q1_2k1', label: '宇宙的安排', fullText: '宇宙的安排', x: 0.2, y: 0.63, rotation: -11 },
        { id: 'c5q1_2k2', label: '命運男主角', fullText: '命運男主角', x: 0.52, y: 0.67, rotation: 10 },
        { id: 'c5q1_2k3', label: '天選之人', fullText: '天選之人', x: 0.82, y: 0.62, rotation: -8 },
      ],
      correctIds: ['c5q1_2a', 'c5q1_2b', 'c5q1_2c', 'c5q1_2d'],
      replyOnCorrect: '帳號在場，不代表靈魂在場。',
      wrongRepliesByChoiceId: {
        c5q1_2k2: '男主角會有主角光環。這個人只有「剛好夠像」。',
        c5q1_2k3: '天選不會留下「接近但不吻合」這種縫。這是人手留的。',
      },
    },
    bothCorrectDialogue: {
      kk: '接近但不吻合，像手——但更像被借來的手。',
      liu: '我可以寫「可疑但不足以構成唯一結論」。下一步要寫的是：誰需要他看起來最可疑。',
    },
    wrongFallback: '「接近」很方便，但它不等於在場。用它押人，只能押到你自己。',
  },
  {
    id: 'ch5_report_q2',
    sentenceParts: [
      '整理版 log 少了',
      '，所以你沒辦法回答操作是從',
      '發出。',
    ],
    blank1: {
      hintLabel: '第一格：最關鍵缺的是哪一類欄位？',
      options: [
        { id: 'c5q2_1a', label: '來源 IP', fullText: '來源 IP', x: 0.22, y: 0.18, rotation: -8 },
        { id: 'c5q2_1b', label: '操作來源', fullText: '操作來源', x: 0.5, y: 0.14, rotation: 7 },
        { id: 'c5q2_1c', label: '遠端節點', fullText: '遠端節點', x: 0.76, y: 0.2, rotation: -6 },
        { id: 'c5q2_1d', label: '失敗登入', fullText: '失敗登入', x: 0.3, y: 0.36, rotation: 10 },
        // KUSO
        { id: 'c5q2_1k1', label: '字體大小', fullText: '字體大小', x: 0.2, y: 0.62, rotation: -12 },
        { id: 'c5q2_1k2', label: '顏色濾鏡', fullText: '顏色濾鏡', x: 0.52, y: 0.66, rotation: 9 },
        { id: 'c5q2_1k3', label: '排版美感', fullText: '排版美感', x: 0.82, y: 0.6, rotation: -9 },
      ],
      correctIds: ['c5q2_1a', 'c5q2_1b', 'c5q2_1c', 'c5q2_1d'],
      replyOnCorrect: '少的不是幾欄，是剛好能追到人的那一欄。',
      wrongRepliesByChoiceId: {
        c5q2_1k1: '字體大小不會讓責任消失。欄位消失才會。',
        c5q2_1k3: '美感是給媒體的。欄位是給追責的。',
      },
    },
    blank2: {
      hintLabel: '第二格：你因此無法回答「從哪裡」？',
      options: [
        { id: 'c5q2_2a', label: '遠端', fullText: '遠端', x: 0.22, y: 0.2, rotation: -7 },
        { id: 'c5q2_2b', label: '本地', fullText: '本地', x: 0.52, y: 0.14, rotation: 8 },
        { id: 'c5q2_2c', label: '外部節點', fullText: '外部節點', x: 0.78, y: 0.22, rotation: -6 },
        { id: 'c5q2_2d', label: '控制區本機', fullText: '控制區本機', x: 0.28, y: 0.36, rotation: 11 },
        // KUSO
        { id: 'c5q2_2k1', label: '宇宙', fullText: '宇宙', x: 0.2, y: 0.63, rotation: -11 },
        { id: 'c5q2_2k2', label: '心情', fullText: '心情', x: 0.52, y: 0.67, rotation: 10 },
        { id: 'c5q2_2k3', label: '靈界', fullText: '靈界', x: 0.82, y: 0.62, rotation: -8 },
      ],
      correctIds: ['c5q2_2a', 'c5q2_2b', 'c5q2_2c', 'c5q2_2d'],
      replyOnCorrect: '不能回答「從哪裡」，就只能回答「像誰」。',
      wrongRepliesByChoiceId: {
        c5q2_2k3: '靈界不需要帳號。遠端需要。',
      },
    },
    bothCorrectDialogue: {
      kk: '整理版讓你問不了來源，只能把問題推給一個名字。',
      liu: '我可以寫「紀錄不完整」。但你要我寫清楚：缺的是能判別遠端/本地的欄位。',
    },
    wrongFallback: '這題要抓「能判別操作來源」的缺口：沒有來源欄位，就只能用名字填空。',
  },
  {
    id: 'ch5_report_q3',
    sentenceParts: [
      '權限樹顯示：高文傑只有',
      '權限，真正能',
      '的是頂層。',
    ],
    blank1: {
      hintLabel: '第一格：高文傑只有什麼權限？',
      options: [
        { id: 'c5q3_1a', label: '執行', fullText: '執行', x: 0.22, y: 0.18, rotation: -8 },
        { id: 'c5q3_1b', label: '跑流程', fullText: '跑流程', x: 0.5, y: 0.14, rotation: 7 },
        { id: 'c5q3_1c', label: '按下去', fullText: '按下去', x: 0.76, y: 0.2, rotation: -6 },
        // KUSO
        { id: 'c5q3_1k1', label: '改寫現實', fullText: '改寫現實', x: 0.2, y: 0.62, rotation: -12 },
        { id: 'c5q3_1k2', label: '操控天氣', fullText: '操控天氣', x: 0.52, y: 0.66, rotation: 9 },
        { id: 'c5q3_1k3', label: '扭轉宇宙', fullText: '扭轉宇宙', x: 0.82, y: 0.6, rotation: -9 },
      ],
      correctIds: ['c5q3_1a', 'c5q3_1b', 'c5q3_1c'],
      replyOnCorrect: '能執行，不代表能定義執行什麼。',
      wrongRepliesByChoiceId: {
        c5q3_1k1: '如果他能改寫現實，就不會被寫進矩陣裡當工具。',
      },
    },
    blank2: {
      hintLabel: '第二格：頂層真正能做什麼？',
      options: [
        { id: 'c5q3_2a', label: '改邏輯', fullText: '改邏輯', x: 0.22, y: 0.2, rotation: -7 },
        { id: 'c5q3_2b', label: '多館部署', fullText: '多館部署', x: 0.52, y: 0.14, rotation: 8 },
        { id: 'c5q3_2c', label: '定義插件怎麼跑', fullText: '定義插件怎麼跑', x: 0.78, y: 0.22, rotation: -6 },
        { id: 'c5q3_2d', label: '改插件邏輯', fullText: '改插件邏輯', x: 0.28, y: 0.36, rotation: 11 },
        // KUSO
        { id: 'c5q3_2k1', label: '改命', fullText: '改命', x: 0.2, y: 0.63, rotation: -11 },
        { id: 'c5q3_2k2', label: '改運', fullText: '改運', x: 0.52, y: 0.67, rotation: 10 },
        { id: 'c5q3_2k3', label: '改 KPI', fullText: '改 KPI', x: 0.82, y: 0.62, rotation: -8 },
      ],
      correctIds: ['c5q3_2a', 'c5q3_2b', 'c5q3_2c', 'c5q3_2d'],
      replyOnCorrect: '頂層不必親自登入很多次，因為它決定規則。',
      wrongRepliesByChoiceId: {
        c5q3_2k3: 'KPI 會改，邏輯也會改。差別是誰敢在頂層改。',
      },
    },
    bothCorrectDialogue: {
      kk: '他能按下去，但他不能決定按下去會發生什麼。決定的在頂層。',
      liu: '我可以寫「高文傑層級不足以修改」。下一句要寫的是：頂層是誰的責任鏈。',
    },
    wrongFallback: '這題是「執行」對上「定義規則/多館部署」。把手和腦分開。',
  },
  {
    id: 'ch5_report_q4',
    sentenceParts: [
      'Unknown 訊息的語感更像',
      '的公關文件：改一句話，就能讓「人為操作」變成',
      '。',
    ],
    blank1: {
      hintLabel: '第一格：語感像誰？',
      options: [
        { id: 'c5q4_1a', label: '張景衡', fullText: '張景衡', x: 0.22, y: 0.18, rotation: -8 },
        { id: 'c5q4_1b', label: '特助', fullText: '特助', x: 0.5, y: 0.14, rotation: 7 },
        { id: 'c5q4_1c', label: '敘事管理的人', fullText: '敘事管理的人', x: 0.76, y: 0.2, rotation: -6 },
        // KUSO
        { id: 'c5q4_1k1', label: '詩人', fullText: '詩人', x: 0.2, y: 0.62, rotation: -12 },
        { id: 'c5q4_1k2', label: '編劇', fullText: '編劇', x: 0.52, y: 0.66, rotation: 9 },
        { id: 'c5q4_1k3', label: '社群小編', fullText: '社群小編', x: 0.82, y: 0.6, rotation: -9 },
      ],
      correctIds: ['c5q4_1a', 'c5q4_1b', 'c5q4_1c'],
      replyOnCorrect: '語感不是證據，但它是鏈條上的指紋。',
      wrongRepliesByChoiceId: {
        c5q4_1k2: '編劇會署名。這個人習慣讓主語消失。',
      },
    },
    blank2: {
      hintLabel: '第二格：會被改成什麼？',
      options: [
        { id: 'c5q4_2a', label: '系統問題', fullText: '系統問題', x: 0.22, y: 0.2, rotation: -7 },
        { id: 'c5q4_2b', label: '管理落後', fullText: '管理落後', x: 0.52, y: 0.14, rotation: 8 },
        { id: 'c5q4_2c', label: '個案', fullText: '個案', x: 0.78, y: 0.22, rotation: -6 },
        { id: 'c5q4_2d', label: '流程疏漏', fullText: '流程疏漏', x: 0.28, y: 0.36, rotation: 11 },
        // KUSO
        { id: 'c5q4_2k1', label: '天氣不好', fullText: '天氣不好', x: 0.2, y: 0.63, rotation: -11 },
        { id: 'c5q4_2k2', label: '水逆', fullText: '水逆', x: 0.52, y: 0.67, rotation: 10 },
        { id: 'c5q4_2k3', label: '運氣差', fullText: '運氣差', x: 0.82, y: 0.62, rotation: -8 },
      ],
      correctIds: ['c5q4_2a', 'c5q4_2b', 'c5q4_2c', 'c5q4_2d'],
      replyOnCorrect: '主語消失的時候，責任也會跟著消失。',
      wrongRepliesByChoiceId: {
        c5q4_2k2: '水逆不會把主語刪掉。刪主語的是人。',
      },
    },
    bothCorrectDialogue: {
      kk: '有人在替另一個人翻譯世界：把「人」翻成「系統」。',
      liu: '我可以寫「對外敘事傾向系統化」。你要我寫的是：誰在做這件翻譯。',
    },
    wrongFallback: '這題抓的是「語感」與「敘事效果」：讓人為操作消失、讓責任模糊。',
  },
  {
    id: 'ch5_report_q5',
    sentenceParts: [
      '林子睿重複說「',
      '」三次——這比較像校準過的口徑，不像',
      '。',
    ],
    blank1: {
      hintLabel: '第一格：他重複的那句話是什麼？',
      options: [
        { id: 'c5q5_1a', label: '管理落後不是陰謀', fullText: '管理落後不是陰謀', x: 0.22, y: 0.18, rotation: -8 },
        { id: 'c5q5_1b', label: '不是陰謀', fullText: '不是陰謀', x: 0.5, y: 0.14, rotation: 7 },
        { id: 'c5q5_1c', label: '管理落後', fullText: '管理落後', x: 0.76, y: 0.2, rotation: -6 },
        // KUSO
        { id: 'c5q5_1k1', label: '人生好難', fullText: '人生好難', x: 0.2, y: 0.62, rotation: -12 },
        { id: 'c5q5_1k2', label: '今天好累', fullText: '今天好累', x: 0.52, y: 0.66, rotation: 9 },
        { id: 'c5q5_1k3', label: '我只是想下班', fullText: '我只是想下班', x: 0.82, y: 0.6, rotation: -9 },
      ],
      correctIds: ['c5q5_1a', 'c5q5_1b', 'c5q5_1c'],
      replyOnCorrect: '同一句話說三遍，不像自然陳述，更像訓練過。',
      wrongRepliesByChoiceId: {
        c5q5_1k3: '想下班的人不會把同一句話校準到三遍。這是給報告看的。',
      },
    },
    blank2: {
      hintLabel: '第二格：它不像什麼？',
      options: [
        { id: 'c5q5_2a', label: '自然陳述', fullText: '自然陳述', x: 0.22, y: 0.2, rotation: -7 },
        { id: 'c5q5_2b', label: '臨場反應', fullText: '臨場反應', x: 0.52, y: 0.14, rotation: 8 },
        { id: 'c5q5_2c', label: '不經意', fullText: '不經意', x: 0.78, y: 0.22, rotation: -6 },
        { id: 'c5q5_2d', label: '隨口', fullText: '隨口', x: 0.28, y: 0.36, rotation: 11 },
        // KUSO
        { id: 'c5q5_2k1', label: '真情流露', fullText: '真情流露', x: 0.2, y: 0.63, rotation: -11 },
        { id: 'c5q5_2k2', label: '心有感而發', fullText: '心有感而發', x: 0.52, y: 0.67, rotation: 10 },
        { id: 'c5q5_2k3', label: '靈光乍現', fullText: '靈光乍現', x: 0.82, y: 0.62, rotation: -8 },
      ],
      correctIds: ['c5q5_2a', 'c5q5_2b', 'c5q5_2c', 'c5q5_2d'],
      replyOnCorrect: '校準過的語氣，是一種防線：把你要問的問題先改名。',
      wrongRepliesByChoiceId: {
        c5q5_2k1: '真情通常會換句話說。校準的人只會重複。',
      },
    },
    bothCorrectDialogue: {
      kk: '他在把「陰謀」這個詞趕出你的句子。先趕詞，再趕責任。',
      liu: '我可以寫「口徑一致」。但你要我寫的是：一致到不自然，這本身就是訊號。',
    },
    wrongFallback: '同一句話說三遍不是習慣，是口徑。口徑的作用是先改你的問題。',
  },
];

