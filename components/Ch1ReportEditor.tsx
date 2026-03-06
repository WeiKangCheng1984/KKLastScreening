'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, FileText, Clock, Layers, MessageSquare } from 'lucide-react';
import OverlayCard from '@/components/OverlayCard';
import {
  ch1ReportConfig,
  CH1_EVIDENCE_CATEGORIES,
  type Ch1EvidenceCategory,
} from '@/data/ch1ReportConfig';
import { reasoningByChapter } from '@/data/reasoningByChapter';
import type { GameState, Effect, DialogChoice } from '@/types/game';

export interface Ch1ReportEditorProps {
  engine: {
    getState: () => GameState;
    applyEffect: (effect: Effect) => void;
    handleDialogChoice: (choice: DialogChoice) => void;
    setReasoningComplete: (chapterId: string) => void;
  };
  onComplete: () => void;
  onClose: () => void;
}

const STEPS = [
  { id: 0, label: '證據桌', icon: FileText },
  { id: 1, label: '時間線', icon: Clock },
  { id: 2, label: '版本深度', icon: Layers },
  { id: 3, label: '態度宣言', icon: MessageSquare },
];

function getMissingCategory(
  selectedIds: string[],
  categories: Record<string, Ch1EvidenceCategory>
): Ch1EvidenceCategory | null {
  const hasTime = selectedIds.some((id) => categories[id] === 'TimeAnchor');
  const hasProcess = selectedIds.some((id) => categories[id] === 'ProcessAnchor');
  const hasPhysical = selectedIds.some((id) => categories[id] === 'PhysicalTrace');
  if (!hasTime) return 'TimeAnchor';
  if (!hasProcess) return 'ProcessAnchor';
  if (!hasPhysical) return 'PhysicalTrace';
  return null;
}

