import type { ChapterReasoning } from '@/data/reasoningByChapter';
import { reasoningByChapter } from '@/data/reasoningByChapter';

export interface ChapterConfig {
  reasoning?: ChapterReasoning;
}

export function getChapterConfig(chapterId: string): ChapterConfig {
  if (chapterId === 'ch1') {
    return {
      reasoning: reasoningByChapter.ch1,
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

