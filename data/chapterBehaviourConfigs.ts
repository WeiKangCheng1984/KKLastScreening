import type { NpcSensitiveGateConfig, LiuReportFlowConfig } from '@/types/game';

// ─── Sensitive Branch Configs (pick_one step + branch→nodeId mapping) ─────

export interface SensitiveBranchConfig {
  npcId: string;
  pickOneText: string;
  branches: Array<{
    choiceId: string;
    choiceText: string;
    nodeId: string;
  }>;
}

export const sensitiveBranchesByChapter: Record<string, SensitiveBranchConfig[]> = {
  ch1: [
    {
      npcId: 'npc_lin_ruitang',
      pickOneText: '你只能問一個方向。',
      branches: [
        { choiceId: 'lin_branch_light', choiceText: '散場的燈為什麼晚亮？誰能改這個表、誰在流程上游？', nodeId: 'node_lin_light_1' },
        { choiceId: 'lin_branch_fear', choiceText: '你是不是害怕兇手，還是害怕你上面的長官？', nodeId: 'node_lin_fear_1' },
      ],
    },
    {
      npcId: 'npc_ashun',
      pickOneText: '你只能問一個方向。',
      branches: [
        { choiceId: 'ashun_branch_window', choiceText: '散場後那一兩分鐘，誰在看？空窗有多大？', nodeId: 'node_ashun_window_1' },
        { choiceId: 'ashun_branch_deadzone', choiceText: '監視器死角在哪？你真的確定嗎？', nodeId: 'node_ashun_deadzone_1' },
      ],
    },
    {
      npcId: 'npc_xiaozhang',
      pickOneText: '你只能問一個方向。',
      branches: [
        { choiceId: 'xiaozhang_branch_table', choiceText: '燈延後三分鐘是誰改的？表格誰能改、誰在流程上游？', nodeId: 'node_xiaozhang_table_1' },
        { choiceId: 'xiaozhang_branch_oral', choiceText: '有人跟你說過什麼嗎？口頭指示、像背 SOP 的那個人。', nodeId: 'node_xiaozhang_oral_1' },
      ],
    },
  ],
  ch2: [
    {
      npcId: 'npc_asu',
      pickOneText:
        '阿蘇沒抬頭，只把滑鼠停在螢幕邊緣。你知道她今晚沒打算當好人，你只能選一條路把話捅到底，另一條就永遠別再提。',
      branches: [
        { choiceId: 'asu_branch_1', choiceText: '敘舊：兩年前那件事之後...', nodeId: 'node_asu_sensitive1_1' },
        { choiceId: 'asu_branch_2', choiceText: '問案：這些資料在鑑定上能站到哪裡、哪裡會被人動手腳？', nodeId: 'node_asu_sensitive2_1' },
      ],
    },
  ],
  ch3: [
    {
      npcId: 'npc_gu_naiqian',
      pickOneText: '你只能問一個方向。問了，另一個今晚就沒辦法再追了。',
      branches: [
        { choiceId: 'gu_branch_1', choiceText: '我想問：整理版 log 少了哪些欄位？那些欄位能讓你追到誰在操作？', nodeId: 'node_gu_sensitive1_1' },
        { choiceId: 'gu_branch_2', choiceText: '我想問：城市 W 和光芒 R 同步的事——你一直知道，為什麼一直沒說？', nodeId: 'node_gu_sensitive2_1' },
      ],
    },
  ],
  ch4: [
    {
      npcId: 'npc_chen_youcheng',
      pickOneText: '你只能問一個方向。問了，另一個今晚就沒辦法再追了。',
      branches: [
        { choiceId: 'chen_branch_1', choiceText: '我想問：那三份回報消失在誰的手裡？審核鏈最後停在哪裡？', nodeId: 'node_chen_sensitive1_1' },
        { choiceId: 'chen_branch_2', choiceText: '我想問：你說符合技術清單的人不多——你心裡有幾個名字？', nodeId: 'node_chen_sensitive2_1' },
      ],
    },
    {
      npcId: 'npc_liang_yian',
      pickOneText: '梁以安看你一眼，像在確認你是不是只想聽「官方說法」。你只能選一條路把話問透，另一條今晚就別再掀。',
      branches: [
        { choiceId: 'liang_branch_1', choiceText: '我想問：那次影城推陳佑誠公開道歉——你覺得是在保護誰、又在掩蓋什麼？', nodeId: 'node_liang_sensitive1_1' },
        { choiceId: 'liang_branch_2', choiceText: '我想問：大廳混亂那幾秒——你眼睛裡看到的那個人，你還能描述多少？', nodeId: 'node_liang_sensitive2_1' },
      ],
    },
  ],
  ch5: [
    {
      npcId: 'npc_gao_wenjie',
      pickOneText: '你只能問一個方向。問了，另一個今晚就沒辦法再追了。',
      branches: [
        { choiceId: 'gao_branch_1', choiceText: '我想問：那幾次登入——你真的在做什麼？有人借用你的帳號嗎？', nodeId: 'node_gao_sensitive1_1' },
        { choiceId: 'gao_branch_2', choiceText: '我想問：林子睿——你怎麼看他？誰最希望你看起來像答案？', nodeId: 'node_gao_sensitive2_1' },
      ],
    },
  ],
  ch6: [
    {
      npcId: 'npc_lin_zirui',
      pickOneText: '這是最後一次。你只能把一個問題真的問出去。',
      branches: [
        { choiceId: 'lin_ch6_branch_1', choiceText: '你在等這場危機把舊結構一起燒掉——對嗎？', nodeId: 'node_lin_ch6_final1_1' },
        { choiceId: 'lin_ch6_branch_2', choiceText: '最後說清楚一件事：有人死了，這是你算進去的代價嗎？', nodeId: 'node_lin_ch6_final2_1' },
      ],
    },
  ],
};

