/**
 * 每章推理分析題目（前三章：ch1, ch2, ch3）
 * 三題型：Q1 三選一、Q2 字詞推理、Q3 道具分析連連看
 */

export interface ReasoningQ1 {
  question: string;
  options: { id: string; text: string }[];
}

export interface ReasoningQ2 {
  question: string;
  type: 'input';
  placeholder?: string;
}

export interface ReasoningQ3 {
  question: string;
  leftItems: { id: string; label: string }[];
  rightItems: { id: string; label: string }[];
  correctPairs: [string, string][]; // [leftId, rightId]
}

export interface ChapterReasoning {
  q1: ReasoningQ1;
  q2: ReasoningQ2;
  q3: ReasoningQ3;
}

export const reasoningByChapter: Record<string, ChapterReasoning> = {
  ch1: {
    q1: {
      question: '散場後亮燈延後，你認為最可能的原因是？',
      options: [
        { id: 'A', text: '流程疏失，排程被誤改' },
        { id: 'B', text: '有人刻意申請延後，製造時間窗口' },
        { id: 'C', text: '設備故障，與人為無關' },
      ],
    },
    q2: {
      question: '根據現場線索，請用一句話寫出你對「兇手特徵」的推論（例如：熟悉流程、能接觸燈控）。',
      type: 'input',
      placeholder: '輸入你的推論…',
    },
    q3: {
      question: '請將左側道具與右側線索意義連連看（點選兩兩配對後確認）。',
      leftItems: [
        { id: 'ticket', label: '電影票根' },
        { id: 'schedule', label: '播映時間表（塗改）' },
        { id: 'fragment', label: '黑色塑膠碎片' },
      ],
      rightItems: [
        { id: 'time', label: '死亡時間與場次吻合' },
        { id: 'window', label: '亮燈延後製造犯案窗口' },
        { id: 'glove', label: '疑似手套殘留' },
      ],
      correctPairs: [
        ['ticket', 'time'],
        ['schedule', 'window'],
        ['fragment', 'glove'],
      ],
    },
  },
  ch2: {
    q1: {
      question: '嫌犯 A 的訪客登記顯示案發晚 22:30 仍在辦公大樓，你的判斷是？',
      options: [
        { id: 'A', text: '時間上幾乎不可能犯案，應排除' },
        { id: 'B', text: '可能有共犯或紀錄被竄改' },
        { id: 'C', text: '動機強烈，仍應列為嫌疑' },
      ],
    },
    q2: {
      question: '本章對你而言，最重要的推理原則是什麼？（一句話）',
      type: 'input',
      placeholder: '例如：動機不等於能力…',
    },
    q3: {
      question: '請將左側物品與右側線索意義配對。',
      leftItems: [
        { id: 'recorder', label: '錄音筆' },
        { id: 'visitor_log', label: '訪客登記表' },
        { id: 'gloves', label: '手套（完整未用）' },
      ],
      rightItems: [
        { id: 'alibi', label: '不在場證明' },
        { id: 'motive', label: '對「散場後被留下」的敏感' },
        { id: 'no_use', label: '與案發現場碎片不符' },
      ],
      correctPairs: [
        ['visitor_log', 'alibi'],
        ['recorder', 'motive'],
        ['gloves', 'no_use'],
      ],
    },
  },
  ch3: {
    q1: {
      question: '若要預測下一案地點，你更依賴的依據是？',
      options: [
        { id: 'A', text: '流程與時間節奏的相似度' },
        { id: 'B', text: '不被注意、快速消失的動線' },
        { id: 'C', text: '兩者並重，缺一不可' },
      ],
    },
    q2: {
      question: '電影院 B 與電影院 C，你認為哪一處更符合兇手的「行為模式」？簡述理由。',
      type: 'input',
      placeholder: '例如：C，因為空橋與死角…',
    },
    q3: {
      question: '請將左側線索與右側推論配對。',
      leftItems: [
        { id: 'schedule_b', label: '電影院 B 放映表' },
        { id: 'deadzone', label: '監視器死角圖' },
        { id: 'bridge_fragment', label: '空橋黑色碎片' },
      ],
      rightItems: [
        { id: 'flow', label: '流程相似但散場拖沓' },
        { id: 'escape', label: '合法通道可快速離開' },
        { id: 'same_glove', label: '與第一章碎片材質吻合' },
      ],
      correctPairs: [
        ['schedule_b', 'flow'],
        ['deadzone', 'escape'],
        ['bridge_fragment', 'same_glove'],
      ],
    },
  },
};
