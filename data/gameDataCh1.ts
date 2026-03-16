import { Scene, Item, NpcDialogNode } from '@/types/game';

// ch1 道具
const items: Record<string, Item> = {
  // 第一章：城市影城（命案現場）
  'item_ticket_stub': {
    id: 'item_ticket_stub',
    name: '電影票根',
    description: '一張死者遺留的票根，靜靜躺在地上。\n\n座位號碼：H排12號\n場次時間：22:30。',
    svgImage: '/svg/items/ticket_stub.svg',
    svgSize: 'medium',
    collectible: true,
  },
  'item_black_plastic_fragment': {
    id: 'item_black_plastic_fragment',
    name: '黑色塑膠碎片',
    description: '周姊在洗手台下方發現的一小片黑色塑膠。\n\n邊緣不規則，材質像橡膠或塑膠。',
    svgImage: '/svg/items/black_plastic_fragment.svg',
    svgSize: 'small',
    collectible: true,
  },
};

// ch1 場景
const scenes: Record<string, Scene> = {
    'scene_ch1_cinema_a_hall': {
    id: 'scene_ch1_cinema_a_hall',
    chapterId: 'ch1',
    name: '城市影城 放映廳',
    description: '散場後的人們很吵。塑膠杯、手機光、鞋底黏住地毯的聲音。可這個人死得太安靜。',
    background: '/images/bg_ch1_cinema_a_hall_v1.webp',
    hotspots: [
      {
        id: 'hotspot_ticket_stub',
        shape: 'circle',
        coords: [0.675, 0.895, 0.20],
        description: '地上的電影票根',
        hint: '一張死者遺留的票根，靜靜躺在地上。',
      },
      // 好笑無意義互動點（放映廳）
      { id: 'hotspot_fun_popcorn', shape: 'circle', coords: [0.85, 0.86, 0.51], description: '爆米花殘渣', hint: '地上有幾顆沒吃完的爆米花。' },
      { id: 'hotspot_fun_cup', shape: 'circle', coords: [0.095, 0.755, 0.15], description: '空飲料杯', hint: '一個空杯還插著吸管。' },
      { id: 'hotspot_fun_jacket', shape: 'circle', coords: [0.065, 0.835, 0.31], description: '椅背上的外套', hint: '一件外套掛在椅背上。' },
      { id: 'hotspot_fun_screen_dust', shape: 'circle', coords: [0.845, 0.575, 0.575], description: '銀幕邊角', hint: '銀幕邊角有一小塊灰。' },
      { id: 'hotspot_fun_ac', shape: 'circle', coords: [0.51, 0.155, 1.5], description: '冷氣出風口', hint: '冷氣呼呼吹。' },
      { id: 'hotspot_fun_exit_sign', shape: 'circle', coords: [0.145, 0.65, 0.575], description: '散場告示', hint: '「散場請依序離場」。' },
      { id: 'hotspot_fun_seat_number', shape: 'circle', coords: [0.175, 0.9325, 0.295], description: '電影院座椅', hint: '非常舒適的座椅。' },
      { id: 'hotspot_fun_carpet_stain', shape: 'circle', coords: [0.38, 0.71, 0.075], description: '地毯污漬', hint: '地毯上有一小塊深色污漬。' },
      { id: 'hotspot_fun_popcorn_bucket', shape: 'circle', coords: [0.41, 0.94, 0.305], description: '空爆米花桶', hint: '一個倒地的空爆米花桶。' },
      {
        id: 'hotspot_victim_seat',
        shape: 'circle',
        coords: [0.54, 0.8, 0.4],
        description: '死者座位',
        hint: 'H 排 12 號。散場後唯一沒有站起來的那個位子。',
      },
    ],
    items: [
      items.item_ticket_stub,
    ],
    hotspotEventMap: {
      'hotspot_ticket_stub': 'examine_ticket_stub',
      'hotspot_fun_popcorn': 'fun_popcorn',
      'hotspot_fun_cup': 'fun_cup',
      'hotspot_fun_jacket': 'fun_jacket',
      'hotspot_fun_screen_dust': 'fun_screen_dust',
      'hotspot_fun_ac': 'fun_ac',
      'hotspot_fun_exit_sign': 'fun_exit_sign',
      'hotspot_fun_seat_number': 'fun_seat_number',
      'hotspot_fun_carpet_stain': 'fun_carpet_stain',
      'hotspot_fun_popcorn_bucket': 'fun_popcorn_bucket',
      'hotspot_victim_seat': 'observe_victim_seat',
    },
    events: [
      {
        id: 'observe_victim_seat',
        name: '觀察死者座位',
        description: 'KK 旁白。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'hotspot_victim_seat' },
          { type: 'custom', customCheck: (state) => !state.flags.observed_victim_seat },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: 'H 排 12 號。散場後唯一沒有站起來的那個位子。椅背微微後傾，像有人還坐在那裡，只是再也不會動了。周圍的座位都空了，只有這裡留下一個人的形狀。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'observed_victim_seat', value: true },
          { type: 'setFlag', flag: 'observed_any_ch1', value: true },
          { type: 'setFlag', flag: 'projection_room_unlocked', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'examine_ticket_stub',
        name: '檢查電影票根',
        description: '你檢查地上的電影票根。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'hotspot_ticket_stub' },
        ],
        effects: [
          { type: 'addItem', itemId: 'item_ticket_stub' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：電影票根\n\n一張死者遺留的票根，靜靜躺在地上。\n\n座位號碼：H排12號\n場次時間：22:30\n\n票根邊緣整齊，像是被人小心處理過。',
              type: 'item',
            },
          },
          { type: 'setFlag', flag: 'ticket_stub_collected', value: true },
          { type: 'setFlag', flag: 'observed_any_ch1', value: true },
        ],
        oneTime: true,
      },
      // 好笑無意義互動（放映廳）
      { id: 'fun_popcorn', name: '爆米花殘渣', description: '無意義互動', requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_popcorn' }], effects: [{ type: 'showDialog', dialog: { text: '地上有幾顆沒吃完的爆米花。你忍不住想：最後一場電影，有人連結局都沒看完。', type: 'narrator' } }], oneTime: false },
      { id: 'fun_cup', name: '空飲料杯', description: '無意義互動', requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_cup' }], effects: [{ type: 'showDialog', dialog: { text: '一個空杯還插著吸管。上面印著「中杯可樂」。至少兇手不是大杯派。', type: 'narrator' } }], oneTime: false },
      { id: 'fun_jacket', name: '椅背上的外套', description: '無意義互動', requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_jacket' }], effects: [{ type: 'showDialog', dialog: { text: '一件外套掛在椅背上。主人大概忘了帶走。或者，再也不會回來拿。', type: 'narrator' } }], oneTime: false },
      { id: 'fun_screen_dust', name: '銀幕邊角', description: '無意義互動', requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_screen_dust' }], effects: [{ type: 'showDialog', dialog: { text: '銀幕邊角有一小塊灰。不影響破案。但你有點想把它擦掉。', type: 'narrator' } }], oneTime: false },
      { id: 'fun_ac', name: '冷氣出風口', description: '無意義互動', requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_ac' }], effects: [{ type: 'showDialog', dialog: { text: '冷氣呼呼吹。你突然想：如果案發那天冷氣壞了，兇手會不會更焦慮？', type: 'narrator' } }], oneTime: false },
      { id: 'fun_exit_sign', name: '散場告示', description: '無意義互動', requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_exit_sign' }], effects: [{ type: 'showDialog', dialog: { text: '「散場請依序離場」。大家都依序了。除了一個人。', type: 'narrator' } }], oneTime: false },
      { id: 'fun_seat_number', name: '電影院座椅', description: '無意義互動', requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_seat_number' }], effects: [{ type: 'showDialog', dialog: { text: '你盯著電影院座椅看了三秒。你開始認真考慮要不要把椅子帶回去當紀念。不，你沒有。你是專業的。', type: 'narrator' } }], oneTime: false },
      { id: 'fun_carpet_stain', name: '地毯污漬', description: '無意義互動', requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_carpet_stain' }], effects: [{ type: 'showDialog', dialog: { text: '你蹲下來聞了聞。……你立刻站起來，並決定這一段不會出現在任何正式紀錄裡。可樂。一定是可樂。', type: 'narrator' } }], oneTime: false },
      { id: 'fun_popcorn_bucket', name: '空爆米花桶', description: '無意義互動', requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_popcorn_bucket' }], effects: [{ type: 'showDialog', dialog: { text: '你盯著空桶看了很久。如果兇手當時正在吃爆米花，他會選鹹的還是甜的？……你揉了揉太陽穴。該休息了。', type: 'narrator' } }], oneTime: false },
    ],
    puzzles: [
      // 第一章章末：推理題（字詞排列，完成設 ch1_reasoning_done）
      {
        id: 'ch1_reasoning_3',
        type: 'arrangement',
        solution: ['手套', '碎片', '留在', '洗手台', '下方'],
        hint: '請將打亂的字詞排成一句與案情有關的完整句子。',
        requirements: [],
        config: { distractors: ['可能', '似乎', '廁所', '鏡子', '垃圾桶'] },
        onSolve: [
          { type: 'setFlag', flag: 'ch1_reasoning_done', value: true },
        ],
      },
    ],
    initialDialog: {
      text: '散場後，人群聲很吵。塑膠杯、手機光、鞋底黏住地毯的聲音。可那個人死得太安靜。\n\n現場封著。品牌、技術都通知了。看到什麼照實說。',
      type: 'narrator',
    },
    npcs: [
      {
        id: 'npc_lin_ruitang',
        name: '林瑞堂（副理）',
        portrait: '/svg/characters/lin_ruitang.svg',
        randomDialogs: [
          {
            id: 'casual_1',
            text: '「辛苦你跑一趟，真的……我們也很遺憾啦。流、流程該做的都有做喔。」',
            type: 'casual',
            weight: 3,
          },
          {
            id: 'casual_2',
            text: '「今天其實人不多嘛，照理說……應該是個案啦。這種事通常不會追到個人啊。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_3',
            text: '「我們都有 SOP 啦，清場、巡場什麼的，盡量照規矩來喔。這是制度嘛。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_4',
            text: '「現在大家都很緊張……拜託喔，你也別把事情講得太可怕。我們能配合的都會配合啦。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_5',
            text: '「如果你需要資料，我都能給喔。可是很多事……呃，上面有上面的考量嘛。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_6',
            text: '「我們跟警方都配合到底了啦。拜託別再擴大……對大家都好嘛。真的。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_7',
            text: '「你要查什麼跟我說喔。流程怎麼寫，我就怎麼站嘛。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_8',
            text: '「影城這幾年很不容易啊……再來一個負面，大家都不用玩了啦。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_9',
            text: '「規矩是規矩嘛，現場總有狀況喔。我們盡量啦。」',
            type: 'casual',
            weight: 2,
          },
        ],
        available: true,
      },
      {
        id: 'npc_liu',
        name: '劉隊（偵查隊）',
        portraitExpression: 1,
        randomDialogs: [
          {
            id: 'ch1_briefing',
            text: '「現場封著。品牌、技術都通知了。看到什麼照實說，要不要往下挖我們再決定。就這樣。」',
            type: 'hint',
            weight: 1,
          },
        ],
        available: true,
        availabilityRequirement: {
          type: 'hasFlag',
          flag: 'ch1_liu_mid_shown',
          value: true,
        },
      },
      {
        id: 'npc_ashun',
        name: '阿順（巡場保全）',
        portrait: '/svg/characters/asu.svg',
        randomDialogs: [
          {
            id: 'casual_1',
            text: '「散場後那一兩分鐘喔，誰都看，又誰都沒看。走道像水流啦，沒人會停的。」',
            type: 'casual',
            weight: 3,
          },
          {
            id: 'casual_2',
            text: '「散場最亂的不是人，是垃圾嘛。人一走，滿地都是啊。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_3',
            text: '「電影結束那段最暗啦，大家眼睛還沒醒，什麼都看不清喔。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_4',
            text: '「你要找兇手？那種事我哪知道喔，我就負責疏導而已嘛。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_5',
            text: '「散場那幾分鐘人都在動啊，我們也是跟著人潮走嘛。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_6',
            text: '「我每天走同一條路啦。哪裡有問題，心裡有數喔。自己清楚。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_7',
            text: '「清場是 SOP 啊，但總有人慢一點、快一點嘛。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_8',
            text: '「死角？心裡有數啦。自己清楚就好喔。」',
            type: 'casual',
            weight: 2,
          },
        ],
        available: true,
      },
    ],
  },


    // 可探索空間二：播映室
  'scene_ch1_projection_room': {
    id: 'scene_ch1_projection_room',
    chapterId: 'ch1',
    name: '播映室',
    description: '播映室裡，控制台和設備都在正常運作。但在這片正常中，有什麼被改動過。',
    background: '/images/bg_ch1_projection_room_v1.webp',
    hotspots: [
      {
        id: 'hotspot_screening_schedule',
        shape: 'circle',
        coords: [0.13, 0.3155, 0.65],
        description: '播映時間表',
        hint: '一張播映時間表，上面有塗改的痕跡；某一欄被劃掉，旁邊用紅筆寫了新的時間。',
      },
      {
        id: 'hotspot_light_control_panel',
        shape: 'circle',
        coords: [0.215, 0.4435, 0.3],
        description: '燈控面板',
        hint: '燈控面板旁的紀錄；開關指在手動那一側。',
      },
      {
        id: 'hotspot_projector_notes',
        shape: 'circle',
        coords: [0.465, 0.4365, 0.275],
        description: '放映員的筆記',
        hint: '一張便條紙貼在控制台上。字跡匆忙，但內容清楚。',
      },
      {
        id: 'hotspot_security_monitor',
        shape: 'circle',
        coords: [0.585, 0.455, 0.3],
        description: '監視器畫面',
        hint: '監視器畫面正在播放案發當晚的錄影。昏暗的光線裡，畫面有人影晃動。',
      },
      // 好笑無意義互動（播映室）
      { id: 'hotspot_fun_coffee', shape: 'circle', coords: [0.3505, 0.3885, 0.275], description: '咖啡杯', hint: '小張的咖啡杯。' },
      { id: 'hotspot_fun_snack', shape: 'circle', coords: [0.82, 0.375, 0.1], description: '零食袋', hint: '一包沒吃完的洋芋片。' },
      { id: 'hotspot_fun_chair_wheel', shape: 'circle', coords: [0.19, 0.595, 0.575], description: '椅子輪子', hint: '控制椅的輪子。' },
      { id: 'hotspot_fun_chair_wheel_2', shape: 'circle', coords: [0.835, 0.595, 0.575], description: '椅子輪子', hint: '控制椅的輪子。' },
      { id: 'hotspot_fun_sticker', shape: 'circle', coords: [0.255, 0.365, 0.08], description: '按鈕上的貼紙', hint: '某個按鈕上貼著「勿按」。' },
      { id: 'hotspot_fun_remote', shape: 'circle', coords: [0.255, 0.295, 0.1], description: '冷氣遙控器', hint: '冷氣遙控器。' },
      { id: 'hotspot_fun_magazine', shape: 'circle', coords: [0.915, 0.375, 0.1], description: '舊雜誌', hint: '一本過期的電影雜誌。' },
      { id: 'hotspot_fun_whiteboard', shape: 'circle', coords: [0.51, 0.225, 1.375], description: '白板', hint: '白板上畫著一個笑臉。' },
    ],
    items: [], // 第一章道具精簡：時間表／筆記／燈控改為僅檢視、不進背包
    hotspotEventMap: {
      'hotspot_screening_schedule': 'examine_screening_schedule',
      'hotspot_light_control_panel': 'examine_light_control',
      'hotspot_projector_notes': 'examine_projector_notes',
      'hotspot_security_monitor': 'view_security_monitor',
      'hotspot_fun_coffee': 'fun_coffee',
      'hotspot_fun_snack': 'fun_snack',
      'hotspot_fun_chair_wheel': 'fun_chair_wheel',
      'hotspot_fun_chair_wheel_2': 'fun_chair_wheel_2',
      'hotspot_fun_sticker': 'fun_sticker',
      'hotspot_fun_remote': 'fun_remote',
      'hotspot_fun_magazine': 'fun_magazine',
      'hotspot_fun_whiteboard': 'fun_whiteboard',
    },
    events: [
      {
        id: 'examine_screening_schedule',
        name: '檢查播映時間表',
        description: '你檢查播映時間表，發現被塗改過。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'hotspot_screening_schedule' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '播映時間表（塗改）\n\n一張播映時間表，上面有塗改的痕跡。\n\n原本某一欄被劃掉，旁邊用紅筆寫了新的時間。\n\n這個改動很細微，如果不是仔細看，根本不會注意到。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'schedule_modified_found', value: true },
          { type: 'setFlag', flag: 'projection_room_observed', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'examine_light_control',
        name: '檢查燈控面板',
        description: '你檢查燈控面板。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'hotspot_light_control_panel' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '燈控紀錄\n\n燈控面板旁的紀錄。\n\n當天的紀錄顯示開關指在手動那一側。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'clue_manual_light_control', value: true },
          { type: 'setFlag', flag: 'projection_room_observed', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'examine_projector_notes',
        name: '檢查放映員的筆記',
        description: '你檢查放映員的筆記。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'hotspot_projector_notes' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '放映員的筆記\n\n一張便條紙貼在控制台上。字跡匆忙，但內容清楚。\n\n「那天有人說，燈不用急著開。」\n\n沒有署名，沒有時間。表不是自己長字——誰改的，不會跟放映員講。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'projector_notes_found', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'view_security_monitor',
        name: '觀看監視器畫面',
        description: '你觀看監視器畫面。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'hotspot_security_monitor' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '監視器畫面正在播放案發當晚的錄影。\n\n時間戳：00:12\n畫面：散場後的放映廳\n\n在昏暗的光線中，有一個身影很快離開畫面。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'security_monitor_viewed', value: true },
          { type: 'setFlag', flag: 'clue_fast_exit', value: true },
          { type: 'setFlag', flag: 'restroom_unlocked', value: true },
          { type: 'setFlag', flag: 'projection_room_observed', value: true },
        ],
        oneTime: true,
      },
      // 好笑無意義互動（播映室）
      { id: 'fun_coffee', name: '咖啡杯', description: '無意義互動', requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_coffee' }], effects: [{ type: 'showDialog', dialog: { text: '小張的咖啡杯。上面寫著「放映員專用」。你聞了聞，已經涼了。', type: 'narrator' } }], oneTime: false },
      { id: 'fun_snack', name: '零食袋', description: '無意義互動', requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_snack' }], effects: [{ type: 'showDialog', dialog: { text: '一包沒吃完的零食。誰說放映員不能嘴饞。', type: 'narrator' } }], oneTime: false },
      { id: 'fun_chair_wheel', name: '椅子輪子', description: '無意義互動', requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_chair_wheel' }], effects: [{ type: 'showDialog', dialog: { text: '控制椅的輪子。你滾了滾。很順。你立刻停下來，覺得自己很無聊。', type: 'narrator' } }], oneTime: false },
      { id: 'fun_chair_wheel_2', name: '椅子輪子', description: '無意義互動', requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_chair_wheel_2' }], effects: [{ type: 'showDialog', dialog: { text: '控制椅的輪子。你滾了滾，還是很順。旁邊還有一張椅子，好想滑滑看，你決定就此打住。專業。', type: 'narrator' } }], oneTime: false },
      { id: 'fun_sticker', name: '按鈕上的貼紙', description: '無意義互動', requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_sticker' }], effects: [{ type: 'showDialog', dialog: { text: '某個按鈕上貼著「勿按」。你沒有按。你是一個成熟的偵探。', type: 'narrator' } }], oneTime: false },
      { id: 'fun_remote', name: '冷氣遙控器', description: '無意義互動', requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_remote' }], effects: [{ type: 'showDialog', dialog: { text: '冷氣遙控器。上面貼著「遺失賠償五百」。你放下了。', type: 'narrator' } }], oneTime: false },
      { id: 'fun_magazine', name: '舊雜誌', description: '無意義互動', requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_magazine' }], effects: [{ type: 'showDialog', dialog: { text: '一本過期的電影雜誌。封面是半年前的強片。時光飛逝。', type: 'narrator' } }], oneTime: false },
      { id: 'fun_whiteboard', name: '白板', description: '無意義互動', requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_whiteboard' }], effects: [{ type: 'showDialog', dialog: { text: '白板上畫著一個笑臉和「今天也要加油」。你沒有笑。但你有點想笑。', type: 'narrator' } }], oneTime: false },
    ],
    puzzles: [],
    initialDialog: {
      text: '播映室裡，控制台和設備都在正常運作。\n\n但在這片正常中，有什麼被改動過。表上怎麼寫，就怎麼放——表不是自己長字。',
      type: 'narrator',
    },
    npcs: [
      {
        id: 'npc_xiaozhang',
        name: '小張（放映員）',
        portrait: '/svg/characters/projector_operator.svg',
        randomDialogs: [
          {
            id: 'casual_1',
            text: '「表上怎麼寫，我就怎麼放啊。表不是自己長字的，我就管放片嘛。」',
            type: 'casual',
            weight: 3,
          },
          {
            id: 'casual_2',
            text: '「燈光就燈光啊，該亮就亮、該關就關。我只看銀幕跟時間。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_3',
            text: '「我不記得人臉，我記得時間。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_4',
            text: '「表怎麼來的我不清楚啊。表上寫什麼，我就做什麼。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_5',
            text: '「那天……好像有哪裡怪怪的，我也說不上來。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_6',
            text: '「反正就是照表走嘛。表從哪來我們也不會問啊。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_7',
            text: '「我們看銀幕啦，觀眾區那邊不是我們管的啊。」',
            type: 'casual',
            weight: 2,
          },
        ],
        available: true,
      },
    ],
  },


    'scene_ch1_restroom': {
    id: 'scene_ch1_restroom',
    chapterId: 'ch1',
    name: '廁所',
    description: '廁所裡很乾淨，幾乎是空的。但在這片乾淨中，你感覺到一種說不上來的異樣。',
    background: '/images/bg_ch1_restroom_v1.webp',
    hotspots: [
      {
        id: 'hotspot_sink_below',
        shape: 'circle',
        coords: [0.935, 0.945, 0.155],
        description: '洗手台下方',
        hint: '在洗手台下方，你發現了一小片黑色塑膠。',
      },
      {
        id: 'hotspot_trash_bin',
        shape: 'circle',
        coords: [0.545, 0.525, 0.275],
        description: '垃圾桶',
        hint: '垃圾桶裡幾乎是空的。',
      },
      {
        id: 'hotspot_mirror',
        shape: 'circle',
        coords: [0.795, 0.315, 1.575],
        description: '鏡子',
        hint: '你在鏡子裡看見自己，和一個沒有留下痕跡的人。',
      },
      // 好笑無意義互動（廁所）
      { id: 'hotspot_fun_dryer', shape: 'circle', coords: [0.57, 0.41, 0.095], description: '烘手機', hint: '烘手機。' },
      { id: 'hotspot_fun_soap', shape: 'circle', coords: [0.955, 0.615, 0.075], description: '洗手乳', hint: '洗手乳是檸檬味。' },
      { id: 'hotspot_fun_towel', shape: 'circle', coords: [0.53, 0.34, 0.075], description: '擦手紙', hint: '擦手紙盒上寫著「一次取用一張」。' },
      { id: 'hotspot_fun_sign', shape: 'circle', coords: [0.055, 0.455, 0.075], description: '標語', hint: '牆上貼著「如廁後請沖水」。' },
      { id: 'hotspot_fun_air_freshener', shape: 'circle', coords: [0.185, 0.43, 0.175], description: '芳香劑', hint: '自動芳香劑。' },
      { id: 'hotspot_fun_faucet', shape: 'circle', coords: [0.835, 0.545, 0.15], description: '水龍頭', hint: '水龍頭。' },
      { id: 'hotspot_fun_floor', shape: 'circle', coords: [0.475, 0.785, 2.00], description: '地板反光', hint: '地板擦得很亮。' },
    ],
    items: [
      items.item_black_plastic_fragment,
    ], // 第一章道具精簡：清潔備忘改為僅檢視、不進背包
    hotspotEventMap: {
      'hotspot_sink_below': 'examine_sink_below',
      'hotspot_trash_bin': 'examine_trash_bin',
      'hotspot_mirror': 'examine_mirror',
      'hotspot_fun_dryer': 'fun_dryer',
      'hotspot_fun_soap': 'fun_soap',
      'hotspot_fun_towel': 'fun_towel',
      'hotspot_fun_sign': 'fun_sign',
      'hotspot_fun_air_freshener': 'fun_air_freshener',
      'hotspot_fun_faucet': 'fun_faucet',
      'hotspot_fun_floor': 'fun_floor',
    },
    events: [
      {
        id: 'examine_sink_below',
        name: '檢查洗手台下方',
        description: '你檢查洗手台下方，發現黑色塑膠碎片。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'hotspot_sink_below' },
        ],
        effects: [
          { type: 'addItem', itemId: 'item_black_plastic_fragment' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：黑色塑膠碎片\n\n在洗手台下方，你發現了一小片黑色塑膠。\n\n邊緣不規則，材質像橡膠或塑膠。\n\n這個位置很隱蔽。',
              type: 'item',
            },
          },
          { type: 'setFlag', flag: 'black_fragment_found', value: true },
          { type: 'setFlag', flag: 'observed_restroom_ch1', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'examine_trash_bin',
        name: '檢查垃圾桶',
        description: '你檢查垃圾桶。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'hotspot_trash_bin' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '清潔備忘\n\n廁所區域的清潔備忘；垃圾桶那欄寫得很簡短，看起來很空。\n\n沒有血跡，沒有可疑物品。\n\n但這種「空」本身就很可疑。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'clue_clean_trash', value: true },
          { type: 'setFlag', flag: 'observed_restroom_ch1', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'examine_mirror',
        name: '查看鏡子',
        description: '你查看鏡子。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'hotspot_mirror' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '你在鏡子裡看見自己，和一個沒有留下痕跡的人。\n\n鏡面很乾淨，反射著洗手間的燈光。\n但在這片乾淨中，你感覺到一種說不上來的異樣。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'clue_killer_calm', value: true },
          { type: 'setFlag', flag: 'observed_restroom_ch1', value: true },
        ],
        oneTime: true,
      },
      // 好笑無意義互動（廁所）
      { id: 'fun_dryer', name: '烘手機', description: '無意義互動', requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_dryer' }], effects: [{ type: 'showDialog', dialog: { text: '烘手機。你伸手感應了一下。風很強。就這樣。', type: 'narrator' } }], oneTime: false },
      { id: 'fun_soap', name: '洗手乳', description: '無意義互動', requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_soap' }], effects: [{ type: 'showDialog', dialog: { text: '洗手乳是檸檬味。你擠了一點聞聞。跟案情無關。純粹好奇。', type: 'narrator' } }], oneTime: false },
      { id: 'fun_towel', name: '擦手紙', description: '無意義互動', requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_towel' }], effects: [{ type: 'showDialog', dialog: { text: '擦手紙盒上寫著「一次取用一張」。你取了一張。你是守規矩的人。', type: 'narrator' } }], oneTime: false },
      { id: 'fun_sign', name: '標語', description: '無意義互動', requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_sign' }], effects: [{ type: 'showDialog', dialog: { text: '牆上貼著「如廁後請沖水」。你已經沖了。你發誓。', type: 'narrator' } }], oneTime: false },
      { id: 'fun_air_freshener', name: '芳香劑', description: '無意義互動', requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_air_freshener' }], effects: [{ type: 'showDialog', dialog: { text: '自動芳香劑。每十分鐘噴一次。你站在這裡等了一分鐘。沒噴。你走了。', type: 'narrator' } }], oneTime: false },
      { id: 'fun_faucet', name: '水龍頭', description: '無意義互動', requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_faucet' }], effects: [{ type: 'showDialog', dialog: { text: '水龍頭。你轉開又關上。省水。', type: 'narrator' } }], oneTime: false },
      { id: 'fun_floor', name: '地板反光', description: '無意義互動', requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_floor' }], effects: [{ type: 'showDialog', dialog: { text: '地板擦得很亮。你看到自己的倒影。你今天氣色還行。', type: 'narrator' } }], oneTime: false },
    ],
    puzzles: [],
    initialDialog: {
      text: '廁所裡很乾淨，幾乎是空的。\n\n灰啊、鞋印啊，有人比看臉還準。在這片乾淨中，你感覺到一種說不上來的異樣。',
      type: 'narrator',
    },
    npcs: [
      {
        id: 'npc_zhou_jie',
        name: '周姊（清潔）',
        portrait: '/svg/characters/zhou_yawen.svg',
        randomDialogs: [
          {
            id: 'casual_1',
            text: '「你們都看監視器喔，我只看地板。灰啊、鞋印啊，我比較會看啦。地板不會撒謊嘛。」',
            type: 'casual',
            weight: 3,
          },
          {
            id: 'casual_2',
            text: '「做久了，什麼狀況都看過啦。有的時候反而……嗯，沒事喔。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_3',
            text: '「有的人很愛乾淨，擦到發亮那種嘛。可是再怎麼擦……總會漏一點啦。字是新的，灰是舊的，這種東西不會幫誰說謊喔。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_4',
            text: '「散場那段黑喔，不是浪漫啦，是最容易把人變成『沒人注意』。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_5',
            text: '「那邊我常擦嘛，有的地方那天特別好擦，我也不知道為什麼喔。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_6',
            text: '「那天我等到很晚才開始收啦，也不知道在等什麼……就覺得還沒完嘛。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_7',
            text: '「我們是最後收尾的嘛，人家留什麼我們就清什麼喔。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_8',
            text: '「有的東西……我不會亂講啦。你如果真的想問，再問吧喔。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_fear',
            text: '「這種事……唉呀，我做二十年了，每次聽到還是會怕啦。我只要把該擦的地方擦乾淨就好喔。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_effort',
            text: '「能做的我都有做啦。至少我負責的範圍，我敢說我盡力了嘛。」',
            type: 'casual',
            weight: 2,
          },
        ],
        available: true,
      },
    ],
  },

};

// ch1 NPC 對話（第一章全部）
const npcDialogs: Record<string, Record<string, NpcDialogNode>> = {
  // 第一章 林瑞堂（副理）— 敏感問題一：燈與流程 / 敏感問題二：他怕誰（二選一，問完設 npc_lin_sensitive_done）
  npc_lin_ruitang: {
    // === 敏感問題一：燈與流程 ===
    'node_lin_light_1': {
      id: 'node_lin_light_1',
      npcId: 'npc_lin_ruitang',
      text: 'KK：「散場的燈，為什麼晚亮三分鐘？」\n\n林瑞堂：「那個……呃，觀眾反映刺眼嘛，我們就、就做了微調。很常見的啦，真的喔。」\n\nKK：「誰提的？」\n\n林瑞堂（笑了一下，笑容卡住）：「流、流程……就是流程嘛。通常不會追到個人啊，這是制度喔。」\n\nKK（旁白）：他把人藏進流程裡。',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_lin_light_2',
    },
    'node_lin_light_2': {
      id: 'node_lin_light_2',
      npcId: 'npc_lin_ruitang',
      text: 'KK：「你說流程正常，但流程正常的人不會死得這麼安靜。」\n\n林瑞堂：「那種調整……上面有上面的考量啦。可能只是、只是服務調整嘛。」\n\nKK：「你急著把它叫成服務。」\n\n林瑞堂（略慌）：「我真的很遺憾……可我也不想看到這裡被毀掉喔。我們能配合的都會配合啦。」\n\nKK：「被毀掉的不是影城，是那個人。」\n\n林瑞堂沉默。',
      choices: [{ id: 'choice_next', label: '繼續', description: '內心旁白' }],
      next: 'node_lin_light_insight',
    },
    'node_lin_light_insight': {
      id: 'node_lin_light_insight',
      npcId: 'npc_lin_ruitang',
      text: '離開對話時，KK 的內心旁白——',
      choices: [
        {
          id: 'choice_procedure',
          label: '「他不是在說謊，他是在把事情塞回流程裡，讓流程替人背鍋。」',
          insightEffects: [{ target: 'procedure_insight', delta: 1 }],
          effects: [{ type: 'setFlag', flag: 'npc_lin_sensitive_done', value: true }],
        },
        {
          id: 'choice_human',
          label: '「他怕的應該不是兇手，是上面那張看不見的臉，可是這些恐懼會替兇手擦地板。」',
          insightEffects: [{ target: 'human_insight', delta: 1 }],
          effects: [{ type: 'setFlag', flag: 'npc_lin_sensitive_done', value: true }],
        },
        {
          id: 'choice_evidence',
          label: '「官腔很滑，油槍滑掉，但官腔擋不住痕跡。」',
          insightEffects: [{ target: 'evidence_insight', delta: 1 }],
          effects: [{ type: 'setFlag', flag: 'npc_lin_sensitive_done', value: true }],
        },
      ],
    },
    // === 敏感問題二：他怕誰 ===
    'node_lin_fear_1': {
      id: 'node_lin_fear_1',
      npcId: 'npc_lin_ruitang',
      text: 'KK：「你看起來不像怕兇手，你比較像怕我。」\n\n林瑞堂：「怎、怎麼會？我當然怕兇手啊……」\n\nKK：「你怕的是死者，還是上面的長官？」\n\n林瑞堂（閃躲）：「我是說……我們也要顧及影城形象嘛。現在媒體……唉，你也知道的喔。」\n\nKK（旁白）：形象是一把傘，傘底下可以藏很多東西。',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_lin_fear_2',
    },
    'node_lin_fear_2': {
      id: 'node_lin_fear_2',
      npcId: 'npc_lin_ruitang',
      text: 'KK：「燈晚亮三分鐘，不是小事。誰有權改？」\n\n林瑞堂：「那是……流程上的調整嘛。通常不會追到個人啦，這是制度喔。」\n\nKK：「所以你選擇用流程，保護不知道的誰誰誰？」\n\n林瑞堂沉默。',
      choices: [{ id: 'choice_next', label: '繼續', description: '內心旁白' }],
      next: 'node_lin_fear_insight',
    },
    'node_lin_fear_insight': {
      id: 'node_lin_fear_insight',
      npcId: 'npc_lin_ruitang',
      text: '離開對話時，KK 的內心旁白——',
      choices: [
        {
          id: 'choice_procedure',
          label: '「他不是在說謊，他是在把事情塞回流程裡，讓流程替人背鍋。」',
          insightEffects: [{ target: 'procedure_insight', delta: 1 }],
          effects: [{ type: 'setFlag', flag: 'npc_lin_sensitive_done', value: true }],
        },
        {
          id: 'choice_human',
          label: '「他怕的不是兇手，是上面那張看不見的臉。恐懼會替兇手擦地板。」',
          insightEffects: [{ target: 'human_insight', delta: 1 }],
          effects: [{ type: 'setFlag', flag: 'npc_lin_sensitive_done', value: true }],
        },
        {
          id: 'choice_evidence',
          label: '「官腔擋不住痕跡。」',
          insightEffects: [{ target: 'evidence_insight', delta: 1 }],
          effects: [{ type: 'setFlag', flag: 'npc_lin_sensitive_done', value: true }],
        },
      ],
    },
  },
  // 第一章 NPC：阿順（巡場保全）— 敏感一：散場空窗 / 敏感二：監視器死角（二選一，各獨立起點）
  npc_ashun: {
    // === 敏感問題一：散場空窗（90 秒誰在看）===
    'node_ashun_window_1': {
      id: 'node_ashun_window_1',
      npcId: 'npc_ashun',
      text: 'KK：「散場後，你們巡場有空窗嗎？」\n\n阿順：「有啊，散場後那一兩分鐘喔。要先引導人潮出去嘛。」\n\nKK：「那段誰看？」\n\n阿順：「誰都看，又誰都沒看啦。走道像水流，沒人會停的。」\n\nKK（旁白）：大概一兩分鐘，足夠一個熟練的人做很多事。',
      choices: [{ id: 'choice_next', label: '繼續', description: '內心旁白' }],
      next: 'node_ashun_window_insight',
    },
    'node_ashun_window_insight': {
      id: 'node_ashun_window_insight',
      npcId: 'npc_ashun',
      text: '離開對話時，KK 的內心旁白——',
      choices: [
        { id: 'choice_procedure', label: '「90 秒不是時間，是窗口。窗口一旦被設計，就會變成一條路。」', insightEffects: [{ target: 'procedure_insight', delta: 1 }], effects: [{ type: 'setFlag', flag: 'npc_ashun_sensitive_done', value: true }] },
        { id: 'choice_evidence', label: '「死角不是看不到人，是看不到動作。我要找『動作留下的結果』。」', insightEffects: [{ target: 'evidence_insight', delta: 1 }], effects: [{ type: 'setFlag', flag: 'npc_ashun_sensitive_done', value: true }] },
        { id: 'choice_human', label: '「他笑得太用力。越用玩笑掩飾的人，越知道自己看過什麼。」', insightEffects: [{ target: 'human_insight', delta: 1 }], effects: [{ type: 'setFlag', flag: 'npc_ashun_sensitive_done', value: true }] },
      ],
    },
    // === 敏感問題二：監視器死角（哪裡看不到）===
    'node_ashun_deadzone_1': {
      id: 'node_ashun_deadzone_1',
      npcId: 'npc_ashun',
      text: 'KK：「監視器死角在哪？」\n\n阿順：「靠邊的地方總有擋到的啦，柱子、轉角什麼的嘛。」\n\nKK：「你確定？」\n\n阿順：「我每天走同一條路喔。哪裡有問題，心裡有數啦。自己清楚。」\n\nKK（旁白）：死角不是空白，是被允許的盲點。',
      choices: [{ id: 'choice_next', label: '繼續', description: '內心旁白' }],
      next: 'node_ashun_deadzone_insight',
    },
    'node_ashun_deadzone_insight': {
      id: 'node_ashun_deadzone_insight',
      npcId: 'npc_ashun',
      text: '離開對話時，KK 的內心旁白——',
      choices: [
        { id: 'choice_procedure', label: '「90 秒不是時間，是窗口。窗口一旦被設計，就會變成一條路。」', insightEffects: [{ target: 'procedure_insight', delta: 1 }], effects: [{ type: 'setFlag', flag: 'npc_ashun_sensitive_done', value: true }] },
        { id: 'choice_evidence', label: '「死角不是看不到人，是看不到動作。我要找『動作留下的結果』。」', insightEffects: [{ target: 'evidence_insight', delta: 1 }], effects: [{ type: 'setFlag', flag: 'npc_ashun_sensitive_done', value: true }] },
        { id: 'choice_human', label: '「他笑得太用力。越用玩笑掩飾的人，越知道自己看過什麼。」', insightEffects: [{ target: 'human_insight', delta: 1 }], effects: [{ type: 'setFlag', flag: 'npc_ashun_sensitive_done', value: true }] },
      ],
    },
  },
  // 第一章 NPC：小張（放映員）— 敏感一：表格與權限 / 敏感二：口頭指示（二選一，各獨立起點）
  npc_xiaozhang: {
    // === 敏感問題一：表格與權限（誰能改表）===
    'node_xiaozhang_table_1': {
      id: 'node_xiaozhang_table_1',
      npcId: 'npc_xiaozhang',
      text: 'KK：「燈延後三分鐘，是你改的？」\n\n小張：「不是我啊。表上怎麼寫，我就怎麼放。我看到表格上就是延後三分鐘，我照做。」\n\nKK：「你確定表格原本就那樣？」\n\n小張：「表不是自己長字的嘛。我只知道我那天看到就是那樣。」\n\nKK（旁白）：表格像命令，命令不需要解釋。',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_xiaozhang_table_2',
    },
    'node_xiaozhang_table_2': {
      id: 'node_xiaozhang_table_2',
      npcId: 'npc_xiaozhang',
      text: 'KK：「那表格誰能改？」\n\n小張：「那種事要問上面啊。我們只負責照表按嘛。」\n\nKK：「所以燈不是『自然延後』，是『被允許延後』。」\n\n小張沉默。\n\nKK（旁白）：允許，才是這城市最重的鎖。',
      choices: [{ id: 'choice_next', label: '繼續', description: '內心旁白' }],
      next: 'node_xiaozhang_table_insight',
    },
    'node_xiaozhang_table_insight': {
      id: 'node_xiaozhang_table_insight',
      npcId: 'npc_xiaozhang',
      text: '離開對話時，KK 的內心旁白——',
      choices: [
        { id: 'choice_procedure', label: '「表格就是權力。能改表的人，不一定在現場，但一定在流程上游。」', insightEffects: [{ target: 'procedure_insight', delta: 1 }], effects: [{ type: 'setFlag', flag: 'npc_xiaozhang_sensitive_done', value: true }] },
        { id: 'choice_evidence', label: '「我不信『想不起來』。我信用詞：像背 SOP 的人，習慣用制度當聲音。」', insightEffects: [{ target: 'evidence_insight', delta: 1 }], effects: [{ type: 'setFlag', flag: 'npc_xiaozhang_sensitive_done', value: true }] },
        { id: 'choice_human', label: '「他不是不知道，他是怕自己成為下一個被留下的人。」', insightEffects: [{ target: 'human_insight', delta: 1 }], effects: [{ type: 'setFlag', flag: 'npc_xiaozhang_sensitive_done', value: true }] },
      ],
    },
    // === 敏感問題二：口頭指示（誰跟他說過、像背 SOP）===
    'node_xiaozhang_oral_1': {
      id: 'node_xiaozhang_oral_1',
      npcId: 'npc_xiaozhang',
      text: 'KK：「有人跟你說過什麼嗎？」\n\n小張：「有……有人說觀眾反映刺眼，叫我照表走啊。」\n\nKK：「誰？」\n\n小張（避開眼神）：「我……想不起來。只記得那個人講話很像背 SOP 嘛。表上怎麼寫，我就怎麼放。」\n\nKK（旁白）：聲音像流程。人像工具。',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_xiaozhang_oral_2',
    },
    'node_xiaozhang_oral_2': {
      id: 'node_xiaozhang_oral_2',
      npcId: 'npc_xiaozhang',
      text: 'KK：「你確定表格原本就那樣？」\n\n小張：「表不是自己長字啊。誰改的，不會跟我講嘛。」\n\nKK：「所以你不問。」\n\n小張：「問了又能怎樣？表就是表。我就管放片啊。」\n\nKK（旁白）：允許，才是這城市最重的鎖。',
      choices: [{ id: 'choice_next', label: '繼續', description: '內心旁白' }],
      next: 'node_xiaozhang_oral_insight',
    },
    'node_xiaozhang_oral_insight': {
      id: 'node_xiaozhang_oral_insight',
      npcId: 'npc_xiaozhang',
      text: '離開對話時，KK 的內心旁白——',
      choices: [
        { id: 'choice_procedure', label: '「表格就是權力。能改表的人，不一定在現場，但一定在流程上游。」', insightEffects: [{ target: 'procedure_insight', delta: 1 }], effects: [{ type: 'setFlag', flag: 'npc_xiaozhang_sensitive_done', value: true }] },
        { id: 'choice_evidence', label: '「我不信『想不起來』。我信用詞：像背 SOP 的人，習慣用制度當聲音。」', insightEffects: [{ target: 'evidence_insight', delta: 1 }], effects: [{ type: 'setFlag', flag: 'npc_xiaozhang_sensitive_done', value: true }] },
        { id: 'choice_human', label: '「他不是不知道，他是怕自己成為下一個被留下的人。」', insightEffects: [{ target: 'human_insight', delta: 1 }], effects: [{ type: 'setFlag', flag: 'npc_xiaozhang_sensitive_done', value: true }] },
      ],
    },
  },
  // 第一章 NPC：周姊（清潔）— 敏感一：哪裡太乾淨 / 敏感二：你找到什麼／燈晚亮（二選一，各獨立起點）
  npc_zhou_jie: {
    // === 敏感問題一：哪裡太乾淨（洗手台、急著擦）===
    'node_zhou_clean_1': {
      id: 'node_zhou_clean_1',
      npcId: 'npc_zhou_jie',
      text: 'KK：「你說『太乾淨』，哪裡太乾淨？」\n\n周姊：「洗手台下面啦。那邊我常擦嘛，正常那裡會卡灰卡毛喔，今天像被擦過一遍。」\n\nKK：「擦得很急？」\n\n周姊：「嗯。像怕你看見啦。我也不敢多想……就專心做我的事嘛。」\n\nKK（旁白）：急著乾淨的人，多半有東西不能留。',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_zhou_clean_2',
    },
    'node_zhou_clean_2': {
      id: 'node_zhou_clean_2',
      npcId: 'npc_zhou_jie',
      text: 'KK：「燈晚亮，你怎麼知道？」\n\n周姊（敲手錶）：「那天就是等得特別久啦……久到有點毛喔。才亮嘛。」\n\nKK（旁白）：體感的時間，比任何表格都殘酷。',
      choices: [{ id: 'choice_next', label: '繼續', description: '內心旁白' }],
      next: 'node_zhou_clean_insight',
    },
    'node_zhou_clean_insight': {
      id: 'node_zhou_clean_insight',
      npcId: 'npc_zhou_jie',
      text: '離開對話時，KK 的內心旁白——',
      choices: [
        { id: 'choice_procedure', label: '「清潔是流程的最後一段。兇手懂流程，就會把痕跡丟給清潔。」', insightEffects: [{ target: 'procedure_insight', delta: 1 }], effects: [{ type: 'setFlag', flag: 'npc_zhou_jie_sensitive_done', value: true }] },
        { id: 'choice_evidence', label: '「碎片是最誠實的證人。它不記得誰做的，但它記得『怎麼做的』。」', insightEffects: [{ target: 'evidence_insight', delta: 1 }], effects: [{ type: 'setFlag', flag: 'npc_zhou_jie_sensitive_done', value: true }] },
        { id: 'choice_human', label: '「她不是迷信，她是看過太多人假裝正常。她在說：別急著收工。」', insightEffects: [{ target: 'human_insight', delta: 1 }], effects: [{ type: 'setFlag', flag: 'npc_zhou_jie_sensitive_done', value: true }] },
      ],
    },
    // === 敏感問題二：你找到什麼／燈晚亮（黑色碎片三選一 → 燈晚亮 → 內心旁白）===
    // 若玩家已從洗手台取得碎片（black_fragment_found），改由此節點進入，避免重複給碎片
    'node_zhou_fragment_1_already_have': {
      id: 'node_zhou_fragment_1_already_have',
      npcId: 'npc_zhou_jie',
      text: '周姊點點頭：「你已經找到那片了吧。那就好喔。」\n\nKK：「嗯。」\n\n周姊沒有多說，只是又看了一眼洗手台的方向。「那種東西不會幫誰說謊啦。」',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_zhou_fragment_2',
    },
    'node_zhou_fragment_1': {
      id: 'node_zhou_fragment_1',
      npcId: 'npc_zhou_jie',
      text: '周姊（拿出夾子）：「一小片黑色塑膠啦。你拿走吧，我不想它被丟掉喔。」\n\nKK：「你怎麼沒直接丟？」\n\n周姊：「因為丟掉會讓我晚上睡不著嘛。」',
      choices: [
        { id: 'choice_seal', label: '「我現在就封袋。」', effects: [{ type: 'addItem', itemId: 'item_black_plastic_fragment' }, { type: 'setFlag', flag: 'black_fragment_found', value: true }] },
        { id: 'choice_secret', label: '「先別讓任何人知道你有看見它。」', effects: [{ type: 'addItem', itemId: 'item_black_plastic_fragment' }, { type: 'setFlag', flag: 'black_fragment_found', value: true }] },
        { id: 'choice_report', label: '「我會回報，讓它進正式流程。」', effects: [{ type: 'addItem', itemId: 'item_black_plastic_fragment' }, { type: 'setFlag', flag: 'black_fragment_found', value: true }] },
      ],
      next: 'node_zhou_fragment_2',
    },
    'node_zhou_fragment_2': {
      id: 'node_zhou_fragment_2',
      npcId: 'npc_zhou_jie',
      text: 'KK：「燈晚亮，你怎麼知道？」\n\n周姊（敲手錶）：「那天就是等得特別久啦……久到有點毛喔。才亮嘛。」\n\nKK（旁白）：體感的時間，比任何表格都殘酷。',
      choices: [{ id: 'choice_next', label: '繼續', description: '內心旁白' }],
      next: 'node_zhou_fragment_insight',
    },
    'node_zhou_fragment_insight': {
      id: 'node_zhou_fragment_insight',
      npcId: 'npc_zhou_jie',
      text: '離開對話時，KK 的內心旁白——',
      choices: [
        { id: 'choice_procedure', label: '「清潔是流程的最後一段。兇手懂流程，就會把痕跡丟給清潔。」', insightEffects: [{ target: 'procedure_insight', delta: 1 }], effects: [{ type: 'setFlag', flag: 'npc_zhou_jie_sensitive_done', value: true }] },
        { id: 'choice_evidence', label: '「碎片是最誠實的證人。它不記得誰做的，但它記得『怎麼做的』。」', insightEffects: [{ target: 'evidence_insight', delta: 1 }], effects: [{ type: 'setFlag', flag: 'npc_zhou_jie_sensitive_done', value: true }] },
        { id: 'choice_human', label: '「她不是迷信，她是看過太多人假裝正常。她在說：別急著收工。」', insightEffects: [{ target: 'human_insight', delta: 1 }], effects: [{ type: 'setFlag', flag: 'npc_zhou_jie_sensitive_done', value: true }] },
      ],
    },
  },
};

export { scenes, items, npcDialogs };
