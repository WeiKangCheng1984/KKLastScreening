'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import SVGImage from './SVGImage';
import { Package } from 'lucide-react';

interface ItemObtainedNotificationProps {
  itemId: string;
  itemName: string;
  itemImage?: string;
  itemSvgImage?: string;
  show: boolean;
  duration?: number; // 總顯示時長（毫秒），預設 2500ms
  onComplete?: () => void;
}

export default function ItemObtainedNotification({
  itemId,
  itemName,
  itemImage,
  itemSvgImage,
  show,
  duration = 1500, // 默認 1.5 秒，更快更流暢
  onComplete,
}: ItemObtainedNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      
      // 總時長後觸發完成回調
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onComplete) {
          setTimeout(() => onComplete(), 300); // 等待淡出動畫完成
        }
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [show, duration, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.8 }} // 更明顯的初始位置
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }} // 向上淡出，更自然
          transition={{
            type: 'spring',
            stiffness: 400, // 增加彈性，讓動畫更明顯
            damping: 25, // 減少阻尼，讓動畫更活潑
          }}
          className="fixed inset-0 z-[55] flex items-center justify-center pointer-events-none"
        >
          <div className="bg-dark-card/95 backdrop-blur-md border-2 border-orange-500/50 rounded-xl px-6 py-5 md:px-8 md:py-6 shadow-2xl max-w-sm mx-4">
            <div className="flex items-center gap-4">
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
              <div className="flex-1">
                <div className="text-xs text-orange-400/70 mb-1 font-medium uppercase tracking-wider">
                  獲得
                </div>
                <div className="text-lg md:text-xl font-semibold text-orange-400">
                  {itemName}
                </div>
              </div>
            </div>

            {/* 閃光效果 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{
                duration: 0.6,
                repeat: 1,
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-400/20 to-transparent rounded-xl pointer-events-none"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
