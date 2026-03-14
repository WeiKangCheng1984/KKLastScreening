export type FloatingOption = {
  id: string;
  label: string;
  fullText: string;
  x?: number;
  y?: number;
  rotation?: number;
};

export type FillBlankConfig = {
  title?: string;
  sentencePrefix: string;
  sentenceSuffix: string;
  options: FloatingOption[];
  correctIds: string[];
  replyByChoiceId: Record<string, string>;
  wrongFallback: string;
};

/**
 * 雙空格浮動填空設定（向劉隊回報機制用）
 *
 * 句子渲染方式：
 *   sentenceParts[0] + [BLANK_1] + sentenceParts[1] + [BLANK_2] + sentenceParts[2]
 */
export type TwoBlankFillConfig = {
  id: string;

  /** 句子切成三段，blank 在各段之間 */
  sentenceParts: [string, string, string];

  /** 空格一：題目提示 + 浮動選項 + 正解 + 填對後 KK 旁白 */
  blank1: {
    hintLabel: string;
    options: FloatingOption[];
    correctIds: string[];
    replyOnCorrect: string;
  };

  /** 空格二：同上結構 */
  blank2: {
    hintLabel: string;
    options: FloatingOption[];
    correctIds: string[];
    replyOnCorrect: string;
  };

  /** 兩格都填對後：KK + 劉隊各一句 */
  bothCorrectDialogue: {
    kk: string;
    liu: string;
  };

  /** 任一格填錯時顯示的提示（共用） */
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

