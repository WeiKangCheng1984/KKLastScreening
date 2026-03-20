/**
 * simulationRunner.ts
 * 遊戲模擬演練引擎 — 可驗證資料完整性，並模擬玩家操作路徑
 */

import type { GameState, Scene, Item, NpcDialogNode, Event as GameEvent, Effect, Requirement } from '@/types/game';
import { GameEngine } from './gameEngine';
import { getChapterData, type ChapterData } from '@/data/getChapterData';
import { chapters } from '@/data/chapters';
import { getNpcClickBehaviour } from './chapterBehaviours';

// ─── 公共型別 ───────────────────────────────────────────────

export type SimStrategy = 'random' | 'optimal' | 'explore_all' | 'skip_sensitive';

export interface SimOptions {
  strategy: SimStrategy;
  seed?: number;
  chaptersToRun?: string[];
  forceUnlock?: boolean; // 遇到鎖定場景時是否強制解鎖
  maxStepsPerChapter?: number;
}

export interface IntegrityIssue {
  severity: 'error' | 'warning' | 'info';
  chapter: string;
  location: string;
  message: string;
}

export interface IntegrityReport {
  issues: IntegrityIssue[];
  summary: { errors: number; warnings: number; info: number; total: number };
  checkedAt: string;
  chaptersChecked: string[];
}

export interface SimStep {
  seq: number;
  chapter: string;
  scene: string;
  action: 'scene_enter' | 'hotspot_click' | 'dialog_choice' | 'npc_click' | 'sensitive_choice' | 'qa_answer' | 'flag_set' | 'item_gained' | 'scene_blocked' | 'error' | 'ending';
  label: string;
  detail?: string;
  itemsGained?: string[];
  flagsSet?: Record<string, any>;
  error?: string;
}

export interface SimResult {
  runId: number;
  strategy: SimStrategy;
  seed: number;
  steps: SimStep[];
  finalFlags: Record<string, any>;
  finalInventory: string[];
  finalInsights: { procedure_insight: number; human_insight: number; evidence_insight: number };
  ending: string;
  endingLabel: string;
  errors: string[];
  warnings: string[];
  scenesVisited: string[];
  chaptersCompleted: string[];
  durationMs: number;
  success: boolean;
}

// ─── 章節解鎖規則（從 page.tsx handleSceneNavigation 提取） ────────

interface SceneGateCheck {
  blocked: boolean;
  reason?: string;
}

