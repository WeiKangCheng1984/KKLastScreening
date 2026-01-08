'use client';

import { Puzzle } from '@/types/game';
import { useState } from 'react';
import { X, Check, RotateCcw } from 'lucide-react';

interface RotatingDialProps {
  puzzle: Puzzle;
  onSolve: (input: string | string[] | number[]) => void;
  onClose: () => void;
  error?: string;
  onErrorClear?: () => void;
}

interface Dial {
  id: string;
  segments: number;
  target: number;
  current: number;
}

export default function RotatingDial({ puzzle, onSolve, onClose, error, onErrorClear }: RotatingDialProps) {
  const dialsConfig = puzzle.config?.dials || [
    { id: 'd1', segments: 4, target: 0 },
    { id: 'd2', segments: 4, target: 2 },
    { id: 'd3', segments: 4, target: 1 },
  ];
  
  const [dials, setDials] = useState<Dial[]>(
    dialsConfig.map(d => ({ ...d, current: Math.floor(Math.random() * d.segments) }))
  );

  const handleDialRotate = (dialId: string, direction: 'left' | 'right') => {
    setDials(prev => prev.map(dial => {
      if (dial.id === dialId) {
        const newCurrent = direction === 'right'
          ? (dial.current + 1) % dial.segments
          : (dial.current - 1 + dial.segments) % dial.segments;
        return { ...dial, current: newCurrent };
      }
      return dial;
    }));
    if (onErrorClear) onErrorClear();
  };

  const handleReset = () => {
    setDials(dialsConfig.map(d => ({ ...d, current: Math.floor(Math.random() * d.segments) })));
    if (onErrorClear) onErrorClear();
  };

  const handleSubmit = () => {
    const allCorrect = dials.every(dial => dial.current === dial.target);
    
    if (allCorrect) {
      const solution = dials.map(d => d.current);
      onSolve(solution);
    } else {
      onSolve('incorrect');
    }
  };

  const getDialAngle = (dial: Dial) => {
    return (dial.current * 360) / dial.segments;
  };

  const getSegmentColor = (dial: Dial, segmentIndex: number) => {
    const isTarget = segmentIndex === dial.target;
    const isCurrent = segmentIndex === dial.current;
    
    if (isTarget && isCurrent) {
      return 'from-green-500 to-green-600';
    } else if (isTarget) {
      return 'from-yellow-500 to-yellow-600';
    } else if (isCurrent) {
      return 'from-blue-500 to-blue-600';
    }
    return 'from-gray-600 to-gray-700';
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-dark-card to-dark-surface border-2 border-dark-border rounded-2xl p-6 md:p-8 max-w-3xl w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-600/20 rounded-lg">
              <span className="text-2xl">🎡</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-200">旋轉轉盤</h3>
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

        {/* 轉盤區域 */}
        <div className="mb-6 grid grid-cols-2 md:grid-cols-3 gap-6">
          {dials.map((dial) => (
            <div key={dial.id} className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4">
                {/* 轉盤背景 */}
                <div className="absolute inset-0 rounded-full border-4 border-dark-border bg-dark-surface">
                  {/* 分段 */}
                  {Array.from({ length: dial.segments }).map((_, i) => {
                    const angle = (i * 360) / dial.segments;
                    const isTarget = i === dial.target;
                    const isCurrent = i === dial.current;
                    
                    return (
                      <div
                        key={i}
                        className="absolute inset-0"
                        style={{
                          transform: `rotate(${angle}deg)`,
                        }}
                      >
                        <div
                          className={`absolute top-0 left-1/2 w-1/2 h-1/2 origin-bottom-left ${
                            isTarget && isCurrent
                              ? 'bg-green-500'
                              : isTarget
                              ? 'bg-yellow-500/50'
                              : isCurrent
                              ? 'bg-blue-500/50'
                              : 'bg-gray-700/30'
                          }`}
                          style={{
                            clipPath: 'polygon(0 0, 100% 0, 100% 100%)',
                          }}
                        />
                      </div>
                    );
                  })}
                  
                  {/* 指針 */}
                  <div
                    className="absolute top-1/2 left-1/2 w-1 h-8 bg-white origin-top"
                    style={{
                      transform: `translate(-50%, -100%) rotate(${getDialAngle(dial)}deg)`,
                    }}
                  />
                  
                  {/* 中心點 */}
                  <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 border-2 border-dark-border" />
                </div>
              </div>
              
              {/* 控制按鈕 */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDialRotate(dial.id, 'left')}
                  className="w-10 h-10 bg-dark-surface hover:bg-dark-border border-2 border-dark-border rounded-lg text-gray-300 hover:text-white transition-all flex items-center justify-center"
                >
                  ↶
                </button>
                <div className="w-16 text-center">
                  <div className="text-xs text-gray-400">{dial.id}</div>
                  <div className="text-sm font-bold text-gray-200">
                    {dial.current} / {dial.target}
                  </div>
                </div>
                <button
                  onClick={() => handleDialRotate(dial.id, 'right')}
                  className="w-10 h-10 bg-dark-surface hover:bg-dark-border border-2 border-dark-border rounded-lg text-gray-300 hover:text-white transition-all flex items-center justify-center"
                >
                  ↷
                </button>
              </div>
              
              {/* 狀態指示 */}
              <div className="mt-2 text-xs">
                {dial.current === dial.target ? (
                  <span className="text-green-400">✓ 正確</span>
                ) : (
                  <span className="text-yellow-400">目標: {dial.target}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 說明 */}
        <div className="mb-6 p-3 bg-orange-950/20 border border-orange-700/50 rounded-lg">
          <p className="text-xs text-orange-300">
            💡 點擊左右箭頭旋轉轉盤。將所有轉盤旋轉到目標位置（黃色標記）即可完成。
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
            onClick={handleSubmit}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-industrial-orange to-industrial-red hover:from-industrial-orange-dark hover:to-industrial-red-dark text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            <Check size={18} />
            確認
          </button>
        </div>
      </div>
    </div>
  );
}

