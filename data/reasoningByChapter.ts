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

export interface ChapterPoliceConfig {
  /**
   * 劉隊在章節開始時給 KK 的簡短交代／任務說明（不劇透結論）。
   */
  introLine: string;
  /**
   * 若提供，第一章開場會拆成兩段顯示（兩則對話依序）；未提供時使用 introLine 單則。
   */
  introLines?: string[];
  /**
   * 在玩家完成推理後，劉隊給出的「可寫進報告」的標準結論。
   */
  outroStandard: string;
  /**
   * 玩家可以要求劉隊加進紀錄／報告裡的句子（例如流程、人性、證據三種角度）。
   * 尚未在 UI 中實作選項時，可先當作文案庫使用。
   */
  outroPlayerLines?: { id: string; text: string }[];
}

export interface ChapterReasoning {
  q1: ReasoningQ1;
  q2: ReasoningQ2;
  q3: ReasoningQ3;
  /**
   * 每章與警方角色（劉隊）相關的互動文案與邏輯設定。
   * 目前僅用於存文案，實際顯示由 ReasoningPanel 或場景流程決定。
   */
  police?: ChapterPoliceConfig;
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
    police: {
      introLine:
        '現場我們會先封著，你來看一眼就好。影城那邊我們也通知了，品牌、技術什麼的都在路上，很快就到。你看到什麼，就照實說，我們再決定要不要往下挖。',
      /** 第一章開場若拆成兩段顯示，優先使用此陣列（兩則對話依序） */
      introLines: [
        '現場我們會先封著，你來看一眼就好。影城那邊我們也通知了，品牌、技術什麼的都在路上，很快就到。',
        '你看到什麼，就照實說，我們再決定要不要往下挖。',
      ],
      outroStandard:
        '我的工作是寫得出一份交得出去的報告。就目前資料，我可以寫：流程上有疏漏，現場處理不當。至於是不是「有人故意這樣設計」——那種句子，寫進去要很多證據。',
      outroPlayerLines: [
        {
          id: 'ch1_summary_flow',
          text: '燈不是自然晚，是被人改過。表格、手動模式、口頭指示……流程這次站在兇手那邊。',
        },
        {
          id: 'ch1_summary_scene',
          text: '現場乾淨得太刻意。有人花力氣把痕跡擦掉，卻忘了碎片比血跡難處理。',
        },
        {
          id: 'ch1_extra_report',
          text: '至少寫進去：這樣的燈光調整與清場節奏，未來若不被檢討，仍可能致人於死。',
        },
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
    police: {
      introLine:
        '這是技術組解完密的那份。你不用幫我寫報告，只要告訴我——哪一段值得我們怕。',
      outroStandard:
        '通訊紀錄中多次出現「三起事故」等字眼，目前可視為內部說法或比喻，尚不足以構成具體預告。未完成錄音提到「結案報告有兩個版本」，經比對現有文件，暫時無法證實有正式報告遭到篡改。受害人長期書寫公共安全與外包議題，其焦慮可視為在高壓工作與輿論環境下的主觀反應。',
      outroPlayerLines: [
        {
          id: 'ch2_extra_procedure',
          text: '補一句：相關系統可重複調整散場節奏，未來仍有致人於危險之虞。',
        },
        {
          id: 'ch2_extra_human',
          text: '補一句：受害人的焦慮來源中，包含真實事故記憶與內部說法，不全屬臆測。',
        },
        {
          id: 'ch2_extra_evidence',
          text: '至少寫進去：目前資料不足以排除系統性問題，只是尚未取得完整證據。',
        },
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
