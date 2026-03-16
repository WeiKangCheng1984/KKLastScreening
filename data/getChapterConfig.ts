import type { ChapterReasoning } from '@/data/reasoningByChapter';
import { reasoningByChapter } from '@/data/reasoningByChapter';
import { ch1ReportConfig } from '@/data/ch1ReportConfig';

export interface ChapterConfig {
  reasoning?: ChapterReasoning;
  ch1ReportConfig?: typeof ch1ReportConfig;
}

export function getChapterConfig(chapterId: string): ChapterConfig {
  if (chapterId === 'ch1') {
    return {
      reasoning: reasoningByChapter.ch1,
      ch1ReportConfig,
    };
  }

  if (chapterId === 'ch2') {
    return {
      reasoning: reasoningByChapter.ch2,
    };
  }

  const reasoning = reasoningByChapter[chapterId];
  return {
    reasoning,
  };
}

