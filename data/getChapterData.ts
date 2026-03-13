import type { Scene, Item, NpcDialogNode } from '@/types/game';
import type { QuestionConfig, Ch2QuestionKey } from './gameDataCh2';
import { chapters } from './chapters';

export interface ChapterData {
  scenes: Record<string, Scene>;
  items: Record<string, Item>;
  npcDialogs: Record<string, Record<string, NpcDialogNode>>;
  /** ch2 專用：浮動答案卡設定，其他章節為 undefined */
  ch2QuestionConfigs?: Record<Ch2QuestionKey, QuestionConfig>;
}

/** 依 chapterId 動態載入該章資料（ch1～ch6 用分檔以縮小首包） */
export async function getChapterData(chapterId: string): Promise<ChapterData | null> {
  const chapter = chapters[chapterId];
  if (!chapter) return null;

  if (chapterId === 'ch1') {
    const mod = await import('./gameDataCh1');
    return { scenes: mod.scenes, items: mod.items, npcDialogs: mod.npcDialogs };
  }
  if (chapterId === 'ch2') {
    const mod = await import('./gameDataCh2');
    return {
      scenes: mod.scenes,
      items: mod.items,
      npcDialogs: mod.npcDialogs,
      ch2QuestionConfigs: mod.ch2QuestionConfigs,
    };
  }
  if (chapterId === 'ch3') {
    const mod = await import('./gameDataCh3');
    return { scenes: mod.scenes, items: mod.items, npcDialogs: mod.npcDialogs };
  }
  if (chapterId === 'ch4') {
    const mod = await import('./gameDataCh4');
    return { scenes: mod.scenes, items: mod.items, npcDialogs: mod.npcDialogs };
  }
  if (chapterId === 'ch5') {
    const mod = await import('./gameDataCh5');
    return { scenes: mod.scenes, items: mod.items, npcDialogs: mod.npcDialogs };
  }
  if (chapterId === 'ch6') {
    const mod = await import('./gameDataCh6');
    return { scenes: mod.scenes, items: mod.items, npcDialogs: mod.npcDialogs };
  }

  return null;
}
