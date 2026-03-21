'use client';

import type { ReactNode } from 'react';
import { m, useReducedMotion } from 'framer-motion';

export interface ChapterConclusionOverlayProps {
  children: ReactNode;
}

/**
 * 章尾結算共用外層：負責遮罩與置中的容器，實際內容交由內部卡片（例如 Ch1ReportEditor、Ch2ReportEditor、Ch3ReportEditor）決定。
 */
export default function ChapterConclusionOverlay({ children }: ChapterConclusionOverlayProps) {
  const reduceMotion = useReducedMotion();
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.2 }}
      className="absolute inset-0 z-[70] flex items-center justify-center bg-black/75 backdrop-blur-md px-4 pointer-events-auto"
    >
      <div className="w-full max-w-4xl max-h-[90vh] flex items-stretch justify-center">
        {children}
      </div>
    </m.div>
  );
}

