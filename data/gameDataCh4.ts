import { Scene, Item, NpcDialogNode, GameState } from '@/types/game';

// ──────────────────────────────────────────────
// 第四章 道具
// ──────────────────────────────────────────────
const items: Record<string, Item> = {
  // 場景一：樓梯間 / 逃生動線
  item_lighting_time_diff: {
    id: 'item_lighting_time_diff',
    name: '節能燈提前切換記錄',
    description:
      '樓梯間燈控的操作記錄，時間欄位顯示一個異常：散場前 3 分鐘，燈光切換到節能模式。\n\n正常流程是散場後才切換，這次比散場時間早了整整 3 分鐘。\n\n梁以安說得沒錯：「黑得太早。」\n\n3 分鐘。樓梯間從亮到暗。讀起來像**實地彩排**留下的時間窗——不是單純疏失。',
    svgImage: '/svg/items/lighting_time_diff.svg',
    svgSize: 'medium',
    collectible: false,
  },
  item_stairwell_wear_trace: {
    id: 'item_stairwell_wear_trace',
    name: '樓梯踏面磨損與扶手抓痕',
    description:
      '樓梯中段的踏面有一道不規則磨損，像是有人腳滑後緊急踩穩。扶手鍍層在同一位置有指甲抓痕，深度不像日常使用。\n\n地面還有一個零碎物件：一顆鈕扣，材質偏工作服用料。\n\n有人差點摔落，或者有人讓別人差點摔落。',
    svgImage: '/svg/items/stairwell_wear_trace.svg',
    svgSize: 'medium',
    collectible: false,
  },
  item_monitor_blind_stair: {
    id: 'item_monitor_blind_stair',
    name: '監視器覆蓋範圍圖（樓梯間）',
    description:
      '保全提供的監視器覆蓋範圍圖顯示：樓梯間入口和出口都有拍到，但中段轉角沒有任何鏡頭。\n\n有人能站在那個位置，觀察到上下兩端的混亂，卻完全不入鏡。\n\n這個死角不是偶然形成的，監視器的安裝位置是被設計過的。',
    svgImage: '/svg/items/monitor_blind_stair.svg',
    svgSize: 'medium',
    collectible: false,
  },

  // 場景二：放映控制區 / 副面板區
  item_plugin_same_version: {
    id: 'item_plugin_same_version',
    name: '與城市影城同版的操作介面截圖',
    description:
      '陳佑誠翻出一張截圖，副面板的操作介面版本號：v2.3.1-patch07。\n\n這個版本號和城市影城的版本完全一致——不只是同一套軟體，是同一個 patch 版本。\n\n「同一套插件跑三館，你還要我相信這些都是巧合？」',
    svgImage: '/svg/items/plugin_same_version.svg',
    svgSize: 'medium',
    collectible: false,
  },
  item_plugin_sync_record: {
    id: 'item_plugin_sync_record',
    name: '插件版本號與同步紀錄',
    description:
      '維護記錄顯示：光芒 R 與城市 W 的插件在同一週內完成了版本更新，時間差在一天以內。\n\n更新的觸發來源：遠端推送。推送帳號：系統維護帳號。\n\n技術上，系統維護帳號可以由多人共用。它不能告訴你誰在裡面，只能告訴你有人進來過。\n\n【同版截圖】副面板介面版本 v2.3.1-patch07，與城市影城同一 patch——同一套漏洞與觸發方式。\n\n【面板／逃脫】大廳面板「手動切換」區有指紋，側門方向有新鮮鞋印——混亂中完成操作後離開無鏡頭側門，需熟現場動線。',
    svgImage: '/svg/items/plugin_sync_record.svg',
    svgSize: 'medium',
    collectible: true,
  },
  item_risk_report_buried: {
    id: 'item_risk_report_buried',
    name: '被擱置的風險回報單',
    description:
      '陳佑誠從抽屜最底層找出三份回報單，每一份都有格式、有日期、有優先標記。\n\n第一份：四個月前。第二份：兩個月前。第三份：六週前。\n\n三份都標了「優先 B」——緊急但不是最高優先。三份都消失在審核流程裡，沒有任何批示；但每一份**都有承辦簽收、都進了系統**——能走完整條流程的人，很難假裝「沒人看見」。\n\n「回報過。不是一次。格式都對，優先級也對，消失得更對。」\n\n【樓梯／燈控】散場前 3 分鐘燈控已切節能，與「散場後才切」的流程敘事牴觸；踏面磨損與扶手抓痕像急停施力，地面有工作服鈕扣。\n\n【動線／死角】入口與出口有鏡頭，中段轉角無鏡頭——可觀察兩端混亂卻不入鏡。\n\n【大廳序列】廣播比散場信號延遲 8 秒，燈在廣播前已切——燈先滅、廣播後響，像執行順序被改過，不像單一設備偶然失序。',
    svgImage: '/svg/items/risk_report_buried.svg',
    svgSize: 'medium',
    collectible: true,
  },

  // 場景三：散場大廳 / 事故當下
  item_crowd_timing_log: {
    id: 'item_crowd_timing_log',
    name: '廣播延遲與燈光錯拍記錄',
    description:
      '事故當下的現場記錄：廣播比散場信號延遲 8 秒，燈光在廣播前已切換，觀眾尚未收到疏散提示時大廳已陷入半暗。\n\n梁以安說他聽到有人跌倒。保全記錄說有三個人被推擠。\n\n這個順序——燈先滅、廣播後響——**廣播與燈光刻意脫節**，不是設備故障；讀起來像在**實地彩排**：測黑暗中的恐慌會怎麼蔓延，而非單次失誤。',
    svgImage: '/svg/items/crowd_timing_log.svg',
    svgSize: 'medium',
    collectible: false,
  },
  item_panel_operator_trace: {
    id: 'item_panel_operator_trace',
    name: '面板操作痕跡與快步離開的鞋印',
    description:
      '面板旁邊的地面上有一道新鮮的橡膠鞋底印，角度朝向側門出口。\n\n面板螢幕有殘留指紋，位置在「手動切換」區域，不是正常操作的位置。\n\n有人在混亂發生的瞬間快速操作了面板，然後從側門離開——這不是維修動作，這是逃脫路線。',
    svgImage: '/svg/items/panel_operator_trace.svg',
    svgSize: 'medium',
    collectible: false,
  },
};

