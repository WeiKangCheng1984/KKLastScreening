'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { X, Sparkles, Shuffle, ChevronRight } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import {
  evaluateSelection,
  type FillBlankConfig,
} from '@/components/FloatingFillBlankCore';

type ChapterId = 'ch1' | 'ch2' | string;

interface CardPosition {
  x: number;       // 0–1 比例座標
  y: number;
  rotation: number; // deg
}

// ── 資料 ───────────────────────────────────────────────────────────

const CH1_TEST_CONFIG: FillBlankConfig = {
  title: '第一章',
  sentencePrefix:
    '「流程上有疏漏」很方便。\n可如果有人刻意把黑暗延長——\n那三分鐘留下的不是浪漫，是一個 ',
  sentenceSuffix: ' 。',
  options: [
    { id: 'ch1_A', label: '空窗',    fullText: '空窗',    x: 0.22, y: 0.22, rotation: -10 },
    { id: 'ch1_B', label: '結局',    fullText: '結局',    x: 0.44, y: 0.15, rotation:   8 },
    { id: 'ch1_C', label: '座位號碼', fullText: '座位號碼', x: 0.65, y: 0.20, rotation:  -6 },
    { id: 'ch1_D', label: '服務調整', fullText: '服務調整', x: 0.82, y: 0.28, rotation:   7 },
    { id: 'ch1_E', label: '證據袋',  fullText: '證據袋',  x: 0.28, y: 0.40, rotation:   4 },
    { id: 'ch1_F', label: '清潔備忘', fullText: '清潔備忘', x: 0.72, y: 0.38, rotation: -12 },
    { id: 'ch1_G', label: '求救',    fullText: '求救',    x: 0.52, y: 0.50, rotation:  10 },
  ],
  correctIds: ['ch1_A'],
  replyByChoiceId: {
    ch1_A: '你點點頭。\n\n黑暗不是背景。\n它是被允許的窗口。',
  },
  wrongFallback: '「這個詞也許很像線索，但它不是那種會害死人、也不會被寫進報告的那種。」',
};

// ── Ch3：整理版讓你停在哪裡 ──────────────────────────────────────

const CH3_CONFIG: FillBlankConfig = {
  title: '第三章',
  sentencePrefix:
    '整理版的目的，\n不是讓資料更好讀，\n而是讓那些多餘的欄位\n剛好',
  sentenceSuffix: '地消失。',
  options: [
    { id: 'ch3_A', label: '自然',     fullText: '自然',     x: 0.20, y: 0.18, rotation:  -9 },
    { id: 'ch3_B', label: '徹底',     fullText: '徹底',     x: 0.48, y: 0.13, rotation:   7 },
    { id: 'ch3_C', label: '安靜',     fullText: '安靜',     x: 0.74, y: 0.20, rotation:  -5 },
    { id: 'ch3_D', label: '完整',     fullText: '完整',     x: 0.30, y: 0.34, rotation:  11 },
    { id: 'ch3_E', label: '精準',     fullText: '精準',     x: 0.60, y: 0.30, rotation:  -8 },
    { id: 'ch3_F', label: '合理',     fullText: '合理',     x: 0.84, y: 0.36, rotation:   5 },
    { id: 'ch3_G', label: '乾淨',     fullText: '乾淨',     x: 0.44, y: 0.48, rotation: -12 },
  ],
  correctIds: ['ch3_A'],
  replyByChoiceId: {
    ch3_A:
      '那就是整理版最高明的地方。\n\n它讓刪除看起來像選擇，\n讓隱藏看起來像分類。\n\n「自然地消失」的欄位，\n才是最不容易被追回來的那種。',
  },
  wrongFallback:
    '「再想想，」KK 在心裡說，「是什麼讓人不會去追那些消失的欄位？」',
};

// ── Ch4：三分鐘的黑是什麼 ─────────────────────────────────────────

