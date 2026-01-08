import { Chapter, Scene, Item, Hotspot, Event, Puzzle, Dialog } from '@/types/game';

// 道具定義 - ROOM 1: 舊公寓
export const items: Record<string, Item> = {
  // SPACE 1-1: 客廳・第一眼
  'faded_photo': {
    id: 'faded_photo',
    name: '褪色照片',
    description: '照片上的人臉模糊，但你能感覺到他們曾經在這裡。\n\n翻轉照片，背面寫著：「杯先冷、火後歇、水不停、眼不眨。」',
    collectible: true,
  },
  'cold_tea': {
    id: 'cold_tea',
    name: '半杯冷茶',
    description: '茶已經冷了，但杯子還放在桌上，像有人剛離開。',
    collectible: false,
  },
  'silent_tv': {
    id: 'silent_tv',
    name: '未關的電視',
    description: '螢幕亮著，但沒有聲音。靜音狀態下的畫面在跳動。',
    collectible: false,
  },
  
  // SPACE 1-2: 廚房・責任的開始
  'rusty_wrench': {
    id: 'rusty_wrench',
    name: '生鏽的扳手',
    description: '扳手生鏽了，但還能用。你需要它來關閉瓦斯爐。',
    collectible: true,
  },
  'expired_milk': {
    id: 'expired_milk',
    name: '過期牛奶盒',
    description: '牛奶已經過期了。背面似乎有字條。',
    collectible: true,
  },
  
  // SPACE 1-3: 臥室・被默認
  'stopped_watch': {
    id: 'stopped_watch',
    name: '停止的手錶',
    description: '手錶的指針停在特定時間。時間在這裡似乎失去了意義。',
    collectible: true,
  },
  'fitted_clothes': {
    id: 'fitted_clothes',
    name: '尺寸合適的衣服',
    description: '衣櫃裡的衣服，尺寸剛好適合你。這裡假設你會留下。',
    collectible: false,
  },
  'bedside_key': {
    id: 'bedside_key',
    name: '床頭櫃的鑰匙',
    description: '一把小鑰匙，放在床頭櫃上。',
    collectible: true,
  },
  'water_stop_tape': {
    id: 'water_stop_tape',
    name: '止水膠帶',
    description: '用來修補漏水的膠帶。',
    collectible: true,
  },
  
  // ROOM 2: 財神廟
  'incense': {
    id: 'incense',
    name: '香',
    description: '廟裡的香，燃燒時散發著特殊的氣味。',
    collectible: true,
  },
  'gold_paper': {
    id: 'gold_paper',
    name: '金紙',
    description: '用來燒給神明的金紙。',
    collectible: true,
  },
  'temple_advice': {
    id: 'temple_advice',
    name: '廟公的建議',
    description: '廟公給你的建議，寫在一張紙上。\n\n「先讓火認得你，再讓紙認得火，最後才輪到香。」',
    collectible: true,
  },
  'red_banner': {
    id: 'red_banner',
    name: '還願的紅布條',
    description: '其他香客留下的還願布條，上面寫著「靈驗」的字樣。\n\n仔細看，「財」字有3筆劃，布條上有1個畫押。',
    collectible: true,
  },
  'witness_note': {
    id: 'witness_note',
    name: '香客的見證',
    description: '其他香客留下的見證，描述他們如何「解決」了問題。\n\n見證看似不同，但都有同一個重複詞：「欠」、「補」、「換」、「還」。',
    collectible: true,
  },
  'temple_charm': {
    id: 'temple_charm',
    name: '護身符',
    description: '從廟裡得到的護身符，代表非正式的方法。',
    collectible: true,
  },
  'ash_code': {
    id: 'ash_code',
    name: '灰燼碼',
    description: '從灰燼中解讀出的符號，對應一個字母或數字。',
    collectible: true,
  },
  
  // ROOM 3: 核能電廠
  'safety_manual': {
    id: 'safety_manual',
    name: '安全手冊',
    description: '電廠的安全操作手冊，每一頁都強調程序的重要性。',
    collectible: true,
  },
  'tool_checklist': {
    id: 'tool_checklist',
    name: '工具檢查表',
    description: '工具檢查的程序表，必須按照順序執行。',
    collectible: true,
  },
  'test_paper': {
    id: 'test_paper',
    name: '測驗卷',
    description: '安全測驗的試卷，有明確的對錯答案。',
    collectible: false,
  },
  'tool_set': {
    id: 'tool_set',
    name: '工具組',
    description: '標準的工具組，必須按照程序檢查。',
    collectible: false,
  },
  'operation_manual': {
    id: 'operation_manual',
    name: '操作手冊',
    description: '正式的操作手冊，每個步驟都有記錄。',
    collectible: true,
  },
  'record_log': {
    id: 'record_log',
    name: '記錄表',
    description: '每個操作都會被記錄在這張表上。',
    collectible: false,
  },
  'safety_cert': {
    id: 'safety_cert',
    name: '安全認證',
    description: '完成訓練後獲得的認證，證明你已經學會了程序。',
    collectible: true,
  },
  'procedure_stamp': {
    id: 'procedure_stamp',
    name: '程序章',
    description: '用來蓋在記錄表上的程序章，證明你完成了檢查。',
    collectible: true,
  },
  'roll_call_code': {
    id: 'roll_call_code',
    name: '點名代碼',
    description: '點名確認後得到的代碼，例如：C-17。',
    collectible: true,
  },
  
  // ROOM 4: 電廠・災後
  'faulty_equipment': {
    id: 'faulty_equipment',
    name: '故障的設備',
    description: '地震後部分設備故障，但程序手冊還在。',
    collectible: false,
  },
  'scattered_files': {
    id: 'scattered_files',
    name: '散落的文件',
    description: '地震時散落的程序文件，需要重新整理。',
    collectible: true,
  },
  'emergency_manual': {
    id: 'emergency_manual',
    name: '緊急程序手冊',
    description: '緊急情況下的程序手冊，但時間已經不夠了。',
    collectible: true,
  },
  'foreign_object_detector': {
    id: 'foreign_object_detector',
    name: '異物檢測器',
    description: 'FME（異物防止）事件的檢測設備。',
    collectible: false,
  },
  'quick_fix_tool': {
    id: 'quick_fix_tool',
    name: '快速處理工具',
    description: '可以快速處理問題的工具，但不在正式程序裡。',
    collectible: true,
  },
  'consequence_report': {
    id: 'consequence_report',
    name: '後果評估表',
    description: '如果照程序處理，會發生什麼後果的評估表。',
    collectible: true,
  },
  'fme_gap_note': {
    id: 'fme_gap_note',
    name: 'FME程序缺口記錄',
    description: '從散落文件中發現的程序缺口記錄，例如：FME-STEP-2 缺失。',
    collectible: true,
  },
  'self_persuasion_text': {
    id: 'self_persuasion_text',
    name: '自我說服文字',
    description: '你選擇的自我辯解文字，會成為身份文件的一部分。',
    collectible: true,
  },
  
  // ROOM 5: 反應爐核心
  'formal_manual': {
    id: 'formal_manual',
    name: '正式操作手冊',
    description: '最嚴密、最安全、但也最慢的操作程序。',
    collectible: true,
  },
  // temple_charm 已在 ROOM 2 定義
  'operation_panel': {
    id: 'operation_panel',
    name: '操作面板',
    description: '反應爐核心的操作面板，你可以選擇相信哪一套系統。',
    collectible: false,
  },
  'consequence_record': {
    id: 'consequence_record',
    name: '後果記錄',
    description: '你的選擇所帶來的後果記錄。',
    collectible: true,
  },
  'identity_file': {
    id: 'identity_file',
    name: '身份文件',
    description: '最終的身份文件，記錄著你成為誰。',
    collectible: true,
  },
};

