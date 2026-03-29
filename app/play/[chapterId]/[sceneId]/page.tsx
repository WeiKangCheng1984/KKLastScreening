'use client';

import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, useRef, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { GameEngine } from '@/lib/gameEngine';
import { getNpcClickBehaviour } from '@/lib/chapterBehaviours';
import { sensitiveGatesByChapter, sensitiveBranchesByChapter } from '@/data/chapterBehaviourConfigs';
import { handleCh1Hotspot, type Ch1HotspotContext } from '@/lib/ch1HotspotHandlers';
import { handleCh1ItemClick } from '@/lib/ch1ItemHandlers';
import { Dialog, DialogChoice, Hotspot, type Effect } from '@/types/game';
import SceneView, { SceneViewRef } from '@/components/SceneView';
import BottomDock, { DOCK_NARROW_LEFT_RATIO, DOCK_NARROW_WIDTH } from '@/components/BottomDock';
import DialogBox from '@/components/DialogBox';
import NpcScenePortrait from '@/components/NpcScenePortrait';
import Inventory from '@/components/Inventory';
import SceneNameDisplay from '@/components/SceneNameDisplay';
import ItemObtainedNotification from '@/components/ItemObtainedNotification';
import PuzzleRenderer from '@/components/PuzzleRenderer';
import PulseClipReader from '@/components/PulseClipReader';
import UVLightPanel from '@/components/UVLightPanel';
import { ArrowLeft, Package, X, MapPin, ChevronDown, ChevronLeft, ChevronRight, Code, Menu, Puzzle, FlaskConical } from 'lucide-react';
import Link from 'next/link';
import { audioManager, GAME_BGM } from '@/lib/audioManager';
import { chapters } from '@/data/chapters';
import { getChapterData } from '@/data/getChapterData';
import DeveloperPanel from '@/components/DeveloperPanel';
import Ch3LogComparePanel from '@/components/Ch3LogComparePanel';
import AudioControl from '@/components/AudioControl';
import MuteAllButton from '@/components/MuteAllButton';
import { preloadSVGBatch } from '@/lib/svgLoader';
import NpcRightStrip from '@/components/NpcRightStrip';
import ChapterReportEditorHost from '@/components/ChapterReportEditorHost';
import Ch2PhoneDecoderItemView from '@/components/Ch2PhoneDecoderItemView';
import type { Ch6EndingId } from '@/components/Ch6ReportEditor';
import EndingOverlay from '@/components/EndingOverlay';
import HotspotZoomOverlay from '@/components/HotspotZoomOverlay';
import { m, AnimatePresence } from 'framer-motion';
import SensitiveGateOverlay from '@/components/SensitiveGateOverlay';
import { flagTestGroups, ch1ReportCoreFlagIds, npcTestByChapter, sensitiveChoiceGroups, flagToItemIds } from '@/data/flagTestConfig';
// 章節資料透過 useChapterData → getChapterData 動態載入
import { useChapterData } from '@/hooks/useChapterData';
import { useDialogQueue } from '@/hooks/useDialogQueue';
import { useInventoryDetail } from '@/hooks/useInventoryDetail';
import { getChapterConfig, CHOICE_ID_TO_REPORT_CHAPTER, type ReportChapterId } from '@/data/getChapterConfig';
import { DEV_TEST_LIU_SCENE, DEV_TEST_CH1_REPORT_RESET_FLAGS } from '@/lib/devTestConstants';
import { ch1ReportConfig } from '@/data/ch1ReportConfig';
import { tryHandleLiuQaDialogChoice } from '@/lib/liuQaDialogChoice';
import { resolveLiuNpcClick } from '@/lib/liuReportFlow';
import { getCh3PortraitIntroEventId } from '@/lib/ch3PortraitIntroEvents';
import { buildDialogFromNpcNode } from '@/lib/dialogUtils';

// 獲取當前章節的所有場景
const getCurrentChapterScenes = (chapterId: string): string[] => {
  const chapter = chapters[chapterId];
  return chapter ? chapter.scenes : [];
};

// 獲取當前場景的前一個和下一個場景
const getAdjacentScenes = (chapterId: string, sceneId: string): { prev: string | null; next: string | null } => {
  const chapterScenes = getCurrentChapterScenes(chapterId);
  const currentIndex = chapterScenes.indexOf(sceneId);
  
  if (currentIndex === -1) {
    return { prev: null, next: null };
  }
  
  return {
    prev: currentIndex > 0 ? chapterScenes[currentIndex - 1] : null,
    next: currentIndex < chapterScenes.length - 1 ? chapterScenes[currentIndex + 1] : null,
  };
};

function getHotspotCenter(hotspot: Hotspot): { x: number; y: number } {
  if (hotspot.shape === 'rect' && hotspot.coords.length >= 4) {
    const [x, , w, h] = hotspot.coords;
    return { x: (x + w) / 2, y: (hotspot.coords[1] + h) / 2 };
  }
  return { x: 0.5, y: 0.5 };
}

/** 張景衡 oneTime 事件已消耗、尚未完成 log 對照時的補位對話（與 talk_zhang_ch3 同選項） */
const CH3_ZHANG_COMPARE_REMINDER_DIALOG: Dialog = {
  text: '張景衡揚揚紙：「整理版你讀過了，技術角母帶欄位你也對過一次了吧？」\n\n「三格對齊再寫報告，才不會像幫別人收工。」',
  type: 'character',
  characterId: 'npc_zhang_jingheng',
  characterName: '張景衡（品牌特助）',
  characterExpression: 1,
  characterPosition: 'right',
  choices: [
    { id: 'ch3_open_compare_ui', text: '對照整理版與技術角讀到的原始殘留' },
    { id: 'close_only', text: '稍後再說' },
  ],
};

