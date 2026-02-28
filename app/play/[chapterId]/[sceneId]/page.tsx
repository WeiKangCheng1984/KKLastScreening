'use client';

import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { GameEngine } from '@/lib/gameEngine';
import { Dialog, Hotspot } from '@/types/game';
import SceneView, { SceneViewRef } from '@/components/SceneView';
import DialogBox from '@/components/DialogBox';
import CharacterConversation from '@/components/CharacterConversation';
import { characterConversations } from '@/data/characterConversations';
import Inventory from '@/components/Inventory';
import SceneNameDisplay from '@/components/SceneNameDisplay';
import ItemObtainedNotification from '@/components/ItemObtainedNotification';
import PuzzleInput from '@/components/PuzzleInput';
import ArrangementPuzzle from '@/components/ArrangementPuzzle';
import VisualSelectionPuzzle from '@/components/VisualSelectionPuzzle';
import CombinationLock from '@/components/CombinationLock';
import WordScramble from '@/components/WordScramble';
import WireConnection from '@/components/WireConnection';
import JigsawPuzzle from '@/components/JigsawPuzzle';
import RotatingDial from '@/components/RotatingDial';
import SequenceMemory from '@/components/SequenceMemory';
import SlidingPuzzle from '@/components/SlidingPuzzle';
import SymbolMatching from '@/components/SymbolMatching';
import MazePath from '@/components/MazePath';
import LogicSwitches from '@/components/LogicSwitches';
import PulseClipReader from '@/components/PulseClipReader';
import UVLightPanel from '@/components/UVLightPanel';
import { ArrowLeft, Package, X, MapPin, ChevronDown, ChevronLeft, ChevronRight, Code, Menu, Puzzle, ListOrdered, FlaskConical, Brain } from 'lucide-react';
import Link from 'next/link';
import { audioManager } from '@/lib/audioManager';
import { chapters } from '@/data/chapters';
import { getChapterData } from '@/data/getChapterData';
import DeveloperPanel from '@/components/DeveloperPanel';
import TutorialGuide from '@/components/TutorialGuide';
import AudioControl from '@/components/AudioControl';
import MuteAllButton from '@/components/MuteAllButton';
import { preloadSVGBatch } from '@/lib/svgLoader';
import { DialogChoice } from '@/types/game';
import PairMatchingPuzzle from '@/components/PairMatchingPuzzle';
import PickThreePuzzle from '@/components/PickThreePuzzle';
import ScoreDisplay from '@/components/ScoreDisplay';
import NpcRightStrip from '@/components/NpcRightStrip';
import ReasoningPanel from '@/components/ReasoningPanel';
import { reasoningByChapter } from '@/data/reasoningByChapter';
import HotspotZoomOverlay from '@/components/HotspotZoomOverlay';
import { motion, AnimatePresence } from 'framer-motion';

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

