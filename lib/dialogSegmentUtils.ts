/**
 * 對話分段：與 play 頁 buildDialogFromNpcNode、DialogBox 自動分段共用規則。
 * 以 \n\n+ 為段落界；trim 後略過空段。
 */
export function splitTextByParagraphGaps(text: string): string[] {
  return text.split(/\n\n+/).map((s) => s.trim()).filter(Boolean);
}

/**
 * 若已有 textSegments 則沿用；否則當 text 經分段後超過一段時回傳該陣列，否則 null（單段走 dialog.text）。
 */
export function dialogTextToEffectiveSegments(
  text: string | undefined,
  explicitSegments: string[] | undefined | null
): string[] | null {
  if (explicitSegments && explicitSegments.length > 0) {
    return explicitSegments;
  }
  const raw = text ?? '';
  const parts = splitTextByParagraphGaps(raw);
  return parts.length > 1 ? parts : null;
}
