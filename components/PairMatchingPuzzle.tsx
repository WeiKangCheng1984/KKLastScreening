'use client';

import { Puzzle } from '@/types/game';
import { useState, useEffect } from 'react';
import { X, Link2 } from 'lucide-react';
import { items } from '@/data/gameData';

interface PairMatchingPuzzleProps {
  puzzle: Puzzle;
  onSolve: (input: [string, string][]) => void;
  onClose: () => void;
  error?: string;
  onErrorClear?: () => void;
  inventory?: string[];
}

export default function PairMatchingPuzzle({
  puzzle,
  onSolve,
  onClose,
  error: externalError = '',
  onErrorClear,
  inventory = [],
}: PairMatchingPuzzleProps) {
  const [itemIds, setItemIds] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [pairs, setPairs] = useState<[string, string][]>([]);
  const [internalError, setInternalError] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const error = externalError || internalError;

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  useEffect(() => {
    if (puzzle.type !== 'pair_matching' || !Array.isArray(puzzle.solution)) return;
    const solutionPairs = puzzle.solution as [string, string][];
    const ids = [...new Set(solutionPairs.flat())];
    setItemIds(ids);
  }, [puzzle]);

  const handleCardClick = (id: string) => {
    if (pairs.some(([a, b]) => a === id || b === id)) return;
    if (selected.includes(id)) {
      setSelected(selected.filter((x) => x !== id));
    } else if (selected.length < 2) {
      setSelected([...selected, id]);
    }
    setInternalError('');
    onErrorClear?.();
  };

  const confirmPair = () => {
    if (selected.length !== 2) return;
    setPairs([...pairs, [selected[0], selected[1]]]);
    setSelected([]);
    setInternalError('');
    onErrorClear?.();
  };

  const removePair = (index: number) => {
    setPairs(pairs.filter((_, i) => i !== index));
    setInternalError('');
    onErrorClear?.();
  };

  const handleSubmit = () => {
    setInternalError('');
    onErrorClear?.();
    if (pairs.length !== 3) {
      setInternalError('請先完成三組配對。');
      return;
    }
    onSolve(pairs);
  };

  const canSubmit = pairs.length === 3;
  const availableIds = itemIds.filter((id) => !pairs.some(([a, b]) => a === id || b === id));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div
        className={`relative max-w-2xl w-full bg-gradient-to-br from-dark-card to-dark-surface border-2 border-orange-500/50 rounded-2xl p-6 md:p-8 shadow-2xl transform transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-orange-500/30">
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            解謎：道具配對
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded"
          >
            <X size={24} />
          </button>
        </div>

        {puzzle.hint && (
          <div className="mb-6 p-4 bg-orange-950/30 border border-orange-700/30 rounded-lg">
            <p className="text-orange-200 text-sm leading-relaxed">{puzzle.hint}</p>
          </div>
        )}

        {/* 已配對的組 */}
        {pairs.length > 0 && (
          <div className="mb-6">
            <p className="text-gray-400 text-sm mb-2">已配對（共 {pairs.length} / 3 組）</p>
            <div className="flex flex-wrap gap-2">
              {pairs.map((pair, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-dark-surface border border-orange-500/30 rounded-lg"
                >
                  <span className="text-gray-200 text-sm">{items[pair[0]]?.name ?? pair[0]}</span>
                  <Link2 size={14} className="text-orange-400 shrink-0" />
                  <span className="text-gray-200 text-sm">{items[pair[1]]?.name ?? pair[1]}</span>
                  <button
                    type="button"
                    onClick={() => removePair(idx)}
                    className="text-red-400 hover:text-red-300 text-xs ml-1"
                  >
                    移除
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 選一組：目前選中的兩張 */}
        {pairs.length < 3 && (
          <div className="mb-6">
            <p className="text-gray-400 text-sm mb-2">點選兩張道具結成一組</p>
            {selected.length === 2 && (
              <button
                type="button"
                onClick={confirmPair}
                className="mb-4 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-sm"
              >
                確認此組
              </button>
            )}
          </div>
        )}

        {/* 6 張卡牌（未配對的顯示為可點選） */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {itemIds.map((id) => {
            const used = pairs.some(([a, b]) => a === id || b === id);
            const isSelected = selected.includes(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => !used && handleCardClick(id)}
                disabled={used}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  used
                    ? 'bg-gray-800/50 border-gray-600 text-gray-500 cursor-not-allowed'
                    : isSelected
                      ? 'bg-orange-500/30 border-orange-400 text-white'
                      : 'bg-dark-surface border-orange-500/30 text-gray-200 hover:border-orange-400 hover:bg-orange-950/20'
                }`}
              >
                <span className="text-sm font-medium">{items[id]?.name ?? id}</span>
              </button>
            );
          })}
        </div>

        {error && (
          <p className="text-red-400 text-sm mb-4">{error}</p>
        )}

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
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg"
          >
            送出配對
          </button>
        </div>
      </div>
    </div>
  );
}
