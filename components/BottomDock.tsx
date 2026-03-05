'use client';

import { ReactNode } from 'react';

interface BottomDockProps {
  children: ReactNode;
  /** 對齊方式：預設置中 */
  align?: 'left' | 'center' | 'right';
}

// Dock 佔場景高度的 44%
export const DOCK_HEIGHT_RATIO = 0.44;
// 內容最大寬度（相對場景寬度），左右各留少量空白
export const DOCK_CONTENT_MAX_WIDTH = 0.92;
// 有立繪時預留給立繪的寬度比例與對話框寬度比例
export const DOCK_NARROW_LEFT_RATIO = 0.26;
export const DOCK_NARROW_WIDTH = 0.72;

export default function BottomDock({ children, align = 'center' }: BottomDockProps) {
  const justifyClass =
    align === 'left' ? 'justify-start' : align === 'right' ? 'justify-end' : 'justify-center';

  return (
    <div
      className="absolute inset-x-0 bottom-0 z-30 pointer-events-none"
      style={{ height: `${DOCK_HEIGHT_RATIO * 100}%` }}
    >
      <div className={`h-full w-full flex items-stretch ${justifyClass}`}>
        {/* 內容最大寬度約為場景寬度的 92%，留一些左右空白 */}
        <div
          className="h-full w-full mx-auto flex items-stretch pointer-events-auto"
          style={{ maxWidth: `${DOCK_CONTENT_MAX_WIDTH * 100}%` }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

