/**
 * 開發者「與劉隊報告」測試：跳轉到有 npc_liu 的場景（見各章 gameData）。
 */
export const DEV_TEST_LIU_SCENE = {
  ch1: { chapterId: 'ch1', sceneId: 'scene_ch1_cinema_a_hall' },
  ch2: { chapterId: 'ch2', sceneId: 'scene_ch2_cinema_entrance' },
  ch3: { chapterId: 'ch3', sceneId: 'scene_ch3_lobby_front' },
} as const;

/** 破關章尾測試前重置：第一章章尾／導航相關旗標 */
export const DEV_TEST_CH1_REPORT_RESET_FLAGS = [
  'ch1_reasoning_done',
  'navigate_to_ch2_intro',
  'ch1_report_evidence',
  'ch1_report_timeline',
  'ch1_police_note',
  'ch1_attitude_declared',
] as const;
