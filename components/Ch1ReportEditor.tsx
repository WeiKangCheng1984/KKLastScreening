'use client';

import { useState, useMemo, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, FileText, Clock, Layers, MessageSquare, Lock } from 'lucide-react';
import OverlayCard from '@/components/OverlayCard';
import ReportFillBlank from '@/components/ReportFillBlank';
import {
  CH1_EVIDENCE_CATEGORIES,
  CH1_ITEM_ID_TO_DISCOVER_FLAG,
  type Ch1EvidenceCategory,
  type Ch1AttitudeWordCategory,
  type Ch1ReportConfig,
} from '@/data/ch1ReportConfig';
import type { GameState, Effect, DialogChoice } from '@/types/game';

export interface Ch1ReportEditorProps {
  engine: {
    getState: () => GameState;
    applyEffect: (effect: Effect) => void;
    handleDialogChoice: (choice: DialogChoice) => void;
    setReasoningComplete: (chapterId: string) => void;
  };
  config: Ch1ReportConfig;
  onComplete: () => void;
  onClose: () => void;
}

const STEPS = [
  { id: 0, label: '證據桌', icon: FileText },
  { id: 1, label: '時間線', icon: Clock },
  { id: 2, label: '版本深度', icon: Layers },
  { id: 3, label: '態度宣言', icon: MessageSquare },
];
/** 目前只顯示時間線與態度宣言 */
const VISIBLE_STEPS = [
  { id: 1, label: '時間線', icon: Clock },
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

/** 單一數字翻牌（0–9），翻轉時以 3D 翻下顯示新數字 */
function FlipDigit({ digit }: { digit: number }) {
  const [displayed, setDisplayed] = useState(digit);
  const [flip, setFlip] = useState(false);
  useEffect(() => {
    if (digit !== displayed && !flip) setFlip(true);
  }, [digit, displayed, flip]);

  return (
    <div
      className="relative h-14 w-11 overflow-hidden rounded-lg bg-gradient-to-b from-gray-800/90 to-gray-900/95 shadow-inner"
      style={{
        perspective: '140px',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.25)',
        border: '1px solid rgba(251,146,60,0.25)',
      }}
    >
      <m.div
        className="absolute inset-0 flex origin-bottom items-center justify-center rounded-lg font-mono text-3xl font-semibold tabular-nums tracking-tight text-orange-100"
        style={{ backfaceVisibility: 'hidden', textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
        animate={{ rotateX: flip ? -90 : 0 }}
        transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {displayed}
      </m.div>
      <m.div
        className="absolute inset-0 flex origin-top items-center justify-center rounded-lg font-mono text-3xl font-semibold tabular-nums tracking-tight text-orange-100"
        style={{ backfaceVisibility: 'hidden', rotateX: 90, textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
        animate={{ rotateX: flip ? 0 : 90 }}
        transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
        onAnimationComplete={() => {
          if (flip) {
            setDisplayed(digit);
            setFlip(false);
          }
        }}
      >
        {digit}
      </m.div>
    </div>
  );
}
/** 固定種子打亂陣列，同 session 內順序穩定 */
function shuffleStable<T extends { itemId: string }>(arr: T[]): T[] {
  const hash = (s: string) => s.split('').reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) | 0, 0);
  return [...arr].sort((a, b) => (hash(a.itemId) % 1000) - (hash(b.itemId) % 1000));
}

const PHRASE_CATEGORY_COLORS: Record<Ch1AttitudeWordCategory, string> = {
  procedure: 'amber',   // 流程/體制 橙
  evidence: 'teal',    // 證據/現場 青
  human: 'rose',       // 人/動機 玫瑰
};

export default function Ch1ReportEditor({
  engine,
  config,
  onComplete,
  onClose,
}: Ch1ReportEditorProps) {
  const [step, setStep] = useState(1);
  const [slotEvidenceIds, setSlotEvidenceIds] = useState<(string | null)[]>(() => [null, null, null]);
  const [slotUnlocked, setSlotUnlocked] = useState<boolean[]>([false, false, false]);
  const [pendingEvidenceId, setPendingEvidenceId] = useState<string | null>(null);
  const [timelineSequence, setTimelineSequence] = useState<string[]>([]);
  const [timeMinutes, setTimeMinutes] = useState(0);
  const [timeHour, setTimeHour] = useState(0);
  const [selectedPoliceNoteId, setSelectedPoliceNoteId] = useState<string | null>(null);
  const [reportContainerIds, setReportContainerIds] = useState<string[]>([]);
  const [memoContainerIds, setMemoContainerIds] = useState<string[]>([]);
  const [selectedAttitudeId, setSelectedAttitudeId] = useState<string | null>(null);
  /** 詞組填空：當前第幾句（0～5） */
  const [phraseStructureIndex, setPhraseStructureIndex] = useState(0);
  /** 詞組填空：每句每個空槽填的 wordId */
  const [phraseFills, setPhraseFills] = useState<Record<string, Record<string, string>>>({});
  /** 詞組填空：當前選中的空槽（再點詞即填入） */
  const [selectedPhraseSlot, setSelectedPhraseSlot] = useState<{ structureId: string; slotId: string } | null>(null);
  /** 五題雙格填空：當前題號（0～4 顯示 ReportFillBlank，5 表示全部完成） */
  const [attitudeFillBlankIndex, setAttitudeFillBlankIndex] = useState(0);
  const [showClosing, setShowClosing] = useState(false);
  const [evidenceError, setEvidenceError] = useState('');
  const [timelineError, setTimelineError] = useState('');
  const [timelineErrorIndex, setTimelineErrorIndex] = useState(0);
  const [attitudeError, setAttitudeError] = useState('');

  const state = engine.getState();
  const inventory = state.inventory ?? [];
  const policeConfig = undefined;

  useEffect(() => {
    engine.applyEffect({
      type: 'setFlag',
      flag: 'ch1_report_evidence',
      value: config.evidence.evidenceCards.slice(0, 3).map((c) => c.itemId),
    });
    engine.applyEffect({
      type: 'setFlag',
      flag: 'ch1_police_note',
      value: 'none',
    });
  }, []);

  const attitudeFillBlanks = config.attitude.attitudeFillBlanks;
  const useAttitudeFillBlanks = Boolean(attitudeFillBlanks && attitudeFillBlanks.length >= 5);
  /** 五題填空全完成後也要顯示結尾（不依賴 useEffect 時機） */
  const showClosingView = showClosing || (useAttitudeFillBlanks && attitudeFillBlankIndex >= 5);
  useEffect(() => {
    if (!useAttitudeFillBlanks || attitudeFillBlankIndex < 5) return;
    engine.applyEffect({ type: 'setFlag', flag: 'ch1_attitude_declared', value: true });
    setSelectedAttitudeId('ch1_attitude_both');
    setShowClosing(true);
  }, [useAttitudeFillBlanks, attitudeFillBlankIndex, engine]);

  const evidenceCards = config.evidence.evidenceCards;
  const shuffledEvidenceCards = useMemo(() => shuffleStable(evidenceCards), [evidenceCards]);
  const slotCount = config.evidence.evidenceSlots?.count ?? 3;
  const flags = state.flags ?? {};
  /** 證據卡可選條件：背包擁有 或 該線索已發現（檢視時設定的 flag） */
  const canUseEvidenceCard = (itemId: string) =>
    inventory.includes(itemId) ||
    (!!CH1_ITEM_ID_TO_DISCOVER_FLAG[itemId] && !!flags[CH1_ITEM_ID_TO_DISCOVER_FLAG[itemId]]);
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
    if (!canUseEvidenceCard(itemId) || usedEvidenceIds.includes(itemId)) return;
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
    const hourOk = timeHour === 0;
    const minuteOk = timeMinutes >= range.startMinutes && timeMinutes <= range.endMinutes;
    if (!hourOk || !minuteOk) {
      const msg = config.timeline.errorMessages[timelineErrorIndex % config.timeline.errorMessages.length];
      const hh = String(timeHour).padStart(2, '0');
      const mm = String(timeMinutes).padStart(2, '0');
      setTimelineError(`${msg} 你選的是 ${hh}:${mm}。`);
      setTimelineErrorIndex((i) => i + 1);
      return;
    }
    engine.applyEffect({
      type: 'setFlag',
      flag: 'ch1_report_timeline',
      value: { type: 'crime_time', minutes: timeMinutes },
    });
    setStep(3);
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

  const phrasePuzzle = config.attitude.phrasePuzzle;
  const isPhrasePuzzle = Boolean(phrasePuzzle);

  /** 檢查單一空槽填寫是否過關（正確或嚴肅但錯） */
  const isSlotPass = (structureId: string, slotId: string, wordId: string): boolean => {
    if (!phrasePuzzle) return false;
    const structure = phrasePuzzle.structures.find((s) => s.id === structureId);
    const slot = structure?.slots.find((s) => s.slotId === slotId);
    if (!slot) return false;
    const correct = slot.correctWordIds.includes(wordId);
    const acceptable = slot.acceptableWordIds?.includes(wordId) ?? false;
    return correct || acceptable;
  };

  const handlePhraseSlotClick = (structureId: string, slotId: string) => {
    setSelectedPhraseSlot((prev) =>
      prev?.structureId === structureId && prev?.slotId === slotId ? null : { structureId, slotId }
    );
    setAttitudeError('');
  };

  const handlePhraseWordClick = (wordId: string) => {
    if (!selectedPhraseSlot || !phrasePuzzle) return;
    const currentStructureFills = phraseFills[selectedPhraseSlot.structureId] ?? {};
    const usedInThisSentence = new Set<string>(Object.values(currentStructureFills));
    const currentInSlot = currentStructureFills[selectedPhraseSlot.slotId];
    if (usedInThisSentence.has(wordId) && currentInSlot !== wordId) return;
    const { structureId, slotId } = selectedPhraseSlot;
    setPhraseFills((prev) => ({
      ...prev,
      [structureId]: {
        ...(prev[structureId] ?? {}),
        [slotId]: wordId,
      },
    }));
    setSelectedPhraseSlot(null);
    setAttitudeError('');
  };

  /** 檢查單一結構（一句）是否全部過關 */
  const validateStructure = (structureId: string): { ok: boolean; message?: string } => {
    if (!phrasePuzzle) return { ok: false, message: '' };
    const structure = phrasePuzzle.structures.find((s) => s.id === structureId);
    if (!structure) return { ok: false };
    const fills = phraseFills[structureId] ?? {};
    for (const slot of structure.slots) {
      const wordId = fills[slot.slotId];
      if (!wordId) return { ok: false, message: '這段還缺一筆。' };
      if (!isSlotPass(structureId, slot.slotId, wordId)) {
        return { ok: false, message: '這樣寫交不出去。' };
      }
    }
    return { ok: true };
  };

  const handlePhraseNext = () => {
    if (!phrasePuzzle) return;
    const structure = phrasePuzzle.structures[phraseStructureIndex];
    if (!structure) return;
    const result = validateStructure(structure.id);
    if (!result.ok) {
      setAttitudeError(result.message ?? '這段先寫完再說。');
      return;
    }
    setAttitudeError('');
    if (phraseStructureIndex < phrasePuzzle.structures.length - 1) {
      setPhraseStructureIndex((i) => i + 1);
    }
  };

  const handlePhraseConfirm = () => {
    if (!phrasePuzzle) return;
    const structure = phrasePuzzle.structures[phraseStructureIndex];
    if (!structure) return;
    const result = validateStructure(structure.id);
    if (!result.ok) {
      setAttitudeError(result.message ?? '這段先寫完。');
      return;
    }
    setAttitudeError('');
    const attBoth = config.attitude.attitudeContentCards.find((c) => c.id === 'ch1_attitude_both')
      ?? config.attitude.choices.find((c) => c.id === 'ch1_attitude_both');
    if (attBoth) {
      const choice: DialogChoice = {
        id: attBoth.id,
        text: attBoth.text,
        insightEffects: [
          { target: attBoth.insightTarget, delta: attBoth.insightDelta },
          ...(attBoth.insightTarget2 && attBoth.insightDelta2 != null
            ? [{ target: attBoth.insightTarget2, delta: attBoth.insightDelta2 }]
            : []),
        ],
        effects: [{ type: 'setFlag', flag: 'ch1_attitude_declared', value: true }],
      };
      engine.handleDialogChoice(choice);
    } else {
      engine.applyEffect({ type: 'setFlag', flag: 'ch1_attitude_declared', value: true });
    }
    setSelectedAttitudeId('ch1_attitude_both');
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
    if (!showClosingView) return '';
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
  }, [showClosingView, engine]);

  return (
    <>
      {step === 3 && useAttitudeFillBlanks && attitudeFillBlankIndex < 5 && attitudeFillBlanks && (
        <ReportFillBlank
          key={`att-q-${attitudeFillBlankIndex}`}
          config={attitudeFillBlanks[attitudeFillBlankIndex]}
          onComplete={() => setAttitudeFillBlankIndex((i) => i + 1)}
        />
      )}
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
        {VISIBLE_STEPS.map((s) => (
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
          {step === 1 && (
            <m.div
              key="step1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-gray-200 mb-6">報告裡總得寫上一筆：事情發生在幾點。劉隊會問的。</p>
              <div className="flex flex-col items-center gap-6">
                <div
                  className="rounded-2xl border border-orange-500/20 bg-gradient-to-b from-gray-800/60 to-gray-900/80 px-8 py-6"
                  style={{
                    boxShadow: 'inset 0 1px 0 rgba(251,146,60,0.06), 0 12px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.2)',
                  }}
                >
                  <div className="flex items-center justify-center gap-3">
                    <div className="flex gap-0.5">
                      <FlipDigit digit={Math.floor(timeHour / 10)} />
                      <FlipDigit digit={timeHour % 10} />
                    </div>
                    <span
                      className="pb-2 font-mono text-2xl font-light text-orange-500/70"
                      style={{ textShadow: '0 0 12px rgba(251,146,60,0.2)' }}
                    >
                      :
                    </span>
                    <div className="flex gap-0.5">
                      <FlipDigit digit={Math.floor(timeMinutes / 10)} />
                      <FlipDigit digit={timeMinutes % 10} />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-4">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        aria-label="減少一小時"
                        onClick={() => {
                          setTimeHour((h) => (h - 1 + 24) % 24);
                          setTimelineError('');
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-orange-500/25 bg-gray-800/60 text-orange-400/80 text-sm transition hover:border-orange-400/40 hover:bg-orange-500/10 active:scale-95"
                      >
                        −
                      </button>
                      <button
                        type="button"
                        aria-label="增加一小時"
                        onClick={() => {
                          setTimeHour((h) => (h + 1) % 24);
                          setTimelineError('');
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-orange-500/25 bg-gray-800/60 text-orange-400/80 text-sm transition hover:border-orange-400/40 hover:bg-orange-500/10 active:scale-95"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        aria-label="減少一分鐘"
                        onClick={() => {
                          setTimeMinutes((m) => (m - 1 + 60) % 60);
                          setTimelineError('');
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-orange-500/25 bg-gray-800/60 text-orange-400/80 text-sm transition hover:border-orange-400/40 hover:bg-orange-500/10 active:scale-95"
                      >
                        −
                      </button>
                      <button
                        type="button"
                        aria-label="增加一分鐘"
                        onClick={() => {
                          setTimeMinutes((m) => (m + 1) % 60);
                          setTimelineError('');
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-orange-500/25 bg-gray-800/60 text-orange-400/80 text-sm transition hover:border-orange-400/40 hover:bg-orange-500/10 active:scale-95"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {timelineError && <p className="mt-4 text-red-400 text-sm">{timelineError}</p>}
            </m.div>
          )}

          {step === 3 && !showClosing && !useAttitudeFillBlanks && isPhrasePuzzle && phrasePuzzle && (
            <m.div
              key="step3phrase"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-gray-200 mb-3">能交出去的報告，無非三件事：誰能動手、現場留下什麼、誰在怕。底下是能寫進去的用語——選你認為寫得上去的。</p>
              <div className="flex flex-wrap items-center gap-3 mb-2 text-xs text-gray-400">
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-amber-500/80" aria-hidden />
                  流程／體制
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-teal-500/80" aria-hidden />
                  證據／現場
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-rose-500/80" aria-hidden />
                  人／動機
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-3">第 {phraseStructureIndex + 1} 段／共 6 段</p>
              <div className="mb-6 p-5 rounded-xl border border-orange-500/25 bg-gray-800/40 min-h-[100px]">
                {(() => {
                  const structure = phrasePuzzle.structures[phraseStructureIndex];
                  if (!structure) return null;
                  const parts = structure.template.split(/(__\d+__)/g);
                  const fills = phraseFills[structure.id] ?? {};
                  return (
                    <p className="text-gray-200 text-base md:text-lg leading-relaxed">
                      {parts.map((part, i) => {
                        const match = part.match(/^__(\d+)__$/);
                        if (match) {
                          const slotIndex = Number(match[1]);
                          const slot = structure.slots[slotIndex];
                          if (!slot) return part;
                          const wordId = fills[slot.slotId];
                          const word = phrasePuzzle.wordBank.find((w) => w.id === wordId);
                          const isSelected = selectedPhraseSlot?.structureId === structure.id && selectedPhraseSlot?.slotId === slot.slotId;
                          return (
                            <button
                              key={`${structure.id}-${slot.slotId}`}
                              type="button"
                              onClick={() => handlePhraseSlotClick(structure.id, slot.slotId)}
                              className={`inline-block mx-0.5 px-2 py-1 rounded border-2 min-w-[4rem] text-center ${
                                isSelected
                                  ? 'border-orange-400 bg-orange-500/30 text-white'
                                  : wordId
                                    ? 'border-orange-500/40 bg-orange-500/15 text-orange-100'
                                    : 'border-dashed border-orange-500/40 bg-white/5 text-gray-500'
                              }`}
                            >
                              {word ? word.text : '⋯'}
                            </button>
                          );
                        }
                        return <span key={i}>{part}</span>;
                      })}
                    </p>
                  );
                })()}
              </div>
              <p className="text-gray-500 text-sm mb-2">報告用語（同一段裡每個只用一次）</p>
              <div className="flex flex-wrap gap-2">
                {(() => {
                  const structure = phrasePuzzle.structures[phraseStructureIndex];
                  const wordsToShow = structure?.candidateWordIds?.length
                    ? phrasePuzzle.wordBank.filter((w) => structure.candidateWordIds!.includes(w.id))
                    : phrasePuzzle.wordBank;
                  const currentStructureId = structure?.id;
                  const fillsThisSentence = phraseFills[currentStructureId ?? ''] ?? {};
                  const usedWordIds = new Set<string>(Object.values(fillsThisSentence));
                  const selectedSlotWord = selectedPhraseSlot?.structureId === currentStructureId
                    ? fillsThisSentence[selectedPhraseSlot.slotId]
                    : undefined;
                  return wordsToShow.map((w) => {
                    const used = usedWordIds.has(w.id) && selectedSlotWord !== w.id;
                  const color = PHRASE_CATEGORY_COLORS[w.category];
                  const colorClass =
                    color === 'amber'
                      ? 'border-amber-500/40 bg-amber-500/10 text-amber-200 hover:border-amber-400'
                      : color === 'teal'
                        ? 'border-teal-500/40 bg-teal-500/10 text-teal-200 hover:border-teal-400'
                        : 'border-rose-500/40 bg-rose-500/10 text-rose-200 hover:border-rose-400';
                  return (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => handlePhraseWordClick(w.id)}
                      disabled={used}
                      className={`px-3 py-2 rounded-lg border-2 text-sm transition ${colorClass} ${
                        used ? 'opacity-40 cursor-not-allowed line-through' : ''
                      }`}
                    >
                      {w.text}
                    </button>
                  );
                  });
                })()}
              </div>
              {attitudeError && <p className="text-red-400 text-sm mt-4">{attitudeError}</p>}
            </m.div>
          )}

          {step === 3 && !showClosing && !useAttitudeFillBlanks && !isPhrasePuzzle && (
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

          {step === 3 && showClosingView && (
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
        {step === 1 && (
          <button
            type="button"
            onClick={handleTimelineNext}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg"
          >
            下一頁
          </button>
        )}
        {step === 3 && !showClosing && !useAttitudeFillBlanks && isPhrasePuzzle && (
          <>
            {phraseStructureIndex > 0 ? (
              <button
                type="button"
                onClick={() => setPhraseStructureIndex((i) => i - 1)}
                className="px-4 py-2 text-gray-400 hover:text-white border border-gray-600 rounded-lg"
              >
                上一句
              </button>
            ) : (
              <span />
            )}
            {phraseStructureIndex < (phrasePuzzle?.structures.length ?? 0) - 1 ? (
              <button
                type="button"
                onClick={handlePhraseNext}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg"
              >
                下一句
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePhraseConfirm}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg"
              >
                確認
              </button>
            )}
          </>
        )}
        {step === 3 && !showClosing && !isPhrasePuzzle && (
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
    </>
  );
}
