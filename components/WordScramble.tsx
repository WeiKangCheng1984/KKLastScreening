'use client';

import { Puzzle } from '@/types/game';
import { useState, useEffect } from 'react';
import { X, Check, Shuffle } from 'lucide-react';

interface WordScrambleProps {
  puzzle: Puzzle;
  onSolve: (input: string | string[]) => void;
  onClose: () => void;
  error?: string;
  onErrorClear?: () => void;
}

export default function WordScramble({ puzzle, onSolve, onClose, error, onErrorClear }: WordScrambleProps) {
  const scrambledWord = puzzle.config?.scrambledWord || '';
  const originalWord = puzzle.config?.originalWord || (puzzle.solution as string);
  
  const [letters, setLetters] = useState<string[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [userWord, setUserWord] = useState('');

  useEffect(() => {
    // 初始化：打亂字母
    if (scrambledWord) {
      const shuffled = scrambledWord.split('').sort(() => Math.random() - 0.5);
      setLetters(shuffled);
    }
  }, [scrambledWord]);

  const handleLetterClick = (index: number) => {
    const letter = letters[index];
    setSelectedLetters([...selectedLetters, letter]);
    setUserWord(userWord + letter);
    
    // 從可用字母中移除
    const newLetters = [...letters];
    newLetters.splice(index, 1);
    setLetters(newLetters);
    
    if (onErrorClear) onErrorClear();
  };

  const handleUndo = () => {
    if (selectedLetters.length === 0) return;
    
    const lastLetter = selectedLetters[selectedLetters.length - 1];
    setSelectedLetters(selectedLetters.slice(0, -1));
    setUserWord(userWord.slice(0, -1));
    setLetters([...letters, lastLetter]);
    
    if (onErrorClear) onErrorClear();
  };

  const handleReset = () => {
    if (scrambledWord) {
      const shuffled = scrambledWord.split('').sort(() => Math.random() - 0.5);
      setLetters(shuffled);
    }
    setSelectedLetters([]);
    setUserWord('');
    if (onErrorClear) onErrorClear();
  };

  const handleSubmit = () => {
    onSolve(userWord.toUpperCase());
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-dark-card to-dark-surface border-2 border-dark-border rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-600/20 rounded-lg">
              <span className="text-2xl">🔤</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-200">拼字遊戲</h3>
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

        {/* 打亂的字母 */}
        <div className="mb-6">
          <div className="text-xs text-gray-400 mb-2">可用字母</div>
          <div className="flex flex-wrap gap-2 min-h-[80px] p-4 bg-dark-surface/30 rounded-lg border border-dark-border">
            {letters.length === 0 ? (
              <div className="text-gray-500 text-sm w-full text-center">所有字母已使用</div>
            ) : (
              letters.map((letter, index) => (
                <button
                  key={index}
                  onClick={() => handleLetterClick(index)}
                  className="w-12 h-12 bg-gradient-to-br from-industrial-orange to-industrial-red hover:from-industrial-orange-dark hover:to-industrial-red-dark text-white rounded-lg font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 active:scale-95"
                >
                  {letter.toUpperCase()}
                </button>
              ))
            )}
          </div>
        </div>

        {/* 已選擇的字母 */}
        <div className="mb-6">
          <div className="text-xs text-gray-400 mb-2">你的答案</div>
          <div className="p-4 bg-dark-surface border-2 border-dark-border rounded-lg min-h-[80px] flex items-center justify-center">
            <div className="text-3xl font-mono font-bold text-gray-200 tracking-wider">
              {userWord || '...'}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-orange-950/30 border-2 border-orange-700/70 rounded-lg text-sm text-orange-300 flex items-center gap-2 shake-on-error">
            <X size={16} />
            <span>{error}</span>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleUndo}
            disabled={selectedLetters.length === 0}
            className="px-4 py-2 bg-dark-surface hover:bg-dark-border border-2 border-dark-border rounded-lg text-gray-300 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            撤回
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-dark-surface hover:bg-dark-border border-2 border-dark-border rounded-lg text-gray-300 hover:text-white transition-all flex items-center gap-2"
          >
            <Shuffle size={16} />
            重置
          </button>
          <button
            onClick={handleSubmit}
            disabled={userWord.length === 0}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-industrial-orange to-industrial-red hover:from-industrial-orange-dark hover:to-industrial-red-dark text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check size={18} />
            確認
          </button>
        </div>
      </div>
    </div>
  );
}

