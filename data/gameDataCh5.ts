import { Scene, Item, NpcDialogNode } from '@/types/game';

// ch5 道具
const items: Record<string, Item> = {
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

// ch5 場景
const scenes: Record<string, Scene> = {
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

const npcDialogs: Record<string, Record<string, NpcDialogNode>> = {};

export { scenes, items, npcDialogs };
