'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Dialog } from '@/types/game';

export interface UseDialogQueueOptions {
  sceneViewRef?: React.RefObject<{ triggerFlicker: (mode: 'light' | 'strong' | 'intense') => void }>;
  ch2QaActive?: boolean;
  ch2QaPhase?: 'idle' | 'prompt' | 'choices' | 'feedback';
  setCh2QaPhase?: (phase: 'idle' | 'prompt' | 'choices' | 'feedback') => void;
  onShowNextQaPrompt?: () => void;
}

export function useDialogQueue(options: UseDialogQueueOptions = {}) {
  const { sceneViewRef, ch2QaActive, ch2QaPhase, setCh2QaPhase, onShowNextQaPrompt } = options;

  const [currentDialog, setCurrentDialog] = useState<Dialog | null>(null);
  const [dialogQueue, setDialogQueue] = useState<Dialog[]>([]);

  const addDialogsToQueue = useCallback(
    (dialogs: Dialog[], interactionName?: string) => {
      if (dialogs.length === 0) return;
      const toQueue = interactionName
        ? [{ ...dialogs[0], title: interactionName }, ...dialogs.slice(1)]
        : dialogs;

      setCurrentDialog((current) => {
        if (!current) {
          const firstDialog = toQueue[0];
          if (firstDialog.type === 'broadcast') {
            if (sceneViewRef?.current) {
              sceneViewRef.current.triggerFlicker('intense');
              setTimeout(() => {
                sceneViewRef.current?.triggerFlicker('strong');
              }, 200);
              setTimeout(() => {
                sceneViewRef.current?.triggerFlicker('intense');
              }, 400);
            }
            setTimeout(() => {
              setCurrentDialog(firstDialog);
              if (toQueue.length > 1) {
                setDialogQueue(toQueue.slice(1));
              }
            }, 0);
            return null;
          } else {
            setTimeout(() => {
              if (toQueue.length > 1) {
                setDialogQueue(toQueue.slice(1));
              }
            }, 0);
            return firstDialog;
          }
        } else {
          setDialogQueue((prev) => [...prev, ...toQueue]);
          return current;
        }
      });
    },
    [sceneViewRef],
  );

  useEffect(() => {
    if (!ch2QaActive || ch2QaPhase !== 'prompt') return;
    if (currentDialog != null || dialogQueue.length > 0) return;
    if (!setCh2QaPhase) return;
    const t = setTimeout(() => setCh2QaPhase('choices'), 150);
    return () => clearTimeout(t);
  }, [ch2QaActive, ch2QaPhase, currentDialog, dialogQueue.length, setCh2QaPhase]);

  const handleDialogCloseBase = useCallback(
    (onQueueEmpty?: () => void) => {
      if (currentDialog?.characterId && dialogQueue.length > 0) {
        const nextDialog = dialogQueue[0];
        if (nextDialog.characterId === currentDialog.characterId) {
          setCurrentDialog(nextDialog);
          setDialogQueue((prev) => prev.slice(1));
          return;
        }
      }
      setCurrentDialog(null);
      setDialogQueue((prev) => {
        if (prev.length > 0) {
          const nextDialog = prev[0];
          setTimeout(() => {
            if (nextDialog.type === 'broadcast' && sceneViewRef?.current) {
              sceneViewRef.current.triggerFlicker('intense');
              setTimeout(() => {
                sceneViewRef.current?.triggerFlicker('strong');
              }, 200);
              setTimeout(() => {
                sceneViewRef.current?.triggerFlicker('intense');
              }, 400);
            }
            setCurrentDialog(nextDialog);
          }, 100);
          return prev.slice(1);
        } else {
          if (onQueueEmpty) onQueueEmpty();
          if (ch2QaActive && setCh2QaPhase) {
            if (ch2QaPhase === 'prompt') {
              setCh2QaPhase('choices');
            } else if (ch2QaPhase === 'feedback' && onShowNextQaPrompt) {
              onShowNextQaPrompt();
            }
          }
          return prev;
        }
      });
    },
    [currentDialog, dialogQueue, sceneViewRef, ch2QaActive, ch2QaPhase, setCh2QaPhase, onShowNextQaPrompt],
  );

  return {
    currentDialog,
    setCurrentDialog,
    dialogQueue,
    setDialogQueue,
    addDialogsToQueue,
    handleDialogCloseBase,
  };
}

