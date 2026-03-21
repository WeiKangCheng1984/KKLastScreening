import type { GameEngine } from '@/lib/gameEngine';
import type { Scene, Item, Dialog } from '@/types/game';

export interface Ch1ItemContext {
  engine: GameEngine;
  scene: Scene | null;
  items: Record<string, Item>;
  setCurrentDialog: (d: Dialog | null) => void;
}

/**
 * 處理 ch1 夢境空間特化的道具點擊邏輯。
 * 回傳 true 表示已處理。
 */
export function handleCh1ItemClick(itemId: string, ctx: Ch1ItemContext): boolean {
  const { engine, scene, items, setCurrentDialog } = ctx;
  const state = engine.getState();

  if (itemId === 'note' && scene?.id === 'ch1_sc2') {
    const result = engine.triggerEvent('read_note');
    if (result?.dialog) { setCurrentDialog(result.dialog); return true; }
  }

  if (itemId === 'mirror_shard' && scene?.id === 'ch1_sc2') {
    if (state.flags.beds_labels_revealed) {
      const item = scene?.items.find((i) => i.id === itemId);
      const itemData = items[itemId];
      setCurrentDialog({
        text: `${item?.name || '鏡片碎角'}\n\n${item?.description || ''}\n\n透過鏡片碎角的反射，你看到每張病床上都有模糊的標籤：「護理師」、「住院」、「主治」、「主任」。\n\n這些標籤有什麼意義嗎?`,
        type: 'item', svgImage: itemData?.svgImage, svgPosition: 'left',
      });
      return true;
    }
    if (state.interactions.includes('beds')) {
      const result = engine.triggerEvent('use_mirror_shard_on_beds');
      if (result?.dialog) { setCurrentDialog(result.dialog); return true; }
    } else {
      setCurrentDialog({ text: '你需要在病床附近使用這個道具。先點擊病床觀察一下。', type: 'narrator' });
      return true;
    }
  }

  if (itemId === 'consent_form' && scene?.id === 'ch1_sc3') {
    if (state.flags.diary_read) {
      const result = engine.triggerEvent('examine_consent_form');
      if (result?.dialog) { setCurrentDialog(result.dialog); return true; }
    } else {
      const item = scene?.items.find((i) => i.id === itemId);
      const itemData = items[itemId];
      if (item) {
        setCurrentDialog({ text: item.description, type: 'item', svgImage: itemData?.svgImage, svgPosition: 'left' });
        return true;
      }
    }
  }

  if (itemId === 'recorder' && scene?.id === 'ch1_sc3') {
    const result = engine.triggerEvent('play_recorder');
    if (result?.dialog) { setCurrentDialog(result.dialog); return true; }
  }

  if (itemId === 'diary' && scene?.id === 'ch1_sc3') {
    const result = engine.triggerEvent('read_diary');
    if (result?.dialog) { setCurrentDialog(result.dialog); return true; }
  }

  if (itemId === 'id_card' && scene?.id === 'ch1_sc5') {
    const result = engine.triggerEvent('read_id_back');
    if (result?.dialog) { setCurrentDialog(result.dialog); return true; }
  }

  if (itemId === 'coordinates') {
    const item = items[itemId];
    if (item) {
      setCurrentDialog({
        text: `**座標**\n\n**${item.description}**\n\n這是從拼箱排序中獲得的座標。`,
        type: 'item', svgImage: item.svgImage, svgPosition: 'left',
      });
      return true;
    }
  }

  if (itemId === 'pain_patch' && scene?.id === 'ch1_sc5') {
    if (!state.flags.pain_patch_found) {
      setCurrentDialog({ text: '你翻轉其中一片，背面藏著小字：\n\n**「二樓露台，箱子先肺後肝。」**', type: 'narrator' });
      engine.applyEffect({ type: 'setFlag', flag: 'pain_patch_found', value: true });
      return true;
    } else {
      setCurrentDialog({ text: '你已經看過止痛貼片盒背面的線索了。', type: 'narrator' });
      return true;
    }
  }

  return false;
}
