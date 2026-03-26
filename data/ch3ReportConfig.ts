import type { TwoBlankFillConfig } from '@/components/FloatingFillBlankCore';

/**
 * 第三章章尾：向劉隊報告（2 題雙格填空）
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
      '三館線索對卷後，光芒影城的技術窗口先找',
      '；下一步要往維運責任鏈追',
      '，才能把跨館操作寫進報告。',
    ],
    blank1: {
      hintLabel: '第一格：光芒影城技術窗口（現場／設備）',
      options: [
        { id: 'ch3q2n_1a', label: '梁以安', fullText: '梁以安', x: 0.24, y: 0.18, rotation: -8 },
        { id: 'ch3q2n_1b', label: '陳佑誠', fullText: '陳佑誠', x: 0.52, y: 0.14, rotation: 7 },
        { id: 'ch3q2n_1c', label: '顧乃謙', fullText: '顧乃謙', x: 0.78, y: 0.2, rotation: -6 },
        { id: 'ch3q2n_1d', label: '林瑞堂', fullText: '林瑞堂', x: 0.3, y: 0.36, rotation: 10 },
        { id: 'ch3q2n_1e', label: '林子睿', fullText: '林子睿', x: 0.58, y: 0.34, rotation: -9 },
        { id: 'ch3q2n_1k1', label: '小張', fullText: '小張', x: 0.22, y: 0.6, rotation: -11 },
        { id: 'ch3q2n_1k2', label: '宋雅甄', fullText: '宋雅甄', x: 0.52, y: 0.64, rotation: 9 },
        { id: 'ch3q2n_1k3', label: '張景衡', fullText: '張景衡', x: 0.82, y: 0.58, rotation: -8 },
      ],
      correctIds: ['ch3q2n_1a'],
      replyOnCorrect: '光芒那邊先對現場與設備敘述——把「誰在場」說清楚，才能接維運鏈。',
      wrongRepliesByChoiceId: {
        ch3q2n_1k1: '放映端只照表。你現在要的是能對到系統與責任鏈的人。',
        ch3q2n_1k2: '品牌在管口徑。報告要寫的是誰能對到技術事實。',
        ch3q2n_1k3: '他整理的是給外人看的版本；下一步要追的是能簽維運的人。',
      },
    },
    blank2: {
      hintLabel: '第二格：維運／跨館鏈上應追的對象',
      options: [
        { id: 'ch3q2n_2a', label: '陳佑誠', fullText: '陳佑誠', x: 0.24, y: 0.18, rotation: -7 },
        { id: 'ch3q2n_2b', label: '梁以安', fullText: '梁以安', x: 0.52, y: 0.14, rotation: 8 },
        { id: 'ch3q2n_2c', label: '高文傑', fullText: '高文傑', x: 0.78, y: 0.2, rotation: -6 },
        { id: 'ch3q2n_2d', label: '周姊', fullText: '周姊', x: 0.3, y: 0.36, rotation: 11 },
        { id: 'ch3q2n_2e', label: '阿順', fullText: '阿順', x: 0.58, y: 0.32, rotation: -8 },
        { id: 'ch3q2n_2k1', label: '劉隊', fullText: '劉隊', x: 0.2, y: 0.62, rotation: -12 },
        { id: 'ch3q2n_2k2', label: '記者', fullText: '記者', x: 0.52, y: 0.66, rotation: 10 },
        { id: 'ch3q2n_2k3', label: '股東', fullText: '股東', x: 0.82, y: 0.6, rotation: -9 },
      ],
      correctIds: ['ch3q2n_2a'],
      replyOnCorrect: '維運鏈上把回報與漏洞接起來的人——才是能把「跨館」寫成可追責句子的人。',
      wrongRepliesByChoiceId: {
        ch3q2n_2k1: '劉隊在等你把名字填對。你先把鏈上的人對齊。',
        ch3q2n_2k2: '媒體不是責任鏈的一環。你追的是能簽字、能停損的人。',
      },
    },
    bothCorrectDialogue: {
      kk: '一個對現場，一個對鏈。三館這條線，要這樣寫才能往下鑽。',
      liu: '行。下一步我會把光芒與維運兩邊的名字對進流程表。',
    },
    wrongFallback: '對卷不是背人名，是對責任鏈。想想：誰能對到光芒現場、誰能對到跨館維運。',
  },
];

