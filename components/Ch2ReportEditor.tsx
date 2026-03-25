'use client';

import { useCallback, useMemo, useState } from 'react';
import ReportFillBlank from '@/components/ReportFillBlank';
import { ch2ReportConfig, normalizeCh2KeywordAnswer } from '@/data/ch2ReportConfig';
import type { Effect, GameState, DialogChoice } from '@/types/game';

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
  keywordLabel,
  keywordPlaceholder,
  wrongHint,
  acceptableAnswersNormalized,
  liuClosing,
  supplement,
  finalizeButtonLabel,
  onConfirm,
}: {
  keywordLabel: string;
  keywordPlaceholder: string;
  wrongHint: string;
  acceptableAnswersNormalized: string[];
  liuClosing: string;
  supplement: string;
  finalizeButtonLabel: string;
  onConfirm: () => void;
}) {
  const [keyword, setKeyword] = useState('');
  const [showWrong, setShowWrong] = useState(false);

  const tryConfirm = useCallback(() => {
    const n = normalizeCh2KeywordAnswer(keyword);
    if (!n || !acceptableAnswersNormalized.includes(n)) {
      setShowWrong(true);
      return;
    }
    setShowWrong(false);
    onConfirm();
  }, [acceptableAnswersNormalized, keyword, onConfirm]);

  return (
    <div className="w-full max-w-md mx-auto px-4 py-6 space-y-5 text-center">
      <p className="text-sm text-gray-300/95 leading-relaxed whitespace-pre-line">{liuClosing}</p>
      <p className="text-xs text-gray-500 leading-relaxed">{supplement}</p>
      <div className="text-left space-y-2">
        <label htmlFor="ch2-round2-keyword" className="block text-xs text-gray-400">
          {keywordLabel}
        </label>
        <input
          id="ch2-round2-keyword"
          type="text"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setShowWrong(false);
          }}
          placeholder={keywordPlaceholder}
          autoComplete="off"
          className="w-full rounded-xl border border-zinc-600 bg-zinc-950/60 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
        />
      </div>
      {showWrong && (
        <p className="text-xs text-amber-200/90 text-left leading-relaxed">{wrongHint}</p>
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

  const acceptableRound2 = useMemo(
    () => phoneCfg.acceptableAnswers.map((a) => normalizeCh2KeywordAnswer(a)),
    [phoneCfg.acceptableAnswers],
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
        keywordLabel={phoneCfg.round2KeywordLabel}
        keywordPlaceholder={phoneCfg.round2KeywordPlaceholder}
        wrongHint={phoneCfg.round2KeywordWrongHint}
        acceptableAnswersNormalized={acceptableRound2}
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
