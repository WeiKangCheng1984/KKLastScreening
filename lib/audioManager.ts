// 音效管理器

/** 全遊戲統一 BGM：從開頭到結局同一首輪播，置於 public/audio/bgm/kk_bgm_title.mp3 */
export const GAME_BGM = '/audio/bgm/kk_bgm_title.mp3';

export class AudioManager {
  private ambientAudio: HTMLAudioElement | null = null;
  private currentAmbientPath: string | null = null;
  /** 手機端 autoplay 被擋時暫存，待使用者手勢後再播 */
  private pendingAmbientPath: string | null = null;
  private pendingAmbientVolume: number = 0.4;
  private sfxCache: Map<string, HTMLAudioElement> = new Map();
  private masterVolume: number = 0.7;
  private sfxVolume: number = 0.8;
  private ambientVolume: number = 0.3;
  private isMuted: boolean = false;

  constructor() {
    // 從 localStorage 恢復音量設定
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('audioSettings');
        if (saved) {
          const settings = JSON.parse(saved);
          this.masterVolume = settings.masterVolume ?? 0.7;
          this.sfxVolume = settings.sfxVolume ?? 0.8;
          this.ambientVolume = settings.ambientVolume ?? 0.3;
          this.isMuted = settings.isMuted ?? false;
        }
      } catch (e) {
        console.warn('無法從 localStorage 恢復音效設定:', e);
      }
    }
  }

  // 播放環境音（循環）
  playAmbient(audioPath: string, volume?: number): void {
    this.stopAmbient();
    if (!audioPath || this.isMuted) return;

    const vol = volume !== undefined ? volume : this.ambientVolume;
    try {
      const audio = new Audio(audioPath);
      audio.loop = true;
      audio.volume = vol * this.masterVolume;
      this.ambientAudio = audio;
      this.currentAmbientPath = audioPath;
      this.pendingAmbientPath = null;
      audio
        .play()
        .then(() => {})
        .catch(() => {
          // 手機/瀏覽器阻擋 autoplay：暫存，等使用者手勢後由 tryPlayPendingAmbient() 再播
          this.pendingAmbientPath = audioPath;
          this.pendingAmbientVolume = vol;
          if (this.ambientAudio === audio) {
            try {
              audio.pause();
              audio.currentTime = 0;
            } catch (_) {}
            this.ambientAudio = null;
            this.currentAmbientPath = null;
          }
        });
    } catch (error) {
      console.warn('載入環境音失敗:', error);
    }
  }

  /** 是否有待播的 BGM（autoplay 被擋時） */
  getPendingAmbientPath(): string | null {
    return this.pendingAmbientPath;
  }

  /** 使用者手勢後呼叫，嘗試播放暫存的 BGM（解決手機端 autoplay 政策） */
  tryPlayPendingAmbient(): void {
    if (!this.pendingAmbientPath || this.isMuted) return;
    const path = this.pendingAmbientPath;
    const vol = this.pendingAmbientVolume;
    this.pendingAmbientPath = null;
    this.playAmbient(path, vol);
  }

  /** 目前正在播放的環境音路徑，若未播放則為 null */
  getCurrentAmbientPath(): string | null {
    return this.currentAmbientPath;
  }

  // 環境音漸變
  fadeAmbient(targetVolume: number, duration: number = 1000): void {
    if (!this.ambientAudio) return;
    
    const startVolume = this.ambientAudio.volume;
    const volumeDiff = targetVolume - startVolume;
    const steps = 20;
    const stepTime = duration / steps;
    const stepVolume = volumeDiff / steps;
    
    let currentStep = 0;
    const fadeInterval = setInterval(() => {
      // 檢查 ambientAudio 是否仍然存在
      if (!this.ambientAudio) {
        clearInterval(fadeInterval);
        return;
      }
      
      currentStep++;
      if (currentStep >= steps) {
        if (this.ambientAudio) {
          this.ambientAudio.volume = targetVolume;
        }
        clearInterval(fadeInterval);
      } else {
        if (this.ambientAudio) {
          this.ambientAudio.volume = startVolume + (stepVolume * currentStep);
        }
      }
    }, stepTime);
  }

  // 播放音效（一次性）— 目前全遊戲僅保留 BGM，此函式暫不執行任何行為
  playSFX(_audioPath: string, _volume?: number): void {
    return;
  }

  // 播放互動音效（目前停用，僅保留 BGM）
  playInteractionSFX(_type: 'click' | 'hover' | 'collect' | 'puzzle' | 'error'): void {
    return;
  }

  // 停止環境音
  stopAmbient(): void {
    if (this.ambientAudio) {
      this.ambientAudio.pause();
      this.ambientAudio.currentTime = 0;
      this.ambientAudio = null;
    }
    this.currentAmbientPath = null;
    // 不清除 pendingAmbientPath，讓手勢後仍可重試
  }

  // 設定音量
  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    if (this.ambientAudio && this.ambientAudio.readyState >= 2) {
      // 確保音頻已載入
      try {
        this.ambientAudio.volume = this.ambientVolume * this.masterVolume;
      } catch (e) {
        console.warn('無法設置總音量:', e);
      }
    }
  }

  setSFXVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }

  setAmbientVolume(volume: number): void {
    this.ambientVolume = Math.max(0, Math.min(1, volume));
    if (this.ambientAudio && this.ambientAudio.readyState >= 2) {
      // 確保音頻已載入
      try {
        this.ambientAudio.volume = this.ambientVolume * this.masterVolume;
      } catch (e) {
        console.warn('無法設置環境音音量:', e);
      }
    }
    this.saveSettings();
  }

  // 靜音/取消靜音
  toggleMute(): void {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopAmbient();
    }
    // 取消靜音時，環境音需要由外部重新觸發播放
    this.saveSettings();
  }

  getMuted(): boolean {
    return this.isMuted;
  }

  // 獲取音量設定
  getVolumeSettings() {
    return {
      masterVolume: this.masterVolume,
      sfxVolume: this.sfxVolume,
      ambientVolume: this.ambientVolume,
      isMuted: this.isMuted,
    };
  }

  // 保存設定到 localStorage
  private saveSettings(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('audioSettings', JSON.stringify({
          masterVolume: this.masterVolume,
          sfxVolume: this.sfxVolume,
          ambientVolume: this.ambientVolume,
          isMuted: this.isMuted,
        }));
      } catch (e) {
        console.warn('無法保存音效設定:', e);
      }
    }
  }

  // 清理資源
  cleanup(): void {
    this.stopAmbient();
    this.sfxCache.clear();
  }
}

// 單例實例
export const audioManager = new AudioManager();