const CH4_CONFIG: FillBlankConfig = {
  title: '第四章',
  sentencePrefix:
    '那三分鐘的黑，\n不是節能燈的誤觸，\n不是設備老化，\n也不是流程疏漏。\n\n它是一個',
  sentenceSuffix: '。',
  options: [
    { id: 'ch4_A', label: '測試',     fullText: '測試',     x: 0.22, y: 0.16, rotation:  -8 },
    { id: 'ch4_B', label: '意外',     fullText: '意外',     x: 0.46, y: 0.12, rotation:   6 },
    { id: 'ch4_C', label: '巧合',     fullText: '巧合',     x: 0.70, y: 0.18, rotation: -10 },
    { id: 'ch4_D', label: '故障',     fullText: '故障',     x: 0.82, y: 0.30, rotation:   9 },
    { id: 'ch4_E', label: '節能指令', fullText: '節能指令', x: 0.28, y: 0.36, rotation:   4 },
    { id: 'ch4_F', label: '操作失誤', fullText: '操作失誤', x: 0.60, y: 0.38, rotation: -13 },
    { id: 'ch4_G', label: '警告',     fullText: '警告',     x: 0.44, y: 0.50, rotation:  10 },
  ],
  correctIds: ['ch4_A'],
  replyByChoiceId: {
    ch4_A:
      'KK 看著樓梯間的監視器死角。\n\n人群踩上去，燈滅了，混亂出現了。\n不是事故。\n是一次有控制條件的測試——\n\n用真實的人作樣本。',
  },
  wrongFallback:
    '「差一點，」KK 想，「差一點就是只看到表面。這不是意外，它太剛好了。」',
};

// ── Ch5：高文傑的紀錄是什麼 ──────────────────────────────────────

const CH5_CONFIG: FillBlankConfig = {
  title: '第五章',
  sentencePrefix:
    '高文傑的每一筆登入，\n都剛好出現在最需要它出現的位置。\n\n完整到，反而讓 KK 停了一秒：\n這是一份紀錄，\n還是一份',
  sentenceSuffix: '？',
  options: [
    { id: 'ch5_A', label: '說明書',   fullText: '說明書',   x: 0.22, y: 0.20, rotation:  -7 },
    { id: 'ch5_B', label: '紀錄',     fullText: '紀錄',     x: 0.46, y: 0.14, rotation:   9 },
    { id: 'ch5_C', label: '罪證',     fullText: '罪證',     x: 0.70, y: 0.20, rotation:  -5 },
    { id: 'ch5_D', label: '佈局',     fullText: '佈局',     x: 0.30, y: 0.36, rotation:  11 },
    { id: 'ch5_E', label: '誤導',     fullText: '誤導',     x: 0.60, y: 0.32, rotation:  -9 },
    { id: 'ch5_F', label: '陷阱',     fullText: '陷阱',     x: 0.83, y: 0.34, rotation:   6 },
    { id: 'ch5_G', label: '答案',     fullText: '答案',     x: 0.48, y: 0.50, rotation: -12 },
  ],
  correctIds: ['ch5_A'],
  replyByChoiceId: {
    ch5_A:
      'KK 想起阿蘇說的：\n「登入紀錄只證明帳號在場，不保證靈魂也在場。」\n\n太完整的說明書，不是清白，\n是有人希望你這樣讀它。',
  },
  wrongFallback:
    '「阿蘇說過，帳號在場不代表靈魂在場。」\n\n這份資料不是給你查案用的，它是給你收案用的。',
};

// ── Ch6：發言稿刪掉了什麼 ────────────────────────────────────────

