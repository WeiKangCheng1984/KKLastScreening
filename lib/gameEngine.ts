import { GameState, Scene, Event, Requirement, Effect, Puzzle, Item, DialogChoice, PlayerChoice, NpcDialogNode, PreferenceEffect, RandomDialog, Npc, Dialog } from '@/types/game';
import { chapters } from '@/data/chapters';

export class GameEngine {
  private state: GameState;
  private scenes: Record<string, Scene> = {};
  private items: Record<string, Item> = {};
  private npcDialogs: Record<string, Record<string, NpcDialogNode>> = {};
  private onChangeCallback?: () => void;

  setOnChange(fn: (() => void) | undefined): void { this.onChangeCallback = fn; }
  private notify(): void { this.onChangeCallback?.(); }

  constructor(initialState?: GameState) {
    this.state = initialState || {
      currentChapter: 'ch1',
      currentScene: 'scene_ch1_cinema_a_hall',
      inventory: [],
      flags: {},
      interactions: [],
      visitedScenes: [],
      explorationProgress: {},
      choices: [],
      preferences: {
        preference_system_intervention: 0,
        preference_observation_wait: 0,
        overweight_motive: 0,
        weight_behavior_evidence: 0,
        weight_process_similarity: 0,
        weight_escape_route: 0,
        question_system: 0,
        avoid_early_conviction: 0,
      },
    };
    
    // 確保新字段存在（向後兼容）
    if (!this.state.explorationProgress) {
      this.state.explorationProgress = {};
    }
    if (!this.state.choices) {
      this.state.choices = [];
    }
    if (!this.state.preferences) {
      this.state.preferences = {
        preference_system_intervention: 0,
        preference_observation_wait: 0,
        overweight_motive: 0,
        weight_behavior_evidence: 0,
        weight_process_similarity: 0,
        weight_escape_route: 0,
        question_system: 0,
        avoid_early_conviction: 0,
      };
    }
    if (!this.state.reasoningAnswers) {
      this.state.reasoningAnswers = {};
    }
    if (!this.state.npcCasualTalkCount) {
      this.state.npcCasualTalkCount = {};
    }

    // ch2 兩段報告：舊存檔曾於同一章尾完成手機謎但無 ch2_report_fill_done 時補齊
    const ch2Flags = this.state.flags;
    if (
      ch2Flags &&
      ch2Flags.ch2_phone_riddle_done &&
      !ch2Flags.ch2_report_fill_done
    ) {
      ch2Flags.ch2_report_fill_done = true;
      ch2Flags.ch2_q1_done = true;
      ch2Flags.ch2_q2_done = true;
    }
    // 顯影備忘已讀旗標：舊存檔僅有 ch2_phone_riddle_done 時補齊（供第三章條件）
    if (
      ch2Flags &&
      ch2Flags.ch2_phone_riddle_done &&
      ch2Flags.ch2_reveal_liang_director_memo !== true
    ) {
      ch2Flags.ch2_reveal_liang_director_memo = true;
    }

    // ch3～ch6：舊存檔曾將多個敘事線索 addItem 進背包；精簡後每章僅保留少數 collectible
    const LEGACY_INVENTORY_IDS_TO_STRIP = new Set([
      // ch3
      'item_whiteboard_rewrite',
      'item_promo_wall_text',
      'item_scene_control_sheet',
      'item_press_draft',
      'item_brand_monitor_report',
      'item_cross_venue_sync',
      'item_network_device_label',
      'item_remote_login_sheet',
      // ch4
      'item_lighting_time_diff',
      'item_stairwell_wear_trace',
      'item_monitor_blind_stair',
      'item_plugin_same_version',
      'item_crowd_timing_log',
      'item_panel_operator_trace',
      // ch5
      'item_gao_login_gap',
      'item_log_raw_diff',
      'item_lin_call_transcript',
      'item_unknown_msg_style',
      // ch6
      'item_blackout_sequence',
      'item_screening_panel_trace',
      'item_door_access_anomaly',
      'item_press_speech_draft',
    ]);
    if (this.state.inventory?.length) {
      this.state.inventory = this.state.inventory.filter((id) => !LEGACY_INVENTORY_IDS_TO_STRIP.has(id));
    }
  }

