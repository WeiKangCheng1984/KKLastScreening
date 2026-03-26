'use client';

export interface Ch2TriWheelProps {
  value: [string, string, string];
  onChange: (next: [string, string, string]) => void;
  alphabet: string[];
  columnLabels: [string, string, string];
  /** 供 `aria-labelledby`／`id` 前綴 */
  ariaLabelPrefix?: string;
  className?: string;
}

/**
 * 三格字母選擇（左→右）；WRC 僅能由此對齊，不經單一文字框輸入。
 */
export default function Ch2TriWheel({
  value,
  onChange,
  alphabet,
  columnLabels,
  ariaLabelPrefix = 'ch2-tri-wheel',
  className = '',
}: Ch2TriWheelProps) {
  const options = [...new Set(alphabet)];

  const setAt = (index: 0 | 1 | 2, letter: string) => {
    const next: [string, string, string] = [...value];
    next[index] = letter;
    onChange(next);
  };

  return (
    <div className={`flex flex-wrap items-end justify-center gap-3 ${className}`}>
      {([0, 1, 2] as const).map((i) => {
        const id = `${ariaLabelPrefix}-col-${i}`;
        return (
          <div key={i} className="flex flex-col gap-1.5 min-w-[4.5rem]">
            <label htmlFor={id} className="text-[10px] text-zinc-500 text-center leading-tight px-0.5">
              {columnLabels[i]}
            </label>
            <select
              id={id}
              aria-label={`${columnLabels[i]}，選擇字母`}
              value={value[i]}
              onChange={(e) => setAt(i, e.target.value)}
              className="rounded-xl border border-zinc-600 bg-zinc-950/80 px-2 py-2.5 text-center text-sm font-mono text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500/35"
            >
              {options.map((letter) => (
                <option key={`${i}-${letter}`} value={letter}>
                  {letter}
                </option>
              ))}
            </select>
          </div>
        );
      })}
    </div>
  );
}
