'use client';

/**
 * ReasoningPanel（向劉隊回報）
 *
 * 步驟流程（有 reportFills 時）：fill1 → fill2 → q1 → q3 → outro
 * 步驟流程（無 reportFills 時）：q1 → q3 → outro（降級相容）
 *
 * fill1/fill2：全屏 ReportFillBlank 元件
 * q1/q3/outro：OverlayCard 內的既有 UI
 */

import { reasoningByChapter, ChapterReasoning } from '@/data/reasoningByChapter';
import { m, AnimatePresence } from 'framer-motion';
import { Link2, X } from 'lucide-react';
import { useState } from 'react';
import OverlayCard from './OverlayCard';
import ReportFillBlank from './ReportFillBlank';

type ReasoningStep = 'fill1' | 'fill2' | 'q1' | 'q3' | 'outro';

interface ReasoningPanelProps {
  chapterId: string;
  onSaveAnswer: (chapterId: string, q: 'q1' | 'q2' | 'q3', value: string | string[]) => void;
  onComplete: (extra?: { policeNoteId?: string }) => void;
  onClose: () => void;
}

export default function ReasoningPanel({
  chapterId,
  onSaveAnswer,
  onComplete,
  onClose,
}: ReasoningPanelProps) {
  const config = reasoningByChapter[chapterId] as ChapterReasoning | undefined;

  // 計算起始步驟
  const initStep = (): ReasoningStep => (config?.reportFills ? 'fill1' : 'q1');

  const [step, setStep] = useState<ReasoningStep>(initStep);
  const [q1Selected, setQ1Selected] = useState<string | null>(null);
  const [q3Pairs, setQ3Pairs] = useState<[string, string][]>([]);
  const [q3Selected, setQ3Selected] = useState<string[]>([]);
  const [q3Error, setQ3Error] = useState('');
  const [selectedPoliceNoteId, setSelectedPoliceNoteId] = useState<string | null>(null);

  if (!config) return null;

  // Q3 群組數（各章不同）
  const q3Total = config.q3.leftItems.length;
  const q3LeftIds  = config.q3.leftItems.map((i) => i.id);
  const q3RightIds = config.q3.rightItems.map((i) => i.id);
  const q3UsedIds  = new Set(q3Pairs.flat());
  const q3CanConfirm = q3Selected.length === 2;
  const q3OneLeft  = q3Selected.some((id) => q3LeftIds.includes(id));
  const q3OneRight = q3Selected.some((id) => q3RightIds.includes(id));
  const q3ValidPair = q3CanConfirm && q3OneLeft && q3OneRight;

  // ── 步驟處理 ─────────────────────────────────────────────────────

  const handleFill1Done = () => {
    setStep('fill2');
  };

  const handleFill2Done = () => {
    setStep('q1');
  };

  const handleQ1Next = () => {
    if (!q1Selected) return;
    onSaveAnswer(chapterId, 'q1', q1Selected);
    onSaveAnswer(chapterId, 'q2', ''); // q2 自動略過
    setStep('q3');
  };

  const handleQ3CardClick = (id: string) => {
    if (q3UsedIds.has(id)) return;
    if (q3Selected.includes(id)) {
      setQ3Selected(q3Selected.filter((x) => x !== id));
    } else if (q3Selected.length < 2) {
      setQ3Selected([...q3Selected, id]);
    }
    setQ3Error('');
  };

  const confirmQ3Pair = () => {
    if (!q3ValidPair) return;
    const [a, b] = q3Selected;
    const left  = q3LeftIds.includes(a) ? a : b;
    const right = q3LeftIds.includes(a) ? b : a;
    setQ3Pairs([...q3Pairs, [left, right]]);
    setQ3Selected([]);
    setQ3Error('');
  };

  const removeQ3Pair = (index: number) => {
    setQ3Pairs(q3Pairs.filter((_, i) => i !== index));
    setQ3Error('');
  };

  const handleQ3Submit = () => {
    if (q3Pairs.length !== q3Total) {
      setQ3Error(`請先完成全部 ${q3Total} 組配對。`);
      return;
    }
    const value: string[] = q3Pairs.map(([l, r]) => `${l},${r}`);
    onSaveAnswer(chapterId, 'q3', value);
    if (!config.police) {
      onComplete();
    } else {
      setStep('outro');
    }
  };

  const getLabel = (id: string) => {
    const L = config.q3.leftItems.find((i) => i.id === id);
    const R = config.q3.rightItems.find((i) => i.id === id);
    return L?.label ?? R?.label ?? id;
  };

  // ── 全屏 Fill 步驟 ────────────────────────────────────────────────

  if (step === 'fill1' && config.reportFills) {
    return (
      <ReportFillBlank
        config={config.reportFills[0]}
        onComplete={handleFill1Done}
      />
    );
  }

  if (step === 'fill2' && config.reportFills) {
    return (
      <ReportFillBlank
        config={config.reportFills[1]}
        onComplete={handleFill2Done}
      />
    );
  }

  // ── OverlayCard 步驟（q1 / q3 / outro） ─────────────────────────

  return (
    <OverlayCard
      tone="system"
      size="lg"
      className="w-full max-w-4xl max-h-[90vh] min-h-[70vh] p-6 md:p-8 flex flex-col"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-orange-500/30">
        <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
          向劉隊回報
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pr-1">
        <AnimatePresence mode="wait">

          {/* Q1 三選一 */}
          {step === 'q1' && (
            <m.div
              key="q1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-gray-400 text-xs mb-2 uppercase tracking-wider">判斷</p>
              <p className="text-gray-200 mb-4">{config.q1.question}</p>
              <div className="space-y-2 mb-6">
                {config.q1.options.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setQ1Selected(opt.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${
                      q1Selected === opt.id
                        ? 'bg-orange-500/30 border-orange-400 text-white'
                        : 'bg-dark-surface border-orange-500/30 text-gray-200 hover:border-orange-400'
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </m.div>
          )}

          {/* Q3 連連看 */}
          {step === 'q3' && (
            <m.div
              key="q3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-gray-400 text-xs mb-2 uppercase tracking-wider">線索配對</p>
              <p className="text-gray-200 mb-4">{config.q3.question}</p>

              {q3Pairs.length > 0 && (
                <div className="mb-4">
                  <p className="text-gray-400 text-sm mb-2">
                    已配對（{q3Pairs.length} / {q3Total} 組）
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {q3Pairs.map((pair, idx) => (
                      <div
                        key={idx}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-dark-surface border border-orange-500/30 rounded-lg"
                      >
                        <span className="text-gray-200 text-sm">{getLabel(pair[0])}</span>
                        <Link2 size={14} className="text-orange-400 shrink-0" />
                        <span className="text-gray-200 text-sm">{getLabel(pair[1])}</span>
                        <button
                          type="button"
                          onClick={() => removeQ3Pair(idx)}
                          className="text-red-400 hover:text-red-300 text-xs ml-1"
                        >
                          移除
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {q3Pairs.length < q3Total && (
                <div className="mb-3">
                  <p className="text-gray-400 text-sm mb-2">點選左一、右一結成一組</p>
                  {q3ValidPair && (
                    <button
                      type="button"
                      onClick={confirmQ3Pair}
                      className="mb-3 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-sm"
                    >
                      確認此組
                    </button>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-400 text-sm mb-2">左：道具 / 線索</p>
                  <div className="space-y-2">
                    {config.q3.leftItems.map((item) => {
                      const used = q3UsedIds.has(item.id);
                      const isSelected = q3Selected.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => !used && handleQ3CardClick(item.id)}
                          disabled={used}
                          className={`w-full text-left px-3 py-2 rounded-lg border-2 text-sm transition-all ${
                            used
                              ? 'bg-gray-800/50 border-gray-600 text-gray-500 cursor-not-allowed'
                              : isSelected
                                ? 'bg-orange-500/30 border-orange-400 text-white'
                                : 'bg-dark-surface border-orange-500/30 text-gray-200 hover:border-orange-400'
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-2">右：線索意義</p>
                  <div className="space-y-2">
                    {config.q3.rightItems.map((item) => {
                      const used = q3UsedIds.has(item.id);
                      const isSelected = q3Selected.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => !used && handleQ3CardClick(item.id)}
                          disabled={used}
                          className={`w-full text-left px-3 py-2 rounded-lg border-2 text-sm transition-all ${
                            used
                              ? 'bg-gray-800/50 border-gray-600 text-gray-500 cursor-not-allowed'
                              : isSelected
                                ? 'bg-orange-500/30 border-orange-400 text-white'
                                : 'bg-dark-surface border-orange-500/30 text-gray-200 hover:border-orange-400'
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {q3Error && <p className="text-red-400 text-sm mb-4">{q3Error}</p>}
            </m.div>
          )}

          {/* Outro：劉隊結語 + 補充句 */}
          {step === 'outro' && config.police && (
            <m.div
              key="outro"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-gray-400 text-xs mb-2 uppercase tracking-wider">報告結語</p>
              <p className="text-gray-200 mb-5 whitespace-pre-line leading-relaxed">
                {config.police.outroStandard}
              </p>

              {config.police.outroPlayerLines && config.police.outroPlayerLines.length > 0 && (
                <div className="mb-6">
                  <p className="text-gray-400 text-sm mb-2">
                    你可以要求劉隊在紀錄裡補上一句話（可選其一，或直接略過）。
                  </p>
                  <div className="space-y-2">
                    {config.police.outroPlayerLines.map((line) => (
                      <button
                        key={line.id}
                        type="button"
                        onClick={() =>
                          setSelectedPoliceNoteId(
                            selectedPoliceNoteId === line.id ? null : line.id,
                          )
                        }
                        className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition-all ${
                          selectedPoliceNoteId === line.id
                            ? 'bg-orange-500/30 border-orange-400 text-white'
                            : 'bg-dark-surface border-orange-500/30 text-gray-200 hover:border-orange-400'
                        }`}
                      >
                        {line.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </m.div>
          )}

        </AnimatePresence>
      </div>

      {/* Footer 按鈕 */}
      <div className="mt-4 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-400 hover:text-white border border-gray-600 rounded-lg"
        >
          關閉
        </button>

        {step === 'q1' && (
          <button
            type="button"
            onClick={handleQ1Next}
            disabled={!q1Selected}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg"
          >
            下一步
          </button>
        )}

        {step === 'q3' && (
          <button
            type="button"
            onClick={handleQ3Submit}
            disabled={q3Pairs.length !== q3Total}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg"
          >
            送出並完成
          </button>
        )}

        {step === 'outro' && (
          <button
            type="button"
            onClick={() =>
              onComplete(
                selectedPoliceNoteId ? { policeNoteId: selectedPoliceNoteId } : undefined,
              )
            }
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg"
          >
            結束回報
          </button>
        )}
      </div>
    </OverlayCard>
  );
}
