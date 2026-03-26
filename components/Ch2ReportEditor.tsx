'use client';

import { useCallback, useMemo, useState } from 'react';
import ReportFillBlank from '@/components/ReportFillBlank';
import Ch2TriWheel from '@/components/Ch2TriWheel';
import { ch2ReportConfig, normalizeCh2KeywordAnswer } from '@/data/ch2ReportConfig';
import type { Effect, GameState, DialogChoice } from '@/types/game';

const CH2_ROUND2_WHEEL_INITIAL: [string, string, string] = ['A', 'B', 'D'];

function triWheelMatches(
  v: [string, string, string],
  correct: readonly [string, string, string],
): boolean {
  return v[0] === correct[0] && v[1] === correct[1] && v[2] === correct[2];
}

export interface Ch2ReportEditorProps {
  engine: {
    getState: () => GameState;
    applyEffect: (effect: Effect) => void;
    handleDialogChoice?: (choice: DialogChoice) => void;
    setReasoningComplete: (chapterId: string) => void;
  };
  /** 第二輪結案完成 → 進入 reward */
  onComplete: () => void;
  /** 第一輪兩題填完 → 僅關閉章尾 overlay，不進 reward */
  onRound1Dismiss: () => void;
}

function Ch2ReportRound2Panel({
  penNameLabel,
  penNamePlaceholder,
  penNameWrongHint,
  triWheelWrongHint,
  acceptablePenNameNormalized,
  triWheelAlphabet,
  triWheelColumns,
  triWheelCorrect,
  liuClosing,
  supplement,
  finalizeButtonLabel,
  onConfirm,
}: {
  penNameLabel: string;
  penNamePlaceholder: string;
  penNameWrongHint: string;
  triWheelWrongHint: string;
  acceptablePenNameNormalized: string[];
  triWheelAlphabet: string[];
  triWheelColumns: [string, string, string];
  triWheelCorrect: readonly [string, string, string];
  liuClosing: string;
  supplement: string;
  finalizeButtonLabel: string;
  onConfirm: () => void;
}) {
  const [penName, setPenName] = useState('');
  const [wheel, setWheel] = useState<[string, string, string]>(() => CH2_ROUND2_WHEEL_INITIAL);
  const [feedbackKind, setFeedbackKind] = useState<null | 'pen' | 'wheel'>(null);

  const tryConfirm = useCallback(() => {
    const n = normalizeCh2KeywordAnswer(penName);
    if (!n || !acceptablePenNameNormalized.includes(n)) {
      setFeedbackKind('pen');
      return;
    }
    if (!triWheelMatches(wheel, triWheelCorrect)) {
      setFeedbackKind('wheel');
      return;
    }
    setFeedbackKind(null);
    onConfirm();
  }, [acceptablePenNameNormalized, onConfirm, penName, triWheelCorrect, wheel]);

  const wrongMessage =
    feedbackKind === 'pen' ? penNameWrongHint : feedbackKind === 'wheel' ? triWheelWrongHint : null;

  return (
    <div className="w-full max-w-md mx-auto px-4 py-6 space-y-5 text-center">
      <p className="text-sm text-gray-300/95 leading-relaxed whitespace-pre-line">{liuClosing}</p>
      <p className="text-xs text-gray-500 leading-relaxed">{supplement}</p>
      <div className="text-left space-y-2">
        <label htmlFor="ch2-round2-pen-name" className="block text-xs text-gray-400">
          {penNameLabel}
        </label>
        <input
          id="ch2-round2-pen-name"
          type="text"
          value={penName}
          onChange={(e) => {
            setPenName(e.target.value);
            setFeedbackKind(null);
          }}
          placeholder={penNamePlaceholder}
          autoComplete="off"
          className="w-full rounded-xl border border-zinc-600 bg-zinc-950/60 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
        />
      </div>
      <div className="text-left space-y-2 pt-1">
        <p className="text-xs text-gray-400">三館代號（左→右對齊 W、R、C）</p>
        <Ch2TriWheel
          value={wheel}
          onChange={(next) => {
            setWheel(next);
            setFeedbackKind(null);
          }}
          alphabet={triWheelAlphabet}
          columnLabels={triWheelColumns}
          ariaLabelPrefix="ch2-round2-wheel"
        />
      </div>
      {wrongMessage && (
        <p className="text-xs text-amber-200/90 text-left leading-relaxed">{wrongMessage}</p>
      )}
      <button
        type="button"
        onClick={tryConfirm}
        className="w-full py-3 rounded-xl border border-orange-500/40 bg-orange-950/40 text-orange-100 text-sm font-medium hover:bg-orange-900/50 transition-colors"
      >
        {finalizeButtonLabel}
      </button>
    </div>
  );
}

