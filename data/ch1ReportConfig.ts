import type { TwoBlankFillConfig } from '@/components/FloatingFillBlankCore';

/**
 * 第一章章尾：向劉隊報告（現況僅使用「時間線時刻」＋「五題雙格態度填空」＋結語）
 * - 雙格填空與 ch2～ch6 對齊命名：ch1ReportFillBlanks
 */

export interface Ch1ReportTimelineConfig {
  errorMessages: string[];
  crimeTimeRange: { startMinutes: number; endMinutes: number };
}

export interface Ch1ReportAttitudeConfig {
  attitudeFillBlanks: TwoBlankFillConfig[];
  /** 章尾 overlay 結語（單一版本，不依洞察加權） */
  closingInference: string;
  /** 第一章態度四選一（對話選項 id）→ 選後接續台詞 */
  attitudeFollowUpByChoiceId: Record<
    'ch1_attitude_procedure' | 'ch1_attitude_evidence' | 'ch1_attitude_human' | 'ch1_attitude_both',
    string
  >;
}

export interface Ch1ReportConfig {
  timeline: Ch1ReportTimelineConfig;
  attitude: Ch1ReportAttitudeConfig;
}

/** 開啟報告 overlay 時寫入 `ch1_report_evidence` 旗標（相容舊存檔／測試預設）；非玩家互動選擇。 */
export const CH1_REPORT_DEFAULT_EVIDENCE_IDS: string[] = [
  'item_ticket_stub',
  'item_schedule_modified',
  'item_light_control_note',
];

