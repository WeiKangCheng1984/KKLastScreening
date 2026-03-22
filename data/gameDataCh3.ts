import { Scene, Item, NpcDialogNode, GameState } from '@/types/game';

// ──────────────────────────────────────────────
// 第三章 道具
// ──────────────────────────────────────────────
const items: Record<string, Item> = {
  // 場景一：封鎖大廳前台
  item_whiteboard_rewrite: {
    id: 'item_whiteboard_rewrite',
    name: '交接白板（重寫的筆跡）',
    description:
      '交接白板上有一處被重寫的筆劃——字體比周圍的字更新，墨水比較深。\n\n與第一章紅筆塗改做比對：同樣的書寫習慣，先劃掉再補字，下筆的角度幾乎一致。\n\n周姊說，白板擦過兩次。第一次是為了改，第二次是為了讓它看起來像沒改過。',
    svgImage: '/svg/items/whiteboard_rewrite.svg',
    svgSize: 'medium',
    collectible: true,
  },
  item_promo_wall_text: {
    id: 'item_promo_wall_text',
    name: '宣傳牆文案（口徑矛盾）',
    description:
      '宣傳牆上的文案寫著：「城市影城全系列場館支援分區控制與自動排程，打造最佳觀影體驗。」\n\n但現場口徑是「只開了節能模式，沒有做任何自動控制。」\n\n「可分區」和「可自動」——這兩個功能如果都有，那第一章的「延後亮燈」就不只是疏失，而是有人知道怎麼用這個系統。',
    svgImage: '/svg/items/promo_wall_text.svg',
    svgSize: 'medium',
    collectible: true,
  },
  item_scene_control_sheet: {
    id: 'item_scene_control_sheet',
    name: '前台場控簡表（過期版本）',
    description:
      '前台抽屜裡有一份過期的場控手冊，附著一張臨時簡表。\n\n簡表的第三頁有一個被手寫補注的功能頁：「C4：散場延後照明申請——適用條件：觀眾投訴、特殊活動、VIP場次。」\n\n這一頁原本不在正式版本裡。是誰加進來的？加的時間，比第一章的案發時間還早了三個月。',
    svgImage: '/svg/items/scene_control_sheet.svg',
    svgSize: 'medium',
    collectible: true,
  },

  // 場景二：臨時會議室 / 品牌應對室
  item_filtered_log: {
    id: 'item_filtered_log',
    name: '張景衡整理版 log',
    description:
      '張景衡提供的 log 報告，版面乾淨，每一欄都有清楚說明。\n\n「操作員：高文傑。時間：22:57。操作類型：手動覆寫。結果：照明模式切換。」\n\n這份報告讀起來非常清楚——清楚到顧乃謙看了一眼就說：「原始檔不長這樣。」\n\n問題不在這份 log 寫了什麼，而在它少說了什麼。',
    svgImage: '/svg/items/filtered_log.svg',
    svgSize: 'medium',
    collectible: true,
  },
  item_press_draft: {
    id: 'item_press_draft',
    name: '記者應對話術草稿',
    description:
      '一張 A4 草稿，字跡工整，像是背稿用的：\n\n「—— 如媒體詢問：請一律使用『個別失誤』，不使用『系統問題』。\n—— 如追問三館：回答『尚在釐清關聯性』，不主動提及聯繫。\n—— 禁用語：三起事故、跨館、系統性風險。」\n\n最下方有一行潦草的補注：「告訴記者，這是局部異常，無系統性風險。」\n\n這不是防禦媒體，這是在防止真相被串起來。',
    svgImage: '/svg/items/press_draft.svg',
    svgSize: 'medium',
    collectible: true,
  },
  item_brand_monitor_report: {
    id: 'item_brand_monitor_report',
    name: '宋雅甄品牌監測報表',
    description:
      '品牌監測報表的標題是「輿情分析—城市影城 W-R 事件關聯度」。\n\n報表裡有一欄被手工圈起來，旁邊寫著：「三館同日出現在搜尋趨勢，需降低關聯性。」\n\n宋雅甄在意的不是死者是誰，是「三館」這個詞能不能同時出現在新聞裡。\n\n她的邏輯是：一間影城出事是事故，三間一起被聯想，就是品牌問題。',
    svgImage: '/svg/items/brand_monitor_report.svg',
    svgSize: 'medium',
    collectible: true,
  },

  // 場景三：機房外走道 / 系統接點區
  item_cross_venue_sync: {
    id: 'item_cross_venue_sync',
    name: '跨館同步異常片段',
    description:
      '顧乃謙列印出一段系統記錄，在上面用紅筆圈了三個時間點。\n\n「城市 W」和「光芒 R」在三個不同日期，各自出現了同樣的插件版本更新記錄——時間差在 15 分鐘以內。\n\n「跨館同步不是故障，那比較像……有人知道哪裡會一起響。」\n\n這不是系統自動同步。同版本、不同館、幾乎同時更新——背後要嘛是同一個操作入口，要嘛是同一個人。',
    svgImage: '/svg/items/cross_venue_sync.svg',
    svgSize: 'medium',
    collectible: true,
  },
  item_network_device_label: {
    id: 'item_network_device_label',
    name: '網路設備標籤與館別代號對照',
    description:
      '機房走道的設備架上貼著標籤，旁邊有一份手寫的館別代號對照表：\n\n「W-01：城市影城（本館）\nR-02：光芒影城（遠端）\nM-03：明星影城（遠端）」\n\nW 和 R 的設備在同一個子網段。這不是預設的標準配置——有人在設定網路時，特意讓兩館可以直接溝通。',
    svgImage: '/svg/items/network_device_label.svg',
    svgSize: 'medium',
    collectible: true,
  },
  item_remote_login_sheet: {
    id: 'item_remote_login_sheet',
    name: '遠端登入維護單',
    description:
      '一份維護單，記錄了遠端登入的申請與審核流程。\n\n最後一筆記錄日期：三週前。操作人：顧乃謙。說明：「插件版本序列比對——W、R 同步確認。」\n\n這筆記錄是顧乃謙親自做的。他知道這兩館的版本是同步的，早在案發之前就知道。\n\n他在等什麼？還是他一直在看著什麼？',
    svgImage: '/svg/items/remote_login_sheet.svg',
    svgSize: 'medium',
    collectible: true,
  },
};

