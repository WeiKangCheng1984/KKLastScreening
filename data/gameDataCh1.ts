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
            text: '「辛苦你跑一趟喔……我們流程、流程每一步都有跑啦，真的很遺憾發生這種事嘛。」',
            type: 'casual',
            weight: 3,
          },
          {
            id: 'casual_2',
            text: '「照、照理說嘛，這種事應該……應該是個案啦。通常不會再出問題的，我也希望快點結束，對大家都好喔。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_3',
            text: '「我管場館，不管系統嘛。流程怎麼設計……那不是我這層決定的啊，總部那邊自有考量喔。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_4',
            text: '「現在媒體……唉，你也知道的嘛。能穩住的話，對大家都好啦，真的喔。我不是說不配合，是……這樣比較妥當嘛。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_5',
            text: '「你要查的我都支持喔。可是很多事、很多事上面有上面的判斷啦，我也只能說在我職位上知道的嘛。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_6',
            text: '「我知道你要答案嘛。可是流程就是流程——我沒辦法給你不在流程裡的答案，真的喔。不是我不想幫啦。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_7',
            text: '「流程怎麼寫，我就怎麼站嘛。你要查什麼跟我說喔——在我職責範圍裡的，我都配合啦。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_8',
            text: '「影城這幾年真的很不容易啊……再多一個負面，我……唉，大家都不用玩了嘛，你說是不是喔。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_9',
            text: '「規矩是死的，現場是活的喔。可是我們還是盡量照規矩走啦——這樣才有依據嘛，出了事才說得清楚。」',
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
            text: '「走道像水流啦——散場就這樣，流進去流出來，沒人真的看清楚水裡有什麼。」',
            type: 'casual',
            weight: 3,
          },
          {
            id: 'casual_2',
            text: '「散場後那兩分鐘，人潮一出來我就跟著跑。要叫人走又不能太兇，這就是我的工作嘛。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_3',
            text: '「鏡頭跟你說照到了，不代表真的看見啦。那是兩回事喔。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_4',
            text: '「哪裡有問題，心裡有數喔。但問題是——我說有才算數嗎？也得有人告訴我、授權我才行嘛。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_5',
            text: '「那段空白……說白了，不是沒人看，是每個人都以為別人在看。這種事最難查的就是這樣啦。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_6',
            text: '「我走制度規定的路。兇手走的是知道制度縫在哪的路。這不一樣啦，你懂嗎？」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_7',
            text: '「有些角落嘛，我走一千次都沒事，久了就變成沒事的地方。可是沒事不代表沒問題喔。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_8',
            text: '「死角？哪裡有問題，自己清楚就好啦。說太清楚，反而以後麻煩嘛——你明白的吧。」',
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
            text: '「表上怎麼寫，我就怎麼放。這沒什麼好多說的嘛。」',
            type: 'casual',
            weight: 3,
          },
          {
            id: 'casual_2',
            text: '「燈是燈、片是片。我管銀幕，不管觀眾。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_3',
            text: '「我不記得人臉。我記時間——哪個時間、哪個動作，我才記得住。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_4',
            text: '「那天有哪裡怪嗎？……我說不上來喔。反正照表走就對了，別的不是我的事嘛。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_5',
            text: '「問我誰改的，我也不知道啊。表到我手上就那樣，我沒問來源。問了也不會有人告訴我嘛。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_6',
            text: '「表從哪來、誰改的，那都不是我這層負責的嘛。我只管把表上的做到位就好啦。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_7',
            text: '（停頓，像在心裡算什麼）「……幾點可以走了？」（看見 KK 的眼神）「——不是說你，我自己在算喔。」',
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
            text: '「你們都問我看到什麼，我說了喔——我看地板、看字跡、看鞋印。不看臉。臉會說謊，地板不會嘛。」',
            type: 'casual',
            weight: 3,
          },
          {
            id: 'casual_2',
            text: '「有的東西啊，說了怕吧……你說怕不怕？我反正心裡有數，你問就說喔，就這樣。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_3',
            text: '「有一筆字被重寫了兩次耶——第一次是改，第二次是改到像沒改。字是新的，灰是舊的，這種東西不會幫誰說謊啦，我看得出來喔。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_4',
            text: '「那邊的足跡方向我不認識嘛，走法不一樣，不像我們的人走的喔。我做這行久了，腳印這種東西我看得出來。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_5',
            text: '「那段黑啊，不是浪漫那種——是最容易讓人從人群裡消失的那種黑嘛。散場燈沒亮的時候，誰都變成沒有輪廓的影子。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_6',
            text: '「我本來想早點走的啦……但那天感覺還沒完嘛，就多待了一下喔。結果真的沒完。有時候這種直覺比較準啦。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_7',
            text: '「我們是最後收尾的啦，人家留什麼我就清什麼喔。有的時候，我比你們更早看到有什麼東西嘛。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_8',
            text: '「有的東西我不會亂講啦——可是你真的想問嘛，就直接問喔。我說不說是一回事，但我說的一定是真的。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_fear',
            text: '「唉呀，做二十年了，每次遇到這種事還是會怕啦——但你怕歸怕，又忍不住想知道是怎麼回事嘛，你說是不是喔？」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_effort',
            text: '「我負責的範圍，我敢說清楚喔。超出去的我不亂講——但超出去的，可能才是重點啦，你自己想想嘛。」',
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
  // 第一章 林瑞堂（副理）— 敏感問題一：流程與權限 / 敏感問題二：他在怕什麼（二選一，問完設 npc_lin_sensitive_done）
  npc_lin_ruitang: {
    // === 敏感問題一：流程與權限 ===
    'node_lin_light_1': {
      id: 'node_lin_light_1',
      npcId: 'npc_lin_ruitang',
      text: 'KK：「散場燈晚亮三分鐘。這不是觀眾感受，是設定被動過。誰有權限？」\n\n林瑞堂：「那個……影城現場有一些彈性調整啦，主要還是為了觀影體驗嘛。」\n\nKK：「我問的不是理由。我問的是，誰能改。」\n\n林瑞堂：「一般來說喔，這種東西要看管理層級，不是誰都能碰啦。」\n\nKK：「也就是說，不是放映員自己按爽的。」\n\n林瑞堂：「當然不是啊，我們都有流程的。」\n\nKK：「那天的流程，是誰開的口？誰讓手動模式成立？」\n\n林瑞堂：「有時候現場會依狀況微調，口頭交辦也算內部協調的一種啦……」\n\nKK（旁白）：他講得像一張表。表面平整，下面壓著名字。',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_lin_light_2',
    },
    'node_lin_light_2': {
      id: 'node_lin_light_2',
      npcId: 'npc_lin_ruitang',
      text: 'KK：「你一直說『流程正常』。正常流程裡，手動切換要不要留紀錄？」\n\n林瑞堂：「原則上會有啦。」\n\nKK：「那就不是意外，是可追的操作。」\n\n林瑞堂：「我只能說，這種調整不會是基層自己決定的喔。」\n\nKK：「好。那我換個問法：你知道那不是基層做的。」\n\n林瑞堂：「……我知道它不會憑空發生。」\n\nKK（旁白）：他終於肯把「流程」說成人做的事。只是一句。夠用了。',
      choices: [
        { id: 'choice_done', label: '結束', effects: [{ type: 'setFlag', flag: 'npc_lin_sensitive_done', value: true }] },
      ],
    },
    // === 敏感問題二：他在怕什麼 ===
    'node_lin_fear_1': {
      id: 'node_lin_fear_1',
      npcId: 'npc_lin_ruitang',
      text: 'KK：「你每次說到那三分鐘，聲音都會先小一格。你怕什麼？」\n\n林瑞堂：「我沒有怕啊，我只是……現在事情很大，講話當然要小心嘛。」\n\nKK：「你不是怕講錯。你是怕講對。」\n\n林瑞堂：「你這樣講就太重了啦。」\n\nKK：「你怕的是兇手知道你開口，還是上面知道你沒把嘴閉好？」\n\n林瑞堂：「……這種事情，一旦傳出去，先死的都不是做決定的人。」\n\nKK：「所以你知道有人做了決定。」\n\n林瑞堂：「我只是副理。我能做的，是不要讓事情再失控。」\n\nKK（旁白）：他把「保命」講成「控管」。這種人最會替恐懼打領帶。',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_lin_fear_2',
    },
    'node_lin_fear_2': {
      id: 'node_lin_fear_2',
      npcId: 'npc_lin_ruitang',
      text: 'KK：「影城被毀，你剛才說了兩次。你在乎的到底是死者，還是品牌？」\n\n林瑞堂：「我當然也替死者遺憾啊。可是事情不能整個炸掉嘛。」\n\nKK：「對你來說，死人是一件事；失控，是另一件更大的事。」\n\n林瑞堂：「……你不在這位置，你不會懂。」\n\nKK：「我懂。你不是沒看見，你是先決定哪些看見能活下去。」\n\n林瑞堂沉默。\n\nKK（旁白）：他不是冷血。他只是把良心排在營運後面。排久了，就像天生的一樣。',
      choices: [
        { id: 'choice_done', label: '結束', effects: [{ type: 'setFlag', flag: 'npc_lin_sensitive_done', value: true }] },
      ],
    },
  },
  // 第一章 NPC：阿順（巡場保全）— 敏感一：散場空窗與動線 / 敏感二：他為什麼這麼懂死角（二選一，各獨立起點）
  npc_ashun: {
    // === 敏感問題一：散場空窗與動線 ===
    'node_ashun_window_1': {
      id: 'node_ashun_window_1',
      npcId: 'npc_ashun',
      text: 'KK：「散場那幾分鐘，你們巡場怎麼走？先顧哪裡，後顧哪裡？」\n\n阿順：「先看出口嘛，怕人卡住、怕有人跌。散場一出來都先順人流。」\n\nKK：「那廳內最後幾排呢？誰顧？」\n\n阿順：「理論上會掃一下，但真的忙起來，就是先把會動的先送出去啦。」\n\nKK：「所以有一小段時間，H 排那塊是空的。」\n\n阿順：「空倒也不是完全空啦，是你人在附近，也不一定看得到那裡。」\n\nKK：「多久？」\n\n阿順：「一分鐘上下。熟的人，夠用了。」\n\nKK：「從哪條線走最快？」\n\n阿順：「側走道。靠出口燈箱那邊切出去，快，也不顯眼。」\n\nKK（旁白）：他說得像報路。有人走過很多次，路才會長成嘴裡這麼順。',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_ashun_window_2',
    },
    'node_ashun_window_2': {
      id: 'node_ashun_window_2',
      npcId: 'npc_ashun',
      text: 'KK：「如果有人在那段時間靠近 H 排 12，再離開，最容易從哪裡消失？」\n\n阿順：「側走道出去，轉角一拐，鏡頭接不上，人就像被地板吞掉一樣。」\n\nKK：「所以不是沒人看，是看不全。」\n\n阿順：「對啊。有監視器，跟看得到，是兩回事嘛。」\n\nKK（旁白）：這地方從來不缺眼睛。缺的是眼睛之間那一下眨眼。',
      choices: [
        { id: 'choice_done', label: '結束', effects: [{ type: 'setFlag', flag: 'npc_ashun_sensitive_done', value: true }] },
      ],
    },
    // === 敏感問題二：他為什麼這麼懂死角 ===
    'node_ashun_deadzone_1': {
      id: 'node_ashun_deadzone_1',
      npcId: 'npc_ashun',
      text: 'KK：「你講死角的口氣，像在講自己房間。」\n\n阿順：「做久了都這樣啦。哪裡會被客訴、哪裡最容易出事，心裡要有數啊。」\n\nKK：「你知道哪裡能藏人，也知道哪裡能讓人消失。」\n\n阿順：「保全本來就得知道這個，不然怎麼巡？」\n\nKK：「我在想的是另一件事。你是拿這些地方來防事，還是早就習慣拿它們來解釋事發之後的空白？」\n\n阿順：「……你這句就有點狠了。」\n\nKK：「狠的是現場，不是我。你剛才說『熟的人，夠用了』。你說那句話時，太順了。」\n\n阿順：「因為我知道那種窗口多大。做這行，總要先往壞的想嘛。」\n\nKK（旁白）：他不是心虛。他是太熟。熟到連無辜都要先學會怎麼聽起來像無辜。',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_ashun_deadzone_2',
    },
    'node_ashun_deadzone_2': {
      id: 'node_ashun_deadzone_2',
      npcId: 'npc_ashun',
      text: 'KK：「那天之後，你第一個反應是什麼？」\n\n阿順：「想說完了啦，這下事情大了。」\n\nKK：「你想到的是死人，還是想到『會有人來查監視器』？」\n\n阿順：「……都有。先想到哪個，有差嗎？」\n\nKK：「有。先想到鏡頭的人，平常就活在鏡頭裡。」\n\n阿順：「我吃這行飯，當然得先想那個。」\n\nKK（旁白）：他沒撒謊。只是每句真話都剛好擋在更裡面那句前面。',
      choices: [
        { id: 'choice_done', label: '結束', effects: [{ type: 'setFlag', flag: 'npc_ashun_sensitive_done', value: true }] },
      ],
    },
  },
  // 第一章 NPC：小張（放映員）— 敏感一：表格、口頭指示、操作順序 / 敏感二：他為什麼不問（二選一，各獨立起點）
  npc_xiaozhang: {
    // === 敏感問題一：表格、口頭指示、操作順序 ===
    'node_xiaozhang_table_1': {
      id: 'node_xiaozhang_table_1',
      npcId: 'npc_xiaozhang',
      text: 'KK：「那天你是先看到表被改，還是先聽到有人交代？」\n\n小張：「先看到表。後來才有人講一句，說燈不用急著開。」\n\nKK：「所以表跟口頭指示，是對得上的。」\n\n小張：「對啊。表上怎麼寫，我就怎麼按。有人補一句，我也只當確認。」\n\nKK：「那張表平常放哪？誰碰得到？」\n\n小張：「播映室裡，但不是誰都會去改。要嘛主管，要嘛有被交代的人。」\n\nKK：「你看得出來是臨時改的？」\n\n小張：「紅筆改的，時間往後挪三分鐘。看得出來啦。」\n\nKK：「你沒回頭確認？」\n\n小張：「沒有。表就是命令。」\n\nKK（旁白）：他不是裝傻。他是真的把服從練成了反射。這種人碰上壞命令，很安靜。',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_xiaozhang_table_2',
    },
    'node_xiaozhang_table_2': {
      id: 'node_xiaozhang_table_2',
      npcId: 'npc_xiaozhang',
      text: 'KK：「手動模式也是你切的？」\n\n小張：「我照表操作，該切就切。」\n\nKK：「也就是說，那晚不是系統自己跑，是有人要你不要讓它自己跑。」\n\n小張：「……可以這樣說。」\n\nKK：「這句話你剛才不想說。」\n\n小張：「我只是不喜歡把事情講得像我有決定權。」\n\nKK（旁白）：沒決定權的人，常常是最完整的執行面。刀不決定往哪裡去，但傷口得算在它身上。',
      choices: [
        { id: 'choice_done', label: '結束', effects: [{ type: 'setFlag', flag: 'npc_xiaozhang_sensitive_done', value: true }] },
      ],
    },
    // === 敏感問題二：他為什麼不問 ===
    'node_xiaozhang_oral_1': {
      id: 'node_xiaozhang_oral_1',
      npcId: 'npc_xiaozhang',
      text: 'KK：「你其實覺得怪，對吧？」\n\n小張：「怪的事情很多啊。放映室每天都有人臨時改東西。」\n\nKK：「可不是每天都有人死。」\n\n小張：「……」\n\nKK：「你不是沒感覺。你是習慣把感覺關掉。」\n\n小張：「做這工作，問太多沒有用。問了也不會有人跟你講。」\n\nKK：「所以你先學會不問。」\n\n小張：「對。這樣比較不會出錯。」\n\nKK：「還是比較不會害到自己？」\n\n小張：「……都有。」\n\nKK（旁白）：他把退讓說成專業。這地方最省事的齒輪，往往轉得最久。',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_xiaozhang_oral_2',
    },
    'node_xiaozhang_oral_2': {
      id: 'node_xiaozhang_oral_2',
      npcId: 'npc_xiaozhang',
      text: 'KK：「那句『燈不用急著開』，你記到現在。表示它有刺到你。為什麼？」\n\n小張：「因為那句話怪。講得太順，像早就想好了。」\n\nKK：「你當時有沒有一瞬間想過：這樣不好？」\n\n小張：「有。可是我片要顧、表要對、時間在跑。你停一下，後面全亂。」\n\nKK：「所以你選了讓片子順。」\n\n小張：「嗯。」\n\nKK（旁白）：有些人不是沒良心。他只是每天都在一堆小服從裡，把它磨薄。',
      choices: [
        { id: 'choice_done', label: '結束', effects: [{ type: 'setFlag', flag: 'npc_xiaozhang_sensitive_done', value: true }] },
      ],
    },
  },
  // 第一章 NPC：周姊（清潔）— 敏感一：清潔順序與異常痕跡 / 敏感二：她為什麼沒立刻報（二選一，各獨立起點）
  npc_zhou_jie: {
    // === 敏感問題一：清潔順序與異常痕跡 ===
    'node_zhou_clean_1': {
      id: 'node_zhou_clean_1',
      npcId: 'npc_zhou_jie',
      text: 'KK：「你平常收這一區，順序怎麼走？」\n\n周姊：「先外面、再廁所、最後補角落啊。洗手台下面那種地方，不會第一個動啦。」\n\nKK：「所以你看到那裡特別乾淨，才覺得不對。」\n\n周姊：「對嘛。那種地方正常會卡灰、卡頭髮、卡一點紙屑。那天像被人先抹過一遍，不是我做的喔。」\n\nKK：「不是單純乾淨，是乾淨的位置不對。」\n\n周姊：「對。乾淨也有順序的啦。那種乾淨，是急的。」\n\nKK：「急著擦的人，漏了什麼？」\n\n周姊：「漏了灰。灰是舊的，東西是新的，一眼就知道有人動過。」\n\nKK（旁白）：她看地板，比很多人看人還準。地板不演。灰也不會。',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_zhou_clean_2',
    },
    'node_zhou_clean_2': {
      id: 'node_zhou_clean_2',
      npcId: 'npc_zhou_jie',
      text: 'KK：「燈晚亮，你也是靠工作順序感覺出來的？」\n\n周姊：「當然啊。燈一亮，人散差不多，我們才好進。那天就是拖得特別久。」\n\nKK：「久到會影響你進場時間。」\n\n周姊：「久到我站在外面一直看錶，心裡想到底在拖什麼。」\n\nKK（旁白）：表格記的是分鐘。做事的人記的是卡住的那口氣。後者比較接近真相。',
      choices: [
        { id: 'choice_done', label: '結束', effects: [{ type: 'setFlag', flag: 'npc_zhou_jie_sensitive_done', value: true }] },
      ],
    },
    // === 敏感問題二：她為什麼沒立刻報（黑色碎片：若由周姊交出 → 接續燈與碎片感受）===
    // 若玩家已從洗手台取得碎片（black_fragment_found），由此節點進入，不重複給碎片
    'node_zhou_fragment_1_already_have': {
      id: 'node_zhou_fragment_1_already_have',
      npcId: 'npc_zhou_jie',
      text: '周姊點點頭：「你已經找到那片了是不是？那就好喔。」\n\nKK：「嗯。」\n\n周姊又瞄了一眼洗手台那邊。「那種東西不會幫誰說謊啦。灰是舊的，東西是新的。」',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_zhou_fragment_2',
    },
    'node_zhou_fragment_1': {
      id: 'node_zhou_fragment_1',
      npcId: 'npc_zhou_jie',
      text: '周姊：「我在洗手台下面看到一小片黑色的，像塑膠也像橡膠。我沒敢亂動。」\n\nKK：「你沒直接報上去。為什麼？」\n\n周姊：「因為那時候太亂啦。還有……有些東西你一喊出來，就會先不見。」\n\nKK：「你不信現場會把它留住。」\n\n周姊：「我做這麼久，看過太多『清掉就算了』的啦。這種小東西，一轉頭就沒了。」\n\nKK：「所以你先替它活著。」\n\n周姊：「你要這樣講，也行啦。反正我不想它跟垃圾一起走。」\n\nKK（旁白）：她不是在破壞流程。她只是早就知道，有些流程專門拿來讓東西消失。',
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
      text: 'KK：「那晚燈一直不亮，你那時候在想什麼？」\n\n周姊：「老實講？有點毛。」\n\nKK：「因為晚了，還是因為晚得很像故意？」\n\n周姊：「後者啦。工作做久了，很多事情你不知道原因，可是你知道那不是正常慢。那是有人要它慢。」\n\nKK：「所以你後來看到那片碎片，才沒辦法裝沒事。」\n\n周姊：「對。那種感覺會黏住人。你回家洗手都還在。」\n\nKK（旁白）：有些證物不是躺在地上。是先卡在人心裡，等有人肯彎腰。',
      choices: [
        { id: 'choice_done', label: '結束', effects: [{ type: 'setFlag', flag: 'npc_zhou_jie_sensitive_done', value: true }] },
      ],
    },
  },
};

export { scenes, items, npcDialogs };