// 場景資料
export const scenes: Record<string, Scene> = {
  // ========== ROOM 1: 舊公寓・清晨後 ==========
  // SPACE 1-1: 客廳・第一眼
  'ch1_sc1': {
    id: 'ch1_sc1',
    chapterId: 'ch1',
    name: '客廳・第一眼',
    description: '你走進一個老舊的公寓。爆炸事故多年後，生活仍在延續，但所有痕跡都在提醒：這裡曾經失去過什麼。',
    background: '/images/bg_ch1_sc1_v1.png',
    hotspots: [
      {
        id: 'photo_wall',
        shape: 'rect',
        coords: [0.1, 0.1, 0.4, 0.4],
        description: '照片牆',
        hint: '牆上掛著模糊的家庭照，人臉已經看不清了。',
      },
      {
        id: 'stove',
        shape: 'rect',
        coords: [0.5, 0.5, 0.7, 0.7],
        description: '瓦斯爐',
        hint: '瓦斯爐上還有一個鍋子，摸起來還溫熱。',
      },
      {
        id: 'next_room_sound',
        shape: 'rect',
        coords: [0.7, 0.3, 0.9, 0.5],
        description: '隔壁房間',
        hint: '你聽到隔壁房間傳來聲響，但當你仔細聽時，聲音又消失了。',
      },
      {
        id: 'cold_tea_spot',
        shape: 'rect',
        coords: [0.3, 0.6, 0.5, 0.8],
        description: '桌上的冷茶',
        hint: '半杯冷茶放在桌上，像有人剛離開。',
      },
      {
        id: 'tv',
        shape: 'rect',
        coords: [0.6, 0.1, 0.9, 0.3],
        description: '電視',
        hint: '電視開著，但沒有聲音。',
      },
    ],
    items: [
      items.faded_photo,
      items.cold_tea,
      items.silent_tv,
    ],
    hotspotEventMap: {
      'photo_wall': 'examine_photos',
      'stove': 'check_stove',
      'next_room_sound': 'hear_sound',
      'cold_tea_spot': 'notice_cold_tea',
      'tv': 'check_tv',
    },
    events: [
      {
        id: 'examine_photos',
        name: '查看照片',
        description: '你仔細查看牆上的照片。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'photo_wall' },
        ],
        effects: [
          { type: 'addItem', itemId: 'faded_photo' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：褪色照片\n\n照片上的人臉模糊，但你能感覺到他們曾經在這裡。\n\n這裡有人住，但現在不在。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'photos_examined', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'check_stove',
        name: '檢查瓦斯爐',
        description: '你發現瓦斯爐上的鍋子還溫熱。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'stove' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '瓦斯爐上的鍋子還溫熱，像有人剛離開不久。\n\n但這裡沒有人。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'stove_checked', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'hear_sound',
        name: '聽到聲響',
        description: '你聽到隔壁房間的聲響。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'next_room_sound' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '你聽到隔壁房間傳來聲響，但當你仔細聽時，聲音又消失了。\n\n這裡有人住，但現在不在。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'sound_heard', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'notice_cold_tea',
        name: '注意到冷茶',
        description: '你注意到桌上的冷茶。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'cold_tea_spot' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '半杯冷茶放在桌上，像有人剛離開。\n\n這裡有人住，但現在不在。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'tea_noticed', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'check_tv',
        name: '查看電視',
        description: '你查看電視。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'tv' },
          {
            type: 'custom',
            customCheck: (state) => !state.flags.tv_puzzle_triggered,
          },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '電視開著，但沒有聲音。靜音狀態下的畫面在跳動。\n\n畫面間歇跳出符號：杯子、火焰、水滴、眼睛。\n\n每次符號出現時，角落會閃一下「1~5」的小刻度。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'tv_checked', value: true },
          { type: 'setFlag', flag: 'tv_puzzle_triggered', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'tv_puzzle_ready',
        name: '電視謎題準備',
        description: '看過電視符號後，可以解謎。',
        requirements: [
          { type: 'hasFlag', flag: 'tv_checked', value: true },
          { type: 'hasItem', itemId: 'faded_photo' },
          { type: 'hasInteracted', hotspotId: 'tv' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '電視為什麼知道你看過什麼？它不像提示，更像監考。',
              type: 'narrator',
            },
          },
        ],
        oneTime: false,
      },
      {
        id: 'unlock_kitchen',
        name: '解鎖廚房',
        description: '看過所有痕跡後，廚房門打開了。',
        requirements: [
          { type: 'hasFlag', flag: 'photos_examined', value: true },
          { type: 'hasFlag', flag: 'stove_checked', value: true },
          { type: 'hasFlag', flag: 'sound_heard', value: true },
          { type: 'hasFlag', flag: 'tea_noticed', value: true },
          { type: 'hasFlag', flag: 'tv_checked', value: true },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '你理解了：這裡有人住，但現在不在。\n\n廚房的方向傳來水聲，你開始覺得這裡需要你。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'kitchen_unlocked', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'open_kitchen_drawer',
        name: '打開廚房抽屜',
        description: '解開電視謎題後，廚房抽屜的暗格打開了。',
        requirements: [
          { type: 'hasFlag', flag: 'tv_puzzle_solved', value: true },
        ],
        effects: [
          { type: 'addItem', itemId: 'water_stop_tape' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：止水膠帶\n\n廚房抽屜的暗格打開了，裡面有一卷止水膠帶。\n\n這不是扳手，但可能是修復瓦斯爐需要的東西。',
              type: 'item',
            },
          },
          { type: 'setFlag', flag: 'drawer_opened', value: true },
        ],
        oneTime: true,
      },
    ],
    puzzles: [
      {
        id: 'tv_silent_puzzle',
        type: 'input',
        solution: '2413', // 示例答案：杯子(2)、火焰(4)、水滴(1)、眼睛(3)
        hint: '觀察電視符號對應的痕跡，記下四個刻度數字。\n\n符號順序：杯子（冷茶）→ 火焰（瓦斯爐）→ 水滴（漏水）→ 眼睛（隔壁聲響）\n\n照片背面寫著：「杯先冷、火後歇、水不停、眼不眨。」',
        requirements: [
          { type: 'hasItem', itemId: 'faded_photo' },
          { type: 'hasFlag', flag: 'tv_checked', value: true },
          { type: 'hasFlag', flag: 'photos_examined', value: true },
          { type: 'hasFlag', flag: 'stove_checked', value: true },
          { type: 'hasFlag', flag: 'sound_heard', value: true },
          { type: 'hasFlag', flag: 'tea_noticed', value: true },
        ],
        onSolve: [
          {
            type: 'showDialog',
            dialog: {
              text: '你理解了符號的對應關係。\n\n杯先冷、火後歇、水不停、眼不眨。\n\n你記下了四個刻度：2、4、1、3。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'tv_puzzle_solved', value: true },
          { type: 'triggerEvent', eventId: 'open_kitchen_drawer' },
        ],
      },
    ],
    initialDialog: {
      text: '你走進一個老舊的公寓。\n\n爆炸事故多年後，生活仍在延續，但所有痕跡都在提醒：這裡曾經失去過什麼。\n\n你站在客廳中央，感覺到這個空間在等待著什麼。',
      type: 'narrator',
    },
  },
  
  // SPACE 1-2: 廚房・責任的開始
  'ch1_sc2': {
    id: 'ch1_sc2',
    chapterId: 'ch1',
    name: '廚房・責任的開始',
    description: '廚房裡，瓦斯爐需要關閉，冰箱有過期食物，水龍頭在漏水。你開始覺得這裡需要你。',
    background: '/images/bg_ch1_sc2_v1.png',
    hotspots: [
      {
        id: 'gas_stove',
        shape: 'rect',
        coords: [0.4, 0.3, 0.6, 0.5],
        description: '瓦斯爐',
        hint: '瓦斯爐需要關閉，但關不掉，需要工具。',
      },
      {
        id: 'fridge',
        shape: 'rect',
        coords: [0.1, 0.2, 0.3, 0.6],
        description: '冰箱',
        hint: '冰箱裡有過期食物。',
      },
      {
        id: 'leaky_faucet',
        shape: 'rect',
        coords: [0.5, 0.6, 0.7, 0.8],
        description: '水龍頭',
        hint: '水龍頭在漏水，滴答滴答的聲音在空蕩的廚房裡迴響。',
      },
      {
        id: 'wrench_spot',
        shape: 'rect',
        coords: [0.7, 0.4, 0.9, 0.6],
        description: '工具箱',
        hint: '工具箱裡有一把生鏽的扳手。',
      },
      {
        id: 'milk_spot',
        shape: 'rect',
        coords: [0.2, 0.4, 0.4, 0.6],
        description: '過期牛奶',
        hint: '冰箱裡的過期牛奶盒，背面似乎有字條。',
      },
    ],
    items: [
      items.rusty_wrench,
      items.expired_milk,
    ],
    hotspotEventMap: {
      'gas_stove': 'try_close_stove',
      'fridge': 'check_fridge',
      'leaky_faucet': 'notice_leak',
      'wrench_spot': 'get_wrench',
      'milk_spot': 'get_milk',
    },
    events: [
      {
        id: 'try_close_stove',
        name: '嘗試關閉瓦斯爐',
        description: '你嘗試關閉瓦斯爐，但關不掉。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'gas_stove' },
          {
            type: 'custom',
            customCheck: (state) => !state.inventory.includes('rusty_wrench'),
          },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '你嘗試關閉瓦斯爐，但開關卡住了，關不掉。\n\n你需要工具才能修復它。',
              type: 'narrator',
            },
          },
        ],
        oneTime: false,
      },
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
    ],
    puzzles: [
      {
        id: 'stove_stuck_puzzle',
        type: 'visual_selection',
        solution: ['apply_tape', 'rotate_counterclockwise'],
        hint: '扳手不是用來修理，是用來承認責任。\n\n你越用力，越像想把某件事抹掉。\n\n先補上破口，再轉動扳手。冷茶的杯柄方向暗示逆時針。',
        requirements: [
          { type: 'hasItem', itemId: 'rusty_wrench' },
          { type: 'hasItem', itemId: 'water_stop_tape' },
          { type: 'hasInteracted', hotspotId: 'gas_stove' },
        ],
        options: [
          { id: 'apply_tape', label: '在爐頭旁貼上止水膠帶', description: '補上破口' },
          { id: 'rotate_clockwise', label: '順時針轉動扳手', description: '順時針方向' },
          { id: 'rotate_counterclockwise', label: '逆時針轉動扳手', description: '逆時針方向（杯柄暗示）' },
        ],
        onSolve: [
          {
            type: 'showDialog',
            dialog: {
              text: '你先把止水膠帶貼在爐頭旁，補上破口。\n\n然後轉動扳手——逆時針。\n\n「卡——」一聲，瓦斯爐關閉了。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'stove_closed', value: true },
          { type: 'setFlag', flag: 'stove_puzzle_solved', value: true },
          {
            type: 'showDialog',
            dialog: {
              text: '瓦斯關閉後，廚房水聲會變得清楚，開啟下一題線索（漏水）。',
              type: 'narrator',
            },
          },
        ],
      },
      {
        id: 'leaky_faucet_puzzle',
        type: 'sequence_memory',
        solution: ['long', 'short', 'short', 'long', 'short', 'short'],
        hint: '滴答是倒數，也是節拍。\n\n水龍頭滴答有不自然的節拍：2短1長、2短1長。\n\n用手錶對齊滴答的「長」聲，才能讓手錶多走一段。',
        requirements: [
          { type: 'hasItem', itemId: 'stopped_watch' },
          { type: 'hasFlag', flag: 'stove_closed', value: true },
          { type: 'hasInteracted', hotspotId: 'leaky_faucet' },
        ],
        config: {
          sequenceLength: 6,
          symbols: ['short', 'long'],
        },
        onSolve: [
          {
            type: 'showDialog',
            dialog: {
              text: '你用手錶對齊滴答的「長」聲，手錶短暫走到新時間：04:17。\n\n你以為你在修理水龍頭，其實你在學會留下來。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'faucet_puzzle_solved', value: true },
          {
            type: 'showDialog',
            dialog: {
              text: '水龍頭底下暗格鬆開，出現「小門鑰匙孔」需要床頭櫃鑰匙。',
              type: 'system',
            },
          },
        ],
      },
    ],
    initialDialog: {
      text: '廚房裡，瓦斯爐需要關閉，冰箱有過期食物，水龍頭在漏水。\n\n你從困惑轉為「應該要處理」。\n\n這個空間在等待著你。',
      type: 'narrator',
    },
  },
  
  // SPACE 1-3: 臥室・被默認
  'ch1_sc3': {
    id: 'ch1_sc3',
    chapterId: 'ch1',
    name: '臥室・被默認',
    description: '臥室裡，床上有未整理的被子，手錶停在特定時間，衣櫃裡有「你的尺寸」的衣服。這裡假設你會留下。',
    background: '/images/bg_ch1_sc3_v1.png',
    hotspots: [
      {
        id: 'unmade_bed',
        shape: 'rect',
        coords: [0.3, 0.4, 0.7, 0.8],
        description: '床',
        hint: '床上有未整理的被子，像有人剛離開。',
      },
      {
        id: 'watch_spot',
        shape: 'rect',
        coords: [0.5, 0.3, 0.6, 0.4],
        description: '手錶',
        hint: '手錶在床頭，指針停在特定時間。',
      },
      {
        id: 'wardrobe',
        shape: 'rect',
        coords: [0.1, 0.2, 0.3, 0.6],
        description: '衣櫃',
        hint: '衣櫃裡有衣服，尺寸剛好適合你。',
      },
      {
        id: 'bedside_table',
        shape: 'rect',
        coords: [0.6, 0.3, 0.7, 0.4],
        description: '床頭櫃',
        hint: '床頭櫃上有一把鑰匙。',
      },
      {
        id: 'bedroom_door',
        shape: 'rect',
        coords: [0.7, 0.2, 0.9, 0.6],
        description: '臥室門',
        hint: '臥室門鎖是兩段式的。',
      },
      {
        id: 'trash_bin',
        shape: 'rect',
        coords: [0.8, 0.6, 0.95, 0.8],
        description: '垃圾桶',
        hint: '垃圾桶，可以丟棄物品。',
      },
    ],
    items: [
      items.stopped_watch,
      items.fitted_clothes,
      items.bedside_key,
    ],
    hotspotEventMap: {
      'unmade_bed': 'examine_bed',
      'watch_spot': 'get_watch',
      'wardrobe': 'check_wardrobe',
      'bedside_table': 'get_key',
      'bedroom_door': 'try_open_bedroom_door',
      'trash_bin': 'use_trash_bin',
    },
    events: [
      {
        id: 'examine_bed',
        name: '查看床',
        description: '你查看床上的被子。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'unmade_bed' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '床上有未整理的被子，像有人剛離開。\n\n但這裡沒有人。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'bed_examined', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'get_watch',
        name: '獲得手錶',
        description: '你拿起床頭的手錶。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'watch_spot' },
        ],
        effects: [
          { type: 'addItem', itemId: 'stopped_watch' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：停止的手錶\n\n手錶的指針停在特定時間。時間在這裡似乎失去了意義。',
              type: 'item',
            },
          },
          { type: 'setFlag', flag: 'watch_found', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'check_wardrobe',
        name: '檢查衣櫃',
        description: '你檢查衣櫃，發現尺寸合適的衣服。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'wardrobe' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '衣櫃裡有衣服，尺寸剛好適合你。\n\n衣服口袋裡有一張洗標，寫著：「把該留下的留下；把該丟的丟掉。」\n\n這裡假設你會留下。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'wardrobe_checked', value: true },
          { type: 'setFlag', flag: 'wardrobe_label_read', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'get_key',
        name: '獲得鑰匙',
        description: '你拿起床頭櫃上的鑰匙。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'bedside_table' },
        ],
        effects: [
          { type: 'addItem', itemId: 'bedside_key' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：床頭櫃的鑰匙\n\n一把小鑰匙，放在床頭櫃上。',
              type: 'item',
            },
          },
          { type: 'setFlag', flag: 'key_found', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'try_open_bedroom_door',
        name: '嘗試打開臥室門',
        description: '嘗試打開臥室門。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'bedroom_door' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '臥室門鎖不是普通鑰匙孔：是「兩段式」。\n\n第一段需要床頭櫃的鑰匙。',
              type: 'narrator',
            },
          },
        ],
        oneTime: false,
      },
      {
        id: 'use_trash_bin',
        name: '使用垃圾桶',
        description: '把過期牛奶盒丟進垃圾桶。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'trash_bin' },
          { type: 'hasItem', itemId: 'expired_milk' },
          { type: 'hasFlag', flag: 'wardrobe_label_read', value: true },
        ],
        effects: [
          {
            type: 'removeItem',
            itemId: 'expired_milk',
          },
          {
            type: 'showDialog',
            dialog: {
              text: '你把過期牛奶盒丟進垃圾桶。\n\n「把該留下的留下；把該丟的丟掉。」',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'milk_discarded', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'realize_assumption',
        name: '理解被默認',
        description: '你理解了：這裡假設你會留下。',
        requirements: [
          { type: 'hasFlag', flag: 'bed_examined', value: true },
          { type: 'hasFlag', flag: 'watch_found', value: true },
          { type: 'hasFlag', flag: 'wardrobe_checked', value: true },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '你理解了：這裡假設你會留下。\n\n世界第一次不問你是誰，只假設你會留下。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'room1_completed', value: true },
        ],
        oneTime: true,
      },
    ],
    puzzles: [
      {
        id: 'bedroom_door_lock',
        type: 'combination',
        solution: ['bedside_key', 'milk_discarded'],
        hint: '門不問你是誰，只問你是否符合尺寸。\n\n臥室門鎖是兩段式：\n第一段：用床頭櫃鑰匙開啟內鎖\n第二段：需要身份校驗——把該丟的丟掉。',
        requirements: [
          { type: 'hasItem', itemId: 'bedside_key' },
          { type: 'hasFlag', flag: 'wardrobe_label_read', value: true },
          { type: 'hasInteracted', hotspotId: 'bedroom_door' },
        ],
        onSolve: [
          {
            type: 'showDialog',
            dialog: {
              text: '第一段：你用床頭櫃鑰匙開啟內鎖。\n\n第二段：你已經把過期牛奶盒丟掉了。\n\n門打開了。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'bedroom_door_opened', value: true },
          {
            type: 'showDialog',
            dialog: {
              text: '這不是逃脫。這是「被空間驗收」。',
              type: 'narrator',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '你離開 ROOM 1，拿到通往 ROOM 2 的線索：廟的地址、香灰味。',
              type: 'system',
            },
          },
        ],
      },
    ],
    initialDialog: {
      text: '臥室裡，床上有未整理的被子，手錶停在特定時間，衣櫃裡有「你的尺寸」的衣服。\n\n這裡假設你會留下。',
      type: 'narrator',
    },
  },
  
  // ========== ROOM 2: 財神廟・火還在燒 ==========
  // SPACE 2-1: 廟前・初次接觸
  'ch2_sc1': {
    id: 'ch2_sc1',
    chapterId: 'ch2',
    name: '廟前・初次接觸',
    description: '一座香火鼎盛的廟。沒有醫療、沒有制度，只有經驗、暗示與火。',
    background: '/images/bg_ch2_sc1_v1.png',
    hotspots: [
      {
        id: 'temple_master',
        shape: 'rect',
        coords: [0.4, 0.3, 0.6, 0.6],
        description: '廟公',
        hint: '廟公主動向你搭話。',
      },
      {
        id: 'worshippers',
        shape: 'rect',
        coords: [0.1, 0.4, 0.3, 0.7],
        description: '其他香客',
        hint: '其他香客都在燒東西。',
      },
      {
        id: 'golden_furnace',
        shape: 'rect',
        coords: [0.7, 0.5, 0.9, 0.8],
        description: '金爐',
        hint: '金爐裡的火在燃燒。',
      },
    ],
    items: [
      items.incense,
      items.gold_paper,
      items.temple_advice,
    ],
    hotspotEventMap: {
      'temple_master': 'talk_to_master',
      'worshippers': 'observe_worshippers',
      'golden_furnace': 'see_fire',
    },
    events: [
      {
        id: 'talk_to_master',
        name: '與廟公對話',
        description: '廟公主動向你搭話。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'temple_master' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '廟公看著你，主動搭話：「你最近運氣不好吧？」\n\n他沒有問你的名字，也沒有問你為什麼來。',
              type: 'narrator',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '「規則以外，其實還有辦法。」\n\n廟公遞給你一炷香和一疊金紙，還有一張建議紙。',
              type: 'narrator',
            },
          },
          { type: 'addItem', itemId: 'incense' },
          { type: 'addItem', itemId: 'gold_paper' },
          { type: 'addItem', itemId: 'temple_advice' },
          { type: 'setFlag', flag: 'master_talked', value: true },
          {
            type: 'showDialog',
            dialog: {
              text: '建議紙上寫著：「先讓火認得你，再讓紙認得火，最後才輪到香。」\n\n這不是提示，是操作手冊（但不承認）。',
              type: 'narrator',
            },
          },
        ],
        oneTime: true,
      },
      {
        id: 'observe_worshippers',
        name: '觀察其他香客',
        description: '你觀察其他香客。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'worshippers' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '其他香客都在燒東西，每個人臉上都帶著不確定的表情。\n\n他們在尋找規則以外的答案。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'worshippers_observed', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'see_fire',
        name: '看到金爐的火',
        description: '你看到金爐裡的火。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'golden_furnace' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '金爐裡的火在燃燒，散發著特殊的氣味。\n\n沒有醫療、沒有制度，只有經驗、暗示與火。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'fire_seen', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'unlock_furnace',
        name: '解鎖金爐',
        description: '聽完廟公的話後，你可以操作金爐了。',
        requirements: [
          { type: 'hasFlag', flag: 'master_talked', value: true },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '規則以外，其實還有辦法。\n\n你可以去金爐試試看。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'furnace_unlocked', value: true },
        ],
        oneTime: true,
      },
    ],
    puzzles: [
      {
        id: 'temple_advice_puzzle',
        type: 'arrangement',
        solution: ['approach_fire', 'add_paper', 'add_incense'],
        hint: '「廟公的建議」不是提示，是操作手冊（但不承認）。\n\n「先讓火認得你，再讓紙認得火，最後才輪到香。」\n\n推理出正確順序：\n1. 先靠近金爐不燒（讓火「認得你」）\n2. 再放金紙\n3. 最後點香插入',
        requirements: [
          { type: 'hasItem', itemId: 'temple_advice' },
          { type: 'hasItem', itemId: 'incense' },
          { type: 'hasItem', itemId: 'gold_paper' },
          { type: 'hasFlag', flag: 'furnace_unlocked', value: true },
        ],
        onSolve: [
          {
            type: 'showDialog',
            dialog: {
              text: '你理解了正確的順序。\n\n先讓火認得你，再讓紙認得火，最後才輪到香。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'temple_advice_puzzle_solved', value: true },
          {
            type: 'showDialog',
            dialog: {
              text: '解鎖「可選投入量」的介面。',
              type: 'system',
            },
          },
        ],
      },
    ],
    initialDialog: {
      text: '一座香火鼎盛的廟。\n\n沒有醫療、沒有制度，只有經驗、暗示與火。\n\n你站在廟前，感受到一種不確定的氛圍。',
      type: 'narrator',
    },
  },
  
  // SPACE 2-2: 金爐・第一次嘗試
  'ch2_sc2': {
    id: 'ch2_sc2',
    chapterId: 'ch2',
    name: '金爐・第一次嘗試',
    description: '你站在金爐前，準備第一次嘗試非正式方法。',
    background: '/images/bg_ch2_sc2_v1.png',
    hotspots: [
      {
        id: 'furnace',
        shape: 'rect',
        coords: [0.3, 0.4, 0.7, 0.8],
        description: '金爐',
        hint: '你可以選擇要燒的物品、投入量，並加香。',
      },
    ],
    items: [],
    hotspotEventMap: {
      'furnace': 'operate_furnace',
    },
    events: [
      {
        id: 'operate_furnace',
        name: '操作金爐',
        description: '你操作金爐，第一次嘗試非正式方法。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'furnace' },
          { type: 'hasItem', itemId: 'incense' },
          { type: 'hasItem', itemId: 'gold_paper' },
          {
            type: 'custom',
            customCheck: (state) => !state.flags.furnace_ratio_puzzle_solved,
          },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '你需要選擇正確的投入比例。\n\n你以為在付出，其實在交易。',
              type: 'narrator',
            },
          },
        ],
        oneTime: false,
      },
    ],
    puzzles: [
      {
        id: 'furnace_ratio_puzzle',
        type: 'input',
        solution: '31', // 金紙3、香1
        hint: '你以為在付出，其實在交易。\n\n後殿紅布條上藏著數字（可用字數、畫押數、或「財」字筆劃）。\n\n依線索得到比例：金紙 3、香 1。\n\n投錯比例：火會更旺，但提示「有效不代表正確，只代表你被允許。」',
        requirements: [
          { type: 'hasItem', itemId: 'incense' },
          { type: 'hasItem', itemId: 'gold_paper' },
          { type: 'hasFlag', flag: 'temple_advice_puzzle_solved', value: true },
          { type: 'hasInteracted', hotspotId: 'furnace' },
        ],
        onSolve: [
          {
            type: 'showDialog',
            dialog: {
              text: '你選擇了正確的比例：金紙 3、香 1。\n\n火燃燒起來，你感受到一種不確定的感覺。',
              type: 'narrator',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '系統保證第一次有效。\n\n你感受到「有效」，但不知道為什麼。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'furnace_operated', value: true },
          { type: 'setFlag', flag: 'furnace_ratio_puzzle_solved', value: true },
          {
            type: 'showDialog',
            dialog: {
              text: '第一次確定「有效」的異樣感（讓 SPACE 2-3 的動搖更有力）。',
              type: 'narrator',
            },
          },
        ],
      },
    ],
    initialDialog: {
      text: '你站在金爐前，準備第一次嘗試非正式方法。\n\n你猶豫著，但還是決定試試看。',
      type: 'narrator',
    },
  },
  
  // SPACE 2-3: 後殿・動搖的開始
  'ch2_sc3': {
    id: 'ch2_sc3',
    chapterId: 'ch2',
    name: '後殿・動搖的開始',
    description: '你發現「問題真的解決了」，開始動搖。',
    background: '/images/bg_ch2_sc3_v1.png',
    hotspots: [
      {
        id: 'red_banners',
        shape: 'rect',
        coords: [0.2, 0.2, 0.5, 0.6],
        description: '還願的紅布條',
        hint: '其他香客留下的還願布條。',
      },
      {
        id: 'witness_notes',
        shape: 'rect',
        coords: [0.5, 0.2, 0.8, 0.6],
        description: '香客的見證',
        hint: '其他香客留下的見證。',
      },
    ],
    items: [
      items.red_banner,
      items.witness_note,
    ],
    hotspotEventMap: {
      'red_banners': 'read_banners',
      'witness_notes': 'read_witness',
    },
    events: [
      {
        id: 'read_banners',
        name: '閱讀紅布條',
        description: '你閱讀還願的紅布條。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'red_banners' },
        ],
        effects: [
          { type: 'addItem', itemId: 'red_banner' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：還願的紅布條\n\n其他香客留下的還願布條，上面寫著「靈驗」的字樣。\n\n你看到其他香客的「成功案例」。',
              type: 'item',
            },
          },
          { type: 'setFlag', flag: 'banners_read', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'read_witness',
        name: '閱讀見證',
        description: '你閱讀其他香客的見證。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'witness_notes' },
        ],
        effects: [
          { type: 'addItem', itemId: 'witness_note' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：香客的見證\n\n其他香客留下的見證，描述他們如何「解決」了問題。\n\n你發現「問題真的解決了」，但不知道為什麼。',
              type: 'item',
            },
          },
          { type: 'setFlag', flag: 'witness_read', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'confirm_effectiveness',
        name: '確認有效',
        description: '你確認了「有效」，開始動搖。',
        requirements: [
          { type: 'hasFlag', flag: 'furnace_operated', value: true },
          { type: 'hasFlag', flag: 'banners_read', value: true },
          { type: 'hasFlag', flag: 'witness_read', value: true },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '你確認了「有效」。\n\n你第一次「越線而沒有立刻付出代價」。\n\n你開始動搖，第一次合理化。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'room2_completed', value: true },
        ],
        oneTime: true,
      },
    ],
    puzzles: [
      {
        id: 'witness_common_word_puzzle',
        type: 'input',
        solution: '欠補換還', // 或 '欠補換還' 的4個字根
        hint: '香客見證：成功案例其實是同一種失敗。\n\n見證看似不同，但都有同一個重複詞：「欠」、「補」、「換」、「還」。\n\n把重複詞取出，依出現順序組成4字，輸入到後殿供桌下的暗鎖。',
        requirements: [
          { type: 'hasItem', itemId: 'witness_note' },
          { type: 'hasFlag', flag: 'witness_read', value: true },
        ],
        onSolve: [
          {
            type: 'showDialog',
            dialog: {
              text: '你找到了共同詞：欠、補、換、還。\n\n依出現順序組成：欠補換還。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'witness_puzzle_solved', value: true },
          { type: 'addItem', itemId: 'temple_charm' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：護身符\n\n後殿供桌下的暗鎖打開了，裡面有一個護身符。',
              type: 'item',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '規則以外，其實還有辦法——但你要先承認你想要。',
              type: 'narrator',
            },
          },
        ],
      },
      {
        id: 'ash_pattern_puzzle',
        type: 'jigsaw',
        solution: 'solved',
        hint: '火的回信：燒完不是結束，是被記住。\n\n成功燒物後，灰燼會留下像「線路圖」的裂紋。\n\n把裂紋對照金爐旁的石刻（或香案花紋）找到一個符號 → 對應一個字母／數字。',
        requirements: [
          { type: 'hasFlag', flag: 'furnace_operated', value: true },
          { type: 'hasFlag', flag: 'witness_puzzle_solved', value: true },
        ],
        config: {
          gridSize: [3, 3],
          imageUrl: '/images/ash_pattern.png', // 灰燼圖形
        },
        onSolve: [
          {
            type: 'showDialog',
            dialog: {
              text: '你拼出了灰燼的裂紋圖形，對照石刻找到符號：E7。',
              type: 'narrator',
            },
          },
          { type: 'addItem', itemId: 'ash_code' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：灰燼碼\n\n從灰燼中解讀出的符號：E7。\n\n這是「電廠通行碼」的一部分（為 ROOM 3 或 ROOM 5 埋伏筆）。',
              type: 'item',
            },
          },
          { type: 'setFlag', flag: 'ash_puzzle_solved', value: true },
          {
            type: 'showDialog',
            dialog: {
              text: '通往 ROOM 3 的門打開了（或收到「受訓通知」）。',
              type: 'system',
            },
          },
        ],
      },
    ],
    initialDialog: {
      text: '你發現「問題真的解決了」，但不知道為什麼。\n\n你看到其他香客的「成功案例」，發現廟裡沒有醫療、沒有制度。\n\n你開始動搖。',
      type: 'narrator',
    },
  },
  
  // ========== ROOM 3: 核能電廠・訓練與程序 ==========
  // SPACE 3-1: 訓練室・學習規則
  'ch3_sc1': {
    id: 'ch3_sc1',
    chapterId: 'ch3',
    name: '訓練室・學習規則',
    description: '高度制度化的空間。規則明確、程序嚴謹、每個動作都有記錄。',
    background: '/images/bg_ch3_sc1_v1.png',
    hotspots: [
      {
        id: 'safety_video',
        shape: 'rect',
        coords: [0.3, 0.2, 0.7, 0.5],
        description: '安全影片',
        hint: '觀看安全影片，學習程序。',
      },
      {
        id: 'tool_procedure',
        shape: 'rect',
        coords: [0.1, 0.5, 0.4, 0.8],
        description: '工具檢查程序',
        hint: '學習工具檢查程序，必須按順序。',
      },
      {
        id: 'manual_spot',
        shape: 'rect',
        coords: [0.6, 0.5, 0.9, 0.8],
        description: '安全手冊',
        hint: '安全手冊，每一頁都強調程序的重要性。',
      },
    ],
    items: [
      items.safety_manual,
      items.tool_checklist,
    ],
    hotspotEventMap: {
      'safety_video': 'watch_video',
      'tool_procedure': 'learn_procedure',
      'manual_spot': 'read_manual',
    },
    events: [
      {
        id: 'watch_video',
        name: '觀看安全影片',
        description: '你觀看安全影片。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'safety_video' },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '你觀看安全影片，學習程序。\n\n這裡不管你為什麼，只管你有沒有照做。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'video_watched', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'learn_procedure',
        name: '學習工具檢查程序',
        description: '你學習工具檢查程序。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'tool_procedure' },
        ],
        effects: [
          { type: 'addItem', itemId: 'tool_checklist' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：工具檢查表\n\n工具檢查的程序表，必須按照順序執行。\n\n這裡不管你為什麼，只管你有沒有照做。',
              type: 'item',
            },
          },
          { type: 'setFlag', flag: 'procedure_learned', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'read_manual',
        name: '閱讀安全手冊',
        description: '你閱讀安全手冊。',
        requirements: [
          { type: 'hasInteracted', hotspotId: 'manual_spot' },
        ],
        effects: [
          { type: 'addItem', itemId: 'safety_manual' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：安全手冊\n\n電廠的安全操作手冊，每一頁都強調程序的重要性。\n\n這裡不管你為什麼，只管你有沒有照做。',
              type: 'item',
            },
          },
          { type: 'setFlag', flag: 'manual_read', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'complete_training',
        name: '完成訓練',
        description: '完成所有訓練內容。',
        requirements: [
          { type: 'hasFlag', flag: 'video_watched', value: true },
          { type: 'hasFlag', flag: 'procedure_learned', value: true },
          { type: 'hasFlag', flag: 'manual_read', value: true },
        ],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '你完成了所有訓練內容。\n\n這裡不管你為什麼，只管你有沒有照做。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'training_completed', value: true },
        ],
        oneTime: true,
      },
    ],
    puzzles: [
      {
        id: 'tool_checklist_puzzle',
        type: 'arrangement',
        solution: ['外觀', '扭力', '校正', '封條', '簽名', '封存'],
        hint: '工具檢查表：順序不是合理，是可追責。\n\n玩家看到 6 個檢查步驟被打亂：外觀、扭力、校正、封條、簽名、封存。\n\n安全手冊某頁角落有一句：「先看得到，再碰得到；先確認，再使用。」\n\n依邏輯排序。',
        requirements: [
          { type: 'hasItem', itemId: 'tool_checklist' },
          { type: 'hasItem', itemId: 'safety_manual' },
          { type: 'hasFlag', flag: 'manual_read', value: true },
        ],
        onSolve: [
          {
            type: 'showDialog',
            dialog: {
              text: '你按照邏輯排序：外觀→扭力→校正→封條→簽名→封存。\n\n先看得到，再碰得到；先確認，再使用。',
              type: 'narrator',
            },
          },
          { type: 'addItem', itemId: 'procedure_stamp' },
          {
            type: 'showDialog',
            dialog: {
              text: '獲得：程序章\n\n取得一個「程序章」或「簽核章」可蓋在紀錄上。',
              type: 'item',
            },
          },
          { type: 'setFlag', flag: 'tool_checklist_puzzle_solved', value: true },
        ],
      },
      {
        id: 'safety_video_puzzle',
        type: 'visual_selection',
        solution: ['error1', 'error2', 'error3'],
        hint: '安全影片：影片會問你「為什麼」，但不等你回答。\n\n影片重播同一段操作，但每次有一個小錯（手套顏色、工具擺放方向、封條缺失）。\n\n玩家要指出錯誤 3 次。',
        requirements: [
          { type: 'hasFlag', flag: 'video_watched', value: true },
        ],
        options: [
          { id: 'error1', label: '手套顏色錯誤', description: '第一次錯誤：手套顏色不對' },
          { id: 'error2', label: '工具擺放方向錯誤', description: '第二次錯誤：工具擺放方向不對' },
          { id: 'error3', label: '封條缺失', description: '第三次錯誤：封條缺失' },
        ],
        onSolve: [
          {
            type: 'showDialog',
            dialog: {
              text: '你指出了 3 次錯誤：手套顏色、工具擺放方向、封條缺失。\n\n影片會問你「為什麼」，但不等你回答。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'safety_video_puzzle_solved', value: true },
          {
            type: 'showDialog',
            dialog: {
              text: '得到「操作手冊」某一頁的補充條款（災後會用到）。',
              type: 'system',
            },
          },
        ],
      },
    ],
    initialDialog: {
      text: '高度制度化的空間。\n\n規則明確、程序嚴謹、每個動作都有記錄。\n\n你開始學習規則。',
      type: 'narrator',
    },
  },
  
  // SPACE 3-2: 測驗室・適應規則
  'ch3_sc2': {
    id: 'ch3_sc2',
    chapterId: 'ch3',
    name: '測驗室・適應規則',
    description: '你適應規則，完成測驗。',
    background: '/images/bg_ch3_sc2_v1.png',
    hotspots: [
      {
        id: 'test_paper_spot',
        shape: 'rect',
        coords: [0.3, 0.2, 0.7, 0.5],
        description: '測驗卷',
        hint: '安全測驗，有明確的對錯答案。',
      },
      {
        id: 'tool_check_spot',
        shape: 'rect',
        coords: [0.1, 0.5, 0.4, 0.8],
        description: '工具檢查',
        hint: '工具檢查，必須按順序檢查。',
      },
      {
        id: 'roll_call',
        shape: 'rect',
        coords: [0.6, 0.5, 0.9, 0.8],
        description: '點名確認',
        hint: '點名確認，必須回答正確。',
      },
    ],
    items: [
      items.test_paper,
      items.tool_set,
    ],
    hotspotEventMap: {
      'test_paper_spot': 'take_test',
      'tool_check_spot': 'check_tools',
      'roll_call': 'answer_roll_call',
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
    background: '/images/bg_ch3_sc3_v1.png',
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
    background: '/images/bg_ch4_sc1_v1.png',
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
    background: '/images/bg_ch4_sc2_v1.png',
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
    background: '/images/bg_ch4_sc3_v1.png',
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
    background: '/images/bg_ch5_sc1_v1.png',
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
    background: '/images/bg_ch5_sc2_v1.png',
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
    background: '/images/bg_ch5_sc3_v1.png',
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
    name: 'ROOM 1：舊公寓・清晨後',
    description: '讓玩家被空間需要，建立「留下來是合理的」動機',
    scenes: ['ch1_sc1', 'ch1_sc2', 'ch1_sc3'],
  },
  ch2: {
    id: 'ch2',
    name: 'ROOM 2：財神廟・火還在燒',
    description: '引入「非正式解決系統」',
    scenes: ['ch2_sc1', 'ch2_sc2', 'ch2_sc3'],
  },
  ch3: {
    id: 'ch3',
    name: 'ROOM 3：核能電廠・訓練與程序',
    description: '建立正式秩序的權威感',
    scenes: ['ch3_sc1', 'ch3_sc2', 'ch3_sc3'],
  },
  ch4: {
    id: 'ch4',
    name: 'ROOM 4：電廠・災後與異物事件',
    description: '讓正式制度承受極限壓力',
    scenes: ['ch4_sc1', 'ch4_sc2', 'ch4_sc3'],
  },
  ch5: {
    id: 'ch5',
    name: 'ROOM 5：反應爐核心・抉擇',
    description: '迫使玩家選擇相信哪一套系統',
    scenes: ['ch5_sc1', 'ch5_sc2', 'ch5_sc3'],
  },
};
