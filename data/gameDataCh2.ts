import { Scene, Item, NpcDialogNode } from '@/types/game';

// ch2 道具：僅兩項進背包（其餘線索改為場景／互動框敘事）
const items: Record<string, Item> = {
  'item_encrypted_messages': {
    id: 'item_encrypted_messages',
    name: '加密訊息紀錄（部分解碼）',
    description:
      '紙感先是冷的：一串短句像命令，夾著貼圖與「已刪除」。你瞇眼讀見幾個破口——不放完整資訊、用三起事故來揭、有人在場被點名、壓節能稿別讓對方拿「改善」收工。\n' +
      '愈靠近案發愈密。你心裡一沉：這不像閒聊，像在催一個已經站在欄位裡的人。',
    svgImage: '/svg/items/projector_notes.svg',
    svgSize: 'medium',
    collectible: true,
  },
  'item_ch2_phone_decoder': {
    id: 'item_ch2_phone_decoder',
    name: '技術組暫扣：吳亞的草稿手機',
    description:
      '機殼還溫，像剛從誰口袋裡抽出來。螢幕邊角磕傷，備忘永遠「未同步」。\n' +
      '阿蘇冷著聲：「不是給你滑著玩的。劉隊點頭前，多看一眼都像偷。」',
    svgImage: '/svg/items/projector_notes.svg',
    svgSize: 'medium',
    collectible: true,
  },
  'item_column_draft': {
    id: 'item_column_draft',
    name: '專欄草稿（節能設備／未發表）',
    description:
      '全螢幕一開，刪除線與紅問號先跳進眼裡。標題像刀：「節能設備，誰省了電，誰省了責任？」\n' +
      '字裡行間在寫燈、寫空調、寫散場時被看見的方式——寫到後來，你幾乎聽見有人在簡報室裡把「個案」兩個字磨平。\n' +
      '末段停在樓梯間，兩年前那件事只寫了半句。最後編輯時間：命案前兩天。',
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
      '夜，散場後人稀。霓虹閃，地上爆米花與飲料杯。門邊警戒線框住一塊本非案場卻被改寫的區域。',
    background: '/images/bg_ch2_gate_v1.webp',
    hotspots: [
      { id: 'hotspot_gate_liu', shape: 'circle', coords: [0.4, 0.7, 0.8], description: '劉隊', hint: '門邊，腋下夾簡報資料夾。' },
      { id: 'hotspot_gate_popcorn', shape: 'circle', coords: [0.7, 0.85, 0.3], description: '爆米花殘骸', hint: '散場碎屑。' },
      { id: 'hotspot_gate_poster', shape: 'circle', coords: [0.13, 0.7, 0.3], description: '電影海報牆', hint: '幾張舊海報尚未換下。' },
      { id: 'hotspot_gate_neon', shape: 'circle', coords: [0.55, 0.37, 0.9], description: '霓虹招牌', hint: '「CITY CINEMA」亮度不穩。' },
      { id: 'hotspot_gate_cordon', shape: 'circle', coords: [0.28, 0.62, 0.22], description: '門口警戒線', hint: '黃黑膠帶框住門口。' },
      { id: 'hotspot_gate_ticket_machine', shape: 'circle', coords: [0.88, 0.52, 0.2], description: '自助取票機', hint: '螢幕亮著，末場已過。' },
    ],
    items: [],
    hotspotEventMap: {
      hotspot_gate_liu: 'talk_liu_ch2_intro',
      hotspot_gate_popcorn: 'inspect_gate_popcorn',
      hotspot_gate_poster: 'inspect_gate_poster',
      hotspot_gate_neon: 'inspect_gate_neon',
      hotspot_gate_cordon: 'inspect_gate_cordon',
      hotspot_gate_ticket_machine: 'inspect_gate_ticket_machine',
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
                '劉隊腋下夾資料夾，朝門口一點。\n\n' +
                '「死者手機在那邊；技術組阿蘇在車上整理。」\n\n' +
                '「你先去跟她看一輪。阿蘇你也熟，敘敘舊。」',
              type: 'character',
              characterId: 'npc_liu',
              characterName: '劉隊（偵查隊）',
              characterExpression: 1,
              characterPosition: 'right',
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
                '爆米花、飲料杯、票根——日常薄層，不是證物。',
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
                '一張驚悚片海報：「在電梯間，沒有人聽見尖叫。」你移開視線。',
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
                '霓虹忽明忽暗。兩年前那起——寫進報告會嫌戲劇化。',
              type: 'narrator',
            },
          },
        ],
      },
      {
        id: 'inspect_gate_cordon',
        name: '門口警戒線',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_gate_cordon' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text:
                '膠帶在風裡顫，清潔推桶遠去。荒謬被拉成日常；你站在框內。',
              type: 'narrator',
            },
          },
        ],
      },
      {
        id: 'inspect_gate_ticket_machine',
        name: '自助取票機',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_gate_ticket_machine' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text:
                '廣告仍播「加場」，末場早過。螢幕閃「請取票」——你沒按。',
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
          { id: 'ch2_liu_gate_idle_1', text: '「先去跟阿蘇看資料。她處理技術，你協助推理。」', type: 'hint', weight: 1 },
        ],
        available: true,
      },
    ],
  },
  // 車內熱點 9 個、無背包道具 → play 頁以探索進度解鎖電腦場（門檻與 6/9 互動對齊，見 handleSceneNavigation）
  'scene_ch2_asu_car': {
    id: 'scene_ch2_asu_car',
    chapterId: 'ch2',
    name: '阿蘇的車裡',
    description: '掀背車停路邊。後座筆電包、工具箱、網路線，拉鍊半開線頭纏結。前座咖啡半杯，苦味在車裡打轉。',
    background: '/images/bg_ch2_park_v1.webp',
    hotspots: [
      // 僅保留四個「還在破譯中」的手機相關互動，其餘完整內容移至電腦場景
      { id: 'hotspot_car_unknown_chat', shape: 'circle', coords: [0.5, 0.85, 0.3], description: '通訊紀錄 Unknown', hint: '阿蘇：「還在跑還原。」' },
      { id: 'hotspot_car_notepad', shape: 'circle', coords: [0.6, 0.85, 0.3], description: '烏鴉的記事本筆記', hint: '灰蒙版蓋著，標題一角在閃。' },
      { id: 'hotspot_car_recording', shape: 'circle', coords: [0.7, 0.85, 0.3], description: '錄音備忘_事故', hint: '降噪中，波形亂。' },
      { id: 'hotspot_car_location', shape: 'circle', coords: [0.8, 0.85, 0.3], description: '系統定位紀錄', hint: '軌跡重建中，地圖馬賽克。' },
      { id: 'hotspot_car_toolbox', shape: 'circle', coords: [0.07, 0.8, 0.3], description: '後座工具箱', hint: '貼紙：「線路是誠實的」。' },
      { id: 'hotspot_car_coffee', shape: 'circle', coords: [0.2, 0.94, 0.3], description: '便利商店咖啡杯', hint: '杯身油性筆「A」「S」。' },
      { id: 'hotspot_car_charm', shape: 'circle', coords: [0.95, 0.14, 0.3], description: '車上吊飾', hint: '像素風電路板，後視鏡上晃。' },
      { id: 'hotspot_car_seatbelt', shape: 'circle', coords: [0.4, 0.9, 0.26], description: '副駕安全帶', hint: '扣具在暗處，難扣。' },
      { id: 'hotspot_car_air_freshener', shape: 'circle', coords: [0.16, 0.2, 0.2], description: '出風口香氛夾', hint: '「晨霧森林」——實際像機房濾網味。' },
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
      'hotspot_car_seatbelt': 'examine_car_seatbelt',
      'hotspot_car_air_freshener': 'examine_car_air_freshener',
    },
    events: [
      {
        id: 'examine_car_unknown_chat',
        name: '通訊紀錄 Unknown',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_car_unknown_chat' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '還原中，進度條短，內容鎖在灰塊裡。',
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
              characterPosition: 'right',
              textSegments: [
                '「讓它跑。我現在不跟你賭誰比較急。」',
                '她點 Unknown 頭像，像在安撫一個會咬人的檔案。',
                '「大螢幕那邊會整好——在這裡瞇眼，只會把偏見瞇進去。」',
              ],
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text:
                '殘影碎片：\n' +
                '「……為什麼不把資訊完……」「……用三起事故來揭……」「……她也在場，你確定要這樣寫？」\n\n' +
                '語氣急，不像閒聊。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'ch2_car_unknown_viewed', value: true },
        ],
      },
      // 章尾五題改在劉隊結算的 Ch2ReportEditor（雙格填空）進行；探索期不再從場景事件啟動舊問答樹。
      {
        id: 'examine_car_notepad',
        name: '烏鴉的記事本筆記',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_car_notepad' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '「正在同步」灰蒙版，標題一角在閃。',
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
              characterPosition: 'right',
              textSegments: [
                '「草稿跟解碼塞在同一條管子裡——在車上硬撐開，只會炸給你看。」',
                '她語氣很平，像在忍煩：「回去那邊看。我要你看的是全貌，不是爽感。」',
              ],
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text:
                '標題閃過：「節能設備，誰省了電，誰省了責任？」\n\n' +
                '他要把散場節奏、燈光寫進同段——不只省電故事。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'ch2_car_notepad_viewed', value: true },
        ],
      },
      // 原阿蘇 QA 主線已併入 ch2ReportConfig（雙格兩題＋手機省電謎）；此處僅保留現場檢視敘事。
      {
        id: 'examine_car_recording',
        name: '錄音備忘_事故',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_car_recording' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '波形重繪中，提示「背景處理中」。',
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
              characterPosition: 'right',
              textSegments: [
                '「聲音髒成這樣，在車裡硬聽，你只會聽見自己的心跳。」',
                '「逐字稿我會給——但別指望我替你決定哪一句比較像人話。」',
              ],
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text:
                '檔名：「備忘_事故」。半句壓低的聲：\n' +
                '「……一直說個案。結案報告卻兩份，內部一份、外面一份……」\n\n' +
                '斷了。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'ch2_car_recording_viewed', value: true },
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
              text: '地圖糊成馬賽克，幾個座標在閃。',
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
              characterPosition: 'right',
              textSegments: [
                '「軌跡丟回去跑——我在這裡講再多，也只是故事。」',
                '她自嘲很短：「多半繞得很難看。難看才像真的。」',
              ],
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text:
                '三格代號：W 影廳見、C 表單審查、R 梯間試行。\n\n' +
                '跳點像避老商辦；當晚繞影城外很久，對不上正式行程。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'ch2_car_location_viewed', value: true },
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
              text: '工具箱貼「線路是誠實的」，旁邊 QR 已刮花。',
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
              characterPosition: 'right',
              textSegments: [
                '舊同事送的；他轉行銷後不信線路了。',
                '線路不誠實，當廣告寫，就變你手上那些簡報。'
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
              text: '杯架裡半杯超商咖啡，紙杯軟了，杯身「A」「S」。',
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
              characterPosition: 'right',
              textSegments: [
                'A、S？猜不透。',
                '很多人決策，看隨手標記不看正式文件。'
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
              text: '像素電路板吊飾在後視鏡晃。',
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
              characterPosition: 'right',
              textSegments: [
                '朋友 NFT 失敗品，拆來當吊飾。',
                '去中心化說說而已，最後還同一群人。'
              ],
            },
          },
        ],
        oneTime: true,
      },
      {
        id: 'examine_car_seatbelt',
        name: '副駕安全帶',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_car_seatbelt' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text:
                '副駕扣具在陰影裡，摸兩下才對準。\n\n' +
                '卡住像那種「流程沒問題、實務過不了」的表單。',
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
              characterPosition: 'right',
              textSegments: [
                '「別硬扯，拉太多次就回不去了。」',
                '她眼仍黏筆電。',
                '「先睡。你眼下黑得像 log。」',
              ],
            },
          },
        ],
      },
      {
        id: 'examine_car_air_freshener',
        name: '出風口香氛夾',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_car_air_freshener' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text:
                '「晨霧森林」香氛膠囊，主味仍是隔夜咖啡與線材——大自然輸給加班。',
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
              characterPosition: 'right',
              textSegments: [
                '「本來買來蓋咖啡。」',
                '「現在像森林裡慢跑順便換伺服器風扇。」',
                '「至少比命案現場好一點點。」',
              ],
            },
          },
        ],
      },
    ],
    puzzles: [],
    initialDialog: {
      text:
        '阿蘇翻開筆電，線在指尖繞一圈，插進解密終端。車內只剩風扇聲與她的呼吸。\n\n' +
        '「坐好。」她視線沒離螢幕，像在跟機器談判。\n\n' +
        '「手機解完只是開始——接下來你要對付的是一個人怎麼活成這樣。」\n' +
        '她停一下，聲音更硬：「我是技術組，我只對資料負責，不替誰的劇本背書。」\n' +
        '又補一句，像提醒自己：「資料有時也不值得信任。」',
      type: 'narrator',
    },
    npcs: [
      {
        id: 'npc_asu',
        name: '阿蘇（警方技術組）',
        portrait: '/svg/characters/asu.svg',
        randomDialogs: [
          { id: 'asu_casual_1', text: '「你看這些訊息，像威脅，又有一點像兩個人在互相拗稿。」', type: 'casual', weight: 3 },
          { id: 'asu_casual_2', text: '「做技術支援的最怕兩種人，一種是什麼都不懂，一種是懂太多還故意裝不知道。」', type: 'casual', weight: 2 },
          { id: 'asu_casual_3', text: '「他把企業惡習寫進專欄，結果自己被留在影城裡，是不是有點好笑？」', type: 'casual', weight: 2 },
          {
            id: 'asu_casual_4',
            text: '「節能簡報寫得愈漂亮，我愈想吐——我見過太多『改善』是用別人的命換的。」',
            type: 'casual',
            weight: 2,
          },
          { id: 'asu_casual_5', text: '「系統通常比人老實，可是設計系統的人不一定。這點我很有資格抱怨，但我不太想說。」', type: 'casual', weight: 2 },
          { id: 'asu_casual_6', text: '「他給聯絡人取名字的方式全部用代碼。這種人死掉，調查起來很煩。」', type: 'casual', weight: 2 },
          {
            id: 'asu_casual_7',
            text: '「『三起事故』這種詞一出現，我會先摸滑鼠——不是怕，是怕有人把欄位名當預告片剪進新聞。」',
            type: 'casual',
            weight: 2,
          },
          { id: 'asu_casual_8', text: '「如果你把這些聊天紀錄當成八卦，它們就只會變成八卦。」', type: 'casual', weight: 2 },
          { id: 'asu_casual_9', text: '「烏鴉很像在做現場鑑定，卻沒受過專業訓練，把城市當機房亂摸。他會這樣寫，大概是不懂，或太懂。」', type: 'casual', weight: 2 },
          { id: 'asu_casual_10', text: '「喔對，兩年前，我有回過他的信，我和他頻率不同，沒想到…」\n(她話說到一半停住，手指在方向盤上敲了兩下。)', type: 'casual', weight: 2 },
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
      '大螢幕把車裡那些殘影一次攤開：對話、草稿、備忘、地圖——像四張透明片疊成同一面桌。阿蘇的觸控筆痕還留在邊角。',
    background: '/images/bg_ch2_desktop_v1.webp',
    hotspots: [
      {
        id: 'hotspot_pc_overview',
        shape: 'circle',
        coords: [0.25, 0.25, 0.4],
        description: '總覽看板',
        hint: '四塊視窗叠成一面亮的桌面。',
      },
      {
        id: 'hotspot_pc_unknown_chat',
        shape: 'circle',
        coords: [0.13, 0.6, 0.4],
        description: 'Unknown 對話（還原版）',
        hint: '還原後的對話殘本。',
      },
      {
        id: 'hotspot_pc_column_draft',
        shape: 'circle',
        coords: [0.72, 0.18, 0.4],
        description: '專欄草稿（全文）',
        hint: '烏鴉還沒發出去的完整論述與刪改痕。',
      },
      {
        id: 'hotspot_pc_recording',
        shape: 'circle',
        coords: [0.85, 0.58, 0.5],
        description: '錄音逐字稿',
        hint: '「備忘_事故」拉乾淨後的一字一句。',
      },
      {
        id: 'hotspot_pc_location',
        shape: 'circle',
        coords: [0.85, 0.2, 0.4] ,
        description: '行蹤重建圖',
        hint: 'W／C／R 與老商辦之間繞不出來的軌跡。',
      },
      {
        id: 'hotspot_pc_monitor_sticky',
        shape: 'circle',
        coords: [0.48, 0.08, 0.14],
        description: '螢幕上方攝影機',
        hint: '攝影機很小，很不起眼。',
      },
      {
        id: 'hotspot_pc_taskbar_trash',
        shape: 'circle',
        coords: [0.92, 0.92, 0.12],
        description: '工作列回收筒圖示',
        hint: '空空的，卻莫名有壓力。',
      },
      {
        id: 'hotspot_pc_phone_decoder',
        shape: 'circle',
        coords: [0.38, 0.88, 0.14],
        description: '技術組備忘（草稿手機）',
        hint: '夾在備忘夾旁，螢幕還停在草稿頁。',
      },
    ],
    items: [items.item_encrypted_messages, items.item_column_draft, items.item_ch2_phone_decoder],
    hotspotEventMap: {
      hotspot_pc_overview: 'inspect_pc_overview',
      hotspot_pc_unknown_chat: 'pc_view_unknown_chat',
      hotspot_pc_column_draft: 'pc_view_column_draft',
      hotspot_pc_recording: 'pc_view_recording',
      hotspot_pc_location: 'pc_view_location',
      hotspot_pc_monitor_sticky: 'inspect_pc_monitor_sticky',
      hotspot_pc_taskbar_trash: 'inspect_pc_taskbar_trash',
      hotspot_pc_phone_decoder: 'pc_grant_phone_decoder',
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
                '車上那些「還在跑」的殘影，終於在同一塊桌面對上焦：通訊、草稿、備忘、地圖。\n\n' +
                '阿蘇在邊緣用筆敲了四個記號——像在替一個死掉的人把呼吸接回去。',
              type: 'narrator',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text:
                '阿蘇：「我只能還原到這裡。再往下不是鑑定，是你在替他選故事。」\n\n' +
                '「四個視窗其實是一條線——誰在跟他說話、他想寫什麼、他怕什麼、他的腳為什麼繞成那樣。」',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（警方技術組）',
              characterExpression: 1,
              characterPosition: 'right',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text:
                '看板替你補上名字：吳亞；對外慣用的筆名「烏鴉」，口頭還有另一套叫法。\n\n' +
                '幾個詞被螢光標起來——節能、散場、動線、log、改善——聽起來很行政，疊在一起卻像有人在替事故編目錄。',
              type: 'narrator',
            },
          },
        ],
      },
      {
        id: 'pc_grant_phone_decoder',
        name: '領取技術組草稿手機備忘',
        description: '',
        requirements: [{ type: 'hasFlag', flag: 'ch2_report_fill_done' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text:
                '阿蘇把一支測試機推到備忘夾旁，螢幕停在未同步草稿頁。她指尖停半秒，像在猶豫要不要讓它見光。\n\n' +
                '「劉隊點頭我才敢給。螢幕不壓暗，有些字你只會看見自己想看的那層。」',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（警方技術組）',
              characterExpression: 1,
              characterPosition: 'right',
            },
          },
          { type: 'addItem', itemId: 'item_ch2_phone_decoder' },
          { type: 'setFlag', flag: 'ch2_pc_phone_decoder_taken', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'pc_view_unknown_chat',
        name: '查看 Unknown 對話殘句',
        description: '',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text:
                '終端還原成可讀殘本，中段仍是灰塊。\n\n' +
                '「……為什麼不把資訊完整放出來？」\n' +
                '「……用三起事故來揭，讀者才會信。」\n' +
                '「……她也在場，你確定要這樣寫？」\n' +
                '「……先把節能那篇壓住，別讓他們拿『改善』當藉口。」\n\n' +
                '字短像命令；幾則只剩貼圖或已刪除字樣。',
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
              characterPosition: 'right',
              textSegments: [
                '阿蘇螢光筆圈「三起事故」與「她也在場」。',
                '「『三起』像欄位名。」',
                '「『她』可能是人、代號，或釘子。」',
                '「格式像他打字，節奏太乾——像另一隻手替他斷句。」',
              ],
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text:
                '你把對話讀成兩層拉扯：表面在吵寫不寫、何時發；底層像在決定誰能命令他閉嘴。',
              type: 'narrator',
            },
          },
          { type: 'addItem', itemId: 'item_encrypted_messages' },
          { type: 'setFlag', flag: 'ch2_pc_unknown_viewed', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'pc_view_column_draft',
        name: '查看未發表專欄草稿',
        description: '',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text:
                '全螢幕標題：「節能設備，誰省了電，誰省了責任？」\n\n' +
                '刪除線、註解、紅問號叠在段落旁。\n' +
                '遠端照明改寫散場節奏；空調／機房影響逃生動線怎麼被看見；權限改寫讓流程「看起來正常」。\n\n' +
                '中央反覆改寫：「有一部分的人，總愛把喪事當喜事辦。」\n\n' +
                '末段未完成：「如果我要談這件事，得從兩年前的某個樓梯間開始講起。」',
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
              characterPosition: 'right',
              textSegments: [
                '「散場節奏」不是影評，是「現場怎麼被管理」。',
                '「八卦版反而什麼都沒寫。」',
                '「他在找設備、權限、外包的接口。」',
              ],
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text:
                '同一件事：簡報叫節能、現場叫動線、報告叫結案。\n\n' +
                '草稿未送出；最後編輯停在命案前兩天。',
              type: 'narrator',
            },
          },
          { type: 'addItem', itemId: 'item_column_draft' },
          { type: 'setFlag', flag: 'ch2_pc_column_viewed', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'pc_view_recording',
        name: '查看錄音逐字稿',
        description: '',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text:
                '「備忘_事故」。降噪後逐字稿浮上，語調更冷：\n\n' +
                '「……他們一直說那是個案。個案就很好結案。」\n' +
                '「結案報告有兩個版本，內部／外面；內部多附件，外面多漂亮話。兩份都真，真的點不同。」\n' +
                '「節能上線後誰能改亮度、誰能改巡檢紀錄我講過……他們當故事聽。」\n\n' +
                '背景像影城後台。最後斷在：「如果他要把三起串起來……」',
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
              characterPosition: 'right',
              textSegments: [
                '「兩個版本」是流程，不是八卦。',
                '「講話者還在對；能確定的是他知道內部附件長怎樣——坐過簡報室的人。」',
              ],
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text:
                'Unknown 那邊像在催「三起」的敘事；錄音這邊像在警告別把內部那兩頁講出去——兩邊一拉，你後頸發冷。',
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
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text:
                '馬賽克在終端補成軌跡：W／C／R 三館，外加一棟老商辦（電梯慢、樓梯監視弱）。\n' +
                '命案前一週四點折返，不像通勤，像壓測；解開仍亂。',
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
              characterPosition: 'right',
              textSegments: [
                '「當晚他很早到 W 附近，不是趕場，是在等。」',
                '三館連三角，老商辦在重心。「三點都踩過，沒單點死角。」',
              ],
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text:
                '你把地圖跟另外三個視窗並在一起看：私訊在催稿、草稿在寫節能與動線、錄音在講兩份結案怎麼並存。\n\n' +
                '軌跡像第四種聲音——不是說他做了什麼，而是他用腳在城市裡反覆試同一條線。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'ch2_pc_location_viewed', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'inspect_pc_monitor_sticky',
        name: '螢幕上緣便利貼',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_pc_monitor_sticky' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text:
                '螢光黃便利貼，邊角捲著：\n' +
                '「① 車上那段不是給你跳過的——是給你記住你當時有多急。」\n' +
                '「② 劉隊若打來，先想清楚：你要口頭的，還是要能寫進紀錄的。」',
              type: 'narrator',
            },
          },
        ],
      },
      {
        id: 'inspect_pc_taskbar_trash',
        name: '工作列回收筒',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_pc_taskbar_trash' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text:
                '回收筒：「空的。」桌面刪得掉，版本與對外說法通常不在這。',
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
              characterPosition: 'right',
              textSegments: [
                '「永久刪除只是 UI 安慰。真消失要走流程留紀錄——跟結案一樣，刪桌面易，附件難。」',
              ],
            },
          },
        ],
      },
    ],
    puzzles: [],
    initialDialog: undefined,
    /** 終端場景不顯示阿蘇頭像（阿蘇僅在車內頭像列）；對話仍以立繪／DialogBox 呈現 */
    npcs: [],
  },

  // ========== 第三章：預測（電影院 B 和 C） ==========
  // 可探索空間一：電影院 B（推測地點）
};

