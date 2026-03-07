import { Scene, Item, NpcDialogNode } from '@/types/game';

// ch4 道具
const items: Record<string, Item> = {
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
};

// ch4 場景
const scenes: Record<string, Scene> = {
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
};

const npcDialogs: Record<string, Record<string, NpcDialogNode>> = {};

export { scenes, items, npcDialogs };