export default function PlayPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const chapterId = params.chapterId as string;
  const sceneId = params.sceneId as string;
  // 互動框顯示：預設開啟，僅在 ?debug=0 時關閉，方便開發時快速測試
  const debugParam = searchParams.get('debug');
  const debug = debugParam !== '0';
  // 開發者模式：由選單開關，並存入 localStorage（不再使用網址 ?dev=1）
  const [devMode, setDevMode] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('devMode') === 'true') {
      setDevMode(true);
    }
  }, []);
  const setDevModeAndPersist = useCallback((on: boolean) => {
    setDevMode(on);
    if (typeof window !== 'undefined') localStorage.setItem('devMode', on ? 'true' : 'false');
    if (!on) setShowDeveloperPanel(false);
  }, []);

  // 使用 useRef 保持 GameEngine 實例，避免重新掛載時重置狀態
  const engineRef = useRef<GameEngine | null>(null);
  if (!engineRef.current) {
    // 嘗試從 localStorage 恢復狀態
    let savedState = null;
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('gameState');
        if (saved) {
          savedState = JSON.parse(saved);
        }
      } catch (e) {
        console.warn('無法從 localStorage 恢復遊戲狀態:', e);
      }
    }
    engineRef.current = new GameEngine(savedState || undefined);
  }

  const engine = engineRef.current!;
  engine.setOnChange(() => setRefreshKey((k) => k + 1));

  const sceneViewRef = useRef<SceneViewRef>(null);
  const lastSceneClickRef = useRef<number>(0);

  const { chapterDataReady, scenes, items } = useChapterData(chapterId, sceneId, engineRef);

  const {
    currentDialog,
    setCurrentDialog,
    dialogQueue,
    setDialogQueue,
    addDialogsToQueue,
    handleDialogCloseBase,
  } = useDialogQueue({
    sceneViewRef,
  });
  const [zoomOverlay, setZoomOverlay] = useState<{
    active: boolean;
    background: string;
    zoomCenter: { x: number; y: number };
    dialogs: Dialog[];
    interactionName?: string;
  } | null>(null);
  const [currentPuzzle, setCurrentPuzzle] = useState<any>(null);
  const [puzzleError, setPuzzleError] = useState<string>('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [showInventory, setShowInventory] = useState(false);
  const [showPulseClip, setShowPulseClip] = useState(false);
  const [showUVLight, setShowUVLight] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const [showGameEnd, setShowGameEnd] = useState(false);
  const [showSceneSelector, setShowSceneSelector] = useState(false);
  const [showDoor702Confirm, setShowDoor702Confirm] = useState(false);
  const [showDoor701Confirm, setShowDoor701Confirm] = useState(false);
  const [showWindow702Confirm, setShowWindow702Confirm] = useState(false);
  const [showDescendConfirm, setShowDescendConfirm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const gameEndShownRef = useRef(false);
  const [showDeveloperPanel, setShowDeveloperPanel] = useState(false);
  const [showCh3LogCompare, setShowCh3LogCompare] = useState(false);
  /** 方案一：問敏感問題前的獨立抉擇（不共用 NPC 對話框） */
  const [sensitiveGate, setSensitiveGate] = useState<{
    step: 'ask_or_skip' | 'pick_one';
    npcId: string;
    text: string;
    choices: DialogChoice[];
  } | null>(null);

  const isDescendPuzzleCompleteRef = useRef(false);
  // 使用 useState 的函數形式確保服務器和客戶端初始狀態一致
  const [isSceneTransitioning, setIsSceneTransitioning] = useState(() => false);
  const [sceneLoading, setSceneLoading] = useState(() => false);
  const preloadedImagesRef = useRef<Set<string>>(new Set());
  const [chapterProgress, setChapterProgress] = useState(0);
  // 第一章章末：報告編輯器（取代解謎／推理舊路徑）
  /** 章尾報告 overlay：單一狀態取代六個布林 */
  const [activeReportChapterId, setActiveReportChapterId] = useState<ReportChapterId | null>(null);
  const [ch6EndingId, setCh6EndingId] = useState<Ch6EndingId | null>(null);
  /** 旗標測試面板：設定區點「旗標測試」後開啟，可逐一開關所有旗標 */
  const [showFlagTestPanel, setShowFlagTestPanel] = useState(false);
  /** 旗標測試面板目前分頁 */
  const [flagTestTab, setFlagTestTab] = useState<'flags' | 'interactions' | 'npc' | 'sensitive'>('flags');
  // 場景切換相關狀態
  // 使用 useState 的函數形式確保服務器和客戶端初始狀態一致
  const [showSceneName, setShowSceneName] = useState(() => false);
  const [currentSceneName, setCurrentSceneName] = useState(() => '');
  // 追蹤上次顯示的場景，確保每次切換都顯示
  const lastDisplayedSceneRef = useRef<string>('');
  /** 目前場景名稱顯示時長（ms），傳給 SceneNameDisplay 與父層計時一致 */
  const sceneNameDurationRef = useRef<number>(2000);
  // 追蹤場景名稱顯示計時器，避免重複設置
  const sceneNameTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sceneTransitionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pageTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const pageMountedRef = useRef(true);
  useEffect(() => {
    pageMountedRef.current = true;
    return () => {
      pageMountedRef.current = false;
      pageTimersRef.current.forEach(clearTimeout);
      pageTimersRef.current = [];
    };
  }, []);
  const safeTimeout = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      pageTimersRef.current = pageTimersRef.current.filter((t) => t !== id);
      if (pageMountedRef.current) fn();
    }, ms);
    pageTimersRef.current.push(id);
    return id;
  }, []);
  const { activeItemDetail, setActiveItemDetail } = useInventoryDetail();
  const chapterConfig = getChapterConfig(chapterId);

  // 用 ref 記錄所有「阻擋 hotspot 點擊」的 overlay 狀態，避免 handleHotspotClick 閉包過期問題
  const hotspotBlockedRef = useRef(false);

  // 劉隊章節開場：僅在 ch1/ch2 第一個場景、且尚未顯示過時觸發一次
  useEffect(() => {
    if (!engineRef.current) return;
    const engine = engineRef.current;
    const state = engine.getState();

    if (chapterId === 'ch1') {
      const flagKey = 'ch1_police_intro_shown';
      if (!state.flags[flagKey]) {
        const police = chapterConfig.reasoning?.police;
        const introLines = police?.introLines;
        if (introLines?.length) {
          addDialogsToQueue(
            introLines.map((text) => ({
              text,
              type: 'character' as const,
              characterId: 'npc_liu',
              characterName: '劉隊',
              characterExpression: 1 as const,
              characterPosition: 'right' as const,
            })),
            '警方簡報'
          );
          engine.applyEffect({ type: 'setFlag', flag: flagKey, value: true });
        } else if (police?.introLine) {
          addDialogsToQueue(
            [
              {
                text: police.introLine,
                type: 'character',
                characterId: 'npc_liu',
                characterName: '劉隊',
                characterExpression: 1,
                characterPosition: 'right',
              },
            ],
            '警方簡報'
          );
          engine.applyEffect({ type: 'setFlag', flag: flagKey, value: true });
        }
      }
    }

    if (chapterId === 'ch2' && sceneId === 'scene_ch2_cinema_entrance') {
      const flagKey = 'ch2_police_intro_shown';
      if (!state.flags[flagKey]) {
        const police = chapterConfig.reasoning?.police;
        if (police?.introLine) {
          addDialogsToQueue(
            [
              {
                text: police.introLine,
                type: 'character',
                characterId: 'npc_liu',
                characterName: '劉隊',
                characterExpression: 1,
                characterPosition: 'right',
              },
            ],
            '警方錄音前言'
          );
          engine.applyEffect({ type: 'setFlag', flag: flagKey, value: true });
        }
      }
    }
  }, [chapterId, sceneId, addDialogsToQueue]);

  // 第一章：完成三次敏感對話後的劉隊中段問候（階段二），並解鎖劉隊頭像
  useEffect(() => {
    if (!engineRef.current) return;
    const engine = engineRef.current;
    const state = engine.getState();
    const flags = state.flags || {};

    if (chapterId !== 'ch1') return;
    if (sceneId !== 'scene_ch1_cinema_a_hall') return;
    if (!flags.ch1_liu_mid_ready || flags.ch1_liu_mid_shown) return;

    addDialogsToQueue(
      [
        {
          text: '「還行嗎？有需要再跟我說。」\n\n「上面的人快到了，你趁現在多看兩眼。你慢慢看，我那邊還有事。」',
          type: 'character',
          characterId: 'npc_liu',
          characterName: '劉隊',
          characterExpression: 1,
          characterPosition: 'right',
        },
      ],
      '劉隊中段問候'
    );
    engine.applyEffect({ type: 'setFlag', flag: 'ch1_liu_mid_shown', value: true });
  }, [chapterId, sceneId, addDialogsToQueue]);

  // 同步所有會阻擋 hotspot 的 overlay 狀態到 ref，使 handleHotspotClick 不受閉包過期影響
  useEffect(() => {
    hotspotBlockedRef.current = !!(
      currentDialog ||
      zoomOverlay?.active ||
      currentPuzzle ||
      activeItemDetail ||
      activeReportChapterId ||
      sensitiveGate ||
      ch6EndingId ||
      showCh3LogCompare
    );
  });

  // 統一道具獲取處理函數
  const handleItemCollection = useCallback((hotspotId: string): boolean => {
    if (!engineRef.current) return false;
    const engine = engineRef.current;
    const scene = engine.getCurrentScene();
    if (!scene) return false;
    const state = engine.getState();
    
    // 步驟1：檢查是否有對應的事件映射
    const eventId = scene.hotspotEventMap?.[hotspotId];
    if (!eventId) return false; // 沒有對應事件，返回 false 繼續通用處理
    
    // 步驟2：檢查事件是否存在
    const event = scene.events.find(e => e.id === eventId);
    if (!event) {
      console.warn(`事件 ${eventId} 不存在於場景 ${scene.id}`);
      return false;
    }
    
    // 步驟3：檢查事件是否會添加道具（通過檢查 effects 中是否有 addItem）
    const eventAddItemEffects = event.effects.filter((e: any) => e.type === 'addItem');
    if (eventAddItemEffects.length === 0) {
      // 這個事件不會添加道具，可能不是道具獲取事件，返回 false
      return false;
    }
    
    // 步驟4：檢查是否已收集所有相關道具（快速檢查，避免不必要的處理）
    const collectedItems = eventAddItemEffects
      .map((e: any) => e.itemId)
      .filter((itemId: string) => state.inventory.includes(itemId));
    
    if (collectedItems.length > 0) {
      // 已經收集了部分或全部道具
      // 第二章車內場景：改為觸發對應的「重播」事件，讓阿蘇重新說明線索
      if (scene.id === 'scene_ch2_asu_car') {
        // 例如 eventId: examine_car_phone_main -> replay_car_phone_main
        const replayEventId = `replay_${eventId.replace(/^examine_/, '')}`;
        const replayEvent = scene.events.find(e => e.id === replayEventId);
        if (replayEvent && engine.checkEventRequirements(replayEvent)) {
          const replayResult = engine.triggerEvent(replayEventId);
          if (replayResult) {
            const dialogEffects = replayResult.effects.filter((e: any) => e.type === 'showDialog');
            const dialogs: Dialog[] = [];
            dialogEffects.forEach((effect: any) => {
              if (effect.dialog) dialogs.push(effect.dialog);
            });
            if (dialogs.length > 0) {
              addDialogsToQueue(dialogs);
            }
            return true; // 已處理，不需要繼續
          }
        }
      }

      // 其他場景：維持原本友好提示行為
      const itemNames = collectedItems
        .map((itemId: string) => {
          const item = items[itemId];
          return item?.name || itemId;
        })
        .join('、');
      setCurrentDialog({
        text: `你已經收集了${itemNames}。`,
        type: 'system',
      });
      return true; // 已處理，不需要繼續
    }
    
    // 步驟5：先記錄互動（確保 hasInteracted 檢查能通過）
    engine.addInteraction(hotspotId);
    
    // 步驟6：檢查事件前置條件（現在 hasInteracted 檢查應該能通過）
    const requirementsMet = engine.checkEventRequirements(event);
    if (!requirementsMet) {
      // 前置條件不滿足，顯示提示
      const hotspot = scene.hotspots.find(h => h.id === hotspotId);
      if (hotspot?.hint) {
        setCurrentDialog({
          text: hotspot.hint,
          type: 'narrator',
        });
      } else {
        setCurrentDialog({
          text: '這裡似乎需要滿足某些條件才能互動。',
          type: 'narrator',
        });
      }
      return true; // 已處理，不需要繼續
    }
    
    // 步驟7：處理特殊效果（閃爍、音效等）
    if (hotspotId === 'pulse_clip_spot') {
      // 脈搏夾使用時短暫閃爍
      if (sceneViewRef.current) {
        sceneViewRef.current.triggerFlicker('light');
      }
    } else if (hotspotId === 'recorder_spot') {
      // 錄音筆互動（音效已停用）
    } else if (hotspotId === 'mirror_shard_spot') {
      // 鏡片碎角玻璃互動（音效已停用）
    } else if (hotspotId === 'duty_schedule') {
      // 值班表紙張翻動互動（音效已停用）
    } else if (hotspotId === 'plant') {
      // 除鏽劑互動（音效已停用）
    }
    
    // 步驟8：觸發事件並處理道具獲得提示與對話
    // 先觸發事件以獲取道具與對話
    const result = engine.triggerEvent(eventId);
    
    if (!result) {
      // 事件沒有觸發，返回
      return false;
    }
    
    // 檢查是否有道具被添加與對話
    const addItemEffects = result.effects.filter((e: any) => e.type === 'addItem');
    const dialogEffects = result.effects.filter((e: any) => e.type === 'showDialog');

    if (addItemEffects.length > 0) {
      // 如果有道具被添加，用與背包相同的詳解卡呈現（activeItemDetail）
      const firstItemEffect = addItemEffects[0];
      const itemId = firstItemEffect?.itemId;
      const item = itemId != null ? items[itemId] : undefined;
      if (item) {
        setActiveItemDetail({
          id: item.id,
          name: item.name,
          image: item.image,
          svgImage: item.svgImage,
          description: item.description,
        });

        // 同時排入該事件的 showDialog（道具說明＋阿蘇／旁白敘事），取得道具時一併告知道具文案
        if (dialogEffects.length > 0) {
          const dialogs: Dialog[] = [];
          dialogEffects.forEach((effect: any) => {
            if (effect.dialog) dialogs.push(effect.dialog);
          });
          if (dialogs.length > 0) {
            const hotspot = scene.hotspots.find(h => h.id === hotspotId);
            addDialogsToQueue(dialogs, hotspot?.description);
          }
        }
        return true;
      }
    }

    // 沒有道具，正常處理對話
      // 處理對話顯示
      if (result) {
        const dialogEffects = result.effects.filter((e: any) => e.type === 'showDialog');
        const dialogs: Dialog[] = [];
        
        dialogEffects.forEach((effect: any) => {
          if (effect.dialog) {
            dialogs.push(effect.dialog);
          }
        });
        
        if (dialogs.length > 0) {
          const hotspot = scene.hotspots.find(h => h.id === hotspotId);
          addDialogsToQueue(dialogs, hotspot?.description);
        }
        
        return true; // 已處理
      } else {
        // 事件觸發失敗，可能是條件不滿足或已觸發過
        if (devMode) {
          console.warn(`事件 ${eventId} 觸發失敗`);
        }
      }
    
    // 事件觸發失敗，顯示 hotspot 提示
    const hotspot = scene.hotspots.find(h => h.id === hotspotId);
    if (hotspot?.hint) {
      const hintTitle = hotspot.description ?? hotspot.id;
      setCurrentDialog({
        text: hotspot.hint,
        type: 'narrator',
        title: hintTitle,
      });
    }
    return true; // 已處理，不需要繼續
  }, [engineRef, setCurrentDialog, addDialogsToQueue, items]);

  // 敏感抉擇專用 handler（資料驅動版）
  const handleSensitiveGateChoice = useCallback((choice: DialogChoice) => {
    if (!engineRef.current || !sensitiveGate) return;
    const engine = engineRef.current;
    const scene = engine.getCurrentScene();
    const gateNpcId = sensitiveGate.npcId;

    const checkAndTriggerLiuMid = () => {
      const st = engine.getState();
      const flags = st.flags || {};
      if (st.currentChapter !== 'ch1' || flags.ch1_liu_mid_shown) return;
      const completedCount = ['npc_lin_sensitive_done', 'npc_ashun_sensitive_done', 'npc_xiaozhang_sensitive_done', 'npc_zhou_jie_sensitive_done']
        .filter((key) => flags[key]).length;
      if (completedCount >= 3 && !flags.ch1_liu_mid_ready) {
        engine.applyEffect({ type: 'setFlag', flag: 'ch1_liu_mid_ready', value: true });
        if (st.currentScene === 'scene_ch1_cinema_a_hall') {
          addDialogsToQueue([{
            text: '「還行嗎？有需要再跟我說。」\n\n「上面的人快到了，你趁現在多看兩眼。你慢慢看，我那邊還有事。」',
            type: 'character', characterId: 'npc_liu', characterName: '劉隊', characterExpression: 1, characterPosition: 'right',
          }], '劉隊中段問候');
          engine.applyEffect({ type: 'setFlag', flag: 'ch1_liu_mid_shown', value: true });
        }
      }
    };

    // Skip → 隨機閒聊
    const allGateConfigs = sensitiveGatesByChapter[chapterId] ?? [];
    const skipCfg = allGateConfigs.find((c) => c.choices.skip.id === choice.id);
    if (skipCfg) {
      setSensitiveGate(null);
      queueMicrotask(() => {
        if (!engineRef.current) return;
        const d = engineRef.current.triggerRandomNpcDialog(skipCfg.npcId);
        if (d) setCurrentDialog(d);
      });
      return;
    }

    // Ask → 顯示 pick_one（選分支）
    const allBranchConfigs = sensitiveBranchesByChapter[chapterId] ?? [];
    const askCfg = allGateConfigs.find((c) => c.choices.ask.id === choice.id);
    if (askCfg) {
      const branchCfg = allBranchConfigs.find((b) => b.npcId === askCfg.npcId);
      if (branchCfg) {
        setSensitiveGate({
          step: 'pick_one', npcId: askCfg.npcId, text: branchCfg.pickOneText,
          choices: branchCfg.branches.map((b) => ({ id: b.choiceId, text: b.choiceText })),
        });
      }
      return;
    }

    // Branch → 進入 NPC 對話樹
    for (const branchCfg of allBranchConfigs) {
      const branch = branchCfg.branches.find((b) => b.choiceId === choice.id);
      if (!branch) continue;
      const npcId = branchCfg.npcId;

      // zhou_fragment 特殊分支：依是否已有碎片決定起始節點
      if (branch.special === 'zhou_fragment') {
        setSensitiveGate(null);
        const npc = scene?.npcs?.find((n: { id: string }) => n.id === npcId);
        if (!npc) return;
        const gateCfg = allGateConfigs.find((c) => c.npcId === npcId);
        if (gateCfg) engine.applyEffect({ type: 'setFlag', flag: gateCfg.doneFlag, value: true });
        checkAndTriggerLiuMid();
        const alreadyHave = !!engine.getState()?.flags?.black_fragment_found;
        engine.startNpcDialog(npcId, alreadyHave ? 'node_zhou_fragment_1_already_have' : branch.nodeId);
        const node = engine.getCurrentNpcDialogNode();
        if (node) {
          queueMicrotask(() => { setCurrentDialog(buildDialogFromNpcNode(node, npc)); });
        }
        return;
      }

      // 一般分支
      setSensitiveGate(null);
      const npc = scene?.npcs?.find((n: { id: string }) => n.id === npcId);
      if (!npc) return;
      const gateCfg = allGateConfigs.find((c) => c.npcId === npcId);
      if (gateCfg) engine.applyEffect({ type: 'setFlag', flag: gateCfg.doneFlag, value: true });
      checkAndTriggerLiuMid();
      engine.startNpcDialog(npcId, branch.nodeId);
      const node = engine.getCurrentNpcDialogNode();
      if (node) {
        queueMicrotask(() => { setCurrentDialog(buildDialogFromNpcNode(node, npc)); });
      }
      return;
    }
  }, [sensitiveGate, addDialogsToQueue, chapterId]);

  // 處理對話選擇
  const handleDialogChoice = useCallback((choice: DialogChoice) => {
    if (!engineRef.current) return;
    const engine = engineRef.current;
    const scene = engine.getCurrentScene();

    // 第二章：阿蘇「談案情」現在僅作為敘事提示，不再啟動 QA（QA 由劉隊結算）
    if (choice.id === 'ch2_asu_discuss_case') {
      setCurrentDialog({
        text: '阿蘇：「這些話，你之後可以跟劉隊講一次。」\n\n「他會想知道你現在看到的是哪一個版本。」',
        type: 'character',
        characterId: 'npc_asu',
        characterName: '阿蘇（警方技術組）',
        characterExpression: 1,
        characterPosition: 'right',
      });
      return;
    }
    if (choice.id === 'ch2_asu_not_now') {
      setCurrentDialog(null);
      return;
    }

    if (choice.id === 'ch3_open_compare_ui') {
      setCurrentDialog(null);
      setShowCh3LogCompare(true);
      return;
    }

    const LIU_KEEP_EXPLORING_IDS = new Set([
      'ch1_liu_keep_exploring',
      'ch1_liu_try_reasoning',
      'ch3_liu_keep_exploring',
      'ch4_liu_keep_exploring',
      'ch5_liu_keep_exploring',
      'ch6_liu_keep_exploring',
      'ch2_liu_keep_exploring',
    ]);
    if (LIU_KEEP_EXPLORING_IDS.has(choice.id)) {
      setCurrentDialog(null);
      return;
    }

    const reportChapterFromChoice = CHOICE_ID_TO_REPORT_CHAPTER[choice.id];
    if (reportChapterFromChoice) {
      setCurrentDialog(null);
      setActiveReportChapterId(reportChapterFromChoice);
      return;
    }

    if (
      tryHandleLiuQaDialogChoice(choice, {
        engine,
        setCurrentDialog,
      })
    ) {
      return;
    }
    const currentState = engine.getState();

    // NPC 關鍵對話模式：使用 handleNpcDialogChoice，並顯示下一節點或結束
    if (currentState.activeNpcDialogId) {
      engine.handleNpcDialogChoice(choice.id);
      const nextNode = engine.getCurrentNpcDialogNode();
      if (nextNode && scene?.npcs) {
        const npc = scene.npcs.find((n: { id: string }) => n.id === currentState.activeNpcDialogId);
        if (npc) {
          setCurrentDialog(buildDialogFromNpcNode(nextNode, npc));
        } else {
          engine.endNpcDialog();
          setCurrentDialog(null);
        }
      } else {
        // NPC 對話樹走完 → 從 config 查表標記敏感對話完成旗標
        const doneFlag = Object.values(sensitiveGatesByChapter).flat()
          .find(c => c.npcId === currentState.activeNpcDialogId)?.doneFlag;
        if (doneFlag) {
          engine.applyEffect({ type: 'setFlag', flag: doneFlag, value: true });
        }
        engine.endNpcDialog();
        setCurrentDialog(null);
      }
      return;
    }

    // 僅關閉對話的選項（無其他效果）
    if (choice.id === 'close_only') {
      setCurrentDialog(null);
      return;
    }

    // 一般對話選擇
    engine.handleDialogChoice(choice);

    // 第一章態度宣言四選一選完後：顯示推理句與進入第二章（handleDialogChoice 已設 ch1_attitude_declared）
    if (choice.id === 'ch1_attitude_procedure' || choice.id === 'ch1_attitude_evidence' || choice.id === 'ch1_attitude_human' || choice.id === 'ch1_attitude_both') {
      const followMap = ch1ReportConfig.attitude.attitudeFollowUpByChoiceId;
      const inferenceText =
        followMap[choice.id as keyof typeof followMap] ?? ch1ReportConfig.attitude.closingInference;
      setCurrentDialog({
        text: inferenceText,
        type: 'narrator',
        choices: [
          {
            id: 'to_ch2',
            text: '進入第二章',
            effects: [{ type: 'setFlag', flag: 'navigate_to_ch2_intro', value: true }],
          },
        ],
      });
      return;
    }

    if (choice.nextDialog) {
      setCurrentDialog(choice.nextDialog);
    }
  }, []);

  // 處理對話關閉：若有進行中的 NPC 關鍵對話則結束，使下次點擊該 NPC 可恢復隨機談話
  const handleDialogClose = useCallback(() => {
    const engine = engineRef.current;
    const activeNpcId = engine?.getState().activeNpcDialogId;

    if (activeNpcId) {
      const allGates = sensitiveGatesByChapter[chapterId] ?? [];
      const gateCfg = allGates.find((c) => c.npcId === activeNpcId);
      if (gateCfg) {
        engine!.applyEffect({ type: 'setFlag', flag: gateCfg.doneFlag, value: true } as any);
      }
      engine!.endNpcDialog();
    }

    handleDialogCloseBase(() => {
      if (engineRef.current) {
        const state = engineRef.current.getState();
        const nextChapterMap: Record<string, string> = {
          'navigate_to_ch2_intro': 'ch2',
          'navigate_to_ch3_intro': 'ch3',
          'navigate_to_ch4_intro': 'ch4',
          'navigate_to_ch5_intro': 'ch5',
        };
        for (const [flag, nextChapterId] of Object.entries(nextChapterMap)) {
          if (state.flags[flag]) {
            engineRef.current.applyEffect({ type: 'setFlag', flag, value: false });
            safeTimeout(() => router.push(`/play/${nextChapterId}/intro`), 500);
            return;
          }
        }
        if (!gameEndShownRef.current && state.flags.game_completed) {
          gameEndShownRef.current = true;
          safeTimeout(() => setShowGameEnd(true), 300);
          return;
        }
      }
      if (isDescendPuzzleCompleteRef.current) {
        isDescendPuzzleCompleteRef.current = false;
        safeTimeout(() => setShowDescendConfirm(true), 300);
      }
    });
  }, [handleDialogCloseBase, chapterId, safeTimeout, router]);

  // 開發者模式按鈕（移除快捷鍵，只保留按鈕）

  // 圖片預載入功能（優化版）
  useEffect(() => {
    if (!engineRef.current) return;
    const currentScene = engineRef.current.getCurrentScene();
    if (!currentScene) return;
    
    // 預載入當前場景圖片
    const preloadImage = (src: string) => {
      if (preloadedImagesRef.current.has(src)) return;
      
      // 使用 link preload 進行更高效的預載入
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
      
      // 同時使用 Image 對象確保載入
      const img = new Image();
      img.onload = () => {
        preloadedImagesRef.current.add(src);
        // 安全移除 link（如果還在 DOM 中）
        if (link.parentNode) {
          document.head.removeChild(link);
        }
      };
      img.onerror = () => {
        // 安全移除 link（如果還在 DOM 中）
        if (link.parentNode) {
          document.head.removeChild(link);
        }
      };
      img.src = src;
    };
    
    // 預載入當前場景
    preloadImage(currentScene.background);
    
    // 預載入相鄰場景圖片（立即載入，提升切換流暢度）
    const adjacentScenes = getAdjacentScenes(chapterId, sceneId);
    if (adjacentScenes.prev) {
      const prevScene = scenes[adjacentScenes.prev];
      if (prevScene) preloadImage(prevScene.background);
    }
    if (adjacentScenes.next) {
      const nextScene = scenes[adjacentScenes.next];
      if (nextScene) preloadImage(nextScene.background);
    }
    
    return () => {};
  }, [chapterId, sceneId]);

  // 統一的場景名稱顯示函數（必須在 useEffect 之前定義）
  const showSceneNameWithTimer = useCallback((sceneNameToShow: string, duration: number = 2000) => {
    // 清除舊的計時器（如果存在）
    if (sceneNameTimerRef.current) {
      clearTimeout(sceneNameTimerRef.current);
      sceneNameTimerRef.current = null;
    }
    if (sceneTransitionTimerRef.current) {
      clearTimeout(sceneTransitionTimerRef.current);
      sceneTransitionTimerRef.current = null;
    }
    sceneNameDurationRef.current = duration;
    // 設置場景名稱
    setCurrentSceneName(sceneNameToShow);
    setShowSceneName(true);
    setIsSceneTransitioning(true);
    setSceneLoading(true);
    // 設置場景名稱關閉計時器（與 duration 一致）
    sceneNameTimerRef.current = setTimeout(() => {
      setShowSceneName(false);
      setIsSceneTransitioning(false);
      setSceneLoading(false);
      sceneNameTimerRef.current = null;
    }, duration);
    
    // 保留 sceneTransitionTimerRef 以備將來使用，但現在不需要額外延遲
  }, []);

  const handleSceneNameComplete = useCallback(() => {
    setShowSceneName(false);
  }, []);

  // 根據 URL 初始化狀態（如果狀態與 URL 不一致）
  useEffect(() => {
    if (!engineRef.current) return;
    const engine = engineRef.current;
    const state = engine.getState();

    // 獲取當前場景信息
    const currentScene = scenes[sceneId];
    if (!currentScene) return;
    
    // 檢查是否為新場景（使用 ref 追蹤，確保每次 URL 改變都觸發）
    const isNewScene = lastDisplayedSceneRef.current !== sceneId;
    
    // 場景切換時啟動過渡動畫
    // 檢查條件：1) URL 改變（新場景） 2) 狀態與 URL 不一致
    const isSceneChange = isNewScene || 
                          state.currentChapter !== chapterId || 
                          state.currentScene !== sceneId;
    
    // 如果是新場景，顯示場景名稱（確保每次切換都有特效）
    if (isNewScene) {
      lastDisplayedSceneRef.current = sceneId;
      queueMicrotask(() => showSceneNameWithTimer(currentScene.name, 2000));
    }

    setCurrentDialog(null);
    setDialogQueue([]);
    setZoomOverlay(null);
    
    // 確保當前章節的所有場景都被標記為可訪問（添加到 visitedScenes）
    // 這樣玩家就可以在該章節的三個空間間自由切換
    const currentChapterScenes = getCurrentChapterScenes(chapterId);
    let scenesAdded = false;
    currentChapterScenes.forEach(sceneIdToAdd => {
      if (!state.visitedScenes.includes(sceneIdToAdd)) {
        state.visitedScenes.push(sceneIdToAdd);
        scenesAdded = true;
      }
    });
    
    // 確保當前場景被添加到 visitedScenes
    if (!state.visitedScenes.includes(sceneId)) {
      engine.applyEffect({
        type: 'changeScene',
        chapterId: chapterId,
        sceneId: sceneId,
      });
    } else if (state.currentChapter !== chapterId || state.currentScene !== sceneId || scenesAdded) {
      // 如果場景已在 visitedScenes 中，但狀態不一致，或新增了場景，更新當前場景
      engine.applyEffect({
        type: 'changeScene',
        chapterId: chapterId,
        sceneId: sceneId,
      });

      if (lastDisplayedSceneRef.current !== sceneId) {
        lastDisplayedSceneRef.current = sceneId;
        const newScene = scenes[sceneId];
        if (newScene) {
          queueMicrotask(() => showSceneNameWithTimer(newScene.name, 2000));
        }
      }
    }
    
    // 保存狀態到 localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('gameState', JSON.stringify(engine.getState()));
      } catch (e) {
        console.warn('無法保存遊戲狀態到 localStorage:', e);
      }
    }
    
    // 清理函數：清除計時器；導航切換場景時關閉大字，避免殘留
    return () => {
      if (sceneNameTimerRef.current) {
        clearTimeout(sceneNameTimerRef.current);
        sceneNameTimerRef.current = null;
      }
      if (sceneTransitionTimerRef.current) {
        clearTimeout(sceneTransitionTimerRef.current);
        sceneTransitionTimerRef.current = null;
      }
      setShowSceneName(false);
    };
  }, [chapterId, sceneId, showSceneNameWithTimer]);

  // 保存狀態到 localStorage（當狀態改變時）
  useEffect(() => {
    if (typeof window !== 'undefined' && engineRef.current) {
      try {
        localStorage.setItem('gameState', JSON.stringify(engineRef.current.getState()));
      } catch (e) {
        console.warn('無法保存遊戲狀態到 localStorage:', e);
      }
    }
  }, [refreshKey]); // engine 來自 useRef，不需要在依賴中

  // 進度追蹤和章節謎題解鎖檢查
  useEffect(() => {
    if (!engineRef.current || !sceneId) return;
    const engine = engineRef.current;

    // 計算當前場景進度
    engine.calculateExplorationProgress(sceneId);
    
    // 計算章節總進度
    const progress = engine.getChapterProgress(chapterId);
    setChapterProgress(progress);

  }, [sceneId, chapterId, refreshKey]);

  // SVG 預載入：場景切換時預載入相關 SVG
  useEffect(() => {
    if (!sceneId || !scenes[sceneId]) return;

    const currentScene = scenes[sceneId];
    const adjacentScenes = getAdjacentScenes(chapterId, sceneId);
    const svgPaths: string[] = [];

    // 收集當前場景的 SVG
    // 1. 道具的 SVG
    currentScene.items.forEach((item) => {
      if (item.svgImage) {
        svgPaths.push(item.svgImage);
      }
    });

    // 2. 場景事件的對話 SVG
    currentScene.events.forEach((event) => {
      event.effects.forEach((effect) => {
        if (effect.type === 'showDialog' && effect.dialog?.svgImage) {
          svgPaths.push(effect.dialog.svgImage);
        }
      });
    });

    // 3. 相鄰場景的 SVG（延遲預載入）
    const adjacentSceneIds = [adjacentScenes.prev, adjacentScenes.next].filter(Boolean) as string[];
    adjacentSceneIds.forEach((adjSceneId) => {
      const adjScene = scenes[adjSceneId];
      if (adjScene) {
        adjScene.items.forEach((item) => {
          if (item.svgImage) {
            svgPaths.push(item.svgImage);
          }
        });
      }
    });

    // 4. 當前背包中道具的 SVG
    const state = engine.getState();
    state.inventory.forEach((itemId) => {
      const item = items[itemId];
      if (item?.svgImage) {
        svgPaths.push(item.svgImage);
      }
    });

    // 去重並預載入
    const uniquePaths = Array.from(new Set(svgPaths));
    if (uniquePaths.length > 0) {
      // 立即預載入當前場景的 SVG
      const currentScenePaths = uniquePaths.filter((path) => {
        const isCurrentScene = currentScene.items.some((item) => item.svgImage === path) ||
          currentScene.events.some((event) =>
            event.effects.some((effect) =>
              effect.type === 'showDialog' && effect.dialog?.svgImage === path
            )
          );
        return isCurrentScene;
      });
      
      if (currentScenePaths.length > 0) {
        preloadSVGBatch(currentScenePaths);
      }

      // 延遲預載入相鄰場景的 SVG（不阻塞當前場景）
      const adjacentPaths = uniquePaths.filter((path) => !currentScenePaths.includes(path));
      if (adjacentPaths.length > 0) {
        const timerId = setTimeout(() => preloadSVGBatch(adjacentPaths), 1000);
        return () => clearTimeout(timerId);
      }
    }
  }, [chapterId, sceneId, engine]);


  // 監聽場景變化並導航（只在 engine 主動改變場景時導航）
  // 這個 useEffect 作為備用機制，主要場景切換在 handlePuzzleSolve 中處理
  useEffect(() => {
    if (!engineRef.current) return;
    
    // 延遲執行，確保第一個 useEffect（URL 同步）先完成
    const timer = setTimeout(() => {
      if (!engineRef.current) return;
      const state = engineRef.current.getState();
      const targetChapter = state.currentChapter;
      const targetScene = state.currentScene;
      
      // 只有在 engine 的狀態與 URL 不一致時才導航
      // 這表示 engine 的狀態被主動改變了（例如解決謎題），而不是 URL 改變
      if (targetChapter !== chapterId || targetScene !== sceneId) {
        const currentState = engineRef.current.getState();
        // 再次檢查，確保狀態確實改變了，且與當前 URL 不一致
        if (currentState.currentChapter !== chapterId || currentState.currentScene !== sceneId) {
          router.push(`/play/${currentState.currentChapter}/${currentState.currentScene}`);
        }
      }
    }, 500); // 延遲更長，確保 URL 同步完成
    
    return () => clearTimeout(timer);
  }, [refreshKey, router, chapterId, sceneId]); // engine 來自 useRef，不需要在依賴中

  // 獲取當前場景：以 engine 狀態為準，導航後若尚未同步則用 URL sceneId 從已載入 scenes 查詢，避免短暫顯示「場景不存在」
  const scene =
    engineRef.current?.getCurrentScene() ||
    (sceneId && scenes[sceneId] ? scenes[sceneId] : null);

  // 方案：依章節播放對應 BGM（進入場景時切歌）
  useEffect(() => {
    if (!sceneId) return;
    const chapterAmbientPath = chapters[chapterId]?.intro?.ambientAudio ?? GAME_BGM;
    if (audioManager.getCurrentAmbientPath() !== chapterAmbientPath) {
      audioManager.playAmbient(chapterAmbientPath, 0.4);
    }
    return () => {};
  }, [sceneId, chapterId]);

  // 觸發劇烈閃爍（廣播時使用）
  const triggerIntenseFlicker = useCallback(() => {
    if (sceneViewRef.current) {
      sceneViewRef.current.triggerFlicker('intense');
      safeTimeout(() => sceneViewRef.current?.triggerFlicker('strong'), 200);
      safeTimeout(() => sceneViewRef.current?.triggerFlicker('intense'), 400);
    }
  }, [safeTimeout]);

  // 統一的廣播處理函數（目前僅閃光+對話，音效已停用）
  const handleBroadcast = useCallback((dialog: Dialog) => {
    // 觸發劇烈閃爍（不再播放音效）
    triggerIntenseFlicker();
    // 顯示廣播對話
    setCurrentDialog(dialog);
  }, [triggerIntenseFlicker]);

  const handleHotspotClick = useCallback((hotspotId: string) => {
    if (!scene || !engineRef.current) {
      return;
    }

    // 極短暫點擊冷卻，避免玩家連點時連續觸發多個對話/事件
    const now = performance.now();
    if (now - lastSceneClickRef.current < 300) return;
    lastSceneClickRef.current = now;
    // 有正在顯示的對話或 overlay 時，暫停接受新的 hotspot 互動
    // 使用 ref 確保讀到最新狀態，避免閉包過期導致永遠阻擋
    if (hotspotBlockedRef.current) {
      return;
    }

    const engine = engineRef.current;
    // 密碼進入／intro 後首次進入場景時，engine 可能尚未與 URL 一致，導致 triggerEvent 用錯場景而無反應。
    // 點擊時強制以「畫面上顯示的 scene」為準，同步 engine，確保後續 handleItemCollection / triggerEvent 用對場景。
    const state = engine.getState();
    if (state.currentScene !== scene.id || state.currentChapter !== (scene.chapterId ?? chapterId)) {
      engine.applyEffect({
        type: 'changeScene',
        chapterId: scene.chapterId ?? chapterId,
        sceneId: scene.id,
      });
    }
    
    // 增加互動次數（用於閃爍頻率調整）
    setInteractionCount(prev => prev + 1);

    // 步驟1：嘗試統一道具獲取處理
    if (handleItemCollection(hotspotId)) {
      return; // 已處理，不需要繼續
    }

    // 步驟2：檢查是否有可解的謎題（優先於事件處理）
    // 先記錄互動，這樣謎題的 hasInteracted 需求才能通過
    engine.addInteraction(hotspotId);
    
    if (scene.puzzles && scene.puzzles.length > 0) {
      // 找出與當前 hotspot 相關且需求已滿足的謎題
      const availablePuzzles = scene.puzzles.filter(puzzle => {
        // 檢查謎題是否已經解決過
        const solvedFlag = `puzzle_${puzzle.id}_solved`;
        if (engine.hasFlag(solvedFlag)) return false;
        
        // 檢查謎題是否與當前 hotspot 相關
        const puzzleRequiresHotspot = puzzle.requirements?.some(
          req => req.type === 'hasInteracted' && req.hotspotId === hotspotId
        );
        
        // 如果謎題明確要求這個 hotspot，檢查所有需求
        if (puzzleRequiresHotspot) {
          const canSolve = engine.checkPuzzleRequirements(puzzle);
          if (canSolve && devMode) {
            console.log(`[謎題檢查] ${puzzle.id} 可解（明確要求 ${hotspotId}）`);
          }
          return canSolve;
        }
        
        // 如果謎題沒有明確要求這個 hotspot，但謎題ID暗示與 hotspot 相關
        // 例如：tv_silent_puzzle 與 tv hotspot 相關，stove_stuck_puzzle 與 gas_stove 相關
        const hotspotBaseName = hotspotId.replace('_spot', '').replace('_', '');
        const puzzleIdLower = puzzle.id.toLowerCase();
        const hotspotNameInPuzzleId = 
          puzzleIdLower.includes(hotspotId.toLowerCase()) ||
          puzzleIdLower.includes(hotspotBaseName.toLowerCase()) ||
          (hotspotId === 'tv' && puzzleIdLower.includes('tv')) ||
          (hotspotId === 'gas_stove' && puzzleIdLower.includes('stove'));
        
        if (hotspotNameInPuzzleId) {
          // 檢查所有需求（包括 hasInteracted，因為我們已經記錄了互動）
          const canSolve = engine.checkPuzzleRequirements(puzzle);
          if (canSolve && devMode) {
            console.log(`[謎題檢查] ${puzzle.id} 可解（名稱匹配 ${hotspotId}）`);
          }
          return canSolve;
        }
        
        return false;
      });
      
      if (devMode) {
        // 調試：顯示為什麼謎題沒有觸發
        const allPuzzles = scene.puzzles.filter(p => {
          const solvedFlag = `puzzle_${p.id}_solved`;
          return !engine.hasFlag(solvedFlag);
        });
        if (allPuzzles.length > 0) {
          console.log(`[謎題檢查] hotspot ${hotspotId} 沒有可解謎題`);
          allPuzzles.forEach(p => {
            const requirementsMet = engine.checkPuzzleRequirements(p);
            const requiresHotspot = p.requirements?.some(
              req => req.type === 'hasInteracted' && req.hotspotId === hotspotId
            );
            console.log(`  - ${p.id}: 需求滿足=${requirementsMet}, 要求hotspot=${requiresHotspot}`);
          });
        }
      }
    }

    // ch1 夢境空間 + 共用特化 hotspot（緊急呼叫盒、抽屜等）
    const ch1Ctx: Ch1HotspotContext = {
      engine, scene, items,
      setCurrentDialog, setActiveItemDetail,
      setShowUVLight, setShowDoor701Confirm, setShowDoor702Confirm,
      setShowWindow702Confirm, setShowDescendConfirm,
      addDialogsToQueue, handleBroadcast, safeTimeout, sceneViewRef,
    };
    if (handleCh1Hotspot(hotspotId, ch1Ctx)) return;

    // 步驟3：通用事件處理（處理不會添加道具的事件）
    // 先記錄此 hotspot 已互動，讓後續 examine_* 事件的 hasInteracted 檢查能通過（第二章車內等場景）
    engine.addInteraction(hotspotId);
    // 首先檢查 hotspotEventMap 中映射的事件
    const mappedEventId = scene.hotspotEventMap?.[hotspotId];
    let eventToTrigger = mappedEventId ? scene.events.find(e => e.id === mappedEventId) : null;
    
    // 如果映射的事件不存在或不滿足條件，檢查所有與該 hotspot 相關的事件
    if (!eventToTrigger || !engine.checkEventRequirements(eventToTrigger)) {
      // 查找所有與該 hotspot 相關的事件（通過 requirements 中的 hasInteracted 檢查）
      const relatedEvents = scene.events.filter(e => 
        e.requirements.some((req: any) => req.type === 'hasInteracted' && req.hotspotId === hotspotId)
      );
      
      // 找到第一個滿足條件的事件
      for (const event of relatedEvents) {
        if (engine.checkEventRequirements(event)) {
          eventToTrigger = event;
          break;
        }
      }
    }
    
    if (eventToTrigger) {
      const eventId = eventToTrigger.id;
      // 檢查事件是否會添加道具（如果會，應該已經被 handleItemCollection 處理了）
      const addItemEffects = eventToTrigger.effects.filter((e: any) => e.type === 'addItem');
      if (addItemEffects.length === 0) {
        // 這個事件不會添加道具，需要手動處理
        // 檢查事件需求（已經檢查過了，但再次確認）
        const requirementsMet = engine.checkEventRequirements(eventToTrigger);
        if (requirementsMet) {
          if (devMode) {
            console.log(`[事件觸發] 觸發事件: ${eventId} (hotspot: ${hotspotId})`);
          }
          
          const result = engine.triggerEvent(eventId);
          if (result) {
            const dialogEffects = result.effects.filter((e: Effect) => e.type === 'showDialog');
            if (dialogEffects.length > 0) {
              const dialogs: Dialog[] = [];
              dialogEffects.forEach((effect: Effect) => {
                if (effect.dialog) {
                  dialogs.push(effect.dialog);
                }
              });
              if (dialogs.length > 0) {
                const hotspot = scene.hotspots.find((h) => h.id === hotspotId);
                const presentation =
                  dialogEffects.find((e) => e.dialogPresentation)?.dialogPresentation ??
                  scene.defaultDialogPresentation ??
                  'zoom';
                if (presentation === 'dock') {
                  if (dialogs.length > 1) {
                    addDialogsToQueue(dialogs);
                  } else {
                    setCurrentDialog(dialogs[0] ?? null);
                  }
                } else {
                  setZoomOverlay({
                    active: true,
                    background: scene.background,
                    zoomCenter: hotspot ? getHotspotCenter(hotspot) : { x: 0.5, y: 0.5 },
                    dialogs,
                    interactionName: hotspot ? hotspot.description ?? hotspot.id : undefined,
                  });
                }
              }
            }
            return;
          }
        } else {
          if (devMode) {
            console.log(`[事件檢查] 事件 ${eventId} 需求未滿足`);
          }
        }
      }
    }

    // 如果沒有特殊處理，顯示 hotspot 提示
    const hotspot = scene.hotspots.find(h => h.id === hotspotId);
    if (hotspot?.hint) {
      const hintTitle = hotspot.description ?? hotspot.id;
      const hintDialog: Dialog = {
        text: hotspot.hint || hotspot.description || '',
        type: 'narrator',
        title: hintTitle,
      };
      const hintPresentation =
        hotspot.hintPresentation ?? scene.defaultDialogPresentation ?? 'zoom';
      if (hintPresentation === 'dock') {
        setCurrentDialog(hintDialog);
      } else {
        setZoomOverlay({
          active: true,
          background: scene.background,
          zoomCenter: getHotspotCenter(hotspot),
          dialogs: [hintDialog],
          interactionName: hintTitle,
        });
      }
    }
  }, [scene, handleItemCollection, addDialogsToQueue, chapterId, setCurrentDialog]); // engine 來自 useRef，不需要在依賴中

  const handleItemClick = useCallback((itemId: string) => {
    if (!engineRef.current) return;
    const engine = engineRef.current;

    // ch1 夢境空間特化道具邏輯
    if (handleCh1ItemClick(itemId, { engine, scene, items, setCurrentDialog })) return;

    const result = engine.useItem(itemId);
    const itemData = items[itemId];
    const showItemDetail = () => {
      if (itemData) {
        setActiveItemDetail({
          id: itemData.id,
          name: itemData.name,
          image: itemData.image,
          svgImage: itemData.svgImage,
          description: itemData.description,
        });
      }
    };

    if (result.success) {
      if (result.openPanel === 'pulse_clip') {
        setShowPulseClip(true);
      } else if (result.dialog) {
        setCurrentDialog(result.dialog);
      } else {
        showItemDetail();
      }
    } else {
      // 不受場景限制：用全域 items 顯示為詳解卡
      showItemDetail();
    }
  }, [scene]); // engine 來自 useRef，不需要在依賴中

  const handlePuzzleSolve = useCallback((input: string | string[] | number[] | Record<string, any>) => {
    if (!currentPuzzle || !engineRef.current) return;
    const engine = engineRef.current;
    
    // 檢查謎題是否已經解決過
    const solvedFlag = `puzzle_${currentPuzzle.id}_solved`;
    if (engine.hasFlag(solvedFlag)) {
      // 謎題已經解決過，顯示友好提示並關閉謎題界面
      setCurrentPuzzle(null);
      setCurrentDialog({
        text: '這個謎題已經解決過了。',
        type: 'narrator',
      });
      return;
    }
    
    const solved = engine.solvePuzzle(currentPuzzle.id, input);
    if (solved) {
      setPuzzleError(''); // 清除錯誤提示
      setCurrentPuzzle(null);
      
      // 獲取解決後的狀態（engine.solvePuzzle 已經應用了效果）
      const newState = engine.getState();
      
      // 檢查是否有對話效果
      const puzzle = scene?.puzzles.find(p => p.id === currentPuzzle.id);
      if (puzzle?.onSolve) {
        const dialogEffects = puzzle.onSolve.filter(e => e.type === 'showDialog');
        const triggerEventEffects = puzzle.onSolve.filter(e => e.type === 'triggerEvent');
        
        // 處理 triggerEvent 效果（謎題解決後可能觸發其他事件）
        if (triggerEventEffects.length > 0) {
          triggerEventEffects.forEach((effect: any) => {
            if (effect.eventId) {
              const eventResult = engine.triggerEvent(effect.eventId);
              if (eventResult) {
                // 處理事件產生的對話和道具
                const eventDialogEffects = eventResult.effects.filter((e: any) => e.type === 'showDialog');
                const eventAddItemEffects = eventResult.effects.filter((e: any) => e.type === 'addItem');
                
                // 如果有道具添加，用與背包相同的詳解卡呈現
                if (eventAddItemEffects.length > 0) {
                  const firstItemEffect = eventAddItemEffects[0];
                  const itemId = firstItemEffect?.itemId;
                  const item = itemId != null ? items[itemId] : undefined;
                  if (item) {
                    setActiveItemDetail({
                      id: item.id,
                      name: item.name,
                      image: item.image,
                      svgImage: item.svgImage,
                      description: item.description,
                    });
                    return;
                  }
                }
                
                // 沒有道具，正常處理對話
                const dialogs: Dialog[] = [];
                dialogEffects.forEach((effect: any) => {
                  if (effect.dialog) {
                    dialogs.push(effect.dialog);
                  }
                });
                
                if (dialogs.length > 0) {
                  addDialogsToQueue(dialogs);
                }
                
                // 添加事件的對話效果
                eventDialogEffects.forEach((e: any) => {
                  if (e.dialog) {
                    dialogEffects.push({
                      type: 'showDialog',
                      dialog: e.dialog,
                    });
                  }
                });
              }
            }
          });
        }
        
        // 檢查場景是否已改變（使用更新後的 state）
        const sceneChanged = newState.currentChapter !== chapterId || newState.currentScene !== sceneId;
        
        // 處理多個對話效果（使用對話隊列，讓玩家自行點選依序閱讀）
        if (dialogEffects.length > 0) {
          // 第四空間特殊處理：垂降謎題完成後，使用對話隊列顯示所有對話
          if (currentPuzzle.id === 'descend' && scene?.id === 'ch1_sc4') {
            // 設置標記，表示正在處理垂降謎題的對話隊列
            isDescendPuzzleCompleteRef.current = true;
            
            // 將所有對話（包括廣播）加入隊列
            const dialogs: Dialog[] = [];
            dialogEffects.forEach((effect: any) => {
              if (effect.dialog) {
                dialogs.push(effect.dialog);
              }
            });
            
            // 使用對話隊列機制顯示所有對話
            addDialogsToQueue(dialogs);
          } else if (currentPuzzle.id === 'final_exit' && scene?.id === 'ch1_sc5') {
            // 結局特殊處理：使用對話隊列顯示所有對話，確保依序顯示
            const dialogs: Dialog[] = [];
            dialogEffects.forEach((effect: any) => {
              if (effect.dialog) {
                dialogs.push(effect.dialog);
              }
            });
            // 使用對話隊列機制顯示所有對話
            addDialogsToQueue(dialogs);
          } else {
            // 其他謎題：使用原有邏輯（第一個對話立即顯示，後續使用對話隊列）
            // 顯示第一個對話（檢查是否為廣播類型）
            if (dialogEffects[0]?.dialog) {
              if (dialogEffects[0].dialog.type === 'broadcast') {
                handleBroadcast(dialogEffects[0].dialog);
              } else {
                setCurrentDialog(dialogEffects[0].dialog);
              }
            }
            
            // 如果有多個對話，將後續對話加入隊列
            if (dialogEffects.length > 1) {
              const remainingDialogs: Dialog[] = [];
              for (let i = 1; i < dialogEffects.length; i++) {
                const dialogEffect = dialogEffects[i];
                if (dialogEffect?.dialog) {
                  remainingDialogs.push(dialogEffect.dialog);
                }
              }
              // 使用對話隊列機制顯示後續對話
              addDialogsToQueue(remainingDialogs);
            }
          }
        }
        
        // 第二空間特殊處理：病床排列完成後觸發廣播事件
        if (currentPuzzle.id === 'bed_arrangement' && scene?.id === 'ch1_sc2') {
          safeTimeout(() => {
            const result = engine.triggerEvent('arrange_beds');
            if (result) {
              const dialogEffects = result.effects.filter((e: any) => e.type === 'showDialog');
              const broadcastDialog = dialogEffects.find((e: any) => e.dialog?.type === 'broadcast');
              if (broadcastDialog?.dialog) {
                handleBroadcast(broadcastDialog.dialog);
                safeTimeout(() => {
                  const narratorDialog = dialogEffects.find((e: any) => e.dialog?.type === 'narrator');
                  if (narratorDialog?.dialog) setCurrentDialog(narratorDialog.dialog);
                }, 3000);
              }
            }
          }, 2000);
        }
        
        // 第四空間特殊處理：垂降謎題完成後顯示確認對話框
        // 注意：確認對話框的顯示邏輯已經移到 handleDialogClose 中處理
        
        // 如果有場景切換，直接使用 router.push 切換場景
        // 注意：病床排列謎題和垂降謎題不再自動切換場景，改為讓玩家選擇
        if (sceneChanged && currentPuzzle.id !== 'bed_arrangement' && currentPuzzle.id !== 'descend') {
          // 計算所有對話的總顯示時間
          const totalDialogTime = dialogEffects.length * 3000;
          if (dialogEffects.length > 0) {
            safeTimeout(() => {
              router.push(`/play/${newState.currentChapter}/${newState.currentScene}`);
            }, totalDialogTime);
          } else {
            // 沒有對話，立即切換場景
            router.push(`/play/${newState.currentChapter}/${newState.currentScene}`);
          }
        }
        
        // 結局特殊處理：最終出口謎題
        // 注意：game_completed flag 已經在 onSolve 的最後設置，不需要重複設置
        // 所有對話會通過對話隊列機制依序顯示，最後一個對話關閉後會自動顯示結束畫面
      } else {
        // 如果 puzzle.onSolve 不存在，檢查 state 是否顯示場景已改變
        const sceneChanged = newState.currentChapter !== chapterId || newState.currentScene !== sceneId;
        if (sceneChanged) {
          router.push(`/play/${newState.currentChapter}/${newState.currentScene}`);
        }
      }
    } else {
      // 錯誤提示 - 在謎題組件內部顯示
      setPuzzleError('答案不正確，再試試看。');
    }
  }, [currentPuzzle, scene, chapterId, sceneId, router]); // engine 來自 useRef，不需要在依賴中
  
  // 獲取狀態並確保當前場景在 visitedScenes 中（額外檢查，防止遺漏）
  let state = engineRef.current?.getState() || {
    currentChapter: '',
    currentScene: '',
    inventory: [],
    flags: {},
    interactions: [],
    visitedScenes: [],
  };
  
  if (scene && engineRef.current && !state.visitedScenes.includes(scene.id)) {
    engineRef.current.applyEffect({
      type: 'changeScene',
      chapterId: scene.chapterId,
      sceneId: scene.id,
    });
    // 重新獲取狀態
    state = engineRef.current.getState();
  }

  // 獲取相鄰場景（必須在條件返回之前定義）
  const adjacentScenes = getAdjacentScenes(chapterId, sceneId);
  const prevScene = adjacentScenes.prev ? scenes[adjacentScenes.prev] : null;
  const nextScene = adjacentScenes.next ? scenes[adjacentScenes.next] : null;

  // 箭頭切換：嚴格順序「先大字特效 → 再切換場景」。先只顯示大字（不改 engine/URL），延遲後再切換，避免分拆載入或 early return 導致大字被蓋掉
  const handleSceneNavigation = useCallback((targetSceneId: string) => {
    if (!engineRef.current) return;
    const engine = engineRef.current;
    const targetScene = engine.getScenes()[targetSceneId];
    if (!targetScene) return;

    // 第二章場景解鎖條件：先完成大門口與車內一定程度探索，再解鎖阿蘇電腦場景
    if (chapterId === 'ch2') {
      const state = engine.getState();
      const flags = state.flags || {};
      const inv = state.inventory ?? [];

      // 1) 從第二章其他場景想直接跳到阿蘇車上：需要先跟劉隊談過任務
      if (targetSceneId === 'scene_ch2_asu_car' && !flags.ch2_task_from_liu) {
        setCurrentDialog({
          text:
            '劉隊看了你一眼：「先在這裡把話講清楚。」\n\n' +
            '「你知道自己要去找誰、要看什麼，再去找阿蘇。」',
          type: 'character',
          characterId: 'npc_liu',
          characterName: '劉隊（偵查隊）',
          characterExpression: 1,
          characterPosition: 'right',
        });
        return;
      }

      // 2) 想前往阿蘇電腦畫面：需先接到劉隊任務，且「阿蘇的車裡」探索達門檻（熱點 9 個、無道具；≈66% 等同至少互動 6 個熱點，與舊版 7 熱點×80% 對齊）
      if (targetSceneId === 'scene_ch2_asu_desktop') {
        const hasLiuTask = !!flags.ch2_task_from_liu;
        const carProgress = engine.calculateExplorationProgress('scene_ch2_asu_car');

        if (!hasLiuTask || carProgress < 66) {
          const pct = Math.round(carProgress);
          setCurrentDialog({
            text:
              '阿蘇把手從觸控板上收回來：「解碼還沒完成...」\n\n' +
              '「夜深了，我們卻都不能休息。我得把資料整理好，給你看。」',
            type: 'character',
            characterId: 'npc_asu',
            characterName: '阿蘇（警方技術組）',
            characterExpression: 1,
            characterPosition: 'right',
          });
          return;
        }
      }
    }

    // 第六章場景解鎖條件
    if (chapterId === 'ch6') {
      const state = engine.getState();
      const flags = state.flags || {};

      // 1) 想前往中控室：需要先接到劉隊任務
      if (targetSceneId === 'scene_ch6_control_room' && !flags.ch6_task_from_liu) {
        setCurrentDialog({
          text: '劉隊說：「先過來，我跟你說現在的狀況。」\n\n「第三起事故已經在發生了。」',
          type: 'character',
          characterId: 'npc_liu',
          characterName: '劉隊（偵查隊）',
          characterExpression: 1,
          characterPosition: 'right',
        });
        return;
      }

      // 2) 想前往記者會前廊：需要先接任務，且已完成 D7 選擇
      if (targetSceneId === 'scene_ch6_press_corridor') {
        if (!flags.ch6_task_from_liu || !flags.ch6_d7_done) {
          setCurrentDialog({
            text: '阿蘇說：「中控室那邊還沒做決定。」\n\n「你去做那個決定之後，再去後台。順序不能反。」',
            type: 'character',
            characterId: 'npc_asu',
            characterName: '阿蘇（警方技術組）',
            characterExpression: 1,
            characterPosition: 'right',
          });
          return;
        }
      }
    }

    // 第五章場景解鎖條件
    if (chapterId === 'ch5') {
      const state = engine.getState();
      const flags = state.flags || {};

      // 1) 想前往技術比對室：需要先接到劉隊任務
      if (targetSceneId === 'scene_ch5_log_lab' && !flags.ch5_task_from_liu) {
        setCurrentDialog({
          text: '劉隊在資料室角落看著你。\n\n「先過來，我跟你說這章你要搞清楚什麼。」',
          type: 'character',
          characterId: 'npc_liu',
          characterName: '劉隊（偵查隊）',
          characterExpression: 1,
          characterPosition: 'right',
        });
        return;
      }

      // 2) 想前往林子睿辦公室外圍：需要先接任務，且在技術比對室互動過兩個以上核心物件
      if (targetSceneId === 'scene_ch5_lin_office') {
        const coreLogLabHotspots = [
          'hotspot_ch5_log_diff',
          'hotspot_ch5_permission_tree',
        ];
        const interactedCount = coreLogLabHotspots.filter((id) => engine.hasInteracted(id)).length;

        if (!flags.ch5_task_from_liu || interactedCount < 2) {
          setCurrentDialog({
            text: '顧乃謙說：「這邊還沒看完。」\n\n「log 差異和權限樹——你弄清楚這兩個，再去那邊才有意義。」',
            type: 'character',
            characterId: 'npc_gu_naiqian',
            characterName: '顧乃謙（系統工程）',
            characterExpression: 1,
            characterPosition: 'right',
          });
          return;
        }
      }
    }

    // 第四章場景解鎖條件
    if (chapterId === 'ch4') {
      const state = engine.getState();
      const flags = state.flags || {};

      // 1) 想前往放映控制區：需要先接到劉隊任務
      if (targetSceneId === 'scene_ch4_control_panel' && !flags.ch4_task_from_liu) {
        setCurrentDialog({
          text: '劉隊站在樓梯間入口，表情說他有話要說。\n\n「先過來，我跟你說你要查什麼。」',
          type: 'character',
          characterId: 'npc_liu',
          characterName: '劉隊（偵查隊）',
          characterExpression: 1,
          characterPosition: 'right',
        });
        return;
      }

      // 2) 想前往散場大廳：需要先接任務，且在放映控制區互動過兩個以上核心物件
      if (targetSceneId === 'scene_ch4_main_hall') {
        const coreControlHotspots = [
          'hotspot_control_plugin_version',
          'hotspot_control_sync_record',
          'hotspot_control_risk_report',
        ];
        const interactedCount = coreControlHotspots.filter((id) => engine.hasInteracted(id)).length;

        if (!flags.ch4_task_from_liu || interactedCount < 2) {
          setCurrentDialog({
            text: '陳佑誠說：「控制區那邊還沒看完。」\n\n「那個版本記錄和回報單——你帶著問題來，比較有意義。」',
            type: 'character',
            characterId: 'npc_chen_youcheng',
            characterName: '陳佑誠（技術維護）',
            characterExpression: 1,
            characterPosition: 'right',
          });
          return;
        }
      }
    }

    // 第三章場景解鎖條件
    if (chapterId === 'ch3') {
      const state = engine.getState();
      const flags = state.flags || {};

      // 1) 想前往品牌應對室：需劉隊任務，且已看過交接白板里程碑
      if (targetSceneId === 'scene_ch3_brand_room') {
        if (!flags.ch3_task_from_liu) {
          setCurrentDialog({
            text:
              '劉隊站在大廳角落看著你。\n\n「先過來，我跟你說一下你要查什麼。」',
            type: 'character',
            characterId: 'npc_liu',
            characterName: '劉隊（偵查隊）',
            characterExpression: 1,
            characterPosition: 'right',
          });
          return;
        }
        if (!flags.ch3_milestone_whiteboard) {
          setCurrentDialog({
            text:
              '先在大廳把交接白板看完，再進應對室聽品牌方怎麼說、對照張景衡那份整理版。\n\n順序對了，進去才不會被話術牽著走。',
            type: 'narrator',
          });
          return;
        }
      }
    }

    lastDisplayedSceneRef.current = targetSceneId;

    // 步驟 1：只顯示大字（不改 engine、不 router），此時仍為舊場景，不會觸發「場景不存在」或 chapterData 重算
    showSceneNameWithTimer(targetScene.name, 4000);

    // 步驟 2：延遲後再切換場景與 URL（大字已穩定顯示）
    const sceneSwitchDelayMs = 1200;
    safeTimeout(() => {
      if (!engineRef.current) return;
      const eng = engineRef.current;
      eng.applyEffect({
        type: 'changeScene',
        chapterId: targetScene.chapterId,
        sceneId: targetSceneId,
      });
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('gameState', JSON.stringify(eng.getState()));
        } catch (e) {
          console.warn('無法保存遊戲狀態:', e);
        }
      }
      router.push(`/play/${targetScene.chapterId}/${targetSceneId}`);
    }, sceneSwitchDelayMs);
  }, [router, showSceneNameWithTimer, safeTimeout]);

  // 大字場景名稱改為 Portal 掛到 body，避免「場景不存在」/「載入場景…」early return 時被一併卸載
  const sceneNameOverlay =
    typeof document !== 'undefined' &&
    showSceneName &&
    currentSceneName &&
    createPortal(
      <SceneNameDisplay
        sceneName={currentSceneName}
        show={showSceneName}
        duration={sceneNameDurationRef.current || 2000}
        onComplete={handleSceneNameComplete}
      />,
      document.body
    );

  // Dock 版對話／提示顯示條件與寬度內縮（立繪預留空間）
  const hasDockDialog = !!currentDialog && !activeItemDetail && !showSceneName;

  const hasDialogPortrait = !!currentDialog?.characterId;
  const dialogPosition = currentDialog?.characterPosition ?? 'right';

  const dockBaseWrapper = 'relative h-full flex items-end justify-center';
  const dialogWrapperClass = dockBaseWrapper;

  const dialogStyle: CSSProperties | undefined = hasDialogPortrait
    ? dialogPosition === 'left'
      ? {
          marginLeft: `${DOCK_NARROW_LEFT_RATIO * 100}%`,
          maxWidth: `${DOCK_NARROW_WIDTH * 100}%`,
        }
      : {
          marginRight: `${DOCK_NARROW_LEFT_RATIO * 100}%`,
          maxWidth: `${DOCK_NARROW_WIDTH * 100}%`,
        }
    : undefined;

  if (!scene) {
    return (
      <>
        {sceneNameOverlay}
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-xl mb-4">場景不存在</div>
            <Link href="/" className="text-blue-400 hover:text-blue-300">
              返回首頁
            </Link>
          </div>
        </div>
      </>
    );
  }

  if (!chapterDataReady) {
    return (
      <>
        {sceneNameOverlay}
        <div className="min-h-screen bg-dark-bg flex items-center justify-center">
          <div className="text-center text-gray-400">載入場景…</div>
        </div>
      </>
    );
  }

  return (
    <>
      {sceneNameOverlay}
      <div className="relative min-h-screen bg-dark-bg overflow-hidden">
        {/* 桌面版：手機型窄版置中（約 428px），讓電腦玩家看到與手機相近的布局 */}
        <div className="w-full min-h-screen md:max-w-[clamp(428px,42vw,600px)] md:mx-auto md:min-h-screen md:relative md:shadow-2xl md:rounded-[2rem] md:overflow-hidden md:[transform:translateZ(0)] md:border md:border-dark-border/50">
          {/* 場景視圖 - 全屏沉浸式（不再因背包移動） */}
          <div className="absolute inset-0">
          {/* 場景過渡遮罩（載入指示器） */}
        {isSceneTransitioning && !showSceneName && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-fade-in flex items-center justify-center gpu-accelerated">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-orange-400/30 border-t-orange-400 rounded-full animate-spin mx-auto mb-4 gpu-accelerated"></div>
              <div className="text-gray-300 text-sm">載入場景中...</div>
            </div>
          </div>
        )}
        
        <div className={`h-full w-full flex flex-col items-center justify-center p-4 md:p-8 transition-opacity duration-500 gpu-accelerated ${
          isSceneTransitioning ? 'opacity-0' : 'opacity-100'
        }`}>
          {/* NPC 頭像列 - 方案 A：納入版面流，在箭頭與場景上方；方案 D：短螢幕改 fixed bottom */}
          {scene?.npcs && scene.npcs.length > 0 && !showSceneName && (
            <NpcRightStrip
              variant="inline"
              npcs={scene.npcs}
              activeNpcId={state?.activeNpcDialogId ?? undefined}
              hideWhenOverlay={!!(
                currentDialog ||
                zoomOverlay?.active ||
                currentPuzzle ||
                activeItemDetail ||
                activeReportChapterId ||
                sensitiveGate ||
                showCh3LogCompare
              )}
              onNpcClick={(npcId) => {
                if (!engineRef.current) return;
                const engine = engineRef.current;
                const st = engine.getState();

                if (chapterId === 'ch3') {
                  const introEventId = getCh3PortraitIntroEventId(sceneId, npcId);
                  if (introEventId) {
                    const introResult = engine.triggerEvent(introEventId);
                    if (introResult?.dialog) {
                      setCurrentDialog(introResult.dialog);
                      return;
                    }
                    if (
                      introEventId === 'talk_zhang_ch3' &&
                      npcId === 'npc_zhang_jingheng' &&
                      !st.flags.ch3_log_compare_done
                    ) {
                      setCurrentDialog(CH3_ZHANG_COMPARE_REMINDER_DIALOG);
                      return;
                    }
                  }
                }

                if (npcId === 'npc_liu') {
                  const liu = resolveLiuNpcClick({ chapterId, sceneId, engine });
                  if (liu.kind === 'noop') return;
                  if (liu.kind === 'random_liu') {
                    const rand = engine.triggerRandomNpcDialog('npc_liu');
                    if (rand) setCurrentDialog(rand);
                    return;
                  }
                  setCurrentDialog(liu.dialog);
                  return;
                }

                const behaviour = getNpcClickBehaviour(chapterId, {
                  state: st,
                  npcId,
                  sceneId,
                  casualTalkCount: engine.getNpcCasualTalkCount(npcId),
                });

                if (behaviour.type === 'sensitive_gate' && behaviour.payload) {
                  setSensitiveGate({
                    step: 'ask_or_skip',
                    npcId: behaviour.payload.npcId,
                    text: behaviour.payload.text,
                    choices: behaviour.payload.choices,
                  });
                  return;
                }

                if (behaviour.type === 'random_dialog') {
                  const dialog = engine.triggerRandomNpcDialog(npcId);
                  if (dialog) setCurrentDialog(dialog);
                }
              }}
              checkAvailability={(npc) => {
                if (!engineRef.current) return false;
                const engine = engineRef.current;
                if (npc.available === false) return false;
                if (npc.availabilityRequirement) {
                  return engine.checkRequirement(npc.availabilityRequirement);
                }
                return true;
              }}
            />
          )}
          {/* 場景圖外上方左右箭頭（縮小 90%） */}
          <div className="w-full max-w-[min(90vw,960px)] flex justify-between items-center mb-1 shrink-0">
            {adjacentScenes.prev ? (
              <button
                onClick={() => handleSceneNavigation(adjacentScenes.prev!)}
                className="scale-90 origin-center group flex items-center justify-center w-6 h-6 bg-dark-surface/90 backdrop-blur-md border border-dark-border/50 rounded-full text-gray-300 hover:text-white hover:bg-dark-surface hover:border-dark-border transition-all duration-200 shadow-lg hover:scale-100"
                title={prevScene ? `前往：${prevScene.name}` : '上一場景'}
              >
                <ChevronLeft size={12} className="text-gray-300 group-hover:text-blue-400 transition-colors" />
              </button>
            ) : <div className="w-6 h-6" />}
            {adjacentScenes.next ? (
              <button
                onClick={() => handleSceneNavigation(adjacentScenes.next!)}
                className="scale-90 origin-center group flex items-center justify-center w-6 h-6 bg-dark-surface/90 backdrop-blur-md border border-dark-border/50 rounded-full text-gray-300 hover:text-white hover:bg-dark-surface hover:border-dark-border transition-all duration-200 shadow-lg hover:scale-100"
                title={nextScene ? `前往：${nextScene.name}` : '下一場景'}
              >
                <ChevronRight size={12} className="text-gray-300 group-hover:text-blue-400 transition-colors" />
              </button>
            ) : <div className="w-6 h-6" />}
          </div>
          <div className={`relative w-full max-w-[min(90vw,960px)] aspect-square bg-dark-surface/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-dark-border/50 shadow-2xl transform transition-all duration-500 gpu-accelerated ${
            isSceneTransitioning ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
          }`}>
            <SceneView
              ref={sceneViewRef}
              scene={scene}
              onHotspotClick={handleHotspotClick}
              debug={debug}
              interactionCount={interactionCount}
            />

            {/* 立繪：NpcScenePortrait 預設 z-40，BottomDock z-30，立繪永遠在 Dock 對話框之上 */}
            {(() => {
              const effectiveDialog = currentDialog ?? dialogQueue[0] ?? null;
              const cid = effectiveDialog?.characterId;
              if (!cid) return null;
              return (
                <NpcScenePortrait
                  characterId={cid}
                  expression={effectiveDialog?.characterExpression ?? 1}
                  name={effectiveDialog?.characterName}
                  position={effectiveDialog?.characterPosition ?? 'right'}
                />
              );
            })()}

            {/* BottomDock：一般對話框（NPC／旁白／系統皆走 DialogBox + hotspot 變體） */}
            {hasDockDialog && (
              <BottomDock>
                <div className={dialogWrapperClass + ' w-full'} style={dialogStyle}>
                  <DialogBox
                    dialog={currentDialog!}
                    onClose={handleDialogClose}
                    autoClose={false}
                    onChoiceSelect={handleDialogChoice}
                    portraitOnScene={!!currentDialog!.characterId}
                    embedInParent
                    variant="hotspot"
                  />
                </div>
              </BottomDock>
            )}

            {/* 第一章互動框 Zoom 特寫覆蓋層 */}
            {zoomOverlay?.active && scene && (
              <HotspotZoomOverlay
                visible={true}
                background={zoomOverlay.background}
                zoomCenter={zoomOverlay.zoomCenter}
                dialogs={zoomOverlay.dialogs}
                interactionName={zoomOverlay.interactionName}
                onClose={() => setZoomOverlay(null)}
              />
            )}
          </div>
        </div>
      </div>

      {/* 全域互動層：模態優先權與中心/底部佈局 */}
      <div className="fixed inset-0 z-[60] pointer-events-none">
        <AnimatePresence>
          {activeReportChapterId && engineRef.current && (
            <ChapterReportEditorHost
              key={`report-${activeReportChapterId}`}
              chapterId={activeReportChapterId}
              getEngine={() => engineRef.current!}
              router={router}
              onDismiss={() => setActiveReportChapterId(null)}
              onCh6Ending={(id) => setCh6EndingId(id)}
            />
          )}
        </AnimatePresence>

        {showCh3LogCompare && (
          <Ch3LogComparePanel
            onClose={() => setShowCh3LogCompare(false)}
            onSolved={() => {
              if (!engineRef.current) return;
              const engine = engineRef.current;
              engine.applyEffect({ type: 'setFlag', flag: 'ch3_log_compare_done', value: true });
              engine.triggerEvent('ch3_check_report_ready');
              setShowCh3LogCompare(false);
            }}
          />
        )}

        {ch6EndingId && (
          <EndingOverlay
            endingId={ch6EndingId}
            onClose={() => {
              setCh6EndingId(null);
            }}
            onRestart={() => {
              setCh6EndingId(null);
              router.push('/');
            }}
          />
        )}

                {/* 旗標測試面板：設定 → 旗標測試 開啟；分頁：旗標 / 互動點 / NPC閒聊 / 敏感選擇 */}
        <AnimatePresence>
          {showFlagTestPanel && engineRef.current && (
            <m.div
              key="flag-test-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 pointer-events-auto"
            >
              <div className="w-full max-w-lg max-h-[85vh] flex flex-col bg-dark-surface border border-dark-border rounded-xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-dark-border shrink-0">
                  <h2 className="text-lg font-bold text-orange-400">旗標測試</h2>
                  <button
                    type="button"
                    onClick={() => setShowFlagTestPanel(false)}
                    className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
                  >
                    <X size={22} />
                  </button>
                </div>
                <div className="flex border-b border-dark-border shrink-0">
                  {(['flags', 'interactions', 'npc', 'sensitive'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setFlagTestTab(tab)}
                      className={`px-3 py-2 text-sm font-medium transition-colors ${
                        flagTestTab === tab
                          ? 'text-orange-400 border-b-2 border-orange-400 bg-white/5'
                          : 'text-gray-400 hover:text-orange-200'
                      }`}
                    >
                      {tab === 'flags' && '旗標'}
                      {tab === 'interactions' && '互動點'}
                      {tab === 'npc' && 'NPC閒聊'}
                      {tab === 'sensitive' && '敏感選擇'}
                    </button>
                  ))}
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
                  {flagTestTab === 'flags' && (
                    <>
                      <p className="text-xs text-gray-500 mb-2">
                        以下開關直接寫入遊戲 state（旗標、背包）。開＝程式視為已探索／已互動；有對應道具的旗標會一併增減背包。
                      </p>
                      {chapterId === 'ch1' && (
                        <div className="space-y-2 pb-3 border-b border-dark-border">
                          <div className="text-ui-caption text-orange-400/90 mb-2">第一章報告快捷</div>
                          <button
                            type="button"
                            onClick={() => {
                              if (!engineRef.current) return;
                              const ch1Scenes = getCurrentChapterScenes('ch1');
                              engineRef.current.applyEffect({ type: 'markScenesVisited', sceneIds: ch1Scenes });
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 bg-dark-card/50 hover:bg-dark-card border border-dark-border rounded-lg text-gray-300 hover:text-orange-200 text-sm font-medium"
                          >
                            <MapPin size={14} />
                            標記三場景已拜訪
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (!engineRef.current) return;
                              const engine = engineRef.current;
                              const ch1Scenes = getCurrentChapterScenes('ch1');
                              ch1ReportCoreFlagIds.forEach((f) => engine.applyEffect({ type: 'setFlag', flag: f, value: true }));
                              ['schedule_modified_found', 'clue_manual_light_control', 'projector_notes_found', 'clue_clean_trash'].forEach(
                                (flag) => engine.applyEffect({ type: 'setFlag', flag, value: true })
                              );
                              engine.applyEffect({ type: 'markScenesVisited', sceneIds: ch1Scenes });
                              ['item_ticket_stub', 'item_black_plastic_fragment'].forEach((id) =>
                                engine.applyEffect({ type: 'addItem', itemId: id })
                              );
                              setShowFlagTestPanel(false);
                              setCurrentDialog({
                                text: '已開啟第一章報告條件：核心旗標、四項檢視發現旗標、三場景已拜訪、背包兩件（票根、黑色碎片）。可點劉隊選「我想向你報告」。',
                                type: 'narrator',
                                choices: [{ id: 'close_only', text: '知道了' }],
                              });
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 bg-orange-900/30 hover:bg-orange-900/50 border border-orange-500/50 rounded-lg text-orange-200 text-sm font-medium"
                          >
                            <FlaskConical size={14} />
                            一鍵全開（含報告用道具）
                          </button>
                        </div>
                      )}
                      {flagTestGroups.map((group) => (
                        <div key={group.chapterId} className="space-y-2">
                          <div className="text-ui-caption uppercase text-gray-500 sticky top-0 bg-dark-surface/95 py-1">
                            {group.chapterName}
                          </div>
                          <div className="grid grid-cols-1 gap-1.5">
                            {group.flags.map(({ id: flag, label }) => {
                              const on = !!(state.flags || {})[flag];
                              return (
                                <button
                                  key={flag}
                                  type="button"
                                  onClick={() => {
                                    if (!engineRef.current) return;
                                    const engine = engineRef.current;
                                    const nextOn = !on;
                                    engine.applyEffect({ type: 'setFlag', flag, value: nextOn });
                                    const itemIds = flagToItemIds[flag];
                                    if (itemIds?.length) {
                                      if (nextOn) itemIds.forEach((itemId) => engine.applyEffect({ type: 'addItem', itemId }));
                                      else itemIds.forEach((itemId) => engine.applyEffect({ type: 'removeItem', itemId }));
                                    }
                                  }}
                                  className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-left text-sm font-medium transition-all ${
                                    on
                                      ? 'bg-green-900/30 border-green-500/50 text-green-200'
                                      : 'bg-dark-card/50 border-dark-border text-gray-400 hover:border-orange-500/50 hover:text-orange-200'
                                  }`}
                                >
                                  <span className="truncate">{label}</span>
                                  <span className="text-xs shrink-0">{on ? '✓ 開' : '關'}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                  {flagTestTab === 'interactions' && (() => {
                    const engine = engineRef.current!;
                    const scenes = engine.getScenes();
                    const sceneIds = getCurrentChapterScenes(chapterId);
                    const interactions = state.interactions ?? [];
                    const hotspotList: { id: string; label: string; sceneName: string }[] = [];
                    sceneIds.forEach((sid) => {
                      const sc = scenes[sid];
                      if (!sc?.hotspots) return;
                      sc.hotspots.forEach((h: { id: string; description?: string }) => {
                        hotspotList.push({
                          id: h.id,
                          label: h.description || h.id,
                          sceneName: sc.name || sid,
                        });
                      });
                    });
                    return (
                      <div className="space-y-3">
                        <div className="text-ui-caption text-orange-400/90 mb-2">
                          互動點（線索／好笑）：點擊切換「已點過」狀態，與 hasInteracted 一致
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (!engineRef.current) return;
                            hotspotList.forEach((h) => engineRef.current!.addInteraction(h.id));
                          }}
                          className="w-full px-3 py-2 bg-dark-card/50 hover:bg-dark-card border border-dark-border rounded-lg text-gray-300 hover:text-orange-200 text-sm font-medium"
                        >
                          本章全部標記已互動
                        </button>
                        <div className="space-y-1.5">
                          {hotspotList.map(({ id, label, sceneName }) => {
                            const on = interactions.includes(id);
                            return (
                              <button
                                key={id}
                                type="button"
                                onClick={() => {
                                  if (!engineRef.current) return;
                                  if (on) engineRef.current.removeInteraction(id);
                                  else engineRef.current.addInteraction(id);
                                }}
                                className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-left text-sm transition-all ${
                                  on
                                    ? 'bg-green-900/30 border-green-500/50 text-green-200'
                                    : 'bg-dark-card/50 border-dark-border text-gray-400 hover:border-orange-500/50 hover:text-orange-200'
                                }`}
                              >
                                <span className="truncate" title={id}>{label}</span>
                                <span className="text-xs shrink-0 text-gray-500">{sceneName}</span>
                                <span className="text-xs shrink-0">{on ? '✓' : '－'}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {flagTestTab === 'npc' && (() => {
                    const npcList = npcTestByChapter[chapterId] ?? [];
                    const counts = state.npcCasualTalkCount ?? {};
                    return (
                      <div className="space-y-3">
                        <div className="text-ui-caption text-orange-400/90 mb-2">
                          NPC 閒聊次數：≥3 次通常解鎖敏感話題入口
                        </div>
                        {npcList.length === 0 ? (
                          <p className="text-gray-500 text-sm">本章尚無設定 NPC 閒聊測試。</p>
                        ) : (
                          npcList.map(({ id: npcId, label }) => {
                            const count = counts[npcId] ?? 0;
                            return (
                              <div key={npcId} className="flex items-center justify-between gap-2 p-3 rounded-lg bg-dark-card/50 border border-dark-border">
                                <span className="text-sm font-medium text-gray-200 truncate">{label}</span>
                                <div className="flex items-center gap-1 shrink-0">
                                  {[0, 1, 2, 3, 5].map((n) => (
                                    <button
                                      key={n}
                                      type="button"
                                      onClick={() => {
                                        if (!engineRef.current) return;
                                        engineRef.current.setNpcCasualTalkCount(npcId, n);
                                      }}
                                      className={`w-8 h-8 rounded text-xs font-medium ${
                                        count === n
                                          ? 'bg-orange-500 text-white'
                                          : 'bg-dark-surface border border-dark-border text-gray-400 hover:text-orange-200'
                                      }`}
                                    >
                                      {n}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    );
                  })()}

                  {flagTestTab === 'sensitive' && (
                    <div className="space-y-4">
                      <div className="text-ui-caption text-orange-400/90 mb-2">
                        敏感話題選擇：已問敏感（依章節顯示該章 NPC）
                      </div>
                      {sensitiveChoiceGroups
                        .filter((group) => group.chapterId === chapterId)
                        .map((group) => (
                        <div key={group.npcId} className="space-y-2">
                          <div className="text-ui-caption text-gray-500">{group.npcLabel}</div>
                          <div className="grid grid-cols-1 gap-1.5">
                            {group.entries.map(({ flagId, label }) => {
                              const on = !!(state.flags || {})[flagId];
                              return (
                                <button
                                  key={flagId}
                                  type="button"
                                  onClick={() => {
                                    if (!engineRef.current) return;
                                    engineRef.current.applyEffect({ type: 'setFlag', flag: flagId, value: !on });
                                  }}
                                  className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-left text-sm font-medium transition-all ${
                                    on
                                      ? 'bg-green-900/30 border-green-500/50 text-green-200'
                                      : 'bg-dark-card/50 border-dark-border text-gray-400 hover:border-orange-500/50 hover:text-orange-200'
                                  }`}
                                >
                                  <span className="truncate">{label}</span>
                                  <span className="text-xs shrink-0">{on ? '✓ 開' : '關'}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </m.div>
          )}
        </AnimatePresence>

        {/* 敏感抉擇：次優先，中央對話框 */}
        <AnimatePresence>
          {!activeReportChapterId && !ch6EndingId && sensitiveGate && (
            <m.div
              key="sensitive-gate"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 pointer-events-auto"
            >
              <SensitiveGateOverlay
                text={sensitiveGate.text}
                choices={sensitiveGate.choices}
                onChoiceSelect={handleSensitiveGateChoice}
                onClose={() => setSensitiveGate(null)}
              />
            </m.div>
          )}
        </AnimatePresence>

        {/* 背包道具詳解：中央詳解卡，優先於 toast */}
        <AnimatePresence>
          {!activeReportChapterId && !ch6EndingId && !sensitiveGate && activeItemDetail && (
            <m.div
              key="item-detail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-sm px-4 pointer-events-auto"
            >
              <div className="w-full max-w-md md:max-w-lg">
                {activeItemDetail.id === 'item_ch2_phone_decoder' && !state.flags?.ch2_phone_riddle_done ? (
                  <Ch2PhoneDecoderItemView
                    onClose={() => setActiveItemDetail(null)}
                    onSuccess={() => {
                      if (!engineRef.current) return;
                      engineRef.current.applyEffect({
                        type: 'setFlag',
                        flag: 'ch2_phone_riddle_done',
                        value: true,
                      });
                      engineRef.current.applyEffect({
                        type: 'setFlag',
                        flag: 'ch2_reveal_liang_director_memo',
                        value: true,
                      });
                      setActiveItemDetail(null);
                    }}
                  />
                ) : (
                  <ItemObtainedNotification
                    itemId={activeItemDetail.id}
                    itemName={activeItemDetail.name}
                    itemImage={activeItemDetail.image}
                    itemSvgImage={activeItemDetail.svgImage}
                    itemDescription={activeItemDetail.description}
                    show
                    duration={0}
                    dismissOnTap
                    onComplete={() => setActiveItemDetail(null)}
                  />
                )}
              </div>
            </m.div>
          )}
        </AnimatePresence>

      </div>

      {/* 正上方：一鍵關閉／開啟所有聲音 */}
      <MuteAllButton />

      {/* 浮動控制按鈕組 - 右上角（統一收納選單） */}
      <div className="absolute top-4 right-4 z-30">
        {/* 選單按鈕 */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="group flex items-center justify-center w-12 h-12 bg-dark-surface/90 backdrop-blur-md border border-dark-border/50 rounded-lg text-gray-300 hover:text-white hover:bg-dark-surface transition-all duration-200 shadow-lg relative"
          title="選單"
        >
          <Menu size={22} className="text-gray-300 group-hover:text-orange-400 transition-colors" />
          {state.inventory.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-industrial-orange rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-dark-bg shadow-lg animate-pulse">
              {state.inventory.length}
            </span>
          )}
        </button>
        
        {/* 展開的選單：側邊抽屜 + 展開/收合動畫 */}
        <AnimatePresence>
          {showMenu && (
            <>
              {/* 背景遮罩 - 淡入淡出 */}
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setShowMenu(false)}
                className="fixed inset-0 bg-black/40 z-40"
              />
              {/* 選單面板 - 從右緣滑入 */}
              <m.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
                className="fixed top-0 right-0 h-full w-72 max-w-[85vw] bg-dark-surface/98 backdrop-blur-xl border-l border-dark-border shadow-2xl z-50 overflow-y-auto"
              >
              <div className="p-4 space-y-4 pt-16">
                {/* 區塊一：遊戲 */}
                <section className="space-y-4">
                  <h3 className="text-ui-caption uppercase mb-2">遊戲</h3>
                  <button
                    onClick={() => {
                      setShowInventory(!showInventory);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-dark-card/50 hover:bg-dark-card border border-dark-border/50 hover:border-orange-500/50 rounded-lg text-gray-300 hover:text-white transition-all duration-200 text-sm font-medium group"
                  >
                    <Package size={18} className="text-orange-400 group-hover:scale-110 transition-transform" />
                    <span>背包</span>
                    {state.inventory.length > 0 && (
                      <span className="ml-auto w-6 h-6 bg-industrial-orange rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg">
                        {state.inventory.length}
                      </span>
                    )}
                  </button>

                </section>

                {/* 區塊二：設定 */}
                <section className="space-y-4">
                  <h3 className="text-ui-caption uppercase mb-2">設定</h3>
                  <div className="px-4 py-3 bg-dark-card/50 border border-dark-border/50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-medium text-gray-300">音量控制</span>
                    </div>
                    <AudioControl />
                  </div>
                  <button
                    onClick={() => {
                      setShowFlagTestPanel(true);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-dark-card/50 hover:bg-dark-card border border-dark-border/50 hover:border-orange-500/50 rounded-lg text-gray-300 hover:text-orange-200 transition-all duration-200 text-sm font-medium"
                  >
                    <FlaskConical size={18} className="text-orange-400" />
                    <span>旗標測試</span>
                  </button>
                </section>

                {/* 區塊三：開發與測試 */}
                <section className="space-y-4">
                  <h3 className="text-ui-caption uppercase mb-2">開發與測試</h3>
                  <button
                    onClick={() => {
                      if (devMode) {
                        setShowDeveloperPanel((prev) => !prev);
                      } else {
                        setDevModeAndPersist(true);
                        setShowDeveloperPanel(true);
                      }
                      setShowMenu(false);
                    }}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 border rounded-lg transition-all duration-200 text-sm font-medium group ${
                      devMode
                        ? showDeveloperPanel
                          ? 'bg-industrial-orange/30 border-industrial-orange text-orange-200 hover:bg-industrial-orange/40'
                          : 'bg-dark-card/50 border-dark-border/50 hover:border-industrial-orange/50 text-gray-300 hover:text-orange-200'
                        : 'bg-dark-card/50 border-dark-border/50 text-gray-500 hover:bg-dark-card hover:text-gray-400'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Code size={18} className="group-hover:scale-110 transition-transform" />
                      <span>{devMode ? '開發者模式 (開)' : '開啟開發者模式'}</span>
                    </span>
                    {devMode && <span className="text-xs text-green-400">開</span>}
                  </button>
                  <div className="px-2 py-0">
                    <div className="text-ui-caption mb-2 flex items-center gap-1">
                      <FlaskConical size={12} />
                      <span>測試模式</span>
                    </div>
                    <button
                      onClick={() => {
                        if (!engineRef.current) return;
                        const allItemIds = Object.keys(items);
                        allItemIds.forEach((id) => {
                          engineRef.current!.applyEffect({ type: 'addItem', itemId: id });
                        });
                        setShowMenu(false);
                        setCurrentDialog({
                          text: `已取得全部 ${allItemIds.length} 個道具。`,
                          type: 'narrator',
                          choices: [{ id: 'close_only', text: '知道了' }],
                        });
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-dark-card/50 hover:bg-dark-card border border-dark-border/50 hover:border-amber-500/50 rounded-lg text-gray-300 hover:text-amber-200 transition-all duration-200 text-sm font-medium group"
                    >
                      <Package size={18} className="text-amber-400 group-hover:scale-110 transition-transform" />
                      <span>取得所有道具</span>
                    </button>
                  </div>
                </section>

                {/* 區塊四：放棄遊戲（獨立區塊） */}
                <div className="mt-6 pt-4 border-t border-dark-border space-y-4">
                  <button
                    onClick={() => {
                      setShowQuitConfirm(true);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-red-900/40 hover:bg-red-900/50 border border-red-500/50 hover:border-red-500 rounded-lg text-gray-300 hover:text-red-200 transition-all duration-200 text-sm font-medium group"
                  >
                    <ArrowLeft size={18} className="group-hover:translate-x-[-2px] transition-transform" />
                    <span>放棄遊戲</span>
                  </button>
                </div>
              </div>
              </m.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* 場景名稱和切換按鈕 - 左上角浮動（縮小 40%） */}
      <div className="absolute top-2.5 left-2.5 z-30 flex flex-col sm:flex-row gap-2.5">
        <div className="px-2.5 py-1.5 bg-dark-surface/90 backdrop-blur-md border border-dark-border/50 rounded-md shadow-lg max-w-[200px] sm:max-w-[280px]">
          <div className="text-ui-title text-sm text-gray-300 truncate" title={scene.name}>{scene.name}</div>
        </div>
        {/* 場景切換按鈕 - 顯示當前章節的所有場景 */}
        {(() => {
          const currentChapterScenes = getCurrentChapterScenes(chapterId);
          return currentChapterScenes.length > 1 && (
          <button
            onClick={() => setShowSceneSelector(!showSceneSelector)}
            className="group flex items-center gap-1.5 px-2.5 py-1.5 bg-dark-surface/90 backdrop-blur-md border border-dark-border/50 rounded-md text-gray-300 hover:text-white hover:bg-dark-surface transition-all duration-200 shadow-lg"
            title="切換場景"
          >
            <MapPin size={11} className="text-gray-300 group-hover:text-blue-400 transition-colors" />
            <ChevronDown size={10} className={`transition-transform ${showSceneSelector ? 'rotate-180' : ''}`} />
          </button>
          );
        })()}
      </div>

      {/* 場景選擇器 - 顯示當前章節的所有場景 */}
      {showSceneSelector && (() => {
        const currentChapterScenes = getCurrentChapterScenes(chapterId);
        if (currentChapterScenes.length <= 1) return null;
        
        return (
        <>
          {/* 背景遮罩，點擊關閉 */}
          <div
            className="fixed inset-0 z-20"
            onClick={() => setShowSceneSelector(false)}
          />
          <div className="absolute top-20 left-4 z-30 w-64 bg-dark-surface/95 backdrop-blur-xl border border-dark-border rounded-lg shadow-2xl p-4">
              <div className="text-xs uppercase tracking-widest text-gray-400 mb-3">
                {chapters[chapterId]?.name || '當前章節的場景'}
              </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
                {currentChapterScenes.map((sceneIdToShow) => {
                  const sceneToShow = scenes[sceneIdToShow];
                  if (!sceneToShow) return null;
                  const isCurrentScene = sceneIdToShow === sceneId;
              
              return (
                <button
                      key={sceneIdToShow}
                  onClick={() => {
                    if (!engineRef.current) return;
                    const engine = engineRef.current;
                    // 切換場景，但保留所有狀態
                    engine.applyEffect({
                      type: 'changeScene',
                          chapterId: sceneToShow.chapterId,
                          sceneId: sceneIdToShow,
                    });
                    // 保存狀態
                    if (typeof window !== 'undefined') {
                      try {
                        localStorage.setItem('gameState', JSON.stringify(engine.getState()));
                      } catch (e) {
                        console.warn('無法保存遊戲狀態:', e);
                      }
                    }
                    // 導航到新場景
                        router.push(`/play/${sceneToShow.chapterId}/${sceneIdToShow}`);
                    setShowSceneSelector(false);
                  }}
                  disabled={isCurrentScene}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                    isCurrentScene
                      ? 'bg-blue-600/20 border border-blue-500/50 text-blue-300 cursor-not-allowed'
                      : 'bg-dark-surface/50 border border-dark-border/50 text-gray-300 hover:bg-dark-surface hover:border-dark-border hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                          <div className="text-sm font-medium">{sceneToShow.name}</div>
                          {sceneToShow.description && (
                        <div className="text-xs text-gray-400 mt-1 line-clamp-1">
                              {sceneToShow.description}
                        </div>
                      )}
                    </div>
                    {isCurrentScene && (
                      <div className="text-xs text-blue-400 font-medium">當前</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        </>
        );
      })()}

      {/* 背包浮動覆蓋層 */}
      {showInventory && (
        <>
          {/* 半透明背景遮罩 - 點擊可關閉 */}
          <div
            onClick={() => setShowInventory(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          />
          
          {/* 背包面板 - 從右側滑入 */}
          <div className={`fixed top-0 right-0 h-full w-80 sm:w-96 bg-dark-surface/98 backdrop-blur-xl border-l border-dark-border z-50 transform transition-transform duration-300 ease-out shadow-2xl ${
            showInventory ? 'translate-x-0' : 'translate-x-full'
          }`}>
            <div className="h-full flex flex-col">
              {/* 道具欄標題 */}
              <div className="flex items-center justify-between p-4 border-b border-dark-border">
                <h2 className="text-lg font-semibold text-gray-200">背包</h2>
                <button
                  onClick={() => setShowInventory(false)}
                  className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-dark-card rounded-lg transition-colors min-h-[44px] min-w-[44px]"
                  title="關閉"
                >
                  <X size={22} />
                  <span className="text-sm font-medium sm:inline hidden">關閉</span>
                </button>
              </div>
              
              {/* 道具列表 */}
              <div className="flex-1 overflow-y-auto p-4">
                <Inventory
                  itemIds={state.inventory}
                  items={items}
                  onItemClick={handleItemClick}
                  currentSceneId={sceneId}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* 進度條 - 已隱藏（不顯示給玩家） */}

      {/* 謎題輸入 */}
      {currentPuzzle && (
        <PuzzleRenderer
          puzzle={currentPuzzle}
          onSolve={handlePuzzleSolve}
          onClose={() => {
            setCurrentPuzzle(null);
            setPuzzleError('');
          }}
          error={puzzleError}
          onErrorClear={() => setPuzzleError('')}
        />
      )}

      {/* 脈搏夾量測面板 */}
      {showPulseClip && (
        <PulseClipReader
          onClose={() => setShowPulseClip(false)}
          onBroadcast={() => {
            if (!engineRef.current) return;
            const engine = engineRef.current;
            engine.triggerPulseClipBroadcast();
            const state = engine.getState();
            const scene = engine.getCurrentScene();
            if (scene) {
              const event = scene.events.find(e => e.id === 'use_pulse_clip');
              if (event) {
                const result = engine.triggerEvent('use_pulse_clip');
                // 使用統一的廣播處理
                if (result?.dialog) {
                  handleBroadcast(result.dialog);
                }
              }
            }
          }}
        />
      )}

      {/* UV 燈面板 */}
      {showUVLight && (
        <UVLightPanel
          onClose={() => setShowUVLight(false)}
          onReveal={() => {
            if (!engineRef.current) return;
            const engine = engineRef.current;
            engine.setUVLightState(true);
            const state = engine.getState();
            const scene = engine.getCurrentScene();
            if (scene) {
              const event = scene.events.find(e => e.id === 'use_uv_light');
              if (event) {
                const result = engine.triggerEvent('use_uv_light');
                if (result?.dialog) {
                  setCurrentDialog(result.dialog);
                }
              }
            }
          }}
        />
      )}

      {/* 開發者面板 */}
      {showDeveloperPanel && devMode && (
        <DeveloperPanel
          onClose={() => setShowDeveloperPanel(false)}
          onDisableDevMode={() => {
            setDevModeAndPersist(false);
            setShowDeveloperPanel(false);
          }}
          onTestCh1LiuReport={() => {
            const engine = engineRef.current;
            if (!engine) return;
            engine.applyEffect({ type: 'setFlag', flag: 'dev_unlock_liu_report', value: true });
            engine.applyEffect({ type: 'setFlag', flag: 'ch1_reasoning_done', value: false });
            try {
              localStorage.setItem('gameState', JSON.stringify(engine.getState()));
            } catch (e) {
              console.warn('無法保存遊戲狀態:', e);
            }
            router.push(`/play/${DEV_TEST_LIU_SCENE.ch1.chapterId}/${DEV_TEST_LIU_SCENE.ch1.sceneId}`);
          }}
          onTestCh1Breakthrough={() => {
            const engine = engineRef.current;
            if (!engine) return;
            DEV_TEST_CH1_REPORT_RESET_FLAGS.forEach((flag) =>
              engine.applyEffect({ type: 'setFlag', flag, value: false }),
            );
            setActiveReportChapterId('ch1');
          }}
          onTestCh2LiuReport={() => {
            const engine = engineRef.current;
            if (!engine) return;
            engine.applyEffect({ type: 'setFlag', flag: 'dev_unlock_liu_report', value: true });
            engine.applyEffect({ type: 'setFlag', flag: 'ch2_reasoning_done', value: false });
            try {
              localStorage.setItem('gameState', JSON.stringify(engine.getState()));
            } catch (e) {
              console.warn('無法保存遊戲狀態:', e);
            }
            router.push(`/play/${DEV_TEST_LIU_SCENE.ch2.chapterId}/${DEV_TEST_LIU_SCENE.ch2.sceneId}`);
          }}
          onTestCh2Breakthrough={() => {
            const engine = engineRef.current;
            if (!engine) return;
            const ch2ReportResetFlags = [
              'ch2_q1_done',
              'ch2_q2_done',
              'ch2_q3_done',
              'ch2_q4_done',
              'ch2_q5_done',
              'ch2_report_fill_done',
              'ch2_phone_riddle_done',
              'ch2_reveal_liang_director_memo',
              'ch2_pc_phone_decoder_taken',
              'ch2_qa_reviewed_with_liu',
              'ch2_reasoning_done',
              'navigate_to_ch3_intro',
            ] as const;
            ch2ReportResetFlags.forEach((flag) =>
              engine.applyEffect({ type: 'setFlag', flag, value: false }),
            );
            setActiveReportChapterId('ch2');
          }}
          onTestCh3LiuReport={() => {
            const engine = engineRef.current;
            if (!engine) return;
            engine.applyEffect({ type: 'setFlag', flag: 'dev_unlock_liu_report', value: true });
            engine.applyEffect({ type: 'setFlag', flag: 'ch3_reasoning_done', value: false });
            engine.applyEffect({ type: 'setFlag', flag: 'ch3_liu_report_done', value: false });
            engine.applyEffect({ type: 'setFlag', flag: 'ch3_task_from_liu', value: true });
            engine.applyEffect({ type: 'setFlag', flag: 'ch3_log_compare_done', value: true });
            engine.applyEffect({ type: 'setFlag', flag: 'ch3_milestone_whiteboard', value: true });
            engine.applyEffect({ type: 'setFlag', flag: 'ch3_milestone_brand_script', value: true });
            engine.applyEffect({ type: 'setFlag', flag: 'ch3_milestone_cross_venue', value: true });
            engine.applyEffect({ type: 'setFlag', flag: 'ch3_liu_report_ready', value: true });
            try {
              localStorage.setItem('gameState', JSON.stringify(engine.getState()));
            } catch (e) {
              console.warn('無法保存遊戲狀態:', e);
            }
            router.push(`/play/${DEV_TEST_LIU_SCENE.ch3.chapterId}/${DEV_TEST_LIU_SCENE.ch3.sceneId}`);
          }}
          onTestCh3Breakthrough={() => {
            const engine = engineRef.current;
            if (!engine) return;
            const ch3ReportResetFlags = [
              'ch3_liu_report_done',
              'ch3_reasoning_done',
              'navigate_to_ch4_intro',
            ] as const;
            ch3ReportResetFlags.forEach((flag) =>
              engine.applyEffect({ type: 'setFlag', flag, value: false }),
            );
            engine.applyEffect({ type: 'setFlag', flag: 'ch3_task_from_liu', value: true });
            engine.applyEffect({ type: 'setFlag', flag: 'ch3_log_compare_done', value: true });
            engine.applyEffect({ type: 'setFlag', flag: 'ch3_milestone_whiteboard', value: true });
            engine.applyEffect({ type: 'setFlag', flag: 'ch3_milestone_brand_script', value: true });
            engine.applyEffect({ type: 'setFlag', flag: 'ch3_milestone_cross_venue', value: true });
            engine.applyEffect({ type: 'setFlag', flag: 'ch3_liu_report_ready', value: true });
            setActiveReportChapterId('ch3');
          }}
          onTestCh3Compare={() => {
            const engine = engineRef.current;
            if (!engine) return;
            engine.applyEffect({ type: 'setFlag', flag: 'ch3_task_from_liu', value: true });
            engine.applyEffect({ type: 'setFlag', flag: 'ch3_milestone_whiteboard', value: true });
            engine.applyEffect({ type: 'setFlag', flag: 'ch3_milestone_brand_script', value: true });
            engine.applyEffect({ type: 'setFlag', flag: 'ch3_log_compare_done', value: false });
            setShowCh3LogCompare(true);
          }}
          currentChapterId={chapterId}
          currentSceneId={sceneId}
          scenes={scenes}
          chapters={chapters}
        />
      )}

      {/* 遊戲結束畫面 */}
      {showGameEnd && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* 結束圖片 */}
            <div className="w-full h-full flex items-center justify-center bg-black">
              <img 
                src="/images/ending_image.webp" 
                alt="遊戲結束" 
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  // 如果圖片載入失敗，顯示備用文字
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<div class="text-gray-300 text-center"><p class="text-lg mb-4">遊戲結束</p><p class="text-sm text-gray-400">感謝你的遊玩</p></div>';
                  }
                }}
              />
            </div>
            {/* 關閉按鈕 */}
            <button
              onClick={() => {
                // 清除遊戲狀態
                if (engineRef.current) {
                  const engine = engineRef.current;
                  // 清除 localStorage 中的遊戲狀態
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem('gameState');
                  }
                }
                setShowGameEnd(false);
                gameEndShownRef.current = false;
                router.push('/');
              }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-dark-surface/90 backdrop-blur-md border border-dark-border/50 rounded-lg text-gray-300 hover:text-white hover:bg-dark-surface transition-all duration-200 shadow-lg z-[10000]"
            >
              返回首頁
            </button>
          </div>
        </div>
      )}

      {/* 放棄遊戲確認對話框 */}
      {showQuitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-dark-card to-dark-surface border-2 border-dark-border rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-200 mb-2">確認放棄遊戲</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                放棄遊戲後，所有遊玩進度將會被清除，包括：
              </p>
              <ul className="mt-3 text-sm text-gray-400 space-y-1 list-disc list-inside">
                <li>當前遊戲進度</li>
                <li>已收集的道具</li>
                <li>已解決的謎題</li>
                <li>所有遊戲記錄</li>
              </ul>
              <p className="mt-4 text-sm text-red-400 font-medium">
                此操作無法復原，確定要放棄嗎？
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  // 清除 localStorage
                  if (typeof window !== 'undefined') {
                    try {
                      localStorage.removeItem('gameState');
                    } catch (e) {
                      console.warn('無法清除遊戲狀態:', e);
                    }
                  }
                  // 導航到首頁
                  router.push('/');
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                確認放棄
              </button>
              <button
                onClick={() => setShowQuitConfirm(false)}
                className="flex-1 px-6 py-3 bg-dark-surface hover:bg-dark-border border-2 border-dark-border rounded-lg text-gray-300 hover:text-white transition-all duration-200"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 第一空間門確認對話框 */}
      {showDoor701Confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-dark-card to-dark-surface border-2 border-dark-border rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-200 mb-2">離開病房 701</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                門已經打開。走廊的冷白色燈光從門縫中透進來，你聽到遠處傳來微弱的聲音。
              </p>
              <p className="mt-4 text-sm text-gray-300 font-medium">
                你要離開病房 701，前往走廊嗎？
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDoor701Confirm(false);
                  // 切換到第二空間
                  if (engineRef.current) {
                    engineRef.current.applyEffect({
                      type: 'changeScene',
                      chapterId: 'ch1',
                      sceneId: 'ch1_sc2',
                    });
                    // 保存狀態
                    if (typeof window !== 'undefined') {
                      try {
                        localStorage.setItem('gameState', JSON.stringify(engineRef.current.getState()));
                      } catch (e) {
                        console.warn('無法保存遊戲狀態:', e);
                      }
                    }
                  }
                  router.push('/play/ch1/ch1_sc2');
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                前往走廊
              </button>
              <button
                onClick={() => setShowDoor701Confirm(false)}
                className="flex-1 px-6 py-3 bg-dark-surface hover:bg-dark-border border-2 border-dark-border rounded-lg text-gray-300 hover:text-white transition-all duration-200"
              >
                再等等
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 702號病房門確認對話框 */}
      {showDoor702Confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-dark-card to-dark-surface border-2 border-dark-border rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-200 mb-2">702號病房</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                門已經打開。你聽到裡面傳來微弱的聲音，像是有人在低語。
              </p>
              <p className="mt-4 text-sm text-gray-300 font-medium">
                你要進入702號病房嗎？
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDoor702Confirm(false);
                  // 切換到第三空間
                  if (engineRef.current) {
                    engineRef.current.applyEffect({
                      type: 'changeScene',
                      chapterId: 'ch1',
                      sceneId: 'ch1_sc3',
                    });
                    // 保存狀態
                    if (typeof window !== 'undefined') {
                      try {
                        localStorage.setItem('gameState', JSON.stringify(engineRef.current.getState()));
                      } catch (e) {
                        console.warn('無法保存遊戲狀態:', e);
                      }
                    }
                  }
                  router.push('/play/ch1/ch1_sc3');
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                進入
              </button>
              <button
                onClick={() => setShowDoor702Confirm(false)}
                className="flex-1 px-6 py-3 bg-dark-surface hover:bg-dark-border border-2 border-dark-border rounded-lg text-gray-300 hover:text-white transition-all duration-200"
              >
                再等等
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 第四空間垂降確認對話框 */}
      {showDescendConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-dark-card to-dark-surface border-2 border-dark-border rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-200 mb-2">垂降到二樓露台</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                你已經成功垂降到二樓露台。風很大，吹得你眼睛發乾。
              </p>
              <p className="mt-4 text-sm text-gray-300 font-medium">
                你要繼續前往二樓露台嗎？
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDescendConfirm(false);
                  // 切換到第五空間
                  if (engineRef.current) {
                    engineRef.current.applyEffect({
                      type: 'changeScene',
                      chapterId: 'ch1',
                      sceneId: 'ch1_sc5',
                    });
                    // 保存狀態
                    if (typeof window !== 'undefined') {
                      try {
                        localStorage.setItem('gameState', JSON.stringify(engineRef.current.getState()));
                      } catch (e) {
                        console.warn('無法保存遊戲狀態:', e);
                      }
                    }
                  }
                  router.push('/play/ch1/ch1_sc5');
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                前往二樓露台
              </button>
              <button
                onClick={() => setShowDescendConfirm(false)}
                className="flex-1 px-6 py-3 bg-dark-surface hover:bg-dark-border border-2 border-dark-border rounded-lg text-gray-300 hover:text-white transition-all duration-200"
              >
                再等等
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 第三空間落地窗確認對話框 */}
      {showWindow702Confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-dark-card to-dark-surface border-2 border-dark-border rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-200 mb-2">離開病房 702</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                窗戶已經打開。外面的風吹進來，帶著鐵鏽和消毒水的味道。陽台在下方等待著你。
              </p>
              <p className="mt-4 text-sm text-gray-300 font-medium">
                你要離開病房 702，前往陽台嗎？
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowWindow702Confirm(false);
                  // 切換到第四空間
                  if (engineRef.current) {
                    engineRef.current.applyEffect({
                      type: 'changeScene',
                      chapterId: 'ch1',
                      sceneId: 'ch1_sc4',
                    });
                    // 保存狀態
                    if (typeof window !== 'undefined') {
                      try {
                        localStorage.setItem('gameState', JSON.stringify(engineRef.current.getState()));
                      } catch (e) {
                        console.warn('無法保存遊戲狀態:', e);
                      }
                    }
                  }
                  router.push('/play/ch1/ch1_sc4');
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                離開
              </button>
              <button
                onClick={() => setShowWindow702Confirm(false)}
                className="flex-1 px-6 py-3 bg-dark-surface hover:bg-dark-border border-2 border-dark-border rounded-lg text-gray-300 hover:text-white transition-all duration-200"
              >
                再等等
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
    </>
  );
}

