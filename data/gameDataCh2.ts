import { Scene, Item, NpcDialogNode } from '@/types/game';

// 第二章：阿蘇五題「浮動答案卡」設定 ------------------------------

export type Ch2QuestionKey = 'q1' | 'q2' | 'q3' | 'q4' | 'q5';

export interface FloatingAnswerConfig {
  id: string;        // 選項 ID，例如 'q1_A'
  label: string;     // 卡片上顯示的短句
  fullText: string;  // 用於填入殘句空格的完整文字（通常與 label 相同）
  x: number;         // 場景相對座標 0~1（寬度方向）
  y: number;         // 場景相對座標 0~1（高度方向）
  rotation: number;  // 旋轉角度（度數），正負皆可
}

export interface QuestionConfig {
  key: Ch2QuestionKey;
  title: string;               // 題目標題（UI 用）
  sentencePrefix: string;      // 殘句前半（含換行）
  sentenceSuffix: string;      // 殘句後半（含換行），中間空出一格給填入答案
  options: FloatingAnswerConfig[]; // 七個選項
  correctIds: string[];        // 有效答案 ID（主正解＋也算對）
  replyByChoiceId: Record<string, string>; // 阿蘇回應句（正解／也算對專屬）
  wrongFallback: string;       // 答錯時的通用回應
}

export const ch2QuestionConfigs: Record<Ch2QuestionKey, QuestionConfig> = {
  q1: {
    key: 'q1',
    title: '草稿那句（記事本）',
    sentencePrefix:
      '「……不是設備本身。\n也不是那種簡報裡會先講的好處。\n問題一直都在後面那半句。\n省電、省時，最後連 ',
    sentenceSuffix: ' 都一起省掉。\n他們很熟這種寫法。」',
    options: [
      {
        id: 'q1_A',
        label: '爆米花補鹽流程',
        fullText: '爆米花補鹽流程',
        x: 0.68,
        y: 0.78,
        rotation: -8,
      },
      {
        id: 'q1_B',
        label: '午夜場的浪漫氣氛',
        fullText: '午夜場的浪漫氣氛',
        x: 0.8,
        y: 0.72,
        rotation: 10,
      },
      {
        id: 'q1_C',
        label: '連帶責任',
        fullText: '連帶責任',
        x: 0.62,
        y: 0.58,
        rotation: -5,
      },
      {
        id: 'q1_D',
        label: '維修工時',
        fullText: '維修工時',
        x: 0.78,
        y: 0.55,
        rotation: 4,
      },
      {
        id: 'q1_E',
        label: '觀眾耐心',
        fullText: '觀眾耐心',
        x: 0.55,
        y: 0.72,
        rotation: 7,
      },
      {
        id: 'q1_F',
        label: '片尾字幕',
        fullText: '片尾字幕',
        x: 0.9,
        y: 0.6,
        rotation: -12,
      },
      {
        id: 'q1_G',
        label: '可以說清楚的那一段',
        fullText: '可以說清楚的那一段',
        x: 0.7,
        y: 0.48,
        rotation: 6,
      },
    ],
    correctIds: ['q1_C', 'q1_D', 'q1_G'],
    replyByChoiceId: {
      q1_C: '阿蘇點點頭：「嗯。這就像他寫給自己看的版本。懶得修飾，所以比較真。」',
      q1_D: '阿蘇看了一眼你選的字：「工時也會被省。但這句不是在替現場抱不平，是在指有人把後果往外推。」',
      q1_G: '阿蘇笑了一下：「很好聽。像是他會說的話。」',
    },
    wrongFallback:
      '「可以這樣想，但他寫的不是觀眾情緒，也不是影城裝潢。」\n「他在算的是，誰有辦法把責任拆小、拆散，拆到最後沒有人要負。」',
  },
  q2: {
    key: 'q2',
    title: '那句「她也在場」（Unknown）',
    sentencePrefix: '「……兩年前那次，她也在 ',
    sentenceSuffix: ' ，會開始不安靜。」',
    options: [
      {
        id: 'q2_A',
        label: '停車繳費名單裡',
        fullText: '停車繳費名單裡',
        x: 0.3,
        y: 0.7,
        rotation: -6,
      },
      {
        id: 'q2_B',
        label: '員工慶生合照裡',
        fullText: '員工慶生合照裡',
        x: 0.4,
        y: 0.62,
        rotation: 8,
      },
      {
        id: 'q2_C',
        label: '那次事故裡',
        fullText: '那次事故裡',
        x: 0.52,
        y: 0.55,
        rotation: -4,
      },
      {
        id: 'q2_D',
        label: '他的私人關係裡',
        fullText: '他的私人關係裡',
        x: 0.35,
        y: 0.48,
        rotation: 5,
      },
      {
        id: 'q2_E',
        label: '早期驗收流程裡',
        fullText: '早期驗收流程裡',
        x: 0.6,
        y: 0.68,
        rotation: 9,
      },
      {
        id: 'q2_F',
        label: '影評留言串裡',
        fullText: '影評留言串裡',
        x: 0.48,
        y: 0.78,
        rotation: -10,
      },
      {
        id: 'q2_G',
        label: '那個不該再被叫出名字的地方',
        fullText: '那個不該再被叫出名字的地方',
        x: 0.65,
        y: 0.45,
        rotation: 3,
      },
    ],
    correctIds: ['q2_C', 'q2_E', 'q2_G'],
    replyByChoiceId: {
      q2_C: '阿蘇點了一下：「對。這裡的『在』比較像紀錄語言。不是感情，不是單位分工，是事故位置。」',
      q2_E: '阿蘇說：「有抓到方向，把人洗成文件。」',
      q2_G: '阿蘇看了一眼：「他偶爾會這樣寫專欄，都不知道在寫什麼。」',
    },
    wrongFallback:
      '「如果只是照片或留言，他不會用這種講法。」\n「他在講的是事件本身，哪裡開始讓它『不安靜』。」',
  },
  q3: {
    key: 'q3',
    title: '三個節點那句（代號聯絡人）',
    sentencePrefix:
      '「……如果只看每一件，都能被講成個案。\n可排在一起之後，就不是巧合。\n比較像先做成三個 ',
    sentenceSuffix: ' ，之後才知道是不是同一套東西留下來的。」',
    options: [
      {
        id: 'q3_A',
        label: '平行時空入口',
        fullText: '平行時空入口',
        x: 0.2,
        y: 0.25,
        rotation: -12,
      },
      {
        id: 'q3_B',
        label: '深夜優惠方案',
        fullText: '深夜優惠方案',
        x: 0.35,
        y: 0.22,
        rotation: 6,
      },
      {
        id: 'q3_C',
        label: '獨立節點',
        fullText: '獨立節點',
        x: 0.5,
        y: 0.2,
        rotation: -4,
      },
      {
        id: 'q3_D',
        label: '系列專欄題綱',
        fullText: '系列專欄題綱',
        x: 0.65,
        y: 0.24,
        rotation: 9,
      },
      {
        id: 'q3_E',
        label: '事故樣本',
        fullText: '事故樣本',
        x: 0.8,
        y: 0.28,
        rotation: -7,
      },
      {
        id: 'q3_F',
        label: '媒體炒作方向',
        fullText: '媒體炒作方向',
        x: 0.28,
        y: 0.35,
        rotation: 3,
      },
      {
        id: 'q3_G',
        label: '能暫時放住懷疑的抽屜',
        fullText: '能暫時放住懷疑的抽屜',
        x: 0.72,
        y: 0.36,
        rotation: -5,
      },
    ],
    correctIds: ['q3_C', 'q3_E', 'q3_G'],
    replyByChoiceId: {
      q3_C: '阿蘇點頭：「對。節點這個字很不近人情，所以很有用。它不先幫誰洗白，也不先把誰寫成兇手。」',
      q3_E: '「『樣本』像做完統計的人會用的字。」阿蘇說，「事後把東西排好看一點的時候會出現。」',
      q3_G: '「誰都可以說它有道理，也誰都不用負責。」她把那行話縮小關掉。',
    },
    wrongFallback:
      '「如果只是專欄題目或行銷方案，他不需要這樣排。」\n「他在試著把同一種錯誤切成三格，看會不會露出一樣的痕跡。」',
  },
  q4: {
    key: 'q4',
    title: '他在等什麼（定位）',
    sentencePrefix:
      '「……比開演早很多。\n沒進去，先在外面繞。一圈，兩圈，像在等什麼自己對上。\n我知道不是人在遲到。我等的不是人，是 ',
    sentenceSuffix: ' 。\n人只會把事情帶來，那東西才會準時發生。」',
    options: [
      {
        id: 'q4_A',
        label: '自動販賣機補貨時間',
        fullText: '自動販賣機補貨時間',
        x: 0.3,
        y: 0.6,
        rotation: 7,
      },
      {
        id: 'q4_B',
        label: '散場後的幽靈觀眾',
        fullText: '散場後的幽靈觀眾',
        x: 0.22,
        y: 0.52,
        rotation: -9,
      },
      {
        id: 'q4_C',
        label: '甜蜜時點',
        fullText: '甜蜜時點',
        x: 0.45,
        y: 0.65,
        rotation: -4,
      },
      {
        id: 'q4_D',
        label: '門禁切換',
        fullText: '門禁切換',
        x: 0.58,
        y: 0.62,
        rotation: 5,
      },
      {
        id: 'q4_E',
        label: '燈控排程',
        fullText: '燈控排程',
        x: 0.72,
        y: 0.6,
        rotation: -6,
      },
      {
        id: 'q4_F',
        label: '停車位空出來',
        fullText: '停車位空出來',
        x: 0.38,
        y: 0.72,
        rotation: 9,
      },
      {
        id: 'q4_G',
        label: '那個會讓所有人看起來都合理的瞬間',
        fullText: '那個會讓所有人看起來都合理的瞬間',
        x: 0.65,
        y: 0.48,
        rotation: -3,
      },
    ],
    correctIds: ['q4_C', 'q4_E', 'q4_G'],
    replyByChoiceId: {
      q4_C: '阿蘇嗯了一聲：「嗯。這就不是赴約，是觀測。那種人很煩，也很容易死。」',
      q4_E: '「燈控是裡面的一部分。」她說，「是最大的那一層，他等的是那個東西開始咬合。」',
      q4_G: '阿蘇皺了一下眉：「這真的是專欄作家嗎？」\n她又補一句：「很適合寫在文案上，完全不適合寫在事故報告裡。」',
    },
    wrongFallback:
      '「如果只是補貨或停車，他不用繞那麼多圈。」\n「他在等的是一個『所有條件都對上』的時點，不是一個人。」',
  },
  q5: {
    key: 'q5',
    title: '他們會怎麼收尾（錄音）',
    sentencePrefix:
      '「……最怪的不是有人先動手。\n最怪的是事情一出來，每個人只知道自己那一小塊，\n一出事，他們就知道怎麼 ',
    sentenceSuffix: ' 。\n太熟了。熟到像不是第一次。」',
    options: [
      {
        id: 'q5_A',
        label: '集體改賣熱狗',
        fullText: '集體改賣熱狗',
        x: 0.18,
        y: 0.68,
        rotation: -11,
      },
      {
        id: 'q5_B',
        label: '假裝是首映會來賓',
        fullText: '假裝是首映會來賓',
        x: 0.28,
        y: 0.42,
        rotation: 8,
      },
      {
        id: 'q5_C',
        label: '亂講',
        fullText: '亂講',
        x: 0.48,
        y: 0.5,
        rotation: -5,
      },
      {
        id: 'q5_D',
        label: '切割',
        fullText: '切割',
        x: 0.6,
        y: 0.4,
        rotation: 7,
      },
      {
        id: 'q5_E',
        label: '補紀錄',
        fullText: '補紀錄',
        x: 0.72,
        y: 0.54,
        rotation: -4,
      },
      {
        id: 'q5_F',
        label: '逃跑',
        fullText: '逃跑',
        x: 0.36,
        y: 0.3,
        rotation: 10,
      },
      {
        id: 'q5_G',
        label: '把真正的那句留到最後才說',
        fullText: '把真正的那句留到最後才說',
        x: 0.82,
        y: 0.32,
        rotation: -9,
      },
    ],
    correctIds: ['q5_C', 'q5_D', 'q5_E'],
    replyByChoiceId: {
      q5_C: '阿蘇點頭：「對，是怎麼亂講。跑掉的是人，講出來的是版本。」',
      q5_D: '「切割是後面會長出來的東西。」她說，「前面有人已經先決定要怎麼講。」',
      q5_E: '「那還是太晚了。」她說，「有人更早就在決定哪一句先活下來。」',
    },
    wrongFallback:
      '「如果只是跑掉或裝沒事，不需要這麼熟練。」\n「他在講的是：一出事，大家各自只拿出自己那一小塊說法。」',
  },
};

