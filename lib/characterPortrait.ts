/**
 * NPC / 角色頭像 WEBP 統一命名規則（每人 3 個表情）
 *
 * 路徑：public/images/characters/
 * 檔名：{角色ID}_{表情編號}.webp
 *
 * 表情編號：
 *   1 = 預設／一般
 *   2 = 第二種表情（可自訂，例如：笑、嚴肅、驚訝）
 *   3 = 第三種表情
 *
 * 範例（請在 public/images/characters/ 放置對應檔案）：
 *   npc_lin_ruitang_1.webp
 *   npc_lin_ruitang_2.webp
 *   npc_lin_ruitang_3.webp
 *   npc_ashun_1.webp
 *   npc_ashun_2.webp
 *   npc_ashun_3.webp
 *   npc_xiaozhang_1.webp
 *   npc_xiaozhang_2.webp
 *   npc_xiaozhang_3.webp
 *   npc_zhou_jie_1.webp
 *   npc_zhou_jie_2.webp
 *   npc_zhou_jie_3.webp
 *   kitchen_voice_1.webp, kitchen_voice_2.webp, kitchen_voice_3.webp
 *   shadow_person_1.webp, shadow_person_2.webp, shadow_person_3.webp
 *   bedroom_shadow_1.webp, bedroom_shadow_2.webp, bedroom_shadow_3.webp
 */

export type PortraitExpression = 1 | 2 | 3;

const BASE_PATH = '/images/characters';

/**
 * 依角色 ID 與表情編號回傳頭像 WEBP 路徑。
 * @param characterId 例如 'npc_lin_ruitang'
 * @param expression 1=預設, 2=第二種, 3=第三種；未傳則為 1
 */
export function getNpcPortraitUrl(
  characterId: string,
  expression?: PortraitExpression
): string {
  const exp = expression ?? 1;
  return `${BASE_PATH}/${characterId}_${exp}.webp`;
}

/** 使用此命名規則的 NPC ID 列表（供你填補圖檔時對照） */
export const NPC_PORTRAIT_IDS = [
  'npc_lin_ruitang',
  'npc_ashun',
  'npc_xiaozhang',
  'npc_zhou_jie',
  'npc_asu',
  'npc_liu',
  'kitchen_voice',
  'shadow_person',
  'bedroom_shadow',
] as const;