// ──────────────────────────────────────────────
// 第三章 場景
// ──────────────────────────────────────────────
const scenes: Record<string, Scene> = {

  // ──────────────────────────────────────────────
  // 場景一：封鎖大廳前台
  // ──────────────────────────────────────────────
  scene_ch3_lobby_front: {
    id: 'scene_ch3_lobby_front',
    chapterId: 'ch3',
    name: '封鎖大廳前台',
    description: '城市影城的大廳被封鎖了，前台空無一人，只剩下幾個等著發言的人。劉隊站在角落，林瑞堂看起來快被領帶勒死。',
    background: '/images/bg_ch3_sc1_v1.webp',
    hotspots: [
      {
        id: 'hotspot_lobby_whiteboard',
        shape: 'circle',
        coords: [0.6, 0.275, 0.175],
        description: '交接白板',
        hint: '交接白板上有幾行字，仔細看有一處筆跡比較新。',
      },
      {
        id: 'hotspot_lobby_promo_wall',
        shape: 'circle',
        coords: [0.785, 0.225, 0.175],
        description: '宣傳牆文案',
        hint: '牆上的宣傳文案寫著「可分區、可自動」，但現場說法是「只有節能」。',
      },
      {
        id: 'hotspot_lobby_front_drawer',
        shape: 'circle',
        coords: [0.6, 0.675, 0.125],
        description: '前台抽屜',
        hint: '前台的抽屜沒有鎖上，裡面有一些文件。',
      },
      {
        id: 'hotspot_fun_ch3_lobby_barrier',
        shape: 'circle',
        coords: [0.08, 0.42, 0.065],
        description: '封鎖線',
        hint: '黃黑膠帶拉得筆直，像在幫大廳打領帶。',
      },
      {
        id: 'hotspot_fun_ch3_lobby_ceiling',
        shape: 'circle',
        coords: [0.5, 0.09, 0.07],
        description: '天花板燈帶',
        hint: '亮到你有點想戴墨鏡辦案。',
      },
      {
        id: 'hotspot_fun_ch3_lobby_floor',
        shape: 'circle',
        coords: [0.32, 0.93, 0.075],
        description: '拋光地板',
        hint: '地板亮得能當鏡子用，幸好沒人要求你對口型。',
      },
      {
        id: 'hotspot_fun_ch3_lobby_plant',
        shape: 'circle',
        coords: [0.92, 0.52, 0.065],
        description: '裝飾植栽',
        hint: '假樹葉在燈下閃得像剛上完蠟。',
      },
      {
        id: 'hotspot_fun_ch3_lobby_counter_bell',
        shape: 'circle',
        coords: [0.42, 0.58, 0.07],
        description: '櫃台按鈴',
        hint: '小小的服務鈴，按下去大概會召喚「公關危機」。',
      },
    ],
    npcs: [
      {
        id: 'npc_liu',
        name: '劉隊（偵查隊）',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch3_liu_idle_1', text: '「裡面的人先談一輪，回來跟我講你聽到啥。」', type: 'hint', weight: 1 },
          { id: 'ch3_liu_idle_2', text: '劉隊掃一眼大廳：「品牌那邊講話你聽就懂，總是在擋什麼。」', type: 'hint', weight: 1 },
          { id: 'ch3_liu_casual_1', text: '劉隊揉眉心：「我今晚咖啡喝太多，耳朵還在。」', type: 'casual', weight: 2 },
          { id: 'ch3_liu_casual_2', text: '「你盡量別被他們帶去『情緒穩定』那套，穩定有時候只是關音量。」', type: 'casual', weight: 2 },
          { id: 'ch3_liu_casual_3', text: '他抬下巴示意走廊：「顧乃謙那邊，嘴欠但手上有料。」', type: 'hint', weight: 2 },
          { id: 'ch3_liu_casual_4', text: '「記著：我們要的是紀錄怎麼被捏，不是誰比較會道歉。」', type: 'casual', weight: 1 },
        ],
        available: true,
      },
      {
        id: 'npc_lin_ruitang',
        name: '林瑞堂（城市影城副理）',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch3_lin_idle_1', text: '林瑞堂手在發抖還硬擠笑：「你問、你問……我能講的就這些了，真的。」', type: 'hint', weight: 1 },
          { id: 'ch3_lin_idle_2', text: '「總部人一到，我就變窗口了啦，你懂我意思……決定都不是我下的。」', type: 'hint', weight: 1 },
          { id: 'ch3_lin_casual_1', text: '他偷偷拉領鬆一點：「我這條領帶今晚勒死我三次了。」', type: 'casual', weight: 2 },
          { id: 'ch3_lin_casual_2', text: '「前台我真的有照表啦……表誰改的不要問我。」', type: 'casual', weight: 2 },
          { id: 'ch3_lin_casual_3', text: '「你如果要名字，我給你職稱；你如果要職稱，我給你信箱。」', type: 'casual', weight: 1 },
          { id: 'ch3_lin_casual_4', text: '林瑞堂小聲：「我現在最怕兩個字：同步。」', type: 'hint', weight: 2 },
        ],
        available: true,
      },
      {
        id: 'npc_ashun',
        name: '阿順（巡場保全）',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch3_ashun_lobby_idle_1', text: '「熟的臉今晚全裝不熟，我看了都想笑。」', type: 'hint', weight: 1 },
          { id: 'ch3_ashun_lobby_idle_2', text: '「大廳越亮我越毛，有人在對稿啦，不是聊天。」', type: 'hint', weight: 1 },
          { id: 'ch3_ashun_lobby_casual_1', text: '阿順聳肩：「我今晚步數破表，都在躲鏡頭。」', type: 'casual', weight: 2 },
          { id: 'ch3_ashun_lobby_casual_2', text: '「保全最懂：哪扇門會自己開、哪台機器會自己乖。」', type: 'casual', weight: 2 },
          { id: 'ch3_ashun_lobby_casual_3', text: '他壓低聲：「你要聽實話，去暗一點的地方。」', type: 'hint', weight: 2 },
          { id: 'ch3_ashun_lobby_casual_4', text: '「我沒念過書，但我認得『心虛走路』。」', type: 'casual', weight: 1 },
        ],
        available: true,
      },
      {
        id: 'npc_zhou_jie',
        name: '周姊（清潔）',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch3_zhou_idle_1', text: '周姊頭也不抬：「字不會跟你演戲啦，人才會。」', type: 'hint', weight: 1 },
          { id: 'ch3_zhou_idle_2', text: '「我清潔的啦，誰急著擦白板、擦兩次，我看得出來，不用你教。」', type: 'hint', weight: 1 },
          { id: 'ch3_zhou_casual_1', text: '「拖把不會說謊，水桶也不會。」', type: 'casual', weight: 2 },
          { id: 'ch3_zhou_casual_2', text: '周姊嘖一聲：「今晚香氛噴太多，我鼻子先投降。」', type: 'casual', weight: 2 },
          { id: 'ch3_zhou_casual_3', text: '「你們講版本、講權限，我講灰塵跟橡皮擦屑。」', type: 'casual', weight: 1 },
          { id: 'ch3_zhou_casual_4', text: '她小聲：「急的人手會快，快的人痕跡會新。」', type: 'hint', weight: 2 },
        ],
        available: true,
      },
    ],
    items: [
      items.item_whiteboard_rewrite,
      items.item_promo_wall_text,
      items.item_scene_control_sheet,
    ],
    hotspotEventMap: {
      hotspot_lobby_whiteboard: 'inspect_ch3_whiteboard',
      hotspot_lobby_promo_wall: 'inspect_ch3_promo_wall',
      hotspot_lobby_front_drawer: 'inspect_ch3_front_drawer',
      hotspot_fun_ch3_lobby_barrier: 'fun_ch3_lobby_barrier',
      hotspot_fun_ch3_lobby_ceiling: 'fun_ch3_lobby_ceiling',
      hotspot_fun_ch3_lobby_floor: 'fun_ch3_lobby_floor',
      hotspot_fun_ch3_lobby_plant: 'fun_ch3_lobby_plant',
      hotspot_fun_ch3_lobby_counter_bell: 'fun_ch3_lobby_counter_bell',
    },
    events: [
      {
        id: 'talk_liu_ch3_task',
        name: '與劉隊說話',
        description: '與劉隊確認第三章任務。',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '劉隊壓著嗓門：「品牌的人到了，話都先講漂亮。顧乃謙也在，那人嘴臭，但講的是真的。」\n\n「我要的不是誰動手，是誰動紀錄、動幾次、動完怎麼裝沒事。」\n\n「順序：大廳先摸——白板、牆上字、抽屜。再進去聽他們對外怎麼講。最後找顧乃謙，機房有東西給你對。」',
              type: 'character',
              characterId: 'npc_liu',
              characterName: '劉隊（偵查隊）',
              characterExpression: 1,
              characterPosition: 'right',
            },
          },
          { type: 'setFlag', flag: 'ch3_task_from_liu', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'inspect_ch3_whiteboard',
        name: '查看交接白板',
        description: '仔細觀察白板上的筆跡。',
        requirements: [],
        effects: [
          { type: 'addItem', itemId: 'item_whiteboard_rewrite' },
          {
            type: 'showDialog',
            dialog: {
              text: '白板上一塊字重寫過，墨比旁邊深，下筆角度跟第一章紅筆塗改幾乎同一隻手。\n\n周姊說：擦兩次啦，第一次要改字，第二次要讓你看不出有改過。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'ch3_whiteboard_viewed', value: true },
          { type: 'setFlag', flag: 'ch3_milestone_whiteboard', value: true },
          { type: 'triggerEvent', eventId: 'ch3_check_report_ready' },
        ],
        oneTime: true,
      },
      {
        id: 'inspect_ch3_promo_wall',
        name: '查看宣傳牆文案',
        description: '閱讀牆上的宣傳文案。',
        requirements: [],
        effects: [
          { type: 'addItem', itemId: 'item_promo_wall_text' },
          {
            type: 'showDialog',
            dialog: {
              text: '牆上寫可分區、可自動排程，嘴裡講只開節能，兩套話撞在一起。\n\n要是自動是真的，這種延後亮燈，就不像「不小心」而已。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'ch3_promo_wall_viewed', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'inspect_ch3_front_drawer',
        name: '查看前台抽屜',
        description: '翻看前台抽屜裡的文件。',
        requirements: [],
        effects: [
          { type: 'addItem', itemId: 'item_scene_control_sheet' },
          {
            type: 'showDialog',
            dialog: {
              text: '過期手冊裡夾一張手寫簡表，第三頁多一條：C4 散場延後照明申請。\n\n正式版根本沒這頁，補上去的時間還比案發早三個月。\n\n誰先知道會用到這招？',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'ch3_front_drawer_viewed', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'talk_lin_ch3',
        name: '問林瑞堂',
        description: '詢問城市影城副理林瑞堂。',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '林瑞堂嚥一口口水：「總部在，我很多話……不能亂講，你體諒。」\n\n「前台我都有照表做啦，log、後台那種，你找技術，不要找我，我講錯會害現場同事。」\n\n「我管場館而已，系統誰碰的，我真的不知道。」',
              type: 'character',
              characterId: 'npc_lin_ruitang',
              characterName: '林瑞堂（城市影城副理）',
              characterExpression: 1,
              characterPosition: 'right',
            },
          },
          { type: 'setFlag', flag: 'ch3_lin_talked', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'talk_ashun_ch3_lobby',
        name: '問阿順（大廳）',
        description: '詢問巡場保全阿順。',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '阿順瞄天花板：「燈開這麼亮，講的話反而黑。」\n\n「那種人不是第一次來啦，來太多次才知道哪段鏡頭在摸魚。」\n\n「熟門熟路才曉得啥時候消失不會被看到。」',
              type: 'character',
              characterId: 'npc_ashun',
              characterName: '阿順（巡場保全）',
              characterExpression: 1,
              characterPosition: 'right',
            },
          },
          { type: 'setFlag', flag: 'ch3_ashun_lobby_talked', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'talk_zhou_jie_ch3',
        name: '問周姊',
        description: '詢問清潔人員周姊。',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '周姊手沒停：「白板擦兩次啦，第一次改字，第二次讓你看不出有改。」\n\n「字新、灰舊，騙不了人的。」\n\n她嘆氣：「我清潔的，字跡灰塵鞋印，比看臉準啦。」',
              type: 'character',
              characterId: 'npc_zhou_jie',
              characterName: '周姊（清潔）',
              characterExpression: 1,
              characterPosition: 'right',
            },
          },
          { type: 'setFlag', flag: 'ch3_zhou_jie_talked', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'fun_ch3_lobby_barrier',
        name: '封鎖線',
        description: '無劇情綁定',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_ch3_lobby_barrier' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: 'KK 小聲：「封得越整齊，心裡越慌。這種線不是給犯人看的，是給鏡頭看的。」',
              type: 'narrator',
            },
          },
        ],
        oneTime: false,
      },
      {
        id: 'fun_ch3_lobby_ceiling',
        name: '天花板燈帶',
        description: '無劇情綁定',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_ch3_lobby_ceiling' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '你抬頭被燈洗了一臉。劉隊要是問你在幹嘛，你就說在檢查「照明是否過度配合敘事」。',
              type: 'narrator',
            },
          },
        ],
        oneTime: false,
      },
      {
        id: 'fun_ch3_lobby_floor',
        name: '拋光地板',
        description: '無劇情綁定',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_ch3_lobby_floor' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '地板亮得像剛打完蠟。你決定不跳一段舞——專業偵探的尊嚴還是要顧。',
              type: 'narrator',
            },
          },
        ],
        oneTime: false,
      },
      {
        id: 'fun_ch3_lobby_plant',
        name: '裝飾植栽',
        description: '無劇情綁定',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_ch3_lobby_plant' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '假樹在真危機旁邊特別盡責：永遠綠、永遠不說話。你有點羨慕。',
              type: 'narrator',
            },
          },
        ],
        oneTime: false,
      },
      {
        id: 'fun_ch3_lobby_counter_bell',
        name: '櫃台服務鈴',
        description: '無劇情綁定',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_ch3_lobby_counter_bell' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '你手指懸在鈴上三秒，想像「叮」一聲之後會不會有人端出咖啡——沒有，只有公關味。',
              type: 'narrator',
            },
          },
        ],
        oneTime: false,
      },
      {
        id: 'ch3_check_report_ready',
        name: '檢查是否可向劉隊報告',
        description: '第三章里程碑達成後，解鎖向劉隊報告入口。',
        requirements: [
          { type: 'hasFlag', flag: 'ch3_milestone_whiteboard', value: true },
          { type: 'hasFlag', flag: 'ch3_milestone_brand_script', value: true },
          { type: 'hasFlag', flag: 'ch3_milestone_cross_venue', value: true },
        ],
        effects: [{ type: 'setFlag', flag: 'ch3_liu_report_ready', value: true }],
        oneTime: true,
      },
    ],
    puzzles: [],
    initialDialog: {
      text: '大廳拉線封了，宣傳牆燈還全開，亮得像要拍廣告。\n\n劉隊講一句：這種地方，話比燈還黑。',
      type: 'narrator',
    },
  },

  // ──────────────────────────────────────────────
  // 場景二：臨時會議室 / 品牌應對室
  // ──────────────────────────────────────────────
  scene_ch3_brand_room: {
    id: 'scene_ch3_brand_room',
    chapterId: 'ch3',
    name: '臨時會議室',
    description: '品牌方把這間小會議室當成應對中心。宋雅甄坐在主位，張景衡在側邊整理文件，顧乃謙坐在角落，視線落在桌面上的那本電腦。',
    background: '/images/bg_ch3_sc2_v1.webp',
    hotspots: [
      {
        id: 'hotspot_brand_filtered_log',
        shape: 'circle',
        coords: [0.455, 0.82, 0.1],
        description: '張景衡的整理版 log',
        hint: '桌上放著一份列印好的 log 報告，每一欄都有清楚說明，讀起來非常順。',
      },
      {
        id: 'hotspot_brand_press_draft',
        shape: 'circle',
        coords: [0.175, 0.875, 0.095],
        description: '記者應對話術草稿',
        hint: '宋雅甄旁邊放著一張手寫的 A4 草稿，字跡工整像是背稿用的。',
      },
      {
        id: 'hotspot_brand_monitor_report',
        shape: 'circle',
        coords: [0.875, 0.725, 0.095],
        description: '品牌監測報表',
        hint: '一份輿情報告，標題是「三館關聯度分析」，有一欄被手工圈起來。',
      },
      {
        id: 'hotspot_fun_ch3_brand_diffuser',
        shape: 'circle',
        coords: [0.08, 0.22, 0.065],
        description: '香氛機',
        hint: '牆角小小一台，味道像在假裝這裡有窗。',
      },
      {
        id: 'hotspot_fun_ch3_brand_power_strip',
        shape: 'circle',
        coords: [0.58, 0.2, 0.07],
        description: '延長線',
        hint: '一坨線在桌腳纏成哲學題：誰先插誰。',
      },
      {
        id: 'hotspot_fun_ch3_brand_water',
        shape: 'circle',
        coords: [0.72, 0.72, 0.065],
        description: '瓶裝水',
        hint: '標籤寫「會議專用」，你懷疑它從來沒被喝完過。',
      },
      {
        id: 'hotspot_fun_ch3_brand_clock',
        shape: 'circle',
        coords: [0.93, 0.18, 0.06],
        description: '壁鐘',
        hint: '秒針走得很努力，像在幫大家算還能拖多久。',
      },
      {
        id: 'hotspot_fun_ch3_brand_chair',
        shape: 'circle',
        coords: [0.3, 0.38, 0.075],
        description: '空椅',
        hint: '椅面還溫，剛剛一定有人用「我去洗手間」當逃生口。',
      },
    ],
    npcs: [
      {
        id: 'npc_song_yazhen',
        name: '宋雅甄（品牌長）',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch3_song_idle_1', text: '宋雅甄笑笑的：「我沒擋你啦，只是你先想清楚怎麼講，大家才好做事。」', type: 'hint', weight: 1 },
          { id: 'ch3_song_idle_2', text: '「現在要穩啦，穩下來再談真相，比較不會炸。」', type: 'hint', weight: 1 },
          { id: 'ch3_song_casual_1', text: '她理一下袖口：「我講話慢，是因為快的人容易講錯。」', type: 'casual', weight: 2 },
          { id: 'ch3_song_casual_2', text: '「你當我在擋你，其實我在擋明天。」', type: 'casual', weight: 2 },
          { id: 'ch3_song_casual_3', text: '宋雅甄眨眼：「咖啡要嗎？不加糖，今晚夠甜了。」', type: 'casual', weight: 1 },
          { id: 'ch3_song_casual_4', text: '「關鍵字我們都懂，只是不能同時出現。」', type: 'hint', weight: 2 },
        ],
        available: true,
      },
      {
        id: 'npc_zhang_jingheng',
        name: '張景衡（品牌特助）',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch3_zhang_idle_1', text: '張景衡揚揚紙：「這份你讀得懂，原始那包……你確定今晚要開？」', type: 'hint', weight: 1 },
          { id: 'ch3_zhang_idle_2', text: '「長官要的是講得出口的版本，不是讓全局睡不著的版本。」', type: 'hint', weight: 1 },
          { id: 'ch3_zhang_casual_1', text: '他把夾子敲敲桌角：「整齊是美德，過齊是警訊。」', type: 'casual', weight: 2 },
          { id: 'ch3_zhang_casual_2', text: '「我這行靠排版吃飯，不是靠自己相信。」', type: 'casual', weight: 2 },
          { id: 'ch3_zhang_casual_3', text: '張景衡苦笑：「你愈聰明，我愈怕你把大家都拖下水。」', type: 'hint', weight: 2 },
          { id: 'ch3_zhang_casual_4', text: '「你要母帶？可以啊，先問誰敢簽收。」', type: 'casual', weight: 1 },
        ],
        available: true,
      },
      {
        id: 'npc_gu_naiqian',
        name: '顧乃謙（系統工程）',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch3_gu_brand_idle_1', text: '顧乃謙盯著筆電：「要看真的，機房。這裡只有給外人看的。」', type: 'hint', weight: 1 },
          { id: 'ch3_gu_brand_idle_2', text: '「整理版能讀，就這樣。全不全，你自己想。」', type: 'hint', weight: 1 },
          { id: 'ch3_gu_brand_casual_1', text: '「這房間味道很好聞，聞久了會以為問題也被聞掉了。」', type: 'casual', weight: 2 },
          { id: 'ch3_gu_brand_casual_2', text: '他敲鍵盤兩下：「我沒情緒，我只有 log。」', type: 'casual', weight: 2 },
          { id: 'ch3_gu_brand_casual_3', text: '「你問我信不信他們？我信機櫃比較老實。」', type: 'casual', weight: 1 },
          { id: 'ch3_gu_brand_casual_4', text: '顧乃謙淡淡：「少兩欄，故事就會剛好。」', type: 'hint', weight: 2 },
        ],
        available: true,
      },
    ],
    items: [
      items.item_filtered_log,
      items.item_press_draft,
      items.item_brand_monitor_report,
    ],
    hotspotEventMap: {
      hotspot_brand_filtered_log: 'inspect_ch3_filtered_log',
      hotspot_brand_press_draft: 'inspect_ch3_press_draft',
      hotspot_brand_monitor_report: 'inspect_ch3_monitor_report',
      hotspot_fun_ch3_brand_diffuser: 'fun_ch3_brand_diffuser',
      hotspot_fun_ch3_brand_power_strip: 'fun_ch3_brand_power_strip',
      hotspot_fun_ch3_brand_water: 'fun_ch3_brand_water',
      hotspot_fun_ch3_brand_clock: 'fun_ch3_brand_clock',
      hotspot_fun_ch3_brand_chair: 'fun_ch3_brand_chair',
    },
    events: [
      {
        id: 'talk_song_ch3',
        name: '問宋雅甄',
        description: '詢問品牌長宋雅甄。',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '宋雅甄語氣軟軟的：「現在要先穩住啦，真相端太快，全桌翻掉。」\n\n「一間出事叫事故，三間名字排一起，股東就會問你是不是整組壞掉。」\n\n「我沒不給你查，你查得像大人一點——別一句話害明天全館沒班。」\n\n「你要你的真，我要門還開得下去。」',
              type: 'character',
              characterId: 'npc_song_yazhen',
              characterName: '宋雅甄（品牌長）',
              characterExpression: 1,
              characterPosition: 'right',
            },
          },
          { type: 'setFlag', flag: 'ch3_song_talked', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'talk_zhang_ch3',
        name: '問張景衡',
        description: '詢問品牌特助張景衡。',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '張景衡把紙推過來：「我幫你排好了，你省時間。」\n\n「原始不是不能看，看了……也不一定比較有用，還比較吵。」\n\n「警方要的是講得清楚，不是講得嚇人。」\n\n他聳肩：「先出去那版，通常就變成『大家以為的事實』啦。」',
              type: 'character',
              characterId: 'npc_zhang_jingheng',
              characterName: '張景衡（品牌特助）',
              characterExpression: 1,
              characterPosition: 'right',
            },
          },
          { type: 'setFlag', flag: 'ch3_zhang_talked', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'talk_gu_brand_ch3',
        name: '問顧乃謙（會議室）',
        description: '詢問系統工程師顧乃謙，他坐在會議室角落。',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '顧乃謙沒抬頭：「我只看到機器寫了啥，看不到誰嘴硬。」\n\n「要整理版，今天就能簽一簽結掉。要原始檔，今晚手機會響一整夜。」\n\n「機房有東西。這邊看完再來。」\n\n「別一來就問我是誰。先問缺哪一欄。」',
              type: 'character',
              characterId: 'npc_gu_naiqian',
              characterName: '顧乃謙（系統工程）',
              characterExpression: 1,
              characterPosition: 'right',
            },
          },
          { type: 'setFlag', flag: 'ch3_gu_brand_talked', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'inspect_ch3_filtered_log',
        name: '查看整理版 log',
        description: '閱讀張景衡提供的 log 報告。',
        requirements: [],
        effects: [
          { type: 'addItem', itemId: 'item_filtered_log' },
          {
            type: 'showDialog',
            dialog: {
              text: '紙上寫：高文傑、22:57、手動覆寫——一排排好漂亮。\n\n顧乃謙只扔一句：真的不是長這樣。\n\n可怕的不是寫了啥，是沒寫啥。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'ch3_filtered_log_viewed', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'inspect_ch3_press_draft',
        name: '查看記者應對話術草稿',
        description: '閱讀宋雅甄的媒體應對草稿。',
        requirements: [],
        effects: [
          { type: 'addItem', itemId: 'item_press_draft' },
          {
            type: 'showDialog',
            dialog: {
              text: '草稿列禁用語：三起、跨館、系統性風險。\n\n記者追三館？回「還在釐清」，不要自己串。\n\n這不是防記者，是防三案被講成同一句。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'ch3_press_draft_viewed', value: true },
          { type: 'setFlag', flag: 'ch3_milestone_brand_script', value: true },
          { type: 'triggerEvent', eventId: 'ch3_check_report_ready' },
        ],
        oneTime: true,
      },
      {
        id: 'inspect_ch3_monitor_report',
        name: '查看品牌監測報表',
        description: '閱讀宋雅甄的輿情分析報告。',
        requirements: [],
        effects: [
          { type: 'addItem', itemId: 'item_brand_monitor_report' },
          {
            type: 'showDialog',
            dialog: {
              text: '報表紅字寫：三館同一天上熱搜，要壓關聯。\n\n她在乎的不是誰死了，是三個名字會不會排同一行。\n\n一間叫意外，三間排一起，老闆就會打來。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'ch3_brand_report_viewed', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'fun_ch3_brand_diffuser',
        name: '香氛機',
        description: '無劇情綁定',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_ch3_brand_diffuser' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '香味很懂事：不搶戲、不講真話、也不會被當證物扣押。你多吸了一口，當作補血。',
              type: 'narrator',
            },
          },
        ],
        oneTime: false,
      },
      {
        id: 'fun_ch3_brand_power_strip',
        name: '延長線',
        description: '無劇情綁定',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_ch3_brand_power_strip' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: 'KK：「線打結的程度，跟這桌人互相甩鍋的複雜度成正比。」',
              type: 'narrator',
            },
          },
        ],
        oneTime: false,
      },
      {
        id: 'fun_ch3_brand_water',
        name: '瓶裝水',
        description: '無劇情綁定',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_ch3_brand_water' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '你轉了轉瓶蓋沒開。很好，至少有一件事跟「封口」無關。',
              type: 'narrator',
            },
          },
        ],
        oneTime: false,
      },
      {
        id: 'fun_ch3_brand_clock',
        name: '壁鐘',
        description: '無劇情綁定',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_ch3_brand_clock' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '時間在走，話術也在走。差別是話術會轉彎，秒針不會。',
              type: 'narrator',
            },
          },
        ],
        oneTime: false,
      },
      {
        id: 'fun_ch3_brand_chair',
        name: '空椅',
        description: '無劇情綁定',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_ch3_brand_chair' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '你差點坐下，想起來一坐就會變成「列席品牌會議」——職位自動降級那種。',
              type: 'narrator',
            },
          },
        ],
        oneTime: false,
      },
      {
        id: 'ch3_check_report_ready',
        name: '檢查是否可向劉隊報告',
        description: '第三章里程碑達成後，解鎖向劉隊報告入口。',
        requirements: [
          { type: 'hasFlag', flag: 'ch3_milestone_whiteboard', value: true },
          { type: 'hasFlag', flag: 'ch3_milestone_brand_script', value: true },
          { type: 'hasFlag', flag: 'ch3_milestone_cross_venue', value: true },
        ],
        effects: [{ type: 'setFlag', flag: 'ch3_liu_report_ready', value: true }],
        oneTime: true,
      },
    ],
    puzzles: [],
    initialDialog: {
      text: '一進門就聞到飯店那種香，香到忘記這間沒窗。\n\n宋雅甄坐中間像拍封面，張景衡旁邊排文件，像在等你問他早就準備好的那句。',
      type: 'narrator',
    },
  },

  // ──────────────────────────────────────────────
  // 場景三：機房外走道 / 系統接點區
  // ──────────────────────────────────────────────
  scene_ch3_server_corridor: {
    id: 'scene_ch3_server_corridor',
    chapterId: 'ch3',
    name: '機房外走道',
    description: '機房走廊比大廳暗，設備架上的指示燈一排一排地亮著。顧乃謙站在走道中段，手邊是一份列印好的記錄，那幾行字被紅筆圈了出來。',
    background: '/images/bg_ch3_sc3_v1.webp',
    hotspots: [
      {
        id: 'hotspot_server_cross_venue',
        shape: 'circle',
        coords: [0.47, 0.56, 0.16],
        description: '跨館同步異常片段',
        hint: '一份列印的系統記錄，幾行被紅筆圈起來，城市 W 和光芒 R 的版本更新時間差在 15 分鐘以內。',
      },
      {
        id: 'hotspot_server_network_label',
        shape: 'circle',
        coords: [0.79, 0.3, 0.2],
        description: '網路設備標籤',
        hint: '設備架上的標籤旁邊有一份手寫對照表，W 和 R 的設備在同一個子網段。',
      },
      {
        id: 'hotspot_server_remote_login',
        shape: 'circle',
        coords: [0.79, 0.7, 0.15],
        description: '遠端登入維護單',
        hint: '夾在設備架側邊的維護單，最後一筆記錄是三週前，操作人是顧乃謙。',
      },
      {
        id: 'hotspot_fun_ch3_server_led',
        shape: 'circle',
        coords: [0.12, 0.28, 0.07],
        description: '閃爍燈號',
        hint: '某一顆燈特別愛刷存在感。',
      },
      {
        id: 'hotspot_fun_ch3_server_cable',
        shape: 'circle',
        coords: [0.62, 0.22, 0.075],
        description: '整線束帶',
        hint: '束帶咬得很緊，像有人在跟混亂談判。',
      },
      {
        id: 'hotspot_fun_ch3_server_sticker',
        shape: 'circle',
        coords: [0.9, 0.48, 0.065],
        description: '機櫃貼紙',
        hint: '「非授權勿動」——通常表示大家都動過一點。',
      },
      {
        id: 'hotspot_fun_ch3_server_floor_tile',
        shape: 'circle',
        coords: [0.28, 0.88, 0.08],
        description: '地磚接縫',
        hint: '冷氣從縫裡鑽上來，提醒你這條路不是給觀眾走的。',
      },
      {
        id: 'hotspot_fun_ch3_server_exit_sign',
        shape: 'circle',
        coords: [0.55, 0.12, 0.065],
        description: '出口指示牌',
        hint: '綠色小人跑得好急，像也聽懂了今晚的節奏。',
      },
    ],
    npcs: [
      {
        id: 'npc_gu_naiqian',
        name: '顧乃謙（系統工程）',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch3_gu_server_idle_1', text: '顧乃謙敲敲紙：「三個時間點，看了沒。」', type: 'hint', weight: 1 },
          { id: 'ch3_gu_server_idle_2', text: '「機器不會騙人，會騙人的是給你看哪一段。」', type: 'hint', weight: 1 },
          { id: 'ch3_gu_server_idle_3', text: '「你問是不是人為？我只知道有人曉得哪兩邊會一起跳。」', type: 'hint', weight: 1 },
          { id: 'ch3_gu_server_casual_1', text: '「這條走廊冷氣像不要錢，頭腦會比較清醒。」', type: 'casual', weight: 2 },
          { id: 'ch3_gu_server_casual_2', text: '他把紅筆蓋起來：「圈起來的不是重點，是缺口。」', type: 'casual', weight: 2 },
          { id: 'ch3_gu_server_casual_3', text: '「你要睡覺可以，別指望母帶也睡。」', type: 'casual', weight: 1 },
        ],
        available: true,
      },
      {
        id: 'npc_xiaozhang',
        name: '小張（放映員）',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch3_xiazhang_idle_1', text: '小張苦笑：「那種設定輪不到我啦，要遠端權限耶。」', type: 'hint', weight: 1 },
          { id: 'ch3_xiazhang_idle_2', text: '「我就放片，表寫啥我照做。表誰改的……我不敢問。」', type: 'hint', weight: 1 },
          { id: 'ch3_xiazhang_casual_1', text: '「我口袋永遠有喉糖，講話講到燒聲。」', type: 'casual', weight: 2 },
          { id: 'ch3_xiazhang_casual_2', text: '小張看著燈：「機房走道比放映室還吵，吵在腦子裡。」', type: 'casual', weight: 2 },
          { id: 'ch3_xiazhang_casual_3', text: '「我寧願對著時間碼，也不要對著記者。」', type: 'casual', weight: 1 },
          { id: 'ch3_xiazhang_casual_4', text: '「權限兩個字，聽起來像咒語。」', type: 'hint', weight: 2 },
        ],
        available: true,
      },
      {
        id: 'npc_ashun',
        name: '阿順（巡場保全）',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch3_ashun_server_idle_1', text: '阿順壓聲：「這條走廊平常沒人晃，會來的都不是路過。」', type: 'hint', weight: 1 },
          { id: 'ch3_ashun_server_idle_2', text: '「會開機房門的，多半也曉得鏡頭啥時在睡覺。」', type: 'hint', weight: 1 },
          { id: 'ch3_ashun_server_casual_1', text: '「我在這裡站著，不是帥，是怕有人忘記這裡有人。」', type: 'casual', weight: 2 },
          { id: 'ch3_ashun_server_casual_2', text: '阿順聳肩：「燈一顆顆亮，像有人在呼吸。」', type: 'casual', weight: 2 },
          { id: 'ch3_ashun_server_casual_3', text: '「大廳講漂亮話，這裡講接頭跟線。」', type: 'casual', weight: 1 },
          { id: 'ch3_ashun_server_casual_4', text: '「你要找不見光的人，先找不見光的角落。」', type: 'hint', weight: 2 },
        ],
        available: true,
      },
    ],
    items: [
      items.item_cross_venue_sync,
      items.item_network_device_label,
      items.item_remote_login_sheet,
    ],
    hotspotEventMap: {
      hotspot_server_cross_venue: 'inspect_ch3_cross_venue',
      hotspot_server_network_label: 'inspect_ch3_network_label',
      hotspot_server_remote_login: 'inspect_ch3_remote_login',
      hotspot_fun_ch3_server_led: 'fun_ch3_server_led',
      hotspot_fun_ch3_server_cable: 'fun_ch3_server_cable',
      hotspot_fun_ch3_server_sticker: 'fun_ch3_server_sticker',
      hotspot_fun_ch3_server_floor_tile: 'fun_ch3_server_floor_tile',
      hotspot_fun_ch3_server_exit_sign: 'fun_ch3_server_exit_sign',
    },
    events: [
      {
        id: 'talk_gu_naiqian_ch3',
        name: '與顧乃謙說話',
        description: '詢問系統工程師顧乃謙。',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '顧乃謙面無表情：「跨館一起跳，不叫故障，叫有人曉得兩邊會一起響。」\n\n「W 跟 R 同一串版本，標準架構不會這樣裝。」\n\n「問我是不是單點？不是。」',
              type: 'character',
              characterId: 'npc_gu_naiqian',
              characterName: '顧乃謙（系統工程）',
              characterExpression: 1,
              characterPosition: 'right',
            },
          },
          { type: 'setFlag', flag: 'ch3_gu_server_talked', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'inspect_ch3_cross_venue',
        name: '查看跨館同步異常片段',
        description: '檢視顧乃謙圈出來的系統記錄。',
        requirements: [],
        effects: [
          { type: 'addItem', itemId: 'item_cross_venue_sync' },
          {
            type: 'showDialog',
            dialog: {
              text: 'W 跟 R，三個日子，插件版本一樣，更新前後差不到十五分鐘。\n\n不是自動自己同步那種。要嘛同一個入口，要嘛同一隻手在按。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'ch3_cross_venue_viewed', value: true },
          { type: 'setFlag', flag: 'ch3_milestone_cross_venue', value: true },
          { type: 'triggerEvent', eventId: 'ch3_check_report_ready' },
        ],
        oneTime: true,
      },
      {
        id: 'inspect_ch3_network_label',
        name: '查看網路設備標籤',
        description: '檢視設備架上的館別代號對照。',
        requirements: [],
        effects: [
          { type: 'addItem', itemId: 'item_network_device_label' },
          {
            type: 'showDialog',
            dialog: {
              text: '手寫表：W-01 城市、R-02 光芒——兩邊設備塞同一個子網段。\n\n正常裝機不會這樣，誰故意讓兩館能直接講話？',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'ch3_network_label_viewed', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'inspect_ch3_remote_login',
        name: '查看遠端登入維護單',
        description: '檢視夾在設備架旁的維護單。',
        requirements: [],
        effects: [
          { type: 'addItem', itemId: 'item_remote_login_sheet' },
          {
            type: 'showDialog',
            dialog: {
              text: '維護單最後一筆：顧乃謙簽的，W、R 同步確認，三週前。\n\n案發前他就知道兩邊綁一起。\n\n那他在等啥？還是早就在看？',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'ch3_remote_login_viewed', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'ch3_check_report_ready',
        name: '檢查是否可向劉隊報告',
        description: '第三章里程碑達成後，解鎖向劉隊報告入口。',
        requirements: [
          { type: 'hasFlag', flag: 'ch3_milestone_whiteboard', value: true },
          { type: 'hasFlag', flag: 'ch3_milestone_brand_script', value: true },
          { type: 'hasFlag', flag: 'ch3_milestone_cross_venue', value: true },
        ],
        effects: [{ type: 'setFlag', flag: 'ch3_liu_report_ready', value: true }],
        oneTime: true,
      },
      {
        id: 'talk_xiazhang_ch3',
        name: '問小張',
        description: '詢問放映員小張。',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '小張搓手：「牆上寫自動，機房還不是要人按。」\n\n「表寫啥我放啥，表不會自己長字啦。」\n\n他瞄維護單：「那種設定我這層級碰不到，要權限的。」',
              type: 'character',
              characterId: 'npc_xiaozhang',
              characterName: '小張（放映員）',
              characterExpression: 1,
              characterPosition: 'right',
            },
          },
          { type: 'setFlag', flag: 'ch3_xiazhang_talked', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'talk_ashun_ch3_server',
        name: '問阿順（機房走廊）',
        description: '詢問巡場保全阿順在機房走廊的觀察。',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '阿順瞇眼：「大廳也摸、機房也摸的，不是觀光客。」\n\n「是那種每次都知道走哪扇門、鏡頭看不到哪段的——我講到這裡就好。」',
              type: 'character',
              characterId: 'npc_ashun',
              characterName: '阿順（巡場保全）',
              characterExpression: 1,
              characterPosition: 'right',
            },
          },
          { type: 'setFlag', flag: 'ch3_ashun_server_talked', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'fun_ch3_server_led',
        name: '閃爍燈號',
        description: '無劇情綁定',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_ch3_server_led' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '燈一閃一閃像在打摩斯密碼。你沒解出來，但心情同步變得焦躁。',
              type: 'narrator',
            },
          },
        ],
        oneTime: false,
      },
      {
        id: 'fun_ch3_server_cable',
        name: '整線束帶',
        description: '無劇情綁定',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_ch3_server_cable' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '線材被束帶馴服成一排，看起來比會議室的人還守規矩。',
              type: 'narrator',
            },
          },
        ],
        oneTime: false,
      },
      {
        id: 'fun_ch3_server_sticker',
        name: '機櫃貼紙',
        description: '無劇情綁定',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_ch3_server_sticker' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: 'KK：「貼紙愈兇，代表這裡愈常被『緊急調整』。」',
              type: 'narrator',
            },
          },
        ],
        oneTime: false,
      },
      {
        id: 'fun_ch3_server_floor_tile',
        name: '地磚接縫',
        description: '無劇情綁定',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_ch3_server_floor_tile' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '你盯著接縫發呆三秒，成功什麼也沒推理出來——這也算一種專注。',
              type: 'narrator',
            },
          },
        ],
        oneTime: false,
      },
      {
        id: 'fun_ch3_server_exit_sign',
        name: '出口指示牌',
        description: '無劇情綁定',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_ch3_server_exit_sign' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '出口永遠在，問題是你能不能在報告寫完前走出去。',
              type: 'narrator',
            },
          },
        ],
        oneTime: false,
      },
    ],
    puzzles: [],
    initialDialog: {
      text: '機房走道暗多了，一排小燈在閃。\n\n顧乃謙站那裡，紅筆圈好的紙等你來對。',
      type: 'narrator',
    },
  },
};

