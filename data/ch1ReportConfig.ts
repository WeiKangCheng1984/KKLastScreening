/**
 * 第一章報告編輯器專用設定（證據桌、時間線、版本深度、態度宣言）
 * 與 reasoningByChapter.ch1.police 並存：police 提供 outroStandard / outroPlayerLines，此檔提供步驟結構與驗證規則。
 */
import type { TwoBlankFillConfig } from '@/components/FloatingFillBlankCore';
import { ch1AttitudeFillBlanks } from './ch1AttitudeFillBlanks';

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

/** 態度宣言：詞組填空用辭庫分類（三色） */
export type Ch1AttitudeWordCategory = 'procedure' | 'evidence' | 'human';

/** 態度宣言：辭庫單一詞彙 */
export interface Ch1AttitudeWord {
  id: string;
  text: string;
  category: Ch1AttitudeWordCategory;
}

/** 態度宣言：語句結構中的一個空格 */
export interface Ch1AttitudePhraseSlot {
  slotId: string;
  /** 正確答案（可多個同義） */
  correctWordIds: string[];
  /** 嚴肅但錯的答案，也算過關 */
  acceptableWordIds?: string[];
}

/** 態度宣言：一句固定結構（含多個空格） */
export interface Ch1AttitudePhraseStructure {
  id: string;
  /** 顯示用模板，空格以 __0__ __1__ 表示，依序對應 slots */
  template: string;
  slots: Ch1AttitudePhraseSlot[];
  /** 本句候選詞彙 15～18 個（僅顯示這些詞供填空），未填時則顯示全辭庫 */
  candidateWordIds?: string[];
}

/** 態度宣言：詞組填空謎題（六句分次呈現、詞庫在下方） */
export interface Ch1AttitudePhrasePuzzleConfig {
  structures: Ch1AttitudePhraseStructure[];
  wordBank: Ch1AttitudeWord[];
}

