'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import ReportFillBlank from '@/components/ReportFillBlank';
import { ch2ReportFillBlanks } from '@/data/ch2ReportConfig';
import type { Effect, GameState, DialogChoice } from '@/types/game';

export interface Ch2ReportEditorProps {
  engine: {
    getState: () => GameState;
    applyEffect: (effect: Effect) => void;
    handleDialogChoice?: (choice: DialogChoice) => void;
    setReasoningComplete: (chapterId: string) => void;
  };
  onComplete: () => void;
  onClose: () => void;
}

const CH2_Q_DONE_FLAGS = [
  'ch2_q1_done',
  'ch2_q2_done',
  'ch2_q3_done',
  'ch2_q4_done',
  'ch2_q5_done',
] as const;

export default function Ch2ReportEditor({ engine, onComplete }: Ch2ReportEditorProps) {
  const [index, setIndex] = useState(0);
  const configs = useMemo(() => ch2ReportFillBlanks, []);
  const current = configs[index];

  const handleQuestionComplete = useCallback(() => {
    setIndex((i) => {
      const n = i + 1;
      if (n >= 1 && n <= CH2_Q_DONE_FLAGS.length) {
        engine.applyEffect({ type: 'setFlag', flag: CH2_Q_DONE_FLAGS[n - 1], value: true } as Effect);
      }
      return i + 1;
    });
  }, [engine]);

  useEffect(() => {
    if (index < configs.length) return;
    engine.applyEffect({ type: 'setFlag', flag: 'ch2_qa_reviewed_with_liu', value: true } as Effect);
    engine.setReasoningComplete('ch2');
    onComplete();
  }, [index, configs.length, engine, onComplete]);

  if (!current) return null;

  return (
    <ReportFillBlank
      key={`ch2-report-q-${index}`}
      config={current}
      onComplete={handleQuestionComplete}
    />
  );
}
