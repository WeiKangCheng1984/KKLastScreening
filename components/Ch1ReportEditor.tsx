'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, ChevronUp, ChevronDown, Clock, MessageSquare } from 'lucide-react';
import OverlayCard from '@/components/OverlayCard';
import ReportFillBlank from '@/components/ReportFillBlank';
import type { GameState, Effect } from '@/types/game';
import {
  ch1ReportConfig,
  CH1_REPORT_DEFAULT_EVIDENCE_IDS,
  isCh1TimelineClockCorrect,
  type Ch1TimelineClockDef,
} from '@/data/ch1ReportConfig';

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

type Hm = { hour: number; minute: number };

function initialClockMap(clocks: Ch1TimelineClockDef[]): Record<string, Hm> {
  return Object.fromEntries(clocks.map((c) => [c.id, { hour: 0, minute: 0 }]));
}

/* ── Inline digit display with subtle pulse on change ───────────── */

function PulseDigits({ value, pad }: { value: number; pad?: number }) {
  const display = String(value).padStart(pad ?? 2, '0');
  return (
    <m.span
      key={value}
      initial={{ opacity: 0.5, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="inline-block w-[2ch] text-center font-mono text-[1.5rem] font-semibold tabular-nums leading-none text-amber-50 sm:text-[1.75rem]"
    >
      {display}
    </m.span>
  );
}

/* ── Compact arrow button ───────────────────────────────────────── */

function ArrowBtn({
  direction,
  onClick,
  label,
}: {
  direction: 'up' | 'down' | 'left' | 'right';
  onClick: () => void;
  label: string;
}) {
  const Icon =
    direction === 'up' ? ChevronUp : direction === 'down' ? ChevronDown : direction === 'left' ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-md text-amber-300/70 transition hover:bg-white/[0.07] hover:text-amber-200 active:scale-90"
    >
      <Icon size={18} strokeWidth={2.2} />
    </button>
  );
}

/* ── Single time stepper: ◂ HH ▸ : ◂ MM ▸ ──────────────────────── */

function TimeStepper({
  hour,
  minute,
  onHourDelta,
  onMinuteDelta,
}: {
  hour: number;
  minute: number;
  onHourDelta: (d: number) => void;
  onMinuteDelta: (d: number) => void;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {/* Hour */}
      <div className="flex items-center">
        <ArrowBtn direction="left" onClick={() => onHourDelta(-1)} label="減少一小時" />
        <AnimatePresence mode="wait">
          <PulseDigits key={`h-${hour}`} value={hour} />
        </AnimatePresence>
        <ArrowBtn direction="right" onClick={() => onHourDelta(1)} label="增加一小時" />
      </div>

      <span className="mx-0.5 select-none font-mono text-lg font-light text-amber-500/50">:</span>

      {/* Minute */}
      <div className="flex items-center">
        <ArrowBtn direction="left" onClick={() => onMinuteDelta(-1)} label="減少一分鐘" />
        <AnimatePresence mode="wait">
          <PulseDigits key={`m-${minute}`} value={minute} />
        </AnimatePresence>
        <ArrowBtn direction="right" onClick={() => onMinuteDelta(1)} label="增加一分鐘" />
      </div>
    </div>
  );
}

/* ── Timeline row: [●  label]  ─────  [stepper] ────────────────── */

function TimelineRow({
  index,
  def,
  hour,
  minute,
  onHourDelta,
  onMinuteDelta,
  isLast,
}: {
  index: number;
  def: Ch1TimelineClockDef;
  hour: number;
  minute: number;
  onHourDelta: (d: number) => void;
  onMinuteDelta: (d: number) => void;
  isLast: boolean;
}) {
  return (
    <m.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.22 }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        {/* Left: timeline dot + label */}
        <div className="flex items-center gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-amber-500/40 bg-amber-500/15 text-[11px] font-bold tabular-nums text-amber-300">
            {index + 1}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium leading-snug text-amber-100/90">{def.label}</p>
          </div>
        </div>
        {/* Right: compact stepper */}
        <TimeStepper
          hour={hour}
          minute={minute}
          onHourDelta={onHourDelta}
          onMinuteDelta={onMinuteDelta}
        />
      </div>
      {!isLast && <div className="ml-3 mt-3 h-px bg-white/[0.06] sm:ml-3" />}
    </m.div>
  );
}

/* ── Main component ─────────────────────────────────────────────── */

