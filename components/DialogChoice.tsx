'use client';

import { DialogChoice as DialogChoiceType } from '@/types/game';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface DialogChoiceProps {
  choices: DialogChoiceType[];
  onSelect: (choice: DialogChoiceType) => void;
  className?: string;
}

export default function DialogChoice({ choices, onSelect, className = '' }: DialogChoiceProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {choices.map((choice, index) => (
        <motion.button
          key={choice.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
          onClick={() => onSelect(choice)}
          className="w-full text-left px-4 py-3 bg-dark-surface/80 hover:bg-dark-surface border-2 border-dark-border hover:border-orange-500/50 rounded-lg transition-all duration-200 group relative overflow-hidden"
        >
          {/* 背景光效 */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/10 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* 內容 */}
          <div className="relative flex items-center justify-between">
            <span className="text-gray-200 group-hover:text-white transition-colors text-sm leading-relaxed">
              {choice.text}
            </span>
            <Check 
              size={18} 
              className="text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" 
            />
          </div>
          
          {/* 點擊波紋效果 */}
          <motion.div
            className="absolute inset-0 bg-orange-500/20 rounded-lg"
            initial={{ scale: 0, opacity: 0.5 }}
            whileTap={{ scale: 1, opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      ))}
    </div>
  );
}
