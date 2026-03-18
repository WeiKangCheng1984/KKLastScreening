'use client';

import { useEffect, useMemo, useState } from 'react';
import ReportFillBlank from '@/components/ReportFillBlank';
import { ch5ReportFillBlanks } from '@/data/ch5ReportConfig';
import type { Effect, GameState, DialogChoice } from '@/types/game';

export interface Ch5ReportEditorProps {
  engine: {
    getState: () => GameState;
    applyEffect: (effect: Effect) => void;
    handleDialogChoice?: (choice: DialogChoice) => void;
    setReasoningComplete: (chapterId: string) => void;
  };
  onComplete: () => void;
  onClose: () => void;
}

export default function Ch5ReportEditor({ engine, onComplete }: Ch5ReportEditorProps) {
  const [index, setIndex] = useState(0);

  const configs = useMemo(() => ch5ReportFillBlanks, []);
  const current = configs[index];

  useEffect(() => {
    if (index < configs.length) return;
    engine.applyEffect({ type: 'setFlag', flag: 'ch5_liu_report_done', value: true });
    engine.applyEffect({ type: 'setFlag', flag: 'ch5_reasoning_done', value: true });
    engine.applyEffect({ type: 'setFlag', flag: 'navigate_to_ch6_intro', value: true });
    engine.setReasoningComplete('ch5');
    onComplete();
  }, [index, configs.length, engine, onComplete]);

  if (!current) return null;

  return (
    <ReportFillBlank
      key={`ch5-report-q-${index}`}
      config={current}
      onComplete={() => setIndex((i) => i + 1)}
    />
  );
}

