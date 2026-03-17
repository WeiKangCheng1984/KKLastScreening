'use client';

/**
 * ReportFillBlank
 * 向劉隊回報：雙空格浮動填空元件
 *
 * 流程：空格1浮動選卡 → 確認 → KK旁白 → 空格2浮動選卡 → 確認 → 雙格對話 → onComplete
 * 設計原則：
 *   - 全屏覆蓋，偵探便條紙風格
 *   - 兩格順序填入（B1 確認後 B2 才啟動）
 *   - 填錯不封鎖，可繼續；填對顯示對應文案
 *   - 打散重排按鈕（每格獨立）
 */

import { useState, useCallback, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Shuffle, ChevronRight } from 'lucide-react';
import type { TwoBlankFillConfig, FloatingOption } from '@/components/FloatingFillBlankCore';

// ── 型別 ───────────────────────────────────────────────────────────

interface CardPosition {
  x: number;       // 0~1 比例
  y: number;
  rotation: number; // deg
}

interface ReportFillBlankProps {
  config: TwoBlankFillConfig;
  onComplete: (result: { blank1Correct: boolean; blank2Correct: boolean }) => void;
}

type FillStep =
  | 'blank1_idle'          // 空格1待選
  | 'blank1_pending'       // 空格1已選，等確認
  | 'blank1_reply'         // 空格1確認後，顯示旁白
  | 'blank2_idle'          // 空格2待選
  | 'blank2_pending'       // 空格2已選，等確認
  | 'both_correct_reply'   // 兩格皆對，顯示完整對話
  | 'wrong_reply'          // 任一格錯誤提示
  | 'done';                // 完成，顯示繼續按鈕

// ── 工具：隨機散佈不重疊座標 ──────────────────────────────────────

function generateScattered(count: number): CardPosition[] {
  const positions: CardPosition[] = [];
  const xMargin = 0.08;
  const yMin = 0.06;
  const yMax = 0.70;
  const minDist = 0.20;
  let tries = 0;

  while (positions.length < count && tries < 300) {
    tries++;
    const x = xMargin + Math.random() * (1 - xMargin * 2);
    const y = yMin + Math.random() * (yMax - yMin);
    const rotation = (Math.random() - 0.5) * 28;
    const ok = positions.every((p) => {
      const dx = p.x - x;
      const dy = p.y - y;
      return Math.sqrt(dx * dx + dy * dy) >= minDist;
    });
    if (ok) positions.push({ x, y, rotation });
  }
  // fallback：剩餘格均勻分配
  while (positions.length < count) {
    const i = positions.length;
    positions.push({ x: 0.15 + (i % 4) * 0.22, y: 0.12 + Math.floor(i / 4) * 0.25, rotation: (i % 3 - 1) * 8 });
  }
  return positions;
}

function initPositions(options: FloatingOption[]): CardPosition[] {
  return options.map((o, i) => ({
    x: o.x ?? 0.15 + (i % 4) * 0.22,
    y: o.y ?? 0.12 + Math.floor(i / 4) * 0.28,
    rotation: o.rotation ?? (i % 3 - 1) * 9,
  }));
}

// ── 主元件 ────────────────────────────────────────────────────────

