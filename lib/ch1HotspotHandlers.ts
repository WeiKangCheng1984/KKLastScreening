import type { GameEngine } from '@/lib/gameEngine';
import type { Scene, Item, Dialog, Effect } from '@/types/game';

export interface Ch1HotspotContext {
  engine: GameEngine;
  scene: Scene;
  items: Record<string, Item>;
  setCurrentDialog: (d: Dialog | null) => void;
  setActiveItemDetail: (detail: { id: string; name: string; image?: string; svgImage?: string; description: string }) => void;
  setShowUVLight: (v: boolean) => void;
  setShowDoor701Confirm: (v: boolean) => void;
  setShowDoor702Confirm: (v: boolean) => void;
  setShowWindow702Confirm: (v: boolean) => void;
  setShowDescendConfirm: (v: boolean) => void;
  addDialogsToQueue: (dialogs: Dialog[], interactionName?: string) => void;
  handleBroadcast: (dialog: Dialog) => void;
  safeTimeout: (fn: () => void, ms: number) => ReturnType<typeof setTimeout>;
  sceneViewRef: React.RefObject<{ triggerFlicker: (mode: 'light' | 'strong' | 'intense') => void } | null>;
}

/**
 * 處理 ch1 夢境空間（ch1_sc1~sc5）+ 緊急呼叫盒/抽屜等特化 hotspot。
 * 回傳 true 表示已處理，page.tsx 不需繼續往下跑通用邏輯。
 */