// ──────────────────────────────────────────────
// 第四章 場景
// ──────────────────────────────────────────────
const scenes: Record<string, Scene> = {

  // ──────────────────────────────────────────────
  // 場景一：樓梯間 / 逃生動線
  // ──────────────────────────────────────────────
  scene_ch4_stairwell: {
    id: 'scene_ch4_stairwell',
    chapterId: 'ch4',
    name: '樓梯間',
    description: '光芒影城的後側樓梯間，入口和出口都有監視器，但中段轉角沒有。散場時燈光比預定時間早了 3 分鐘切換，梁以安說那次黑得太早。',
    background: '/images/bg_ch4_sc1_v1.webp',
    hotspots: [
      {
        id: 'hotspot_stairwell_liu',
        shape: 'circle',
        coords: [0.16, 0.69, 0.12],
        description: '劉隊',
        hint: '劉隊在樓梯間入口等著，表情不算輕鬆。',
      },
      {
        id: 'hotspot_stairwell_liang',
        shape: 'circle',
        coords: [0.72, 0.53, 0.25],
        description: '梁以安',
        hint: '梁以安站在扶手旁，視線落在中段的轉角。',
      },
      {
        id: 'hotspot_stairwell_chen',
        shape: 'circle',
        coords: [0.895, 0.53, 0.075],
        description: '陳佑誠',
        hint: '陳佑誠在燈控箱旁看著時間記錄，像個早就知道答案的人。',
      },
      {
        id: 'hotspot_stairwell_light_diff',
        shape: 'circle',
        coords: [0.44, 0.24, 0.16],
        description: '燈控箱（時間記錄）',
        hint: '燈控箱上有一份操作記錄，顯示燈光切換的時間比正常早了 3 分鐘。',
      },
      {
        id: 'hotspot_stairwell_wear',
        shape: 'circle',
        coords: [0.44, 0.585, 0.135],
        description: '樓梯踏面（磨損與抓痕）',
        hint: '踏面有不規則磨損，扶手上有抓痕，地面有一顆工作服鈕扣。',
      },
      {
        id: 'hotspot_stairwell_monitor',
        shape: 'circle',
        coords: [0.44, 0.85, 0.1],
        description: '監視器覆蓋圖',
        hint: '牆上貼著監視器覆蓋範圍圖，中段轉角是死角。',
      },
    ],
    npcs: [
      {
        id: 'npc_liu',
        name: '劉隊（偵查隊）',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch4_liu_idle_1', text: '劉隊說：「先看樓梯間，再去找陳佑誠，那邊有東西要讓你看。」', type: 'hint', weight: 1 },
          { id: 'ch4_liu_idle_2', text: '「未遂事故不是沒有痕跡，是痕跡不夠整齊。你去找那個不夠整齊的地方。」', type: 'hint', weight: 1 },
          { id: 'ch4_liu_casual_1', text: '劉隊壓低聲：「壓回報、挑人道歉、同一套說帖——光芒這邊一向漂亮。漂亮到不像調查，像公關。」', type: 'casual', weight: 2 },
          { id: 'ch4_liu_casual_2', text: '「三分鐘聽起來短，夠讓一群人踩錯腳。」', type: 'casual', weight: 2 },
          { id: 'ch4_liu_casual_3', text: '他把筆尖在紙上敲兩下：「我要的是能對上時間軸的東西，不是感覺。」', type: 'hint', weight: 2 },
          { id: 'ch4_liu_casual_4', text: '「陳佑誠那邊若肯開抽屜，你就會知道——有人早把答案寫過了。」', type: 'hint', weight: 1 },
        ],
        available: true,
      },
      {
        id: 'npc_liang_yian',
        name: '梁以安（觀眾）',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch4_liang_idle_1', text: '梁以安說：「我不是難搞。我只是記得那次黑得太早。」', type: 'hint', weight: 1 },
          { id: 'ch4_liang_idle_2', text: '「有人老說是節能。我聽起來比較像在試——遠端黑暗、人群慌起來會怎樣。」', type: 'hint', weight: 1 },
          { id: 'ch4_liang_stair_casual_1', text: '他盯著轉角：「我愛電影，也尊重把放映做完的人——但那次節奏像被人剪接過。」', type: 'casual', weight: 2 },
          { id: 'ch4_liang_stair_casual_2', text: '「記者會那天，我想對觀眾說的是——別怕黑，怕的是黑得剛剛好。結果鏡頭只拍得到穿制服的。」', type: 'casual', weight: 2 },
          { id: 'ch4_liang_stair_hint_1', text: '「片尾還在跑，燈先沒了。你說這像不像有人剪接過現實？」', type: 'hint', weight: 2 },
          { id: 'ch4_liang_stair_hint_2', text: '梁以安苦笑：「他們要一個人鞠躬——挑了維護。導演跟觀眾一起罵。」', type: 'hint', weight: 1 },
        ],
        available: true,
      },
      {
        id: 'npc_chen_youcheng',
        name: '陳佑誠（技術維護）',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch4_chen_stair_idle_1', text: '陳佑誠說：「系統不怕壞，怕的是壞得剛剛好，像正常老化。」', type: 'hint', weight: 1 },
          { id: 'ch4_chen_stair_idle_2', text: '「控制區那邊有更多東西，你先把樓梯這邊看完。」', type: 'hint', weight: 1 },
          { id: 'ch4_chen_stair_casual_1', text: '「回報單寫得越完整，越像寫給自己看的。」', type: 'casual', weight: 2 },
          { id: 'ch4_chen_stair_casual_2', text: '他指燈控箱：「時間不會說謊，會說謊的是解釋時間的人。」', type: 'casual', weight: 2 },
          { id: 'ch4_chen_stair_hint_1', text: '「你等等看到版本號，就會懂我為什麼急。」', type: 'hint', weight: 2 },
          { id: 'ch4_chen_stair_hint_2', text: '「三館同一套插件——洞留在授權樹頂層能看見的地方，就不是單一館倒楣。」', type: 'hint', weight: 1 },
        ],
        available: true,
      },
    ],
    items: [
      items.item_lighting_time_diff,
      items.item_stairwell_wear_trace,
      items.item_monitor_blind_stair,
    ],
    hotspotEventMap: {
      hotspot_stairwell_liu: 'talk_liu_ch4_task',
      hotspot_stairwell_liang: 'talk_liang_ch4_stair',
      hotspot_stairwell_chen: 'talk_chen_ch4_stair',
      hotspot_stairwell_light_diff: 'inspect_ch4_light_diff',
      hotspot_stairwell_wear: 'inspect_ch4_stair_wear',
      hotspot_stairwell_monitor: 'inspect_ch4_stair_monitor',
    },
    events: [
      {
        id: 'talk_liu_ch4_task',
        name: '接受劉隊任務',
        description: '與劉隊確認第四章任務。',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '劉隊說：「光芒影城，第二起事故——那次沒有人死，所以沒有人認真記錄。」\n\n「但樓梯間的燈比該亮的時間早了 3 分鐘，有人差點在黑暗裡摔下去。」\n\n他把時間點寫在本子上，筆尖停在「-3:00」那格。\n\n「三分鐘不是感覺，是數字。數字一準，就不是自然。」\n\n「你去看陳佑誠。他說他早就回報過這個漏洞。回報被吃掉、記者會挑人道歉——常常是同一套說帖在管。我想知道那份回報最後停在誰手上。」\n\n「梁以安怎麼說、log 怎麼寫，對不起來就對了——那才是你要查的。」',
              type: 'character',
              characterId: 'npc_liu',
              characterName: '劉隊（偵查隊）',
              characterExpression: 1,
              characterPosition: 'right',
            },
          },
          { type: 'setFlag', flag: 'ch4_task_from_liu', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'talk_liang_ch4_stair',
        name: '問梁以安（樓梯間）',
        description: '詢問梁以安關於第二起事故的直接感受。',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '梁以安說：「我不是難搞。我只是記得那次黑得太早。」\n\n「片尾字幕還在跑，燈就先滅了。不是慢慢暗，是一下子——像有人把整個樓梯間的呼吸抽走。」\n\n「然後有人在樓梯間推擠，有人跌倒，有人在叫。」\n\n「我熱愛那部片，也尊重現場每一個把工作做完的人——我不是來拆自己片子的。但那種節奏不該由觀眾或第一線來扛。」\n\n他咬著字：「我記得時間。因為我看了手錶。我還想著『怎麼可能比散場早』。」\n\n「觀眾在罵影城、罵節能藉口——我跟他們一起火大，火氣被帶去對準**集團**那套說法。他們卻把陳佑誠推到鏡頭前道歉，好像燈是我們按錯的。」\n\n他停了一下：「那不是節能，那是有人在測試——遠端黑暗、人群恐慌——像在試一場實地彩排。」',
              type: 'character',
              characterId: 'npc_liang_yian',
              characterName: '梁以安',
              characterExpression: 1,
              characterPosition: 'right',
            },
          },
          { type: 'setFlag', flag: 'ch4_liang_stair_talked', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'talk_chen_ch4_stair',
        name: '問陳佑誠（樓梯間）',
        description: '詢問陳佑誠關於燈控漏洞。',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '陳佑誠說：「回報過。不是一次。格式都對，優先級也對，消失得更對。」\n\n「回報單是三份。時間我記得很清楚——因為我每次都想：『這次總該有人回我吧。』」\n\n「上新聞那晚，影城要我穿制服站到鏡頭前道歉——制服最好找。導演沒道歉；他跟觀眾一樣罵**集團**。」\n\n他指向燈控箱：「這種提前切換不是壞掉，是**被允許留在系統裡**。簽收過、進過系統的人——有那個權限的，很難說集體不知情。」\n\n「控制區那邊有我的回報單副本，還有那個插件的版本記錄。你去看，然後再告訴我你有什麼問題。」',
              type: 'character',
              characterId: 'npc_chen_youcheng',
              characterName: '陳佑誠（技術維護）',
              characterExpression: 1,
              characterPosition: 'right',
            },
          },
          { type: 'setFlag', flag: 'ch4_chen_stair_talked', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'inspect_ch4_light_diff',
        name: '查看燈控時間記錄',
        description: '仔細看燈控箱上的操作記錄。',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '記錄顯示燈光比散場時間早了 3 分鐘切換。\n\n這是第二起事故的起點：不是設備故障，是操作指令在錯誤的時間點執行。\n\n那 3 分鐘——樓梯間從亮到暗，人群還在移動，沒有預警，沒有廣播。像把「恐慌」當變因，在現場試一次。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'ch4_stairwell_time_viewed', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'inspect_ch4_stair_wear',
        name: '查看踏面磨損與抓痕',
        description: '仔細看樓梯中段的磨損與殘留物。',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '踏面的磨損不像日常使用，扶手的抓痕是緊急施力的力道。還有一顆鈕扣——工作服材質，不是觀眾的衣物。\n\n有人在這裡差點摔落。也可能，有人在這裡讓另一個人差點摔落。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'ch4_stairwell_trace_viewed', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'inspect_ch4_stair_monitor',
        name: '查看監視器覆蓋範圍圖',
        description: '看牆上貼的監視器覆蓋圖。',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '入口有鏡頭，出口有鏡頭，中段轉角——沒有。\n\n站在那個轉角，你能看到兩端的動靜，但不會被任何一台鏡頭拍到。\n\n這個設計讓「有人能觀察混亂、卻不入鏡」成為可能。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'ch4_stairwell_monitor_viewed', value: true },
        ],
        oneTime: true,
      },
    ],
    puzzles: [],
    initialDialog: {
      text: '光芒影城的樓梯間比城市影城的老一些，照明偏冷，扶手有磨損。\n\n第二起事故沒有人死，曾上新聞；對外鞠躬道歉的是被推出來的維護，怒氣卻被話術導去對準**集團口徑**，很快整件事就被壓成「偶發」。但梁以安說，那次黑得太早。',
      type: 'narrator',
    },
  },

  // ──────────────────────────────────────────────
  // 場景二：放映控制區 / 副面板區
  // ──────────────────────────────────────────────
  scene_ch4_control_panel: {
    id: 'scene_ch4_control_panel',
    chapterId: 'ch4',
    name: '放映控制區',
    description: '副面板區的操作介面和城市影城的一模一樣——不只是同一套軟體，是同一個 patch 版本。陳佑誠說他回報過三次，三次都消失在審核流程裡。',
    background: '/images/bg_ch4_sc2_v1.webp',
    hotspots: [
      {
        id: 'hotspot_control_chen',
        shape: 'circle',
        coords: [0.16, 0.61, 0.12],
        description: '陳佑誠',
        hint: '陳佑誠在面板旁，他顯然等了很久才等到一個願意聽他說話的人。',
      },
      {
        id: 'hotspot_control_liang',
        shape: 'circle',
        coords: [0.81, 0.515, 0.09],
        description: '梁以安',
        hint: '梁以安站在旁邊，表情說他也在等這個問題被回答。',
      },
      {
        id: 'hotspot_control_plugin_version',
        shape: 'circle',
        coords: [0.46, 0.26, 0.16],
        description: '副面板（版本號截圖）',
        hint: '螢幕角落顯示的版本號：v2.3.1-patch07，和城市影城完全相同。',
      },
      {
        id: 'hotspot_control_sync_record',
        shape: 'circle',
        coords: [0.46, 0.6, 0.12],
        description: '插件版本同步記錄',
        hint: '維護紀錄顯示兩館插件在同一週內由遠端推送更新，帳號是系統維護帳號。',
      },
      {
        id: 'hotspot_control_risk_report',
        shape: 'circle',
        coords: [0.46, 0.855, 0.095],
        description: '被擱置的風險回報單',
        hint: '抽屜最底層有三份回報單，每份都標「優先 B」，每份都沒有批示回應。',
      },
    ],
    npcs: [
      {
        id: 'npc_chen_youcheng',
        name: '陳佑誠（技術維護）',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch4_chen_control_idle_1', text: '陳佑誠說：「同一套插件跑三館，你還要我相信這些都是巧合？」', type: 'hint', weight: 1 },
          { id: 'ch4_chen_control_idle_2', text: '「這個版本的插件有一個很方便的特性：可以遠端觸發燈控，不需要本地授權。」', type: 'hint', weight: 1 },
          { id: 'ch4_chen_control_idle_3', text: '「三份回報單。四個月、兩個月、六週。簽收過、進過系統——然後沒批示。你說那是忘記？」', type: 'hint', weight: 1 },
          { id: 'ch4_chen_control_casual_1', text: '「我寧願它壞得大聲，也不要壞得像『正常』。」', type: 'casual', weight: 2 },
          { id: 'ch4_chen_control_casual_2', text: '陳佑誠敲敲抽屜：「有些東西放最底層，不是忘了，是等一個肯開的人。」', type: 'casual', weight: 2 },
          { id: 'ch4_chen_control_hint_1', text: '「遠端不代表神祕，只代表人不必站在這間房。」', type: 'hint', weight: 2 },
        ],
        available: true,
      },
      {
        id: 'npc_liang_yian',
        name: '梁以安',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch4_liang_control_idle_1', text: '梁以安說：「我以為那次只是我倒霉。陳先生說，這個漏洞三館都有。」', type: 'hint', weight: 1 },
          { id: 'ch4_liang_control_idle_2', text: '「如果這不是偶發，那第一次——那個死掉的人——也不是偶發。」', type: 'hint', weight: 1 },
          { id: 'ch4_liang_control_casual_1', text: '「我以前只在乎片尾字幕的美感——那是對作品與現場的尊重。現在我只在乎它亮不亮。」', type: 'casual', weight: 2 },
          { id: 'ch4_liang_control_casual_2', text: '梁以安低聲：「你知道最侮辱的是什麼嗎？他們用『節能』兩個字安慰觀眾。」', type: 'casual', weight: 2 },
          { id: 'ch4_liang_control_hint_1', text: '「同一套版本……代表同一套可被利用的空隙。」', type: 'hint', weight: 2 },
          { id: 'ch4_liang_control_hint_2', text: '「我不管誰的 KPI——品牌話術與機房母帶，遲早會在**集團**裡互相咬。」', type: 'hint', weight: 1 },
        ],
        available: true,
      },
    ],
    items: [
      items.item_plugin_same_version,
      items.item_plugin_sync_record,
      items.item_risk_report_buried,
    ],
    hotspotEventMap: {
      hotspot_control_chen: 'talk_chen_ch4_control',
      hotspot_control_liang: 'talk_liang_ch4_control',
      hotspot_control_plugin_version: 'inspect_ch4_plugin_version',
      hotspot_control_sync_record: 'inspect_ch4_sync_record',
      hotspot_control_risk_report: 'inspect_ch4_risk_report',
    },
    events: [
      {
        id: 'talk_chen_ch4_control',
        name: '問陳佑誠（控制區）',
        description: '在控制區和陳佑誠深入交談。',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '陳佑誠說：「你看到版本號了嗎？城市 W 跟光芒 R，完全一樣。不只是同一套，是同一個 patch。」\n\n「這個版本有一個問題：燈控可以被遠端觸發，不需要人在本地操作——等於把『黑暗＋人群反應』變成可排程的東西。我六週前就回報了，格式對、優先級對，就是沒有人回應。」\n\n他頓了頓：「回報過，不代表有人想解。**洞留在場上**，才能一再拿來用。」',
              type: 'character',
              characterId: 'npc_chen_youcheng',
              characterName: '陳佑誠（技術維護）',
              characterExpression: 1,
              characterPosition: 'right',
            },
          },
          { type: 'setFlag', flag: 'ch4_chen_control_talked', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'talk_liang_ch4_control',
        name: '問梁以安（控制區）',
        description: '在控制區和梁以安對話。',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '梁以安說：「陳先生說這個 patch 版本三個館都有，我聽完就有點不舒服。」\n\n「因為這代表那次事故不是光芒影城自己的問題——是**集團系統**裡同一個洞的一次顯影。」\n\n「我在乎片尾字幕亮完、在乎放映被尊重——結果他們用『節能』兩個字，把整件事說得像現場活該。」\n\n「我開始討厭『差一點』這三個字。它們通常只是下次的預告。」',
              type: 'character',
              characterId: 'npc_liang_yian',
              characterName: '梁以安',
              characterExpression: 1,
              characterPosition: 'right',
            },
          },
          { type: 'setFlag', flag: 'ch4_liang_control_talked', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'inspect_ch4_plugin_version',
        name: '查看副面板版本號截圖',
        description: '仔細看副面板螢幕角落的版本資訊。',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '版本號：v2.3.1-patch07。\n\n這和第三章在城市影城看到的插件版本完全一致——不只是相同軟體，是同一個 patch 號。\n\n同一個版本，意味著同一套漏洞；同一套漏洞，意味著同一種觸發方式。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'ch4_control_plugin_viewed', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'inspect_ch4_sync_record',
        name: '查看插件同步記錄',
        description: '閱讀維護紀錄裡的版本更新記錄。',
        requirements: [],
        effects: [
          { type: 'addItem', itemId: 'item_plugin_sync_record' },
          {
            type: 'showDialog',
            dialog: {
              text: '兩館插件在同一週完成更新，觸發來源是「系統維護帳號（遠端推送）」。\n\n系統維護帳號可以多人共用，它不記錄是誰進來的，只記錄帳號登入過。\n\n這條記錄能告訴你「有人做了這件事」，但不能告訴你是誰。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'ch4_control_sync_viewed', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'inspect_ch4_risk_report',
        name: '查看被擱置的風險回報單',
        description: '翻看抽屜裡陳佑誠的三份回報單。',
        requirements: [],
        effects: [
          { type: 'addItem', itemId: 'item_risk_report_buried' },
          {
            type: 'showDialog',
            dialog: {
              text: '三份回報單，四個月到六週前，每份格式完整、優先標記正確，每份都沒有批示。\n\n最後一份的備註欄位陳佑誠手寫了一行：「若此漏洞被利用，燈控可被遠端觸發，散場時間可控。」\n\n這行字沒有人回應。直到現在。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'ch4_control_risk_viewed', value: true },
        ],
        oneTime: true,
      },
    ],
    puzzles: [],
    initialDialog: {
      text: '副面板區的介面比外面乾淨，但陳佑誠說，乾淨的地方有時候只是因為沒有人真的進來看過。\n\n抽屜裡那三份回報——簽收過、進過系統——擱置本身就像決策。',
      type: 'narrator',
    },
  },

  // ──────────────────────────────────────────────
  // 場景三：散場大廳 / 事故當下
  // ──────────────────────────────────────────────
  scene_ch4_main_hall: {
    id: 'scene_ch4_main_hall',
    chapterId: 'ch4',
    name: '散場大廳',
    description: '事故發生時的散場大廳還保留著部分現場狀態。燈光在廣播響前就滅了，梁以安說他聽到有人跌倒，面板旁邊有快步離開的鞋印。',
    background: '/images/bg_ch4_sc3_v1.webp',
    hotspots: [
      {
        id: 'hotspot_hall_liang',
        shape: 'circle',
        coords: [0.16, 0.67, 0.12],
        description: '梁以安',
        hint: '梁以安站在事故當下他所在的位置附近，還記得那時的混亂。',
      },
      {
        id: 'hotspot_hall_chen',
        shape: 'circle',
        coords: [0.81, 0.53, 0.09],
        description: '陳佑誠',
        hint: '陳佑誠指著面板方向，說他記得那個操作的位置。',
      },
      {
        id: 'hotspot_hall_timing',
        shape: 'circle',
        coords: [0.46, 0.26, 0.16],
        description: '廣播延遲與燈光錯拍記錄',
        hint: '管理室牆上貼著事故當下的廣播與燈光時序記錄，兩者之間有 8 秒的落差。',
      },
      {
        id: 'hotspot_hall_panel_trace',
        shape: 'circle',
        coords: [0.46, 0.68, 0.2],
        description: '面板操作痕跡與鞋印',
        hint: '面板旁邊有一道橡膠鞋底印，面板「手動切換」區域有殘留指紋。',
      },
    ],
    npcs: [
      {
        id: 'npc_liang_yian',
        name: '梁以安',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch4_liang_hall_idle_1', text: '梁以安說：「那個人不是從主出口走的。他從側門出去，那邊沒有監視器。」', type: 'hint', weight: 1 },
          { id: 'ch4_liang_hall_idle_2', text: '「我想衝過去，但我不確定要救人還是跟著那個人。結果兩個都來不及。」', type: 'hint', weight: 1 },
          { id: 'ch4_liang_hall_casual_1', text: '「廣播響的時候，燈早就把人心弄慌了。」', type: 'casual', weight: 2 },
          { id: 'ch4_liang_hall_casual_2', text: '梁以安盯著側門：「有些人離場的方式，像彩排過。」', type: 'casual', weight: 2 },
          { id: 'ch4_liang_hall_hint_1', text: '「我記得鞋底摩擦的聲音。很快，像在躲什麼。」', type: 'hint', weight: 2 },
          { id: 'ch4_liang_hall_hint_2', text: '「你如果要我相信這是意外，先解釋順序為什麼會錯。」', type: 'hint', weight: 1 },
        ],
        available: true,
      },
      {
        id: 'npc_chen_youcheng',
        name: '陳佑誠（技術維護）',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch4_chen_hall_idle_1', text: '陳佑誠說：「他知道哪個面板、哪個操作、哪個時機。不是隨機的，這是準備過的。」', type: 'hint', weight: 1 },
          { id: 'ch4_chen_hall_idle_2', text: '「如果你問我誰有能力做到這件事，我只能給你一個技術清單，而不是一個名字。」', type: 'hint', weight: 1 },
          { id: 'ch4_chen_hall_casual_1', text: '「手動切換那個位置……平常訓練不會教你按那裡。」', type: 'casual', weight: 2 },
          { id: 'ch4_chen_hall_casual_2', text: '陳佑誠看向鞋印：「逃得快，不代表心虛；但心虛的人通常都很快。」', type: 'casual', weight: 2 },
          { id: 'ch4_chen_hall_hint_1', text: '「共用帳號這件事，你們晚點會在別的館再碰到一次。」', type: 'hint', weight: 2 },
          { id: 'ch4_chen_hall_hint_2', text: '「序列能被改，代表有人當時就在流程上游。」', type: 'hint', weight: 1 },
        ],
        available: true,
      },
    ],
    items: [
      items.item_crowd_timing_log,
      items.item_panel_operator_trace,
    ],
    hotspotEventMap: {
      hotspot_hall_liang: 'talk_liang_ch4_hall',
      hotspot_hall_chen: 'talk_chen_ch4_hall',
      hotspot_hall_timing: 'inspect_ch4_crowd_timing',
      hotspot_hall_panel_trace: 'inspect_ch4_panel_trace',
    },
    events: [
      {
        id: 'talk_liang_ch4_hall',
        name: '問梁以安（大廳）',
        description: '詢問梁以安關於事故當下他看到的事。',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '梁以安說：「廣播還沒響，燈就先滅了。沒有提示，大家就往出口擠。」\n\n「我看到有個人在面板附近，不是在修，是在操作什麼——然後他轉身就走，從側門出去。」\n\n「我記得他的鞋，深色運動鞋，走路的速度不像是巡邏，更像是完成了一件事。」',
              type: 'character',
              characterId: 'npc_liang_yian',
              characterName: '梁以安',
              characterExpression: 1,
              characterPosition: 'right',
            },
          },
          { type: 'setFlag', flag: 'ch4_liang_hall_talked', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'talk_chen_ch4_hall',
        name: '問陳佑誠（大廳）',
        description: '詢問陳佑誠關於面板操作者的技術判斷。',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '陳佑誠說：「那個指紋位置是手動切換區域，不是日常操作的按鍵。」\n\n「能在那種混亂裡知道要按哪裡——要嘛是花時間學過，要嘛是平常就在操作。」\n\n「登入很多次，不代表每次都是同一個人在裡面。這個版本的插件讓共用帳號在技術上是可行的。」',
              type: 'character',
              characterId: 'npc_chen_youcheng',
              characterName: '陳佑誠（技術維護）',
              characterExpression: 1,
              characterPosition: 'right',
            },
          },
          { type: 'setFlag', flag: 'ch4_chen_hall_talked', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'inspect_ch4_crowd_timing',
        name: '查看廣播延遲與燈光錯拍記錄',
        description: '閱讀事故當下的時序記錄。',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '廣播比散場信號延遲 8 秒；燈光在廣播前已切換。\n\n觀眾在沒有任何廣播提示的情況下，面對驟然變暗的大廳開始移動。\n\n這個序列——燈先滅、廣播後響——**廣播與燈光刻意脫節**，不是設備偶然失序；像在**放大恐慌**，測人群在錯拍裡會怎麼擠、怎麼慌。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'ch4_hall_crowd_viewed', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'inspect_ch4_panel_trace',
        name: '查看面板操作痕跡與鞋印',
        description: '仔細看面板旁的殘留痕跡。',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '橡膠鞋底印朝向側門，步伐間距比正常走路大一點——是快走，不是奔跑。\n\n面板「手動切換」按鍵上的指紋殘留還在，這個位置不是日常操作會碰到的地方。\n\n有人完成了操作，然後走向沒有監視器的側門。知道哪裡可以消失，這不是巧合。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'ch4_hall_trace_viewed', value: true },
        ],
        oneTime: true,
      },
    ],
    puzzles: [],
    initialDialog: {
      text: '大廳的燈又亮起來了，但梁以安說，他永遠記得它滅下去的順序。\n\n遠端黑暗、人群恐慌——像一場被排過的實地彩排。「人群能被當測試。」這句話在這裡有了重量。',
      type: 'narrator',
    },
  },
};

