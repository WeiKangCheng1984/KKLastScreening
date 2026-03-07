/**
 * 從 data/gameData.ts 依章節切出 gameDataCh1..Ch6（供 getChapterData 動態 import，實現按需載入）。
 * 執行前請確保 data/gameData.ts 為完整內容（含 items, scenes, npcDialogs）。
 * 執行：node scripts/split-gameData-by-chapter.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'data', 'gameData.ts');
const content = fs.readFileSync(SRC, 'utf8');
const lines = content.split('\n');

// 行號 1-based，對應 gameData.ts 的 export const items / scenes / npcDialogs 內之區塊（依目前 gameData 校準）
const CHAPTER_ITEMS = {
  ch1: { start: 22, end: 70 },
  ch2: { start: 73, end: 121 },
  ch3: { start: 123, end: 214 }, // 不含 214「第四章」註解與 215 item_light_adjustment_request
  ch4: { start: 215, end: 264 }, // 不含 264「第五章」註解與 265 item_elevator_floor_display
  ch5: { start: 265, end: 290 }, // 含最後一項 "  }"；腳本會移除結尾 "};"
  ch6: { start: 291, end: 290 }, // 空區間產出空物件
};
const CHAPTER_SCENES = {
  ch1: [{ start: 295, end: 627 }, { start: 628, end: 1213 }, { start: 1215, end: 1743 }],
  ch2: [{ start: 1745, end: 2292 }],
  ch3: [{ start: 2293, end: 2784 }],
  ch4: [{ start: 2786, end: 3318 }], // 不含 3319 ch5_sc1
  ch5: [{ start: 3319, end: 3730 }], // 含 ch5_sc3 結尾 "  }, "；腳本會移除結尾 "};"
  ch6: [], // 無 ch6 場景
};
const NPC_DIALOGS = { start: 3734, end: 4052 };

function sliceLines(startOneBased, endOneBased) {
  return lines.slice(startOneBased - 1, endOneBased).join('\n');
}

const header = `import { Scene, Item, NpcDialogNode } from '@/types/game';

`;

for (const chapterId of ['ch1', 'ch2', 'ch3', 'ch4', 'ch5', 'ch6']) {
  let itemBlock = sliceLines(CHAPTER_ITEMS[chapterId].start, CHAPTER_ITEMS[chapterId].end);
  if (chapterId === 'ch5') itemBlock = itemBlock.replace(/\n\};\s*$/, '');
  const sceneBlocks = CHAPTER_SCENES[chapterId].map(({ start, end }) => sliceLines(start, end));
  let scenesContent = sceneBlocks.join('\n\n  ');
  if (chapterId === 'ch5') scenesContent = scenesContent.replace(/\n\};\s*$/, '');
  const npcContent = chapterId === 'ch1' ? sliceLines(NPC_DIALOGS.start, NPC_DIALOGS.end).replace(/\n\};\s*$/, '') : '';

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
