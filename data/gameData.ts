import { Chapter, Scene, Item, Hotspot, Event, Puzzle, Dialog, NpcDialogNode, Npc } from '@/types/game';

// 序章文案（KK流程偵探：最後一場放映）
export const prologueSlides: string[] = [
  '凌晨 00:19，你的手機震了一下。',
  '不是通知，是一通沒有顯示來電的電話，像城市不想留下指紋。',
  '「KK？」對方壓低聲音，「偵查隊。需要你來一趟。」',
  '你坐起來，窗外的霓虹還亮著，像一部不肯散場的電影。',
  '「哪裡？」',
  '「城市影城。電影院，散場後五分鐘左右，有一名看電影的人，死在H排12號。頸部壓迫，幾乎沒有掙扎。」',
  '你沒立刻回話，靜靜地聽著。',
  '對方接著說，像把真正的刀遞到你手上：',
  '「散場的燈，延後三分鐘亮起。似乎不是排程表上的。」',
  '你不是警察，也不是英雄。你只是KK。',
  '一個警方私下非常信任的外部偵探。',
  '你拉上外套，拿起筆記本，展開了一個新的任務。',
];

// 道具定義 - 第一章：城市影城
export const items: Record<string, Item> = {
  // 第一章：城市影城（命案現場）
  'item_ticket_stub': {
    id: 'item_ticket_stub',
    name: '電影票根',
    description: '一張被撕得很乾淨的票根，靜靜躺在地上。\n\n座位號碼：H排12號\n場次時間：22:40\n\n票根邊緣整齊，像是被人小心處理過。',
    svgImage: '/svg/items/ticket_stub.svg',
    svgSize: 'medium',
    collectible: true,
  },
  'item_schedule_modified': {
    id: 'item_schedule_modified',
    name: '播映時間表（塗改）',
    description: '一張被塗改過的播映時間表。\n\n原本的亮燈時間被劃掉，旁邊用紅筆寫著新的時間。\n延後了3分鐘。\n\n這個改動很細微，如果不是仔細看，根本不會注意到。',
    svgImage: '/svg/items/schedule_modified.svg',
    svgSize: 'medium',
    collectible: true,
  },
  'item_projector_notes': {
    id: 'item_projector_notes',
    name: '放映員的筆記',
    description: '一張便條紙貼在控制台上。\n\n字跡匆忙，但內容清楚：\n「那天有人說，燈不用急著開。」\n\n沒有署名，沒有時間。',
    svgImage: '/svg/items/projector_notes.svg',
    svgSize: 'medium',
    collectible: true,
  },
  'item_black_plastic_fragment': {
    id: 'item_black_plastic_fragment',
    name: '黑色塑膠碎片',
    description: '周姊在洗手台下方發現的黑色碎片。\n\n邊緣不規則，像是手套的一角。\n材質：橡膠或塑膠，疑似手套破損留下。\n\n這個位置很隱蔽，正常不會被打掃到。急著乾淨的人，多半有東西不能留。',
    svgImage: '/svg/items/black_plastic_fragment.svg',
    svgSize: 'small',
    collectible: true,
  },
  'item_light_control_note': {
    id: 'item_light_control_note',
    name: '燈控紀錄',
    description: '燈控面板旁的紀錄。\n\n當天為手動模式，需要有人親自操作。\n誰能接觸燈控，誰就能決定亮燈的時間。',
    svgImage: '/svg/items/schedule_modified.svg',
    svgSize: 'medium',
    collectible: true,
  },
  'item_cleaning_note': {
    id: 'item_cleaning_note',
    name: '清潔備忘',
    description: '廁所區域的清潔備忘。\n\n垃圾桶被清得很乾淨，像是有人刻意整理過。\n這種「乾淨」本身就很可疑。',
    svgImage: '/svg/items/black_plastic_fragment.svg',
    svgSize: 'small',
    collectible: true,
  },

  // 第二章：城市碎片（嫌犯 A）
  'item_recorder': {
    id: 'item_recorder',
    name: '錄音筆',
    description: '垃圾桶裡很乾淨，但底部有一支錄音筆。\n\n黑色的外殼，看起來很新。\n像是被人刻意丟棄，但又放在一個容易被發現的位置。\n\n內容（可播放）：\n「我不是恨她。\n我只是討厭，\n散場後那種被留下來的感覺。」',
    svgImage: '/svg/items/recorder.svg',
    svgSize: 'medium',
    collectible: true,
  },
  'item_visitor_log': {
    id: 'item_visitor_log',
    name: '訪客登記表',
    description: '訪客登記表上記錄著所有人的進出時間。\n\n案發當晚，嫌犯 A 的記錄清晰可見：\n進入時間：08:30\n離開時間：22:30\n\n這個時間戳無法偽造。',
    svgImage: '/svg/items/visitor_log.svg',
    svgSize: 'medium',
    collectible: true,
  },
  'item_audience_psychology_notebook': {
    id: 'item_audience_psychology_notebook',
    name: '觀眾心理筆記本',
    description: '書桌上放著一本筆記本。\n\n封面寫著：「觀眾心理分析」\n裡面記錄著他對電影、觀眾、散場的觀察。\n\n重點段落：\n「真正的高潮，\n不在片中，\n而在散場。\n\n當燈亮起，當人群開始移動，\n那一刻，所有人都最脆弱。」',
    svgImage: '/svg/items/audience_psychology_notebook.svg',
    svgSize: 'medium',
    collectible: true,
  },
  'item_gloves_clean': {
    id: 'item_gloves_clean',
    name: '手套（完整、未使用）',
    description: '抽屜裡放著一雙手套。\n\n黑色的，完整、未使用。\n沒有任何血跡，沒有任何使用痕跡。\n\n這雙手套很新，像是剛買的，但從未用過。',
    svgImage: '/svg/items/gloves_clean.svg',
    svgSize: 'medium',
    collectible: true,
  },
  
  // 第三章：預測（電影院 B 和 C）
  'item_screening_schedule_b': {
    id: 'item_screening_schedule_b',
    name: '電影院B放映表',
    description: '放映表上記錄著所有場次的時間。\n\n今晚的場次：\n22:00 場次，散場時間：23:00\n\n這個時間與第一案的時間節奏接近。\n太接近了，像是刻意安排。',
    svgImage: '/svg/items/screening_schedule_b.svg',
    svgSize: 'medium',
    collectible: true,
  },
  'item_light_control_request': {
    id: 'item_light_control_request',
    name: '售票口燈控申請單',
    description: '售票口貼著一張燈控申請單。\n\n申請日期：一週前\n申請理由：觀眾投訴「太刺眼」\n結果：臨時延後亮燈 3 分鐘\n\n這個理由很常見，這個申請很合理。\n但時間點，太巧合了。',
    svgImage: '/svg/items/light_control_request.svg',
    svgSize: 'medium',
    collectible: true,
  },
  'item_security_patrol_schedule': {
    id: 'item_security_patrol_schedule',
    name: '保全巡邏表',
    description: '保全巡邏表記錄著所有巡邏時間。\n\n散場後 5 分鐘內為空檔。\n這段時間，沒有人會巡邏。\n\n這是一個完美的時間窗口。',
    svgImage: '/svg/items/security_patrol_schedule.svg',
    svgSize: 'medium',
    collectible: true,
  },
  'item_auto_light_system_c': {
    id: 'item_auto_light_system_c',
    name: '電影院C全自動燈控系統',
    description: '全自動燈控系統的說明書貼在控制室牆上。\n\n系統特點：\n- 無人工介入\n- 準時亮燈\n- 無法延後\n\n這與第一案的手動控制不同。\n但「準時」本身，也是一種可預測性。',
    svgImage: '/svg/items/auto_light_system_c.svg',
    svgSize: 'medium',
    collectible: true,
  },
  'item_monitor_deadzone_map': {
    id: 'item_monitor_deadzone_map',
    name: '監視器配置圖',
    description: '監視器配置圖上標示了所有監視器位置。\n\n紅色區域：監視器死角\n集中在「空橋連接處」\n\n這個死角很大，足夠讓一個人完全消失。\n而且，這個位置是合法的通道。',
    svgImage: '/svg/items/monitor_deadzone_map.svg',
    svgSize: 'medium',
    collectible: true,
  },
  'item_crowd_flow_report': {
    id: 'item_crowd_flow_report',
    name: '散場人流分析報告',
    description: '散場人流分析報告顯示了詳細的數據。\n\n數據顯示：\n- 人潮分散（不像電影院B會聚集）\n- 難以聚集注意力\n- 單人觀眾比例高（60%）\n\n這種「分散」的環境，對兇手來說是優勢。',
    svgImage: '/svg/items/crowd_flow_report.svg',
    svgSize: 'medium',
    collectible: true,
  },
  'item_black_plastic_fragment_bridge': {
    id: 'item_black_plastic_fragment_bridge',
    name: '空橋黑色塑膠碎片',
    description: '垃圾桶裡有一小片黑色塑膠碎片。\n\n邊緣不規則，材質與第一章發現的碎片相似。\n像是手套的一部分。\n\n這個位置，正好在死角路徑上。',
    svgImage: '/svg/items/black_plastic_fragment_bridge.svg',
    svgSize: 'small',
    collectible: true,
  },
  
  // 第四章：逼近（嫌犯 C）
  'item_light_adjustment_request': {
    id: 'item_light_adjustment_request',
    name: '臨時調燈申請單',
    description: '一張臨時調燈申請單貼在售票口。\n\n申請日期：案發當天上午\n申請人簽名：黃志誠\n申請理由：觀眾反映亮燈太刺眼\n結果：批准，延後亮燈 3 分鐘\n\n這個申請很常見，這個理由很合理。\n但申請人，是黃志誠。',
    svgImage: '/svg/items/light_adjustment_request.svg',
    svgSize: 'medium',
    collectible: true,
  },
  'item_ticket_system_timestamp': {
    id: 'item_ticket_system_timestamp',
    name: '票務系統時間戳',
    description: '票務系統的時間戳記錄著所有交易時間。\n\n案發當晚的記錄：\n22:40 場次，H排12號\n購票時間：案發當天下午\n\n這個時間戳，與第一章死亡時間完全吻合。\n太吻合了，像是刻意安排。',
    svgImage: '/svg/items/ticket_system_timestamp.svg',
    svgSize: 'medium',
    collectible: true,
  },
  'item_cleaning_schedule': {
    id: 'item_cleaning_schedule',
    name: '清潔排程表',
    description: '清潔排程表記錄著所有清潔時間。\n\n案發當晚的排程：\n散場後 2 分鐘，美食街進行清潔\n\n這個時間，與空橋時間完美銜接。\n2分鐘，足夠完成犯案並到達空橋。\n\n太完美了，像是刻意安排。',
    svgImage: '/svg/items/cleaning_schedule.svg',
    svgSize: 'medium',
    collectible: true,
  },
  'item_security_camera_replay': {
    id: 'item_security_camera_replay',
    name: '監視器回放',
    description: '監視器回放顯示了案發當晚的情況。\n\n時間戳：23:12\n地點：清潔通道\n\n畫面中，黃志誠走進清潔通道。\n然後，消失了 47 秒。\n\n47秒後，他從另一個出口出現。\n手裡端著清潔工具，像是剛完成工作。',
    svgImage: '/svg/items/security_camera_replay.svg',
    svgSize: 'medium',
    collectible: true,
  },
  'item_black_glove_incomplete': {
    id: 'item_black_glove_incomplete',
    name: '黑色手套（不完整）',
    description: '垃圾回收站裡發現了一隻黑色手套。\n\n手套不完整，像是被撕過。\n材質：與第一章發現的塑膠碎片吻合。\n\n這個位置，正好在清潔通道附近。\n\n太巧合了，不可能是意外。',
    svgImage: '/svg/items/black_glove_incomplete.svg',
    svgSize: 'medium',
    collectible: true,
  },
  'item_access_card_record': {
    id: 'item_access_card_record',
    name: '門禁刷卡紀錄',
    description: '門禁刷卡紀錄顯示了所有進出記錄。\n\n但黃志誠的記錄，是空的。\n\n不是沒有記錄，而是「無紀錄通行」。\n他擁有最高權限，可以無紀錄通行。\n\n這意味著，沒有人知道他來過這裡。\n沒有人知道，他什麼時候來，什麼時候走。',
    svgImage: '/svg/items/access_card_record.svg',
    svgSize: 'medium',
    collectible: true,
  },
  
  // 第五章：最後一場放映
  'item_elevator_floor_display': {
    id: 'item_elevator_floor_display',
    name: '電梯樓層顯示',
    description: '電梯樓層顯示：停在非使用時段樓層。\n\n這個樓層，在散場時段不應該有人使用。\n但電梯停在這裡，像是有人在等待。\n\n等待什麼？等待散場？等待時機？',
    svgImage: '/svg/items/elevator_floor_display.svg',
    svgSize: 'medium',
    collectible: true,
  },
  'item_high_privilege_card_record': {
    id: 'item_high_privilege_card_record',
    name: '高權限刷卡紀錄',
    description: '電梯的刷卡紀錄顯示：\n\n時間：散場前 10 分鐘\n使用者：黃志誠\n權限：最高權限\n\n他提前來到這裡，提前準備。\n但這一切，都是合法的。',
    svgImage: '/svg/items/high_privilege_card_record.svg',
    svgSize: 'medium',
    collectible: true,
  },
  'item_elevator_door_delay': {
    id: 'item_elevator_door_delay',
    name: '開門延遲設定',
    description: '電梯的開門延遲設定，顯示：已啟用。\n\n這個設定，會讓電梯門延遲 3 秒開啟。\n3 秒，足夠讓一個人完全消失。\n\n這個設定，被人手動啟用。\n時間：散場前 5 分鐘。',
    svgImage: '/svg/items/elevator_door_delay.svg',
    svgSize: 'medium',
    collectible: true,
  },
};

