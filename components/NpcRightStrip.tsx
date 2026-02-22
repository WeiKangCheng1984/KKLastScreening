'use client';

import { getNpcPortraitUrl } from '@/lib/characterPortrait';
import { Npc } from '@/types/game';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from 'lucide-react';
import { useState } from 'react';
import SVGImage from './SVGImage';

function getNpcAvatarSrc(npc: Npc): string | null {
  if (npc.portraitWebp) return npc.portraitWebp;
  return getNpcPortraitUrl(npc.id, npc.portraitExpression ?? 1);
}

/** 人名與職稱斷行：在「（」前換行，例如 "林瑞堂（副理）" → 兩行顯示 */
function formatNpcNameWithBreak(name: string): string {
  return name.replace(/（/g, '\n（');
}

interface NpcRightStripProps {
  npcs: Npc[];
  onNpcClick: (npcId: string) => void;
  checkAvailability?: (npc: Npc) => boolean;
  activeNpcId?: string | null;
}

export default function NpcRightStrip({
  npcs,
  onNpcClick,
  checkAvailability,
  activeNpcId,
}: NpcRightStripProps) {
  const [hoveredNpc, setHoveredNpc] = useState<string | null>(null);

  const availableNpcs = npcs.filter((npc) => {
    if (checkAvailability) return checkAvailability(npc);
    if (npc.available === false) return false;
    return true;
  });

  if (availableNpcs.length === 0) return null;

  return (
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -10, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="fixed left-1/2 -translate-x-1/2 top-20 z-30 flex flex-row gap-2 pointer-events-none"
    >
      <div className="flex flex-row gap-2 flex-wrap justify-center max-w-[min(90vw,960px)] overflow-x-auto overflow-y-hidden py-1 pointer-events-auto">
        <AnimatePresence>
          {availableNpcs.map((npc) => (
            <motion.button
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
                className={`relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-white/10 border-2 transition-colors flex-shrink-0 ${
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
                  <motion.div
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
                <motion.div
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
                </motion.div>
              )}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
