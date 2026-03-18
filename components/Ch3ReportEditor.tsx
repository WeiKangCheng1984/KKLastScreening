'use client';

import { useEffect, useMemo, useState } from 'react';
import ReportFillBlank from '@/components/ReportFillBlank';
import { ch3ReportFillBlanks } from '@/data/ch3ReportConfig';
import type { Effect, GameState, DialogChoice } from '@/types/game';

export interface Ch3ReportEditorProps {
  engine: {
    getState: () => GameState;
    applyEffect: (effect: Effect) => void;
    handleDialogChoice?: (choice: DialogChoice) => void;
    setReasoningComplete: (chapterId: string) => void;
  };
  onComplete: () => void;
  onClose: () => void;
}

export default function Ch3ReportEditor({ engine, onComplete }: Ch3ReportEditorProps) {
  const [index, setIndex] = useState(0);

  const configs = useMemo(() => ch3ReportFillBlanks, []);
  const current = configs[index];

  useEffect(() => {
    if (index < configs.length) return;
    // 章尾完成：設旗標 + 標記推理完成 + 導向下一章 intro（由 page.tsx 接手）
    engine.applyEffect({ type: 'setFlag', flag: 'ch3_liu_report_done', value: true });
    engine.applyEffect({ type: 'setFlag', flag: 'ch3_reasoning_done', value: true });
    engine.applyEffect({ type: 'setFlag', flag: 'navigate_to_ch4_intro', value: true });
    engine.setReasoningComplete('ch3');
    onComplete();
  }, [index, configs.length, engine, onComplete]);

  if (!current) return null;

  return (
    <ReportFillBlank
      key={`ch3-report-q-${index}`}
      config={current}
      onComplete={() => setIndex((i) => i + 1)}
    />
  );
}

