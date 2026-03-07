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
    chapterId: 'ch1',
    chapterName: '第一章',
    flags: [
      { id: 'observed_victim_seat', label: '觀察過死者座位' },
      { id: 'observed_any_ch1', label: '任一 ch1 觀察' },
      { id: 'projection_room_unlocked', label: '播映室已解鎖' },
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
      { id: 'npc_lin_sensitive_done', label: '林瑞堂敏感對話' },
      { id: 'npc_ashun_sensitive_done', label: '阿順敏感對話' },
      { id: 'npc_xiaozhang_sensitive_done', label: '小張敏感對話' },
      { id: 'npc_zhou_jie_sensitive_done', label: '周姊敏感對話' },
      { id: 'ch1_puzzle_done', label: 'ch1 解謎完成' },
      { id: 'ch1_reasoning_done', label: 'ch1 推理完成' },
      { id: 'ch1_police_intro_shown', label: '劉隊開場已播' },
      { id: 'ch1_liu_mid_ready', label: '劉隊中段可播' },
      { id: 'ch1_liu_mid_shown', label: '劉隊中段已播' },
      { id: 'ch1_monologue_done', label: '內心獨白完成' },
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
      { id: 'formal_seen', label: '正式版已見' },
      { id: 'informal_seen', label: '非正式已見' },
      { id: 'glow_seen', label: '光暈已見' },
      { id: 'systems_understood', label: '系統已理解' },
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
 * 旗標與道具對應：當「旗標測試」裡把某旗標設為開時，程式會一併把對應道具加入背包，
 * 這樣遊戲邏輯（hasItem、報告編輯器證據桌）才會真的當作「已探索／已取得」。
 * 設為關時會一併從背包移除對應道具。
 */
export const flagToItemIds: Record<string, string[]> = {
  ticket_stub_collected: ['item_ticket_stub'],
  schedule_modified_found: ['item_schedule_modified'],
  clue_manual_light_control: ['item_light_control_note'],
  projector_notes_found: ['item_projector_notes'],
  black_fragment_found: ['item_black_plastic_fragment'],
  clue_clean_trash: ['item_cleaning_note'],
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
