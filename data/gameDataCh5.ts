import { Scene, Item, NpcDialogNode, GameState } from '@/types/game';

// ──────────────────────────────────────────────
// 第五章 道具
// ──────────────────────────────────────────────
const items: Record<string, Item> = {

  // 場景一：警方資料室
  item_suspect_matrix: {
    id: 'item_suspect_matrix',
    name: '嫌疑矩陣交叉表',
    description:
      '五人名單的交叉欄位：權限等級、動機方向、關鍵時間點、通聯記錄、在場性。\n\n有意思的地方不在哪一格特別醒目，而在整個矩陣看起來太整齊——像有人在最後統一校過。\n\n高文傑的欄位填得最滿，林子睿的欄位填得最少。',
    svgImage: '/svg/items/suspect_matrix.svg',
    svgSize: 'medium',
    collectible: true,
  },
  item_gao_login_gap: {
    id: 'item_gao_login_gap',
    name: '高文傑登入紀錄（時間差分析）',
    description:
      '高文傑的系統登入紀錄，與第一起命案時間的重疊分析：\n\n共有 14 次登入，其中 3 次的時間點「接近」案發時間，但沒有完全重疊。\n\n「接近」不等於「在場」。「登入」不等於「操作」。\n\n阿蘇說：「登入紀錄只證明帳號在場，不保證靈魂也在場。」',
    svgImage: '/svg/items/gao_login_gap.svg',
    svgSize: 'medium',
    collectible: true,
  },

  // 場景二：技術比對室
  item_log_raw_diff: {
    id: 'item_log_raw_diff',
    name: '原始 log vs 整理版差異清單',
    description:
      '顧乃謙做出的比對清單，原始 log 有，整理版沒有的欄位：\n\n① 操作來源 IP（無法確認遠端或本地）\n② 失敗登入嘗試（3 次失敗後第 4 次成功）\n③ 遠端節點識別碼（共用帳號的連線來源）\n④ 覆寫前原始值（操作前的初始狀態）\n\n「選擇性遺漏，不是格式問題。」\n\n這四個欄位，剛好能讓案件說清楚誰在哪裡操作。',
    svgImage: '/svg/items/log_raw_diff.svg',
    svgSize: 'medium',
    collectible: true,
  },
  item_plugin_permission_tree: {
    id: 'item_plugin_permission_tree',
    name: '插件權限樹',
    description:
      '顧乃謙拉出的插件授權結構圖。\n\n高文傑的帳號有「執行」權限，沒有「修改插件邏輯」的層級。\n\n能修改插件邏輯、能決定插件怎麼被部署到多館的——那個層級靠近技術長職位。\n\n顧乃謙說：「真正能改插件的人，不需要每次自己登入。」',
    svgImage: '/svg/items/plugin_permission_tree.svg',
    svgSize: 'medium',
    collectible: true,
  },

  // 場景三：林子睿辦公室外圍
  item_lin_call_transcript: {
    id: 'item_lin_call_transcript',
    name: '林子睿通話記錄節錄',
    description:
      '技術部門的通話記錄，林子睿在三起事故前後的幾通電話節錄。\n\n語氣特點：用詞精準，風險被描述得「可管理」，事故被歸類為「個案」。每次都在問「影響多大」，很少問「怎麼避免」。\n\n「系統複雜，不代表陰謀存在。多半只是管理落後。」\n\n這句話說過三次，在三起事故之後各說過一次。',
    svgImage: '/svg/items/lin_call_transcript.svg',
    svgSize: 'medium',
    collectible: true,
  },
  item_unknown_msg_style: {
    id: 'item_unknown_msg_style',
    name: 'Unknown 訊息語感比對',
    description:
      '死者手機裡 Unknown 的訊息措辭，與張景衡公關文件的語感比對：\n\n共同特徵：主動句被動化、責任主語消失、「個案」取代「結構問題」、動詞選用「處理中」而非「未解決」。\n\n更往上追：這種說話框架的來源，可能是一個習慣「定義風險怎麼被說」的人。\n\n林子睿不一定寫了 Unknown 的訊息，但有人替林子睿把話翻成了那種格式。',
    svgImage: '/svg/items/unknown_msg_style.svg',
    svgSize: 'medium',
    collectible: true,
  },
};

