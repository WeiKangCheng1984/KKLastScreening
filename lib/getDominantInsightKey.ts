import type { GameState } from '@/types/game';

export type DominantInsightKey = 'procedure_insight' | 'human_insight' | 'evidence_insight';

/**
 * 與 Ch1ReportEditor closingText 相同：三維取 max，平手時 procedure → evidence → human。
 */
export function getDominantInsightKey(state: GameState): DominantInsightKey {
  const insights = state.insights ?? {
    procedure_insight: 0,
    human_insight: 0,
    evidence_insight: 0,
  };
  const p = insights.procedure_insight ?? 0;
  const h = insights.human_insight ?? 0;
  const e = insights.evidence_insight ?? 0;
  const maxVal = Math.max(p, h, e);
  if (maxVal === p) return 'procedure_insight';
  if (maxVal === e) return 'evidence_insight';
  return 'human_insight';
}
