'use client';

import { useEffect, useLayoutEffect, useState, useRef } from 'react';
import type { GameEngine } from '@/lib/gameEngine';
import { getChapterData } from '@/data/getChapterData';

export function useChapterData(chapterId: string, sceneId: string, engineRef: React.RefObject<GameEngine | null>) {
  const [chapterDataReady, setChapterDataReady] = useState(false);
  const initialSyncDoneRef = useRef(false);

  useEffect(() => {
    if (!chapterId || !engineRef.current) return;
    const targetChapterId = chapterId;
    const targetSceneId = sceneId;

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

  return { chapterDataReady, scenes, items };
}
