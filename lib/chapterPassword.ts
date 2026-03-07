import type { GameState } from '@/types/game';
import { chapters } from '@/data/chapters';
import { getCh1PresetByPassword } from '@/data/ch1PasswordPresets';

export type ChapterDigit = 2 | 3 | 4 | 5 | 6;

const CHAPTER_IDS: Record<ChapterDigit, string> = {
  2: 'ch2',
  3: 'ch3',
  4: 'ch4',
  5: 'ch5',
  6: 'ch6',
};

/** 解析結果：第一章 20 階段密碼 */
export interface Ch1PasswordResult {
  type: 'ch1';
  chapterId: 'ch1';
  stage: number;
  password: string;
}

/** 解析結果：第二章～第六章跳章密碼 */
export interface ChapterPasswordResult {
  type: 'chapter';
  chapter: ChapterDigit;
  variant: number;
  chapterId: string;
}

/**
 * 解析 6 位數字密碼：
 * - 若為第一章 20 階段密碼（101042, 101758, ...）→ 回傳 Ch1PasswordResult
 * - 若為 200000、300000、400000、500000、600000 → 回傳 ChapterPasswordResult
 */
export function parsePassword(
  input: string
): Ch1PasswordResult | ChapterPasswordResult | null {
  const trimmed = input.trim();
  if (!/^\d{6}$/.test(trimmed)) return null;

  const ch1Preset = getCh1PresetByPassword(trimmed);
  if (ch1Preset) {
    return {
      type: 'ch1',
      chapterId: 'ch1',
      stage: ch1Preset.stage,
      password: ch1Preset.password,
    };
  }

  if (trimmed.slice(1) !== '00000') return null;
  const first = Number(trimmed[0]) as ChapterDigit;
  if (first < 2 || first > 6) return null;
  const chapterId = CHAPTER_IDS[first];
  if (!chapters[chapterId]) return null;
  return { type: 'chapter', chapter: first, variant: 0, chapterId };
}

/**
 * 取得該章「標準起點」的 GameState，與 GameEngine 預設結構一致。
 * 僅用於第二章～第六章（2～6）。
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

const DEFAULT_PREFERENCES = {
  preference_system_intervention: 0,
  preference_observation_wait: 0,
  overweight_motive: 0,
  weight_behavior_evidence: 0,
  weight_process_similarity: 0,
  weight_escape_route: 0,
  question_system: 0,
  avoid_early_conviction: 0,
} as const;

const DEFAULT_INSIGHTS = {
  procedure_insight: 0,
  human_insight: 0,
  evidence_insight: 0,
} as const;

/**
 * 依第一章密碼取得該階段的完整 GameState，供寫入 localStorage 後直接進入場景。
 */
export function getCh1StateForPassword(password: string): GameState | null {
  const preset = getCh1PresetByPassword(password);
  if (!preset) return null;
  const flags: Record<string, boolean> = {};
  preset.flags.forEach((f) => {
    flags[f] = true;
  });
  return {
    currentChapter: 'ch1',
    currentScene: preset.currentScene,
    inventory: [...preset.inventory],
    flags,
    interactions: [],
    visitedScenes: [...preset.visitedScenes],
    explorationProgress: {},
    chapterPuzzleUnlocked: {},
    score: 0,
    weights: {},
    choices: [],
    preferences: { ...DEFAULT_PREFERENCES },
    insights: { ...DEFAULT_INSIGHTS },
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