export default function Ch1ReportEditor({
  engine,
  onComplete,
  onClose,
}: Ch1ReportEditorProps) {
  const [step, setStep] = useState(0);
  const [selectedEvidenceIds, setSelectedEvidenceIds] = useState<string[]>([]);
  const [timelineSequence, setTimelineSequence] = useState<string[]>([]);
  const [selectedPoliceNoteId, setSelectedPoliceNoteId] = useState<string | null>(null);
  const [selectedAttitudeId, setSelectedAttitudeId] = useState<string | null>(null);
  const [showClosing, setShowClosing] = useState(false);
  const [evidenceError, setEvidenceError] = useState('');
  const [timelineError, setTimelineError] = useState('');
  const [timelineErrorIndex, setTimelineErrorIndex] = useState(0);

  const state = engine.getState();
  const inventory = state.inventory ?? [];
  const config = ch1ReportConfig;
  const policeConfig = reasoningByChapter.ch1?.police;

  const evidenceCards = config.evidence.evidenceCards;
  const hasItem = (itemId: string) => inventory.includes(itemId);

  const toggleEvidence = (itemId: string) => {
    if (!CH1_EVIDENCE_CATEGORIES[itemId]) return;
    setEvidenceError('');
    setSelectedEvidenceIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : prev.length >= 3 ? prev : [...prev, itemId]
    );
  };

  const handleEvidenceNext = () => {
    if (selectedEvidenceIds.length !== 3) {
      setEvidenceError('請選滿 3 張證據。');
      return;
    }
    const missing = getMissingCategory(selectedEvidenceIds, CH1_EVIDENCE_CATEGORIES);
    if (missing) {
      setEvidenceError(config.evidence.missingCategoryHints[missing]);
      return;
    }
    engine.applyEffect({ type: 'setFlag', flag: 'ch1_report_evidence', value: selectedEvidenceIds });
    setStep(1);
    setTimelineSequence([]);
    setTimelineError('');
  };

  const toggleTimelineEvent = (eventId: string) => {
    setTimelineError('');
    setTimelineSequence((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : prev.length >= 5 ? prev : [...prev, eventId]
    );
  };

  const handleTimelineNext = () => {
    if (timelineSequence.length !== 5) {
      setTimelineError('請依序點選 5 張事件卡。');
      return;
    }
    const correct = config.timeline.correctOrder;
    const ok = correct.every((id, i) => timelineSequence[i] === id);
    if (!ok) {
      const msg = config.timeline.errorMessages[timelineErrorIndex % config.timeline.errorMessages.length];
      setTimelineError(msg);
      setTimelineErrorIndex((i) => i + 1);
      return;
    }
    engine.applyEffect({ type: 'setFlag', flag: 'ch1_report_timeline', value: timelineSequence });
    setStep(2);
  };

  const handleVersionNext = () => {
    engine.applyEffect({
      type: 'setFlag',
      flag: 'ch1_police_note',
      value: selectedPoliceNoteId ?? 'none',
    });
    setStep(3);
  };

  const handleAttitudeSelect = (choiceId: string) => {
    const att = config.attitude.choices.find((c) => c.id === choiceId);
    if (!att) return;
    const choice: DialogChoice = {
      id: att.id,
      text: att.text,
      insightEffects: [
        { target: att.insightTarget, delta: att.insightDelta },
        ...(att.insightTarget2 && att.insightDelta2 != null
          ? [{ target: att.insightTarget2, delta: att.insightDelta2 }]
          : []),
      ],
      effects: [{ type: 'setFlag', flag: 'ch1_attitude_declared', value: true }],
    };
    engine.handleDialogChoice(choice);
    setSelectedAttitudeId(choiceId);
    setShowClosing(true);
  };

  const handleEnterCh2 = () => {
    engine.setReasoningComplete('ch1');
    onComplete();
  };

  const closingText = useMemo(() => {
    if (!showClosing || !selectedAttitudeId) return '';
    const st = engine.getState();
    const insights = st.insights ?? {
      procedure_insight: 0,
      human_insight: 0,
      evidence_insight: 0,
    };
    const p = insights.procedure_insight ?? 0;
    const h = insights.human_insight ?? 0;
    const e = insights.evidence_insight ?? 0;
    const maxVal = Math.max(p, h, e);
    const key =
      maxVal === p ? 'procedure_insight' : maxVal === e ? 'evidence_insight' : 'human_insight';
    return config.attitude.closingInferenceByDimension[key];
  }, [showClosing, selectedAttitudeId, engine]);

  return (
    <OverlayCard
      tone="system"
      size="lg"
      className="w-full max-w-4xl max-h-[90vh] min-h-[70vh] p-6 md:p-8 flex flex-col"
    >
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-orange-500/30">
        <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
          向劉隊報告
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {STEPS.map((s) => (
          <span
            key={s.id}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm ${
              step === s.id ? 'bg-orange-500/40 text-white' : 'bg-white/5 text-gray-400'
            }`}
          >
            <s.icon size={14} />
            {s.label}
          </span>
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pr-1">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-gray-200 mb-2">選 3 張證據作為報告核心（須涵蓋：時間、流程／權限、殘留／痕跡各至少一）。</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {evidenceCards.map((card) => {
                  const owned = hasItem(card.itemId);
                  const selected = selectedEvidenceIds.includes(card.itemId);
                  return (
                    <button
                      key={card.itemId}
                      type="button"
                      onClick={() => owned && toggleEvidence(card.itemId)}
                      disabled={!owned}
                      className={`text-left p-3 rounded-xl border-2 transition-all ${
                        !owned
                          ? 'bg-gray-800/50 border-gray-600 text-gray-500 cursor-not-allowed'
                          : selected
                            ? 'bg-orange-500/30 border-orange-400 text-white'
                            : 'bg-dark-surface border-orange-500/30 text-gray-200 hover:border-orange-400'
                      }`}
                    >
                      <div className="font-medium text-sm">{card.titleShort}</div>
                      {owned ? (
                        <div className="text-xs mt-1 text-gray-400">{card.reportLine}</div>
                      ) : (
                        <div className="text-xs mt-1">尚未取得</div>
                      )}
                    </button>
                  );
                })}
              </div>
              {selectedEvidenceIds.length === 3 && (
                <p className="text-gray-400 text-sm mb-2">
                  已選：{selectedEvidenceIds.map((id) => evidenceCards.find((c) => c.itemId === id)?.titleShort).join('、')}
                </p>
              )}
              {evidenceError && <p className="text-red-400 text-sm mb-2">{evidenceError}</p>}
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-gray-200 mb-2">依時間順序點選 5 張事件卡。</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {config.timeline.events.map((ev) => {
                  const used = timelineSequence.includes(ev.id);
                  const idx = timelineSequence.indexOf(ev.id);
                  return (
                    <button
                      key={ev.id}
                      type="button"
                      onClick={() => toggleTimelineEvent(ev.id)}
                      className={`px-3 py-2 rounded-lg border-2 text-sm transition-all ${
                        used
                          ? 'bg-orange-500/30 border-orange-400 text-white'
                          : 'bg-dark-surface border-orange-500/30 text-gray-200 hover:border-orange-400'
                      }`}
                    >
                      {used ? `${idx + 1}. ${ev.label}` : ev.label}
                    </button>
                  );
                })}
              </div>
              {timelineSequence.length > 0 && (
                <p className="text-gray-400 text-sm mb-2">
                  目前順序：{timelineSequence.map((id, i) => `${i + 1}. ${config.timeline.events.find((e) => e.id === id)?.label}`).join(' → ')}
                </p>
              )}
              {timelineError && <p className="text-red-400 text-sm mb-2">{timelineError}</p>}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-gray-400 text-sm mb-2">可交出去的標準版：</p>
              <div className="p-3 rounded-lg bg-dark-surface border border-orange-500/30 text-gray-200 text-sm mb-4 whitespace-pre-line">
                {policeConfig?.outroStandard ?? ''}
              </div>
              <p className="text-gray-400 text-sm mb-2">要補一句嗎？（可選其一或只照標準版）</p>
              <div className="space-y-2">
                {config.version.playerLineOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() =>
                      setSelectedPoliceNoteId(selectedPoliceNoteId === opt.id ? null : opt.id)
                    }
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition-all ${
                      selectedPoliceNoteId === opt.id
                        ? 'bg-orange-500/30 border-orange-400 text-white'
                        : 'bg-dark-surface border-orange-500/30 text-gray-200 hover:border-orange-400'
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && !showClosing && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-gray-200 mb-4">你的態度宣言——</p>
              <div className="space-y-2">
                {config.attitude.choices.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleAttitudeSelect(c.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition-all ${
                      selectedAttitudeId === c.id
                        ? 'bg-orange-500/30 border-orange-400 text-white'
                        : 'bg-dark-surface border-orange-500/30 text-gray-200 hover:border-orange-400'
                    }`}
                  >
                    {c.text}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && showClosing && (
            <motion.div
              key="closing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-gray-200 mb-6 whitespace-pre-line">{closingText}</p>
              <button
                type="button"
                onClick={handleEnterCh2}
                className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-medium flex items-center justify-center gap-2"
              >
                進入第二章
                <ChevronRight size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-400 hover:text-white border border-gray-600 rounded-lg"
        >
          關閉
        </button>
        {step === 0 && (
          <button
            type="button"
            onClick={handleEvidenceNext}
            disabled={selectedEvidenceIds.length !== 3}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg"
          >
            下一頁
          </button>
        )}
        {step === 1 && (
          <button
            type="button"
            onClick={handleTimelineNext}
            disabled={timelineSequence.length !== 5}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg"
          >
            下一頁
          </button>
        )}
        {step === 2 && (
          <button
            type="button"
            onClick={handleVersionNext}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg"
          >
            下一頁
          </button>
        )}
      </div>
    </OverlayCard>
  );
}
