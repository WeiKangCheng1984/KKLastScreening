'use client';

import type { Scene, Chapter } from '@/types/game';
import { useRouter } from 'next/navigation';
import { X, Code, MapPin, FileText } from 'lucide-react';

interface DeveloperPanelProps {
  onClose: () => void;
  onDisableDevMode?: () => void;
  /** 第一章：設旗標並跳轉至有劉隊頭像場景，測劉隊對話 */
  onTestCh1LiuReport?: () => void;
  /** 第一章：重置章尾旗標並開啟章尾 overlay（時間線＋態度填空＋本章印記） */
  onTestCh1Breakthrough?: () => void;
  /** 第二章：同上，測劉隊對話 */
  onTestCh2LiuReport?: () => void;
  /** 第二章：重置並開啟章尾（填空＋手機謎＋本章印記） */
  onTestCh2Breakthrough?: () => void;
  /** 第三章：同上，測劉隊對話 */
  onTestCh3LiuReport?: () => void;
  /** 第三章：重置並開啟章尾（兩題填空＋本章印記） */
  onTestCh3Breakthrough?: () => void;
  /** 第三章：開啟 log 對照面板 */
  onTestCh3Compare?: () => void;
  currentChapterId: string;
  currentSceneId: string;
  scenes: Record<string, Scene>;
  chapters: Record<string, Chapter>;
}

export default function DeveloperPanel({
  onClose,
  onDisableDevMode,
  onTestCh1LiuReport,
  onTestCh1Breakthrough,
  onTestCh2LiuReport,
  onTestCh2Breakthrough,
  onTestCh3LiuReport,
  onTestCh3Breakthrough,
  onTestCh3Compare,
  currentChapterId,
  currentSceneId,
  scenes,
  chapters,
}: DeveloperPanelProps) {
  const router = useRouter();
  const allScenes = Object.values(scenes);

  const handleSceneJump = (chapterId: string, sceneId: string) => {
    router.push(`/play/${chapterId}/${sceneId}`);
    onClose();
  };

  const hasChapterTests =
    onTestCh1LiuReport ||
    onTestCh1Breakthrough ||
    onTestCh2LiuReport ||
    onTestCh2Breakthrough ||
    onTestCh3LiuReport ||
    onTestCh3Breakthrough ||
    onTestCh3Compare;

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
            const chapterScenes = allScenes.filter((s) => s.chapterId === chapter.id);

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

        {hasChapterTests && (
          <div className="mt-6 border border-cyan-800/40 rounded-lg p-4 bg-cyan-950/15">
            <div className="text-sm font-semibold text-cyan-200/90 mb-2 flex items-center gap-2">
              <FileText size={16} />
              章節環節測試
            </div>
            <p className="text-xs text-gray-500 mb-3">
              需已載入遊戲引擎（任意 play 場景）。「與劉隊報告」會設旗標、存檔並跳場景；「破關章尾」會重置旗標並開啟章尾 overlay。
            </p>

            {(onTestCh1LiuReport || onTestCh1Breakthrough) && (
              <div className="mb-4 space-y-2">
                <div className="text-xs font-semibold text-cyan-300/80">第一章</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {onTestCh1LiuReport && (
                    <button
                      type="button"
                      onClick={() => {
                        onTestCh1LiuReport();
                        onClose();
                      }}
                      className="px-4 py-3 rounded-lg text-left bg-cyan-900/30 hover:bg-cyan-800/40 border border-cyan-600/40 text-cyan-100 text-sm font-medium transition-colors"
                    >
                      與劉隊報告（跳場景）
                    </button>
                  )}
                  {onTestCh1Breakthrough && (
                    <button
                      type="button"
                      onClick={() => {
                        onTestCh1Breakthrough();
                        onClose();
                      }}
                      className="px-4 py-3 rounded-lg text-left bg-cyan-900/30 hover:bg-cyan-800/40 border border-cyan-600/40 text-cyan-100 text-sm font-medium transition-colors"
                    >
                      破關報告（章尾）
                    </button>
                  )}
                </div>
              </div>
            )}

            {(onTestCh2LiuReport || onTestCh2Breakthrough) && (
              <div className="mb-4 space-y-2">
                <div className="text-xs font-semibold text-cyan-300/80">第二章</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {onTestCh2LiuReport && (
                    <button
                      type="button"
                      onClick={() => {
                        onTestCh2LiuReport();
                        onClose();
                      }}
                      className="px-4 py-3 rounded-lg text-left bg-cyan-900/30 hover:bg-cyan-800/40 border border-cyan-600/40 text-cyan-100 text-sm font-medium transition-colors"
                    >
                      與劉隊報告（跳場景）
                    </button>
                  )}
                  {onTestCh2Breakthrough && (
                    <button
                      type="button"
                      onClick={() => {
                        onTestCh2Breakthrough();
                        onClose();
                      }}
                      className="px-4 py-3 rounded-lg text-left bg-cyan-900/30 hover:bg-cyan-800/40 border border-cyan-600/40 text-cyan-100 text-sm font-medium transition-colors"
                    >
                      破關報告（章尾）
                    </button>
                  )}
                </div>
              </div>
            )}

            {(onTestCh3LiuReport || onTestCh3Breakthrough || onTestCh3Compare) && (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-cyan-300/80">第三章</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {onTestCh3LiuReport && (
                    <button
                      type="button"
                      onClick={() => {
                        onTestCh3LiuReport();
                        onClose();
                      }}
                      className="px-4 py-3 rounded-lg text-left bg-cyan-900/30 hover:bg-cyan-800/40 border border-cyan-600/40 text-cyan-100 text-sm font-medium transition-colors"
                    >
                      與劉隊報告（跳場景）
                    </button>
                  )}
                  {onTestCh3Breakthrough && (
                    <button
                      type="button"
                      onClick={() => {
                        onTestCh3Breakthrough();
                        onClose();
                      }}
                      className="px-4 py-3 rounded-lg text-left bg-cyan-900/30 hover:bg-cyan-800/40 border border-cyan-600/40 text-cyan-100 text-sm font-medium transition-colors"
                    >
                      破關報告（章尾）
                    </button>
                  )}
                  {onTestCh3Compare && (
                    <button
                      type="button"
                      onClick={() => {
                        onTestCh3Compare();
                        onClose();
                      }}
                      className="px-4 py-3 rounded-lg text-left bg-cyan-900/30 hover:bg-cyan-800/40 border border-cyan-600/40 text-cyan-100 text-sm font-medium transition-colors sm:col-span-2"
                    >
                      log 對照（三下拉）
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

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