export default function Ch1ReportEditor({
  engine,
  onComplete,
  onClose,
}: Ch1ReportEditorProps) {
  const config = ch1ReportConfig;
  const timelineClocks = config.timeline.clocks;

  const [step, setStep] = useState(1);
  const [clockHm, setClockHm] = useState<Record<string, Hm>>(() => initialClockMap(timelineClocks));
  const [attitudeFillBlankIndex, setAttitudeFillBlankIndex] = useState(0);
  const [showClosing, setShowClosing] = useState(false);
  const [timelineError, setTimelineError] = useState('');
  const [timelineErrorIndex, setTimelineErrorIndex] = useState(0);

  const bumpHour = useCallback((id: string, delta: number) => {
    setClockHm((prev) => {
      const cur = prev[id] ?? { hour: 0, minute: 0 };
      return { ...prev, [id]: { ...cur, hour: (cur.hour + delta + 24) % 24 } };
    });
    setTimelineError('');
  }, []);

  const bumpMinute = useCallback((id: string, delta: number) => {
    setClockHm((prev) => {
      const cur = prev[id] ?? { hour: 0, minute: 0 };
      return { ...prev, [id]: { ...cur, minute: (cur.minute + delta + 60) % 60 } };
    });
    setTimelineError('');
  }, []);

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
    const wrongLabels: string[] = [];
    for (const def of timelineClocks) {
      const hm = clockHm[def.id] ?? { hour: 0, minute: 0 };
      if (!isCh1TimelineClockCorrect(def, hm.hour, hm.minute)) {
        wrongLabels.push(def.label);
      }
    }
    if (wrongLabels.length > 0) {
      const msg = config.timeline.errorMessages[timelineErrorIndex % config.timeline.errorMessages.length];
      setTimelineError(`${msg} 尚未對齊：${wrongLabels.join('、')}。`);
      setTimelineErrorIndex((i) => i + 1);
      return;
    }

    const movie = clockHm.movie_start ?? { hour: 0, minute: 0 };
    const crime = clockHm.crime_window ?? { hour: 0, minute: 0 };
    const kk = clockHm.kk_notify ?? { hour: 0, minute: 0 };

    engine.applyEffect({
      type: 'setFlag',
      flag: 'ch1_report_timeline',
      value: {
        type: 'ch1_triple_timeline',
        movieStart: { hour: movie.hour, minute: movie.minute },
        crimeWindow: { hour: crime.hour, minute: crime.minute },
        kkNotified: { hour: kk.hour, minute: kk.minute },
      },
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
        className="flex max-h-[90vh] min-h-[60vh] w-full max-w-2xl flex-col p-6 md:p-8"
      >
        <div className="mb-5 flex items-center justify-between border-b border-amber-600/50 pb-4">
          <h2 className="bg-gradient-to-r from-amber-200 via-orange-300 to-amber-400 bg-clip-text text-xl font-bold text-transparent md:text-2xl">
            向劉隊報告
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {VISIBLE_STEPS.map((s) => (
            <span
              key={s.id}
              className={`inline-flex items-center gap-1 rounded px-2 py-1 text-sm ${
                step === s.id
                  ? 'border border-amber-500/40 bg-amber-600/35 text-amber-50'
                  : 'bg-white/5 text-gray-400'
              }`}
            >
              <s.icon size={14} />
              {s.label}
            </span>
          ))}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <m.div
                key="step1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <p className="mb-6 text-sm leading-relaxed text-gray-300">
                  劉隊要你在報告裡把時間線對齊：<span className="text-amber-200/90">開場</span>、
                  <span className="text-amber-200/90">行兇窗口</span>、
                  <span className="text-amber-200/90">你接到通知</span>——三個都到位再交。
                </p>
                <div className="flex flex-col gap-4 rounded-xl border border-white/[0.07] bg-zinc-900/50 px-4 py-5 sm:px-5"
                  style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}
                >
                  {timelineClocks.map((def, i) => {
                    const hm = clockHm[def.id] ?? { hour: 0, minute: 0 };
                    return (
                      <TimelineRow
                        key={def.id}
                        index={i}
                        def={def}
                        hour={hm.hour}
                        minute={hm.minute}
                        onHourDelta={(d) => bumpHour(def.id, d)}
                        onMinuteDelta={(d) => bumpMinute(def.id, d)}
                        isLast={i === timelineClocks.length - 1}
                      />
                    );
                  })}
                </div>
                {timelineError && (
                  <m.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 text-sm text-red-400"
                  >
                    {timelineError}
                  </m.p>
                )}
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
                <p className="mb-6 whitespace-pre-line text-gray-200">{closingText}</p>
                <button
                  type="button"
                  onClick={handleEnterCh2}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 py-3 font-medium text-white hover:bg-orange-500"
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
            className="rounded-lg border border-gray-600 px-4 py-2 text-gray-400 hover:text-white"
          >
            關閉
          </button>
          {step === 1 && (
            <button
              type="button"
              onClick={handleTimelineNext}
              className="rounded-lg bg-orange-600 px-4 py-2 text-white hover:bg-orange-500"
            >
              確認時間線
            </button>
          )}
        </div>
      </OverlayCard>
    </>
  );
}