const CH6_CONFIG: FillBlankConfig = {
  title: '第六章',
  sentencePrefix:
    '張景衡修改過的發言稿，\n刪掉了操作者的名字，\n讓那起事故\n從「有人',
  sentenceSuffix: '」\n變成「系統本來就這樣」。',
  options: [
    { id: 'ch6_A', label: '這樣做了', fullText: '這樣做了', x: 0.22, y: 0.18, rotation:  -8 },
    { id: 'ch6_B', label: '下了指令', fullText: '下了指令', x: 0.50, y: 0.12, rotation:   7 },
    { id: 'ch6_C', label: '調整了設定', fullText: '調整了設定', x: 0.76, y: 0.20, rotation:  -6 },
    { id: 'ch6_D', label: '介入了系統', fullText: '介入了系統', x: 0.28, y: 0.36, rotation:  10 },
    { id: 'ch6_E', label: '發出命令', fullText: '發出命令', x: 0.60, y: 0.30, rotation: -11 },
    { id: 'ch6_F', label: '打開了入口', fullText: '打開了入口', x: 0.84, y: 0.38, rotation:   5 },
    { id: 'ch6_G', label: '讓它發生', fullText: '讓它發生', x: 0.44, y: 0.50, rotation: -10 },
  ],
  correctIds: ['ch6_A'],
  replyByChoiceId: {
    ch6_A:
      '就是這個字。\n\n「有人這樣做了」和「系統本來就這樣」——\n兩句話之間，是一個人的責任。\n\n張景衡刪掉的是主詞，\n也是追查的起點。',
  },
  wrongFallback:
    '「差一點，」KK 想，「那個詞太技術性了，反而讓人漏看了最關鍵的字。」',
};

// ── 依章節取設定 ──────────────────────────────────────────────────

function getConfigForChapter(
  chapterId: ChapterId,
  ch2Configs?: Record<string, FillBlankConfig>,
): FillBlankConfig {
  if (chapterId === 'ch2' && ch2Configs?.q1) {
    const q = ch2Configs.q1;
    return {
      sentencePrefix: q.sentencePrefix,
      sentenceSuffix: q.sentenceSuffix,
      options: q.options,
      correctIds: q.correctIds,
      replyByChoiceId: q.replyByChoiceId,
      wrongFallback: q.wrongFallback,
    };
  }
  if (chapterId === 'ch3') return CH3_CONFIG;
  if (chapterId === 'ch4') return CH4_CONFIG;
  if (chapterId === 'ch5') return CH5_CONFIG;
  if (chapterId === 'ch6') return CH6_CONFIG;
  return CH1_TEST_CONFIG;
}

// ── 隨機散佈座標（帶最小間距防重疊） ─────────────────────────────

function generateScatteredPositions(count: number): CardPosition[] {
  const positions: CardPosition[] = [];
  const xMargin = 0.1;
  const yMin = 0.08;
  const yMax = 0.72;
  const minDist = 0.19;

  for (let i = 0; i < count; i++) {
    let attempts = 0;
    let c: CardPosition = { x: 0.5, y: 0.4, rotation: 0 };
    do {
      c = {
        x: xMargin + Math.random() * (1 - xMargin * 2),
        y: yMin + Math.random() * (yMax - yMin),
        rotation: (Math.random() - 0.5) * 30,
      };
      attempts++;
    } while (
      attempts < 40 &&
      positions.some(p => Math.hypot(p.x - c.x, p.y - c.y) < minDist)
    );
    positions.push(c);
  }

  return positions;
}

// ── 句子顯示（填入詞高亮） ─────────────────────────────────────────

function SentenceDisplay({
  config,
  selectedId,
  showHighlight,
}: {
  config: FillBlankConfig;
  selectedId: string | null;
  showHighlight: boolean;
}) {
  const selected = config.options.find(o => o.id === selectedId);
  return (
    <span className="whitespace-pre-wrap leading-[1.95]">
      {config.sentencePrefix}
      {selected ? (
        <m.span
          key={selected.id}
          initial={{ opacity: 0.3, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.22 }}
          className={`
            font-semibold underline decoration-2 underline-offset-4
            transition-colors duration-500
            ${showHighlight ? 'text-amber-300 decoration-amber-400' : 'text-amber-200/90 decoration-amber-600/50'}
          `}
        >
          {selected.fullText}
        </m.span>
      ) : (
        <span className="text-amber-600/40 italic tracking-widest">＿＿</span>
      )}
      {config.sentenceSuffix}
    </span>
  );
}

// ── 主元件 ─────────────────────────────────────────────────────────

