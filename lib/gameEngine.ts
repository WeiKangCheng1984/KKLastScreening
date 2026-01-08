import { GameState, Scene, Event, Requirement, Effect, Puzzle, Item } from '@/types/game';
import { scenes, items } from '@/data/gameData';

export class GameEngine {
  private state: GameState;

  constructor(initialState?: GameState) {
    this.state = initialState || {
      currentChapter: 'ch1',
      currentScene: 'ch1_sc1',
      inventory: [],
      flags: {},
      interactions: [],
      visitedScenes: [],
    };
  }

  getState(): GameState {
    return { ...this.state };
  }

  getCurrentScene(): Scene | null {
    return scenes[this.state.currentScene] || null;
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
      case 'triggerEvent':
        if (effect.eventId) {
          this.triggerEvent(effect.eventId);
        }
        break;
    }
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

  // 注意：interactWithHotspot 已廢棄，道具獲取現在統一通過 handleItemCollection 處理
  // 此方法保留作為後備，但不再自動檢測和添加道具
  interactWithHotspot(hotspotId: string): { events: any[]; item?: Item } | null {
    const scene = this.getCurrentScene();
    if (!scene) return null;

    const hotspot = scene.hotspots.find(h => h.id === hotspotId);
    if (!hotspot) return null;

    // 先將 hotspot 加入到 interactions（這樣 hasInteracted 檢查才能通過）
    this.addInteraction(hotspotId);

    const triggeredEvents: any[] = [];

    // 檢查所有事件（但不自動添加道具，道具獲取由事件系統處理）
    scene.events.forEach(event => {
      const result = this.triggerEvent(event.id);
      if (result) {
        triggeredEvents.push({
          eventId: event.id,
          ...result,
        });
      }
    });

    return {
      events: triggeredEvents,
      item: undefined, // 不再自動檢測道具
    };
  }

  solvePuzzle(puzzleId: string, input: string | string[] | number[] | Record<string, any>): boolean {
    const scene = this.getCurrentScene();
    if (!scene) return false;

    const puzzle = scene.puzzles.find(p => p.id === puzzleId);
    if (!puzzle) return false;

    // 檢查謎題是否已經解決過
    const solvedFlag = `puzzle_${puzzleId}_solved`;
    if (this.hasFlag(solvedFlag)) {
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
    }
    // 其他新謎題類型暫時返回 false，等待實作

    if (solved && puzzle.onSolve) {
      puzzle.onSolve.forEach(effect => this.applyEffect(effect));
      // 標記謎題已解決
      this.state.flags[solvedFlag] = true;
    }

    return solved;
  }

  useItem(itemId: string): { success: boolean; dialog?: any; openPanel?: string } {
    if (!this.hasItem(itemId)) {
      return { success: false };
    }

    const item = items[itemId];
    if (!item || !item.usable) {
      return { success: false };
    }

    // 特殊道具使用邏輯
    if (itemId === 'pulse_clip') {
      // 標記為已使用，打開脈搏夾面板
      this.state.flags['pulse_clip_used'] = true;
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

  // 設置 UV 燈狀態
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
  }

  addInteraction(id: string): void {
    if (!this.state.interactions.includes(id)) {
      this.state.interactions.push(id);
    }
  }
}