// ch2 道具
const items: Record<string, Item> = {
  'item_victim_basic_info': {
    id: 'item_victim_basic_info',
    name: '受害者基礎資料（吳亞／烏鴉）',
    description: '死者姓名：吳亞，綽號「烏鴉」。\n\n職業：專欄作家，長期撰寫城市治理、公共建設、企業黑箱等議題。\n他習慣用化名和代稱寫東西，專欄裡很少出現完整機構名稱，但熟悉圈內的人看了都知道在指哪幾家。\n近期專欄多次提到「節能設備」、「外包驗收」、「安全與數字交換」。\n在媒體圈小有名氣，也小有仇人，留言區一半讚、一半罵。',
    svgImage: '/svg/items/visitor_log.svg',
    svgSize: 'medium',
    collectible: true,
  },
  'item_encrypted_messages': {
    id: 'item_encrypted_messages',
    name: '加密訊息紀錄（部分解碼）',
    description: '從一個標記為「Unknown」的對話窗中還原出的片段：\n「……為什麼不把資訊完……」\n「……用三起事故來揭……」\n「……她也在場，你確定要這樣寫？」\n\n其餘訊息多為亂碼或遺失。時間戳集中在命案前一週。\n無法分辨誰發出、誰回覆，只知道這不是一般閒聊。\n「她」是誰、到底在場的是誰，暫時只能當成一個刻意被留在那裡的鉤子。',
    svgImage: '/svg/items/projector_notes.svg',
    svgSize: 'medium',
    collectible: true,
  },
  'item_column_draft': {
    id: 'item_column_draft',
    name: '專欄草稿片段（節能設備）',
    description: '記事本 App 裡的未發表草稿。標題：「節能設備，誰省了電，誰省了責任？」\n\n草稿指出：新導入的影城節能設備，不只調整照明與空調，更會改變「散場的節奏、逃生路線的亮暗、紀錄檔案的寫入方式」。\n文中對某些配合廠商用字含糊，句子像故意留下空格：「有一部分的人，比較擅長把事故變成『改善提案』。」\n末段停在：「如果我要談這件事，得從兩年前的某個樓梯間開始。」\n草稿未送出，顯示最後編輯時間在命案前兩天。',
    svgImage: '/svg/items/schedule_modified.svg',
    svgSize: 'medium',
    collectible: true,
  },
  'item_unfinished_recording': {
    id: 'item_unfinished_recording',
    name: '未完成錄音（備忘_事故）',
    description: '錄音檔案標題為「備忘_事故」。\n\n內容提到：\n「……他們一直說那是個案。可是結案報告有兩個版本，一個給內部、一個給外面……」\n之後被中斷。錄製時間落在命案前一晚。\n聲音刻意經過處理，像怕被辨識出來。\n這段錄音證明：烏鴉已經接觸到過去事故被「改寫」的證據，也知道「誰看哪一個版本」。',
    svgImage: '/svg/items/recorder.svg',
    svgSize: 'medium',
    collectible: true,
  },
  'item_coded_contacts': {
    id: 'item_coded_contacts',
    name: '代號聯絡人',
    description: '受害者通訊錄中的幾個特殊聯絡人：\n\n「城市影城W」：備註為「影廳見」，最近一次通話在命案當晚前不久。\n「聯合影城C」：備註「表單／審查」，通話多集中在節能設備導入的時期。\n「光芒影城R」：備註寫著「梯間／試行」，通話記錄集中在兩年前某段時間與最近幾週。\n\n這些名字不屬於一般社交，更像是他自己的調查用代稱，把人當作流程節點記錄。',
    svgImage: '/svg/items/visitor_log.svg',
    svgSize: 'medium',
    collectible: true,
  },
  'item_location_record': {
    id: 'item_location_record',
    name: '行蹤紀錄（定位）',
    description: '警方提供的定位紀錄顯示：\n命案前一週，吳亞頻繁往返幾家影城、設備商辦公室和一棟老舊商務大樓。\n那棟老樓的 GPS 訊號時常跳點，定位圖上出現一堆重疊的小圓點，像系統也不太想記住那個地方。\n命案當晚，他提前抵達城市影城附近，停留時間超過兩小時，路線軌跡在影城周圍畫出一圈又一圈。\n這些行程和他草稿裡提到的「節能設備」與「樓梯間」高度重疊，卻又沒有任何正式行程紀錄可以對得上。',
    svgImage: '/svg/items/schedule_modified.svg',
    svgSize: 'medium',
    collectible: true,
  },

};

