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
      question: '關於「死者是誰」，你認為受害者身份被保密的主要原因可能是？',
      options: [
        { id: 'A', text: '警方尚未完成身份確認與家屬通知' },
        { id: 'B', text: '死者身份牽涉敏感線索，有人刻意壓消息' },
        { id: 'C', text: '純屬流程規定，與案情無關' },
      ],
    },
    q2: {
      question: '根據本章線索，請用一句話寫出你對「死者為何被盯上」或「流程與責任」的推論。',
      type: 'input',
      placeholder: '輸入你的推論…',
    },
    q3: {
      question: '請將左側線索與右側意義配對（死者是誰／城市影城外的風）。',
      leftItems: [
        { id: 'victim_info', label: '受害者基礎資料' },
        { id: 'encrypted', label: '加密訊息紀錄' },
        { id: 'column_draft', label: '專欄草稿片段' },
      ],
      rightItems: [
        { id: 'identity', label: '吳亞／烏鴉、專欄與職業' },
        { id: 'threat', label: '「三起事故」等敏感用語' },
        { id: 'unpublished', label: '未發表筆記與立場' },
      ],
      correctPairs: [
        ['victim_info', 'identity'],
        ['encrypted', 'threat'],
        ['column_draft', 'unpublished'],
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
