'use client';

import type { Scene, Chapter } from '@/types/game';
import { useRouter } from 'next/navigation';
import { X, Code, MapPin } from 'lucide-react';

interface DeveloperPanelProps {
  onClose: () => void;
  onDisableDevMode?: () => void;
  currentChapterId: string;
  currentSceneId: string;
  scenes: Record<string, Scene>;
  chapters: Record<string, Chapter>;
}

export default function DeveloperPanel({ onClose, onDisableDevMode, currentChapterId, currentSceneId, scenes, chapters }: DeveloperPanelProps) {
  const router = useRouter();
  const allScenes = Object.values(scenes);

  const handleSceneJump = (chapterId: string, sceneId: string) => {
    router.push(`/play/${chapterId}/${sceneId}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-dark-card to-dark-surface border-2 border-industrial-orange/50 rounded-2xl p-6 md:p-8 max-w-4xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-industrial-orange/20 rounded-lg">
              <Code size={24} className="text-industrial-orange" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-200">開發者模式</h3>
              <p className="text-xs text-gray-400 mt-1">快速跳轉到任何場景</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onDisableDevMode && (
              <button
                onClick={onDisableDevMode}
                className="px-3 py-1.5 text-xs text-amber-200 hover:text-white bg-amber-900/40 hover:bg-amber-800/50 border border-amber-600/50 rounded-lg transition-colors"
              >
                關閉開發者模式
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-dark-border rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {Object.values(chapters).map((chapter) => {
            const chapterScenes = allScenes.filter(s => s.chapterId === chapter.id);

            return (
              <div key={chapter.id} className="border border-dark-border rounded-lg p-4">
                <div className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                  <MapPin size={16} />
                  {chapter.name}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {chapterScenes.map((scene) => {
                    const isCurrentScene = currentChapterId === scene.chapterId && currentSceneId === scene.id;

                    return (
                      <button
                        key={scene.id}
                        onClick={() => handleSceneJump(scene.chapterId, scene.id)}
                        className={`text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                          isCurrentScene
                            ? 'bg-industrial-orange/20 border-2 border-industrial-orange text-orange-300'
                            : 'bg-dark-surface/50 border border-dark-border text-gray-300 hover:bg-dark-surface hover:border-industrial-orange/50 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm">{scene.name}</div>
                            <div className="text-xs text-gray-500 mt-1">{scene.id}</div>
                          </div>
                          {isCurrentScene && (
                            <div className="text-xs bg-industrial-orange text-white px-2 py-1 rounded-full">
                              當前
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 space-y-3">
          <div className="p-3 bg-yellow-950/20 border border-yellow-700/50 rounded-lg">
            <p className="text-xs text-yellow-300">
              提示：按 <kbd className="px-2 py-1 bg-dark-surface rounded text-xs">Ctrl+D</kbd> 或 <kbd className="px-2 py-1 bg-dark-surface rounded text-xs">Cmd+D</kbd> 快速開啟/關閉開發者模式
            </p>
          </div>
          <div className="p-3 bg-orange-950/20 border border-orange-700/50 rounded-lg">
            <p className="text-xs text-orange-300 mb-2">
              設置：隱藏開發者模式按鈕（可在 URL 中添加 ?dev=1 重新啟用）
            </p>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  localStorage.setItem('hideDevMode', 'true');
                  alert('開發者模式按鈕已隱藏。要重新顯示，請在 URL 中添加 ?dev=1 參數。');
                  onClose();
                }
              }}
              className="w-full px-3 py-2 bg-industrial-orange/20 hover:bg-industrial-orange/30 border border-industrial-orange/50 rounded-lg text-orange-300 text-xs transition-colors"
            >
              隱藏開發者模式按鈕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
