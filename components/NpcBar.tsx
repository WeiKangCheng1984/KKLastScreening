'use client';

import { Npc } from '@/types/game';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from 'lucide-react';
import { useState } from 'react';
import SVGImage from './SVGImage';

interface NpcBarProps {
  npcs: Npc[];
  onNpcClick: (npcId: string) => void;
  checkAvailability?: (npc: Npc) => boolean;
  /** 正在與之對話的 NPC id（關鍵對話時會設），用於頭像高亮 */
  activeNpcId?: string | null;
}

export default function NpcBar({ npcs, onNpcClick, checkAvailability, activeNpcId }: NpcBarProps) {
  const [hoveredNpc, setHoveredNpc] = useState<string | null>(null);

  // 過濾可用的 NPC
  const availableNpcs = npcs.filter(npc => {
    // 如果提供了自定義檢查函數，使用它
    if (checkAvailability) {
      return checkAvailability(npc);
    }
    
    // 否則使用默認邏輯
    if (npc.available === false) return false;
    // availabilityRequirement 的檢查應該在父組件中進行
    return true;
  });

  if (availableNpcs.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="fixed bottom-0 left-0 right-0 z-30 flex justify-center pb-3 pointer-events-none"
    >
      <div className="bg-black/60 backdrop-blur-sm rounded-t-lg px-2 py-2 flex gap-2 pointer-events-auto border-t border-white/20">
        <AnimatePresence>
          {availableNpcs.map((npc) => (
            <motion.button
              key={npc.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => setHoveredNpc(npc.id)}
              onMouseLeave={() => setHoveredNpc(null)}
              onClick={() => onNpcClick(npc.id)}
              className="relative flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-md transition-colors hover:bg-white/10 group"
              title={npc.name}
            >
              {/* NPC 頭像：正在對話時外圈高亮 */}
              <div className={`relative w-10 h-10 md:w-11 md:h-11 rounded-full overflow-hidden bg-white/10 border transition-colors ${
                npc.id === activeNpcId
                  ? 'border-orange-400 ring-2 ring-orange-400/60 ring-offset-2 ring-offset-black/60'
                  : 'border-white/30 group-hover:border-white/50'
              }`}>
                {npc.portrait ? (
                  <SVGImage
                    src={npc.portrait}
                    alt={npc.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-5 h-5 md:w-6 md:h-6 text-white/60" />
                  </div>
                )}
                {/* Hover 時的脈衝效果 */}
                {hoveredNpc === npc.id && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-white/50"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                )}
              </div>
              
              {/* NPC 名稱 */}
              <span className="text-[10px] md:text-xs text-white/80 group-hover:text-white transition-colors text-center max-w-[60px] truncate leading-tight">
                {npc.name}
              </span>
              
              {/* Hover 顯示名稱與提示 */}
              {hoveredNpc === npc.id && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 pointer-events-none z-10"
                >
                  <div className="bg-black/90 text-white text-xs font-medium px-3 py-1.5 rounded whitespace-nowrap shadow-lg">
                    {npc.name}
                  </div>
                  <div className="text-[10px] text-white/80 px-2 py-0.5 rounded bg-black/70 whitespace-nowrap">
                    點擊對話
                  </div>
                  <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-black/90" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
