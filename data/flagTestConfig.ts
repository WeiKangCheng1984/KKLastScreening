/**
 * 旗標測試用：專案內所有旗標 id 與中文標籤，依章節分組。
 * 供右上角選單 → 設定 → 旗標測試面板使用。
 */
export interface FlagEntry {
  id: string;
  label: string;
}

export interface FlagGroup {
  chapterId: string;
  chapterName: string;
  flags: FlagEntry[];
}

export const flagTestGroups: FlagGroup[] = [
  {
    chapterId: 'dev',
    chapterName: '測試／全域',
    flags: [
      {
        id: 'dev_unlock_liu_report',
        label: '【測試】各章可直接向劉隊報告（略過報告前置與敏感門檻）',
      },
    ],
  },
  {
    chapterId: 'ch1',
    chapterName: '第一章',
    flags: [
      { id: 'observed_victim_seat', label: '觀察過死者座位' },
      { id: 'observed_any_ch1', label: '任一 ch1 觀察' },
      { id: 'ticket_stub_collected', label: '票根' },
      { id: 'clue_light_delay_confirmed', label: '燈延遲線索' },
      { id: 'security_monitor_viewed', label: '監視器' },
      { id: 'schedule_modified_found', label: '時間表塗改' },
      { id: 'projection_room_observed', label: '播映室已觀察' },
      { id: 'clue_manual_light_control', label: '燈控' },
      { id: 'projector_notes_found', label: '放映員筆記' },
      { id: 'clue_fast_exit', label: '快速離開線索' },
      { id: 'restroom_unlocked', label: '廁所已解鎖' },
      { id: 'black_fragment_found', label: '黑色碎片' },
      { id: 'observed_restroom_ch1', label: '廁所已觀察' },
      { id: 'clue_clean_trash', label: '清潔線索' },
      { id: 'clue_killer_calm', label: '兇手冷靜線索' },
      { id: 'ch1_clue_1_unlocked', label: '解謎線索 1 已解' },
      { id: 'ch1_clue_2_unlocked', label: '解謎線索 2 已解' },
      { id: 'ch1_clue_3_unlocked', label: '解謎線索 3 已解' },
      { id: 'ch1_last_unlocked_combo', label: '最後解出的組合序號' },
      { id: 'npc_lin_sensitive_done', label: '林瑞堂敏感對話' },
      { id: 'npc_ashun_sensitive_done', label: '阿順敏感對話' },
      { id: 'npc_xiaozhang_sensitive_done', label: '小張敏感對話' },
      { id: 'npc_zhou_jie_sensitive_done', label: '周姊敏感對話' },
      { id: 'ch1_puzzle_done', label: 'ch1 解謎完成' },
      { id: 'ch1_reasoning_done', label: 'ch1 推理完成' },
      { id: 'ch1_police_intro_shown', label: '劉隊開場已播' },
      { id: 'ch1_liu_mid_ready', label: '劉隊中段可播' },
      { id: 'ch1_liu_mid_shown', label: '劉隊中段已播' },
      { id: 'ch1_report_evidence', label: '報告－證據' },
      { id: 'ch1_report_timeline', label: '報告－時間線' },
      { id: 'ch1_police_note', label: '報告－補句' },
      { id: 'ch1_attitude_declared', label: '態度宣言' },
      { id: 'puzzle_ch1_solved', label: '謎題 ch1 已解' },
      { id: 'chapter2_unlocked', label: '第二章解鎖' },
      { id: 'navigate_to_ch2_intro', label: '導向 ch2 intro' },
      { id: 'victim_phone_decrypt_ready', label: '死者手機解密就緒' },
    ],
  },
  {
    chapterId: 'ch3',
    chapterName: '第三章',
    flags: [
      { id: 'ch3_task_from_liu', label: '第三章任務已接（劉隊交代）' },
      { id: 'ch3_milestone_whiteboard', label: '里程碑：白板重寫兩次' },
      { id: 'ch3_milestone_brand_script', label: '里程碑：話術草稿（禁用語）' },
      { id: 'ch3_milestone_cross_venue', label: '里程碑：跨館同步/版本序列' },
      { id: 'ch3_log_compare_done', label: 'log 對照（整理版 vs 母帶／技術角殘留）已完成' },
      { id: 'ch3_liu_report_ready', label: '可向劉隊報告（入口解鎖）' },
      { id: 'ch3_liu_report_done', label: '向劉隊報告完成（章尾）' },
      { id: 'ch3_reasoning_done', label: 'ch3 推理完成' },
      { id: 'navigate_to_ch4_intro', label: '導向 ch4 intro' },
      { id: 'npc_gu_naiqian_sensitive_done', label: '顧乃謙敏感對話完成' },
    ],
  },
  {
    chapterId: 'ch2',
    chapterName: '第二章',
    flags: [
      { id: 'npc_asu_sensitive_done', label: '阿蘇敏感對話' },
      { id: 'schedule_b_found', label: 'B 表' },
      { id: 'clue_layout_analysis', label: '布局分析' },
      { id: 'light_request_found', label: '燈光申請' },
      { id: 'patrol_schedule_found', label: '巡邏表' },
      { id: 'cleaning_memo_found', label: '清潔備忘' },
      { id: 'navigate_to_ch3_intro', label: '導向 ch3 intro' },
    ],
  },
  {
    chapterId: 'ch3',
    chapterName: '第三章',
    flags: [
      { id: 'test_taken', label: '測驗已考' },
      { id: 'tools_checked', label: '工具已查' },
      { id: 'roll_call_answered', label: '點名已答' },
      { id: 'all_tests_passed', label: '全部測驗通過' },
      { id: 'roll_call_puzzle_solved', label: '點名謎題' },
      { id: 'records_checked', label: '紀錄已查' },
      { id: 'simulation_done', label: '模擬完成' },
      { id: 'simulation_puzzle_solved', label: '模擬謎題' },
      { id: 'room3_completed', label: '房間3完成' },
      { id: 'navigate_to_ch4_intro', label: '導向 ch4 intro' },
    ],
  },
  {
    chapterId: 'ch4',
    chapterName: '第四章',
    flags: [
      { id: 'ch4_task_from_liu', label: '劉隊任務已接' },
      { id: 'npc_chen_sensitive_done', label: '陳佑誠敏感對話完成（解鎖報告入口）' },
      { id: 'npc_liang_yian_sensitive_done', label: '梁以安敏感對話完成（解鎖報告入口）' },
      { id: 'ch4_liu_report_done', label: '向劉隊報告完成' },
      { id: 'ch4_reasoning_done', label: '推理完成' },
      { id: 'ch4_liang_stair_talked', label: '梁以安（樓梯間）已談' },
      { id: 'ch4_chen_stair_talked', label: '陳佑誠（樓梯間）已談' },
      { id: 'ch4_stairwell_time_viewed', label: '燈控時間記錄已查' },
      { id: 'ch4_stairwell_trace_viewed', label: '踏面/抓痕已查' },
      { id: 'ch4_stairwell_monitor_viewed', label: '樓梯間監視死角已查' },
      { id: 'ch4_control_plugin_viewed', label: '插件版本一致已查' },
      { id: 'ch4_control_sync_viewed', label: '遠端同步紀錄已查' },
      { id: 'ch4_control_risk_viewed', label: '三份回報單已查' },
      { id: 'ch4_hall_crowd_viewed', label: '燈先滅/廣播後響已查' },
      { id: 'ch4_hall_trace_viewed', label: '面板指紋/鞋印已查' },
      { id: 'alarm_heard', label: '警報已聽' },
      { id: 'broken_seen', label: '損壞已見' },
      { id: 'manual_found', label: '手冊已得' },
      { id: 'pressure_realized', label: '壓力已意識' },
      { id: 'files_collected', label: '檔案已收' },
      { id: 'files_puzzle_solved', label: '檔案謎題' },
      { id: 'object_found', label: '物件已得' },
      { id: 'detector_checked', label: '偵測器已查' },
      { id: 'quick_tool_seen', label: '快速工具已見' },
      { id: 'conflict_felt', label: '衝突已感' },
      { id: 'detector_calibrated', label: '偵測器校正' },
      { id: 'detector_puzzle_solved', label: '偵測器謎題' },
      { id: 'quick_fix_used', label: '快速修復已用' },
      { id: 'quick_fix_puzzle_solved', label: '快速修復謎題' },
      { id: 'consequence_read', label: '後果已讀' },
      { id: 'quick_solution_seen', label: '快速方案已見' },
      { id: 'room4_completed', label: '房間4完成' },
      { id: 'consequence_puzzle_solved', label: '後果謎題' },
      { id: 'navigate_to_ch5_intro', label: '導向 ch5 intro' },
    ],
  },
  {
    chapterId: 'ch5',
    chapterName: '第五章',
    flags: [
      { id: 'ch5_task_from_liu', label: '劉隊任務已接' },
      { id: 'npc_gao_sensitive_done', label: '高文傑敏感對話完成（解鎖報告入口）' },
      { id: 'ch5_liu_report_done', label: '向劉隊報告完成' },
      { id: 'ch5_reasoning_done', label: '推理完成' },
      { id: 'ch5_matrix_viewed', label: '嫌疑矩陣已查' },
      { id: 'ch5_login_gap_viewed', label: '登入時間差分析已查' },
      { id: 'ch5_log_diff_viewed', label: '原始log差異已查' },
      { id: 'ch5_permission_tree_viewed', label: '權限樹已查' },
      { id: 'ch5_unknown_msg_viewed', label: 'Unknown語感比對已查' },
      { id: 'ch5_lin_call_viewed', label: '林子睿通話節錄已查' },
      { id: 'navigate_to_ch6_intro', label: '導向 ch6 intro' },
      { id: 'formal_seen', label: '正式版已見' },
      { id: 'informal_seen', label: '非正式已見' },
      { id: 'glow_seen', label: '光暈已見' },
      { id: 'systems_understood', label: '系統已理解' },
      { id: 'game_completed', label: '遊戲完成' },
    ],
  },
  {
    chapterId: 'ch6',
    chapterName: '第六章',
    flags: [
      { id: 'ch6_task_from_liu', label: '劉隊任務已接' },
      { id: 'ch6_d7_done', label: 'D7 三選一完成' },
      { id: 'ch6_raw_log_secured', label: 'raw log 已封存（結局維度 1）' },
      { id: 'ch6_pr_accept_edited_brief', label: '接受張景衡公關版本（結局維度 2）' },
      { id: 'ch6_pr_insist_remote_line', label: '堅持保留「遠端」一句（結局維度 2 反向）' },
      { id: 'npc_lin_ch6_confrontation_done', label: '林子睿最終對決完成（解鎖報告入口）' },
      { id: 'ch6_liu_report_done', label: '向劉隊報告完成' },
      { id: 'ch6_reasoning_done', label: '推理完成' },
      { id: 'ch6_press_draft_viewed', label: '宋雅甄發言稿已查' },
      { id: 'ch6_zhang_brief_viewed', label: '張景衡說帖已查（含公關版本選擇）' },
      { id: 'game_completed', label: '遊戲完成' },
    ],
  },
];

