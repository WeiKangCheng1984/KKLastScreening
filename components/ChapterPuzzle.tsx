'use client';

import { Puzzle } from '@/types/game';
import { X } from 'lucide-react';
import { m } from 'framer-motion';
import FadeIn from './animations/FadeIn';
import SlideIn from './animations/SlideIn';
import PuzzleInput from './PuzzleInput';
import ArrangementPuzzle from './ArrangementPuzzle';
import VisualSelectionPuzzle from './VisualSelectionPuzzle';
import CombinationLock from './CombinationLock';
import WordScramble from './WordScramble';
import WireConnection from './WireConnection';
import JigsawPuzzle from './JigsawPuzzle';
import RotatingDial from './RotatingDial';
import SequenceMemory from './SequenceMemory';
import SlidingPuzzle from './SlidingPuzzle';
import SymbolMatching from './SymbolMatching';
import MazePath from './MazePath';
import LogicSwitches from './LogicSwitches';

interface ChapterPuzzleProps {
  puzzle: Puzzle;
  onSolve: (input: string | string[] | number[] | Record<string, any>) => void;
  onClose: () => void;
  chapterName?: string;
  error?: string;
  onErrorClear?: () => void;
}

export default function ChapterPuzzle({ 
  puzzle, 
  onSolve, 
  onClose,
  chapterName = '章節謎題',
  error = '',
  onErrorClear,
}: ChapterPuzzleProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <FadeIn delay={0} duration={0.3}>
        <m.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative max-w-4xl w-full bg-gradient-to-br from-dark-card to-dark-surface border-2 border-orange-500/50 rounded-2xl p-6 md:p-8 shadow-2xl"
        >
          {/* 標題欄 */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-orange-500/30">
            <SlideIn direction="left" delay={0.1} duration={0.3}>
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                {chapterName} - 最終謎題
              </h2>
            </SlideIn>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded"
            >
              <X size={24} />
            </button>
          </div>

          {/* 提示文字 */}
          {puzzle.hint && (
            <SlideIn direction="up" delay={0.2} duration={0.3}>
              <div className="mb-6 p-4 bg-orange-950/30 border border-orange-700/30 rounded-lg">
                <p className="text-orange-200 leading-relaxed">{puzzle.hint}</p>
              </div>
            </SlideIn>
          )}

          {/* 謎題內容區域 */}
          <SlideIn direction="up" delay={0.3} duration={0.3}>
            <div className="text-center text-gray-300 mb-6">
              <p className="text-lg mb-4">
                你已經探索了足夠的線索，現在是時候解決這個章節的最終謎題了。
              </p>
              <p className="text-sm text-gray-400">
                根據你收集的線索和做出的選擇，找出答案。
              </p>
            </div>

            {/* 根據謎題類型渲染對應的謎題組件 */}
            <div className="mt-6">
              {puzzle.type === 'arrangement' ? (
                <ArrangementPuzzle
                  puzzle={puzzle}
                  onSolve={onSolve}
                  onClose={onClose}
                  error={error}
                  onErrorClear={onErrorClear || (() => {})}
                />
              ) : puzzle.type === 'visual_selection' ? (
                <VisualSelectionPuzzle
                  puzzle={puzzle}
                  onSolve={onSolve}
                  onClose={onClose}
                  error={error}
                  onErrorClear={onErrorClear || (() => {})}
                />
              ) : puzzle.type === 'combination_lock' ? (
                <CombinationLock
                  puzzle={puzzle}
                  onSolve={onSolve}
                  onClose={onClose}
                  error={error}
                  onErrorClear={onErrorClear || (() => {})}
                />
              ) : puzzle.type === 'word_scramble' ? (
                <WordScramble
                  puzzle={puzzle}
                  onSolve={onSolve}
                  onClose={onClose}
                  error={error}
                  onErrorClear={onErrorClear || (() => {})}
                />
              ) : puzzle.type === 'wire_connection' ? (
                <WireConnection
                  puzzle={puzzle}
                  onSolve={onSolve}
                  onClose={onClose}
                  error={error}
                  onErrorClear={onErrorClear || (() => {})}
                />
              ) : puzzle.type === 'jigsaw' ? (
                <JigsawPuzzle
                  puzzle={puzzle}
                  onSolve={onSolve}
                  onClose={onClose}
                  error={error}
                  onErrorClear={onErrorClear || (() => {})}
                />
              ) : puzzle.type === 'rotating_dial' ? (
                <RotatingDial
                  puzzle={puzzle}
                  onSolve={onSolve}
                  onClose={onClose}
                  error={error}
                  onErrorClear={onErrorClear || (() => {})}
                />
              ) : puzzle.type === 'sequence_memory' ? (
                <SequenceMemory
                  puzzle={puzzle}
                  onSolve={onSolve}
                  onClose={onClose}
                  error={error}
                  onErrorClear={onErrorClear || (() => {})}
                />
              ) : puzzle.type === 'sliding_puzzle' ? (
                <SlidingPuzzle
                  puzzle={puzzle}
                  onSolve={onSolve}
                  onClose={onClose}
                  error={error}
                  onErrorClear={onErrorClear || (() => {})}
                />
              ) : puzzle.type === 'symbol_matching' ? (
                <SymbolMatching
                  puzzle={puzzle}
                  onSolve={onSolve}
                  onClose={onClose}
                  error={error}
                  onErrorClear={onErrorClear || (() => {})}
                />
              ) : puzzle.type === 'maze_path' ? (
                <MazePath
                  puzzle={puzzle}
                  onSolve={onSolve}
                  onClose={onClose}
                  error={error}
                  onErrorClear={onErrorClear || (() => {})}
                />
              ) : puzzle.type === 'logic_switches' ? (
                <LogicSwitches
                  puzzle={puzzle}
                  onSolve={onSolve}
                  onClose={onClose}
                  error={error}
                  onErrorClear={onErrorClear || (() => {})}
                />
              ) : (
                <PuzzleInput
                  puzzle={puzzle}
                  onSolve={onSolve}
                  onClose={onClose}
                  error={error}
                  onErrorClear={onErrorClear || (() => {})}
                />
              )}
            </div>
          </SlideIn>
        </m.div>
      </FadeIn>
    </div>
  );
}
