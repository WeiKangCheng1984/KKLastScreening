// 遊戲核心型別定義

export type HotspotShape = 'rect' | 'poly';

export type HotspotKind = 'object' | 'clue' | 'npc';

export interface Hotspot {
  id: string;
  shape: HotspotShape;
  coords: number[]; // 比例座標 (0-1)
  description?: string;
  hint?: string;
  svgOverlay?: string;   // 新增：hover 時顯示的 SVG 預覽
  // 新增：用來區分 NPC / 道具 / 線索 類型
  kind?: HotspotKind;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  image?: string;        // 現有：PNG/WebP 路徑
  svgImage?: string;     // 新增：SVG 路徑
  svgSize?: 'small' | 'medium' | 'large'; // SVG 顯示尺寸
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
  type: 'addItem' | 'removeItem' | 'setFlag' | 'showDialog' | 'playAudio' | 'triggerEvent' | 'changeScene' | 'startNpcDialog' | 'addInsight';
  itemId?: string;
  flag?: string;
  value?: any;
  dialog?: Dialog;
  audio?: string;
  eventId?: string;
  sceneId?: string;
  chapterId?: string;
  dialogId?: string; // 用於 startNpcDialog
  insightTarget?: keyof InsightsState; // 用於 addInsight
  insightDelta?: number; // 用於 addInsight
}

export interface Event {
  id: string;
  name: string;
  description: string;
  requirements: Requirement[];
  effects: Effect[];
  oneTime?: boolean;
}

export interface DialogChoice {
  id: string;
  text: string;
  weight?: number; // 選擇權重（用於分數計算）
  nextDialog?: Dialog; // 後續對話
  effects?: Effect[]; // 選擇效果
  insightEffects?: InsightEffect[]; // 對 KK 洞察三維度的影響
}

export interface Dialog {
  text: string;
  /** 對話框上方顯示的標題（例如互動點名稱） */
  title?: string;
  /** 分段顯示（NPC 進階對話）：依序顯示，每段按「繼續」下一段，最後一段後顯示選擇 */
  textSegments?: string[];
  type?: 'narrator' | 'broadcast' | 'item' | 'system' | 'choice' | 'character';
  audio?: string;
  svgImage?: string;     // 新增：對話框中顯示的 SVG
  svgPosition?: 'top' | 'bottom' | 'left' | 'right'; // SVG 位置
  choices?: DialogChoice[]; // 新增：對話選擇（2選1或3選1）
  // 角色立繪相關
  characterId?: string;  // 角色 ID（與 WEBP 命名 {characterId}_1.webp 對應）
  characterName?: string; // 角色名稱（顯示在對話框標題）
  characterPortrait?: string; // 角色立繪圖片/SVG 路徑（棄用：改用 WEBP，見 characterExpression）
  characterExpression?: 1 | 2 | 3; // 頭像表情編號，對應 /images/characters/{characterId}_1|2|3.webp
  characterPosition?: 'left' | 'right'; // 立繪位置（左側或右側）
}

// === KK 洞察系統（三維度） ===

// 玩家思考分數：PROCEDURE 流程洞察、HUMAN 人心洞察、EVIDENCE 物證洞察
export interface InsightsState {
  procedure_insight: number;
  human_insight: number;
  evidence_insight: number;
}

// 選項對洞察維度的影響
export interface InsightEffect {
  target: keyof InsightsState;
  delta: number;
}

// === NPC 對話系統（A + C 模式） ===

// 玩家推理偏好變量（對應 story.mdc 中的 0–3 變量，後續章節用）
export interface PreferencesState {
  preference_system_intervention: number;
  preference_observation_wait: number;
  overweight_motive: number;
  weight_behavior_evidence: number;
  weight_process_similarity: number;
  weight_escape_route: number;
  question_system: number;
  avoid_early_conviction: number;
}

// 選項對偏好變量的影響
export interface PreferenceEffect {
  target: keyof PreferencesState;
  delta: number;
}

// 單一 NPC 對話選項
export interface NpcDialogChoice {
  id: string;
  label: string;
  description?: string;
  // 選項帶來的具體效果（設置旗標、獲得道具等）
  effects?: Effect[];
  // 對偏好變量的影響（0–3，需在引擎端 clamp）
  preferenceEffects?: PreferenceEffect[];
  // 對 KK 洞察三維度的影響（流程／人心／物證）
  insightEffects?: InsightEffect[];
}

// 單一 NPC 對話節點
export interface NpcDialogNode {
  id: string;
  npcId: string;
  text: string;
  choices: NpcDialogChoice[];
  // 根據當前偏好決定下一個節點
  next?: string | ((state: GameState) => string | null);
}

// 角色對話系統：對話回合
export interface ConversationTurn {
  id: string;
  text: string;
  characterId: string;
  characterName: string;
  characterPortrait?: string; // 棄用：改用 WEBP，見 characterExpression
  characterExpression?: 1 | 2 | 3; // 頭像表情，對應 /images/characters/{characterId}_1|2|3.webp
  characterPosition?: 'left' | 'right';
  speaker?: 'character' | 'player'; // 說話者是角色還是玩家
  delay?: number; // 這段對話的延遲時間（毫秒）
  autoAdvance?: boolean; // 是否自動推進到下一段（默認 true）
  autoAdvanceDelay?: number; // 自動推進的延遲時間（毫秒，默認 2000）
}