// ─── NPC Sensitive Gate Configs ───────────────────────────────────

export const sensitiveGatesByChapter: Record<string, NpcSensitiveGateConfig[]> = {
  ch1: [
    {
      npcId: 'npc_lin_ruitang',
      doneFlag: 'npc_lin_sensitive_done',
      observedFlags: ['observed_any_ch1'],
      casualTalkThreshold: 3,
      gateText: '你覺得時機差不多了，可以試著往深一點問。',
      choices: {
        ask: { id: 'lin_sensitive_ask', text: '我想問一些比較敏感的問題。' },
        skip: { id: 'lin_sensitive_skip', text: '先不用，再聊聊就好。' },
      },
    },
    {
      npcId: 'npc_ashun',
      doneFlag: 'npc_ashun_sensitive_done',
      observedFlags: ['observed_any_ch1'],
      casualTalkThreshold: 3,
      gateText: '你覺得時機差不多了，可以試著往深一點問。',
      choices: {
        ask: { id: 'ashun_sensitive_ask', text: '我想問一些比較敏感的問題。' },
        skip: { id: 'ashun_sensitive_skip', text: '先不用，再聊聊就好。' },
      },
    },
    {
      npcId: 'npc_xiaozhang',
      doneFlag: 'npc_xiaozhang_sensitive_done',
      observedFlags: ['projection_room_observed'],
      casualTalkThreshold: 3,
      gateText: '你覺得時機差不多了，可以試著往深一點問。',
      choices: {
        ask: { id: 'xiaozhang_sensitive_ask', text: '我想問一些比較敏感的問題。' },
        skip: { id: 'xiaozhang_sensitive_skip', text: '先不用，再聊聊就好。' },
      },
    },
  ],

  ch2: [
    {
      npcId: 'npc_asu',
      doneFlag: 'npc_asu_sensitive_done',
      /** 敏感線僅在「阿蘇的車裡」開；進度以車內四條主線索檢視計（與終端完整版對應） */
      allowedScenes: ['scene_ch2_asu_car'],
      observedFlags: [
        'ch2_car_unknown_viewed',
        'ch2_car_notepad_viewed',
        'ch2_car_recording_viewed',
        'ch2_car_location_viewed',
      ],
      minObservedCount: 3,
      casualTalkThreshold: 1,
      gateText:
        '阿蘇終於轉過來看你一眼，眼底是熬夜的紅。她像在問：你要不要趁今晚，把那句一直沒說出口的話砸出來。',
      choices: {
        ask: { id: 'asu_sensitive_ask', text: '我想把話問深一點。' },
        skip: { id: 'asu_sensitive_skip', text: '先消化資料，暫時不碰。' },
      },
    },
  ],

  ch3: [
    {
      npcId: 'npc_gu_naiqian',
      doneFlag: 'npc_gu_naiqian_sensitive_done',
      allowedScenes: ['scene_ch3_brand_room'],
      observedFlags: ['ch3_cross_venue_viewed', 'ch3_network_label_viewed', 'ch3_remote_login_viewed'],
      minObservedCount: 2,
      casualTalkThreshold: 1,
      gateText: '顧乃謙的回答每次都點到邊緣就停下來。你覺得現在可以問一個他真的要好好回答的問題。',
      choices: {
        ask: { id: 'gu_sensitive_ask', text: '我想問一個比較深的問題。' },
        skip: { id: 'gu_sensitive_skip', text: '先看資料就好，暫時不問。' },
      },
    },
  ],

  ch4: [
    {
      npcId: 'npc_chen_youcheng',
      doneFlag: 'npc_chen_sensitive_done',
      allowedScenes: ['scene_ch4_control_panel'],
      observedFlags: ['ch4_control_plugin_viewed', 'ch4_control_sync_viewed', 'ch4_control_risk_viewed'],
      minObservedCount: 2,
      casualTalkThreshold: 1,
      gateText: '陳佑誠說完那句「消失得更對」之後沉默了一會。你覺得現在可以問一個他真的得好好回答的問題。',
      choices: {
        ask: { id: 'chen_sensitive_ask', text: '我想問更深一點的問題。' },
        skip: { id: 'chen_sensitive_skip', text: '先看資料就好，暫時不問。' },
      },
    },
    {
      npcId: 'npc_liang_yian',
      doneFlag: 'npc_liang_yian_sensitive_done',
      allowedScenes: ['scene_ch4_main_hall'],
      observedFlags: ['ch4_hall_crowd_viewed', 'ch4_hall_trace_viewed'],
      minObservedCount: 2,
      casualTalkThreshold: 1,
      gateText:
        '梁以安站在當時他站過的位置，視線掠過面板與側門。你覺得現在可以問他：那次記者會／公關場面背後，他到底看見了什麼、又沒看見什麼。',
      choices: {
        ask: { id: 'liang_sensitive_ask', text: '我想把當時的情節問清楚。' },
        skip: { id: 'liang_sensitive_skip', text: '先讓他靜一靜。' },
      },
    },
  ],

  ch5: [
    {
      npcId: 'npc_gao_wenjie',
      doneFlag: 'npc_gao_sensitive_done',
      allowedScenes: ['scene_ch5_lin_office'],
      observedFlags: ['ch5_lin_call_viewed', 'ch5_unknown_msg_viewed'],
      minObservedCount: 2,
      casualTalkThreshold: 1,
      gateText: '高文傑說的每句話都精準到像排練過。你覺得現在可以問一個他真的得認真回答的問題。',
      choices: {
        ask: { id: 'gao_sensitive_ask', text: '我想問一個比較直接的問題。' },
        skip: { id: 'gao_sensitive_skip', text: '先不急，繼續觀察。' },
      },
    },
  ],

  ch6: [
    {
      npcId: 'npc_lin_zirui',
      doneFlag: 'npc_lin_ch6_confrontation_done',
      allowedScenes: ['scene_ch6_press_corridor'],
      observedFlags: ['ch6_press_draft_viewed', 'ch6_zhang_brief_viewed'],
      minObservedCount: 2,
      casualTalkThreshold: 1,
      gateText: '你手上有發言稿、有修改版說帖、有五章積累下來的線索。林子睿在後台通道等著你。這是最後一次能問清楚的機會。',
      choices: {
        ask: { id: 'lin_ch6_confront_ask', text: '我想問一個他無法用「管理落後」帶過的問題。' },
        skip: { id: 'lin_ch6_confront_skip', text: '先不急，再觀察一下。' },
      },
    },
  ],
};

