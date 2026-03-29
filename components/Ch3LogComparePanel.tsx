'use client';

import { useCallback, useMemo, useState, type DragEvent } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import {
  ch3LogCompareCorrectSequence,
  ch3LogCompareOrganizedTable,
  ch3LogComparePanelIntro,
  ch3LogCompareRawResidueBullets,
  ch3LogCompareRawRows,
  ch3LogCompareRawTableHeaders,
  ch3LogCompareSuccessContinueLabel,
  ch3LogCompareSuccessMessage,
  ch3LogCompareSuccessTitle,
  ch3LogCompareTokens,
  ch3LogCompareWrongMessage,
} from '@/data/ch3LogCompareConfig';

const DND_TYPE = 'text/plain';

export interface Ch3LogComparePanelProps {
  onSolved: () => void;
  onClose: () => void;
}

function tokenById(id: string) {
  return ch3LogCompareTokens.find((t) => t.id === id);
}

function slotsMatchCorrect(slots: (string | null)[]): boolean {
  if (slots.some((s) => s === null)) return false;
  return ch3LogCompareCorrectSequence.every((id, i) => slots[i] === id);
}

export default function Ch3LogComparePanel({ onSolved, onClose }: Ch3LogComparePanelProps) {
  const [slots, setSlots] = useState<(string | null)[]>([null, null, null]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const inSlots = useMemo(() => new Set(slots.filter(Boolean) as string[]), [slots]);

  const bankTokens = useMemo(
    () => ch3LogCompareTokens.filter((t) => !inSlots.has(t.id)),
    [inSlots],
  );

  const placeInSlot = useCallback((slotIndex: number, tokenId: string) => {
    setSlots((prev) => {
      const next = [...prev] as (string | null)[];
      const from = next.indexOf(tokenId);
      if (from >= 0) next[from] = null;
      next[slotIndex] = tokenId;
      return next;
    });
    setSelectedId(null);
    setError(null);
  }, []);

  const clearSlot = useCallback((slotIndex: number) => {
    setSlots((prev) => {
      const next = [...prev];
      next[slotIndex] = null;
      return next;
    });
    setError(null);
  }, []);

  const handleConfirm = () => {
    if (slots.some((s) => s === null)) {
      setError('請將三格都放入字塊後再確認。');
      return;
    }
    if (!slotsMatchCorrect(slots)) {
      setError(ch3LogCompareWrongMessage);
      return;
    }
    setError(null);
    setShowSuccess(true);
  };

  const handleSuccessContinue = () => {
    onSolved();
  };

  const handleTokenClick = (tokenId: string) => {
    setSelectedId((s) => (s === tokenId ? null : tokenId));
    setError(null);
  };

  const handleSlotClick = (slotIndex: number) => {
    if (slots[slotIndex]) {
      clearSlot(slotIndex);
      return;
    }
    if (selectedId) {
      placeInSlot(slotIndex, selectedId);
    }
  };

  const onDragStartToken = (e: DragEvent, tokenId: string) => {
    e.dataTransfer.setData(DND_TYPE, tokenId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOverSlot = (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const onDropSlot = (e: DragEvent, slotIndex: number) => {
    e.preventDefault();
    const tokenId = e.dataTransfer.getData(DND_TYPE);
    if (!tokenId || !tokenById(tokenId)) return;
    placeInSlot(slotIndex, tokenId);
  };

  const assembledPreview = useMemo(() => {
    return slots
      .map((id) => (id ? tokenById(id)?.text : ''))
      .filter(Boolean)
      .join('');
  }, [slots]);

  return (
    <div
      className="pointer-events-auto fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md"
      role="dialog"
      aria-modal
      aria-labelledby="ch3-log-compare-title"
    >
      <div
        className={`relative w-full max-w-[min(100%,42rem)] max-h-[min(94vh,860px)] overflow-y-auto rounded-2xl border border-dark-border bg-gradient-to-br from-dark-card to-dark-surface shadow-2xl ${showSuccess ? 'pointer-events-none opacity-40' : ''}`}
        aria-hidden={showSuccess}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-lg p-2 text-gray-400 hover:bg-dark-border hover:text-white"
          aria-label="關閉"
        >
          <X size={20} />
        </button>

        <div className="p-4 sm:p-5 pb-4 border-b border-dark-border/80">
          <h2 id="ch3-log-compare-title" className="text-lg font-semibold text-gray-100 pr-10">
            還原被裁掉的欄位
          </h2>
          <p className="mt-2 text-xs text-gray-400 leading-relaxed">{ch3LogComparePanelIntro}</p>
        </div>

        <div className="p-4 sm:p-5 space-y-5">
          {/* 整理版：三欄多列，第四欄缺 */}
          <div className="rounded-xl border border-orange-500/25 bg-dark-surface/50 overflow-hidden">
            <div className="px-3 py-2 text-[11px] font-medium text-orange-200/90 border-b border-dark-border/60 bg-dark-card/60">
              {ch3LogCompareOrganizedTable.title}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[10px] sm:text-[11px] min-w-[300px]">
                <thead>
                  <tr className="border-b border-dark-border/80 bg-dark-card/40">
                    {ch3LogCompareOrganizedTable.headers.map((h) => (
                      <th key={h} className="px-2 py-2 font-medium text-gray-400 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                    <th className="px-2 py-2 font-medium text-red-400/90 whitespace-nowrap border-l border-dashed border-red-500/40">
                      {ch3LogCompareOrganizedTable.missingColumnLabel}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ch3LogCompareOrganizedTable.rows.map((row, ri) => (
                    <tr key={ri} className="border-b border-dark-border/40 last:border-0">
                      {row.map((cell, ci) => (
                        <td key={ci} className="px-2 py-1.5 text-gray-300 align-top">
                          {cell}
                        </td>
                      ))}
                      <td className="px-2 py-1.5 text-gray-500 border-l border-dashed border-red-500/35 bg-black/20 align-top">
                        —
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 母帶殘留七條：高文傑＋雙館＋跳號／批次 */}
          <div className="rounded-xl border border-cyan-800/35 bg-cyan-950/20 overflow-hidden">
            <div className="px-3 py-2 text-[11px] font-medium text-cyan-200/90 border-b border-cyan-800/30 bg-cyan-950/30">
              母帶殘留（七條操作痕；序號與批次不連續）
            </div>
            <div className="overflow-x-auto max-h-[min(42vh,320px)] overflow-y-auto">
              <table className="w-full text-left text-[10px] sm:text-[11px] min-w-[560px]">
                <thead className="sticky top-0 z-[1] bg-dark-card/95 border-b border-dark-border/80">
                  <tr>
                    {ch3LogCompareRawTableHeaders.map((h) => (
                      <th
                        key={h}
                        className="px-2 py-2 font-medium text-gray-400 whitespace-nowrap text-left"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ch3LogCompareRawRows.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-dark-border/35 hover:bg-dark-surface/40"
                    >
                      <td className="px-2 py-1.5 text-gray-200 font-mono whitespace-nowrap">
                        {r.eventSeq}
                      </td>
                      <td className="px-2 py-1.5 text-gray-400 whitespace-nowrap">{r.batchSession}</td>
                      <td className="px-2 py-1.5 text-gray-300 whitespace-nowrap">{r.time}</td>
                      <td className="px-2 py-1.5 whitespace-nowrap">
                        <span className={r.venueCode === 'W' ? 'text-orange-200/95' : 'text-cyan-200/90'}>
                          {r.venue}（{r.venueCode}）
                        </span>
                      </td>
                      <td className="px-2 py-1.5 text-gray-300">{r.operator}</td>
                      <td className="px-2 py-1.5 text-gray-400 leading-snug">{r.actionSummary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 推理提示 bullet */}
          <div className="rounded-xl border border-dark-border/60 bg-dark-surface/40 px-3 py-3">
            <div className="text-[11px] font-medium text-gray-400 mb-2">對照說明</div>
            <ul className="text-[11px] text-gray-300 space-y-1.5 list-disc list-inside leading-relaxed">
              {ch3LogCompareRawResidueBullets.map((line, i) => (
                <li key={`ch3-lc-bullet-${i}`}>{line}</li>
              ))}
            </ul>
          </div>

          {/* 三格還原 */}
          <div>
            <div className="text-xs font-medium text-gray-400 mb-2">
              還原被裁掉的欄位標題（由左而右三格；可拖曳字塊或先點字塊再點空格）
            </div>
            <div className="flex flex-wrap items-center gap-2 justify-center">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSlotClick(i)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSlotClick(i);
                    }
                  }}
                  onDragOver={onDragOverSlot}
                  onDrop={(e) => onDropSlot(e, i)}
                  className={`min-h-[48px] min-w-[4.5rem] rounded-lg border-2 border-dashed px-2 py-2 text-center text-sm font-medium transition-colors cursor-pointer select-none ${
                    slots[i]
                      ? 'border-industrial-orange/70 bg-industrial-orange/15 text-orange-100'
                      : selectedId
                        ? 'border-industrial-orange/50 bg-dark-surface/80 text-gray-500'
                        : 'border-dark-border bg-dark-surface/60 text-gray-500'
                  }`}
                  title={slots[i] ? '點一下收回字塊' : '空格'}
                >
                  {slots[i] ? (
                    <div
                      draggable
                      onDragStart={(e) => onDragStartToken(e, slots[i]!)}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      {tokenById(slots[i]!)?.text}
                    </div>
                  ) : (
                    <span className="text-[10px] text-gray-600">{i + 1}</span>
                  )}
                </div>
              ))}
            </div>
            {assembledPreview ? (
              <p className="mt-2 text-center text-xs text-gray-500">
                目前：<span className="text-gray-300 font-medium">{assembledPreview}</span>
              </p>
            ) : null}
          </div>

          {/* 字塊庫 */}
          <div>
            <div className="text-xs font-medium text-gray-400 mb-2">字塊庫（多餘的不要放進三格）</div>
            <div className="flex flex-wrap gap-2">
              {bankTokens.map((t) => (
                <div
                  key={t.id}
                  role="button"
                  tabIndex={0}
                  draggable
                  onDragStart={(e) => onDragStartToken(e, t.id)}
                  onClick={() => handleTokenClick(t.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleTokenClick(t.id);
                    }
                  }}
                  className={`rounded-lg border px-3 py-2 text-sm transition-colors cursor-grab active:cursor-grabbing select-none ${
                    selectedId === t.id
                      ? 'border-industrial-orange bg-industrial-orange/25 text-orange-100'
                      : 'border-dark-border bg-dark-card/80 text-gray-200 hover:border-industrial-orange/50'
                  }`}
                >
                  {t.text}
                </div>
              ))}
            </div>
            {bankTokens.length === 0 && (
              <p className="text-[11px] text-gray-500 mt-2">字塊已全部放入；可點格內收回。</p>
            )}
          </div>

          {error && (
            <p className="text-sm text-amber-200/95 leading-relaxed rounded-lg bg-amber-950/35 border border-amber-700/40 px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border border-dark-border text-gray-300 hover:bg-dark-border/50 text-sm"
            >
              返回
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 px-4 py-3 rounded-xl bg-industrial-orange/90 hover:bg-industrial-orange text-dark-surface font-medium text-sm"
            >
              確認還原
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <m.div
            className="fixed inset-0 z-[80] flex items-center justify-center px-4 bg-black/75"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="ch3-log-compare-success-title"
          >
            <m.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="w-full max-w-md rounded-2xl border border-dark-border bg-dark-card px-5 py-5 shadow-2xl pointer-events-auto"
            >
              <h2
                id="ch3-log-compare-success-title"
                className="text-lg font-semibold text-gray-100 mb-2"
              >
                {ch3LogCompareSuccessTitle}
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed mb-5">{ch3LogCompareSuccessMessage}</p>
              <button
                type="button"
                onClick={handleSuccessContinue}
                className="w-full px-4 py-3 rounded-xl bg-industrial-orange/90 hover:bg-industrial-orange text-dark-surface font-medium text-sm"
              >
                {ch3LogCompareSuccessContinueLabel}
              </button>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
