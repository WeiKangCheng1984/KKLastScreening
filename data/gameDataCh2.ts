import { Scene, Item, NpcDialogNode } from '@/types/game';

// ch2 道具：僅兩項進背包（其餘線索改為場景／互動框敘事）
const items: Record<string, Item> = {
  'item_encrypted_messages': {
    id: 'item_encrypted_messages',
    name: '加密訊息紀錄（部分解碼）',
    description:
      '阿蘇終端還原的 Unknown 對話殘本（中間仍有大量「無法還原」灰塊）。可讀段落包括：\n' +
      '「……為什麼不把資訊完整放出來？」\n' +
      '「……用三起事故來揭，讀者才會信。」\n' +
      '「……她也在場，你確定要這樣寫？」\n' +
      '「……先把節能那篇壓住，別讓他們拿『改善』當結案。」\n\n' +
      '時間戳愈靠近案發愈密、語氣愈像命令；格式近似烏鴉打字習慣，節奏卻異常乾淨。\n' +
      '研判：可能混有「代寫／代斷句」或刻意模仿；「三起」像欄位名而非情緒字。',
    svgImage: '/svg/items/projector_notes.svg',
    svgSize: 'medium',
    collectible: true,
  },
  'item_column_draft': {
    id: 'item_column_draft',
    name: '專欄草稿（節能設備／未發表）',
    description:
      '記事本終端全文。標題：「節能設備，誰省了電，誰省了責任？」\n\n' +
      '論點摘要：遠端照明與空調策略會改寫散場節奏；逃生動線「被看見的方式」可被管理；\n' +
      'log 寫入與巡檢紀錄存在權限接口，事故後補筆可讓流程看起來合理。\n' +
      '關鍵句：「有一部分的人，比較擅長把事故變成『改善提案』。」\n\n' +
      '末段未完成：「如果我要談這件事，得從兩年前的某個樓梯間開始。」\n' +
      '草稿未送出；最後編輯時間：命案前兩天。',
    svgImage: '/svg/items/schedule_modified.svg',
    svgSize: 'medium',
    collectible: true,
  },
};