/** 第一章「向劉隊報告」所需核心旗標 + 三場景已拜訪 */
export const ch1ReportCoreFlagIds = [
  'ticket_stub_collected',
  'security_monitor_viewed',
  'clue_manual_light_control',
  'black_fragment_found',
  'clue_clean_trash',
];

export const ch1ReportEvidenceItemIds = [
  'item_ticket_stub',
  'item_schedule_modified',
  'item_light_control_note',
  'item_projector_notes',
  'item_black_plastic_fragment',
  'item_cleaning_note',
];

/** 各章節 NPC 閒聊次數測試用（解鎖敏感話題通常需 ≥3 次） */
export interface NpcTestEntry {
  id: string;
  label: string;
}

export const npcTestByChapter: Record<string, NpcTestEntry[]> = {
  ch1: [
    { id: 'npc_lin_ruitang', label: '林瑞堂（副理）' },
    { id: 'npc_ashun', label: '阿順（巡場保全）' },
    { id: 'npc_xiaozhang', label: '小張（放映員）' },
    { id: 'npc_zhou_jie', label: '周姊（清潔）' },
    { id: 'npc_liu', label: '劉隊' },
  ],
  ch2: [
    { id: 'npc_asu', label: '阿蘇' },
  ],
};

/** 敏感話題選擇：依 NPC 分組，便於測試「已問敏感」；依 chapterId 只顯示該章 NPC */
export interface SensitiveChoiceEntry {
  flagId: string;
  label: string;
}