// ──────────────────────────────────────────────
// 第三章 NPC 對話樹
// ──────────────────────────────────────────────
const npcDialogs: Record<string, Record<string, NpcDialogNode>> = {

  // ──────────────────────────────────────────────
  // 顧乃謙 敏感對話（ch3 核心 NPC）
  // ──────────────────────────────────────────────
  npc_gu_naiqian: {
    // 敏感 branch 1：追問「原始 log 少了什麼」
    node_gu_sensitive1_1: {
      id: 'node_gu_sensitive1_1',
      npcId: 'npc_gu_naiqian',
      text:
        '顧乃謙停幾秒，冷冷的：「真的 log 有兩欄，整理版沒有。」\n\n「操作來源 IP，跟覆寫前原值。」\n\n「你問怎麼剛好指到高文傑？缺這兩欄，你就分不清是本機按的還是遠端按的。」',
      choices: [
        {
          id: 'gu_s1_q1',
          label: '遠端操作——意思是不用親自在場？',
          effects: [{ type: 'setFlag', flag: 'ch3_gu_s1_q1', value: true }],
          insightEffects: [{ target: 'procedure_insight', delta: 1 }],
        },
        {
          id: 'gu_s1_q2',
          label: '張景衡知道那兩個欄位的事嗎？',
          effects: [{ type: 'setFlag', flag: 'ch3_gu_s1_q2', value: true }],
          insightEffects: [{ target: 'human_insight', delta: 1 }],
        },
      ],
      next: (state: GameState): string | null => {
        if (state.flags.ch3_gu_s1_q1) return 'node_gu_s1_reply_q1';
        return 'node_gu_s1_reply_q2';
      },
    },
    node_gu_s1_reply_q1: {
      id: 'node_gu_s1_reply_q1',
      npcId: 'npc_gu_naiqian',
      text:
        '「對。遠端就是人不用在現場也能戳。」\n\n「權限夠、版本對、指令會，連上去就動了。」\n\n他瞥走廊：「W 跟 R 設備同一網段——這事沒幾個人知道。」',
      choices: [
        {
          id: 'gu_s1_end',
          label: '（結束對話）',
          effects: [
            { type: 'setFlag', flag: 'npc_gu_naiqian_sensitive_done', value: true },
          ],
        },
      ],
    },
    node_gu_s1_reply_q2: {
      id: 'node_gu_s1_reply_q2',
      npcId: 'npc_gu_naiqian',
      text:
        '「他拿的是我給的那份，不是母帶。」\n\n「懂不懂差在哪，我不曉得。反正沒來問我。」\n\n「看不到跟裝沒看到，兩回事。」',
      choices: [
        {
          id: 'gu_s1_end',
          label: '（結束對話）',
          effects: [
            { type: 'setFlag', flag: 'npc_gu_naiqian_sensitive_done', value: true },
          ],
        },
      ],
    },

    // 敏感 branch 2：追問「這不是單點故障」
    node_gu_sensitive2_1: {
      id: 'node_gu_sensitive2_1',
      npcId: 'npc_gu_naiqian',
      text:
        '顧乃謙把紙拍桌上：「三個時間點，兩個館，更新差不到十五分鐘。」\n\n「不是巧合，那版插件也沒內建跨館自己升。」\n\n「人手推的。推的人，兩邊都能進。」',
      choices: [
        {
          id: 'gu_s2_q1',
          label: '能查出那個人是誰嗎？',
          effects: [{ type: 'setFlag', flag: 'ch3_gu_s2_q1', value: true }],
          insightEffects: [{ target: 'evidence_insight', delta: 1 }],
        },
        {
          id: 'gu_s2_q2',
          label: '你為什麼在案發前就知道這件事？',
          effects: [{ type: 'setFlag', flag: 'ch3_gu_s2_q2', value: true }],
          insightEffects: [{ target: 'human_insight', delta: 1 }],
        },
      ],
      next: (state: GameState): string | null => {
        if (state.flags.ch3_gu_s2_q1) return 'node_gu_s2_reply_q1';
        return 'node_gu_s2_reply_q2';
      },
    },
    node_gu_s2_reply_q1: {
      id: 'node_gu_s2_reply_q1',
      npcId: 'npc_gu_naiqian',
      text:
        '「可以查，前提拿得到母帶。整理版沒那些。」\n\n「要 IP、要動之前的版本紀錄、要兩邊維護帳號。」\n\n他盯著你：「你要我調真的出來，今晚就別想睡。」',
      choices: [
        {
          id: 'gu_s2_end',
          label: '（結束對話）',
          effects: [
            { type: 'setFlag', flag: 'npc_gu_naiqian_sensitive_done', value: true },
          ],
        },
      ],
    },
    node_gu_s2_reply_q2: {
      id: 'node_gu_s2_reply_q2',
      npcId: 'npc_gu_naiqian',
      text:
        '他沉默一下。\n\n「跨館維護我負責，版本是我記的。早覺得怪，那時還沒死人。」\n\n「現在死人了，我才給你看。」',
      choices: [
        {
          id: 'gu_s2_end',
          label: '（結束對話）',
          effects: [
            { type: 'setFlag', flag: 'npc_gu_naiqian_sensitive_done', value: true },
          ],
        },
      ],
    },
  },

  // ──────────────────────────────────────────────
  // 劉隊 第三章 QA（殘句猜測）
  // 此對話樹作為備用節點儲存，實際由 page.tsx 中的直接對話管理驅動
  // ──────────────────────────────────────────────
  npc_liu_ch3_qa: {
    // Q1：白板被擦兩次
    node_liu_ch3_q1: {
      id: 'node_liu_ch3_q1',
      npcId: 'npc_liu',
      text:
        '劉隊翻本子：「周姊講白板擦兩次。」\n\n「殘句我寫一半：」\n「『白板擦兩次。第一次為了______，第二次為了______。』」',
      choices: [
        {
          id: 'ch3_q1_A',
          label: 'A. 改內容 / 讓它看起來像沒改過',
          effects: [
            { type: 'setFlag', flag: 'ch3_q1_answer', value: 'A' },
            { type: 'setFlag', flag: 'ch3_q1_main_correct', value: true },
            { type: 'setFlag', flag: 'ch3_q1_done', value: true },
          ],
          insightEffects: [{ target: 'evidence_insight', delta: 1 }],
        },
        {
          id: 'ch3_q1_B',
          label: 'B. 記錄 / 完成交接',
          effects: [
            { type: 'setFlag', flag: 'ch3_q1_answer', value: 'B' },
            { type: 'setFlag', flag: 'ch3_q1_done', value: true },
          ],
        },
        {
          id: 'ch3_q1_C',
          label: 'C. 備忘 / 整理版面',
          effects: [
            { type: 'setFlag', flag: 'ch3_q1_answer', value: 'C' },
            { type: 'setFlag', flag: 'ch3_q1_done', value: true },
          ],
        },
        {
          id: 'ch3_q1_D',
          label: 'D. 通報 / 讓更多人知道',
          effects: [
            { type: 'setFlag', flag: 'ch3_q1_answer', value: 'D' },
            { type: 'setFlag', flag: 'ch3_q1_done', value: true },
          ],
        },
        {
          id: 'ch3_q1_E',
          label: 'E. 測試 / 確認筆能用',
          effects: [
            { type: 'setFlag', flag: 'ch3_q1_answer', value: 'E' },
            { type: 'setFlag', flag: 'ch3_q1_done', value: true },
          ],
        },
        {
          id: 'ch3_q1_F',
          label: 'F. 掩飾 / 轉移注意力',
          effects: [
            { type: 'setFlag', flag: 'ch3_q1_answer', value: 'F' },
            { type: 'setFlag', flag: 'ch3_q1_partial_correct', value: true },
            { type: 'setFlag', flag: 'ch3_q1_done', value: true },
          ],
          insightEffects: [{ target: 'human_insight', delta: 1 }],
        },
        {
          id: 'ch3_q1_G',
          label: 'G. 佈達 / 讓流程正式化',
          effects: [
            { type: 'setFlag', flag: 'ch3_q1_answer', value: 'G' },
            { type: 'setFlag', flag: 'ch3_q1_done', value: true },
          ],
        },
      ],
    },
    node_liu_ch3_q1_reply_A: {
      id: 'node_liu_ch3_q1_reply_A',
      npcId: 'npc_liu',
      text: '劉隊點頭：「對。先改，再裝沒改過。兩步。」\n\n「有人精得很——看起來從沒動過，就沒人回去翻。」',
      choices: [{ id: 'ch3_q1_next', label: '（繼續下一題）' }],
    },
    node_liu_ch3_q1_reply_F: {
      id: 'node_liu_ch3_q1_reply_F',
      npcId: 'npc_liu',
      text: '劉隊皺眉：「掩飾沾邊。重點在第二次——不是藏，是讓人以為本來就長這樣。」',
      choices: [{ id: 'ch3_q1_next', label: '（繼續下一題）' }],
    },
    node_liu_ch3_q1_reply_other: {
      id: 'node_liu_ch3_q1_reply_other',
      npcId: 'npc_liu',
      text: '劉隊：「周姊講比你清楚：先改，再裝沒改。順序別搞反。」',
      choices: [{ id: 'ch3_q1_next', label: '（繼續下一題）' }],
    },

    // Q2：log 少說了什麼
    node_liu_ch3_q2: {
      id: 'node_liu_ch3_q2',
      npcId: 'npc_liu',
      text:
        '劉隊翻頁：「顧乃謙講整理版跟母帶對不起來。」\n\n「殘句：『這份 log 麻煩不在寫了啥，在它______了啥。』」',
      choices: [
        {
          id: 'ch3_q2_A',
          label: 'A. 漏記',
          effects: [
            { type: 'setFlag', flag: 'ch3_q2_answer', value: 'A' },
            { type: 'setFlag', flag: 'ch3_q2_partial_correct', value: true },
            { type: 'setFlag', flag: 'ch3_q2_done', value: true },
          ],
          insightEffects: [{ target: 'procedure_insight', delta: 1 }],
        },
        {
          id: 'ch3_q2_B',
          label: 'B. 選擇性地遺漏',
          effects: [
            { type: 'setFlag', flag: 'ch3_q2_answer', value: 'B' },
            { type: 'setFlag', flag: 'ch3_q2_main_correct', value: true },
            { type: 'setFlag', flag: 'ch3_q2_done', value: true },
          ],
          insightEffects: [{ target: 'evidence_insight', delta: 1 }],
        },
        {
          id: 'ch3_q2_C',
          label: 'C. 誇大',
          effects: [
            { type: 'setFlag', flag: 'ch3_q2_answer', value: 'C' },
            { type: 'setFlag', flag: 'ch3_q2_done', value: true },
          ],
        },
        {
          id: 'ch3_q2_D',
          label: 'D. 偽造',
          effects: [
            { type: 'setFlag', flag: 'ch3_q2_answer', value: 'D' },
            { type: 'setFlag', flag: 'ch3_q2_done', value: true },
          ],
        },
        {
          id: 'ch3_q2_E',
          label: 'E. 整理',
          effects: [
            { type: 'setFlag', flag: 'ch3_q2_answer', value: 'E' },
            { type: 'setFlag', flag: 'ch3_q2_done', value: true },
          ],
        },
        {
          id: 'ch3_q2_F',
          label: 'F. 強調',
          effects: [
            { type: 'setFlag', flag: 'ch3_q2_answer', value: 'F' },
            { type: 'setFlag', flag: 'ch3_q2_done', value: true },
          ],
        },
        {
          id: 'ch3_q2_G',
          label: 'G. 刪除',
          effects: [
            { type: 'setFlag', flag: 'ch3_q2_answer', value: 'G' },
            { type: 'setFlag', flag: 'ch3_q2_partial_correct', value: true },
            { type: 'setFlag', flag: 'ch3_q2_done', value: true },
          ],
          insightEffects: [{ target: 'evidence_insight', delta: 1 }],
        },
      ],
    },
    node_liu_ch3_q2_reply_B: {
      id: 'node_liu_ch3_q2_reply_B',
      npcId: 'npc_liu',
      text: '劉隊：「對。不是全沒，是挑過——要給你看啥、不要給你看啥。」\n\n「挑，就是決定，不是手滑。」',
      choices: [{ id: 'ch3_q2_next', label: '（繼續下一題）' }],
    },
    node_liu_ch3_q2_reply_AG: {
      id: 'node_liu_ch3_q2_reply_AG',
      npcId: 'npc_liu',
      text: '劉隊：「接近。不是全砍，是幾欄被當成『不重要』——剛好那幾欄能講清是不是遠端戳的。」',
      choices: [{ id: 'ch3_q2_next', label: '（繼續下一題）' }],
    },
    node_liu_ch3_q2_reply_other: {
      id: 'node_liu_ch3_q2_reply_other',
      npcId: 'npc_liu',
      text: '劉隊：「顧乃謙講了，來源 IP、覆寫前原值，整理版都沒有。缺的不是多，是缺你問得出『從哪裡按的』那幾格。」',
      choices: [{ id: 'ch3_q2_next', label: '（繼續下一題）' }],
    },

    // Q3：跨館同步不是
    node_liu_ch3_q3: {
      id: 'node_liu_ch3_q3',
      npcId: 'npc_liu',
      text:
        '劉隊翻到最後：「顧乃謙說 W 跟 R 同一串版本。」\n\n「殘句：『這不是______，是______。』」',
      choices: [
        {
          id: 'ch3_q3_A',
          label: 'A. 單點故障 / 系統性問題',
          effects: [
            { type: 'setFlag', flag: 'ch3_q3_answer', value: 'A' },
            { type: 'setFlag', flag: 'ch3_q3_main_correct', value: true },
            { type: 'setFlag', flag: 'ch3_q3_done', value: true },
          ],
          insightEffects: [{ target: 'procedure_insight', delta: 2 }],
        },
        {
          id: 'ch3_q3_B',
          label: 'B. 偶發事件 / 有人刻意安排的結果',
          effects: [
            { type: 'setFlag', flag: 'ch3_q3_answer', value: 'B' },
            { type: 'setFlag', flag: 'ch3_q3_partial_correct', value: true },
            { type: 'setFlag', flag: 'ch3_q3_done', value: true },
          ],
          insightEffects: [{ target: 'human_insight', delta: 1 }],
        },
        {
          id: 'ch3_q3_C',
          label: 'C. 資安漏洞 / 人為疏失',
          effects: [
            { type: 'setFlag', flag: 'ch3_q3_answer', value: 'C' },
            { type: 'setFlag', flag: 'ch3_q3_done', value: true },
          ],
        },
        {
          id: 'ch3_q3_D',
          label: 'D. 技術問題 / 設備老化',
          effects: [
            { type: 'setFlag', flag: 'ch3_q3_answer', value: 'D' },
            { type: 'setFlag', flag: 'ch3_q3_done', value: true },
          ],
        },
        {
          id: 'ch3_q3_E',
          label: 'E. 孤立事件 / 有跨館聯繫的操作',
          effects: [
            { type: 'setFlag', flag: 'ch3_q3_answer', value: 'E' },
            { type: 'setFlag', flag: 'ch3_q3_partial_correct', value: true },
            { type: 'setFlag', flag: 'ch3_q3_done', value: true },
          ],
          insightEffects: [{ target: 'evidence_insight', delta: 1 }],
        },
        {
          id: 'ch3_q3_F',
          label: 'F. 舊問題 / 新發現',
          effects: [
            { type: 'setFlag', flag: 'ch3_q3_answer', value: 'F' },
            { type: 'setFlag', flag: 'ch3_q3_done', value: true },
          ],
        },
        {
          id: 'ch3_q3_G',
          label: 'G. 個人行為 / 組織行為',
          effects: [
            { type: 'setFlag', flag: 'ch3_q3_answer', value: 'G' },
            { type: 'setFlag', flag: 'ch3_q3_done', value: true },
          ],
          insightEffects: [{ target: 'human_insight', delta: 1 }],
        },
      ],
    },
    node_liu_ch3_q3_reply_A: {
      id: 'node_liu_ch3_q3_reply_A',
      npcId: 'npc_liu',
      text: '劉隊：「對。單點壞一邊就好，版本綁一起，就是同一條線、同一個洞或同一隻手。」\n\n「不是一處倒霉，是有人曉得兩邊會一起跳。」',
      choices: [{ id: 'ch3_qa_complete', label: '（完成推理討論）' }],
    },
    node_liu_ch3_q3_reply_BE: {
      id: 'node_liu_ch3_q3_reply_BE',
      npcId: 'npc_liu',
      text: '劉隊：「方向對，再收斂。重點在結構——兩館同一條線，就不是單點那麼簡單。」',
      choices: [{ id: 'ch3_qa_complete', label: '（完成推理討論）' }],
    },
    node_liu_ch3_q3_reply_other: {
      id: 'node_liu_ch3_q3_reply_other',
      npcId: 'npc_liu',
      text: '劉隊：「顧乃謙那句你記住：跨館一起跳不像故障，像有人曉得兩邊會一起響。」\n\n「不是單點、不是碰巧，是同時會弄兩邊。」',
      choices: [{ id: 'ch3_qa_complete', label: '（完成推理討論）' }],
    },

    // 結尾：章節結語
    node_liu_ch3_outro: {
      id: 'node_liu_ch3_outro',
      npcId: 'npc_liu',
      text:
        '劉隊闔上本子：「log 會被整理，你知我知。」\n\n「這句寫不寫進紀錄，你講。」\n\n他看著你，不催。',
      choices: [
        {
          id: 'ch3_outro_write_in',
          label: '寫進去——「log 被整理過，原始欄位已遺失，跨館操作痕跡無法完整重建。」',
          effects: [
            { type: 'setFlag', flag: 'ch3_outro_write_raw', value: true },
            { type: 'setFlag', flag: 'ch3_reasoning_done', value: true },
          ],
          insightEffects: [{ target: 'evidence_insight', delta: 2 }],
        },
        {
          id: 'ch3_outro_use_filtered',
          label: '先用整理版——「現有資料指向高文傑個別操作，尚無跨館系統性問題之直接證據。」',
          effects: [
            { type: 'setFlag', flag: 'ch3_outro_use_filtered', value: true },
            { type: 'setFlag', flag: 'ch3_reasoning_done', value: true },
          ],
          insightEffects: [{ target: 'procedure_insight', delta: 1 }],
        },
      ],
    },
    node_liu_ch3_outro_raw: {
      id: 'node_liu_ch3_outro_raw',
      npcId: 'npc_liu',
      text:
        '劉隊寫下去：「這行一簽，今晚有人手機會炸。」\n\n「我知道。可是真的。」',
      choices: [
        {
          id: 'ch3_outro_done',
          label: '（結束本章）',
          effects: [{ type: 'setFlag', flag: 'ch3_reasoning_done', value: true }],
        },
      ],
    },
    node_liu_ch3_outro_filtered: {
      id: 'node_liu_ch3_outro_filtered',
      npcId: 'npc_liu',
      text:
        '劉隊寫下去：「這樣今晚大家能睡。」\n\n停一拍：「缺那兩欄，我腦裡自己記。」',
      choices: [
        {
          id: 'ch3_outro_done',
          label: '（結束本章）',
          effects: [{ type: 'setFlag', flag: 'ch3_reasoning_done', value: true }],
        },
      ],
    },
  },
};

export { scenes, items, npcDialogs };