function checkSceneGate(
  chapterId: string,
  targetSceneId: string,
  engine: GameEngine
): SceneGateCheck {
  const state = engine.getState();
  const flags = state.flags || {};

  if (chapterId === 'ch2') {
    if (targetSceneId === 'scene_ch2_asu_car' && !flags.ch2_task_from_liu) {
      return { blocked: true, reason: '需先與劉隊談過任務 (ch2_task_from_liu)' };
    }
    if (targetSceneId === 'scene_ch2_asu_desktop') {
      const carProgress = engine.calculateExplorationProgress('scene_ch2_asu_car');
      if (!flags.ch2_task_from_liu || carProgress < 80) {
        return {
          blocked: true,
          reason: `需接劉隊任務且車內探索≥80% (目前${Math.round(carProgress)}%)`,
        };
      }
    }
  }

  if (chapterId === 'ch3') {
    if (targetSceneId === 'scene_ch3_brand_room' && !flags.ch3_task_from_liu) {
      return { blocked: true, reason: '需先接劉隊任務 (ch3_task_from_liu)' };
    }
    if (targetSceneId === 'scene_ch3_server_corridor') {
      const brandHotspots = [
        'hotspot_ch3_brand_contract', 'hotspot_ch3_venue_map',
        'hotspot_ch3_meeting_notes', 'hotspot_ch3_system_spec',
      ];
      const interacted = brandHotspots.filter((id) => engine.hasInteracted(id)).length;
      if (!flags.ch3_task_from_liu || interacted < 2) {
        return { blocked: true, reason: `需接任務且品牌室≥2互動 (目前${interacted})` };
      }
    }
  }

  if (chapterId === 'ch4') {
    if (targetSceneId === 'scene_ch4_control_panel' && !flags.ch4_task_from_liu) {
      return { blocked: true, reason: '需先接劉隊任務 (ch4_task_from_liu)' };
    }
    if (targetSceneId === 'scene_ch4_main_hall') {
      const ctrlHotspots = [
        'hotspot_ch4_control_plugin', 'hotspot_ch4_control_sync',
        'hotspot_ch4_control_risk', 'hotspot_ch4_incident_log',
      ];
      const interacted = ctrlHotspots.filter((id) => engine.hasInteracted(id)).length;
      if (!flags.ch4_task_from_liu || interacted < 2) {
        return { blocked: true, reason: `需接任務且控制室≥2互動 (目前${interacted})` };
      }
    }
  }

  if (chapterId === 'ch5') {
    if (targetSceneId === 'scene_ch5_log_lab' && !flags.ch5_task_from_liu) {
      return { blocked: true, reason: '需先接劉隊任務 (ch5_task_from_liu)' };
    }
    if (targetSceneId === 'scene_ch5_lin_office') {
      const labHotspots = [
        'hotspot_ch5_log_raw', 'hotspot_ch5_log_compare',
        'hotspot_ch5_log_account', 'hotspot_ch5_log_timestamp',
      ];
      const interacted = labHotspots.filter((id) => engine.hasInteracted(id)).length;
      if (!flags.ch5_task_from_liu || interacted < 2) {
        return { blocked: true, reason: `需接任務且比對室≥2互動 (目前${interacted})` };
      }
    }
  }

  if (chapterId === 'ch6') {
    if (targetSceneId === 'scene_ch6_control_room' && !flags.ch6_task_from_liu) {
      return { blocked: true, reason: '需先接劉隊任務 (ch6_task_from_liu)' };
    }
    if (targetSceneId === 'scene_ch6_press_corridor') {
      if (!flags.ch6_task_from_liu || !flags.ch6_d7_done) {
        return { blocked: true, reason: '需接任務且完成D7選擇 (ch6_d7_done)' };
      }
    }
  }

  return { blocked: false };
}

// ─── 結局計算（從 page.tsx ch6 ending logic 提取） ────────────────

function computeEnding(engine: GameEngine): { ending: string; endingLabel: string } {
  const flags = engine.getState().flags || {};
  const d5Lin = !!flags.ch5_d6_lin;
  const d7Archive = !!flags.ch6_d7_archive;
  const linConfronted = !!flags.npc_lin_ch6_confrontation_done;

  if (d5Lin && d7Archive && linConfronted) {
    return {
      ending: 'full_truth',
      endingLabel: '完整揭露',
    };
  }
  if (linConfronted && !d7Archive) {
    return {
      ending: 'procedure_done',
      endingLabel: '程序完成，真相待續',
    };
  }
  if (d7Archive && !linConfronted) {
    return {
      ending: 'data_saved_no_confrontation',
      endingLabel: '追到了，但資料沒了',
    };
  }
  return {
    ending: 'scene_first',
    endingLabel: '現場優先，真相之後',
  };
}

// ─── 亂數產生器 ────────────────────────────────────────────

