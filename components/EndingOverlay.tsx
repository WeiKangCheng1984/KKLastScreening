'use client';

import { X } from 'lucide-react';

export type Ch6EndingId =
  | 'ending_truth'
  | 'ending_evidence_but_pr'
  | 'ending_pr_wins'
  | 'ending_stalemate';

const ENDINGS: Record<
  Ch6EndingId,
  { title: string; subtitle: string; body: string[]; toneTag: string }
> = {
  ending_truth: {
    title: '結局｜真相留在原始欄位裡',
    subtitle: '你封存了 raw log，也拒絕讓「遠端」那句話消失。',
    toneTag: '證據派 / 逆風',
    body: [
      '你把原始 log 的那幾個欄位摺好，像把一把不合時宜的鑰匙塞進口袋。',
      '記者會上有人想用「系統故障」結案，但你讓一句話留著：它不是自動發生的。',
      '當晚不會有人鼓掌，卻會有人開始查：那條線從哪裡進來、誰按下去、誰批准它一直存在。',
    ],
  },
  ending_evidence_but_pr: {
    title: '結局｜證據在手，口徑在台上',
    subtitle: '你封存了 raw log，但接受了張景衡的版本。',
    toneTag: '證據派 / 暫時妥協',
    body: [
      '你保住了原始欄位，保住了能追責的入口。',
      '但台上的敘事被修得很乾淨：主語變薄、責任變遠。',
      '這不是結案，而是延期。你知道證據還在，你也知道：下一次開口會更難。',
    ],
  },
  ending_pr_wins: {
    title: '結局｜版本勝出',
    subtitle: '你沒封存 raw log，也接受了張景衡的版本。',
    toneTag: '版本派 / 平安落地',
    body: [
      '你交出去的是整理過的故事：它完整、它順、它可以上新聞。',
      '記者會撐過去了，手機也不會響。',
      '只是某些欄位永遠不會再出現——你也永遠無法回答：那一雙手，究竟從哪裡伸進來。',
    ],
  },
  ending_stalemate: {
    title: '結局｜彼此都沒輸，但有人已經輸了',
    subtitle: '你沒封存 raw log，卻也拒絕讓那句話被刪掉。',
    toneTag: '兩邊都得罪 / 留白',
    body: [
      '你不讓「遠端」那句話消失，卻拿不出原始欄位把它釘死。',
      '台上台下都在等你補完括號，但你手上的紙只剩半句。',
      '你留下了一個不舒服的疑問：這不是結案，而是有人把結案做成一種流程。',
    ],
  },
};

export interface EndingOverlayProps {
  endingId: Ch6EndingId;
  onClose: () => void;
  onRestart?: () => void;
}

export default function EndingOverlay({ endingId, onClose, onRestart }: EndingOverlayProps) {
  const ending = ENDINGS[endingId];
  if (!ending) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4">
      <div className="relative w-full max-w-[720px] rounded-2xl border border-white/10 bg-neutral-950/90 shadow-2xl backdrop-blur">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full border border-white/10 bg-white/5 p-2 text-white/80 hover:bg-white/10 hover:text-white"
          aria-label="關閉結局"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6 md:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
              {ending.toneTag}
            </span>
          </div>

          <h2 className="text-xl font-semibold text-white md:text-2xl">{ending.title}</h2>
          <p className="mt-2 text-sm text-white/80 md:text-base">{ending.subtitle}</p>

          <div className="mt-5 space-y-3 text-sm leading-relaxed text-white/85 md:text-base">
            {ending.body.map((p, i) => (
              <p key={`${endingId}-p-${i}`}>{p}</p>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            {onRestart && (
              <button
                type="button"
                onClick={onRestart}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white/85 hover:bg-white/10"
              >
                重新開始
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-white px-4 py-2 font-medium text-black hover:bg-white/90"
            >
              回到遊戲
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

