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
    'scene_ch2_asu_car': {
    id: 'scene_ch2_asu_car',
    chapterId: 'ch2',
    name: '阿蘇的車裡',
    description: '小型掀背車停在路邊。後座堆著筆電包、工具箱、幾卷網路線，半掩拉鍊露出纏在一起的線頭，像一團被放棄的脈絡。前座兩杯便利商店咖啡喝到一半，杯口印著溫度警語，咖啡香早就冷掉，只剩苦味在車內打轉。儀表板被手機螢幕映出淡藍光，像這台車也在做夢。',
    background: '/images/bg_ch2_park_v1.webp',
    hotspots: [
      { id: 'hotspot_car_phone_main', shape: 'rect', coords: [0.35, 0.32, 0.25, 0.25], description: '受害者手機主畫面', hint: '桌布是一張城市夜景，聯絡人顯示吳亞。' },
      { id: 'hotspot_car_unknown_chat', shape: 'rect', coords: [0.1, 0.32, 0.25, 0.22], description: '通訊紀錄 Unknown', hint: '聊天視窗多數訊息被標成亂碼。' },
      { id: 'hotspot_car_an_chat', shape: 'rect', coords: [0.65, 0.32, 0.25, 0.2], description: '通訊紀錄 An', hint: '聯絡人名稱：「An」，頭像是一杯拿鐵拉花。' },
      { id: 'hotspot_car_notepad', shape: 'rect', coords: [0.68, 0.08, 0.22, 0.22], description: '記事本筆記_未發表', hint: '未發表的草稿。' },
      { id: 'hotspot_car_recording', shape: 'rect', coords: [0.68, 0.62, 0.22, 0.22], description: '錄音備忘_事故', hint: '播放鍵按下去，車內多了一個被刻意壓低處理過的男人聲音。' },
      { id: 'hotspot_car_contacts', shape: 'rect', coords: [0.08, 0.08, 0.22, 0.22], description: '聯絡人列表', hint: '城市影城W、聯合影城C、光芒影城R。' },
      { id: 'hotspot_car_location', shape: 'rect', coords: [0.08, 0.62, 0.22, 0.22], description: '系統定位紀錄', hint: '定位紀錄像是一張被畫滿螢光筆的城市地圖。' },
      { id: 'hotspot_car_toolbox', shape: 'rect', coords: [0.7, 0.82, 0.25, 0.18], description: '後座工具箱', hint: '打不開，只能看見上面的貼紙。' },
      { id: 'hotspot_car_coffee', shape: 'rect', coords: [0.38, 0.8, 0.24, 0.16], description: '便利商店咖啡杯', hint: '杯子上用油性筆寫著「A」和「K」。' },
      { id: 'hotspot_car_charm', shape: 'rect', coords: [0.45, 0.05, 0.18, 0.18], description: '車上吊飾', hint: '後視鏡上掛著一個像素風電路板造型吊飾。' },
    ],
    items: [
      items.item_victim_basic_info,
      items.item_encrypted_messages,
      items.item_column_draft,
      items.item_unfinished_recording,
      items.item_coded_contacts,
      items.item_location_record,
    ],
    hotspotEventMap: {
      'hotspot_car_phone_main': 'examine_car_phone_main',
      'hotspot_car_unknown_chat': 'route_car_unknown_chat',
      'hotspot_car_an_chat': 'examine_car_an_chat',
      'hotspot_car_notepad': 'route_car_notepad',
      'hotspot_car_recording': 'route_car_recording',
      'hotspot_car_contacts': 'route_car_contacts',
      'hotspot_car_location': 'route_car_location',
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
          { type: 'triggerEvent', eventId: 'asu_q1_from_notepad' },
        ],
      },
      {
        id: 'examine_car_phone_main',
        name: '受害者手機主畫面',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_car_phone_main' }],
        effects: [
          { type: 'addItem', itemId: 'item_victim_basic_info' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：受害者基礎資料',
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
                '桌布是一張城市夜景，構圖歪了一點，街口有個模糊人影，臉被移動殘影拉長，看不出是誰。',
                '解鎖後，聯絡人卡片浮出名字「吳亞」，備註欄寫著「烏鴉」。',
                '專欄作家，字比睡眠多。',
                '他習慣把城市拆成版本寫出來，現在輪到別人替他寫版本了。'
              ],
            },
          },
        ],
        oneTime: true,
      },
      {
        id: 'replay_car_phone_main',
        name: '受害者手機主畫面（重播）',
        description: '',
        requirements: [{ type: 'hasItem', itemId: 'item_victim_basic_info' }],
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
                '桌布是一張城市夜景，構圖歪了一點，街口有個模糊人影，臉被移動殘影拉長，看不出是誰。',
                '解鎖後，聯絡人卡片浮出名字「吳亞」，備註欄寫著「烏鴉」。',
                '專欄作家，字比睡眠多──他把城市拆成版本寫出來，現在輪到別人替他寫版本了。'
              ],
            },
          },
        ],
      },
      {
        id: 'route_car_unknown_chat',
        name: 'Unknown 訊息互動路由',
        description: '',
        requirements: [],
        effects: [
          { type: 'triggerEvent', eventId: 'examine_car_unknown_chat' },
          { type: 'triggerEvent', eventId: 'replay_car_unknown_chat' },
          { type: 'triggerEvent', eventId: 'asu_q2_from_unknown' },
        ],
      },
      {
        id: 'examine_car_unknown_chat',
        name: '通訊紀錄 Unknown',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_car_unknown_chat' }],
        effects: [
          { type: 'addItem', itemId: 'item_encrypted_messages' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：加密訊息紀錄\n\n聊天視窗裡多數訊息被標成亂碼或「無法還原」，只剩幾行殘句。',
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
                '留下來的只有兩行：「……用三起事故來揭……」「……她也在場，你確定要這樣寫？」',
                '真正的話在刪掉的地方。',
                '「三起事故」「她也在場」──這不是聊天，是有人在幫他設計一個讀不完的鉤子。'
              ],
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '阿蘇把那句殘破訊息放大，讓它像一根刺卡在螢幕正中央。\n「……用三起事故來揭……」\n\n你覺得氣氛已經沉到一個程度，可以開始問那種問完就收不回去的問題。\n你只能挑一個方向追，今晚另外那條就留在心裡，長成噪音。',
              type: 'narrator',
              choices: [
                {
                  id: 'three_future',
                  text: '把它當成威脅／預告來看（「三起」還沒發生完）',
                  effects: [
                    { type: 'setFlag', flag: 'ch2_three_future', value: true },
                    {
                      type: 'showDialog',
                      dialog: {
                        text:
                          '你試著把那句話當成一種倒數：「三起」不是整理過去，而是還沒發生完的數量。\n\n阿蘇盯著螢幕，指甲在觸控板邊緣敲了兩下：「如果是倒數，那他在逼自己寫快一點。」\n她頓了一下，又補一句：「也可能有人逼他。」\n\n她把時間戳叫出來，訊息越靠近案發越密，像有人在催稿，催到用命。\n\n你在「未發出的訊息」裡找到一行草稿，只有一句：\n「下一場，別在亮的地方談。」\n沒有地點，沒有名字，只留一種不祥的節奏感。',
                        type: 'narrator',
                      },
                    },
                  ],
                },
                {
                  id: 'three_index',
                  text: '把它當成分類／目錄來看（「三起」是同一種錯誤的三格）',
                  effects: [
                    { type: 'setFlag', flag: 'ch2_three_index', value: true },
                    {
                      type: 'showDialog',
                      dialog: {
                        text:
                          '你改成把那句話當成目錄，而不是預告：「三起」像是在幫人把同一類東西分成三格。\n\n阿蘇吐一口氣，像把某段記憶放回抽屜：「寫技術文件的人會這樣講。」\n「三格，代表同一種錯誤出現了三次。」\n「錯誤會重複，習慣也會重複。」\n「他可能在替對方整理『你們做過幾次』。」\n\n你回頭看那幾個代號聯絡人的備註，突然注意到它們的格式一致，末尾都藏著同一種符號——像是內部用的版本標記。\n它不說明什麼，卻讓人很難不去追問：誰喜歡把事情整理成『版本』？',
                        type: 'narrator',
                      },
                    },
                  ],
                },
              ],
            },
          },
        ],
        oneTime: true,
      },
      {
        id: 'replay_car_unknown_chat',
        name: '通訊紀錄 Unknown（重播）',
        description: '',
        requirements: [{ type: 'hasItem', itemId: 'item_encrypted_messages' }],
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
                '留下來的只有兩行：「……用三起事故來揭……」「……她也在場，你確定要這樣寫？」',
                '真正的話在刪掉的地方。',
                '「三起事故」「她也在場」──這不是聊天，是有人在幫他設計一個讀不完的鉤子。'
              ],
            },
          },
        ],
      },
      {
        id: 'asu_q2_from_unknown',
        name: '阿蘇問答 Q2：她也在場',
        description: '',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'hotspot_car_unknown_chat' },
          { type: 'hasItem', itemId: 'item_encrypted_messages' },
          { type: 'hasFlag', flag: 'ch2_q1_done' },
        ],
        effects: [
          {
            type: 'startNpcDialog',
            dialogId: 'npc_asu_q2',
          },
        ],
        oneTime: true,
      },
      {
        id: 'examine_car_an_chat',
        name: '通訊紀錄 An',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_car_an_chat' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '對話窗顯示「An」，頭像是一杯拿鐵拉花，可讀內容零碎：\n\n「……如果你真的曝光，那個人會先弄死你……」\n「……上次樓梯間的事，你也在——」\n\n訊息停在兩個字：「算了。」',
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
                '這個 An 大概是他慌的時候會找的人。',
                '「算了」對她來說是結案，對我們來說只是噪音。'
              ],
            },
          },
        ],
        oneTime: true,
      },
      {
        id: 'examine_car_notepad',
        name: '記事本筆記_未發表',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_car_notepad' }],
        effects: [
          { type: 'addItem', itemId: 'item_column_draft' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：專欄草稿片段',
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
                '標題寫著：「節能設備，誰省了電，誰省了責任？」',
                '內文把遠端照明、散場節奏、疏散流程列成一串「可能」，像在整理別人的簡報。',
                '省電省錢，簡報都會說。',
                '他寫的是另外一件事──有人拿設備當遮羞布，省掉的不是電，是責任。'
              ],
            },
          },
        ],
        oneTime: true,
      },
      {
        id: 'replay_car_notepad',
        name: '記事本筆記_未發表（重播）',
        description: '',
        requirements: [{ type: 'hasItem', itemId: 'item_column_draft' }],
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
                '標題寫著：「節能設備，誰省了電，誰省了責任？」',
                '內文把遠端照明、散場節奏、疏散流程列成一串「可能」，像在整理別人的簡報。',
                '省電省錢，簡報都會說。',
                '他寫的是另外一件事──有人拿設備當遮羞布，省掉的不是電，是責任。'
              ],
            },
          },
        ],
      },
      {
        id: 'asu_q1_from_notepad',
        name: '阿蘇問答 Q1：省掉了什麼',
        description: '',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'hotspot_car_notepad' },
          { type: 'hasItem', itemId: 'item_column_draft' },
          // 基本探索：六項主線索中，任意取得至少三項
          {
            type: 'custom',
            customCheck: (state) => {
              const inv = state.inventory || [];
              const coreIds = [
                'item_victim_basic_info',
                'item_encrypted_messages',
                'item_column_draft',
                'item_unfinished_recording',
                'item_coded_contacts',
                'item_location_record',
              ];
              const count = coreIds.filter(id => inv.includes(id)).length;
              return count >= 3;
            },
          },
          // 已完成阿蘇敏感對話
          { type: 'hasFlag', flag: 'npc_asu_sensitive_done' },
        ],
        effects: [
          {
            type: 'startNpcDialog',
            dialogId: 'npc_asu_q1',
          },
        ],
        oneTime: true,
      },
      {
        id: 'examine_car_recording',
        name: '錄音備忘_事故',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_car_recording' }],
        effects: [
          { type: 'addItem', itemId: 'item_unfinished_recording' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：未完成錄音',
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
                '播放鍵按下去，車內多了一個被刻意壓低處理過的男聲，像戴著面具說話：',
                '「……他們一直說那是個案。可是結案報告有兩個版本，一個給內部、一個給外面……」',
                '他知道這句話會惹麻煩，才把聲音壓到這麼低。',
                '結案報告有「兩個版本」，代表發生了什麼跟要讓人看到什麼，早就被拆開。'
              ],
            },
          },
        ],
        oneTime: true,
      },
      {
        id: 'replay_car_recording',
        name: '錄音備忘_事故（重播）',
        description: '',
        requirements: [{ type: 'hasItem', itemId: 'item_unfinished_recording' }],
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
                '播放鍵按下去，車內多了一個被刻意壓低處理過的男聲，像戴著面具說話：',
                '「……他們一直說那是個案。可是結案報告有兩個版本，一個給內部、一個給外面……」',
                '他知道這句話會惹麻煩，才把聲音壓到這麼低。',
                '結案報告有「兩個版本」，代表發生了什麼跟要讓人看到什麼，早就被拆開。'
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
          { type: 'triggerEvent', eventId: 'asu_q5_from_recording' },
        ],
      },
      {
        id: 'asu_q5_from_recording',
        name: '阿蘇問答 Q5：大家會怎麼做',
        description: '',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'hotspot_car_recording' },
          { type: 'hasItem', itemId: 'item_unfinished_recording' },
          { type: 'hasFlag', flag: 'ch2_q4_done' },
        ],
        effects: [
          {
            type: 'startNpcDialog',
            dialogId: 'npc_asu_q5',
          },
        ],
        oneTime: true,
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
          { type: 'triggerEvent', eventId: 'asu_q3_from_contacts' },
        ],
      },
      {
        id: 'asu_q3_from_contacts',
        name: '阿蘇問答 Q3：三起事故',
        description: '',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'hotspot_car_contacts' },
          { type: 'hasItem', itemId: 'item_coded_contacts' },
          { type: 'hasFlag', flag: 'ch2_q2_done' },
        ],
        effects: [
          {
            type: 'startNpcDialog',
            dialogId: 'npc_asu_q3',
          },
        ],
        oneTime: true,
      },
      {
        id: 'examine_car_location',
        name: '系統定位紀錄',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_car_location' }],
        effects: [
          { type: 'addItem', itemId: 'item_location_record' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：行蹤紀錄',
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
                '定位紀錄像一張被螢光筆畫滿的地圖。',
                '命案前一週，他在住家、三家影城、一棟設備公司商辦和一棟老式商務大樓之間來回，那棟老樓 GPS 一直跳點，像系統也不太想記住那裡。',
                '命案當晚，他比電影開場早到近一個半小時，在城市影城附近繞圈，軌跡像一個被畫壞的橢圓。',
                '這不是散步，是壓力測試。',
                '你以為那是焦慮，其實比較像在確認排程會不會準時爆。'
              ],
            },
          },
        ],
        oneTime: true,
      },
      {
        id: 'replay_car_location',
        name: '系統定位紀錄（重播）',
        description: '',
        requirements: [{ type: 'hasItem', itemId: 'item_location_record' }],
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
                '定位紀錄像一張被螢光筆畫滿的地圖。',
                '命案前一週，他在住家、三家影城、一棟設備公司商辦和一棟老式商務大樓之間來回，那棟老樓 GPS 一直跳點，像系統也不太想記住那裡。',
                '命案當晚，他比電影開場早到近一個半小時，在城市影城附近繞圈，軌跡像一個被畫壞的橢圓。',
                '這不是散步，是壓力測試──你以為那是焦慮，其實比較像在確認排程會不會準時爆。'
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
          { type: 'triggerEvent', eventId: 'asu_q4_from_location' },
        ],
      },
      {
        id: 'asu_q4_from_location',
        name: '阿蘇問答 Q4：提早到場',
        description: '',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'hotspot_car_location' },
          { type: 'hasItem', itemId: 'item_location_record' },
          { type: 'hasFlag', flag: 'ch2_q3_done' },
        ],
        effects: [
          {
            type: 'startNpcDialog',
            dialogId: 'npc_asu_q4',
          },
        ],
        oneTime: true,
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
