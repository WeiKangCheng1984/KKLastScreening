'use client';

import { Puzzle } from '@/types/game';
import { useState, useEffect } from 'react';
import { X, Check, Lock } from 'lucide-react';
import { items } from '@/data/gameData';

interface PickThreePuzzleProps {
  puzzle: Puzzle;
  onSolve: (selectedIds: string[]) => void;
  onClose: () => void;
  error?: string;
  onErrorClear?: () => void;
  unlockedClues: [boolean, boolean, boolean];
}

export default function PickThreePuzzle({
  puzzle,
  onSolve,
  onClose,
  error: externalError = '',
  onErrorClear,
  unlockedClues,
}: PickThreePuzzleProps) {
  const [itemIds, setItemIds] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [internalError, setInternalError] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const error = externalError || internalError;

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  useEffect(() => {
    if (puzzle.type !== 'pick_three' || !Array.isArray(puzzle.solution)) return;
    const solutionGroups = puzzle.solution as string[][];
    const ids = [...new Set(solutionGroups.flat())];
    setItemIds(ids);
  }, [puzzle]);

  // 解謎成功、線索更新後清空選取，方便玩家選下一組
  const unlockedCount = unlockedClues.filter(Boolean).length;
  useEffect(() => {
    if (unlockedCount > 0) setSelected([]);
  }, [unlockedCount]);

  const handleCardClick = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((x) => x !== id));
    } else if (selected.length < 3) {
      setSelected([...selected, id]);
    }
    setInternalError('');
    onErrorClear?.();
  };

  const handleSubmit = () => {
    setInternalError('');
    onErrorClear?.();
    if (selected.length !== 3) {
      setInternalError('請選滿三樣道具。');
      return;
    }
    onSolve(selected);
  };

  const canSubmit = selected.length === 3;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div
        className={`relative max-w-2xl w-full bg-gradient-to-br from-dark-card to-dark-surface border-2 border-orange-500/50 rounded-2xl p-6 md:p-8 shadow-2xl transform transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-orange-500/30">
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            解謎：選三集滿線索
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
            <p className="text-orange-200 text-sm leading-relaxed whitespace-pre-line">{puzzle.hint}</p>
          </div>
        )}

        {/* 已獲得線索（3 格） */}
        <div className="mb-6">
          <p className="text-gray-400 text-sm mb-2">已獲得線索</p>
          <div className="flex flex-wrap gap-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${
                  unlockedClues[i]
                    ? 'bg-orange-500/20 border-orange-500/50 text-orange-200'
                    : 'bg-dark-surface border-orange-500/30 text-gray-500'
                }`}
              >
                {unlockedClues[i] ? (
                  <Check size={16} className="text-orange-400 shrink-0" />
                ) : (
                  <Lock size={14} className="text-gray-500 shrink-0" />
                )}
                <span className="text-sm">線索{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 目前選中的 3 張 */}
        {selected.length > 0 && (
          <div className="mb-4">
            <p className="text-gray-400 text-sm mb-2">已選 {selected.length} / 3 張</p>
          </div>
        )}

        {/* 6 張道具卡 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {itemIds.map((id) => {
            const isSelected = selected.includes(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleCardClick(id)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  isSelected
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
            解謎
          </button>
        </div>
      </div>
    </div>
  );
}
