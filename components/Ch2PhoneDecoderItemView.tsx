'use client';

import Ch2CrowPhoneRiddle from '@/components/Ch2CrowPhoneRiddle';
import { ch2ReportConfig } from '@/data/ch2ReportConfig';

export interface Ch2PhoneDecoderItemViewProps {
  onSuccess: () => void;
  onClose: () => void;
}

export default function Ch2PhoneDecoderItemView({ onSuccess, onClose }: Ch2PhoneDecoderItemViewProps) {
  return (
    <div className="rounded-2xl border border-zinc-600/80 bg-zinc-950/90 p-4 shadow-xl">
      <div className="flex items-center justify-between gap-2 mb-3">
        <p className="text-xs text-zinc-400 tracking-wide">技術組暫扣機 · 螢幕還能亮著</p>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-zinc-500 hover:text-zinc-300 px-2 py-1 rounded border border-zinc-700/80 hover:border-zinc-500"
        >
          收起
        </button>
      </div>
      <Ch2CrowPhoneRiddle config={ch2ReportConfig.ch2PhoneRiddle} onSuccess={onSuccess} embedded />
    </div>
  );
}
