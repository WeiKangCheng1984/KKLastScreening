import { Scene, Item, NpcDialogNode, GameState } from '@/types/game';

// ──────────────────────────────────────────────
// 第六章 道具
// ──────────────────────────────────────────────
const items: Record<string, Item> = {

  // 場景一：最終放映廳
  item_blackout_sequence: {
    id: 'item_blackout_sequence',
    name: '第三起事故時間序列',
    description:
      '放映廳的燈光、廣播、逃生動線在本次事故中的時序記錄：\n\n廣播晚於燈光 11 秒；逃生指示燈在燈光切換後 4 秒才亮起；面板記錄了一次「手動覆蓋自動序列」的操作指令。\n\n這個序列，和第二起事故完全相同。\n不只是相同的版本，是相同的操作邏輯。',
    svgImage: '/svg/items/blackout_sequence.svg',
    svgSize: 'medium',
    collectible: true,
  },
  item_screening_panel_trace: {
    id: 'item_screening_panel_trace',
    name: '放映廳面板操作記錄',
    description:
      '面板內部的操作 log（非整理版）：\n\n操作時間：正式放映開始後 47 分鐘\n操作指令：手動覆蓋燈控序列\n觸發來源：遠端連線（節點識別碼存在但無法解析）\n\n顧乃謙說：「遠端連線有節點識別碼，代表原始 log 應該有——如果中控室那份還在的話。」',
    svgImage: '/svg/items/screening_panel_trace.svg',
    svgSize: 'medium',
    collectible: true,
  },

  // 場景二：中控室
  item_raw_log_archive: {
    id: 'item_raw_log_archive',
    name: '中控室原始 log 存檔',
    description:
      '中控室伺服器裡還沒有被覆蓋的原始 log。\n\n欄位完整：操作來源 IP、失敗登入嘗試、遠端節點完整識別碼、操作前原始值——全在。\n\n顧乃謙說：「拿到這份，整理版被剪裁的部分就能完整比對。」\n阿蘇說：「現在不存，等下就只剩版本。」\n\n這份檔案，是真相結局與其他結局的分水嶺。',
    svgImage: '/svg/items/raw_log_archive.svg',
    svgSize: 'medium',
    collectible: true,
  },
  item_door_access_anomaly: {
    id: 'item_door_access_anomaly',
    name: '門禁異常記錄',
    description:
      '中控室附近的門禁記錄在事故發生時出現一次斷線後重連。\n\n斷線時間：事故前 6 分鐘\n重連時間：事故後 2 分鐘\n這段時間，有人進出過這個區域，但門禁沒有記錄到身分。\n\n阿蘇說：「6 分鐘是準備，2 分鐘是離場。這個操作需要對現場很熟。」',
    svgImage: '/svg/items/door_access_anomaly.svg',
    svgSize: 'medium',
    collectible: true,
  },

  // 場景三：記者會前廊
  item_press_speech_draft: {
    id: 'item_press_speech_draft',
    name: '宋雅甄預備發言稿',
    description:
      '宋雅甄準備給記者會的發言稿初稿：\n\n第一段：「本公司對此次意外深感遺憾，已啟動全面系統檢查……」\n第二段：「相關責任人員目前配合警方調查……」\n第三段：「公司將確保此類事件不再發生……」\n\n「相關責任人員」這個詞被用了三次，但沒有一次接著名字。',
    svgImage: '/svg/items/press_speech_draft.svg',
    svgSize: 'medium',
    collectible: true,
  },
  item_zhang_edited_brief: {
    id: 'item_zhang_edited_brief',
    name: '張景衡修過的說帖',
    description:
      '張景衡把宋雅甄的初稿修過一遍，對比版本：\n\n改動 1：「系統故障」取代「操作異常」\n改動 2：刪除了「遠端操作存在可能性」這整句話\n改動 3：「高文傑配合調查中」→「技術維護人員配合調查中」\n\n張景衡說：「先發出去的那份，就會比較像真的。」\n\n他改掉的那些字，就是你花了五章找到的那些字。',
    svgImage: '/svg/items/zhang_edited_brief.svg',
    svgSize: 'medium',
    collectible: true,
  },
};

