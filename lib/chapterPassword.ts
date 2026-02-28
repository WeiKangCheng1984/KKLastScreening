import type { GameState } from '@/types/game';
import { chapters } from '@/data/chapters';

export type ChapterDigit = 2 | 3 | 4 | 5 | 6;

const CHAPTER_IDS: Record<ChapterDigit, string> = {
  2: 'ch2',
  3: 'ch3',
  4: 'ch4',
  5: 'ch5',
  6: 'ch6',
};

/**
 * 解析 6 位數字密碼：僅接受 200000、300000、400000、500000、600000。
 */
export function parsePassword(input: string): { chapter: ChapterDigit; variant: number; chapterId: string } | null {
  const trimmed = input.trim();
  if (!/^\d{6}$/.test(trimmed)) return null;
  if (trimmed.slice(1) !== '00000') return null;
  const first = Number(trimmed[0]) as ChapterDigit;
  if (first < 2 || first > 6) return null;
  const chapterId = CHAPTER_IDS[first];
  if (!chapters[chapterId]) return null;
  return { chapter: first, variant: 0, chapterId };
}

/**
 * 取得該章「標準起點」的 GameState，與 GameEngine 預設結構一致。
 */
export function getCanonicalStateForChapter(chapter: ChapterDigit): GameState {
  const chapterId = CHAPTER_IDS[chapter];
  const chapterDef = chapters[chapterId];
  const firstSceneId = chapterDef?.scenes?.[0] ?? '';

  const allChapterIds = ['ch1', 'ch2', 'ch3', 'ch4', 'ch5', 'ch6'] as const;
  const visitedScenes: string[] = [];
  for (const cid of allChapterIds) {
    if (cid === chapterId) {
      if (firstSceneId) visitedScenes.push(firstSceneId);
      break;
    }
    const c = chapters[cid];
    if (c?.scenes?.length) visitedScenes.push(...c.scenes);
  }

  const flags: Record<string, boolean> = {};
  for (let i = 1; i < chapter; i++) {
    const cid = CHAPTER_IDS[i as ChapterDigit];
    if (chapters[cid]) {
      flags[`ch${i}_reasoning_done`] = true;
      flags[`chapter${i + 1}_unlocked`] = true;
    }
  }
  flags[`chapter${chapter}_unlocked`] = true;

  return {
    currentChapter: chapterId,
    currentScene: firstSceneId || chapterId + '_scene_1',
    inventory: [],
    flags,
    interactions: [],
    visitedScenes,
    explorationProgress: {},
    chapterPuzzleUnlocked: {},
    score: 0,
    weights: {},
    choices: [],
    preferences: {
      preference_system_intervention: 0,
      preference_observation_wait: 0,
      overweight_motive: 0,
      weight_behavior_evidence: 0,
      weight_process_similarity: 0,
      weight_escape_route: 0,
      question_system: 0,
      avoid_early_conviction: 0,
    },
    insights: {
      procedure_insight: 0,
      human_insight: 0,
      evidence_insight: 0,
    },
    reasoningAnswers: {},
    npcCasualTalkCount: {},
  };
}

/**
 * 章節代碼對應的 6 位密碼（變體為 0），供說明或除錯。
 */
export function chapterToPassword(chapter: ChapterDigit): string {
  const s = String(chapter);
  return s + '00000';
}