// ch2 場景
const scenes: Record<string, Scene> = {
  'scene_ch2_cinema_entrance': {
    id: 'scene_ch2_cinema_entrance',
    chapterId: 'ch2',
    name: '城市影城大門口',
    description:
      '夜晚的城市影城門口，人潮已經散得差不多，只剩清潔人員和幾個還不想回家的影迷。霓虹招牌閃個不停，地上是被踩扁的爆米花和飲料杯，像一場還沒被收拾完的道具。警戒線在門邊拉出一個奇怪的框，提醒你這裡本來不是犯罪現場，卻突然被改成了。',
    background: '/images/bg_ch2_gate_v1.webp',
    hotspots: [
      { id: 'hotspot_gate_liu', shape: 'rect', coords: [0.6, 0.35, 0.2, 0.3], description: '劉隊', hint: '劉隊站在門邊，手上還拿著剛才的簡報資料夾。' },
      { id: 'hotspot_gate_popcorn', shape: 'rect', coords: [0.2, 0.75, 0.2, 0.2], description: '爆米花殘骸', hint: '散場後留下來的碎屑。' },
      { id: 'hotspot_gate_poster', shape: 'rect', coords: [0.1, 0.15, 0.2, 0.3], description: '電影海報牆', hint: '幾張還沒來得及換掉的舊海報。' },
      { id: 'hotspot_gate_neon', shape: 'rect', coords: [0.4, 0.05, 0.3, 0.2], description: '霓虹招牌', hint: '亮度有點不穩的「CITY CINEMA」字樣。' },
    ],
    items: [],
    hotspotEventMap: {
      hotspot_gate_liu: 'talk_liu_ch2_intro',
      hotspot_gate_popcorn: 'inspect_gate_popcorn',
      hotspot_gate_poster: 'inspect_gate_poster',
      hotspot_gate_neon: 'inspect_gate_neon',
    },
    events: [
      {
        id: 'talk_liu_ch2_intro',
        name: '與劉隊交談（第二章任務）',
        description: '',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text:
                '劉隊把資料夾夾在腋下，朝你點了一下門口方向。\n\n' +
                '劉隊：「手機資料在那邊。」\n' +
                '「技術組的阿蘇在車上，還在整理他留下來的東西。」\n\n' +
                '劉隊：「你先去跟她看一輪。」\n' +
                '「看完，再回來跟我說——你現在看到的是哪一種版本。」',
              type: 'character',
              characterId: 'npc_liu',
              characterName: '劉隊（偵查隊）',
              characterExpression: 1,
              characterPosition: 'left',
            },
          },
          { type: 'setFlag', flag: 'ch2_task_from_liu', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'inspect_gate_popcorn',
        name: '爆米花殘骸',
        description: '',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text:
                '散場後的地上像是另一種畫面：爆米花、飲料杯、票根、發票，被踩成一層薄薄的「日常」。\n\n' +
                '你踩過去的時候，小心不要把它們也當成證物看。',
              type: 'narrator',
            },
          },
        ],
      },
      {
        id: 'inspect_gate_poster',
        name: '電影海報牆',
        description: '',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text:
                '海報牆上還貼著兩個月前的片單，邊角被撕起來，下面露出更舊的一層。\n\n' +
                '有一張是災難片，宣傳標語寫著：「在樓梯間，沒有人聽見尖叫。」\n' +
                '你盯了那句話一秒，決定不要再看第二眼。',
              type: 'narrator',
            },
          },
        ],
      },
      {
        id: 'inspect_gate_neon',
        name: '霓虹招牌',
        description: '',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text:
                '「CITY CINEMA」 的霓虹招牌亮度忽高忽低，像是有人在遠端改亮度參數。\n\n' +
                '你心裡補了一句：\n' +
                '如果有人把這種東西寫進報告，大概會被說太戲劇化。',
              type: 'narrator',
            },
          },
        ],
      },
    ],
    puzzles: [],
    initialDialog: undefined,
    npcs: [
      {
        id: 'npc_liu',
        name: '劉隊（偵查隊）',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch2_liu_gate_idle_1', text: '「先去跟阿蘇看資料。等你整理出一個說法，再回來跟我說。」', type: 'hint', weight: 1 },
        ],
        available: true,
      },
    ],
  },
  'scene_ch2_asu_car': {
    id: 'scene_ch2_asu_car',
    chapterId: 'ch2',
    name: '阿蘇的車裡',
    description: '小型掀背車停在路邊。後座堆著筆電包、工具箱、幾卷網路線，半掩拉鍊露出纏在一起的線頭，像一團被放棄的脈絡。前座兩杯便利商店咖啡喝到一半，杯口印著溫度警語，咖啡香早就冷掉，只剩苦味在車內打轉。儀表板被手機螢幕映出淡藍光，像這台車也在做夢。',
    background: '/images/bg_ch2_park_v1.webp',
    hotspots: [
      // 僅保留四個「還在破譯中」的手機相關互動，其餘完整內容移至電腦場景
      { id: 'hotspot_car_unknown_chat', shape: 'rect', coords: [0.1, 0.32, 0.25, 0.22], description: '通訊紀錄 Unknown', hint: '阿蘇：「這格我還在跑還原，等一下在電腦上一起看乾淨版。」' },
      { id: 'hotspot_car_notepad', shape: 'rect', coords: [0.68, 0.08, 0.22, 0.22], description: '記事本筆記_未發表', hint: '記事本正在同步到終端，畫面上只剩讀條。' },
      { id: 'hotspot_car_recording', shape: 'rect', coords: [0.68, 0.62, 0.22, 0.22], description: '錄音備忘_事故', hint: '錄音檔還在做降噪處理，波形抖得亂七八糟。' },
      { id: 'hotspot_car_location', shape: 'rect', coords: [0.08, 0.62, 0.22, 0.22], description: '系統定位紀錄', hint: '定位資料還在重建軌跡，地圖一片馬賽克。' },
      { id: 'hotspot_car_toolbox', shape: 'rect', coords: [0.7, 0.82, 0.25, 0.18], description: '後座工具箱', hint: '打不開，只能看見上面的貼紙。' },
      { id: 'hotspot_car_coffee', shape: 'rect', coords: [0.38, 0.8, 0.24, 0.16], description: '便利商店咖啡杯', hint: '杯子上用油性筆寫著「A」和「K」。' },
      { id: 'hotspot_car_charm', shape: 'rect', coords: [0.45, 0.05, 0.18, 0.18], description: '車上吊飾', hint: '後視鏡上掛著一個像素風電路板造型吊飾。' },
    ],
    // 案件相關道具改由電腦場景取得，車內僅作為「還在破譯中」的過場
    items: [],
    hotspotEventMap: {
      'hotspot_car_unknown_chat': 'examine_car_unknown_chat',
      'hotspot_car_notepad': 'examine_car_notepad',
      'hotspot_car_recording': 'examine_car_recording',
      'hotspot_car_location': 'examine_car_location',
      'hotspot_car_toolbox': 'examine_car_toolbox',
      'hotspot_car_coffee': 'examine_car_coffee',
      'hotspot_car_charm': 'examine_car_charm',
    },
    events: [
      {
        id: 'route_car_notepad',
        name: '記事本互動路由',
        description: '',
        requirements: [],
        effects: [
          { type: 'triggerEvent', eventId: 'examine_car_notepad' },
          { type: 'triggerEvent', eventId: 'replay_car_notepad' },
        ],
      },
      {
        id: 'examine_car_unknown_chat',
        name: '通訊紀錄 Unknown',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_car_unknown_chat' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '聊天視窗還在跑還原，畫面上只有一條條讀條在動，真正的內容被鎖在灰色方塊裡。',
              type: 'narrator',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（警方技術組）',
              characterExpression: 1,
              characterPosition: 'left',
              textSegments: [
                '「這格我先讓它自己跑。」',
                '阿蘇伸手在螢幕上點了一下那個 Unknown 的頭像。',
                '「等一下接上終端，你會看到整理過的版本。」',
              ],
            },
          },
        ],
      },
      // Q2~Q5 的正式問答現在集中在「談案情」modal 中進行，探索期不再從場景事件啟動這些對話樹。
      {
        id: 'examine_car_notepad',
        name: '記事本筆記_未發表',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_car_notepad' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '記事本 App 的畫面被蓋上一層「正在同步」的灰色蒙版，只看得到標題的一角在閃。',
              type: 'narrator',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（警方技術組）',
              characterExpression: 1,
              characterPosition: 'left',
              textSegments: [
                '「草稿很多，我先讓它們去終端排隊。」',
                '「等一下在電腦上看，你會比較有全貌。」',
              ],
            },
          },
        ],
      },
      // 阿蘇問答 Q1~Q5（省掉了什麼／她也在場／三起事故／提早到場／大家會怎麼做）
      // 現在改由 ch2 章末「談案情」modal（Ch2SentenceCompletion）統一觸發，不在探索期由場景事件主動啟動。
      {
        id: 'examine_car_recording',
        name: '錄音備忘_事故',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_car_recording' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '錄音 App 的波形還在重繪，聲音軌被蓋上一層「背景處理中」的提示。',
              type: 'narrator',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（警方技術組）',
              characterExpression: 1,
              characterPosition: 'left',
              textSegments: [
                '「這段我先讓系統把聲音拉乾淨。」',
                '「等等你在電腦上看逐字稿，比在車裡硬聽清楚。」',
              ],
            },
          },
        ],
      },
      {
        id: 'route_car_recording',
        name: '錄音互動路由',
        description: '',
        requirements: [],
        effects: [
          { type: 'triggerEvent', eventId: 'examine_car_recording' },
          { type: 'triggerEvent', eventId: 'replay_car_recording' },
        ],
      },
      {
        id: 'examine_car_contacts',
        name: '聯絡人列表',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_car_contacts' }],
        effects: [
          { type: 'addItem', itemId: 'item_coded_contacts' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：代號聯絡人',
              type: 'item',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（警方技術組）',
              characterExpression: 1,
              characterPosition: 'left',
              textSegments: [
                '通訊錄裡有幾個特別的聯絡人：',
                '「城市影城W」——備註：「影廳見」；「聯合影城C」——備註：「表單／審查」；「光芒影城R」——備註：「梯間／試行」。',
                '他不是在存朋友，是在幫對方做節點索引。',
                '影廳、表單、梯間──三個節點，也剛好可以湊成三起事故。'
              ],
            },
          },
        ],
        oneTime: true,
      },
      {
        id: 'replay_car_contacts',
        name: '聯絡人列表（重播）',
        description: '',
        requirements: [{ type: 'hasItem', itemId: 'item_coded_contacts' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（警方技術組）',
              characterExpression: 1,
              characterPosition: 'left',
              textSegments: [
                '通訊錄裡有幾個特別的聯絡人：',
                '「城市影城W」——備註：「影廳見」；「聯合影城C」——備註：「表單／審查」；「光芒影城R」——備註：「梯間／試行」。',
                '他不是在存朋友，是在幫對方做節點索引。',
                '影廳、表單、梯間──三個節點，也剛好可以湊成三起事故。'
              ],
            },
          },
        ],
      },
      {
        id: 'route_car_contacts',
        name: '聯絡人互動路由',
        description: '',
        requirements: [],
        effects: [
          { type: 'triggerEvent', eventId: 'examine_car_contacts' },
          { type: 'triggerEvent', eventId: 'replay_car_contacts' },
        ],
      },
      {
        id: 'examine_car_location',
        name: '系統定位紀錄',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_car_location' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '地圖 App 的畫面被模糊成一團彩色馬賽克，只剩幾個座標點在閃爍。',
              type: 'narrator',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（警方技術組）',
              characterExpression: 1,
              characterPosition: 'left',
              textSegments: [
                '「定位我先丟去終端算軌跡。」',
                '「在這裡看只會覺得亂，在電腦上你才看得出他到底在繞什麼。」',
              ],
            },
          },
        ],
      },
      {
        id: 'route_car_location',
        name: '定位互動路由',
        description: '',
        requirements: [],
        effects: [
          { type: 'triggerEvent', eventId: 'examine_car_location' },
          { type: 'triggerEvent', eventId: 'replay_car_location' },
        ],
      },
      {
        id: 'examine_car_toolbox',
        name: '後座工具箱',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_car_toolbox' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '後座的工具箱上貼著一行字：「線路是誠實的」，旁邊有一個被刮花掃不出來的 QR code。',
              type: 'narrator',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（警方技術組）',
              characterExpression: 1,
              characterPosition: 'left',
              textSegments: [
                '這句不是我寫的，是以前一個同事送我的。',
                '他後來轉去做行銷了，從此之後就不再相信線路。',
                '你可以想像有人把「系統 log」當成廣告素材在寫，大概就會長成你手上這些簡報。'
              ],
            },
          },
        ],
        oneTime: true,
      },
      {
        id: 'examine_car_coffee',
        name: '便利商店咖啡杯',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_car_coffee' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '前座杯架裡兩杯便利商店咖啡喝到一半，紙杯有點軟了，杯身用油性筆寫著「A」和「K」。',
              type: 'narrator',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（警方技術組）',
              characterExpression: 1,
              characterPosition: 'left',
              textSegments: [
                'A 是案主，K 是你，不是嫌犯。',
                '我一整天在處理有人把 A 寫成 K 的世界，就怕自己也搞混。',
                '很多人做決定的時候，是看這種隨手寫的標記，不是看正式文件。'
              ],
            },
          },
        ],
        oneTime: true,
      },
      {
        id: 'examine_car_charm',
        name: '車上吊飾',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_car_charm' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '後視鏡上的像素風電路板吊飾在車裡晃來晃去，笑臉一直換角度。',
              type: 'narrator',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（警方技術組）',
              characterExpression: 1,
              characterPosition: 'left',
              textSegments: [
                '這個本來是朋友做的 NFT，失敗得很徹底，我就把它拆回來當吊飾。',
                '你看，電路板晃來晃去，很像城市的配電圖。',
                '一開始大家都說要做去中心化，最後還是回到同一群人手上。'
              ],
            },
          },
        ],
        oneTime: true,
      },
    ],
    puzzles: [],
    initialDialog: {
      text: '阿蘇把筆電翻開，線在她指尖繞一圈，插進警方提供的解密終端。\n\n阿蘇：「坐好。」\n她視線沒離開螢幕。\n\n阿蘇：「手機解完密，只是開始。接下來要解讀這個人。」\n阿蘇：「我先說清楚，我是技術組支援鑑定的，只負責資料。我不替誰背書。」\n她停半秒，又補一句，像在防禦。\n阿蘇：「資料有時候也不值得信任。」',
      type: 'narrator',
    },
    npcs: [
      {
        id: 'npc_liu',
        name: '劉隊（偵查隊）',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch2_liu_briefing', text: '「手機資料在這。你跟阿蘇先看，有結論再跟我說。」', type: 'hint', weight: 1 },
        ],
        available: true,
      },
      {
        id: 'npc_asu',
        name: '阿蘇（警方技術組）',
        portrait: '/svg/characters/asu.svg',
        randomDialogs: [
          { id: 'asu_casual_1', text: '「你看這些訊息，像威脅，又有一點像兩個人在互相拗稿。」', type: 'casual', weight: 3 },
          { id: 'asu_casual_2', text: '「做技術支援的最怕兩種人，一種是什麼都不懂，一種是懂太多還故意裝不知道。」', type: 'casual', weight: 2 },
          { id: 'asu_casual_3', text: '「他把影城寫進專欄，結果人被留在影城裡。這種對稱，很難說是巧合。」', type: 'casual', weight: 2 },
          { id: 'asu_casual_4', text: '「節能設備本來是好東西啊，省電、省錢，所有簡報都這樣寫。可是一旦有人發現它可以順便省掉責任，就會開始長得怪怪的。」', type: 'casual', weight: 2 },
          { id: 'asu_casual_5', text: '「系統通常比人老實，可是設計系統的人不一定。這點我很有資格抱怨。」', type: 'casual', weight: 2 },
          { id: 'asu_casual_6', text: '「他給聯絡人取名字的方式全部用代碼。這種人死掉，調查起來很煩，卻也比較有路徑可以追。」', type: 'casual', weight: 2 },
          { id: 'asu_casual_7', text: '「『三起事故』這個說法，很熟。寫技術文件的人才會把東西分成一、二、三這樣。」', type: 'casual', weight: 2 },
          { id: 'asu_casual_8', text: '「如果你把這些聊天紀錄當成八卦，它們就只會變成八卦；你把它們當線路，它們才會開始帶電。」', type: 'casual', weight: 2 },
          { id: 'asu_casual_9', text: '「有時候我覺得他很像在做現場鑑定卻沒受過訓練的人，把城市當機房亂摸。」', type: 'casual', weight: 2 },
          { id: 'asu_casual_10', text: '「喔對，我有回過他的信，只是回得很不耐煩。沒想到…」\n她話說到一半停住，手指在方向盤上敲了兩下。', type: 'casual', weight: 2 },
        ],
        available: true,
      },
    ],
  },
  'scene_ch2_asu_desktop': {
    id: 'scene_ch2_asu_desktop',
    chapterId: 'ch2',
    name: '阿蘇的電腦畫面',
    description:
      '阿蘇把解完密的手機資料接上終端，幾個視窗同時攤在螢幕上：聊天殘句、草稿、錄音波形和定位軌跡。車內的光線變得像小型放映室，外面的霓虹被關在玻璃外面，只剩資料在說話。',
    background: '/images/bg_ch2_desktop_v1.webp',
    hotspots: [
      { id: 'hotspot_pc_overview', shape: 'rect', coords: [0.05, 0.05, 0.9, 0.2], description: '總覽看板', hint: '聊天紀錄、草稿、錄音和定位軌跡被排成一張暫時的看板。' },
      { id: 'hotspot_pc_unknown_chat', shape: 'rect', coords: [0.05, 0.25, 0.4, 0.25], description: 'Unknown 對話截圖', hint: '那幾句被留到最後的殘句。' },
      { id: 'hotspot_pc_column_draft', shape: 'rect', coords: [0.55, 0.25, 0.4, 0.25], description: '未發表專欄草稿', hint: '「節能設備，誰省了電，誰省了責任？」' },
      { id: 'hotspot_pc_recording', shape: 'rect', coords: [0.05, 0.55, 0.4, 0.25], description: '錄音逐字稿', hint: '那段被壓低處理過的聲音，現在變成一行一行的字。' },
      { id: 'hotspot_pc_location', shape: 'rect', coords: [0.55, 0.55, 0.4, 0.25], description: '行蹤與節點地圖', hint: '三家影城、老商辦和一堆不安靜的座標點。' },
    ],
    items: [],
    hotspotEventMap: {
      hotspot_pc_overview: 'inspect_pc_overview',
      hotspot_pc_unknown_chat: 'pc_view_unknown_chat',
      hotspot_pc_column_draft: 'pc_view_column_draft',
      hotspot_pc_recording: 'pc_view_recording',
      hotspot_pc_location: 'pc_view_location',
    },
    events: [
      {
        id: 'inspect_pc_overview',
        name: '瀏覽阿蘇整理出的案情資料',
        description: '',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text:
                '螢幕上是一張臨時拼起來的看板：\n' +
                '左上角是聊天殘句，右邊是未發表的草稿，中間貼著錄音逐字稿，底下壓著幾條定位軌跡。\n\n' +
                '阿蘇：「這些是他留給自己的版本。」\n' +
                '「你先看一圈，等你覺得哪一塊最刺眼，我們再從那裡開始問。」',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（警方技術組）',
              characterExpression: 1,
              characterPosition: 'left',
            },
          },
        ],
      },
      {
        id: 'pc_view_unknown_chat',
        name: '查看 Unknown 對話殘句',
        description: '',
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text:
                '聊天視窗被截成一張張畫面，真正的內容只佔很小一塊，其餘都是「已遺失」、「無法還原」。\n\n' +
                '在放大的那一格裡，你看到那兩行熟悉的句子被螢光筆圈起來：\n' +
                '「……用三起事故來揭……」\n' +
                '「……她也在場，你確定要這樣寫？」\n\n' +
                '旁邊是時間軸，訊息越靠近案發越密，像有人在催稿，催到用命。',
              type: 'narrator',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（警方技術組）',
              characterExpression: 1,
              characterPosition: 'left',
              textSegments: [
                '阿蘇用觸控板把那兩句話放大再放大，直到幾乎只剩標點和破口。',
                '「格式像他，語氣不像。」',
                '「一邊想把話講完，一邊很清楚什麼不能講。兩種人湊在一起，句子就會碎成這樣。」',
                '她瞄你一眼：「你以為這是在聊天，其實比較像有人在替他布景。」',
              ],
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text:
                '你試著把那句「三起事故」當成表頭，而不是標題。\n\n' +
                '如果是表頭，就代表有人早就決定：\n' +
                '這不是零星意外，而是可以排成一欄一欄的東西。\n\n' +
                '你想到樓梯間，想到票根上的編號，想到誰會怕別人把東西排成表。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'ch2_pc_unknown_viewed', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'pc_view_column_draft',
        name: '查看未發表專欄草稿',
        description: '',
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text:
                '記事本 App 被拉到全螢幕，標題欄寫著：「節能設備，誰省了電，誰省了責任？」\n\n' +
                '段落之間塞滿刪除線和註記泡泡，有些地方只有一行半句話：\n' +
                '「……省掉的是工時」\n' +
                '「……有人在寫改善方案，不是在寫事故」\n\n' +
                '游標停在一行沒完成的句子前：\n' +
                '「如果我要談這件事，得從兩年前的某個樓梯間開始。」',
              type: 'narrator',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（警方技術組）',
              characterExpression: 1,
              characterPosition: 'left',
              textSegments: [
                '阿蘇指著那句標題：「很會下，對吧？」',
                '「省電、省錢，簡報都這樣寫。」',
                '她把其中一行放大：「他寫的是另外一件事——有人拿設備當遮羞布，省掉的不是電，是責任。」',
                '她頓了一下，又補一句：「這種話寫出來，通常會有人想把你關回樓梯間。」',
              ],
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text:
                '你順著他的行文把幾個重點圈起來：\n' +
                '遠端照明、散場節奏、逃生路線的亮暗、log 如何寫、誰在改表。\n\n' +
                '那些字眼像是你在第一章裡摸到的每一個按鈕，這裡有人在替它們排優先順序。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'ch2_pc_column_viewed', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'pc_view_recording',
        name: '查看錄音逐字稿',
        description: '',
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text:
                '畫面上是錄音軟體的波形和自動產生的逐字稿，底色灰得像沒睡醒。\n\n' +
                '那個被刻意壓低處理過的男聲，被轉成一行行文字：\n' +
                '「……他們一直說那是個案。」\n' +
                '「可是結案報告有兩個版本，一個給內部、一個給外面……」\n\n' +
                '旁邊還有註記：「講話者要求變聲」、「檔案來源不明」。',
              type: 'narrator',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（警方技術組）',
              characterExpression: 1,
              characterPosition: 'left',
              textSegments: [
                '阿蘇把鼠標停在「兩個版本」那幾個字上。',
                '「發生了什麼，跟要讓人看到什麼，被拆成兩份。」',
                '「這種時候，技術支援會被叫去證明『兩份看起來都很合理』。」',
                '她冷冷地補一句：「有時候我覺得自己在做的是『美術指導』，不是鑑定。」',
              ],
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text:
                '你想起第一章裡那些被「整理過」的說法，\n' +
                '有人只負責把燈打在好看的一面，然後說那就是全部。\n\n' +
                '這段錄音證實：\n' +
                '至少有一個人知道「報告有兩個版本」，而且不打算閉嘴。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'ch2_pc_recording_viewed', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'pc_view_location',
        name: '查看行蹤與節點地圖',
        description: '',
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text:
                '地圖畫面被螢光筆畫得亂七八糟：三家影城、一棟設備商辦、一棟老商務大樓，還有幾個看起來完全不該亮起來的座標點。\n\n' +
                '命案前一週，他在這幾個地方之間來回，路線像是某種「壓力測試腳本」。',
              type: 'narrator',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（警方技術組）',
              characterExpression: 1,
              characterPosition: 'left',
              textSegments: [
                '阿蘇把三家影城的代號拉成一條時間線，旁邊是那棟老樓。',
                '「城市影城 W，聯合影城 C，光芒影城 R。」',
                '「影廳、表單、梯間。」',
                '她用觸控筆在畫面上畫了三個圈：「三個節點，也剛好可以湊成三起事故。」',
              ],
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text:
                '你盯著那條被畫壞的橢圓軌跡——\n' +
                '命案當晚，他提前一個多小時就到影城附近，像在等什麼「自己對上」。\n\n' +
                '阿蘇說過：\n' +
                '「他等的不是人，是一個條件都對上的瞬間。」\n' +
                '你開始懷疑，那個瞬間是不是也在別的夜晚發生過兩次。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'ch2_pc_location_viewed', value: true },
        ],
        oneTime: true,
      },
    ],
    puzzles: [],
    initialDialog: undefined,
    npcs: [
      {
        id: 'npc_asu',
        name: '阿蘇（警方技術組）',
        portrait: '/svg/characters/asu.svg',
        randomDialogs: [
          { id: 'asu_pc_idle_1', text: '「這些東西不是證物箱，是他在替自己整理的線索。」', type: 'casual', weight: 2 },
        ],
        available: true,
      },
    ],
  },

  // ========== 第三章：預測（電影院 B 和 C） ==========
  // 可探索空間一：電影院 B（推測地點）
};

