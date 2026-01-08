'use client';

import { Puzzle } from '@/types/game';
import { useState, useEffect } from 'react';
import { X, Check, RotateCcw } from 'lucide-react';

interface SymbolMatchingProps {
  puzzle: Puzzle;
  onSolve: (input: string | string[]) => void;
  onClose: () => void;
  error?: string;
  onErrorClear?: () => void;
}

interface Card {
  id: string;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function SymbolMatching({ puzzle, onSolve, onClose, error, onErrorClear }: SymbolMatchingProps) {
  const pairs = puzzle.config?.pairs || [
    { id: 'p1', symbol: '★' },
    { id: 'p2', symbol: '●' },
    { id: 'p3', symbol: '▲' },
    { id: 'p4', symbol: '■' },
  ];
  
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);

  useEffect(() => {
    initializeCards();
  }, []);

  const initializeCards = () => {
    // 創建卡片對
    const newCards: Card[] = [];
    pairs.forEach((pair, index) => {
      // 每對創建兩張卡片
      newCards.push(
        { id: `${pair.id}_1`, symbol: pair.symbol, isFlipped: false, isMatched: false },
        { id: `${pair.id}_2`, symbol: pair.symbol, isFlipped: false, isMatched: false }
      );
    });
    
    // 打亂順序
    const shuffled = newCards.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCards([]);
    setMatchedPairs([]);
  };

  const handleCardClick = (cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched || flippedCards.length >= 2) {
      return;
    }

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);
    
    const newCards = cards.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);

    // 如果翻開兩張，檢查是否匹配
    if (newFlipped.length === 2) {
      setTimeout(() => {
        checkMatch(newFlipped);
      }, 1000);
    }
    
    if (onErrorClear) onErrorClear();
  };

  const checkMatch = (flipped: string[]) => {
    const [card1, card2] = flipped.map(id => cards.find(c => c.id === id)!);
    
    if (card1.symbol === card2.symbol) {
      // 匹配成功
      const newCards = cards.map(c => 
        flipped.includes(c.id) ? { ...c, isMatched: true, isFlipped: true } : c
      );
      setCards(newCards);
      setMatchedPairs([...matchedPairs, card1.symbol]);
      setFlippedCards([]);
      
      // 檢查是否全部匹配
      if (matchedPairs.length + 1 === pairs.length) {
        onSolve('matched');
      }
    } else {
      // 不匹配，翻回去
      const newCards = cards.map(c => 
        flipped.includes(c.id) ? { ...c, isFlipped: false } : c
      );
      setCards(newCards);
      setFlippedCards([]);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-dark-card to-dark-surface border-2 border-dark-border rounded-2xl p-6 md:p-8 max-w-2xl w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600/20 rounded-lg">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-200">符號配對</h3>
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

        {/* 進度 */}
        <div className="mb-4 text-center">
          <div className="text-sm text-gray-400">
            已匹配: {matchedPairs.length} / {pairs.length}
          </div>
        </div>

        {/* 卡片網格 */}
        <div className="mb-6 grid grid-cols-4 gap-3">
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              disabled={card.isFlipped || card.isMatched || flippedCards.length >= 2}
              className={`aspect-square rounded-lg border-2 transition-all duration-300 ${
                card.isMatched
                  ? 'bg-gradient-to-br from-green-600 to-green-700 border-green-500'
                  : card.isFlipped
                  ? 'bg-gradient-to-br from-industrial-orange to-industrial-red border-industrial-orange'
                  : 'bg-dark-surface border-dark-border hover:border-indigo-500 hover:bg-dark-border'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {card.isFlipped || card.isMatched ? (
                <div className="text-4xl text-white">{card.symbol}</div>
              ) : (
                <div className="text-2xl text-gray-500">?</div>
              )}
            </button>
          ))}
        </div>

        {/* 說明 */}
        <div className="mb-6 p-3 bg-blue-950/20 border border-blue-700/50 rounded-lg">
          <p className="text-xs text-blue-300">
            💡 點擊卡片翻開，找到相同的符號配對。記住符號的位置！
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-orange-950/30 border-2 border-orange-700/70 rounded-lg text-sm text-orange-300 flex items-center gap-2 shake-on-error">
            <X size={16} />
            <span>{error}</span>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={initializeCards}
            className="px-4 py-2 bg-dark-surface hover:bg-dark-border border-2 border-dark-border rounded-lg text-gray-300 hover:text-white transition-all flex items-center gap-2"
          >
            <RotateCcw size={16} />
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

