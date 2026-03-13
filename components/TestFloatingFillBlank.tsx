'use client';

import { useMemo, useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import {
  buildFilledSentence,
  evaluateSelection,
  type FillBlankConfig,
  type FloatingOption,
} from '@/components/FloatingFillBlankCore';

type ChapterId = 'ch1' | 'ch2' | string;
 
 const CH1_TEST_CONFIG: FillBlankConfig = {
   title: '第一章（測試題）',
   sentencePrefix:
     '「流程上有疏漏」很方便。\n可如果有人刻意把黑暗延長——\n那三分鐘留下的不是浪漫，是一個 ',
   sentenceSuffix: ' 。',
   options: [
     { id: 'ch1_A', label: '空窗', fullText: '空窗', x: 0.22, y: 0.26, rotation: -10 },
     { id: 'ch1_B', label: '結局', fullText: '結局', x: 0.42, y: 0.18, rotation: 8 },
     { id: 'ch1_C', label: '座位號碼', fullText: '座位號碼', x: 0.62, y: 0.2, rotation: -6 },
     { id: 'ch1_D', label: '服務調整', fullText: '服務調整', x: 0.8, y: 0.26, rotation: 7 },
     { id: 'ch1_E', label: '證據袋', fullText: '證據袋', x: 0.3, y: 0.38, rotation: 4 },
     { id: 'ch1_F', label: '清潔備忘', fullText: '清潔備忘', x: 0.7, y: 0.36, rotation: -12 },
     { id: 'ch1_G', label: '求救', fullText: '求救', x: 0.86, y: 0.4, rotation: 10 },
   ],
   correctIds: ['ch1_A'],
   replyByChoiceId: {
     ch1_A: '你點點頭。\n\n黑暗不是背景。\n它是被允許的窗口。',
   },
   wrongFallback: '「這個詞也許很像線索，但它不是那種會害死人、也不會被寫進報告的那種。」',
 };
 
 function getConfigForChapter(chapterId: ChapterId, ch2Configs?: Record<string, FillBlankConfig>): FillBlankConfig {
   if (chapterId === 'ch2' && ch2Configs) {
     // 第二章沿用 q1（記事本那句）與其浮動卡位置
     const q = ch2Configs.q1;
     if (q) {
       return {
         sentencePrefix: q.sentencePrefix,
         sentenceSuffix: q.sentenceSuffix,
         options: q.options,
         correctIds: q.correctIds,
         replyByChoiceId: q.replyByChoiceId,
         wrongFallback: q.wrongFallback,
       };
     }
   }
   return CH1_TEST_CONFIG;
 }
 
 export default function TestFloatingFillBlank({
   chapterId,
   onClose,
   ch2QuestionConfigs,
 }: {
   chapterId: ChapterId;
   onClose: () => void;
   ch2QuestionConfigs?: Record<string, FillBlankConfig>;
 }) {
   const cfg = useMemo(() => getConfigForChapter(chapterId, ch2QuestionConfigs), [chapterId, ch2QuestionConfigs]);
   const [selectedId, setSelectedId] = useState<string | null>(null);
   const [feedback, setFeedback] = useState<string | null>(null);
   const [passed, setPassed] = useState(false);
 
  const sentence = useMemo(
    () => buildFilledSentence(cfg, selectedId, '＿＿＿＿'),
    [cfg, selectedId],
  );
 
   const confirm = () => {
     if (!selectedId) return;
    const evalResult = evaluateSelection(cfg, selectedId);
    if (!evalResult.hasSelection) return;
    if (!evalResult.isCorrect) {
      setPassed(false);
      setFeedback(evalResult.feedback);
      return;
    }
    setPassed(true);
    setFeedback(evalResult.feedback ?? '好。');
   };
 
   return (
     <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
       <div className="w-full max-w-[min(92vw,980px)]">
         <div className="rounded-2xl border border-amber-500/25 bg-gradient-to-br from-slate-950/95 via-slate-900/95 to-slate-950/95 shadow-2xl overflow-hidden">
           <div className="flex items-center justify-between px-5 py-4 border-b border-amber-500/20">
             <div className="min-w-0">
               <div className="flex items-center gap-2">
                 <Sparkles size={18} className="text-amber-300" />
                 <h2 className="text-base md:text-lg font-semibold text-amber-100">
                   浮動字詞填空（測試）
                 </h2>
               </div>
               <p className="text-xs text-amber-100/70 mt-1">
                 {cfg.title}｜不綁觸發條件，隨時可測試過關
               </p>
             </div>
             <button
               type="button"
               onClick={onClose}
               className="text-gray-300 hover:text-white transition-colors p-2 hover:bg-white/10 rounded"
               aria-label="關閉"
             >
               <X size={22} />
             </button>
           </div>
 
           <div className="p-5 md:p-6">
             <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
               <div className="lg:col-span-2 rounded-xl border border-white/10 bg-white/5 p-4">
                 <div className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
                   {sentence}
                 </div>
 
                 <div className="mt-4 flex items-center gap-2">
                   <button
                     type="button"
                     onClick={confirm}
                     disabled={!selectedId}
                     className="px-3 py-2 rounded-lg bg-amber-500/90 hover:bg-amber-500 text-gray-950 text-sm font-semibold disabled:opacity-40 disabled:hover:bg-amber-500/90"
                   >
                     確認填空
                   </button>
                   <button
                     type="button"
                     onClick={() => {
                       setSelectedId(null);
                       setFeedback(null);
                       setPassed(false);
                     }}
                     className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-gray-100 text-sm"
                   >
                     重置
                   </button>
                   {passed && (
                     <span className="ml-auto text-xs font-semibold text-emerald-300">
                       過關成功
                     </span>
                   )}
                 </div>
 
                 {feedback && (
                   <div
                     className={`mt-4 rounded-xl border p-3 text-sm whitespace-pre-wrap leading-relaxed ${
                       passed
                         ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100'
                         : 'border-amber-500/20 bg-amber-500/10 text-amber-100'
                     }`}
                   >
                     {feedback}
                   </div>
                 )}
               </div>
 
               <div className="lg:col-span-3">
                 <div className="relative w-full aspect-square rounded-2xl border border-dark-border/50 bg-dark-surface/30 overflow-hidden">
                   {/* 浮動字詞卡 */}
                   <div className="pointer-events-none absolute inset-0">
                     {cfg.options.map((opt) => {
                       const isSelected = selectedId === opt.id;
                       const scale = isSelected ? 1.06 : 1;
                       return (
                         <button
                           key={opt.id}
                           type="button"
                           className="absolute pointer-events-auto origin-center"
                           style={{
                            left: `${(opt.x ?? 0.5) * 100}%`,
                            top: `${(opt.y ?? 0.5) * 100}%`,
                             transform: `translate(-50%, -50%) rotate(${opt.rotation}deg) scale(${scale})`,
                             transformOrigin: 'center',
                           }}
                           onClick={(e) => {
                             e.stopPropagation();
                             setSelectedId(opt.id);
                           }}
                         >
                           <div
                             className={`
                               px-3 py-2 md:px-4 md:py-2.5 rounded-xl shadow-lg border text-xs md:text-sm
                               bg-amber-50/95 text-gray-900 border-amber-300/80
                               backdrop-blur-sm transition-all duration-150
                               ${isSelected ? 'ring-2 ring-amber-500 shadow-amber-500/40' : 'ring-0'}
                             `}
                           >
                             <span className="block max-w-[180px] md:max-w-[220px] text-left break-keep">
                               {opt.label}
                             </span>
                           </div>
                         </button>
                       );
                     })}
                   </div>
                 </div>
 
                 <p className="mt-3 text-xs text-gray-300/80">
                   提示：先點選右邊浮動字詞卡，再按左側「確認填空」。
                 </p>
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>
   );
 }