// ch2 場景
const scenes: Record<string, Scene> = {
  'scene_ch2_cinema_entrance': {
    id: 'scene_ch2_cinema_entrance',
    chapterId: 'ch2',
    name: '城市影城大門口',
    description:
      '夜晚的城市影城門口，人潮已經散得差不多，只剩清潔人員和幾個還不想回家的影迷。霓虹招牌閃個不停，地上是被踩扁的爆米花和飲料杯，像一場還沒被收拾完的道具。警戒線在門邊拉出一個奇怪的框，提醒你這裡本來不是犯罪現場，卻突然被改成了。',
    background: '/images/bg_ch2_gate_v1.webp',
    hotspots: [
      { id: 'hotspot_gate_liu', shape: 'circle', coords: [0.4, 0.7, 0.8], description: '劉隊', hint: '劉隊站在門邊，手上還拿著剛才的簡報資料夾。' },
      { id: 'hotspot_gate_popcorn', shape: 'circle', coords: [0.7, 0.85, 0.3], description: '爆米花殘骸', hint: '散場後留下來的碎屑。' },
      { id: 'hotspot_gate_poster', shape: 'circle', coords: [0.13, 0.7, 0.3], description: '電影海報牆', hint: '幾張還沒來得及換掉的舊海報。' },
      { id: 'hotspot_gate_neon', shape: 'circle', coords: [0.55, 0.37, 0.9], description: '霓虹招牌', hint: '亮度有點不穩的「CITY CINEMA」字樣。' },
      { id: 'hotspot_gate_cordon', shape: 'circle', coords: [0.28, 0.62, 0.22], description: '門口警戒線', hint: '黃黑膠帶把「散場」框成另一種開場。' },
      { id: 'hotspot_gate_ticket_machine', shape: 'circle', coords: [0.88, 0.52, 0.2], description: '自助取票機', hint: '螢幕還亮著，像在加班證明自己很有用。' },
    ],
    items: [],
    hotspotEventMap: {
      hotspot_gate_liu: 'talk_liu_ch2_intro',
      hotspot_gate_popcorn: 'inspect_gate_popcorn',
      hotspot_gate_poster: 'inspect_gate_poster',
      hotspot_gate_neon: 'inspect_gate_neon',
      hotspot_gate_cordon: 'inspect_gate_cordon',
      hotspot_gate_ticket_machine: 'inspect_gate_ticket_machine',
    },
    events: [
      {
        id: 'talk_liu_ch2_intro',
        name: '與劉隊交談（第二章任務）',
        description: '',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text:
                '劉隊把資料夾夾在腋下，朝你點了一下門口方向。\n\n' +
                '劉隊：「死者手機資料在那邊。」\n' +
                '「技術組的阿蘇在車上，還在整理他留下來的東西。」\n\n' +
                '劉隊：「你先去跟她一起看一輪。」\n' +
                '「阿蘇你也熟吧，也敘敘舊吧。」',
              type: 'character',
              characterId: 'npc_liu',
              characterName: '劉隊（偵查隊）',
              characterExpression: 1,
              characterPosition: 'right',
            },
          },
          { type: 'setFlag', flag: 'ch2_task_from_liu', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'inspect_gate_popcorn',
        name: '爆米花殘骸',
        description: '',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text:
                '散場後的地上像是另一種畫面：爆米花、飲料杯、票根、發票，被踩成一層薄薄的「日常」。\n\n' +
                '它們不是證物，卻更像是見證者。',
              type: 'narrator',
            },
          },
        ],
      },
      {
        id: 'inspect_gate_poster',
        name: '電影海報牆',
        description: '',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text:
                '海報牆上還貼著近期的電影海報，很新很新。\n\n' +
                '有一張是驚悚片，標語寫著：「在電梯間，沒有人聽見尖叫。」\n' +
                '你盯了那句話一秒，不寒而慄，決定不要再看第二眼。',
              type: 'narrator',
            },
          },
        ],
      },
      {
        id: 'inspect_gate_neon',
        name: '霓虹招牌',
        description: '',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text:
                '「CITY CINEMA 城市影城」 的霓虹招牌，亮度不穩有些閃爍，深夜，你可能有點累了。\n\n' +
                '你突然想起兩年前的那場事故，心裡補了一句：\n' +
                '如果這種事寫進報告，大概會被說太戲劇化。',
              type: 'narrator',
            },
          },
        ],
      },
      {
        id: 'inspect_gate_cordon',
        name: '門口警戒線',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_gate_cordon' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text:
                '黃黑膠帶在風裡微微顫，像某種低成本紅毯。\n\n' +
                '你突然想到：如果命案是電影，這條線大概就是預告片——\n' +
                '「本週限定：真實案件，謝絕拍照，但歡迎在心裡重播。」\n\n' +
                '遠處清潔人員推著垃圾桶經過，腳步比圍觀的路人還鎮定。\n' +
                '城市很習慣把荒謬拉成日常；你只是剛好站在框線裡面而已。',
              type: 'narrator',
            },
          },
        ],
      },
      {
        id: 'inspect_gate_ticket_machine',
        name: '自助取票機',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_gate_ticket_machine' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text:
                '取票機螢幕還亮著，廣告輪播：「今晚加場，座位有限。」\n\n' +
                '你瞄了一眼時間——早就過了末場。\n' +
                '機器卻仍敬業地閃「請取票」，像一個被留在崗位上的臨演，劇本寫完了還在念台詞。\n\n' +
                '你沒按任何鍵。你只是在心裡幫它補一句旁白：\n' +
                '「H 排 12 號已售出，恕不退款，亦不提供人生重來。」',
              type: 'narrator',
            },
          },
        ],
      },
    ],
    puzzles: [],
    initialDialog: undefined,
    npcs: [
      {
        id: 'npc_liu',
        name: '劉隊（偵查隊）',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch2_liu_gate_idle_1', text: '「先去跟阿蘇看資料。她處理技術，你協助推理。」', type: 'hint', weight: 1 },
        ],
        available: true,
      },
    ],
  },
  // 車內熱點 9 個、無背包道具 → play 頁以探索進度解鎖電腦場（門檻與 6/9 互動對齊，見 handleSceneNavigation）
  'scene_ch2_asu_car': {
    id: 'scene_ch2_asu_car',
    chapterId: 'ch2',
    name: '阿蘇的車裡',
    description: '小型掀背車停在路邊。後座堆著筆電包、工具箱、幾卷網路線，半掩拉鍊露出纏在一起的線頭，像一團被放棄的脈絡。前座咖啡喝到一半，有種苦味在車內打轉。',
    background: '/images/bg_ch2_park_v1.webp',
    hotspots: [
      // 僅保留四個「還在破譯中」的手機相關互動，其餘完整內容移至電腦場景
      { id: 'hotspot_car_unknown_chat', shape: 'circle', coords: [0.5, 0.85, 0.3], description: '通訊紀錄 Unknown', hint: '阿蘇：「這通訊紀錄我還在跑還原，看有沒有機會還原。」' },
      { id: 'hotspot_car_notepad', shape: 'circle', coords: [0.6, 0.85, 0.3], description: '烏鴉的記事本筆記', hint: '烏鴉的記事本正在同步到終端，畫面上只解碼的進度條。' },
      { id: 'hotspot_car_recording', shape: 'circle', coords: [0.7, 0.85, 0.3], description: '錄音備忘_事故', hint: '錄音檔還在做降噪處理，波形抖得亂七八糟。' },
      { id: 'hotspot_car_location', shape: 'circle', coords: [0.8, 0.85, 0.3], description: '系統定位紀錄', hint: '定位資料還在重建軌跡，地圖一片馬賽克。' },
      { id: 'hotspot_car_toolbox', shape: 'circle', coords: [0.07, 0.8, 0.3], description: '後座工具箱', hint: '用不著也打不開，看了一眼上面的貼紙，寫著「線路是誠實的」。' },
      { id: 'hotspot_car_coffee', shape: 'circle', coords: [0.2, 0.94, 0.3], description: '便利商店咖啡杯', hint: '杯子上用油性筆寫著「A」和「S」。' },
      { id: 'hotspot_car_charm', shape: 'circle', coords: [0.95, 0.14, 0.3], description: '車上吊飾', hint: '後視鏡上掛著一個像素風電路板造型吊飾，很有工程師的幽默感。' },
      { id: 'hotspot_car_seatbelt', shape: 'circle', coords: [0.4, 0.9, 0.26], description: '副駕安全帶', hint: '卡扣在暗處，像故意躲年終考績。' },
      { id: 'hotspot_car_air_freshener', shape: 'circle', coords: [0.16, 0.2, 0.2], description: '出風口香氛夾', hint: '包裝寫「晨霧森林」，實際比較像「機房換新濾網」。' },
    ],
    // 案件相關道具改由電腦場景取得，車內僅作為「還在破譯中」的過場
    items: [],
    hotspotEventMap: {
      'hotspot_car_unknown_chat': 'examine_car_unknown_chat',
      'hotspot_car_notepad': 'examine_car_notepad',
      'hotspot_car_recording': 'examine_car_recording',
      'hotspot_car_location': 'examine_car_location',
      'hotspot_car_toolbox': 'examine_car_toolbox',
      'hotspot_car_coffee': 'examine_car_coffee',
      'hotspot_car_charm': 'examine_car_charm',
      'hotspot_car_seatbelt': 'examine_car_seatbelt',
      'hotspot_car_air_freshener': 'examine_car_air_freshener',
    },
    events: [
      {
        id: 'route_car_notepad',
        name: '記事本互動路由',
        description: '',
        requirements: [],
        effects: [
          { type: 'triggerEvent', eventId: 'examine_car_notepad' },
          { type: 'triggerEvent', eventId: 'replay_car_notepad' },
        ],
      },
      {
        id: 'examine_car_unknown_chat',
        name: '通訊紀錄 Unknown',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_car_unknown_chat' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '聊天視窗還在跑還原，進度條只有一點點，真正的內容被鎖在灰色方塊裡。',
              type: 'narrator',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（警方技術組）',
              characterExpression: 1,
              characterPosition: 'right',
              textSegments: [
                '「這通訊紀錄我先讓它自己跑。」',
                '阿蘇伸手在螢幕上點了一下那個 Unknown 的頭像。',
                '「等一下接上終端，你會看到整理過的版本。」',
              ],
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text:
                '你從殘影裡看到一些文字碎片，像是有人想把話說完：\n' +
                '「……為什麼不把資訊完……」「……用三起事故來揭……」「……她也在場，你確定要這樣寫？」\n\n' +
                '時間感很急，不像閒聊。',
              type: 'narrator',
            },
          },
        ],
      },
      // 章尾五題改在劉隊結算的 Ch2ReportEditor（雙格填空）進行；探索期不再從場景事件啟動舊問答樹。
      {
        id: 'examine_car_notepad',
        name: '烏鴉的記事本筆記',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_car_notepad' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '記事本 App 的畫面被蓋上一層「正在同步」的灰色蒙版，只看得到標題的一角在閃。',
              type: 'narrator',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（警方技術組）',
              characterExpression: 1,
              characterPosition: 'right',
              textSegments: [
                '「解碼資料和草稿很多，我先讓它們去終端排隊。」',
                '「等一下在電腦上看，你會比較有全貌。」',
              ],
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text:
                '標題欄一角閃過：「節能設備，誰省了電，誰省了責任？」\n\n' +
                '你記下他打算把散場節奏、散場的燈光亮暗寫進同一段論述，那不只是省電故事。',
              type: 'narrator',
            },
          },
        ],
      },
      // 原阿蘇 QA 主線已併入 ch2ReportConfig（雙格兩題＋手機省電謎）；此處僅保留現場檢視敘事。
      {
        id: 'examine_car_recording',
        name: '錄音備忘_事故',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_car_recording' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '錄音 App 的波形還在重繪，聲音軌被蓋上一層「背景處理中」的提示。',
              type: 'narrator',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（警方技術組）',
              characterExpression: 1,
              characterPosition: 'right',
              textSegments: [
                '「這段我先讓系統把聲音拉乾淨。」',
                '「等等你在電腦上看逐字稿，比在車裡硬聽清楚多了。」',
              ],
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text:
                '波形底下閃過檔名：「備忘_事故」。你彷彿聽見半句被壓低的聲音：\n' +
                '「……他們一直說那是個案。可是結案報告有兩個版本，一個給內部、一個給外面……」\n\n' +
                '然後就被切斷。',
              type: 'narrator',
            },
          },
        ],
      },
      {
        id: 'route_car_recording',
        name: '錄音互動路由',
        description: '',
        requirements: [],
        effects: [
          { type: 'triggerEvent', eventId: 'examine_car_recording' },
          { type: 'triggerEvent', eventId: 'replay_car_recording' },
        ],
      },
      {
        id: 'examine_car_location',
        name: '系統定位紀錄',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_car_location' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text: '地圖 App 的畫面被模糊成一團彩色馬賽克，只剩幾個座標點在閃爍。',
              type: 'narrator',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（警方技術組）',
              characterExpression: 1,
              characterPosition: 'right',
              textSegments: [
                '「定位我先丟去終端算軌跡。」',
                '「但應該只會得到一些亂繞的定位座標。」',
              ],
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text:
                '通訊錄的代號在你腦中先排成三格：「城市影城W—影廳見」、「聯合影城C—表單和審查」、「光芒影城R—梯間和試行」。\n\n' +
                '地圖圖上的定位跳點像在躲那棟老商辦；命案當晚他在影城外繞了很久，卻對不上任何正式行程。',
              type: 'narrator',
            },
          },
        ],
      },
      {
        id: 'route_car_location',
        name: '定位互動路由',
        description: '',
        requirements: [],
        effects: [
          { type: 'triggerEvent', eventId: 'examine_car_location' },
          { type: 'triggerEvent', eventId: 'replay_car_location' },
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
              characterName: '阿蘇（警方技術組）',
              characterExpression: 1,
              characterPosition: 'right',
              textSegments: [
                '這句不是我寫的，是以前一個同事送我的。',
                '他後來轉去做行銷了，從此之後就不再相信線路。',
                '線路不誠實，被當成廣告素材在寫，大概就會長成你手上這些簡報。'
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
              text: '前座杯架裡的一杯便利商店咖啡喝到一半，紙杯有點軟了，杯身用油性筆寫著「A」和「S」。',
              type: 'narrator',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（警方技術組）',
              characterExpression: 1,
              characterPosition: 'right',
              textSegments: [
                'A和S是什麼意思?猜不透。',
                '有那麼多心思，不如直接說。',
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
              text: '後視鏡上的像素風電路板吊飾在車裡晃來晃去，像城市的配電圖。',
              type: 'narrator',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（警方技術組）',
              characterExpression: 1,
              characterPosition: 'right',
              textSegments: [
                '這個本來是朋友做的 NFT，失敗得很徹底，我就把它拆回來當吊飾。',
                '你看，電路板晃來晃去，很像城市的配電圖。',
                '一開始大家都說要做去中心化，最後還是回到同一群人手上。有點可悲。'
              ],
            },
          },
        ],
        oneTime: true,
      },
      {
        id: 'examine_car_seatbelt',
        name: '副駕安全帶',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_car_seatbelt' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text:
                '副駕那條安全帶的扣具躲在陰影裡，你摸兩下才對準。\n\n' +
                '它卡住的方式很眼熟——跟某些「流程上沒問題、實務上就是過不了」的表單一樣，\n' +
                '明明該保護你，卻先考驗你的耐心。',
              type: 'narrator',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（警方技術組）',
              characterExpression: 1,
              characterPosition: 'right',
              textSegments: [
                '「別硬扯，那條跟我的耐心一樣，拉太多次就回不去了。」',
                '她眼睛仍黏在筆電上。',
                '「而且你如果真的需要保護，先保護好自己的睡眠。你眼下黑得跟 log 一樣。」',
              ],
            },
          },
        ],
      },
      {
        id: 'examine_car_air_freshener',
        name: '出風口香氛夾',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_car_air_freshener' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text:
                '出風口夾著一顆標榜「晨霧森林」的香氛膠囊，包裝印著過度快樂的綠葉。\n\n' +
                '但車內主味仍是隔夜咖啡與塑膠線材——兩種氣味在鼻腔裡開會，\n' +
                '結論大概是：「大自然輸給了加班。」',
              type: 'narrator',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（警方技術組）',
              characterExpression: 1,
              characterPosition: 'right',
              textSegments: [
                '「我本來買它是要蓋咖啡味。」',
                '「結果現在聞起來像——森林裡有人邊慢跑邊幫伺服器換風扇。」',
                '她嘴角抽一下：「至少比『命案現場』好聞一點點。真的，只有一點點。」',
              ],
            },
          },
        ],
      },
    ],
    puzzles: [],
    initialDialog: {
      text: '阿蘇把筆電翻開，線在她指尖繞一圈，插進警方提供的解密終端。\n\n阿蘇：「坐好。」\n她視線沒離開螢幕。\n\n阿蘇：「手機解完密，只是開始。接下來要解讀這個人。」\n阿蘇：「我先說清楚，我是技術組支援鑑定的，只負責資料。我不替誰背書。」\n她停半秒，又補一句，像在防禦。\n阿蘇：「資料有時候也不值得信任。」',
      type: 'narrator',
    },
    npcs: [
      {
        id: 'npc_liu',
        name: '劉隊（偵查隊）',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch2_liu_briefing', text: '「手機資料在這。她處理技術，你協助推理。」', type: 'hint', weight: 1 },
        ],
        available: true,
      },
      {
        id: 'npc_asu',
        name: '阿蘇（警方技術組）',
        portrait: '/svg/characters/asu.svg',
        randomDialogs: [
          { id: 'asu_casual_1', text: '「你看這些訊息，像威脅，又有一點像兩個人在互相拗稿。」', type: 'casual', weight: 3 },
          { id: 'asu_casual_2', text: '「做技術支援的最怕兩種人，一種是什麼都不懂，一種是懂太多還故意裝不知道。」', type: 'casual', weight: 2 },
          { id: 'asu_casual_3', text: '「他把企業惡習寫進專欄，結果自己被留在影城裡，是不是有點好笑？」', type: 'casual', weight: 2 },
          { id: 'asu_casual_4', text: '「節能設備本來是好東西啊，省電、省錢，所有簡報都這樣寫，只是會不會省掉太多?」', type: 'casual', weight: 2 },
          { id: 'asu_casual_5', text: '「系統通常比人老實，可是設計系統的人不一定。這點我很有資格抱怨，但我不太想說。」', type: 'casual', weight: 2 },
          { id: 'asu_casual_6', text: '「他給聯絡人取名字的方式全部用代碼。這種人死掉，調查起來很煩。」', type: 'casual', weight: 2 },
          { id: 'asu_casual_7', text: '「『三起事故』這個說法，是什麼，預告嗎? 預兆嗎?」', type: 'casual', weight: 2 },
          { id: 'asu_casual_8', text: '「如果你把這些聊天紀錄當成八卦，它們就只會變成八卦。」', type: 'casual', weight: 2 },
          { id: 'asu_casual_9', text: '「烏鴉很像在做現場鑑定，卻沒受過專業訓練，把城市當機房亂摸。他會這樣寫，大概是不懂，或太懂。」', type: 'casual', weight: 2 },
          { id: 'asu_casual_10', text: '「喔對，兩年前，我有回過他的信，我和他頻率不同，沒想到…」\n(她話說到一半停住，手指在方向盤上敲了兩下。)', type: 'casual', weight: 2 },
        ],
        available: true,
      },
    ],
  },
  'scene_ch2_asu_desktop': {
    id: 'scene_ch2_asu_desktop',
    chapterId: 'ch2',
    name: '阿蘇的電腦畫面',
    description:
      '終端機把車上那些「還在跑」的畫面接成完整版：Unknown 對話還原、記事本草稿全文、降噪後的逐字稿、重建過的定位軌跡，外加一張她替你排好的總覽看板。',
    background: '/images/bg_ch2_desktop_v1.webp',
    hotspots: [
      {
        id: 'hotspot_pc_overview',
        shape: 'circle',
        coords: [0.25, 0.25, 0.4],
        description: '總覽看板',
        hint: '把車上四塊螢幕殘影對回終端：這裡是起點。',
      },
      {
        id: 'hotspot_pc_unknown_chat',
        shape: 'circle',
        coords: [0.13, 0.6, 0.4],
        description: 'Unknown 對話（還原版）',
        hint: '還原後的對話殘本。',
      },
      {
        id: 'hotspot_pc_column_draft',
        shape: 'circle',
        coords: [0.72, 0.18, 0.4],
        description: '專欄草稿（全文）',
        hint: '烏鴉還沒發出去的完整論述與刪改痕。',
      },
      {
        id: 'hotspot_pc_recording',
        shape: 'circle',
        coords: [0.85, 0.58, 0.5],
        description: '錄音逐字稿',
        hint: '「備忘_事故」拉乾淨後的一字一句。',
      },
      {
        id: 'hotspot_pc_location',
        shape: 'circle',
        coords: [0.85, 0.2, 0.4] ,
        description: '行蹤重建圖',
        hint: 'W／C／R 與老商辦之間繞不出來的軌跡。',
      },
      {
        id: 'hotspot_pc_monitor_sticky',
        shape: 'circle',
        coords: [0.48, 0.08, 0.14],
        description: '螢幕上方攝影機',
        hint: '攝影機很小，很不起眼。',
      },
      {
        id: 'hotspot_pc_taskbar_trash',
        shape: 'circle',
        coords: [0.92, 0.92, 0.12],
        description: '工作列回收筒圖示',
        hint: '空空的，卻莫名有壓力。',
      },
    ],
    items: [items.item_encrypted_messages, items.item_column_draft],
    hotspotEventMap: {
      hotspot_pc_overview: 'inspect_pc_overview',
      hotspot_pc_unknown_chat: 'pc_view_unknown_chat',
      hotspot_pc_column_draft: 'pc_view_column_draft',
      hotspot_pc_recording: 'pc_view_recording',
      hotspot_pc_location: 'pc_view_location',
      hotspot_pc_monitor_sticky: 'inspect_pc_monitor_sticky',
      hotspot_pc_taskbar_trash: 'inspect_pc_taskbar_trash',
    },
    events: [
      {
        id: 'inspect_pc_overview',
        name: '瀏覽阿蘇整理出的案情資料',
        description: '',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text:
                'Unknown 聊天窗、記事本同步蒙版、錄音降噪、定位馬賽克——\n' +
                '現在像四張透明片被疊到同一張桌面上。\n\n' +
                '阿蘇用觸控筆在邊緣寫了編號：①通訊殘句 ②專欄草稿 ③口頭備忘 ④節點地圖。\n' +
                '技術的極限似乎就到這裡。',
              type: 'narrator',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text:
                '阿蘇：「盡力還原了。」\n' +
                '「這些算是他生前最後一次，試著把碎片排成故事。」\n\n' +
                '阿蘇：「四個視窗不是四份證物，是一條線：誰在跟他說話、他打算寫什麼、他私下怕什麼、他的腳實際踩過哪裡。」\n' +
                '烏鴉究竟是什麼樣的人?」',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（警方技術組）',
              characterExpression: 1,
              characterPosition: 'right',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text:
                '看板置頂欄替你補齊身分：死者吳亞，筆名與圈內綽號「烏鴉」，專欄長期寫城市基建、外包驗收與公共安全。\n\n' +
                '關鍵字在終端里被自動標色：節能設備、散場節奏、逃生動線亮度、log寫入權限、改善提案。\n' +
                '這些全是那種「聽起來很行政」的詞，堆在一起卻像有人在替事故編目錄。\n\n' +
                '你想起車裡那杯咖啡杯上的「A」「S」，與後視鏡上晃來晃去的電路板吊飾：\n' +
                '一個人如果同時相信線路與文案，他死掉的方式往往也不是單一原因。',
              type: 'narrator',
            },
          },
        ],
      },
      {
        id: 'pc_view_unknown_chat',
        name: '查看 Unknown 對話殘句',
        description: '',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text:
                '終端把 Unknown 對話還原成「可讀的殘本」：中間仍有大片灰塊，像被人用橡皮擦從時間軸上抹過。\n\n' +
                '但車裡那幾個你瞇眼才看見的破口，現在連成一段更可辨認的語氣——\n\n' +
                '「……為什麼不把資訊完整放出來？」\n' +
                '「……用三起事故來揭，讀者才會信。」\n' +
                '「……她也在場，你確定要這樣寫？」\n' +
                '「……先把節能那篇壓住，別讓他們拿『改善』當藉口。」\n\n' +
                '這些拼拼湊湊的訊息，字很短像命令；甚至有幾則只剩貼圖，還有已刪除的字樣。',
              type: 'narrator',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（警方技術組）',
              characterExpression: 1,
              characterPosition: 'right',
              textSegments: [
                '阿蘇把「三起事故」那行字用螢光筆圈起來，又圈「她也在場」。',
                '「你有看見結構嗎?」',
                '「『三起』像欄位名，不是情緒字。」',
                '她停頓：「至於『她』可能是人，可能是代號，也可能是故意讓你分心的釘子。」',
                '「格式很像他平常打字習慣，但節奏太乾淨。乾淨到像另一隻手在替他斷句。」',
              ],
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text:
                '你把對話當成兩層來讀：\n\n' +
                '表層是「寫不寫、什麼時候發、誰會被拖下水」的拉扯；\n' +
                '底層是「誰能命令他要不要發稿」。\n\n' +
                '這些訊息，突然令人感覺冷：\n' +
                '像有人早就算好，烏鴉只要再往前一步，就會踩進一個已經寫好的標題裡。',
              type: 'narrator',
            },
          },
          { type: 'addItem', itemId: 'item_encrypted_messages' },
          { type: 'setFlag', flag: 'ch2_pc_unknown_viewed', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'pc_view_column_draft',
        name: '查看未發表專欄草稿',
        description: '',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text:
                '記事本被拉到全螢幕，標題完整露出——正是你在車裡隔著同步蒙版瞥見的那一句：\n' +
                '「節能設備，誰省了電？」\n\n' +
                '正文像被打過仗：刪除線、註解泡泡、紅字問號叠在段落旁。\n\n' +
                '他寫遠端照明如何改寫「散場的節奏」：燈暗得快，人潮走得快，監視與紀錄的空白就長得合理。\n' +
                '他寫空調與機房策略如何影響「逃生動線被看見的方式」。\n' +
                '權限改寫、流程很正常，至少一切看起來像流程。\n\n' +
                '一行被反覆改寫的句子卡在畫面中央：\n' +
                '「有一部分的人，總愛把喪事當喜事辦。」\n\n' +
                '游標停在最後一段未完成稿：\n' +
                '「如果我要談這件事，得從兩年前的某個樓梯間開始講起。」',
              type: 'narrator',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（警方技術組）',
              characterExpression: 1,
              characterPosition: 'right',
              textSegments: [
                '阿蘇指著「散場節奏」四個字：「你以為他在寫影評？」',
                '「他在寫『現場怎麼被管理』。」',
                '「我總以為八卦雜誌會再八卦一些，結果什麼都沒有。」',
                '「這句一出去，公關會說你陰謀論；工程會說你不懂成本；讀者會說你太愛管閒事。」',
                '「但烏鴉是憤世嫉俗嗎? 不是。他是想找出設備接口、權限接口、外包接口。」',
              ],
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text:
                '你想起車裡那個只露一角的標題，與阿蘇說的「去終端排隊」。\n\n' +
                '這是一份被拼拼湊湊的清單：\n' +
                '同一件事，在簡報上叫節能；在現場叫動線；在報告裡面叫結案；在人心裡叫誰還敢說真話。\n\n' +
                '草稿沒送出。最後編輯時間，停在命案前兩天。他在猶豫。',
              type: 'narrator',
            },
          },
          { type: 'addItem', itemId: 'item_column_draft' },
          { type: 'setFlag', flag: 'ch2_pc_column_viewed', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'pc_view_recording',
        name: '查看錄音逐字稿',
        description: '',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text:
                '檔名仍是你在車裡看見的那個：「備忘_事故」。波形被拉直後，逐字稿一行行浮上來，像從噪音裡被救回的證詞。\n\n' +
                '聲音經過變聲與降噪，語調反而更冷：\n\n' +
                '「……他們一直說那是個案。個案就很好結案。」\n' +
                '「可是結案報告有兩個版本，一個給內部、一個給外面……內部那份多兩頁附件，外面那份多兩句漂亮話。」\n' +
                '「你問我哪一份比較真？兩份都真。真的地方不一樣而已。」\n\n' +
                '「節能那套上線之後，誰能遠端改亮度、誰能改寫巡檢紀錄，我講過一次了……他們當我講故事。」\n\n' +
                '背景音裡有鍵盤聲與遠遠的廣播回聲，像在某個影城後台錄的。\n' +
                '最後一句斷在吸氣聲：「如果他要把三起串起來……」然後錄音結束。',
              type: 'narrator',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（警方技術組）',
              characterExpression: 1,
              characterPosition: 'right',
              textSegments: [
                '阿蘇把「兩個版本」反白：「這不是八卦，是工作流程。」',
                '「外面要好看，內部要能扛稽核。兩份都合法，又不能太矛盾，拼起來也太合理。」',
                '她點一下註記欄：「講話者身分我還在對。能確定的是——他知道內部那份附件長什麼樣。」',
                '「這種人一定不是路人，是曾經在簡報室坐過，知道兩份報告怎麼寫才合理的人。」',
              ],
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text:
                '你在車裡只聽見半句被切斷的恐慌；終端裡它變成可反覆朗讀的文字。\n\n' +
                '它和 Unknown 對話里那句「用三起事故來揭」彼此呼應：\n' +
                '一邊像有人在催稿，一邊像有人在警告「別把內部那兩頁講出去」。\n\n' +
                '你闔上眼一秒，想起那些粉飾太平的手法——\n' +
                '總有一批人把「怎麼說」拆成兩套。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'ch2_pc_recording_viewed', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'pc_view_location',
        name: '查看行蹤與節點地圖',
        description: '',
        requirements: [],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text:
                '車裡那片馬賽克地圖，在終端上被補成可讀的軌跡層。\n\n' +
                '三個影城節點用代號標著：\n' +
                'W（城市影城）\n' +
                'C（聯合影城）\n' +
                'R（光芒影城）\n\n' +
                '第四個重點不是影城，而是一棟老商辦：電梯慢、樓梯間監視薄弱、會議室玻璃窗反射對街招牌。\n' +
                '命案前一週，他的定位在這四點之間來回折返，路線不像通勤，像壓力測試——\n' +
                '就算破解了軌跡，仍是混亂一片。',
              type: 'narrator',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（警方技術組）',
              characterExpression: 1,
              characterPosition: 'right',
              textSegments: [
                '阿蘇把時間軸拉到命案當晚：「他提前很久到 W 附近。」',
                '「不是趕場，是在等。」',
                '「等散場？等某個設備狀態切換？還是等一個『對外說法』來得及的時間窗？」',
                '她把三個圈連成三角形，老商辦放在重心：「你如果把三個影城當三個題目，這棟樓像答案頁。」',
                '「三個節點都踩過。沒有一個單獨的死角。」',
              ],
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text:
                '你把地圖與另外三個視窗對齊：\n\n' +
                'Unknown 對話在催「三起」的敘事；草稿在寫節能與動線如何改寫責任；\n' +
                '錄音在講兩份結案報告如何並存。\n\n' +
                '而這張軌跡像第四種證據：不是說他做了什麼，而是他用腳投票——\n' +
                '他死前把城市拆成幾個可重複測試的點，像要把「個案」排成「序列」。\n\n' +
                '你忽然理解阿蘇在車上為什麼只肯給馬賽克：\n' +
                '沒有前因後果的定位，只會變成八卦地圖；有前因後果，才會變成有人在布局。',
              type: 'narrator',
            },
          },
          { type: 'setFlag', flag: 'ch2_pc_location_viewed', value: true },
        ],
        oneTime: true,
      },
      {
        id: 'inspect_pc_monitor_sticky',
        name: '螢幕上緣便利貼',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_pc_monitor_sticky' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text:
                '螢幕上緣貼了一張螢光黃便利貼，邊角捲起，像被鍵盤熱氣烘過。\n\n' +
                '上面字體很阿蘇：\n' +
                '「① 終端不是給你跳過車上那段用的——是給你看完的。」\n' +
                '「② 劉隊若打來，先問他要口頭版還是要可存檔版。」\n' +
                '「③ 泡麵禁止。上次湯灑在鍵盤上，鑑定說那是『不明黏性檢體』。」\n\n' +
                '第三條後面有人用鉛筆補了小字：「……其實是我。」\n' +
                '你決定當作沒看見，免得阿蘇今晚多一個滅口名單。',
              type: 'narrator',
            },
          },
        ],
      },
      {
        id: 'inspect_pc_taskbar_trash',
        name: '工作列回收筒',
        description: '',
        requirements: [{ type: 'hasInteracted', hotspotId: 'hotspot_pc_taskbar_trash' }],
        effects: [
          {
            type: 'showDialog',
            dialog: {
              text:
                '游標移到回收筒圖示上，系統提示跳出：「垃圾桶是空的。」\n\n' +
                '你盯著那行字，腦中自動跑過另一套翻譯：\n' +
                '「尚未刪除的版本」不在這裡；「對外說法」也不在這裡；\n' +
                '甚至「你以為可以一鍵清掉的尷尬」——通常都清不掉。\n\n' +
                '你默默把游標移開，像怕驚動某個負責稽核的幽靈程序。',
              type: 'narrator',
            },
          },
          {
            type: 'showDialog',
            dialog: {
              text: '',
              type: 'character',
              characterId: 'npc_asu',
              characterName: '阿蘇（警方技術組）',
              characterExpression: 1,
              characterPosition: 'right',
              textSegments: [
                '「別點『永久刪除』，那只是UI在安慰你。」',
                '「真的想讓東西消失，得走流程、寫申請、留紀錄——很諷刺吧？」',
                '她沒抬頭：「跟結案報告一樣，刪得掉的通常是桌面；刪不掉的是附件。」',
              ],
            },
          },
        ],
      },
    ],
    puzzles: [],
    initialDialog: undefined,
    npcs: [
      {
        id: 'npc_asu',
        name: '阿蘇（警方技術組）',
        portrait: '/svg/characters/asu.svg',
        randomDialogs: [
          { id: 'asu_pc_idle_1', text: '「這些東西不是證物箱，是他在替自己整理的線索。」', type: 'casual', weight: 2 },
        ],
        available: true,
      },
    ],
  },

  // ========== 第三章：預測（電影院 B 和 C） ==========
  // 可探索空間一：電影院 B（推測地點）
};

