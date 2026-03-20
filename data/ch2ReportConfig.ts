import type { TwoBlankFillConfig } from '@/components/FloatingFillBlankCore';

/**
 * 第二章章尾：向劉隊報告（5 題雙格填空，與 ch3～ch6 同款 ReportFillBlank）
 */
export const ch2ReportFillBlanks: TwoBlankFillConfig[] = [
  {
    id: 'ch2_report_q1',
    sentenceParts: [
      '草稿寫的不是設備本身，而是後面那句：省電、省時，到最後連',
      '都會被寫成可以一起省掉的對象；這份筆記真正想省掉的是',
      '。',
    ],
    blank1: {
      hintLabel: '第一格：最後被「一起省掉」的，比較像什麼？',
      options: [
        { id: 'ch2r1_1a', label: '連帶責任', fullText: '連帶責任', x: 0.22, y: 0.18, rotation: -8 },
        { id: 'ch2r1_1b', label: '維修工時', fullText: '維修工時', x: 0.5, y: 0.14, rotation: 7 },
        { id: 'ch2r1_1c', label: '可以說清楚的那段', fullText: '可以說清楚的那段', x: 0.76, y: 0.2, rotation: -6 },
        { id: 'ch2r1_1d', label: '爆米花補鹽流程', fullText: '爆米花補鹽流程', x: 0.28, y: 0.36, rotation: 10 },
        { id: 'ch2r1_1e', label: '午夜場的浪漫氣氛', fullText: '午夜場的浪漫氣氛', x: 0.58, y: 0.34, rotation: -9 },
        { id: 'ch2r1_1k1', label: '觀眾耐心', fullText: '觀眾耐心', x: 0.2, y: 0.62, rotation: -12 },
        { id: 'ch2r1_1k2', label: '片尾字幕', fullText: '片尾字幕', x: 0.52, y: 0.66, rotation: 9 },
        { id: 'ch2r1_1k3', label: '影廳香氛', fullText: '影廳香氛', x: 0.82, y: 0.6, rotation: -9 },
      ],
      correctIds: ['ch2r1_1a', 'ch2r1_1b', 'ch2r1_1c'],
      replyOnCorrect: '他不是在省情緒，是在省「誰要負責」那一段。',
      wrongRepliesByChoiceId: {
        ch2r1_1k3: '香氛不會出現在事故草稿的句子裡。他在省的是責任，不是氣味。',
      },
    },
    blank2: {
      hintLabel: '第二格：簡報先講好處時，真正被藏起來的通常是？',
      options: [
        { id: 'ch2r1_2a', label: '責任', fullText: '責任', x: 0.24, y: 0.18, rotation: -7 },
        { id: 'ch2r1_2b', label: '問責鏈', fullText: '問責鏈', x: 0.52, y: 0.12, rotation: 8 },
        { id: 'ch2r1_2c', label: '可追溯的環節', fullText: '可追溯的環節', x: 0.78, y: 0.2, rotation: -6 },
        { id: 'ch2r1_2d', label: '電費單', fullText: '電費單', x: 0.3, y: 0.35, rotation: 11 },
        { id: 'ch2r1_2k1', label: '爆米花成本', fullText: '爆米花成本', x: 0.2, y: 0.63, rotation: -11 },
        { id: 'ch2r1_2k2', label: '觀影體驗', fullText: '觀影體驗', x: 0.52, y: 0.67, rotation: 10 },
        { id: 'ch2r1_2k3', label: '票房數字', fullText: '票房數字', x: 0.82, y: 0.62, rotation: -8 },
      ],
      correctIds: ['ch2r1_2a', 'ch2r1_2b', 'ch2r1_2c'],
      replyOnCorrect: '好處寫在前面，責任被留在後面——最後連後面都省掉。',
      wrongRepliesByChoiceId: {
        ch2r1_2k1: '成本會被寫進簡報當政績，不會被他當成威脅句。',
      },
    },
    bothCorrectDialogue: {
      kk: '他在草稿裡把「省」字寫兩次：省電、省時，最後連責任也想省成別人的事。',
      liu: '這條先記成「節能敘事可能遮蔽問責」。第三章進大廳，你要對照誰在擦白板、誰在改 log。',
    },
    wrongFallback:
      '他不是寫給觀眾看情緒。想想：簡報裡好處講滿時，真正被藏起來的是哪一種「省」？兩格要對到同一條責任線。',
  },
  {
    id: 'ch2_report_q2',
    sentenceParts: [
      '兩年前那次，她也在',
      '；這個「在」不是八卦，是紀錄語言——一旦',
      '被寫進去，整件事才開始不安靜。',
    ],
    blank1: {
      hintLabel: '第一格：「她也在」後面，比較像哪一種「在」？',
      options: [
        { id: 'ch2r2_1a', label: '那次事故裡', fullText: '那次事故裡', x: 0.22, y: 0.18, rotation: -8 },
        { id: 'ch2r2_1b', label: '早期驗收流程裡', fullText: '早期驗收流程裡', x: 0.5, y: 0.14, rotation: 7 },
        { id: 'ch2r2_1c', label: '那個不該再被叫出名字的地方', fullText: '那個不該再被叫出名字的地方', x: 0.72, y: 0.22, rotation: -6 },
        { id: 'ch2r2_1d', label: '停車繳費名單裡', fullText: '停車繳費名單裡', x: 0.28, y: 0.36, rotation: 10 },
        { id: 'ch2r2_1e', label: '員工慶生合照裡', fullText: '員工慶生合照裡', x: 0.58, y: 0.34, rotation: -9 },
        { id: 'ch2r2_1k1', label: '影評留言串裡', fullText: '影評留言串裡', x: 0.2, y: 0.62, rotation: -12 },
        { id: 'ch2r2_1k2', label: '他的私人關係裡', fullText: '他的私人關係裡', x: 0.52, y: 0.66, rotation: 9 },
      ],
      correctIds: ['ch2r2_1a', 'ch2r2_1b', 'ch2r2_1c'],
      replyOnCorrect: '對。這裡的「在」是事故座標，不是緋聞座標。',
      wrongRepliesByChoiceId: {
        ch2r2_1k1: '留言串不會讓人寫得像釘書釘。他在釘的是事故位置。',
      },
    },
    blank2: {
      hintLabel: '第二格：被寫進紀錄後，什麼東西會開始「不安靜」？',
      options: [
        { id: 'ch2r2_2a', label: '事故位置', fullText: '事故位置', x: 0.24, y: 0.18, rotation: -7 },
        { id: 'ch2r2_2b', label: '她的名字與現場的對應', fullText: '她的名字與現場的對應', x: 0.48, y: 0.12, rotation: 8 },
        { id: 'ch2r2_2c', label: '紀錄裡的節點', fullText: '紀錄裡的節點', x: 0.76, y: 0.2, rotation: -6 },
        { id: 'ch2r2_2d', label: '八卦標題', fullText: '八卦標題', x: 0.3, y: 0.35, rotation: 11 },
        { id: 'ch2r2_2k1', label: '粉絲應援', fullText: '粉絲應援', x: 0.2, y: 0.63, rotation: -11 },
        { id: 'ch2r2_2k2', label: '社群熱度', fullText: '社群熱度', x: 0.52, y: 0.67, rotation: 10 },
      ],
      correctIds: ['ch2r2_2a', 'ch2r2_2b', 'ch2r2_2c'],
      replyOnCorrect: '紀錄一對上，沉默就失效——所以才會「不安靜」。',
      wrongRepliesByChoiceId: {},
    },
    bothCorrectDialogue: {
      kk: '「她也在場」像釘書釘：釘住名字，也釘住兩年前那個還沒關掉的節點。',
      liu: '這條寫「待查：兩年前事故與在場紀錄」。別在這裡寫死身分，留給現場去對。',
    },
    wrongFallback: '如果只是照片或社交場景，他不會用這種冷硬的「在」。先找事故座標，再找紀錄裡被點名的節點。',
  },
  {
    id: 'ch2_report_q3',
    sentenceParts: [
      '若每件事都能講成個案，排在一起就不像巧合；更像是先放三個',
      '，之後才好比對是不是同一套',
      '留下來的。',
    ],
    blank1: {
      hintLabel: '第一格：他把三起東西先做成什麼？',
      options: [
        { id: 'ch2r3_1a', label: '獨立節點', fullText: '獨立節點', x: 0.22, y: 0.18, rotation: -8 },
        { id: 'ch2r3_1b', label: '事故樣本', fullText: '事故樣本', x: 0.5, y: 0.14, rotation: 7 },
        { id: 'ch2r3_1c', label: '能暫時放住懷疑的抽屜', fullText: '能暫時放住懷疑的抽屜', x: 0.72, y: 0.22, rotation: -6 },
        { id: 'ch2r3_1d', label: '平行時空入口', fullText: '平行時空入口', x: 0.28, y: 0.36, rotation: 10 },
        { id: 'ch2r3_1e', label: '深夜優惠方案', fullText: '深夜優惠方案', x: 0.58, y: 0.34, rotation: -9 },
        { id: 'ch2r3_1k1', label: '系列專欄題綱', fullText: '系列專欄題綱', x: 0.2, y: 0.62, rotation: -12 },
        { id: 'ch2r3_1k2', label: '媒體炒作方向', fullText: '媒體炒作方向', x: 0.52, y: 0.66, rotation: 9 },
      ],
      correctIds: ['ch2r3_1a', 'ch2r3_1b', 'ch2r3_1c'],
      replyOnCorrect: '節點、樣本、抽屜——都是技術人寫表會用的格線。',
      wrongRepliesByChoiceId: {
        ch2r3_1k1: '題綱會拿來發稿，不會拿來對三館時間線。',
      },
    },
    blank2: {
      hintLabel: '第二格：排完三格之後，要比對的是同一套什麼？',
      options: [
        { id: 'ch2r3_2a', label: '錯誤', fullText: '錯誤', x: 0.24, y: 0.18, rotation: -7 },
        { id: 'ch2r3_2b', label: '痕跡', fullText: '痕跡', x: 0.52, y: 0.12, rotation: 8 },
        { id: 'ch2r3_2c', label: '系統性的東西', fullText: '系統性的東西', x: 0.76, y: 0.2, rotation: -6 },
        { id: 'ch2r3_2d', label: '宣傳話術', fullText: '宣傳話術', x: 0.3, y: 0.35, rotation: 11 },
        { id: 'ch2r3_2k1', label: '迷因梗', fullText: '迷因梗', x: 0.2, y: 0.63, rotation: -11 },
        { id: 'ch2r3_2k2', label: '票房預測', fullText: '票房預測', x: 0.52, y: 0.67, rotation: 10 },
      ],
      correctIds: ['ch2r3_2a', 'ch2r3_2b', 'ch2r3_2c'],
      replyOnCorrect: '三格對齊，看的是同一種錯是不是複製貼上。',
      wrongRepliesByChoiceId: {},
    },
    bothCorrectDialogue: {
      kk: '「三起事故」像表頭：不是標題，是逼你把個案排成欄位的那隻手。',
      liu: '記住 W、C、R 三個代號。進第三章，你要看 log 敢不敢讓你跨館對起來。',
    },
    wrongFallback: '他不是在做行銷企劃。先把「三格」想成調查表上的欄位，再想同一套什麼會跨格重複出現。',
  },
  {
    id: 'ch2_report_q4',
    sentenceParts: [
      '定位繞圈等的不是人遲到，而是等',
      '先咬合；那通常發生在',
      '被排進去的時間窗裡。',
    ],
    blank1: {
      hintLabel: '第一格：他在外面繞圈，等的比較像什麼？',
      options: [
        { id: 'ch2r4_1a', label: '甜蜜時點', fullText: '甜蜜時點', x: 0.22, y: 0.18, rotation: -8 },
        { id: 'ch2r4_1b', label: '燈控排程', fullText: '燈控排程', x: 0.5, y: 0.14, rotation: 7 },
        { id: 'ch2r4_1c', label: '那個會讓所有人看起來都合理的瞬間', fullText: '那個會讓所有人看起來都合理的瞬間', x: 0.68, y: 0.22, rotation: -6 },
        { id: 'ch2r4_1d', label: '自動販賣機補貨時間', fullText: '自動販賣機補貨時間', x: 0.28, y: 0.36, rotation: 10 },
        { id: 'ch2r4_1e', label: '停車位空出來', fullText: '停車位空出來', x: 0.58, y: 0.34, rotation: -9 },
        { id: 'ch2r4_1k1', label: '散場後的幽靈觀眾', fullText: '散場後的幽靈觀眾', x: 0.2, y: 0.62, rotation: -12 },
        { id: 'ch2r4_1k2', label: '門禁切換', fullText: '門禁切換', x: 0.52, y: 0.66, rotation: 9 },
      ],
      correctIds: ['ch2r4_1a', 'ch2r4_1b', 'ch2r4_1c'],
      replyOnCorrect: '不是赴約，是觀測——觀測的是條件何時對齊。',
      wrongRepliesByChoiceId: {
        ch2r4_1k2: '門禁會換，但那句話在等的是更大的咬合點——燈、表、或「看起來合理」的那一秒。',
      },
    },
    blank2: {
      hintLabel: '第二格：那個「咬合」最常落在什麼被排進表的地方？',
      options: [
        { id: 'ch2r4_2a', label: '燈光與散場節奏', fullText: '燈光與散場節奏', x: 0.22, y: 0.18, rotation: -7 },
        { id: 'ch2r4_2b', label: '流程表', fullText: '流程表', x: 0.5, y: 0.12, rotation: 8 },
        { id: 'ch2r4_2c', label: '控制面板上的動作', fullText: '控制面板上的動作', x: 0.74, y: 0.2, rotation: -6 },
        { id: 'ch2r4_2d', label: '爆米花出爐時間', fullText: '爆米花出爐時間', x: 0.3, y: 0.35, rotation: 11 },
        { id: 'ch2r4_2k1', label: '電影彩蛋', fullText: '電影彩蛋', x: 0.2, y: 0.63, rotation: -11 },
        { id: 'ch2r4_2k2', label: '清潔排班', fullText: '清潔排班', x: 0.52, y: 0.67, rotation: 10 },
      ],
      correctIds: ['ch2r4_2a', 'ch2r4_2b', 'ch2r4_2c'],
      replyOnCorrect: '人在外面繞，等的是裡面那套時間表先動。',
      wrongRepliesByChoiceId: {
        ch2r4_2k1: '彩蛋會讓人尖叫，不會讓人繞兩小時不敢進場。',
      },
    },
    bothCorrectDialogue: {
      kk: '他等的不是誰走進畫面，是「燈、表、人潮」一起對上的那一刻。',
      liu: '這條接得上第一章的燈。進封鎖大廳，你要追誰能改表、誰能改敘事。',
    },
    wrongFallback: '補貨與停車不需要繞那麼久。想想：什麼東西「準時發生」時，所有人的說法會一起變合理？',
  },
  {
    id: 'ch2_report_q5',
    sentenceParts: [
      '出事後每個人只交一小塊說法；他們熟的是立刻',
      '，把故事切碎——這種熟練不像',
      '。',
    ],
    blank1: {
      hintLabel: '第一格：一出事，他們先熟練地做什麼？',
      options: [
        { id: 'ch2r5_1a', label: '亂講', fullText: '亂講', x: 0.24, y: 0.18, rotation: -8 },
        { id: 'ch2r5_1b', label: '切割', fullText: '切割', x: 0.52, y: 0.14, rotation: 7 },
        { id: 'ch2r5_1c', label: '補紀錄', fullText: '補紀錄', x: 0.78, y: 0.2, rotation: -6 },
        { id: 'ch2r5_1d', label: '集體改賣熱狗', fullText: '集體改賣熱狗', x: 0.28, y: 0.36, rotation: 10 },
        { id: 'ch2r5_1e', label: '假裝首映來賓', fullText: '假裝首映來賓', x: 0.56, y: 0.34, rotation: -9 },
        { id: 'ch2r5_1k1', label: '逃跑', fullText: '逃跑', x: 0.2, y: 0.62, rotation: -12 },
        { id: 'ch2r5_1k2', label: '發限動', fullText: '發限動', x: 0.52, y: 0.66, rotation: 9 },
      ],
      correctIds: ['ch2r5_1a', 'ch2r5_1b', 'ch2r5_1c'],
      replyOnCorrect: '跑掉的是人，留下來的是版本；切割與補紀錄都是後製。',
      wrongRepliesByChoiceId: {
        ch2r5_1k2: '限動救不了結案報告的兩個版本。',
      },
    },
    blank2: {
      hintLabel: '第二格：這種「太熟」比較不像什麼？',
      options: [
        { id: 'ch2r5_2a', label: '第一次', fullText: '第一次', x: 0.24, y: 0.18, rotation: -7 },
        { id: 'ch2r5_2b', label: '臨時反應', fullText: '臨時反應', x: 0.52, y: 0.12, rotation: 8 },
        { id: 'ch2r5_2c', label: '手忙腳亂', fullText: '手忙腳亂', x: 0.76, y: 0.2, rotation: -6 },
        { id: 'ch2r5_2d', label: '團隊建立活動', fullText: '團隊建立活動', x: 0.3, y: 0.35, rotation: 11 },
        { id: 'ch2r5_2k1', label: '靈感迸發', fullText: '靈感迸發', x: 0.2, y: 0.63, rotation: -11 },
        { id: 'ch2r5_2k2', label: '偶然應對', fullText: '偶然應對', x: 0.52, y: 0.67, rotation: 10 },
      ],
      correctIds: ['ch2r5_2a', 'ch2r5_2b', 'ch2r5_2c'],
      replyOnCorrect: '太整齊了。像排練過，不像第一次撞上。',
      wrongRepliesByChoiceId: {
        ch2r5_2k1: '靈感不會讓兩份結案報告長得剛好各講各的。',
      },
    },
    bothCorrectDialogue: {
      kk: '錄音裡那句「兩個版本」不是八卦，是流程：有人早就知道怎麼把故事切開。',
      liu: '好。第二章停在「手機裡的版本」。接下來去大廳，看現場怎麼把版本再擦一次。',
    },
    wrongFallback: '若只是慌，不會每個人都剛好只拿一小塊。想想：出事後先動的是嘴、刀、還是筆？那動作像不像第一次？',
  },
];
