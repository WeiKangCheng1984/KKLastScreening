/**
 * SVG 拖動系統
 * 處理 SVG 元素的拖動邏輯、區域限制和碰撞檢測
 */

export interface DragBounds {
  minX?: number;
  maxX?: number;
  minY?: number;
  maxY?: number;
}

export interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  deltaX: number;
  deltaY: number;
}

export class SVGDragSystem {
  private dragStates: Map<string, DragState> = new Map();

  /**
   * 開始拖動
   */
  startDrag(
    id: string,
    startX: number,
    startY: number,
    bounds?: DragBounds
  ): DragState {
    const state: DragState = {
      isDragging: true,
      startX,
      startY,
      currentX: startX,
      currentY: startY,
      deltaX: 0,
      deltaY: 0,
    };

    this.dragStates.set(id, state);
    return state;
  }

  /**
   * 更新拖動位置
   */
  updateDrag(
    id: string,
    x: number,
    y: number,
    bounds?: DragBounds
  ): DragState | null {
    const state = this.dragStates.get(id);
    if (!state) return null;

    let newX = x;
    let newY = y;

    // 應用邊界限制
    if (bounds) {
      if (bounds.minX !== undefined) newX = Math.max(newX, bounds.minX);
      if (bounds.maxX !== undefined) newX = Math.min(newX, bounds.maxX);
      if (bounds.minY !== undefined) newY = Math.max(newY, bounds.minY);
      if (bounds.maxY !== undefined) newY = Math.min(newY, bounds.maxY);
    }

    const newState: DragState = {
      ...state,
      currentX: newX,
      currentY: newY,
      deltaX: newX - state.startX,
      deltaY: newY - state.startY,
    };

    this.dragStates.set(id, newState);
    return newState;
  }

  /**
   * 結束拖動
   */
  endDrag(id: string): DragState | null {
    const state = this.dragStates.get(id);
    if (!state) return null;

    const finalState: DragState = {
      ...state,
      isDragging: false,
    };

    this.dragStates.delete(id);
    return finalState;
  }

  /**
   * 檢測兩個元素是否碰撞
   */
  checkCollision(
    x1: number,
    y1: number,
    width1: number,
    height1: number,
    x2: number,
    y2: number,
    width2: number,
    height2: number
  ): boolean {
    return (
      x1 < x2 + width2 &&
      x1 + width1 > x2 &&
      y1 < y2 + height2 &&
      y1 + height1 > y2
    );
  }

  /**
   * 獲取拖動狀態
   */
  getDragState(id: string): DragState | undefined {
    return this.dragStates.get(id);
  }

  /**
   * 清除所有拖動狀態
   */
  clearAll(): void {
    this.dragStates.clear();
  }
}

// 單例實例
export const svgDragSystem = new SVGDragSystem();
