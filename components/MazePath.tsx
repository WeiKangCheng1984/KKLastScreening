'use client';

import { Puzzle } from '@/types/game';
import { useState, useEffect } from 'react';
import { X, Check, RotateCcw } from 'lucide-react';

interface MazePathProps {
  puzzle: Puzzle;
  onSolve: (input: string | string[]) => void;
  onClose: () => void;
  error?: string;
  onErrorClear?: () => void;
}

export default function MazePath({ puzzle, onSolve, onClose, error, onErrorClear }: MazePathProps) {
  const maze = puzzle.config?.maze || [
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 0, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
  ];
  const start = puzzle.config?.start || [1, 1];
  const end = puzzle.config?.end || [3, 3];
  
  const [currentPos, setCurrentPos] = useState<[number, number]>(start);
  const [path, setPath] = useState<[number, number][]>([start]);
  const [visited, setVisited] = useState<Set<string>>(new Set([`${start[0]},${start[1]}`]));

  const handleCellClick = (row: number, col: number) => {
    // 檢查是否可移動（必須是路徑且相鄰）
    const isPath = maze[row] && maze[row][col] === 1;
    const isAdjacent = 
      (Math.abs(row - currentPos[0]) === 1 && col === currentPos[1]) ||
      (Math.abs(col - currentPos[1]) === 1 && row === currentPos[0]);
    
    if (isPath && isAdjacent) {
      const newPos: [number, number] = [row, col];
      setCurrentPos(newPos);
      setPath([...path, newPos]);
      setVisited(new Set([...visited, `${row},${col}`]));
      
      // 檢查是否到達終點
      if (row === end[0] && col === end[1]) {
        onSolve('path');
      }
      
      if (onErrorClear) onErrorClear();
    }
  };

  const handleReset = () => {
    setCurrentPos(start);
    setPath([start]);
    setVisited(new Set([`${start[0]},${start[1]}`]));
    if (onErrorClear) onErrorClear();
  };

  const isInPath = (row: number, col: number) => {
    return path.some(p => p[0] === row && p[1] === col);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-dark-card to-dark-surface border-2 border-dark-border rounded-2xl p-6 md:p-8 max-w-2xl w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-600/20 rounded-lg">
              <span className="text-2xl">🌀</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-200">迷宮路徑</h3>
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

        {/* 迷宮網格 */}
        <div className="mb-6">
          <div className="grid gap-1 p-4 bg-dark-surface/30 rounded-lg border border-dark-border"
               style={{ 
                 gridTemplateColumns: `repeat(${maze[0].length}, 1fr)`,
               }}>
            {maze.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                const isWall = cell === 0;
                const isStart = rowIndex === start[0] && colIndex === start[1];
                const isEnd = rowIndex === end[0] && colIndex === end[1];
                const isCurrent = rowIndex === currentPos[0] && colIndex === currentPos[1];
                const inPath = isInPath(rowIndex, colIndex);
                
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => !isWall && handleCellClick(rowIndex, colIndex)}
                    className={`aspect-square rounded border-2 flex items-center justify-center transition-all ${
                      isWall
                        ? 'bg-gray-800 border-gray-700 cursor-not-allowed'
                        : isStart
                        ? 'bg-gradient-to-br from-green-600 to-green-700 border-green-500'
                        : isEnd
                        ? 'bg-gradient-to-br from-red-600 to-red-700 border-red-500'
                        : isCurrent
                        ? 'bg-gradient-to-br from-teal-500 to-teal-600 border-teal-400 ring-2 ring-teal-300'
                        : inPath
                        ? 'bg-teal-900/50 border-teal-600'
                        : 'bg-dark-surface border-dark-border hover:border-teal-500 cursor-pointer'
                    }`}
                  >
                    {isStart && <span className="text-white font-bold">起</span>}
                    {isEnd && <span className="text-white font-bold">終</span>}
                    {isCurrent && !isStart && !isEnd && (
                      <div className="w-3 h-3 bg-white rounded-full" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 說明 */}
        <div className="mb-6 p-3 bg-blue-950/20 border border-blue-700/50 rounded-lg">
          <p className="text-xs text-blue-300">
            💡 點擊與當前位置相鄰的路徑格子來移動。從起點（綠色）走到終點（紅色）即可完成。
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
            onClick={handleReset}
            className="px-4 py-2 bg-dark-surface hover:bg-dark-border border-2 border-dark-border rounded-lg text-gray-300 hover:text-white transition-all flex items-center gap-2"
          >
            <RotateCcw size={16} />
            重置
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

