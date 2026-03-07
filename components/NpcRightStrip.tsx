'use client';

import { getNpcPortraitUrl } from '@/lib/characterPortrait';
import { Npc } from '@/types/game';
import { m, AnimatePresence } from 'framer-motion';
import { User, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import SVGImage from './SVGImage';

function getNpcAvatarSrc(npc: Npc): string | null {
  if (npc.portraitWebp) return npc.portraitWebp;
  return getNpcPortraitUrl(npc.id, npc.portraitExpression ?? 1);
}

/** 人名與職稱斷行：在「（」前換行，例如 "林瑞堂（副理）" → 兩行顯示 */
function formatNpcNameWithBreak(name: string): string {
  return name.replace(/（/g, '\n（');
}

/** 一頁最多顯示 5 個頭像；頭像縮小 5% 以配合版面 */
const PER_PAGE = 5;

/** 短螢幕（如 Nest Hub）改用 fixed bottom 的 breakpoint */
const SHORT_VIEWPORT_MAX_HEIGHT = 600;

interface NpcRightStripProps {
  npcs: Npc[];
  onNpcClick: (npcId: string) => void;
  checkAvailability?: (npc: Npc) => boolean;
  activeNpcId?: string | null;
  /** 納入版面流（方案 A）；未指定則為 fixed + Portal */
  variant?: 'fixed' | 'inline';
}

export default function NpcRightStrip({
  npcs,
  onNpcClick,
  checkAvailability,
  activeNpcId,
  variant = 'fixed',
}: NpcRightStripProps) {
  const [hoveredNpc, setHoveredNpc] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isShortViewport, setIsShortViewport] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    setPageIndex(0);
  }, [npcs.length, variant]);
  useEffect(() => {
    if (variant !== 'inline') return;
    const mq = window.matchMedia(`(max-height: ${SHORT_VIEWPORT_MAX_HEIGHT}px)`);
    const onChange = () => setIsShortViewport(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [variant]);

  const availableNpcs = npcs.filter((npc) => {
    if (checkAvailability) return checkAvailability(npc);
    if (npc.available === false) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(availableNpcs.length / PER_PAGE));
  const safePageIndex = Math.min(pageIndex, totalPages - 1);
  const npcsToShow = availableNpcs.slice(
    safePageIndex * PER_PAGE,
    (safePageIndex + 1) * PER_PAGE
  );

  if (availableNpcs.length === 0) return null;

  const stripContent = (
    <div className="flex flex-row gap-2 flex-wrap justify-center flex-1 min-w-0 overflow-x-auto overflow-y-hidden py-1 pointer-events-auto">
      <AnimatePresence mode="popLayout">
        {npcsToShow.map((npc) => (
          <m.button
            key={npc.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setHoveredNpc(npc.id)}
            onMouseLeave={() => setHoveredNpc(null)}
            onClick={() => onNpcClick(npc.id)}
            className="relative flex flex-col items-center gap-0.5 rounded-lg transition-colors hover:bg-white/10 group flex-shrink-0"
            title={npc.name}
          >
            <div
              className={`relative w-[3.04rem] h-[3.04rem] md:w-[3.61rem] md:h-[3.61rem] rounded-full overflow-hidden bg-white/10 border-2 transition-colors flex-shrink-0 ${
                npc.id === activeNpcId
                  ? 'border-orange-400 ring-2 ring-orange-400/60 ring-offset-2 ring-offset-black/60'
                  : 'border-white/30 group-hover:border-white/50'
              }`}
            >
              {getNpcAvatarSrc(npc) ? (
                <img
                  src={getNpcAvatarSrc(npc)!}
                  alt={npc.name}
                  className="w-full h-full object-cover"
                />
              ) : npc.portrait ? (
                <SVGImage
                  src={npc.portrait}
                  alt={npc.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white/60" />
                </div>
              )}
              {hoveredNpc === npc.id && (
                <m.div
                  className="absolute inset-0 rounded-full border-2 border-white/50"
                  animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
            </div>
            <span className="text-[10px] text-white/80 group-hover:text-white text-center min-w-[6em] max-w-[5.5rem] leading-tight line-clamp-2 break-words whitespace-pre-line">
              {formatNpcNameWithBreak(npc.name)}
            </span>
            {hoveredNpc === npc.id && (
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 flex flex-col items-center pointer-events-none z-10"
              >
                <div className="bg-black/90 text-white text-xs font-medium px-2 py-1 rounded whitespace-pre-line text-center shadow-lg min-w-[6em]">
                  {formatNpcNameWithBreak(npc.name)}
                </div>
                <div className="text-[10px] text-white/80 px-1.5 py-0.5 rounded bg-black/70 whitespace-nowrap">
                  點擊對話
                </div>
              </m.div>
            )}
          </m.button>
        ))}
      </AnimatePresence>
    </div>
  );

  const showPagination = totalPages > 1;
  const stripWithArrows = (
    <div className="relative flex items-center justify-center w-full px-10">
      {showPagination ? (
        <button
          type="button"
          onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
          disabled={safePageIndex === 0}
          className="flex-shrink-0 p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors absolute left-0 top-1/2 -translate-y-1/2 z-10"
          title="上一頁"
          aria-label="上一頁"
        >
          <ChevronLeft size={20} />
        </button>
      ) : null}
      {stripContent}
      {showPagination ? (
        <div className="flex-shrink-0 flex items-center gap-1 absolute right-0 top-1/2 -translate-y-1/2 z-10">
          <button
            type="button"
            onClick={() => setPageIndex((p) => Math.min(totalPages - 1, p + 1))}
            disabled={safePageIndex >= totalPages - 1}
            className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="下一頁"
            aria-label="下一頁"
          >
            <ChevronRight size={20} />
          </button>
          <span className="text-[10px] text-white/60 tabular-nums pr-1">
            {safePageIndex + 1}/{totalPages}
          </span>
        </div>
      ) : null}
    </div>
  );

  if (variant === 'inline') {
    const wrapperClass =
      isShortViewport && mounted
        ? 'fixed left-1/2 -translate-x-1/2 bottom-24 z-30 flex flex-row gap-2 pointer-events-none w-full max-w-[min(90vw,960px)] justify-center'
        : 'w-full max-w-[min(90vw,960px)] flex justify-center py-2 shrink-0';
    return (
      <m.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={wrapperClass}
      >
        {stripWithArrows}
      </m.div>
    );
  }

  const content = (
    <m.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -10, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="fixed left-1/2 -translate-x-1/2 top-16 z-30 flex flex-row gap-2 pointer-events-none"
    >
      {stripWithArrows}
    </m.div>
  );

  if (!mounted || typeof document === 'undefined' || !document.body) return null;
  return createPortal(content, document.body);
}
