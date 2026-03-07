import { Scene, Item, NpcDialogNode } from '@/types/game';

// ch3 道具
const items: Record<string, Item> = {
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
};

// ch3 場景
const scenes: Record<string, Scene> = {
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
};

const npcDialogs: Record<string, Record<string, NpcDialogNode>> = {};

export { scenes, items, npcDialogs };
