'use client';

import { useMemo, useCallback } from 'react';
import DigitWheel from './DigitWheel';

interface PasswordWheelInputProps {
  value?: string;
  onChange: (value: string) => void;
}

const DEFAULT_DIGITS: [number, number, number, number, number, number] = [1, 0, 1, 0, 4, 2];

function parseValueToDigits(value: string): [number, number, number, number, number, number] {
  return [
    Number(value[0]),
    Number(value[1]),
    Number(value[2]),
    Number(value[3]),
    Number(value[4]),
    Number(value[5]),
  ] as [number, number, number, number, number, number];
}

export default function PasswordWheelInput({ value, onChange }: PasswordWheelInputProps) {
  const digits = useMemo<[number, number, number, number, number, number]>(() => {
    if (value && /^\d{6}$/.test(value)) return parseValueToDigits(value);
    return DEFAULT_DIGITS;
  }, [value]);

  const setDigit = useCallback((index: number, n: number) => {
    const next: [number, number, number, number, number, number] = [...digits];
    next[index] = n;
    onChange(next.map(String).join(''));
  }, [digits, onChange]);

  return (
    <div className="rounded-xl border border-white/10 bg-dark-surface/40 p-4 shadow-[inset_0_0_32px_rgba(0,0,0,0.3)] ring-1 ring-white/5 sm:p-5">
      {/* 密碼讀數 */}
      <div
        className="mb-4 flex justify-center font-mono text-2xl font-semibold tabular-nums tracking-[0.35em] text-gray-300 sm:text-[1.75rem]"
        aria-hidden
      >
        <span className="text-industrial-orange/90">{digits[0]}</span>
        <span className="text-gray-400">{digits.slice(1).join('')}</span>
      </div>
      <div className="flex justify-center gap-2 sm:gap-3">
        <DigitWheel
          value={digits[0]}
          onChange={(n) => setDigit(0, n)}
          min={1}
          max={6}
          ariaLabel="第 1 位（1～6：第一章階段或章節）"
          accent
        />
        {[1, 2, 3, 4, 5].map((i) => (
          <DigitWheel
            key={i}
            value={digits[i]}
            onChange={(n) => setDigit(i, n)}
            min={0}
            max={9}
            ariaLabel={`第 ${i + 1} 位數字`}
          />
        ))}
      </div>
      <p className="mt-3 text-center text-xs text-gray-500">
        可滑動轉盤或點擊上下箭頭調整
      </p>
    </div>
  );
}