// 場景資料
export const scenes: Record<string, Scene> = {
  // ========== 第一章：城市影城 ==========
  // 可探索空間一：城市影城（命案現場）
  'scene_ch1_cinema_a_hall': {
    id: 'scene_ch1_cinema_a_hall',
    chapterId: 'ch1',
    name: '城市影城 放映廳',
    description: '散場後的世界很吵。塑膠杯、手機光、鞋底黏住地毯的聲音。可這個人死得太安靜。像有人把「求救」剪掉了。',
    background: '/images/bg_ch1_cinema_a_hall_v1.webp',
    hotspots: [
      {
        id: 'hotspot_ticket_stub',
        shape: 'rect',
        coords: [1.19, 1.62, 0.15, 0.15],
        description: '地上的電影票根',
        hint: '一張被撕得很乾淨的票根，靜靜躺在地上。',
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
        coords: [0.44, 1.62, 0.2, 0.22],
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
              text: '獲得：電影票根\n\n一張被撕得很乾淨的票根，靜靜躺在地上。\n\n座位號碼：H排12號\n場次時間：22:40\n\n票根邊緣整齊，像是被人小心處理過。',
              type: 'item',
            },
          },
          { type: 'setFlag', flag: 'ticket_stub_collected', value: true },
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
        hint: '拼合線索：\n1. 亮燈延後（播映時間表 + 燈控面板）\n2. 監視器時間（90秒內離開）\n3. 死亡時間（散場後，約23:10-23:15）\n\n推理過程：\n- 兇手知道燈會延後3分鐘\n- 利用這3分鐘完成犯案\n- 在燈亮前離開現場',
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
      text: '散場後的世界很吵。塑膠杯、手機光、鞋底黏住地毯的聲音。可這個人死得太安靜。像有人把「求救」剪掉了。',
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
            text: '「我們都有SOP，清場、巡場、燈光…都照表走。」',
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
            text: '「散場時間表都在那邊，你要查什麼都可以。我們真的沒什麼好藏的。」',
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
            text: '「流程這種東西，寫在紙上是一回事，現場又是一回事。我們盡量對齊啦。」',
            type: 'casual',
            weight: 2,
          },
        ],
        available: true,
      },
      {
        id: 'npc_ashun',
        name: '阿順（巡場保全）',
        portrait: '/svg/characters/ashun.svg',
        randomDialogs: [
          {
            id: 'casual_1',
            text: '「這裡最安全啦，監視器多到像在拍真人秀。」',
            type: 'casual',
            weight: 3,
          },
          {
            id: 'casual_2',
            text: '「散場最亂的不是人，是垃圾。人走了，證據才開始出現。」',
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
            text: '「你要找兇手？先找柱子。柱子最會幫人消失。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_5',
            text: '「散場那幾分鐘人都在動，誰停下來誰就顯眼。反過來說，懂動線的人就知道什麼時候不顯眼。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_6',
            text: '「我每天走同一條路。哪裡有洞、哪裡沒拍到，我比監視器還熟。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_7',
            text: '「清場是 SOP，但 SOP 不會告訴你誰在 SOP 的縫裡多待了一分鐘。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_8',
            text: '「大家都說『有監視器』，好像有就沒事。其實有跟『看得到』是兩回事。」',
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
        coords: [0.16, 0.22, 0.22, 0.18],
        description: '播映時間表',
        hint: '一張被塗改過的播映時間表。原本的亮燈時間被劃掉，旁邊用紅筆寫著新的時間。',
      },
      {
        id: 'hotspot_light_control_panel',
        shape: 'rect',
        coords: [0.44, 0.38, 0.28, 0.24],
        description: '燈控面板',
        hint: '燈控面板上的開關位置顯示：手動模式。這不是自動系統，需要有人親自操作。',
      },
      {
        id: 'hotspot_projector_notes',
        shape: 'rect',
        coords: [0.06, 0.52, 0.18, 0.2],
        description: '放映員的筆記',
        hint: '一張便條紙貼在控制台上。字跡匆忙，但內容清楚。',
      },
      {
        id: 'hotspot_security_monitor',
        shape: 'rect',
        coords: [0.68, 0.68, 0.24, 0.22],
        description: '監視器畫面',
        hint: '監視器畫面正在播放案發當晚的錄影。在昏暗的光線中，一個身影快速移動。',
      },
      // 好笑無意義互動（播映室）
      { id: 'hotspot_fun_coffee', shape: 'rect', coords: [0.03, 0.18, 0.12, 0.14], description: '咖啡杯', hint: '小張的咖啡杯。' },
      { id: 'hotspot_fun_snack', shape: 'rect', coords: [0.86, 0.16, 0.1, 0.12], description: '零食袋', hint: '一包沒吃完的洋芋片。' },
      { id: 'hotspot_fun_chair_wheel', shape: 'rect', coords: [0.34, 0.76, 0.14, 0.16], description: '椅子輪子', hint: '控制椅的輪子。' },
      { id: 'hotspot_fun_sticker', shape: 'rect', coords: [0.74, 0.26, 0.12, 0.1], description: '按鈕上的貼紙', hint: '某個按鈕上貼著「勿按」。' },
      { id: 'hotspot_fun_remote', shape: 'rect', coords: [0.04, 0.78, 0.1, 0.15], description: '冷氣遙控器', hint: '冷氣遙控器。' },
      { id: 'hotspot_fun_magazine', shape: 'rect', coords: [0.5, 0.04, 0.16, 0.12], description: '舊雜誌', hint: '一本過期的電影雜誌。' },
      { id: 'hotspot_fun_whiteboard', shape: 'rect', coords: [0.18, 0.36, 0.14, 0.12], description: '白板', hint: '白板上畫著一個笑臉。' },
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
              text: '獲得：播映時間表（塗改）\n\n一張被塗改過的播映時間表。\n\n原本的亮燈時間被劃掉，旁邊用紅筆寫著新的時間。\n延後了3分鐘。\n\n這個改動很細微，如果不是仔細看，根本不會注意到。',
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
              text: '獲得：燈控紀錄\n\n燈控面板上的開關位置顯示：手動模式。\n\n這不是自動系統，需要有人親自操作。\n當天，有人選擇了手動控制。',
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
              text: '監視器畫面正在播放案發當晚的錄影。\n\n時間戳：23:12\n畫面：散場後的放映廳\n\n在昏暗的光線中，一個身影快速移動。\n90秒內，從座位區到出口，然後消失。',
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
      { id: 'fun_snack', name: '零食袋', description: '無意義互動', requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_snack' }], effects: [{ type: 'showDialog', dialog: { text: '一包沒吃完的洋芋片。誰說放映員不能嘴饞。', type: 'narrator' } }], oneTime: false },
      { id: 'fun_chair_wheel', name: '椅子輪子', description: '無意義互動', requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_chair_wheel' }], effects: [{ type: 'showDialog', dialog: { text: '控制椅的輪子。你滾了滾。很順。你立刻停下來，覺得自己很無聊。', type: 'narrator' } }], oneTime: false },
      { id: 'fun_sticker', name: '按鈕上的貼紙', description: '無意義互動', requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_sticker' }], effects: [{ type: 'showDialog', dialog: { text: '某個按鈕上貼著「勿按」。你沒有按。你是一個成熟的偵探。', type: 'narrator' } }], oneTime: false },
      { id: 'fun_remote', name: '冷氣遙控器', description: '無意義互動', requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_remote' }], effects: [{ type: 'showDialog', dialog: { text: '冷氣遙控器。上面貼著「遺失賠償五百」。你放下了。', type: 'narrator' } }], oneTime: false },
      { id: 'fun_magazine', name: '舊雜誌', description: '無意義互動', requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_magazine' }], effects: [{ type: 'showDialog', dialog: { text: '一本過期的電影雜誌。封面是半年前的強片。時光飛逝。', type: 'narrator' } }], oneTime: false },
      { id: 'fun_whiteboard', name: '白板', description: '無意義互動', requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_fun_whiteboard' }], effects: [{ type: 'showDialog', dialog: { text: '白板上畫著一個笑臉和「今天也要加油」。你沒有笑。但你有點想笑。', type: 'narrator' } }], oneTime: false },
      {
        id: 'get_wrench',
        name: '獲得扳手',
        description: '你從工具箱裡找到扳手。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'wrench_spot' },
        ],
        effects: [
          { type: 'addItem', itemId: 'rusty_wrench' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：生鏽的扳手\n\n扳手生鏽了，但還能用。你需要它來關閉瓦斯爐。',
              type: 'item',
              svgImage: '/svg/exploration/stove_detail.svg',
              svgPosition: 'right',
            },
          },
        ],
        oneTime: true,
      },
      {
        id: 'try_close_stove_with_wrench',
        name: '嘗試用扳手關閉瓦斯爐',
        description: '直接用扳手會失敗。',
        requirements: [
          { type: 'hasItem', itemId: 'rusty_wrench' },
          { type: 'hasInteracted', hotspotId: 'gas_stove' },
          {
            type: 'custom',
            customCheck: (state) => !state.inventory.includes('water_stop_tape'),
          },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '你越用力，越像想把某件事抹掉。\n\n扳手無法轉動，開關卡死了。你需要先補上破口。',
              type: 'narrator',
            },
          },
        ],
        oneTime: false,
      },
      {
        id: 'close_stove',
        name: '關閉瓦斯爐',
        description: '用扳手和止水膠帶關閉瓦斯爐。',
        requirements: [
          { type: 'hasItem', itemId: 'rusty_wrench' },
          { type: 'hasItem', itemId: 'water_stop_tape' },
          { type: 'hasInteracted', hotspotId: 'gas_stove' },
          { type: 'hasFlag', flag: 'stove_tape_applied', value: true },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '你先把止水膠帶貼在爐頭旁，補上破口。\n\n然後轉動扳手——逆時針。\n\n「卡——」一聲，瓦斯爐關閉了。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'stove_closed', value: true },
          {
            type: 'showDialog',
            dialog: {
              text: '瓦斯關閉後，廚房水聲會變得清楚。',
              type: 'narrator',
            },
          },
        ],
        oneTime: true,
      },
      {
        id: 'apply_tape_to_stove',
        name: '在瓦斯爐上貼止水膠帶',
        description: '在爐頭旁貼上止水膠帶。',
        requirements: [
          { type: 'hasItem', itemId: 'water_stop_tape' },
          { type: 'hasInteracted', hotspotId: 'gas_stove' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '你在爐頭旁貼上止水膠帶，代表補上破口。\n\n現在可以用扳手了。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'stove_tape_applied', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'check_fridge',
        name: '檢查冰箱',
        description: '你檢查冰箱，發現過期食物。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'fridge' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '冰箱裡有過期食物，散發著不好的氣味。\n\n你應該要處理這些。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'fridge_checked', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'get_milk',
        name: '獲得過期牛奶',
        description: '你從冰箱裡拿出過期牛奶盒。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'milk_spot' },
        ],
        effects: [
          { type: 'addItem', itemId: 'expired_milk' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：過期牛奶盒\n\n牛奶已經過期了。你翻轉盒子，背面有一張字條。',
              type: 'item',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '字條上寫著：「如果你看到這張字條，請幫我照顧這裡。」\n\n你開始覺得這裡需要你。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'milk_found', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'notice_leak',
        name: '注意到漏水',
        description: '你注意到水龍頭在漏水。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'leaky_faucet' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '水龍頭在漏水，滴答滴答的聲音在空蕩的廚房裡迴響。\n\n你應該要處理這個。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'leak_noticed', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'unlock_bedroom',
        name: '解鎖臥室',
        description: '嘗試處理問題後，臥室門打開了。',
        requirements: [
          { type: 'hasFlag', flag: 'stove_closed', value: true },
          { type: 'hasFlag', flag: 'fridge_checked', value: true },
          { type: 'hasFlag', flag: 'leak_noticed', value: true },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '你開始覺得這裡需要你。\n\n臥室的方向傳來微弱的聲響，你走過去。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'bedroom_unlocked', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'talk_to_character_2',
        name: '聽到聲音',
        description: '你聽到一個聲音，但看不到人。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'character_voice_2' },
          {
            type: 'custom',
            customCheck: (state) => !state.flags.character_2_complete,
          },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '「你來了。」',
              type: 'character',
              characterId: 'kitchen_voice',
              characterName: '聲音',
              characterPortrait: '/svg/characters/kitchen_voice.svg',
              characterPosition: 'right',
            },
          },
        ],
        oneTime: false,
      },
      {
        id: 'character_2_second_talk',
        name: '繼續與聲音對話',
        description: '繼續與聲音對話。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'character_voice_2' },
          { type: 'hasFlag', flag: 'character_2_first_talk', value: true },
          {
            type: 'custom',
            customCheck: (state) => !state.flags.character_2_complete,
          },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '「這裡需要你。瓦斯爐、冰箱、漏水...都需要處理。」',
              type: 'character',
              characterId: 'kitchen_voice',
              characterName: '聲音',
              characterPortrait: '/svg/characters/kitchen_voice.svg',
              characterPosition: 'right',
            },
          },
        ],
        oneTime: false,
      },
      {
        id: 'character_2_third_talk',
        name: '第三次對話',
        description: '繼續與聲音對話。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'character_voice_2' },
          { type: 'hasFlag', flag: 'character_2_second_talk', value: true },
          {
            type: 'custom',
            customCheck: (state) => !state.flags.character_2_complete,
          },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '「為什麼是我？」',
              type: 'character',
              characterId: 'kitchen_voice',
              characterName: '聲音',
              characterPortrait: '/svg/characters/kitchen_voice.svg',
              characterPosition: 'right',
            },
          },
        ],
        oneTime: false,
      },
      {
        id: 'character_2_fourth_talk',
        name: '第四次對話',
        description: '繼續與聲音對話。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'character_voice_2' },
          { type: 'hasFlag', flag: 'character_2_third_talk', value: true },
          {
            type: 'custom',
            customCheck: (state) => !state.flags.character_2_complete,
          },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '「因為你來了。因為你看到了。這就是責任感的開始。」',
              type: 'character',
              characterId: 'kitchen_voice',
              characterName: '聲音',
              characterPortrait: '/svg/characters/kitchen_voice.svg',
              characterPosition: 'right',
            },
          },
        ],
        oneTime: false,
      },
      {
        id: 'character_2_fifth_talk',
        name: '第五次對話（選擇題）',
        description: '最後一次與聲音對話，需要做出選擇。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'character_voice_2' },
          { type: 'hasFlag', flag: 'character_2_fourth_talk', value: true },
          {
            type: 'custom',
            customCheck: (state) => !state.flags.character_2_complete,
          },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '「你會處理這些問題嗎？」',
              type: 'character',
              characterId: 'kitchen_voice',
              characterName: '聲音',
              characterPortrait: '/svg/characters/kitchen_voice.svg',
              characterPosition: 'right',
              choices: [
                {
                  id: 'choice_handle_responsibility',
                  text: '我會處理',
                  weight: 10,
                  effects: [
                    {
                      type: 'showDialog',
                      dialog: {
                        text: '「很好。開始吧。」',
                        type: 'character',
                        characterId: 'kitchen_voice',
                        characterName: '聲音',
                        characterPortrait: '/svg/characters/kitchen_voice.svg',
                        characterPosition: 'right',
                      },
                    },
                  ],
                },
                {
                  id: 'choice_handle_partial',
                  text: '我會試試看',
                  weight: 5,
                  effects: [
                    {
                      type: 'showDialog',
                      dialog: {
                        text: '「試試看就夠了。」',
                        type: 'character',
                        characterId: 'kitchen_voice',
                        characterName: '聲音',
                        characterPortrait: '/svg/characters/kitchen_voice.svg',
                        characterPosition: 'right',
                      },
                    },
                  ],
                },
                {
                  id: 'choice_refuse',
                  text: '這不是我的責任',
                  weight: -10,
                  effects: [
                    {
                      type: 'showDialog',
                      dialog: {
                        text: '「但你在這裡。你看到了這些問題。」',
                        type: 'character',
                        characterId: 'kitchen_voice',
                        characterName: '聲音',
                        characterPortrait: '/svg/characters/kitchen_voice.svg',
                        characterPosition: 'right',
                      },
                    },
                  ],
                },
              ],
            },
          },
          { type: 'setFlag', flag: 'character_2_complete', value: true },
        ],
        oneTime: false,
      },
    ],
    puzzles: [],
    initialDialog: {
      text: '播映室裡，控制台和設備都在正常運作。\n\n但在這片正常中，有什麼被改動過。',
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
            text: '「你們覺得燈光是氣氛，我覺得燈光是時間戳。」',
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
            text: '「改表這種事，不會經過我。我只看得到改完的結果。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_5',
            text: '「燈晚亮那晚，我也有感覺。但感覺不能寫進報告，對吧。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_6',
            text: '「有人會跟你說『照表走』。表是誰做的，他們不會說。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_7',
            text: '「放映員的位子看得到銀幕，看不到觀眾。誰在黑暗裡做什麼，那是別人的事。」',
            type: 'casual',
            weight: 2,
          },
        ],
        available: true,
      },
    ],
  },
  
  // 可探索空間三：廁所
  'scene_ch1_restroom': {
    id: 'scene_ch1_restroom',
    chapterId: 'ch1',
    name: '廁所',
    description: '廁所裡很乾淨，幾乎是空的。但在這片乾淨中，你感覺到一種刻意。',
    background: '/images/bg_ch1_restroom_v1.webp',
    hotspots: [
      {
        id: 'hotspot_sink_below',
        shape: 'rect',
        coords: [0.36, 0.5, 0.2, 0.18],
        description: '洗手台下方',
        hint: '在洗手台下方，你發現了一小片黑色塑膠。',
      },
      {
        id: 'hotspot_trash_bin',
        shape: 'rect',
        coords: [0.18, 0.62, 0.16, 0.18],
        description: '垃圾桶',
        hint: '垃圾桶裡很乾淨，幾乎是空的。',
      },
      {
        id: 'hotspot_mirror',
        shape: 'rect',
        coords: [0.7, 0.28, 0.2, 0.24],
        description: '鏡子',
        hint: '你在鏡子裡看見自己，和一個沒有留下痕跡的人。',
      },
      // 好笑無意義互動（廁所）
      { id: 'hotspot_fun_dryer', shape: 'rect', coords: [0.05, 0.26, 0.12, 0.14], description: '烘手機', hint: '烘手機。' },
      { id: 'hotspot_fun_soap', shape: 'rect', coords: [0.34, 0.36, 0.1, 0.1], description: '洗手乳', hint: '洗手乳是檸檬味。' },
      { id: 'hotspot_fun_towel', shape: 'rect', coords: [0.76, 0.56, 0.12, 0.14], description: '擦手紙', hint: '擦手紙盒上寫著「一次取用一張」。' },
      { id: 'hotspot_fun_sign', shape: 'rect', coords: [0.1, 0.58, 0.14, 0.14], description: '標語', hint: '牆上貼著「如廁後請沖水」。' },
      { id: 'hotspot_fun_air_freshener', shape: 'rect', coords: [0.8, 0.14, 0.1, 0.12], description: '芳香劑', hint: '自動芳香劑。' },
      { id: 'hotspot_fun_faucet', shape: 'rect', coords: [0.46, 0.76, 0.14, 0.14], description: '水龍頭', hint: '水龍頭。' },
      { id: 'hotspot_fun_floor', shape: 'rect', coords: [0.54, 0.86, 0.16, 0.12], description: '地板反光', hint: '地板擦得很亮。' },
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
              text: '獲得：黑色塑膠碎片\n\n在洗手台下方，你發現了一小片黑色塑膠。\n\n邊緣不規則，像是被撕下來的。\n材質：橡膠或塑膠，可能是手套的一部分。\n\n這個位置很隱蔽，如果不是刻意尋找，根本不會發現。',
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
              text: '獲得：清潔備忘\n\n垃圾桶裡很乾淨，幾乎是空的。\n\n沒有血跡，沒有可疑物品。\n垃圾被清得很乾淨，像是有人刻意整理過。\n\n但這種「乾淨」本身就很可疑。',
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
              text: '你在鏡子裡看見自己，和一個沒有留下痕跡的人。\n\n鏡面很乾淨，反射著洗手間的燈光。\n但在這片乾淨中，你感覺到一種刻意。\n\n彷彿有人知道，這裡不該留下任何東西。',
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
    puzzles: [
      {
        id: 'test_restroom_input',
        type: 'input',
        solution: 'TEST',
        hint: '測試用。答案：TEST',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_test_input' }],
        onSolve: [{ type: 'setFlag', flag: 'puzzle_test_restroom_input_solved', value: true }],
      },
      {
        id: 'test_restroom_sequence',
        type: 'sequence',
        solution: ['A', 'B', 'C'],
        hint: '測試用。答案順序：A,B,C',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_test_sequence' }],
        onSolve: [{ type: 'setFlag', flag: 'puzzle_test_restroom_sequence_solved', value: true }],
      },
      {
        id: 'test_restroom_arrangement',
        type: 'arrangement',
        solution: ['item1', 'item2', 'item3'],
        hint: '測試用。答案順序：item1,item2,item3',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_test_arrangement' }],
        onSolve: [{ type: 'setFlag', flag: 'puzzle_test_restroom_arrangement_solved', value: true }],
      },
      {
        id: 'test_restroom_combination',
        type: 'combination',
        solution: ['id_a', 'id_b'],
        hint: '測試用。答案：id_a,id_b',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_test_combination' }],
        onSolve: [{ type: 'setFlag', flag: 'puzzle_test_restroom_combination_solved', value: true }],
      },
      {
        id: 'test_restroom_visual_selection',
        type: 'visual_selection',
        solution: ['correct_id'],
        hint: '測試用。答案：選「正確」',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_test_visual_selection' }],
        options: [
          { id: 'correct_id', label: '正確' },
          { id: 'wrong_id', label: '錯誤' },
        ],
        onSolve: [{ type: 'setFlag', flag: 'puzzle_test_restroom_visual_selection_solved', value: true }],
      },
      {
        id: 'test_restroom_combination_lock',
        type: 'combination_lock',
        solution: '12345',
        hint: '測試用。答案：12345',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_test_combination_lock' }],
        onSolve: [{ type: 'setFlag', flag: 'puzzle_test_restroom_combination_lock_solved', value: true }],
      },
      {
        id: 'test_restroom_word_scramble',
        type: 'word_scramble',
        solution: 'PUZZLE',
        hint: '測試用。答案：PUZZLE',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_test_word_scramble' }],
        config: { scrambledWord: 'ZUPZLE', originalWord: 'PUZZLE' },
        onSolve: [{ type: 'setFlag', flag: 'puzzle_test_restroom_word_scramble_solved', value: true }],
      },
      {
        id: 'test_restroom_wire_connection',
        type: 'wire_connection',
        solution: 'connected',
        hint: '測試用。接對四條線即過',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_test_wire_connection' }],
        config: {
          wires: [
            { id: 'w1', color: 'red', start: 0, end: 2 },
            { id: 'w2', color: 'blue', start: 1, end: 3 },
            { id: 'w3', color: 'green', start: 2, end: 0 },
            { id: 'w4', color: 'yellow', start: 3, end: 1 },
          ],
        },
        onSolve: [{ type: 'setFlag', flag: 'puzzle_test_restroom_wire_connection_solved', value: true }],
      },
      {
        id: 'test_restroom_jigsaw',
        type: 'jigsaw',
        solution: 'solved',
        hint: '測試用。完成拼圖即過',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_test_jigsaw' }],
        config: { gridSize: [3, 3] },
        onSolve: [{ type: 'setFlag', flag: 'puzzle_test_restroom_jigsaw_solved', value: true }],
      },
      {
        id: 'test_restroom_rotating_dial',
        type: 'rotating_dial',
        solution: [0, 2, 1, 3],
        hint: '測試用。答案：[0,2,1,3] 四盤依序',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_test_rotating_dial' }],
        config: {
          dials: [
            { id: 'd1', segments: 4, target: 0 },
            { id: 'd2', segments: 4, target: 2 },
            { id: 'd3', segments: 4, target: 1 },
            { id: 'd4', segments: 4, target: 3 },
          ],
        },
        onSolve: [{ type: 'setFlag', flag: 'puzzle_test_restroom_rotating_dial_solved', value: true }],
      },
      {
        id: 'test_restroom_sequence_memory',
        type: 'sequence_memory',
        solution: ['A', 'B', 'C', 'D'],
        hint: '測試用。答案：A,B,C,D',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_test_sequence_memory' }],
        config: { sequenceLength: 4, symbols: ['A', 'B', 'C', 'D', 'E', 'F'] },
        onSolve: [{ type: 'setFlag', flag: 'puzzle_test_restroom_sequence_memory_solved', value: true }],
      },
      {
        id: 'test_restroom_sliding_puzzle',
        type: 'sliding_puzzle',
        solution: 'solved',
        hint: '測試用。排好即過',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_test_sliding_puzzle' }],
        config: { gridSize: [3, 3] },
        onSolve: [{ type: 'setFlag', flag: 'puzzle_test_restroom_sliding_puzzle_solved', value: true }],
      },
      {
        id: 'test_restroom_symbol_matching',
        type: 'symbol_matching',
        solution: 'matched',
        hint: '測試用。配對完即過',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_test_symbol_matching' }],
        config: {
          pairs: [
            { id: 'p1', symbol: '★' },
            { id: 'p2', symbol: '●' },
            { id: 'p3', symbol: '▲' },
            { id: 'p4', symbol: '■' },
          ],
        },
        onSolve: [{ type: 'setFlag', flag: 'puzzle_test_restroom_symbol_matching_solved', value: true }],
      },
      {
        id: 'test_restroom_maze_path',
        type: 'maze_path',
        solution: 'path',
        hint: '測試用。從起點走到終點即過',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_test_maze_path' }],
        config: {
          maze: [
            [0, 0, 0, 0, 0, 0],
            [0, 1, 1, 1, 1, 0],
            [0, 1, 0, 0, 1, 0],
            [0, 1, 1, 1, 1, 0],
            [0, 0, 0, 0, 0, 0],
          ],
          start: [1, 1],
          end: [3, 4],
        },
        onSolve: [{ type: 'setFlag', flag: 'puzzle_test_restroom_maze_path_solved', value: true }],
      },
      {
        id: 'test_restroom_logic_switches',
        type: 'logic_switches',
        solution: { s1: true, s2: false, s3: true },
        hint: '測試用。答案：s1開 s2關 s3開',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_test_logic_switches' }],
        config: {
          switches: [
            { id: 's1', initialState: false },
            { id: 's2', initialState: false },
            { id: 's3', initialState: false },
          ],
          logicRules: 's1 AND NOT s2 AND s3',
        },
        onSolve: [{ type: 'setFlag', flag: 'puzzle_test_restroom_logic_switches_solved', value: true }],
      },
    ],
    initialDialog: {
      text: '廁所裡很乾淨，幾乎是空的。\n\n但在這片乾淨中，你感覺到一種刻意。',
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
            text: '「我做清潔二十年，最怕的不是髒，是突然太乾淨。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_3',
            text: '「有人怕留指紋，就會把世界擦亮。可惜碎片也會掉。」',
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
            text: '「洗手台下面我每天擦。那天特別乾淨。太乾淨了。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_6',
            text: '「燈晚亮我怎麼知道？我手錶快兩分鐘，我還是多等了一陣子。等到心裡發冷。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_7',
            text: '「清潔是流程的最後一段。有人懂流程，就會把不該留的東西留給我們。」',
            type: 'casual',
            weight: 2,
          },
          {
            id: 'casual_8',
            text: '「我不會跟別人講我撿到什麼。但你可以問。你問，我就說。」',
            type: 'casual',
            weight: 2,
          },
        ],
        available: true,
      },
    ],
  },
  
  // ========== 第二章：城市碎片（嫌犯 A） ==========
  // 可探索空間一：公園（公開空間）
  'scene_ch2_park': {
    id: 'scene_ch2_park',
    chapterId: 'ch2',
    name: '公園',
    description: '夜晚的公園很安靜，安靜到你會以為，任何坐在這裡的人，都在等一個沒有來的人。',
    background: '/images/bg_ch2_park_v1.webp',
    hotspots: [
      {
        id: 'hotspot_park_bench',
        shape: 'rect',
        coords: [0.3, 0.4, 0.6, 0.6],
        description: '長椅',
        hint: '長椅的一側被坐得特別塌，像是有人固定坐在同一個位置。',
      },
      {
        id: 'hotspot_park_trash',
        shape: 'rect',
        coords: [0.5, 0.6, 0.7, 0.8],
        description: '垃圾桶',
        hint: '垃圾桶裡很乾淨，但底部有一支錄音筆。',
      },
      {
        id: 'hotspot_park_cigarette_butts',
        shape: 'rect',
        coords: [0.1, 0.5, 0.3, 0.7],
        description: '地上的煙蒂',
        hint: '地上散落著幾根煙蒂，但排列很奇怪。',
      },
      {
        id: 'hotspot_park_streetlight',
        shape: 'rect',
        coords: [0.7, 0.1, 0.9, 0.3],
        description: '路燈',
        hint: '路燈亮得很準時，沒有人能延後它。',
      },
    ],
    items: [
      items.item_recorder,
    ],
    hotspotEventMap: {
      'hotspot_park_bench': 'examine_park_bench',
      'hotspot_park_trash': 'examine_park_trash',
      'hotspot_park_cigarette_butts': 'examine_cigarette_butts',
      'hotspot_park_streetlight': 'examine_streetlight',
    },
    events: [
      {
        id: 'examine_park_bench',
        name: '檢查長椅',
        description: '你檢查長椅。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'hotspot_park_bench' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '長椅的一側被坐得特別塌，像是有人固定坐在同一個位置。\n\n木質表面已經被磨得光滑，留下了時間的痕跡。\n這個位置正對著公園入口，可以看到所有進出的人。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'clue_suspect_a_habit_spot', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'examine_park_trash',
        name: '檢查垃圾桶',
        description: '你檢查垃圾桶，發現錄音筆。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'hotspot_park_trash' },
          { type: 'hasFlag', flag: 'clue_suspect_a_habit_spot', value: true },
        ],
        effects: [
          { type: 'addItem', itemId: 'item_recorder' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：錄音筆\n\n垃圾桶裡很乾淨，但底部有一支錄音筆。\n\n黑色的外殼，看起來很新。\n像是被人刻意丟棄，但又放在一個容易被發現的位置。',
              type: 'item',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '內容（可播放）：\n「我不是恨她。\n我只是討厭，\n散場後那種被留下來的感覺。\n\n電影結束了，所有人都走了。\n只有你，還坐在那裡。\n等著一個不會來的人。」',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'recorder_found', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'examine_cigarette_butts',
        name: '檢查地上的煙蒂',
        description: '你檢查地上的煙蒂。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'hotspot_park_cigarette_butts' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '地上散落著幾根煙蒂，但排列很奇怪。\n\n它們不是隨意丟棄的，而是被刻意擺放。\n像是有人想要留下痕跡，但又不想留下自己的痕跡。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'clue_cigarette_butts_abnormal', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'examine_streetlight',
        name: '檢查路燈',
        description: '你檢查路燈。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'hotspot_park_streetlight' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '路燈亮得很準時，\n沒有人能延後它。\n\n在這種公共空間，時間是固定的。\n不像電影院，可以被人為控制。\n\n這裡的一切都很準時，很確定。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'clue_public_space_time_fixed', value: true },
        ],
        oneTime: true,
      },
    ],
    puzzles: [
      {
        id: 'puzzle_ch2_park_recorder_owner',
        type: 'input',
        solution: '是',
        hint: '比對錄音內容和語氣：\n1. 內容提到「散場後被留下來的感覺」\n2. 與嫌犯A的背景（前電影院放映助理）吻合\n3. 語氣冷靜、理性\n\n結論：是他的聲音，但內容更像自我分析，不是威脅',
        requirements: [
          { type: 'hasItem', itemId: 'item_recorder' },
          { type: 'hasFlag', flag: 'clue_suspect_a_habit_spot', value: true },
          { type: 'hasFlag', flag: 'clue_public_space_time_fixed', value: true },
        ],
        onSolve: [
          {
            type: 'showDialog',
            dialog: {
              text: '你理解了：錄音筆是嫌犯A的。\n\n這顯示他理解「脆弱」，但沒有跨過那條線。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'puzzle_ch2_park_solved', value: true },
          { type: 'setFlag', flag: 'office_building_unlocked', value: true },
        ],
      },
    ],
    initialDialog: {
      text: '夜晚的公園很安靜，\n安靜到你會以為，\n任何坐在這裡的人，都在等一個沒有來的人。',
      type: 'narrator',
    },
  },
  
  // 可探索空間二：辦公大樓（嫌犯 A 現職）
  'scene_ch2_office_building': {
    id: 'scene_ch2_office_building',
    chapterId: 'ch2',
    name: '辦公大樓',
    description: '這棟大樓沒有情緒，它只記錄進出。每一扇門、每一部電梯、每一個打卡機，都在記錄著時間和位置。',
    background: '/images/bg_ch2_office_building_v1.webp',
    hotspots: [
      {
        id: 'hotspot_visitor_log',
        shape: 'rect',
        coords: [0.2, 0.3, 0.5, 0.5],
        description: '訪客登記表',
        hint: '訪客登記表上記錄著所有人的進出時間。',
      },
      {
        id: 'hotspot_elevator_monitor',
        shape: 'rect',
        coords: [0.5, 0.3, 0.8, 0.6],
        description: '電梯監視器',
        hint: '電梯監視器畫面顯示了案發當晚的情況。',
      },
      {
        id: 'hotspot_breakroom_note',
        shape: 'rect',
        coords: [0.1, 0.6, 0.4, 0.8],
        description: '茶水間便條',
        hint: '茶水間的佈告欄上貼著一張便條。',
      },
      {
        id: 'hotspot_colleague_conversation',
        shape: 'rect',
        coords: [0.5, 0.6, 0.8, 0.8],
        description: '員工對話',
        hint: '你無意中聽到兩個同事的對話。',
      },
      {
        id: 'hotspot_bulletin_board',
        shape: 'rect',
        coords: [0.7, 0.1, 0.9, 0.3],
        description: '公告欄',
        hint: '公告欄上貼著各種通知和活動海報。',
      },
    ],
    items: [
      items.item_visitor_log,
    ],
    hotspotEventMap: {
      'hotspot_visitor_log': 'examine_visitor_log',
      'hotspot_elevator_monitor': 'view_elevator_monitor',
      'hotspot_breakroom_note': 'examine_breakroom_note',
      'hotspot_colleague_conversation': 'hear_colleague_conversation',
      'hotspot_bulletin_board': 'examine_bulletin_board',
    },
    events: [
      {
        id: 'examine_visitor_log',
        name: '檢查訪客登記表',
        description: '你檢查訪客登記表。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'hotspot_visitor_log' },
        ],
        effects: [
          { type: 'addItem', itemId: 'item_visitor_log' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：訪客登記表\n\n訪客登記表上記錄著所有人的進出時間。\n\n案發當晚，嫌犯 A 的記錄清晰可見：\n進入時間：08:30\n離開時間：22:30\n\n這個時間戳無法偽造。',
              type: 'item',
            },
          },
          { type: 'setFlag', flag: 'visitor_log_found', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'view_elevator_monitor',
        name: '觀看電梯監視器',
        description: '你觀看電梯監視器畫面。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'hotspot_elevator_monitor' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '電梯監視器畫面顯示了案發當晚的情況。\n\n時間戳：22:30\n畫面：嫌犯 A 獨自走進電梯\n\n他的動作很從容，沒有急促，沒有緊張。\n就像平常下班一樣。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'clue_suspect_a_calm_behavior', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'examine_breakroom_note',
        name: '檢查茶水間便條',
        description: '你檢查茶水間便條。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'hotspot_breakroom_note' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '茶水間的佈告欄上貼著一張便條。\n\n字跡工整，內容簡單：\n「他總是最後一個走。」\n\n沒有署名，但大家都知道指的是誰。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'clue_suspect_a_work_habit', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'hear_colleague_conversation',
        name: '旁聽員工對話',
        description: '你無意中聽到兩個同事的對話。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'hotspot_colleague_conversation' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '你無意中聽到兩個同事的對話。\n\n「他很安靜，\n但不像會失控的人。」\n\n「我跟他共事半年，從來沒看他發過脾氣。」\n「他只是...很安靜。」',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'clue_colleague_impression', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'examine_bulletin_board',
        name: '檢查公告欄',
        description: '你檢查公告欄。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'hotspot_bulletin_board' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '公告欄上貼著各種通知和活動海報。\n\n其中一張電影海報特別顯眼：\n正是城市影城 播映的那部電影。\n\n海報已經有些破舊，像是貼了很久。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'clue_movie_poster_coincidence', value: true },
        ],
        oneTime: true,
      },
    ],
    puzzles: [],
    initialDialog: {
      text: '這棟大樓沒有情緒，\n它只記錄進出。\n\n每一扇門、每一部電梯、每一個打卡機，\n都在記錄著時間和位置。\n在這裡，沒有人可以隱藏。',
      type: 'narrator',
    },
  },
  
  // 可探索空間三：嫌犯 A 住所
  'scene_ch2_suspect_a_residence': {
    id: 'scene_ch2_suspect_a_residence',
    chapterId: 'ch2',
    name: '嫌犯 A 住所',
    description: '他的房間很乾淨，乾淨得像是隨時準備被檢查。每一樣東西都放在固定的位置，每一本書都按照某種邏輯排列。',
    background: '/images/bg_ch2_suspect_a_residence_v1.webp',
    hotspots: [
      {
        id: 'hotspot_desk',
        shape: 'rect',
        coords: [0.3, 0.3, 0.6, 0.6],
        description: '書桌',
        hint: '書桌上放著一本筆記本。封面寫著：「觀眾心理分析」。',
      },
      {
        id: 'hotspot_wall_clock',
        shape: 'rect',
        coords: [0.7, 0.1, 0.9, 0.3],
        description: '牆上的時鐘',
        hint: '牆上的時鐘停在 23:10。不是電池沒電，而是被人刻意停止。',
      },
      {
        id: 'hotspot_drawer',
        shape: 'rect',
        coords: [0.1, 0.4, 0.3, 0.7],
        description: '抽屜',
        hint: '抽屜裡放著一雙手套。黑色的，完整、未使用。',
      },
      {
        id: 'hotspot_trash_bag',
        shape: 'rect',
        coords: [0.6, 0.7, 0.9, 0.9],
        description: '垃圾袋',
        hint: '垃圾袋裡很乾淨，分類整齊。',
      },
      {
        id: 'hotspot_bookshelf',
        shape: 'rect',
        coords: [0.1, 0.1, 0.3, 0.4],
        description: '書架',
        hint: '書架上的書都按照某種邏輯排列。',
      },
    ],
    items: [
      items.item_audience_psychology_notebook,
      items.item_gloves_clean,
    ],
    hotspotEventMap: {
      'hotspot_desk': 'examine_desk',
      'hotspot_wall_clock': 'examine_wall_clock',
      'hotspot_drawer': 'examine_drawer',
      'hotspot_trash_bag': 'examine_trash_bag',
      'hotspot_bookshelf': 'examine_bookshelf',
    },
    events: [
      {
        id: 'examine_desk',
        name: '檢查書桌',
        description: '你檢查書桌，發現筆記本。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'hotspot_desk' },
        ],
        effects: [
          { type: 'addItem', itemId: 'item_audience_psychology_notebook' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：觀眾心理筆記本\n\n書桌上放著一本筆記本。\n\n封面寫著：「觀眾心理分析」\n裡面記錄著他對電影、觀眾、散場的觀察。\n\n字跡工整，邏輯清晰，像是一份研究報告。',
              type: 'item',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '重點段落：\n「真正的高潮，\n不在片中，\n而在散場。\n\n當燈亮起，當人群開始移動，\n那一刻，所有人都最脆弱。\n因為他們剛剛經歷了什麼，\n卻還沒有回到現實。」',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'notebook_found', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'examine_wall_clock',
        name: '檢查牆上的時鐘',
        description: '你檢查牆上的時鐘。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'hotspot_wall_clock' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '牆上的時鐘停在 23:10。\n\n不是電池沒電，而是被人刻意停止。\n這個時間，正好是城市影城 案發的時間。\n\n他對「時間」有意識。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'clue_time_awareness', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'examine_drawer',
        name: '檢查抽屜',
        description: '你檢查抽屜，發現手套。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'hotspot_drawer' },
        ],
        effects: [
          { type: 'addItem', itemId: 'item_gloves_clean' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：手套（完整、未使用）\n\n抽屜裡放著一雙手套。\n\n黑色的，完整、未使用。\n沒有任何血跡，沒有任何使用痕跡。\n\n這雙手套很新，像是剛買的，但從未用過。',
              type: 'item',
            },
          },
          { type: 'setFlag', flag: 'gloves_found', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'examine_trash_bag',
        name: '檢查垃圾袋',
        description: '你檢查垃圾袋。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'hotspot_trash_bag' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '垃圾袋裡很乾淨，分類整齊。\n\n沒有可疑物，沒有血跡，沒有任何異常。\n一切都按照回收分類標準整理。\n\n這種「乾淨」本身就很可疑，但也可能只是他的習慣。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'clue_clean_trash', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'examine_bookshelf',
        name: '檢查書架',
        description: '你檢查書架。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'hotspot_bookshelf' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '書架上的書都按照某種邏輯排列。\n\n每一本書都放在固定的位置，\n每一本書都按照某種邏輯排列。\n這裡沒有情緒，只有秩序。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'bookshelf_examined', value: true },
        ],
        oneTime: true,
      },
    ],
    puzzles: [
      {
        id: 'puzzle_ch2_suspect_a_alibi',
        type: 'input',
        solution: '不可能',
        hint: '時間計算：\n1. 22:30 離開辦公大樓\n2. 最快到達城市影城：23:10（需要40分鐘）\n3. 但案發時間是 23:10-23:15\n\n結論：時間上幾乎不可能',
        requirements: [
          { type: 'hasItem', itemId: 'item_visitor_log' },
          { type: 'hasFlag', flag: 'clue_time_awareness', value: true },
          { type: 'hasFlag', flag: 'gloves_found', value: true },
        ],
        onSolve: [
          {
            type: 'showDialog',
            dialog: {
              text: '你理解了：嫌犯 A 在時間上幾乎不可能完成犯案。\n\n他理解「脆弱」，但沒有跨過那條線。\n這是一個「紅鯡魚」（Red Herring）。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'puzzle_ch2_alibi_solved', value: true },
          { type: 'setFlag', flag: 'chapter3_unlocked', value: true },
        ],
      },
    ],
    initialDialog: {
      text: '他的房間很乾淨，\n乾淨得像是隨時準備被檢查。\n\n每一樣東西都放在固定的位置，\n每一本書都按照某種邏輯排列。\n這裡沒有情緒，只有秩序。',
      type: 'narrator',
    },
  },
  
  // ========== 第三章：預測（電影院 B 和 C） ==========
  // 可探索空間一：電影院 B（推測地點）
  'scene_ch3_cinema_b': {
    id: 'scene_ch3_cinema_b',
    chapterId: 'ch3',
    name: '電影院 B',
    description: '電影院B的放映廳。這裡的散場時間與第一案的時間節奏接近。太接近了，像是刻意安排。',
    background: '/images/bg_ch3_cinema_b_v1.webp',
    hotspots: [
      {
        id: 'hotspot_screening_schedule_b',
        shape: 'rect',
        coords: [0.2, 0.2, 0.5, 0.4],
        description: '放映表',
        hint: '放映表上記錄著所有場次的時間。今晚的場次：22:00 場次，散場時間：23:00',
      },
      {
        id: 'hotspot_cinema_b_layout',
        shape: 'rect',
        coords: [0.5, 0.3, 0.8, 0.6],
        description: '放映廳動線圖',
        hint: '放映廳的動線圖顯示了所有出口位置。',
      },
      {
        id: 'hotspot_light_control_request_b',
        shape: 'rect',
        coords: [0.1, 0.5, 0.4, 0.7],
        description: '售票口燈控申請單',
        hint: '售票口貼著一張燈控申請單。',
      },
      {
        id: 'hotspot_security_patrol_b',
        shape: 'rect',
        coords: [0.5, 0.6, 0.8, 0.8],
        description: '保全巡邏表',
        hint: '保全巡邏表記錄著所有巡邏時間。',
      },
      {
        id: 'hotspot_cleaning_memo_b',
        shape: 'rect',
        coords: [0.1, 0.7, 0.4, 0.9],
        description: '清潔人員備忘錄',
        hint: '清潔人員的備忘錄上寫著關於散場的內容。',
      },
    ],
    items: [
      items.item_screening_schedule_b,
      items.item_light_control_request,
      items.item_security_patrol_schedule,
    ],
    hotspotEventMap: {
      'hotspot_screening_schedule_b': 'examine_screening_schedule_b',
      'hotspot_cinema_b_layout': 'examine_cinema_b_layout',
      'hotspot_light_control_request_b': 'examine_light_control_request_b',
      'hotspot_security_patrol_b': 'examine_security_patrol_b',
      'hotspot_cleaning_memo_b': 'examine_cleaning_memo_b',
    },
    events: [
      {
        id: 'examine_screening_schedule_b',
        name: '檢查放映表',
        description: '你檢查放映表。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'hotspot_screening_schedule_b' },
        ],
        effects: [
          { type: 'addItem', itemId: 'item_screening_schedule_b' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：電影院B放映表\n\n放映表上記錄著所有場次的時間。\n\n今晚的場次：\n22:00 場次，散場時間：23:00\n\n這個時間與第一案的時間節奏接近。\n太接近了，像是刻意安排。',
              type: 'item',
            },
          },
          { type: 'setFlag', flag: 'schedule_b_found', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'examine_cinema_b_layout',
        name: '檢查放映廳動線圖',
        description: '你檢查放映廳動線圖。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'hotspot_cinema_b_layout' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '放映廳的動線圖顯示了所有出口位置。\n\n逃生口距離座位區很遠，\n人潮會集中在中段出口。\n\n這種設計，讓散場時人群會聚集，\n不容易注意到個別的人。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'clue_layout_analysis', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'examine_light_control_request_b',
        name: '檢查售票口燈控申請單',
        description: '你檢查售票口燈控申請單。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'hotspot_light_control_request_b' },
        ],
        effects: [
          { type: 'addItem', itemId: 'item_light_control_request' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：售票口燈控申請單\n\n售票口貼著一張燈控申請單。\n\n申請日期：一週前\n申請理由：觀眾投訴「太刺眼」\n結果：臨時延後亮燈 3 分鐘\n\n這個理由很常見，這個申請很合理。\n但時間點，太巧合了。',
              type: 'item',
            },
          },
          { type: 'setFlag', flag: 'light_request_found', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'examine_security_patrol_b',
        name: '檢查保全巡邏表',
        description: '你檢查保全巡邏表。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'hotspot_security_patrol_b' },
        ],
        effects: [
          { type: 'addItem', itemId: 'item_security_patrol_schedule' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：保全巡邏表\n\n保全巡邏表記錄著所有巡邏時間。\n\n散場後 5 分鐘內為空檔。\n這段時間，沒有人會巡邏。\n\n這是一個完美的時間窗口。',
              type: 'item',
            },
          },
          { type: 'setFlag', flag: 'patrol_schedule_found', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'examine_cleaning_memo_b',
        name: '檢查清潔人員備忘錄',
        description: '你檢查清潔人員備忘錄。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'hotspot_cleaning_memo_b' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '清潔人員的備忘錄上寫著：\n\n「這裡的散場，\n總是拖很久。\n\n觀眾習慣慢慢離場，\n不會急著走。\n這讓我們的工作變得很困難。」\n\n這種「拖很久」的散場，對兇手來說是優勢。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'cleaning_memo_found', value: true },
        ],
        oneTime: true,
      },
    ],
    puzzles: [],
    initialDialog: {
      text: '這是一間老電影院，\n燈光偏黃，\n觀眾習慣慢慢離場。\n\n這裡的一切都很熟悉，\n就像第一案發生的地方。\n但熟悉，有時候是陷阱。',
      type: 'narrator',
    },
  },
  
  // 可探索空間二：電影院 C（推測地點）
  'scene_ch3_cinema_c': {
    id: 'scene_ch3_cinema_c',
    chapterId: 'ch3',
    name: '電影院 C',
    description: '電影院C的放映廳。這裡有全自動燈控系統，準時亮燈，無法延後。但「準時」本身，也是一種可預測性。',
    background: '/images/bg_ch3_cinema_c_v1.webp',
    hotspots: [
      {
        id: 'hotspot_auto_light_system_c',
        shape: 'rect',
        coords: [0.2, 0.2, 0.5, 0.4],
        description: '全自動燈控系統',
        hint: '全自動燈控系統的說明書貼在控制室牆上。',
      },
      {
        id: 'hotspot_monitor_map_c',
        shape: 'rect',
        coords: [0.5, 0.3, 0.8, 0.6],
        description: '監視器配置圖',
        hint: '監視器配置圖上標示了所有監視器位置。',
      },
      {
        id: 'hotspot_crowd_flow_report_c',
        shape: 'rect',
        coords: [0.1, 0.6, 0.4, 0.8],
        description: '散場人流分析報告',
        hint: '散場人流分析報告顯示了詳細的數據。',
      },
      {
        id: 'hotspot_bridge_passage',
        shape: 'rect',
        coords: [0.5, 0.6, 0.9, 0.9],
        description: '空橋通道',
        hint: '空橋通道連接著電影院和百貨公司。',
      },
    ],
    items: [
      items.item_auto_light_system_c,
      items.item_monitor_deadzone_map,
      items.item_crowd_flow_report,
    ],
    hotspotEventMap: {
      'hotspot_auto_light_system_c': 'examine_auto_light_system_c',
      'hotspot_monitor_map_c': 'examine_monitor_map_c',
      'hotspot_crowd_flow_report_c': 'examine_crowd_flow_report_c',
      'hotspot_bridge_passage': 'examine_bridge_passage',
    },
    events: [
      {
        id: 'take_test',
        name: '進行安全測驗',
        description: '你進行安全測驗。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'test_paper_spot' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '你進行安全測驗，有明確的對錯答案。\n\n明確對錯，但節奏緊繃。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'test_taken', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'check_tools',
        name: '檢查工具',
        description: '你按照順序檢查工具。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'tool_check_spot' },
          { type: 'hasItem', itemId: 'tool_checklist' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '你按照順序檢查工具，必須完全按照程序。\n\n明確對錯，但節奏緊繃。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'tools_checked', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'answer_roll_call',
        name: '回答點名',
        description: '你回答點名確認。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'roll_call' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '你回答點名確認，必須回答正確。\n\n明確對錯，但節奏緊繃。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'roll_call_answered', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'pass_all_tests',
        name: '通過所有測驗',
        description: '你通過了所有測驗。',
        requirements: [
          { type: 'hasFlag', flag: 'test_taken', value: true },
          { type: 'hasFlag', flag: 'tools_checked', value: true },
          { type: 'hasFlag', flag: 'roll_call_answered', value: true },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '你通過了所有測驗。\n\n明確對錯，但節奏緊繃。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'all_tests_passed', value: true },
        ],
        oneTime: true,
      },
    ],
    puzzles: [
      {
        id: 'roll_call_puzzle',
        type: 'sequence_memory',
        solution: ['A1', 'B2', 'C3', 'D4'],
        hint: '點名確認：你不是人名，你是代碼。\n\n點名不是念名字，是念代碼（A1、B2…）。\n\n玩家必須在特定節拍按下回覆（把自己「對齊制度」）。\n\n可用 ROOM 1 的手錶時間當暗碼（例如：11:25 → A1, B2, C3, D4）。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'roll_call' },
          { type: 'hasItem', itemId: 'stopped_watch' },
        ],
        config: {
          sequenceLength: 4,
          symbols: ['A1', 'B2', 'C3', 'D4', 'E5'],
        },
        onSolve: [
          {
            type: 'showDialog',
            dialog: {
              text: '你在特定節拍按下回覆，把自己「對齊制度」。\n\n成功後得到一段短代碼：C-17。',
              type: 'narrator',
            },
          },
          { type: 'addItem', itemId: 'roll_call_code' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：點名代碼\n\n點名代碼：C-17。\n\n這是進入控制室模擬操作的登入碼。',
              type: 'item',
            },
          },
          { type: 'setFlag', flag: 'roll_call_puzzle_solved', value: true },
        ],
      },
    ],
    initialDialog: {
      text: '你適應規則，完成測驗。\n\n安全測驗、工具檢查、點名確認。\n\n明確對錯，但節奏緊繃。',
      type: 'narrator',
    },
  },
  
  // SPACE 3-3: 控制室・認同制度
  'ch3_sc3': {
    id: 'ch3_sc3',
    chapterId: 'ch3',
    name: '控制室・認同制度',
    description: '你認同制度，信任規則。',
    background: '/images/bg_ch3_sc3_v1.webp',
    hotspots: [
      {
        id: 'simulation',
        shape: 'rect',
        coords: [0.2, 0.3, 0.6, 0.7],
        description: '模擬操作',
        hint: '模擬操作，完全按照程序。',
      },
      {
        id: 'record_table',
        shape: 'rect',
        coords: [0.6, 0.3, 0.9, 0.5],
        description: '記錄表',
        hint: '確認每個步驟都有記錄。',
      },
      {
        id: 'cert_spot',
        shape: 'rect',
        coords: [0.6, 0.5, 0.9, 0.7],
        description: '安全認證',
        hint: '完成訓練後獲得的認證。',
      },
    ],
    items: [
      items.operation_manual,
      items.record_log,
      items.safety_cert,
    ],
    hotspotEventMap: {
      'simulation': 'do_simulation',
      'record_table': 'check_records',
      'cert_spot': 'get_cert',
    },
    events: [
      {
        id: 'do_simulation',
        name: '進行模擬操作',
        description: '你進行模擬操作。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'simulation' },
          { type: 'hasItem', itemId: 'operation_manual' },
          {
            type: 'custom',
            customCheck: (state) => !state.flags.simulation_puzzle_solved,
          },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '你需要進行模擬操作，並在記錄表上填寫每個步驟。\n\n若少填一格：系統提示「你做對了，但你沒留下證據。」',
              type: 'narrator',
            },
          },
        ],
        oneTime: false,
      },
      {
        id: 'check_records',
        name: '確認記錄',
        description: '你確認每個步驟都有記錄。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'record_table' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '你確認每個步驟都有記錄。\n\n你感受到「被制度保護」。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'records_checked', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'get_cert',
        name: '獲得認證',
        description: '你獲得安全認證。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'cert_spot' },
          { type: 'hasFlag', flag: 'simulation_done', value: true },
          { type: 'hasFlag', flag: 'records_checked', value: true },
        ],
        effects: [
          { type: 'addItem', itemId: 'safety_cert' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：安全認證\n\n完成訓練後獲得的認證，證明你已經學會了程序。\n\n你開始信任「只要照規則就沒事」。',
              type: 'item',
            },
          },
          { type: 'setFlag', flag: 'room3_completed', value: true },
          {
            type: 'showDialog',
            dialog: {
              text: '你離開 ROOM 3，帶著「安全認證」，前往 ROOM 4。',
              type: 'system',
            },
          },
          { type: 'setFlag', flag: 'navigate_to_ch4_intro', value: true },
        ],
        oneTime: true,
      },
    ],
    puzzles: [
      {
        id: 'simulation_record_puzzle',
        type: 'arrangement',
        solution: ['step1_time', 'step1_responsible', 'step1_status', 'step2_time', 'step2_responsible', 'step2_status', 'step3_time', 'step3_responsible', 'step3_status', 'step4_time', 'step4_responsible', 'step4_status', 'step5_time', 'step5_responsible', 'step5_status'],
        hint: '模擬操作＋記錄表：你要學會被監控。\n\n玩家照手冊做 5 步操作。\n\n每完成一步必須在記錄表上選正確欄位（時間、責任人、狀態）。\n\n若少填一格：系統提示「你做對了，但你沒留下證據。」',
        requirements: [
          { type: 'hasItem', itemId: 'operation_manual' },
          { type: 'hasItem', itemId: 'record_log' },
          { type: 'hasItem', itemId: 'roll_call_code' },
          { type: 'hasInteracted', hotspotId: 'simulation' },
        ],
        onSolve: [
          {
            type: 'showDialog',
            dialog: {
              text: '你完成了 5 步操作，並在記錄表上填寫了每個步驟的所有欄位。\n\n時間、責任人、狀態——每一格都填了。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'simulation_done', value: true },
          { type: 'setFlag', flag: 'simulation_puzzle_solved', value: true },
          { type: 'addItem', itemId: 'safety_cert' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：安全認證\n\n完成訓練後獲得的認證，證明你已經學會了程序。',
              type: 'item',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '制度保護你，但它更保護「制度自己」。',
              type: 'narrator',
            },
          },
        ],
      },
    ],
    initialDialog: {
      text: '你認同制度，信任規則。\n\n模擬操作、確認記錄、感受到「被制度保護」。\n\n你開始信任「只要照規則就沒事」。',
      type: 'narrator',
    },
  },
  
  // ========== ROOM 4: 電廠・災後與異物事件 ==========
  // SPACE 4-1: 地震後・程序開始動搖
  'ch4_sc1': {
    id: 'ch4_sc1',
    chapterId: 'ch4',
    name: '地震後・程序開始動搖',
    description: '地震發生，程序開始出現壓力。',
    background: '/images/bg_ch4_sc1_v1.webp',
    hotspots: [
      {
        id: 'earthquake_alarm',
        shape: 'rect',
        coords: [0.3, 0.1, 0.7, 0.3],
        description: '地震警報',
        hint: '地震警報響起。',
      },
      {
        id: 'broken_equipment',
        shape: 'rect',
        coords: [0.1, 0.4, 0.4, 0.7],
        description: '故障的設備',
        hint: '部分設備故障。',
      },
      {
        id: 'scattered_manual',
        shape: 'rect',
        coords: [0.5, 0.4, 0.9, 0.7],
        description: '散落的程序手冊',
        hint: '程序手冊被震落。',
      },
    ],
    items: [
      items.faulty_equipment,
      items.scattered_files,
      items.emergency_manual,
    ],
    hotspotEventMap: {
      'earthquake_alarm': 'hear_alarm',
      'broken_equipment': 'see_broken',
      'scattered_manual': 'find_manual',
    },
    events: [
      {
        id: 'hear_alarm',
        name: '聽到地震警報',
        description: '地震警報響起。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'earthquake_alarm' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '地震警報響起。\n\n時間開始變得緊迫。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'alarm_heard', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'see_broken',
        name: '看到故障設備',
        description: '你看到部分設備故障。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'broken_equipment' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '部分設備故障，但程序手冊還在。\n\n你發現「程序來不及」。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'broken_seen', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'find_manual',
        name: '找到程序手冊',
        description: '你找到散落的程序手冊。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'scattered_manual' },
        ],
        effects: [
          { type: 'addItem', itemId: 'emergency_manual' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：緊急程序手冊\n\n緊急情況下的程序手冊，但時間已經不夠了。\n\n時間、壓力與後果都變得真實。',
              type: 'item',
            },
          },
          { type: 'setFlag', flag: 'manual_found', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'realize_pressure',
        name: '理解壓力',
        description: '你理解了時間、壓力與後果都變得真實。',
        requirements: [
          { type: 'hasFlag', flag: 'alarm_heard', value: true },
          { type: 'hasFlag', flag: 'broken_seen', value: true },
          { type: 'hasFlag', flag: 'manual_found', value: true },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '你發現「程序來不及」。\n\n時間、壓力與後果都變得真實。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'pressure_realized', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'collect_scattered_files',
        name: '收集散落文件',
        description: '你收集散落的文件。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'scattered_manual' },
        ],
        effects: [
          { type: 'addItem', itemId: 'scattered_files' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：散落的文件\n\n地震時散落的程序文件，需要重新整理。\n\n文件被震散，編號缺角。',
              type: 'item',
            },
          },
          { type: 'setFlag', flag: 'files_collected', value: true },
        ],
        oneTime: true,
      },
    ],
    puzzles: [
      {
        id: 'scattered_files_puzzle',
        type: 'arrangement',
        solution: ['file1', 'file2', 'file3', 'file4', 'file5'],
        hint: '散落文件：你整理的不是紙，是責任鏈。\n\n文件被震散，編號缺角。\n\n玩家要把它們依「時間—部門—設備」排序。\n\n排完會露出一行隱藏字（例如：「FME-STEP-2 缺失」）。',
        requirements: [
          { type: 'hasItem', itemId: 'scattered_files' },
          { type: 'hasFlag', flag: 'files_collected', value: true },
        ],
        onSolve: [
          {
            type: 'showDialog',
            dialog: {
              text: '你按照「時間—部門—設備」排序文件。\n\n排完會露出一行隱藏字：FME-STEP-2 缺失。',
              type: 'narrator',
            },
          },
          { type: 'addItem', itemId: 'fme_gap_note' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：FME程序缺口記錄\n\n從散落文件中發現的程序缺口記錄：FME-STEP-2 缺失。',
              type: 'item',
            },
          },
          { type: 'setFlag', flag: 'files_puzzle_solved', value: true },
          {
            type: 'showDialog',
            dialog: {
              text: '指出程序缺口，讓 SPACE 4-2 的衝突變得具體。',
              type: 'narrator',
            },
          },
        ],
      },
    ],
    initialDialog: {
      text: '地震發生，程序開始出現壓力。\n\n地震警報響起、部分設備故障、程序手冊被震落。\n\n時間開始變得緊迫。',
      type: 'narrator',
    },
  },
  
  // SPACE 4-2: 異物事件・規則與時間衝突
  'ch4_sc2': {
    id: 'ch4_sc2',
    chapterId: 'ch4',
    name: '異物事件・規則與時間衝突',
    description: 'FME（異物防止）事件處理，規則與時間衝突。',
    background: '/images/bg_ch4_sc2_v1.webp',
    hotspots: [
      {
        id: 'foreign_object',
        shape: 'rect',
        coords: [0.3, 0.3, 0.7, 0.6],
        description: '異物',
        hint: '發現異物，需要處理。',
      },
      {
        id: 'detector',
        shape: 'rect',
        coords: [0.1, 0.2, 0.3, 0.4],
        description: '異物檢測器',
        hint: '異物檢測器顯示需要按照程序處理。',
      },
      {
        id: 'quick_tool_spot',
        shape: 'rect',
        coords: [0.7, 0.2, 0.9, 0.4],
        description: '快速處理工具',
        hint: '可以快速處理問題的工具，但不在正式程序裡。',
      },
    ],
    items: [
      items.foreign_object_detector,
      items.quick_fix_tool,
    ],
    hotspotEventMap: {
      'foreign_object': 'find_foreign_object',
      'detector': 'check_detector',
      'quick_tool_spot': 'see_quick_tool',
    },
    events: [
      {
        id: 'find_foreign_object',
        name: '發現異物',
        description: '你發現異物。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'foreign_object' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '你發現異物。\n\n按照程序需要多個步驟，但時間不夠了。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'object_found', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'check_detector',
        name: '檢查檢測器',
        description: '你檢查異物檢測器。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'detector' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '異物檢測器顯示需要按照程序處理。\n\n但時間不夠了。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'detector_checked', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'see_quick_tool',
        name: '看到快速處理工具',
        description: '你看到快速處理工具。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'quick_tool_spot' },
        ],
        effects: [
          { type: 'addItem', itemId: 'quick_fix_tool' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：快速處理工具\n\n可以快速處理問題的工具，但不在正式程序裡。\n\n出現「可以偷偷做點什麼」的縫隙。',
              type: 'item',
            },
          },
          { type: 'setFlag', flag: 'quick_tool_seen', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'feel_conflict',
        name: '感受到衝突',
        description: '你第一次覺得「規則太慢了」。',
        requirements: [
          { type: 'hasFlag', flag: 'object_found', value: true },
          { type: 'hasFlag', flag: 'detector_checked', value: true },
          { type: 'hasFlag', flag: 'quick_tool_seen', value: true },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '你第一次覺得「規則太慢了」。\n\n把「廟學到的捷徑思維」帶進來測試。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'conflict_felt', value: true },
        ],
        oneTime: true,
      },
    ],
    puzzles: [
      {
        id: 'detector_calibration_puzzle',
        type: 'rotating_dial',
        solution: { dial1: 0, dial2: 120, dial3: 240 },
        hint: '異物檢測器校正：規則要求你慢，但地震不等你。\n\n手冊要求校正 3 次、每次要等 30 秒（你可以做倒數）。\n\n但警報會越來越急促。\n\n玩家會開始想「能不能跳過？」——這裡埋“捷徑”選項。',
        requirements: [
          { type: 'hasItem', itemId: 'emergency_manual' },
          { type: 'hasInteracted', hotspotId: 'detector' },
          { type: 'hasFlag', flag: 'object_found', value: true },
        ],
        config: {
          dials: [
            { id: 'dial1', segments: 12, target: 0 },
            { id: 'dial2', segments: 12, target: 4 },
            { id: 'dial3', segments: 12, target: 8 },
          ],
        },
        onSolve: [
          {
            type: 'showDialog',
            dialog: {
              text: '你完成了 3 次校正，每次等待 30 秒。\n\n但警報越來越急促，你開始想「能不能跳過？」',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'detector_calibrated', value: true },
          { type: 'setFlag', flag: 'detector_puzzle_solved', value: true },
          {
            type: 'showDialog',
            dialog: {
              text: '開啟分歧：正式流程 vs 快速工具。',
              type: 'system',
            },
          },
        ],
      },
      {
        id: 'quick_fix_puzzle',
        type: 'visual_selection',
        solution: ['use_quick_tool', 'hide_evidence'],
        hint: '快速處理工具：你第一次把廟的手伸進電廠。\n\n玩家可用快速工具直接取出異物，但會跳出提示：「這一步沒有記錄欄位。你要把它藏在哪裡？」\n\n玩家需要選一個“藏證據的位置”（設備背板／工具箱／鞋底磁吸）。\n\n選錯會在後續留下破綻（影響 ROOM 5 後果記錄的內容）。',
        requirements: [
          { type: 'hasItem', itemId: 'quick_fix_tool' },
          { type: 'hasItem', itemId: 'temple_charm' },
          { type: 'hasFlag', flag: 'detector_calibrated', value: true },
          { type: 'hasInteracted', hotspotId: 'foreign_object' },
        ],
        options: [
          { id: 'use_quick_tool', label: '使用快速工具', description: '直接取出異物' },
          { id: 'hide_equipment', label: '藏在設備背板', description: '設備背板' },
          { id: 'hide_toolbox', label: '藏在工具箱', description: '工具箱' },
          { id: 'hide_shoe', label: '藏在鞋底磁吸', description: '鞋底磁吸' },
        ],
        onSolve: [
          {
            type: 'showDialog',
            dialog: {
              text: '你使用快速工具直接取出異物。\n\n「這一步沒有記錄欄位。你要把它藏在哪裡？」',
              type: 'narrator',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '你選擇了藏證據的位置。\n\n異物處理完成，但「記錄表」會出現空白洞。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'quick_fix_used', value: true },
          { type: 'setFlag', flag: 'quick_fix_puzzle_solved', value: true },
        ],
      },
    ],
    initialDialog: {
      text: 'FME（異物防止）事件處理，規則與時間衝突。\n\n發現異物、按照程序需要多個步驟（但時間不夠）、出現「可以偷偷做點什麼」的縫隙。\n\n你需要選擇：照程序 vs 快速處理。',
      type: 'narrator',
    },
  },
  
  // SPACE 4-3: 壓力點・自我說服
  'ch4_sc3': {
    id: 'ch4_sc3',
    chapterId: 'ch4',
    name: '壓力點・自我說服',
    description: '自我說服，開始考慮捷徑。',
    background: '/images/bg_ch4_sc3_v1.webp',
    hotspots: [
      {
        id: 'consequence_table',
        shape: 'rect',
        coords: [0.2, 0.3, 0.5, 0.6],
        description: '後果評估表',
        hint: '如果照程序處理，會發生什麼後果。',
      },
      {
        id: 'quick_solution',
        shape: 'rect',
        coords: [0.5, 0.3, 0.8, 0.6],
        description: '快速處理方案',
        hint: '「捷徑」的誘惑（廟的方法）。',
      },
    ],
    items: [
      items.consequence_report,
    ],
    hotspotEventMap: {
      'consequence_table': 'read_consequence',
      'quick_solution': 'see_quick_solution',
    },
    events: [
      {
        id: 'read_consequence',
        name: '閱讀後果評估',
        description: '你閱讀後果評估表。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'consequence_table' },
        ],
        effects: [
          { type: 'addItem', itemId: 'consequence_report' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：後果評估表\n\n如果照程序處理，會發生什麼後果的評估表。\n\n你看到後果（如果照程序會怎樣）。',
              type: 'item',
            },
          },
          { type: 'setFlag', flag: 'consequence_read', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'see_quick_solution',
        name: '看到快速處理方案',
        description: '你看到快速處理方案。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'quick_solution' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '你看到「捷徑」的誘惑（廟的方法）。\n\n內在辯解：「我只是想解決問題」。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'quick_solution_seen', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'self_persuasion',
        name: '自我說服',
        description: '你完成自我說服。',
        requirements: [
          { type: 'hasFlag', flag: 'consequence_read', value: true },
          { type: 'hasFlag', flag: 'quick_solution_seen', value: true },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '你完成自我說服。\n\n你第一次覺得「規則太慢了」。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'room4_completed', value: true },
          {
            type: 'showDialog',
            dialog: {
              text: '你離開 ROOM 4，帶著「自我說服」的理由，前往 ROOM 5。',
              type: 'system',
            },
          },
          { type: 'setFlag', flag: 'navigate_to_ch5_intro', value: true },
        ],
        oneTime: true,
      },
    ],
    puzzles: [
      {
        id: 'consequence_evaluation_puzzle',
        type: 'visual_selection',
        solution: ['self_persuasion_reason'],
        hint: '後果評估表：自我說服是一道題，不是心情。\n\n表格列出 A：照程序／B：快速處理，各自後果（停機、延誤、風險、可追責性）。\n\n玩家要選一個「最能說服自己」的理由（不是最安全）。\n\n選完會產生一句個人化辯解，寫進系統（成為 ROOM 5 身份文件素材）。',
        requirements: [
          { type: 'hasItem', itemId: 'consequence_report' },
          { type: 'hasFlag', flag: 'consequence_read', value: true },
        ],
        options: [
          { id: 'self_persuasion_reason', label: '我只是想解決問題', description: '最能說服自己的理由' },
          { id: 'time_reason', label: '時間不夠', description: '時間緊迫' },
          { id: 'risk_reason', label: '風險可控', description: '風險評估' },
          { id: 'efficiency_reason', label: '效率優先', description: '效率考量' },
        ],
        onSolve: [
          {
            type: 'showDialog',
            dialog: {
              text: '你選擇了「最能說服自己」的理由。\n\n你以為你在選方法；其實你在選「你願意相信的自己」。',
              type: 'narrator',
            },
          },
          { type: 'addItem', itemId: 'self_persuasion_text' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：自我說服文字\n\n你選擇的自我辯解文字，會成為身份文件的一部分。',
              type: 'item',
            },
          },
          { type: 'setFlag', flag: 'consequence_puzzle_solved', value: true },
          {
            type: 'showDialog',
            dialog: {
              text: '進入 ROOM 5 的通行權限（或核心入口）。',
              type: 'system',
            },
          },
        ],
      },
    ],
    initialDialog: {
      text: '自我說服，開始考慮捷徑。\n\n看到後果（如果照程序會怎樣）、看到「捷徑」的誘惑（廟的方法）、內在辯解（「我只是想解決問題」）。',
      type: 'narrator',
    },
  },
  
  // ========== ROOM 5: 反應爐核心・抉擇 ==========
  // SPACE 5-1: 核心入口・承認兩套系統
  'ch5_sc1': {
    id: 'ch5_sc1',
    chapterId: 'ch5',
    name: '核心入口・承認兩套系統',
    description: '最嚴密、最神聖、最不可犯錯的地方。藍色光芒安靜地存在著。',
    background: '/images/bg_ch5_sc1_v1.webp',
    hotspots: [
      {
        id: 'formal_procedure',
        shape: 'rect',
        coords: [0.1, 0.3, 0.4, 0.7],
        description: '正式程序',
        hint: '正式程序（複雜、安全、慢）。',
      },
      {
        id: 'informal_method',
        shape: 'rect',
        coords: [0.6, 0.3, 0.9, 0.7],
        description: '非正式方法',
        hint: '非正式方法（簡單、不確定、快）。',
      },
      {
        id: 'blue_glow',
        shape: 'rect',
        coords: [0.3, 0.1, 0.7, 0.3],
        description: '藍色光芒',
        hint: '藍色光芒安靜存在。',
      },
    ],
    items: [
      items.formal_manual,
      items.temple_charm,
    ],
    hotspotEventMap: {
      'formal_procedure': 'see_formal',
      'informal_method': 'see_informal',
      'blue_glow': 'see_glow',
    },
    events: [
      {
        id: 'see_formal',
        name: '看到正式程序',
        description: '你看到正式程序。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'formal_procedure' },
        ],
        effects: [
          { type: 'addItem', itemId: 'formal_manual' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：正式操作手冊\n\n最嚴密、最安全、但也最慢的操作程序。',
              type: 'item',
            },
          },
          { type: 'setFlag', flag: 'formal_seen', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'see_informal',
        name: '看到非正式方法',
        description: '你看到非正式方法。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'informal_method' },
        ],
        effects: [
          { type: 'addItem', itemId: 'temple_charm' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：廟的護身符\n\n從廟裡帶來的護身符，代表非正式的方法。\n\n簡單、不確定、快。',
              type: 'item',
            },
          },
          { type: 'setFlag', flag: 'informal_seen', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'see_glow',
        name: '看到藍色光芒',
        description: '你看到藍色光芒。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'blue_glow' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '藍色光芒安靜存在。\n\n最嚴密、最神聖、最不可犯錯的地方。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'glow_seen', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'understand_systems',
        name: '理解兩套系統',
        description: '你理解了兩套系統的對立。',
        requirements: [
          { type: 'hasFlag', flag: 'formal_seen', value: true },
          { type: 'hasFlag', flag: 'informal_seen', value: true },
          { type: 'hasFlag', flag: 'glow_seen', value: true },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '你理解了兩套系統的對立。\n\n最嚴密、最神聖、最不可犯錯的地方。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'systems_understood', value: true },
        ],
        oneTime: true,
      },
    ],
    puzzles: [
      {
        id: 'dual_system_login',
        type: 'combination',
        solution: ['formal_code', 'temple_charm'],
        hint: '雙系統登入：同一扇門有兩把鎖。\n\n核心入口需要兩把「鑰匙」：\n正式：輸入程序碼（可由 ROOM 3 點名碼＋ROOM 4 文件排序字串組合）\n非正式：護身符貼近感應區（或選擇「焚香祈求」介面）\n\n玩家必須兩邊都「能用」，才算真正承認兩套系統。',
        requirements: [
          { type: 'hasItem', itemId: 'formal_manual' },
          { type: 'hasItem', itemId: 'temple_charm' },
          { type: 'hasItem', itemId: 'roll_call_code' },
          { type: 'hasItem', itemId: 'fme_gap_note' },
          { type: 'hasFlag', flag: 'systems_understood', value: true },
        ],
        onSolve: [
          {
            type: 'showDialog',
            dialog: {
              text: '你輸入正式程序碼：C-17 + FME-STEP-2。\n\n你將護身符貼近感應區。\n\n兩邊都「能用」，你真正承認了兩套系統。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'dual_system_login_solved', value: true },
          {
            type: 'showDialog',
            dialog: {
              text: '進入操作面板（SPACE 5-2）。',
              type: 'system',
            },
          },
        ],
      },
    ],
    initialDialog: {
      text: '最嚴密、最神聖、最不可犯錯的地方。\n\n藍色光芒安靜地存在著。\n\n你看到正式程序（複雜、安全、慢）和非正式方法（簡單、不確定、快）。',
      type: 'narrator',
    },
  },
  
  // SPACE 5-2: 核心操作・做出選擇
  'ch5_sc2': {
    id: 'ch5_sc2',
    chapterId: 'ch5',
    name: '核心操作・做出選擇',
    description: '做出選擇，行動。',
    background: '/images/bg_ch5_sc2_v1.webp',
    hotspots: [
      {
        id: 'operation_panel',
        shape: 'rect',
        coords: [0.2, 0.3, 0.8, 0.7],
        description: '操作面板',
        hint: '你可以選擇相信哪一套系統。',
      },
    ],
    items: [
      items.operation_panel,
    ],
    hotspotEventMap: {
      'operation_panel': 'make_choice',
    },
    events: [
      {
        id: 'make_choice',
        name: '做出選擇',
        description: '你做出最終操作選擇。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'operation_panel' },
          { type: 'hasFlag', flag: 'dual_system_login_solved', value: true },
          {
            type: 'custom',
            customCheck: (state) => !state.flags.operation_panel_solved,
          },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '你站在操作面板前，可以選擇相信哪一套系統。',
              type: 'narrator',
            },
          },
        ],
        oneTime: false,
      },
    ],
    puzzles: [
      {
        id: 'operation_panel_legal',
        type: 'arrangement',
        solution: ['select_mode', 'input_params', 'fill_record', 'wait_countdown'],
        hint: '操作面板：合法路徑是一條長題目。\n\n玩家照手冊做 4 步操作：\n1. 選模式：NORMAL/EMERGENCY（必須選對）\n2. 輸入 3 組參數（來自 ROOM 3 訓練）\n3. 填寫記錄（像 ROOM 3-4）\n4. 等待倒數完成\n\n成功啟動，但會留下一句冷靜回饋：「你做得很正確，所以你不需要被原諒。」',
        requirements: [
          { type: 'hasItem', itemId: 'formal_manual' },
          { type: 'hasItem', itemId: 'safety_cert' },
          { type: 'hasFlag', flag: 'dual_system_login_solved', value: true },
          { type: 'hasInteracted', hotspotId: 'operation_panel' },
        ],
        onSolve: [
          {
            type: 'showDialog',
            dialog: {
              text: '你完成了 4 步操作：選模式、輸入參數、填寫記錄、等待倒數。\n\n成功啟動。',
              type: 'narrator',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '你做得很正確，所以你不需要被原諒。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'operation_panel_solved', value: true },
          { type: 'setFlag', flag: 'legal_path_chosen', value: true },
          { type: 'setFlag', flag: 'choice_made', value: true },
        ],
      },
      {
        id: 'operation_panel_illegal',
        type: 'input',
        solution: 'E7', // 灰燼碼
        hint: '操作面板：違規路徑是一句短咒。\n\n玩家選「快速模式」。\n\n只需輸入一組短碼（灰燼碼）或做一次「焚香」。\n\n立刻成功，但系統跳出一句：「你沒有做錯；你只是把『可追責』換成『可發生』。」',
        requirements: [
          { type: 'hasItem', itemId: 'temple_charm' },
          { type: 'hasItem', itemId: 'ash_code' },
          { type: 'hasFlag', flag: 'dual_system_login_solved', value: true },
          { type: 'hasInteracted', hotspotId: 'operation_panel' },
    ],
        onSolve: [
          {
            type: 'showDialog',
            dialog: {
              text: '你選「快速模式」，輸入灰燼碼：E7。\n\n立刻成功。',
              type: 'narrator',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '你沒有做錯；你只是把「可追責」換成「可發生」。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'operation_panel_solved', value: true },
          { type: 'setFlag', flag: 'illegal_path_chosen', value: true },
          { type: 'setFlag', flag: 'choice_made', value: true },
          {
            type: 'showDialog',
            dialog: {
              text: '立即進入後果區（SPACE 5-3），但後果記錄會更陰影。',
              type: 'system',
            },
          },
        ],
      },
    ],
    initialDialog: {
      text: '做出選擇，行動。\n\n最終操作選擇（可合法、可違規）、無明示正解、你必須選擇相信哪一套。',
      type: 'narrator',
    },
  },
  
  // SPACE 5-3: 後果・承擔
  'ch5_sc3': {
    id: 'ch5_sc3',
    chapterId: 'ch5',
    name: '後果・承擔',
    description: '承擔後果，完成「身份覆蓋」。',
    background: '/images/bg_ch5_sc3_v1.webp',
    hotspots: [
      {
        id: 'consequence_record_spot',
        shape: 'rect',
        coords: [0.2, 0.3, 0.5, 0.6],
        description: '後果記錄',
        hint: '你的選擇所帶來的後果記錄。',
      },
      {
        id: 'identity_file_spot',
        shape: 'rect',
        coords: [0.5, 0.3, 0.8, 0.6],
        description: '身份文件',
        hint: '最終的身份文件，記錄著你成為誰。',
      },
    ],
    items: [
      items.consequence_record,
      items.identity_file,
    ],
    hotspotEventMap: {
      'consequence_record_spot': 'read_consequence',
      'identity_file_spot': 'read_identity',
    },
    events: [
      {
        id: 'read_consequence',
        name: '閱讀後果記錄',
        description: '你閱讀後果記錄。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'consequence_record_spot' },
          { type: 'hasFlag', flag: 'choice_made', value: true },
        ],
        effects: [
          { type: 'addItem', itemId: 'consequence_record' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：後果記錄\n\n你的選擇所帶來的後果記錄。\n\n看到選擇的後果（不立即評價對錯）。',
              type: 'item',
            },
          },
          { type: 'setFlag', flag: 'consequence_read', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'read_identity',
        name: '閱讀身份文件',
        description: '你閱讀身份文件。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'identity_file_spot' },
          { type: 'hasFlag', flag: 'consequence_read', value: true },
        ],
        effects: [
          { type: 'addItem', itemId: 'identity_file' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：身份文件\n\n最終的身份文件，記錄著你成為誰。\n\n理解「那不再是我」已經不可能。',
              type: 'item',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '你不再能說「那不是我」。\n\n完成身份覆蓋。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'room5_completed', value: true },
          { type: 'setFlag', flag: 'game_completed', value: true },
        ],
        oneTime: true,
      },
    ],
    puzzles: [
      {
        id: 'consequence_to_identity_puzzle',
        type: 'arrangement',
        solution: ['fragment1', 'fragment2', 'fragment3', 'fragment4'],
        hint: '後果記錄→身份文件：你以為是結算，其實是覆寫。\n\n後果記錄會列出 4 段文字碎片（有些是你自己選的辯解）。\n\n玩家必須把碎片排序成一段「自白」。\n\n排完生成身份文件：標題不是你的名字，而是你的角色（例如：「守規者」/「越線者」/「兩者皆是」）。',
        requirements: [
          { type: 'hasItem', itemId: 'consequence_record' },
          { type: 'hasItem', itemId: 'self_persuasion_text' },
          { type: 'hasFlag', flag: 'choice_made', value: true },
          { type: 'hasFlag', flag: 'consequence_read', value: true },
        ],
        onSolve: [
          {
            type: 'showDialog',
            dialog: {
              text: '你把 4 段文字碎片排序成一段「自白」。\n\n你以為是結算，其實是覆寫。',
              type: 'narrator',
            },
          },
          { type: 'addItem', itemId: 'identity_file' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：身份文件\n\n最終的身份文件，記錄著你成為誰。\n\n標題不是你的名字，而是你的角色。',
              type: 'item',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '你不再能說：那不是我。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'identity_puzzle_solved', value: true },
          { type: 'setFlag', flag: 'room5_completed', value: true },
          { type: 'setFlag', flag: 'game_completed', value: true },
        ],
      },
    ],
    initialDialog: {
      text: '承擔後果，完成「身份覆蓋」。\n\n看到選擇的後果（不立即評價對錯）、理解「那不再是我」已經不可能、完成身份覆蓋。',
      type: 'narrator',
    },
  },
};

// 章節定義
export const chapters: Record<string, Chapter> = {
  ch1: {
    id: 'ch1',
    name: '第一章：城市影城',
    description: '死在散場之後的人',
    scenes: ['scene_ch1_cinema_a_hall', 'scene_ch1_projection_room', 'scene_ch1_restroom'],
    intro: {
      title: '第一章：城市影城',
      subtitle: '死在散場之後的人',
      description: '散場後的世界很吵。塑膠杯、手機光、鞋底黏住地毯的聲音。可這個人死得太安靜。像有人把「求救」剪掉了。',
      moodText: '散場後最暗的不是影廳。是每個人都想快點回到「正常」。而兇手，就是在正常裡動手。',
      // backgroundImage: '/images/intro_ch1_bg.webp', // 需要放置圖片
      // 第一章導讀 BGM：置於 public/audio/bgm/kk_bgm_intro_ch1.mp3
      ambientAudio: '/audio/bgm/kk_bgm_intro_ch1.mp3',
      // 導讀影片：文字說明後播放的動畫影片
      // 建議格式：MP4 (H.264編碼，兼容性最好)
      // 建議尺寸：1920x1080 或 1280x720
      // 建議時長：30-60秒
      // 檔案大小：建議 < 10MB（可壓縮）
      // 檔名建議：intro_ch1_animation_v1.mp4
      // 放置位置：/public/videos/intro_ch1_animation_v1.mp4
      introVideo: '/videos/intro_ch1_animation_v1.mp4',
    },
  },
  ch2: {
    id: 'ch2',
    name: '第二章：城市碎片',
    description: '第一個嫌犯 A',
    scenes: ['scene_ch2_park', 'scene_ch2_office_building', 'scene_ch2_suspect_a_residence'],
    intro: {
      title: '第二章：城市碎片',
      subtitle: '第一個嫌犯 A',
      description: '一個「看起來很像兇手的人」。\n\n嫌犯 A 幾乎完美符合「動機想像」，卻在時間與行為上完全對不上。',
      moodText: '當一個人符合你想像中的「動機」，\n你會不會反而忽略「他根本來不及」？',
      // backgroundImage: '/images/intro_ch2_bg.webp', // 需要放置圖片
      ambientAudio: '/audio/ambient/temple_intro.mp3',
    },
  },
  ch3: {
    id: 'ch3',
    name: '第三章：預測',
    description: '電影院 B 和 C',
    scenes: ['scene_ch3_cinema_b', 'scene_ch3_cinema_c', 'scene_ch3_shopping_mall_bridge'],
    intro: {
      title: '第三章：預測',
      subtitle: '兩個電影院，一次機會',
      description: '你以為第二章是在排除嫌疑，其實只是替第三章鋪路。',
      moodText: '因為現在，世界不會等你慢慢想。\n\n如果你現在不選邊站，下一個人就會死。',
      // backgroundImage: '/images/intro_ch3_bg.webp', // 需要放置圖片
      ambientAudio: '/audio/ambient/powerplant_intro.mp3',
    },
  },
  ch4: {
    id: 'ch4',
    name: '第四章：逼近',
    description: '嫌犯 C',
    scenes: ['scene_ch4_ticket_counter', 'scene_ch4_food_court', 'scene_ch4_rooftop'],
    intro: {
      title: '第四章：逼近',
      subtitle: '每個人都站在正確的位置',
      description: '嫌疑全面攤開、動機與能力同時對齊。',
      moodText: '如果一切都合理，那我到底在抓什麼？',
      // backgroundImage: '/images/intro_ch4_bg.webp', // 需要放置圖片
      ambientAudio: '/audio/ambient/disaster_intro.mp3',
    },
  },
  ch5: {
    id: 'ch5',
    name: '第五章：最後一場放映',
    description: '抉擇',
    scenes: ['scene_ch5_cinema_b_hall', 'scene_ch5_cinema_b_exit', 'scene_ch5_cinema_c_hall', 'scene_ch5_elevator'],
    intro: {
      title: '第五章：最後一場放映',
      subtitle: '抉擇',
      description: '城市沒有警鈴。沒有倒數。只有一場正常播放的電影，和一個你必須自己做出的決定。',
      moodText: '如果你錯了，沒有人會提醒你。\n\n如果你對了，也沒有人會恭喜你。\n\n因為這不是遊戲，這是選擇。',
      // backgroundImage: '/images/intro_ch5_bg.webp', // 需要放置圖片
      ambientAudio: '/audio/ambient/core_intro.mp3',
    },
  },
};

// NPC 對話樹定義（第一章林瑞堂：兩條敏感問題二選一，問完即鎖；其餘 NPC 暫維持原結構）
export const npcDialogs: Record<string, Record<string, NpcDialogNode>> = {
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
      text: 'KK：「你說流程正常，但流程正常的人不會死得這麼安靜。」\n\n林瑞堂：「改表不代表犯罪，可能只是服務調整。」\n\nKK：「你急著把它叫成服務。」\n\n林瑞堂（真遺憾）：「我真的很遺憾…可我也不想看到這裡被毀掉。」\n\nKK：「被毀掉的不是影城，是那個人。」\n\n林瑞堂沉默。',
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
          effects: [{ type: 'setFlag', flag: 'note_lin_procedure', value: true }, { type: 'setFlag', flag: 'npc_lin_sensitive_done', value: true }],
        },
        {
          id: 'choice_human',
          label: '「他怕的應該不是兇手，是上面那張看不見的臉，可是這些恐懼會替兇手擦地板。」',
          insightEffects: [{ target: 'human_insight', delta: 1 }],
          effects: [{ type: 'setFlag', flag: 'note_lin_human', value: true }, { type: 'setFlag', flag: 'npc_lin_sensitive_done', value: true }],
        },
        {
          id: 'choice_evidence',
          label: '「官腔很滑，油槍滑掉，但官腔擋不住痕跡。」',
          insightEffects: [{ target: 'evidence_insight', delta: 1 }],
          effects: [{ type: 'setFlag', flag: 'note_lin_evidence', value: true }, { type: 'setFlag', flag: 'npc_lin_sensitive_done', value: true }],
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
          effects: [{ type: 'setFlag', flag: 'note_lin_procedure', value: true }, { type: 'setFlag', flag: 'npc_lin_sensitive_done', value: true }],
        },
        {
          id: 'choice_human',
          label: '「他怕的不是兇手，是上面那張看不見的臉。恐懼會替兇手擦地板。」',
          insightEffects: [{ target: 'human_insight', delta: 1 }],
          effects: [{ type: 'setFlag', flag: 'note_lin_human', value: true }, { type: 'setFlag', flag: 'npc_lin_sensitive_done', value: true }],
        },
        {
          id: 'choice_evidence',
          label: '「官腔擋不住痕跡。」',
          insightEffects: [{ target: 'evidence_insight', delta: 1 }],
          effects: [{ type: 'setFlag', flag: 'note_lin_evidence', value: true }, { type: 'setFlag', flag: 'npc_lin_sensitive_done', value: true }],
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
      text: 'KK：「散場後，你們巡場有空窗嗎？」\n\n阿順（先笑）：「有啊，散場後一分鐘到兩分鐘。要先引導人潮出去。」\n\nKK：「那段誰看？」\n\n阿順：「誰都看，又誰都沒看。走道像水流，沒人會停。」\n\nKK（旁白）：90 秒，足夠一個熟練的人做很多事。',
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
      text: 'KK：「監視器死角在哪？」\n\n阿順：「H 排那邊的側走道，被柱子切掉一角。看得到人群，看不到貼著椅子走的人。」\n\nKK：「你確定？」\n\n阿順：「我每天走那條路。死角是老朋友。」\n\nKK（旁白）：死角不是空白，是被允許的盲。',
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
      text: 'KK：「那表格誰能改？」\n\n小張（吞口水）：「要有管理權限…通常是主管層。保全那邊也有人能提申請。」\n\nKK：「提申請？所以燈不是『自然延後』，是『被允許延後』。」\n\n小張沉默。\n\nKK（旁白）：允許，才是這城市最重的鎖。',
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
      text: 'KK：「你說『太乾淨』，哪裡太乾淨？」\n\n周姊：「洗手台下面。正常那裡會卡灰卡毛，今天像被擦過一遍。」\n\nKK：「擦得很急？」\n\n周姊：「嗯。像怕你看見。」\n\nKK（旁白）：急著乾淨的人，多半有東西不能留。',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_zhou_clean_2',
    },
    'node_zhou_clean_2': {
      id: 'node_zhou_clean_2',
      npcId: 'npc_zhou_jie',
      text: 'KK：「燈晚亮，你怎麼知道？」\n\n周姊（敲手錶）：「我手錶快兩分鐘，但那晚…我還是等了。等到心裡發冷才亮。」\n\nKK（旁白）：體感的時間，比任何表格都殘酷。',
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
      text: '周姊（拿出夾子）：「黑色碎片。像手套的一角。你拿走吧，我不想它被丟掉。」\n\nKK：「你怎麼沒直接丟？」\n\n周姊：「因為丟掉會讓我晚上睡不著。」',
      choices: [
        { id: 'choice_seal', label: '「我現在就封袋。」', effects: [{ type: 'addItem', itemId: 'item_black_plastic_fragment' }, { type: 'setFlag', flag: 'black_fragment_found', value: true }, { type: 'setFlag', flag: 'fragment_choice_evidence', value: true }] },
        { id: 'choice_secret', label: '「先別讓任何人知道你有看見它。」', effects: [{ type: 'addItem', itemId: 'item_black_plastic_fragment' }, { type: 'setFlag', flag: 'black_fragment_found', value: true }, { type: 'setFlag', flag: 'fragment_choice_human', value: true }] },
        { id: 'choice_report', label: '「我會回報，讓它進正式流程。」', effects: [{ type: 'addItem', itemId: 'item_black_plastic_fragment' }, { type: 'setFlag', flag: 'black_fragment_found', value: true }, { type: 'setFlag', flag: 'fragment_choice_procedure', value: true }] },
      ],
      next: 'node_zhou_fragment_2',
    },
    'node_zhou_fragment_2': {
      id: 'node_zhou_fragment_2',
      npcId: 'npc_zhou_jie',
      text: 'KK：「燈晚亮，你怎麼知道？」\n\n周姊（敲手錶）：「我手錶快兩分鐘，但那晚…我還是等了。等到心裡發冷才亮。」\n\nKK（旁白）：體感的時間，比任何表格都殘酷。',
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
  // 保留舊 key 以相容（若 play 頁未改為 npc_zhou_jie 時仍可載入）
  npc_zhou_yawen: {
    'node_01_surface': {
      id: 'node_01_surface',
      npcId: 'npc_zhou_yawen',
      text: '「那天我記得很清楚，\n因為燈比平常晚亮。\n\n我通常會在散場後5分鐘開始清潔，\n但那天，燈一直沒亮。\n我等了很久，才有人來開燈。」',
      choices: [
        {
          id: 'choice_ask_details',
          label: '詢問細節',
          description: '深入詢問更多細節',
          preferenceEffects: [
            { target: 'preference_observation_wait', delta: 1 },
          ],
        },
        {
          id: 'choice_ask_anomaly',
          label: '詢問異常',
          description: '了解燈光延後的具體時間',
          effects: [
            {
              type: 'showDialog',
              dialog: {
                text: '「異常？\n就是燈比平常晚亮。\n具體時間...大概是散場後8分鐘才亮。\n\n獲得線索：燈光延後的具體時間',
                type: 'narrator',
              },
            },
            { type: 'setFlag', flag: 'clue_light_delay_time', value: true },
            { type: 'setFlag', flag: 'clue_light_delay_confirmed', value: true },
          ],
          preferenceEffects: [
            { target: 'preference_system_intervention', delta: 1 },
          ],
        },
        {
          id: 'choice_end',
          label: '結束對話',
          description: '暫時結束對話',
        },
      ],
      next: (state) => {
        // 根據選擇決定下一個節點
        // 如果選擇了「詢問細節」，進入第二層
        if (state.flags['npc_npc_zhou_yawen_choice_choice_ask_details']) {
          return 'node_02_deep';
        }
        // 如果選擇了其他選項（詢問異常或結束對話），對話結束
        return null;
      },
    },
    'node_02_deep': {
      id: 'node_02_deep',
      npcId: 'npc_zhou_yawen',
      text: '「有時候，\n不亮燈，反而比較不會被注意。\n\n在黑暗中，很多事情都可以發生。\n沒有人會看到，沒有人會記得。\n\n我只是...覺得那天有點奇怪。」',
      choices: [
        {
          id: 'choice_ask_what_saw',
          label: '詢問她看到了什麼',
          description: '了解清潔人員的觀察',
          effects: [
            {
              type: 'showDialog',
              dialog: {
                text: '「我...我沒有看到什麼。\n只是覺得那天有點奇怪。\n\n獲得線索：清潔人員的觀察',
                type: 'narrator',
              },
            },
            { type: 'setFlag', flag: 'clue_cleaner_observation', value: true },
          ],
          preferenceEffects: [
            { target: 'weight_behavior_evidence', delta: 1 },
          ],
        },
        {
          id: 'choice_ask_suspect',
          label: '詢問她是否懷疑誰',
          description: '了解內部人員關係',
          effects: [
            {
              type: 'showDialog',
              dialog: {
                text: '「我...我不敢說。\n但這裡的人，都互相認識。\n\n獲得線索：內部人員關係',
                type: 'narrator',
              },
            },
            { type: 'setFlag', flag: 'clue_internal_relations', value: true },
          ],
          preferenceEffects: [
            { target: 'question_system', delta: 1 },
          ],
        },
        {
          id: 'choice_end_deep',
          label: '結束對話',
          description: '結束對話',
          effects: [
            { type: 'setFlag', flag: 'clue_light_delay_confirmed', value: true },
          ],
        },
      ],
 // 對話結束
    },
  },
};
