'use client';

import { Puzzle } from '@/types/game';
import { useState, useEffect } from 'react';
import { X, Check, RotateCcw, Shuffle } from 'lucide-react';

interface JigsawPuzzleProps {
  puzzle: Puzzle;
  onSolve: (input: string | string[]) => void;
  onClose: () => void;
  error?: string;
  onErrorClear?: () => void;
}

interface Piece {
  id: number;
  row: number;
  col: number;
  correctRow: number;
  correctCol: number;
  image?: string;
}

export default function JigsawPuzzle({ puzzle, onSolve, onClose, error, onErrorClear }: JigsawPuzzleProps) {
  const gridSize = puzzle.config?.gridSize || [3, 3];
  const [rows, cols] = gridSize;
  const totalPieces = rows * cols;
  
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [emptySlot, setEmptySlot] = useState<{ row: number; col: number }>({ row: rows - 1, col: cols - 1 });

  useEffect(() => {
    initializePuzzle();
  }, []);

  const initializePuzzle = () => {
    const newPieces: Piece[] = [];
    for (let i = 0; i < totalPieces - 1; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      newPieces.push({
        id: i,
        row: row,
        col: col,
        correctRow: row,
        correctCol: col,
      });
    }
    
    // 打亂拼圖
    const shuffled = [...newPieces].sort(() => Math.random() - 0.5);
    shuffled.forEach((piece, index) => {
      piece.row = Math.floor(index / cols);
      piece.col = index % cols;
    });
    
    setPieces(shuffled);
    setEmptySlot({ row: rows - 1, col: cols - 1 });
  };

  const handlePieceClick = (pieceId: number) => {
    const piece = pieces.find(p => p.id === pieceId);
    if (!piece) return;

    // 檢查是否與空位相鄰
    const isAdjacent = 
      (Math.abs(piece.row - emptySlot.row) === 1 && piece.col === emptySlot.col) ||
      (Math.abs(piece.col - emptySlot.col) === 1 && piece.row === emptySlot.row);

    if (isAdjacent) {
      // 移動拼圖塊到空位
      const newPieces = pieces.map(p => {
        if (p.id === pieceId) {
          return { ...p, row: emptySlot.row, col: emptySlot.col };
        }
        return p;
      });
      setPieces(newPieces);
      setEmptySlot({ row: piece.row, col: piece.col });
      if (onErrorClear) onErrorClear();
      
      // 檢查是否完成
      checkCompletion(newPieces);
    } else {
      setSelectedPiece(pieceId);
    }
  };

  const checkCompletion = (currentPieces: Piece[]) => {
    const allCorrect = currentPieces.every(piece => 
      piece.row === piece.correctRow && piece.col === piece.correctCol
    );
    
    // 檢查空位是否在正確位置
    const emptyCorrect = emptySlot.row === rows - 1 && emptySlot.col === cols - 1;
    
    if (allCorrect && emptyCorrect) {
      onSolve('solved');
    }
  };

  const handleShuffle = () => {
    initializePuzzle();
    if (onErrorClear) onErrorClear();
  };

  const getPieceAt = (row: number, col: number) => {
    if (row === emptySlot.row && col === emptySlot.col) {
      return null; // 空位
    }
    return pieces.find(p => p.row === row && p.col === col);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-dark-card to-dark-surface border-2 border-dark-border rounded-2xl p-6 md:p-8 max-w-2xl w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600/20 rounded-lg">
              <span className="text-2xl">🧩</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-200">拼圖</h3>
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

        {/* 拼圖網格 */}
        <div className="mb-6">
          <div className="grid gap-1 p-4 bg-dark-surface/30 rounded-lg border border-dark-border"
               style={{ 
                 gridTemplateColumns: `repeat(${cols}, 1fr)`,
                 aspectRatio: `${cols}/${rows}`
               }}>
            {Array.from({ length: rows * cols }).map((_, index) => {
              const row = Math.floor(index / cols);
              const col = index % cols;
              const piece = getPieceAt(row, col);
              const isEmpty = row === emptySlot.row && col === emptySlot.col;
              
              return (
                <div
                  key={index}
                  className={`aspect-square border-2 rounded-lg flex items-center justify-center transition-all ${
                    isEmpty
                      ? 'bg-dark-surface/50 border-dashed border-dark-border'
                      : piece
                      ? 'bg-gradient-to-br from-industrial-orange to-industrial-red border-industrial-orange hover:border-industrial-orange-light cursor-pointer hover:scale-105 active:scale-95'
                      : 'bg-dark-surface border-dark-border'
                  }`}
                  onClick={() => piece && handlePieceClick(piece.id)}
                >
                  {isEmpty ? (
                    <div className="text-gray-500 text-xs">空</div>
                  ) : piece ? (
                    <div className="text-white font-bold text-lg">
                      {piece.id + 1}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        {/* 說明 */}
        <div className="mb-6 p-3 bg-blue-950/20 border border-blue-700/50 rounded-lg">
          <p className="text-xs text-blue-300">
            💡 點擊與空位相鄰的拼圖塊來移動它們。將所有拼圖塊移動到正確位置即可完成。
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
            onClick={handleShuffle}
            className="px-4 py-2 bg-dark-surface hover:bg-dark-border border-2 border-dark-border rounded-lg text-gray-300 hover:text-white transition-all flex items-center gap-2"
          >
            <Shuffle size={16} />
            重新打亂
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-dark-surface hover:bg-dark-border border-2 border-dark-border rounded-lg text-gray-300 hover:text-white transition-all"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
}

