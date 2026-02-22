'use client';

import { reasoningByChapter, ChapterReasoning } from '@/data/reasoningByChapter';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, X } from 'lucide-react';
import { useState } from 'react';

interface ReasoningPanelProps {
  chapterId: string;
  onSaveAnswer: (chapterId: string, q: 'q1' | 'q2' | 'q3', value: string | string[]) => void;
  onComplete: () => void;
  onClose: () => void;
}

export default function ReasoningPanel({
  chapterId,
  onSaveAnswer,
  onComplete,
  onClose,
}: ReasoningPanelProps) {
  const config = reasoningByChapter[chapterId] as ChapterReasoning | undefined;
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [q1Selected, setQ1Selected] = useState<string | null>(null);
  const [q2Input, setQ2Input] = useState('');
  const [q3Pairs, setQ3Pairs] = useState<[string, string][]>([]);
  const [q3Selected, setQ3Selected] = useState<string[]>([]);
  const [q3Error, setQ3Error] = useState('');

  if (!config) return null;

  const handleQ1Next = () => {
    if (q1Selected) {
      onSaveAnswer(chapterId, 'q1', q1Selected);
      setStep(1);
    }
  };

  const handleQ2Next = () => {
    onSaveAnswer(chapterId, 'q2', q2Input.trim() || '');
    setStep(2);
  };

  const q3LeftIds = config.q3.leftItems.map((i) => i.id);
  const q3RightIds = config.q3.rightItems.map((i) => i.id);
  const q3UsedIds = new Set(q3Pairs.flat());
  const q3CanConfirm = q3Selected.length === 2;
  const q3OneLeft = q3Selected.some((id) => q3LeftIds.includes(id));
  const q3OneRight = q3Selected.some((id) => q3RightIds.includes(id));
  const q3ValidPair = q3CanConfirm && q3OneLeft && q3OneRight;

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
    const left = q3LeftIds.includes(a) ? a : b;
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
    if (q3Pairs.length !== 3) {
      setQ3Error('請先完成三組配對。');
      return;
    }
    const value: string[] = q3Pairs.map(([l, r]) => `${l},${r}`);
    onSaveAnswer(chapterId, 'q3', value);
    onComplete();
  };

  const getLabel = (id: string) => {
    const L = config.q3.leftItems.find((i) => i.id === id);
    const R = config.q3.rightItems.find((i) => i.id === id);
    return L?.label ?? R?.label ?? id;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative max-w-2xl w-full bg-gradient-to-br from-dark-card to-dark-surface border-2 border-orange-500/50 rounded-2xl p-6 md:p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-orange-500/30">
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            推理分析
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded"
          >
            <X size={24} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="q1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
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
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleQ1Next}
                  disabled={!q1Selected}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg"
                >
                  下一題
                </button>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="q2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-gray-200 mb-4">{config.q2.question}</p>
              <input
                type="text"
                value={q2Input}
                onChange={(e) => setQ2Input(e.target.value)}
                placeholder={config.q2.placeholder}
                className="w-full px-4 py-3 bg-dark-surface border-2 border-orange-500/30 rounded-xl text-gray-200 placeholder-gray-500 focus:border-orange-400 focus:outline-none mb-6"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleQ2Next}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg"
                >
                  下一題
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="q3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-gray-200 mb-4">{config.q3.question}</p>

              {q3Pairs.length > 0 && (
                <div className="mb-4">
                  <p className="text-gray-400 text-sm mb-2">已配對（共 {q3Pairs.length} / 3 組）</p>
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

              {q3Pairs.length < 3 && (
                <div className="mb-4">
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

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-400 text-sm mb-2">左：道具/線索</p>
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

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-400 hover:text-white border border-gray-600 rounded-lg"
                >
                  關閉
                </button>
                <button
                  type="button"
                  onClick={handleQ3Submit}
                  disabled={q3Pairs.length !== 3}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg"
                >
                  送出並完成
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
