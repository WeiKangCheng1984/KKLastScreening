import { Chapter, Scene, Item, Hotspot, Event, Puzzle, Dialog, Npc } from '@/types/game';
import type { NpcDialogNode } from '@/types/game';

// 序章文案（KK流程偵探：最後一場放映）
export const prologueSlides: string[] = [
  '凌晨 00:39，你的手機震了一下。',
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
    description: '一張被撕得很乾淨的票根，靜靜躺在地上。\n\n座位號碼：H排12號\n場次時間：22:30\n\n票根邊緣整齊，像是被人小心處理過。',
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

  // 第二章：死者是誰（受害者手機解密線索）
  'item_victim_basic_info': {
    id: 'item_victim_basic_info',
    name: '受害者基礎資料（吳亞／烏鴉）',
    description: '死者姓名：吳亞，綽號「烏鴉」。\n\n職業：專欄作家，長期撰寫城市治理、公共建設、企業黑箱等議題。\n他習慣用化名和代稱寫東西，專欄裡很少出現完整機構名稱，但熟悉圈內的人看了都知道在指哪幾家。\n近期專欄多次提到「節能設備」、「外包驗收」、「安全與數字交換」。\n在媒體圈小有名氣，也小有仇人，留言區一半讚、一半罵。',
    svgImage: '/svg/items/visitor_log.svg',
    svgSize: 'medium',
    collectible: true,
  },
  'item_encrypted_messages': {
    id: 'item_encrypted_messages',
    name: '加密訊息紀錄（部分解碼）',
    description: '從一個標記為「Unknown」的對話窗中還原出的片段：\n「……為什麼不把資訊完……」\n「……用三起事故來揭……」\n「……她也在場，你確定要這樣寫？」\n\n其餘訊息多為亂碼或遺失。時間戳集中在命案前一週。\n無法分辨誰發出、誰回覆，只知道這不是一般閒聊。\n「她」是誰、到底在場的是誰，暫時只能當成一個刻意被留在那裡的鉤子。',
    svgImage: '/svg/items/projector_notes.svg',
    svgSize: 'medium',
    collectible: true,
  },
  'item_column_draft': {
    id: 'item_column_draft',
    name: '專欄草稿片段（節能設備）',
    description: '記事本 App 裡的未發表草稿。標題：「節能設備，誰省了電，誰省了責任？」\n\n草稿指出：新導入的影城節能設備，不只調整照明與空調，更會改變「散場的節奏、逃生路線的亮暗、紀錄檔案的寫入方式」。\n文中對某些配合廠商用字含糊，句子像故意留下空格：「有一部分的人，比較擅長把事故變成『改善提案』。」\n末段停在：「如果我要談這件事，得從兩年前的某個樓梯間開始。」\n草稿未送出，顯示最後編輯時間在命案前兩天。',
    svgImage: '/svg/items/schedule_modified.svg',
    svgSize: 'medium',
    collectible: true,
  },
  'item_unfinished_recording': {
    id: 'item_unfinished_recording',
    name: '未完成錄音（備忘_事故）',
    description: '錄音檔案標題為「備忘_事故」。\n\n內容提到：\n「……他們一直說那是個案。可是結案報告有兩個版本，一個給內部、一個給外面……」\n之後被中斷。錄製時間落在命案前一晚。\n聲音刻意經過處理，像怕被辨識出來。\n這段錄音證明：烏鴉已經接觸到過去事故被「改寫」的證據，也知道「誰看哪一個版本」。',
    svgImage: '/svg/items/recorder.svg',
    svgSize: 'medium',
    collectible: true,
  },
  'item_coded_contacts': {
    id: 'item_coded_contacts',
    name: '代號聯絡人',
    description: '受害者通訊錄中的幾個特殊聯絡人：\n\n「城市影城W」：備註為「影廳見」，最近一次通話在命案當晚前不久。\n「聯合影城C」：備註「表單／審查」，通話多集中在節能設備導入的時期。\n「光芒影城R」：備註寫著「梯間／試行」，通話記錄集中在兩年前某段時間與最近幾週。\n\n這些名字不屬於一般社交，更像是他自己的調查用代稱，把人當作流程節點記錄。',
    svgImage: '/svg/items/visitor_log.svg',
    svgSize: 'medium',
    collectible: true,
  },
  'item_location_record': {
    id: 'item_location_record',
    name: '行蹤紀錄（定位）',
    description: '警方提供的定位紀錄顯示：\n命案前一週，吳亞頻繁往返幾家影城、設備商辦公室和一棟老舊商務大樓。\n那棟老樓的 GPS 訊號時常跳點，定位圖上出現一堆重疊的小圓點，像系統也不太想記住那個地方。\n命案當晚，他提前抵達城市影城附近，停留時間超過兩小時，路線軌跡在影城周圍畫出一圈又一圈。\n這些行程和他草稿裡提到的「節能設備」與「樓梯間」高度重疊，卻又沒有任何正式行程紀錄可以對得上。',
    svgImage: '/svg/items/schedule_modified.svg',
    svgSize: 'medium',
    collectible: true,
  },

  // 第二章：城市碎片（嫌犯 A）— 以下保留供他章使用
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
    description: '票務系統的時間戳記錄著所有交易時間。\n\n案發當晚的記錄：\n22:30 場次，H排12號\n購票時間：案發當天下午\n\n這個時間戳，與第一章死亡時間完全吻合。\n太吻合了，像是刻意安排。',
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
    description: '監視器回放顯示了案發當晚的情況。\n\n時間戳：00:12\n地點：清潔通道\n\n畫面中，黃志誠走進清潔通道。\n然後，消失了 47 秒。\n\n47秒後，他從另一個出口出現。\n手裡端著清潔工具，像是剛完成工作。',
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
  }
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
              text: '獲得：電影票根\n\n一張被撕得很乾淨的票根，靜靜躺在地上。\n\n座位號碼：H排12號\n場次時間：22:30\n\n票根邊緣整齊，像是被人小心處理過。',
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
        id: 'npc_liu',
        name: '劉隊（偵查隊）',
        portraitExpression: 1,
        randomDialogs: [
          {
            id: 'ch1_briefing',
            text: '「現場我們會先封著，你來看一眼就好。你看到什麼，就照實說。」',
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
              text: '監視器畫面正在播放案發當晚的錄影。\n\n時間戳：00:12\n畫面：散場後的放映廳\n\n在昏暗的光線中，一個身影快速移動。\n90秒內，從座位區到出口，然後消失。',
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
    puzzles: [],
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
      text: '警方把一個死人的生活拆成附件，發給你。\n\n標題冷冰冰——「城市影城H12_受害人手機_部分解密」。\n旁邊多了一句：「工程師阿蘇會到場協助判讀。」\n\n你一向先看現場，再看名字。這次順序顛倒。名字藏在訊息裡，像有人把他活過的每一天倒帶，倒到你面前，要求你把那卷帶子看完。\n\n真正黏人的問題，除了「他是誰」，還有：「他究竟戳到了哪一層，才會被這樣收場？」',
      type: 'narrator',
    },
    npcs: [
      {
        id: 'npc_asu',
        name: '阿蘇（工程師）',
        portrait: '/svg/characters/asu.svg',
        randomDialogs: [
          { id: 'asu_casual_1', text: '「你看這些訊息，像威脅，又有一點像兩個人在互相拗稿。」', type: 'casual', weight: 3 },
          { id: 'asu_casual_2', text: '「工程系的人最怕兩種人，一種是什麼都不懂，一種是懂太多還故意裝不知道。」', type: 'casual', weight: 2 },
          { id: 'asu_casual_3', text: '「他把影城寫進專欄，結果人被留在影城裡。這種對稱，很難說是巧合。」', type: 'casual', weight: 2 },
          { id: 'asu_casual_4', text: '「節能設備本來是好東西啊，省電、省錢，所有簡報都這樣寫。可是一旦有人發現它可以順便省掉責任，就會開始長得怪怪的。」', type: 'casual', weight: 2 },
          { id: 'asu_casual_5', text: '「系統通常比人老實，可是設計系統的人不一定。這點我很有資格抱怨。」', type: 'casual', weight: 2 },
          { id: 'asu_casual_6', text: '「他給聯絡人取名字的方式很工程師，全部用代碼。其實這種人死掉，調查起來很煩，卻也比較有路徑可以追。」', type: 'casual', weight: 2 },
          { id: 'asu_casual_7', text: '「『三起事故』這個說法，很熟。寫技術文件的人才會把東西分成一、二、三這樣。」', type: 'casual', weight: 2 },
          { id: 'asu_casual_8', text: '「如果你把這些聊天紀錄當成八卦，它們就只會變成八卦；你把它們當線路，它們才會開始帶電。」', type: 'casual', weight: 2 },
          { id: 'asu_casual_9', text: '「有時候我覺得他很像一個沒受過訓練的工程師，把城市當機房亂摸。」', type: 'casual', weight: 2 },
          { id: 'asu_casual_10', text: '「喔對，我有回過他的信，只是回得很不耐煩。沒想到…」\n她話說到一半停住，手指在方向盤上敲了兩下。', type: 'casual', weight: 2 },
        ],
        available: true,
      },
    ],
  },
  */

  // 場景二：阿蘇的車裡
  'scene_ch2_asu_car': {
    id: 'scene_ch2_asu_car',
    chapterId: 'ch2',
    name: '阿蘇的車裡',
    description: '小型掀背車停在路邊。後座堆著筆電包、工具箱、幾卷網路線，半掩拉鍊露出纏在一起的線頭，像一團被放棄的脈絡。前座兩杯便利商店咖啡喝到一半，杯口印著溫度警語，咖啡香早就冷掉，只剩苦味在車內打轉。儀表板被手機螢幕映出淡藍光，像這台車也在做夢。',
    background: '/images/bg_ch2_park_v1.webp',
    hotspots: [
      { id: 'hotspot_car_phone_main', shape: 'rect', coords: [0.35, 0.32, 0.25, 0.25], description: '受害者手機主畫面', hint: '桌布是一張城市夜景，聯絡人顯示吳亞。' },
      { id: 'hotspot_car_unknown_chat', shape: 'rect', coords: [0.1, 0.32, 0.25, 0.22], description: '通訊紀錄 Unknown', hint: '聊天視窗多數訊息被標成亂碼。' },
      { id: 'hotspot_car_an_chat', shape: 'rect', coords: [0.65, 0.32, 0.25, 0.2], description: '通訊紀錄 An', hint: '聯絡人名稱：「An」，頭像是一杯拿鐵拉花。' },
      { id: 'hotspot_car_notepad', shape: 'rect', coords: [0.68, 0.08, 0.22, 0.22], description: '記事本筆記_未發表', hint: '未發表的草稿。' },
      { id: 'hotspot_car_recording', shape: 'rect', coords: [0.68, 0.62, 0.22, 0.22], description: '錄音備忘_事故', hint: '播放鍵按下去，車內多了一個被刻意壓低處理過的男人聲音。' },
      { id: 'hotspot_car_contacts', shape: 'rect', coords: [0.08, 0.08, 0.22, 0.22], description: '聯絡人列表', hint: '城市影城W、聯合影城C、光芒影城R。' },
      { id: 'hotspot_car_location', shape: 'rect', coords: [0.08, 0.62, 0.22, 0.22], description: '系統定位紀錄', hint: '定位紀錄像是一張被畫滿螢光筆的城市地圖。' },
      { id: 'hotspot_car_toolbox', shape: 'rect', coords: [0.7, 0.82, 0.25, 0.18], description: '後座工具箱', hint: '打不開，只能看見上面的貼紙。' },
      { id: 'hotspot_car_coffee', shape: 'rect', coords: [0.38, 0.8, 0.24, 0.16], description: '便利商店咖啡杯', hint: '杯子上用油性筆寫著「A」和「K」。' },
      { id: 'hotspot_car_charm', shape: 'rect', coords: [0.45, 0.05, 0.18, 0.18], description: '車上吊飾', hint: '後視鏡上掛著一個像素風電路板造型吊飾。' },
    ],
    items: [
      items.item_victim_basic_info,
      items.item_encrypted_messages,
      items.item_column_draft,
      items.item_unfinished_recording,
      items.item_coded_contacts,
      items.item_location_record,
    ],
    hotspotEventMap: {
      'hotspot_car_phone_main': 'examine_car_phone_main',
      'hotspot_car_unknown_chat': 'examine_car_unknown_chat',
      'hotspot_car_an_chat': 'examine_car_an_chat',
      'hotspot_car_notepad': 'examine_car_notepad',
      'hotspot_car_recording': 'examine_car_recording',
      'hotspot_car_contacts': 'examine_car_contacts',
      'hotspot_car_location': 'examine_car_location',
      'hotspot_car_toolbox': 'examine_car_toolbox',
      'hotspot_car_coffee': 'examine_car_coffee',
      'hotspot_car_charm': 'examine_car_charm',
    },
    events: [
      {
        id: 'examine_car_phone_main',
        name: '受害者手機主畫面',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_car_phone_main' }],
        effects: [
          { type: 'addItem', itemId: 'item_victim_basic_info' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：受害者基礎資料',
              type: 'item',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（工程師）',
              characterExpression: 1,
              characterPosition: 'left',
              textSegments: [
                '桌布是一張城市夜景，構圖歪了一點，街口有個模糊人影，臉被移動殘影拉長，看不出是誰。',
                '解鎖後，聯絡人卡片浮出名字「吳亞」，備註欄寫著「烏鴉」。',
                '專欄作家，字比睡眠多。',
                '他習慣把城市拆成版本寫出來，現在輪到別人替他寫版本了。'
              ],
            },
          },
        ],
        oneTime: true,
      },
      {
        id: 'replay_car_phone_main',
        name: '受害者手機主畫面（重播）',
        description: '',
        requirements: [{ type: 'hasItem', itemId: 'item_victim_basic_info' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（工程師）',
              characterExpression: 1,
              characterPosition: 'left',
              textSegments: [
                '桌布是一張城市夜景，構圖歪了一點，街口有個模糊人影，臉被移動殘影拉長，看不出是誰。',
                '解鎖後，聯絡人卡片浮出名字「吳亞」，備註欄寫著「烏鴉」。',
                '專欄作家，字比睡眠多──他把城市拆成版本寫出來，現在輪到別人替他寫版本了。'
              ],
            },
          },
        ],
      },
      {
        id: 'examine_car_unknown_chat',
        name: '通訊紀錄 Unknown',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_car_unknown_chat' }],
        effects: [
          { type: 'addItem', itemId: 'item_encrypted_messages' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：加密訊息紀錄\n\n聊天視窗裡多數訊息被標成亂碼或「無法還原」，只剩幾行殘句。',
              type: 'item',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（工程師）',
              characterExpression: 1,
              characterPosition: 'left',
              textSegments: [
                '留下來的只有兩行：「……用三起事故來揭……」「……她也在場，你確定要這樣寫？」',
                '真正的話在刪掉的地方。',
                '「三起事故」「她也在場」──這不是聊天，是有人在幫他設計一個讀不完的鉤子。'
              ],
            },
          },
        ],
        oneTime: true,
      },
      {
        id: 'replay_car_unknown_chat',
        name: '通訊紀錄 Unknown（重播）',
        description: '',
        requirements: [{ type: 'hasItem', itemId: 'item_encrypted_messages' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（工程師）',
              characterExpression: 1,
              characterPosition: 'left',
              textSegments: [
                '留下來的只有兩行：「……用三起事故來揭……」「……她也在場，你確定要這樣寫？」',
                '真正的話在刪掉的地方。',
                '「三起事故」「她也在場」──這不是聊天，是有人在幫他設計一個讀不完的鉤子。'
              ],
            },
          },
        ],
      },
      {
        id: 'examine_car_an_chat',
        name: '通訊紀錄 An',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_car_an_chat' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '對話窗顯示「An」，頭像是一杯拿鐵拉花，可讀內容零碎：\n\n「……如果你真的曝光，那個人會先弄死你……」\n「……上次樓梯間的事，你也在——」\n\n訊息停在兩個字：「算了。」',
              type: 'narrator',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（工程師）',
              characterExpression: 1,
              characterPosition: 'left',
              textSegments: [
                '這個 An 大概是他慌的時候會找的人。',
                '「算了」對她來說是結案，對我們來說只是噪音。'
              ],
            },
          },
        ],
        oneTime: true,
      },
      {
        id: 'examine_car_notepad',
        name: '記事本筆記_未發表',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_car_notepad' }],
        effects: [
          { type: 'addItem', itemId: 'item_column_draft' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：專欄草稿片段',
              type: 'item',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（工程師）',
              characterExpression: 1,
              characterPosition: 'left',
              textSegments: [
                '標題寫著：「節能設備，誰省了電，誰省了責任？」',
                '內文把遠端照明、散場節奏、疏散流程列成一串「可能」，像在整理別人的簡報。',
                '省電省錢，簡報都會說。',
                '他寫的是另外一件事──有人拿設備當遮羞布，省掉的不是電，是責任。'
              ],
            },
          },
        ],
        oneTime: true,
      },
      {
        id: 'replay_car_notepad',
        name: '記事本筆記_未發表（重播）',
        description: '',
        requirements: [{ type: 'hasItem', itemId: 'item_column_draft' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（工程師）',
              characterExpression: 1,
              characterPosition: 'left',
              textSegments: [
                '標題寫著：「節能設備，誰省了電，誰省了責任？」',
                '內文把遠端照明、散場節奏、疏散流程列成一串「可能」，像在整理別人的簡報。',
                '省電省錢，簡報都會說。',
                '他寫的是另外一件事──有人拿設備當遮羞布，省掉的不是電，是責任。'
              ],
            },
          },
        ],
      },
      {
        id: 'examine_car_recording',
        name: '錄音備忘_事故',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_car_recording' }],
        effects: [
          { type: 'addItem', itemId: 'item_unfinished_recording' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：未完成錄音',
              type: 'item',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（工程師）',
              characterExpression: 1,
              characterPosition: 'left',
              textSegments: [
                '播放鍵按下去，車內多了一個被刻意壓低處理過的男聲，像戴著面具說話：',
                '「……他們一直說那是個案。可是結案報告有兩個版本，一個給內部、一個給外面……」',
                '他知道這句話會惹麻煩，才把聲音壓到這麼低。',
                '結案報告有「兩個版本」，代表發生了什麼跟要讓人看到什麼，早就被拆開。'
              ],
            },
          },
        ],
        oneTime: true,
      },
      {
        id: 'replay_car_recording',
        name: '錄音備忘_事故（重播）',
        description: '',
        requirements: [{ type: 'hasItem', itemId: 'item_unfinished_recording' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（工程師）',
              characterExpression: 1,
              characterPosition: 'left',
              textSegments: [
                '播放鍵按下去，車內多了一個被刻意壓低處理過的男聲，像戴著面具說話：',
                '「……他們一直說那是個案。可是結案報告有兩個版本，一個給內部、一個給外面……」',
                '他知道這句話會惹麻煩，才把聲音壓到這麼低。',
                '結案報告有「兩個版本」，代表發生了什麼跟要讓人看到什麼，早就被拆開。'
              ],
            },
          },
        ],
      },
      {
        id: 'examine_car_contacts',
        name: '聯絡人列表',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_car_contacts' }],
        effects: [
          { type: 'addItem', itemId: 'item_coded_contacts' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：代號聯絡人',
              type: 'item',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（工程師）',
              characterExpression: 1,
              characterPosition: 'left',
              textSegments: [
                '通訊錄裡有幾個特別的聯絡人：',
                '「城市影城W」——備註：「影廳見」；「聯合影城C」——備註：「表單／審查」；「光芒影城R」——備註：「梯間／試行」。',
                '他不是在存朋友，是在幫對方做節點索引。',
                '影廳、表單、梯間──三個節點，也剛好可以湊成三起事故。'
              ],
            },
          },
        ],
        oneTime: true,
      },
      {
        id: 'replay_car_contacts',
        name: '聯絡人列表（重播）',
        description: '',
        requirements: [{ type: 'hasItem', itemId: 'item_coded_contacts' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（工程師）',
              characterExpression: 1,
              characterPosition: 'left',
              textSegments: [
                '通訊錄裡有幾個特別的聯絡人：',
                '「城市影城W」——備註：「影廳見」；「聯合影城C」——備註：「表單／審查」；「光芒影城R」——備註：「梯間／試行」。',
                '他不是在存朋友，是在幫對方做節點索引。',
                '影廳、表單、梯間──三個節點，也剛好可以湊成三起事故。'
              ],
            },
          },
        ],
      },
      {
        id: 'examine_car_location',
        name: '系統定位紀錄',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_car_location' }],
        effects: [
          { type: 'addItem', itemId: 'item_location_record' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：行蹤紀錄',
              type: 'item',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（工程師）',
              characterExpression: 1,
              characterPosition: 'left',
              textSegments: [
                '定位紀錄像一張被螢光筆畫滿的地圖。',
                '命案前一週，他在住家、三家影城、一棟設備公司商辦和一棟老式商務大樓之間來回，那棟老樓 GPS 一直跳點，像系統也不太想記住那裡。',
                '命案當晚，他比電影開場早到近一個半小時，在城市影城附近繞圈，軌跡像一個被畫壞的橢圓。',
                '這不是散步，是壓力測試。',
                '你以為那是焦慮，其實比較像在確認排程會不會準時爆。'
              ],
            },
          },
        ],
        oneTime: true,
      },
      {
        id: 'replay_car_location',
        name: '系統定位紀錄（重播）',
        description: '',
        requirements: [{ type: 'hasItem', itemId: 'item_location_record' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（工程師）',
              characterExpression: 1,
              characterPosition: 'left',
              textSegments: [
                '定位紀錄像一張被螢光筆畫滿的地圖。',
                '命案前一週，他在住家、三家影城、一棟設備公司商辦和一棟老式商務大樓之間來回，那棟老樓 GPS 一直跳點，像系統也不太想記住那裡。',
                '命案當晚，他比電影開場早到近一個半小時，在城市影城附近繞圈，軌跡像一個被畫壞的橢圓。',
                '這不是散步，是壓力測試──你以為那是焦慮，其實比較像在確認排程會不會準時爆。'
              ],
            },
          },
        ],
      },
      {
        id: 'examine_car_toolbox',
        name: '後座工具箱',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_car_toolbox' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '後座的工具箱上貼著一行字：「線路是誠實的」，旁邊有一個被刮花掃不出來的 QR code。',
              type: 'narrator',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（工程師）',
              characterExpression: 1,
              characterPosition: 'left',
              textSegments: [
                '這句不是我寫的，是以前一個同事送我的。',
                '他後來轉去做行銷了，從此之後就不再相信線路。',
                '你可以想像有人把「系統 log」當成廣告素材在寫，大概就會長成你手上這些簡報。'
              ],
            },
          },
        ],
        oneTime: true,
      },
      {
        id: 'examine_car_coffee',
        name: '便利商店咖啡杯',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_car_coffee' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '前座杯架裡兩杯便利商店咖啡喝到一半，紙杯有點軟了，杯身用油性筆寫著「A」和「K」。',
              type: 'narrator',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（工程師）',
              characterExpression: 1,
              characterPosition: 'left',
              textSegments: [
                'A 是案主，K 是你，不是嫌犯。',
                '我一整天在處理有人把 A 寫成 K 的世界，就怕自己也搞混。',
                '很多人做決定的時候，是看這種隨手寫的標記，不是看正式文件。'
              ],
            },
          },
        ],
        oneTime: true,
      },
      {
        id: 'examine_car_charm',
        name: '車上吊飾',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_car_charm' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '後視鏡上的像素風電路板吊飾在車裡晃來晃去，笑臉一直換角度。',
              type: 'narrator',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（工程師）',
              characterExpression: 1,
              characterPosition: 'left',
              textSegments: [
                '這個本來是朋友做的 NFT，失敗得很徹底，我就把它拆回來當吊飾。',
                '你看，電路板晃來晃去，很像城市的配電圖。',
                '一開始大家都說要做去中心化，最後還是回到同一群人手上。'
              ],
            },
          },
        ],
        oneTime: true,
      },
    ],
    puzzles: [],
    initialDialog: {
      text: '阿蘇把筆電翻開，線在她指尖繞一圈，插進警方提供的解密終端。\n\n阿蘇：「坐好。」\n她視線沒離開螢幕。\n\n阿蘇：「手機解完密，只是開始。接下來要解讀這個人。」\n阿蘇：「我先說清楚，我不替警方背書。我只替資料負責。」\n她停半秒，又補一句，像在防禦。\n阿蘇：「資料有時候也不值得信任。」',
      type: 'narrator',
    },
    npcs: [
      {
        id: 'npc_asu',
        name: '阿蘇（工程師）',
        portrait: '/svg/characters/asu.svg',
        randomDialogs: [
          { id: 'asu_casual_1', text: '「你看這些訊息，像威脅，又有一點像兩個人在互相拗稿。」', type: 'casual', weight: 3 },
          { id: 'asu_casual_2', text: '「工程系的人最怕兩種人，一種是什麼都不懂，一種是懂太多還故意裝不知道。」', type: 'casual', weight: 2 },
          { id: 'asu_casual_3', text: '「他把影城寫進專欄，結果人被留在影城裡。這種對稱，很難說是巧合。」', type: 'casual', weight: 2 },
          { id: 'asu_casual_4', text: '「節能設備本來是好東西啊，省電、省錢，所有簡報都這樣寫。可是一旦有人發現它可以順便省掉責任，就會開始長得怪怪的。」', type: 'casual', weight: 2 },
          { id: 'asu_casual_5', text: '「系統通常比人老實，可是設計系統的人不一定。這點我很有資格抱怨。」', type: 'casual', weight: 2 },
          { id: 'asu_casual_6', text: '「他給聯絡人取名字的方式很工程師，全部用代碼。其實這種人死掉，調查起來很煩，卻也比較有路徑可以追。」', type: 'casual', weight: 2 },
          { id: 'asu_casual_7', text: '「『三起事故』這個說法，很熟。寫技術文件的人才會把東西分成一、二、三這樣。」', type: 'casual', weight: 2 },
          { id: 'asu_casual_8', text: '「如果你把這些聊天紀錄當成八卦，它們就只會變成八卦；你把它們當線路，它們才會開始帶電。」', type: 'casual', weight: 2 },
          { id: 'asu_casual_9', text: '「有時候我覺得他很像一個沒受過訓練的工程師，把城市當機房亂摸。」', type: 'casual', weight: 2 },
          { id: 'asu_casual_10', text: '「喔對，我有回過他的信，只是回得很不耐煩。沒想到…」\n她話說到一半停住，手指在方向盤上敲了兩下。', type: 'casual', weight: 2 },
        ],
        available: true,
      },
    ],
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