export interface SensitiveChoiceGroup {
  chapterId: string;
  npcId: string;
  npcLabel: string;
  entries: SensitiveChoiceEntry[];
}

/**
 * 旗標與道具對應：當「旗標測試」裡把某旗標設為開時，程式會一併把對應道具加入背包；
 * 設為關時會一併從背包移除。第一章僅 2 件進背包（票根、黑色碎片），
 * 其餘 4 項（時間表、燈控、放映員筆記、清潔線索）僅檢視、以 flag 表示已發現，不在此同步。
 */
export const flagToItemIds: Record<string, string[]> = {
  ticket_stub_collected: ['item_ticket_stub'],
  black_fragment_found: ['item_black_plastic_fragment'],
};

export const sensitiveChoiceGroups: SensitiveChoiceGroup[] = [
  {
    chapterId: 'ch1',
    npcId: 'npc_lin_ruitang',
    npcLabel: '林瑞堂',
    entries: [
      { flagId: 'npc_lin_sensitive_done', label: '已問敏感' },
    ],
  },
  {
    chapterId: 'ch1',
    npcId: 'npc_ashun',
    npcLabel: '阿順',
    entries: [
      { flagId: 'npc_ashun_sensitive_done', label: '已問敏感' },
    ],
  },
  {
    chapterId: 'ch1',
    npcId: 'npc_xiaozhang',
    npcLabel: '小張',
    entries: [
      { flagId: 'npc_xiaozhang_sensitive_done', label: '已問敏感' },
    ],
  },
  {
    chapterId: 'ch1',
    npcId: 'npc_zhou_jie',
    npcLabel: '周姊',
    entries: [
      { flagId: 'npc_zhou_jie_sensitive_done', label: '已問敏感' },
    ],
  },
  {
    chapterId: 'ch2',
    npcId: 'npc_asu',
    npcLabel: '阿蘇',
    entries: [
      { flagId: 'npc_asu_sensitive_done', label: '已問敏感' },
    ],
  },
];
