'use client';

import { Dialog } from '@/types/game';
import { m, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import DialogBox from './DialogBox';

export interface HotspotZoomOverlayProps {
  visible: boolean;
  background: string;
  zoomCenter: { x: number; y: number };
  dialogs: Dialog[];
  interactionName?: string;
  onClose: () => void;
}

const ZOOM_IN_DURATION = 0.24;
const ZOOM_OUT_DURATION = 0.19;
/** 兩段放大：第一段中繼倍率、第二段最終倍率 */
const ZOOM_MID_SCALE = 1.4;
const ZOOM_MAX_SCALE = 2.6;

export default function HotspotZoomOverlay({
  visible,
  background,
  zoomCenter,
  dialogs,
  interactionName,
  onClose,
}: HotspotZoomOverlayProps) {
  const [phase, setPhase] = useState<'zooming-in' | 'dialog' | 'zooming-out'>('zooming-in');
  const [queue, setQueue] = useState<Dialog[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const originPercent = `${zoomCenter.x * 100}% ${zoomCenter.y * 100}%`;

  useEffect(() => {
    if (!visible) return;
    setPhase('zooming-in');
    setQueue(dialogs.length ? [...dialogs] : []);
    setCurrentIndex(0);
  }, [visible, dialogs]);

  useEffect(() => {
    if (!visible || phase !== 'zooming-in') return;
    const t = setTimeout(() => {
      if (dialogs.length === 0) {
        setPhase('zooming-out');
      } else {
        setPhase('dialog');
      }
    }, ZOOM_IN_DURATION * 1000);
    return () => clearTimeout(t);
  }, [visible, phase, dialogs.length]);

  const handleDialogClose = useCallback(() => {
    if (currentIndex + 1 < queue.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      setPhase('zooming-out');
    }
  }, [currentIndex, queue.length]);

  useEffect(() => {
    if (phase !== 'zooming-out') return;
    const t = setTimeout(() => {
      onClose();
    }, ZOOM_OUT_DURATION * 1000);
    return () => clearTimeout(t);
  }, [phase, onClose]);

  const currentDialog = queue[currentIndex];
  const dialogWithTitle =
    currentDialog && interactionName && currentIndex === 0
      ? { ...currentDialog, title: interactionName }
      : currentDialog;

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.08 }}
          className="fixed inset-0 z-40 pointer-events-auto"
        >
          {/* 背景圖 + 節奏感 ZOOM IN / ZOOM OUT（兩段式 keyframes） */}
          <m.div
            className="absolute inset-0"
            style={{ transformOrigin: originPercent }}
            initial={{ scale: 1 }}
            animate={{
              scale:
                phase === 'zooming-in'
                  ? [1, ZOOM_MID_SCALE, ZOOM_MAX_SCALE]
                  : phase === 'dialog'
                    ? ZOOM_MAX_SCALE
                    : phase === 'zooming-out'
                      ? [ZOOM_MAX_SCALE, ZOOM_MID_SCALE, 1]
                      : 1,
            }}
            transition={{
              scale:
                phase === 'zooming-in'
                  ? {
                      duration: ZOOM_IN_DURATION,
                      times: [0, 0.4, 1],
                      ease: ['easeOut', 'easeOut', 'easeOut'],
                    }
                  : phase === 'zooming-out'
                    ? {
                        duration: ZOOM_OUT_DURATION,
                        times: [0, 0.45, 1],
                        ease: ['easeIn', 'easeIn', 'easeIn'],
                      }
                    : { duration: 0 },
            }}
          >
            <Image
              src={background}
              alt=""
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </m.div>

          {/* 暗角：進場淡入、退場淡出 */}
          <m.div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 70% 70% at ${originPercent}, transparent 30%, rgba(0,0,0,0.35) 100%)`,
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: phase === 'zooming-in' ? 0 : phase === 'dialog' ? 1 : phase === 'zooming-out' ? 0 : 1,
            }}
            transition={{
              opacity:
                phase === 'zooming-in'
                  ? { delay: 0.1, duration: 0.12 }
                  : phase === 'zooming-out'
                    ? { duration: 0.09 }
                    : { duration: 0 },
            }}
          />

          {/* 極細顆粒感（探索感） */}
          <m.div
            className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: phase === 'dialog' ? 0.04 : 0,
            }}
            transition={{ duration: 0.2 }}
          />

          {/* 對話框層：僅在 dialog 階段顯示 */}
          <AnimatePresence mode="wait">
            {phase === 'dialog' && dialogWithTitle && (
              <m.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute inset-0 flex items-end justify-center p-4 md:items-center md:p-8"
              >
                <DialogBox
                  dialog={dialogWithTitle}
                  onClose={handleDialogClose}
                  typewriterSpeed={30}
                />
              </m.div>
            )}
          </AnimatePresence>
        </m.div>
      )}
    </AnimatePresence>
  );
}