  getState(): GameState {
    return { ...this.state };
  }

  loadChapterData(data: { scenes: Record<string, Scene>; items: Record<string, Item>; npcDialogs: Record<string, Record<string, NpcDialogNode>> }): void {
    Object.assign(this.scenes, data.scenes);
    Object.assign(this.items, data.items);
    Object.assign(this.npcDialogs, data.npcDialogs);
  }

  getScenes(): Record<string, Scene> {
    return this.scenes;
  }

  getItems(): Record<string, Item> {
    return this.items;
  }

  getCurrentScene(): Scene | null {
    return this.scenes[this.state.currentScene] || null;
  }

  hasItem(itemId: string): boolean {
    return this.state.inventory.includes(itemId);
  }

  hasInteracted(hotspotId: string): boolean {
    return this.state.interactions.includes(hotspotId);
  }

  hasFlag(flag: string): boolean {
    return this.state.flags[flag] === true;
  }

  getFlag(flag: string): any {
    return this.state.flags[flag];
  }

  checkRequirement(req: Requirement): boolean {
    switch (req.type) {
      case 'hasItem':
        return req.itemId ? this.hasItem(req.itemId) : false;
      case 'hasInteracted':
        return req.hotspotId ? this.hasInteracted(req.hotspotId) : false;
      case 'hasFlag':
        if (req.flag) {
          if (req.value !== undefined) {
            return this.getFlag(req.flag) === req.value;
          }
          return this.hasFlag(req.flag);
        }
        return false;
      case 'custom':
        return req.customCheck ? req.customCheck(this.state) : false;
      default:
        return false;
    }
  }

  checkEventRequirements(event: Event): boolean {
    return event.requirements.every(req => this.checkRequirement(req));
  }

  checkPuzzleRequirements(puzzle: Puzzle): boolean {
    if (!puzzle.requirements || puzzle.requirements.length === 0) {
      return true; // 沒有需求，直接通過
    }
    return puzzle.requirements.every(req => this.checkRequirement(req));
  }

  applyEffect(effect: Effect): void {
    switch (effect.type) {
      case 'addItem':
        if (effect.itemId && !this.hasItem(effect.itemId)) {
          this.state.inventory.push(effect.itemId);
        }
        break;
      case 'removeItem':
        if (effect.itemId) {
          this.state.inventory = this.state.inventory.filter(id => id !== effect.itemId);
        }
        break;
      case 'setFlag':
        if (effect.flag) {
          this.state.flags[effect.flag] = effect.value !== undefined ? effect.value : true;
        }
        break;
      case 'changeScene':
        if (effect.chapterId && effect.sceneId) {
          this.state.currentChapter = effect.chapterId;
          this.state.currentScene = effect.sceneId;
          if (!this.state.visitedScenes.includes(effect.sceneId)) {
            this.state.visitedScenes.push(effect.sceneId);
          }
        }
        break;
      case 'markScenesVisited':
        if (effect.sceneIds?.length) {
          effect.sceneIds.forEach((id) => {
            if (!this.state.visitedScenes.includes(id)) {
              this.state.visitedScenes.push(id);
            }
          });
        }
        break;
      case 'triggerEvent':
        if (effect.eventId) {
          this.triggerEvent(effect.eventId);
        }
        break;
      case 'startNpcDialog':
        if (effect.dialogId) {
          this.startNpcDialog(effect.dialogId);
        }
        break;
    }
    this.notify();
  }

