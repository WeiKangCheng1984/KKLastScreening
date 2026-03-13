export type FloatingOption = {
  id: string;
  label: string;
  fullText: string;
  x?: number;
  y?: number;
  rotation?: number;
};

export type FillBlankConfig = {
  sentencePrefix: string;
  sentenceSuffix: string;
  options: FloatingOption[];
  correctIds: string[];
  replyByChoiceId: Record<string, string>;
  wrongFallback: string;
};

/** 將選中的答案填入句子中，其他部分保持原 prefix/suffix。 */
export function buildFilledSentence(
  config: FillBlankConfig,
  selectedId: string | null,
  placeholder: string,
): string {
  const selected = config.options.find((o) => o.id === selectedId);
  const fill = selected?.fullText ?? placeholder;
  return `${config.sentencePrefix}${fill}${config.sentenceSuffix}`;
}

export interface EvaluateResult {
  hasSelection: boolean;
  isCorrect: boolean;
  feedback: string | null;
}

/** 依 config 與選項計算對錯與回饋文字（不負責寫 engine／旗標）。 */
export function evaluateSelection(
  config: FillBlankConfig,
  selectedId: string | null,
): EvaluateResult {
  if (!selectedId) {
    return {
      hasSelection: false,
      isCorrect: false,
      feedback: null,
    };
  }

  const isCorrect = config.correctIds.includes(selectedId);
  if (!isCorrect) {
    return {
      hasSelection: true,
      isCorrect: false,
      feedback: config.wrongFallback,
    };
  }

  return {
    hasSelection: true,
    isCorrect: true,
    feedback: config.replyByChoiceId[selectedId] ?? null,
  };
}

