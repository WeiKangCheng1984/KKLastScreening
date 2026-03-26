'use client';

import { useCallback, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Bluetooth, Moon, RotateCcw, Wifi } from 'lucide-react';
import type { Ch2PhoneRiddleConfig } from '@/data/ch2ReportConfig';

const DECOY_ICONS: Record<string, typeof Wifi> = {
  wifi: Wifi,
  bt: Bluetooth,
  dnd: Moon,
  fake_restore: RotateCcw,
};

export interface Ch2CrowPhoneRiddleProps {
  config: Ch2PhoneRiddleConfig;
  onSuccess: () => void;
  /** 內嵌於背包道具卡時：不占滿視窗、不重疊全螢幕底層 */
  embedded?: boolean;
}

export default function Ch2CrowPhoneRiddle({ config, onSuccess, embedded }: Ch2CrowPhoneRiddleProps) {
  const {
    deviceScreenTitle,
    draftSurfaceLines,
    draftRevealLines,
    confirmReadLabel,
    confirmReadHint,
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
    successTitle,
    successMessage,
    successContinueLabel,
  } = config;

  const [batteryDialog, setBatteryDialog] = useState<null | 'enable' | 'disable'>(null);
  const [powerSaveOn, setPowerSaveOn] = useState(false);
  const [hasRevealedWithPowerSave, setHasRevealedWithPowerSave] = useState(false);
  const [decoyOn, setDecoyOn] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(decoys.map((d) => [d.id, false])),
  );
  const [decoyFeedbackId, setDecoyFeedbackId] = useState<string | null>(null);
  const [wrongNoReveal, setWrongNoReveal] = useState(false);
  const [readSuccess, setReadSuccess] = useState(false);

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

  const handleConfirmRead = useCallback(() => {
    if (!hasRevealedWithPowerSave) {
      setWrongNoReveal(true);
      return;
    }
    setWrongNoReveal(false);
    setReadSuccess(true);
  }, [hasRevealedWithPowerSave]);

  const handleSuccessContinue = useCallback(() => {
    onSuccess();
  }, [onSuccess]);

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
    <div
      className={
        embedded
          ? 'relative z-10 w-full flex flex-col items-stretch gap-3 px-1 py-1 max-h-[min(78vh,600px)] overflow-y-auto'
          : 'fixed inset-0 z-[85] flex flex-col items-center justify-center overflow-hidden px-3'
      }
    >
      {!embedded && (
        <div
          className="absolute inset-0 bg-black/88"
          style={{
            background: 'radial-gradient(ellipse at 50% 35%, rgba(27,16,6,0.96) 0%, rgba(6,6,8,0.98) 100%)',
          }}
        />
      )}

      <div
        className={`relative z-10 w-full max-w-sm flex flex-col gap-3 ${embedded ? 'mx-auto' : ''} ${readSuccess ? 'pointer-events-none opacity-40' : ''}`}
        aria-hidden={readSuccess}
      >
        <p className="text-center text-xs text-gray-500 tracking-wide">{deviceScreenTitle}</p>

        <div className="rounded-[2rem] border border-zinc-600/80 bg-zinc-300/90 p-1.5 shadow-2xl">
          <m.div
            layout
            className={`rounded-[1.65rem] overflow-hidden transition-colors duration-500 ease-out ${
              powerSaveOn
                ? 'bg-black text-white ring-1 ring-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]'
                : 'bg-white text-zinc-900 ring-1 ring-zinc-200'
            }`}
            role="region"
            aria-label={powerSaveOn ? '備忘草稿，螢幕已壓暗' : '備忘草稿'}
            data-power-save={powerSaveOn ? 'on' : 'off'}
          >
            {/* 瀏海／動態島 */}
            <div
              className={`flex justify-center pt-2.5 pb-1 transition-colors duration-500 ${
                powerSaveOn ? 'bg-black' : 'bg-white'
              }`}
            >
              <div
                className={`h-6 w-[5.5rem] rounded-full ${
                  powerSaveOn ? 'bg-zinc-900 ring-1 ring-zinc-700' : 'bg-zinc-900/90'
                }`}
                aria-hidden
              />
            </div>

            {/* 狀態列 */}
            <div
              className={`flex items-center justify-between px-3 pt-1 pb-2 text-[11px] border-b transition-colors duration-500 ${
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
                  aria-label="電量見底，點擊壓暗螢幕"
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

            {/* 控制中心：2×2 */}
            <div
              className={`px-3 pt-2 pb-2 border-b transition-colors duration-500 ${
                powerSaveOn ? 'border-zinc-800 bg-zinc-950/50' : 'border-zinc-200 bg-zinc-50/80'
              }`}
            >
              <p
                className={`text-[9px] uppercase tracking-wider mb-2 ${
                  powerSaveOn ? 'text-zinc-500' : 'text-zinc-500'
                }`}
              >
                快速開關
              </p>
              <div className="grid grid-cols-2 gap-2">
                {decoys.map((d) => {
                  const Icon = DECOY_ICONS[d.id] ?? Wifi;
                  const on = !!decoyOn[d.id];
                  return (
                    <button
                      key={d.id}
                      type="button"
                      aria-label={d.ariaLabel}
                      aria-pressed={on}
                      onClick={() => toggleDecoy(d.id)}
                      className={`flex flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2.5 text-center transition-colors min-h-[4.25rem] ${
                        powerSaveOn
                          ? on
                            ? 'border-zinc-500 bg-zinc-800/90 text-zinc-100 shadow-inner'
                            : 'border-zinc-700 bg-zinc-950 text-zinc-400 hover:border-zinc-600'
                          : on
                            ? 'border-zinc-400 bg-white text-zinc-900 shadow-sm'
                            : 'border-zinc-200 bg-white/90 text-zinc-600 hover:border-zinc-300'
                      }`}
                    >
                      <Icon className="h-5 w-5 shrink-0 opacity-90" strokeWidth={1.75} aria-hidden />
                      <span className="text-[10px] leading-tight font-medium">{d.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {decoyFeedbackText && (
              <p
                className={`px-3 py-1.5 text-[10px] border-b line-clamp-2 transition-colors duration-500 ${
                  powerSaveOn
                    ? 'text-zinc-500 border-zinc-800 bg-zinc-950/80'
                    : 'text-zinc-600 border-zinc-200 bg-white'
                }`}
              >
                {decoyFeedbackText}
              </p>
            )}

            {/* 備忘 App 內容 */}
            <div
              className={`relative min-h-[180px] px-4 py-3 space-y-2 transition-colors duration-500 ${
                powerSaveOn ? 'bg-black' : 'bg-white'
              }`}
            >
              <div
                className={`text-[10px] tracking-wide mb-1 ${powerSaveOn ? 'text-zinc-500' : 'text-zinc-500'}`}
              >
                備忘草稿
              </div>
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

            {/* 已讀確認 + Home 指示條 */}
            <div
              className={`px-4 pb-3 pt-2 space-y-2 border-t transition-colors duration-500 ${
                powerSaveOn ? 'border-zinc-800 bg-black' : 'border-zinc-200 bg-white'
              }`}
            >
              {confirmReadHint && (
                <p
                  className={`text-[10px] leading-relaxed text-center ${powerSaveOn ? 'text-zinc-500' : 'text-zinc-500'}`}
                >
                  {confirmReadHint}
                </p>
              )}
              <button
                type="button"
                onClick={handleConfirmRead}
                className={`w-full py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                  powerSaveOn
                    ? 'border-zinc-500 bg-zinc-100 text-zinc-900 hover:bg-white'
                    : 'border-zinc-800 bg-zinc-900 text-white hover:bg-zinc-800'
                }`}
              >
                {confirmReadLabel}
              </button>
              <div className="flex justify-center pt-1 pb-0.5">
                <div
                  className={`h-1 w-28 rounded-full ${powerSaveOn ? 'bg-zinc-700' : 'bg-zinc-300'}`}
                  aria-hidden
                />
              </div>
            </div>
          </m.div>
        </div>

        <AnimatePresence>
          {wrongNoReveal && (
            <m.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-orange-500/25 bg-dark-surface/85 px-4 py-3 text-sm"
            >
              <p className="text-gray-300/95 text-[13px] leading-relaxed">{wrongFeedback.hintWhenNoReveal}</p>
            </m.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {batteryDialog && (
          <m.div
            className={`fixed inset-0 flex items-center justify-center px-6 bg-black/60 ${embedded ? 'z-[100]' : 'z-[90]'}`}
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

      <AnimatePresence>
        {readSuccess && (
          <m.div
            className={`fixed inset-0 flex items-center justify-center px-6 bg-black/70 ${embedded ? 'z-[100]' : 'z-[95]'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="ch2-phone-success-title"
          >
            <m.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl border border-zinc-500/40 bg-zinc-900/95 p-5 shadow-xl text-zinc-100 pointer-events-auto"
            >
              <h2 id="ch2-phone-success-title" className="text-lg font-medium mb-2">
                {successTitle}
              </h2>
              <p className="text-sm text-zinc-300 leading-relaxed mb-5">{successMessage}</p>
              <button
                type="button"
                onClick={handleSuccessContinue}
                className="w-full py-2.5 rounded-xl border border-industrial-orange/80 bg-industrial-orange/90 text-dark-surface font-medium text-sm hover:bg-industrial-orange"
              >
                {successContinueLabel}
              </button>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