  triggerEvent(eventId: string): { effects: Effect[]; dialog?: any } | null {
    const scene = this.getCurrentScene();
    if (!scene) return null;

    const event = scene.events.find(e => e.id === eventId);
    if (!event) return null;

    // 檢查是否已觸發過（如果是 oneTime）
    if (event.oneTime && this.hasInteracted(eventId)) {
      return null;
    }

    // 檢查需求
    if (!this.checkEventRequirements(event)) {
      return null;
    }

    // 標記為已互動
    if (event.oneTime) {
      this.state.interactions.push(eventId);
    }

    // 應用效果
    event.effects.forEach(effect => this.applyEffect(effect));

    // 找出對話效果
    const dialogEffect = event.effects.find(e => e.type === 'showDialog');

    return {
      effects: event.effects,
      dialog: dialogEffect?.dialog,
    };
  }

  solvePuzzle(puzzleId: string, input: string | string[] | number[] | Record<string, any>): boolean {
    // 第一章解謎／推理從選單開啟，可能不在放映廳；謎題只定義在 scene_ch1_cinema_a_hall，故由此場景取謎題
    const isCh1MenuPuzzle = puzzleId === 'ch1_pair_matching' || /^ch1_reasoning_\d+$/.test(puzzleId);
    const scene = isCh1MenuPuzzle
      ? (this.scenes['scene_ch1_cinema_a_hall'] || null)
      : this.getCurrentScene();
    if (!scene) return false;

    const puzzle = scene.puzzles.find((p: Puzzle) => p.id === puzzleId);
    if (!puzzle) return false;

    // 檢查謎題是否已經解決過
    const solvedFlag = `puzzle_${puzzleId}_solved`;
    if (puzzle.type === 'pick_three') {
      // pick_three：以 ch1_puzzle_done 為準，集滿三條線索前都允許重複送出
      if (this.hasFlag('ch1_puzzle_done')) return false;
    } else if (this.hasFlag(solvedFlag)) {
      // 謎題已經解決過，不再處理
      return false;
    }

    // 檢查謎題需求
    if (puzzle.requirements) {
      for (const req of puzzle.requirements) {
        if (!this.checkRequirement(req)) {
          return false;
        }
      }
    }

    let solved = false;

    if (puzzle.type === 'input' || puzzle.type === 'combination_lock') {
      solved = puzzle.solution === input;
    } else if (puzzle.type === 'word_scramble') {
      // 拼字遊戲：比較答案（不區分大小寫）
      const solution = typeof puzzle.solution === 'string' ? puzzle.solution.toUpperCase() : '';
      const userAnswer = typeof input === 'string' ? input.toUpperCase() : '';
      solved = solution === userAnswer;
    } else if (puzzle.type === 'wire_connection') {
      // 顏色線對接：如果返回 'connected' 表示正確
      solved = input === 'connected';
    } else if (puzzle.type === 'jigsaw' || puzzle.type === 'sliding_puzzle') {
      // 拼圖和滑塊拼圖：如果返回 'solved' 表示正確
      solved = input === 'solved';
    } else if (puzzle.type === 'rotating_dial') {
      // 旋轉轉盤：比較陣列
      if (Array.isArray(puzzle.solution) && Array.isArray(input)) {
        solved = JSON.stringify(puzzle.solution) === JSON.stringify(input);
      }
    } else if (puzzle.type === 'sequence_memory') {
      // 序列記憶：比較序列
      if (Array.isArray(puzzle.solution) && Array.isArray(input)) {
        solved = JSON.stringify(puzzle.solution) === JSON.stringify(input);
      }
    } else if (puzzle.type === 'symbol_matching') {
      // 符號配對：如果返回 'matched' 表示正確
      solved = input === 'matched';
    } else if (puzzle.type === 'maze_path') {
      // 迷宮路徑：如果返回 'path' 表示正確
      solved = input === 'path';
    } else if (puzzle.type === 'logic_switches') {
      // 邏輯開關：比較物件
      if (typeof puzzle.solution === 'object' && typeof input === 'object') {
        solved = JSON.stringify(puzzle.solution) === JSON.stringify(input);
      }
    } else if (puzzle.type === 'sequence' || puzzle.type === 'arrangement') {
      if (Array.isArray(puzzle.solution) && Array.isArray(input)) {
        solved = JSON.stringify(puzzle.solution) === JSON.stringify(input);
      }
    } else if (puzzle.type === 'combination') {
      if (Array.isArray(puzzle.solution) && Array.isArray(input)) {
        // combination 類型通常使用字符串陣列（組合 ID）
        const solutionArray = puzzle.solution as string[];
        const inputArray = input as string[];
        solved = solutionArray.every(id => inputArray.includes(id));
      }
    } else if (puzzle.type === 'visual_selection') {
      // 視覺化選擇謎題：檢查選中的選項是否匹配答案
      if (Array.isArray(puzzle.solution)) {
        // 多選模式：檢查選中的選項是否完全匹配答案（順序不重要）
        if (Array.isArray(input)) {
          // visual_selection 類型使用字符串陣列（選項 ID）
          const solutionArray = puzzle.solution as string[];
          const inputArray = input as string[];
          solved = solutionArray.length === inputArray.length && 
                   solutionArray.every(id => inputArray.includes(id)) &&
                   inputArray.every(id => solutionArray.includes(id));
        } else {
          // 單選輸入但答案是多選，不匹配
          solved = false;
        }
      } else {
        // 單選模式
        if (typeof input === 'string') {
          solved = puzzle.solution === input;
        } else if (Array.isArray(input) && input.length === 1) {
          solved = puzzle.solution === input[0];
        } else {
          solved = false;
        }
      }
    } else if (puzzle.type === 'pair_matching') {
      // 第一章解謎：3 組配對，組內與組間順序不計
      const solutionPairs = puzzle.solution as [string, string][];
      const inputPairs = input as [string, string][];
      if (!Array.isArray(inputPairs) || inputPairs.length !== 3) {
        solved = false;
      } else {
        const normalize = (pair: string[] | [string, string]) => JSON.stringify([...(Array.isArray(pair) ? pair : [])].sort());
        const solutionSet = solutionPairs.map(p => normalize(p)).sort();
        const inputSet = inputPairs.map(p => normalize(p)).sort();
        solved = solutionSet.length === inputSet.length && solutionSet.every((s, i) => s === inputSet[i]);
      }
    } else if (puzzle.type === 'pick_three') {
      // 第一章解謎：選 3 個道具，與三組正確組合比對（不計順序），命中且該組未解鎖則解鎖該線索
      const solutionGroups = puzzle.solution as string[][];
      const selected = input as string[];
      if (!Array.isArray(selected) || selected.length !== 3 || !Array.isArray(solutionGroups) || solutionGroups.length !== 3) {
        solved = false;
      } else {
        const normalize = (arr: string[]) => [...arr].slice().sort().join(',');
        const selectedKey = normalize(selected);
        for (let i = 0; i < 3; i++) {
          const group = solutionGroups[i];
          if (!Array.isArray(group) || group.length !== 3) continue;
          if (normalize(group) !== selectedKey) continue;
          const clueFlag = `ch1_clue_${i + 1}_unlocked`;
          if (this.hasFlag(clueFlag)) {
            solved = false;
            break;
          }
          this.state.flags[clueFlag] = true;
          this.state.flags['ch1_last_unlocked_combo'] = i + 1;
          const allUnlocked = [1, 2, 3].every(j => this.state.flags[`ch1_clue_${j}_unlocked`]);
          if (allUnlocked) {
            this.state.flags['ch1_puzzle_done'] = true;
            if (puzzle.onSolve) {
              puzzle.onSolve.forEach(e => this.applyEffect(e));
            }
            this.state.flags[solvedFlag] = true;
          }
          solved = true;
          break;
        }
      }
    }
    // 其他新謎題類型暫時返回 false，等待實作

    if (solved && puzzle.onSolve && puzzle.type !== 'pick_three') {
      puzzle.onSolve.forEach(effect => this.applyEffect(effect));
      this.state.flags[solvedFlag] = true;
    }

    if (solved) this.notify();
    return solved;
  }

