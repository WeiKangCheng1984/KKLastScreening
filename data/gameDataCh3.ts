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
        id: 'hotspot_lobby_liu',
        shape: 'circle',
        coords: [0.175, 0.675, 0.125],
        description: '劉隊',
        hint: '劉隊站在大廳角落，表情不算輕鬆。',
      },
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
        id: 'hotspot_lobby_lin_ruitang',
        shape: 'circle',
        coords: [0.72, 0.675, 0.2],
        description: '林瑞堂',
        hint: '林瑞堂站在那裡，看起來每根神經都繃著。',
      },
      {
        id: 'hotspot_lobby_ashun',
        shape: 'circle',
        coords: [0.9, 0.625, 0.08],
        description: '阿順',
        hint: '阿順倚著牆，視線掃著大廳各個角落。',
      },
      {
        id: 'hotspot_lobby_zhou_jie',
        shape: 'circle',
        coords: [0.165, 0.88, 0.1],
        description: '周姊',
        hint: '周姊正在整理清潔推車，沒有看任何人，但她知道發生什麼事。',
      },
    ],
    npcs: [
      {
        id: 'npc_liu',
        name: '劉隊（偵查隊）',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch3_liu_idle_1', text: '「先去把那些人談完，再回來跟我說你看到什麼。」', type: 'hint', weight: 1 },
          { id: 'ch3_liu_idle_2', text: '劉隊看了一眼大廳：「品牌那邊的話術，你看了就知道他們在保什麼。」', type: 'hint', weight: 1 },
        ],
        available: true,
      },
      {
        id: 'npc_lin_ruitang',
        name: '林瑞堂（城市影城副理）',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch3_lin_idle_1', text: '林瑞堂說：「你有問題可以問，但我能說的都說了。」', type: 'hint', weight: 1 },
          { id: 'ch3_lin_idle_2', text: '「總部來了以後，我這邊就沒有決策權了。」', type: 'hint', weight: 1 },
        ],
        available: true,
      },
      {
        id: 'npc_ashun',
        name: '阿順（巡場保全）',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch3_ashun_lobby_idle_1', text: '阿順說：「這裡熟的人比外人多，但每個人都在假裝不認識彼此。」', type: 'hint', weight: 1 },
        ],
        available: true,
      },
      {
        id: 'npc_zhou_jie',
        name: '周姊（清潔）',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch3_zhou_idle_1', text: '周姊說：「字跡說話比人說話誠實。」', type: 'hint', weight: 1 },
          { id: 'ch3_zhou_idle_2', text: '「我只管做清潔，但我知道誰在急著擦什麼。」', type: 'hint', weight: 1 },
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
      hotspot_lobby_liu: 'talk_liu_ch3_task',
      hotspot_lobby_whiteboard: 'inspect_ch3_whiteboard',
      hotspot_lobby_promo_wall: 'inspect_ch3_promo_wall',
      hotspot_lobby_front_drawer: 'inspect_ch3_front_drawer',
      hotspot_lobby_lin_ruitang: 'talk_lin_ch3',
      hotspot_lobby_ashun: 'talk_ashun_ch3_lobby',
      hotspot_lobby_zhou_jie: 'talk_zhou_jie_ch3',
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
              text: '劉隊低聲說：「品牌那邊剛到，技術組的顧乃謙也在。\n\n你知道我要你去查什麼，對吧——不是誰動了手，是誰改了 log，改了多少。」\n\n「先去大廳看一眼，再去裡面找品牌的人談，最後去找顧乃謙。他說他有東西要讓你看。」',
              type: 'character',
              characterId: 'npc_liu',
              characterName: '劉隊（偵查隊）',
              characterExpression: 1,
              characterPosition: 'left',
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
              text: '白板上有一處字被重寫過——墨水比周圍的字深，筆劃下的角度和第一章紅筆塗改如出一轍。\n\n「白板有人擦過兩次。第一次為了改，第二次為了像沒改。」',
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
              text: '宣傳文案寫著「可分區控制、可自動排程」，但現場口徑是「只開節能」。\n\n這兩個說法不能同時為真。如果「自動排程」是宣傳賣點，那「延後亮燈」就不是偶發疏失。',
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
              text: '過期場控手冊裡夾著一張手寫補注的簡表。第三頁有一個功能說明：「C4：散場延後照明申請。」\n\n這一頁不在正式版本裡。補注的時間比案發早了三個月。\n\n這是預謀，還是早就知道有人會用這個功能？',
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
              text: '林瑞堂說：「總部來了以後，很多事就不是我能講的。」\n\n「前台的東西我都有按流程處理。場控系統那邊……如果你想知道，你要問技術組，不是我。」\n\n他停頓了一下：「我管場館，不管系統。流程怎麼寫，我就怎麼站。」',
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
              text: '阿順看了一眼大廳：「大廳亮得很，話反而比較黑。」\n\n「這種人不是沒來過，他是來過很多次，才知道哪裡不用看鏡頭。\n\n「熟人才知道怎麼在對的時間消失。」',
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
              text: '周姊沒有停下整理推車的動作：「白板有人擦過兩次。第一次為了改，第二次為了像沒改。」\n\n「字是新的，灰是舊的。這種東西不會幫誰說謊。」\n\n她頓了頓：「我做清潔的，我看字跡、灰塵、鞋印，比很多人看臉還準。」',
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
      text: '大廳被封鎖了。宣傳牆燈還開著，讓整個空間看起來比平常亮。\n\n但劉隊說，這種地方的話，通常比燈光黑。',
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
        id: 'hotspot_brand_song',
        shape: 'circle',
        coords: [0.2, 0.575, 0.125],
        description: '宋雅甄',
        hint: '宋雅甄的聲音很平穩，像高級飯店大廳的香氛，讓人忘了那裡其實沒有窗。',
      },
      {
        id: 'hotspot_brand_zhang',
        shape: 'circle',
        coords: [0.44, 0.425, 0.11],
        description: '張景衡',
        hint: '張景衡正在整理一疊文件，表情像在等你先問問題。',
      },
      {
        id: 'hotspot_brand_gu',
        shape: 'circle',
        coords: [0.68, 0.485, 0.1],
        description: '顧乃謙',
        hint: '顧乃謙坐在角落，看起來對這個房間的每個人都有點不耐煩。',
      },
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
    ],
    npcs: [
      {
        id: 'npc_song_yazhen',
        name: '宋雅甄（品牌長）',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch3_song_idle_1', text: '宋雅甄說：「我不是要阻止你，我只是希望你先把邏輯想清楚。」', type: 'hint', weight: 1 },
          { id: 'ch3_song_idle_2', text: '「穩定是這個時刻最需要的東西，真相等穩定之後再說也不遲。」', type: 'hint', weight: 1 },
        ],
        available: true,
      },
      {
        id: 'npc_zhang_jingheng',
        name: '張景衡（品牌特助）',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch3_zhang_idle_1', text: '張景衡說：「我給你的那份報告，比原始 log 好讀多了。」', type: 'hint', weight: 1 },
          { id: 'ch3_zhang_idle_2', text: '「你需要的是一份能說清楚的版本，不是一份讓更多人睡不著的版本。」', type: 'hint', weight: 1 },
        ],
        available: true,
      },
      {
        id: 'npc_gu_naiqian',
        name: '顧乃謙（系統工程）',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch3_gu_brand_idle_1', text: '顧乃謙說：「你如果要看原始 log，去機房找我。」', type: 'hint', weight: 1 },
          { id: 'ch3_gu_brand_idle_2', text: '「整理版可以讀，但它不是全部。」', type: 'hint', weight: 1 },
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
      hotspot_brand_song: 'talk_song_ch3',
      hotspot_brand_zhang: 'talk_zhang_ch3',
      hotspot_brand_gu: 'talk_gu_brand_ch3',
      hotspot_brand_filtered_log: 'inspect_ch3_filtered_log',
      hotspot_brand_press_draft: 'inspect_ch3_press_draft',
      hotspot_brand_monitor_report: 'inspect_ch3_monitor_report',
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
              text: '宋雅甄說：「現在最重要的是穩定。真相太急著上桌，通常會打翻。」\n\n「一間影城出事是事故，三間一起被聯想，就是品牌問題。」\n\n她停了一下，語氣反而更輕了：「我不是阻止你查。我只是希望你查得像個成年人。」\n\n「你要真相，我要明天還能開門。」',
              type: 'character',
              characterId: 'npc_song_yazhen',
              characterName: '宋雅甄（品牌長）',
              characterExpression: 1,
              characterPosition: 'left',
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
              text: '張景衡說：「我整理了一份，你會比較好讀。」\n\n「原始資料不是不能看，是看了也未必比這份更真。」\n\n他把那份 log 往你這邊推了一點：「警方要的是可說明，不是可敬畏。」\n\n他補了一句，像是在交代流程：「先發出去的那份，就會比較像真的。」',
              type: 'character',
              characterId: 'npc_zhang_jingheng',
              characterName: '張景衡（品牌特助）',
              characterExpression: 1,
              characterPosition: 'left',
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
              text: '顧乃謙說：「我只看得到系統做了什麼，看不到誰在撒謊。」\n\n「你要整理版，今天就能結案。你要原始檔，今晚很多人睡不好。」\n\n他低頭看了一眼桌面：「機房那邊有東西要讓你看。先把這裡看完，再去找我。」\n\n他像是在報欄位：「你到時候別問我『誰』——你先問我『缺哪一欄』。」',
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
              text: '「操作員：高文傑。時間：22:57。操作類型：手動覆寫。」\n\n這份 log 寫得很清楚，每一欄都整齊。但顧乃謙說，原始檔不長這樣。\n\n問題不在這份 log 說了什麼，而在它少說了什麼。',
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
              text: '草稿上寫著：「禁用語：三起事故、跨館、系統性風險。」\n\n「如追問三館：回答『尚在釐清』，不主動提及聯繫。」\n\n這不是防禦媒體。這是在阻止三個案件被串在一起的那個句子被說出來。',
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
              text: '報表的主要焦點是：「三館同日出現在搜尋趨勢，需降低關聯性。」\n\n她在意的不是死者是誰，是這三間影城的名字能不能同時出現在一行字裡。\n\n「一間影城出事是事故，三間一起被聯想，就是品牌問題。」',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'ch3_brand_report_viewed', value: true },
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
    ],
    puzzles: [],
    initialDialog: {
      text: '會議室的空氣是假的，那種高級飯店的香氛，讓人忽略裡面其實沒有窗。\n\n宋雅甄坐在主位，像個封面；張景衡在側邊，像個讓你以為你找到答案的註腳。',
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
        id: 'hotspot_server_gu_naiqian',
        shape: 'circle',
        coords: [0.2, 0.59, 0.125],
        description: '顧乃謙',
        hint: '顧乃謙站在走道中段，看你走過來，把手邊那份記錄往側面翻了一面。',
      },
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
        id: 'hotspot_server_xiazhang',
        shape: 'circle',
        coords: [0.47, 0.88, 0.1],
        description: '小張',
        hint: '放映員小張在走道旁邊看著設備架，表情像個對表格比對人更有感情的人。',
      },
      {
        id: 'hotspot_server_ashun',
        shape: 'circle',
        coords: [0.165, 0.9, 0.08],
        description: '阿順',
        hint: '阿順從大廳過來，還在打量這條走廊。',
      },
    ],
    npcs: [
      {
        id: 'npc_gu_naiqian',
        name: '顧乃謙（系統工程）',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch3_gu_server_idle_1', text: '顧乃謙說：「你看到那份記錄了嗎？那三個時間點。」', type: 'hint', weight: 1 },
          { id: 'ch3_gu_server_idle_2', text: '「系統不會說謊，但系統可以被選擇性地展示。」', type: 'hint', weight: 1 },
          { id: 'ch3_gu_server_idle_3', text: '「你問我，這是不是人為的。我說，有人知道哪裡會一起響。」', type: 'hint', weight: 1 },
        ],
        available: true,
      },
      {
        id: 'npc_xiaozhang',
        name: '小張（放映員）',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch3_xiazhang_idle_1', text: '小張說：「系統設定那種事不是我這層級能做的。需要遠端存取權限。」', type: 'hint', weight: 1 },
          { id: 'ch3_xiazhang_idle_2', text: '「我只管放映，表上寫什麼我就做什麼。問題是表怎麼來的。」', type: 'hint', weight: 1 },
        ],
        available: true,
      },
      {
        id: 'npc_ashun',
        name: '阿順（巡場保全）',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch3_ashun_server_idle_1', text: '阿順說：「機房這條走廊，不是一般員工會來的地方。」', type: 'hint', weight: 1 },
          { id: 'ch3_ashun_server_idle_2', text: '「知道怎麼進機房的人，通常也知道怎麼讓監視器剛好沒在錄。」', type: 'hint', weight: 1 },
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
      hotspot_server_gu_naiqian: 'talk_gu_naiqian_ch3',
      hotspot_server_cross_venue: 'inspect_ch3_cross_venue',
      hotspot_server_network_label: 'inspect_ch3_network_label',
      hotspot_server_remote_login: 'inspect_ch3_remote_login',
      hotspot_server_xiazhang: 'talk_xiazhang_ch3',
      hotspot_server_ashun: 'talk_ashun_ch3_server',
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
              text: '顧乃謙說：「跨館同步不是故障，那比較像……有人知道哪裡會一起響。」\n\n「城市 W 和光芒 R 在同一插件版本序列。這不是預設的標準配置。」\n\n他頓了頓：「你問我這是不是單點故障，我可以很肯定地說：不是。」',
              type: 'character',
              characterId: 'npc_gu_naiqian',
              characterName: '顧乃謙（系統工程）',
              characterExpression: 1,
              characterPosition: 'left',
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
              text: '城市 W 和光芒 R 在三個不同日期，各自出現了同樣的插件版本更新記錄——時間差在 15 分鐘以內。\n\n這不是系統自動同步。同版本、不同館、幾乎同時更新，背後要嘛是同一個操作入口，要嘛是同一個人。',
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
              text: '手寫對照表上：「W-01 城市影城，R-02 光芒影城」——兩個館的設備在同一個子網段。\n\n這不是預設的標準配置，有人在設定網路時，特意讓兩館可以直接溝通。',
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
              text: '維護單最後一筆記錄：「操作人：顧乃謙。說明：W、R 同步確認。」日期是三週前。\n\n他在案發之前就知道這兩館的版本是同步的。\n\n他在等什麼，還是他一直在看著什麼？',
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
              text: '小張說：「大廳牆上寫自動，機房裡還是要人去碰。」\n\n「表上怎麼寫，我就怎麼放。問題是，表不是自己長字。」\n\n他看了看那份維護單：「那種設定不是一般操作員能做的，得有一定的系統權限才行。」',
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
              text: '阿順看了一眼走廊：「如果大廳和機房都能被接手，誰最像熟門熟路的人？」\n\n他停頓了一下：「不是偶爾來的那種，是每次都知道從哪個門進、走哪條路不會被看到的那種。」',
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
    ],
    puzzles: [],
    initialDialog: {
      text: '機房走道比大廳暗，設備架上的指示燈一排一排地閃著。\n\n顧乃謙在等你，手邊那份記錄被紅筆圈了幾行。',
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
        '顧乃謙沉默了幾秒，然後說：「原始 log 裡有兩個欄位，整理版裡沒有。」\n\n「一個是操作來源 IP，一個是覆寫前的原始值。」\n\n「你問我為什麼那份整理版剛好能指向高文傑——因為少了這兩個欄位，你就沒辦法知道那個操作是從本機還是遠端發出來的。」',
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
        '「對。遠端操作的話，你在另一個地方就能觸發。」\n\n「只要有存取權、有那個插件版本、知道哪個指令，你連進去就行。」\n\n他看了一眼走廊：「城市 W 和光芒 R 的設備在同一個子網段。這件事，不是很多人知道。」',
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
        '顧乃謙說：「他拿的是我給他的那份，不是原始檔。」\n\n「我不知道他看沒看懂差異在哪，但我知道他沒有問過我。」\n\n「有時候人不是看不到差異，是選擇不把差異說出來。」',
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
        '顧乃謙把那份跨館記錄放到你眼前：「三個時間點，兩個館，版本更新的間隔在 15 分鐘以內。」\n\n「這不是巧合，也不是自動化——那個版本的插件沒有跨館自動更新的功能。」\n\n「有人手動推了。而且推的人，對兩個館的系統都有存取權。」',
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
        '「理論上可以，前提是拿到原始 log。整理版是拿不到這個資訊的。」\n\n「我們需要那個 IP，需要操作前的版本記錄，需要兩館的維護帳號清單。」\n\n他看著你：「你如果想看那份原始 log，我可以調，但今晚會有很多人睡不好。」',
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
        '他沉默了一下。\n\n「因為我負責跨館維護，那份版本序列是我做的記錄。我只是……覺得不對勁，但那時候還沒有人死。」\n\n「現在有了，所以我讓你看。」',
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
        '劉隊把記錄本翻到某一頁，說：「周姊說白板被擦了兩次。」\n\n「所以螢幕上的殘句我填了一半：」\n「『白板有人擦過兩次。第一次為了______，第二次為了______。』」',
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
      text: '劉隊點頭：「對。改了，然後把改的痕跡也抹掉。這是兩個動作，不是一個。」\n\n「有人很清楚——只要讓它看起來像從來沒動過，就不會有人回頭追。」',
      choices: [{ id: 'ch3_q1_next', label: '（繼續下一題）' }],
    },
    node_liu_ch3_q1_reply_F: {
      id: 'node_liu_ch3_q1_reply_F',
      npcId: 'npc_liu',
      text: '劉隊說：「掩飾不太對，但方向抓到了。重點是第二次的動機——不是要讓別人看不到，是要讓人以為從來就這樣。」',
      choices: [{ id: 'ch3_q1_next', label: '（繼續下一題）' }],
    },
    node_liu_ch3_q1_reply_other: {
      id: 'node_liu_ch3_q1_reply_other',
      npcId: 'npc_liu',
      text: '劉隊說：「周姊說得比你清楚：第一次是為了改，第二次是為了像沒改。兩個動作，先做後掩。」',
      choices: [{ id: 'ch3_q1_next', label: '（繼續下一題）' }],
    },

    // Q2：log 少說了什麼
    node_liu_ch3_q2: {
      id: 'node_liu_ch3_q2',
      npcId: 'npc_liu',
      text:
        '劉隊翻到下一頁：「顧乃謙說整理版和原始 log 有差異。」\n\n「殘句：『這份 log 的問題，不在它說了什麼，而在它______了什麼。』」',
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
      text: '劉隊說：「對。不是全部沒有，是選了哪些要，哪些不要。」\n\n「問題就在『選擇』這個動作上，這不是錯誤，這是決定。」',
      choices: [{ id: 'ch3_q2_next', label: '（繼續下一題）' }],
    },
    node_liu_ch3_q2_reply_AG: {
      id: 'node_liu_ch3_q2_reply_AG',
      npcId: 'npc_liu',
      text: '劉隊說：「接近了。但不是全部被拿走或寫錯，是有人決定某幾個欄位不重要——而那幾個欄位，剛好能讓案件說清楚遠端操作的事。」',
      choices: [{ id: 'ch3_q2_next', label: '（繼續下一題）' }],
    },
    node_liu_ch3_q2_reply_other: {
      id: 'node_liu_ch3_q2_reply_other',
      npcId: 'npc_liu',
      text: '劉隊說：「顧乃謙說，操作來源 IP 和覆寫前的原始值，整理版裡都沒有。缺的不是多，缺的是剛好能讓你問清楚那個操作從哪裡發出來的那幾個欄位。」',
      choices: [{ id: 'ch3_q2_next', label: '（繼續下一題）' }],
    },

    // Q3：跨館同步不是
    node_liu_ch3_q3: {
      id: 'node_liu_ch3_q3',
      npcId: 'npc_liu',
      text:
        '劉隊翻到最後一頁：「顧乃謙說城市 W 和光芒 R 在同一插件版本序列。」\n\n「殘句：『這代表這不是______，而是______。』」',
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
      text: '劉隊說：「對。單點故障可以獨立處理，但版本序列一致，代表背後有共同的操作入口或共同的人。」\n\n「這是系統性問題的定義：不是一個地方壞掉，是有人知道哪裡會一起響。」',
      choices: [{ id: 'ch3_qa_complete', label: '（完成推理討論）' }],
    },
    node_liu_ch3_q3_reply_BE: {
      id: 'node_liu_ch3_q3_reply_BE',
      npcId: 'npc_liu',
      text: '劉隊說：「方向有了，但要更精確一點。重點不是它是不是刻意的，而是它的結構——兩個館，同一條線，這個結構本身就不是單點的問題。」',
      choices: [{ id: 'ch3_qa_complete', label: '（完成推理討論）' }],
    },
    node_liu_ch3_q3_reply_other: {
      id: 'node_liu_ch3_q3_reply_other',
      npcId: 'npc_liu',
      text: '劉隊說：「顧乃謙說：跨館同步不是故障，那比較像有人知道哪裡會一起響。」\n\n「不是單點，不是巧合，是有人同時在兩邊動手——而且知道怎麼動。」',
      choices: [{ id: 'ch3_qa_complete', label: '（完成推理討論）' }],
    },

    // 結尾：章節結語
    node_liu_ch3_outro: {
      id: 'node_liu_ch3_outro',
      npcId: 'npc_liu',
      text:
        '劉隊把記錄本合上：「log 能被整理。」\n\n「這句話寫進去，還是不寫進去，我現在問你。」\n\n他等著你的決定。',
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
        '劉隊把那行字寫進去，然後說：「這種句子寫進去，今晚有些人的手機會響。」\n\n「我知道。但它是真的。」',
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
        '劉隊把那行字寫進去，然後說：「這樣的話，今晚大家都能回家睡覺。」\n\n他停了一下：「但那兩個欄位，我會自己記著。」',
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
