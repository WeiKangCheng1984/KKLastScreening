'use client';

import { ReactNode } from 'react';
import { motion, MotionProps } from 'framer-motion';

type OverlayTone = 'narrative' | 'system' | 'decision' | 'warning' | 'success';
type OverlaySize = 'sm' | 'md' | 'lg';

export interface OverlayCardProps extends MotionProps {
  /** 覆蓋層語意：影響底色與邊框色 */
  tone?: OverlayTone;
  /** 卡片尺寸：sm ~ lg */
  size?: OverlaySize;
  /** 自訂 className（會疊加在預設樣式之後） */
  className?: string;
  /** 內容區 */
  children: ReactNode;
}

function getToneClasses(tone: OverlayTone): string {
  switch (tone) {
    case 'narrative':
      return 'bg-dark-card/95 border-orange-700/40 text-gray-100';
    case 'system':
      return 'bg-gradient-to-br from-gray-950/95 via-gray-900/95 to-gray-950/95 border-amber-600/50 text-amber-50';
    case 'decision':
      return 'bg-gradient-to-br from-gray-950/95 via-gray-900/95 to-gray-950/95 border-orange-700/60 text-orange-50';
    case 'warning':
      return 'bg-gradient-to-br from-red-950/95 via-red-900/95 to-red-950/95 border-red-700/70 text-red-50';
    case 'success':
      return 'bg-gradient-to-br from-emerald-950/95 via-emerald-900/95 to-emerald-950/95 border-emerald-700/60 text-emerald-50';
    default:
      return 'bg-dark-card/95 border-dark-border text-gray-100';
  }
}

function getSizeClasses(size: OverlaySize): string {
  switch (size) {
    case 'sm':
      return 'w-full max-w-md px-5 py-4';
    case 'md':
      return 'w-full max-w-xl px-6 py-5';
    case 'lg':
      return 'w-full max-w-2xl px-6 py-6';
    default:
      return 'w-full max-w-md px-5 py-4';
  }
}

/**
 * 通用覆蓋層卡片外框：統一陰影、圓角、邊框與底色。
 * 不處理遮罩與對齊，只負責卡片本身；外層由各 overlay 控制（例如 fixed inset-0 flex items-center justify-center）。
 */
export default function OverlayCard({
  tone = 'system',
  size = 'md',
  className = '',
  children,
  ...motionProps
}: OverlayCardProps) {
  const toneClasses = getToneClasses(tone);
  const sizeClasses = getSizeClasses(size);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 8 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`rounded-xl border-2 shadow-2xl backdrop-blur-md ${toneClasses} ${sizeClasses} ${className}`}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}

