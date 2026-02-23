'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { chapters } from '@/data/chapters';
import ChapterIntro from '@/components/ChapterIntro';

export default function ChapterIntroPage() {
  const params = useParams();
  const router = useRouter();
  const chapterId = params.chapterId as string;
  const [chapter, setChapter] = useState(chapters[chapterId]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    
    if (!chapter) {
      // 章節不存在，重定向到首頁
      router.push('/');
      return;
    }

    // 檢查是否有導讀內容
    if (!chapter.intro) {
      // 沒有導讀內容，直接進入第一個場景
      router.push(`/play/${chapterId}/${chapter.scenes[0]}`);
      return;
    }

    setIsLoading(false);
  }, [chapterId, chapter, router]);

  const phoneFrameClass = 'w-full min-h-screen md:max-w-[428px] md:mx-auto md:min-h-screen md:shadow-2xl md:rounded-[2rem] md:overflow-hidden md:border md:border-dark-border/50 md:[transform:translateZ(0)]';

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

  // 已通過 !chapter.intro 檢查，傳入帶有 intro 的章節以符合 ChapterIntro 的 props；桌面版採手機型窄版置中
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      <div className={phoneFrameClass}>
        <ChapterIntro chapter={{ ...chapter, intro: chapter.intro }} />
      </div>
    </div>
  );
}
