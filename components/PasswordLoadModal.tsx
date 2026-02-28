'use client';

import { useState, useCallback, useEffect } from 'react';
import PasswordWheelInput from './PasswordWheelInput';
import { parsePassword, getCanonicalStateForChapter } from '@/lib/chapterPassword';

interface PasswordLoadModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (chapterId: string) => void;
}

export default function PasswordLoadModal({ open, onClose, onSuccess }: PasswordLoadModalProps) {
  const [passwordValue, setPasswordValue] = useState('200000');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setPasswordValue('200000');
      setError('');
    }
  }, [open]);

  const handleConfirm = useCallback(() => {
    setError('');
    const parsed = parsePassword(passwordValue.trim() || '200000');
    if (!parsed) {
      setError('密碼錯誤');
      return;
    }
    try {
      const state = getCanonicalStateForChapter(parsed.chapter);
      if (typeof window !== 'undefined') {
        localStorage.setItem('gameState', JSON.stringify(state));
      }
      onSuccess(parsed.chapterId);
      onClose();
    } catch (e) {
      console.warn('載入存檔失敗:', e);
      setError('載入失敗，請再試一次。');
    }
  }, [passwordValue, onSuccess, onClose]);

  const handleClose = useCallback(() => {
    setError('');
    setPasswordValue('');
    onClose();
  }, [onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div
        className="w-full max-w-sm rounded-2xl border border-dark-border/50 bg-gradient-to-br from-dark-card to-dark-surface p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="password-modal-title"
      >
        <h2 id="password-modal-title" className="text-xl font-semibold text-gray-200 mb-2 text-center">
          從章節繼續
        </h2>
        <p className="text-sm text-gray-400 mb-4 text-center">輸入 6 位章節密碼（第 1 位 2～6 為章節）</p>

        <div className="mb-4">
          <PasswordWheelInput value={passwordValue} onChange={setPasswordValue} />
        </div>

        {error && (
          <p className="text-red-400 text-sm text-center mb-4" role="alert">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 py-2.5 px-4 rounded-lg border border-dark-border/50 bg-dark-surface/80 text-gray-300 hover:text-white hover:bg-dark-surface transition-colors"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-2.5 px-4 rounded-lg bg-gradient-to-r from-industrial-orange to-industrial-red text-white font-medium hover:opacity-90 transition-opacity"
          >
            確認
          </button>
        </div>
      </div>
    </div>
  );
}
