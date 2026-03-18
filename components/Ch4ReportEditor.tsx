'use client';

import { useEffect, useMemo, useState } from 'react';
import ReportFillBlank from '@/components/ReportFillBlank';
import { ch4ReportFillBlanks } from '@/data/ch4ReportConfig';
import type { Effect, GameState, DialogChoice } from '@/types/game';

export interface Ch4ReportEditorProps {
  engine: {
    getState: () => GameState;
    applyEffect: (effect: Effect) => void;
    handleDialogChoice?: (choice: DialogChoice) => void;
    setReasoningComplete: (chapterId: string) => void;
  };
  onComplete: () => void;
  onClose: () => void;
}

export default function Ch4ReportEditor({ engine, onComplete }: Ch4ReportEditorProps) {
  const [index, setIndex] = useState(0);

  const configs = useMemo(() => ch4ReportFillBlanks, []);
  const current = configs[index];

  useEffect(() => {
    if (index < configs.length) return;
    engine.applyEffect({ type: 'setFlag', flag: 'ch4_liu_report_done', value: true });
    engine.applyEffect({ type: 'setFlag', flag: 'ch4_reasoning_done', value: true });
    engine.applyEffect({ type: 'setFlag', flag: 'navigate_to_ch5_intro', value: true });
    engine.setReasoningComplete('ch4');
    onComplete();
  }, [index, configs.length, engine, onComplete]);

  if (!current) return null;

  return (
    <ReportFillBlank
      key={`ch4-report-q-${index}`}
      config={current}
      onComplete={() => setIndex((i) => i + 1)}
    />
  );
}

