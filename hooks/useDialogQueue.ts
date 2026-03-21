'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Dialog } from '@/types/game';

export interface UseDialogQueueOptions {
  sceneViewRef?: React.RefObject<{ triggerFlicker: (mode: 'light' | 'strong' | 'intense') => void } | null>;
}

export function useDialogQueue(options: UseDialogQueueOptions = {}) {
  const { sceneViewRef } = options;

  const [currentDialog, setCurrentDialog] = useState<Dialog | null>(null);
  const [dialogQueue, setDialogQueue] = useState<Dialog[]>([]);

  const timerIdsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      timerIdsRef.current.forEach(clearTimeout);
      timerIdsRef.current = [];
    };
  }, []);

  const managedTimeout = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      timerIdsRef.current = timerIdsRef.current.filter((t) => t !== id);
      if (mountedRef.current) fn();
    }, ms);
    timerIdsRef.current.push(id);
    return id;
  }, []);

  const triggerBroadcastFlicker = useCallback(() => {
    if (!sceneViewRef?.current) return;
    sceneViewRef.current.triggerFlicker('intense');
    managedTimeout(() => sceneViewRef.current?.triggerFlicker('strong'), 200);
    managedTimeout(() => sceneViewRef.current?.triggerFlicker('intense'), 400);
  }, [sceneViewRef, managedTimeout]);

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
            triggerBroadcastFlicker();
            queueMicrotask(() => {
              if (!mountedRef.current) return;
              setCurrentDialog(firstDialog);
              if (toQueue.length > 1) setDialogQueue(toQueue.slice(1));
            });
            return null;
          } else {
            queueMicrotask(() => {
              if (!mountedRef.current) return;
              if (toQueue.length > 1) setDialogQueue(toQueue.slice(1));
            });
            return firstDialog;
          }
        } else {
          setDialogQueue((prev) => [...prev, ...toQueue]);
          return current;
        }
      });
    },
    [sceneViewRef, triggerBroadcastFlicker],
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
          managedTimeout(() => {
            if (nextDialog.type === 'broadcast') triggerBroadcastFlicker();
            setCurrentDialog(nextDialog);
          }, 100);
          return prev.slice(1);
        } else {
          if (onQueueEmpty) onQueueEmpty();
          return prev;
        }
      });
    },
    [currentDialog, dialogQueue, sceneViewRef, managedTimeout, triggerBroadcastFlicker],
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
