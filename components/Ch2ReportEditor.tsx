'use client';

import { useCallback, useMemo, useState } from 'react';
import ReportFillBlank from '@/components/ReportFillBlank';
import { ch2ReportConfig } from '@/data/ch2ReportConfig';
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

function Ch2ReportRound2Panel({ onConfirm }: { onConfirm: () => void }) {
  return (
    <div className="w-full max-w-md mx-auto px-4 py-6 space-y-6 text-center">
      <p className="text-sm text-gray-300/95 leading-relaxed whitespace-pre-line">
        {`劉隊把筆記本闔上。\n\n「這版能往上遞。剩下的交給鑑定與內勤。」`}
      </p>
      <p className="text-xs text-gray-500 leading-relaxed">
        你把手機草稿裡對上的關鍵詞，收進能交差的句子裡。
      </p>
      <button
        type="button"
        onClick={onConfirm}
        className="w-full py-3 rounded-xl border border-orange-500/40 bg-orange-950/40 text-orange-100 text-sm font-medium hover:bg-orange-900/50 transition-colors"
      >
        結案，前往下一章
      </button>
    </div>
  );
}

export default function Ch2ReportEditor({ engine, onComplete, onRound1Dismiss }: Ch2ReportEditorProps) {
  const [index, setIndex] = useState(0);
  const configs = useMemo(() => ch2ReportConfig.ch2ReportFillBlanks, []);
  const current = configs[index];

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

  // 第二輪：手機謎完成後，僅結案 UI → reward
  if (flags.ch2_phone_riddle_done) {
    return <Ch2ReportRound2Panel onConfirm={handleRound2Confirm} />;
  }

  // 第一輪：僅雙格填空（未完成 ch2_report_fill_done 前）
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

  // 已寫入第一輪但尚未完成手機謎：不應由劉隊開啟章尾；開發者／異常狀態提示
  return (
    <div className="w-full max-w-md mx-auto px-4 py-8 space-y-4 text-center">
      <p className="text-sm text-gray-300 leading-relaxed">
        請先到阿蘇終端取得技術組備忘，在背包內完成手機草稿解碼後，再向劉隊申請結案。
      </p>
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
