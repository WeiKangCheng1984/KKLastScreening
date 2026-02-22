/**
 * 流程控制器：依 flowConfig 提供「下一步」路徑，供各頁面 router.push 使用。
 * 實際步驟與路徑對應定義於 data/flowConfig.ts。
 */
import {
  getNextPath as getNextPathFromConfig,
  getChapterIntroContinuePath as getChapterIntroContinuePathFromConfig,
} from '@/data/flowConfig';
import type { GameState } from '@/types/game';

/**
 * 依當前步驟 id 回傳應導向的 Next.js 路徑。
 * @param stepId 當前步驟 id（如 'prologue_text', 'animation_1', 'ch2_hub'）
 * @param sceneId 可選；當 stepId 為 chapter_hub 時傳入選擇的場景 id
 */
export function getNextPath(stepId: string, sceneId?: string): string {
  return getNextPathFromConfig(stepId, sceneId);
}

/**
 * 從章節 id 取得該章節 intro 頁「繼續」按鈕應導向的路徑。
 */
export function getChapterIntroContinuePath(chapterId: string): string {
  return getChapterIntroContinuePathFromConfig(chapterId);
}

/**
 * 未來可擴充：依 GameState 決定分支（例如依 flag 回傳不同 nextPath）。
 */
export function getNextPathFromState(stepId: string, _state?: GameState): string {
  return getNextPathFromConfig(stepId);
}