export default function TestFloatingFillBlank({
  chapterId,
  onClose,
  ch2QuestionConfigs,
}: {
  chapterId: ChapterId;
  onClose: () => void;
  ch2QuestionConfigs?: Record<string, FillBlankConfig>;
}) {
  const cfg = useMemo(
    () => getConfigForChapter(chapterId, ch2QuestionConfigs),
    [chapterId, ch2QuestionConfigs],
  );

  const [selectedId, setSelectedId]   = useState<string | null>(null);
  const [feedback, setFeedback]       = useState<string | null>(null);
  const [passed, setPassed]           = useState(false);
  const [showHighlight, setShowHighlight] = useState(false);
  const [confirmed, setConfirmed]     = useState(false);
  // 散佈位置（可被打散重排覆蓋）
  const [positions, setPositions]     = useState<CardPosition[]>(
    () => cfg.options.map(o => ({ x: o.x ?? 0.5, y: o.y ?? 0.5, rotation: o.rotation ?? 0 }))
  );
  const [isShaking, setIsShaking]     = useState(false);

  // cfg 改變時同步重置位置
  useEffect(() => {
    setPositions(cfg.options.map(o => ({ x: o.x ?? 0.5, y: o.y ?? 0.5, rotation: o.rotation ?? 0 })));
  }, [cfg]);

  // 選取後短暫高亮
  useEffect(() => {
    if (!selectedId) { setShowHighlight(false); return; }
    setShowHighlight(true);
    const t = setTimeout(() => setShowHighlight(false), 700);
    return () => clearTimeout(t);
  }, [selectedId]);

  const handleSelect = (id: string) => {
    if (confirmed) return;
    setSelectedId(id);
    setFeedback(null);
    setPassed(false);
  };

  // 打散重排：搖晃 + 立即飛往新位置
  const shuffle = useCallback(() => {
    if (confirmed || isShaking) return;
    setIsShaking(true);
    setSelectedId(null);
    setFeedback(null);
    setPassed(false);
    setPositions(generateScatteredPositions(cfg.options.length));
    setTimeout(() => setIsShaking(false), 500);
  }, [confirmed, isShaking, cfg.options.length]);

  const confirm = () => {
    if (!selectedId) return;
    const evalResult = evaluateSelection(cfg, selectedId);
    if (!evalResult.hasSelection) return;
    setConfirmed(true);
    setTimeout(() => {
      setConfirmed(false);
      setPassed(evalResult.isCorrect);
      setFeedback(evalResult.isCorrect ? (evalResult.feedback ?? '好。') : evalResult.feedback);
    }, 480);
  };

  const reset = () => {
    setSelectedId(null);
    setFeedback(null);
    setPassed(false);
    setConfirmed(false);
  };

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/80 backdrop-blur-[6px] p-3 md:p-5">
      <m.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[min(95vw,1020px)]"
      >
        {/* 主卡片 */}
        <div
          className="rounded-2xl border border-white/[0.07] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.9)]"
          style={{ background: 'linear-gradient(160deg, #111008 0%, #0c0c0c 100%)' }}
        >

          {/* ── 頂部標題列 ── */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.05]">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-amber-500/12 border border-amber-500/20 flex items-center justify-center shrink-0">
                <Sparkles size={12} className="text-amber-400" />
              </div>
              <div className="leading-none">
                <span className="text-sm font-semibold text-white/80 tracking-wide">浮動字詞填空</span>
                {cfg.title && (
                  <span className="ml-2 text-xs text-white/25">{cfg.title}</span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-white/25 hover:text-white/60 transition-colors p-1.5 hover:bg-white/6 rounded-lg"
              aria-label="關閉"
            >
              <X size={16} />
            </button>
          </div>

          {/* ── 主體 ── */}
          <div className="p-4 md:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-5">

              {/* ── 左欄：句子 + 操作 ── */}
              <div className="flex flex-col gap-3">

                {/* 步驟指示 */}
                <div className="flex items-center gap-2 select-none">
                  {([
                    { n: 1, label: '選擇字詞',  active: !!selectedId, done: !!selectedId },
                    { n: 2, label: '確認填空', active: !!feedback,   done: passed },
                  ] as const).map((step, i) => (
                    <>
                      {i > 0 && <ChevronRight key={`arr-${step.n}`} size={10} className="text-white/12 shrink-0" />}
                      <div
                        key={step.n}
                        className={`flex items-center gap-1.5 text-xs transition-colors duration-300 ${
                          step.done ? 'text-emerald-300/80' : step.active ? 'text-amber-300/80' : 'text-white/20'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[10px] border transition-all duration-300 ${
                            step.done
                              ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300'
                              : step.active
                              ? 'bg-amber-500/15 border-amber-500/35 text-amber-300'
                              : 'bg-white/4 border-white/12 text-white/25'
                          }`}
                        >
                          {step.n}
                        </div>
                        {step.label}
                      </div>
                    </>
                  ))}
                </div>

                {/* 筆記本式句子框 */}
                <div className="relative rounded-xl border border-amber-900/20 overflow-hidden flex-1"
                  style={{ background: 'linear-gradient(180deg, #141008 0%, #100e07 100%)' }}
                >
                  {/* 橫線紋路 */}
                  <div className="absolute inset-0 opacity-[0.032] pointer-events-none"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, #d97706 27px, #d97706 28px)',
                      backgroundPosition: '0 16px',
                    }}
                  />
                  {/* 左側紅線 */}
                  <div className="absolute left-8 top-0 bottom-0 w-px bg-red-700/10 pointer-events-none" />
                  <p className="relative px-5 py-4 text-sm text-white/65 leading-[1.9] pl-10">
                    <SentenceDisplay config={cfg} selectedId={selectedId} showHighlight={showHighlight} />
                  </p>
                </div>

                {/* 操作按鈕列 */}
                <div className="flex items-center gap-2 pt-0.5">
                  <m.button
                    type="button"
                    onClick={confirm}
                    disabled={!selectedId || confirmed}
                    whileTap={selectedId && !confirmed ? { scale: 0.94 } : undefined}
                    className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 active:bg-amber-300 text-stone-950 text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
                  >
                    確認填空
                  </m.button>
                  <button
                    type="button"
                    onClick={reset}
                    className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/9 border border-white/7 hover:border-white/12 text-white/40 hover:text-white/70 text-sm transition-all duration-150"
                  >
                    重置
                  </button>
                  <AnimatePresence>
                    {passed && (
                      <m.div
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-emerald-300/90"
                      >
                        <div className="w-4 h-4 rounded-full bg-emerald-500/15 border border-emerald-500/35 flex items-center justify-center text-[9px]">✓</div>
                        過關
                      </m.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 回饋訊息 */}
                <AnimatePresence>
                  {feedback && (
                    <m.div
                      initial={{ opacity: 0, y: 4, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.28 }}
                      className={`rounded-xl border px-4 py-3.5 text-sm whitespace-pre-wrap leading-[1.75] overflow-hidden ${
                        passed
                          ? 'border-emerald-700/25 bg-emerald-950/35 text-emerald-100/80'
                          : 'border-amber-800/25 bg-amber-950/35 text-amber-100/75'
                      }`}
                    >
                      {feedback}
                    </m.div>
                  )}
                </AnimatePresence>

              </div>

              {/* ── 右欄：浮動字詞區 ── */}
              <div className="flex flex-col gap-2.5">

                {/* 字詞飄浮容器 */}
                <div
                  className="relative w-full aspect-square rounded-2xl border border-white/[0.06] overflow-hidden"
                  style={{
                    background: 'radial-gradient(ellipse at 50% 38%, #1b1006 0%, #080808 68%)',
                  }}
                >
                  {/* 氛圍：中心暖暈 */}
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'radial-gradient(circle at 50% 42%, rgba(150,90,15,0.065) 0%, transparent 58%)' }}
                  />
                  {/* 氛圍：暗角 */}
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.65) 100%)' }}
                  />

                  {/* 搖晃容器（全部卡片一起晃） */}
                  <m.div
                    className="absolute inset-0 pointer-events-none"
                    animate={isShaking ? { x: [-10, 10, -8, 8, -5, 5, -2, 2, 0] } : { x: 0 }}
                    transition={{ duration: 0.46, ease: 'easeOut' }}
                  >
                    {cfg.options.map((opt, index) => {
                      const pos = positions[index] ?? {
                        x: opt.x ?? 0.5, y: opt.y ?? 0.5, rotation: opt.rotation ?? 0,
                      };
                      const isSelected = selectedId === opt.id;
                      const rot = pos.rotation;

                      return (
                        /* 位置用 m.div：left/top 做 spring 動畫 */
                        <m.div
                          key={opt.id}
                          className="absolute pointer-events-none"
                          animate={{
                            left: `${pos.x * 100}%`,
                            top:  `${pos.y * 100}%`,
                          }}
                          style={{ translateX: '-50%', translateY: '-50%' }}
                          transition={{ type: 'spring', stiffness: 190, damping: 20, mass: 0.85 }}
                        >
                          {/* 浮動 + 選取 + 確認收斂 動畫 */}
                          <m.button
                            type="button"
                            className="pointer-events-auto origin-center cursor-pointer"
                            animate={
                              confirmed
                                ? isSelected
                                  ? { scale: 1.32, opacity: 0, rotate: 0 }
                                  : { scale: 0.65, opacity: 0, rotate: rot }
                                : isSelected
                                ? { y: -8, rotate: 0, scale: 1.1 }
                                : {
                                    y: [0, -(4 + (index % 3) * 1.5), 0],
                                    rotate: rot,
                                    scale: 1,
                                  }
                            }
                            transition={
                              confirmed
                                ? { duration: 0.38, ease: 'easeOut' }
                                : isSelected
                                ? { duration: 0.26, ease: [0.22, 1, 0.36, 1] }
                                : {
                                    y:      { repeat: Infinity, duration: 3.4 + index * 0.5, ease: 'easeInOut' },
                                    rotate: { duration: 0.3 },
                                    scale:  { duration: 0.2 },
                                  }
                            }
                            onClick={e => { e.stopPropagation(); handleSelect(opt.id); }}
                          >
                            {/* 便條紙卡片 */}
                            <div className={`
                              relative flex items-center
                              pl-3.5 pr-3 py-1.5 rounded-lg text-xs md:text-sm font-medium
                              border shadow-[2px_4px_14px_rgba(0,0,0,0.75)]
                              backdrop-blur-sm transition-colors duration-200
                              ${isSelected
                                ? 'bg-stone-700/90 border-amber-500/45 ring-1 ring-amber-400/30 shadow-amber-900/30'
                                : 'bg-stone-900/80 border-stone-700/40 hover:bg-stone-800/80 hover:border-stone-600/50'}
                            `}>
                              {/* 左側豎線（便條痕） */}
                              <div className={`absolute left-1 top-1.5 bottom-1.5 w-0.5 rounded-full transition-colors duration-300 ${
                                isSelected ? 'bg-emerald-400' : 'bg-amber-800/35'
                              }`} />
                              <span className={`block max-w-[145px] text-left break-keep leading-snug transition-colors duration-200 ${
                                isSelected ? 'text-amber-100' : 'text-stone-300/75'
                              }`}>
                                {opt.label}
                              </span>
                            </div>
                          </m.button>
                        </m.div>
                      );
                    })}
                  </m.div>
                </div>

                {/* 底部控制列 */}
                <div className="flex items-center justify-between px-0.5">
                  <p className="text-xs text-white/18 select-none">點選字詞 → 確認填空</p>

                  {/* 打散重排按鈕 */}
                  <m.button
                    type="button"
                    onClick={shuffle}
                    disabled={confirmed}
                    whileHover={!confirmed ? { scale: 1.03 } : undefined}
                    whileTap={!confirmed ? { scale: 0.92 } : undefined}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed
                      bg-stone-900/50 border-stone-700/35 text-stone-400/60
                      hover:bg-stone-800/60 hover:border-amber-900/40 hover:text-amber-300/70"
                  >
                    <m.span
                      animate={isShaking ? { rotate: [0, 180, 360] } : { rotate: 0 }}
                      transition={{ duration: 0.46 }}
                      className="flex items-center"
                    >
                      <Shuffle size={11} />
                    </m.span>
                    打散重排
                  </m.button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </m.div>
    </div>
  );
}
