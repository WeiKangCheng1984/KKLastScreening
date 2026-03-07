import { Scene, Item, NpcDialogNode } from '@/types/game';

// ch2 道具
const items: Record<string, Item> = {
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

};

// ch2 場景
const scenes: Record<string, Scene> = {
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
        id: 'npc_liu',
        name: '劉隊（偵查隊）',
        portraitExpression: 1,
        randomDialogs: [
          { id: 'ch2_liu_briefing', text: '「手機資料在這。你跟阿蘇先看，有結論再跟我說。」', type: 'hint', weight: 1 },
        ],
        available: true,
      },
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
};

const npcDialogs: Record<string, Record<string, NpcDialogNode>> = {};

export { scenes, items, npcDialogs };
