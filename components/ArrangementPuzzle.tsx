'use client';

import { Puzzle } from '@/types/game';
import { useState, useEffect } from 'react';
import { X, Check, RotateCcw, HelpCircle } from 'lucide-react';

interface ArrangementPuzzleProps {
  puzzle: Puzzle;
  onSolve: (input: string | string[]) => void;
  onClose: () => void;
  error?: string;
  onErrorClear?: () => void;
}

export default function ArrangementPuzzle({ puzzle, onSolve, onClose, error: externalError, onErrorClear }: ArrangementPuzzleProps) {
  // 從 solution 獲取所有選項，並打亂順序
  const [options, setOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [internalError, setInternalError] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  
  // 優先使用外部錯誤，如果沒有則使用內部錯誤
  const error = externalError || internalError;

  // 面板打開動畫
  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  // 分級提示系統
  const getHintText = () => {
    if (!puzzle.hint) return null;
    
    const hints = puzzle.hint.split('\n\n');
    if (hintLevel === 0) return hints[0] || puzzle.hint;
    if (hintLevel === 1 && hints.length > 1) return hints.slice(0, 2).join('\n\n');
    return puzzle.hint; // 完整提示
  };

  useEffect(() => {
    if (Array.isArray(puzzle.solution)) {
      const pool = [...puzzle.solution];
      const distractors = (puzzle.config as { distractors?: string[] } | undefined)?.distractors;
      if (distractors?.length) pool.push(...distractors);
      const shuffled = pool.sort(() => Math.random() - 0.5);
      setOptions(shuffled);
    }
  }, [puzzle.solution, puzzle.config]);

  const handleOptionClick = (option: string) => {
    if (selected.includes(option)) {
      // 如果已選擇，從選擇列表中移除
      setSelected(selected.filter(item => item !== option));
    } else {
      // 如果未選擇，添加到選擇列表
      setSelected([...selected, option]);
    }
    setInternalError('');
    if (onErrorClear) onErrorClear();
  };

  const handleReset = () => {
    setSelected([]);
    setInternalError('');
    if (onErrorClear) onErrorClear();
    // 重新打亂選項（含混淆詞）
    if (Array.isArray(puzzle.solution)) {
      const pool = [...puzzle.solution];
      const distractors = (puzzle.config as { distractors?: string[] } | undefined)?.distractors;
      if (distractors?.length) pool.push(...distractors);
      const shuffled = pool.sort(() => Math.random() - 0.5);
      setOptions(shuffled);
    }
  };

  const handleSubmit = () => {
    // 清除錯誤
    setInternalError('');
    if (onErrorClear) onErrorClear();
    
    if (selected.length === 0) {
      setInternalError('請至少選擇一個選項');
      return;
    }
    onSolve(selected);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* 背景模糊效果 */}
      <div className="absolute inset-0 backdrop-blur-sm"></div>
      
      <div className={`relative bg-gradient-to-br from-dark-card to-dark-surface border-2 border-dark-border rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl transform transition-all duration-500 ${
        isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
      }`}>
        {/* 標題欄 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <Check size={24} className="text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-200">排列病床</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-dark-border rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* 提示系統 */}
        {puzzle.hint && (
          <div className="mb-6">
            {showHint ? (
              <div className="p-4 bg-dark-surface/50 border border-orange-500/30 rounded-lg animate-slide-fade-in">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-orange-400 font-semibold">提示 {hintLevel + 1}/3</div>
                  <button
                    onClick={() => {
                      if (hintLevel < 2) {
                        setHintLevel(prev => prev + 1);
                      } else {
                        setShowHint(false);
                      }
                    }}
                    className="text-xs text-gray-400 hover:text-orange-400 transition-colors"
                  >
                    {hintLevel < 2 ? '顯示更多提示' : '隱藏提示'}
                  </button>
                </div>
                <div className="text-sm text-gray-300 leading-relaxed">{getHintText()}</div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setShowHint(true);
                  setHintLevel(0);
                }}
                className="w-full p-3 bg-dark-surface/30 border border-dark-border rounded-lg text-gray-400 hover:text-orange-400 hover:border-orange-500/30 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <HelpCircle size={16} />
                <span className="text-sm">顯示提示</span>
              </button>
            )}
          </div>
        )}

        {/* 選擇說明 */}
        {puzzle.id !== 'bed_arrangement' && (
          <div className="mb-4 text-sm text-gray-400">
            按照職位高低順序，依序點選以下選項：
          </div>
        )}

        {/* 可選選項（打亂順序） */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-3">
            {options.map((option, index) => {
              const isSelected = selected.includes(option);
              const selectionOrder = selected.indexOf(option) + 1;
              
              return (
                <button
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  className={`relative px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                    isSelected
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-lg scale-105'
                      : 'bg-dark-surface/50 border-dark-border text-gray-300 hover:bg-dark-surface hover:border-dark-border hover:text-white hover:scale-102'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option}</span>
                    {isSelected && (
                      <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                        {selectionOrder}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 已選擇的順序 */}
        {selected.length > 0 && (
          <div className="mb-6 p-4 bg-dark-surface/30 border border-dark-border rounded-lg">
            <div className="text-xs text-gray-400 mb-2">已選擇的順序：</div>
            <div className="flex flex-wrap gap-2">
              {selected.map((item, index) => (
                <div
                  key={index}
                  className="px-3 py-1.5 bg-blue-600/20 border border-blue-500/50 rounded-lg text-sm text-blue-300 flex items-center gap-2"
                >
                  <span className="text-xs text-blue-400">{index + 1}.</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 錯誤提示 */}
        {error && (
          <div className="mb-4 p-3 bg-orange-950/30 border-2 border-orange-700/70 rounded-lg text-sm text-orange-300 flex items-center gap-2 shake-on-error z-[60] relative">
            <X size={16} className="flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* 按鈕組 */}
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-dark-surface hover:bg-dark-border border-2 border-dark-border rounded-lg text-gray-300 hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
          >
            <RotateCcw size={18} />
            重置
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-industrial-orange to-industrial-red hover:from-industrial-orange-dark hover:to-industrial-red-dark text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            <Check size={18} />
            確認排列
          </button>
        </div>
      </div>
    </div>
  );
}

