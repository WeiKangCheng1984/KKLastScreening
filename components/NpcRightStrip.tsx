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
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 20, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="fixed right-3 top-1/2 z-30 flex flex-col gap-2 -translate-y-1/2 pointer-events-none"
    >
      <div className="flex flex-col gap-2 pointer-events-auto">
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
              className="relative flex flex-col items-center gap-0.5 rounded-lg transition-colors hover:bg-white/10 group"
              title={npc.name}
            >
              <div
                className={`relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden bg-white/10 border-2 transition-colors flex-shrink-0 ${
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
                    <User className="w-6 h-6 text-white/60" />
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
              <span className="text-[10px] md:text-xs text-white/80 group-hover:text-white text-center max-w-[56px] truncate leading-tight">
                {npc.name}
              </span>
              {hoveredNpc === npc.id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute right-full mr-2 top-1/2 -translate-y-1/2 flex flex-col items-end pointer-events-none z-10"
                >
                  <div className="bg-black/90 text-white text-xs font-medium px-2 py-1 rounded whitespace-nowrap shadow-lg">
                    {npc.name}
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
