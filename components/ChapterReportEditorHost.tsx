'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import ChapterClosingRewardStep from '@/components/ChapterClosingRewardStep';
import ChapterConclusionOverlay from '@/components/ChapterConclusionOverlay';
import Ch1ReportEditor from '@/components/Ch1ReportEditor';
import Ch2ReportEditor from '@/components/Ch2ReportEditor';
import Ch3ReportEditor from '@/components/Ch3ReportEditor';
import Ch4ReportEditor from '@/components/Ch4ReportEditor';
import Ch5ReportEditor from '@/components/Ch5ReportEditor';
import Ch6ReportEditor, { type Ch6EndingId } from '@/components/Ch6ReportEditor';
import { getChapterConfig, type ReportChapterId } from '@/data/getChapterConfig';
import type { GameEngine } from '@/lib/gameEngine';

export interface ChapterReportEditorHostProps {
  chapterId: ReportChapterId;
  getEngine: () => GameEngine;
  router: { push: (href: string) => void };
  onDismiss: () => void;
  onCh6Ending: (id: Ch6EndingId) => void;
}

/**
 * 單一章尾 overlay 內容：依 chapterId 掛載對應編輯器，完成後依 getChapterConfig().report 導向。
 */
export default function ChapterReportEditorHost({
  chapterId,
  getEngine,
  router,
  onDismiss,
  onCh6Ending,
}: ChapterReportEditorHostProps) {
  const reportCfg = getChapterConfig(chapterId).report;
  const post = reportCfg.postComplete;

  const [phase, setPhase] = useState<'editor' | 'reward'>('editor');
  const [pendingCh6Ending, setPendingCh6Ending] = useState<Ch6EndingId | null>(null);

  const finishStandardChapter = useCallback(() => {
    onDismiss();
    if (!post) return;
    const eng = getEngine();
    if (eng.getState().flags?.[post.flag]) {
      eng.applyEffect({ type: 'setFlag', flag: post.flag, value: false });
      setTimeout(() => router.push(post.href), 300);
    }
  }, [getEngine, onDismiss, post, router]);

  const handleRewardContinue = useCallback(() => {
    if (chapterId === 'ch6') {
      const id = pendingCh6Ending;
      setPendingCh6Ending(null);
      setPhase('editor');
      onDismiss();
      if (id) onCh6Ending(id);
      return;
    }
    setPhase('editor');
    finishStandardChapter();
  }, [chapterId, finishStandardChapter, onCh6Ending, onDismiss, pendingCh6Ending]);

  // Play 頁傳入的 getEngine 常為 inline `() => ref.current`，每次 render 參考都不同；
  // 若子元件 useEffect 依賴 engine 物件，applyEffect → notify → setRefreshKey 會無限迴圈。
  const getEngineRef = useRef(getEngine);
  getEngineRef.current = getEngine;

  const engineApi = useMemo(
    () => ({
      getState: () => getEngineRef.current().getState(),
      applyEffect: (e: Parameters<GameEngine['applyEffect']>[0]) =>
        getEngineRef.current().applyEffect(e),
      handleDialogChoice: (c: Parameters<GameEngine['handleDialogChoice']>[0]) =>
        getEngineRef.current().handleDialogChoice(c),
      setReasoningComplete: (ch: string) => getEngineRef.current().setReasoningComplete(ch),
    }),
    []
  );

  return (
    <ChapterConclusionOverlay>
      {phase === 'reward' ? (
        <ChapterClosingRewardStep
          chapterId={chapterId}
          getEngine={getEngine}
          ch6EndingId={pendingCh6Ending ?? undefined}
          onContinue={handleRewardContinue}
        />
      ) : (
        <>
          {chapterId === 'ch1' && (
            <Ch1ReportEditor
              engine={engineApi}
              onComplete={() => setPhase('reward')}
              onClose={onDismiss}
            />
          )}
          {chapterId === 'ch2' && (
            <Ch2ReportEditor
              engine={engineApi}
              onComplete={() => setPhase('reward')}
              onRound1Dismiss={onDismiss}
            />
          )}
          {chapterId === 'ch3' && (
            <Ch3ReportEditor
              engine={engineApi}
              onComplete={() => setPhase('reward')}
              onClose={onDismiss}
            />
          )}
          {chapterId === 'ch4' && (
            <Ch4ReportEditor
              engine={engineApi}
              onComplete={() => setPhase('reward')}
              onClose={onDismiss}
            />
          )}
          {chapterId === 'ch5' && (
            <Ch5ReportEditor
              engine={engineApi}
              onComplete={() => setPhase('reward')}
              onClose={onDismiss}
            />
          )}
          {chapterId === 'ch6' && (
            <Ch6ReportEditor
              engine={engineApi}
              onComplete={(endingId) => {
                setPendingCh6Ending(endingId);
                setPhase('reward');
              }}
              onClose={onDismiss}
            />
          )}
        </>
      )}
    </ChapterConclusionOverlay>
  );
}
