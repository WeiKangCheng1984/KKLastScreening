'use client';

import { m, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import SVGImage from './SVGImage';
import { Package, X } from 'lucide-react';

interface ItemObtainedNotificationProps {
  itemId: string;
  itemName: string;
  itemImage?: string;
  itemSvgImage?: string;
  /** 道具描述（方案 C：點擊關閉時顯示） */
  itemDescription?: string;
  show: boolean;
  duration?: number; // 總顯示時長（毫秒），0 表示不自動關閉、由使用者點擊關閉
  onComplete?: () => void;
  /** 為 true 時不自動關閉，顯示描述與關閉鈕，點擊卡片或關閉鈕後呼叫 onComplete */
  dismissOnTap?: boolean;
  /** 為 true 時卡片垂直置中於容器；為 false 時貼底 */
  center?: boolean;
}

export default function ItemObtainedNotification({
  itemId,
  itemName,
  itemImage,
  itemSvgImage,
  itemDescription,
  show,
  duration = 1500,
  onComplete,
  dismissOnTap = false,
  center = false,
}: ItemObtainedNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      if (!dismissOnTap && duration > 0) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          if (onComplete) {
            setTimeout(() => onComplete(), 300);
          }
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
    }
  }, [show, duration, onComplete, dismissOnTap]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onComplete) {
      setTimeout(() => onComplete(), 300);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <m.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 25,
          }}
          className={`w-full h-full flex ${center ? 'items-center' : 'items-end'} justify-center ${dismissOnTap ? 'pointer-events-auto' : 'pointer-events-none'}`}
        >
          <div
            role={dismissOnTap ? 'button' : undefined}
            tabIndex={dismissOnTap ? 0 : undefined}
            onClick={dismissOnTap ? handleDismiss : undefined}
            onKeyDown={dismissOnTap ? (e) => e.key === 'Enter' && handleDismiss() : undefined}
            className={`bg-dark-card/95 backdrop-blur-md border-2 border-orange-500/50 rounded-xl px-6 py-5 md:px-8 md:py-6 shadow-2xl max-w-sm w-full mx-4 ${center ? '' : 'mb-4'} ${dismissOnTap ? 'cursor-pointer' : ''}`}
          >
            <div className="flex items-start gap-4">
              {/* 道具圖示 */}
              <div className="flex-shrink-0">
                {itemSvgImage ? (
                  <SVGImage
                    src={itemSvgImage}
                    alt={itemName}
                    size="medium"
                    className="w-16 h-16 md:w-20 md:h-20"
                  />
                ) : itemImage ? (
                  <img
                    src={itemImage}
                    alt={itemName}
                    className="w-16 h-16 md:w-20 md:h-20 object-contain"
                  />
                ) : (
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-dark-surface/50 rounded-lg flex items-center justify-center border border-dark-border">
                    <Package size={32} className="text-orange-400" />
                  </div>
                )}
              </div>

              {/* 文字內容 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs text-orange-400/70 mb-1 font-medium uppercase tracking-wider">
                      獲得
                    </div>
                    <div className="text-lg md:text-xl font-semibold text-orange-400">
                      {itemName}
                    </div>
                  </div>
                  {dismissOnTap && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDismiss();
                      }}
                      className="flex-shrink-0 p-1 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                      aria-label="關閉"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
                {dismissOnTap && itemDescription && (
                  <div className="mt-3 text-xs text-white/80 whitespace-pre-line max-h-48 overflow-hidden pr-1">
                    {itemDescription}
                  </div>
                )}
                {dismissOnTap && (
                  <div className="mt-3 text-xs text-orange-400/60">
                    點擊關閉
                  </div>
                )}
              </div>
            </div>

            {!dismissOnTap && (
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{ duration: 0.6, repeat: 1 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-400/20 to-transparent rounded-xl pointer-events-none"
              />
            )}
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
