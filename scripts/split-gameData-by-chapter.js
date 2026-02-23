/**
 * 從 data/gameData.ts 依章節切出 gameDataCh1..Ch5（供 getChapterData 動態 import，實現按需載入）。
 * 執行前請確保 data/gameData.ts 為完整內容（含 items, scenes, npcDialogs）。
 * 執行：node scripts/split-gameData-by-chapter.js
 * 產出後需將 data/gameData.ts 改為僅再匯出 chapters + getChapterData，並讓 getChapterData 改回 dynamic import Ch1..Ch5。
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'data', 'gameData.ts');
const content = fs.readFileSync(SRC, 'utf8');
const lines = content.split('\n');

// 行號 1-based，對應 gameData.ts 的 export const items / scenes / npcDialogs 內之區塊
const CHAPTER_ITEMS = {
  ch1: { start: 21, end: 67 },   // 第一章道具（到 item_cleaning_note 的 }, 含逗號）
  ch2: { start: 70, end: 104 },
  ch3: { start: 106, end: 162 },
  ch4: { start: 164, end: 212 },
  ch5: { start: 214, end: 239 },
};
const CHAPTER_SCENES = {
  ch1: [{ start: 244, end: 609 }, { start: 610, end: 1195 }, { start: 1196, end: 1559 }],
  ch2: [{ start: 1560, end: 1722 }, { start: 1723, end: 1881 }, { start: 1882, end: 2073 }],
  ch3: [{ start: 2074, end: 2236 }, { start: 2237, end: 2405 }, { start: 2406, end: 2566 }],
  ch4: [{ start: 2567, end: 2750 }, { start: 2751, end: 2950 }, { start: 2951, end: 3099 }],
  ch5: [{ start: 3100, end: 3258 }, { start: 3259, end: 3382 }, { start: 3383, end: 3510 }],
};
const NPC_DIALOGS = { start: 3598, end: 3941 }; // npcDialogs 內容（僅 ch1 使用）

function sliceLines(startOneBased, endOneBased) {
  return lines.slice(startOneBased - 1, endOneBased).join('\n');
}

const header = `import { Scene, Item, NpcDialogNode } from '@/types/game';

`;

for (const chapterId of ['ch1', 'ch2', 'ch3', 'ch4', 'ch5']) {
  const itemBlock = sliceLines(CHAPTER_ITEMS[chapterId].start, CHAPTER_ITEMS[chapterId].end);
  const sceneBlocks = CHAPTER_SCENES[chapterId].map(({ start, end }) => sliceLines(start, end));
  const scenesContent = sceneBlocks.join(',\n\n  ');
  const npcContent = chapterId === 'ch1' ? sliceLines(NPC_DIALOGS.start, NPC_DIALOGS.end) : '';

  let fileContent = header;
  fileContent += `// ${chapterId} 道具\nconst items: Record<string, Item> = {\n${itemBlock}\n};\n`;

  if (chapterId === 'ch1') {
    fileContent += `\n// ${chapterId} 場景\nconst scenes: Record<string, Scene> = {\n  ${scenesContent}\n};\n\n`;
    fileContent += `// ${chapterId} NPC 對話（第一章全部）\nconst npcDialogs: Record<string, Record<string, NpcDialogNode>> = {\n${npcContent}\n};\n\n`;
  } else {
    fileContent += `\n// ${chapterId} 場景\nconst scenes: Record<string, Scene> = {\n  ${scenesContent}\n};\n\n`;
    fileContent += `const npcDialogs: Record<string, Record<string, NpcDialogNode>> = {};\n\n`;
  }

  fileContent += `export { scenes, items, npcDialogs };\n`;

  const outPath = path.join(ROOT, 'data', `gameData${chapterId.charAt(0).toUpperCase() + chapterId.slice(1)}.ts`);
  fs.writeFileSync(outPath, fileContent, 'utf8');
  console.log('Wrote', outPath);
}

console.log('Done. Check that scene references to items use local `items` (same file).');