// ──────────────────────────────────────────────
// 第四章 NPC 對話樹
// ──────────────────────────────────────────────
const npcDialogs: Record<string, Record<string, NpcDialogNode>> = {

  // ──────────────────────────────────────────────
  // 陳佑誠 敏感對話（ch4 核心 NPC）
  // ──────────────────────────────────────────────
  npc_chen_youcheng: {
    // 敏感 branch 1：追問「回報為什麼消失」
    node_chen_sensitive1_1: {
      id: 'node_chen_sensitive1_1',
      npcId: 'npc_chen_youcheng',
      text:
        '陳佑誠說：「我把三份回報單都按標準流程送出去了。第一份四個月前，第二份兩個月前，最後一份六週前。」\n\n「每次都有承辦人簽收，每次都進了系統，每次都沒有下文。」\n\n「你問我是誰擋住的——我不知道。但簽收過的人，權限都在那條鏈上——**很難假裝全系統沒人看見。**」\n\n「不是所有擱置都是遺忘，有些擱置是決策。」',
      choices: [
        {
          id: 'chen_s1_q1',
          label: '你知道那個承辦人是誰嗎？',
          effects: [{ type: 'setFlag', flag: 'ch4_chen_s1_q1', value: true }],
        },
        {
          id: 'chen_s1_q2',
          label: '這個漏洞——如果被利用，能做到什麼？',
          effects: [{ type: 'setFlag', flag: 'ch4_chen_s1_q2', value: true }],
        },
      ],
      next: (state: GameState): string | null => {
        if (state.flags.ch4_chen_s1_q1) return 'node_chen_s1_reply_q1';
        return 'node_chen_s1_reply_q2';
      },
    },
    node_chen_s1_reply_q1: {
      id: 'node_chen_s1_reply_q1',
      npcId: 'npc_chen_youcheng',
      text:
        '「技術回報的審核鏈最後會到部門主管那邊。光芒影城的技術這端，線最後接到哪裡，我沒辦法直接告訴你，但你可以從維護帳號的授權樹往上追。」\n\n「我只能說：不是每個人都想讓這個漏洞被修掉。**留著它**，才有人在多館、多時間窗能用同一套手法。」',
      choices: [
        {
          id: 'chen_s1_end',
          label: '（結束對話）',
          effects: [
            { type: 'setFlag', flag: 'npc_chen_sensitive_done', value: true },
          ],
        },
      ],
    },
    node_chen_s1_reply_q2: {
      id: 'node_chen_s1_reply_q2',
      npcId: 'npc_chen_youcheng',
      text:
        '陳佑誠說：「燈控可以被遠端觸發，不需要人在場。時機可以被指定——散場前幾分鐘、開場時、片尾字幕。」\n\n「如果你知道時間表，你可以讓黑暗發生在最混亂的那一秒。」\n\n他停頓了一下：「我在最後一份回報單上寫了這一點。沒有人回應。」',
      choices: [
        {
          id: 'chen_s1_end',
          label: '（結束對話）',
          effects: [
            { type: 'setFlag', flag: 'npc_chen_sensitive_done', value: true },
          ],
        },
      ],
    },

    // 敏感 branch 2：追問「誰有這個技術能力」
    node_chen_sensitive2_1: {
      id: 'node_chen_sensitive2_1',
      npcId: 'npc_chen_youcheng',
      text:
        '陳佑誠說：「你問我誰有能力操作這個——我可以給你一個技術條件清單。」\n\n「需要：插件存取權限、兩個館的系統維護帳號、知道這個 patch 版本的燈控指令。」\n\n「這個清單，不長。符合的人，也不多。」',
      choices: [
        {
          id: 'chen_s2_q1',
          label: '高文傑符合這個清單嗎？',
          effects: [{ type: 'setFlag', flag: 'ch4_chen_s2_q1', value: true }],
        },
        {
          id: 'chen_s2_q2',
          label: '你符合這個清單嗎？',
          effects: [{ type: 'setFlag', flag: 'ch4_chen_s2_q2', value: true }],
        },
      ],
      next: (state: GameState): string | null => {
        if (state.flags.ch4_chen_s2_q1) return 'node_chen_s2_reply_q1';
        return 'node_chen_s2_reply_q2';
      },
    },
    node_chen_s2_reply_q1: {
      id: 'node_chen_s2_reply_q1',
      npcId: 'npc_chen_youcheng',
      text:
        '「他的名字在登入記錄裡，次數不少。」\n\n「但符合技術清單不等於做了這件事——這個版本的系統維護帳號是可以共用的。登入紀錄只能告訴你帳號在場，不保證靈魂也在場。」\n\n「你們現在才開始問，已經算慢了。」',
      choices: [
        {
          id: 'chen_s2_end',
          label: '（結束對話）',
          effects: [
            { type: 'setFlag', flag: 'npc_chen_sensitive_done', value: true },
          ],
        },
      ],
    },
    node_chen_s2_reply_q2: {
      id: 'node_chen_s2_reply_q2',
      npcId: 'npc_chen_youcheng',
      text:
        '陳佑誠沉默了幾秒。\n\n「技術上，符合。但我把漏洞回報了三次。如果我想利用它，我不會一邊回報一邊動手。」\n\n「我更想讓這個洞被修掉。結果它沒有被修，反而被用了。」',
      choices: [
        {
          id: 'chen_s2_end',
          label: '（結束對話）',
          effects: [
            { type: 'setFlag', flag: 'npc_chen_sensitive_done', value: true },
          ],
        },
      ],
    },
  },

  // ──────────────────────────────────────────────
  // 梁以安 敏感對話（ch4：主觀證詞／目擊）
  // ──────────────────────────────────────────────
  npc_liang_yian: {
    node_liang_sensitive1_1: {
      id: 'node_liang_sensitive1_1',
      npcId: 'npc_liang_yian',
      text:
        '梁以安吸一口氣，像在把舊聞的標題從嘴邊推開：「他們把陳佑誠推到鏡頭前道歉。我站在旁邊聽——那不像認錯，像替整個體制扛。」\n\n「我沒有對觀眾說對不起。我跟著一起罵——罵的是**集團**那套話；片尾還在跑，大廳就先暗了；那次不是創作失誤，是**廣播與燈光刻意脫節**。」\n\n「你問我信不信『節能』？我只信我手錶上的時間。」',
      choices: [
        {
          id: 'liang_s1_q1',
          label: '你覺得「推維護員出去道歉」是為了轉移焦點嗎？',
          effects: [{ type: 'setFlag', flag: 'ch4_liang_s1_q1', value: true }],
        },
        {
          id: 'liang_s1_q2',
          label: '你確定是燈先走、廣播後到——不是你自己慌？',
          effects: [{ type: 'setFlag', flag: 'ch4_liang_s1_q2', value: true }],
        },
      ],
      next: (state: GameState): string | null => {
        if (state.flags.ch4_liang_s1_q1) return 'node_liang_s1_reply_q1';
        return 'node_liang_s1_reply_q2';
      },
    },
    node_liang_s1_reply_q1: {
      id: 'node_liang_s1_reply_q1',
      npcId: 'npc_liang_yian',
      text:
        '「對外要一句對不起，最簡單——他們挑了穿制服的。」\n\n「我沒有站在道歉那邊。我站在觀眾這邊——黑得太早，不是觀眾的錯。」\n\n「把火氣帶去罵**集團口徑**，大家就比較不想問：誰把洞留在系統裡。」\n\n「他們要的是場面先穩住，不是先把真相排好。」',
      choices: [
        {
          id: 'liang_s1_end',
          label: '（結束對話）',
          effects: [{ type: 'setFlag', flag: 'npc_liang_yian_sensitive_done', value: true }],
        },
      ],
    },
    node_liang_s1_reply_q2: {
      id: 'node_liang_s1_reply_q2',
      npcId: 'npc_liang_yian',
      text:
        '梁以安抬眼，語氣很硬：「我慌過，但我沒有幻覺。」\n\n「我看了兩次錶，怕是自己嚇自己——結果時間只更確定。」\n\n「燈下去那一刻，字幕還在跑。那不是節能，是順序被換過。」',
      choices: [
        {
          id: 'liang_s1_end',
          label: '（結束對話）',
          effects: [{ type: 'setFlag', flag: 'npc_liang_yian_sensitive_done', value: true }],
        },
      ],
    },

    node_liang_sensitive2_1: {
      id: 'node_liang_sensitive2_1',
      npcId: 'npc_liang_yian',
      text:
        '梁以安視線掃向面板，又掃向側門：「大廳那次，我看到有人在邊上操作——不是巡邏那種從容，是很快、很準。」\n\n「然後他往側門走。那邊沒鏡頭，我事後才想通。」\n\n「我想追，但人潮在推。我也不知道該先救人還是先追人。」',
      choices: [
        {
          id: 'liang_s2_q1',
          label: '如果你再見到那個人，你認得出來嗎？',
          effects: [{ type: 'setFlag', flag: 'ch4_liang_s2_q1', value: true }],
        },
        {
          id: 'liang_s2_q2',
          label: '你覺得維護員該為那次事故負責嗎？',
          effects: [{ type: 'setFlag', flag: 'ch4_liang_s2_q2', value: true }],
        },
      ],
      next: (state: GameState): string | null => {
        if (state.flags.ch4_liang_s2_q1) return 'node_liang_s2_reply_q1';
        return 'node_liang_s2_reply_q2';
      },
    },
    node_liang_s2_reply_q1: {
      id: 'node_liang_s2_reply_q1',
      npcId: 'npc_liang_yian',
      text:
        '「鞋、背影、走路的方式——我記得，但我不是警方素描師。」\n\n「我能確定的是：他知道往哪逃，也知道哪裡拍不到。」\n\n「那種離場不像觀眾，像收工。」',
      choices: [
        {
          id: 'liang_s2_end',
          label: '（結束對話）',
          effects: [{ type: 'setFlag', flag: 'npc_liang_yian_sensitive_done', value: true }],
        },
      ],
    },
    node_liang_s2_reply_q2: {
      id: 'node_liang_s2_reply_q2',
      npcId: 'npc_liang_yian',
      text:
        '梁以安停了一秒，語氣軟下來：「不該。」\n\n「第一線的人跟我一樣，都是被推出去頂的。真正該回答問題的，不在面板旁邊。」\n\n「你們若只抓得到道歉的人，永遠只會拿到最便宜的結局。」',
      choices: [
        {
          id: 'liang_s2_end',
          label: '（結束對話）',
          effects: [{ type: 'setFlag', flag: 'npc_liang_yian_sensitive_done', value: true }],
        },
      ],
    },
  },
};

export { scenes, items, npcDialogs };
