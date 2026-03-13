 'use client';

import PuzzleInput from '@/components/PuzzleInput';
import ArrangementPuzzle from '@/components/ArrangementPuzzle';
import VisualSelectionPuzzle from '@/components/VisualSelectionPuzzle';
import CombinationLock from '@/components/CombinationLock';
import WordScramble from '@/components/WordScramble';
import WireConnection from '@/components/WireConnection';
import JigsawPuzzle from '@/components/JigsawPuzzle';
import RotatingDial from '@/components/RotatingDial';
import SequenceMemory from '@/components/SequenceMemory';
import SlidingPuzzle from '@/components/SlidingPuzzle';
import SymbolMatching from '@/components/SymbolMatching';
import MazePath from '@/components/MazePath';
import LogicSwitches from '@/components/LogicSwitches';
import type { Puzzle } from '@/types/game';

export interface PuzzleRendererProps {
  puzzle: Puzzle;
  onSolve: (puzzleId: string, result?: unknown) => void;
  onClose: () => void;
  error: string;
  onErrorClear: () => void;
}

export default function PuzzleRenderer({
  puzzle,
  onSolve,
  onClose,
  error,
  onErrorClear,
}: PuzzleRendererProps) {
  // 各謎題元件期望 (input) 簽名，PuzzleRenderer 對外是 (puzzleId, result)
  // 統一用此包裝轉換，避免元件間型別衝突
  const handleSolve = (input: unknown) => onSolve(puzzle.id, input);

  const commonProps = {
    puzzle,
    onSolve: handleSolve,
    onClose,
    error,
    onErrorClear,
  };

  switch (puzzle.type) {
    case 'arrangement':
      return <ArrangementPuzzle {...commonProps} />;
    case 'visual_selection':
      return <VisualSelectionPuzzle {...commonProps} />;
    case 'combination_lock':
      return <CombinationLock {...commonProps} />;
    case 'word_scramble':
      return <WordScramble {...commonProps} />;
    case 'wire_connection':
      return <WireConnection {...commonProps} />;
    case 'jigsaw':
      return <JigsawPuzzle {...commonProps} />;
    case 'rotating_dial':
      return <RotatingDial {...commonProps} />;
    case 'sequence_memory':
      return <SequenceMemory {...commonProps} />;
    case 'sliding_puzzle':
      return <SlidingPuzzle {...commonProps} />;
    case 'symbol_matching':
      return <SymbolMatching {...commonProps} />;
    case 'maze_path':
      return <MazePath {...commonProps} />;
    case 'logic_switches':
      return <LogicSwitches {...commonProps} />;
    default:
      return <PuzzleInput {...commonProps} />;
  }
}

