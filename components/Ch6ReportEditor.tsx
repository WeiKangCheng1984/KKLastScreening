'use client';

import { useEffect, useMemo, useState } from 'react';
import ReportFillBlank from '@/components/ReportFillBlank';
import { ch6ReportFillBlanks } from '@/data/ch6ReportConfig';
import type { DialogChoice, Effect, GameState } from '@/types/game';

export type Ch6EndingId =
  | 'ending_truth'
  | 'ending_evidence_but_pr'
  | 'ending_pr_wins'
  | 'ending_stalemate';

export interface Ch6ReportEditorProps {
  engine: {
    getState: () => GameState;
    applyEffect: (effect: Effect) => void;
    handleDialogChoice?: (choice: DialogChoice) => void;
    setReasoningComplete: (chapterId: string) => void;
  };
  onComplete: (endingId: Ch6EndingId) => void;
  onClose: () => void;
}

function computeCh6EndingId(flags: Record<string, unknown>): Ch6EndingId {
  const rawSecured = !!flags.ch6_raw_log_secured;
  const prAccept = !!flags.ch6_pr_accept_edited_brief;

  if (rawSecured && !prAccept) return 'ending_truth';
  if (rawSecured && prAccept) return 'ending_evidence_but_pr';
  if (!rawSecured && prAccept) return 'ending_pr_wins';
  return 'ending_stalemate';
}

export default function Ch6ReportEditor({ engine, onComplete }: Ch6ReportEditorProps) {
  const [index, setIndex] = useState(0);
  const configs = useMemo(() => ch6ReportFillBlanks, []);
  const current = configs[index];

  useEffect(() => {
    if (index < configs.length) return;

    const st = engine.getState();
    const flags = (st.flags || {}) as Record<string, unknown>;
    const endingId = computeCh6EndingId(flags);

    engine.applyEffect({ type: 'setFlag', flag: 'ch6_liu_report_done', value: true });
    engine.applyEffect({ type: 'setFlag', flag: 'ch6_reasoning_done', value: true });
    engine.applyEffect({ type: 'setFlag', flag: 'game_completed', value: true });
    engine.setReasoningComplete('ch6');
    onComplete(endingId);
  }, [configs.length, engine, index, onComplete]);

  if (!current) return null;

  return (
    <ReportFillBlank
      key={`ch6-report-q-${index}`}
      config={current}
      onComplete={() => setIndex((i) => i + 1)}
    />
  );
}