// ──────────────────────────────────────────────
// 第六章 場景
// ──────────────────────────────────────────────
const scenes: Record<string, Scene> = {

  // ──────────────────────────────────────────────
  // 場景一：最終放映廳
  // ──────────────────────────────────────────────
  scene_ch6_screening_hall: {
    id: 'scene_ch6_screening_hall',
    chapterId: 'ch6',
    name: '最終放映廳',
    description: '第三起事故正在發生。燈光在片尾前提前切換，廣播延遲，觀眾開始移動。和前兩次一樣的序列。',
    background: '/images/bg_ch6_sc1_v1.webp',
    hotspots: [
      {
        id: 'hotspot_ch6_liu',
        shape: 'rect',
        coords: [0.04, 0.3, 0.24, 0.78],
        description: '劉隊',
        hint: '劉隊站在出口附近，目光在觀眾和面板之間來回。',
      },
      {
        id: 'hotspot_ch6_gu',
        shape: 'rect',
        coords: [0.62, 0.28, 0.82, 0.78],
        description: '顧乃謙',
        hint: '顧乃謙在面板旁，手機接著什麼，表情說他知道發生了什麼。',
      },
      {
        id: 'hotspot_ch6_police',
        shape: 'rect',
        coords: [0.82, 0.28, 0.97, 0.78],
        description: '警方現場',
        hint: '警方在入口詢問要不要先清場。',
      },
      {
        id: 'hotspot_ch6_blackout_seq',
        shape: 'rect',
        coords: [0.28, 0.08, 0.6, 0.42],
        description: '事故時間序列記錄',
        hint: '廣播、燈光、逃生動線的時序——和上次一模一樣。',
      },
      {
        id: 'hotspot_ch6_panel_trace',
        shape: 'rect',
        coords: [0.28, 0.5, 0.6, 0.88],
        description: '面板操作記錄（含遠端節點）',
        hint: '面板裡有遠端連線節點識別碼，顧乃謙說中控室的原始 log 應該有完整記錄。',
      },
    ],
    npcs: [
      {
        id: 'npc_liu',
        name: '劉隊（偵查隊）',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch6_liu_idle_1', text: '劉隊說：「第三次了。每次都差一點，這次也一樣。」', type: 'hint', weight: 1 },
          { id: 'ch6_liu_idle_2', text: '「中控室的原始 log 還在的話，這是最後一次能取到的機會。」', type: 'hint', weight: 1 },
        ],
        available: true,
      },
      {
        id: 'npc_gu_naiqian',
        name: '顧乃謙（系統工程）',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch6_gu_idle_1', text: '顧乃謙說：「面板記錄了遠端連線，如果中控室那份原始 log 沒被覆蓋，我能追到節點。」', type: 'hint', weight: 1 },
          { id: 'ch6_gu_idle_2', text: '「這個序列和第二起事故完全相同。不只是版本，是操作邏輯。」', type: 'hint', weight: 1 },
        ],
        available: true,
      },
      {
        id: 'npc_police_scene',
        name: '警方現場',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch6_police_idle_1', text: '警方說：「現場要不要封？你說，我們配合。」', type: 'hint', weight: 1 },
          { id: 'ch6_police_idle_2', text: '「工作人員在問最後一場要不要停——有幾百個人還在裡面。」', type: 'hint', weight: 1 },
        ],
        available: true,
      },
    ],
    items: [
      items.item_blackout_sequence,
      items.item_screening_panel_trace,
    ],
    hotspotEventMap: {
      hotspot_ch6_liu: 'talk_liu_ch6_task',
      hotspot_ch6_gu: 'talk_gu_ch6_hall',
      hotspot_ch6_police: 'talk_police_ch6',
      hotspot_ch6_blackout_seq: 'inspect_ch6_blackout_seq',
      hotspot_ch6_panel_trace: 'inspect_ch6_panel_trace',
    },
    events: [
      {
        id: 'talk_liu_ch6_task',
        name: '接受劉隊任務',
        description: '與劉隊確認最終章任務。',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '劉隊說：「第三起事故，正在發生。」\n\n「中控室的原始 log 是最後一張牌。記者會快開始了，宋雅甄和張景衡在後台。林子睿在哪裡，我不確定。」\n\n「你現在能做的是：把這裡的現場看清楚，然後去中控室做一個決定。之後，去後台把話說完。」',
              type: 'character',
              characterId: 'npc_liu',
              characterName: '劉隊（偵查隊）',
              characterExpression: 1,
              characterPosition: 'left',
            },
          },
          { type: 'setFlag', flag: 'ch6_task_from_liu', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'talk_gu_ch6_hall',
        name: '問顧乃謙（放映廳）',
        description: '詢問顧乃謙關於第三起事故的技術判斷。',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '顧乃謙說：「這個序列和第二起事故完全相同，不只是同版本，是同一個操作邏輯被再次執行。」\n\n「面板裡有遠端連線的節點識別碼——如果你能去中控室把原始 log 封存起來，我就能比對那個節點，告訴你連線從哪裡來的。」\n\n「如果你手上是 raw，我能證明它被剪過。」',
              type: 'character',
              characterId: 'npc_gu_naiqian',
              characterName: '顧乃謙（系統工程）',
              characterExpression: 1,
              characterPosition: 'right',
            },
          },
          { type: 'setFlag', flag: 'ch6_gu_hall_talked', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'talk_police_ch6',
        name: '與警方現場對話',
        description: '和警方確認現場狀況。',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '警方說：「現場要不要封？我們等你的判斷。」\n\n「觀眾還在移動，有幾個人跌倒了，但目前沒有重傷。工作人員問最後一場要不要強制停映。」\n\n「你說，我們配合。但你快點說。」',
              type: 'character',
              characterId: 'npc_police_scene',
              characterName: '警方現場',
              characterExpression: 1,
              characterPosition: 'right',
            },
          },
          { type: 'setFlag', flag: 'ch6_police_talked', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'inspect_ch6_blackout_seq',
        name: '查看第三起事故時間序列',
        description: '仔細看這次事故的時序記錄。',
        requirements: [],
        effects: [
          { type: 'addItem', itemId: 'item_blackout_sequence' },
          {
            type: 'showDialog',
            dialog: {
              text: '廣播晚燈光 11 秒，逃生動線延遲 4 秒——和第二起事故的時序幾乎完全一致。\n\n這不是巧合，也不是舊 bug 復發。這是同一份操作邏輯被第三次執行。\n\n「有人試圖讓事故看起來像完整收尾：舊案、命案、未遂，最後再補一場。」',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'ch6_blackout_seq_viewed', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'inspect_ch6_panel_trace',
        name: '查看面板操作記錄',
        description: '仔細看面板裡的操作記錄。',
        requirements: [],
        effects: [
          { type: 'addItem', itemId: 'item_screening_panel_trace' },
          {
            type: 'showDialog',
            dialog: {
              text: '面板記錄：操作時間在正式放映後 47 分鐘，指令是「手動覆蓋燈控序列」，觸發來源是遠端連線，節點識別碼存在但無法在整理版裡解析。\n\n「無法解析」不等於不存在。原始 log 有那個識別碼的完整記錄。\n\n如果中控室的存檔還沒被覆蓋……',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'ch6_panel_trace_viewed', value: true },
        ],
        oneTime: true,
      },
    ],
    puzzles: [],
    initialDialog: {
      text: '第三起事故正在發生。\n\n燈在片尾前切換，廣播晚了 11 秒，觀眾在黑暗裡移動。\n\n你已經見過這個序列兩次了。',
      type: 'narrator',
    },
  },

  // ──────────────────────────────────────────────
  // 場景二：中控室 / 原始資料封存點
  // ──────────────────────────────────────────────
  scene_ch6_control_room: {
    id: 'scene_ch6_control_room',
    chapterId: 'ch6',
    name: '中控室',
    description: '原始 log 還在這裡，但張景衡剛剛進過這個房間。阿蘇說現在每慢一分鐘，資料就有一分鐘可以被重寫。',
    background: '/images/bg_ch6_sc2_v1.webp',
    hotspots: [
      {
        id: 'hotspot_ch6_asu',
        shape: 'rect',
        coords: [0.04, 0.25, 0.28, 0.78],
        description: '阿蘇',
        hint: '阿蘇站在伺服器旁，看著螢幕上的時間戳，像在等一個決定。',
      },
      {
        id: 'hotspot_ch6_zhang_ctrl',
        shape: 'rect',
        coords: [0.72, 0.25, 0.9, 0.78],
        description: '張景衡',
        hint: '張景衡在電話裡說「再等一下」，像在替誰爭取時間。',
      },
      {
        id: 'hotspot_ch6_raw_log',
        shape: 'rect',
        coords: [0.3, 0.08, 0.62, 0.44],
        description: '原始 log 存檔（D7）',
        hint: '中控室伺服器，原始 log 還在。這是做決定的地方。',
      },
      {
        id: 'hotspot_ch6_door_anomaly',
        shape: 'rect',
        coords: [0.3, 0.5, 0.62, 0.88],
        description: '門禁異常記錄',
        hint: '事故前 6 分鐘斷線，事故後 2 分鐘重連，有人來過但沒有記錄身分。',
      },
    ],
    npcs: [
      {
        id: 'npc_asu',
        name: '阿蘇（警方技術組）',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch6_asu_idle_1', text: '阿蘇說：「你現在每慢一分鐘，資料就有一分鐘可以被重寫。」', type: 'hint', weight: 1 },
          { id: 'ch6_asu_idle_2', text: '「先封存，或先救人，或先抓人。三條路都不乾淨，選吧。」', type: 'hint', weight: 1 },
        ],
        available: true,
      },
      {
        id: 'npc_zhang_jingheng',
        name: '張景衡（公關策略）',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch6_zhang_idle_1', text: '張景衡說：「你不是在跟我爭資料，你是在跟時間爭。」', type: 'hint', weight: 1 },
          { id: 'ch6_zhang_idle_2', text: '「觀眾只會看結果，沒人會替原始檔鼓掌。」', type: 'hint', weight: 1 },
        ],
        available: true,
      },
    ],
    items: [
      items.item_raw_log_archive,
      items.item_door_access_anomaly,
    ],
    hotspotEventMap: {
      hotspot_ch6_asu: 'talk_asu_ch6_ctrl',
      hotspot_ch6_zhang_ctrl: 'talk_zhang_ch6_ctrl',
      hotspot_ch6_raw_log: 'inspect_ch6_raw_log_d7',
      hotspot_ch6_door_anomaly: 'inspect_ch6_door_anomaly',
    },
    events: [
      {
        id: 'talk_asu_ch6_ctrl',
        name: '問阿蘇（中控室）',
        description: '詢問阿蘇關於先封存/先救人/先追人的判斷。',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '阿蘇說：「先封存——資料在，事後還能追。先救人——人命優先，但張景衡在外面，他有時間處理這份 log。先追人——你可能找到操作者，但現場會亂，傷亡可能變重。」\n\n「三條路都不乾淨。我不替你選。但你現在每慢一分鐘，選擇就少一個。」',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（警方技術組）',
              characterExpression: 1,
              characterPosition: 'left',
            },
          },
          { type: 'setFlag', flag: 'ch6_asu_ctrl_talked', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'talk_zhang_ch6_ctrl',
        name: '問張景衡（中控室）',
        description: '詢問張景衡在這裡做什麼。',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '張景衡說：「我在確認系統狀態，這是我的工作。」\n\n他說這句話的節奏，和阿蘇說「拖延也是一種選擇」的語氣完全吻合。\n\n「先發出去的那份，就會比較像真的。」他若無其事地補了一句，然後看著你等你走。',
              type: 'character',
              characterId: 'npc_zhang_jingheng',
              characterName: '張景衡（公關策略）',
              characterExpression: 1,
              characterPosition: 'right',
            },
          },
          { type: 'setFlag', flag: 'ch6_zhang_ctrl_talked', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'inspect_ch6_raw_log_d7',
        name: '面對原始 log 存檔（D7 選擇）',
        description: '伸手觸及中控室伺服器——現在做決定。',
        requirements: [],
        effects: [
          { type: 'addItem', itemId: 'item_raw_log_archive' },
          {
            type: 'showDialog',
            dialog: {
              text: '阿蘇說：「現在不存，等下就只剩版本。」\n顧乃謙說：「如果你手上是 raw，我能證明它被剪過。如果你手上只有 curated，那你守的可能只是漂亮屍體。」\n\n外面還有人在黑暗裡。後台的記者會快開始了。\n\n你要先做什麼？',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（警方技術組）',
              characterExpression: 1,
              characterPosition: 'left',
              choices: [
                {
                  id: 'ch6_d7_archive',
                  text: '先封存這份原始 log——把它存下來，再去處理其他事。',
                  effects: [
                    { type: 'setFlag', flag: 'ch6_d7_archive', value: true },
                    { type: 'setFlag', flag: 'ch6_d7_done', value: true },
                    { type: 'setFlag', flag: 'ch6_raw_log_secured', value: true },
                  ],
                  insightEffects: [{ target: 'evidence_insight', delta: 2 }],
                },
                {
                  id: 'ch6_d7_rescue',
                  text: '先出去疏散觀眾——人命比 log 重要，資料的事待會再說。',
                  effects: [
                    { type: 'setFlag', flag: 'ch6_d7_rescue', value: true },
                    { type: 'setFlag', flag: 'ch6_d7_done', value: true },
                  ],
                  insightEffects: [{ target: 'human_insight', delta: 2 }],
                },
                {
                  id: 'ch6_d7_chase',
                  text: '先追操作者——有人剛剛離開這個房間，我要找到他。',
                  effects: [
                    { type: 'setFlag', flag: 'ch6_d7_chase', value: true },
                    { type: 'setFlag', flag: 'ch6_d7_done', value: true },
                  ],
                  insightEffects: [{ target: 'procedure_insight', delta: 2 }],
                },
              ],
            },
          },
          { type: 'setFlag', flag: 'ch6_raw_log_viewed', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'inspect_ch6_door_anomaly',
        name: '查看門禁異常記錄',
        description: '閱讀門禁的斷線重連記錄。',
        requirements: [],
        effects: [
          { type: 'addItem', itemId: 'item_door_access_anomaly' },
          {
            type: 'showDialog',
            dialog: {
              text: '事故前 6 分鐘斷線，事故後 2 分鐘重連——有人進出這個區域，但沒有記錄身分。\n\n6 分鐘是足夠做一件事的時間。2 分鐘是足夠離開的時間。\n\n這個人知道什麼時候門禁不會記錄。這需要很熟悉這個系統。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'ch6_door_anomaly_viewed', value: true },
        ],
        oneTime: true,
      },
    ],
    puzzles: [],
    initialDialog: {
      text: '中控室的伺服器風扇聲比外面的人聲安靜。\n\n原始 log 還在這裡，阿蘇站在旁邊等你。\n張景衡剛從這裡的方向走過來。',
      type: 'narrator',
    },
  },

  // ──────────────────────────────────────────────
  // 場景三：記者會前廊 / 後台通道
  // ──────────────────────────────────────────────
  scene_ch6_press_corridor: {
    id: 'scene_ch6_press_corridor',
    chapterId: 'ch6',
    name: '記者會前廊',
    description: '記者會在 15 分鐘後開始。宋雅甄在調整發言，張景衡在修說帖，林子睿在某個你看不到的地方。',
    background: '/images/bg_ch6_sc3_v1.webp',
    hotspots: [
      {
        id: 'hotspot_ch6_song',
        shape: 'rect',
        coords: [0.04, 0.25, 0.28, 0.78],
        description: '宋雅甄',
        hint: '宋雅甄拿著發言稿，手稿上有幾個字被畫掉又寫回來。',
      },
      {
        id: 'hotspot_ch6_zhang_press',
        shape: 'rect',
        coords: [0.72, 0.25, 0.9, 0.78],
        description: '張景衡',
        hint: '張景衡坐在角落，面對電腦，說帖已經改到第三版。',
      },
      {
        id: 'hotspot_ch6_lin',
        shape: 'rect',
        coords: [0.82, 0.68, 0.97, 0.95],
        description: '林子睿',
        hint: '林子睿在後台通道出現，神情比平時更平靜。',
      },
      {
        id: 'hotspot_ch6_press_draft',
        shape: 'rect',
        coords: [0.3, 0.08, 0.62, 0.44],
        description: '宋雅甄預備發言稿',
        hint: '「相關責任人員」這個詞出現了三次，但沒有接名字。',
      },
      {
        id: 'hotspot_ch6_zhang_brief',
        shape: 'rect',
        coords: [0.3, 0.5, 0.62, 0.88],
        description: '張景衡修過的說帖',
        hint: '對比初稿，「遠端操作存在可能性」這整句話不見了。',
      },
    ],
    npcs: [
      {
        id: 'npc_song_yazhen',
        name: '宋雅甄（品牌公關）',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch6_song_idle_1', text: '宋雅甄說：「今晚一定要有一個能對外說的版本。」', type: 'hint', weight: 1 },
          { id: 'ch6_song_idle_2', text: '「群眾不會等你把每個括號都補完。」', type: 'hint', weight: 1 },
          { id: 'ch6_song_idle_3', text: '「你要真相，我要明天還能開門。這不一定互相排斥，但今晚很難兩全。」', type: 'hint', weight: 1 },
        ],
        available: true,
      },
      {
        id: 'npc_zhang_jingheng',
        name: '張景衡（公關策略）',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch6_zhang_press_idle_1', text: '張景衡說：「先發出去的那份，就會比較像真的。」', type: 'hint', weight: 1 },
          { id: 'ch6_zhang_press_idle_2', text: '「觀眾只會看結果，沒人會替原始檔鼓掌。」', type: 'hint', weight: 1 },
        ],
        available: true,
      },
      {
        id: 'npc_lin_zirui',
        name: '林子睿（技術長）',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch6_lin_idle_1', text: '林子睿說：「緊急時刻最忌諱分心。請你不要妨礙技術處置。」', type: 'hint', weight: 1 },
          { id: 'ch6_lin_idle_2', text: '「所有系統都有代價。你只是第一次看見代價長成新聞。」', type: 'hint', weight: 1 },
          { id: 'ch6_lin_idle_3', text: '「有人死了，大家才願意升級。這很醜，但很有效。」', type: 'hint', weight: 1 },
        ],
        available: true,
      },
    ],
    items: [
      items.item_press_speech_draft,
      items.item_zhang_edited_brief,
    ],
    hotspotEventMap: {
      hotspot_ch6_song: 'talk_song_ch6',
      hotspot_ch6_zhang_press: 'talk_zhang_ch6_press',
      hotspot_ch6_lin: 'talk_lin_ch6_casual',
      hotspot_ch6_press_draft: 'inspect_ch6_press_draft',
      hotspot_ch6_zhang_brief: 'inspect_ch6_zhang_brief',
    },
    events: [
      {
        id: 'talk_song_ch6',
        name: '問宋雅甄（記者會前）',
        description: '詢問宋雅甄她想保公司還是保人。',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '宋雅甄說：「你問我想保公司還是保人。」\n\n她停了很久：「這兩件事今晚真的很難兩全。」\n\n「如果你手上有足夠的東西——有那份原始 log，有林子睿的決策鏈——告訴我。我可以重寫這份稿子。」\n\n「但你要先告訴我，你有沒有那份東西。」',
              type: 'character',
              characterId: 'npc_song_yazhen',
              characterName: '宋雅甄（品牌公關）',
              characterExpression: 1,
              characterPosition: 'left',
            },
          },
          { type: 'setFlag', flag: 'ch6_song_talked', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'talk_zhang_ch6_press',
        name: '問張景衡（記者會前）',
        description: '直接問張景衡他在替誰寫字。',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '「你在替誰寫字？」\n\n張景衡停下來看著你，第一次沒有立刻接話。\n\n「我在替一個需要今晚能開得了口的版本寫字。」\n\n「如果那個版本裡沒有你要的名字，那是因為我的工作是讓文字不傷人——但我沒辦法決定那個傷人的名字是誰。」',
              type: 'character',
              characterId: 'npc_zhang_jingheng',
              characterName: '張景衡（公關策略）',
              characterExpression: 1,
              characterPosition: 'right',
            },
          },
          { type: 'setFlag', flag: 'ch6_zhang_talked', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'talk_lin_ch6_casual',
        name: '問林子睿（後台通道）',
        description: '在後台遇到林子睿，初步對話。',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '林子睿說：「你還在這裡。」\n\n「緊急時刻最忌諱分心。每個人都應該做自己最擅長的事——你調查，我讓系統繼續運作。」\n\n他說這句話的平靜程度，和三起事故後在電話裡說「多半只是管理落後」的語氣，一模一樣。',
              type: 'character',
              characterId: 'npc_lin_zirui',
              characterName: '林子睿（技術長）',
              characterExpression: 1,
              characterPosition: 'right',
            },
          },
          { type: 'setFlag', flag: 'ch6_lin_casual_talked', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'inspect_ch6_press_draft',
        name: '查看宋雅甄預備發言稿',
        description: '閱讀官方版本的發言稿。',
        requirements: [],
        effects: [
          { type: 'addItem', itemId: 'item_press_speech_draft' },
          {
            type: 'showDialog',
            dialog: {
              text: '「相關責任人員」出現三次，但沒有一次後面跟著名字。\n\n每一段都有「深感遺憾」「啟動調查」「確保不再」——都是被動語氣，沒有人要為什麼負責。\n\n宋雅甄說：「群眾不會等你把每個括號都補完。」\n\n但有些括號，今晚要補完。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'ch6_press_draft_viewed', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'inspect_ch6_zhang_brief',
        name: '查看張景衡修過的說帖',
        description: '閱讀修改版本的說帖，比對改動。',
        requirements: [],
        effects: [
          { type: 'addItem', itemId: 'item_zhang_edited_brief' },
          {
            type: 'showDialog',
            dialog: {
              text: '張景衡把初稿改了三個地方：\n\n「操作異常」改成「系統故障」——讓它看起來是硬體問題，不是人為操作。\n「遠端操作存在可能性」這整句話不見了——這句話是顧乃謙和陳佑誠花了三章才說清楚的東西。\n「高文傑配合調查中」改成「技術維護人員配合調查中」——讓名字從文字裡消失。\n\n他改掉的，就是你花了五章找到的那些字。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'ch6_zhang_brief_viewed', value: true },
        ],
        oneTime: true,
      },
    ],
    puzzles: [],
    initialDialog: {
      text: '記者會前廊的燈比正常亮一倍，像為了讓所有人看起來更冷靜。\n\n宋雅甄在調稿。張景衡在改說帖。林子睿不在鏡頭前，但你知道他在某個地方。',
      type: 'narrator',
    },
  },
};

// ──────────────────────────────────────────────
// 第六章 NPC 對話樹
// ──────────────────────────────────────────────
const npcDialogs: Record<string, Record<string, NpcDialogNode>> = {

  // ──────────────────────────────────────────────
  // 林子睿 最終對決（ch6 核心 NPC）
  // ──────────────────────────────────────────────
  npc_lin_zirui: {
    // 最終對決 branch 1：「你在等這場危機把舊結構一起燒掉」
    node_lin_ch6_final1_1: {
      id: 'node_lin_ch6_final1_1',
      npcId: 'npc_lin_zirui',
      text:
        '林子睿說：「你問我是不是在等這場危機。」\n\n他想了很久，第一次在你面前有了停頓。\n\n「危機是一個機會。這沒有什麼好否認的。有人死了，大家才願意升級——這不是我說的，這是每個系統的歷史都在說的。」\n\n「我在等的不是危機，我在等一個所有人都不得不升級的理由。」',
      choices: [
        {
          id: 'lin_f1_q1',
          label: '三個人的代價——他們算不算那個「理由」？',
          effects: [{ type: 'setFlag', flag: 'ch6_lin_f1_q1', value: true }],
          insightEffects: [{ target: 'human_insight', delta: 2 }],
        },
        {
          id: 'lin_f1_q2',
          label: '那份風險回報——你決定不批，就是在等這個理由成熟？',
          effects: [{ type: 'setFlag', flag: 'ch6_lin_f1_q2', value: true }],
          insightEffects: [{ target: 'evidence_insight', delta: 2 }],
        },
      ],
      next: (state: GameState): string | null => {
        if (state.flags.ch6_lin_f1_q1) return 'node_lin_f1_reply_q1';
        return 'node_lin_f1_reply_q2';
      },
    },
    node_lin_f1_reply_q1: {
      id: 'node_lin_f1_reply_q1',
      npcId: 'npc_lin_zirui',
      text:
        '林子睿的表情沒有動。\n\n「我不能說那三個人的遭遇是值得的。沒有人能說出那句話。」\n\n「但我也不能說：如果沒有那件事，系統今天還是一樣爛——這也是真的。」\n\n「你要我認罪？我沒有指令叫任何人死。我只是讓一些事情繼續存在，等它自己發展。」\n\n「你說那叫什麼，我聽著。」',
      choices: [
        {
          id: 'lin_f1_end',
          label: '（結束對話）',
          effects: [
            { type: 'setFlag', flag: 'npc_lin_ch6_confrontation_done', value: true },
          ],
        },
      ],
    },
    node_lin_f1_reply_q2: {
      id: 'node_lin_f1_reply_q2',
      npcId: 'npc_lin_zirui',
      text:
        '林子睿說：「陳佑誠的回報單。」\n\n他重複了一次。\n\n「那三份回報單，優先級是我的人設的。放進系統的是我的人。消失的……」\n\n他停了一下：「消失的，我沒辦法說那不是一個決定。」\n\n「但你要我說那個決定是『等人死』——我不這樣定義它。我定義它是：讓問題在對的時機成為所有人都必須面對的問題。」\n\n「你說那叫什麼，我聽著。」',
      choices: [
        {
          id: 'lin_f1_end',
          label: '（結束對話）',
          effects: [
            { type: 'setFlag', flag: 'npc_lin_ch6_confrontation_done', value: true },
          ],
        },
      ],
    },

    // 最終對決 branch 2：「最後說清楚一件事：有人死了，這是你算進去的代價嗎？」
    node_lin_ch6_final2_1: {
      id: 'node_lin_ch6_final2_1',
      npcId: 'npc_lin_zirui',
      text:
        '林子睿看著你，說：「你問了一個很直接的問題。」\n\n「有人死了，是不是我算進去的代價。」\n\n「我沒有算。我只是讓一個已經存在的洞繼續存在，希望它在對的時機被看見。」\n\n「那個洞被利用了——我不知道是誰利用的。我知道的是，利用它的人，也知道這個洞存在。」',
      choices: [
        {
          id: 'lin_f2_q1',
          label: '「你不知道是誰利用的」——這句話你相信自己嗎？',
          effects: [{ type: 'setFlag', flag: 'ch6_lin_f2_q1', value: true }],
          insightEffects: [{ target: 'human_insight', delta: 1 }],
        },
        {
          id: 'lin_f2_q2',
          label: '插件頂層授權在你那裡——要利用那個洞，需要你點頭或你的沉默。',
          effects: [{ type: 'setFlag', flag: 'ch6_lin_f2_q2', value: true }],
          insightEffects: [{ target: 'procedure_insight', delta: 2 }],
        },
      ],
      next: (state: GameState): string | null => {
        if (state.flags.ch6_lin_f2_q1) return 'node_lin_f2_reply_q1';
        return 'node_lin_f2_reply_q2';
      },
    },
    node_lin_f2_reply_q1: {
      id: 'node_lin_f2_reply_q1',
      npcId: 'npc_lin_zirui',
      text:
        '林子睿停了一秒，第一次沒有立刻說出那種校準過的語氣。\n\n「……我不是百分之百確定。」\n\n「有幾次操作，時機點太準確，準確到我不願意說是巧合。但我沒有證據，你也沒有。」\n\n「如果你手上有原始 log 和完整的連線記錄——那份資料，才能說清楚我知道和不知道的邊界在哪裡。」',
      choices: [
        {
          id: 'lin_f2_end',
          label: '（結束對話）',
          effects: [
            { type: 'setFlag', flag: 'npc_lin_ch6_confrontation_done', value: true },
          ],
        },
      ],
    },
    node_lin_f2_reply_q2: {
      id: 'node_lin_f2_reply_q2',
      npcId: 'npc_lin_zirui',
      text:
        '林子睿說：「插件頂層授權。」\n\n他重複了這幾個字，像在確認它的重量。\n\n「你說得沒錯。那個層級需要我的帳號，或我的沉默。」\n\n「我選擇了沉默——對那三份回報單，對那個風險評估。我不是主動利用了它，但我讓它保持可利用的狀態。」\n\n「這個和你說的——是不是代價——我讓你自己判斷。」',
      choices: [
        {
          id: 'lin_f2_end',
          label: '（結束對話）',
          effects: [
            { type: 'setFlag', flag: 'npc_lin_ch6_confrontation_done', value: true },
          ],
        },
      ],
    },
  },
};

export { scenes, items, npcDialogs };