export const ch1ReportFillBlanks: TwoBlankFillConfig[] = [
  {
    id: 'ch1_att_q1',
    sentenceParts: [
      '散場後燈沒有立刻亮起。那三分鐘的',
      '，不是疏漏，是有人刻意',
      '的。',
    ],
    blank1: {
      hintLabel: '第一格：那三分鐘是什麼？',
      options: [
        { id: 'q1_1a', label: '黑暗', fullText: '黑暗', x: 0.2, y: 0.18, rotation: -8 },
        { id: 'q1_1b', label: '空窗', fullText: '空窗', x: 0.45, y: 0.14, rotation: 6 },
        { id: 'q1_1c', label: '延遲', fullText: '延遲', x: 0.72, y: 0.2, rotation: -5 },
        { id: 'q1_1d', label: '等待', fullText: '等待', x: 0.28, y: 0.36, rotation: 10 },
        { id: 'q1_1e', label: '沉默', fullText: '沉默', x: 0.58, y: 0.32, rotation: -9 },
        { id: 'q1_1f', label: '混亂', fullText: '混亂', x: 0.82, y: 0.38, rotation: 7 },
        { id: 'q1_1g', label: '盲區', fullText: '盲區', x: 0.35, y: 0.5, rotation: -6 },
        { id: 'q1_1h', label: '緩衝', fullText: '緩衝', x: 0.65, y: 0.48, rotation: 8 },
        // ── KUSO 誤導選項 ──
        { id: 'q1_1k1', label: '上廁所時間', fullText: '上廁所時間', x: 0.18, y: 0.62, rotation: -12 },
        { id: 'q1_1k2', label: 'KK幻覺', fullText: 'KK幻覺', x: 0.5, y: 0.66, rotation: 9 },
        { id: 'q1_1k3', label: '冥王星公轉', fullText: '冥王星公轉', x: 0.78, y: 0.6, rotation: -7 },
        { id: 'q1_1k4', label: '老闆開會中', fullText: '老闆開會中', x: 0.35, y: 0.74, rotation: 11 },
      ],
      correctIds: ['q1_1b', 'q1_1g'],
      replyOnCorrect: '對。那三分鐘不是意外，是有人算好的窗口。',
      wrongRepliesByChoiceId: {
        q1_1k1: '如果每場都為上廁所多留三分鐘，我們現在查的大概是水費不是命案。',
        q1_1k2: '我做過的白日夢不少，但這筆延後是寫在排程表上，不是在我腦子裡。',
        q1_1k3: '宇宙很浪漫，但這顆燈是接電箱，不是接冥王星公轉。',
        q1_1k4: '老闆愛開長會，跟這三分鐘很合拍，但開關還是在牆上那顆。',
      },
    },
    blank2: {
      hintLabel: '第二格：有人刻意做了什麼？',
      options: [
        { id: 'q1_2a', label: '爭取', fullText: '爭取', x: 0.22, y: 0.2, rotation: -7 },
        { id: 'q1_2b', label: '製造', fullText: '製造', x: 0.5, y: 0.16, rotation: 9 },
        { id: 'q1_2c', label: '延長', fullText: '延長', x: 0.78, y: 0.22, rotation: -8 },
        { id: 'q1_2d', label: '保留', fullText: '保留', x: 0.3, y: 0.38, rotation: 6 },
        { id: 'q1_2e', label: '利用', fullText: '利用', x: 0.6, y: 0.34, rotation: -10 },
        { id: 'q1_2f', label: '安排', fullText: '安排', x: 0.85, y: 0.4, rotation: 7 },
        { id: 'q1_2g', label: '控制', fullText: '控制', x: 0.4, y: 0.52, rotation: -6 },
        { id: 'q1_2h', label: '預留', fullText: '預留', x: 0.68, y: 0.5, rotation: 8 },
        // ── KUSO 誤導選項 ──
        { id: 'q1_2k1', label: '訂外賣', fullText: '訂外賣', x: 0.2, y: 0.63, rotation: -11 },
        { id: 'q1_2k2', label: '放空摸魚', fullText: '放空摸魚', x: 0.52, y: 0.67, rotation: 8 },
        { id: 'q1_2k3', label: '伸懶腰', fullText: '伸懶腰', x: 0.8, y: 0.62, rotation: -9 },
        { id: 'q1_2k4', label: '開直播記錄', fullText: '開直播記錄', x: 0.38, y: 0.75, rotation: 13 },
      ],
      correctIds: ['q1_2c', 'q1_2f'],
      replyOnCorrect: '延長或安排黑暗的人，知道燈什麼時候會亮。',
      wrongRepliesByChoiceId: {
        q1_2k1: '要是只是訂外賣，外送員應該比兇手先上新聞。',
        q1_2k2: '放空摸魚會拖時間沒錯，但這裡的三分鐘太剛好，不像發呆。',
        q1_2k3: '伸懶腰不會寫進排程表，改亮燈時間才會。',
        q1_2k4: '開直播記錄很有紀念價值，但兇手更需要一段不被看到的空檔。',
      },
    },
    bothCorrectDialogue: {
      kk: '流程上有疏漏很方便——可如果有人刻意把黑暗延長，那三分鐘留下的就不是浪漫。',
      liu: '排程表跟燈控我們都會追。你先把報告交上來。',
    },
    wrongFallback: '再想想現場的線索：誰能決定燈什麼時候亮？那三分鐘對誰有利？（提示：別選「上廁所時間」……）',
  },
  {
    id: 'ch1_att_q2',
    sentenceParts: [
      '亮燈時間被塗改，燈控又採',
      '，代表能決定何時亮燈的，是',
      '的人。',
    ],
    blank1: {
      hintLabel: '第一格：燈控採什麼模式？',
      options: [
        { id: 'q2_1a', label: '手動', fullText: '手動', x: 0.25, y: 0.16, rotation: -9 },
        { id: 'q2_1b', label: '自動', fullText: '自動', x: 0.52, y: 0.12, rotation: 7 },
        { id: 'q2_1c', label: '遠端', fullText: '遠端', x: 0.78, y: 0.18, rotation: -6 },
        { id: 'q2_1d', label: '定時', fullText: '定時', x: 0.28, y: 0.34, rotation: 10 },
        { id: 'q2_1e', label: '節能', fullText: '節能', x: 0.58, y: 0.3, rotation: -8 },
        { id: 'q2_1f', label: '緊急', fullText: '緊急', x: 0.82, y: 0.36, rotation: 5 },
        { id: 'q2_1g', label: '排程', fullText: '排程', x: 0.38, y: 0.48, rotation: -7 },
        { id: 'q2_1h', label: '預設', fullText: '預設', x: 0.68, y: 0.46, rotation: 9 },
        // ── KUSO 誤導選項 ──
        { id: 'q2_1k1', label: '心情模式', fullText: '心情模式', x: 0.22, y: 0.62, rotation: -13 },
        { id: 'q2_1k2', label: '通靈感應', fullText: '通靈感應', x: 0.55, y: 0.66, rotation: 10 },
        { id: 'q2_1k3', label: '遙控器不見了', fullText: '遙控器不見了', x: 0.82, y: 0.61, rotation: -8 },
        { id: 'q2_1k4', label: '佛系省電', fullText: '佛系省電', x: 0.38, y: 0.74, rotation: 12 },
      ],
      correctIds: ['q2_1a'],
      replyOnCorrect: '手動模式代表：當晚有人親自碰過開關。',
      wrongRepliesByChoiceId: {
        q2_1k1: '如果燈照心情開，我們現在應該去找那份「心情表」誰簽名。',
        q2_1k2: '有人信通靈，有人信流程。這一條目前還是寫在流程上。',
        q2_1k3: '遙控器不見可以怪健忘，亮燈晚三分鐘得有人負責。',
        q2_1k4: '佛系省電聽起來很環保，但這三分鐘省得有點精準。',
      },
    },
    blank2: {
      hintLabel: '第二格：什麼樣的人能決定亮燈？',
      options: [
        { id: 'q2_2a', label: '在場', fullText: '在場', x: 0.2, y: 0.2, rotation: -8 },
        { id: 'q2_2b', label: '有權限', fullText: '有權限', x: 0.48, y: 0.15, rotation: 8 },
        { id: 'q2_2c', label: '懂設備', fullText: '懂設備', x: 0.74, y: 0.22, rotation: -5 },
        { id: 'q2_2d', label: '值夜', fullText: '值夜', x: 0.3, y: 0.36, rotation: 11 },
        { id: 'q2_2e', label: '負責', fullText: '負責', x: 0.6, y: 0.32, rotation: -9 },
        { id: 'q2_2f', label: '操作', fullText: '操作', x: 0.84, y: 0.38, rotation: 6 },
        { id: 'q2_2g', label: '知情', fullText: '知情', x: 0.35, y: 0.5, rotation: -7 },
        { id: 'q2_2h', label: '經手', fullText: '經手', x: 0.65, y: 0.48, rotation: 10 },
        // ── KUSO 誤導選項 ──
        { id: 'q2_2k1', label: '跟燈很有感情', fullText: '跟燈很有感情', x: 0.18, y: 0.63, rotation: -12 },
        { id: 'q2_2k2', label: '怕鬼不敢黑暗', fullText: '怕鬼不敢黑暗', x: 0.5, y: 0.67, rotation: 9 },
        { id: 'q2_2k3', label: '愛管閒事', fullText: '愛管閒事', x: 0.8, y: 0.62, rotation: -7 },
        { id: 'q2_2k4', label: '燈神信徒', fullText: '燈神信徒', x: 0.37, y: 0.75, rotation: 14 },
      ],
      correctIds: ['q2_2b', 'q2_2f', 'q2_2g'],
      replyOnCorrect: '有權限、能操作、或知情的人，才能把「疏失」演得像真的。',
      wrongRepliesByChoiceId: {
        q2_2k1: '跟燈很有感情可以，但真正決定開關的是那雙手。',
        q2_2k2: '怕鬼不敢黑暗的是觀眾，能決定黑不黑的是值班的人。',
        q2_2k3: '愛管閒事的人很多，能碰控制面板的只會是少數。',
        q2_2k4: '燈神信徒我們尊重，但預算裡沒有編「神明負責照明」。',
      },
    },
    bothCorrectDialogue: {
      kk: '排程表、手動模式、便條上的「燈不用急著開」——流程這次站在兇手那邊。',
      liu: '這條線我們會查。你繼續。',
    },
    wrongFallback: '回想播映室：燈控面板旁的紀錄、誰能碰那顆開關。（「燈神信徒」不在本案調查範圍內。）',
  },
  {
    id: 'ch1_att_q3',
    sentenceParts: [
      '放映員的便條寫著「燈不用急著開」——那不是',
      '，是有人透過',
      '下的指示。',
    ],
    blank1: {
      hintLabel: '第一格：那不是什麼？',
      options: [
        { id: 'q3_1a', label: '疏失', fullText: '疏失', x: 0.22, y: 0.18, rotation: -8 },
        { id: 'q3_1b', label: '建議', fullText: '建議', x: 0.5, y: 0.14, rotation: 7 },
        { id: 'q3_1c', label: '慣例', fullText: '慣例', x: 0.76, y: 0.2, rotation: -6 },
        { id: 'q3_1d', label: '筆記', fullText: '筆記', x: 0.28, y: 0.34, rotation: 10 },
        { id: 'q3_1e', label: '牢騷', fullText: '牢騷', x: 0.58, y: 0.3, rotation: -9 },
        { id: 'q3_1f', label: '提醒', fullText: '提醒', x: 0.82, y: 0.36, rotation: 5 },
        { id: 'q3_1g', label: '備忘', fullText: '備忘', x: 0.38, y: 0.48, rotation: -7 },
        { id: 'q3_1h', label: '口誤', fullText: '口誤', x: 0.66, y: 0.46, rotation: 8 },
        // ── KUSO 誤導選項 ──
        { id: 'q3_1k1', label: '愛的叮嚀', fullText: '愛的叮嚀', x: 0.2, y: 0.62, rotation: -11 },
        { id: 'q3_1k2', label: '放映員的詩', fullText: '放映員的詩', x: 0.52, y: 0.66, rotation: 8 },
        { id: 'q3_1k3', label: '情書草稿', fullText: '情書草稿', x: 0.8, y: 0.61, rotation: -10 },
        { id: 'q3_1k4', label: '月老指示', fullText: '月老指示', x: 0.36, y: 0.74, rotation: 13 },
      ],
      correctIds: ['q3_1a', 'q3_1b'],
      replyOnCorrect: '「疏失」兩個字最好用——寫進報告，就沒人追誰下的指示。建議？便條不像建議，更像掩護。',
      wrongRepliesByChoiceId: {
        q3_1k1: '如果這是愛的叮嚀，對象大概叫兇手——浪漫得有點致命。',
        q3_1k2: '放映員要寫詩可以，寫到燈不用急著開就不是文青，是案件。',
        q3_1k3: '情書會寫名字，這張連署名都不敢留，更像是在擋子彈。',
        q3_1k4: '月老管姻緣，這張便條管的是誰不用負責。',
      },
    },
    blank2: {
      hintLabel: '第二格：透過什麼下的指示？',
      options: [
        { id: 'q3_2a', label: '口頭', fullText: '口頭', x: 0.24, y: 0.16, rotation: -7 },
        { id: 'q3_2b', label: '書面', fullText: '書面', x: 0.5, y: 0.12, rotation: 9 },
        { id: 'q3_2c', label: '電話', fullText: '電話', x: 0.76, y: 0.18, rotation: -6 },
        { id: 'q3_2d', label: '簡訊', fullText: '簡訊', x: 0.28, y: 0.34, rotation: 10 },
        { id: 'q3_2e', label: '當面', fullText: '當面', x: 0.58, y: 0.3, rotation: -8 },
        { id: 'q3_2f', label: '轉達', fullText: '轉達', x: 0.82, y: 0.36, rotation: 6 },
        { id: 'q3_2g', label: '管道', fullText: '管道', x: 0.36, y: 0.48, rotation: -9 },
        { id: 'q3_2h', label: '關係', fullText: '關係', x: 0.64, y: 0.46, rotation: 7 },
        // ── KUSO 誤導選項 ──
        { id: 'q3_2k1', label: '心電感應', fullText: '心電感應', x: 0.22, y: 0.62, rotation: -12 },
        { id: 'q3_2k2', label: '用眼神傳送', fullText: '用眼神傳送', x: 0.54, y: 0.67, rotation: 9 },
        { id: 'q3_2k3', label: '夢境占卜', fullText: '夢境占卜', x: 0.82, y: 0.63, rotation: -8 },
        { id: 'q3_2k4', label: '空氣振動頻率', fullText: '空氣振動頻率', x: 0.38, y: 0.75, rotation: 15 },
      ],
      correctIds: ['q3_2a', 'q3_2e'],
      replyOnCorrect: '沒有署名、沒有紀錄的口頭或當面指示，最適合事後推給「疏失」。',
      wrongRepliesByChoiceId: {
        q3_2k1: '心電感應收不到錄音，事後也找不到誰下的命令。',
        q3_2k2: '眼神可以傳八卦，傳不了責任歸屬。',
        q3_2k3: '夢境占卜頂多當直覺，報告上還是要有人講過那句話。',
        q3_2k4: '空氣會振動沒錯，但沒有紀錄的指示最後都會被寫成「疏失」。',
      },
    },
    bothCorrectDialogue: {
      kk: '有人說、有人做，報告裡只會剩下「流程疏失」。',
      liu: '便條我們會留證。誰轉達的，繼續查。',
    },
    wrongFallback: '想想便條的性質：沒署名、沒時間，最容易被歸類成什麼？（心電感應不算有效的指示媒介……）',
  },
  {
    id: 'ch1_att_q4',
    sentenceParts: [
      '監視器裡有人在燈亮前就',
      '離開——那幾十秒的',
      '，就是兇手給自己的退路。',
    ],
    blank1: {
      hintLabel: '第一格：那個人怎麼離開？',
      options: [
        { id: 'q4_1a', label: '快速', fullText: '快速', x: 0.22, y: 0.18, rotation: -8 },
        { id: 'q4_1b', label: '匆忙', fullText: '匆忙', x: 0.48, y: 0.14, rotation: 7 },
        { id: 'q4_1c', label: '從容', fullText: '從容', x: 0.74, y: 0.2, rotation: -6 },
        { id: 'q4_1d', label: '低調', fullText: '低調', x: 0.28, y: 0.34, rotation: 10 },
        { id: 'q4_1e', label: '單獨', fullText: '單獨', x: 0.56, y: 0.3, rotation: -9 },
        { id: 'q4_1f', label: '趁黑', fullText: '趁黑', x: 0.82, y: 0.36, rotation: 5 },
        { id: 'q4_1g', label: '沿牆', fullText: '沿牆', x: 0.35, y: 0.48, rotation: -7 },
        { id: 'q4_1h', label: '回頭', fullText: '回頭', x: 0.64, y: 0.46, rotation: 8 },
        // ── KUSO 誤導選項 ──
        { id: 'q4_1k1', label: '倒退嚕', fullText: '倒退嚕', x: 0.2, y: 0.62, rotation: -13 },
        { id: 'q4_1k2', label: '翻筋斗', fullText: '翻筋斗', x: 0.52, y: 0.66, rotation: 10 },
        { id: 'q4_1k3', label: '假裝在掃地', fullText: '假裝在掃地', x: 0.8, y: 0.62, rotation: -9 },
        { id: 'q4_1k4', label: '踩滑板逃逸', fullText: '踩滑板逃逸', x: 0.38, y: 0.75, rotation: 14 },
      ],
      correctIds: ['q4_1a', 'q4_1d', 'q4_1f'],
      replyOnCorrect: '快速、低調、趁黑——在燈亮前離開的人，知道燈什麼時候會亮。',
      wrongRepliesByChoiceId: {
        q4_1k1: '要是有人倒退嚕離開現場，技術組早就把那段存成表情包了。',
        q4_1k2: '翻筋斗離開的是特技演員，不是怕被拍到的人。',
        q4_1k3: '假裝在掃地可以演得很用心，但畫面裡那個人比打掃還冷靜。',
        q4_1k4: '踩滑板逃跑很帥，可惜監視器裡的是命案，不是運動攝影機。',
      },
    },
    blank2: {
      hintLabel: '第二格：那幾十秒是什麼？',
      options: [
        { id: 'q4_2a', label: '空檔', fullText: '空檔', x: 0.2, y: 0.2, rotation: -7 },
        { id: 'q4_2b', label: '盲區', fullText: '盲區', x: 0.46, y: 0.16, rotation: 8 },
        { id: 'q4_2c', label: '緩衝', fullText: '緩衝', x: 0.72, y: 0.22, rotation: -6 },
        { id: 'q4_2d', label: '距離', fullText: '距離', x: 0.28, y: 0.36, rotation: 11 },
        { id: 'q4_2e', label: '時間', fullText: '時間', x: 0.58, y: 0.32, rotation: -9 },
        { id: 'q4_2f', label: '餘裕', fullText: '餘裕', x: 0.84, y: 0.38, rotation: 6 },
        { id: 'q4_2g', label: '掩護', fullText: '掩護', x: 0.34, y: 0.5, rotation: -8 },
        { id: 'q4_2h', label: '窗口', fullText: '窗口', x: 0.62, y: 0.48, rotation: 9 },
        // ── KUSO 誤導選項 ──
        { id: 'q4_2k1', label: '下班倒數計時', fullText: '下班倒數計時', x: 0.18, y: 0.63, rotation: -12 },
        { id: 'q4_2k2', label: '靈魂出竅', fullText: '靈魂出竅', x: 0.5, y: 0.67, rotation: 9 },
        { id: 'q4_2k3', label: '摸魚黃金時段', fullText: '摸魚黃金時段', x: 0.8, y: 0.61, rotation: -10 },
        { id: 'q4_2k4', label: '尬聊空間', fullText: '尬聊空間', x: 0.36, y: 0.76, rotation: 13 },
      ],
      correctIds: ['q4_2a', 'q4_2f', 'q4_2g'],
      replyOnCorrect: '那幾十秒的空檔、餘裕、掩護，證明他熟悉動線與時間。',
      wrongRepliesByChoiceId: {
        q4_2k1: '大家都在等下班，只有他算準了可以先消失的那幾秒。',
        q4_2k2: '靈魂出竅交給恐怖片，這裡只看誰真的踩著點離開。',
        q4_2k3: '摸魚黃金時段會拖工作，這幾秒拖的是追查時間。',
        q4_2k4: '尬聊空間可能會有，但兇手要的是「剛好看不到他」的那塊空白。',
      },
    },
    bothCorrectDialogue: {
      kk: '監視器不會說謊，只會讓人以為「沒拍到」就沒事。',
      liu: '畫面我們技術組再拉。你推論的這條我們記下了。',
    },
    wrongFallback: '回想監視器畫面：那個人離開的時機與速度代表什麼？（靈魂出竅雖然很省電，但不在法醫報告的選項裡。）',
  },
  {
    id: 'ch1_att_q5',
    sentenceParts: [
      '廁所被清得太乾淨，但洗手台下的',
      '沒被帶走——',
      '的人，總會漏掉自以為不重要的東西。',
    ],
    blank1: {
      hintLabel: '第一格：洗手台下有什麼？',
      options: [
        { id: 'q5_1a', label: '碎片', fullText: '碎片', x: 0.24, y: 0.16, rotation: -8 },
        { id: 'q5_1b', label: '痕跡', fullText: '痕跡', x: 0.5, y: 0.12, rotation: 7 },
        { id: 'q5_1c', label: '手套', fullText: '手套', x: 0.76, y: 0.18, rotation: -6 },
        { id: 'q5_1d', label: '毛髮', fullText: '毛髮', x: 0.28, y: 0.34, rotation: 10 },
        { id: 'q5_1e', label: '指紋', fullText: '指紋', x: 0.56, y: 0.3, rotation: -9 },
        { id: 'q5_1f', label: '血跡', fullText: '血跡', x: 0.82, y: 0.36, rotation: 5 },
        { id: 'q5_1g', label: '證物', fullText: '證物', x: 0.34, y: 0.48, rotation: -7 },
        { id: 'q5_1h', label: '殘留', fullText: '殘留', x: 0.64, y: 0.46, rotation: 8 },
        // ── KUSO 誤導選項 ──
        { id: 'q5_1k1', label: '命運之石', fullText: '命運之石', x: 0.22, y: 0.62, rotation: -12 },
        { id: 'q5_1k2', label: '硬幣收藏品', fullText: '硬幣收藏品', x: 0.54, y: 0.66, rotation: 9 },
        { id: 'q5_1k3', label: '貓毛（無主）', fullText: '貓毛', x: 0.82, y: 0.62, rotation: -8 },
        { id: 'q5_1k4', label: '洗碗精靈魂', fullText: '洗碗精靈魂', x: 0.38, y: 0.75, rotation: 15 },
      ],
      correctIds: ['q5_1a', 'q5_1h'],
      replyOnCorrect: '黑色塑膠碎片——或說殘留——邊緣不規則，像手套破裂時留下的。',
      wrongRepliesByChoiceId: {
        q5_1k1: '要是每塊碎片都叫命運之石，鑑識科大概得先申請加班費。',
        q5_1k2: '硬幣收藏品會放家裡，躲在洗手台下的比較像他不想被看到的東西。',
        q5_1k3: '現場真有貓的話，牠可能比兇手早被PO上網。',
        q5_1k4: '洗碗精靈魂也許很潔癖，但這塊碎片是拿去驗材質的那一種。',
      },
    },
    blank2: {
      hintLabel: '第二格：什麼樣的人會漏掉？',
      options: [
        { id: 'q5_2a', label: '擦地板', fullText: '擦地板', x: 0.22, y: 0.18, rotation: -7 },
        { id: 'q5_2b', label: '滅證', fullText: '滅證', x: 0.48, y: 0.14, rotation: 8 },
        { id: 'q5_2c', label: '清理', fullText: '清理', x: 0.74, y: 0.2, rotation: -6 },
        { id: 'q5_2d', label: '收尾', fullText: '收尾', x: 0.28, y: 0.34, rotation: 10 },
        { id: 'q5_2e', label: '掩蓋', fullText: '掩蓋', x: 0.58, y: 0.3, rotation: -9 },
        { id: 'q5_2f', label: '善後', fullText: '善後', x: 0.82, y: 0.36, rotation: 6 },
        { id: 'q5_2g', label: '毀跡', fullText: '毀跡', x: 0.36, y: 0.48, rotation: -8 },
        { id: 'q5_2h', label: '心虛', fullText: '心虛', x: 0.64, y: 0.46, rotation: 9 },
        // ── KUSO 誤導選項 ──
        { id: 'q5_2k1', label: '邊唱歌邊收尾', fullText: '邊唱歌邊收尾', x: 0.2, y: 0.63, rotation: -11 },
        { id: 'q5_2k2', label: '腦子想著便當', fullText: '腦子想著便當', x: 0.52, y: 0.67, rotation: 10 },
        { id: 'q5_2k3', label: '靈魂不在場', fullText: '靈魂不在場', x: 0.8, y: 0.62, rotation: -9 },
        { id: 'q5_2k4', label: '職業選手水準（所以不用洗）', fullText: '職業選手', x: 0.38, y: 0.76, rotation: 14 },
      ],
      correctIds: ['q5_2a', 'q5_2b', 'q5_2e', 'q5_2g'],
      replyOnCorrect: '急著把現場弄乾淨的人——管你叫擦地板、滅證、掩蓋還是毀跡——多半有東西不能留。',
      wrongRepliesByChoiceId: {
        q5_2k1: '邊唱歌邊收尾的人很多，會忘記撿碎片的通常心裡比較急。',
        q5_2k2: '腦子想著便當可以理解，問題是他想得太快，手就會漏東西。',
        q5_2k3: '靈魂不在場，手卻很認真在擦，這種人最會漏自己以為小的東西。',
        q5_2k4: '職業選手也要收尾，真專業的是不留破綻，不是不用洗。',
      },
    },
    bothCorrectDialogue: {
      kk: '這種「乾淨」本身就很可疑。碎片比血跡難處理，他忘了。',
      liu: '洗手台與清潔紀錄我們都會查。報告先交。',
    },
    wrongFallback: '回想廁所：周姊發現了什麼？清潔備忘上垃圾桶那欄寫得怎樣？（「腦子想著便當」雖然很理解，但不算法律上的犯罪動機。）',
  },
];

export const ch1ReportConfig: Ch1ReportConfig = {
  timeline: {
    errorMessages: [
      '時間線對不上，再排一次。',
      '順序錯了——先想誰能控制燈、誰在黑暗裡。',
      '首尾可以固定：開演、報案。中間三張再想想。',
    ],
    crimeTimeRange: { startMinutes: 14, endMinutes: 17 },
  },
  attitude: {
    attitudeFillBlanks: ch1ReportFillBlanks,
    closingInference:
      '兇手不是在黑暗裡殺人，他是在規定的黑暗裡殺人。',
    attitudeFollowUpByChoiceId: {
      ch1_attitude_procedure:
        '兇手不是在黑暗裡殺人，他是在規定的黑暗裡殺人。',
      ch1_attitude_evidence:
        '官腔很滑，但官腔擋不住痕跡。找一個他沒想到的小東西，他就會破。',
      ch1_attitude_human:
        '他怕的不是兇手，是上面那張看不見的臉。恐懼會替兇手擦地板。',
      ch1_attitude_both:
        '規定、痕跡、恐懼——三條線都收在同一個缺口；你選哪條當主線，劉隊都會讓你把報告寫完。',
    },
  },
};
