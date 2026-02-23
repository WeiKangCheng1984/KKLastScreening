import type { Scene, Item, NpcDialogNode } from '@/types/game';
import { chapters } from './chapters';
import { scenes, items, npcDialogs } from './gameData';

export interface ChapterData {
  scenes: Record<string, Scene>;
  items: Record<string, Item>;
  npcDialogs: Record<string, Record<string, NpcDialogNode>>;
}

/** 依 chapterId 篩選該章節的 scenes / items / npcDialogs（NPC 僅 ch1 有） */
export async function getChapterData(chapterId: string): Promise<ChapterData | null> {
  const chapter = chapters[chapterId];
  if (!chapter) return null;

  const sceneIds = new Set(chapter.scenes);
  const scenesSubset: Record<string, Scene> = {};
  const itemIds = new Set<string>();
  sceneIds.forEach((id) => {
    const s = scenes[id];
    if (s) {
      scenesSubset[id] = s;
      s.items?.forEach((it) => itemIds.add(it.id));
    }
  });

  const itemsSubset: Record<string, Item> = {};
  itemIds.forEach((id) => {
    const it = items[id];
    if (it) itemsSubset[id] = it;
  });

  const npcSubset =
    chapterId === 'ch1'
      ? { ...npcDialogs }
      : ({} as Record<string, Record<string, NpcDialogNode>>);

  return {
    scenes: scenesSubset,
    items: itemsSubset,
    npcDialogs: npcSubset,
  };
}