  useItem(itemId: string): { success: boolean; dialog?: any; openPanel?: string } {
    if (!this.hasItem(itemId)) {
      return { success: false };
    }

    const item = this.items[itemId];
    if (!item || !item.usable) {
      return { success: false };
    }

    if (itemId === 'pulse_clip') {
      this.state.flags['pulse_clip_used'] = true;
      this.notify();
      return { success: true, openPanel: 'pulse_clip' };
    }

    return { success: true };
  }

  // 觸發脈搏夾廣播
  triggerPulseClipBroadcast(): void {
    const scene = this.getCurrentScene();
    if (scene) {
      const event = scene.events.find(e => e.id === 'use_pulse_clip');
      if (event) {
        this.triggerEvent('use_pulse_clip');
      }
    }
  }

  setUVLightState(on: boolean): void {
    this.state.flags['uv_light_on'] = on;
    if (on) {
      const scene = this.getCurrentScene();
      if (scene) {
        const event = scene.events.find(e => e.id === 'use_uv_light');
        if (event) {
          this.triggerEvent('use_uv_light');
        }
      }
    }
    this.notify();
  }

  addInteraction(id: string): void {
    if (!this.state.interactions.includes(id)) {
      this.state.interactions.push(id);
      this.notify();
    }
  }

  removeInteraction(id: string): void {
    this.state.interactions = this.state.interactions.filter((x) => x !== id);
    this.notify();
  }

