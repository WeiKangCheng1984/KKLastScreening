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
      sceneIds: ['scene_ch2_asu_car'],
    },
    ch3_intro: {
      id: 'ch3_intro',
      type: 'chapter_intro',
      next: '',
      chapterId: 'ch3',
    },
    ch2_hub: {
      id: 'ch2_hub',
      type: 'chapter_hub',
      chapterId: 'ch2',
      choices: [
        { id: 'scene_ch2_asu_car', label: '阿蘇的車裡', sceneId: 'scene_ch2_asu_car' },
      ],
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

export function getHubChoices(stepId: string): FlowStep['choices'] {
  const step = getStep(stepId);
  if (step?.type !== 'chapter_hub' || !step.choices) return undefined;
  return step.choices;
}

/**
 * 依流程步驟回傳對應的 Next.js 路徑（用於 router.push）。
 * @param stepId 當前步驟 id
 * @param sceneId 可選：當 step 為 chapter_hub 時，傳入選擇的 sceneId 則回傳 /play/{chapterId}/{sceneId}
 */
export function getNextPath(stepId: string, sceneId?: string): string {
  const step = getStep(stepId);
  if (!step) return '/';

  // Hub 頁選擇場景後直接導向該場景
  if (step.type === 'chapter_hub' && step.chapterId && sceneId) {
    return `/play/${step.chapterId}/${sceneId}`;
  }

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
    case 'chapter_hub':
      if (next.chapterId) return `/play/${next.chapterId}/hub`;
      return '/';
    default:
      return '/';
  }
}

/**
 * 從章節 id 取得 intro 頁「繼續」按鈕應導向的路徑（由 flow 決定進場景或 hub）。
 */
export function getChapterIntroContinuePath(chapterId: string): string {
  const step = Object.values(flowConfig.steps).find(
    (s) => s.type === 'chapter_intro' && s.chapterId === chapterId
  );
  if (!step) return '';
  return getNextPath(step.id);
}
