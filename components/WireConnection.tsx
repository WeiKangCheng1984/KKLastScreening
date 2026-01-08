'use client';

import { Puzzle } from '@/types/game';
import { useState } from 'react';
import { X, Check, RotateCcw } from 'lucide-react';

interface WireConnectionProps {
  puzzle: Puzzle;
  onSolve: (input: string | string[]) => void;
  onClose: () => void;
  error?: string;
  onErrorClear?: () => void;
}

interface Wire {
  id: string;
  color: string;
  start: number;
  end: number;
}

export default function WireConnection({ puzzle, onSolve, onClose, error, onErrorClear }: WireConnectionProps) {
  const wires = (puzzle.config?.wires || []) as Wire[];
  const [connections, setConnections] = useState<Record<string, number>>({});
  const [selectedWire, setSelectedWire] = useState<string | null>(null);

  const colors: Record<string, { bg: string; border: string; text: string }> = {
    red: { bg: 'bg-red-500', border: 'border-red-400', text: 'text-red-300' },
    blue: { bg: 'bg-blue-500', border: 'border-blue-400', text: 'text-blue-300' },
    green: { bg: 'bg-green-500', border: 'border-green-400', text: 'text-green-300' },
    yellow: { bg: 'bg-yellow-500', border: 'border-yellow-400', text: 'text-yellow-300' },
    purple: { bg: 'bg-purple-500', border: 'border-purple-400', text: 'text-purple-300' },
    orange: { bg: 'bg-orange-500', border: 'border-orange-400', text: 'text-orange-300' },
  };

  const getColorClass = (color: string) => colors[color] || colors.blue;

  const handleWireClick = (wireId: string) => {
    if (selectedWire === wireId) {
      setSelectedWire(null);
    } else {
      setSelectedWire(wireId);
    }
    if (onErrorClear) onErrorClear();
  };

  const handleEndPointClick = (endPoint: number) => {
    if (selectedWire) {
      // 檢查這個終點是否已被其他線使用
      const isUsed = Object.values(connections).includes(endPoint);
      if (isUsed) {
        // 移除舊連接
        const oldWireId = Object.keys(connections).find(
          id => connections[id] === endPoint
        );
        if (oldWireId) {
          const newConnections = { ...connections };
          delete newConnections[oldWireId];
          setConnections(newConnections);
        }
      }
      
      setConnections({ ...connections, [selectedWire]: endPoint });
      setSelectedWire(null);
      if (onErrorClear) onErrorClear();
    }
  };

  const handleReset = () => {
    setConnections({});
    setSelectedWire(null);
    if (onErrorClear) onErrorClear();
  };

  const handleSubmit = () => {
    // 檢查所有線是否都正確連接
    let allCorrect = true;
    let allConnected = true;

    wires.forEach(wire => {
      if (connections[wire.id] === undefined) {
        allConnected = false;
      } else if (connections[wire.id] !== wire.end) {
        allCorrect = false;
      }
    });

    if (!allConnected) {
      onSolve('not_all_connected');
      return;
    }

    if (allCorrect) {
      onSolve('connected');
    } else {
      onSolve('incorrect');
    }
  };

  const startPoints = Array.from({ length: wires.length }, (_, i) => i);
  const endPoints = Array.from({ length: wires.length }, (_, i) => i);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-dark-card to-dark-surface border-2 border-dark-border rounded-2xl p-6 md:p-8 max-w-3xl w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-600/20 rounded-lg">
              <span className="text-2xl">🔌</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-200">顏色線對接</h3>
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

        {/* 連線區域 */}
        <div className="mb-6 relative bg-dark-surface/30 rounded-lg p-6" style={{ minHeight: '350px' }}>
          {/* 左側起點 */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 space-y-3">
            {startPoints.map((point, idx) => {
              const wire = wires[idx];
              const colorClass = getColorClass(wire.color);
              const isSelected = selectedWire === wire.id;
              
              return (
                <button
                  key={`start-${point}`}
                  onClick={() => handleWireClick(wire.id)}
                  className={`w-20 h-14 ${colorClass.bg} rounded-lg flex flex-col items-center justify-center border-2 ${
                    isSelected ? 'border-white ring-2 ring-white/50' : colorClass.border
                  } transition-all hover:scale-105`}
                >
                  <span className="text-white font-bold text-lg">{point + 1}</span>
                  <span className="text-white/80 text-xs">{wire.id}</span>
                </button>
              );
            })}
          </div>

          {/* 右側終點 */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 space-y-3">
            {endPoints.map((point) => {
              const connectedWireId = Object.keys(connections).find(
                id => connections[id] === point
              );
              const connectedWire = connectedWireId ? wires.find(w => w.id === connectedWireId) : null;
              const colorClass = connectedWire ? getColorClass(connectedWire.color) : null;
              
              return (
                <button
                  key={`end-${point}`}
                  onClick={() => handleEndPointClick(point)}
                  className={`w-20 h-14 ${
                    colorClass ? colorClass.bg : 'bg-dark-surface'
                  } rounded-lg flex items-center justify-center border-2 ${
                    colorClass ? colorClass.border : 'border-dark-border hover:border-yellow-500'
                  } transition-all hover:scale-105`}
                >
                  <span className={`font-bold text-lg ${colorClass ? 'text-white' : 'text-gray-300'}`}>
                    {point + 1}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 連線顯示 */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {wires.map((wire) => {
                const connectedEnd = connections[wire.id];
                if (connectedEnd === undefined) return null;

                // 使用百分比座標，讓 SVG 自動適應容器大小
                const startY = 20 + wire.start * 15; // 每個點間隔 15%
                const endY = 20 + connectedEnd * 15;
                const startX = 15; // 左側起點位置
                const endX = 85; // 右側終點位置
                const midX = 50; // 中間點

                const colorMap: Record<string, string> = {
                  red: '#ef4444',
                  blue: '#3b82f6',
                  green: '#10b981',
                  yellow: '#eab308',
                  purple: '#a855f7',
                  orange: '#f97316',
                };

                return (
                  <path
                    key={wire.id}
                    d={`M ${startX} ${startY} Q ${midX} ${(startY + endY) / 2} ${endX} ${endY}`}
                    stroke={colorMap[wire.color] || '#3b82f6'}
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    className="drop-shadow-lg"
                  />
                );
              })}
            </svg>
          </div>

          {/* 說明文字 */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-gray-400 text-center">
            點擊左側線條選擇，然後點擊右側終點連接
          </div>
        </div>

        {/* 連接狀態 */}
        <div className="mb-6 grid grid-cols-2 md:grid-cols-3 gap-2">
          {wires.map((wire) => {
            const colorClass = getColorClass(wire.color);
            const connectedEnd = connections[wire.id];
            const isCorrect = connectedEnd === wire.end;
            
            return (
              <div
                key={wire.id}
                className={`p-3 rounded border-2 ${
                  connectedEnd !== undefined
                    ? isCorrect
                      ? 'bg-green-900/30 border-green-500'
                      : 'bg-yellow-900/30 border-yellow-500'
                    : 'bg-dark-surface border-dark-border'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded ${colorClass.bg}`} />
                  <div className="flex-1">
                    <div className="text-xs font-medium text-gray-300">{wire.id}</div>
                    <div className={`text-xs ${colorClass.text}`}>
                      {connectedEnd !== undefined 
                        ? `連接到 ${connectedEnd + 1}${isCorrect ? ' ✓' : ' ✗'}`
                        : '未連接'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
            確認連接
          </button>
        </div>
      </div>
    </div>
  );
}

