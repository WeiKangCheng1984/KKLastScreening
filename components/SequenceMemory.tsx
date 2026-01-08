'use client';

import { Puzzle } from '@/types/game';
import { useState, useEffect } from 'react';
import { X, Check, Eye, EyeOff } from 'lucide-react';

interface SequenceMemoryProps {
  puzzle: Puzzle;
  onSolve: (input: string | string[]) => void;
  onClose: () => void;
  error?: string;
  onErrorClear?: () => void;
}

export default function SequenceMemory({ puzzle, onSolve, onClose, error, onErrorClear }: SequenceMemoryProps) {
  const sequenceLength = puzzle.config?.sequenceLength || 4;
  const symbols = puzzle.config?.symbols || ['A', 'B', 'C', 'D', 'E', 'F'];
  const solution = Array.isArray(puzzle.solution) ? puzzle.solution : [];
  
  const [sequence, setSequence] = useState<string[]>([]);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [showSequence, setShowSequence] = useState(true);
  const [phase, setPhase] = useState<'show' | 'input'>('show');

  useEffect(() => {
    // 生成隨機序列
    const newSequence: string[] = [];
    for (let i = 0; i < sequenceLength; i++) {
      const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
      newSequence.push(randomSymbol);
    }
    setSequence(newSequence);
    
    // 顯示序列 3 秒
    const timer = setTimeout(() => {
      setShowSequence(false);
      setPhase('input');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSymbolClick = (symbol: string) => {
    if (phase !== 'input') return;
    
    const newUserSequence = [...userSequence, symbol];
    setUserSequence(newUserSequence);
    
    if (onErrorClear) onErrorClear();
    
    // 檢查是否完成
    if (newUserSequence.length === sequence.length) {
      checkAnswer(newUserSequence);
    }
  };

  const checkAnswer = (userSeq: string[]) => {
    const isCorrect = JSON.stringify(sequence) === JSON.stringify(userSeq);
    
    if (isCorrect) {
      onSolve(sequence);
    } else {
      onSolve('incorrect');
    }
  };

  const handleReset = () => {
    const newSequence: string[] = [];
    for (let i = 0; i < sequenceLength; i++) {
      const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
      newSequence.push(randomSymbol);
    }
    setSequence(newSequence);
    setUserSequence([]);
    setShowSequence(true);
    setPhase('show');
    
    setTimeout(() => {
      setShowSequence(false);
      setPhase('input');
    }, 3000);
    
    if (onErrorClear) onErrorClear();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-dark-card to-dark-surface border-2 border-dark-border rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-600/20 rounded-lg">
              <span className="text-2xl">🧠</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-200">序列記憶</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-dark-border rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {puzzle.hint && (
          <div className="mb-6 p-4 bg-dark-surface/50 border border-dark-border rounded-lg">
            <div className="text-xs text-gray-400 mb-1">提示</div>
            <div className="text-sm text-gray-300 leading-relaxed">{puzzle.hint}</div>
          </div>
        )}

        {/* 顯示階段 */}
        {phase === 'show' && (
          <div className="mb-6">
            <div className="text-center mb-4">
              <div className="text-sm text-gray-400 mb-2">記住這個序列</div>
              <div className="flex items-center justify-center gap-2">
                {showSequence ? <Eye size={16} className="text-yellow-400" /> : <EyeOff size={16} className="text-gray-500" />}
                <span className="text-xs text-gray-400">
                  {showSequence ? '正在顯示...' : '準備輸入'}
                </span>
              </div>
            </div>
            <div className="flex justify-center gap-3">
              {sequence.map((symbol, index) => (
                <div
                  key={index}
                  className={`w-16 h-16 rounded-lg flex items-center justify-center text-2xl font-bold transition-all ${
                    showSequence
                      ? 'bg-gradient-to-br from-industrial-orange to-industrial-red text-white scale-110'
                      : 'bg-dark-surface border-2 border-dark-border text-gray-500'
                  }`}
                >
                  {showSequence ? symbol : '?'}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 輸入階段 */}
        {phase === 'input' && (
          <div className="mb-6">
            <div className="text-center mb-4">
              <div className="text-sm text-gray-400 mb-2">重現剛才的序列</div>
              <div className="text-xs text-gray-500">
                已輸入: {userSequence.length} / {sequence.length}
              </div>
            </div>
            
            {/* 用戶輸入的序列 */}
            <div className="flex justify-center gap-3 mb-6 min-h-[80px] items-center">
              {Array.from({ length: sequence.length }).map((_, index) => (
                <div
                  key={index}
                  className={`w-16 h-16 rounded-lg flex items-center justify-center text-2xl font-bold border-2 transition-all ${
                    index < userSequence.length
                      ? 'bg-gradient-to-br from-industrial-orange to-industrial-red text-white border-industrial-orange'
                      : 'bg-dark-surface border-dark-border text-gray-500'
                  }`}
                >
                  {index < userSequence.length ? userSequence[index] : '?'}
                </div>
              ))}
            </div>

            {/* 符號按鈕 */}
            <div className="grid grid-cols-3 gap-3">
              {symbols.map((symbol) => (
                <button
                  key={symbol}
                  onClick={() => handleSymbolClick(symbol)}
                  disabled={userSequence.length >= sequence.length}
                  className="w-full h-16 bg-gradient-to-br from-industrial-orange to-industrial-red hover:from-industrial-orange-dark hover:to-industrial-red-dark text-white rounded-lg font-bold text-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {symbol}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-orange-950/30 border-2 border-orange-700/70 rounded-lg text-sm text-orange-300 flex items-center gap-2 shake-on-error">
            <X size={16} />
            <span>{error}</span>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-dark-surface hover:bg-dark-border border-2 border-dark-border rounded-lg text-gray-300 hover:text-white transition-all"
          >
            重新開始
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-dark-surface hover:bg-dark-border border-2 border-dark-border rounded-lg text-gray-300 hover:text-white transition-all"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
}

