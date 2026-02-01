'use client';

import { useState, useEffect } from 'react';
import { X, MousePointer, Package, MapPin, ChevronRight } from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'click',
    title: '點擊互動',
    description: '點擊場景中的物件進行探索和互動',
    icon: <MousePointer size={18} />,
  },
  {
    id: 'inventory',
    title: '道具欄',
    description: '點擊右上角的背包圖示查看收集的道具',
    icon: <Package size={18} />,
  },
  {
    id: 'navigation',
    title: '場景切換',
    description: '使用左右箭頭或場景選擇器切換場景',
    icon: <MapPin size={18} />,
  },
];

interface TutorialGuideProps {
  onComplete: () => void;
}

export default function TutorialGuide({ onComplete }: TutorialGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 檢查是否已看過教學
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial) {
      // 延遲顯示，讓場景先載入
      setTimeout(() => {
        setIsVisible(true);
      }, 1500);
    } else {
      onComplete();
    }
  }, [onComplete]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem('hasSeenTutorial', 'true');
    setIsVisible(false);
    onComplete();
  };

  if (!isVisible) return null;

  const step = tutorialSteps[currentStep];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] pointer-events-none">
      {/* 簡化的教學提示卡片 */}
      <div className="bg-dark-card/95 backdrop-blur-md border border-orange-500/50 rounded-lg px-4 py-3 shadow-xl pointer-events-auto animate-slide-up">
        <div className="flex items-center gap-3">
          {/* 圖示 */}
          <div className="text-orange-400 flex-shrink-0">
            {step.icon}
          </div>
          
          {/* 文字內容 */}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-200">{step.title}</div>
            <div className="text-xs text-gray-400 mt-0.5">{step.description}</div>
          </div>
          
          {/* 進度指示器 */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex gap-1">
              {tutorialSteps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === currentStep ? 'bg-orange-500 w-3' : 'bg-gray-600 w-1'
                  }`}
                />
              ))}
            </div>
            
            {/* 下一步/完成按鈕 */}
            <button
              onClick={currentStep === tutorialSteps.length - 1 ? handleComplete : handleNext}
              className="ml-2 px-3 py-1.5 text-xs bg-orange-600/80 hover:bg-orange-600 text-white rounded transition-all duration-200 flex items-center gap-1 group"
            >
              <span>{currentStep === tutorialSteps.length - 1 ? '知道了' : '下一步'}</span>
              {currentStep < tutorialSteps.length - 1 && (
                <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              )}
            </button>
            
            {/* 關閉按鈕 */}
            <button
              onClick={handleComplete}
              className="ml-1 text-gray-400 hover:text-white transition-colors p-1"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

