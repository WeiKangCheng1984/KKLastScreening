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
    },
  },
  ch6: {
    id: 'ch6',
    name: '第六章',
    description: '（待補）',
    scenes: ['scene_ch6_start'],
    intro: {
      title: '第六章',
      subtitle: '（待補）',
      description: '第六章內容尚未完成。',
      moodText: '',
    },
  },
};
