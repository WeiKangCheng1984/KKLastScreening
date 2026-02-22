'use client';

import { useRouter } from 'next/navigation';
import { getStep, getNextPath } from '@/data/flowConfig';

const HUB_STEP_ID = 'ch2_hub';

export default function Ch2HubPage() {
  const router = useRouter();
  const step = getStep(HUB_STEP_ID);
  const choices = step?.type === 'chapter_hub' ? step.choices : [];

  const handleChoice = (sceneId: string) => {
    const path = getNextPath(HUB_STEP_ID, sceneId);
    router.push(path);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-dark-bg via-dark-surface to-dark-bg relative overflow-hidden px-4">
      <h1 className="text-2xl md:text-3xl font-bold text-orange-100/95 mb-2">
        第二章：城市碎片
      </h1>
      <p className="text-orange-200/80 text-sm md:text-base mb-10">
        選擇要前往的場景
      </p>

      <div className="flex flex-col gap-4 w-full max-w-md">
        {choices?.map((choice) => (
          <button
            key={choice.id}
            onClick={() => choice.sceneId && handleChoice(choice.sceneId)}
            className="w-full px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-orange-100 rounded-xl text-left font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {choice.label}
          </button>
        ))}
      </div>
    </div>
  );
}
