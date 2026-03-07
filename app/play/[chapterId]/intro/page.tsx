'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { chapters } from '@/data/chapters';
import { getChapterData } from '@/data/getChapterData';
import ChapterIntro from '@/components/ChapterIntro';

export default function ChapterIntroPage() {
  const params = useParams();
  const router = useRouter();
  const chapterId = params.chapterId as string;
  const [chapter, setChapter] = useState(chapters[chapterId]);
  const [isLoading, setIsLoading] = useState(true);
  const [firstSceneBackground, setFirstSceneBackground] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setFirstSceneBackground(null);

    if (!chapter) {
      router.push('/');
      return;
    }

    if (!chapter.intro) {
      router.push(`/play/${chapterId}/${chapter.scenes[0]}`);
      return;
    }

    getChapterData(chapterId).then((data) => {
      if (data && chapter.scenes?.[0]) {
        const firstScene = data.scenes[chapter.scenes[0]];
        setFirstSceneBackground(firstScene?.background ?? null);
      }
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  }, [chapterId, chapter, router]);

  const phoneFrameClass = 'w-full min-h-screen md:max-w-[clamp(428px,42vw,600px)] md:mx-auto md:min-h-screen md:shadow-2xl md:rounded-[2rem] md:overflow-hidden md:border md:border-dark-border/50 md:[transform:translateZ(0)]';

  if (isLoading || !chapter || !chapter.intro) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className={`flex items-center justify-center bg-dark-bg ${phoneFrameClass}`}>
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
            <p className="text-orange-300">載入中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      <div className={phoneFrameClass}>
        <ChapterIntro chapter={{ ...chapter, intro: chapter.intro }} firstSceneBackground={firstSceneBackground} />
      </div>
    </div>
  );
}
