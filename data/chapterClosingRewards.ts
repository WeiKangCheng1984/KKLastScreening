import type { ReportChapterId } from '@/data/getChapterConfig';

/** 與 Ch6ReportEditor 結局 id 對齊（避免 data 依賴 client 元件）。 */
export type ChapterClosingCh6EndingId =
  | 'ending_truth'
  | 'ending_evidence_but_pr'
  | 'ending_pr_wins'
  | 'ending_stalemate';

/** `public/` 下章尾圖目錄（實際路徑：`public/images/closing/`） */
export const CHAPTER_CLOSING_IMAGE_DIR = '/images/closing';

/**
 * 章尾圖檔副檔名。正式圖為直式 4:3 WebP（寬:高 = 3:4，建議 540×720，`public/images/closing/`）。
 * 改此常數即可同步所有路徑。
 */
export const CHAPTER_CLOSING_ASSET_EXT = 'webp' as const;

type ClosingChapterSingle = 'ch1' | 'ch2' | 'ch3' | 'ch4' | 'ch5';

/**
 * 第 1～5 章：每章單一檔 `reward_{chapter}.{ext}`
 */
export function chapterClosingRewardPath(chapter: ClosingChapterSingle): string {
  return `${CHAPTER_CLOSING_IMAGE_DIR}/reward_${chapter}.${CHAPTER_CLOSING_ASSET_EXT}`;
}

/** 第六章結局分支：`reward_ch6_{endingId}.{ext}` */
export function chapterClosingRewardCh6EndingPath(endingId: ChapterClosingCh6EndingId): string {
  return `${CHAPTER_CLOSING_IMAGE_DIR}/reward_ch6_${endingId}.${CHAPTER_CLOSING_ASSET_EXT}`;
}

/** ch6 無結局 id 或結局設定缺失時之預設圖 */
export const CHAPTER_CLOSING_CH6_DEFAULT = `${CHAPTER_CLOSING_IMAGE_DIR}/reward_ch6_default.${CHAPTER_CLOSING_ASSET_EXT}`;

/** 最終後備 */
export const CHAPTER_CLOSING_REWARD_PLACEHOLDER = `${CHAPTER_CLOSING_IMAGE_DIR}/reward_placeholder.${CHAPTER_CLOSING_ASSET_EXT}`;

const DEFAULT_REWARD_ALT = '章節結算插圖';

function captionsCh1to5(chapterLabel: string): string {
  return `${chapterLabel}本章印記（占位）`;
}

export interface ChapterClosingRewardEntry {
  /** ch1～ch5：單一路徑；ch6 僅作為非結局／缺設定時之敘述用（實際圖像見 byEnding 與預設檔） */
  src: string;
  caption?: string;
  byEnding?: Partial<Record<ChapterClosingCh6EndingId, { src: string; caption?: string }>>;
}

/** 表驅動章尾獎勵圖（實檔放 `public/images/closing/`）。 */
export const CHAPTER_CLOSING_REWARDS: Record<ReportChapterId, ChapterClosingRewardEntry> = {
  ch1: {
    src: chapterClosingRewardPath('ch1'),
    caption: DEFAULT_REWARD_ALT,
  },
  ch2: {
    src: chapterClosingRewardPath('ch2'),
    caption: captionsCh1to5('第二章'),
  },
  ch3: {
    src: chapterClosingRewardPath('ch3'),
    caption: captionsCh1to5('第三章'),
  },
  ch4: {
    src: chapterClosingRewardPath('ch4'),
    caption: captionsCh1to5('第四章'),
  },
  ch5: {
    src: chapterClosingRewardPath('ch5'),
    caption: captionsCh1to5('第五章'),
  },
  ch6: {
    src: CHAPTER_CLOSING_CH6_DEFAULT,
    caption: captionsCh1to5('第六章'),
    byEnding: {
      ending_truth: {
        src: chapterClosingRewardCh6EndingPath('ending_truth'),
        caption: '第六章結局：真相路線 · 本章印記（占位）',
      },
      ending_evidence_but_pr: {
        src: chapterClosingRewardCh6EndingPath('ending_evidence_but_pr'),
        caption: '第六章結局：證據與公關 · 本章印記（占位）',
      },
      ending_pr_wins: {
        src: chapterClosingRewardCh6EndingPath('ending_pr_wins'),
        caption: '第六章結局：公關主導 · 本章印記（占位）',
      },
      ending_stalemate: {
        src: chapterClosingRewardCh6EndingPath('ending_stalemate'),
        caption: '第六章結局：僵局 · 本章印記（占位）',
      },
    },
  },
};

export function resolveChapterClosingReward(
  chapterId: ReportChapterId,
  ch6EndingId?: ChapterClosingCh6EndingId
): { src: string; alt: string } {
  const entry = CHAPTER_CLOSING_REWARDS[chapterId];

  if (chapterId === 'ch6') {
    if (ch6EndingId) {
      const ending = entry.byEnding?.[ch6EndingId];
      if (ending) {
        return {
          src: ending.src,
          alt: ending.caption ?? entry.caption ?? DEFAULT_REWARD_ALT,
        };
      }
    }
    // 無結局 id 或結局表缺列：先 `reward_ch6_default`，再後備 `reward_placeholder`
    return {
      src: CHAPTER_CLOSING_CH6_DEFAULT,
      alt: entry.caption ?? DEFAULT_REWARD_ALT,
    };
  }

  return {
    src: entry.src ?? CHAPTER_CLOSING_REWARD_PLACEHOLDER,
    alt: entry.caption ?? DEFAULT_REWARD_ALT,
  };
}