const npcDialogs: Record<string, Record<string, NpcDialogNode>> = {
  // 第二章 阿蘇敏感（二選一）：①敘舊／過去疙瘩 ②問案／鑑定與技術邊界
  npc_asu: {
    'node_asu_sensitive1_1': {
      id: 'node_asu_sensitive1_1',
      npcId: 'npc_asu',
      text:
        'KK沒有先講終端，也沒有先講烏鴉。\n\n' +
        'KK：「阿蘇，我們上次把話講死，是兩年前那個樓梯間之後吧。」\n\n' +
        '阿蘇手指停在鍵盤上，像被那四個字燙到。\n' +
        '阿蘇：「你現在要跟我算帳？」\n\n' +
        'KK：「無所謂。我來是想問妳，烏鴉究竟是什麼樣的人？」',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_asu_sensitive1_2',
    },
    'node_asu_sensitive1_2': {
      id: 'node_asu_sensitive1_2',
      npcId: 'npc_asu',
      text:
        '阿蘇吐一口氣，聲音壓得很低。\n\n' +
        '阿蘇：「你寫那篇報告的時候，很帥。引我的備註，刪我的但書，把『技術上無法排除』寫得像『就是他們幹的』。」\n' +
        '「你得到了你要的。」\n\n' +
        'KK：「所以妳覺得我拿妳當刀。」\n\n' +
        '阿蘇：「你不是拿我當刀。你是拿『鑑定』當標題，讓所有人都以為那是一份乾淨的科學結論。」\n' +
        '她看著螢幕反光裡的你：「其實那只是某一個版本的報告。」',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_asu_sensitive1_3',
    },
    'node_asu_sensitive1_3': {
      id: 'node_asu_sensitive1_3',
      npcId: 'npc_asu',
      text:
        'KK：「但兩年前妳提供的那份報告，附件的資料。外面那份沒有。」\n\n' +
        '阿蘇沉默很久。\n\n' +
        '阿蘇：「你當時如果照著內部附件寫，你會被叫去喝咖啡，喝到胃穿孔。」\n' +
        '「你照著外面那份寫，你會覺得自己很正義，但我很難接受。」\n' +
        '「我說服不了任何人，我選擇把嘴閉上，繼續做我該做的技術鑑定。」\n\n' +
        'KK：「然後我就變成妳心裡那個『把事故當素材』的人。」\n\n' +
        '阿蘇：「這不是我心裡的結論。」',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_asu_sensitive1_4',
    },
    'node_asu_sensitive1_4': {
      id: 'node_asu_sensitive1_4',
      npcId: 'npc_asu',
      text:
        'KK：「那烏鴉呢？兩年前，妳對他就比較客氣？」\n\n' +
        '阿蘇像被逗笑，又笑不出來。\n\n' +
        '阿蘇：「他寄信來的時候，字比你還多，情緒比你還滿。每一封都像在指控我『幫兇』。」\n' +
        '「我回得很爛。我說：『那是你自己的價值判斷。』。」\n\n' +
        'KK：「妳的價值判斷，我的價值判斷，他的價值判斷，還有誰的價值判斷？」\n\n' +
        '阿蘇：「不重要了。烏鴉也死了。」\n' +
        '「只是他後來寫文章，放慢了多，我以為他怕了，學會隱忍了。現在我才知道，他可能不是怕。」',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_asu_sensitive1_5',
    },
    'node_asu_sensitive1_5': {
      id: 'node_asu_sensitive1_5',
      npcId: 'npc_asu',
      text:
        'KK：「所以妳今晚還坐在這，不是為了劉隊。」\n\n' +
        '阿蘇把筆電蓋上又掀開，動作粗暴得像在揍自己。\n\n' +
        '阿蘇：「我為什麼要在這？因為他死在同一種流程裡。」\n' +
        '「節能、動線、紀錄、版本，你以為換了場景就不是同一套刀法？」\n\n' +
        'KK：「妳是在贖罪，還是在盯著我，怕我又把妳的技術鑑定剪成標題？」\n\n' +
        '阿蘇呆看著，眼眶沒紅，但聲音第一次有點裂。\n' +
        '阿蘇：「我在盯資料。你愛怎麼寫是你的事。」\n' +
        '「一直以來我都沒辦法說服任何人，我只能做好我該做的技術鑑定。」',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_asu_sensitive1_6',
    },
    'node_asu_sensitive1_6': {
      id: 'node_asu_sensitive1_6',
      npcId: 'npc_asu',
      text:
        '你們兩個之間的空氣像拉緊的網路線，一扯就會露出銅芯。\n\n' +
        'KK：「我一直都知道，也努力記住了。」\n\n' +
        '阿蘇把視線移回螢幕，像把情緒硬塞回終端。\n' +
        '阿蘇：「疙瘩不會因為你問了就消失。我也不需要你道歉。」\n' +
        '「人終究只需要對得起自己。」\n\n' +
        '她補上一句，輕得像刀背：\n' +
        '「兩年前那件事，我還沒想好，今晚的事情也很大，我也還沒想好。」',
      choices: [
        {
          id: 'choice_asu_s1_done',
          label: '（結束對話）',
          description: '',
          effects: [{ type: 'setFlag', flag: 'npc_asu_sensitive_done', value: true }],
        },
      ],
    },
    'node_asu_sensitive2_1': {
      id: 'node_asu_sensitive2_1',
      npcId: 'npc_asu',
      text:
        'KK：「這些線索像是雜亂的拼圖，妳能拼出什麼？」\n\n' +
        '「Unknown 對話、逐字稿、軌跡，每一個環節，妳覺得烏鴉可能想做什麼？」\n\n' +
        '阿蘇眼神立刻變回技術組那種乾淨的冷。\n' +
        '阿蘇：「我能保證我們接手的容器沒被換過，哈希對得上扣押清單。」\n' +
        '「我不能保證手機在他生前沒被人動過，那是現場與扣押段的問題。」\n\n' +
        'KK：「所以鑑定從哪一刀開始算『可信』？」\n\n' +
        '阿蘇：「從我們寫進報告的那一刀開始。之前都叫『條件』。」',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_asu_sensitive2_2',
    },
    'node_asu_sensitive2_2': {
      id: 'node_asu_sensitive2_2',
      npcId: 'npc_asu',
      text:
        'KK：「那 Unknown 還原呢？灰塊是遺失還是被抹掉？」\n\n' +
        '阿蘇：「兩種都可能。技術上我只能說：被抹掉的通常會留下不自然的邊界——我們有看到那種邊界。」\n' +
        '「至於『像他的打字習慣』這種話，只能當輔助，不能當結論。習慣可以被模仿，斷句也可以被學。」\n\n' +
        'KK：「所以妳才說『格式像他，語氣不像』。」\n\n' +
        '阿蘇：「對。那不是浪漫形容，是風險提示。」\n' +
        '「有人在餵他句子，或有人在用他熟悉的排版逼他相信『這是自己人』。」\n\n' +
        'KK：「你能證明嗎？」\n\n' +
        '阿蘇：「我不能。我只能把不自然處標紅，讓你們去問人。」',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_asu_sensitive2_3',
    },
    'node_asu_sensitive2_3': {
      id: 'node_asu_sensitive2_3',
      npcId: 'npc_asu',
      text:
        'KK：「錄音呢？變聲、降噪，會不會把關鍵咬字抹成『合理』？」\n\n' +
        '阿蘇：「會。所以我們保留原始檔，另開處理鏈。你現在看到的逐字稿是處理鏈產物——旁邊那條波形才是母帶。」\n' +
        '「母帶上如果出現不連續，我會寫『可能存在剪接或重採樣風險』。」\n\n' +
        'KK：「『兩份結案』那種說法，妳能從技術上印證嗎？」\n\n' +
        '阿蘇：「我只能印證『兩份文件的欄位與附件不一致』。至於誰授權、誰簽核——那不是我能用鍵盤證明的。」\n' +
        '她停一下：「但你可以把『兩份』當成接口。接口背後通常有人。」',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_asu_sensitive2_4',
    },
    'node_asu_sensitive2_4': {
      id: 'node_asu_sensitive2_4',
      npcId: 'npc_asu',
      text:
        'KK：「定位軌跡—— spoofing、基站漂移、App 後台喚醒，妳排除到哪裡？」\n\n' +
        '阿蘇：「我能做的是交叉比對：同時間是否有同帳號登入、同裝置識別碼是否一致、軌跡是否符合物理移動節奏。」\n' +
        '「如果有人用權限在伺服器端改紀錄，我會看到『漂亮得不像真的』。」\n\n' +
        'KK：「妳有看到嗎？」\n\n' +
        '阿蘇：「我看到的是他很執著地在三個節點之間繞——那比單點造假更麻煩。」\n' +
        '「因為那代表他不是被拖著走，他是在測試什麼。」\n\n' +
        'KK：「測試什麼？」\n\n' +
        '阿蘇：「測試哪一段路最常被寫進對外說法，哪一段最容易從報告里消失。」',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_asu_sensitive2_5',
    },
    'node_asu_sensitive2_5': {
      id: 'node_asu_sensitive2_5',
      npcId: 'npc_asu',
      text:
        'KK：「如果我要動手腳，我會從哪裡下手？」\n\n' +
        '阿蘇看了你很久，像在評估你是不是在自首。\n\n' +
        '阿蘇：「最省力的是敘事，不是檔案。」\n' +
        '「檔案要對哈希、對鏈條，成本高。」\n' +
        '「但『怎麼講給媒體聽』成本低——你只要挑對句子，讀者會自己幫你結案。」\n\n' +
        'KK：「所以『三起事故』可能是釘子。」\n\n' +
        '阿蘇：「對。釘子不用是真的，只要夠尖。」\n' +
        '「『她也在場』也是。它讓你分神去猜人，而不是去查權限。」\n\n' +
        'KK：「妳能給我一句底線嗎？」\n\n' +
        '阿蘇：「我的底線是：任何我沒寫進鑑定報告的推測，你都不准替我講成『技術已確認』。」',
      choices: [{ id: 'choice_next', label: '繼續', description: '下一段' }],
      next: 'node_asu_sensitive2_6',
    },
    'node_asu_sensitive2_6': {
      id: 'node_asu_sensitive2_6',
      npcId: 'npc_asu',
      text:
        '阿蘇把終端畫面切回四宮格，像在替今晚蓋章。\n\n' +
        '阿蘇：「你要技術，我就給你到這裡。」\n' +
        '「再往下不是鑑定，是劇本。」\n\n' +
        'KK：「妳怕我又寫成標題。」\n\n' +
        '阿蘇：「我怕的是有人會借你的標題去關燈。」\n' +
        '「烏鴉已經死了一次。我不想再看第二個人死在『大家都以為真相已經出來』的那一刻。」\n\n' +
        '她把一支 USB 推回讀卡槽，動作很輕，卻像下最後通牒。\n' +
        '阿蘇：「記住：我能證明資料長什麼樣。我不能證明人心長什麼樣。」',
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

export { scenes, items, npcDialogs };
