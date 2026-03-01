'use client';

import { TutorialStepItem } from './tutorialSteps';
import { motion } from 'framer-motion';
import { ChevronRight, MapPin, MousePointer, Package, X } from 'lucide-react';

const iconMap = {
  MousePointer,
  Package,
  MapPin,
} as const;

export interface TutorialCardProps {
  step: TutorialStepItem;
  currentIndex: number;
  totalSteps: number;
  isLastStep: boolean;
  onNext: () => void;
  onClose: () => void;
}

export default function TutorialCard({
  step,
  currentIndex,
  totalSteps,
  isLastStep,
  onNext,
  onClose,
}: TutorialCardProps) {
  const IconComponent = iconMap[step.iconKey];
  const cardWidth = 'min(360px, calc(100vw - 2rem))';
  const cardHeight = '19rem';
  const textAreaHeight = '7rem';
  const buttonAreaHeight = '3.5rem';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none">
      <div className="pointer-events-auto w-full max-w-2xl px-4 flex justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="bg-dark-card/95 backdrop-blur-md border border-dark-border rounded-lg shadow-2xl p-6 flex flex-col flex-1 min-h-0"
          style={{ width: cardWidth, height: cardHeight }}
        >
          {/* 右上角：繼續（在左） + X 關閉（在右）與 NPC 對話框一致 */}
          <div className="flex-shrink-0 flex justify-end items-center gap-2 mb-3 -mt-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                isLastStep ? onClose() : onNext();
              }}
              className="px-4 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-400/50 rounded-lg transition-colors text-sm text-orange-400 hover:text-orange-300 font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <span>{isLastStep ? '知道了' : '繼續'}</span>
              {!isLastStep && <ChevronRight size={14} />}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="關閉"
            >
              <X size={20} />
            </button>
          </div>

          {/* 左圖右文：與 NPC 對話框相同版面 */}
          <div className="flex-shrink-0 flex flex-col">
            <div className="flex items-stretch gap-4" style={{ minHeight: '10rem' }}>
              <div
                className="flex-shrink-0 w-24 h-[7.5rem] md:w-[7.5rem] md:h-[9rem] overflow-hidden rounded-lg bg-dark-surface/50 border border-orange-400/30 shadow-lg ring-1 ring-white/10 flex items-center justify-center"
                style={{ minWidth: '6rem', minHeight: '7.5rem' }}
              >
                {IconComponent && (
                  <IconComponent className="w-12 h-12 md:w-14 md:h-14 text-orange-400" aria-hidden />
                )}
              </div>
              <div
                className="flex-1 min-w-0 flex flex-col bg-gray-900/30 rounded-lg p-4 border border-gray-500/30"
                style={{ minHeight: '10rem' }}
              >
                <div className="flex items-center gap-2 mb-2 flex-shrink-0">
                  <div className="w-2 h-2 rounded-full flex-shrink-0 bg-orange-400" />
                  <span className="text-sm font-medium text-gray-300 break-words min-w-[6em]">
                    操作教學
                  </span>
                </div>
                <div
                  className="text-sm text-gray-200 leading-relaxed break-words overflow-y-auto overflow-x-hidden pr-1"
                  style={{ height: textAreaHeight }}
                >
                  <div className="font-medium text-gray-100 mb-1">{step.title}</div>
                  <div>{step.description}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 下方：進度點 + 下一步／知道了（與 NPC 下方固定高度區一致） */}
          <div
            className="flex-shrink-0 flex items-center justify-between gap-2 mt-auto pt-3"
            style={{ height: buttonAreaHeight, minHeight: buttonAreaHeight }}
          >
            <div className="flex gap-1">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === currentIndex ? 'bg-orange-500 w-3' : 'bg-gray-600 w-1'
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={isLastStep ? onClose : onNext}
              className="px-4 py-2 text-sm bg-orange-600/80 hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>{isLastStep ? '知道了' : '下一步'}</span>
              {!isLastStep && <ChevronRight size={14} />}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