function makePrng(seed: number): () => number {
  let s = seed;
  return function () {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// ─── SimulationRunner ────────────────────────────────────────

export class SimulationRunner {
  private allChapterData: Record<string, ChapterData> = {};
  private loaded = false;

  async loadAllChapterData(): Promise<void> {
    for (const chId of ['ch1', 'ch2', 'ch3', 'ch4', 'ch5', 'ch6']) {
      try {
        const data = await getChapterData(chId);
        if (data) this.allChapterData[chId] = data;
      } catch (e) {
        console.error(`載入 ${chId} 資料失敗:`, e);
      }
    }
    this.loaded = true;
  }

  // ─── 資料完整性檢查 ─────────────────────────────────────────

  checkIntegrity(): IntegrityReport {
    const issues: IntegrityIssue[] = [];
    const chaptersChecked: string[] = [];

    for (const [chId, data] of Object.entries(this.allChapterData)) {
      chaptersChecked.push(chId);
      const { scenes, items, npcDialogs } = data;

      // 1. 檢查 hotspotEventMap 中的事件 ID
      for (const [sceneId, scene] of Object.entries(scenes)) {
        const hotspotEventMap = (scene as any).hotspotEventMap || {};
        const events: GameEvent[] = (scene as any).events || [];
        const eventIds = new Set(events.map((e: GameEvent) => e.id));
        const hotspotIds = new Set((scene.hotspots || []).map((h: any) => h.id));

        for (const [hotspotId, eventId] of Object.entries(hotspotEventMap)) {
          // 確認互動框 ID 存在
          if (!hotspotIds.has(hotspotId)) {
            issues.push({
              severity: 'warning',
              chapter: chId,
              location: `${sceneId} > hotspotEventMap`,
              message: `互動框 ID "${hotspotId}" 未出現在 hotspots 陣列中`,
            });
          }
          // 確認事件 ID 存在
          if (!eventIds.has(eventId as string)) {
            issues.push({
              severity: 'error',
              chapter: chId,
              location: `${sceneId} > hotspotEventMap[${hotspotId}]`,
              message: `事件 ID "${eventId}" 未在 events 中定義`,
            });
          }
        }

        // 2. 檢查事件效果的道具 ID
        for (const event of events) {
          for (const effect of event.effects || []) {
            if (effect.type === 'addItem' && effect.itemId && !items[effect.itemId]) {
              issues.push({
                severity: 'error',
                chapter: chId,
                location: `${sceneId} > event[${event.id}] > addItem`,
                message: `道具 ID "${effect.itemId}" 未在 items 中定義`,
              });
            }
            if (effect.type === 'changeScene' && effect.sceneId) {
              if (!scenes[effect.sceneId]) {
                issues.push({
                  severity: 'warning',
                  chapter: chId,
                  location: `${sceneId} > event[${event.id}] > changeScene`,
                  message: `目標場景 "${effect.sceneId}" 在本章 scenes 中找不到`,
                });
              }
            }
          }

          // 3. 檢查事件需求的 flag 或 item 名稱（可選：只給 info）
          for (const req of event.requirements || []) {
            if (req.type === 'hasItem' && req.itemId && !items[req.itemId]) {
              issues.push({
                severity: 'warning',
                chapter: chId,
                location: `${sceneId} > event[${event.id}] > requirement.hasItem`,
                message: `需求道具 "${req.itemId}" 在本章 items 中找不到（可能在其他章）`,
              });
            }
          }
        }
      }

      // 4. 檢查 NPC 對話樹節點路由
      for (const [npcId, dialogTree] of Object.entries(npcDialogs)) {
        const nodeIds = new Set(Object.keys(dialogTree as Record<string, NpcDialogNode>));
        for (const [nodeId, node] of Object.entries(dialogTree as Record<string, NpcDialogNode>)) {
          const n = node as NpcDialogNode;
          // 檢查 choice 的擴展 next 屬性（遊戲資料中有些 choice 會附帶 next）
          for (const choice of n.choices || []) {
            const choiceAny = choice as any;
            if (choiceAny.next && typeof choiceAny.next === 'string') {
              if (!nodeIds.has(choiceAny.next)) {
                issues.push({
                  severity: 'error',
                  chapter: chId,
                  location: `npcDialogs > ${npcId} > ${nodeId} > choice[${choice.id}]`,
                  message: `next 節點 "${choiceAny.next}" 不存在於此對話樹`,
                });
              }
            }
          }
          // 檢查 node.next（字串形式）
          const nodeNext = typeof n.next === 'string' ? n.next : null;
          if (nodeNext && !nodeIds.has(nodeNext)) {
            issues.push({
              severity: 'error',
              chapter: chId,
              location: `npcDialogs > ${npcId} > ${nodeId}`,
              message: `node.next "${nodeNext}" 不存在於此對話樹`,
            });
          }
          // 檢查 defaultNext（擴展屬性）
          if ((n as any).defaultNext && !nodeIds.has((n as any).defaultNext)) {
            issues.push({
              severity: 'error',
              chapter: chId,
              location: `npcDialogs > ${npcId} > ${nodeId}`,
              message: `defaultNext "${(n as any).defaultNext}" 不存在`,
            });
          }
        }
      }

      // 5. 檢查 chapters.ts 中宣告的 scene ID 是否都有資料
      const chapterDef = chapters[chId];
      if (chapterDef) {
        for (const sceneId of chapterDef.scenes) {
          if (!scenes[sceneId]) {
            issues.push({
              severity: 'error',
              chapter: chId,
              location: `chapters.ts > ${chId}.scenes`,
              message: `場景 "${sceneId}" 在 chapters.ts 中宣告，但在 gameData 中找不到`,
            });
          }
        }
      }

      // 6. 道具圖片路徑格式檢查（info）
      for (const [itemId, item] of Object.entries(items)) {
        const i = item as Item;
        if (!i.image && !i.svgImage) {
          issues.push({
            severity: 'info',
            chapter: chId,
            location: `items > ${itemId}`,
            message: `道具 "${i.name}" 沒有設定圖片 (image/svgImage)`,
          });
        }
      }
    }

    return {
      issues,
      summary: {
        errors: issues.filter((i) => i.severity === 'error').length,
        warnings: issues.filter((i) => i.severity === 'warning').length,
        info: issues.filter((i) => i.severity === 'info').length,
        total: issues.length,
      },
      checkedAt: new Date().toLocaleString('zh-TW'),
      chaptersChecked,
    };
  }

  // ─── 模擬演練 ─────────────────────────────────────────────

  async runSimulation(options: SimOptions): Promise<SimResult> {
    if (!this.loaded) await this.loadAllChapterData();

    const startTime = Date.now();
    const seed = options.seed ?? Math.floor(Math.random() * 999999);
    const rng = makePrng(seed);
    const steps: SimStep[] = [];
    const errors: string[] = [];
    const warnings: string[] = [];
    let seq = 0;

    const pushStep = (s: Omit<SimStep, 'seq'>) => {
      steps.push({ seq: seq++, ...s });
    };

    // 建立全新 GameEngine
    const engine = new GameEngine();

    // 載入所有章節資料
    for (const [chId, data] of Object.entries(this.allChapterData)) {
      engine.loadChapterData(data);
    }

    const chaptersToRun = options.chaptersToRun ?? ['ch1', 'ch2', 'ch3', 'ch4', 'ch5', 'ch6'];
    const chaptersCompleted: string[] = [];

    for (const chId of chaptersToRun) {
      const data = this.allChapterData[chId];
      if (!data) {
        warnings.push(`章節 ${chId} 無資料，跳過`);
        continue;
      }
      const chapterScenes = chapters[chId]?.scenes ?? [];
      if (chapterScenes.length === 0) {
        warnings.push(`章節 ${chId} 無場景列表`);
        continue;
      }

      // 模擬劉隊給任務（設定任務旗標）
      const taskFlag = `${chId}_task_from_liu`;
      engine.applyEffect({ type: 'setFlag', flag: taskFlag, value: true });
      pushStep({
        chapter: chId,
        scene: chapterScenes[0],
        action: 'flag_set',
        label: `接劉隊任務`,
        flagsSet: { [taskFlag]: true },
      });

      // 逐場景模擬
      for (const sceneId of chapterScenes) {
        const scene = data.scenes[sceneId];
        if (!scene) {
          warnings.push(`場景 ${sceneId} 找不到資料`);
          continue;
        }

        // 場景解鎖檢查
        const gate = checkSceneGate(chId, sceneId, engine);
        if (gate.blocked) {
          if (options.forceUnlock) {
            pushStep({
              chapter: chId,
              scene: sceneId,
              action: 'scene_blocked',
              label: `場景受阻（強制解鎖）`,
              detail: gate.reason,
            });
            warnings.push(`[${chId}] 場景 ${sceneId} 受阻但被強制解鎖: ${gate.reason}`);
            // 自動補足解鎖條件 flag
            this.autoUnlockScene(chId, sceneId, engine);
          } else {
            pushStep({
              chapter: chId,
              scene: sceneId,
              action: 'scene_blocked',
              label: `場景受阻 (跳過)`,
              detail: gate.reason,
            });
            warnings.push(`[${chId}] 場景 ${sceneId} 受阻，無法進入: ${gate.reason}`);
            continue;
          }
        }

        pushStep({
          chapter: chId,
          scene: sceneId,
          action: 'scene_enter',
          label: `進入場景：${scene.name ?? sceneId}`,
        });

        // 觸發所有互動點事件
        const hotspotEventMap: Record<string, string> = (scene as any).hotspotEventMap ?? {};
        const events: GameEvent[] = (scene as any).events ?? [];
        const eventMap = new Map(events.map((e: GameEvent) => [e.id, e]));
        const maxSteps = options.maxStepsPerChapter ?? 30;
        let stepCount = 0;

        for (const [hotspotId, eventId] of Object.entries(hotspotEventMap)) {
          if (stepCount++ > maxSteps) break;
          const event = eventMap.get(eventId);
          if (!event) continue;

          try {
            const canTrigger = engine.checkEventRequirements(event);
            if (!canTrigger) {
              warnings.push(`[${chId}/${sceneId}] 事件 ${eventId} 條件未滿足，跳過`);
              continue;
            }

            const invBefore = [...engine.getState().inventory];
            const flagsBefore = { ...engine.getState().flags };

            // 執行事件效果
            for (const effect of event.effects) {
              if (effect.type !== 'showDialog' && effect.type !== 'playAudio') {
                engine.applyEffect(effect);
              }
              // showDialog 中的 choices → 模擬選擇
              if (effect.type === 'showDialog' && effect.dialog?.choices?.length) {
                const picked = this.pickChoice(effect.dialog.choices, options.strategy, rng);
                pushStep({
                  chapter: chId,
                  scene: sceneId,
                  action: 'dialog_choice',
                  label: `對話選擇 → "${picked.text.slice(0, 30)}"`,
                  detail: `選項 ${picked.id}`,
                });
                if (picked.effects) {
                  for (const e of picked.effects) engine.applyEffect(e);
                }
              }
            }
            // 標記為已互動
            engine.applyEffect({ type: 'setFlag', flag: `interacted_${hotspotId}`, value: true });
            if (!engine.getState().interactions.includes(hotspotId)) {
              engine.getState().interactions.push(hotspotId);
            }

            const invAfter = engine.getState().inventory;
            const newItems = invAfter.filter((i) => !invBefore.includes(i));
            const flagsAfter = engine.getState().flags;
            const newFlags: Record<string, any> = {};
            for (const k of Object.keys(flagsAfter)) {
              if (flagsBefore[k] === undefined) newFlags[k] = flagsAfter[k];
            }

            pushStep({
              chapter: chId,
              scene: sceneId,
              action: 'hotspot_click',
              label: `互動：${hotspotId}`,
              detail: `事件 ${eventId}`,
              itemsGained: newItems.length > 0 ? newItems : undefined,
              flagsSet: Object.keys(newFlags).length > 0 ? newFlags : undefined,
            });
          } catch (e: any) {
            const errMsg = `[${chId}/${sceneId}] 事件 ${eventId} 執行錯誤: ${e.message}`;
            errors.push(errMsg);
            pushStep({
              chapter: chId,
              scene: sceneId,
              action: 'error',
              label: `錯誤`,
              error: errMsg,
            });
          }
        }

        // 模擬 NPC 互動（若場景有 NPC）
        const npcs: any[] = (scene as any).npcs ?? [];
        for (const npc of npcs) {
          if (options.strategy === 'skip_sensitive') continue;

          const npcId = npc.id;
          const casualCount = engine.getState().npcCasualTalkCount?.[npcId] ?? 0;

          // 先給一些閒聊次數以解鎖敏感對話
          if (!engine.getState().npcCasualTalkCount) {
            engine.getState().npcCasualTalkCount = {};
          }
          engine.getState().npcCasualTalkCount![npcId] = Math.max(casualCount, 3);

          const behaviour = getNpcClickBehaviour(chId, {
            state: engine.getState(),
            npcId,
            sceneId,
            casualTalkCount: 3,
          });

          if (behaviour.type === 'sensitive_gate' && behaviour.payload) {
            const payload = behaviour.payload;
            const choices: Array<{ id: string; text: string }> = payload.choices ?? [];
            const picked = this.pickChoice(choices, options.strategy, rng);

            pushStep({
              chapter: chId,
              scene: sceneId,
              action: 'sensitive_choice',
              label: `NPC 敏感選擇 (${npcId}) → "${picked.text.slice(0, 30)}"`,
              detail: `選項 ${picked.id}`,
            });

            // 若選擇詢問，模擬完成敏感對話並設置對應 flag
            if (picked.id.endsWith('_ask') || picked.id.endsWith('_confront_ask')) {
              const sensitiveFlagMap: Record<string, string> = {
                npc_lin_ruitang: 'npc_lin_sensitive_done',
                npc_ashun: 'npc_asu_sensitive_done',
                npc_xiaozhang: 'npc_xiaozhang_sensitive_done',
                npc_zhou_jie: 'npc_zhou_jie_sensitive_done',
                npc_gu_naiqian: 'npc_gu_naiqian_sensitive_done',
                npc_chen_youcheng: 'npc_chen_sensitive_done',
                npc_gao_wenjie: 'npc_gao_sensitive_done',
                npc_lin_zirui: 'npc_lin_ch6_confrontation_done',
              };
              const doneFlag = sensitiveFlagMap[npcId];
              if (doneFlag) {
                engine.applyEffect({ type: 'setFlag', flag: doneFlag, value: true });
                pushStep({
                  chapter: chId,
                  scene: sceneId,
                  action: 'flag_set',
                  label: `完成敏感對話 → ${doneFlag}`,
                  flagsSet: { [doneFlag]: true },
                });
              }
            }
          }
        }
      }

      // 模擬章節 QA（設定推理旗標）
      this.simulateChapterQA(chId, options.strategy, rng, engine, steps, chId, chapterScenes[chapterScenes.length - 1] ?? '', pushStep);

      chaptersCompleted.push(chId);
    }

    // 計算結局
    const { ending, endingLabel } = computeEnding(engine);
    pushStep({
      chapter: 'ch6',
      scene: 'game_end',
      action: 'ending',
      label: `結局：${endingLabel}`,
      detail: ending,
    });

    const finalState = engine.getState();
    return {
      runId: seed,
      strategy: options.strategy,
      seed,
      steps,
      finalFlags: { ...finalState.flags },
      finalInventory: [...finalState.inventory],
      finalInsights: {
        procedure_insight: finalState.insights?.procedure_insight ?? 0,
        human_insight: finalState.insights?.human_insight ?? 0,
        evidence_insight: finalState.insights?.evidence_insight ?? 0,
      },
      ending,
      endingLabel,
      errors,
      warnings,
      scenesVisited: [...finalState.visitedScenes],
      chaptersCompleted,
      durationMs: Date.now() - startTime,
      success: errors.length === 0,
    };
  }

  // ─── 模擬 QA 流程（每章） ────────────────────────────────────

  private simulateChapterQA(
    chId: string,
    strategy: SimStrategy,
    rng: () => number,
    engine: GameEngine,
    steps: SimStep[],
    chapter: string,
    scene: string,
    pushStep: (s: Omit<SimStep, 'seq'>) => void
  ) {
    // Q1 選擇題
    const q1Choices = this.getChapterQ1Choices(chId);
    if (q1Choices.length > 0) {
      const picked = this.pickChoice(q1Choices, strategy, rng);
      engine.applyEffect({ type: 'setFlag', flag: `${chId}_q1_answer`, value: picked.id.replace(`${chId}_q1_`, '') });
      engine.applyEffect({ type: 'setFlag', flag: `${chId}_q1_done`, value: true });
      pushStep({
        chapter,
        scene,
        action: 'qa_answer',
        label: `QA-Q1 → "${picked.text.slice(0, 30)}"`,
        flagsSet: { [`${chId}_q1_answer`]: picked.id },
      });
    }

    // Q2 文字推理（直接設 flag 通過）
    engine.applyEffect({ type: 'setFlag', flag: `${chId}_q2_done`, value: true });
    pushStep({ chapter, scene, action: 'qa_answer', label: `QA-Q2（輸入）→ 模擬通過` });

    // Q3 連連看（設 flag 通過）
    engine.applyEffect({ type: 'setFlag', flag: `${chId}_q3_done`, value: true });
    pushStep({ chapter, scene, action: 'qa_answer', label: `QA-Q3（連連看）→ 模擬通過` });

    // 章節完成
    engine.applyEffect({ type: 'setFlag', flag: `${chId}_reasoning_done`, value: true });

    // Ch5 D6 選擇（影響結局）
    if (chId === 'ch5') {
      const d6Choices = [
        { id: 'ch5_d6_lin', text: '選擇揭露林子睿' },
        { id: 'ch5_d6_hide', text: '選擇不揭露' },
      ];
      const picked = this.pickChoice(d6Choices, strategy, rng);
      engine.applyEffect({ type: 'setFlag', flag: picked.id, value: true });
      pushStep({
        chapter,
        scene,
        action: 'dialog_choice',
        label: `D6 選擇 → "${picked.text}"`,
        flagsSet: { [picked.id]: true },
      });
    }

    // Ch6 D7 選擇（影響結局）
    if (chId === 'ch6') {
      const d7Choices = [
        { id: 'ch6_d7_archive', text: '封存原始 log' },
        { id: 'ch6_d7_delete', text: '刪除原始 log' },
      ];
      const picked = this.pickChoice(d7Choices, strategy, rng);
      engine.applyEffect({ type: 'setFlag', flag: picked.id, value: true });
      engine.applyEffect({ type: 'setFlag', flag: 'ch6_d7_done', value: true });
      pushStep({
        chapter,
        scene,
        action: 'dialog_choice',
        label: `D7 選擇 → "${picked.text}"`,
        flagsSet: { [picked.id]: true, ch6_d7_done: true },
      });
    }
  }

  // ─── Q1 選項（每章定義） ─────────────────────────────────────

  private getChapterQ1Choices(chId: string): Array<{ id: string; text: string }> {
    const map: Record<string, Array<{ id: string; text: string }>> = {
      ch1: [
        { id: 'ch1_q1_B', text: '有人刻意申請延後，製造時間窗口' },
        { id: 'ch1_q1_A', text: '流程疏失' },
        { id: 'ch1_q1_C', text: '設備故障' },
      ],
      ch2: [
        { id: 'ch2_q1_b', text: '死者是在追蹤影城系統異常的調查者' },
        { id: 'ch2_q1_a', text: '普通觀眾' },
        { id: 'ch2_q1_c', text: '影城員工' },
      ],
      ch3: [
        { id: 'ch3_q1_A', text: '改內容／讓它看起來像沒改過' },
        { id: 'ch3_q1_B', text: '記錄／完成交接' },
        { id: 'ch3_q1_F', text: '掩飾／轉移注意力' },
      ],
      ch4: [
        { id: 'ch4_q1_b', text: '故意保留漏洞，製造3分鐘操作窗口' },
        { id: 'ch4_q1_a', text: '意外的系統失誤' },
        { id: 'ch4_q1_c', text: '外部攻擊' },
      ],
      ch5: [
        { id: 'ch5_q1_b', text: '方便的嫌疑人/可以確認有罪的人' },
        { id: 'ch5_q1_a', text: '真正的操作者' },
        { id: 'ch5_q1_c', text: '被借名的工具' },
        { id: 'ch5_q1_d', text: '知情者' },
      ],
      ch6: [
        { id: 'ch6_q1_c', text: '替林子睿製造口徑：讓操作者從文字裡消失' },
        { id: 'ch6_q1_b', text: '刻意的敘事框架轉換' },
        { id: 'ch6_q1_a', text: '公關稿的正常處理' },
      ],
    };
    return map[chId] ?? [];
  }

  // ─── 選擇策略 ─────────────────────────────────────────────

  private pickChoice<T extends { id: string; text: string }>(
    choices: T[],
    strategy: SimStrategy,
    rng: () => number
  ): T {
    if (choices.length === 0) return { id: 'none', text: '無選項' } as T;

    switch (strategy) {
      case 'random':
        return choices[Math.floor(rng() * choices.length)];

      case 'optimal':
        // 第一個選項通常是「正確」答案（由 getChapterQ1Choices 排序）
        return choices[0];

      case 'explore_all':
        // 優先選 ask（詢問）類
        const askChoice = choices.find((c) => c.id.endsWith('_ask') || c.id.endsWith('_confront_ask'));
        return askChoice ?? choices[0];

      case 'skip_sensitive':
        // 優先選 skip 類
        const skipChoice = choices.find((c) => c.id.endsWith('_skip'));
        return skipChoice ?? choices[choices.length - 1];

      default:
        return choices[0];
    }
  }

  // ─── 強制解鎖場景（補足條件） ────────────────────────────────

  private autoUnlockScene(chId: string, sceneId: string, engine: GameEngine): void {
    // 設定任務旗標
    engine.applyEffect({ type: 'setFlag', flag: `${chId}_task_from_liu`, value: true });

    // 補足互動紀錄（ch2）
    if (sceneId === 'scene_ch2_asu_desktop') {
      const hotspots = [
        'hotspot_car_unknown_chat',
        'hotspot_car_notepad',
        'hotspot_car_recording',
        'hotspot_car_location',
        'hotspot_car_toolbox',
        'hotspot_car_coffee',
        'hotspot_car_charm',
      ];
      hotspots.forEach((h) => {
        if (!engine.getState().interactions.includes(h)) {
          engine.getState().interactions.push(h);
        }
      });
    }

    // 補足 D7 選擇（ch6 press_corridor）
    if (sceneId === 'scene_ch6_press_corridor') {
      engine.applyEffect({ type: 'setFlag', flag: 'ch6_d7_done', value: true });
      engine.applyEffect({ type: 'setFlag', flag: 'ch6_d7_archive', value: true });
    }
  }

  // ─── 批次執行多次模擬 ─────────────────────────────────────

  async runBatch(
    count: number,
    options: Omit<SimOptions, 'seed'>,
    onProgress?: (done: number, total: number) => void
  ): Promise<SimResult[]> {
    if (!this.loaded) await this.loadAllChapterData();
    const results: SimResult[] = [];
    for (let i = 0; i < count; i++) {
      const seed = Math.floor(Math.random() * 999999);
      const result = await this.runSimulation({ ...options, seed });
      results.push(result);
      onProgress?.(i + 1, count);
      // yield to event loop
      await new Promise((r) => setTimeout(r, 0));
    }
    return results;
  }

  // ─── 統計分析 ─────────────────────────────────────────────

  static analyzeResults(results: SimResult[]): {
    endingDistribution: Record<string, number>;
    avgDuration: number;
    errorRate: number;
    commonErrors: string[];
    warningCount: number;
  } {
    const endingDist: Record<string, number> = {};
    let totalDuration = 0;
    let errorCount = 0;
    const allErrors: string[] = [];
    let totalWarnings = 0;

    for (const r of results) {
      endingDist[r.endingLabel] = (endingDist[r.endingLabel] ?? 0) + 1;
      totalDuration += r.durationMs;
      if (!r.success) errorCount++;
      allErrors.push(...r.errors);
      totalWarnings += r.warnings.length;
    }

    // 找最常見錯誤
    const errorFreq: Record<string, number> = {};
    for (const e of allErrors) {
      errorFreq[e] = (errorFreq[e] ?? 0) + 1;
    }
    const commonErrors = Object.entries(errorFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([msg, cnt]) => `(×${cnt}) ${msg}`);

    return {
      endingDistribution: endingDist,
      avgDuration: results.length > 0 ? Math.round(totalDuration / results.length) : 0,
      errorRate: results.length > 0 ? errorCount / results.length : 0,
      commonErrors,
      warningCount: totalWarnings,
    };
  }
}
