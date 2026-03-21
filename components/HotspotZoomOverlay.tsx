'use client';

import { Dialog } from '@/types/game';
import NpcScenePortrait from './NpcScenePortrait';
import { m, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import DialogBox from './DialogBox';

/** 熱點說明與角色抬頭重複時不顯示灰字 caption，避免「問林瑞堂」+ 標題列「林瑞堂（…）」雙重身分提示 */
function zoomCaptionDuplicatesCharacter(d: Dialog, caption: string): boolean {
  if (d.type !== 'character' || !d.characterName?.trim()) return false;
  const rawName = d.characterName.trim();
  const short = rawName.split('（')[0].trim().replace(/\s/g, '');
  const compactName = rawName.replace(/\s/g, '');
  const cap = caption.trim().replace(/\s/g, '');
  if (!cap || !short) return false;
  if (cap === compactName || cap === short) return true;
  if ((cap.startsWith('問') || cap.startsWith('與')) && cap.includes(short)) return true;
  if (cap.startsWith('詢問') && (cap.includes(short) || compactName.includes(short))) return true;
  return false;
}

export interface HotspotZoomOverlayProps {
  visible: boolean;
  background: string;
  zoomCenter: { x: number; y: number };
  dialogs: Dialog[];
  interactionName?: string;
  onClose: () => void;
}

const ZOOM_OUT_DURATION = 0.19;

export default function HotspotZoomOverlay({
  visible,
  background,
  zoomCenter,
  dialogs,
  interactionName,
  onClose,
}: HotspotZoomOverlayProps) {
  const [phase, setPhase] = useState<'zooming-in' | 'dialog' | 'zooming-out'>('dialog');
  const [queue, setQueue] = useState<Dialog[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const originPercent = `${zoomCenter.x * 100}% ${zoomCenter.y * 100}%`;

  useEffect(() => {
    if (!visible) return;
    // 直接進入對話階段，不再經過 ZOOM IN 動畫
    setPhase(dialogs.length ? 'dialog' : 'zooming-out');
    setQueue(dialogs.length ? [...dialogs] : []);
    setCurrentIndex(0);
  }, [visible, dialogs]);

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
      ? zoomCaptionDuplicatesCharacter(currentDialog, interactionName)
        ? currentDialog
        : { ...currentDialog, title: interactionName }
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
          {/* 背景圖：暫時關閉 ZOOM IN / OUT，僅保留靜態顯示 */}
          <m.div
            className="absolute inset-0"
            style={{ transformOrigin: originPercent }}
            initial={{ scale: 1 }}
            animate={{
              scale: 1,
            }}
            transition={{
              scale: { duration: 0 },
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

          {/* 圖層（由低到高）：DialogBox containedInOverlay z-10 → NpcScenePortrait z-20，立繪永遠在對話框之上 */}
          <AnimatePresence mode="wait">
            {phase === 'dialog' && dialogWithTitle && (
              <m.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute inset-0"
              >
                <DialogBox
                  dialog={dialogWithTitle}
                  onClose={handleDialogClose}
                  typewriterSpeed={30}
                  variant="hotspot"
                  portraitOnScene={!!dialogWithTitle.characterId}
                  containedInOverlay
                />
                {dialogWithTitle.characterId ? (
                  <NpcScenePortrait
                    characterId={dialogWithTitle.characterId}
                    expression={dialogWithTitle.characterExpression ?? 1}
                    name={dialogWithTitle.characterName}
                    position={dialogWithTitle.characterPosition ?? 'right'}
                    zClassName="z-20"
                  />
                ) : null}
              </m.div>
            )}
          </AnimatePresence>
        </m.div>
      )}
    </AnimatePresence>
  );
}