// NPC 對話樹：第一章與第二章的「敏感問題」對話，配合 SensitiveGateOverlay 與 GameEngine.npcDialogs 使用
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
        { id: 'choice_seal', label: '「我現在就封袋。」', effects: [{ type: 'addItem', itemId: 'item_black_plastic_fragment' }, { type: 'setFlag', flag: 'black_fragment_found', value: true }] },
        { id: 'choice_secret', label: '「先別讓任何人知道你有看見它。」', effects: [{ type: 'addItem', itemId: 'item_black_plastic_fragment' }, { type: 'setFlag', flag: 'black_fragment_found', value: true }] },
        { id: 'choice_report', label: '「我會回報，讓它進正式流程。」', effects: [{ type: 'addItem', itemId: 'item_black_plastic_fragment' }, { type: 'setFlag', flag: 'black_fragment_found', value: true }] },
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
  // 第二章 阿蘇（工程師）— 敏感一：為什麼來／受害者資料怎麼看；敏感二：三起事故誰在放風聲（二選一）
  npc_asu: {
    'node_asu_sensitive1_1': {
      id: 'node_asu_sensitive1_1',
      npcId: 'npc_asu',
      text: 'KK：「妳可以把資料丟回警方，洗個澡睡覺。為什麼要坐在這裡陪我熬夜？」\n\n阿蘇盯著螢幕，笑了一下，但那不是愉快的笑。\n阿蘇：「因為他死在流程裡。」',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_asu_sensitive1_2',
    },
    'node_asu_sensitive1_2': {
      id: 'node_asu_sensitive1_2',
      npcId: 'npc_asu',
      text: 'KK：「很多人死在流程裡。」\n\n阿蘇把筆電合起來又打開，像需要一個動作冷靜一下。\n阿蘇：「兩年前那起樓梯間事故，我是技術顧問之一。」',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_asu_sensitive1_3',
    },
    'node_asu_sensitive1_3': {
      id: 'node_asu_sensitive1_3',
      npcId: 'npc_asu',
      text: 'KK：「妳覺得自己有責任？」\n\n阿蘇：「我覺得那份報告有兩個版本。」\n她說這句時，聲音壓得比剛剛低，指節在觸控板上停住。',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_asu_sensitive1_4',
    },
    'node_asu_sensitive1_4': {
      id: 'node_asu_sensitive1_4',
      npcId: 'npc_asu',
      text: 'KK：「妳認識他？」\n\n阿蘇：「看過名字，收過一封很長很長的信，全是抱怨和猜測。」\n她勾了一下嘴角：「他問過我一些系統問題，我回了兩句，叫他不要拿事故當寫作素材。」',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_asu_sensitive1_5',
    },
    'node_asu_sensitive1_5': {
      id: 'node_asu_sensitive1_5',
      npcId: 'npc_asu',
      text: 'KK：「他沒聽？」\n\n阿蘇：「他有停手一陣子。只是寫得慢一點，不代表放棄。」\n她把那封信的寄件人頁面打開又關掉，「我那時候只覺得他煩，沒有想到會變命案。」',
      choices: [
        {
          id: 'choice_asu_s1_done',
          label: '（結束對話）',
          description: '此分支不再出現 KK 內心旁白，只留給玩家自己拼。',
          effects: [{ type: 'setFlag', flag: 'npc_asu_sensitive_done', value: true }],
        },
      ],
    },
    'node_asu_sensitive2_1': {
      id: 'node_asu_sensitive2_1',
      npcId: 'npc_asu',
      text: 'KK：「這句：『用三起事故來揭……』妳覺得是誰寫的？」\n\n阿蘇：「看格式，很像他。可是那個『你為什麼不把資訊完……』比較像對話另一頭的人。」',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_asu_sensitive2_2',
    },
    'node_asu_sensitive2_2': {
      id: 'node_asu_sensitive2_2',
      npcId: 'npc_asu',
      text: 'KK：「兩邊都像？」\n\n阿蘇聳了一下肩：「一邊很想把真話全部講出來，一邊很清楚什麼可以講、什麼不行。這兩種人聊天，句子就會長這樣。」',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_asu_sensitive2_3',
    },
    'node_asu_sensitive2_3': {
      id: 'node_asu_sensitive2_3',
      npcId: 'npc_asu',
      text: 'KK：「如果這不是單純威脅，而是某種計畫，妳覺得它在講『三件接下來要發生的事』，還是在唸一份目錄？」\n\n阿蘇沉默幾秒，視線從螢幕上移開，盯著前擋風玻璃上那一圈沒擦乾淨的雨痕。\n\n阿蘇：「平常寫技術文件的時候，我們說『三起』，多半是在分類，不是在許願。」',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_asu_sensitive2_4',
    },
    'node_asu_sensitive2_4': {
      id: 'node_asu_sensitive2_4',
      npcId: 'npc_asu',
      text: 'KK：「分類什麼？」\n\n阿蘇：「同一種 bug、同一種偷懶、同一批人的習慣。如果是他寫的，他很可能是在幫對方整理他們犯過幾次一樣的錯。」\n\n她伸手把音量調小：「不過也有可能是對面故意這樣寫給他看，讓他以為自己踩到的是大案。」',
      choices: [
        {
          id: 'choice_asu_s2_done',
          label: '（結束對話）',
          description: '',
          effects: [{ type: 'setFlag', flag: 'npc_asu_sensitive_done', value: true }],
        },
      ],
    },
  },
};