export interface Ch1ReportAttitudeConfig {
  /** 雙容器（警用報告封套、KK 私人備忘錄），詞組填空啟用時不用 */
  attitudeContainers: Ch1AttitudeContainer[];
  /** 4 張可拖曳內容卡（詞組填空啟用時不用） */
  attitudeContentCards: Ch1AttitudeChoice[];
  /** @deprecated 沿用 choices 供元件相容 */
  choices: Ch1AttitudeChoice[];
  /** 必須放進 KK 私人備忘錄的內容卡 id（詞組填空啟用時不用） */
  requireInMemoCardId?: string;
  /** 詞組填空：六句分次呈現，正確或嚴肅但錯皆可過關（若啟用 attitudeFillBlanks 則改為五題雙格填空） */
  phrasePuzzle?: Ch1AttitudePhrasePuzzleConfig;
  /** 五題雙格浮動填空（與 ReportFillBlank 相同呈現模組），須正確填寫才能過關；有值時取代 phrasePuzzle / 拖曳 */
  attitudeFillBlanks?: TwoBlankFillConfig[];
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

/**
 * 第一章道具精簡：僅 2 件進背包，其餘 4 項為「檢視即發現」。
 * 證據卡解鎖條件 = 背包擁有該 item  OR  對應發現 flag 為 true。
 * 若 itemId 不在本表，表示解鎖只看背包（item_ticket_stub, item_black_plastic_fragment）。
 */
export const CH1_ITEM_ID_TO_DISCOVER_FLAG: Record<string, string> = {
  item_schedule_modified: 'schedule_modified_found',
  item_light_control_note: 'clue_manual_light_control',
  item_projector_notes: 'projector_notes_found',
  item_cleaning_note: 'clue_clean_trash',
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
    phrasePuzzle: {
      structures: [
        {
          id: 'att_s2',
          template: '誰能__0__、誰在__1__，我先把__2__理出來。',
          slots: [
            { slotId: 's2_0', correctWordIds: ['att_kongdeng'] },
            { slotId: 's2_1', correctWordIds: ['att_heianli'], acceptableWordIds: ['att_mangqu'] },
            { slotId: 's2_2', correctWordIds: ['att_dongxian'] },
          ],
          candidateWordIds: [
            'att_kongdeng', 'att_heianli', 'att_dongxian', 'att_pengdeng', 'att_guandeng', 'att_mangqu',
            'att_chixiaoye', 'att_maixiaoye', 'att_cesuoli', 'att_jianshiqi', 'att_paichengbao',
            'att_yigeyanshen', 'att_caodiban', 'att_baomihuaji', 'att_piaogen', 'att_koutouzhishi',
            'att_liucheng', 'att_biandangxie', 'att_liangdengshijian', 'att_kongdang',
          ],
        },
        {
          id: 'att_s3',
          template: '我想知道是誰在__0__。__1__。',
          slots: [
            { slotId: 's3_0', correctWordIds: ['att_tixiongshou_shouwei'], acceptableWordIds: ['att_banxiongshou_caodiban', 'att_caodiban'] },
            { slotId: 's3_1', correctWordIds: ['att_kongju_bidao'] },
          ],
          candidateWordIds: [
            'att_tixiongshou_shouwei', 'att_kongju_bidao', 'att_banxiongshou_caodiban', 'att_caodiban', 'att_chenmo_bidao',
            'att_baomihua', 'att_biandangxie', 'att_chixiaoye', 'att_maixiaoye', 'att_yigeyanshen', 'att_biandang',
            'att_xiaodongxi', 'att_guanqiang', 'att_henji', 'att_shushi', 'att_liucheng', 'att_piaogen', 'att_jianshiqi',
          ],
        },
        {
          id: 'att_s5',
          template: '__0__遭塗改，__1__反而替兇手留出了__2__。',
          slots: [
            { slotId: 's5_0', correctWordIds: ['att_liangdengshijian'], acceptableWordIds: ['att_paichengbao'] },
            { slotId: 's5_1', correctWordIds: ['att_liucheng'], acceptableWordIds: ['att_shoudongmoshi'] },
            { slotId: 's5_2', correctWordIds: ['att_kongdang'] },
          ],
          candidateWordIds: [
            'att_liangdengshijian', 'att_liucheng', 'att_kongdang', 'att_paichengbao', 'att_shoudongmoshi', 'att_boyingshijian', 'att_shushi',
            'att_pengdeng', 'att_koutouzhishi', 'att_jianshiqi', 'att_baomihuaji', 'att_piaogen', 'att_heianli',
            'att_biandangxie', 'att_guanqiang', 'att_henji', 'att_xiaodongxi',
          ],
        },
        {
          id: 'att_s6',
          template: '現場__0__，有人把__1__擦掉，但__2__卻沒有帶走。',
          slots: [
            { slotId: 's6_0', correctWordIds: ['att_ganjing_tayikeyi'], acceptableWordIds: ['att_ganjing_defaliang'] },
            { slotId: 's6_1', correctWordIds: ['att_henji'], acceptableWordIds: ['att_jizheng', 'att_zhiwen'] },
            { slotId: 's6_2', correctWordIds: ['att_suipian'], acceptableWordIds: ['att_jizheng', 'att_maofa'] },
          ],
          candidateWordIds: [
            'att_ganjing_tayikeyi', 'att_ganjing_defaliang', 'att_henji', 'att_suipian', 'att_jizheng', 'att_zhiwen', 'att_maofa',
            'att_guanqiang', 'att_xiaodongxi', 'att_jianshiqi', 'att_piaogen', 'att_biandangxie', 'att_baomihua', 'att_caodiban',
            'att_yigeyanshen', 'att_pozhan', 'att_jiekou',
          ],
        },
        {
          id: 'att_s7',
          template: '亮燈不是自然延後，而是人為調整，__0__與__1__都可能影響亮燈時點。',
          slots: [
            { slotId: 's7_0', correctWordIds: ['att_shoudongmoshi'], acceptableWordIds: ['att_liucheng'] },
            { slotId: 's7_1', correctWordIds: ['att_koutouzhishi'] },
          ],
          candidateWordIds: [
            'att_shoudongmoshi', 'att_koutouzhishi', 'att_liucheng', 'att_yigebanniu', 'att_yijuhua',
            'att_paichengbao', 'att_pengdeng', 'att_liangdengshijian', 'att_jianshiqi', 'att_yigeyanshen', 'att_biandang',
            'att_baomihuaji', 'att_piaogen', 'att_shushi', 'att_guanqiang', 'att_henji', 'att_xiaodongxi',
          ],
        },
        {
          id: 'att_s8',
          template: '__0__的官腔很滑，但__1__會留下來，找一個他沒想到的__2__他就會破。',
          slots: [
            { slotId: 's8_0', correctWordIds: ['att_linfuli'] },
            { slotId: 's8_1', correctWordIds: ['att_henji'], acceptableWordIds: ['att_jizheng'] },
            { slotId: 's8_2', correctWordIds: ['att_xiaodongxi'], acceptableWordIds: ['att_babing'] },
          ],
          candidateWordIds: [
            'att_linfuli', 'att_guanqiang', 'att_henji', 'att_xiaodongxi', 'att_jiekou', 'att_jizheng', 'att_pozhan', 'att_suipian', 'att_babing',
            'att_shushi', 'att_yijuhua', 'att_jianshiqi', 'att_piaogen', 'att_biandangxie', 'att_baomihua', 'att_liucheng',
            'att_koutouzhishi', 'att_yigeyanshen',
          ],
        },
      ],
      wordBank: [
        { id: 'att_pengdeng', text: '碰燈', category: 'procedure' },
        { id: 'att_kongdeng', text: '控燈', category: 'procedure' },
        { id: 'att_dongxian', text: '動線', category: 'procedure' },
        { id: 'att_liangdengshijian', text: '亮燈時間', category: 'procedure' },
        { id: 'att_liucheng', text: '流程', category: 'procedure' },
        { id: 'att_shoudongmoshi', text: '手動模式', category: 'procedure' },
        { id: 'att_koutouzhishi', text: '口頭指示', category: 'procedure' },
        { id: 'att_paichengbao', text: '排程表', category: 'procedure' },
        { id: 'att_baomihuaji', text: '爆米花機', category: 'procedure' },
        { id: 'att_guandeng', text: '關燈', category: 'procedure' },
        { id: 'att_boyingshijian', text: '播映時間', category: 'procedure' },
        { id: 'att_shushi', text: '疏失', category: 'procedure' },
        { id: 'att_yigebanniu', text: '一個按鈕', category: 'procedure' },
        { id: 'att_kongdang', text: '空檔', category: 'procedure' },
        { id: 'att_heianli', text: '黑暗裡', category: 'evidence' },
        { id: 'att_ganjing_tayikeyi', text: '乾淨得太刻意', category: 'evidence' },
        { id: 'att_henji', text: '痕跡', category: 'evidence' },
        { id: 'att_suipian', text: '碎片', category: 'evidence' },
        { id: 'att_guanqiang', text: '官腔', category: 'evidence' },
        { id: 'att_xiaodongxi', text: '小東西', category: 'evidence' },
        { id: 'att_jianshiqi', text: '監視器', category: 'evidence' },
        { id: 'att_piaogen', text: '票根', category: 'evidence' },
        { id: 'att_mangqu', text: '盲區', category: 'evidence' },
        { id: 'att_ganjing_defaliang', text: '乾淨得發亮', category: 'evidence' },
        { id: 'att_jizheng', text: '跡證', category: 'evidence' },
        { id: 'att_zhiwen', text: '指紋', category: 'evidence' },
        { id: 'att_maofa', text: '毛髮', category: 'evidence' },
        { id: 'att_jiekou', text: '藉口', category: 'evidence' },
        { id: 'att_pozhan', text: '破綻', category: 'evidence' },
        { id: 'att_banxiongshou_caodiban', text: '幫兇手擦地板', category: 'human' },
        { id: 'att_kongju_bidao', text: '恐懼比刀子還管用', category: 'human' },
        { id: 'att_baomihua', text: '爆米花', category: 'human' },
        { id: 'att_biandangxie', text: '便當屑', category: 'human' },
        { id: 'att_caodiban', text: '擦地板', category: 'human' },
        { id: 'att_chixiaoye', text: '吃宵夜', category: 'human' },
        { id: 'att_maixiaoye', text: '買宵夜', category: 'human' },
        { id: 'att_cesuoli', text: '廁所裡', category: 'human' },
        { id: 'att_yigeyanshen', text: '一個眼神', category: 'human' },
        { id: 'att_biandang', text: '便當', category: 'human' },
        { id: 'att_tixiongshou_shouwei', text: '替兇手收尾', category: 'human' },
        { id: 'att_chenmo_bidao', text: '沉默比刀子還可怕', category: 'human' },
        { id: 'att_yijuhua', text: '一句話', category: 'human' },
        { id: 'att_babing', text: '把柄', category: 'human' },
        { id: 'att_linfuli', text: '林副理', category: 'human' },
      ],
    },
    /** 五題雙格填空（與 ReportFillBlank 相同呈現），取代原詞組填空／拖曳 */
    attitudeFillBlanks: ch1AttitudeFillBlanks,
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
