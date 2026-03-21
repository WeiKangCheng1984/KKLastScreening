import { splitTextByParagraphGaps } from '@/lib/dialogSegmentUtils';

export interface NpcDialogNodeInput {
  text: string;
  choices: Array<{ id: string; label: string; effects?: any[]; insightEffects?: any[] }>;
}

export interface NpcInfoInput {
  id: string;
  name: string;
  portrait?: string;
  portraitExpression?: 1 | 2 | 3;
}

export function buildDialogFromNpcNode(node: NpcDialogNodeInput, npc: NpcInfoInput) {
  const segments = splitTextByParagraphGaps(node.text);
  const textSegments = segments.length > 0 ? segments : [node.text];
  return {
    text: textSegments[0],
    textSegments,
    type: 'character' as const,
    characterId: npc.id,
    characterName: npc.name,
    characterExpression: npc.portraitExpression ?? 1,
    characterPosition: 'right' as const,
    characterPortrait: npc.portrait,
    choices: node.choices.map((c) => ({
      id: c.id,
      text: c.label,
      effects: c.effects,
      insightEffects: c.insightEffects,
    })),
  };
}
