function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 場景立繪 + DialogBox 標題列已顯示角色名時，內文開頭若為「某某說：」「某某低聲說：」「某某：「…」」會與抬頭重複。
 * 只處理字串開頭，避免誤刪敘事中段的「他說」。
 */
export function stripRedundantSpeakerPrefix(text: string, characterName: string): string {
  const leading = text.match(/^\s*/)?.[0] ?? '';
  const trimmed = text.slice(leading.length);
  if (!trimmed || !characterName.trim()) return text;

  const full = characterName.trim();
  const shortName = full.split('（')[0].trim();
  if (!shortName) return text;

  const esc = escapeRegex(shortName);
  const optionalTitle = '(?:（[^）]{1,40}）)?';

  const reSay = new RegExp(
    `^${esc}${optionalTitle}[^\\n\\r]{0,12}?\\s*說[：:]\\s*`,
    'u'
  );
  const mSay = trimmed.match(reSay);
  if (mSay) {
    const rest = trimmed.slice(mSay[0].length);
    return rest.length > 0 ? leading + rest : text;
  }

  const reColon = new RegExp(`^${esc}${optionalTitle}\\s*[：:]\\s*`, 'u');
  const mCol = trimmed.match(reColon);
  if (mCol) {
    const after = trimmed.slice(mCol[0].length);
    if (after.startsWith('「') || after.startsWith('"')) {
      return leading + after;
    }
  }

  return text;
}
