'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { m, useReducedMotion } from 'framer-motion';
import type { ReportChapterId } from '@/data/getChapterConfig';
import {
  resolveChapterClosingReward,
  type ChapterClosingCh6EndingId,
} from '@/data/chapterClosingRewards';
import OverlayCard from '@/components/OverlayCard';

export interface ChapterClosingRewardStepProps {
  chapterId: ReportChapterId;
  onContinue: () => void;
  ch6EndingId?: ChapterClosingCh6EndingId;
}

const DIALOG_TITLE_ID = 'chapter-closing-reward-title';

export default function ChapterClosingRewardStep({
  chapterId,
  onContinue,
  ch6EndingId,
}: ChapterClosingRewardStepProps) {
  const continueRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();

  const { src, alt } = resolveChapterClosingReward(chapterId, ch6EndingId);

  useEffect(() => {
    continueRef.current?.focus();
  }, []);

  return (
    <m.div
      role="dialog"
      aria-modal="true"
      aria-labelledby={DIALOG_TITLE_ID}
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.25, ease: 'easeOut' }}
      className="w-full max-w-md mx-auto"
    >
      <OverlayCard
        tone="system"
        size="md"
        className="w-full p-6 md:p-8 flex flex-col items-center gap-6"
      >
        <h2
          id={DIALOG_TITLE_ID}
          className="text-xl md:text-2xl font-bold text-center bg-gradient-to-r from-amber-200 via-orange-300 to-amber-400 bg-clip-text text-transparent"
        >
          本章印記
        </h2>

        <div className="relative w-full max-w-[min(100%,540px)] aspect-[3/4] rounded-xl overflow-hidden border border-amber-600/30 bg-slate-900/80 shadow-lg">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 90vw, 540px"
            priority
          />
        </div>

        <button
          ref={continueRef}
          type="button"
          onClick={onContinue}
          className="w-full max-w-xs py-3 px-6 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold shadow-md hover:from-amber-500 hover:to-orange-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          繼續
        </button>
      </OverlayCard>
    </m.div>
  );
}