export default function PlayPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const chapterId = params.chapterId as string;
  const sceneId = params.sceneId as string;
  const debug = searchParams.get('debug') === '1';
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
  const engine = engineRef.current;

  // 章節資料按需載入：載入後 engine 才有 scenes/items，供下方 scenes/items 使用
  const [chapterDataReady, setChapterDataReady] = useState(false);
  useEffect(() => {
    if (!chapterId) return;
    getChapterData(chapterId).then((data) => {
      if (data && engineRef.current) {
        engineRef.current.loadChapterData(data);
        setChapterDataReady(true);
      }
    }).catch((err) => {
      console.warn('getChapterData failed:', err);
    });
  }, [chapterId]);

  const scenes = chapterDataReady ? engine.getScenes() : {};
  const items = chapterDataReady ? engine.getItems() : {};

  // 定義所有 state，確保在 useEffect 之前
  const [currentDialog, setCurrentDialog] = useState<Dialog | null>(null);
  const [dialogQueue, setDialogQueue] = useState<Dialog[]>([]);
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
  // 新的角色對話系統
  const [currentConversation, setCurrentConversation] = useState<any>(null);
  const sceneViewRef = useRef<SceneViewRef>(null);
  const isDescendPuzzleCompleteRef = useRef(false);
  // 使用 useState 的函數形式確保服務器和客戶端初始狀態一致
  const [isSceneTransitioning, setIsSceneTransitioning] = useState(() => false);
  const [sceneLoading, setSceneLoading] = useState(() => false);
  const preloadedImagesRef = useRef<Set<string>>(new Set());
  const [chapterProgress, setChapterProgress] = useState(0);
  const [showChapterPuzzle, setShowChapterPuzzle] = useState(false);
  // 第一章章末：解謎（6 道具配對）與推理（3 題字詞排序）
  const [showCh1PairPuzzle, setShowCh1PairPuzzle] = useState(false);
  const [showCh1ReasoningPuzzle, setShowCh1ReasoningPuzzle] = useState(false);
  const [showReasoningPanel, setShowReasoningPanel] = useState(false);
  const [ch1ReasoningStep, setCh1ReasoningStep] = useState(0);
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
  // 道具獲得提示狀態
  const [showItemNotification, setShowItemNotification] = useState(false);
  const [obtainedItem, setObtainedItem] = useState<{ id: string; name: string; image?: string; svgImage?: string; description?: string } | null>(null);

  // 添加對話到隊列（需要在 handleItemCollection 之前定義）；interactionName 為選填，用於顯示互動點名稱於對話框上方
  const addDialogsToQueue = useCallback((dialogs: Dialog[], interactionName?: string) => {
    if (dialogs.length === 0) return;
    const toQueue = interactionName
      ? [{ ...dialogs[0], title: interactionName }, ...dialogs.slice(1)]
      : dialogs;

    // 使用函數式更新來避免閉包問題
    setCurrentDialog(current => {
      if (!current) {
        // 如果當前沒有對話，直接顯示第一個，其餘加入隊列
        const firstDialog = toQueue[0];
        // 檢查是否為廣播類型，需要特殊處理
        if (firstDialog.type === 'broadcast') {
          // 播放廣播音效
          audioManager.playSFX('/audio/sfx/kk_sfx_broadcast.mp3', 0.7);
          // 觸發劇烈閃爍
          if (sceneViewRef.current) {
            sceneViewRef.current.triggerFlicker('intense');
            setTimeout(() => {
              sceneViewRef.current?.triggerFlicker('strong');
            }, 200);
            setTimeout(() => {
              sceneViewRef.current?.triggerFlicker('intense');
            }, 400);
          }
          // 廣播對話需要特殊處理，先返回 null，然後在 setTimeout 中設置
          setTimeout(() => {
            setCurrentDialog(firstDialog);
            if (toQueue.length > 1) {
              setDialogQueue(toQueue.slice(1));
            }
          }, 0);
          return null;
        } else {
          // 使用 setTimeout 確保狀態更新順序正確
          setTimeout(() => {
            if (toQueue.length > 1) {
              setDialogQueue(toQueue.slice(1));
            }
          }, 0);
          return firstDialog;
        }
      } else {
        // 如果當前有對話，將所有新對話加入隊列
        setDialogQueue(prev => [...prev, ...toQueue]);
        return current;
      }
    });
  }, []);

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
      // 已經收集了部分或全部道具，顯示友好提示
      const itemNames = collectedItems.map((itemId: string) => {
        const item = items[itemId];
        return item?.name || itemId;
      }).join('、');
      setCurrentDialog({
        text: `你已經收集了${itemNames}。`,
        type: 'system',
      });
      setRefreshKey(prev => prev + 1);
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
      setRefreshKey(prev => prev + 1);
      return true; // 已處理，不需要繼續
    }
    
    // 步驟7：處理特殊效果（閃爍、音效等）
    if (hotspotId === 'pulse_clip_spot') {
      // 脈搏夾使用時短暫閃爍
      if (sceneViewRef.current) {
        sceneViewRef.current.triggerFlicker('light');
      }
    } else if (hotspotId === 'recorder_spot') {
      // 錄音筆播放音效
      audioManager.playSFX('/audio/sfx/kk_sfx_recorder_click.mp3', 0.6);
    } else if (hotspotId === 'mirror_shard_spot') {
      // 鏡片碎角玻璃破碎音效
      audioManager.playSFX('/audio/sfx/kk_sfx_glass_break.mp3', 0.6);
    } else if (hotspotId === 'duty_schedule') {
      // 值班表紙張翻動音效
      audioManager.playSFX('/audio/sfx/kk_sfx_paper_rustle.mp3', 0.5);
    } else if (hotspotId === 'plant') {
      // 除鏽劑音效
      audioManager.playSFX('/audio/sfx/kk_sfx_rust_remover.mp3', 0.6);
    }
    
    // 步驟8：觸發事件並處理道具獲得提示
    // 先觸發事件以獲取道具
    const result = engine.triggerEvent(eventId);
    
    if (!result) {
      // 事件沒有觸發，返回
      return false;
    }
    
    // 檢查是否有道具被添加
    const addItemEffects = result.effects.filter((e: any) => e.type === 'addItem');
    
    if (addItemEffects.length > 0) {
      // 如果有道具被添加，先顯示道具獲得提示
        const firstItemEffect = addItemEffects[0];
        const itemId = firstItemEffect?.itemId;
        const item = itemId != null ? items[itemId] : undefined;
        if (item) {
          // 播放收集音效
          audioManager.playInteractionSFX('collect');
          
          // 顯示道具獲得提示
          setObtainedItem({
            id: item.id,
            name: item.name,
            image: item.image,
            svgImage: item.svgImage,
            description: item.description,
          });
          setShowItemNotification(true);
          setRefreshKey(prev => prev + 1);
          return true; // 已處理（方案 C：點擊浮動提示後關閉）
        }
      }
      
      // 沒有道具，正常處理對話
      // 檢查是否為角色對話事件
      const isCharacterDialog = /^(character_\d_|person_)(first|second|third|fourth|fifth)_talk$/.test(eventId) || 
                                /^talk_to_(character_|person)/.test(eventId);
      
      if (isCharacterDialog) {
        // 映射事件 ID 到對話鏈 ID
        let conversationId: string | null = null;
        if (eventId === 'talk_to_character_1' || eventId.startsWith('character_1_')) {
          conversationId = 'character_1_conversation';
        } else if (eventId === 'talk_to_character_2' || eventId.startsWith('character_2_')) {
          conversationId = 'character_2_conversation';
        } else if (eventId === 'talk_to_person' || eventId.startsWith('person_')) {
          conversationId = 'person_conversation';
        }
        
        // 如果找到對應的對話鏈，使用新系統
        if (conversationId && characterConversations[conversationId]) {
          const conversation = characterConversations[conversationId];
          
          // 檢查是否已經完成過
          if (conversation.onComplete?.setFlag) {
            const flag = conversation.onComplete.setFlag;
            if (engine.hasFlag(flag)) {
              return true;
            }
          }
          
          // 顯示角色對話
          setCurrentConversation(conversation);
          setRefreshKey(prev => prev + 1);
          return true;
        }
      }
      
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
        
        setRefreshKey(prev => prev + 1);
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
      setCurrentDialog({
        text: hotspot.hint,
        type: 'narrator',
      });
      setRefreshKey(prev => prev + 1);
    }
    return true; // 已處理，不需要繼續
  }, [engineRef, setCurrentDialog, setRefreshKey, addDialogsToQueue, items]);

  // 將 NpcDialogNode 轉成 Dialog 供 DialogBox 顯示；node.text 依 \n\n 分段，玩家按繼續逐段進行
  const buildDialogFromNpcNode = useCallback((node: { text: string; choices: Array<{ id: string; label: string; effects?: any[]; insightEffects?: any[] }> }, npc: { id: string; name: string; portrait?: string; portraitExpression?: 1 | 2 | 3 }) => {
    const segments = node.text.split(/\n\n+/).map((s: string) => s.trim()).filter(Boolean);
    const textSegments = segments.length > 0 ? segments : [node.text];
    return {
      text: textSegments[0],
      textSegments,
      type: 'character' as const,
      characterId: npc.id,
      characterName: npc.name,
      characterExpression: npc.portraitExpression ?? 1,
      characterPortrait: npc.portrait,
      choices: node.choices.map((c: { id: string; label: string; effects?: any[]; insightEffects?: any[] }) => ({
        id: c.id,
        text: c.label,
        effects: c.effects,
        insightEffects: c.insightEffects,
      })),
    };
  }, []);

  // 處理對話選擇
  const handleDialogChoice = useCallback((choice: DialogChoice) => {
    if (!engineRef.current) return;
    const engine = engineRef.current;
    const scene = engine.getCurrentScene();
    const currentState = engine.getState();

    // 林瑞堂：選擇後 DialogBox 會呼叫 onClose()，需延遲設定下一個對話以免被清掉
    if (choice.id === 'lin_sensitive_skip') {
      setTimeout(() => {
        if (!engineRef.current) return;
        const d = engineRef.current.triggerRandomNpcDialog('npc_lin_ruitang');
        if (d) {
          engineRef.current.incrementNpcCasualTalk('npc_lin_ruitang');
          setCurrentDialog(d);
        }
        setRefreshKey((prev) => prev + 1);
      }, 0);
      return;
    }
    if (choice.id === 'lin_sensitive_ask') {
      setTimeout(() => {
        setCurrentDialog({
          text: '你只能問一個方向。問了，另一個就不能再提。',
          type: 'narrator',
          choices: [
            { id: 'lin_branch_light', text: '我想問：散場的燈為什麼晚亮？誰能改這個表、誰在流程上游？' },
            { id: 'lin_branch_fear', text: '我想問：你是不是害怕兇手，還是害怕你上面的長官？' },
          ],
        });
        setRefreshKey((prev) => prev + 1);
      }, 0);
      return;
    }
    if (choice.id === 'lin_branch_light' && scene?.npcs) {
      const npc = scene.npcs.find((n: { id: string }) => n.id === 'npc_lin_ruitang');
      if (npc) {
        engine.applyEffect({ type: 'setFlag', flag: 'npc_lin_sensitive_done', value: true });
        engine.startNpcDialog('npc_lin_ruitang', 'node_lin_light_1');
        const node = engine.getCurrentNpcDialogNode();
        if (node) {
          setTimeout(() => {
            setCurrentDialog(buildDialogFromNpcNode(node, npc));
            setRefreshKey((prev) => prev + 1);
          }, 0);
        }
      }
      return;
    }
    if (choice.id === 'lin_branch_fear' && scene?.npcs) {
      const npc = scene.npcs.find((n: { id: string }) => n.id === 'npc_lin_ruitang');
      if (npc) {
        engine.applyEffect({ type: 'setFlag', flag: 'npc_lin_sensitive_done', value: true });
        engine.startNpcDialog('npc_lin_ruitang', 'node_lin_fear_1');
        const node = engine.getCurrentNpcDialogNode();
        if (node) {
          setTimeout(() => {
            setCurrentDialog(buildDialogFromNpcNode(node, npc));
            setRefreshKey((prev) => prev + 1);
          }, 0);
        }
      }
      return;
    }

    // 阿順：再聊聊 / 問敏感 → 兩選一（散場空窗 / 監視器死角）
    if (choice.id === 'ashun_sensitive_skip') {
      setTimeout(() => {
        if (!engineRef.current) return;
        const d = engineRef.current.triggerRandomNpcDialog('npc_ashun');
        if (d) {
          engineRef.current.incrementNpcCasualTalk('npc_ashun');
          setCurrentDialog(d);
        }
        setRefreshKey((prev) => prev + 1);
      }, 0);
      return;
    }
    if (choice.id === 'ashun_sensitive_ask') {
      setTimeout(() => {
        setCurrentDialog({
          text: '你只能問一個方向。問了，另一個就不能再提。',
          type: 'narrator',
          choices: [
            { id: 'ashun_branch_window', text: '我想問：散場後那一兩分鐘，誰在看？空窗有多大？' },
            { id: 'ashun_branch_deadzone', text: '我想問：監視器死角在哪？你真的確定嗎？' },
          ],
        });
        setRefreshKey((prev) => prev + 1);
      }, 0);
      return;
    }
    if (choice.id === 'ashun_branch_window' && scene?.npcs) {
      const npc = scene.npcs.find((n: { id: string }) => n.id === 'npc_ashun');
      if (npc) {
        engine.applyEffect({ type: 'setFlag', flag: 'npc_ashun_sensitive_done', value: true });
        engine.startNpcDialog('npc_ashun', 'node_ashun_window_1');
        const node = engine.getCurrentNpcDialogNode();
        if (node) {
          setTimeout(() => {
            setCurrentDialog(buildDialogFromNpcNode(node, npc));
            setRefreshKey((prev) => prev + 1);
          }, 0);
        }
      }
      return;
    }
    if (choice.id === 'ashun_branch_deadzone' && scene?.npcs) {
      const npc = scene.npcs.find((n: { id: string }) => n.id === 'npc_ashun');
      if (npc) {
        engine.applyEffect({ type: 'setFlag', flag: 'npc_ashun_sensitive_done', value: true });
        engine.startNpcDialog('npc_ashun', 'node_ashun_deadzone_1');
        const node = engine.getCurrentNpcDialogNode();
        if (node) {
          setTimeout(() => {
            setCurrentDialog(buildDialogFromNpcNode(node, npc));
            setRefreshKey((prev) => prev + 1);
          }, 0);
        }
      }
      return;
    }

    // 小張：再聊聊 / 問敏感 → 兩選一（表格與權限 / 口頭指示）
    if (choice.id === 'xiaozhang_sensitive_skip') {
      setTimeout(() => {
        if (!engineRef.current) return;
        const d = engineRef.current.triggerRandomNpcDialog('npc_xiaozhang');
        if (d) {
          engineRef.current.incrementNpcCasualTalk('npc_xiaozhang');
          setCurrentDialog(d);
        }
        setRefreshKey((prev) => prev + 1);
      }, 0);
      return;
    }
    if (choice.id === 'xiaozhang_sensitive_ask') {
      setTimeout(() => {
        setCurrentDialog({
          text: '你只能問一個方向。問了，另一個就不能再提。',
          type: 'narrator',
          choices: [
            { id: 'xiaozhang_branch_table', text: '我想問：燈延後三分鐘是誰改的？表格誰能改、誰在流程上游？' },
            { id: 'xiaozhang_branch_oral', text: '我想問：有人跟你說過什麼嗎？口頭指示、像背 SOP 的那個人。' },
          ],
        });
        setRefreshKey((prev) => prev + 1);
      }, 0);
      return;
    }
    if (choice.id === 'xiaozhang_branch_table' && scene?.npcs) {
      const npc = scene.npcs.find((n: { id: string }) => n.id === 'npc_xiaozhang');
      if (npc) {
        engine.applyEffect({ type: 'setFlag', flag: 'npc_xiaozhang_sensitive_done', value: true });
        engine.startNpcDialog('npc_xiaozhang', 'node_xiaozhang_table_1');
        const node = engine.getCurrentNpcDialogNode();
        if (node) {
          setTimeout(() => {
            setCurrentDialog(buildDialogFromNpcNode(node, npc));
            setRefreshKey((prev) => prev + 1);
          }, 0);
        }
      }
      return;
    }
    if (choice.id === 'xiaozhang_branch_oral' && scene?.npcs) {
      const npc = scene.npcs.find((n: { id: string }) => n.id === 'npc_xiaozhang');
      if (npc) {
        engine.applyEffect({ type: 'setFlag', flag: 'npc_xiaozhang_sensitive_done', value: true });
        engine.startNpcDialog('npc_xiaozhang', 'node_xiaozhang_oral_1');
        const node = engine.getCurrentNpcDialogNode();
        if (node) {
          setTimeout(() => {
            setCurrentDialog(buildDialogFromNpcNode(node, npc));
            setRefreshKey((prev) => prev + 1);
          }, 0);
        }
      }
      return;
    }

    // 周姊：再聊聊 / 問敏感 → 兩選一（哪裡太乾淨 / 你找到什麼）
    if (choice.id === 'zhou_sensitive_skip') {
      setTimeout(() => {
        if (!engineRef.current) return;
        const d = engineRef.current.triggerRandomNpcDialog('npc_zhou_jie');
        if (d) {
          engineRef.current.incrementNpcCasualTalk('npc_zhou_jie');
          setCurrentDialog(d);
        }
        setRefreshKey((prev) => prev + 1);
      }, 0);
      return;
    }
    if (choice.id === 'zhou_sensitive_ask') {
      setTimeout(() => {
        setCurrentDialog({
          text: '你只能問一個方向。問了，另一個就不能再提。',
          type: 'narrator',
          choices: [
            { id: 'zhou_branch_clean', text: '我想問：你說「太乾淨」，哪裡太乾淨？誰在急著擦？' },
            { id: 'zhou_branch_fragment', text: '我想問：你找到什麼？燈晚亮你怎麼確定？' },
          ],
        });
        setRefreshKey((prev) => prev + 1);
      }, 0);
      return;
    }
    if (choice.id === 'zhou_branch_clean' && scene?.npcs) {
      const npc = scene.npcs.find((n: { id: string }) => n.id === 'npc_zhou_jie');
      if (npc) {
        engine.applyEffect({ type: 'setFlag', flag: 'npc_zhou_jie_sensitive_done', value: true });
        engine.startNpcDialog('npc_zhou_jie', 'node_zhou_clean_1');
        const node = engine.getCurrentNpcDialogNode();
        if (node) {
          setTimeout(() => {
            setCurrentDialog(buildDialogFromNpcNode(node, npc));
            setRefreshKey((prev) => prev + 1);
          }, 0);
        }
      }
      return;
    }
    if (choice.id === 'zhou_branch_fragment' && scene?.npcs) {
      const npc = scene.npcs.find((n: { id: string }) => n.id === 'npc_zhou_jie');
      if (npc) {
        engine.applyEffect({ type: 'setFlag', flag: 'npc_zhou_jie_sensitive_done', value: true });
        const alreadyHaveFragment = !!currentState.flags?.black_fragment_found;
        engine.startNpcDialog(
          'npc_zhou_jie',
          alreadyHaveFragment ? 'node_zhou_fragment_1_already_have' : 'node_zhou_fragment_1'
        );
        const node = engine.getCurrentNpcDialogNode();
        if (node) {
          setTimeout(() => {
            setCurrentDialog(buildDialogFromNpcNode(node, npc));
            setRefreshKey((prev) => prev + 1);
          }, 0);
        }
      }
      return;
    }

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
        engine.endNpcDialog();
        setCurrentDialog(null);
      }
      setRefreshKey((prev) => prev + 1);
      return;
    }

    // 僅關閉對話的選項（無其他效果）
    if (choice.id === 'close_only') {
      setCurrentDialog(null);
      setRefreshKey((prev) => prev + 1);
      return;
    }

    // 一般對話選擇
    engine.handleDialogChoice(choice);

    // 第一章態度宣言四選一選完後：顯示推理句與進入第二章（handleDialogChoice 已於上方套用洞察與 ch1_attitude_declared）
    if (choice.id === 'ch1_attitude_procedure' || choice.id === 'ch1_attitude_evidence' || choice.id === 'ch1_attitude_human' || choice.id === 'ch1_attitude_both') {
      const st = engine.getState();
      const insights = st.insights || { procedure_insight: 0, human_insight: 0, evidence_insight: 0 };
      const p = insights.procedure_insight ?? 0;
      const h = insights.human_insight ?? 0;
      const e = insights.evidence_insight ?? 0;
      const maxVal = Math.max(p, h, e);
      const inferenceText =
        maxVal === p
          ? '兇手不是在黑暗裡殺人，他是在規定的黑暗裡殺人。'
          : maxVal === e
            ? '官腔很滑，但官腔擋不住痕跡。找一個他沒想到的小東西，他就會破。'
            : '他怕的不是兇手，是上面那張看不見的臉。恐懼會替兇手擦地板。';
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
      setRefreshKey((prev) => prev + 1);
      return;
    }

    if (choice.nextDialog) {
      setCurrentDialog(choice.nextDialog);
    }
    setRefreshKey((prev) => prev + 1);
  }, [buildDialogFromNpcNode]);

  // 處理對話關閉：若有進行中的 NPC 關鍵對話則結束，使下次點擊該 NPC 可恢復隨機談話
  const handleDialogClose = useCallback(() => {
    if (engineRef.current?.getState().activeNpcDialogId) {
      engineRef.current.endNpcDialog();
    }
    setCurrentDialog(null);
    // 檢查是否有待顯示的對話
    setDialogQueue(prev => {
      if (prev.length > 0) {
        const nextDialog = prev[0];
        // 使用 setTimeout 確保當前對話完全關閉後再顯示下一個
        setTimeout(() => {
          // 檢查是否為廣播類型，需要特殊處理
          if (nextDialog.type === 'broadcast') {
            // 播放廣播音效
            audioManager.playSFX('/audio/sfx/kk_sfx_broadcast.mp3', 0.7);
            // 觸發劇烈閃爍
            if (sceneViewRef.current) {
              sceneViewRef.current.triggerFlicker('intense');
              setTimeout(() => {
                sceneViewRef.current?.triggerFlicker('strong');
              }, 200);
              setTimeout(() => {
                sceneViewRef.current?.triggerFlicker('intense');
              }, 400);
            }
            // 顯示廣播對話
            setCurrentDialog(nextDialog);
          } else {
            setCurrentDialog(nextDialog);
          }
        }, 100);
        return prev.slice(1);
      } else {
        // 對話隊列為空，檢查是否需要顯示確認對話框或遊戲結束畫面
        // 檢查是否需要導航到下一個章節的導讀頁
        if (engineRef.current) {
          const state = engineRef.current.getState();
          
          // 檢查導航標記
          const nextChapterMap: Record<string, string> = {
            'navigate_to_ch2_intro': 'ch2',
            'navigate_to_ch3_intro': 'ch3',
            'navigate_to_ch4_intro': 'ch4',
            'navigate_to_ch5_intro': 'ch5',
          };
          
          for (const [flag, nextChapterId] of Object.entries(nextChapterMap)) {
            if (state.flags[flag]) {
              // 清除標記
              engineRef.current.applyEffect({
                type: 'setFlag',
                flag: flag,
                value: false,
              });
              // 導航到下一個章節的導讀頁
              setTimeout(() => {
                router.push(`/play/${nextChapterId}/intro`);
              }, 500);
              return prev;
            }
          }
          
          // 檢查遊戲是否完成（且尚未顯示過結束畫面）
          if (!gameEndShownRef.current && state.flags.game_completed) {
            // 標記已顯示，防止重複觸發
            gameEndShownRef.current = true;
            // 使用一個短暫延遲確保對話完全關閉
            setTimeout(() => {
              setShowGameEnd(true);
            }, 300);
            return prev;
          }
        }
        // 檢查是否正在處理垂降謎題的對話隊列
        if (isDescendPuzzleCompleteRef.current) {
          isDescendPuzzleCompleteRef.current = false;
          // 使用一個短暫延遲確保對話完全關閉
          setTimeout(() => {
            setShowDescendConfirm(true);
          }, 300);
        }
        return prev;
      }
    });
  }, []);

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
    
    // 預載入相鄰場景圖片（延遲載入，避免阻塞）
    const timeoutId = setTimeout(() => {
      const adjacentScenes = getAdjacentScenes(chapterId, sceneId);
      if (adjacentScenes.prev) {
        const prevScene = scenes[adjacentScenes.prev];
        if (prevScene) preloadImage(prevScene.background);
      }
      if (adjacentScenes.next) {
        const nextScene = scenes[adjacentScenes.next];
        if (nextScene) preloadImage(nextScene.background);
      }
    }, 500);
    
    return () => {
      clearTimeout(timeoutId);
    };
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
    // 使用 setTimeout 確保在客戶端首次渲染後才更新狀態，避免 hydration 錯誤
    if (isNewScene) {
      // 更新追蹤的場景
      lastDisplayedSceneRef.current = sceneId;
      
      // 延遲到下一幀執行，確保在首次渲染完成後才更新狀態
      setTimeout(() => {
        showSceneNameWithTimer(currentScene.name, 2000);
      }, 0);
    }
    
    // 場景切換時清空對話隊列與 Zoom 覆蓋層
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
      
      // 即使場景已在 visitedScenes 中，如果 URL 改變了，也要顯示場景名稱
      // 使用 ref 檢查是否為新場景
      if (lastDisplayedSceneRef.current !== sceneId) {
        lastDisplayedSceneRef.current = sceneId;
        const newScene = scenes[sceneId];
        if (newScene) {
          // 延遲到下一幀執行，確保在首次渲染完成後才更新狀態
          setTimeout(() => {
            showSceneNameWithTimer(newScene.name, 2000);
          }, 0);
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

    // 章節謎題已關閉（模組化改造：解謎由流程設定控制，目前不顯示）
    const _isUnlocked = engine.checkChapterPuzzleUnlock(chapterId);
    if (false && _isUnlocked && chapterId !== 'ch1') {
      const state = engine.getState();
      if (!state.flags[`chapter_puzzle_${chapterId}_shown`] && !showChapterPuzzle) {
        setShowChapterPuzzle(true);
        engine.applyEffect({
          type: 'setFlag',
          flag: `chapter_puzzle_${chapterId}_shown`,
          value: true,
        });
      }
    }
  }, [sceneId, chapterId, refreshKey]); // 移除 showChapterPuzzle 從依賴，避免循環

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
        setTimeout(() => {
          preloadSVGBatch(adjacentPaths);
        }, 1000);
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

  // 環境音：cleanup 延遲停止（給 Strict Mode 取消用）、目前播放路徑（同曲目不重播）
  const ambientStopTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastAmbientSceneIdRef = useRef<string | null>(null);
  const currentAmbientPathRef = useRef<string | null>(null);

  // 進入場景時播放環境音（帶漸變效果）- 以 URL 的 sceneId 為準
  useEffect(() => {
    if (!sceneId) return;
    
    if (ambientStopTimeoutRef.current) {
      clearTimeout(ambientStopTimeoutRef.current);
      ambientStopTimeoutRef.current = null;
    }
    
    // 第一章場景 BGM：置於 public/audio/bgm/kk_bgm_ch1.mp3
    const ch1BgmPath = '/audio/bgm/kk_bgm_ch1.mp3';
    const ambientMap: Record<string, { path: string; volume: number }> = {
      'scene_ch1_cinema_a_hall': { path: ch1BgmPath, volume: 0.7 },
      'scene_ch1_projection_room': { path: ch1BgmPath, volume: 0.7 },
      'scene_ch1_restroom': { path: ch1BgmPath, volume: 0.7 },
    };
    
    const ambient = ambientMap[sceneId];
    const isSameSceneReRun = lastAmbientSceneIdRef.current === sceneId;
    lastAmbientSceneIdRef.current = sceneId;
    
    if (ambient) {
      const isSameTrack = currentAmbientPathRef.current === ambient.path;
      // 同一場景重跑（Strict Mode）：不重播
      if (isSameSceneReRun) {
        // 不做事，音樂繼續
      } else if (isSameTrack) {
        // 第一章三場景共用同一曲目：不 stop 不重播，只確保音量
        audioManager.fadeAmbient(ambient.volume, 300);
      } else {
        // 新曲目：正常播放
        currentAmbientPathRef.current = ambient.path;
        audioManager.playAmbient(ambient.path, 0);
        setTimeout(() => {
          audioManager.fadeAmbient(ambient.volume, 1000);
        }, 100);
      }
    }
    
    return () => {
      if (!ambient) return;
      ambientStopTimeoutRef.current = setTimeout(() => {
        audioManager.fadeAmbient(0, 500);
        ambientStopTimeoutRef.current = setTimeout(() => {
          audioManager.stopAmbient();
          currentAmbientPathRef.current = null;
          ambientStopTimeoutRef.current = null;
        }, 500);
      }, 100);
    };
  }, [sceneId]);

  // 觸發劇烈閃爍（廣播時使用）
  const triggerIntenseFlicker = useCallback(() => {
    if (sceneViewRef.current) {
      // 劇烈閃爍 2-3 次
      sceneViewRef.current.triggerFlicker('intense');
      setTimeout(() => {
        sceneViewRef.current?.triggerFlicker('strong');
      }, 200);
      setTimeout(() => {
        sceneViewRef.current?.triggerFlicker('intense');
      }, 400);
    }
  }, []);

  // 統一的廣播處理函數（音效+閃光+對話）
  const handleBroadcast = useCallback((dialog: Dialog) => {
    // 播放廣播音效
    audioManager.playSFX('/audio/sfx/kk_sfx_broadcast.mp3', 0.7);
    // 觸發劇烈閃爍
    triggerIntenseFlicker();
    // 顯示廣播對話
    setCurrentDialog(dialog);
  }, [triggerIntenseFlicker]);

  const handleHotspotClick = useCallback((hotspotId: string) => {
    if (!scene || !engineRef.current) return;
    const engine = engineRef.current;
    
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

    // 純提示型 hotspot 處理（只顯示旁白對話，不觸發事件或獲得道具）
    const narrativeHotspots: Record<string, string> = {
      // 第一空間
      'iv_drip_wheel': '你不是第一次被搬運。',
      'pillow_label': '你被當成可清洗的東西。',
      // 第二空間
      'rubber_glove': '你以為是保護，其實是限制你觸碰真相。',
      'cleaning_cart_nameplate': '連擦地的人也被排進表格內。',
      // 第三空間
      'size_tag': '人類的尺碼，最後只剩用途。',
      'carpet_fray': '有人把希望磨成了纖維。',
      // 第四空間
      'railing_knots': '你不是第一個版本。',
      // 第五空間
      'foam_code': '你被分級，不是被救治。',
      'tape_label': '他們在乎的是貨況，不是你。',
    };

    if (narrativeHotspots[hotspotId]) {
      const text = narrativeHotspots[hotspotId];
      if (chapterId === 'ch1') {
        const hotspot = scene.hotspots.find((h) => h.id === hotspotId);
        setZoomOverlay({
          active: true,
          background: scene.background,
          zoomCenter: hotspot ? getHotspotCenter(hotspot) : { x: 0.5, y: 0.5 },
          dialogs: [{ text, type: 'narrator' }],
        });
      } else {
        setCurrentDialog({ text, type: 'narrator' });
      }
      setRefreshKey(prev => prev + 1);
      return;
    }

    // 特殊處理：緊急呼叫盒打開 UV 燈面板
    if (hotspotId === 'emergency_box') {
      engine.addInteraction('emergency_box');
      // UV 燈使用時短暫閃爍
      if (sceneViewRef.current) {
        sceneViewRef.current.triggerFlicker('light');
      }
      setShowUVLight(true);
      setRefreshKey(prev => prev + 1);
      return;
    }


    // 特殊處理：抽屜互動
    if (hotspotId === 'drawer') {
      engine.addInteraction('drawer');
      const state = engine.getState();
      // 檢查是否有髮夾
      if (state.inventory.includes('rusty_hairpin')) {
        // 有髮夾，播放打開音效
        audioManager.playSFX('/audio/sfx/kk_sfx_drawer_open.mp3', 0.7);
        // 有髮夾，觸發打開事件
        const result = engine.triggerEvent('open_drawer');
        if (result?.dialog) {
          setCurrentDialog(result.dialog);
        }
        setRefreshKey(prev => prev + 1);
        return;
      } else {
        // 沒有髮夾，顯示提示
        const result = engine.triggerEvent('try_open_drawer');
        if (result?.dialog) {
          setCurrentDialog(result.dialog);
        }
        setRefreshKey(prev => prev + 1);
        return;
      }
    }


    // 第二空間：病床排列（病床輪子音效）
    if (hotspotId === 'beds' && scene?.id === 'ch1_sc2') {
      const state = engine.getState();
      if (state.flags.beds_labels_revealed && state.inventory.includes('mirror_shard')) {
        audioManager.playSFX('/audio/sfx/kk_sfx_bed_wheel.mp3', 0.5);
      }
    }

    // 第二空間：702門打開（門吱呀聲）
    if (hotspotId === 'door_702' && scene?.id === 'ch1_sc2') {
      const state = engine.getState();
      if (state.flags.door_702_open) {
        audioManager.playSFX('/audio/sfx/kk_sfx_door_creak.mp3', 0.6);
      }
    }

    // 第三空間音效觸發（在特殊處理邏輯中整合）

    // 第四空間：除鏽劑使用（除鏽劑音效）
    if (hotspotId === 'plant' && scene?.id === 'ch1_sc4') {
      audioManager.playSFX('/audio/sfx/kk_sfx_rust_remover.mp3', 0.6);
    }

    // 第四空間：工具箱打開（工具箱打開音效）
    if (hotspotId === 'toolbox' && scene?.id === 'ch1_sc4') {
      const state = engine.getState();
      if (state.inventory.includes('rust_remover')) {
        audioManager.playSFX('/audio/sfx/kk_sfx_toolbox_open.mp3', 0.7);
      }
    }

    // 第四空間：固定點選擇（繩索固定音效）
    if (hotspotId === 'fixed_point_2' && scene?.id === 'ch1_sc4') {
      const state = engine.getState();
      if (state.inventory.includes('blank_nameplate') && state.flags.restraints_collected) {
        audioManager.playSFX('/audio/sfx/kk_sfx_rope_tension.mp3', 0.5);
      }
    }

    // 第四空間：垂降（垂降音效）
    if (hotspotId === 'descend_point' && scene?.id === 'ch1_sc4') {
      const state = engine.getState();
      if (state.flags.fixed_point_selected) {
        audioManager.playSFX('/audio/sfx/kk_sfx_descend.mp3', 0.6);
      }
    }

    // 第五空間：箱子排列（箱子拖動音效）
    if (hotspotId === 'boxes_area' && scene?.id === 'ch1_sc5') {
      const state = engine.getState();
      if (state.flags.label_read && state.flags.pain_patch_found) {
        audioManager.playSFX('/audio/sfx/kk_sfx_box_drag.mp3', 0.5);
      }
    }

    // 第五空間：心臟箱打開（箱子打開音效）
    if (hotspotId === 'heart_box' && scene?.id === 'ch1_sc5') {
      const state = engine.getState();
      if (state.flags.boxes_arranged) {
        audioManager.playSFX('/audio/sfx/kk_sfx_box_open.mp3', 0.6);
      }
    }

    // 第五空間：最終出口（門解鎖音效）
    if (hotspotId === 'exit' && scene?.id === 'ch1_sc5') {
      const state = engine.getState();
      if (state.flags.final_password_revealed || state.flags.coordinates_revealed) {
        audioManager.playSFX('/audio/sfx/kk_sfx_door_unlock.mp3', 0.7);
      }
    }

    // 第一空間特殊處理：門的互動
    if (hotspotId === 'door' && scene?.id === 'ch1_sc1') {
      const state = engine.getState();
      if (!state.flags.door_701_open) {
        // 門未打開，觸發謎題
        // 點下大門時播放尖銳金屬聲
        audioManager.playSFX('/audio/sfx/kk_sfx_metal.mp3', 0.6);
      } else {
        // 門已打開，顯示確認對話
        setShowDoor701Confirm(true);
        setRefreshKey(prev => prev + 1);
        return;
      }
    }

    // 第二空間特殊處理：病床（需要先取得鏡片碎角並揭示標籤才能解謎）
    if (hotspotId === 'beds' && scene?.id === 'ch1_sc2') {
      const state = engine.getState();
      
      // 檢查1：是否有鏡片碎角
      if (!state.inventory.includes('mirror_shard')) {
        setCurrentDialog({
          text: '每張病床上都有標籤，但字跡模糊不清。你需要工具才能看清上面的內容。',
          type: 'narrator',
        });
        setRefreshKey(prev => prev + 1);
        return;
      }
      
      // 檢查2：是否已揭示標籤
      if (!state.flags.beds_labels_revealed) {
        engine.addInteraction('beds');
        setCurrentDialog({
          text: '病床上的標籤很模糊，看不清楚。你手中的鏡片碎角或許可以反射光線，讓你看清標籤上的字。',
          type: 'narrator',
        });
        setRefreshKey(prev => prev + 1);
        return;
      }
      
    }

    // 第二空間特殊處理：破碎的鏡子（純提示，增強沉浸感）
    if (hotspotId === 'mirror' && scene?.id === 'ch1_sc2') {
      const state = engine.getState();
      // 如果已經收集了鏡片碎角，顯示不同的提示
      if (state.inventory.includes('mirror_shard')) {
        setCurrentDialog({
          text: '破碎的鏡面映出你支離破碎的倒影。你已經撿起了地上的碎片，但鏡子本身依然破碎。',
          type: 'narrator',
        });
      } else {
        const hotspot = scene.hotspots.find(h => h.id === 'mirror');
        if (hotspot?.hint) {
          setCurrentDialog({
            text: hotspot.hint,
            type: 'narrator',
          });
        }
      }
      setRefreshKey(prev => prev + 1);
      return;
    }

    // 第二空間特殊處理：702號病房的門
    if (hotspotId === 'door_702' && scene?.id === 'ch1_sc2') {
      const state = engine.getState();
      if (!state.flags.door_702_open) {
        // 門未打開，顯示關閉提示
        setCurrentDialog({
          text: '702號病房的門緊閉著，無法進入。',
          type: 'narrator',
        });
        setRefreshKey(prev => prev + 1);
        return;
      } else {
        // 門已打開，顯示確認對話
        setShowDoor702Confirm(true);
        setRefreshKey(prev => prev + 1);
        return;
      }
    }

    // 第二空間特殊處理：密碼盤（觸發可選謎題）
    if (hotspotId === 'password_panel' && scene?.id === 'ch1_sc2') {
      return; // 場景謎題目前關閉
    }

    // 第二空間特殊處理：值班表（如果已經有便條，觸發重新閱讀事件）
    if (hotspotId === 'duty_schedule' && scene?.id === 'ch1_sc2') {
      const state = engine.getState();
      // 如果已經有便條，直接顯示內容（重新閱讀）
      if (state.inventory.includes('note')) {
        const result = engine.triggerEvent('read_note');
        if (result?.dialog) {
          setCurrentDialog(result.dialog);
          setRefreshKey(prev => prev + 1);
          return;
        }
      }
      // 如果沒有便條，會由 handleItemCollection 處理
    }


    // 第三空間特殊處理：衣櫃
    if (hotspotId === 'wardrobe' && scene?.id === 'ch1_sc3') {
      const state = engine.getState();
      // 檢查是否已閱讀日記（觸發跳嚇的前置條件）
      if (!state.flags.diary_read) {
        setCurrentDialog({
          text: '衣櫃門緊閉。也許你應該先探索房間的其他地方。',
          type: 'narrator',
        });
        setRefreshKey(prev => prev + 1);
        return;
      }
      // 如果已經觸發過跳嚇，顯示提示
      if (state.flags.jump_scare_triggered) {
        setCurrentDialog({
          text: '衣櫃已經被打開了。假人還在那裡，但你不會再被嚇到。',
          type: 'narrator',
        });
        setRefreshKey(prev => prev + 1);
        return;
      }
      // 播放音效和閃爍效果
      audioManager.playSFX('/audio/sfx/kk_sfx_wardrobe_open.mp3', 0.8);
      if (sceneViewRef.current) {
        sceneViewRef.current.triggerFlicker('intense');
      }
      // 記錄互動，然後觸發跳嚇事件
      engine.addInteraction('wardrobe');
      const result = engine.triggerEvent('wardrobe_jump_scare');
      if (result?.dialog) {
        setCurrentDialog(result.dialog);
        setRefreshKey(prev => prev + 1);
        return;
      }
      // 如果事件觸發失敗，顯示 hotspot 提示
      const hotspot = scene.hotspots.find(h => h.id === 'wardrobe');
      if (hotspot?.hint) {
        setCurrentDialog({
          text: hotspot.hint,
          type: 'narrator',
        });
        setRefreshKey(prev => prev + 1);
      }
      return;
    }

    // 第三空間特殊處理：監控螢幕
    if (hotspotId === 'monitor' && scene?.id === 'ch1_sc3') {
      const state = engine.getState();
      // 檢查是否已觸發跳嚇（激活監控的前置條件）
      if (!state.flags.jump_scare_triggered) {
        setCurrentDialog({
          text: '監控螢幕突然亮起。也許你應該先探索房間的其他地方。',
          type: 'narrator',
        });
        setRefreshKey(prev => prev + 1);
        return;
      }
      // 如果已經激活過監控，顯示提示
      if (state.flags.monitor_activated) {
        setCurrentDialog({
          text: '監控螢幕還在顯示你在 701 病房訓練的畫面。',
          type: 'narrator',
        });
        setRefreshKey(prev => prev + 1);
        return;
      }
      // 播放音效
      audioManager.playSFX('/audio/sfx/kk_sfx_monitor_on.mp3', 0.5);
      // 記錄互動，然後觸發激活事件
      engine.addInteraction('monitor');
      const result = engine.triggerEvent('monitor_activation');
      if (result) {
        // 找出所有對話效果
        const dialogEffects = result.effects.filter((e: any) => e.type === 'showDialog');
        // 檢查是否有廣播對話
        const broadcastDialog = dialogEffects.find((e: any) => e.dialog?.type === 'broadcast');
        if (broadcastDialog?.dialog) {
          handleBroadcast(broadcastDialog.dialog);
        } else if (dialogEffects[0]?.dialog) {
          setCurrentDialog(dialogEffects[0].dialog);
        }
        setRefreshKey(prev => prev + 1);
        return;
      }
      // 如果事件觸發失敗，顯示 hotspot 提示
      const hotspot = scene.hotspots.find(h => h.id === 'monitor');
      if (hotspot?.hint) {
        setCurrentDialog({
          text: hotspot.hint,
          type: 'narrator',
        });
        setRefreshKey(prev => prev + 1);
      }
      return;
    }

    // 第三空間特殊處理：沙發縫隙
    if (hotspotId === 'sofa_gap' && scene?.id === 'ch1_sc3') {
      const state = engine.getState();
      // 檢查是否已獲得線索（獲得手把的前置條件）
      if (!state.flags.handle_location_revealed) {
        setCurrentDialog({
          text: '沙發的縫隙裡似乎有什麼東西，但你看不清楚。也許你應該先查看其他線索。',
          type: 'narrator',
        });
        setRefreshKey(prev => prev + 1);
        return;
      }
      // 如果已經獲得手把，顯示提示
      if (state.inventory.includes('door_handle')) {
        setCurrentDialog({
          text: '你已經從沙發縫隙中找到了手把。',
          type: 'system',
        });
        setRefreshKey(prev => prev + 1);
        return;
      }
      // 記錄互動，然後觸發獲得手把事件
      engine.addInteraction('sofa_gap');
      const result = engine.triggerEvent('find_handle');
      if (result) {
        // 檢查是否有道具被添加
        const addItemEffects = result.effects.filter((e: any) => e.type === 'addItem');
        const dialogEffects = result.effects.filter((e: any) => e.type === 'showDialog');
        
        // 如果有道具被添加，先顯示道具獲得提示
        if (addItemEffects.length > 0) {
          const firstItemEffect = addItemEffects[0];
          const itemId = firstItemEffect?.itemId;
          const item = itemId != null ? items[itemId] : undefined;
          if (item) {
            // 播放收集音效
            audioManager.playInteractionSFX('collect');
            
            // 顯示道具獲得提示
            setObtainedItem({
              id: item.id,
              name: item.name,
              image: item.image,
              svgImage: item.svgImage,
              description: item.description,
            });
            setShowItemNotification(true);
            setRefreshKey(prev => prev + 1);
            return;
          }
        }
        
        // 沒有道具，直接顯示對話
        if (result.dialog) {
          setCurrentDialog(result.dialog);
        } else if (dialogEffects[0]?.dialog) {
          setCurrentDialog(dialogEffects[0].dialog);
        }
        setRefreshKey(prev => prev + 1);
        return;
      }
      // 如果事件觸發失敗，顯示 hotspot 提示
      const hotspot = scene.hotspots.find(h => h.id === 'sofa_gap');
      if (hotspot?.hint) {
        setCurrentDialog({
          text: hotspot.hint,
          type: 'narrator',
        });
        setRefreshKey(prev => prev + 1);
      }
      return;
    }

    // 第三空間特殊處理：落地窗（檢查是否需要手把）
    if (hotspotId === 'window' && scene?.id === 'ch1_sc3') {
      const state = engine.getState();
      // 檢查是否已有手把
      if (!state.inventory.includes('door_handle')) {
        // 沒有手把，顯示提示
        setCurrentDialog({
          text: '落地窗被鎖住了，需要手把才能打開。\n\n手把可能在房間的某個角落，或者被藏在某個地方。',
          type: 'narrator',
        });
        setRefreshKey(prev => prev + 1);
        return;
      } else {
        // 有手把，播放音效並顯示文案
        audioManager.playSFX('/audio/sfx/kk_sfx_window_open.mp3', 0.6);
        // 顯示文案
        setCurrentDialog({
          text: '你把手把插入落地窗的鎖孔，轉動。窗戶緩緩打開，外面的風吹進來，帶著鐵鏽和消毒水的味道。\n\n你終於可以離開這個「展示用的」房間了。',
          type: 'narrator',
        });
        // 延遲顯示確認對話框
        setTimeout(() => {
          setShowWindow702Confirm(true);
        }, 2000);
        setRefreshKey(prev => prev + 1);
        return;
      }
    }

    // 第四空間特殊處理：固定點（純提示，引導玩家去垂降點）
    if ((hotspotId === 'fixed_point_1' || hotspotId === 'fixed_point_2') && scene?.id === 'ch1_sc4') {
      const state = engine.getState();
      const hasRequiredItems = state.inventory.includes('blank_nameplate') && 
                               state.inventory.includes('ceramic_shard') && 
                               state.inventory.includes('rust_remover');
      if (hasRequiredItems) {
        setCurrentDialog({
          text: '欄杆上有許多固定點，但單一固定點無法承受你的體重。你需要選擇多個固定點形成支撐系統。前往垂降點，根據你收集的線索選擇正確的固定點組合。',
          type: 'narrator',
        });
      } else {
        setCurrentDialog({
          text: '欄杆上有固定點，但你需要收集更多線索才能判斷哪些是安全的。檢查你收集的道具。',
          type: 'narrator',
        });
      }
      setRefreshKey(prev => prev + 1);
      return;
    }

    // 第四空間特殊處理：垂降點（觸發垂降謎題或顯示確認對話框）
    if (hotspotId === 'descend_point' && scene?.id === 'ch1_sc4') {
      // 檢查謎題是否已經解決過
      if (engine.hasFlag('puzzle_descend_solved')) {
        // 謎題已解決，直接顯示確認對話框
        setShowDescendConfirm(true);
        setRefreshKey(prev => prev + 1);
        return;
      }
      
      const state = engine.getState();
      
      // 檢查是否有必要的道具
      const hasRequiredItems = state.inventory.includes('blank_nameplate') && 
                               state.inventory.includes('ceramic_shard') && 
                               state.inventory.includes('rust_remover');
      if (!hasRequiredItems) {
        setCurrentDialog({
          text: '固定點需要線索才能判斷。',
          type: 'narrator',
        });
        setRefreshKey(prev => prev + 1);
        return;
      }
    }

    // 第五空間特殊處理：箱子區域（觸發拼箱排序謎題）
    if (hotspotId === 'boxes_area' && scene?.id === 'ch1_sc5') {
      const state = engine.getState();
      // 如果謎題已經解決，顯示提示
      if (state.flags.boxes_arranged) {
        setCurrentDialog({
          text: '箱子已經按照優先級排列好了。',
          type: 'narrator',
        });
        setRefreshKey(prev => prev + 1);
        return;
      }
      // 先記錄互動，這樣後續檢查才能通過
      engine.addInteraction('boxes_area');
    }

    // 第五空間特殊處理：心臟箱（需要先完成排序）
    if (hotspotId === 'heart_box' && scene?.id === 'ch1_sc5') {
      const state = engine.getState();
      // 如果已經獲得身份證，顯示提示
      if (state.inventory.includes('id_card')) {
        setCurrentDialog({
          text: '心臟箱已經被打開，身份證已經被你取走了。',
          type: 'narrator',
        });
        setRefreshKey(prev => prev + 1);
        return;
      }
      if (!state.flags.boxes_arranged) {
        setCurrentDialog({
          text: '你需要先按照優先級排列這些箱子。',
          type: 'narrator',
        });
        setRefreshKey(prev => prev + 1);
        return;
      }
      // 已排序，觸發獲得身份證事件
      engine.addInteraction('heart_box');
      const result = engine.triggerEvent('find_id_card');
      if (result) {
        // 檢查是否有道具被添加
        const addItemEffects = result.effects.filter((e: any) => e.type === 'addItem');
        const dialogEffects = result.effects.filter((e: any) => e.type === 'showDialog');
        
        // 如果有道具被添加，先顯示道具獲得提示
        if (addItemEffects.length > 0) {
          const firstItemEffect = addItemEffects[0];
          const itemId = firstItemEffect?.itemId;
          const item = itemId != null ? items[itemId] : undefined;
          if (item) {
            // 播放收集音效
            audioManager.playInteractionSFX('collect');
            
            // 顯示道具獲得提示
            setObtainedItem({
              id: item.id,
              name: item.name,
              image: item.image,
              svgImage: item.svgImage,
              description: item.description,
            });
            setShowItemNotification(true);
            setRefreshKey(prev => prev + 1);
            return;
          }
        }
        
        // 沒有道具，直接顯示對話
        if (dialogEffects[0]?.dialog) {
          setCurrentDialog(dialogEffects[0].dialog);
        }
        setRefreshKey(prev => prev + 1);
        return;
      }
    }

    // 第五空間特殊處理：出口（觸發最終謎題）
    if (hotspotId === 'exit' && scene?.id === 'ch1_sc5') {
      const state = engine.getState();
      if (!state.flags.final_password_revealed && !state.flags.coordinates_revealed) {
        setCurrentDialog({
          text: '逃生口需要座標密碼才能打開。你需要先完成拼箱排序或查看身份證背面。',
          type: 'narrator',
        });
        setRefreshKey(prev => prev + 1);
        return;
      }
    }

    // 第五空間特殊處理：腎箱、肝箱、肺箱（純提示型，不觸發事件）
    if ((hotspotId === 'kidney_box' || hotspotId === 'liver_box' || hotspotId === 'lung_box') && scene?.id === 'ch1_sc5') {
      const hotspot = scene.hotspots.find(h => h.id === hotspotId);
      if (hotspot?.hint) {
        setCurrentDialog({
          text: hotspot.hint,
          type: 'narrator',
        });
        setRefreshKey(prev => prev + 1);
        return;
      }
    }

    // 特殊處理：第四空間工具箱（分離道具獲得提示，使用對話隊列）
    if (hotspotId === 'toolbox' && scene?.id === 'ch1_sc4') {
      const state = engine.getState();
      if (!state.inventory.includes('rust_remover')) {
        setCurrentDialog({
          text: '工具箱的鎖扣鏽蝕嚴重，需要除鏽劑才能打開。',
          type: 'narrator',
        });
        setRefreshKey(prev => prev + 1);
        return;
      }
      // 播放音效
      audioManager.playSFX('/audio/sfx/kk_sfx_toolbox_open.mp3', 0.7);
      // 記錄互動，然後觸發打開事件
      engine.addInteraction('toolbox');
      const result = engine.triggerEvent('open_toolbox');
      if (result) {
        // 獲取所有對話效果
        const dialogEffects = result.effects.filter((e: any) => e.type === 'showDialog');
        const addItemEffects = result.effects.filter((e: any) => e.type === 'addItem');
        
        // 如果有道具被添加，先顯示道具獲得提示
        if (addItemEffects.length > 0) {
          const firstItemEffect = addItemEffects[0];
          const itemId = firstItemEffect?.itemId;
          const item = itemId != null ? items[itemId] : undefined;
          if (item) {
            // 播放收集音效
            audioManager.playInteractionSFX('collect');
            
            // 顯示道具獲得提示
            setObtainedItem({
              id: item.id,
              name: item.name,
              image: item.image,
              svgImage: item.svgImage,
              description: item.description,
            });
            setShowItemNotification(true);
            setRefreshKey(prev => prev + 1);
            return;
          }
        }
        
        // 沒有道具，直接顯示對話
        const dialogs: Dialog[] = [];
        dialogEffects.forEach((effect: any) => {
          if (effect.dialog) {
            dialogs.push(effect.dialog);
          }
        });
        
        if (dialogs.length > 0) {
          addDialogsToQueue(dialogs);
        }
        
        setRefreshKey(prev => prev + 1);
        return;
      }
    }

    // 步驟3：通用事件處理（處理不會添加道具的事件）
    // 檢查是否有事件映射但沒有被 handleItemCollection 處理
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
          
          // 檢查是否為角色對話事件，使用新的對話系統
          const isCharacterDialog = /^(character_\d_|person_)(first|second|third|fourth|fifth)_talk$/.test(eventId) || 
                                    /^talk_to_(character_|person)/.test(eventId);
          
          if (isCharacterDialog) {
            // 映射事件 ID 到對話鏈 ID
            let conversationId: string | null = null;
            if (eventId === 'talk_to_character_1' || eventId.startsWith('character_1_')) {
              conversationId = 'character_1_conversation';
            } else if (eventId === 'talk_to_character_2' || eventId.startsWith('character_2_')) {
              conversationId = 'character_2_conversation';
            } else if (eventId === 'talk_to_person' || eventId.startsWith('person_')) {
              conversationId = 'person_conversation';
            }
            
            // 如果找到對應的對話鏈，使用新系統
            if (conversationId && characterConversations[conversationId]) {
              const conversation = characterConversations[conversationId];
              
              // 檢查是否已經完成過（如果需要的話）
              if (conversation.onComplete?.setFlag) {
                const flag = conversation.onComplete.setFlag;
                if (engine.hasFlag(flag)) {
                  // 已經完成過，不重複觸發
                  return;
                }
              }
              
              // 顯示角色對話
              setCurrentConversation(conversation);
              setRefreshKey(prev => prev + 1);
              return; // 已處理
            }
          } else {
            // 非角色對話：正常觸發單個事件
            const result = engine.triggerEvent(eventId);
            if (result) {
              // 處理對話效果
              const dialogEffects = result.effects.filter((e: any) => e.type === 'showDialog');
              if (dialogEffects.length > 0) {
                const dialogs: Dialog[] = [];
                dialogEffects.forEach((effect: any) => {
                  if (effect.dialog) {
                    dialogs.push(effect.dialog);
                  }
                });
                if (dialogs.length > 0) {
                  const hotspot = scene.hotspots.find(h => h.id === hotspotId);
                  if (chapterId === 'ch1') {
                    setZoomOverlay({
                      active: true,
                      background: scene.background,
                      zoomCenter: hotspot ? getHotspotCenter(hotspot) : { x: 0.5, y: 0.5 },
                      dialogs,
                      interactionName: hotspot?.description,
                    });
                  } else {
                    addDialogsToQueue(dialogs, hotspot?.description);
                  }
                }
              }
              setRefreshKey(prev => prev + 1);
              return; // 已處理
            }
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
      const hintDialog: Dialog = {
        text: hotspot.hint || hotspot.description || '',
        type: 'narrator',
      };
      if (chapterId === 'ch1') {
        setZoomOverlay({
          active: true,
          background: scene.background,
          zoomCenter: getHotspotCenter(hotspot),
          dialogs: [hintDialog],
          interactionName: hotspot.description,
        });
      } else {
        setCurrentDialog(hintDialog);
      }
      setRefreshKey(prev => prev + 1);
    }
  }, [scene, handleItemCollection, addDialogsToQueue, chapterId]); // engine 來自 useRef，不需要在依賴中

  const handleItemClick = useCallback((itemId: string) => {
    if (!engineRef.current) return;
    const engine = engineRef.current;
    
    // 第二空間特殊處理：便條（觸發閱讀事件）
    if (itemId === 'note' && scene?.id === 'ch1_sc2') {
      const result = engine.triggerEvent('read_note');
      if (result?.dialog) {
        setCurrentDialog(result.dialog);
        setRefreshKey(prev => prev + 1);
        return;
      }
    }
    
    // 第二空間特殊處理：鏡片碎角（用於病床）
    if (itemId === 'mirror_shard' && scene?.id === 'ch1_sc2') {
      const state = engine.getState();
      // 檢查是否已經使用過（已觀察病床）
      if (state.flags.beds_labels_revealed) {
        // 已經使用過，顯示包含觀察結果的道具描述
        const item = scene?.items.find(i => i.id === itemId);
        const itemData = items[itemId];
        setCurrentDialog({
          text: `${item?.name || '鏡片碎角'}\n\n${item?.description || ''}\n\n透過鏡片碎角的反射，你看到每張病床上都有模糊的標籤：「護理師」、「住院」、「主治」、「主任」。\n\n這些標籤有什麼意義嗎?`,
          type: 'item',
          svgImage: itemData?.svgImage,
          svgPosition: 'left',
        });
        setRefreshKey(prev => prev + 1);
        return;
      }
      // 檢查是否已與病床互動
      if (state.interactions.includes('beds')) {
        // 已與病床互動，觸發使用事件
        const result = engine.triggerEvent('use_mirror_shard_on_beds');
        if (result?.dialog) {
          setCurrentDialog(result.dialog);
          setRefreshKey(prev => prev + 1);
          return;
        }
      } else {
        // 未與病床互動，提示先觀察病床
        setCurrentDialog({
          text: '你需要在病床附近使用這個道具。先點擊病床觀察一下。',
          type: 'narrator',
        });
        setRefreshKey(prev => prev + 1);
        return;
      }
    }
    
    // 第三空間特殊處理：同意書（查看背面線索）
    if (itemId === 'consent_form' && scene?.id === 'ch1_sc3') {
      const state = engine.getState();
      // 檢查是否已閱讀日記
      if (state.flags.diary_read) {
        // 已閱讀日記，觸發查看背面事件
        const result = engine.triggerEvent('examine_consent_form');
        if (result?.dialog) {
          setCurrentDialog(result.dialog);
          setRefreshKey(prev => prev + 1);
          return;
        }
      } else {
        // 未閱讀日記，顯示普通描述
        const item = scene?.items.find(i => i.id === itemId);
        const itemData = items[itemId];
        if (item) {
          setCurrentDialog({
            text: item.description,
            type: 'item',
            svgImage: itemData?.svgImage,
            svgPosition: 'left',
          });
          setRefreshKey(prev => prev + 1);
          return;
        }
      }
    }
    
    // 第三空間特殊處理：錄音筆（播放錄音）
    if (itemId === 'recorder' && scene?.id === 'ch1_sc3') {
      const result = engine.triggerEvent('play_recorder');
      if (result?.dialog) {
        setCurrentDialog(result.dialog);
        setRefreshKey(prev => prev + 1);
        return;
      }
    }
    
    // 第三空間特殊處理：日記本（閱讀日記）
    if (itemId === 'diary' && scene?.id === 'ch1_sc3') {
      const result = engine.triggerEvent('read_diary');
      if (result?.dialog) {
        setCurrentDialog(result.dialog);
        setRefreshKey(prev => prev + 1);
        return;
      }
    }
    
    // 第五空間特殊處理：身份證（查看背面座標）
    if (itemId === 'id_card' && scene?.id === 'ch1_sc5') {
      const result = engine.triggerEvent('read_id_back');
      if (result?.dialog) {
        setCurrentDialog(result.dialog);
        setRefreshKey(prev => prev + 1);
        return;
      }
    }
    
    // 第五空間特殊處理：座標（顯示座標位置）
    if (itemId === 'coordinates') {
      const item = items[itemId];
      if (item) {
        setCurrentDialog({
          text: `**座標**\n\n**${item.description}**\n\n這是從拼箱排序中獲得的座標。`,
          type: 'item',
          svgImage: item.svgImage,
          svgPosition: 'left',
        });
        setRefreshKey(prev => prev + 1);
        return;
      }
    }
    
    // 第五空間特殊處理：止痛貼片盒（查看背面線索）
    if (itemId === 'pain_patch' && scene?.id === 'ch1_sc5') {
      const state = engine.getState();
      if (!state.flags.pain_patch_found) {
        setCurrentDialog({
          text: '你翻轉其中一片，背面藏著小字：\n\n**「二樓露台，箱子先肺後肝。」**',
          type: 'narrator',
        });
        engine.applyEffect({ type: 'setFlag', flag: 'pain_patch_found', value: true });
        setRefreshKey(prev => prev + 1);
        return;
      } else {
        setCurrentDialog({
          text: '你已經看過止痛貼片盒背面的線索了。',
          type: 'narrator',
        });
        setRefreshKey(prev => prev + 1);
        return;
      }
    }
    
    const result = engine.useItem(itemId);
    const itemData = items[itemId];
    const showItemAsNotification = () => {
      if (itemData) {
        setObtainedItem({
          id: itemData.id,
          name: itemData.name,
          image: itemData.image,
          svgImage: itemData.svgImage,
          description: itemData.description,
        });
        setShowItemNotification(true);
        setRefreshKey(prev => prev + 1);
      }
    };

    if (result.success) {
      if (result.openPanel === 'pulse_clip') {
        setShowPulseClip(true);
      } else if (result.dialog) {
        setCurrentDialog(result.dialog);
      } else {
        showItemAsNotification();
      }
    } else {
      // 不受場景限制：用全域 items 顯示，與首次發現時相同（浮動提示）
      showItemAsNotification();
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
      setRefreshKey(prev => prev + 1);
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
                
                // 如果有道具添加，先顯示道具獲得提示
                if (eventAddItemEffects.length > 0) {
                  const firstItemEffect = eventAddItemEffects[0];
                  const itemId = firstItemEffect?.itemId;
                  const item = itemId != null ? items[itemId] : undefined;
                  if (item) {
                    // 播放收集音效
                    audioManager.playInteractionSFX('collect');
                    
                    // 顯示道具獲得提示
                    setObtainedItem({
                      id: item.id,
                      name: item.name,
                      image: item.image,
                      svgImage: item.svgImage,
                      description: item.description,
                    });
                    setShowItemNotification(true);
                    setRefreshKey(prev => prev + 1);
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
                
                setRefreshKey(prev => prev + 1);
                
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
          // 等待謎題解決對話顯示完後，觸發廣播事件
          setTimeout(() => {
            // 觸發 arrange_beds 事件（標記已設置，事件需求滿足）
            const result = engine.triggerEvent('arrange_beds');
            if (result) {
              // 找出所有對話效果
              const dialogEffects = result.effects.filter((e: any) => e.type === 'showDialog');
              
              // 先顯示廣播對話（使用統一的廣播處理）
              const broadcastDialog = dialogEffects.find((e: any) => e.dialog?.type === 'broadcast');
              if (broadcastDialog?.dialog) {
                handleBroadcast(broadcastDialog.dialog);
                
                // 再顯示旁白對話
                setTimeout(() => {
                  const narratorDialog = dialogEffects.find((e: any) => e.dialog?.type === 'narrator');
                  if (narratorDialog?.dialog) {
                    setCurrentDialog(narratorDialog.dialog);
                  }
                }, 3000);
              }
            }
          }, 2000); // 等待謎題解決對話顯示完
        }
        
        // 第四空間特殊處理：垂降謎題完成後顯示確認對話框
        // 注意：確認對話框的顯示邏輯已經移到 handleDialogClose 中處理
        
        // 如果有場景切換，直接使用 router.push 切換場景
        // 注意：病床排列謎題和垂降謎題不再自動切換場景，改為讓玩家選擇
        if (sceneChanged && currentPuzzle.id !== 'bed_arrangement' && currentPuzzle.id !== 'descend') {
          // 計算所有對話的總顯示時間
          const totalDialogTime = dialogEffects.length * 3000;
          if (dialogEffects.length > 0) {
            // 有對話時，延遲切換場景（讓用戶看完所有對話）
            setTimeout(() => {
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
        
        // 更新 refreshKey
        setRefreshKey(prev => prev + 1);
      } else {
        // 如果 puzzle.onSolve 不存在，檢查 state 是否顯示場景已改變
        const sceneChanged = newState.currentChapter !== chapterId || newState.currentScene !== sceneId;
        if (sceneChanged) {
          router.push(`/play/${newState.currentChapter}/${newState.currentScene}`);
        }
        setRefreshKey(prev => prev + 1);
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

  // 推理分析按鈕：僅 ch1/ch2/ch3 且本章所有場景都已拜訪且尚未完成推理時顯示；ch1 另須至少 3 位 NPC 已完成敏感問題
  const chapterScenes = getCurrentChapterScenes(chapterId);
  const allScenesVisited =
    chapterScenes.length > 0 && chapterScenes.every((s) => state.visitedScenes.includes(s));
  const reasoningDone = !!state.flags[`${chapterId}_reasoning_done`];
  const hasReasoningForChapter = !!reasoningByChapter[chapterId];
  const ch1Flags = state.flags || {};
  const ch1SensitiveCount = [
    ch1Flags.npc_lin_sensitive_done,
    ch1Flags.npc_ashun_sensitive_done,
    ch1Flags.npc_xiaozhang_sensitive_done,
    ch1Flags.npc_zhou_jie_sensitive_done,
  ].filter(Boolean).length;
  const showReasoningButton =
    hasReasoningForChapter &&
    allScenesVisited &&
    !reasoningDone &&
    !showSceneName &&
    (chapterId !== 'ch1' || ch1SensitiveCount >= 3);

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

    lastDisplayedSceneRef.current = targetSceneId;
    audioManager.playSFX('/audio/sfx/kk_sfx_scene_change.mp3', 0.3);

    // 步驟 1：只顯示大字（不改 engine、不 router），此時仍為舊場景，不會觸發「場景不存在」或 chapterData 重算
    showSceneNameWithTimer(targetScene.name, 4000);

    // 步驟 2：延遲後再切換場景與 URL（大字已穩定顯示）
    const sceneSwitchDelayMs = 1200;
    setTimeout(() => {
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
      setRefreshKey((prev) => prev + 1);
    }, sceneSwitchDelayMs);
  }, [router, showSceneNameWithTimer]);

  // 新手引導完成處理（必須在條件返回之前定義）
  const handleTutorialComplete = useCallback(() => {
    // 引導完成後可以執行任何初始化操作
  }, []);

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
          {/* 新手引導 */}
          <TutorialGuide onComplete={handleTutorialComplete} />
          
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
        
        <div className={`h-full w-full flex items-center justify-center p-4 md:p-8 transition-opacity duration-500 gpu-accelerated ${
          isSceneTransitioning ? 'opacity-0' : 'opacity-100'
        }`}>
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
            
            {/* 左側箭頭 - 切換到上一個場景（依章節場景列表顯示，不依賴 scenes 鍵值） */}
            {adjacentScenes.prev && (
              <button
                onClick={() => handleSceneNavigation(adjacentScenes.prev!)}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 group flex items-center justify-center w-6 h-6 bg-dark-surface/90 backdrop-blur-md border border-dark-border/50 rounded-full text-gray-300 hover:text-white hover:bg-dark-surface hover:border-dark-border transition-all duration-200 shadow-lg hover:scale-110"
                title={prevScene ? `前往：${prevScene.name}` : '上一場景'}
              >
                <ChevronLeft size={12} className="text-gray-300 group-hover:text-blue-400 transition-colors" />
              </button>
            )}
            
            {/* 右側箭頭 - 切換到下一個場景 */}
            {adjacentScenes.next && (
              <button
                onClick={() => handleSceneNavigation(adjacentScenes.next!)}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 group flex items-center justify-center w-6 h-6 bg-dark-surface/90 backdrop-blur-md border border-dark-border/50 rounded-full text-gray-300 hover:text-white hover:bg-dark-surface hover:border-dark-border transition-all duration-200 shadow-lg hover:scale-110"
                title={nextScene ? `前往：${nextScene.name}` : '下一場景'}
              >
                <ChevronRight size={12} className="text-gray-300 group-hover:text-blue-400 transition-colors" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* NPC 右側頭像列 - 場景名稱顯示時隱藏 */}
      {scene?.npcs && scene.npcs.length > 0 && !showSceneName && (
        <NpcRightStrip
          npcs={scene.npcs}
          activeNpcId={state?.activeNpcDialogId ?? undefined}
          onNpcClick={(npcId) => {
            if (!engineRef.current) return;
            const engine = engineRef.current;
            const st = engine.getState();
            const flags = st.flags || {};

            // 林瑞堂：方案 B+A（閒聊 ≥3 次 + 觀察點），問敏感問題前先選擇，兩條敏感問題二選一
            if (npcId === 'npc_lin_ruitang') {
              const casualCount = engine.getNpcCasualTalkCount('npc_lin_ruitang');
              const observed = !!flags.observed_any_ch1;
              const sensitiveDone = !!flags.npc_lin_sensitive_done;

              if (sensitiveDone) {
                const dialog = engine.triggerRandomNpcDialog(npcId);
                if (dialog) {
                  engine.incrementNpcCasualTalk(npcId);
                  setCurrentDialog(dialog);
                }
                return;
              }
              if (observed && casualCount >= 3) {
                setCurrentDialog({
                  text: '你覺得時機差不多了，可以試著往深一點問。',
                  type: 'narrator',
                  choices: [
                    { id: 'lin_sensitive_ask', text: '我想問一些比較敏感的問題。' },
                    { id: 'lin_sensitive_skip', text: '先不用，再聊聊就好。' },
                  ],
                });
                return;
              }
              const dialog = engine.triggerRandomNpcDialog(npcId);
              if (dialog) {
                engine.incrementNpcCasualTalk(npcId);
                setCurrentDialog(dialog);
              }
              return;
            }

            // 阿順：閒聊 ≥3 + 觀察點，問敏感／再聊聊，兩條敏感二選一
            if (npcId === 'npc_ashun') {
              const casualCount = engine.getNpcCasualTalkCount('npc_ashun');
              const observed = !!flags.observed_any_ch1;
              const sensitiveDone = !!flags.npc_ashun_sensitive_done;
              if (sensitiveDone) {
                const dialog = engine.triggerRandomNpcDialog(npcId);
                if (dialog) {
                  engine.incrementNpcCasualTalk(npcId);
                  setCurrentDialog(dialog);
                }
                return;
              }
              if (observed && casualCount >= 3) {
                setCurrentDialog({
                  text: '你覺得時機差不多了，可以試著往深一點問。',
                  type: 'narrator',
                  choices: [
                    { id: 'ashun_sensitive_ask', text: '我想問一些比較敏感的問題。' },
                    { id: 'ashun_sensitive_skip', text: '先不用，再聊聊就好。' },
                  ],
                });
                return;
              }
              const dialogAshun = engine.triggerRandomNpcDialog(npcId);
              if (dialogAshun) {
                engine.incrementNpcCasualTalk(npcId);
                setCurrentDialog(dialogAshun);
              }
              return;
            }

            // 小張：播映室已解鎖＋已觀察＋閒聊 ≥3，問敏感／再聊聊，兩條敏感二選一
            if (npcId === 'npc_xiaozhang') {
              const casualCount = engine.getNpcCasualTalkCount('npc_xiaozhang');
              const observed = !!flags.projection_room_observed && !!flags.projection_room_unlocked;
              const sensitiveDone = !!flags.npc_xiaozhang_sensitive_done;
              if (sensitiveDone) {
                const dialog = engine.triggerRandomNpcDialog(npcId);
                if (dialog) {
                  engine.incrementNpcCasualTalk(npcId);
                  setCurrentDialog(dialog);
                }
                return;
              }
              if (observed && casualCount >= 3) {
                setCurrentDialog({
                  text: '你覺得時機差不多了，可以試著往深一點問。',
                  type: 'narrator',
                  choices: [
                    { id: 'xiaozhang_sensitive_ask', text: '我想問一些比較敏感的問題。' },
                    { id: 'xiaozhang_sensitive_skip', text: '先不用，再聊聊就好。' },
                  ],
                });
                return;
              }
              const dialogXz = engine.triggerRandomNpcDialog(npcId);
              if (dialogXz) {
                engine.incrementNpcCasualTalk(npcId);
                setCurrentDialog(dialogXz);
              }
              return;
            }

            // 周姊：廁所已觀察＋閒聊 ≥3，問敏感／再聊聊，兩條敏感二選一
            if (npcId === 'npc_zhou_jie') {
              const casualCount = engine.getNpcCasualTalkCount('npc_zhou_jie');
              const observed = !!flags.observed_restroom_ch1;
              const sensitiveDone = !!flags.npc_zhou_jie_sensitive_done;
              if (sensitiveDone) {
                const dialog = engine.triggerRandomNpcDialog(npcId);
                if (dialog) {
                  engine.incrementNpcCasualTalk(npcId);
                  setCurrentDialog(dialog);
                }
                return;
              }
              if (observed && casualCount >= 3) {
                setCurrentDialog({
                  text: '你覺得時機差不多了，可以試著往深一點問。',
                  type: 'narrator',
                  choices: [
                    { id: 'zhou_sensitive_ask', text: '我想問一些比較敏感的問題。' },
                    { id: 'zhou_sensitive_skip', text: '先不用，再聊聊就好。' },
                  ],
                });
                return;
              }
              const dialogZhou = engine.triggerRandomNpcDialog(npcId);
              if (dialogZhou) {
                engine.incrementNpcCasualTalk(npcId);
                setCurrentDialog(dialogZhou);
              }
              return;
            }

            // 其餘 NPC：關鍵對話解鎖條件與完成 flag（沿用原邏輯；阿順／小張／周姊已改走閒聊+敏感流程，不在此列）
            const keyDialogUnlocked: Record<string, () => boolean> = {
              // npc_ashun / npc_xiaozhang / npc_zhou_jie 已改為閒聊+敏感二選一，不再使用 key 對話
            };
            const check = keyDialogUnlocked[npcId];
            const useKeyDialog = check?.() ?? false;

            if (useKeyDialog) {
              engine.startNpcDialog(npcId);
              const node = engine.getCurrentNpcDialogNode();
              const npc = scene.npcs?.find((n: { id: string }) => n.id === npcId);
              if (node && npc) {
                const dialog = buildDialogFromNpcNode(node, npc);
                setCurrentDialog(dialog);
              }
              return;
            }

            // 隨機對話（其餘 NPC 不計入閒聊次數）
            const dialog = engine.triggerRandomNpcDialog(npcId);
            if (dialog) {
              setCurrentDialog(dialog);
            }
          }}
          checkAvailability={(npc) => {
            if (!engineRef.current) return false;
            const engine = engineRef.current;
            
            // 檢查 available 屬性
            if (npc.available === false) return false;
            
            // 檢查 availabilityRequirement
            if (npc.availabilityRequirement) {
              return engine.checkRequirement(npc.availabilityRequirement);
            }
            
            return true;
          }}
        />
      )}

      {/* 推理分析按鈕（ch1/ch2/ch3 且本章全場景已訪且未完成時顯示） */}
      {showReasoningButton && (
        <button
          type="button"
          onClick={() => setShowReasoningPanel(true)}
          className="fixed bottom-20 right-6 z-30 flex items-center gap-2 px-4 py-2.5 rounded-full bg-orange-500/90 hover:bg-orange-500 border-2 border-orange-400/80 text-white text-sm font-medium shadow-lg hover:scale-105 transition-all"
          title="推理分析"
        >
          <Brain size={20} />
          <span>推理分析</span>
        </button>
      )}

      {/* 推理分析面板（三題：選擇／字詞／道具連連看） */}
      {showReasoningPanel && engineRef.current && (
        <ReasoningPanel
          chapterId={chapterId}
          onSaveAnswer={(chId, q, value) => {
            if (engineRef.current) engineRef.current.setReasoningAnswer(chId, q, value);
          }}
          onComplete={() => {
            if (!engineRef.current) return;
            engineRef.current.setReasoningComplete(chapterId);
            setShowReasoningPanel(false);
            setRefreshKey((k) => k + 1);
            const nextChapterMap: Record<string, string> = {
              navigate_to_ch2_intro: 'ch2',
              navigate_to_ch3_intro: 'ch3',
              navigate_to_ch4_intro: 'ch4',
              navigate_to_ch5_intro: 'ch5',
            };
            const stateAfter = engineRef.current.getState();
            for (const [flag, nextId] of Object.entries(nextChapterMap)) {
              if (stateAfter.flags[flag]) {
                engineRef.current.applyEffect({ type: 'setFlag', flag, value: false });
                setTimeout(() => router.push(`/play/${nextId}/intro`), 300);
                break;
              }
            }
          }}
          onClose={() => setShowReasoningPanel(false)}
        />
      )}

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
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setShowMenu(false)}
                className="fixed inset-0 bg-black/40 z-40"
              />
              {/* 選單面板 - 從右緣滑入 */}
              <motion.div
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

                  {/* 解謎、推理：暫時隱藏 */}
                  {false && chapterId === 'ch1' && (
                    <>
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          const inv = engineRef.current?.getState().inventory ?? [];
                          const required = ['item_ticket_stub', 'item_schedule_modified', 'item_projector_notes', 'item_light_control_note', 'item_black_plastic_fragment', 'item_cleaning_note'];
                          const hasAll = required.every((id) => inv.includes(id));
                          if (!hasAll) {
                            setCurrentDialog({
                              text: '請先收集齊第一章的六個道具：電影票根、播映時間表（塗改）、放映員的筆記、燈控紀錄、黑色塑膠碎片、清潔備忘。',
                              type: 'narrator',
                              choices: [{ id: 'close_only', text: '知道了' }],
                            });
                          } else {
                            setShowCh1PairPuzzle(true);
                          }
                          setRefreshKey((prev) => prev + 1);
                        }}
                        className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-dark-card/50 hover:bg-dark-card border border-dark-border/50 hover:border-orange-500/50 rounded-lg text-gray-300 hover:text-white transition-all duration-200 text-sm font-medium group"
                      >
                        <span className="flex items-center gap-3">
                          <Puzzle size={18} className="text-orange-400 group-hover:scale-110 transition-transform" />
                          <span>解謎</span>
                        </span>
                        {state.flags?.ch1_puzzle_done && <span className="text-xs text-green-400">已完成</span>}
                      </button>
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          setCh1ReasoningStep(0);
                          setShowCh1ReasoningPuzzle(true);
                          setRefreshKey((prev) => prev + 1);
                        }}
                        className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-dark-card/50 hover:bg-dark-card border border-dark-border/50 hover:border-orange-500/50 rounded-lg text-gray-300 hover:text-white transition-all duration-200 text-sm font-medium group"
                      >
                        <span className="flex items-center gap-3">
                          <ListOrdered size={18} className="text-orange-400 group-hover:scale-110 transition-transform" />
                          <span>推理</span>
                        </span>
                        {state.flags?.ch1_reasoning_done && <span className="text-xs text-green-400">已完成</span>}
                      </button>
                    </>
                  )}
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
                  {/* KK 洞察（計分）：暫時隱藏 */}
                  {false && (
                    <div className="px-4 py-3 bg-dark-card/50 border border-dark-border/50 rounded-lg">
                      <ScoreDisplay gameState={state} showLegacyWeights={devMode} />
                    </div>
                  )}
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
                        setRefreshKey((prev) => prev + 1);
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
              </motion.div>
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
                    setRefreshKey(prev => prev + 1);
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

      {/* 道具獲得提示 - 優先顯示 */}
      {showItemNotification && obtainedItem && (
        <ItemObtainedNotification
          itemId={obtainedItem.id}
          itemName={obtainedItem.name}
          itemImage={obtainedItem.image}
          itemSvgImage={obtainedItem.svgImage}
          itemDescription={obtainedItem.description}
          show={showItemNotification}
          dismissOnTap
          onComplete={() => {
            setShowItemNotification(false);
            setObtainedItem(null);
            setRefreshKey(prev => prev + 1);
          }}
        />
      )}

      {/* 對話框 - 底部浮動（道具提示和場景名稱未顯示時才顯示） */}
      {currentDialog && !showItemNotification && !showSceneName && (
        <DialogBox
          dialog={currentDialog}
          onClose={handleDialogClose}
          autoClose={false}
          onChoiceSelect={handleDialogChoice}
        />
      )}

      {/* 角色對話系統（優先顯示） */}
      {currentConversation && (
        <CharacterConversation
          conversation={currentConversation.turns}
          finalChoices={currentConversation.finalChoices}
          onComplete={() => {
            // 對話完成後的處理
            if (currentConversation.onComplete?.setFlag) {
              engine.applyEffect({ 
                type: 'setFlag', 
                flag: currentConversation.onComplete.setFlag, 
                value: true 
              });
            }
            if (currentConversation.onComplete?.triggerEvent) {
              engine.triggerEvent(currentConversation.onComplete.triggerEvent);
            }
            setCurrentConversation(null);
            setRefreshKey(prev => prev + 1);
          }}
          onChoiceSelect={(choice) => {
            // 處理選擇
            handleDialogChoice(choice);
            // 對話完成
            if (currentConversation.onComplete?.setFlag) {
              engine.applyEffect({ 
                type: 'setFlag', 
                flag: currentConversation.onComplete.setFlag, 
                value: true 
              });
            }
            setCurrentConversation(null);
            setRefreshKey(prev => prev + 1);
          }}
        />
      )}

      {/* 進度條 - 已隱藏（不顯示給玩家） */}

      {/* 第一章章末：解謎（6 道具選 3 集滿三條線索 或 舊版 3 組配對）- 關閉時 exit 動畫 */}
      <AnimatePresence>
      {showCh1PairPuzzle && engineRef.current && (() => {
        const ch1Hall = scenes['scene_ch1_cinema_a_hall'];
        const pairPuzzle = ch1Hall?.puzzles?.find((p: { id: string }) => p.id === 'ch1_pair_matching');
        if (!pairPuzzle) return null;
        const ch1AttitudeDialog: Dialog = {
          text: '你的態度宣言——',
          type: 'narrator',
          choices: [
            { id: 'ch1_attitude_procedure', text: '「我會要求官方做全面稽核。」', insightEffects: [{ target: 'procedure_insight', delta: 1 }], effects: [{ type: 'setFlag', flag: 'ch1_attitude_declared', value: true }] },
            { id: 'ch1_attitude_evidence', text: '「我先不驚動體系，先把動線與權限畫出來。」', insightEffects: [{ target: 'evidence_insight', delta: 1 }], effects: [{ type: 'setFlag', flag: 'ch1_attitude_declared', value: true }] },
            { id: 'ch1_attitude_human', text: '「我想知道誰在遮蔽，遮蔽的原因。」', insightEffects: [{ target: 'human_insight', delta: 1 }], effects: [{ type: 'setFlag', flag: 'ch1_attitude_declared', value: true }] },
            { id: 'ch1_attitude_both', text: '「我兩邊都要：上報，但先留底。」', insightEffects: [{ target: 'procedure_insight', delta: 1 }, { target: 'evidence_insight', delta: 1 }], effects: [{ type: 'setFlag', flag: 'ch1_attitude_declared', value: true }] },
          ],
        };
        const state = engineRef.current.getState();
        const unlockedClues: [boolean, boolean, boolean] = [
          !!state?.flags?.ch1_clue_1_unlocked,
          !!state?.flags?.ch1_clue_2_unlocked,
          !!state?.flags?.ch1_clue_3_unlocked,
        ];
        if (pairPuzzle.type === 'pick_three') {
          return (
            <motion.div key="ch1-pair-puzzle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <PickThreePuzzle
              puzzle={pairPuzzle}
              items={items}
              unlockedClues={unlockedClues}
              onSolve={(selectedIds) => {
                if (!engineRef.current) return;
                const solved = engineRef.current.solvePuzzle('ch1_pair_matching', selectedIds);
                if (solved) {
                  setPuzzleError('');
                  setRefreshKey((prev) => prev + 1);
                  const nextState = engineRef.current.getState();
                  const puzzleDone = nextState?.flags?.ch1_puzzle_done === true;
                  const lastCombo = (nextState?.flags?.ch1_last_unlocked_combo as number) ?? 0;
                  const clues = (pairPuzzle.config?.clues as string[] | undefined) ?? [];
                  const clueText = lastCombo >= 1 && lastCombo <= 3 ? clues[lastCombo - 1] : '';
                  if (puzzleDone) {
                    setShowCh1PairPuzzle(false);
                    const reasoningDone = nextState?.flags?.ch1_reasoning_done === true;
                    setCurrentDialog(
                      reasoningDone
                        ? ch1AttitudeDialog
                        : { text: '解謎完成。可從選單進行推理。', type: 'narrator', choices: [{ id: 'close_only', text: '知道了' }] }
                    );
                  } else if (clueText) {
                    setCurrentDialog({ text: clueText, type: 'narrator', choices: [{ id: 'close_only', text: '知道了' }] });
                  }
                } else {
                  setPuzzleError('此組合不正確，請再試一次。');
                }
              }}
              onClose={() => {
                setShowCh1PairPuzzle(false);
                setPuzzleError('');
              }}
              error={puzzleError}
              onErrorClear={() => setPuzzleError('')}
            />
            </motion.div>
          );
        }
        return (
          <motion.div key="ch1-pair-puzzle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <PairMatchingPuzzle
            puzzle={pairPuzzle}
            items={items}
            onSolve={(input) => {
              if (!engineRef.current) return;
              const solved = engineRef.current.solvePuzzle('ch1_pair_matching', input);
              if (solved) {
                setShowCh1PairPuzzle(false);
                setPuzzleError('');
                setRefreshKey((prev) => prev + 1);
                const reasoningDone = engineRef.current.getState().flags?.ch1_reasoning_done === true;
                setCurrentDialog(
                  reasoningDone
                    ? ch1AttitudeDialog
                    : { text: '解謎完成。可從選單進行推理。', type: 'narrator', choices: [{ id: 'close_only', text: '知道了' }] }
                );
              } else {
                setPuzzleError('配對不正確，請再試一次。');
              }
            }}
            onClose={() => {
              setShowCh1PairPuzzle(false);
              setPuzzleError('');
            }}
            error={puzzleError}
            onErrorClear={() => setPuzzleError('')}
            inventory={engineRef.current.getState().inventory}
          />
          </motion.div>
        );
      })()}
      </AnimatePresence>

      {/* 第一章章末：推理（3 題字詞排序）- 關閉時 exit 動畫 */}
      <AnimatePresence>
      {showCh1ReasoningPuzzle && (() => {
        const ch1Hall = scenes['scene_ch1_cinema_a_hall'];
        const reasoningPuzzle = ch1Hall?.puzzles?.find((p: { id: string }) => p.id === `ch1_reasoning_${ch1ReasoningStep + 1}`);
        if (!reasoningPuzzle) return null;
        return (
          <motion.div key="ch1-reasoning-puzzle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <ArrangementPuzzle
            puzzle={reasoningPuzzle}
            onSolve={(input) => {
              if (!engineRef.current) return;
              const puzzleId = `ch1_reasoning_${ch1ReasoningStep + 1}`;
              const solved = engineRef.current.solvePuzzle(puzzleId, input);
              if (solved) {
                setPuzzleError('');
                setRefreshKey((prev) => prev + 1);
                if (ch1ReasoningStep < 2) {
                  setCh1ReasoningStep((prev) => prev + 1);
                } else {
                  // 第三題完成：確保推理過關條件 ch1_reasoning_done 已設定
                  engineRef.current.applyEffect({ type: 'setFlag', flag: 'ch1_reasoning_done', value: true });
                  setShowCh1ReasoningPuzzle(false);
                  setCh1ReasoningStep(0);
                  const puzzleDone = engineRef.current.getState().flags?.ch1_puzzle_done === true;
                  if (puzzleDone) {
                    setCurrentDialog({
                      text: '你的態度宣言——',
                      type: 'narrator',
                      choices: [
                        { id: 'ch1_attitude_procedure', text: '「我會要求官方做全面稽核。」', insightEffects: [{ target: 'procedure_insight', delta: 1 }], effects: [{ type: 'setFlag', flag: 'ch1_attitude_declared', value: true }] },
                        { id: 'ch1_attitude_evidence', text: '「我先不驚動體系，先把動線與權限畫出來。」', insightEffects: [{ target: 'evidence_insight', delta: 1 }], effects: [{ type: 'setFlag', flag: 'ch1_attitude_declared', value: true }] },
                        { id: 'ch1_attitude_human', text: '「我想知道誰在遮蔽，遮蔽的原因。」', insightEffects: [{ target: 'human_insight', delta: 1 }], effects: [{ type: 'setFlag', flag: 'ch1_attitude_declared', value: true }] },
                        { id: 'ch1_attitude_both', text: '「我兩邊都要：上報，但先留底。」', insightEffects: [{ target: 'procedure_insight', delta: 1 }, { target: 'evidence_insight', delta: 1 }], effects: [{ type: 'setFlag', flag: 'ch1_attitude_declared', value: true }] },
                      ],
                    });
                  } else {
                    setCurrentDialog({ text: '推理完成。可從選單進行解謎。', type: 'narrator', choices: [{ id: 'close_only', text: '知道了' }] });
                  }
                }
              } else {
                setPuzzleError('順序不正確，請再試一次。');
              }
            }}
            onClose={() => {
              setShowCh1ReasoningPuzzle(false);
              setCh1ReasoningStep(0);
              setPuzzleError('');
            }}
            error={puzzleError}
            onErrorClear={() => setPuzzleError('')}
          />
          </motion.div>
        );
      })()}
      </AnimatePresence>

      {/* 謎題輸入 */}
      {currentPuzzle && (
        currentPuzzle.type === 'arrangement' ? (
          <ArrangementPuzzle
            puzzle={currentPuzzle}
            onSolve={handlePuzzleSolve}
            onClose={() => {
              setCurrentPuzzle(null);
              setPuzzleError('');
            }}
            error={puzzleError}
            onErrorClear={() => setPuzzleError('')}
          />
        ) : currentPuzzle.type === 'visual_selection' ? (
          <VisualSelectionPuzzle
            puzzle={currentPuzzle}
            onSolve={handlePuzzleSolve}
            onClose={() => {
              setCurrentPuzzle(null);
              setPuzzleError('');
            }}
            error={puzzleError}
            onErrorClear={() => setPuzzleError('')}
          />
        ) : currentPuzzle.type === 'combination_lock' ? (
          <CombinationLock
            puzzle={currentPuzzle}
            onSolve={handlePuzzleSolve}
            onClose={() => {
              setCurrentPuzzle(null);
              setPuzzleError('');
            }}
            error={puzzleError}
            onErrorClear={() => setPuzzleError('')}
          />
        ) : currentPuzzle.type === 'word_scramble' ? (
          <WordScramble
            puzzle={currentPuzzle}
            onSolve={handlePuzzleSolve}
            onClose={() => {
              setCurrentPuzzle(null);
              setPuzzleError('');
            }}
            error={puzzleError}
            onErrorClear={() => setPuzzleError('')}
          />
        ) : currentPuzzle.type === 'wire_connection' ? (
          <WireConnection
            puzzle={currentPuzzle}
            onSolve={handlePuzzleSolve}
            onClose={() => {
              setCurrentPuzzle(null);
              setPuzzleError('');
            }}
            error={puzzleError}
            onErrorClear={() => setPuzzleError('')}
          />
        ) : currentPuzzle.type === 'jigsaw' ? (
          <JigsawPuzzle
            puzzle={currentPuzzle}
            onSolve={handlePuzzleSolve}
            onClose={() => {
              setCurrentPuzzle(null);
              setPuzzleError('');
            }}
            error={puzzleError}
            onErrorClear={() => setPuzzleError('')}
          />
        ) : currentPuzzle.type === 'rotating_dial' ? (
          <RotatingDial
            puzzle={currentPuzzle}
            onSolve={handlePuzzleSolve}
            onClose={() => {
              setCurrentPuzzle(null);
              setPuzzleError('');
            }}
            error={puzzleError}
            onErrorClear={() => setPuzzleError('')}
          />
        ) : currentPuzzle.type === 'sequence_memory' ? (
          <SequenceMemory
            puzzle={currentPuzzle}
            onSolve={handlePuzzleSolve}
            onClose={() => {
              setCurrentPuzzle(null);
              setPuzzleError('');
            }}
            error={puzzleError}
            onErrorClear={() => setPuzzleError('')}
          />
        ) : currentPuzzle.type === 'sliding_puzzle' ? (
          <SlidingPuzzle
            puzzle={currentPuzzle}
            onSolve={handlePuzzleSolve}
            onClose={() => {
              setCurrentPuzzle(null);
              setPuzzleError('');
            }}
            error={puzzleError}
            onErrorClear={() => setPuzzleError('')}
          />
        ) : currentPuzzle.type === 'symbol_matching' ? (
          <SymbolMatching
            puzzle={currentPuzzle}
            onSolve={handlePuzzleSolve}
            onClose={() => {
              setCurrentPuzzle(null);
              setPuzzleError('');
            }}
            error={puzzleError}
            onErrorClear={() => setPuzzleError('')}
          />
        ) : currentPuzzle.type === 'maze_path' ? (
          <MazePath
            puzzle={currentPuzzle}
            onSolve={handlePuzzleSolve}
            onClose={() => {
              setCurrentPuzzle(null);
              setPuzzleError('');
            }}
            error={puzzleError}
            onErrorClear={() => setPuzzleError('')}
          />
        ) : currentPuzzle.type === 'logic_switches' ? (
          <LogicSwitches
            puzzle={currentPuzzle}
            onSolve={handlePuzzleSolve}
            onClose={() => {
              setCurrentPuzzle(null);
              setPuzzleError('');
            }}
            error={puzzleError}
            onErrorClear={() => setPuzzleError('')}
          />
        ) : (
          <PuzzleInput
            puzzle={currentPuzzle}
            onSolve={handlePuzzleSolve}
            onClose={() => {
              setCurrentPuzzle(null);
              setPuzzleError('');
            }}
            error={puzzleError}
            onErrorClear={() => setPuzzleError('')}
          />
        )
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
            setRefreshKey(prev => prev + 1);
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
            setRefreshKey(prev => prev + 1);
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
                src="/images/ending_image.png" 
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
                  setRefreshKey(prev => prev + 1);
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
                  setRefreshKey(prev => prev + 1);
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
                  setRefreshKey(prev => prev + 1);
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
                  setRefreshKey(prev => prev + 1);
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
                  setRefreshKey(prev => prev + 1);
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