export default function Ch2ReportEditor({ engine, onComplete, onRound1Dismiss }: Ch2ReportEditorProps) {
  const [index, setIndex] = useState(0);
  const configs = useMemo(() => ch2ReportConfig.ch2ReportFillBlanks, []);
  const current = configs[index];
  const phoneCfg = ch2ReportConfig.ch2PhoneRiddle;
  const round2Panel = ch2ReportConfig.ch2ReportRound2Panel;
  const interstitial = ch2ReportConfig.ch2ReportInterstitial;

  const acceptablePenRound2 = useMemo(
    () => phoneCfg.acceptablePenNameAnswers.map((a) => normalizeCh2KeywordAnswer(a)),
    [phoneCfg.acceptablePenNameAnswers],
  );

  const flags = engine.getState().flags || {};

  const handleRound2Confirm = useCallback(() => {
    engine.applyEffect({ type: 'setFlag', flag: 'ch2_qa_reviewed_with_liu', value: true } as Effect);
    engine.setReasoningComplete('ch2');
    onComplete();
  }, [engine, onComplete]);

  const handleQuestionComplete = useCallback(() => {
    if (index === 0) {
      engine.applyEffect({ type: 'setFlag', flag: 'ch2_q1_done', value: true } as Effect);
      setIndex(1);
      return;
    }
    if (index === 1) {
      engine.applyEffect({ type: 'setFlag', flag: 'ch2_q2_done', value: true } as Effect);
      engine.applyEffect({ type: 'setFlag', flag: 'ch2_report_fill_done', value: true } as Effect);
      onRound1Dismiss();
    }
  }, [engine, index, onRound1Dismiss]);

  if (flags.ch2_reasoning_done) {
    return null;
  }

  if (flags.ch2_phone_riddle_done) {
    return (
      <Ch2ReportRound2Panel
        penNameLabel={phoneCfg.round2PenNameLabel}
        penNamePlaceholder={phoneCfg.round2PenNamePlaceholder}
        penNameWrongHint={phoneCfg.round2PenNameWrongHint}
        triWheelWrongHint={phoneCfg.round2TriWheelWrongHint}
        acceptablePenNameNormalized={acceptablePenRound2}
        triWheelAlphabet={phoneCfg.triWheelAlphabet}
        triWheelColumns={phoneCfg.triWheelColumns}
        triWheelCorrect={phoneCfg.triWheelCorrect}
        liuClosing={round2Panel.liuClosing}
        supplement={round2Panel.supplement}
        finalizeButtonLabel={round2Panel.finalizeButtonLabel}
        onConfirm={handleRound2Confirm}
      />
    );
  }

  if (!flags.ch2_report_fill_done) {
    if (!current) return null;
    return (
      <ReportFillBlank
        key={`ch2-report-q-${index}`}
        config={current}
        onComplete={handleQuestionComplete}
      />
    );
  }

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8 space-y-4 text-center">
      <p className="text-sm text-gray-300 leading-relaxed">{interstitial.afterRound1NeedPhone}</p>
      <button
        type="button"
        onClick={onRound1Dismiss}
        className="px-6 py-2 rounded-lg border border-zinc-600 text-zinc-200 text-sm hover:bg-zinc-800/80"
      >
        關閉
      </button>
    </div>
  );
}
