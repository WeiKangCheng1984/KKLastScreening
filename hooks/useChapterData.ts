'use client';

import { useEffect, useLayoutEffect, useState, useRef } from 'react';
import type { GameEngine } from '@/lib/gameEngine';
import { getChapterData, type ChapterData } from '@/data/getChapterData';

export function useChapterData(chapterId: string, sceneId: string, engineRef: React.RefObject<GameEngine | null>) {
  const [chapterDataReady, setChapterDataReady] = useState(false);
  const [ch2QuestionConfigs, setCh2QuestionConfigs] = useState<ChapterData['ch2QuestionConfigs']>(undefined);
  const [ch2NpcDialogs, setCh2NpcDialogs] = useState<ChapterData['npcDialogs'] | null>(null);
  const initialSyncDoneRef = useRef(false);

  useEffect(() => {
    if (!chapterId || !engineRef.current) return;
    const targetChapterId = chapterId;
    const targetSceneId = sceneId;

    // 切換章節時重置 ch2 專用狀態
    setCh2QuestionConfigs(undefined);
    setCh2NpcDialogs(null);

    getChapterData(targetChapterId)
      .then((data) => {
        if (!data || !engineRef.current) return;
        const eng = engineRef.current;
        eng.loadChapterData(data);
        eng.applyEffect({
          type: 'changeScene',
          chapterId: targetChapterId,
          sceneId: targetSceneId,
        });
        if (data.ch2QuestionConfigs) {
          setCh2QuestionConfigs(data.ch2QuestionConfigs);
          setCh2NpcDialogs(data.npcDialogs);
        }
        setChapterDataReady(true);
      })
      .catch((err) => {
        console.warn('getChapterData failed:', err);
      });
  }, [chapterId, sceneId, engineRef]);

  useLayoutEffect(() => {
    if (!chapterDataReady || !chapterId || !sceneId || !engineRef.current) return;
    if (initialSyncDoneRef.current) return;
    const eng = engineRef.current;
    const state = eng.getState();
    if (state.currentChapter === chapterId && state.currentScene === sceneId) {
      initialSyncDoneRef.current = true;
      return;
    }
    eng.applyEffect({
      type: 'changeScene',
      chapterId,
      sceneId,
    });
    initialSyncDoneRef.current = true;
  }, [chapterDataReady, chapterId, sceneId, engineRef]);

  const scenes = chapterDataReady && engineRef.current ? engineRef.current.getScenes() : {};
  const items = chapterDataReady && engineRef.current ? engineRef.current.getItems() : {};

  return { chapterDataReady, scenes, items, ch2QuestionConfigs, ch2NpcDialogs };
}

