'use client';

import { Dialog } from '@/types/game';
import { X, History, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface DialogHistoryProps {
  dialogs: Dialog[];
  onClose: () => void;
}

function getTypeLabel(type?: string) {
  switch (type) {
    case 'broadcast': return '廣播';
    case 'item': return '道具';
    case 'system': return '系統';
    case 'character': return '角色';
    default: return '旁白';
  }
}

function getPreview(dialog: Dialog, maxLen = 56): string {
  const raw = dialog.textSegments?.[0] ?? dialog.text;
  const oneLine = raw.replace(/\s+/g, ' ').trim();
  return oneLine.length <= maxLen ? oneLine : oneLine.slice(0, maxLen) + '…';
}

export default function DialogHistory({ dialogs, onClose }: DialogHistoryProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-dark-card border border-dark-border rounded-xl shadow-xl w-full max-w-md max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-dark-border">
          <span className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <History size={18} />
            對話記錄 {dialogs.length > 0 && <span className="text-gray-500">({dialogs.length})</span>}
          </span>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-white/10 transition-colors"
            aria-label="關閉"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 min-h-0">
          {dialogs.length === 0 ? (
            <p className="text-center text-gray-500 text-sm py-6">暫無記錄</p>
          ) : (
            <ul className="space-y-1">
              {dialogs.map((dialog, index) => {
                const isExpanded = expandedIndex === index;
                const fullText = dialog.textSegments?.join('\n\n') ?? dialog.text;
                return (
                  <li
                    key={index}
                    className="rounded-lg border border-dark-border bg-dark-surface/50 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedIndex(isExpanded ? null : index)}
                      className="w-full text-left px-3 py-2.5 flex items-center gap-2 hover:bg-white/5 transition-colors"
                    >
                      <span className="text-[10px] uppercase tracking-wide text-gray-500 shrink-0 w-12">
                        {getTypeLabel(dialog.type)}
                      </span>
                      <span className="text-sm text-gray-200 truncate flex-1">
                        {getPreview(dialog)}
                      </span>
                      {isExpanded ? <ChevronUp size={14} className="text-gray-500 shrink-0" /> : <ChevronDown size={14} className="text-gray-500 shrink-0" />}
                    </button>
                    {isExpanded && (
                      <div className="px-3 pb-3 pt-0 border-t border-dark-border/50">
                        <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                          {fullText}
                        </p>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
