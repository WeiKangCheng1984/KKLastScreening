'use client';

import { useCallback, useMemo, useState, type FormEvent } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import type { Ch2PhoneRiddleConfig } from '@/data/ch2ReportConfig';

function normalizeCh2Answer(raw: string): string {
  return raw
    .trim()
    .replace(/[\uFF01-\uFF5E]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0))
    .replace(/\s+/g, '');
}

export interface Ch2CrowPhoneRiddleProps {
  config: Ch2PhoneRiddleConfig;
  onSuccess: () => void;
}

type WrongKind = 'noReveal' | 'badAnswer' | null;

export default function Ch2CrowPhoneRiddle({ config, onSuccess }: Ch2CrowPhoneRiddleProps) {
  const {
    draftSurfaceLines,
    draftRevealLines,
    inputLabel,
    inputPlaceholder,
    acceptableAnswers,
    powerSaveDialogTitle,
    powerSaveDialogMessage,
    powerSaveConfirmLabel,
    powerSaveCancelLabel,
    powerOffDialogTitle,
    powerOffDialogMessage,
    powerOffConfirmLabel,
    powerOffCancelLabel,
    statusBarPowerSaveHint,
    decoys,
    wrongFeedback,
  } = config;

  const [batteryDialog, setBatteryDialog] = useState<null | 'enable' | 'disable'>(null);
  const [powerSaveOn, setPowerSaveOn] = useState(false);
  const [hasRevealedWithPowerSave, setHasRevealedWithPowerSave] = useState(false);
  const [decoyOn, setDecoyOn] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(decoys.map((d) => [d.id, false])),
  );
  const [decoyFeedbackId, setDecoyFeedbackId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [wrongShown, setWrongShown] = useState(false);
  const [wrongKind, setWrongKind] = useState<WrongKind>(null);

  const normalizedAccept = useMemo(
    () => acceptableAnswers.map((a) => normalizeCh2Answer(a)),
    [acceptableAnswers],
  );

  const toggleDecoy = useCallback((id: string) => {
    setDecoyOn((prev) => {
      const next = !prev[id];
      setDecoyFeedbackId(id);
      return { ...prev, [id]: next };
    });
  }, []);

  const handleBatteryClick = useCallback(() => {
    setBatteryDialog(powerSaveOn ? 'disable' : 'enable');
  }, [powerSaveOn]);

  const confirmBatteryDialog = useCallback(() => {
    if (batteryDialog === 'enable') {
      setPowerSaveOn(true);
      setHasRevealedWithPowerSave((prev) => prev || true);
    } else if (batteryDialog === 'disable') {
      setPowerSaveOn(false);
    }
    setBatteryDialog(null);
  }, [batteryDialog]);

  const cancelBatteryDialog = useCallback(() => {
    setBatteryDialog(null);
  }, []);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const n = normalizeCh2Answer(input);
      if (!hasRevealedWithPowerSave) {
        setWrongKind('noReveal');
        setWrongShown(true);
        return;
      }
      if (!n || !normalizedAccept.includes(n)) {
        setWrongKind('badAnswer');
        setWrongShown(true);
        return;
      }
      setWrongShown(false);
      setWrongKind(null);
      onSuccess();
    },
    [hasRevealedWithPowerSave, input, normalizedAccept, onSuccess],
  );

  const decoyFeedbackText = decoyFeedbackId
    ? (() => {
        const d = decoys.find((x) => x.id === decoyFeedbackId);
        if (!d) return null;
        return decoyOn[decoyFeedbackId] ? d.feedbackWhenOn : d.feedbackWhenOff;
      })()
    : null;

  const dialogTitle =
    batteryDialog === 'disable' ? powerOffDialogTitle : powerSaveDialogTitle;
  const dialogMessage =
    batteryDialog === 'disable' ? powerOffDialogMessage : powerSaveDialogMessage;
  const dialogConfirm =
    batteryDialog === 'disable' ? powerOffConfirmLabel : powerSaveConfirmLabel;
  const dialogCancel =
    batteryDialog === 'disable' ? powerOffCancelLabel : powerSaveCancelLabel;

  return (
    <div className="fixed inset-0 z-[85] flex flex-col items-center justify-center overflow-hidden px-3">
      <div
        className="absolute inset-0 bg-black/88"
        style={{
          background: 'radial-gradient(ellipse at 50% 35%, rgba(27,16,6,0.96) 0%, rgba(6,6,8,0.98) 100%)',
        }}
      />

      <div className="relative z-10 w-full max-w-sm flex flex-col gap-3">
        <p className="text-center text-xs text-gray-500 tracking-wide">手機草稿（未完成同步）</p>

        {/* 外框深色；內螢幕：一般＝白底黑字，低耗＝黑底白字（顯影層浮出） */}
        <div className="rounded-[2rem] border border-zinc-600/80 bg-zinc-300/90 p-1.5 shadow-2xl">
          <m.div
            layout
            className={`rounded-[1.65rem] overflow-hidden transition-colors duration-500 ease-out ${
              powerSaveOn
                ? 'bg-black text-white ring-1 ring-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]'
                : 'bg-white text-zinc-900 ring-1 ring-zinc-200'
            }`}
            role="region"
            aria-label={powerSaveOn ? '手機備忘，低耗顯示開啟' : '手機備忘'}
            data-power-save={powerSaveOn ? 'on' : 'off'}
          >
            {/* 狀態列 */}
            <div
              className={`flex items-center justify-between px-3 pt-2.5 pb-2 text-[11px] border-b transition-colors duration-500 ${
                powerSaveOn
                  ? 'text-zinc-200 border-zinc-800 bg-black'
                  : 'text-zinc-800 border-zinc-200 bg-white'
              }`}
            >
              <span className="tabular-nums font-medium">22:47</span>
              <div className="flex items-center gap-2">
                {powerSaveOn && (
                  <span className="text-zinc-500 text-[10px]">{statusBarPowerSaveHint}</span>
                )}
                <button
                  type="button"
                  aria-label="低電量，點擊省電選項"
                  onClick={handleBatteryClick}
                  className={`flex items-center rounded px-0.5 py-0.5 transition-colors ${
                    powerSaveOn ? 'hover:bg-white/10 active:bg-white/15' : 'hover:bg-zinc-100 active:bg-zinc-200'
                  }`}
                >
                  <span
                    className={`relative inline-flex h-2.5 w-[1.65rem] shrink-0 items-stretch rounded-[3px] border overflow-hidden ${
                      powerSaveOn
                        ? 'border-zinc-500 bg-zinc-800/90'
                        : 'border-zinc-400 bg-zinc-100'
                    }`}
                  >
                    <span className="w-[15%] min-w-[2px] bg-red-600" aria-hidden />
                  </span>
                </button>
              </div>
            </div>

            {/* 假目標列 */}
            <div
              className={`flex flex-wrap gap-2 px-3 py-2 border-b transition-colors duration-500 ${
                powerSaveOn ? 'border-zinc-800 bg-black' : 'border-zinc-200 bg-white'
              }`}
            >
              {decoys.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  aria-label={d.ariaLabel}
                  aria-pressed={!!decoyOn[d.id]}
                  onClick={() => toggleDecoy(d.id)}
                  className={`text-[11px] px-2 py-1 rounded-full border transition-colors ${
                    powerSaveOn
                      ? decoyOn[d.id]
                        ? 'border-zinc-500 bg-zinc-800 text-zinc-100'
                        : 'border-zinc-700 bg-zinc-950 text-zinc-400 hover:border-zinc-600'
                      : decoyOn[d.id]
                        ? 'border-zinc-500 bg-zinc-200 text-zinc-900'
                        : 'border-zinc-300 bg-zinc-50 text-zinc-700 hover:border-zinc-400'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {decoyFeedbackText && (
              <p
                className={`px-3 py-1 text-[10px] border-b line-clamp-2 transition-colors duration-500 ${
                  powerSaveOn
                    ? 'text-zinc-500 border-zinc-800 bg-zinc-950/80'
                    : 'text-zinc-600 border-zinc-200 bg-zinc-50'
                }`}
              >
                {decoyFeedbackText}
              </p>
            )}

            {/* 草稿本體：低耗時表層像雜訊沉底，顯影為高對比白字 */}
            <div
              className={`relative min-h-[200px] px-4 py-3 space-y-2 transition-colors duration-500 ${
                powerSaveOn ? 'bg-black' : 'bg-white'
              }`}
            >
              <div
                className={`text-[12px] leading-relaxed space-y-1.5 transition-all duration-500 ${
                  powerSaveOn
                    ? 'opacity-[0.28] text-zinc-500'
                    : 'opacity-100 text-zinc-800'
                }`}
              >
                {draftSurfaceLines.map((line, i) => (
                  <p key={`surf-${i}`} className="font-mono break-words">
                    {line}
                  </p>
                ))}
              </div>

              <m.div
                className={`mt-2 space-y-1.5 ${
                  powerSaveOn
                    ? 'opacity-100 translate-y-0 max-h-[500px]'
                    : 'opacity-0 max-h-0 overflow-hidden translate-y-1 pointer-events-none select-none'
                }`}
                aria-hidden={!powerSaveOn}
                initial={false}
                animate={
                  powerSaveOn
                    ? { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }
                    : { opacity: 0, y: 4 }
                }
              >
                {draftRevealLines.map((line, i) => (
                  <m.p
                    key={`rev-${i}`}
                    initial={false}
                    animate={powerSaveOn ? { opacity: 1, x: 0 } : { opacity: 0 }}
                    transition={{ delay: powerSaveOn ? 0.06 + i * 0.05 : 0, duration: 0.35 }}
                    className={`text-[13px] leading-relaxed pl-2 border-l-2 ${
                      powerSaveOn
                        ? 'border-white/35 text-zinc-100'
                        : 'border-zinc-400 text-zinc-900'
                    }`}
                  >
                    {line}
                  </m.p>
                ))}
              </m.div>
            </div>

            {/* 輸入 */}
            <form
              onSubmit={handleSubmit}
              className={`px-4 pb-4 pt-2 space-y-2 border-t transition-colors duration-500 ${
                powerSaveOn ? 'border-zinc-800 bg-black' : 'border-zinc-200 bg-white'
              }`}
            >
              <label
                className={`block text-[11px] ${powerSaveOn ? 'text-zinc-500' : 'text-zinc-600'}`}
              >
                {inputLabel}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setWrongShown(false);
                    setWrongKind(null);
                  }}
                  placeholder={inputPlaceholder}
                  autoComplete="off"
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-colors duration-500 ${
                    powerSaveOn
                      ? 'border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-600 focus:ring-white/20'
                      : 'border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400 focus:ring-zinc-400/50'
                  }`}
                />
                <button
                  type="submit"
                  className={`shrink-0 px-4 py-2 rounded-lg border text-sm transition-colors ${
                    powerSaveOn
                      ? 'border-zinc-500 bg-zinc-100 text-zinc-900 hover:bg-white'
                      : 'border-zinc-800 bg-zinc-900 text-white hover:bg-zinc-800'
                  }`}
                >
                  送出
                </button>
              </div>
            </form>
          </m.div>
        </div>

        <AnimatePresence>
          {wrongShown && (
            <m.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-orange-500/25 bg-dark-surface/85 px-4 py-3 text-sm space-y-1"
            >
              {wrongKind === 'noReveal' ? (
                <p className="text-gray-300/95 text-[13px] leading-relaxed">
                  {wrongFeedback.hintWhenNoReveal ??
                    '草稿裡好像還有一層沒對上；對照備忘再看一次。'}
                </p>
              ) : (
                <>
                  <p className="text-orange-200/85 italic">KK：「{wrongFeedback.kk}」</p>
                  <p className="text-gray-400/90">劉隊：「{wrongFeedback.liu}」</p>
                </>
              )}
            </m.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {batteryDialog && (
          <m.div
            className="fixed inset-0 z-[90] flex items-center justify-center px-6 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <m.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl border border-zinc-300 bg-white p-5 shadow-xl text-zinc-900"
              role="dialog"
              aria-modal="true"
              aria-labelledby="ch2-battery-dialog-title"
            >
              <h2 id="ch2-battery-dialog-title" className="text-lg font-medium mb-2">
                {dialogTitle}
              </h2>
              <p className="text-sm text-zinc-600 leading-relaxed mb-5">{dialogMessage}</p>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={cancelBatteryDialog}
                  className="px-4 py-2 rounded-lg border border-zinc-300 text-zinc-800 text-sm hover:bg-zinc-50"
                >
                  {dialogCancel}
                </button>
                <button
                  type="button"
                  onClick={confirmBatteryDialog}
                  className="px-4 py-2 rounded-lg border border-zinc-900 bg-zinc-900 text-white text-sm hover:bg-zinc-800"
                >
                  {dialogConfirm}
                </button>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
