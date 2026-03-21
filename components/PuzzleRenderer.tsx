'use client';

import PuzzleInput from '@/components/PuzzleInput';
import ArrangementPuzzle from '@/components/ArrangementPuzzle';
import VisualSelectionPuzzle from '@/components/VisualSelectionPuzzle';
import RotatingDial from '@/components/RotatingDial';
import SequenceMemory from '@/components/SequenceMemory';
import type { Puzzle } from '@/types/game';

export interface PuzzleRendererProps {
  puzzle: Puzzle;
  onSolve: (puzzleId: string, result?: unknown) => void;
  onClose: () => void;
  error: string;
  onErrorClear: () => void;
}

/**
 * 僅掛載目前 `data/gameData*.ts` 實際出現的謎題類型；其餘走 PuzzleInput（input / pick_three 等）。
 */
export default function PuzzleRenderer({
  puzzle,
  onSolve,
  onClose,
  error,
  onErrorClear,
}: PuzzleRendererProps) {
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
    case 'rotating_dial':
      return <RotatingDial {...commonProps} />;
    case 'sequence_memory':
      return <SequenceMemory {...commonProps} />;
    default:
      return <PuzzleInput {...commonProps} />;
  }
}
