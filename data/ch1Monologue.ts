/**
 * 第一章「內心獨白」獨立按鈕用：全章一次三選一（procedure / evidence / human），
 * 完成全部 4 位 NPC 敏感對話後由按鈕觸發，選完寫入洞察與 ch1_monologue_done。
 */

import type { DialogChoice } from '@/types/game';

export const CH1_MONOLOGUE_TEXT = '離開對話時，KK 的內心旁白——';

export const CH1_MONOLOGUE_CHOICES: DialogChoice[] = [
  {
    id: 'choice_procedure',
    text: '「他不是在說謊，他是在把事情塞回流程裡，讓流程替人背鍋。」',
    insightEffects: [{ target: 'procedure_insight', delta: 1 }],
    effects: [{ type: 'setFlag', flag: 'ch1_monologue_done', value: true }],
  },
  {
    id: 'choice_human',
    text: '「他怕的應該不是兇手，是上面那張看不見的臉，可是這些恐懼會替兇手擦地板。」',
    insightEffects: [{ target: 'human_insight', delta: 1 }],
    effects: [{ type: 'setFlag', flag: 'ch1_monologue_done', value: true }],
  },
  {
    id: 'choice_evidence',
    text: '「官腔很滑，油槍滑掉，但官腔擋不住痕跡。」',
    insightEffects: [{ target: 'evidence_insight', delta: 1 }],
    effects: [{ type: 'setFlag', flag: 'ch1_monologue_done', value: true }],
  },
];
