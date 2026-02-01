'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

export default function ProgressBar({ 
  progress, 
  label,
  showPercentage = true,
  className = '' 
}: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-300">{label}</span>
          {showPercentage && (
            <span className="text-sm text-orange-400 font-semibold">
              {Math.round(clampedProgress)}%
            </span>
          )}
        </div>
      )}
      <div className="w-full h-2 bg-dark-surface/50 rounded-full overflow-hidden border border-dark-border/50">
        <motion.div
          className="h-full bg-gradient-to-r from-orange-500 to-red-600"
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
