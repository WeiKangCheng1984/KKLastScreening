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
  'item_schedule_modified': {
    id: 'item_schedule_modified',
    name: '播映時間表（塗改）',
    description: '一張播映時間表，上面有塗改的痕跡。\n\n原本某一欄被劃掉，旁邊用紅筆寫了新的時間。',
    svgImage: '/svg/items/schedule_modified.svg',
    svgSize: 'medium',
    collectible: true,
  },
  'item_projector_notes': {
    id: 'item_projector_notes',
    name: '放映員的筆記',
    description: '一張便條紙貼在控制台上。\n\n字跡匆忙，內容跟燈有關。',
    svgImage: '/svg/items/projector_notes.svg',
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
  'item_light_control_note': {
    id: 'item_light_control_note',
    name: '燈控紀錄',
    description: '燈控面板旁的紀錄。\n\n當天的紀錄顯示開關指在手動那一側。',
    svgImage: '/svg/items/schedule_modified.svg',
    svgSize: 'medium',
    collectible: true,
  },
  'item_cleaning_note': {
    id: 'item_cleaning_note',
    name: '清潔備忘',
    description: '廁所區域的清潔備忘。\n\n上面記了當天的清潔狀況；垃圾桶那欄寫得很簡短，看起來很空。',
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
        shape: 'rect',
        coords: [1.19, 1.62, 0.15, 0.15],
        description: '地上的電影票根',
        hint: '一張死者遺留的票根，靜靜躺在地上。',
      },
      // 好笑無意義互動點（放映廳）
      { id: 'hotspot_fun_popcorn', shape: 'rect', coords: [1.55, 1.6, 0.15, 0.15], description: '爆米花殘渣', hint: '地上有幾顆沒吃完的爆米花。' },
      { id: 'hotspot_fun_cup', shape: 'rect', coords: [0.03, 1.38, 0.15, 0.15], description: '空飲料杯', hint: '一個空杯還插著吸管。' },
      { id: 'hotspot_fun_jacket', shape: 'rect', coords: [0.02, 1.5, 0.15, 0.15], description: '椅背上的外套', hint: '一件外套掛在椅背上。' },
      { id: 'hotspot_fun_screen_dust', shape: 'rect', coords: [1.75, 1.2, 0.15, 0.15], description: '銀幕邊角', hint: '銀幕邊角有一小塊灰。' },
      { id: 'hotspot_fun_ac', shape: 'rect', coords: [0.52, 0.15, 0.15, 0.15], description: '冷氣出風口', hint: '冷氣呼呼吹。' },
      { id: 'hotspot_fun_exit_sign', shape: 'rect', coords: [0.12, 1.1, 0.15, 0.15], description: '散場告示', hint: '「散場請依序離場」。' },
      { id: 'hotspot_fun_seat_number', shape: 'rect', coords: [1.1, 1.45, 0.15, 0.15], description: '座位號碼牌', hint: '椅背上的座位號碼。' },
      { id: 'hotspot_fun_carpet_stain', shape: 'rect', coords: [0.58, 1.25, 0.15, 0.15], description: '地毯污漬', hint: '地毯上有一小塊深色污漬。' },
      { id: 'hotspot_fun_popcorn_bucket', shape: 'rect', coords: [0.70, 1.72, 0.15, 0.15], description: '空爆米花桶', hint: '一個倒地的空爆米花桶。' },
      {
        id: 'hotspot_victim_seat',
        shape: 'rect',
        coords: [0.44, 1.45, 0.2, 0.22],
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
      { id: 'fun_seat_number', name: '座位號碼牌', description: '無意義互動', requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_seat_number' }], effects: [{ type: 'showDialog', dialog: { text: '你盯著號碼牌看了三秒。H排12號。你開始認真考慮要不要把這張椅子帶回去當紀念。不，你沒有。你是專業的。', type: 'narrator' } }], oneTime: false },
      { id: 'fun_carpet_stain', name: '地毯污漬', description: '無意義互動', requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_carpet_stain' }], effects: [{ type: 'showDialog', dialog: { text: '你蹲下來聞了聞。……你立刻站起來，並決定這一段不會出現在任何正式紀錄裡。可樂。一定是可樂。', type: 'narrator' } }], oneTime: false },
      { id: 'fun_popcorn_bucket', name: '空爆米花桶', description: '無意義互動', requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_popcorn_bucket' }], effects: [{ type: 'showDialog', dialog: { text: '你盯著空桶看了很久。如果兇手當時正在吃爆米花，他會選鹹的還是甜的？……你揉了揉太陽穴。該休息了。', type: 'narrator' } }], oneTime: false },
    ],
    puzzles: [
      {
        id: 'puzzle_ch1_how_murder_happened',
        type: 'input',
        solution: '延後亮燈3分鐘',
        hint: '拼合線索：\n1. 亮燈延後（播映時間表 + 燈控面板）\n2. 監視器時間（90秒內離開）\n3. 死亡時間（散場後，約00:10-00:15）\n\n推理過程：\n- 兇手知道燈會延後3分鐘\n- 利用這3分鐘完成犯案\n- 在燈亮前離開現場',
        requirements: [
          { type: 'hasItem', itemId: 'item_schedule_modified' },
          { type: 'hasFlag', flag: 'clue_light_delay_confirmed', value: true },
          { type: 'hasFlag', flag: 'security_monitor_viewed', value: true },
        ],
        onSolve: [
          {
            type: 'showDialog',
            dialog: {
              text: '你理解了兇手的手法。\n\n兇手需要非常清楚「燈什麼時候亮」。\n兇手熟悉電影院流程。\n兇手有權限或關係影響燈控。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'puzzle_ch1_solved', value: true },
          { type: 'setFlag', flag: 'chapter2_unlocked', value: true },
        ],
      },
      // 第一章章末：解謎（6 道具選 3 個，三組正確組合各對應一條線索，集滿即完成）
      {
        id: 'ch1_pair_matching',
        type: 'pick_three',
        solution: [
          ['item_ticket_stub', 'item_schedule_modified', 'item_projector_notes'],
          ['item_projector_notes', 'item_light_control_note', 'item_schedule_modified'],
          ['item_black_plastic_fragment', 'item_cleaning_note', 'item_ticket_stub'],
        ],
        hint: '選出三樣道具組合成線索。共有三種正確組合，集滿三條線索即完成。',
        requirements: [
          { type: 'hasItem', itemId: 'item_ticket_stub' },
          { type: 'hasItem', itemId: 'item_schedule_modified' },
          { type: 'hasItem', itemId: 'item_projector_notes' },
          { type: 'hasItem', itemId: 'item_light_control_note' },
          { type: 'hasItem', itemId: 'item_black_plastic_fragment' },
          { type: 'hasItem', itemId: 'item_cleaning_note' },
        ],
        config: {
          clues: [
            '【推理】場次與亮燈時間完全吻合——兇手清楚知道何時熄燈、何時亮燈，才能利用這段黑暗行動。這表示他熟悉放映流程或能取得時程。',
            '【推理】有人下達了「延後亮燈」的指示，且此人能接觸燈控。兇手若非親自操作，就是能影響操作者，代表具備內部權限或人際管道。',
            '【推理】手套碎片出現在洗手台下方，且該處有異常清潔痕跡。可推論：兇手在現場處理過物品並刻意清理，熟悉動線且不想留下證據。',
          ],
        },
        onSolve: [
          { type: 'setFlag', flag: 'ch1_puzzle_done', value: true },
        ],
      },
      // 第一章章末：推理題一（含混淆詞增加難度）
      {
        id: 'ch1_reasoning_1',
        type: 'arrangement',
        solution: ['兇手', '在', '規定的黑暗裡', '動手'],
        hint: '請將打亂的字詞排成一句與案情有關的完整句子。',
        requirements: [],
        config: { distractors: ['也許', '然後', '觀眾', '燈光', '銀幕'] },
        onSolve: [],
      },
      // 第一章章末：推理題二
      {
        id: 'ch1_reasoning_2',
        type: 'arrangement',
        solution: ['散場', '延後亮燈', '三分鐘', '是', '關鍵'],
        hint: '請將打亂的字詞排成一句與案情有關的完整句子。',
        requirements: [],
        config: { distractors: ['所以', '因此', '流程', '清潔', '出口'] },
        onSolve: [],
      },
      // 第一章章末：推理題三
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
      text: '散場後的世界很吵。塑膠杯、手機光、鞋底黏住地毯的聲音。可這個人死得太安靜。像有人把「求救」剪掉了。\n\n影城那邊負責品牌、設備與排程的人已在路上，很快就到。',
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
            text: '「辛苦你跑一趟，真的…我們也很遺憾，誰也不想這樣。」',
            type: 'casual',
            weight: 3,
          },
          {
            id: 'casual_2',
            text: '「今天其實人不多，照理說不會有混亂…應該是個案啦。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_3',
            text: '「我們都有SOP啦，該做的都有做。清場、巡場什麼的，盡量照規矩來。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_4',
            text: '「你看，現在大家都很緊張，拜託你也別把事情講得太可怕。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_5',
            text: '「如果你需要資料，我都能給，但我們希望…不要影響我們之後營運。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_6',
            text: '「我們跟警方都配合到底了，拜託別再擴大…對大家都好。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_7',
            text: '「你要查什麼跟我說，我們能配合的都會配合。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_8',
            text: '「影城這幾年很不容易。再來一個負面，大家都不用玩了。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_9',
            text: '「規矩是規矩，現場總有狀況嘛。我們盡量啦。」',
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
            text: '「現場我們會先封著，影城那邊我們也通知了，品牌、技術什麼的在路上，很快就到。你先看，看到什麼就照實說。」',
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
            text: '「這裡最安全啦，監視器多到像在拍真人秀。」',
            type: 'casual',
            weight: 3,
          },
          {
            id: 'casual_2',
            text: '「散場最亂的不是人，是垃圾。人一走，滿地都是。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_3',
            text: '「電影結束那段最暗，大家眼睛還沒醒，什麼都看不清。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_4',
            text: '「你要找兇手？…那種事我哪知道，我就負責疏導而已。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_5',
            text: '「散場那幾分鐘人都在動啊，我們也是跟著人潮走。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_6',
            text: '「我每天走同一條路，哪裡有問題我大概知道。就這樣。」',
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
            text: '「大家都說有監視器就沒事啊…嗯，反正有啦。」',
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
        shape: 'rect',
        coords: [0.11, 0.48, 0.15, 0.15],
        description: '播映時間表',
        hint: '一張播映時間表，上面有塗改的痕跡；某一欄被劃掉，旁邊用紅筆寫了新的時間。',
      },
      {
        id: 'hotspot_light_control_panel',
        shape: 'rect',
        coords: [1.4, 0.76, 0.15, 0.15],
        description: '燈控面板',
        hint: '燈控面板旁的紀錄；開關指在手動那一側。',
      },
      {
        id: 'hotspot_projector_notes',
        shape: 'rect',
        coords: [1.10, 0.79, 0.15, 0.15],
        description: '放映員的筆記',
        hint: '一張便條紙貼在控制台上。字跡匆忙，但內容清楚。',
      },
      {
        id: 'hotspot_security_monitor',
        shape: 'rect',
        coords: [0.79, 0.68, 0.15, 0.15],
        description: '監視器畫面',
        hint: '監視器畫面正在播放案發當晚的錄影。昏暗的光線裡，畫面有人影晃動。',
      },
      // 好笑無意義互動（播映室）
      { id: 'hotspot_fun_coffee', shape: 'rect', coords: [0.53, 0.61, 0.15, 0.15], description: '咖啡杯', hint: '小張的咖啡杯。' },
      { id: 'hotspot_fun_snack', shape: 'rect', coords: [1.50, 0.62, 0.15, 0.15], description: '零食袋', hint: '一包沒吃完的洋芋片。' },
      { id: 'hotspot_fun_chair_wheel', shape: 'rect', coords: [0.25, 1.01, 0.15, 0.15], description: '椅子輪子', hint: '控制椅的輪子。' },
      { id: 'hotspot_fun_sticker', shape: 'rect', coords: [0.34, 0.56, 0.15, 0.15], description: '按鈕上的貼紙', hint: '某個按鈕上貼著「勿按」。' },
      { id: 'hotspot_fun_remote', shape: 'rect', coords: [0.10, 0.78, 0.15, 0.15], description: '冷氣遙控器', hint: '冷氣遙控器。' },
      { id: 'hotspot_fun_magazine', shape: 'rect', coords: [1.64, 0.60, 0.15, 0.15], description: '舊雜誌', hint: '一本過期的電影雜誌。' },
      { id: 'hotspot_fun_whiteboard', shape: 'rect', coords: [0.98, 0.5, 0.15, 0.15], description: '白板', hint: '白板上畫著一個笑臉。' },
    ],
    items: [
      items.item_schedule_modified,
      items.item_projector_notes,
      items.item_light_control_note,
    ],
    hotspotEventMap: {
      'hotspot_screening_schedule': 'examine_screening_schedule',
      'hotspot_light_control_panel': 'examine_light_control',
      'hotspot_projector_notes': 'examine_projector_notes',
      'hotspot_security_monitor': 'view_security_monitor',
      'hotspot_fun_coffee': 'fun_coffee',
      'hotspot_fun_snack': 'fun_snack',
      'hotspot_fun_chair_wheel': 'fun_chair_wheel',
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
          { type: 'addItem', itemId: 'item_schedule_modified' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：播映時間表（塗改）\n\n一張播映時間表，上面有塗改的痕跡。\n\n原本某一欄被劃掉，旁邊用紅筆寫了新的時間。\n\n這個改動很細微，如果不是仔細看，根本不會注意到。',
              type: 'item',
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
          { type: 'addItem', itemId: 'item_light_control_note' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：燈控紀錄\n\n燈控面板旁的紀錄。\n\n當天的紀錄顯示開關指在手動那一側。',
              type: 'item',
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
          { type: 'addItem', itemId: 'item_projector_notes' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：放映員的筆記\n\n一張便條紙貼在控制台上。\n\n字跡匆忙，但內容清楚：\n「那天有人說，燈不用急著開。」\n\n沒有署名，沒有時間。',
              type: 'item',
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
      { id: 'fun_sticker', name: '按鈕上的貼紙', description: '無意義互動', requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_sticker' }], effects: [{ type: 'showDialog', dialog: { text: '某個按鈕上貼著「勿按」。你沒有按。你是一個成熟的偵探。', type: 'narrator' } }], oneTime: false },
      { id: 'fun_remote', name: '冷氣遙控器', description: '無意義互動', requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_remote' }], effects: [{ type: 'showDialog', dialog: { text: '冷氣遙控器。上面貼著「遺失賠償五百」。你放下了。', type: 'narrator' } }], oneTime: false },
      { id: 'fun_magazine', name: '舊雜誌', description: '無意義互動', requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_magazine' }], effects: [{ type: 'showDialog', dialog: { text: '一本過期的電影雜誌。封面是半年前的強片。時光飛逝。', type: 'narrator' } }], oneTime: false },
      { id: 'fun_whiteboard', name: '白板', description: '無意義互動', requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_whiteboard' }], effects: [{ type: 'showDialog', dialog: { text: '白板上畫著一個笑臉和「今天也要加油」。你沒有笑。但你有點想笑。', type: 'narrator' } }], oneTime: false },
    ],
    puzzles: [],
    initialDialog: {
      text: '播映室裡，控制台和設備都在正常運作。\n\n但在這片正常中，有什麼被改動過。負責設備與排程的人稍後也會到場。',
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
            text: '「我們只按表做事。表上寫什麼，我就做什麼。」',
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
            text: '「表怎麼來的我不清楚，我只看表做事。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_5',
            text: '「那天…好像有哪裡怪怪的，我也說不上來。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_6',
            text: '「反正就是照表走嘛，表從哪來我們也不會問。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_7',
            text: '「我們看銀幕啦，觀眾區那邊不是我們管的。」',
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
        shape: 'rect',
        coords: [1.72, 1.72, 0.15, 0.15],
        description: '洗手台下方',
        hint: '在洗手台下方，你發現了一小片黑色塑膠。',
      },
      {
        id: 'hotspot_trash_bin',
        shape: 'rect',
        coords: [0.95, 0.95, 0.15, 0.15],
        description: '垃圾桶',
        hint: '垃圾桶裡幾乎是空的。',
      },
      {
        id: 'hotspot_mirror',
        shape: 'rect',
        coords: [1.5, 0.58, 0.15, 0.15],
        description: '鏡子',
        hint: '你在鏡子裡看見自己，和一個沒有留下痕跡的人。',
      },
      // 好笑無意義互動（廁所）
      { id: 'hotspot_fun_dryer', shape: 'rect', coords: [1.00, 0.66, 0.15, 0.15], description: '烘手機', hint: '烘手機。' },
      { id: 'hotspot_fun_soap', shape: 'rect', coords: [1.40, 0.86, 0.15, 0.15], description: '洗手乳', hint: '洗手乳是檸檬味。' },
      { id: 'hotspot_fun_towel', shape: 'rect', coords: [0.93, 0.54, 0.15, 0.15], description: '擦手紙', hint: '擦手紙盒上寫著「一次取用一張」。' },
      { id: 'hotspot_fun_sign', shape: 'rect', coords: [0.1, 0.58, 0.15, 0.15], description: '標語', hint: '牆上貼著「如廁後請沖水」。' },
      { id: 'hotspot_fun_air_freshener', shape: 'rect', coords: [0.22, 0.73, 0.15, 0.15], description: '芳香劑', hint: '自動芳香劑。' },
      { id: 'hotspot_fun_faucet', shape: 'rect', coords: [1.56, 0.91, 0.15, 0.15], description: '水龍頭', hint: '水龍頭。' },
      { id: 'hotspot_fun_floor', shape: 'rect', coords: [0.74, 1.56, 0.15, 0.15], description: '地板反光', hint: '地板擦得很亮。' },
    ],
    items: [
      items.item_black_plastic_fragment,
      items.item_cleaning_note,
    ],
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
          { type: 'addItem', itemId: 'item_cleaning_note' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：清潔備忘\n\n廁所區域的清潔備忘；垃圾桶那欄寫得很簡短，看起來很空。\n\n沒有血跡，沒有可疑物品。\n\n但這種「空」本身就很可疑。',
              type: 'item',
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
      text: '廁所裡很乾淨，幾乎是空的。\n\n但在這片乾淨中，你感覺到一種說不上來的異樣。',
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
            text: '「你們都看監視器，我只看地板。地板不會撒謊。」',
            type: 'casual',
            weight: 3,
          },
          {
            id: 'casual_2',
            text: '「做久了，什麼狀況都看過啦。有的時候反而…嗯，沒事。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_3',
            text: '「有的人很愛乾淨，擦到發亮那種。可是再怎麼擦…總會漏一點啦。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_4',
            text: '「散場那段黑，不是浪漫，是最容易把人變成『沒人注意』。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_5',
            text: '「有的地方那天特別好擦，我也不知道為什麼。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_6',
            text: '「那天我等到很晚才開始收，也不知道在等什麼…就覺得還沒完。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_7',
            text: '「我們是最後收尾的嘛，人家留什麼我們就清什麼。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_8',
            text: '「有的東西…我不會亂講啦。你如果真的想問，再問吧。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_fear',
            text: '「這種事…我做二十年了，每次聽到還是會怕。我只要把該擦的地方擦乾淨就好。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_effort',
            text: '「能做的我都有做。至少我負責的範圍，我敢說我盡力了。」',
            type: 'casual',
            weight: 2,
          },
        ],
        available: true,
      },
    ],
  },
  
  /*
    hotspots: [
      { id: 'hotspot_park_bench', shape: 'rect', coords: [0.3, 0.4, 0.5, 0.35], description: '公園長椅', hint: '長椅上有舊雨痕、踩黑的煙頭和刮痕。' },
      { id: 'hotspot_park_flyer', shape: 'rect', coords: [0.15, 0.55, 0.35, 0.25], description: '地上的影城傳單', hint: '傳單被鞋跟踩到紙纖維起毛。' },
      { id: 'hotspot_park_cup', shape: 'rect', coords: [0.5, 0.6, 0.25, 0.22], description: '垃圾桶裡的紙杯', hint: '杯壁上有用油性筆寫的字：「烏」。' },
      { id: 'hotspot_park_sign', shape: 'rect', coords: [0.65, 0.08, 0.3, 0.25], description: '遠處的影城招牌', hint: '「城市影城」四個字還亮著。' },
      { id: 'hotspot_park_phone', shape: 'rect', coords: [0.72, 0.35, 0.22, 0.2], description: '手機通知列', hint: '警方傳來新訊息。' },
      { id: 'hotspot_park_vending', shape: 'rect', coords: [0.08, 0.25, 0.2, 0.35], description: '自動販賣機', hint: '閃著飲料燈箱的販賣機。' },
      { id: 'hotspot_park_cat', shape: 'rect', coords: [0.45, 0.72, 0.22, 0.18], description: '流浪貓', hint: '長椅底下有一隻貓。' },
      { id: 'hotspot_park_signboard', shape: 'rect', coords: [0.08, 0.65, 0.25, 0.2], description: '公園告示牌', hint: '生鏽的告示牌上寫著「夜間請降低音量」。' },
    ],
    items: [],
    hotspotEventMap: {
      'hotspot_park_bench': 'examine_park_bench',
      'hotspot_park_flyer': 'examine_park_flyer',
      'hotspot_park_cup': 'examine_park_cup',
      'hotspot_park_sign': 'examine_park_sign',
      'hotspot_park_phone': 'examine_park_phone',
      'hotspot_park_vending': 'examine_park_vending',
      'hotspot_park_cat': 'examine_park_cat',
      'hotspot_park_signboard': 'examine_park_signboard',
    },
    events: [
      {
        id: 'examine_park_bench',
        name: '公園長椅',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_park_bench' }],
        effects: [{
          type: 'showDialog',
          dialog: {
            text: '幾道淺白痕，方向朝影城。像有人站起來又坐下，反覆練習「走」這件事。',
            type: 'narrator',
          },
        }],
        oneTime: true,
      },
      {
        id: 'examine_park_flyer',
        name: '地上的影城傳單',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_park_flyer' }],
        effects: [{
          type: 'showDialog',
          dialog: {
            text: '標題是「節能新世代設備導入」。內文像公關稿，照片亮得過曝，觀眾的臉糊成白。',
            type: 'narrator',
          },
        }],
        oneTime: true,
      },
      {
        id: 'examine_park_cup',
        name: '垃圾桶裡的紙杯',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_park_cup' }],
        effects: [{
          type: 'showDialog',
          dialog: {
            text: '剩一圈融冰；杯蓋裂了一道小縫。杯身被人寫過字，像只來得及寫出一個開頭就收筆——你看不出那是「烏」、還是「U」。',
            type: 'narrator',
          },
        }],
        oneTime: true,
      },
      {
        id: 'examine_park_sign',
        name: '遠處的影城招牌',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_park_sign' }],
        effects: [{
          type: 'showDialog',
          dialog: {
            text: '「城市影城」四個字還亮著，招牌邊緣有幾顆燈泡忽明忽暗。\n\n風一吹，晃動的樹影剛好遮住 H 那個字，像有人在這一夜刻意把字母藏起來。',
            type: 'narrator',
          },
        }],
        oneTime: true,
      },
      {
        id: 'examine_park_phone',
        name: '手機通知列',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_park_phone' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '手機震動在你手心敲了一下。\n\n「局內技術組已完成部分解密，請 KK 協助內容判讀。」\n\n公園沒什麼聲音，這行字顯得特別吵。\n\n風又吹了一次。你聽到車門關上的聲音，像有人把夜色扣上扣環。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'victim_phone_decrypt_ready', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'examine_park_vending',
        name: '自動販賣機',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_park_vending' }],
        effects: [{
          type: 'showDialog',
          dialog: {
            text: '螢幕輪播「加十元升級大杯」，每次切圖都會發出一聲很輕的嗶，像在提醒你：夜晚還有選項。',
            type: 'narrator',
          },
        }],
        oneTime: true,
      },
      {
        id: 'examine_park_cat',
        name: '流浪貓',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_park_cat' }],
        effects: [{
          type: 'showDialog',
          dialog: {
            text: '尾巴慢慢晃，眼睛在陰影裡反光。牠對垃圾桶那杯飲料聞一下就走，像在表示：人類的線索太甜。',
            type: 'narrator',
          },
        }],
        oneTime: true,
      },
      {
        id: 'examine_park_signboard',
        name: '公園告示牌',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_park_signboard' }],
        effects: [{
          type: 'showDialog',
          dialog: {
            text: '生鏽寫著「夜間請降低音量」。今晚大家很配合，除了手機通知。',
            type: 'narrator',
          },
        }],
        oneTime: true,
      },
    ],
    puzzles: [],
    initialDialog: {
      text: '警方把一個死人的生活拆成附件，發給你。\n\n標題冷冰冰——「城市影城H12_受害人手機_部分解密」。\n旁邊多了一句：「警方技術組阿蘇會到場協助判讀。」\n\n你一向先看現場，再看名字。這次順序顛倒。名字藏在訊息裡，像有人把他活過的每一天倒帶，倒到你面前，要求你把那卷帶子看完。\n\n真正黏人的問題，除了「他是誰」，還有：「他究竟戳到了哪一層，才會被這樣收場？」',
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
  */

};

// ch1 NPC 對話（第一章全部）
const npcDialogs: Record<string, Record<string, NpcDialogNode>> = {
  // 第一章 林瑞堂（副理）— 敏感問題一：燈與流程 / 敏感問題二：他怕誰（二選一，問完設 npc_lin_sensitive_done）
  npc_lin_ruitang: {
    // === 敏感問題一：燈與流程 ===
    'node_lin_light_1': {
      id: 'node_lin_light_1',
      npcId: 'npc_lin_ruitang',
      text: 'KK：「散場的燈，為什麼晚亮三分鐘？」\n\n林瑞堂：「那個…觀眾反映刺眼，我們做了微調。很常見。」\n\nKK：「誰提的？」\n\n林瑞堂（微笑卡住）：「流程…就是流程。通常不會追到個人。」\n\nKK（旁白）：他把「人」藏進「流程」。',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_lin_light_2',
    },
    'node_lin_light_2': {
      id: 'node_lin_light_2',
      npcId: 'npc_lin_ruitang',
      text: 'KK：「你說流程正常，但流程正常的人不會死得這麼安靜。」\n\n林瑞堂：「那種調整…上面有上面的考量啦。可能只是服務調整。」\n\nKK：「你急著把它叫成服務。」\n\n林瑞堂（真遺憾）：「我真的很遺憾…可我也不想看到這裡被毀掉。」\n\nKK：「被毀掉的不是影城，是那個人。」\n\n林瑞堂沉默。',
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
      text: 'KK：「你看起來不像怕兇手，你比較像怕我。」\n\n林瑞堂：「怎麼會？我當然怕兇手啊。」\n\nKK：「你怕的是死者，還是上面的長官？」\n\n林瑞堂：「我是說…我們也要顧及影城形象，現在媒體...你也知道的...」\n\nKK（旁白）：形象是一把傘，傘底下可以藏很多東西。',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_lin_fear_2',
    },
    'node_lin_fear_2': {
      id: 'node_lin_fear_2',
      npcId: 'npc_lin_ruitang',
      text: 'KK：「燈晚亮三分鐘，不是小事。誰有權改？」\n\n林瑞堂：「那是…流程上的調整。通常不會追到個人啦。」\n\nKK：「所以你選擇用流程，保護不知道的誰誰誰？」\n\n林瑞堂沉默。',
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
      text: 'KK：「散場後，你們巡場有空窗嗎？」\n\n阿順（先笑）：「有啊，散場後一分鐘到兩分鐘。要先引導人潮出去。」\n\nKK：「那段誰看？」\n\n阿順：「誰都看，又誰都沒看。走道像水流，沒人會停。」\n\nKK（旁白）：大概一兩分鐘，足夠一個熟練的人做很多事。',
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
      text: 'KK：「監視器死角在哪？」\n\n阿順：「靠邊的地方總有擋到的啦，柱子、轉角什麼的。你要我一個一個講我也講不完。」\n\nKK：「你確定？」\n\n阿順：「我每天走那條路。哪裡有問題…心裡有數啦。」\n\nKK（旁白）：死角不是空白，是被允許的盲。',
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
      text: 'KK：「燈延後三分鐘，是你改的？」\n\n小張：「不是我。我看到表格上就是延後三分鐘，我照做。」\n\nKK：「你確定表格原本就那樣？」\n\n小張：「我只知道我那天看到就是那樣。」\n\nKK（旁白）：表格像命令，命令不需要解釋。',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_xiaozhang_table_2',
    },
    'node_xiaozhang_table_2': {
      id: 'node_xiaozhang_table_2',
      npcId: 'npc_xiaozhang',
      text: 'KK：「那表格誰能改？」\n\n小張（吞口水）：「那種事要問上面啦…我們只負責照表按。」\n\nKK：「所以燈不是『自然延後』，是『被允許延後』。」\n\n小張沉默。\n\nKK（旁白）：允許，才是這城市最重的鎖。',
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
      text: 'KK：「有人跟你說過什麼嗎？」\n\n小張：「有…有人說觀眾反映刺眼，叫我照表走。」\n\nKK：「誰？」\n\n小張（避開眼神）：「我…想不起來。只記得那個人講話很像背 SOP。」\n\nKK（旁白）：聲音像流程。人像工具。',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_xiaozhang_oral_2',
    },
    'node_xiaozhang_oral_2': {
      id: 'node_xiaozhang_oral_2',
      npcId: 'npc_xiaozhang',
      text: 'KK：「你確定表格原本就那樣？」\n\n小張：「我只知道我那天看到就是那樣。誰改的，不會跟我講。」\n\nKK：「所以你不問。」\n\n小張：「問了又能怎樣？表就是表。」\n\nKK（旁白）：允許，才是這城市最重的鎖。',
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
      text: 'KK：「你說『太乾淨』，哪裡太乾淨？」\n\n周姊：「洗手台下面。正常那裡會卡灰卡毛，今天像被擦過一遍。」\n\nKK：「擦得很急？」\n\n周姊：「嗯。像怕你看見。我也不敢多想…就專心做我的事。」\n\nKK（旁白）：急著乾淨的人，多半有東西不能留。',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_zhou_clean_2',
    },
    'node_zhou_clean_2': {
      id: 'node_zhou_clean_2',
      npcId: 'npc_zhou_jie',
      text: 'KK：「燈晚亮，你怎麼知道？」\n\n周姊（敲手錶）：「那天就是等得特別久…久到有點毛。才亮。」\n\nKK（旁白）：體感的時間，比任何表格都殘酷。',
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
      text: '周姊點點頭：「你已經找到那片了吧。那就好。」\n\nKK：「嗯。」\n\n周姊沒有多說，只是又看了一眼洗手台的方向。',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_zhou_fragment_2',
    },
    'node_zhou_fragment_1': {
      id: 'node_zhou_fragment_1',
      npcId: 'npc_zhou_jie',
      text: '周姊（拿出夾子）：「一小片黑色塑膠。你拿走吧，我不想它被丟掉。」\n\nKK：「你怎麼沒直接丟？」\n\n周姊：「因為丟掉會讓我晚上睡不著。」',
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
      text: 'KK：「燈晚亮，你怎麼知道？」\n\n周姊（敲手錶）：「那天就是等得特別久…久到有點毛。才亮。」\n\nKK（旁白）：體感的時間，比任何表格都殘酷。',
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
