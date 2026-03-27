import { Chapter } from '@/types/game';

// 序章文案（KK流程偵探：最後一場放映）
export const prologueSlides: string[] = [
  '凌晨00:39，你的手機震了一下。',
  '一通沒有顯示來電的電話，像城市不想留下指紋。',
  '「KK？」對方壓低聲音，「偵查隊。需要你來一趟。」',
  '你坐起來，窗外的霓虹還亮著，像一部不肯散場的電影。',
  '「哪裡？」',
  '「城市影城。散場後大概五分鐘左右，有一名看電影的人，死在H排12號。頸部壓迫，幾乎沒有掙扎。」',
  '你沒立刻回話，靜靜地聽著。',
  '對方接著說，像把真正的刀遞到你手上：',
  '「散場的燈，似乎延後三分鐘亮起。」',
  '你不是警察，也不是英雄。你只是KK。',
  '一個警方私下非常信任的外部偵探。',
  '你拉上外套，拿起筆記本，展開了一個新的任務。',
];

// 章節定義（輕量：供 intro、prologue、play 章節列表與 meta 使用）
export const chapters: Record<string, Chapter> = {
  ch1: {
    id: 'ch1',
    name: '第一章：城市影城',
    description: '死在散場之後的人',
    scenes: ['scene_ch1_cinema_a_hall', 'scene_ch1_projection_room', 'scene_ch1_restroom'],
    intro: {
      title: '第一章：城市影城',
      subtitle: '死在散場之後的人',
      description: '散場後人群聲很吵。塑膠杯、手機光、鞋底黏住地毯的聲音。可這個人死得太安靜。',
      moodText: '散場後最暗的不是影廳。是每個人都想快點回到「正常」。而兇手，似乎就是在正常裡動手。',
      ambientAudio: '/audio/bgm/kk_bgm_title_ch1.mp3',
    },
  },
  ch2: {
    id: 'ch2',
    name: '第二章：死者是誰',
    description: '手機裡的線索',
    scenes: ['scene_ch2_cinema_entrance', 'scene_ch2_asu_car', 'scene_ch2_asu_desktop'],
    intro: {
      title: '第二章：死者是誰',
      subtitle: '手機裡的線索',
      description: '警方技術組阿蘇把解完密的手機資料接上終端，要你一起看懂死者留下的訊息、草稿、錄音和行蹤。\n\n你要查的，不只是他的身分，還有他正在追的那條線。',
      moodText: '你習慣先看現場，再看名字。這一次，名字藏在手機裡。\n\n一則訊息、一段錄音、一份沒寫完的草稿，都像在把案件往外拉。',
      ambientAudio: '/audio/bgm/kk_bgm_title_ch2.mp3',
    },
  },
  ch3: {
    id: 'ch3',
    name: '第三章：封鎖的大廳',
    description: '誰能動整個場館',
    scenes: ['scene_ch3_lobby_front', 'scene_ch3_brand_room', 'scene_ch3_server_corridor'],
    intro: {
      title: '第三章：封鎖的大廳',
      subtitle: '誰能動整個場館',
      description: '死者手機裡的線索指向三間影城、一套系統。\n\n現在，城市影城的大廳被封鎖了，品牌方和技術組都來了，各自準備好一個版本的說法。',
      moodText: '「你要整理版，今天就能結案。你要原始檔，今晚很多人睡不好。」\n\nlog 能被整理。問題是，你願不願意讓它繼續被整理下去。',
      ambientAudio: '/audio/bgm/kk_bgm_title_ch3.mp3',
    },
  },
  ch4: {
    id: 'ch4',
    name: '第四章：光芒影城',
    description: '未遂的事故',
    scenes: ['scene_ch4_stairwell', 'scene_ch4_control_panel', 'scene_ch4_main_hall'],
    intro: {
      title: '第四章：光芒影城',
      subtitle: '未遂的事故',
      description: '第二起事故沒有人死——上過小媒體、影城推維護員出來對鏡頭道歉，導演反而和觀眾站在同一邊罵體制，最後仍被說成偶發。\n\n但樓梯間的燈比應該亮的時間早了 3 分鐘，有人差點在黑暗裡摔下去。\n\n陳佑誠說他早就回報過漏洞。你要找到那份回報去了哪裡。',
      moodText: '我開始討厭「差一點」這三個字。\n\n它們通常只是下次的預告。',
      ambientAudio: '/audio/bgm/kk_bgm_title_ch4.mp3',
    },
  },
  ch5: {
    id: 'ch5',
    name: '第五章：嫌疑矩陣',
    description: '誰是手、誰是腦',
    scenes: ['scene_ch5_data_room', 'scene_ch5_log_lab', 'scene_ch5_lin_office'],
    intro: {
      title: '第五章：嫌疑矩陣',
      subtitle: '誰是手、誰是腦',
      description: '嫌疑名單攤在桌上，高文傑的欄位填得最滿，林子睿的欄位填得最少。\n\n你要弄清楚：高文傑是手，還是被借來的手。而那個借了他名字的人，在哪個層級。',
      moodText: '動機能被剪裁。\n\n問題不是誰看起來最可疑，而是誰需要另一個人看起來最可疑。',
      ambientAudio: '/audio/bgm/kk_bgm_title_ch5.mp3',
    },
  },
  ch6: {
    id: 'ch6',
    name: '第六章：最後一場放映',
    description: '敘事決戰',
    scenes: ['scene_ch6_screening_hall', 'scene_ch6_control_room', 'scene_ch6_press_corridor'],
    intro: {
      title: '第六章：最後一場放映',
      subtitle: '敘事決戰',
      description: '第三起事故正在發生。記者會在 15 分鐘後開始。\n\n原始 log 還在中控室，林子睿在後台某個地方，張景衡正在把你花了五章找到的那些字一個個改掉。\n\n你要先做什麼？',
      moodText: '你也能被剪裁。\n\n問題不是真相在不在——問題是誰先說出去、說了什麼版本。',
      ambientAudio: '/audio/bgm/kk_bgm_title_ch6.mp3',
    },
  },
};
