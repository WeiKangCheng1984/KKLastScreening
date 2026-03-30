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
    description: '散場後的人們很吵。塑膠杯、手機光，而這個人死得太安靜。',
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
        description: 'KK 心想。',
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
              text: '獲得：電影票根\n\n一張死者遺留的票根，靜靜躺在地上。\n\n座位號碼：H排12號\n場次時間：22:30',
              type: 'item',
            },
          },
          { type: 'setFlag', flag: 'ticket_stub_collected', value: true },
          { type: 'setFlag', flag: 'observed_any_ch1', value: true },
        ],
        oneTime: true,
      },
      // 好笑無意義互動（放映廳）
      { id: 'fun_popcorn', name: '爆米花殘渣', description: '無意義互動', requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_popcorn' }], effects: [{ type: 'showDialog', dialog: { text: '地上有幾顆沒吃完的爆米花。你忍不住想：最後一場電影，有人連自己的結局也一起演完了。', type: 'narrator' } }], oneTime: false },
      { id: 'fun_cup', name: '空飲料杯', description: '無意義互動', requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_cup' }], effects: [{ type: 'showDialog', dialog: { text: '一個空杯還插著吸管，是一杯「中杯可樂」，兇手是不是大杯派?', type: 'narrator' } }], oneTime: false },
      { id: 'fun_jacket', name: '椅背上的外套', description: '無意義互動', requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_jacket' }], effects: [{ type: 'showDialog', dialog: { text: '一件外套掛在椅背上，主人大概忘了帶走，可能也不敢回來拿了。', type: 'narrator' } }], oneTime: false },
      { id: 'fun_screen_dust', name: '銀幕邊角', description: '無意義互動', requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_screen_dust' }], effects: [{ type: 'showDialog', dialog: { text: '銀幕邊角有一小塊灰，你有點想把它擦掉。', type: 'narrator' } }], oneTime: false },
      { id: 'fun_ac', name: '冷氣出風口', description: '無意義互動', requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_ac' }], effects: [{ type: 'showDialog', dialog: { text: '冷氣呼呼吹。你突然想：如果案發那天冷氣壞了，兇手會不會焦慮？', type: 'narrator' } }], oneTime: false },
      { id: 'fun_exit_sign', name: '散場告示', description: '無意義互動', requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_exit_sign' }], effects: [{ type: 'showDialog', dialog: { text: '「散場請依序離場」，大家都依序了，除了一個人。', type: 'narrator' } }], oneTime: false },
      { id: 'fun_seat_number', name: '電影院座椅', description: '無意義互動', requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_seat_number' }], effects: [{ type: 'showDialog', dialog: { text: '你盯著電影院座椅看了三秒。你開始認真考慮要不要把椅子帶回去當紀念。不，你沒有。你是專業的。', type: 'narrator' } }], oneTime: false },
      { id: 'fun_carpet_stain', name: '地毯污漬', description: '無意義互動', requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_carpet_stain' }], effects: [{ type: 'showDialog', dialog: { text: '你蹲下來聞了聞。……你立刻站起來，並決定這一段不會出現在任何正式紀錄裡。可樂。一定是可樂。', type: 'narrator' } }], oneTime: false },
      { id: 'fun_popcorn_bucket', name: '空爆米花桶', description: '無意義互動', requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_popcorn_bucket' }], effects: [{ type: 'showDialog', dialog: { text: '你盯著空桶看了很久。如果兇手當時正在吃爆米花，他會選鹹的還是甜的？……你揉了揉太陽穴。奇怪的想法該打住。', type: 'narrator' } }], oneTime: false },
    ],
    puzzles: [],
    initialDialog: {
      text: '散場後，人群聲很吵。塑膠杯、手機光。可那個人死得太安靜。\n\n現場封著。品牌、技術都通知了。看到什麼照實說。',
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
            text: '「辛苦、辛苦你跑一趟喔……流程、流程我們都有跑啦，真的，每一步都有。遺憾，真的很遺憾。」',
            type: 'casual',
            weight: 3,
          },
          {
            id: 'casual_2',
            text: '「照理說、照理說是個案啦……個案，通常不會再……我也希望快點結束，對大家都好，對大家都好喔。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_3',
            text: '「我管場館，場館我管嘛。系統、系統那個……流程怎麼設計，不是我這層、不是我這層決定的啊。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_4',
            text: '「媒體現在……你也知道的嘛。穩住、穩住對大家都好，真的喔。配合，我也配合，就是……妥當一點比較妥當嘛。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_5',
            text: '「你查、你查我都支持喔。可是上面、上面有上面的判斷啦，我也只能講我職位上、職位上知道的嘛。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_6',
            text: '「你要答案，答案……流程就是流程啊，流程。不在流程裡的，我沒辦法給，真的喔，不是不幫。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_7',
            text: '「流程怎麼寫，我、我就怎麼站嘛。職責範圍內我都配合，配合啦。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_8',
            text: '「影城這幾年不容易、不容易啊……再多一個負面，大家、大家都……唉，你說是不是喔。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_9',
            text: '「規矩是死的，現場、現場是活的喔。可是我們還是照規矩走啦，照規矩，才有依據嘛，才說得清楚。」',
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
            text: '「現場封著。品牌、技術都通知了，你就先看看，看看有什麼。」',
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
            text: '「走道像水流啦……散場、散場就是水，流進流出，沒、沒人真的看清水裡有啥。」',
            type: 'casual',
            weight: 3,
          },
          {
            id: 'casual_2',
            text: '「散場那、那一下下，人潮一衝我就指揮……要叫人走又不能太兇，就、就這樣啦，工作嘛。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_3',
            text: '「鏡頭照到……不、不代表看見啦。兩回事，兩回事喔。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_4',
            text: '「哪裡有洞，心裡有數啦……可、可是我說了也不算，要、要有人授權我才……才方便講嘛。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_5',
            text: '「片尾名單……呃，不是沒人看，是、是沒幾個人在看啦。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_6',
            text: '「暗的可怕……明的、明的有時候也。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_7',
            text: '「有些角落走一千次沒事……沒、沒事也不代表……呃，沒問題喔。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_8',
            text: '「死角？自己、自己清楚就好……講太白，以後麻煩啦，你、你懂的吧。」',
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
        hint: '一張播映時間表，電影《第三個目擊者》，片長104分鐘。鉛筆字寫著+2、+3。',
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
        hint: '監視器畫面正在播放案發當晚的錄影，但也就是一片昏暗，時間大約落在00:12~00:14之間，畫面有人影晃動。',
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
              text: '播映時間表（塗改）\n\n一張播映時間表，上面有塗改的痕跡。\n\n原本某一欄被劃掉，旁邊用紅筆寫了新的時間，字很醜。\n\n',
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
              text: '放映員的筆記\n\n便條紙貼在控制台上。字很急，意思倒是直白。\n\n「那天有人說，燈不用急著開。」\n\n沒署名、沒時間。表自己不會長字；誰改的，不會跟放映員講。',
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
      text: '播映室裡，控制台和設備都在正常運作。\n\n但在這片正常中，有什麼被改動過。表上怎麼寫，就怎麼放，表不是自己長字。',
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
            text: '「表怎麼寫我就怎麼放……沒、沒啥好講的嘛。」',
            type: 'casual',
            weight: 3,
          },
          {
            id: 'casual_2',
            text: '「燈歸燈……片歸片。我管銀幕，不、不管觀眾。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_3',
            text: '「人臉我記不住……時間跟動作我才會記。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_4',
            text: '「那天怪嗎？……我說不上來喔。照表走就……別的也不是我的事嘛。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_5',
            text: '「誰改的？不知道啊。到我手上就那樣……問了也不會有人跟我講嘛。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_6',
            text: '「表從哪來……不是我這層要管的。我只把表上做到位。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_7',
            text: '（停頓）「……幾點能走啊？」（瞄到 KK）「不、不是說你啦，我、我自己算時間。」',
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
    description: '廁所裡很乾淨，幾乎是空的。灰、鞋印，有人比看臉還準；這片乾淨裡，你感覺到一種說不上來的異樣。',
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
              text: '獲得：黑色塑膠碎片\n\n在洗手台下方，你發現了一小片黑色塑膠。\n\n邊緣不規則，材質像橡膠或塑膠；縫裡舊灰邊上，像卡了新的。\n\n這個位置很隱蔽。',
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
      text: '廁所裡很乾淨，幾乎是空的。\n\n灰、鞋印，有人比看臉還準。這片乾淨裡，你感覺到一種說不上來的異樣。',
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
            text: '「你們問我看到啥……我看地板、看字擠，字跡啦，還有鞋印。臉、臉會騙人，地板不會嘛。」',
            type: 'casual',
            weight: 3,
          },
          {
            id: 'casual_2',
            text: '「有的東西講了怕……怕不怕？我、我心裡有數啦，你問我就……就講喔。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_3',
            text: '「白板有很多改寫……那種不會幫人說謊，我看得出。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_4',
            text: '「那邊腳印方向……不對勁啦，不像我們平常走法。我做久了，腳印這種我會看。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_5',
            text: '「那段黑……不是浪漫那種黑，是會讓人從人群不見的那種，啊我講不好啦。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_6',
            text: '「我本來想早走……那天感覺還沒完，就多待。結果真的沒完，直覺有時候比較準啦。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_7',
            text: '「我們最後收尾嘛……人家留啥我清啥。有時候我比你們早看到東西喔。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_8',
            text: '「我不亂講啦……你想問就直接問。我說不說一回事，講出來就是真的。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_fear',
            text: '「唉呀二十年啦……還是會怕。怕歸怕，又想知道怎麼回事，你說是不是喔。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_effort',
            text: '「我負責的範圍我敢講清楚……超出去的不亂講。可能超出去的才重點啦，你自己想。」',
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
// 敏感線：原段落一＋二已合併為單節點，略縮篇幅；避免依賴「繼續」二段式（見 DialogBox / onClose 互動）。
const npcDialogs: Record<string, Record<string, NpcDialogNode>> = {
  // 第一章 林瑞堂（副理）— 敏感問題一：流程與權限 / 敏感問題二：他在怕什麼（二選一，問完設 npc_lin_sensitive_done）
  npc_lin_ruitang: {
    'node_lin_light_1': {
      id: 'node_lin_light_1',
      npcId: 'npc_lin_ruitang',
      text:
        'KK：「散場燈晚了三分鐘。誰動得到設定？」\n\n' +
        '林瑞堂：「三分鐘……欸，三分鐘這種，本來就有彈性嘛。節能你也知道的，體驗也要顧啊。」\n\n' +
        'KK：「誰能改?」\n\n' +
        '林瑞堂：「不是、不是說誰不能碰啦，是層級、層級要看，協調也要看。流程我們都有走。」\n\n' +
        'KK：「所以是放映員自己按的？」\n\n' +
        '林瑞堂：「當然不是爽按啊，當然不是。我們有流程的，節能模式、節能它本來就，本來就合法嘛，公司都在升級設備。」\n\n' +
        'KK：「所以，那天是誰改了時間的?」\n\n' +
        '林瑞堂：「口頭喬一下也算協調嘛，也算。遠端現在很多也能啊，也沒有說一定是遠端啦！」\n\n' +
        'KK（心想）：問不出名字，他一直講流程。\n\n' +
        'KK：「手動要不要留紀錄。」\n\n' +
        '林瑞堂：「照規定、照規定都會留啊，都會留的。操作起來順順、順順的。」\n\n' +
        'KK：「責任切得出誰嗎。」\n\n' +
        '林瑞堂：「……不會是基層亂弄的啦，這個我可以保證。」\n\n' ,
      choices: [
        { id: 'choice_done', label: '結束', effects: [{ type: 'setFlag', flag: 'npc_lin_sensitive_done', value: true }] },
      ],
    },
    'node_lin_fear_1': {
      id: 'node_lin_fear_1',
      npcId: 'npc_lin_ruitang',
      text:
        'KK：「你一講那三分鐘，聲音就顯得很害怕?」\n\n' +
        '林瑞堂：「現在這種事……現在這種事，誰敢大聲啦。講話本來就、本來就要小心嘛。」\n\n' +
        'KK：「你有隱瞞嗎?」\n\n' +
        '林瑞堂：「我怕、我怕講錯啦，講錯也很麻煩啊。」\n\n' +
        'KK：「是不是兇手盯你?還是上面盯你?」\n\n' +
        '林瑞堂：「我又不知道兇手是誰……你不要把我講成、講成好像……」\n\n' +
        'KK：「這個燈光調整，是有人拍板過的嗎?」\n\n' +
        '林瑞堂：「我們都有流程，我是副理嘛，副理就是……先不要炸開，先不要而已啊。」\n\n' +
        'KK（心想）：林副理很怕，講話都結巴了。\n\n' +
        'KK：「死者跟影城招牌，誰比較重要?」\n\n' +
        '林瑞堂：「死者我也遺憾、也遺憾啊……可是整間一起、一起那個，誰扛啦。」\n\n',
      choices: [
        { id: 'choice_done', label: '結束', effects: [{ type: 'setFlag', flag: 'npc_lin_sensitive_done', value: true }] },
      ],
    },
  },
  npc_ashun: {
    'node_ashun_window_1': {
      id: 'node_ashun_window_1',
      npcId: 'npc_ashun',
      text:
        'KK：「散場那幾分鐘，你動線是上怎麼巡。」\n\n' +
        '阿順：「人很多的時候，就……就先卡出口嘛，怕踩嘛，先、先讓著急的出去。」\n\n' +
        'KK：「廳內後排呢?」\n\n' +
        '阿順：「表上是要走動啦……忙起來就，就先看出口啊。後面那幾排，有、有空再看。」\n\n' +
        'KK：「H排是優先巡視的嗎?」\n\n' +
        '阿順：「沒有……但是差不到幾分鐘啦。那一小段……很夠。」\n\n' +
        'KK（心想）：H排很明顯，可能是兇手熟練的位置。\n\n' +
        'KK：「兇手會跑去H排動手後再抽身?」\n\n' +
        '阿順：「監控沒拍清楚，鏡頭接不起來，回放會覺得像、像被地吃掉。」\n\n',
      choices: [
        { id: 'choice_done', label: '結束', effects: [{ type: 'setFlag', flag: 'npc_ashun_sensitive_done', value: true }] },
      ],
    },
    'node_ashun_deadzone_1': {
      id: 'node_ashun_deadzone_1',
      npcId: 'npc_ashun',
      text:
        'KK：「你是不是知道很多死角?」\n\n' +
        '阿順：「做、做久了嘛……哪裡常客訴，自己會記。」\n\n' +
        'KK：「會回報上級嗎?」\n\n' +
        '阿順：「……哇靠，你、你這樣問很刺欸。」\n\n' +
        'KK：「你們高壓嗎?我看你很緊張。」\n\n' +
        '阿順：「因、因為洞多大，我……我知道啊！不先往壞的想，我也不想扛？」\n\n' +
        'KK（心想）：很無辜，讓我懷疑他是不是演練過。',
      choices: [
        { id: 'choice_done', label: '結束', effects: [{ type: 'setFlag', flag: 'npc_ashun_sensitive_done', value: true }] },
      ],
    },
  },
  npc_xiaozhang: {
    'node_xiaozhang_table_1': {
      id: 'node_xiaozhang_table_1',
      npcId: 'npc_xiaozhang',
      text:
        'KK：「你照表操作，還是聽誰的命令操作。」\n\n' +
        '小張：「照表……」\n\n' +
        'KK：「今天的開燈時間，對得上?」\n\n' +
        '小張：「我這邊就……表寫啥我打啥。改表的……不在我這層。」\n\n' +
        'KK：「紅筆那筆。」\n\n' +
        '小張：「有、有啊…… 有個鬼畫符，亮燈往後撥三分鐘之類的。電影還在播，我也沒空問。」\n\n' +
        'KK（心想）：所以你也照習慣操作?\n\n' +
        '小張：「我看是手動就…… 我也有動」\n\n' +
        'KK：「所以燈光不是照電腦流程自動跑完的?」\n\n' +
        '小張：「你硬要講……也、也算是吧，但我沒多做什麼，沒得選啦。」\n\n' +
        'KK（心想）：小張的手，沒多做什麼，但也不是完全沒做。',
      choices: [
        {
          id: 'choice_done',
          label: '結束',
          effects: [
            { type: 'setFlag', flag: 'npc_xiaozhang_sensitive_done', value: true },
            { type: 'setFlag', flag: 'clue_light_delay_confirmed', value: true },
          ],
        },
      ],
    },
    'node_xiaozhang_oral_1': {
      id: 'node_xiaozhang_oral_1',
      npcId: 'npc_xiaozhang',
      text:
        'KK：「你覺得流程怪嗎?」\n\n' +
        '小張：「怪的事天天有……放映室被改來改去，我早麻痺了。可是，死…死人是第一次。」\n\n' +
        'KK：「今天的操作有比較複雜嗎?」\n\n' +
        '小張：「差不多吧，我也沒問，問了變我的麻煩……不問，片、片至少能放完。」\n\n' +
        'KK（心想）：沉默服從，也是專業。\n\n' +
        '小張：「不、不然呢。」\n\n' +
        'KK（心想）：服從久以為，就是一種負責。',
      choices: [
        {
          id: 'choice_done',
          label: '結束',
          effects: [
            { type: 'setFlag', flag: 'npc_xiaozhang_sensitive_done', value: true },
            { type: 'setFlag', flag: 'clue_light_delay_confirmed', value: true },
          ],
        },
      ],
    },
  },
};

export { scenes, items, npcDialogs };
