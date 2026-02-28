'use client';

import { useState, useEffect, useCallback } from 'react';
import DigitWheel from './DigitWheel';

interface PasswordWheelInputProps {
  value?: string;
  onChange: (value: string) => void;
}

const DEFAULT_DIGITS: [number, number, number, number, number, number] = [2, 0, 0, 0, 0, 0];

export default function PasswordWheelInput({ value, onChange }: PasswordWheelInputProps) {
  const [digits, setDigits] = useState<[number, number, number, number, number, number]>(() => {
    if (value && /^\d{6}$/.test(value)) {
      return [
        Number(value[0]),
        Number(value[1]),
        Number(value[2]),
        Number(value[3]),
        Number(value[4]),
        Number(value[5]),
      ] as [number, number, number, number, number, number];
    }
    return DEFAULT_DIGITS;
  });

  const emit = useCallback(
    (d: [number, number, number, number, number, number]) => {
      onChange(d.map(String).join(''));
    },
    [onChange]
  );

  const setDigit = useCallback(
    (index: number, n: number) => {
      setDigits((prev) => {
        const next: [number, number, number, number, number, number] = [...prev];
        next[index] = n;
        emit(next);
        return next;
      });
    },
    [emit]
  );

  useEffect(() => {
    if (value && value !== digits.map(String).join('') && /^\d{6}$/.test(value)) {
      setDigits([
        Number(value[0]),
        Number(value[1]),
        Number(value[2]),
        Number(value[3]),
        Number(value[4]),
        Number(value[5]),
      ] as [number, number, number, number, number, number]);
    }
  }, [value]);

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
          min={2}
          max={6}
          ariaLabel="章節（2～6）"
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
