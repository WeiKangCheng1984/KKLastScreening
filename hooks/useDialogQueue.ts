'use client';

import { useCallback, useState } from 'react';
import type { Dialog } from '@/types/game';

export interface UseDialogQueueOptions {
  sceneViewRef?: React.RefObject<{ triggerFlicker: (mode: 'light' | 'strong' | 'intense') => void } | null>;
}

export function useDialogQueue(options: UseDialogQueueOptions = {}) {
  const { sceneViewRef } = options;

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
          return prev;
        }
      });
    },
    [currentDialog, dialogQueue, sceneViewRef],
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

