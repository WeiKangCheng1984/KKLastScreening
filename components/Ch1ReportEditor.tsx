'use client';

import { useState, useMemo } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, FileText, Clock, Layers, MessageSquare, Lock } from 'lucide-react';
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

/** 固定種子打亂陣列，同 session 內順序穩定 */
function shuffleStable<T extends { itemId: string }>(arr: T[]): T[] {
  const hash = (s: string) => s.split('').reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) | 0, 0);
  return [...arr].sort((a, b) => (hash(a.itemId) % 1000) - (hash(b.itemId) % 1000));
}

export default function Ch1ReportEditor({
  engine,
  onComplete,
  onClose,
}: Ch1ReportEditorProps) {
  const [step, setStep] = useState(0);
  const [slotEvidenceIds, setSlotEvidenceIds] = useState<(string | null)[]>(() => [null, null, null]);
  const [slotUnlocked, setSlotUnlocked] = useState<boolean[]>([false, false, false]);
  const [pendingEvidenceId, setPendingEvidenceId] = useState<string | null>(null);
  const [timelineSequence, setTimelineSequence] = useState<string[]>([]);
  const [timeMinutes, setTimeMinutes] = useState(14);
  const [selectedPoliceNoteId, setSelectedPoliceNoteId] = useState<string | null>(null);
  const [reportContainerIds, setReportContainerIds] = useState<string[]>([]);
  const [memoContainerIds, setMemoContainerIds] = useState<string[]>([]);
  const [selectedAttitudeId, setSelectedAttitudeId] = useState<string | null>(null);
  const [showClosing, setShowClosing] = useState(false);
  const [evidenceError, setEvidenceError] = useState('');
  const [timelineError, setTimelineError] = useState('');
  const [timelineErrorIndex, setTimelineErrorIndex] = useState(0);
  const [attitudeError, setAttitudeError] = useState('');

  const state = engine.getState();
  const inventory = state.inventory ?? [];
  const config = ch1ReportConfig;
  const policeConfig = reasoningByChapter.ch1?.police;

  const evidenceCards = config.evidence.evidenceCards;
  const shuffledEvidenceCards = useMemo(() => shuffleStable(evidenceCards), [evidenceCards]);
  const slotCount = config.evidence.evidenceSlots?.count ?? 3;
  const hasItem = (itemId: string) => inventory.includes(itemId);
  const usedEvidenceIds = slotEvidenceIds.filter((id): id is string => id != null);

  const unlockSlot = (index: number) => {
    if (slotUnlocked[index]) return;
    setEvidenceError('');
    setSlotUnlocked((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  };

  const putEvidenceInSlot = (itemId: string, slotIndex: number) => {
    if (!CH1_EVIDENCE_CATEGORIES[itemId] || slotEvidenceIds[slotIndex] != null || !slotUnlocked[slotIndex]) return;
    setEvidenceError('');
    setSlotEvidenceIds((prev) => {
      const next = [...prev];
      next[slotIndex] = itemId;
      return next;
    });
    setPendingEvidenceId(null);
  };

  const removeEvidenceFromSlot = (slotIndex: number) => {
    if (slotEvidenceIds[slotIndex] == null) return;
    setEvidenceError('');
    setSlotEvidenceIds((prev) => {
      const next = [...prev];
      next[slotIndex] = null;
      return next;
    });
  };

  const handleEvidenceCardClick = (itemId: string) => {
    if (!hasItem(itemId) || usedEvidenceIds.includes(itemId)) return;
    if (pendingEvidenceId === itemId) {
      setPendingEvidenceId(null);
      return;
    }
    setPendingEvidenceId(itemId);
    setEvidenceError('');
  };

  const handleSlotClick = (slotIndex: number) => {
    if (!slotUnlocked[slotIndex]) {
      unlockSlot(slotIndex);
      return;
    }
    if (slotEvidenceIds[slotIndex] != null) {
      removeEvidenceFromSlot(slotIndex);
      return;
    }
    if (pendingEvidenceId != null) {
      putEvidenceInSlot(pendingEvidenceId, slotIndex);
    }
  };

  const handleEvidenceNext = () => {
    const filled = slotEvidenceIds.filter((id): id is string => id != null);
    if (filled.length !== slotCount) {
      setEvidenceError('請在三個槽位各放入一張證據。');
      return;
    }
    const missing = getMissingCategory(filled, CH1_EVIDENCE_CATEGORIES);
    if (missing) {
      setEvidenceError(config.evidence.missingCategoryHints[missing]);
      return;
    }
    engine.applyEffect({ type: 'setFlag', flag: 'ch1_report_evidence', value: filled });
    setStep(1);
    setTimelineError('');
  };

  const handleTimelineNext = () => {
    const range = config.timeline.crimeTimeRange;
    if (timeMinutes < range.startMinutes || timeMinutes > range.endMinutes) {
      const msg = config.timeline.errorMessages[timelineErrorIndex % config.timeline.errorMessages.length];
      setTimelineError(msg);
      setTimelineErrorIndex((i) => i + 1);
      return;
    }
    engine.applyEffect({
      type: 'setFlag',
      flag: 'ch1_report_timeline',
      value: { type: 'crime_time', minutes: timeMinutes },
    });
    setStep(2);
    setTimelineError('');
  };

  const handleVersionNext = () => {
    engine.applyEffect({
      type: 'setFlag',
      flag: 'ch1_police_note',
      value: selectedPoliceNoteId ?? 'none',
    });
    setStep(3);
  };

  const handleAttitudeConfirm = () => {
    setAttitudeError('');
    if (reportContainerIds.length < 1) {
      setAttitudeError('請在警用報告封套中至少放入一項。');
      return;
    }
    if (memoContainerIds.length < 1) {
      setAttitudeError('請在 KK 私人備忘錄中至少放入一項。');
      return;
    }
    const requireInMemo = config.attitude.requireInMemoCardId;
    if (requireInMemo != null && !memoContainerIds.includes(requireInMemo)) {
      setAttitudeError('有一項內容必須放進 KK 的備忘裡（留底的那句）。');
      return;
    }
    const choiceId = reportContainerIds.length > 0 ? reportContainerIds[0] : memoContainerIds[0];
    const att = config.attitude.attitudeContentCards.find((c) => c.id === choiceId) ?? config.attitude.choices.find((c) => c.id === choiceId);
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

  const handleAttitudeDragStart = (e: React.DragEvent, cardId: string) => {
    e.dataTransfer.setData('text/plain', cardId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleAttitudeDrop = (e: React.DragEvent, container: 'report' | 'memo') => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('text/plain');
    if (!cardId || !config.attitude.attitudeContentCards.some((c) => c.id === cardId)) return;
    if (container === 'report') {
      setReportContainerIds((prev) => (prev.includes(cardId) ? prev : [...prev.filter((id) => id !== cardId), cardId]));
      setMemoContainerIds((prev) => prev.filter((id) => id !== cardId));
    } else {
      setMemoContainerIds((prev) => (prev.includes(cardId) ? prev : [...prev.filter((id) => id !== cardId), cardId]));
      setReportContainerIds((prev) => prev.filter((id) => id !== cardId));
    }
    setAttitudeError('');
  };

  const handleAttitudeDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const attitudeCards = config.attitude.attitudeContentCards ?? config.attitude.choices;
  const pooledCardIds = attitudeCards
    .map((c) => c.id)
    .filter((id) => !reportContainerIds.includes(id) && !memoContainerIds.includes(id));

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
            <m.div
              key="step0"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-gray-200 mb-3">報告用證據桌：先解鎖槽位，再從證據庫選一張放入各槽。須涵蓋三類各至少一：<strong>時間</strong>、<strong>流程／權限</strong>、<strong>殘留／痕跡</strong>。每類有兩張可選，擇一即可。</p>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <p className="text-gray-400 text-sm mb-2">證據庫（點選一張後再點空槽放入）</p>
                  <div className="grid grid-cols-1 gap-2">
                    {shuffledEvidenceCards.map((card) => {
                      const owned = hasItem(card.itemId);
                      const used = usedEvidenceIds.includes(card.itemId);
                      const pending = pendingEvidenceId === card.itemId;
                      return (
                        <button
                          key={card.itemId}
                          type="button"
                          onClick={() => handleEvidenceCardClick(card.itemId)}
                          disabled={!owned || used}
                          className={`text-left p-3 rounded-xl border-2 transition-all ${
                            !owned || used
                              ? 'bg-gray-800/50 border-gray-600 text-gray-500 cursor-not-allowed'
                              : pending
                                ? 'bg-orange-500/40 border-orange-400 text-white ring-2 ring-orange-300'
                                : 'bg-dark-surface border-orange-500/30 text-gray-200 hover:border-orange-400'
                          }`}
                        >
                          <div className="font-medium text-sm">{card.titleShort}</div>
                          {owned && !used && (
                            <div className="text-xs mt-1 text-gray-400">{card.reportLine}</div>
                          )}
                          {used && <div className="text-xs mt-1 text-gray-500">已放入槽位</div>}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-gray-400 text-sm mb-2">報告用證據桌（3 槽）</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {Array.from({ length: slotCount }, (_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSlotClick(i)}
                        className={`min-h-[80px] p-3 rounded-xl border-2 transition-all text-left ${
                          !slotUnlocked[i]
                            ? 'bg-gray-800/60 border-gray-600 text-gray-400 hover:border-orange-500/50'
                            : slotEvidenceIds[i] != null
                              ? 'bg-orange-500/20 border-orange-400 text-white'
                              : 'bg-dark-surface border-orange-500/30 text-gray-400 border-dashed'
                        }`}
                      >
                        {!slotUnlocked[i] ? (
                          <span className="flex items-center gap-2">
                            <Lock size={18} />
                            點擊解鎖
                          </span>
                        ) : slotEvidenceIds[i] != null ? (
                          <span className="font-medium text-sm">
                            {evidenceCards.find((c) => c.itemId === slotEvidenceIds[i])?.titleShort}
                          </span>
                        ) : (
                          <span className="text-sm">點選左側證據放入</span>
                        )}
                      </button>
                    ))}
                  </div>
                  {pendingEvidenceId && (
                    <p className="text-orange-300 text-sm mt-2">已選：{evidenceCards.find((c) => c.itemId === pendingEvidenceId)?.titleShort} → 點擊空槽放入</p>
                  )}
                </div>
              </div>
              {evidenceError && <p className="text-red-400 text-sm mb-2">{evidenceError}</p>}
            </m.div>
          )}

          {step === 1 && (
            <m.div
              key="step1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-gray-200 mb-3">根據線索，推測兇手動手的大致時間。調整撥鈕到你所推測的時刻。</p>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex-1 min-w-[200px]">
                  <input
                    type="range"
                    min={0}
                    max={45}
                    value={timeMinutes}
                    onChange={(e) => {
                      setTimeMinutes(Number(e.target.value));
                      setTimelineError('');
                    }}
                    className="w-full h-3 rounded-full appearance-none bg-dark-surface accent-orange-500"
                  />
                </div>
                <span className="text-xl font-mono text-orange-300 tabular-nums">
                  00:{String(timeMinutes).padStart(2, '0')}
                </span>
              </div>
              {timelineError && <p className="text-red-400 text-sm mb-2">{timelineError}</p>}
            </m.div>
          )}

          {step === 2 && (
            <m.div
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
            </m.div>
          )}

          {step === 3 && !showClosing && (
            <m.div
              key="step3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-gray-200 mb-3">報告要交出去，備忘留給自己。哪些內容放進哪一邊？拖曳內容卡到對應區域，至少放入一項後可確認。</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {config.attitude.attitudeContainers.map((cont, idx) => {
                  const isReport = cont.id === 'ch1_report_envelope';
                  const ids = isReport ? reportContainerIds : memoContainerIds;
                  return (
                    <div
                      key={cont.id}
                      onDragOver={handleAttitudeDragOver}
                      onDrop={(e) => handleAttitudeDrop(e, isReport ? 'report' : 'memo')}
                      className="min-h-[120px] p-4 rounded-xl border-2 border-dashed border-orange-500/40 bg-dark-surface/60"
                    >
                      <p className="text-gray-400 text-sm mb-2 font-medium">{cont.label}</p>
                      <div className="space-y-2">
                        {ids.map((cardId) => {
                          const card = attitudeCards.find((c) => c.id === cardId);
                          if (!card) return null;
                          return (
                            <div
                              key={cardId}
                              draggable
                              onDragStart={(e) => handleAttitudeDragStart(e, cardId)}
                              className="px-3 py-2 rounded-lg bg-orange-500/20 border border-orange-500/50 text-gray-200 text-sm cursor-grab active:cursor-grabbing"
                            >
                              {card.text}
                            </div>
                          );
                        })}
                        {ids.length === 0 && (
                          <p className="text-gray-500 text-sm">拖曳內容卡到這裡</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-gray-400 text-sm mb-2">內容卡（拖曳到上方區域）</p>
              <div className="flex flex-wrap gap-2">
                {pooledCardIds.map((cardId) => {
                  const card = attitudeCards.find((c) => c.id === cardId);
                  if (!card) return null;
                  return (
                    <div
                      key={cardId}
                      draggable
                      onDragStart={(e) => handleAttitudeDragStart(e, cardId)}
                      className="px-4 py-3 rounded-xl border-2 border-orange-500/30 bg-dark-surface text-gray-200 text-sm cursor-grab active:cursor-grabbing hover:border-orange-400"
                    >
                      {card.text}
                    </div>
                  );
                })}
                {pooledCardIds.length === 0 && (
                  <p className="text-gray-500 text-sm">所有內容卡已放入報告或備忘</p>
                )}
              </div>
              {attitudeError && <p className="text-red-400 text-sm mt-2">{attitudeError}</p>}
            </m.div>
          )}

          {step === 3 && showClosing && (
            <m.div
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
            </m.div>
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
            disabled={usedEvidenceIds.length !== slotCount}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg"
          >
            下一頁
          </button>
        )}
        {step === 1 && (
          <button
            type="button"
            onClick={handleTimelineNext}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg"
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
        {step === 3 && !showClosing && (
          <button
            type="button"
            onClick={handleAttitudeConfirm}
            disabled={
              reportContainerIds.length < 1 ||
              memoContainerIds.length < 1 ||
              (config.attitude.requireInMemoCardId != null &&
                !memoContainerIds.includes(config.attitude.requireInMemoCardId))
            }
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg"
          >
            確認
          </button>
        )}
      </div>
    </OverlayCard>
  );
}
