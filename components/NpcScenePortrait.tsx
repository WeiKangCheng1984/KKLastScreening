'use client';

import { getNpcPortraitUrl } from '@/lib/characterPortrait';

export interface NpcScenePortraitProps {
  characterId: string;
  expression?: 1 | 2 | 3;
  name?: string;
  position?: 'left' | 'right';
  /** 預設 z-40（高於 BottomDock z-30）；HotspotZoomOverlay 內傳 z-20（高於 DialogBox containedInOverlay z-10） */
  zClassName?: string;
}

/**
 * 場景上的 NPC 立繪（玩法 A）：與 BottomDock DialogBox、HotspotZoomOverlay 共用同一組比例／邊距，避免章節或路徑視覺漂移。
 */
export default function NpcScenePortrait({
  characterId,
  expression = 1,
  name,
  position = 'right',
  zClassName = 'z-40',
}: NpcScenePortraitProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none flex items-end ${zClassName} ${
        position === 'right' ? 'justify-end' : 'justify-start'
      }`}
    >
      <img
        src={getNpcPortraitUrl(characterId, expression)}
        alt={name ?? ''}
        className={`h-[40%] w-auto max-w-[50%] object-contain object-bottom drop-shadow-2xl select-none ${
          position === 'left' ? 'ml-0' : 'mr-0'
        }`}
        style={
          position === 'left'
            ? { marginLeft: '-2%' }
            : position === 'right'
              ? { marginRight: '-2%' }
              : undefined
        }
      />
    </div>
  );
}
