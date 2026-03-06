/**
 * 第一章報告編輯器專用設定（證據桌、時間線、版本深度、態度宣言）
 * 與 reasoningByChapter.ch1.police 並存：police 提供 outroStandard / outroPlayerLines，此檔提供步驟結構與驗證規則。
 */

export type Ch1EvidenceCategory = 'TimeAnchor' | 'ProcessAnchor' | 'PhysicalTrace';

export interface Ch1EvidenceCard {
  itemId: string;
  category: Ch1EvidenceCategory;
  /** 短標題（道具名） */
  titleShort: string;
  /** 可寫進報告的說法（中性、可交出去） */
  reportLine: string;
  /** KK 私下註解（冷硬、帶刺） */
  kkComment: string;
}

export interface Ch1TimelineEvent {
  id: string;
  /** 一句話描述（避免只有時間） */
  label: string;
}

export interface Ch1ReportEvidenceConfig {
  /** 6 張證據卡，玩家選 3 張需涵蓋三類各至少 1 */
  evidenceCards: Ch1EvidenceCard[];
  /** 選錯類別時的提示（不說「錯」，只說缺哪種支點） */
  missingCategoryHints: Record<Ch1EvidenceCategory, string>;
}

export interface Ch1ReportTimelineConfig {
  /** 5 張事件卡，依正確順序排列 */
  events: Ch1TimelineEvent[];
  /** 正確順序的 event id 陣列 */
  correctOrder: string[];
  /** 錯誤回饋 2～3 種（KK 吐槽） */
  errorMessages: string[];
}

/** 版本深度：標準版 + 可補一句選項（含 none） */
export interface Ch1ReportVersionConfig {
  playerLineOptions: { id: string; text: string }[];
}

/** 態度宣言四選一 */
export interface Ch1AttitudeChoice {
  id: string;
  text: string;
  insightTarget: 'procedure_insight' | 'human_insight' | 'evidence_insight';
  insightDelta: number;
  insightTarget2?: 'procedure_insight' | 'human_insight' | 'evidence_insight';
  insightDelta2?: number;
}

export interface Ch1ReportAttitudeConfig {
  choices: Ch1AttitudeChoice[];
  closingInferenceByDimension: {
    procedure_insight: string;
    human_insight: string;
    evidence_insight: string;
  };
}

export interface Ch1ReportConfig {
  evidence: Ch1ReportEvidenceConfig;
  timeline: Ch1ReportTimelineConfig;
  version: Ch1ReportVersionConfig;
  attitude: Ch1ReportAttitudeConfig;
}

/** 驗證用：itemId -> category */
export const CH1_EVIDENCE_CATEGORIES: Record<string, Ch1EvidenceCategory> = {
  item_ticket_stub: 'TimeAnchor',
  item_schedule_modified: 'TimeAnchor',
  item_light_control_note: 'ProcessAnchor',
  item_projector_notes: 'ProcessAnchor',
  item_black_plastic_fragment: 'PhysicalTrace',
  item_cleaning_note: 'PhysicalTrace',
};