export function handleCh1Hotspot(hotspotId: string, ctx: Ch1HotspotContext): boolean {
  const {
    engine, scene, items,
    setCurrentDialog, setActiveItemDetail,
    setShowUVLight, setShowDoor701Confirm, setShowDoor702Confirm,
    setShowWindow702Confirm, setShowDescendConfirm,
    addDialogsToQueue, handleBroadcast, safeTimeout, sceneViewRef,
  } = ctx;
  const state = engine.getState();

  // 緊急呼叫盒 → UV 燈面板
  if (hotspotId === 'emergency_box') {
    engine.addInteraction('emergency_box');
    sceneViewRef.current?.triggerFlicker('light');
    setShowUVLight(true);
    return true;
  }

  // 抽屜互動
  if (hotspotId === 'drawer') {
    engine.addInteraction('drawer');
    const hasPin = state.inventory.includes('rusty_hairpin');
    const result = engine.triggerEvent(hasPin ? 'open_drawer' : 'try_open_drawer');
    if (result?.dialog) setCurrentDialog(result.dialog);
    return true;
  }

  // ─── ch1_sc1 ───
  if (hotspotId === 'door' && scene.id === 'ch1_sc1') {
    if (state.flags.door_701_open) {
      setShowDoor701Confirm(true);
      return true;
    }
  }

  // ─── ch1_sc2 ───
  if (scene.id === 'ch1_sc2') {
    if (hotspotId === 'beds') {
      if (!state.inventory.includes('mirror_shard')) {
        setCurrentDialog({ text: '每張病床上都有標籤，但字跡模糊不清。你需要工具才能看清上面的內容。', type: 'narrator' });
        return true;
      }
      if (!state.flags.beds_labels_revealed) {
        engine.addInteraction('beds');
        setCurrentDialog({ text: '病床上的標籤很模糊，看不清楚。你手中的鏡片碎角或許可以反射光線，讓你看清標籤上的字。', type: 'narrator' });
        return true;
      }
      return false;
    }
    if (hotspotId === 'mirror') {
      if (state.inventory.includes('mirror_shard')) {
        setCurrentDialog({ text: '破碎的鏡面映出你支離破碎的倒影。你已經撿起了地上的碎片，但鏡子本身依然破碎。', type: 'narrator' });
      } else {
        const hs = scene.hotspots.find((h) => h.id === 'mirror');
        if (hs?.hint) setCurrentDialog({ text: hs.hint, type: 'narrator' });
      }
      return true;
    }
    if (hotspotId === 'door_702') {
      if (!state.flags.door_702_open) {
        setCurrentDialog({ text: '702號病房的門緊閉著，無法進入。', type: 'narrator' });
      } else {
        setShowDoor702Confirm(true);
      }
      return true;
    }
    if (hotspotId === 'password_panel') return true;
    if (hotspotId === 'duty_schedule') {
      if (state.inventory.includes('note')) {
        const result = engine.triggerEvent('read_note');
        if (result?.dialog) {
          setCurrentDialog(result.dialog);
          return true;
        }
      }
      return false;
    }
  }

  // ─── ch1_sc3 ───
  if (scene.id === 'ch1_sc3') {
    if (hotspotId === 'wardrobe') {
      if (!state.flags.diary_read) {
        setCurrentDialog({ text: '衣櫃門緊閉。也許你應該先探索房間的其他地方。', type: 'narrator' });
        return true;
      }
      if (state.flags.jump_scare_triggered) {
        setCurrentDialog({ text: '衣櫃已經被打開了。假人還在那裡，但你不會再被嚇到。', type: 'narrator' });
        return true;
      }
      sceneViewRef.current?.triggerFlicker('intense');
      engine.addInteraction('wardrobe');
      const result = engine.triggerEvent('wardrobe_jump_scare');
      if (result?.dialog) { setCurrentDialog(result.dialog); return true; }
      const hs = scene.hotspots.find((h) => h.id === 'wardrobe');
      if (hs?.hint) { setCurrentDialog({ text: hs.hint, type: 'narrator' }); }
      return true;
    }
    if (hotspotId === 'monitor') {
      if (!state.flags.jump_scare_triggered) {
        setCurrentDialog({ text: '監控螢幕突然亮起。也許你應該先探索房間的其他地方。', type: 'narrator' });
        return true;
      }
      if (state.flags.monitor_activated) {
        setCurrentDialog({ text: '監控螢幕還在顯示你在 701 病房訓練的畫面。', type: 'narrator' });
        return true;
      }
      engine.addInteraction('monitor');
      const result = engine.triggerEvent('monitor_activation');
      if (result) {
        const dialogEffects = result.effects.filter((e: any) => e.type === 'showDialog');
        const broadcastD = dialogEffects.find((e: any) => e.dialog?.type === 'broadcast');
        if (broadcastD?.dialog) handleBroadcast(broadcastD.dialog);
        else if (dialogEffects[0]?.dialog) setCurrentDialog(dialogEffects[0].dialog);
        return true;
      }
      const hs = scene.hotspots.find((h) => h.id === 'monitor');
      if (hs?.hint) { setCurrentDialog({ text: hs.hint, type: 'narrator' }); }
      return true;
    }
    if (hotspotId === 'sofa_gap') {
      if (!state.flags.handle_location_revealed) {
        setCurrentDialog({ text: '沙發的縫隙裡似乎有什麼東西，但你看不清楚。也許你應該先查看其他線索。', type: 'narrator' });
        return true;
      }
      if (state.inventory.includes('door_handle')) {
        setCurrentDialog({ text: '你已經從沙發縫隙中找到了手把。', type: 'system' });
        return true;
      }
      engine.addInteraction('sofa_gap');
      const result = engine.triggerEvent('find_handle');
      if (result) {
        if (showItemFromEffects(result.effects, items, setActiveItemDetail)) return true;
        if (result.dialog) setCurrentDialog(result.dialog);
        else {
          const de = result.effects.find((e: any) => e.type === 'showDialog' && e.dialog);
          if (de?.dialog) setCurrentDialog(de.dialog);
        }
        return true;
      }
      const hs = scene.hotspots.find((h) => h.id === 'sofa_gap');
      if (hs?.hint) { setCurrentDialog({ text: hs.hint, type: 'narrator' }); }
      return true;
    }
    if (hotspotId === 'window') {
      if (!state.inventory.includes('door_handle')) {
        setCurrentDialog({ text: '落地窗被鎖住了，需要手把才能打開。\n\n手把可能在房間的某個角落，或者被藏在某個地方。', type: 'narrator' });
      } else {
        setCurrentDialog({ text: '你把手把插入落地窗的鎖孔，轉動。窗戶緩緩打開，外面的風吹進來，帶著鐵鏽和消毒水的味道。\n\n你終於可以離開這個「展示用的」房間了。', type: 'narrator' });
        safeTimeout(() => setShowWindow702Confirm(true), 2000);
      }
      return true;
    }
  }

  // ─── ch1_sc4 ───
  if (scene.id === 'ch1_sc4') {
    if (hotspotId === 'fixed_point_1' || hotspotId === 'fixed_point_2') {
      const has = state.inventory.includes('blank_nameplate') && state.inventory.includes('ceramic_shard') && state.inventory.includes('rust_remover');
      setCurrentDialog({
        text: has
          ? '欄杆上有許多固定點，但單一固定點無法承受你的體重。你需要選擇多個固定點形成支撐系統。前往垂降點，根據你收集的線索選擇正確的固定點組合。'
          : '欄杆上有固定點，但你需要收集更多線索才能判斷哪些是安全的。檢查你收集的道具。',
        type: 'narrator',
      });
      return true;
    }
    if (hotspotId === 'descend_point') {
      if (engine.hasFlag('puzzle_descend_solved')) {
        setShowDescendConfirm(true);
        return true;
      }
      const has = state.inventory.includes('blank_nameplate') && state.inventory.includes('ceramic_shard') && state.inventory.includes('rust_remover');
      if (!has) {
        setCurrentDialog({ text: '固定點需要線索才能判斷。', type: 'narrator' });
        return true;
      }
      return false;
    }
    if (hotspotId === 'toolbox') {
      if (!state.inventory.includes('rust_remover')) {
        setCurrentDialog({ text: '工具箱的鎖扣鏽蝕嚴重，需要除鏽劑才能打開。', type: 'narrator' });
        return true;
      }
      engine.addInteraction('toolbox');
      const result = engine.triggerEvent('open_toolbox');
      if (result) {
        if (showItemFromEffects(result.effects, items, setActiveItemDetail)) return true;
        const dialogs = result.effects.filter((e: any) => e.type === 'showDialog' && e.dialog).map((e: any) => e.dialog as Dialog);
        if (dialogs.length > 0) addDialogsToQueue(dialogs);
        return true;
      }
      return false;
    }
  }

  // ─── ch1_sc5 ───
  if (scene.id === 'ch1_sc5') {
    if (hotspotId === 'boxes_area') {
      if (state.flags.boxes_arranged) {
        setCurrentDialog({ text: '箱子已經按照優先級排列好了。', type: 'narrator' });
        return true;
      }
      engine.addInteraction('boxes_area');
      return false;
    }
    if (hotspotId === 'heart_box') {
      if (state.inventory.includes('id_card')) {
        setCurrentDialog({ text: '心臟箱已經被打開，身份證已經被你取走了。', type: 'narrator' });
        return true;
      }
      if (!state.flags.boxes_arranged) {
        setCurrentDialog({ text: '你需要先按照優先級排列這些箱子。', type: 'narrator' });
        return true;
      }
      engine.addInteraction('heart_box');
      const result = engine.triggerEvent('find_id_card');
      if (result) {
        if (showItemFromEffects(result.effects, items, setActiveItemDetail)) return true;
        const de = result.effects.find((e: any) => e.type === 'showDialog' && e.dialog);
        if (de?.dialog) setCurrentDialog(de.dialog);
        return true;
      }
      return false;
    }
    if (hotspotId === 'exit') {
      if (!state.flags.final_password_revealed && !state.flags.coordinates_revealed) {
        setCurrentDialog({ text: '逃生口需要座標密碼才能打開。你需要先完成拼箱排序或查看身份證背面。', type: 'narrator' });
        return true;
      }
      return false;
    }
    if (hotspotId === 'kidney_box' || hotspotId === 'liver_box' || hotspotId === 'lung_box') {
      const hs = scene.hotspots.find((h) => h.id === hotspotId);
      if (hs?.hint) {
        setCurrentDialog({ text: hs.hint, type: 'narrator' });
        return true;
      }
    }
  }

  return false;
}

function showItemFromEffects(
  effects: any[],
  items: Record<string, Item>,
  setActiveItemDetail: Ch1HotspotContext['setActiveItemDetail'],
): boolean {
  const addItemEffects = effects.filter((e: any) => e.type === 'addItem');
  if (addItemEffects.length > 0) {
    const itemId = addItemEffects[0]?.itemId;
    const item = itemId != null ? items[itemId] : undefined;
    if (item) {
      setActiveItemDetail({ id: item.id, name: item.name, image: item.image, svgImage: item.svgImage, description: item.description });
      return true;
    }
  }
  return false;
}
