'use client';

import { Puzzle } from '@/types/game';
import { useState, useEffect } from 'react';
import { X, Check, HelpCircle, Sparkles } from 'lucide-react';

interface PuzzleInputProps {
  puzzle: Puzzle;
  onSolve: (input: string | string[]) => void;
  onClose: () => void;
  error?: string;
  onErrorClear?: () => void;
}

export default function PuzzleInput({ puzzle, onSolve, onClose, error: externalError, onErrorClear }: PuzzleInputProps) {
  const [input, setInput] = useState('');
  const [internalError, setInternalError] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
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

  const handleSubmit = () => {
    // 清除錯誤
    setInternalError('');
    if (onErrorClear) onErrorClear();
    
    // 播放提交音效
    const audio = new Audio('/audio/sfx/sfx_puzzle_submit.mp3');
    audio.volume = 0.4;
    audio.play().catch(() => {});
    
    if (puzzle.type === 'input') {
      onSolve(input);
    } else if (puzzle.type === 'sequence') {
      // 處理序列輸入
      const sequence = input.split(',').map(s => s.trim());
      onSolve(sequence);
    } else if (puzzle.type === 'combination') {
      // 處理組合輸入（將輸入轉換成陣列）
      const combination = input.split(',').map(s => s.trim()).filter(s => s.length > 0);
      onSolve(combination);
    } else {
      onSolve(input);
    }
    // 不自動清空輸入，讓用戶可以修改
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* 背景模糊效果 */}
      <div className="absolute inset-0 backdrop-blur-sm"></div>
      
      <div className={`relative bg-gradient-to-br from-dark-card to-dark-surface border-2 border-dark-border rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl transform transition-all duration-500 ${
        isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
      } ${showSuccess ? 'animate-puzzle-success border-green-500/50' : ''}`}>
        {/* 標題欄 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <HelpCircle size={24} className="text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-200">謎題</h3>
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

        {/* 輸入框 */}
        <div className="mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setInternalError('');
              if (onErrorClear) onErrorClear();
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSubmit();
              }
            }}
            className="w-full px-4 py-3 bg-dark-surface border-2 border-dark-border rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-industrial-orange focus:ring-2 focus:ring-industrial-orange/20 transition-all"
            placeholder="輸入答案..."
            autoFocus
          />
          {error && (
            <div className="mt-3 p-3 bg-orange-950/30 border-2 border-orange-700/70 rounded-lg text-sm text-orange-300 flex items-center gap-2 shake-on-error z-[60] relative animate-flash">
              <X size={16} className="flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}
        </div>

        {/* 按鈕組 */}
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-industrial-orange to-industrial-red hover:from-industrial-orange-dark hover:to-industrial-red-dark text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 relative overflow-hidden group"
          >
            <Check size={18} className="relative z-10" />
            <span className="relative z-10">確認</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-dark-surface hover:bg-dark-border border-2 border-dark-border rounded-lg text-gray-300 hover:text-white transition-all duration-200"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
}