export default function ReportFillBlank({ config, onComplete }: ReportFillBlankProps) {
  const { sentenceParts, blank1, blank2, bothCorrectDialogue, wrongFallback } = config;

  // 空格1
  const [b1Selected, setB1Selected] = useState<string | null>(null);
  const [b1Filled, setB1Filled]     = useState<string | null>(null); // 鎖定後填入的詞
  const [b1Correct, setB1Correct]   = useState(false);
  const [b1Positions, setB1Positions] = useState<CardPosition[]>(() => initPositions(blank1.options));

  // 空格2
  const [b2Selected, setB2Selected] = useState<string | null>(null);
  const [b2Filled, setB2Filled]     = useState<string | null>(null);
  const [b2Correct, setB2Correct]   = useState(false);
  const [b2Positions, setB2Positions] = useState<CardPosition[]>(() => initPositions(blank2.options));

  // 流程步驟
  const [step, setStep] = useState<FillStep>('blank1_idle');
  /** 特定錯誤選項觸發的專屬回饋（若存在則覆蓋 wrongFallback） */
  const [customWrongReply, setCustomWrongReply] = useState<string | null>(null);

  // 打散動畫控制
  const [shuffling1, setShuffling1] = useState(false);
  const [shuffling2, setShuffling2] = useState(false);
  const shuffle1Ref = useRef(false);
  const shuffle2Ref = useRef(false);

  // ── 空格1操作 ───────────────────────────────────────────────────

  const handleB1Select = useCallback((id: string) => {
    if (step !== 'blank1_idle' && step !== 'blank1_pending') return;
    setB1Selected(id);
    setStep('blank1_pending');
  }, [step]);

  const handleB1Confirm = useCallback(() => {
    // 第一格僅鎖定字詞，不立即判定正確與否；等第二格也填完再一起判斷
    if (!b1Selected) return;
    const opt = blank1.options.find((o) => o.id === b1Selected);
    const fill = opt?.fullText ?? b1Selected;
    setB1Filled(fill);
    // 先記下是否屬於正解集合，供之後整題一起評估
    setB1Correct(blank1.correctIds.includes(b1Selected));
    // 第一格確認後清空上一輪的錯誤回饋，避免殘留
    setCustomWrongReply(null);
    // 進入第二格填寫階段
    setStep('blank2_idle');
  }, [b1Selected, blank1]);

  // ── 空格2操作 ───────────────────────────────────────────────────

  const handleB2Select = useCallback((id: string) => {
    if (step !== 'blank2_idle' && step !== 'blank2_pending') return;
    setB2Selected(id);
    setStep('blank2_pending');
  }, [step]);

  const handleB2Confirm = useCallback(() => {
    // 第二格鎖定後，與第一格一起判定本題是否通過
    if (!b2Selected) return;
    const opt = blank2.options.find((o) => o.id === b2Selected);
    const fill = opt?.fullText ?? b2Selected;
    const thisCorrect = blank2.correctIds.includes(b2Selected);
    setB2Filled(fill);
    setB2Correct(thisCorrect);

    const bothCorrect = thisCorrect && b1Correct;
    if (bothCorrect) {
      setCustomWrongReply(null);
      setStep('both_correct_reply');
    } else {
      // 任一格錯誤：先看第二格是否有專屬回饋，否則回頭看第一格，最後用共用 wrongFallback
      const specific =
        (blank2.wrongRepliesByChoiceId && blank2.wrongRepliesByChoiceId[b2Selected]) ||
        (b1Selected && blank1.wrongRepliesByChoiceId && blank1.wrongRepliesByChoiceId[b1Selected]) ||
        null;
      setCustomWrongReply(specific);
      setStep('wrong_reply');
    }
  }, [b2Selected, blank2, b1Correct, b1Selected, blank1]);

  const handleAfterWholeReply = useCallback(() => {
    // 兩格一起判定後的後續行為
    if (b1Correct && b2Correct) {
      setStep('done');
    } else {
      // 任一格錯誤：整題重來，兩格都清空
      setB1Selected(null);
      setB1Filled(null);
      setB2Selected(null);
      setB2Filled(null);
      setB1Correct(false);
      setB2Correct(false);
      setCustomWrongReply(null);
      setStep('blank1_idle');
    }
  }, [b1Correct, b2Correct]);

  // ── 打散重排 ────────────────────────────────────────────────────

  const handleShuffle1 = useCallback(() => {
    if (shuffle1Ref.current) return;
    shuffle1Ref.current = true;
    setShuffling1(true);
    setB1Selected(null);
    setTimeout(() => {
      setB1Positions(generateScattered(blank1.options.length));
      setShuffling1(false);
      shuffle1Ref.current = false;
    }, 350);
  }, [blank1.options.length]);

  const handleShuffle2 = useCallback(() => {
    if (shuffle2Ref.current) return;
    shuffle2Ref.current = true;
    setShuffling2(true);
    setB2Selected(null);
    setTimeout(() => {
      setB2Positions(generateScattered(blank2.options.length));
      setShuffling2(false);
      shuffle2Ref.current = false;
    }, 350);
  }, [blank2.options.length]);

  // ── 句子渲染 ────────────────────────────────────────────────────

  const blankSlot = (text: string | null, active: boolean, filled: boolean) => (
    <span
      className={`inline-block min-w-[4rem] px-1.5 pb-0.5 mx-0.5 rounded transition-all duration-300 ${
        filled
          ? 'text-amber-300 border-b-2 border-amber-400 font-medium'
          : active
            ? 'text-amber-200/50 border-b-2 border-amber-400/60 animate-pulse'
            : 'text-stone-500/60 border-b border-stone-600/40'
      }`}
    >
      {text ?? (active ? '⋯⋯' : '　　')}
    </span>
  );

  const isB1Active = step === 'blank1_idle' || step === 'blank1_pending';
  const isB2Active = step === 'blank2_idle' || step === 'blank2_pending';

  // ── 浮動字詞卡 ──────────────────────────────────────────────────

  const renderCards = (
    options: FloatingOption[],
    positions: CardPosition[],
    selectedId: string | null,
    onSelect: (id: string) => void,
    active: boolean,
  ) => (
    <div className="relative w-full" style={{ height: '55vh' }}>
      {options.map((opt, i) => {
        const pos = positions[i] ?? { x: 0.5, y: 0.5, rotation: 0 };
        const isSelected = selectedId === opt.id;
        return (
          <m.button
            key={opt.id}
            type="button"
            onClick={() => active && onSelect(opt.id)}
            animate={{
              left: `${pos.x * 100}%`,
              top: `${pos.y * 100}%`,
              rotate: isSelected ? 0 : pos.rotation,
              scale: isSelected ? 1.1 : 1,
              y: isSelected ? -8 : [0, -(3 + (i % 3) * 1.5), 0],
            }}
            transition={{
              left: { type: 'spring', stiffness: 200, damping: 22 },
              top:  { type: 'spring', stiffness: 200, damping: 22 },
              y: isSelected
                ? { duration: 0.25 }
                : { duration: 3.2 + i * 0.4, repeat: Infinity, ease: 'easeInOut' },
              scale: { duration: 0.2 },
              rotate: { duration: 0.25 },
            }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 px-4 py-2.5 rounded-xl text-sm font-medium select-none cursor-pointer
              border transition-colors duration-200 shadow-md
              ${isSelected
                ? 'bg-stone-700/90 border-amber-400/60 text-amber-200 ring-1 ring-amber-400/40'
                : active
                  ? 'bg-stone-900/80 border-stone-700/50 text-stone-300/80 hover:border-amber-700/50 hover:text-stone-200'
                  : 'bg-stone-900/50 border-stone-800/40 text-stone-600/60 cursor-not-allowed'
              }`}
            disabled={!active}
          >
            {/* 左側標記條 */}
            <span
              className={`absolute left-1.5 top-2 bottom-2 w-0.5 rounded-full transition-colors duration-300 ${
                isSelected ? 'bg-emerald-400' : 'bg-amber-800/35'
              }`}
            />
            {opt.label}
          </m.button>
        );
      })}
    </div>
  );

  // ── 進度圓點 ────────────────────────────────────────────────────

  const progressDot = (filled: boolean, active: boolean) => (
    <span
      className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
        filled ? 'bg-amber-400' : active ? 'bg-amber-400/40 animate-pulse' : 'bg-stone-700'
      }`}
    />
  );

  // ── 回饋文字區 ──────────────────────────────────────────────────

  const showB1Card  = step === 'blank1_idle' || step === 'blank1_pending';
  const showB2Card  = step === 'blank2_idle' || step === 'blank2_pending';
  const showReply   = step === 'both_correct_reply' || step === 'wrong_reply' || step === 'done';

  const replyText = (() => {
    if (step === 'both_correct_reply') return blank2.replyOnCorrect;
    if (step === 'wrong_reply')        return customWrongReply ?? wrongFallback;
    return '';
  })();

  return (
    <div className="fixed inset-0 z-[85] flex flex-col items-center justify-start overflow-hidden">
      {/* 背景 */}
      <div
        className="absolute inset-0 bg-black/85"
        style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(27,16,6,0.95) 0%, rgba(8,8,8,0.97) 100%)' }}
      />
      {/* 中央溫暖光 */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 25%, rgba(150,90,15,0.06) 0%, transparent 70%)' }} />

      <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col items-center pt-6 px-4 gap-4">

        {/* ── 句子卡片 ── */}
        <m.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-stone-900/85 border border-amber-800/40 rounded-2xl px-6 py-5 shadow-xl"
        >
          {/* 提示標籤 */}
          <p className="text-xs text-stone-500 mb-3 tracking-wide">
            {showB1Card ? blank1.hintLabel : showB2Card ? blank2.hintLabel : '⋯⋯'}
          </p>

          {/* 句子 */}
          <p className="text-stone-200 text-base leading-relaxed whitespace-pre-wrap">
            {sentenceParts[0]}
            {blankSlot(b1Filled, isB1Active, !!b1Filled)}
            {sentenceParts[1]}
            {blankSlot(b2Filled, isB2Active, !!b2Filled)}
            {sentenceParts[2]}
          </p>

          {/* 進度圓點 */}
          <div className="flex items-center gap-2 mt-4">
            {progressDot(!!b1Filled, isB1Active)}
            {progressDot(!!b2Filled, isB2Active)}
            {progressDot(step === 'done', false)}
            <span className="text-xs text-stone-600 ml-1">
              {step === 'done'
                ? '完成'
                : isB1Active
                  ? '先選第一個字詞'
                  : isB2Active
                    ? '再選第二個字詞'
                    : '⋯⋯按送出一起判定'}
            </span>
          </div>
        </m.div>

        {/* ── 回饋文字（旁白 / 劉隊對話）與完成時的繼續鈕 ── */}
        <AnimatePresence mode="wait">
          {showReply && (replyText || step === 'done') && (
            <m.div
              key={step}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full bg-stone-900/60 border border-stone-700/30 rounded-xl px-5 py-4"
            >
              {step === 'done' ? (
                <div className="flex flex-col items-center gap-3">
                  <p className="text-amber-300/80 text-sm">本題完成。</p>
                  <button
                    type="button"
                    onClick={() => onComplete({ blank1Correct: b1Correct, blank2Correct: b2Correct })}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-sm font-medium transition-all"
                  >
                    繼續 <ChevronRight size={15} />
                  </button>
                </div>
              ) : step === 'both_correct_reply' ? (
                <div className="space-y-2">
                  <p className="text-amber-300/90 text-sm italic leading-relaxed">
                    KK：「{bothCorrectDialogue.kk}」
                  </p>
                  <p className="text-stone-300/80 text-sm leading-relaxed">
                    劉隊：「{bothCorrectDialogue.liu}」
                  </p>
                </div>
              ) : (
                <p className={`text-sm leading-relaxed italic ${
                  step === 'wrong_reply' ? 'text-stone-400/70' : 'text-amber-300/80'
                }`}>
                  {replyText}
                </p>
              )}

              {/* 繼續按鈕（step === 'done' 的繼續鈕已在上方區塊顯示） */}
              {step !== 'done' && (
              <div className="flex justify-end mt-3">
                {step === 'both_correct_reply' ? (
                  <button
                    type="button"
                    onClick={() => setStep('done')}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-sm font-medium transition-all"
                  >
                    確認 <ChevronRight size={15} />
                  </button>
                ) : (
                  // wrong_reply：整題重來
                  <button
                    type="button"
                    onClick={handleAfterWholeReply}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-stone-700/50 hover:bg-stone-700/70 border border-stone-600/40 text-stone-400 text-sm transition-all"
                  >
                    再想想 <ChevronRight size={15} />
                  </button>
                )}
              </div>
              )}
            </m.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── 浮動字詞卡區（全屏下半部） ── */}
      <AnimatePresence mode="wait">
        {showB1Card && (
          <m.div
            key="pool-b1"
            initial={{ opacity: 0 }}
            animate={{ opacity: shuffling1 ? 0.3 : 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
            style={{ top: '42%' }}
          >
            <div className="relative w-full h-full pointer-events-auto">
              {renderCards(blank1.options, b1Positions, b1Selected, handleB1Select, true)}
            </div>
          </m.div>
        )}

        {showB2Card && (
          <m.div
            key="pool-b2"
            initial={{ opacity: 0 }}
            animate={{ opacity: shuffling2 ? 0.3 : 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
            style={{ top: '42%' }}
          >
            <div className="relative w-full h-full pointer-events-auto">
              {renderCards(blank2.options, b2Positions, b2Selected, handleB2Select, true)}
            </div>
          </m.div>
        )}
      </AnimatePresence>

      {/* ── 底部操作列 ── */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center gap-3 z-20 px-4">
        {/* 打散重排 */}
        {showB1Card && (
          <m.button
            type="button"
            onClick={handleShuffle1}
            animate={shuffling1 ? { x: [-6, 6, -5, 5, -3, 3, 0] } : {}}
            transition={{ duration: 0.35 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-stone-800/70 hover:bg-stone-700/70 border border-stone-600/40 text-stone-400 text-xs transition-all"
          >
            <m.span animate={shuffling1 ? { rotate: [0, 180, 360] } : {}} transition={{ duration: 0.35 }}>
              <Shuffle size={13} />
            </m.span>
            打散重排
          </m.button>
        )}

        {showB2Card && (
          <m.button
            type="button"
            onClick={handleShuffle2}
            animate={shuffling2 ? { x: [-6, 6, -5, 5, -3, 3, 0] } : {}}
            transition={{ duration: 0.35 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-stone-800/70 hover:bg-stone-700/70 border border-stone-600/40 text-stone-400 text-xs transition-all"
          >
            <m.span animate={shuffling2 ? { rotate: [0, 180, 360] } : {}} transition={{ duration: 0.35 }}>
              <Shuffle size={13} />
            </m.span>
            打散重排
          </m.button>
        )}

        {/* 確認填入 */}
        {(step === 'blank1_pending' || step === 'blank2_pending') && (
          <m.button
            type="button"
            onClick={step === 'blank1_pending' ? handleB1Confirm : handleB2Confirm}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-200 text-xs font-medium transition-all"
          >
            確認填入 <ChevronRight size={13} />
          </m.button>
        )}
      </div>
    </div>
  );
}
