'use client';

import { useState, useEffect } from 'react';
import { tutorialSteps } from './tutorialSteps';
import TutorialCard from './TutorialCard';

interface TutorialGuideProps {
  onComplete: () => void;
}

export default function TutorialGuide({ onComplete }: TutorialGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial) {
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
  if (!step) return null;

  return (
    <TutorialCard
      step={step}
      currentIndex={currentStep}
      totalSteps={tutorialSteps.length}
      isLastStep={currentStep === tutorialSteps.length - 1}
      onNext={handleNext}
      onClose={handleComplete}
    />
  );
}
