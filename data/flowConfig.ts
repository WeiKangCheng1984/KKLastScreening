import { FlowConfig, FlowStep } from '@/types/game';

export const flowConfig: FlowConfig = {
  firstStepId: 'prologue_text',
  steps: {
    main_menu: {
      id: 'main_menu',
      type: 'main_menu',
      next: 'prologue_text',
      background: '/images/main_bg_placeholder.webp',
    },
    prologue_text: {
      id: 'prologue_text',
      type: 'prologue_text',
      next: 'ch1_intro',
    },
    ch1_intro: {
      id: 'ch1_intro',
      type: 'chapter_intro',
      next: 'ch1_explore',
      chapterId: 'ch1',
      sceneIds: ['scene_ch1_cinema_a_hall', 'scene_ch1_projection_room', 'scene_ch1_restroom'],
    },
    ch1_explore: {
      id: 'ch1_explore',
      type: 'scene_explore',
      next: 'ch2_intro',
      chapterId: 'ch1',
      sceneIds: ['scene_ch1_cinema_a_hall', 'scene_ch1_projection_room', 'scene_ch1_restroom'],
    },
    ch2_intro: {
      id: 'ch2_intro',
      type: 'chapter_intro',
      next: 'ch2_explore',
      chapterId: 'ch2',
    },
    ch2_explore: {
      id: 'ch2_explore',
      type: 'scene_explore',
      next: 'ch3_intro',
      chapterId: 'ch2',
      sceneIds: ['scene_ch2_cinema_entrance', 'scene_ch2_asu_car', 'scene_ch2_asu_desktop'],
    },
    ch3_intro: {
      id: 'ch3_intro',
      type: 'chapter_intro',
      next: 'ch3_explore',
      chapterId: 'ch3',
    },
    ch3_explore: {
      id: 'ch3_explore',
      type: 'scene_explore',
      next: 'ch4_intro',
      chapterId: 'ch3',
      sceneIds: ['scene_ch3_lobby_front', 'scene_ch3_brand_room'],
    },
    ch4_intro: {
      id: 'ch4_intro',
      type: 'chapter_intro',
      next: 'ch4_explore',
      chapterId: 'ch4',
    },
    ch4_explore: {
      id: 'ch4_explore',
      type: 'scene_explore',
      next: 'ch5_intro',
      chapterId: 'ch4',
      sceneIds: ['scene_ch4_stairwell', 'scene_ch4_control_panel', 'scene_ch4_main_hall'],
    },
    ch5_intro: {
      id: 'ch5_intro',
      type: 'chapter_intro',
      next: 'ch5_explore',
      chapterId: 'ch5',
    },
    ch5_explore: {
      id: 'ch5_explore',
      type: 'scene_explore',
      next: 'ch6_intro',
      chapterId: 'ch5',
      sceneIds: ['scene_ch5_data_room', 'scene_ch5_log_lab', 'scene_ch5_lin_office'],
    },
    ch6_intro: {
      id: 'ch6_intro',
      type: 'chapter_intro',
      next: 'ch6_explore',
      chapterId: 'ch6',
    },
    ch6_explore: {
      id: 'ch6_explore',
      type: 'scene_explore',
      next: '',
      chapterId: 'ch6',
      sceneIds: ['scene_ch6_screening_hall', 'scene_ch6_control_room', 'scene_ch6_press_corridor'],
    },
  },
};

export function getStep(id: string): FlowStep | null {
  return flowConfig.steps[id] ?? null;
}

export function getNextStep(id: string): FlowStep | null {
  const step = getStep(id);
  if (!step?.next) return null;
  return getStep(step.next);
}

/**
 * 依流程步驟回傳對應的 Next.js 路徑（用於 router.push）。
 * @param stepId 當前步驟 id
 */
export function getNextPath(stepId: string, _sceneId?: string): string {
  const step = getStep(stepId);
  if (!step) return '/';

  const nextId = step.next;
  if (!nextId) return '/';

  const next = getStep(nextId);
  if (!next) return '/';

  switch (next.type) {
    case 'prologue_text':
      return '/play/prologue';
    case 'chapter_intro':
      if (next.chapterId) return `/play/${next.chapterId}/intro`;
      return '/';
    case 'scene_explore':
      if (next.chapterId && next.sceneIds?.length) return `/play/${next.chapterId}/${next.sceneIds[0]}`;
      return '/';
    default:
      return '/';
  }
}

/**
 * 從章節 id 取得 intro 頁「繼續」按鈕應導向的路徑（通常為該章第一個探索場景）。
 */
export function getChapterIntroContinuePath(chapterId: string): string {
  const step = Object.values(flowConfig.steps).find(
    (s) => s.type === 'chapter_intro' && s.chapterId === chapterId
  );
  if (!step) return '';
  return getNextPath(step.id);
}
