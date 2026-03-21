import type { ChapterReasoning } from '@/data/reasoningByChapter';
import { reasoningByChapter } from '@/data/reasoningByChapter';

export const REPORT_CHAPTER_IDS = ['ch1', 'ch2', 'ch3', 'ch4', 'ch5', 'ch6'] as const;
export type ReportChapterId = (typeof REPORT_CHAPTER_IDS)[number];

export function isReportChapterId(id: string): id is ReportChapterId {
  return (REPORT_CHAPTER_IDS as readonly string[]).includes(id);
}

/** 章尾 overlay／導航（表驅動，減少 play 頁 if-else） */
export interface ChapterReportConfig {
  /** 編輯器完成後：若旗標為 true 則清除並導向 href（ch6 無，改由結局 overlay 處理） */
  postComplete?: { flag: string; href: string };
}

export interface ChapterConfig {
  reasoning?: ChapterReasoning;
  report: ChapterReportConfig;
}

const CHAPTER_REPORT: Record<string, ChapterReportConfig> = {
  ch1: {
    postComplete: { flag: 'navigate_to_ch2_intro', href: '/play/ch2/intro' },
  },
  ch2: {
    postComplete: { flag: 'navigate_to_ch3_intro', href: '/play/ch3/intro' },
  },
  ch3: {
    postComplete: { flag: 'navigate_to_ch4_intro', href: '/play/ch4/intro' },
  },
  ch4: {
    postComplete: { flag: 'navigate_to_ch5_intro', href: '/play/ch5/intro' },
  },
  ch5: {
    postComplete: { flag: 'navigate_to_ch6_intro', href: '/play/ch6/intro' },
  },
  ch6: {},
};

export function getChapterConfig(chapterId: string): ChapterConfig {
  const reasoning = reasoningByChapter[chapterId];
  const report = CHAPTER_REPORT[chapterId] ?? {};

  if (chapterId === 'ch1') {
    return {
      reasoning: reasoningByChapter.ch1,
      report,
    };
  }

  if (chapterId === 'ch2') {
    return {
      reasoning: reasoningByChapter.ch2,
      report,
    };
  }

  return {
    reasoning,
    report,
  };
}

/** 對話選項 id → 開啟哪一章的章尾編輯器（表驅動） */
export const CHOICE_ID_TO_REPORT_CHAPTER: Record<string, ReportChapterId> = {
  ch1_liu_report_now: 'ch1',
  ch2_liu_open_qa_conclusion: 'ch2',
  ch3_liu_report_now: 'ch3',
  ch4_liu_report_now: 'ch4',
  ch5_liu_report_now: 'ch5',
  ch6_liu_report_now: 'ch6',
};
