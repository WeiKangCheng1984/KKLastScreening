'use client';

import type { Item } from '@/types/game';
import { Package, Sparkles, CheckCircle, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import SVGImage from './SVGImage';

interface InventoryProps {
  itemIds: string[];
  items: Record<string, Item>;
  onItemClick?: (itemId: string) => void;
  currentSceneId?: string;
}

export default function Inventory({ itemIds, items, onItemClick, currentSceneId }: InventoryProps) {
  const [newItems, setNewItems] = useState<Set<string>>(new Set());
  const [prevItemIds, setPrevItemIds] = useState<string[]>([]);

  // 檢測新道具
  useEffect(() => {
    const newItemSet = new Set<string>();
    itemIds.forEach(itemId => {
      if (!prevItemIds.includes(itemId)) {
        newItemSet.add(itemId);
      }
    });
    
    if (newItemSet.size > 0) {
      setNewItems(newItemSet);
      // 3秒後移除動畫標記
      setTimeout(() => {
        setNewItems(new Set());
      }, 3000);
    }
    
    setPrevItemIds(itemIds);
  }, [itemIds, prevItemIds]);

  if (itemIds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-dark-card border-2 border-dashed border-dark-border flex items-center justify-center mb-4">
          <Package size={24} className="text-gray-600" />
        </div>
        <p className="text-sm text-gray-500">背包是空的</p>
        <p className="text-xs text-gray-600 mt-1">探索場景收集道具</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 標題 */}
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-dark-card rounded-lg">
          <Package size={20} className="text-gray-300" />
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-200">背包</div>
          <div className="text-xs text-gray-500">{itemIds.length} 個道具</div>
        </div>
      </div>

      {/* 道具網格 */}
      <div className="grid grid-cols-2 gap-4">
        {itemIds.map(itemId => {
          const item = items[itemId];
          if (!item) return null;
          
          const isNew = newItems.has(itemId);
          
          return (
            <button
              key={itemId}
              onClick={() => {
                onItemClick?.(itemId);
                // 播放使用音效
                const audio = new Audio('/audio/sfx/kk_sfx_ui_item_use.mp3');
                audio.volume = 0.3;
                audio.play().catch(() => {});
              }}
              className={`group relative p-4 bg-gradient-to-br from-dark-card to-dark-surface border-2 rounded-xl transition-all duration-200 border-dark-border hover:border-gray-600 hover:scale-105 active:scale-95 gpu-accelerated ${
                isNew ? 'animate-item-fly-in border-orange-400/50 shadow-lg shadow-orange-500/30' : ''
              } ${item.usable ? 'hover:border-orange-400/50' : ''}`}
            >
              {/* 新道具閃光效果 */}
              {isNew && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-orange-500/20 to-transparent animate-flash pointer-events-none"></div>
              )}
              
              {/* 道具圖示區域 */}
              <div className={`flex items-center justify-center w-12 h-12 mb-3 bg-dark-bg/50 rounded-lg border border-dark-border group-hover:border-gray-500 transition-colors relative overflow-hidden ${
                isNew ? 'border-orange-400/50' : ''
              } ${item.usable ? 'group-hover:border-orange-400/50' : ''}`}>
                {item.svgImage ? (
                  <SVGImage
                    src={item.svgImage}
                    alt={item.name}
                    size="small"
                    lazy={true}
                    className="w-full h-full"
                  />
                ) : (
                  <Sparkles size={20} className={`transition-colors ${isNew ? 'text-orange-400' : 'text-gray-500'} ${item.usable ? 'group-hover:text-orange-400' : 'group-hover:text-gray-400'}`} />
                )}
                {item.usable && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border-2 border-dark-bg flex items-center justify-center z-10">
                    <CheckCircle size={10} className="text-white" />
                  </div>
                )}
              </div>

              {/* 道具名稱 */}
              <div className="text-left">
                <div className="text-sm font-medium transition-colors line-clamp-2 text-gray-300 group-hover:text-white">
                  {item.name}
                </div>
                {item.usable && (
                  <div className="text-xs text-orange-400 mt-1 flex items-center gap-1">
                    <CheckCircle size={12} />
                    <span>可使用</span>
                  </div>
                )}
                {item.collectible === false && (
                  <div className="text-xs text-gray-500 mt-1">不可收集</div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