// 角色對話鏈配置
export interface CharacterConversation {
  id: string; // 對話鏈 ID（例如 'character_1_conversation'）
  turns: ConversationTurn[]; // 對話回合列表
  finalChoices?: DialogChoice[]; // 最後的選擇題（可選）
  onComplete?: {
    setFlag?: string; // 完成後設置的 flag
    triggerEvent?: string; // 完成後觸發的事件
  };
}

// === NPC 隨機對話系統 ===

// 隨機對話
export interface RandomDialog {
  id: string;
  text: string;
  type: 'casual' | 'hint'; // 閒聊或提示
  weight?: number; // 權重（用於控制出現頻率，hint 類型權重較低）
  effects?: Effect[]; // 可選效果（如設置 flag、獲得線索）
  choices?: DialogChoice[]; // 可選：對話選項（2選1或3選1）
}

// NPC 定義
export interface Npc {
  id: string; // 例如 'npc_lin_ruitang'，對應頭像檔名 {id}_1.webp, {id}_2.webp, {id}_3.webp
  name: string; // 顯示名稱，例如 '林瑞堂（副理）'
  portrait?: string; // 立繪路徑（棄用：改用 WEBP 三表情）
  portraitWebp?: string; // 頭像 WEBP 單檔（可選覆寫，未設則用 {id}_1.webp）
  portraitExpression?: 1 | 2 | 3; // 右側頭像預設表情，未設為 1
  randomDialogs: RandomDialog[]; // 隨機對話池
  available?: boolean; // 是否可互動（可通過 flag 控制）
  availabilityRequirement?: Requirement; // 可互動的條件
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
    | 'logic_switches'     // 邏輯開關
    | 'pair_matching'      // 第一章：6 道具兩兩配對（3 組）
    | 'pick_three';        // 第一章：6 道具選 3 個，三組正確組合各對應一條線索
  solution: string | string[] | number[] | Record<string, any> | [string, string][] | string[][];
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
    // pair_matching：第一章解謎，3 組配對對應的線索文案
    pairClues?: string[];
    // pick_three：第一章解謎，3 組正確組合各對應一條線索
    clues?: string[];
    // arrangement：字詞排序題的混淆用詞（會與 solution 一起打亂供玩家選擇）
    distractors?: string[];
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
  npcs?: Npc[]; // 新增：場景中的 NPC 列表
}

export interface ChapterIntroSlide {
  image?: string;
  video?: string;
  text: string;
}

export interface ChapterIntro {
  title: string;
  subtitle: string;
  description: string;
  moodText: string;
  backgroundImage?: string; // 可選背景圖路徑
  backgroundVideo?: string; // 新增：背景影片路徑
  mediaType?: 'image' | 'video' | 'slideshow'; // 新增：媒體類型
  slides?: ChapterIntroSlide[]; // 新增：輪播內容
  ambientAudio?: string; // 可選環境音路徑
  introVideo?: string; // 新增：導讀影片（文字說明後播放）
}

export interface Chapter {
  id: string;
  name: string;
  description: string;
  scenes: string[]; // scene IDs
  intro?: ChapterIntro; // 導讀頁內容
  chapterPuzzle?: Puzzle; // 新增：章節謎題
  puzzleUnlockThreshold?: number; // 新增：解鎖閾值（預設 75）
}

export interface PlayerChoice {
  id: string;
  choiceId: string;
  timestamp: number;
  weight: number;
}

export interface GameState {
  currentChapter: string;
  currentScene: string;
  inventory: string[]; // item IDs
  flags: Record<string, any>;
  interactions: string[]; // 已互動的 hotspot/event IDs
  visitedScenes: string[];
  // 新增：探索進度追蹤
  explorationProgress?: Record<string, number>; // 場景ID -> 進度百分比
  chapterPuzzleUnlocked?: Record<string, boolean>; // 章節ID -> 是否解鎖謎題
  // 新增：分數/加權系統
  score?: number; // 總分數
  weights?: Record<string, number>; // 各維度權重，如 { 'rule_follower': 5, 'risk_taker': 3 }
  choices?: PlayerChoice[]; // 記錄所有選擇
  // 新增：玩家推理偏好變量（0–3）
  preferences?: PreferencesState;
  // 新增：KK 洞察三維度（流程洞察、人心洞察、物證洞察）
  insights?: InsightsState;
  // 新增：NPC 對話模式狀態
  activeNpcDialogId?: string;
  activeNpcDialogNodeId?: string;
  // 推理分析每章答案（供後續分岔）
  reasoningAnswers?: Record<string, { q1: string; q2: string; q3: string | string[] }>;
}

// === 流程模組化（Flow） ===

export type FlowStepType =
  | 'main_menu'
  | 'prologue_text'
  | 'animation'
  | 'chapter_intro'
  | 'scene_explore'
  | 'chapter_hub'
  | 'scene_single';

export interface FlowStepChoice {
  id: string;
  label: string;
  sceneId?: string;
  next?: string;
}

export interface FlowStep {
  id: string;
  type: FlowStepType;
  next?: string;
  choices?: FlowStepChoice[];
  video?: string;
  textSlides?: string[];
  chapterId?: string;
  sceneIds?: string[];
  background?: string;
}

export interface FlowConfig {
  steps: Record<string, FlowStep>;
  firstStepId: string;
}

