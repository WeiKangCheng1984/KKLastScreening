'use client';

import { useState, useMemo, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Clock, MessageSquare } from 'lucide-react';
import OverlayCard from '@/components/OverlayCard';
import ReportFillBlank from '@/components/ReportFillBlank';
import type { GameState, Effect } from '@/types/game';
import { ch1ReportConfig, CH1_REPORT_DEFAULT_EVIDENCE_IDS } from '@/data/ch1ReportConfig';

export interface Ch1ReportEditorProps {
  engine: {
    getState: () => GameState;
    applyEffect: (effect: Effect) => void;
    setReasoningComplete: (chapterId: string) => void;
  };
  onComplete: () => void;
  onClose: () => void;
}

const VISIBLE_STEPS = [
  { id: 1, label: '時間推測', icon: Clock },
  { id: 3, label: '初步判斷', icon: MessageSquare },
];

/** 單一數字翻牌（0–9） */
function FlipDigit({ digit }: { digit: number }) {
  const [displayed, setDisplayed] = useState(digit);
  const [flip, setFlip] = useState(false);
  useEffect(() => {
    if (digit !== displayed && !flip) setFlip(true);
  }, [digit, displayed, flip]);

  return (
    <div
      className="relative h-14 w-11 overflow-hidden rounded-lg bg-gradient-to-b from-gray-800/90 to-gray-900/95 shadow-inner"
      style={{
        perspective: '140px',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.25)',
        border: '1px solid rgba(251,146,60,0.25)',
      }}
    >
      <m.div
        className="absolute inset-0 flex origin-bottom items-center justify-center rounded-lg font-mono text-3xl font-semibold tabular-nums tracking-tight text-orange-100"
        style={{ backfaceVisibility: 'hidden', textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
        animate={{ rotateX: flip ? -90 : 0 }}
        transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {displayed}
      </m.div>
      <m.div
        className="absolute inset-0 flex origin-top items-center justify-center rounded-lg font-mono text-3xl font-semibold tabular-nums tracking-tight text-orange-100"
        style={{ backfaceVisibility: 'hidden', rotateX: 90, textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
        animate={{ rotateX: flip ? 0 : 90 }}
        transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
        onAnimationComplete={() => {
          if (flip) {
            setDisplayed(digit);
            setFlip(false);
          }
        }}
      >
        {digit}
      </m.div>
    </div>
  );
}

export default function Ch1ReportEditor({
  engine,
  onComplete,
  onClose,
}: Ch1ReportEditorProps) {
  const [step, setStep] = useState(1);
  const [timeMinutes, setTimeMinutes] = useState(0);
  const [timeHour, setTimeHour] = useState(0);
  const [attitudeFillBlankIndex, setAttitudeFillBlankIndex] = useState(0);
  const [showClosing, setShowClosing] = useState(false);
  const [timelineError, setTimelineError] = useState('');
  const [timelineErrorIndex, setTimelineErrorIndex] = useState(0);

  const config = ch1ReportConfig;

  useEffect(() => {
    engine.applyEffect({
      type: 'setFlag',
      flag: 'ch1_report_evidence',
      value: [...CH1_REPORT_DEFAULT_EVIDENCE_IDS],
    });
    engine.applyEffect({
      type: 'setFlag',
      flag: 'ch1_police_note',
      value: 'none',
    });
    // 章尾開啟時寫入旗標一次即可（不依賴 engine 參考相等性）
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const attitudeFillBlanks = config.attitude.attitudeFillBlanks;
  const attitudeBlankCount = attitudeFillBlanks?.length ?? 0;
  const useAttitudeFillBlanks = attitudeBlankCount > 0;
  const showClosingView =
    showClosing || (useAttitudeFillBlanks && attitudeFillBlankIndex >= attitudeBlankCount);

  useEffect(() => {
    if (!useAttitudeFillBlanks || attitudeFillBlankIndex < attitudeBlankCount) return;
    engine.applyEffect({ type: 'setFlag', flag: 'ch1_attitude_declared', value: true });
    setShowClosing(true);
  }, [useAttitudeFillBlanks, attitudeFillBlankIndex, attitudeBlankCount, engine]);

  const handleTimelineNext = () => {
    const range = config.timeline.crimeTimeRange;
    const hourOk = timeHour === 0;
    const minuteOk = timeMinutes >= range.startMinutes && timeMinutes <= range.endMinutes;
    if (!hourOk || !minuteOk) {
      const msg = config.timeline.errorMessages[timelineErrorIndex % config.timeline.errorMessages.length];
      const hh = String(timeHour).padStart(2, '0');
      const mm = String(timeMinutes).padStart(2, '0');
      setTimelineError(`${msg} 你選的是 ${hh}:${mm}。`);
      setTimelineErrorIndex((i) => i + 1);
      return;
    }
    engine.applyEffect({
      type: 'setFlag',
      flag: 'ch1_report_timeline',
      value: { type: 'crime_time', minutes: timeMinutes },
    });
    setStep(3);
    setTimelineError('');
  };

  const handleEnterCh2 = () => {
    engine.setReasoningComplete('ch1');
    onComplete();
  };

  const closingText = useMemo(() => {
    if (!showClosingView) return '';
    return config.attitude.closingInference;
  }, [showClosingView, config.attitude.closingInference]);

  return (
    <>
      {step === 3 && useAttitudeFillBlanks && attitudeFillBlankIndex < attitudeBlankCount && attitudeFillBlanks && (
        <ReportFillBlank
          key={`att-q-${attitudeFillBlankIndex}`}
          config={attitudeFillBlanks[attitudeFillBlankIndex]}
          onComplete={() => setAttitudeFillBlankIndex((i) => i + 1)}
        />
      )}
      <OverlayCard
        tone="system"
        size="lg"
        className="w-full max-w-4xl max-h-[90vh] min-h-[70vh] p-6 md:p-8 flex flex-col"
      >
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-amber-600/50">
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-200 via-orange-300 to-amber-400 bg-clip-text text-transparent">
            向劉隊報告
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
          {VISIBLE_STEPS.map((s) => (
            <span
              key={s.id}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm ${
                step === s.id ? 'bg-amber-600/35 text-amber-50 border border-amber-500/40' : 'bg-white/5 text-gray-400'
              }`}
            >
              <s.icon size={14} />
              {s.label}
            </span>
          ))}
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <m.div
                key="step1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-gray-200 mb-6">報告裡總得寫上一筆：事情發生在幾點。劉隊會問的。</p>
                <div className="flex flex-col items-center gap-6">
                  <div
                    className="rounded-2xl border border-orange-500/20 bg-gradient-to-b from-gray-800/60 to-gray-900/80 px-8 py-6"
                    style={{
                      boxShadow:
                        'inset 0 1px 0 rgba(251,146,60,0.06), 0 12px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.2)',
                    }}
                  >
                    <div className="flex items-center justify-center gap-3">
                      <div className="flex gap-0.5">
                        <FlipDigit digit={Math.floor(timeHour / 10)} />
                        <FlipDigit digit={timeHour % 10} />
                      </div>
                      <span
                        className="pb-2 font-mono text-2xl font-light text-orange-500/70"
                        style={{ textShadow: '0 0 12px rgba(251,146,60,0.2)' }}
                      >
                        :
                      </span>
                      <div className="flex gap-0.5">
                        <FlipDigit digit={Math.floor(timeMinutes / 10)} />
                        <FlipDigit digit={timeMinutes % 10} />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-center gap-4">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          aria-label="減少一小時"
                          onClick={() => {
                            setTimeHour((h) => (h - 1 + 24) % 24);
                            setTimelineError('');
                          }}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-orange-500/25 bg-gray-800/60 text-orange-400/80 text-sm transition hover:border-orange-400/40 hover:bg-orange-500/10 active:scale-95"
                        >
                          −
                        </button>
                        <button
                          type="button"
                          aria-label="增加一小時"
                          onClick={() => {
                            setTimeHour((h) => (h + 1) % 24);
                            setTimelineError('');
                          }}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-orange-500/25 bg-gray-800/60 text-orange-400/80 text-sm transition hover:border-orange-400/40 hover:bg-orange-500/10 active:scale-95"
                        >
                          +
                        </button>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          aria-label="減少一分鐘"
                          onClick={() => {
                            setTimeMinutes((m) => (m - 1 + 60) % 60);
                            setTimelineError('');
                          }}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-orange-500/25 bg-gray-800/60 text-orange-400/80 text-sm transition hover:border-orange-400/40 hover:bg-orange-500/10 active:scale-95"
                        >
                          −
                        </button>
                        <button
                          type="button"
                          aria-label="增加一分鐘"
                          onClick={() => {
                            setTimeMinutes((m) => (m + 1) % 60);
                            setTimelineError('');
                          }}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-orange-500/25 bg-gray-800/60 text-orange-400/80 text-sm transition hover:border-orange-400/40 hover:bg-orange-500/10 active:scale-95"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {timelineError && <p className="mt-4 text-red-400 text-sm">{timelineError}</p>}
              </m.div>
            )}

            {step === 3 && showClosingView && (
              <m.div
                key="closing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-gray-200 mb-6 whitespace-pre-line">{closingText}</p>
                <button
                  type="button"
                  onClick={handleEnterCh2}
                  className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-medium flex items-center justify-center gap-2"
                >
                  進入第二章
                  <ChevronRight size={20} />
                </button>
              </m.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white border border-gray-600 rounded-lg"
          >
            關閉
          </button>
          {step === 1 && (
            <button
              type="button"
              onClick={handleTimelineNext}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg"
            >
              下一頁
            </button>
          )}
        </div>
      </OverlayCard>
    </>
  );
}
