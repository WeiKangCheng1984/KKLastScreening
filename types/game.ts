// 遊戲核心型別定義

export type HotspotShape = 'rect' | 'poly';

export interface Hotspot {
  id: string;
  shape: HotspotShape;
  coords: number[]; // 比例座標 (0-1)
  description?: string;
  hint?: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  image?: string;
  collectible: boolean;
  usable?: boolean;
}

export interface Requirement {
  type: 'hasItem' | 'hasUsedItem' | 'hasInteracted' | 'hasFlag' | 'custom';
  itemId?: string;
  hotspotId?: string;
  flag?: string;
  value?: any;
  customCheck?: (state: GameState) => boolean;
}

export interface Effect {
  type: 'addItem' | 'removeItem' | 'setFlag' | 'showDialog' | 'playAudio' | 'triggerEvent' | 'changeScene';
  itemId?: string;
  flag?: string;
  value?: any;
  dialog?: Dialog;
  audio?: string;
  eventId?: string;
  sceneId?: string;
  chapterId?: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  requirements: Requirement[];
  effects: Effect[];
  oneTime?: boolean;
}

export interface Dialog {
  text: string;
  type?: 'narrator' | 'broadcast' | 'item' | 'system';
  audio?: string;
}

export interface Puzzle {
  id: string;
  type: 
    | 'input' 
    | 'sequence' 
    | 'arrangement' 
    | 'combination' 
    | 'visual_selection' 
    | 'combination_lock'
    | 'word_scramble'      // 拼字遊戲
    | 'wire_connection'    // 顏色線對接
    | 'jigsaw'             // 拼圖
    | 'rotating_dial'      // 旋轉轉盤
    | 'sequence_memory'    // 序列記憶
    | 'sliding_puzzle'     // 滑塊拼圖
    | 'symbol_matching'    // 符號配對
    | 'maze_path'          // 迷宮路徑
    | 'logic_switches';     // 邏輯開關
  solution: string | string[] | number[] | Record<string, any>;
  hint?: string;
  requirements?: Requirement[];
  onSolve?: Effect[];
  options?: Array<{ id: string; label: string; description?: string; visual?: string }>; // 視覺化選擇謎題的選項
  // 各謎題類型的專屬配置
  config?: {
    // 拼字遊戲
    scrambledWord?: string;
    originalWord?: string;
    // 顏色線對接
    wires?: Array<{ id: string; color: string; start: number; end: number }>;
    // 拼圖
    gridSize?: [number, number]; // [rows, cols]
    imageUrl?: string;
    // 旋轉轉盤
    dials?: Array<{ id: string; segments: number; target: number }>;
    // 序列記憶
    sequenceLength?: number;
    symbols?: string[];
    // 滑塊拼圖
    // gridSize 同上
    // 符號配對
    pairs?: Array<{ id: string; symbol: string }>;
    // 迷宮
    maze?: number[][]; // 0=牆, 1=路徑
    start?: [number, number];
    end?: [number, number];
    // 邏輯開關
    switches?: Array<{ id: string; initialState: boolean }>;
    logicRules?: string; // 邏輯表達式
  };
}

export interface Scene {
  id: string;
  chapterId: string;
  name: string;
  description: string;
  background: string; // 背景圖路徑
  hotspots: Hotspot[];
  items: Item[];
  events: Event[];
  puzzles: Puzzle[];
  initialDialog?: Dialog;
  ambientAudio?: string;
  hotspotEventMap?: Record<string, string>; // hotspot ID -> event ID 映射表
}

export interface Chapter {
  id: string;
  name: string;
  description: string;
  scenes: string[]; // scene IDs
}

export interface GameState {
  currentChapter: string;
  currentScene: string;
  inventory: string[]; // item IDs
  flags: Record<string, any>;
  interactions: string[]; // 已互動的 hotspot/event IDs
  visitedScenes: string[];
}