// ──────────────────────────────────────────────
// 第五章 場景
// ──────────────────────────────────────────────
const scenes: Record<string, Scene> = {

  // ──────────────────────────────────────────────
  // 場景一：警方資料室 / 嫌疑矩陣桌
  // ──────────────────────────────────────────────
  scene_ch5_data_room: {
    id: 'scene_ch5_data_room',
    chapterId: 'ch5',
    name: '警方資料室',
    description: '嫌疑矩陣攤在桌上，五個名字都在上面，欄位填得整整齊齊。但警方資料窗口說上面要名單，不要小說——這個矩陣是名單，還是結論？',
    background: '/images/bg_ch5_sc1_v1.webp',
    hotspots: [
      {
        id: 'hotspot_ch5_liu',
        shape: 'rect',
        coords: [0.04, 0.3, 0.24, 0.78],
        description: '劉隊',
        hint: '劉隊站在桌邊，神情比上一章沉一些。',
      },
      {
        id: 'hotspot_ch5_asu',
        shape: 'rect',
        coords: [0.62, 0.28, 0.82, 0.78],
        description: '阿蘇',
        hint: '阿蘇在看一份資料，沒有抬頭，但她知道你進來了。',
      },
      {
        id: 'hotspot_ch5_police_data',
        shape: 'rect',
        coords: [0.82, 0.28, 0.97, 0.78],
        description: '警方資料窗口',
        hint: '資料窗口的人在等回覆，他的電話響了很多次。',
      },
      {
        id: 'hotspot_ch5_suspect_matrix',
        shape: 'rect',
        coords: [0.28, 0.1, 0.6, 0.5],
        description: '嫌疑矩陣交叉表',
        hint: '五個人，十幾個欄位，每個格子都填了。高文傑的行是最滿的。',
      },
      {
        id: 'hotspot_ch5_gao_login',
        shape: 'rect',
        coords: [0.28, 0.55, 0.6, 0.88],
        description: '高文傑登入紀錄分析',
        hint: '14 次登入，3 次與命案時間「接近」——但接近，不等於吻合。',
      },
    ],
    npcs: [
      {
        id: 'npc_liu',
        name: '劉隊（偵查隊）',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch5_liu_idle_1', text: '劉隊說：「這張表是上面要的，不是我要的。我要的比這個複雜。」', type: 'hint', weight: 1 },
          { id: 'ch5_liu_idle_2', text: '「高文傑的名字太好用了。有時候，一個名字太好用，本身就是一個問題。」', type: 'hint', weight: 1 },
        ],
        available: true,
      },
      {
        id: 'npc_asu',
        name: '阿蘇（警方技術組）',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch5_asu_idle_1', text: '阿蘇說：「我給你資料，不給你結論。你已經遇到太多想替你寫結論的人。」', type: 'hint', weight: 1 },
          { id: 'ch5_asu_idle_2', text: '「登入紀錄只證明帳號在場，不保證靈魂也在場。」', type: 'hint', weight: 1 },
          { id: 'ch5_asu_idle_3', text: '「Unknown 不是神祕，他只是習慣不留下名字。」', type: 'hint', weight: 1 },
        ],
        available: true,
      },
      {
        id: 'npc_police_data',
        name: '警方資料窗口',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch5_police_idle_1', text: '資料窗口說：「上面要名單，不要小說。」', type: 'hint', weight: 1 },
          { id: 'ch5_police_idle_2', text: '「你給我一個先押的人，我們程序才走得動。」', type: 'hint', weight: 1 },
        ],
        available: true,
      },
    ],
    items: [
      items.item_suspect_matrix,
      items.item_gao_login_gap,
    ],
    hotspotEventMap: {
      hotspot_ch5_liu: 'talk_liu_ch5_task',
      hotspot_ch5_asu: 'talk_asu_ch5_data_room',
      hotspot_ch5_police_data: 'talk_police_data_ch5',
      hotspot_ch5_suspect_matrix: 'inspect_ch5_suspect_matrix',
      hotspot_ch5_gao_login: 'inspect_ch5_gao_login',
    },
    events: [
      {
        id: 'talk_liu_ch5_task',
        name: '接受劉隊任務',
        description: '與劉隊確認第五章任務。',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '劉隊說：「這章不是找新的物證，是把舊的物證拆清楚。」\n\n「你要弄清楚：高文傑是手，還是被借來的手。林子睿在技術上有多深，他的名字在幾個地方。」\n\n「阿蘇在比對 log，顧乃謙在拉插件結構，你去問他們問完再回來。」',
              type: 'character',
              characterId: 'npc_liu',
              characterName: '劉隊（偵查隊）',
              characterExpression: 1,
              characterPosition: 'left',
            },
          },
          { type: 'setFlag', flag: 'ch5_task_from_liu', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'talk_asu_ch5_data_room',
        name: '問阿蘇（資料室）',
        description: '詢問阿蘇關於嫌疑矩陣哪個欄位最容易造假。',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '阿蘇說：「哪個欄位最容易騙人？」她停了一下。\n\n「在場性。因為每個人都在解釋為什麼他不在——但沒有人在追『在的那個人是誰』。」\n\n「高文傑的登入紀錄跟命案時間有接近，但不完全吻合。這種程度，是故意留著給你看的，還是本來就這樣，你自己判斷。」',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（警方技術組）',
              characterExpression: 1,
              characterPosition: 'right',
            },
          },
          { type: 'setFlag', flag: 'ch5_asu_data_talked', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'talk_police_data_ch5',
        name: '問警方資料窗口',
        description: '詢問警方資料窗口的壓力來源。',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '資料窗口說：「你知道上面最想先押誰嗎？」\n\n他沒等你回答：「登入紀錄最多的那個。因為這樣報告寫起來最省力。」\n\n「我不是叫你這樣做，我是在告訴你壓力是怎麼運作的。你要做什麼，你自己決定。」',
              type: 'character',
              characterId: 'npc_police_data',
              characterName: '警方資料窗口',
              characterExpression: 1,
              characterPosition: 'right',
            },
          },
          { type: 'setFlag', flag: 'ch5_police_talked', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'inspect_ch5_suspect_matrix',
        name: '查看嫌疑矩陣交叉表',
        description: '仔細看五人嫌疑矩陣。',
        requirements: [],
        effects: [
          { type: 'addItem', itemId: 'item_suspect_matrix' },
          {
            type: 'showDialog',
            dialog: {
              text: '五個人，所有欄位都填了。\n\n有意思的不是哪一格特別紅——而是整張表看起來太整齊，像是最後有人統一校準過。\n\n高文傑的行最滿，林子睿的行最少。\n\n一個人在矩陣裡越顯眼，越值得問：是他真的最可疑，還是有人確保他看起來最可疑？',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'ch5_matrix_viewed', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'inspect_ch5_gao_login',
        name: '查看高文傑登入紀錄分析',
        description: '仔細看高文傑的登入記錄與命案時間差分析。',
        requirements: [],
        effects: [
          { type: 'addItem', itemId: 'item_gao_login_gap' },
          {
            type: 'showDialog',
            dialog: {
              text: '14 次登入，3 次「接近」命案時間窗口，但沒有完全重疊。\n\n如果要做成起訴材料，「接近」這個詞需要更多佐證。\n如果要做成新聞材料，「接近」已經夠用了。\n\n阿蘇說：「帳號在場，不保證靈魂也在場。」',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'ch5_login_gap_viewed', value: true },
        ],
        oneTime: true,
      },
    ],
    puzzles: [],
    initialDialog: {
      text: '警方資料室不算大，但嫌疑矩陣的桌子佔了大半空間。\n\n五個名字，每個人都有欄位。高文傑的行填得最滿。',
      type: 'narrator',
    },
  },

  // ──────────────────────────────────────────────
  // 場景二：技術比對室 / 原始 log 校驗區
  // ──────────────────────────────────────────────
  scene_ch5_log_lab: {
    id: 'scene_ch5_log_lab',
    chapterId: 'ch5',
    name: '技術比對室',
    description: '顧乃謙把兩份 log 放在螢幕上，左邊是整理版，右邊是原始版。「你看看少了什麼。」',
    background: '/images/bg_ch5_sc2_v1.webp',
    hotspots: [
      {
        id: 'hotspot_ch5_gu',
        shape: 'rect',
        coords: [0.04, 0.25, 0.28, 0.78],
        description: '顧乃謙',
        hint: '顧乃謙把插件結構圖印出來，已經做好比對記號。',
      },
      {
        id: 'hotspot_ch5_asu_lab',
        shape: 'rect',
        coords: [0.72, 0.25, 0.9, 0.78],
        description: '阿蘇',
        hint: '阿蘇在另一台電腦前，兩個螢幕，比對的資料量不小。',
      },
      {
        id: 'hotspot_ch5_log_diff',
        shape: 'rect',
        coords: [0.3, 0.08, 0.62, 0.44],
        description: '原始 log 比對螢幕',
        hint: '左邊整理版，右邊原始版，差異欄位用紅色標出。',
      },
      {
        id: 'hotspot_ch5_permission_tree',
        shape: 'rect',
        coords: [0.3, 0.5, 0.62, 0.88],
        description: '插件權限樹結構圖',
        hint: '顧乃謙印出的插件授權結構，頂端那個層級靠近技術長職位。',
      },
    ],
    npcs: [
      {
        id: 'npc_gu_naiqian',
        name: '顧乃謙（系統工程）',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch5_gu_idle_1', text: '顧乃謙說：「時間軸一拉開，高文傑像手；把權限樹一打開，他又太像被借來的手。」', type: 'hint', weight: 1 },
          { id: 'ch5_gu_idle_2', text: '「真正能改插件的人，不需要每次自己登入。」', type: 'hint', weight: 1 },
          { id: 'ch5_gu_idle_3', text: '「這個層級的授權，沒有技術長的簽核不會有人動。不是技術限制，是政策設計。」', type: 'hint', weight: 1 },
        ],
        available: true,
      },
      {
        id: 'npc_asu',
        name: '阿蘇（警方技術組）',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch5_asu_lab_idle_1', text: '阿蘇說：「現在手上的資料能不能押人？我回答你：可以提交，但不一定能讓法院說服自己。」', type: 'hint', weight: 1 },
          { id: 'ch5_asu_lab_idle_2', text: '「你要可證明，還是可提交——這兩件事的差距，在這個案子裡特別大。」', type: 'hint', weight: 1 },
        ],
        available: true,
      },
    ],
    items: [
      items.item_log_raw_diff,
      items.item_plugin_permission_tree,
    ],
    hotspotEventMap: {
      hotspot_ch5_gu: 'talk_gu_ch5_lab',
      hotspot_ch5_asu_lab: 'talk_asu_ch5_lab',
      hotspot_ch5_log_diff: 'inspect_ch5_log_diff',
      hotspot_ch5_permission_tree: 'inspect_ch5_permission_tree',
    },
    events: [
      {
        id: 'talk_gu_ch5_lab',
        name: '問顧乃謙（技術比對室）',
        description: '詢問顧乃謙關於誰能改插件不留粗痕。',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '顧乃謙說：「你問誰能改插件不留粗痕。」\n\n「答案不是技術問題，是授權問題。能在多館部署的層級，有且只有一個職位的帳號可以觸及。」\n\n「高文傑那個層級做得到執行，做不到修改邏輯。」\n\n他停了一下：「能定義插件怎麼跑的人，不需要自己去按每個按鍵。」',
              type: 'character',
              characterId: 'npc_gu_naiqian',
              characterName: '顧乃謙（系統工程）',
              characterExpression: 1,
              characterPosition: 'left',
            },
          },
          { type: 'setFlag', flag: 'ch5_gu_lab_talked', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'talk_asu_ch5_lab',
        name: '問阿蘇（技術比對室）',
        description: '詢問阿蘇關於現有資料能否押人。',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '阿蘇說：「你問我能不能用現在的資料押人。」\n\n「可以提交，但有個問題：你手上的是整理版，整理版沒有失敗登入、沒有遠端節點識別碼、沒有操作前的原始值。」\n\n「提交後，對方律師第一個問的就是：原始檔在哪？你沒有，就只剩一份說法很順、但卡不住追問的報告。」',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（警方技術組）',
              characterExpression: 1,
              characterPosition: 'right',
            },
          },
          { type: 'setFlag', flag: 'ch5_asu_lab_talked', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'inspect_ch5_log_diff',
        name: '查看原始 log 差異比對',
        description: '仔細看整理版與原始版的差異欄位。',
        requirements: [],
        effects: [
          { type: 'addItem', itemId: 'item_log_raw_diff' },
          {
            type: 'showDialog',
            dialog: {
              text: '整理版比原始版少了四類欄位：\n\n操作來源 IP、失敗登入記錄、遠端節點識別碼、覆寫前原始值。\n\n少的這四個欄位，剛好是能說清楚「誰在哪裡做了什麼」的那幾個。\n\n不是技術格式問題，是有人決定哪些東西不需要出現在這份記錄裡。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'ch5_log_diff_viewed', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'inspect_ch5_permission_tree',
        name: '查看插件權限樹結構圖',
        description: '仔細看插件授權結構與各層級對應。',
        requirements: [],
        effects: [
          { type: 'addItem', itemId: 'item_plugin_permission_tree' },
          {
            type: 'showDialog',
            dialog: {
              text: '插件授權結構圖：\n\n最底層：執行（高文傑的層級）\n中間層：配置調整（需主管核准）\n頂層：插件邏輯修改、多館部署授權（需技術長帳號）\n\n高文傑能按下執行，但不能決定執行什麼。\n\n決定插件怎麼跑的人，在頂層。頂層靠近技術長的職位。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'ch5_permission_tree_viewed', value: true },
        ],
        oneTime: true,
      },
    ],
    puzzles: [],
    initialDialog: {
      text: '技術比對室的螢幕常開著，顧乃謙說他已經在這裡待了很久。\n\n「你問可證明，還是可提交？兩件事這個案子裡差距特別大。」',
      type: 'narrator',
    },
  },

  // ──────────────────────────────────────────────
  // 場景三：遠端通話 / 林子睿辦公室外圍
  // ──────────────────────────────────────────────
  scene_ch5_lin_office: {
    id: 'scene_ch5_lin_office',
    chapterId: 'ch5',
    name: '林子睿辦公室外圍',
    description: '林子睿不在辦公室，但他剛剛通過電話說完話。高文傑在走廊另一端，說他來這裡不是為了你以為的那件事。',
    background: '/images/bg_ch5_sc3_v1.webp',
    hotspots: [
      {
        id: 'hotspot_ch5_lin',
        shape: 'rect',
        coords: [0.04, 0.25, 0.28, 0.78],
        description: '林子睿',
        hint: '林子睿剛掛電話，語氣還帶著那種剛說完一件事的平靜。',
      },
      {
        id: 'hotspot_ch5_gao',
        shape: 'rect',
        coords: [0.72, 0.25, 0.9, 0.78],
        description: '高文傑',
        hint: '高文傑站在走廊，表情說他已經準備好被懷疑了。',
      },
      {
        id: 'hotspot_ch5_lin_call',
        shape: 'rect',
        coords: [0.3, 0.08, 0.62, 0.42],
        description: '林子睿通話記錄節錄',
        hint: '技術部門整理的通話記錄節錄，林子睿在三起事故前後的幾通電話。',
      },
      {
        id: 'hotspot_ch5_unknown_style',
        shape: 'rect',
        coords: [0.3, 0.5, 0.62, 0.88],
        description: 'Unknown 訊息語感比對表',
        hint: '阿蘇做的語感比對：Unknown 的訊息措辭 vs 張景衡的公關文件語氣。',
      },
    ],
    npcs: [
      {
        id: 'npc_lin_zirui',
        name: '林子睿（技術長）',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch5_lin_idle_1', text: '林子睿說：「系統複雜，不代表陰謀存在。多半只是管理落後。」', type: 'hint', weight: 1 },
          { id: 'ch5_lin_idle_2', text: '「你現在需要的是收束，不是想像力。」', type: 'hint', weight: 1 },
          { id: 'ch5_lin_idle_3', text: '「把個案說成結構問題，會傷很多無辜的人。」', type: 'hint', weight: 1 },
        ],
        available: true,
      },
      {
        id: 'npc_gao_wenjie',
        name: '高文傑',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch5_gao_idle_1', text: '高文傑說：「我承認我登過。我不承認每一次都是為了你們以為的那件事。」', type: 'hint', weight: 1 },
          { id: 'ch5_gao_idle_2', text: '「你們想要的是一個能背的名字。我剛好夠合適。」', type: 'hint', weight: 1 },
          { id: 'ch5_gao_idle_3', text: '「舊案不是我的通行證，也不是你們的懶惰理由。」', type: 'hint', weight: 1 },
        ],
        available: true,
      },
    ],
    items: [
      items.item_lin_call_transcript,
      items.item_unknown_msg_style,
    ],
    hotspotEventMap: {
      hotspot_ch5_lin: 'talk_lin_ch5',
      hotspot_ch5_gao: 'talk_gao_ch5_casual',
      hotspot_ch5_lin_call: 'inspect_ch5_lin_call',
      hotspot_ch5_unknown_style: 'inspect_ch5_unknown_style',
    },
    events: [
      {
        id: 'talk_lin_ch5',
        name: '問林子睿',
        description: '直接詢問林子睿關於他最怕哪一種公開。',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '林子睿說：「你想問什麼，就直接問。」\n\n你問他最怕哪一種公開。\n\n他停頓了不到一秒：「我不怕公開。我怕的是公開了一半——讓複雜的事情被當成一個人的問題處理。」\n\n「把結構問題說成個案，傷的是無辜的人。你同意嗎？」',
              type: 'character',
              characterId: 'npc_lin_zirui',
              characterName: '林子睿（技術長）',
              characterExpression: 1,
              characterPosition: 'left',
            },
          },
          { type: 'setFlag', flag: 'ch5_lin_talked', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'talk_gao_ch5_casual',
        name: '問高文傑（閒聊）',
        description: '先和高文傑打打招呼，建立初步對話。',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '高文傑說：「你們現在才開始問，已經算慢了。」\n\n「登入很多次，不代表每次都是我。這個版本的系統維護帳號，你們去問陳佑誠，他會告訴你可以怎麼共用。」\n\n他看了一眼辦公室方向：「誰最希望我看起來像答案？你往那個方向想。」',
              type: 'character',
              characterId: 'npc_gao_wenjie',
              characterName: '高文傑',
              characterExpression: 1,
              characterPosition: 'right',
            },
          },
          { type: 'setFlag', flag: 'ch5_gao_casual_talked', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'inspect_ch5_lin_call',
        name: '查看林子睿通話記錄',
        description: '閱讀林子睿在三起事故前後的通話記錄節錄。',
        requirements: [],
        effects: [
          { type: 'addItem', itemId: 'item_lin_call_transcript' },
          {
            type: 'showDialog',
            dialog: {
              text: '三起事故前後的通話，林子睿說話的模式是固定的：\n\n風險被說成「可管理」，事故被歸類為「個案」，每次都問「影響多大」，很少問「下次怎麼避免」。\n\n「系統複雜，不代表陰謀存在。多半只是管理落後。」——這句話在三起事故後各說過一次。\n\n同一句話說三次，不代表他說謊，但代表這是一個他很熟悉的框架。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'ch5_lin_call_viewed', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'inspect_ch5_unknown_style',
        name: '查看 Unknown 訊息語感比對',
        description: '閱讀阿蘇整理的語感比對表。',
        requirements: [],
        effects: [
          { type: 'addItem', itemId: 'item_unknown_msg_style' },
          {
            type: 'showDialog',
            dialog: {
              text: 'Unknown 訊息 vs 張景衡公關文件，共同特徵：\n\n主動句被動化、責任主語消失、用「個案」取代「結構問題」、動詞選「處理中」不用「未解決」。\n\n再往上追：這種說話框架的來源，是一個習慣「定義風險怎麼被說」的人。\n\n林子睿不一定自己寫了這些文字，但有人把林子睿習慣的框架，翻成了能對外發布的格式。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'ch5_unknown_msg_viewed', value: true },
        ],
        oneTime: true,
      },
    ],
    puzzles: [],
    initialDialog: {
      text: '林子睿辦公室外圍的走廊比裡面安靜。\n\n高文傑站在一個剛好讓人能看到他、卻不容易直接走過去的位置。',
      type: 'narrator',
    },
  },
};

// ──────────────────────────────────────────────
// 第五章 NPC 對話樹
// ──────────────────────────────────────────────
const npcDialogs: Record<string, Record<string, NpcDialogNode>> = {

  // ──────────────────────────────────────────────
  // 高文傑 敏感對話（ch5 核心 NPC）
  // ──────────────────────────────────────────────
  npc_gao_wenjie: {
    // 敏感 branch 1：追問「你登入那幾次，真的是為了什麼？」
    node_gao_sensitive1_1: {
      id: 'node_gao_sensitive1_1',
      npcId: 'npc_gao_wenjie',
      text:
        '高文傑說：「你問我那幾次登入是為了什麼。」\n\n「維護作業。系統備份排程。有兩次是因為有人用我帳號登入之後出了問題，我被通知去確認。」\n\n「我知道你的下一個問題：為什麼是你的帳號？因為系統維護帳號可以共用，這個你去問陳佑誠。」',
      choices: [
        {
          id: 'gao_s1_q1',
          label: '誰用你的帳號登入、你知道嗎？',
          effects: [{ type: 'setFlag', flag: 'ch5_gao_s1_q1', value: true }],
          insightEffects: [{ target: 'human_insight', delta: 1 }],
        },
        {
          id: 'gao_s1_q2',
          label: '你說你被通知去確認——你確認到什麼？',
          effects: [{ type: 'setFlag', flag: 'ch5_gao_s1_q2', value: true }],
          insightEffects: [{ target: 'evidence_insight', delta: 1 }],
        },
      ],
      next: (state: GameState): string | null => {
        if (state.flags.ch5_gao_s1_q1) return 'node_gao_s1_reply_q1';
        return 'node_gao_s1_reply_q2';
      },
    },
    node_gao_s1_reply_q1: {
      id: 'node_gao_s1_reply_q1',
      npcId: 'npc_gao_wenjie',
      text:
        '「我猜到一個，但猜到不等於確定。你要我直接說名字，我說不了，因為我沒有證據。」\n\n「如果你想確定，去找共用帳號的登入來源記錄。問題是，我聽說那個欄位在整理版裡面沒有。」\n\n他停了一下：「所以你看到的那份記錄，可能就是為了讓你看到我，而不是讓你找到那個人。」',
      choices: [
        {
          id: 'gao_s1_end',
          label: '（結束對話）',
          effects: [
            { type: 'setFlag', flag: 'npc_gao_sensitive_done', value: true },
          ],
        },
      ],
    },
    node_gao_s1_reply_q2: {
      id: 'node_gao_s1_reply_q2',
      npcId: 'npc_gao_wenjie',
      text:
        '「確認到什麼？」他重複了這句話。\n\n「確認到系統有一組操作指令在我不知情的情況下被執行了，操作來源的欄位是空的——或者說，在我看到的那份記錄裡是空的。」\n\n「我回報了。格式對，優先級對。你猜後來怎樣？」',
      choices: [
        {
          id: 'gao_s1_end',
          label: '（結束對話）',
          effects: [
            { type: 'setFlag', flag: 'npc_gao_sensitive_done', value: true },
          ],
        },
      ],
    },

    // 敏感 branch 2：追問「林子睿——你怎麼看他？」
    node_gao_sensitive2_1: {
      id: 'node_gao_sensitive2_1',
      npcId: 'npc_gao_wenjie',
      text:
        '高文傑說：「你問我林子睿。」\n\n「我只見過他幾次，技術會議裡。他說話很穩，穩到我每次都覺得他早就知道會議會怎麼結束。」\n\n「我說不上他是好人還是壞人，我只知道——在插件部署的那個層級，沒有他點頭，什麼都動不了。」',
      choices: [
        {
          id: 'gao_s2_q1',
          label: '他知道漏洞的存在嗎？',
          effects: [{ type: 'setFlag', flag: 'ch5_gao_s2_q1', value: true }],
          insightEffects: [{ target: 'procedure_insight', delta: 1 }],
        },
        {
          id: 'gao_s2_q2',
          label: '誰最希望你看起來像答案？',
          effects: [{ type: 'setFlag', flag: 'ch5_gao_s2_q2', value: true }],
          insightEffects: [{ target: 'human_insight', delta: 2 }],
        },
      ],
      next: (state: GameState): string | null => {
        if (state.flags.ch5_gao_s2_q1) return 'node_gao_s2_reply_q1';
        return 'node_gao_s2_reply_q2';
      },
    },
    node_gao_s2_reply_q1: {
      id: 'node_gao_s2_reply_q1',
      npcId: 'npc_gao_wenjie',
      text:
        '「他知不知道漏洞？以他在那個職位待了幾年，不知道說不過去。」\n\n「問題不是知不知道，是知道之後做了什麼——或者說，沒做什麼。」\n\n「陳佑誠的那三份回報單，最後一關在哪裡停下來的？你去查那個，比查我的登入記錄有用。」',
      choices: [
        {
          id: 'gao_s2_end',
          label: '（結束對話）',
          effects: [
            { type: 'setFlag', flag: 'npc_gao_sensitive_done', value: true },
          ],
        },
      ],
    },
    node_gao_s2_reply_q2: {
      id: 'node_gao_s2_reply_q2',
      npcId: 'npc_gao_wenjie',
      text:
        '高文傑沉默了一秒。\n\n「誰最希望我看起來像答案？」他說。「需要一個能背這件事的名字的人。」\n\n「我有登入紀錄、有舊案背景、有技術能力——這三件事加在一起，對需要結案的人來說非常方便。」\n\n「你們現在才開始問，已經算慢了。不過，你問了這個問題，說明你還沒有只要方便。」',
      choices: [
        {
          id: 'gao_s2_end',
          label: '（結束對話）',
          effects: [
            { type: 'setFlag', flag: 'npc_gao_sensitive_done', value: true },
          ],
        },
      ],
    },
  },
};

export { scenes, items, npcDialogs };