const npcDialogs: Record<string, Record<string, NpcDialogNode>> = {
  // 第二章 阿蘇敏感（二選一）：①敘舊／過去疙瘩 ②問案／鑑定與技術邊界
  npc_asu: {
    'node_asu_sensitive1_1': {
      id: 'node_asu_sensitive1_1',
      npcId: 'npc_asu',
      text:
        'KK沒有先講終端，也沒有先講烏鴉。\n\n' +
        'KK：「阿蘇，我們上次把話講死，是兩年前那個樓梯間之後吧。」\n\n' +
        '阿蘇手指停在鍵盤上，像被那四個字燙到。\n' +
        '阿蘇：「你現在要跟我算帳？」\n\n' +
        'KK：「無所謂。我來是想問妳，烏鴉究竟是什麼樣的人？」',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_asu_sensitive1_2',
    },
    'node_asu_sensitive1_2': {
      id: 'node_asu_sensitive1_2',
      npcId: 'npc_asu',
      text:
        '阿蘇吐一口氣，聲音壓得很低。\n\n' +
        '阿蘇：「你寫那篇報告的時候，引我的備註，刪我的但書，把『技術上無法排除』寫得像『就是他們幹的』。」\n' +
        '「你是拿『鑑定』當標題，讓所有人都以為那是一份乾淨的科學結論。」\n' +
        '她看著螢幕反光裡的你：「其實那只是某一個版本的報告。」',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_asu_sensitive1_3',
    },
    'node_asu_sensitive1_3': {
      id: 'node_asu_sensitive1_3',
      npcId: 'npc_asu',
      text:
        'KK：「但兩年前妳提供的那份報告，附件的資料。外面那份沒有。」\n\n' +
        '阿蘇沉默很久。\n\n' +
        '阿蘇：「你當時如果照著內部附件寫，你會被叫去喝咖啡，喝到胃穿孔。」\n' +
        '「你照著外面那份寫，你會覺得自己很正義，但我很難接受。」\n' +
        '「我選擇把嘴閉上，繼續做技術鑑定。」',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_asu_sensitive1_4',
    },
    'node_asu_sensitive1_4': {
      id: 'node_asu_sensitive1_4',
      npcId: 'npc_asu',
      text:
        'KK：「那烏鴉呢？兩年前，妳對他就比較客氣？」\n\n' +
        '阿蘇像被逗笑，又笑不出來。\n\n' +
        '阿蘇：「他寄信來的時候，每一封都像在指控我『幫兇』。我回得很爛，說：『那是你自己的價值判斷。』」\n\n' +
        '阿蘇：「不重要了。烏鴉也死了。他後來文章放慢，我以為他怕了——現在才知道他可能不是怕。」',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_asu_sensitive1_5',
    },
    'node_asu_sensitive1_5': {
      id: 'node_asu_sensitive1_5',
      npcId: 'npc_asu',
      text:
        'KK：「所以妳今晚還坐在這，不是為了劉隊。」\n\n' +
        '阿蘇把筆電蓋上又掀開，動作粗暴得像在揍自己。\n\n' +
        '阿蘇：「因為他死在同一種流程裡。節能、動線、紀錄、版本——換了場景，刀法沒換。」\n\n' +
        '阿蘇：「我在盯資料。你愛怎麼寫是你的事。」',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_asu_sensitive1_6',
    },
    'node_asu_sensitive1_6': {
      id: 'node_asu_sensitive1_6',
      npcId: 'npc_asu',
      text:
        '阿蘇把視線移回螢幕，像把情緒硬塞回終端。\n' +
        '阿蘇：「疙瘩不會因為你問了就消失。我也不需要你道歉。」\n\n' +
        '她補上一句，輕得像刀背：\n' +
        '「兩年前那件事，我還沒想好，今晚的事情也很大，我也還沒想好。」',
      choices: [
        {
          id: 'choice_asu_s1_done',
          label: '（結束對話）',
          description: '',
          effects: [{ type: 'setFlag', flag: 'npc_asu_sensitive_done', value: true }],
        },
      ],
    },
    'node_asu_sensitive2_1': {
      id: 'node_asu_sensitive2_1',
      npcId: 'npc_asu',
      text:
        'KK：「這些線索像是雜亂的拼圖，妳能拼出什麼？」\n\n' +
        '「Unknown 對話、逐字稿、軌跡，每一個環節，妳覺得烏鴉可能想做什麼？」\n\n' +
        '阿蘇眼神立刻變回技術組那種乾淨的冷。\n' +
        '阿蘇：「我能保證我們接手的容器沒被換過，哈希對得上扣押清單。」\n' +
        '「我不能保證手機在他生前沒被人動過，那是現場與扣押段的問題。」\n\n' +
        'KK：「所以鑑定從哪一刀開始算『可信』？」\n\n' +
        '阿蘇：「從我們寫進報告的那一刀開始。之前都叫『條件』。」',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_asu_sensitive2_2',
    },
    'node_asu_sensitive2_2': {
      id: 'node_asu_sensitive2_2',
      npcId: 'npc_asu',
      text:
        'KK：「那 Unknown 還原呢？灰塊是遺失還是被抹掉？」\n\n' +
        '阿蘇：「兩種都可能。被抹掉的通常留下不自然的邊界——我們有看到。習慣可以被模仿，斷句也可以被學。」\n\n' +
        '阿蘇：「格式像他，語氣不像——那是風險提示，不是結論。可能有人在餵他句子，或用他熟悉的排版逼他相信『這是自己人』。我只能把不自然處標紅。」',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_asu_sensitive2_3',
    },
    'node_asu_sensitive2_3': {
      id: 'node_asu_sensitive2_3',
      npcId: 'npc_asu',
      text:
        'KK：「錄音降噪，會不會把關鍵咬字抹成合理？」\n\n' +
        '阿蘇：「會。原始檔保留，另開處理鏈。母帶若出現不連續，我會寫『可能存在剪接風險』。」\n\n' +
        'KK：「『兩份結案』，妳能從技術上印證嗎？」\n\n' +
        '阿蘇：「我只能印證『兩份文件的欄位與附件不一致』。但你可以把『兩份』當成接口——接口背後通常有人。」',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_asu_sensitive2_4',
    },
    'node_asu_sensitive2_4': {
      id: 'node_asu_sensitive2_4',
      npcId: 'npc_asu',
      text:
        'KK：「定位軌跡—— spoofing、基站漂移，妳排除到哪裡？」\n\n' +
        '阿蘇：「交叉比對：帳號、裝置識別碼、移動節奏。有人用權限在伺服器端改紀錄，我會看到『漂亮得不像真的』。」\n\n' +
        'KK：「妳有看到嗎？」\n\n' +
        '阿蘇：「他在三節點之間繞，那比單點造假麻煩——他不是被拖著走，是在測試：哪段路最容易從報告裡消失。」',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_asu_sensitive2_5',
    },
    'node_asu_sensitive2_5': {
      id: 'node_asu_sensitive2_5',
      npcId: 'npc_asu',
      text:
        'KK：「如果我要動手腳，我會從哪裡下手？」\n\n' +
        '阿蘇看了你很久，像在評估你是不是在自首。\n\n' +
        '阿蘇：「最省力的是敘事。檔案要對哈希，成本高；挑對句子，讀者會自己幫你結案。」\n\n' +
        '阿蘇：「『三起事故』是釘子，『她也在場』也是——讓你猜人，不去查權限。」\n\n' +
        'KK：「妳能給我一句底線嗎？」\n\n' +
        '阿蘇：「任何我沒寫進鑑定報告的推測，你都不准替我講成『技術已確認』。」',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_asu_sensitive2_6',
    },
    'node_asu_sensitive2_6': {
      id: 'node_asu_sensitive2_6',
      npcId: 'npc_asu',
      text:
        '阿蘇把終端畫面切回四宮格，像在替今晚蓋章。\n\n' +
        '阿蘇：「你要技術，我就給你到這裡。再往下不是鑑定，是劇本。」\n\n' +
        '阿蘇：「我怕的是有人會借你的標題去關燈。烏鴉已經死了一次，我不想再看第二個人死在『大家都以為真相已經出來』的那一刻。」\n\n' +
        '她把一支 USB 推回讀卡槽，動作很輕，卻像下最後通牒。\n' +
        '阿蘇：「記住：我能證明資料長什麼樣。我不能證明人心長什麼樣。」',
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
};

export { scenes, items, npcDialogs };
