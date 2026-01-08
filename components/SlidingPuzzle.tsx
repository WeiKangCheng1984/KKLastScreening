'use client';

import { Puzzle } from '@/types/game';
import { useState, useEffect } from 'react';
import { X, Check, Shuffle, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface SlidingPuzzleProps {
  puzzle: Puzzle;
  onSolve: (input: string | string[]) => void;
  onClose: () => void;
  error?: string;
  onErrorClear?: () => void;
}

export default function SlidingPuzzle({ puzzle, onSolve, onClose, error, onErrorClear }: SlidingPuzzleProps) {
  const gridSize = puzzle.config?.gridSize || [3, 3];
  const [rows, cols] = gridSize;
  const totalTiles = rows * cols;
  
  // 使用二維陣列表示網格，null 表示空位
  const [grid, setGrid] = useState<(number | null)[][]>([]);
  const [emptyPos, setEmptyPos] = useState<[number, number]>([rows - 1, cols - 1]);

  useEffect(() => {
    initializePuzzle();
  }, []);

  const initializePuzzle = () => {
    // 創建正確的網格
    const correctGrid: (number | null)[][] = [];
    let num = 1;
    for (let r = 0; r < rows; r++) {
      const row: (number | null)[] = [];
      for (let c = 0; c < cols; c++) {
        if (r === rows - 1 && c === cols - 1) {
          row.push(null); // 空位
        } else {
          row.push(num++);
        }
      }
      correctGrid.push(row);
    }
    
    // 打亂（簡單隨機移動）
    let shuffled = correctGrid.map(row => [...row]);
    const [emptyRow, emptyCol] = [rows - 1, cols - 1];
    
    // 隨機移動多次來打亂
    for (let i = 0; i < 100; i++) {
      const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1]
      ];
      const validDirs = directions.filter(([dr, dc]) => {
        const newRow = emptyRow + dr;
        const newCol = emptyCol + dc;
        return newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols;
      });
      
      if (validDirs.length > 0) {
        const [dr, dc] = validDirs[Math.floor(Math.random() * validDirs.length)];
        const newRow = emptyRow + dr;
        const newCol = emptyCol + dc;
        
        // 交換
        const temp = shuffled[newRow][newCol];
        shuffled[newRow][newCol] = null;
        shuffled[emptyRow][emptyCol] = temp;
        
        // 更新空位位置（但這裡只是模擬，最後會重置）
      }
    }
    
    // 簡單打亂：隨機交換非空位
    const flat = shuffled.flat().filter(x => x !== null) as number[];
    for (let i = flat.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [flat[i], flat[j]] = [flat[j], flat[i]];
    }
    
    // 重新組裝網格
    const newGrid: (number | null)[][] = [];
    let idx = 0;
    for (let r = 0; r < rows; r++) {
      const row: (number | null)[] = [];
      for (let c = 0; c < cols; c++) {
        if (r === rows - 1 && c === cols - 1) {
          row.push(null);
          setEmptyPos([r, c]);
        } else {
          row.push(flat[idx++]);
        }
      }
      newGrid.push(row);
    }
    
    setGrid(newGrid);
  };

  const handleTileClick = (row: number, col: number) => {
    if (grid[row][col] === null) return;
    
    // 檢查是否與空位相鄰
    const [emptyRow, emptyCol] = emptyPos;
    const isAdjacent = 
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow);
    
    if (isAdjacent) {
      const newGrid = grid.map(r => [...r]);
      // 交換
      newGrid[emptyRow][emptyCol] = newGrid[row][col];
      newGrid[row][col] = null;
      
      setGrid(newGrid);
      setEmptyPos([row, col]);
      
      // 檢查是否完成
      checkCompletion(newGrid);
      if (onErrorClear) onErrorClear();
    }
  };

  const handleKeyPress = (direction: 'up' | 'down' | 'left' | 'right') => {
    const [emptyRow, emptyCol] = emptyPos;
    let targetRow = emptyRow;
    let targetCol = emptyCol;
    
    switch (direction) {
      case 'up':
        if (emptyRow < rows - 1) targetRow = emptyRow + 1;
        break;
      case 'down':
        if (emptyRow > 0) targetRow = emptyRow - 1;
        break;
      case 'left':
        if (emptyCol < cols - 1) targetCol = emptyCol + 1;
        break;
      case 'right':
        if (emptyCol > 0) targetCol = emptyCol - 1;
        break;
    }
    
    if (targetRow !== emptyRow || targetCol !== emptyCol) {
      handleTileClick(targetRow, targetCol);
    }
  };

  const checkCompletion = (currentGrid?: (number | null)[][]) => {
    const checkGrid = currentGrid || grid;
    let num = 1;
    let isComplete = true;
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (r === rows - 1 && c === cols - 1) {
          if (checkGrid[r][c] !== null) {
            isComplete = false;
            break;
          }
        } else {
          if (checkGrid[r][c] !== num) {
            isComplete = false;
            break;
          }
          num++;
        }
      }
      if (!isComplete) break;
    }
    
    if (isComplete) {
      onSolve('solved');
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-dark-card to-dark-surface border-2 border-dark-border rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-600/20 rounded-lg">
              <span className="text-2xl">↔️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-200">滑塊拼圖</h3>
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
            {grid.map((row, rowIndex) =>
              row.map((tile, colIndex) => {
                const isEmpty = tile === null;
                
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => !isEmpty && handleTileClick(rowIndex, colIndex)}
                    className={`aspect-square border-2 rounded-lg flex items-center justify-center transition-all ${
                      isEmpty
                        ? 'bg-dark-surface/50 border-dashed border-dark-border'
                        : 'bg-gradient-to-br from-industrial-orange to-industrial-red border-industrial-orange hover:border-industrial-orange-light cursor-pointer hover:scale-105 active:scale-95'
                    }`}
                  >
                    {isEmpty ? (
                      <div className="text-gray-500 text-xs">空</div>
                    ) : (
                      <div className="text-white font-bold text-xl">
                        {tile}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 方向控制 */}
        <div className="mb-6">
          <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
            <div></div>
            <button
              onClick={() => handleKeyPress('up')}
              className="p-3 bg-dark-surface hover:bg-dark-border border-2 border-dark-border rounded-lg text-gray-300 hover:text-white transition-all"
            >
              <ArrowUp size={20} />
            </button>
            <div></div>
            <button
              onClick={() => handleKeyPress('left')}
              className="p-3 bg-dark-surface hover:bg-dark-border border-2 border-dark-border rounded-lg text-gray-300 hover:text-white transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="p-3 bg-dark-surface border-2 border-dark-border rounded-lg text-gray-500 text-xs flex items-center justify-center">
              空
            </div>
            <button
              onClick={() => handleKeyPress('right')}
              className="p-3 bg-dark-surface hover:bg-dark-border border-2 border-dark-border rounded-lg text-gray-300 hover:text-white transition-all"
            >
              <ArrowRight size={20} />
            </button>
            <div></div>
            <button
              onClick={() => handleKeyPress('down')}
              className="p-3 bg-dark-surface hover:bg-dark-border border-2 border-dark-border rounded-lg text-gray-300 hover:text-white transition-all"
            >
              <ArrowDown size={20} />
            </button>
            <div></div>
          </div>
        </div>

        {/* 說明 */}
        <div className="mb-6 p-3 bg-blue-950/20 border border-blue-700/50 rounded-lg">
          <p className="text-xs text-blue-300">
            💡 點擊與空位相鄰的拼圖塊或使用方向鍵移動。將數字按順序排列即可完成。
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
            onClick={initializePuzzle}
            className="px-4 py-2 bg-dark-surface hover:bg-dark-border border-2 border-dark-border rounded-lg text-gray-300 hover:text-white transition-all flex items-center gap-2"
          >
            <Shuffle size={16} />
            重新打亂
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
