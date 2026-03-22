import type { TwoBlankFillConfig } from '@/components/FloatingFillBlankCore';

/**
 * 第二章章尾：向劉隊報告
 * - 雙格填空資料結構與 ch1 的 `ch1ReportFillBlanks` 相同（`TwoBlankFillConfig[]`）
 * - 呈現元件：`ReportFillBlank`（與 ch3～ch6 同款）
 * - 文案邏輯：己＋深化版——資訊偏模糊、KK 冷幽默；烏鴉等在脈絡中呈現，每格允許多個語意正解（correctIds）
 */

export interface Ch2ReportConfig {
  ch2ReportFillBlanks: TwoBlankFillConfig[];
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
  {
    id: 'ch2_report_q3',
    sentenceParts: [
      '「三起」若是隨口氣話應該會飄走；它卻穩得像被釘在「',
      '」上。錄音與草稿讓你聽見版本：對外說法更像經過「',
      '」，而不是單純說錯。',
    ],
    blank1: {
      hintLabel: 'KK：它穩得像哪種語言？',
      options: [
        { id: 'ch2r3_1a', label: '欄位或表頭語言', fullText: '欄位或表頭語言', x: 0.22, y: 0.18, rotation: -8 },
        { id: 'ch2r3_1b', label: '可比對的格子', fullText: '可比對的格子', x: 0.5, y: 0.14, rotation: 7 },
        { id: 'ch2r3_1c', label: '流程節點感', fullText: '流程節點感', x: 0.74, y: 0.2, rotation: -6 },
        { id: 'ch2r3_1d', label: '報表式用語', fullText: '報表式用語', x: 0.28, y: 0.34, rotation: 9 },
        { id: 'ch2r3_1k1', label: '三部曲片名', fullText: '三部曲片名', x: 0.2, y: 0.58, rotation: -11 },
        { id: 'ch2r3_1k2', label: '便當三格配菜', fullText: '便當三格配菜', x: 0.52, y: 0.62, rotation: 8 },
        {
          id: 'ch2r3_1k3',
          label: '恐嚇信排版（也很整齊）',
          fullText: '恐嚇信排版（也很整齊）',
          x: 0.76,
          y: 0.58,
          rotation: -7,
        },
      ],
      correctIds: ['ch2r3_1a', 'ch2r3_1b', 'ch2r3_1c', 'ch2r3_1d'],
      replyOnCorrect: '對。髒情緒很少排成三格；會排成三格的，通常是表。',
      wrongRepliesByChoiceId: {
        ch2r3_1k3: '恐嚇信也能排得很整齊——但整齊的目的通常是讓你怕，不是讓你好對帳。',
      },
    },
    blank2: {
      hintLabel: 'KK：對外版本更像經過什麼處理？',
      options: [
        { id: 'ch2r3_2a', label: '修整與刪剪', fullText: '修整與刪剪', x: 0.24, y: 0.18, rotation: -7 },
        { id: 'ch2r3_2b', label: '換皮敘事', fullText: '換皮敘事', x: 0.5, y: 0.12, rotation: 8 },
        { id: 'ch2r3_2c', label: '把責任邊界磨薄', fullText: '把責任邊界磨薄', x: 0.74, y: 0.2, rotation: -6 },
        { id: 'ch2r3_2d', label: '讓句子變好結案', fullText: '讓句子變好結案', x: 0.3, y: 0.34, rotation: 10 },
        { id: 'ch2r3_2k1', label: '校對改錯字', fullText: '校對改錯字', x: 0.2, y: 0.58, rotation: -10 },
        { id: 'ch2r3_2k2', label: '美編加字體', fullText: '美編加字體', x: 0.52, y: 0.62, rotation: 9 },
        { id: 'ch2r3_2k3', label: '加字幕而已', fullText: '加字幕而已', x: 0.8, y: 0.58, rotation: -8 },
      ],
      correctIds: ['ch2r3_2a', 'ch2r3_2b', 'ch2r3_2c', 'ch2r3_2d'],
      replyOnCorrect: '對。你聽見的不一定是謊言，可能是責任被提前搬運。',
      wrongRepliesByChoiceId: {
        ch2r3_2k2: '字體再美，也美不過「責任變薄」這件事。',
      },
    },
    bothCorrectDialogue: {
      kk: '表不會哭，只會讓你簽名。',
      liu: '寫「疑似敘事修整」。第二章別審判剪刀手。',
    },
    wrongFallback:
      'KK：先判斷它是不是「格式語言」，再判斷「薄掉的是哪一塊責任」。別急著找兇手，先找版型。',
  },
  {
    id: 'ch2_report_q4',
    sentenceParts: [
      '「An」這種暱稱會讓大腦自動補感情戲——讀成「',
      '」，人就容易太早點頭。對齊 Unknown 的節奏後，比較像「',
      '」在接手：私人語氣被排成公開結論的走道。',
    ],
    blank1: {
      hintLabel: 'KK：哪種讀法會讓你太快點頭？',
      options: [
        { id: 'ch2r4_1a', label: '舊帳／吃醋／威脅感', fullText: '舊帳／吃醋／威脅感', x: 0.2, y: 0.17, rotation: -8 },
        { id: 'ch2r4_1b', label: '執念敘事', fullText: '執念敘事', x: 0.46, y: 0.13, rotation: 7 },
        { id: 'ch2r4_1c', label: '把對方讀成「還在意」', fullText: '把對方讀成「還在意」', x: 0.72, y: 0.19, rotation: -5 },
        {
          id: 'ch2r4_1d',
          label: '交換條件的籌碼線',
          fullText: '交換條件的籌碼線',
          x: 0.28,
          y: 0.33,
          rotation: 9,
        },
        { id: 'ch2r4_1k1', label: '限動小劇場', fullText: '限動小劇場', x: 0.2, y: 0.57, rotation: -11 },
        { id: 'ch2r4_1k2', label: '感情諮商罐頭句', fullText: '感情諮商罐頭句', x: 0.52, y: 0.61, rotation: 8 },
        { id: 'ch2r4_1k3', label: '已讀不回競技', fullText: '已讀不回競技', x: 0.78, y: 0.57, rotation: -7 },
      ],
      correctIds: ['ch2r4_1a', 'ch2r4_1b', 'ch2r4_1c', 'ch2r4_1d'],
      replyOnCorrect: '對。舒服常常是別人替你剪過。',
      wrongRepliesByChoiceId: {
        ch2r4_1k2: '罐頭句很安慰人，但安慰通常不是證據，是服務業。',
      },
    },
    blank2: {
      hintLabel: 'KK：Unknown 像哪種機制在接手？',
      options: [
        { id: 'ch2r4_2a', label: '口徑', fullText: '口徑', x: 0.26, y: 0.18, rotation: -7 },
        { id: 'ch2r4_2b', label: '代操或排版感', fullText: '代操或排版感', x: 0.52, y: 0.12, rotation: 8 },
        { id: 'ch2r4_2c', label: '清欄位', fullText: '清欄位', x: 0.76, y: 0.2, rotation: -6 },
        { id: 'ch2r4_2d', label: '像工單不像聊天', fullText: '像工單不像聊天', x: 0.3, y: 0.34, rotation: 10 },
        { id: 'ch2r4_2k1', label: '對方理工腦', fullText: '對方理工腦', x: 0.22, y: 0.58, rotation: -10 },
        { id: 'ch2r4_2k2', label: '客服 SOP', fullText: '客服 SOP', x: 0.52, y: 0.62, rotation: 9 },
        { id: 'ch2r4_2k3', label: '正式模板', fullText: '正式模板', x: 0.78, y: 0.58, rotation: -8 },
      ],
      correctIds: ['ch2r4_2a', 'ch2r4_2b', 'ch2r4_2c', 'ch2r4_2d'],
      replyOnCorrect: '對。匿名可以是面具，也可以是工單。',
      wrongRepliesByChoiceId: {
        ch2r4_2k2: 'SOP 也能談戀愛——跟你的耐心談。',
      },
    },
    bothCorrectDialogue: {
      kk: '最像人的那句，有時最不像活人聊天；這不是浪漫，這是警訊。',
      liu: '動機寫待查。備註寫：「語氣像誰在寫」。',
    },
    wrongFallback: 'KK：別用「他還愛不愛」結案。你要問的是：誰讓這句話變得好結案。',
  },
  {
    id: 'ch2_report_q5',
    sentenceParts: [
      '三件事並排，腦中會自動上演「',
      '」——省事愛巧合。可現場更像在追「誰能把故事變短」：那隻手把東西丟進「',
      '」，讓簽核變順，而不是讓劇情變刺激。',
    ],
    blank1: {
      hintLabel: 'KK：先拆掉哪一種懶敘事？',
      options: [
        {
          id: 'ch2r5_1a',
          label: '一宗命案加兩次巧合',
          fullText: '一宗命案加兩次巧合',
          x: 0.2,
          y: 0.17,
          rotation: -8,
        },
        { id: 'ch2r5_1b', label: '三個無關個案排隊', fullText: '三個無關個案排隊', x: 0.48, y: 0.13, rotation: 7 },
        {
          id: 'ch2r5_1c',
          label: '單一兇手加兩次倒楣',
          fullText: '單一兇手加兩次倒楣',
          x: 0.74,
          y: 0.19,
          rotation: -5,
        },
        { id: 'ch2r5_1k1', label: '電影宇宙彩蛋', fullText: '電影宇宙彩蛋', x: 0.28, y: 0.33, rotation: 9 },
        { id: 'ch2r5_1k2', label: '行銷三部曲', fullText: '行銷三部曲', x: 0.52, y: 0.33, rotation: -6 },
        { id: 'ch2r5_1k3', label: '都市傳說合集', fullText: '都市傳說合集', x: 0.22, y: 0.56, rotation: -11 },
      ],
      correctIds: ['ch2r5_1a', 'ch2r5_1b', 'ch2r5_1c'],
      replyOnCorrect: '對。巧合堆疊是故事的便宜；流程表是案件的貴。',
      wrongRepliesByChoiceId: {
        ch2r5_1k2: '三部曲很會賣票，但命案不買套票。',
      },
    },
    blank2: {
      hintLabel: 'KK：那隻「整理的手」更像在做什麼？',
      options: [
        {
          id: 'ch2r5_2a',
          label: '分類風險、整理事故',
          fullText: '分類風險、整理事故',
          x: 0.2,
          y: 0.16,
          rotation: -7,
        },
        { id: 'ch2r5_2b', label: '修剪對外說法', fullText: '修剪對外說法', x: 0.48, y: 0.12, rotation: 8 },
        {
          id: 'ch2r5_2c',
          label: '讓責任變薄、簽核變順',
          fullText: '讓責任變薄、簽核變順',
          x: 0.72,
          y: 0.18,
          rotation: -5,
        },
        {
          id: 'ch2r5_2d',
          label: '會讓結案變順的機制',
          fullText: '會讓結案變順的機制',
          x: 0.28,
          y: 0.32,
          rotation: 10,
        },
        { id: 'ch2r5_2k1', label: '懶人包產線', fullText: '懶人包產線', x: 0.22, y: 0.56, rotation: -10 },
        { id: 'ch2r5_2k2', label: '演算法推薦', fullText: '演算法推薦', x: 0.52, y: 0.6, rotation: 9 },
        { id: 'ch2r5_2k3', label: '魔術方塊第三層', fullText: '魔術方塊第三層', x: 0.78, y: 0.56, rotation: -8 },
      ],
      correctIds: ['ch2r5_2a', 'ch2r5_2b', 'ch2r5_2c', 'ch2r5_2d'],
      replyOnCorrect: '你寫的不是陰謀論；你寫的是表格怎麼把人變成可結案數字。',
      wrongRepliesByChoiceId: {
        ch2r5_2k1: '懶人包很善良，善良到常把「誰該扛」懶掉。',
      },
    },
    bothCorrectDialogue: {
      kk: '刺激是給觀眾的；SOP 是給長官的。你選哪一邊，就會寫出哪一種世界。',
      liu: '模型寫到權限假設。別寫成破案宣言。',
    },
    wrongFallback:
      'KK：先讓巧合退場，再讓流程上場。順序反了，你會以為自己在寫編劇指南。',
  },
];

export const ch2ReportConfig: Ch2ReportConfig = {
  ch2ReportFillBlanks,
};