  setNpcCasualTalkCount(npcId: string, count: number): void {
    if (!this.state.npcCasualTalkCount) this.state.npcCasualTalkCount = {};
    this.state.npcCasualTalkCount[npcId] = Math.max(0, count);
    this.notify();
  }

  // 計算場景探索進度
  calculateExplorationProgress(sceneId: string): number {
    const scene = this.scenes[sceneId];
    if (!scene) return 0;

    const totalItems = scene.items.filter(item => item.collectible).length;
    const totalHotspots = scene.hotspots.length;
    const totalInteractables = totalItems + totalHotspots;

    if (totalInteractables === 0) return 100;

    // 計算已收集的道具
    const collectedItems = scene.items
      .filter(item => item.collectible && this.hasItem(item.id))
      .length;

    // 計算已互動的熱點
    const interactedHotspots = scene.hotspots
      .filter(hotspot => this.hasInteracted(hotspot.id))
      .length;

    const progress = ((collectedItems + interactedHotspots) / totalInteractables) * 100;
    
    // 更新進度記錄（確保 explorationProgress 已初始化）
    if (!this.state.explorationProgress) {
      this.state.explorationProgress = {};
    }
    this.state.explorationProgress[sceneId] = Math.min(100, Math.max(0, progress));
    
    return this.state.explorationProgress[sceneId];
  }

