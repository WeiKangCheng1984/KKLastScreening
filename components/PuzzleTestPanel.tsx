'use client';

import { useState } from 'react';
import { X, Puzzle } from 'lucide-react';
import { Puzzle as PuzzleType } from '@/types/game';

// 導入謎題組件
import CombinationLock from './CombinationLock';
import PuzzleInput from './PuzzleInput';
import WordScramble from './WordScramble';
import WireConnection from './WireConnection';
import JigsawPuzzle from './JigsawPuzzle';
import RotatingDial from './RotatingDial';
import SequenceMemory from './SequenceMemory';
import SlidingPuzzle from './SlidingPuzzle';
import SymbolMatching from './SymbolMatching';
import MazePath from './MazePath';
import LogicSwitches from './LogicSwitches';

interface PuzzleTestPanelProps {
  onClose: () => void;
}

// 預設謎題配置
const defaultPuzzles: Record<string, PuzzleType> = {
  combination_lock: {
    id: 'test_combination_lock',
    type: 'combination_lock',
    solution: '12345',
    hint: '測試密碼：12345',
  },
  input: {
    id: 'test_input',
    type: 'input',
    solution: 'TEST',
    hint: '輸入測試答案：TEST',
  },
  word_scramble: {
    id: 'test_word_scramble',
    type: 'word_scramble',
    solution: 'PUZZLE',
    hint: '重組字母拼出正確單字',
    config: {
      scrambledWord: 'ZUPZLE',
      originalWord: 'PUZZLE',
    },
  },
  wire_connection: {
    id: 'test_wire_connection',
    type: 'wire_connection',
    solution: 'connected',
    hint: '將左側的線連接到右側正確的終點',
    config: {
      wires: [
        { id: 'w1', color: 'red', start: 0, end: 2 },
        { id: 'w2', color: 'blue', start: 1, end: 3 },
        { id: 'w3', color: 'green', start: 2, end: 0 },
        { id: 'w4', color: 'yellow', start: 3, end: 1 },
      ],
    },
  },
  jigsaw: {
    id: 'test_jigsaw',
    type: 'jigsaw',
    solution: 'solved',
    hint: '點擊與空位相鄰的拼圖塊來移動它們',
    config: {
      gridSize: [3, 3],
    },
  },
  rotating_dial: {
    id: 'test_rotating_dial',
    type: 'rotating_dial',
    solution: [0, 2, 1, 3],
    hint: '旋轉轉盤到目標位置（黃色標記）',
    config: {
      dials: [
        { id: 'd1', segments: 4, target: 0 },
        { id: 'd2', segments: 4, target: 2 },
        { id: 'd3', segments: 4, target: 1 },
        { id: 'd4', segments: 4, target: 3 },
      ],
    },
  },
  sequence_memory: {
    id: 'test_sequence_memory',
    type: 'sequence_memory',
    solution: ['A', 'B', 'C', 'D'],
    hint: '記住顯示的序列，然後重現它',
    config: {
      sequenceLength: 4,
      symbols: ['A', 'B', 'C', 'D', 'E', 'F'],
    },
  },
  sliding_puzzle: {
    id: 'test_sliding_puzzle',
    type: 'sliding_puzzle',
    solution: 'solved',
    hint: '移動拼圖塊，將數字按順序排列',
    config: {
      gridSize: [3, 3],
    },
  },
  symbol_matching: {
    id: 'test_symbol_matching',
    type: 'symbol_matching',
    solution: 'matched',
    hint: '找到相同的符號配對',
    config: {
      pairs: [
        { id: 'p1', symbol: '★' },
        { id: 'p2', symbol: '●' },
        { id: 'p3', symbol: '▲' },
        { id: 'p4', symbol: '■' },
      ],
    },
  },
  maze_path: {
    id: 'test_maze_path',
    type: 'maze_path',
    solution: 'path',
    hint: '從起點走到終點',
    config: {
      maze: [
        [0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 0],
        [0, 1, 0, 0, 1, 0],
        [0, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      start: [1, 1],
      end: [3, 4],
    },
  },
  logic_switches: {
    id: 'test_logic_switches',
    type: 'logic_switches',
    solution: { s1: true, s2: false, s3: true },
    hint: '切換開關使邏輯表達式為真',
    config: {
      switches: [
        { id: 's1', initialState: false },
        { id: 's2', initialState: false },
        { id: 's3', initialState: false },
      ],
      logicRules: 's1 AND NOT s2 AND s3',
    },
  },
};

export default function PuzzleTestPanel({ onClose }: PuzzleTestPanelProps) {
  const [selectedPuzzle, setSelectedPuzzle] = useState<string | null>(null);
  const [error, setError] = useState('');

  const puzzleTypes = [
    { id: 'combination_lock', name: '密碼鎖', icon: '🔢', description: '旋轉數字盤輸入密碼' },
    { id: 'input', name: '文字輸入', icon: '⌨️', description: '直接輸入答案' },
    { id: 'word_scramble', name: '拼字遊戲', icon: '🔤', description: '重組打亂的字母' },
    { id: 'wire_connection', name: '顏色線對接', icon: '🔌', description: '連接顏色線到正確終點' },
    { id: 'jigsaw', name: '拼圖', icon: '🧩', description: '移動拼圖塊完成拼圖' },
    { id: 'rotating_dial', name: '旋轉轉盤', icon: '🎡', description: '旋轉轉盤到目標位置' },
    { id: 'sequence_memory', name: '序列記憶', icon: '🧠', description: '記住並重現序列' },
    { id: 'sliding_puzzle', name: '滑塊拼圖', icon: '↔️', description: '滑動拼圖塊排序' },
    { id: 'symbol_matching', name: '符號配對', icon: '🎯', description: '找到相同的符號' },
    { id: 'maze_path', name: '迷宮路徑', icon: '🌀', description: '從起點走到終點' },
    { id: 'logic_switches', name: '邏輯開關', icon: '⚡', description: '切換開關滿足邏輯' },
  ];

  const handleSolve = (input: string | string[] | Record<string, any>) => {
    if (!selectedPuzzle) return;
    
    const puzzle = defaultPuzzles[selectedPuzzle];
    let solved = false;

    // 根據謎題類型檢查答案
    switch (puzzle.type) {
      case 'combination_lock':
      case 'input':
        solved = puzzle.solution === input;
        break;
      case 'word_scramble':
        solved = (puzzle.solution as string).toUpperCase() === (input as string).toUpperCase();
        break;
      case 'wire_connection':
        solved = input === 'connected';
        break;
      case 'jigsaw':
      case 'sliding_puzzle':
      case 'symbol_matching':
      case 'maze_path':
        solved = input === 'solved' || input === 'matched' || input === 'path';
        break;
      case 'rotating_dial':
        if (Array.isArray(input) && Array.isArray(puzzle.solution)) {
          solved = JSON.stringify(puzzle.solution) === JSON.stringify(input);
        }
        break;
      case 'sequence_memory':
        if (Array.isArray(input) && Array.isArray(puzzle.solution)) {
          solved = JSON.stringify(puzzle.solution) === JSON.stringify(input);
        }
        break;
      case 'logic_switches':
        if (typeof input === 'object' && puzzle.solution) {
          solved = JSON.stringify(puzzle.solution) === JSON.stringify(input);
        }
        break;
      default:
        solved = true;
    }

    if (solved) {
      alert('✅ 謎題解決成功！');
      setSelectedPuzzle(null);
      setError('');
    } else {
      if (puzzle.type === 'wire_connection') {
        if (input === 'not_all_connected') {
          setError('請連接所有線條');
        } else {
          setError('連接不正確，請檢查連接方式');
        }
      } else {
        setError('答案不正確，請再試一次。');
      }
    }
  };

  const renderPuzzle = () => {
    if (!selectedPuzzle) return null;

    const puzzle = defaultPuzzles[selectedPuzzle];

    switch (puzzle.type) {
      case 'combination_lock':
        return (
          <CombinationLock
            puzzle={puzzle}
            onSolve={handleSolve}
            onClose={() => {
              setSelectedPuzzle(null);
              setError('');
            }}
            error={error}
            onErrorClear={() => setError('')}
          />
        );
      case 'input':
        return (
          <PuzzleInput
            puzzle={puzzle}
            onSolve={handleSolve}
            onClose={() => {
              setSelectedPuzzle(null);
              setError('');
            }}
            error={error}
            onErrorClear={() => setError('')}
          />
        );
      case 'word_scramble':
        return (
          <WordScramble
            puzzle={puzzle}
            onSolve={handleSolve}
            onClose={() => {
              setSelectedPuzzle(null);
              setError('');
            }}
            error={error}
            onErrorClear={() => setError('')}
          />
        );
      case 'wire_connection':
        return (
          <WireConnection
            puzzle={puzzle}
            onSolve={handleSolve}
            onClose={() => {
              setSelectedPuzzle(null);
              setError('');
            }}
            error={error}
            onErrorClear={() => setError('')}
          />
        );
      case 'jigsaw':
        return (
          <JigsawPuzzle
            puzzle={puzzle}
            onSolve={handleSolve}
            onClose={() => {
              setSelectedPuzzle(null);
              setError('');
            }}
            error={error}
            onErrorClear={() => setError('')}
          />
        );
      case 'rotating_dial':
        return (
          <RotatingDial
            puzzle={puzzle}
            onSolve={handleSolve}
            onClose={() => {
              setSelectedPuzzle(null);
              setError('');
            }}
            error={error}
            onErrorClear={() => setError('')}
          />
        );
      case 'sequence_memory':
        return (
          <SequenceMemory
            puzzle={puzzle}
            onSolve={handleSolve}
            onClose={() => {
              setSelectedPuzzle(null);
              setError('');
            }}
            error={error}
            onErrorClear={() => setError('')}
          />
        );
      case 'sliding_puzzle':
        return (
          <SlidingPuzzle
            puzzle={puzzle}
            onSolve={handleSolve}
            onClose={() => {
              setSelectedPuzzle(null);
              setError('');
            }}
            error={error}
            onErrorClear={() => setError('')}
          />
        );
      case 'symbol_matching':
        return (
          <SymbolMatching
            puzzle={puzzle}
            onSolve={handleSolve}
            onClose={() => {
              setSelectedPuzzle(null);
              setError('');
            }}
            error={error}
            onErrorClear={() => setError('')}
          />
        );
      case 'maze_path':
        return (
          <MazePath
            puzzle={puzzle}
            onSolve={handleSolve}
            onClose={() => {
              setSelectedPuzzle(null);
              setError('');
            }}
            error={error}
            onErrorClear={() => setError('')}
          />
        );
      case 'logic_switches':
        return (
          <LogicSwitches
            puzzle={puzzle}
            onSolve={handleSolve}
            onClose={() => {
              setSelectedPuzzle(null);
              setError('');
            }}
            error={error}
            onErrorClear={() => setError('')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* 主面板 - 只在沒有選中謎題時顯示 */}
      {!selectedPuzzle ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-dark-card to-dark-surface border-2 border-industrial-orange/50 rounded-2xl p-6 md:p-8 max-w-4xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
          {/* 標題欄 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-industrial-orange/20 rounded-lg">
                <Puzzle size={24} className="text-industrial-orange" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-200">謎題測試面板</h3>
                <p className="text-xs text-gray-400 mt-1">測試互動謎題類型（已實作 11/11）</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-dark-border rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* 謎題類型網格 */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
            {puzzleTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => {
                  setSelectedPuzzle(type.id);
                  setError('');
                }}
                className={`p-4 bg-dark-surface/50 border-2 rounded-lg hover:border-industrial-orange/50 hover:bg-dark-surface transition-all duration-200 group ${
                  selectedPuzzle === type.id
                    ? 'border-industrial-orange bg-orange-900/20'
                    : 'border-dark-border'
                }`}
              >
                <div className="text-3xl mb-2">{type.icon}</div>
                <div className={`text-sm font-medium mb-1 ${
                  selectedPuzzle === type.id ? 'text-orange-300' : 'text-gray-300 group-hover:text-white'
                }`}>
                  {type.name}
                </div>
                <div className="text-xs text-gray-500">{type.description}</div>
              </button>
            ))}
          </div>

          {/* 快速測試指南 */}
          <div className="p-4 bg-green-950/20 border border-green-700/50 rounded-lg mb-4">
            <p className="text-xs text-green-300 mb-3 font-semibold">
              ✅ 快速測試指南（點擊謎題類型即可開始）
            </p>
            <div className="text-xs text-green-400 space-y-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div><strong>🔢 密碼鎖：</strong>輸入 <code className="bg-dark-surface px-1 rounded">12345</code></div>
                <div><strong>⌨️ 文字輸入：</strong>輸入 <code className="bg-dark-surface px-1 rounded">TEST</code></div>
                <div><strong>🔤 拼字遊戲：</strong>重組 <code className="bg-dark-surface px-1 rounded">ZUPZLE</code> → <code className="bg-dark-surface px-1 rounded">PUZZLE</code></div>
                <div><strong>🔌 顏色線對接：</strong>w1→2, w2→3, w3→0, w4→1</div>
                <div><strong>🧩 拼圖：</strong>點擊移動拼圖塊到正確位置</div>
                <div><strong>🎡 旋轉轉盤：</strong>點擊箭頭旋轉到目標位置（黃色標記）</div>
                <div><strong>🧠 序列記憶：</strong>記住顯示的序列，然後重現</div>
                <div><strong>↔️ 滑塊拼圖：</strong>點擊或按方向鍵移動，將數字排序</div>
                <div><strong>🎯 符號配對：</strong>翻開卡片找到相同的符號</div>
                <div><strong>🌀 迷宮路徑：</strong>點擊路徑從起點（綠）走到終點（紅）</div>
                <div><strong>⚡ 邏輯開關：</strong>s1=ON, s2=OFF, s3=ON（滿足邏輯表達式）</div>
              </div>
            </div>
          </div>

          {/* 說明 */}
          <div className="p-4 bg-blue-950/20 border border-blue-700/50 rounded-lg">
            <p className="text-xs text-blue-300 mb-2">
              💡 提示：每個謎題都有預設的測試配置，可以直接測試功能。
            </p>
            <p className="text-xs text-blue-400">
              💡 所有謎題都支援重置功能，可以多次測試。
            </p>
          </div>
          </div>
        </div>
      ) : null}

      {/* 渲染選中的謎題 - 使用更高的 z-index 確保顯示在最上層 */}
      {selectedPuzzle && renderPuzzle()}
    </>
  );
}

