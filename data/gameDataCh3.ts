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
    collectible: false,
  },
  item_promo_wall_text: {
    id: 'item_promo_wall_text',
    name: '宣傳牆文案（口徑矛盾）',
    description:
      '宣傳牆上的文案寫著：「城市影城全系列場館支援分區控制與自動排程，打造最佳觀影體驗。」\n\n但現場口徑是「只開了節能模式，沒有做任何自動控制。」\n\n「可分區」和「可自動」——這兩個功能如果都有，那第一章的「延後亮燈」就不只是疏失，而是有人知道怎麼用這個系統。',
    svgImage: '/svg/items/promo_wall_text.svg',
    svgSize: 'medium',
    collectible: false,
  },
  item_scene_control_sheet: {
    id: 'item_scene_control_sheet',
    name: '前台場控簡表（過期版本）',
    description:
      '前台抽屜裡有一份過期的場控手冊，附著一張臨時簡表。\n\n簡表的第三頁有一個被手寫補注的功能頁：「C4：散場延後照明申請——適用條件：觀眾投訴、特殊活動、VIP場次。」\n\n這一頁原本不在正式版本裡。是誰加進來的？加的時間，比第一章的案發時間還早了三個月。',
    svgImage: '/svg/items/scene_control_sheet.svg',
    svgSize: 'medium',
    collectible: false,
  },

  // 場景二：臨時會議室 / 品牌應對室
  item_filtered_log: {
    id: 'item_filtered_log',
    name: '張景衡整理版 log',
    description:
      '張景衡提供的對外摘要（Summary View），欄位齊全、註解完整，格式符合內部「可轉交通報／可對媒體口徑」範本。\n\n「操作員：高文傑。時間：22:57。操作類型：手動覆寫。結果：照明模式切換。」\n\n顧乃謙只瞥一眼：「這是給人讀的版本。母帶上的欄位不是長這樣。」\n\n差別不在多寫了哪一句，而在哪些欄位在摘要裡**預設就不會出現**。',
    svgImage: '/svg/items/filtered_log.svg',
    svgSize: 'medium',
    collectible: true,
  },
  item_press_draft: {
    id: 'item_press_draft',
    name: '記者應對話術草稿',
    description:
      '一張 A4 草稿，字跡工整，邊角註記「對外溝通—核准用詞 v3」：\n\n「—— 媒體詢問：優先使用『個案處置中』，避免『系統性』等未定義詞彙。\n—— 追問多館關聯：回覆『尚待交叉比對』，不主動延伸敘事。\n—— 建議避免並列：事故件數、館別、時序（以降低不當聯想）。」\n\n最下方補一行：「口徑以法遵與公關雙簽為準。」\n\n你讀得出：這是一份**風險控管的說話地圖**，未必寫「假」，但寫「先別往哪裡講」。',
    svgImage: '/svg/items/press_draft.svg',
    svgSize: 'medium',
    collectible: false,
  },
  item_brand_monitor_report: {
    id: 'item_brand_monitor_report',
    name: '宋雅甄品牌監測報表',
    description:
      '品牌監測報表標題：「輿情熱區—W／R 關鍵字共現分析」。\n\n一欄被手工圈註：「多館關鍵字同日熱度上升—建議**敘事去關聯化**（internal memo）」。\n\n從公關 KPI 來看，這叫**降低不當串聯風險**；從調查看，它至少說明：有人在盯「三館會不會被寫進同一段」。',
    svgImage: '/svg/items/brand_monitor_report.svg',
    svgSize: 'medium',
    collectible: false,
  },

  // 會議室技術角／列印區（與場景二同景）
  item_cross_venue_sync: {
    id: 'item_cross_venue_sync',
    name: '跨館同步異常片段',
    description:
      '顧乃謙列印的系統記錄，紅筆圈了三個時間點。\n\n「城市 W」與「光芒 R」在不同日期出現相同插件版本更新紀錄，時間差在 15 分鐘內。\n\n備註欄他寫：「非內建跨館自動升級路徑；需人工觸發或同一發布管線。」\n\n要證明「同一隻手」還差母帶與操作來源欄位——但時間軸上，兩邊確實**一起動過**。',
    svgImage: '/svg/items/cross_venue_sync.svg',
    svgSize: 'medium',
    collectible: false,
  },
  item_network_device_label: {
    id: 'item_network_device_label',
    name: '網路設備標籤與館別代號對照',
    description:
      '會議室邊桌旁立著小型設備架，標籤邊夾著一份手寫的館別代號對照表（像從列印區順手貼過來的）：\n\n「W-01：城市影城（本館）\nR-02：光芒影城（遠端）\nM-03：明星影城（遠端）」\n\nW 和 R 的設備在同一個子網段。這不是預設的標準配置——有人在設定網路時，特意讓兩館可以直接溝通。',
    svgImage: '/svg/items/network_device_label.svg',
    svgSize: 'medium',
    collectible: false,
  },
  item_remote_login_sheet: {
    id: 'item_remote_login_sheet',
    name: '遠端登入維護單',
    description:
      '遠端登入申請與審核流程表（影印本）。\n\n最後一筆：三週前，操作人顧乃謙，說明欄「插件版本序列比對—W／R 同步確認」。\n\n屬例行維護紀錄；能確定的是：技術端**早就在追**兩館版本是否同一步。\n\n至於當時是否已察覺異常，單子上不會寫。',
    svgImage: '/svg/items/remote_login_sheet.svg',
    svgSize: 'medium',
    collectible: false,
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
    description: '城市影城的大廳被封鎖了，前台空無一人；品牌與影城的人已進臨時會議室，外頭只剩封鎖線與物件。劉隊站在角落等你對齊任務。',
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
          { id: 'ch3_liu_idle_1', text: '「裡面的人先談一輪，進會議室聽完，回來跟我講你聽到啥。」', type: 'hint', weight: 1 },
          { id: 'ch3_liu_idle_2', text: '劉隊掃一眼大廳：「品牌那邊講話你聽就懂，總是在擋什麼。」', type: 'hint', weight: 1 },
          { id: 'ch3_liu_casual_1', text: '劉隊揉眉心：「我今晚咖啡喝太多，耳朵還在。」', type: 'casual', weight: 2 },
          { id: 'ch3_liu_casual_2', text: '「你盡量別被他們帶去『情緒穩定』那套，穩定有時候只是關音量。」', type: 'casual', weight: 2 },
          { id: 'ch3_liu_casual_3', text: '他朝會議室方向抬下巴：「顧乃謙在裡頭技術角，口氣很糟，但應該可以問出什麼。」', type: 'hint', weight: 2 },
          { id: 'ch3_liu_casual_4', text: '「記著：我們要的是紀錄怎麼被捏，不是誰比較會道歉。」', type: 'casual', weight: 1 },
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
              text: '劉隊壓著嗓門：「品牌端在，對外話術先到位。顧乃謙在會議室裡——技術角、列印出來的紀錄都在同一間。」\n\n「我要的是：紀錄被動過幾次、動在什麼欄位、對外那份**缺了什麼**。」\n\n「順序：大廳白板、牆上字、抽屜；再進應對室對張景衡的摘要，跟顧乃謙對母帶欄位；技術邊桌的跨館與網路單最後對。」',
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
    ],
    puzzles: [],
    initialDialog: {
      text: '大廳拉線封了，宣傳牆燈還全開，亮得像要拍廣告；裡頭會議室的人聲被門板悶成一片嗡嗡。\n\n劉隊講一句：這種地方，話比燈還黑。',
      type: 'narrator',
    },
  },

  // ──────────────────────────────────────────────
  // 場景二：臨時會議室 / 品牌應對室（含原機房走道技術角／列印區）
  // ──────────────────────────────────────────────
  scene_ch3_brand_room: {
    id: 'scene_ch3_brand_room',
    chapterId: 'ch3',
    name: '臨時會議室',
    description: '品牌方把這間小會議室當成應對中心。宋雅甄坐在主位，張景衡在側邊整理文件；顧乃謙守在角落技術角，邊桌與列印區擺著跨館紀錄與設備標籤。林瑞堂、周姊、阿順、小張也在室內待命。',
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
      {
        id: 'hotspot_server_cross_venue',
        shape: 'circle',
        coords: [0.84, 0.46, 0.095],
        description: '跨館同步列印紀錄（邊桌）',
        hint: '一份列印的系統記錄，幾行被紅筆圈起來，城市 W 和光芒 R 的版本更新時間差在 15 分鐘以內。',
      },
      {
        id: 'hotspot_server_network_label',
        shape: 'circle',
        coords: [0.12, 0.58, 0.09],
        description: '網路設備標籤（邊桌）',
        hint: '小型設備架上的標籤旁邊有一份手寫對照表，W 和 R 的設備在同一個子網段。',
      },
      {
        id: 'hotspot_server_remote_login',
        shape: 'circle',
        coords: [0.86, 0.72, 0.09],
        description: '遠端登入維護單',
        hint: '夾在邊桌側的維護單影印本，最後一筆記錄是三週前，操作人是顧乃謙。',
      },
      {
        id: 'hotspot_fun_ch3_server_led',
        shape: 'circle',
        coords: [0.92, 0.32, 0.065],
        description: '閃爍燈號',
        hint: '某一顆燈特別愛刷存在感。',
      },
      {
        id: 'hotspot_fun_ch3_server_cable',
        shape: 'circle',
        coords: [0.52, 0.14, 0.065],
        description: '整線束帶',
        hint: '束帶咬得很緊，像有人在跟混亂談判。',
      },
      {
        id: 'hotspot_fun_ch3_server_sticker',
        shape: 'circle',
        coords: [0.68, 0.4, 0.06],
        description: '機櫃貼紙',
        hint: '「非授權勿動」——通常表示大家都動過一點。',
      },
      {
        id: 'hotspot_fun_ch3_server_floor_tile',
        shape: 'circle',
        coords: [0.22, 0.9, 0.075],
        description: '地磚接縫',
        hint: '空調風從桌下鑽上來，提醒你這角落不是給觀眾發呆用的。',
      },
      {
        id: 'hotspot_fun_ch3_server_exit_sign',
        shape: 'circle',
        coords: [0.42, 0.08, 0.055],
        description: '出口指示牌',
        hint: '綠色小人跑得好急，像也聽懂了今晚的節奏。',
      },
    ],
    npcs: [
      {
        id: 'npc_song_yazhen',
        name: '宋雅甄（品牌長）',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch3_song_idle_1', text: '宋雅甄語氣很平：「今晚對外只能有一個核准敘事。你先想清楚用詞，大家才好接。」', type: 'hint', weight: 1 },
          { id: 'ch3_song_idle_2', text: '「媒體問到跨館，我們回『交叉比對中』。別幫他們把句子串成標題。」', type: 'hint', weight: 1 },
          { id: 'ch3_song_casual_1', text: '她理一下袖口：「我講慢一點，是怕有人脫口未定案的話。」', type: 'casual', weight: 2 },
          { id: 'ch3_song_casual_2', text: '「現場員工也要下班。你一句話，明天他們會被記者堵在門口。」', type: 'casual', weight: 2 },
          { id: 'ch3_song_casual_3', text: '宋雅甄眨眼：「咖啡要嗎？不加糖。」', type: 'casual', weight: 1 },
          { id: 'ch3_song_casual_4', text: '「有些字不能同時出現——不是秘密，是**風險控管**。」', type: 'hint', weight: 2 },
        ],
        available: true,
      },
      {
        id: 'npc_zhang_jingheng',
        name: '張景衡（品牌特助）',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch3_zhang_idle_1', text: '張景衡揚揚紙：「這份是對外可引用摘要。原始 bundle 要走稽核；母帶欄位問顧乃謙。」', type: 'hint', weight: 1 },
          { id: 'ch3_zhang_idle_2', text: '「警方要的是**可簽核**的說法。不是比較嚇人，是比較好結案。」', type: 'hint', weight: 1 },
          { id: 'ch3_zhang_casual_1', text: '他把夾子敲敲桌角：「我負責把雜訊壓到讀者看得懂。」', type: 'casual', weight: 2 },
          { id: 'ch3_zhang_casual_2', text: '「原始資料不是不能看，是看了要有人扛。**簽收**在誰那邊，問那邊。」', type: 'casual', weight: 2 },
          { id: 'ch3_zhang_casual_3', text: '張景衡看螢幕：「你問愈細，我愈要先確認**法遵**。」', type: 'hint', weight: 2 },
          { id: 'ch3_zhang_casual_4', text: '「母帶？走申請。我這邊只有**已篩過**的欄位。」', type: 'casual', weight: 1 },
        ],
        available: true,
      },
      {
        id: 'npc_gu_naiqian',
        name: '顧乃謙（系統工程）',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch3_gu_brand_idle_1', text: '顧乃謙盯著筆電：「摘要欄位是模板長的。你要 lineage，去 raw retention。」', type: 'hint', weight: 1 },
          { id: 'ch3_gu_server_idle_1', text: '顧乃謙敲敲紙：「三個時間點，對過沒。」', type: 'hint', weight: 1 },
          { id: 'ch3_gu_server_idle_2', text: '「機器只記錄。顯示給誰看，是另一層。」', type: 'hint', weight: 1 },
          { id: 'ch3_gu_brand_casual_1', text: '「香氛開很強。有些人會把『好聞』當成『沒事』。」', type: 'casual', weight: 2 },
          { id: 'ch3_gu_server_casual_1', text: '「角落空調很強，列印區更乾。」', type: 'casual', weight: 2 },
          { id: 'ch3_gu_server_casual_2', text: '他把紅筆蓋起來：「圈的是**缺口**，不是結論。」', type: 'casual', weight: 2 },
          { id: 'ch3_gu_brand_casual_4', text: '顧乃謙淡淡：「少欄位不是 bug，是 view 定義。」', type: 'hint', weight: 2 },
          { id: 'ch3_gu_server_idle_3', text: '「兩邊一起跳，路由表上早寫了。」', type: 'hint', weight: 1 },
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
      {
        id: 'npc_ashun',
        name: '阿順（巡場保全）',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch3_ashun_lobby_idle_1', text: '「熟的臉今晚全裝不熟，我看了都想笑。」', type: 'hint', weight: 1 },
          { id: 'ch3_ashun_server_idle_1', text: '阿順壓聲：「這角落平常沒人晃，會來的都不是路過。」', type: 'hint', weight: 1 },
          { id: 'ch3_ashun_lobby_casual_1', text: '阿順聳肩：「我今晚步數破表，都在躲鏡頭。」', type: 'casual', weight: 2 },
          { id: 'ch3_ashun_server_casual_2', text: '阿順聳肩：「燈一顆顆亮，像有人在呼吸。」', type: 'casual', weight: 2 },
          { id: 'ch3_ashun_server_idle_2', text: '「會開機房門的，多半也曉得鏡頭啥時在睡覺。」', type: 'hint', weight: 1 },
          { id: 'ch3_ashun_server_casual_4', text: '「你要找不見光的人，先找不見光的角落。」', type: 'hint', weight: 2 },
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
          { id: 'ch3_xiazhang_casual_2', text: '小張看著燈：「技術角這邊比放映室還吵，吵在腦子裡。」', type: 'casual', weight: 2 },
          { id: 'ch3_xiazhang_casual_3', text: '「我寧願對著時間碼，也不要對著記者。」', type: 'casual', weight: 1 },
          { id: 'ch3_xiazhang_casual_4', text: '「權限兩個字，聽起來像咒語。」', type: 'hint', weight: 2 },
        ],
        available: true,
      },
    ],
    items: [
      items.item_filtered_log,
      items.item_press_draft,
      items.item_brand_monitor_report,
      items.item_cross_venue_sync,
      items.item_network_device_label,
      items.item_remote_login_sheet,
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
        id: 'talk_song_ch3',
        name: '問宋雅甄',
        description: '詢問品牌長宋雅甄。',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '宋雅甄語氣很穩：「今晚對外只有一個核准口徑。未定案前，我不會讓現場同事被一句話拖去當頭條。」\n\n「多館關鍵字一旦同屏，股東會問的是**治理**，不是案情。」\n\n「你查你的，我守的是**可發表**與**可收束**——兩邊別互相踩線。」\n\n她停一下：「我們都想收場，只是**收場的定義**不一樣。」',
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
              text: '張景衡把紙推過來：「這是對外摘要，欄位已對齊範本。」\n\n「原始 bundle 要走稽核；母帶欄位在顧乃謙那邊對。不是不能，是**要簽**。」\n\n「警方要的是可結案敘事；我們給的是**可引用**版本。」\n\n他抬眼：「你先決定要哪一種『清楚』。」',
              type: 'character',
              characterId: 'npc_zhang_jingheng',
              characterName: '張景衡（品牌特助）',
              characterExpression: 1,
              characterPosition: 'right',
              choices: [
                { id: 'ch3_open_compare_ui', text: '對照整理版與技術角讀到的原始殘留' },
                { id: 'close_only', text: '稍後再說' },
              ],
            },
          },
          { type: 'setFlag', flag: 'ch3_zhang_talked', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'talk_gu_brand_ch3',
        name: '問顧乃謙（會議室）',
        description: '詢問系統工程師顧乃謙；首次對話含欄位與跨館技術要點。',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '顧乃謙沒抬頭：「我這邊回的是欄位定義，不是動機。」\n\n「摘要今天能簽；母帶要 raw 權限與稽核窗口。別問我是誰——先問**缺哪一欄**。」\n\n他補一句，視線掃向邊桌列印：「跨館一起跳，不叫故障，叫有人曉得兩邊會一起響。W 跟 R 同一串版本，標準架構不會這樣裝。問我是不是單點？不是。」',
              type: 'character',
              characterId: 'npc_gu_naiqian',
              characterName: '顧乃謙（系統工程）',
              characterExpression: 1,
              characterPosition: 'right',
            },
          },
          { type: 'setFlag', flag: 'ch3_gu_brand_talked', value: true },
          { type: 'setFlag', flag: 'ch3_gu_server_talked', value: true },
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
        id: 'inspect_ch3_filtered_log',
        name: '查看整理版 log',
        description: '閱讀張景衡提供的 log 報告。',
        requirements: [],
        effects: [
          { type: 'addItem', itemId: 'item_filtered_log' },
          {
            type: 'showDialog',
            dialog: {
              text: '紙上：高文傑、22:57、手動覆寫——欄位對齊得像簡報。\n\n顧乃謙只一句：「母帶欄位不是這樣。」\n\n差異在**沒有出現在摘要裡**的幾格。',
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
          {
            type: 'showDialog',
            dialog: {
              text: '草稿用詞表：避免「系統性」「多館」並列；建議用「個案處置」「交叉比對中」。\n\n追問三館？回「尚待釐清」，不主動提供敘事串聯。\n\n你讀的是**對外溝通邊界**，不是劇情大綱。',
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
          {
            type: 'showDialog',
            dialog: {
              text: '報表紅字：多館關鍵字同日熱度上升—「建議敘事去關聯化」。\n\nKPI 寫的是**聲量結構**，不是誰該負責。\n\n但你看懂了：有人在盯「三館會不會被寫進同一段」。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'ch3_brand_report_viewed', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'inspect_ch3_cross_venue',
        name: '查看跨館同步異常片段',
        description: '檢視顧乃謙圈出來的系統記錄（邊桌列印）。',
        requirements: [{ type: 'hasFlag', flag: 'ch3_log_compare_done', value: true }],
        effects: [
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
        description: '檢視邊桌設備架上的館別代號對照。',
        requirements: [{ type: 'hasFlag', flag: 'ch3_log_compare_done', value: true }],
        effects: [
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
        description: '檢視邊桌旁的維護單影印本。',
        requirements: [{ type: 'hasFlag', flag: 'ch3_log_compare_done', value: true }],
        effects: [
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
        id: 'talk_xiazhang_ch3',
        name: '問小張',
        description: '詢問放映員小張。',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '小張搓手：「牆上寫自動，系統還不是要人按。」\n\n「表寫啥我放啥，表不會自己長字啦。」\n\n他瞄維護單：「那種設定我這層級碰不到，要權限的。」',
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
        name: '問阿順（會議室）',
        description: '詢問巡場保全阿順在技術角附近的觀察。',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '阿順瞇眼：「大廳也摸、後台也摸的，不是觀光客。」\n\n「是那種每次都知道走哪扇門、鏡頭看不到哪段的——我講到這裡就好。」',
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
      {
        id: 'ch3_check_report_ready',
        name: '檢查是否可向劉隊報告',
        description: '第三章里程碑達成後，解鎖向劉隊報告入口。',
        requirements: [
          { type: 'hasFlag', flag: 'ch3_milestone_whiteboard', value: true },
          { type: 'hasFlag', flag: 'ch3_milestone_brand_script', value: true },
          { type: 'hasFlag', flag: 'ch3_milestone_cross_venue', value: true },
          { type: 'hasFlag', flag: 'ch3_log_compare_done', value: true },
        ],
        effects: [{ type: 'setFlag', flag: 'ch3_liu_report_ready', value: true }],
        oneTime: true,
      },
    ],
    puzzles: [],
    initialDialog: {
      text: '一進門就聞到會議室香氛，濃得讓人想起「對外口徑」四個字。\n\n宋雅甄坐中間，張景衡旁邊文件排得整齊；顧乃謙佔著角落技術角，邊桌堆著列印紀錄與標籤。林瑞堂、周姊、阿順、小張也在——大廳那套體面話，進門就換成另一種緊繃。',
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
        '顧乃謙停幾秒：「母帶上固定有兩欄，你那份摘要裡沒有。」\n\n「操作來源 IP、覆寫前原值——對外模板不顯示，不代表系統沒記。」\n\n「高文傑會被指到，是因為摘要只留得住『誰的帳號』這種乾淨答案。」',
      choices: [
        {
          id: 'gu_s1_q1',
          label: '遠端操作——意思是不用親自在場？',
          effects: [{ type: 'setFlag', flag: 'ch3_gu_s1_q1', value: true }],
        },
        {
          id: 'gu_s1_q2',
          label: '張景衡知道那兩個欄位的事嗎？',
          effects: [{ type: 'setFlag', flag: 'ch3_gu_s1_q2', value: true }],
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
        '「遠端的意思是：人不必在機房，也能下得到指令。」\n\n「權限、版本、指令鏈對了，連線成立。」\n\n他目光掠過設備標籤：「W 跟 R 同子網——**路由表上寫得出來**，只是很少人去看。」',
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
        '「他手上那份，是轉出用的摘要。」\n\n「母帶在我這邊的定義裡。他若沒來對欄位，我當然不會替他補。」\n\n「**沒看到**可以有很多原因；別混成一種。」',
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
        '顧乃謙把紙拍桌上：「三個時間點，兩個館，更新落在十五分鐘內。」\n\n「內建路徑沒寫自動跨館升級——那就是**發布管線**或**人工觸發**。」\n\n「兩邊都能進同一套版本，代表入口早就共用。」',
      choices: [
        {
          id: 'gu_s2_q1',
          label: '能查出那個人是誰嗎？',
          effects: [{ type: 'setFlag', flag: 'ch3_gu_s2_q1', value: true }],
        },
        {
          id: 'gu_s2_q2',
          label: '你為什麼在案發前就知道這件事？',
          effects: [{ type: 'setFlag', flag: 'ch3_gu_s2_q2', value: true }],
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
        '「查得到，前提母帶齊。」\n\n「IP、版本紀錄、兩邊維護帳號——摘要不會替你長出來。」\n\n他看你一眼：「要我開稽核鏈，**今晚時程**你自己估。」',
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
        '他沉默一下。\n\n「跨館維護我負責，版本紀錄在我這邊。案發前就做過比對——**例行**。」\n\n「你要我把話說滿？等你拿得到母帶再談。」',
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
        },
        {
          id: 'ch3_q2_B',
          label: 'B. 選擇性地遺漏',
          effects: [
            { type: 'setFlag', flag: 'ch3_q2_answer', value: 'B' },
            { type: 'setFlag', flag: 'ch3_q2_main_correct', value: true },
            { type: 'setFlag', flag: 'ch3_q2_done', value: true },
          ],
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
        },
        {
          id: 'ch3_q3_B',
          label: 'B. 偶發事件 / 有人刻意安排的結果',
          effects: [
            { type: 'setFlag', flag: 'ch3_q3_answer', value: 'B' },
            { type: 'setFlag', flag: 'ch3_q3_partial_correct', value: true },
            { type: 'setFlag', flag: 'ch3_q3_done', value: true },
          ],
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
        },
        {
          id: 'ch3_outro_use_filtered',
          label: '先用整理版——「現有資料指向高文傑個別操作，尚無跨館系統性問題之直接證據。」',
          effects: [
            { type: 'setFlag', flag: 'ch3_outro_use_filtered', value: true },
            { type: 'setFlag', flag: 'ch3_reasoning_done', value: true },
          ],
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
