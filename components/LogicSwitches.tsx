'use client';

import { Puzzle } from '@/types/game';
import { useState } from 'react';
import { X, Check, RotateCcw } from 'lucide-react';

interface LogicSwitchesProps {
  puzzle: Puzzle;
  onSolve: (input: string | string[] | Record<string, any>) => void;
  onClose: () => void;
  error?: string;
  onErrorClear?: () => void;
}

interface Switch {
  id: string;
  state: boolean;
}

export default function LogicSwitches({ puzzle, onSolve, onClose, error, onErrorClear }: LogicSwitchesProps) {
  const switchesConfig = puzzle.config?.switches || [
    { id: 's1', initialState: false },
    { id: 's2', initialState: false },
    { id: 's3', initialState: false },
  ];
  
  const logicRules = puzzle.config?.logicRules || 's1 AND s2 AND s3';
  const solution = puzzle.solution as Record<string, boolean>;
  
  const [switches, setSwitches] = useState<Switch[]>(
    switchesConfig.map(s => ({ id: s.id, state: s.initialState }))
  );

  const handleSwitchToggle = (switchId: string) => {
    setSwitches(prev => prev.map(s => 
      s.id === switchId ? { ...s, state: !s.state } : s
    ));
    if (onErrorClear) onErrorClear();
  };

  const handleReset = () => {
    setSwitches(switchesConfig.map(s => ({ id: s.id, state: s.initialState })));
    if (onErrorClear) onErrorClear();
  };

  const evaluateLogic = (): boolean => {
    // 簡單的邏輯表達式評估
    // 將開關狀態映射到表達式
    const stateMap: Record<string, boolean> = {};
    switches.forEach(s => {
      stateMap[s.id] = s.state;
    });

    // 解析邏輯表達式（簡化版）
    let expression = logicRules;
    switches.forEach(s => {
      const regex = new RegExp(`\\b${s.id}\\b`, 'g');
      expression = expression.replace(regex, s.state ? 'true' : 'false');
    });

    // 替換邏輯運算符
    expression = expression.replace(/\bAND\b/g, '&&');
    expression = expression.replace(/\bOR\b/g, '||');
    expression = expression.replace(/\bNOT\b/g, '!');
    expression = expression.replace(/\bXOR\b/g, '!==');

    try {
      // 安全評估（僅評估布林表達式）
      return eval(expression) === true;
    } catch {
      // 如果表達式無效，檢查是否與解決方案匹配
      return JSON.stringify(stateMap) === JSON.stringify(solution);
    }
  };

  const handleSubmit = () => {
    const isCorrect = evaluateLogic();
    
    if (isCorrect) {
      const stateMap: Record<string, boolean> = {};
      switches.forEach(s => {
        stateMap[s.id] = s.state;
      });
      onSolve(stateMap);
    } else {
      onSolve('incorrect');
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-dark-card to-dark-surface border-2 border-dark-border rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-600/20 rounded-lg">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-200">邏輯開關</h3>
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

        {/* 邏輯規則 */}
        <div className="mb-6 p-4 bg-yellow-950/20 border border-yellow-700/50 rounded-lg">
          <div className="text-xs text-yellow-300 mb-2">邏輯規則</div>
          <div className="text-sm font-mono text-yellow-200">{logicRules}</div>
        </div>

        {/* 開關列表 */}
        <div className="mb-6 space-y-3">
          {switches.map((sw) => (
            <div
              key={sw.id}
              className="flex items-center justify-between p-4 bg-dark-surface/50 border-2 border-dark-border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  sw.state ? 'bg-green-500' : 'bg-gray-600'
                }`} />
                <span className="text-gray-300 font-medium">{sw.id}</span>
              </div>
              <button
                onClick={() => handleSwitchToggle(sw.id)}
                className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
                  sw.state ? 'bg-green-600' : 'bg-gray-700'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${
                    sw.state ? 'translate-x-8' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        {/* 當前狀態 */}
        <div className="mb-6 p-3 bg-dark-surface/30 border border-dark-border rounded-lg">
          <div className="text-xs text-gray-400 mb-2">當前狀態</div>
          <div className="text-sm font-mono text-gray-300">
            {switches.map(s => `${s.id}: ${s.state ? 'ON' : 'OFF'}`).join(', ')}
          </div>
        </div>

        {/* 說明 */}
        <div className="mb-6 p-3 bg-blue-950/20 border border-blue-700/50 rounded-lg">
          <p className="text-xs text-blue-300">
            💡 切換開關狀態，使邏輯表達式為真。點擊開關來切換 ON/OFF。
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

