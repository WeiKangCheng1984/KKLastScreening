/**
 * 人名與職稱顯示：在「（」前換行（與 NpcRightStrip 一致），並將半形括號正規為全形以利斷行規則一致。
 */
export function formatNpcDisplayName(name: string): string {
  const t = name.trim();
  if (!t) return t;
  const normalized = t.replace(/\(/g, '（').replace(/\)/g, '）');
  return normalized.replace(/（/g, '\n（');
}