  // 記錄玩家選擇
  addChoice(choiceId: string, weight: number = 0): void {
    if (!this.state.choices) {
      this.state.choices = [];
    }
    const choice: PlayerChoice = {
      id: `choice_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      choiceId,
      timestamp: Date.now(),
      weight,
    };

    this.state.choices.push(choice);
  }

  /** 寫入本章推理分析答案（Q1/Q2/Q3），會自動 persist */
  setReasoningAnswer(chapterId: string, q: 'q1' | 'q2' | 'q3', value: string | string[]): void {
    if (!this.state.reasoningAnswers) this.state.reasoningAnswers = {};
    if (!this.state.reasoningAnswers[chapterId]) {
      this.state.reasoningAnswers[chapterId] = { q1: '', q2: '', q3: '' };
    }
    const entry = this.state.reasoningAnswers[chapterId] as Record<string, string | string[]>;
    entry[q] = value;
  }

  /** 標記本章推理完成並設定導向下一章 intro 的 flag（ch1→ch2, ch2→ch3, ch3→ch4） */
  setReasoningComplete(chapterId: string): void {
    const flagMap: Record<string, string> = {
      ch1: 'navigate_to_ch2_intro',
      ch2: 'navigate_to_ch3_intro',
      ch3: 'navigate_to_ch4_intro',
    };
    const doneFlag = `${chapterId}_reasoning_done`;
    this.applyEffect({ type: 'setFlag', flag: doneFlag, value: true });
    const navFlag = flagMap[chapterId];
    if (navFlag) this.applyEffect({ type: 'setFlag', flag: navFlag, value: true });
  }

  // 處理對話選擇
  handleDialogChoice(choice: DialogChoice): void {
    // 記錄選擇
    if (choice.weight !== undefined) {
      this.addChoice(choice.id, choice.weight);
    }

    // 應用選擇效果
    if (choice.effects) {
      choice.effects.forEach(effect => this.applyEffect(effect));
    }

    this.notify();
  }

  // 獲取當前章節的探索進度
  getChapterProgress(chapterId: string): number {
    const chapter = chapters[chapterId];
    if (!chapter) return 0;

    let totalProgress = 0;
    let sceneCount = 0;

    chapter.scenes.forEach(sceneId => {
      const progress = this.calculateExplorationProgress(sceneId);
      totalProgress += progress;
      sceneCount++;
    });

    return sceneCount > 0 ? totalProgress / sceneCount : 0;
  }

  // === NPC 對話系統方法 ===

  // 開始 NPC 對話（可選指定起始節點，用於林瑞堂等「兩條敏感問題二選一」）
  startNpcDialog(dialogId: string, startNodeId?: string): void {
    const dialogTree = this.npcDialogs[dialogId];
    if (!dialogTree) {
      console.warn(`NPC 對話樹不存在: ${dialogId}`);
      return;
    }

    const firstNodeId = startNodeId ?? Object.keys(dialogTree).find(id => id.includes('01') || id.includes('surface') || id.includes('intro')) ?? Object.keys(dialogTree)[0];
    if (firstNodeId && dialogTree[firstNodeId]) {
      this.state.activeNpcDialogId = dialogId;
      this.state.activeNpcDialogNodeId = firstNodeId;
      this.notify();
    } else {
      console.warn(`[NPC 對話] 無法找到節點: ${firstNodeId ?? 'first'} (對話樹: ${dialogId})`);
    }
  }

  getNpcCasualTalkCount(npcId: string): number {
    return this.state.npcCasualTalkCount?.[npcId] ?? 0;
  }

  incrementNpcCasualTalk(npcId: string): void {
    if (!this.state.npcCasualTalkCount) this.state.npcCasualTalkCount = {};
    this.state.npcCasualTalkCount[npcId] = (this.state.npcCasualTalkCount[npcId] ?? 0) + 1;
    this.notify();
  }

  // 獲取當前 NPC 對話節點
  getCurrentNpcDialogNode(): NpcDialogNode | null {
    if (!this.state.activeNpcDialogId || !this.state.activeNpcDialogNodeId) {
      return null;
    }

    const dialogTree = this.npcDialogs[this.state.activeNpcDialogId];
    if (!dialogTree) {
      console.warn(`[NPC 對話] 對話樹不存在: ${this.state.activeNpcDialogId}`);
      return null;
    }

    const node = dialogTree[this.state.activeNpcDialogNodeId];
    if (!node) {
      console.warn(`[NPC 對話] 節點不存在: ${this.state.activeNpcDialogNodeId} (對話樹: ${this.state.activeNpcDialogId})`);
      return null;
    }

    return node;
  }

  // 處理 NPC 對話選擇
  handleNpcDialogChoice(choiceId: string): void {
    const currentNode = this.getCurrentNpcDialogNode();
    if (!currentNode) {
      return;
    }

    const choice = currentNode.choices.find(c => c.id === choiceId);
    if (!choice) {
      return;
    }

    // 應用選擇效果
    if (choice.effects) {
      choice.effects.forEach(effect => this.applyEffect(effect));
    }

    // 應用偏好變量影響
    if (choice.preferenceEffects?.length) {
      if (!this.state.preferences) {
        this.state.preferences = {
          preference_system_intervention: 0,
          preference_observation_wait: 0,
          overweight_motive: 0,
          weight_behavior_evidence: 0,
          weight_process_similarity: 0,
          weight_escape_route: 0,
          question_system: 0,
          avoid_early_conviction: 0,
        };
      }
      const prefs = this.state.preferences;
      choice.preferenceEffects.forEach(prefEffect => {
        if (prefEffect.target in prefs) {
          const currentValue = prefs[prefEffect.target];
          prefs[prefEffect.target] = Math.max(0, Math.min(3, currentValue + prefEffect.delta));
        }
      });
    }

    this.state.flags[`npc_${this.state.activeNpcDialogId}_choice_${choiceId}`] = true;

    if (currentNode.next) {
      let nextNodeId: string | null = null;
      
      if (typeof currentNode.next === 'string') {
        nextNodeId = currentNode.next;
      } else if (typeof currentNode.next === 'function') {
        nextNodeId = currentNode.next(this.state);
      }

      if (nextNodeId) {
        this.state.activeNpcDialogNodeId = nextNodeId;
      } else {
        this.endNpcDialog();
      }
    } else {
      this.endNpcDialog();
    }
    this.notify();
  }

  // 結束 NPC 對話
  endNpcDialog(): void {
    if (this.state.activeNpcDialogId) {
      // 設置對話完成 flag
      this.state.flags[`npc_${this.state.activeNpcDialogId}_interviewed`] = true;
      
      // 特殊處理：周雅雯對話結束時設置 clue_light_delay_confirmed
      if (this.state.activeNpcDialogId === 'npc_zhou_jie') {
        this.state.flags['clue_light_delay_confirmed'] = true;
      }
    }
    
    this.state.activeNpcDialogId = undefined;
    this.state.activeNpcDialogNodeId = undefined;
    this.notify();
  }

  // === NPC 隨機對話系統 ===

  // 根據權重隨機選擇 NPC 對話
  getRandomNpcDialog(npcId: string): RandomDialog | null {
    const scene = this.getCurrentScene();
    if (!scene || !scene.npcs) return null;

    const npc = scene.npcs.find(n => n.id === npcId);
    if (!npc || !npc.randomDialogs || npc.randomDialogs.length === 0) return null;

    // 檢查 NPC 是否可用
    if (npc.available === false) return null;
    if (npc.availabilityRequirement && !this.checkRequirement(npc.availabilityRequirement)) {
      return null;
    }

    // 根據權重隨機選擇對話
    const dialogs = npc.randomDialogs;
    const totalWeight = dialogs.reduce((sum, dialog) => sum + (dialog.weight || 1), 0);
    
    if (totalWeight === 0) {
      // 如果所有權重都是 0，隨機選擇一個
      return dialogs[Math.floor(Math.random() * dialogs.length)] || null;
    }

    let random = Math.random() * totalWeight;
    for (const dialog of dialogs) {
      const weight = dialog.weight || 1;
      if (random < weight) {
        return dialog;
      }
      random -= weight;
    }

    // 如果沒有選中（理論上不應該發生），返回第一個
    return dialogs[0] || null;
  }

  // 觸發隨機 NPC 對話並返回 Dialog 對象
  triggerRandomNpcDialog(npcId: string): Dialog | null {
    const dialog = this.getRandomNpcDialog(npcId);
    if (!dialog) return null;

    const scene = this.getCurrentScene();
    if (!scene || !scene.npcs) return null;

    const npc = scene.npcs.find(n => n.id === npcId);
    if (!npc) return null;

    // 應用對話效果（如果有）
    if (dialog.effects) {
      dialog.effects.forEach(effect => this.applyEffect(effect));
    }

    this.incrementNpcCasualTalk(npcId);

    // 返回 Dialog 對象，用於顯示對話框（頭像優先使用 WEBP：characterId + characterExpression）
    return {
      text: dialog.text,
      type: 'character',
      characterId: npcId,
      characterName: npc.name,
      characterExpression: npc.portraitExpression ?? 1,
      characterPortrait: npc.portrait,
      characterPosition: 'right',
      choices: dialog.choices, // 傳遞選項
    };
  }
}

