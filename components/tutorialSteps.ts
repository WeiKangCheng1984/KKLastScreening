/**
 * 首次遊戲時下方教學的步驟文案，與 UI 分離便於修改。
 * iconKey 對應 Lucide 圖示名稱，在 TutorialCard 內解析。
 */
export interface TutorialStepItem {
  id: string;
  title: string;
  description: string;
  iconKey: 'MousePointer' | 'Package' | 'MapPin';
}

export const tutorialSteps: TutorialStepItem[] = [
  {
    id: 'click',
    title: '點擊互動',
    description: '點擊場景中的物件進行探索和互動',
    iconKey: 'MousePointer',
  },
  {
    id: 'inventory',
    title: '道具欄',
    description: '點擊右上角的背包圖示查看收集的道具',
    iconKey: 'Package',
  },
  {
    id: 'navigation',
    title: '場景切換',
    description: '使用左右箭頭或場景選擇器切換場景',
    iconKey: 'MapPin',
  },
];