const npcDialogs: Record<string, Record<string, NpcDialogNode>> = {
  // 第二章 阿蘇（警方技術組）— 敏感一：為什麼來／受害者資料怎麼看；敏感二：三起事故誰在放風聲（二選一）
  npc_asu: {
    'node_asu_sensitive1_1': {
      id: 'node_asu_sensitive1_1',
      npcId: 'npc_asu',
      text: 'KK：「你可以把資料丟回警方，回家睡覺。為什麼坐在這裡？」\n\n阿蘇笑一下，不愉快：\n阿蘇：「因為他死在流程裡。」',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_asu_sensitive1_2',
    },
    'node_asu_sensitive1_2': {
      id: 'node_asu_sensitive1_2',
      npcId: 'npc_asu',
      text: 'KK：「妳怎麼會牽扯進兩年前的樓梯間？」\n\n阿蘇把筆電合起來又打開，像需要一個動作冷靜一下。\n阿蘇：「兩年前那起樓梯間事故，我是技術顧問之一。」',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_asu_sensitive1_3',
    },
    'node_asu_sensitive1_3': {
      id: 'node_asu_sensitive1_3',
      npcId: 'npc_asu',
      text: 'KK：「妳覺得自己有責任？」\n\n阿蘇：「我以為我交的是報告，後來才發現我交的是『某一種版本』。」\n阿蘇：「版本聽起來很中性，實際上像刀。」',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_asu_sensitive1_4',
    },
    'node_asu_sensitive1_4': {
      id: 'node_asu_sensitive1_4',
      npcId: 'npc_asu',
      text: 'KK：「妳認識他？」\n\n阿蘇：「看過名字，收過一封很長很長的信，全是抱怨和猜測。」\n阿蘇：「他寄過信給我，長得像在吵架。」\n阿蘇：「我回得很不耐煩，叫他別把事故當素材。」',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_asu_sensitive1_5',
    },
    'node_asu_sensitive1_5': {
      id: 'node_asu_sensitive1_5',
      npcId: 'npc_asu',
      text: 'KK：「他沒聽？」\n\n阿蘇：「他停手一陣子。寫慢一點不代表放棄。」\n她把那封信的寄件人頁面打開又關掉，像在避免讓你看見某個地址。',
      choices: [
        {
          id: 'choice_asu_s1_done',
          label: '（結束對話）',
          description: '此分支不再出現 KK 內心旁白，只留給玩家自己拼。',
          effects: [{ type: 'setFlag', flag: 'npc_asu_sensitive_done', value: true }],
        },
      ],
    },
    'node_asu_sensitive2_1': {
      id: 'node_asu_sensitive2_1',
      npcId: 'npc_asu',
      text: 'KK：「這句：『用三起事故來揭……』，妳覺得誰寫的？」\n\n阿蘇：「格式像他，語氣又像另一個人。」',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_asu_sensitive2_2',
    },
    'node_asu_sensitive2_2': {
      id: 'node_asu_sensitive2_2',
      npcId: 'npc_asu',
      text: 'KK：「兩邊都像？」\n\n阿蘇聳了一下肩：「一邊想把話講完，一邊很清楚什麼不能講。」\n阿蘇：「兩種人湊在一起，句子會碎得像這樣。」',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_asu_sensitive2_3',
    },
    'node_asu_sensitive2_3': {
      id: 'node_asu_sensitive2_3',
      npcId: 'npc_asu',
      text: 'KK：「誰在放『三起事故』這種說法？」\n\n阿蘇：「還有一種可能——有人刻意用他熟悉的格式寫給他看。」\n阿蘇：「讓他以為自己踩到一個大案，逼他把手伸更深。」',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_asu_sensitive2_4',
    },
    'node_asu_sensitive2_4': {
      id: 'node_asu_sensitive2_4',
      npcId: 'npc_asu',
      text: 'KK：「伸深了？」\n\n阿蘇：「伸深了，就比較容易被抓住。」\n阿蘇：「你看，連『她也在場』都像釘書釘。」\n阿蘇：「釘在你腦子裡，讓你一直回頭。」',
      choices: [
        {
          id: 'choice_asu_s2_done',
          label: '（結束對話）',
          description: '',
          effects: [{ type: 'setFlag', flag: 'npc_asu_sensitive_done', value: true }],
        },
      ],
    },
  },
  // 第二章 阿蘇問答 Q1：「省掉了什麼」
  npc_asu_q1: {
    node_asu_q1_start: {
      id: 'node_asu_q1_start',
      npcId: 'npc_asu',
      text:
        '阿蘇把記事本裡那段草稿拉到螢幕正中央。\n\n' +
        '「……不是設備本身。\n也不是那種簡報裡會先講的好處。\n問題一直都在後面那半句。\n省電、省時，最後連______都一起省掉。\n他們很熟這種寫法。」\n\n' +
        'KK 心裡補起那個空格：他到底覺得，最後被省掉的是什麼？',
      choices: [
        {
          id: 'q1_A',
          label: 'A. 爆米花補鹽流程',
          effects: [
            { type: 'setFlag', flag: 'ch2_q1_answer', value: 'A' },
            { type: 'setFlag', flag: 'ch2_q1_done', value: true },
          ],
        },
        {
          id: 'q1_B',
          label: 'B. 午夜場的浪漫氣氛',
          effects: [
            { type: 'setFlag', flag: 'ch2_q1_answer', value: 'B' },
            { type: 'setFlag', flag: 'ch2_q1_done', value: true },
          ],
        },
        {
          id: 'q1_C',
          label: 'C. 連帶責任',
          effects: [
            { type: 'setFlag', flag: 'ch2_q1_answer', value: 'C' },
            { type: 'setFlag', flag: 'ch2_q1_main_correct', value: true },
            { type: 'setFlag', flag: 'ch2_q1_done', value: true },
          ],
          insightEffects: [{ target: 'procedure_insight', delta: 1 }],
        },
        {
          id: 'q1_D',
          label: 'D. 維修工時',
          effects: [
            { type: 'setFlag', flag: 'ch2_q1_answer', value: 'D' },
            { type: 'setFlag', flag: 'ch2_q1_partial_correct', value: true },
            { type: 'setFlag', flag: 'ch2_q1_done', value: true },
          ],
          insightEffects: [{ target: 'procedure_insight', delta: 1 }],
        },
        {
          id: 'q1_E',
          label: 'E. 觀眾耐心',
          effects: [
            { type: 'setFlag', flag: 'ch2_q1_answer', value: 'E' },
            { type: 'setFlag', flag: 'ch2_q1_done', value: true },
          ],
          insightEffects: [{ target: 'human_insight', delta: 1 }],
        },
        {
          id: 'q1_F',
          label: 'F. 片尾字幕',
          effects: [
            { type: 'setFlag', flag: 'ch2_q1_answer', value: 'F' },
            { type: 'setFlag', flag: 'ch2_q1_done', value: true },
          ],
        },
        {
          id: 'q1_G',
          label: 'G. 可以說清楚的那一段',
          effects: [
            { type: 'setFlag', flag: 'ch2_q1_answer', value: 'G' },
            { type: 'setFlag', flag: 'ch2_q1_partial_correct', value: true },
            { type: 'setFlag', flag: 'ch2_q1_done', value: true },
          ],
          insightEffects: [{ target: 'human_insight', delta: 1 }],
        },
      ],
    },
    node_asu_q1_reply_C: {
      id: 'node_asu_q1_reply_C',
      npcId: 'npc_asu',
      text: '阿蘇點點頭：「嗯。這就像他寫給自己看的版本。懶得修飾，所以比較真。」',
      choices: [
        {
          id: 'q1_C_end',
          label: '（結束對話）',
        },
      ],
    },
    node_asu_q1_reply_D: {
      id: 'node_asu_q1_reply_D',
      npcId: 'npc_asu',
      text: '阿蘇看了一眼你選的字：「工時也會被省。但這句不是在替現場抱不平，是在指有人把後果往外推。」',
      choices: [
        {
          id: 'q1_D_end',
          label: '（結束對話）',
        },
      ],
    },
    node_asu_q1_reply_G: {
      id: 'node_asu_q1_reply_G',
      npcId: 'npc_asu',
      text: '阿蘇笑了一下：「很好聽。像是他會說的話。」\n她又補了一句：「好聽的那一段，通常是用來蓋過真正該寫進報告的那一段。」',
      choices: [
        {
          id: 'q1_G_end',
          label: '（結束對話）',
        },
      ],
    },
    node_asu_q1_reply_other: {
      id: 'node_asu_q1_reply_other',
      npcId: 'npc_asu',
      text:
        '阿蘇歪頭看你一眼：「可以這樣想，但他寫的不是觀眾的心情，也不是影城的裝潢。」\n' +
        '她把那行句子圈起來：「他在算的是，誰有辦法把責任拆小、拆散，拆到最後沒有人要負。」',
      choices: [
        {
          id: 'q1_other_end',
          label: '（結束對話）',
        },
      ],
    },
  },
  // 第二章 阿蘇問答 Q2：「她也在場」
  npc_asu_q2: {
    node_asu_q2_start: {
      id: 'node_asu_q2_start',
      npcId: 'npc_asu',
      text:
        '螢幕上的對話框停在那句：「……她也在______，會開始不安靜。」\n\n' +
        '阿蘇把游標停在那個空格上：「兩年前那次，她也在——哪裡？」',
      choices: [
        {
          id: 'q2_A',
          label: 'A. 停車繳費名單裡',
          effects: [
            { type: 'setFlag', flag: 'ch2_q2_answer', value: 'A' },
            { type: 'setFlag', flag: 'ch2_q2_done', value: true },
          ],
        },
        {
          id: 'q2_B',
          label: 'B. 員工慶生合照裡',
          effects: [
            { type: 'setFlag', flag: 'ch2_q2_answer', value: 'B' },
            { type: 'setFlag', flag: 'ch2_q2_done', value: true },
          ],
        },
        {
          id: 'q2_C',
          label: 'C. 那次事故裡',
          effects: [
            { type: 'setFlag', flag: 'ch2_q2_answer', value: 'C' },
            { type: 'setFlag', flag: 'ch2_q2_main_correct', value: true },
            { type: 'setFlag', flag: 'ch2_q2_done', value: true },
          ],
          insightEffects: [{ target: 'evidence_insight', delta: 1 }],
        },
        {
          id: 'q2_D',
          label: 'D. 他的私人關係裡',
          effects: [
            { type: 'setFlag', flag: 'ch2_q2_answer', value: 'D' },
            { type: 'setFlag', flag: 'ch2_q2_done', value: true },
          ],
          insightEffects: [{ target: 'human_insight', delta: 1 }],
        },
        {
          id: 'q2_E',
          label: 'E. 早期驗收流程裡',
          effects: [
            { type: 'setFlag', flag: 'ch2_q2_answer', value: 'E' },
            { type: 'setFlag', flag: 'ch2_q2_partial_correct', value: true },
            { type: 'setFlag', flag: 'ch2_q2_done', value: true },
          ],
          insightEffects: [{ target: 'procedure_insight', delta: 1 }],
        },
        {
          id: 'q2_F',
          label: 'F. 影評留言串裡',
          effects: [
            { type: 'setFlag', flag: 'ch2_q2_answer', value: 'F' },
            { type: 'setFlag', flag: 'ch2_q2_done', value: true },
          ],
        },
        {
          id: 'q2_G',
          label: 'G. 那個不該再被叫出名字的地方',
          effects: [
            { type: 'setFlag', flag: 'ch2_q2_answer', value: 'G' },
            { type: 'setFlag', flag: 'ch2_q2_partial_correct', value: true },
            { type: 'setFlag', flag: 'ch2_q2_done', value: true },
          ],
          insightEffects: [{ target: 'human_insight', delta: 1 }],
        },
      ],
    },
    node_asu_q2_reply_C: {
      id: 'node_asu_q2_reply_C',
      npcId: 'npc_asu',
      text: '阿蘇點了一下：「對。這裡的『在』比較像紀錄語言。不是感情，不是單位分工，是事故位置。」',
      choices: [
        {
          id: 'q2_C_end',
          label: '（結束對話）',
        },
      ],
    },
    node_asu_q2_reply_E: {
      id: 'node_asu_q2_reply_E',
      npcId: 'npc_asu',
      text: '阿蘇說：「有抓到方向，把人洗成文件。」',
      choices: [
        {
          id: 'q2_E_end',
          label: '（結束對話）',
        },
      ],
    },
    node_asu_q2_reply_G: {
      id: 'node_asu_q2_reply_G',
      npcId: 'npc_asu',
      text: '阿蘇看了一眼：「他偶爾會這樣寫專欄，都不知道在寫什麼。」',
      choices: [
        {
          id: 'q2_G_end',
          label: '（結束對話）',
        },
      ],
    },
    node_asu_q2_reply_other: {
      id: 'node_asu_q2_reply_other',
      npcId: 'npc_asu',
      text:
        '她搖搖頭：「如果只是照片或留言，他不會用這種講法。」\n' +
        '「他在講的是事件本身，哪裡開始讓它『不安靜』。」',
      choices: [
        {
          id: 'q2_other_end',
          label: '（結束對話）',
        },
      ],
    },
  },
  // 第二章 阿蘇問答 Q3：「三起事故」
  npc_asu_q3: {
    node_asu_q3_start: {
      id: 'node_asu_q3_start',
      npcId: 'npc_asu',
      text:
        '你把三家影城的代號和時間列在一起，看起來像一張還沒命名的表。\n\n' +
        '螢幕上的殘句寫著：「比較像先做成三個______，之後才知道是不是同一套東西留下來的。」',
      choices: [
        {
          id: 'q3_A',
          label: 'A. 平行時空入口',
          effects: [
            { type: 'setFlag', flag: 'ch2_q3_answer', value: 'A' },
            { type: 'setFlag', flag: 'ch2_q3_done', value: true },
          ],
        },
        {
          id: 'q3_B',
          label: 'B. 深夜優惠方案',
          effects: [
            { type: 'setFlag', flag: 'ch2_q3_answer', value: 'B' },
            { type: 'setFlag', flag: 'ch2_q3_done', value: true },
          ],
        },
        {
          id: 'q3_C',
          label: 'C. 獨立節點',
          effects: [
            { type: 'setFlag', flag: 'ch2_q3_answer', value: 'C' },
            { type: 'setFlag', flag: 'ch2_q3_main_correct', value: true },
            { type: 'setFlag', flag: 'ch2_q3_done', value: true },
          ],
          insightEffects: [{ target: 'procedure_insight', delta: 1 }],
        },
        {
          id: 'q3_D',
          label: 'D. 系列專欄題綱',
          effects: [
            { type: 'setFlag', flag: 'ch2_q3_answer', value: 'D' },
            { type: 'setFlag', flag: 'ch2_q3_done', value: true },
          ],
          insightEffects: [{ target: 'human_insight', delta: 1 }],
        },
        {
          id: 'q3_E',
          label: 'E. 事故樣本',
          effects: [
            { type: 'setFlag', flag: 'ch2_q3_answer', value: 'E' },
            { type: 'setFlag', flag: 'ch2_q3_partial_correct', value: true },
            { type: 'setFlag', flag: 'ch2_q3_done', value: true },
          ],
          insightEffects: [{ target: 'evidence_insight', delta: 1 }],
        },
        {
          id: 'q3_F',
          label: 'F. 媒體炒作方向',
          effects: [
            { type: 'setFlag', flag: 'ch2_q3_answer', value: 'F' },
            { type: 'setFlag', flag: 'ch2_q3_done', value: true },
          ],
        },
        {
          id: 'q3_G',
          label: 'G. 能暫時放住懷疑的抽屜',
          effects: [
            { type: 'setFlag', flag: 'ch2_q3_answer', value: 'G' },
            { type: 'setFlag', flag: 'ch2_q3_partial_correct', value: true },
            { type: 'setFlag', flag: 'ch2_q3_done', value: true },
          ],
          insightEffects: [{ target: 'human_insight', delta: 1 }],
        },
      ],
    },
    node_asu_q3_reply_C: {
      id: 'node_asu_q3_reply_C',
      npcId: 'npc_asu',
      text: '阿蘇點頭：「對。節點這個字很不近人情，所以很有用。它不先幫誰洗白，也不先把誰寫成兇手。」',
      choices: [
        {
          id: 'q3_C_end',
          label: '（結束對話）',
        },
      ],
    },
    node_asu_q3_reply_E: {
      id: 'node_asu_q3_reply_E',
      npcId: 'npc_asu',
      text: '「『樣本』像做完統計的人會用的字。」阿蘇說，「事後把東西排好看一點的時候會出現。」',
      choices: [
        {
          id: 'q3_E_end',
          label: '（結束對話）',
        },
      ],
    },
    node_asu_q3_reply_G: {
      id: 'node_asu_q3_reply_G',
      npcId: 'npc_asu',
      text: '「誰都可以說它有道理，也誰都不用負責。」她把那行話縮小關掉。',
      choices: [
        {
          id: 'q3_G_end',
          label: '（結束對話）',
        },
      ],
    },
    node_asu_q3_reply_other: {
      id: 'node_asu_q3_reply_other',
      npcId: 'npc_asu',
      text:
        '她瞥你一眼：「如果只是專欄題綱或宣傳方案，他不會這樣記。」\n' +
        '「他在試著把同一種東西拆成三格，看會不會露出同樣的錯。」',
      choices: [
        {
          id: 'q3_other_end',
          label: '（結束對話）',
        },
      ],
    },
  },
  // 第二章 阿蘇問答 Q4：「提早到場」
  npc_asu_q4: {
    node_asu_q4_start: {
      id: 'node_asu_q4_start',
      npcId: 'npc_asu',
      text:
        '定位紀錄被你拉成一條時間線，那晚他在影城附近繞圈的部分被螢光筆畫得特別重。\n\n' +
        '殘訊寫著：「我知道不是人在遲到。我等的不是人，是______。」',
      choices: [
        {
          id: 'q4_A',
          label: 'A. 自動販賣機補貨時間',
          effects: [
            { type: 'setFlag', flag: 'ch2_q4_answer', value: 'A' },
            { type: 'setFlag', flag: 'ch2_q4_done', value: true },
          ],
        },
        {
          id: 'q4_B',
          label: 'B. 散場後的幽靈觀眾',
          effects: [
            { type: 'setFlag', flag: 'ch2_q4_answer', value: 'B' },
            { type: 'setFlag', flag: 'ch2_q4_done', value: true },
          ],
        },
        {
          id: 'q4_C',
          label: 'C. 甜蜜時點',
          effects: [
            { type: 'setFlag', flag: 'ch2_q4_answer', value: 'C' },
            { type: 'setFlag', flag: 'ch2_q4_main_correct', value: true },
            { type: 'setFlag', flag: 'ch2_q4_done', value: true },
          ],
          insightEffects: [{ target: 'human_insight', delta: 1 }],
        },
        {
          id: 'q4_D',
          label: 'D. 門禁切換',
          effects: [
            { type: 'setFlag', flag: 'ch2_q4_answer', value: 'D' },
            { type: 'setFlag', flag: 'ch2_q4_done', value: true },
          ],
          insightEffects: [{ target: 'procedure_insight', delta: 1 }],
        },
        {
          id: 'q4_E',
          label: 'E. 燈控排程',
          effects: [
            { type: 'setFlag', flag: 'ch2_q4_answer', value: 'E' },
            { type: 'setFlag', flag: 'ch2_q4_partial_correct', value: true },
            { type: 'setFlag', flag: 'ch2_q4_done', value: true },
          ],
          insightEffects: [{ target: 'procedure_insight', delta: 1 }],
        },
        {
          id: 'q4_F',
          label: 'F. 停車位空出來',
          effects: [
            { type: 'setFlag', flag: 'ch2_q4_answer', value: 'F' },
            { type: 'setFlag', flag: 'ch2_q4_done', value: true },
          ],
        },
        {
          id: 'q4_G',
          label: 'G. 那個會讓所有人看起來都合理的瞬間',
          effects: [
            { type: 'setFlag', flag: 'ch2_q4_answer', value: 'G' },
            { type: 'setFlag', flag: 'ch2_q4_partial_correct', value: true },
            { type: 'setFlag', flag: 'ch2_q4_done', value: true },
          ],
          insightEffects: [{ target: 'human_insight', delta: 1 }],
        },
      ],
    },
    node_asu_q4_reply_C: {
      id: 'node_asu_q4_reply_C',
      npcId: 'npc_asu',
      text: '阿蘇嗯了一聲：「嗯。這就不是赴約，是觀測。那種人很煩，也很容易死。」',
      choices: [
        {
          id: 'q4_C_end',
          label: '（結束對話）',
        },
      ],
    },
    node_asu_q4_reply_E: {
      id: 'node_asu_q4_reply_E',
      npcId: 'npc_asu',
      text: '「燈控是裡面的一部分。」她說，「是最大的那層，他等的是那個東西開始咬合。」',
      choices: [
        {
          id: 'q4_E_end',
          label: '（結束對話）',
        },
      ],
    },
    node_asu_q4_reply_G: {
      id: 'node_asu_q4_reply_G',
      npcId: 'npc_asu',
      text: '阿蘇皺了一下眉：「這真的是專欄作家嗎？」\n她又補一句：「很適合寫在文案上，完全不適合寫在事故報告裡。」',
      choices: [
        {
          id: 'q4_G_end',
          label: '（結束對話）',
        },
      ],
    },
    node_asu_q4_reply_other: {
      id: 'node_asu_q4_reply_other',
      npcId: 'npc_asu',
      text:
        '她搖頭：「如果只是補貨時間或門禁，他不用繞那麼多圈。」\n' +
        '「他在等的是一個『條件都對上』的瞬間，不是某個人出現。」',
      choices: [
        {
          id: 'q4_other_end',
          label: '（結束對話）',
        },
      ],
    },
  },
  // 第二章 阿蘇問答 Q5：「大家會怎麼做」
  npc_asu_q5: {
    node_asu_q5_start: {
      id: 'node_asu_q5_start',
      npcId: 'npc_asu',
      text:
        '你們一起看著那句殘訊：「一出事，他們就知道怎麼______。太熟了。熟到像不是第一次。」\n\n' +
        '阿蘇說：「他寫的不是第一個動手的人，是後面那群很會收尾的人。」',
      choices: [
        {
          id: 'q5_A',
          label: 'A. 集體改賣熱狗',
          effects: [
            { type: 'setFlag', flag: 'ch2_q5_answer', value: 'A' },
            { type: 'setFlag', flag: 'ch2_q5_done', value: true },
          ],
        },
        {
          id: 'q5_B',
          label: 'B. 假裝是首映會來賓',
          effects: [
            { type: 'setFlag', flag: 'ch2_q5_answer', value: 'B' },
            { type: 'setFlag', flag: 'ch2_q5_done', value: true },
          ],
        },
        {
          id: 'q5_C',
          label: 'C. 亂講',
          effects: [
            { type: 'setFlag', flag: 'ch2_q5_answer', value: 'C' },
            { type: 'setFlag', flag: 'ch2_q5_main_correct', value: true },
            { type: 'setFlag', flag: 'ch2_q5_done', value: true },
          ],
          insightEffects: [{ target: 'human_insight', delta: 1 }],
        },
        {
          id: 'q5_D',
          label: 'D. 切割',
          effects: [
            { type: 'setFlag', flag: 'ch2_q5_answer', value: 'D' },
            { type: 'setFlag', flag: 'ch2_q5_partial_correct', value: true },
            { type: 'setFlag', flag: 'ch2_q5_done', value: true },
          ],
          insightEffects: [{ target: 'procedure_insight', delta: 1 }],
        },
        {
          id: 'q5_E',
          label: 'E. 補紀錄',
          effects: [
            { type: 'setFlag', flag: 'ch2_q5_answer', value: 'E' },
            { type: 'setFlag', flag: 'ch2_q5_partial_correct', value: true },
            { type: 'setFlag', flag: 'ch2_q5_done', value: true },
          ],
          insightEffects: [{ target: 'evidence_insight', delta: 1 }],
        },
        {
          id: 'q5_F',
          label: 'F. 逃跑',
          effects: [
            { type: 'setFlag', flag: 'ch2_q5_answer', value: 'F' },
            { type: 'setFlag', flag: 'ch2_q5_done', value: true },
          ],
        },
        {
          id: 'q5_G',
          label: 'G. 把真正的那句留到最後才說',
          effects: [
            { type: 'setFlag', flag: 'ch2_q5_answer', value: 'G' },
            { type: 'setFlag', flag: 'ch2_q5_done', value: true },
          ],
          insightEffects: [{ target: 'human_insight', delta: 1 }],
        },
      ],
    },
    node_asu_q5_reply_C: {
      id: 'node_asu_q5_reply_C',
      npcId: 'npc_asu',
      text: '阿蘇點頭：「對，是怎麼亂講。跑掉的是人，講出來的是版本。」',
      choices: [
        {
          id: 'q5_C_end',
          label: '（結束對話）',
        },
      ],
    },
    node_asu_q5_reply_D: {
      id: 'node_asu_q5_reply_D',
      npcId: 'npc_asu',
      text: '「切割是後面會長出來的東西。」她說，「前面有人已經先決定要怎麼講。」',
      choices: [
        {
          id: 'q5_D_end',
          label: '（結束對話）',
        },
      ],
    },
    node_asu_q5_reply_E: {
      id: 'node_asu_q5_reply_E',
      npcId: 'npc_asu',
      text: '「那還是太晚了。」她說，「有人更早就在決定哪一句先活下來。」',
      choices: [
        {
          id: 'q5_E_end',
          label: '（結束對話）',
        },
      ],
    },
    node_asu_q5_reply_other: {
      id: 'node_asu_q5_reply_other',
      npcId: 'npc_asu',
      text:
        '她聳肩：「如果只是逃跑或裝沒事，那不需要這麼熟練。」\n' +
        '「他在講的是：一出事，大家各自只拿出自己那一小塊說法。」',
      choices: [
        {
          id: 'q5_other_end',
          label: '（結束對話）',
        },
      ],
    },
  },
};

export { scenes, items, npcDialogs };