// ─── Liu Report Flow Configs ──────────────────────────────────────

export const liuReportFlowByChapter: Record<string, LiuReportFlowConfig> = {
  ch1: {
    doneFlags: ['ch1_reasoning_done'],
    steps: [
      {
        text: '初步看完了嗎？\n\n如果還沒把重點串起來，可以再繞一輪，或者先試著整理一次想法。',
        choices: [
          { id: 'ch1_liu_keep_exploring', text: '我再多看一下現場。' },
          { id: 'ch1_liu_try_reasoning', text: '我想先試著整理一次。' },
        ],
      },
      {
        text: '初步看完了嗎？\n\n要再去看一輪，還是現在跟我報告？',
        choices: [
          { id: 'ch1_liu_keep_exploring', text: '還想再繞繞。' },
          { id: 'ch1_liu_report_now', text: '我想向你報告。' },
        ],
      },
    ],
  },

  ch2: {
    doneFlags: ['ch2_reasoning_done'],
    steps: [
      {
        blockIfMissing: ['npc_asu_sensitive_done'],
        text:
          '劉隊：「先等阿蘇解鎖，再去去跟她把話說開。」\n\n' +
          '「她若還梗著兩年前那件事，你今晚寫什麼都會歪。聽她把技術邊界講清楚，再回來找我。」',
      },
      {
        text:
          '劉隊：「好，你現在看到的版本——說一次。」\n\n' +
          '「別急著漂亮，我要聽它們指向同一個人、同一條線。」',
        choices: [
          { id: 'ch2_liu_keep_exploring', text: '我再多看一下現場。' },
          { id: 'ch2_liu_open_qa_conclusion', text: '我試著把版本說清楚。' },
        ],
      },
    ],
  },

  ch3: {
    noopUnlessFlags: ['ch3_task_from_liu'],
    doneFlags: ['ch3_reasoning_done', 'ch3_liu_report_done'],
    steps: [
      {
        blockIfMissing: ['ch3_liu_report_ready'],
        text: '「先把大廳、應對室走一遍——技術角跟列印區在同一間，別漏。」\n\n「我要你帶回來的不是情緒，是一份能交出去的缺口清單。」',
      },
      {
        text: '「好。」\n\n「你現在說一次：白板、log、跨館、口徑——你看到的是哪一種版本？」',
        choices: [
          { id: 'ch3_liu_keep_exploring', text: '我再回去確認一下。' },
          { id: 'ch3_liu_report_now', text: '我想向你報告。' },
        ],
      },
    ],
  },

  ch4: {
    noopUnlessFlags: ['ch4_task_from_liu'],
    doneFlags: ['ch4_reasoning_done', 'ch4_liu_report_done'],
    steps: [
      {
        blockIfMissing: ['npc_chen_sensitive_done'],
        text: '「先去跟陳佑誠把控制區的東西確認完。」\n\n「等你問完那個問題，再回來跟我說你怎麼看。」',
      },
      {
        blockIfMissing: ['npc_liang_yian_sensitive_done'],
        text:
          '「大廳那邊，梁以安還梗著。」\n\n' +
          '「導演看見的不是 log，是觀眾的臉——你去把他的話問深一點，再回來跟我說。」',
      },
      {
        text: '劉隊合上記錄本，說：「好。你現在可以講一次完整的版本。」\n\n「你要向我報告，還是再多走一圈？」',
        choices: [
          { id: 'ch4_liu_keep_exploring', text: '我再去確認一下。' },
          { id: 'ch4_liu_report_now', text: '我想向你報告。' },
        ],
      },
    ],
  },

  ch5: {
    noopUnlessFlags: ['ch5_task_from_liu'],
    doneFlags: ['ch5_reasoning_done', 'ch5_liu_report_done'],
    steps: [
      {
        blockIfMissing: ['npc_gao_sensitive_done'],
        text: '「先去跟高文傑談清楚。」\n\n「等你問完他那個問題，再回來跟我說你怎麼看。」',
      },
      {
        text: '劉隊把嫌疑矩陣推到你面前，說：「上面要名單，我要能交出去的版本。」\n\n「你要向我報告，還是再多看一圈？」',
        choices: [
          { id: 'ch5_liu_keep_exploring', text: '我再去確認一下。' },
          { id: 'ch5_liu_report_now', text: '我想向你報告。' },
        ],
      },
    ],
  },

  ch6: {
    noopUnlessFlags: ['ch6_task_from_liu'],
    doneFlags: ['ch6_reasoning_done', 'ch6_liu_report_done'],
    steps: [
      {
        blockIfMissing: ['npc_lin_ch6_confrontation_done'],
        text: '「先去跟林子睿把那個問題問完。」\n\n「他在後台。你知道要問什麼。」',
      },
      {
        blockIfMissing: ['ch6_d7_done'],
        text: '「D7 那段你要看清楚。」\n\n「沒有那一段，你報告只會變成感覺。」',
      },
      {
        blockIfMissing: ['ch6_pr_accept_edited_brief', 'ch6_pr_insist_remote_line'],
        text: '「張景衡那份說帖，你看過了吧？」\n\n「你要先決定：你接受他那個版本，還是堅持把『遠端』那句話留下。」',
      },
      {
        text: '劉隊把筆放在紙上，沒急著寫。\n\n「好。你把關鍵的東西都看過了。」\n\n「你要向我報告，還是再多繞一圈？」',
        choices: [
          { id: 'ch6_liu_keep_exploring', text: '我再去確認一下。' },
          { id: 'ch6_liu_report_now', text: '我想向你報告。' },
        ],
      },
    ],
  },
};
