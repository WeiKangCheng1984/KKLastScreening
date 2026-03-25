'use client';

import { useCallback, useMemo, useState } from 'react';
import ReportFillBlank from '@/components/ReportFillBlank';
import Ch2CrowPhoneRiddle from '@/components/Ch2CrowPhoneRiddle';
import { ch2ReportConfig } from '@/data/ch2ReportConfig';
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

export default function Ch2ReportEditor({ engine, onComplete }: Ch2ReportEditorProps) {
  const [phase, setPhase] = useState<'fill' | 'phone'>('fill');
  const [index, setIndex] = useState(0);
  const configs = useMemo(() => ch2ReportConfig.ch2ReportFillBlanks, []);
  const phoneConfig = ch2ReportConfig.ch2PhoneRiddle;
  const current = configs[index];

  const handleQuestionComplete = useCallback(() => {
    if (index === 0) {
      engine.applyEffect({ type: 'setFlag', flag: 'ch2_q1_done', value: true } as Effect);
      setIndex(1);
      return;
    }
    if (index === 1) {
      engine.applyEffect({ type: 'setFlag', flag: 'ch2_q2_done', value: true } as Effect);
      setPhase('phone');
    }
  }, [engine, index]);

  const handlePhoneSuccess = useCallback(() => {
    engine.applyEffect({ type: 'setFlag', flag: 'ch2_phone_riddle_done', value: true } as Effect);
    engine.applyEffect({ type: 'setFlag', flag: 'ch2_qa_reviewed_with_liu', value: true } as Effect);
    engine.setReasoningComplete('ch2');
    onComplete();
  }, [engine, onComplete]);

  if (phase === 'phone') {
    return <Ch2CrowPhoneRiddle config={phoneConfig} onSuccess={handlePhoneSuccess} />;
  }

  if (!current) return null;

  return (
    <ReportFillBlank
      key={`ch2-report-q-${index}`}
      config={current}
      onComplete={handleQuestionComplete}
    />
  );
}
