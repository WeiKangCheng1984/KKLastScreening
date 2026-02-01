'use client';

import { GameState } from '@/types/game';
import { TrendingUp, BarChart3 } from 'lucide-react';

interface ScoreDisplayProps {
  gameState: GameState;
  className?: string;
  showLegacyWeights?: boolean; // ?dev=1 時可顯示舊維度
}

export default function ScoreDisplay({ gameState, className = '', showLegacyWeights = false }: ScoreDisplayProps) {
  const insights = gameState.insights || {
    procedure_insight: 0,
    human_insight: 0,
    evidence_insight: 0,
  };
  const choices = gameState.choices || [];
  const maxInsight = Math.max(insights.procedure_insight, insights.human_insight, insights.evidence_insight);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* KK 洞察三維度 */}
      <div className="px-4 py-3 bg-dark-card/50 border border-dark-border/50 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 size={16} className="text-orange-400" />
          <span className="text-sm font-medium text-gray-300">KK 洞察</span>
        </div>
        <div className="space-y-2">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-400">流程洞察</span>
              <span className="text-xs font-semibold text-amber-400">{insights.procedure_insight}</span>
            </div>
            <div className="w-full h-1.5 bg-dark-surface rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300"
                style={{ width: `${Math.min(100, (insights.procedure_insight / Math.max(1, maxInsight)) * 100)}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-400">人心洞察</span>
              <span className="text-xs font-semibold text-rose-400">{insights.human_insight}</span>
            </div>
            <div className="w-full h-1.5 bg-dark-surface rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-rose-400 transition-all duration-300"
                style={{ width: `${Math.min(100, (insights.human_insight / Math.max(1, maxInsight)) * 100)}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-400">物證洞察</span>
              <span className="text-xs font-semibold text-sky-400">{insights.evidence_insight}</span>
            </div>
            <div className="w-full h-1.5 bg-dark-surface rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-sky-400 transition-all duration-300"
                style={{ width: `${Math.min(100, (insights.evidence_insight / Math.max(1, maxInsight)) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 選擇次數 */}
      <div className="px-4 py-2 bg-dark-card/30 border border-dark-border/30 rounded-lg">
        <div className="text-xs text-gray-500">
          已做出 <span className="text-orange-400 font-semibold">{choices.length}</span> 個選擇
        </div>
      </div>

      {/* 開發者模式：舊維度 */}
      {showLegacyWeights && gameState.preferences && (
        <div className="px-4 py-2 bg-dark-card/30 border border-dark-border/30 rounded-lg">
          <div className="text-xs text-gray-500 mb-1">preferences (dev)</div>
          <pre className="text-xs text-gray-400 overflow-auto">
            {JSON.stringify(gameState.preferences, null, 0)}
          </pre>
        </div>
      )}
    </div>
  );
}
