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
  /** 報告用證據槽位數（預設 3） */
  evidenceSlots?: { count: number };
}

export interface Ch1ReportTimelineConfig {
  /** 5 張事件卡，依正確順序排列（保留供參考） */
  events: Ch1TimelineEvent[];
  /** 正確順序的 event id 陣列 */
  correctOrder: string[];
  /** 錯誤回饋 2～3 種（KK 吐槽） */
  errorMessages: string[];
  /** 案發時間區間（通過條件：撥鈕選中時間落在此區間內，單位：當日 00:00 起算分鐘） */
  crimeTimeRange: { startMinutes: number; endMinutes: number };
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

/** 態度宣言：可拖入的容器（報告封套 / KK 備忘） */
export interface Ch1AttitudeContainer {
  id: string;
  label: string;
}

export interface Ch1ReportAttitudeConfig {
  /** 雙容器（警用報告封套、KK 私人備忘錄） */
  attitudeContainers: Ch1AttitudeContainer[];
  /** 4 張可拖曳內容卡（結構同 Ch1AttitudeChoice） */
  attitudeContentCards: Ch1AttitudeChoice[];
  /** @deprecated 沿用 choices 供元件相容，與 attitudeContentCards 同源 */
  choices: Ch1AttitudeChoice[];
  /** 必須放進 KK 私人備忘錄的內容卡 id（例如留底那句） */
  requireInMemoCardId?: string;
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
    evidenceSlots: { count: 3 },
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
    crimeTimeRange: { startMinutes: 14, endMinutes: 17 },
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
    attitudeContainers: [
      { id: 'ch1_report_envelope', label: '警用報告封套' },
      { id: 'ch1_kk_memo', label: 'KK 私人備忘錄' },
    ],
    attitudeContentCards: [
      {
        id: 'ch1_attitude_procedure',
        text: '「體制要查就查到底。別讓他們用『疏失』兩個字收工。」',
        insightTarget: 'procedure_insight',
        insightDelta: 1,
      },
      {
        id: 'ch1_attitude_evidence',
        text: '「先別打草驚蛇。誰能碰燈、誰在黑暗裡，我先畫出來再說。」',
        insightTarget: 'evidence_insight',
        insightDelta: 1,
      },
      {
        id: 'ch1_attitude_human',
        text: '「我想知道是誰在幫兇手擦地板。恐懼比刀子還好使。」',
        insightTarget: 'human_insight',
        insightDelta: 1,
      },
      {
        id: 'ch1_attitude_both',
        text: '「上報歸上報，我自己的備忘可不會只寫『疏失』。兩邊都留。」',
        insightTarget: 'procedure_insight',
        insightDelta: 1,
        insightTarget2: 'evidence_insight',
        insightDelta2: 1,
      },
    ],
    choices: [
      {
        id: 'ch1_attitude_procedure',
        text: '「體制要查就查到底。別讓他們用『疏失』兩個字收工。」',
        insightTarget: 'procedure_insight',
        insightDelta: 1,
      },
      {
        id: 'ch1_attitude_evidence',
        text: '「先別打草驚蛇。誰能碰燈、誰在黑暗裡，我先畫出來再說。」',
        insightTarget: 'evidence_insight',
        insightDelta: 1,
      },
      {
        id: 'ch1_attitude_human',
        text: '「我想知道是誰在幫兇手擦地板。恐懼比刀子還好使。」',
        insightTarget: 'human_insight',
        insightDelta: 1,
      },
      {
        id: 'ch1_attitude_both',
        text: '「上報歸上報，我自己的備忘可不會只寫『疏失』。兩邊都留。」',
        insightTarget: 'procedure_insight',
        insightDelta: 1,
        insightTarget2: 'evidence_insight',
        insightDelta2: 1,
      },
    ],
    requireInMemoCardId: 'ch1_attitude_both',
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