export const ch1ReportConfig: Ch1ReportConfig = {
  evidence: {
    evidenceCards: [
      {
        itemId: 'item_ticket_stub',
        category: 'TimeAnchor',
        titleShort: '電影票根',
        reportLine: '座位 H 排 12 號，場次 22:40，與死亡時間及場次吻合。',
        kkComment: '票根不會說謊，會說謊的是排程表。',
      },
      {
        itemId: 'item_schedule_modified',
        category: 'TimeAnchor',
        titleShort: '播映時間表（塗改）',
        reportLine: '亮燈時間遭塗改，延後約三分鐘，與案發時間窗口相符。',
        kkComment: '改表的人知道那三分鐘值多少。',
      },
      {
        itemId: 'item_light_control_note',
        category: 'ProcessAnchor',
        titleShort: '燈控紀錄',
        reportLine: '當日燈控採手動模式，需有人親自操作，具備接觸權限者即可決定亮燈時點。',
        kkComment: '流程這次站在兇手那邊。',
      },
      {
        itemId: 'item_projector_notes',
        category: 'ProcessAnchor',
        titleShort: '放映員的筆記',
        reportLine: '便條記載「燈不用急著開」等口頭指示，未署名。',
        kkComment: '有人說，有人做，報告裡只會剩下「疏失」。',
      },
      {
        itemId: 'item_black_plastic_fragment',
        category: 'PhysicalTrace',
        titleShort: '黑色塑膠碎片',
        reportLine: '洗手台下方採得，邊緣不規則，疑似手套殘留，位置隱蔽。',
        kkComment: '急著乾淨的人，多半有東西不能留。',
      },
      {
        itemId: 'item_cleaning_note',
        category: 'PhysicalTrace',
        titleShort: '清潔備忘',
        reportLine: '廁所區域垃圾桶被刻意清空，與常態清潔節奏不符。',
        kkComment: '這種「乾淨」本身就很可疑。',
      },
    ],
    missingCategoryHints: {
      TimeAnchor: '你還缺一種能寫進報告的支點：時間。',
      ProcessAnchor: '你還缺一種能寫進報告的支點：權限或流程。',
      PhysicalTrace: '你還缺一種能寫進報告的支點：殘留或現場痕跡。',
    },
  },
  timeline: {
    events: [
      { id: 'T1_movie_start_2240', label: '22:40 電影開演' },
      { id: 'T2_normal_lights_0015', label: '00:15 原訂散場亮燈（排程表）' },
      { id: 'T3_modified_lights_0018', label: '00:18 實際亮燈（延後約三分鐘）' },
      { id: 'T4_cctv_shadow_001630', label: '00:16～00:30 監視器陰影區無有效畫面' },
      { id: 'T5_call_0039', label: '00:39 報案電話' },
    ],
    correctOrder: [
      'T1_movie_start_2240',
      'T2_normal_lights_0015',
      'T3_modified_lights_0018',
      'T4_cctv_shadow_001630',
      'T5_call_0039',
    ],
    errorMessages: [
      '時間線對不上，再排一次。',
      '順序錯了——先想誰能控制燈、誰在黑暗裡。',
      '首尾可以固定：開演、報案。中間三張再想想。',
    ],
  },
  version: {
    playerLineOptions: [
      { id: 'none', text: '先不用，就照你寫的版本。' },
      {
        id: 'ch1_summary_flow',
        text: '燈不是自然晚，是被人改過。表格、手動模式、口頭指示……流程這次站在兇手那邊。',
      },
      {
        id: 'ch1_summary_human',
        text: '我想知道誰在遮蔽，遮蔽的原因。',
      },
      {
        id: 'ch1_summary_evidence',
        text: '現場乾淨得太刻意。有人花力氣把痕跡擦掉，卻忘了碎片比血跡難處理。',
      },
      {
        id: 'ch1_extra_report',
        text: '至少寫進去：這樣的燈光調整與清場節奏，未來若不被檢討，仍可能致人於死。',
      },
    ],
  },
  attitude: {
    choices: [
      {
        id: 'ch1_attitude_procedure',
        text: '「我會要求官方做全面稽核。」',
        insightTarget: 'procedure_insight',
        insightDelta: 1,
      },
      {
        id: 'ch1_attitude_evidence',
        text: '「我先不驚動體系，先把動線與權限畫出來。」',
        insightTarget: 'evidence_insight',
        insightDelta: 1,
      },
      {
        id: 'ch1_attitude_human',
        text: '「我想知道誰在遮蔽，遮蔽的原因。」',
        insightTarget: 'human_insight',
        insightDelta: 1,
      },
      {
        id: 'ch1_attitude_both',
        text: '「我兩邊都要：上報，但先留底。」',
        insightTarget: 'procedure_insight',
        insightDelta: 1,
        insightTarget2: 'evidence_insight',
        insightDelta2: 1,
      },
    ],
    closingInferenceByDimension: {
      procedure_insight:
        '兇手不是在黑暗裡殺人，他是在規定的黑暗裡殺人。',
      human_insight:
        '他怕的不是兇手，是上面那張看不見的臉。恐懼會替兇手擦地板。',
      evidence_insight:
        '官腔很滑，但官腔擋不住痕跡。找一個他沒想到的小東西，他就會破。',
    },
  },
};
