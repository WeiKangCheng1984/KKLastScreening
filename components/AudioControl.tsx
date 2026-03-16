'use client';

import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Headphones } from 'lucide-react';
import { audioManager } from '@/lib/audioManager';

export default function AudioControl() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(audioManager.getMuted());
  const [volumes, setVolumes] = useState(audioManager.getVolumeSettings());

  useEffect(() => {
    // 監聽音量變化
    const interval = setInterval(() => {
      setVolumes(audioManager.getVolumeSettings());
      setIsMuted(audioManager.getMuted());
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleMasterVolumeChange = (value: number) => {
    audioManager.setMasterVolume(value / 100);
    setVolumes(prev => ({ ...prev, masterVolume: value / 100 }));
  };

  const handleSFXVolumeChange = (value: number) => {
    audioManager.setSFXVolume(value / 100);
    setVolumes(prev => ({ ...prev, sfxVolume: value / 100 }));
  };

  const handleAmbientVolumeChange = (value: number) => {
    audioManager.setAmbientVolume(value / 100);
    setVolumes(prev => ({ ...prev, ambientVolume: value / 100 }));
  };

  const handleToggleMute = () => {
    audioManager.toggleMute();
    setIsMuted(audioManager.getMuted());
  };

  return (
    <div className="relative">
      {/* 音量控制按鈕 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center justify-center w-12 h-12 bg-dark-surface/90 backdrop-blur-md border border-dark-border/50 rounded-lg text-gray-300 hover:text-white hover:bg-dark-surface transition-all duration-200 shadow-lg"
        title="音量控制"
      >
        {isMuted ? (
          <VolumeX size={22} className="text-gray-300 group-hover:text-red-400 transition-colors" />
        ) : (
          <Volume2 size={22} className="text-gray-300 group-hover:text-orange-400 transition-colors" />
        )}
      </button>

      {/* 音量控制面板 */}
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* 控制面板 */}
          <div className="absolute top-14 right-0 z-50 w-64 bg-dark-surface/95 backdrop-blur-xl border border-dark-border rounded-lg shadow-2xl p-4 animate-slide-fade-in">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-200">音量控制</span>
                <button
                  onClick={handleToggleMute}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-dark-border rounded transition-colors"
                  title={isMuted ? '取消靜音' : '靜音'}
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
              </div>
            </div>

            {/* 總音量 */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Volume2 size={16} className="text-gray-400" />
                <span className="text-xs text-gray-400">總音量</span>
                <span className="text-xs text-gray-400 ml-auto">{Math.round(volumes.masterVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volumes.masterVolume * 100}
                onChange={(e) => handleMasterVolumeChange(Number(e.target.value))}
                className="w-full h-2 bg-dark-border rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>

            {/* 音效音量 */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Headphones size={16} className="text-gray-400" />
                <span className="text-xs text-gray-400">音效</span>
                <span className="text-xs text-gray-400 ml-auto">{Math.round(volumes.sfxVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volumes.sfxVolume * 100}
                onChange={(e) => handleSFXVolumeChange(Number(e.target.value))}
                className="w-full h-2 bg-dark-border rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>

            {/* 環境音音量 */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Music size={16} className="text-gray-400" />
                <span className="text-xs text-gray-400">環境音</span>
                <span className="text-xs text-gray-400 ml-auto">{Math.round(volumes.ambientVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volumes.ambientVolume * 100}
                onChange={(e) => handleAmbientVolumeChange(Number(e.target.value))}
                className="w-full h-2 bg-dark-border rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
