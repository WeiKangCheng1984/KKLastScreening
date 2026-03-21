import type { GameState } from '@/types/game';
import type { ReportChapterId } from '@/data/getChapterConfig';
import { getDominantInsightKey, type DominantInsightKey } from '@/lib/getDominantInsightKey';

/** 與 Ch6ReportEditor 結局 id 對齊（避免 data 依賴 client 元件）。 */
export type ChapterClosingCh6EndingId =
  | 'ending_truth'
  | 'ending_evidence_but_pr'
  | 'ending_pr_wins'
  | 'ending_stalemate';

export const CHAPTER_CLOSING_REWARD_PLACEHOLDER = '/images/closing/reward_placeholder.svg';

const DEFAULT_REWARD_ALT = '章節結算插圖';

export interface ChapterClosingRewardEntry {
  byDimension: Record<DominantInsightKey, string>;
  captionByDimension?: Partial<Record<DominantInsightKey, string>>;
  byEnding?: Partial<Record<ChapterClosingCh6EndingId, { src: string; caption?: string }>>;
}

const sharedPlaceholderDimensions: Record<DominantInsightKey, string> = {
  procedure_insight: CHAPTER_CLOSING_REWARD_PLACEHOLDER,
  human_insight: CHAPTER_CLOSING_REWARD_PLACEHOLDER,
  evidence_insight: CHAPTER_CLOSING_REWARD_PLACEHOLDER,
};

/**
 * 表驅動章尾獎勵圖。正式檔建議：public/images/closing/reward_ch{1-6}_{dimension}.webp（540×540）。
 * 目前皆指向占位圖，替換檔名見 public/images/closing/README.md。
 */
export const CHAPTER_CLOSING_REWARDS: Record<ReportChapterId, ChapterClosingRewardEntry> = {
  ch1: {
    byDimension: { ...sharedPlaceholderDimensions },
    captionByDimension: {
      procedure_insight: DEFAULT_REWARD_ALT,
      human_insight: DEFAULT_REWARD_ALT,
      evidence_insight: DEFAULT_REWARD_ALT,
    },
  },
  ch2: { byDimension: { ...sharedPlaceholderDimensions } },
  ch3: { byDimension: { ...sharedPlaceholderDimensions } },
  ch4: { byDimension: { ...sharedPlaceholderDimensions } },
  ch5: { byDimension: { ...sharedPlaceholderDimensions } },
  ch6: {
    byDimension: { ...sharedPlaceholderDimensions },
    // 若有結局專用圖，在此覆寫；否則沿用維度圖再回退占位。
    byEnding: {},
  },
};

export function resolveChapterClosingReward(
  chapterId: ReportChapterId,
  state: GameState,
  ch6EndingId?: ChapterClosingCh6EndingId
): { src: string; alt: string } {
  const entry = CHAPTER_CLOSING_REWARDS[chapterId];
  const dim = getDominantInsightKey(state);
  const dimSrc = entry.byDimension[dim];
  const dimCaption = entry.captionByDimension?.[dim];

  if (chapterId === 'ch6' && ch6EndingId) {
    const ending = entry.byEnding?.[ch6EndingId];
    if (ending) {
      return {
        src: ending.src,
        alt: ending.caption ?? dimCaption ?? DEFAULT_REWARD_ALT,
      };
    }
  }

  return {
    src: dimSrc ?? CHAPTER_CLOSING_REWARD_PLACEHOLDER,
    alt: dimCaption ?? DEFAULT_REWARD_ALT,
  };
}
