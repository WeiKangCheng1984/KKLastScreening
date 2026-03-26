/**
 * 第三章：整理版 log vs 機房殘留 — 方案 B＋C
 * B：同一操作帳號（高文傑）在城市影城／光芒影城短時間內成對出現，整理版卻無法追「從哪進來」。
 * C：事件序號不連續、插件批次／Session 編號跳躍，暗示中間紀錄或進入路徑被裁掉。
 * 通關：仍為還原被刪欄位標題（操作／來源／IP 三格字塊）。
 */

export interface LogCompareToken {
  id: string;
  text: string;
}

/** 正解：三格字塊 id 由左而右 */
export const ch3LogCompareCorrectSequence: readonly [string, string, string] = [
  'lc_frag_op',
  'lc_frag_src',
  'lc_frag_ip',
];

export const ch3LogCompareTokens: LogCompareToken[] = [
  { id: 'lc_frag_op', text: '操作' },
  { id: 'lc_frag_src', text: '來源' },
  { id: 'lc_frag_ip', text: 'IP' },
  { id: 'lc_frag_over', text: '覆寫' },
  { id: 'lc_frag_prev', text: '前值' },
];

/** 整理版：只保留「好看懂」的三欄，列印時整欄裁掉；列數也比機房少 */
export const ch3LogCompareOrganizedTable = {
  title: '張景衡整理版（對外節錄）',
  headers: ['時間', '操作員', '結果'] as const,
  missingColumnLabel: '（此欄未列入對外節錄）',
  /** 精簡三列，敘事乾淨；讀不出跨館與進入路徑 */
  rows: [
    ['22:41', '高文傑', '照明相關覆寫（已結案敘述）'],
    ['22:54', '高文傑', '排程調整（單館結論）'],
    ['23:15', '高文傑', '維護帳號切回一般模式'],
  ],
} as const;

/**
 * 機房殘留：七條操作痕（高文傑為主體），雙館交錯；序號與批次刻意不連續。
 * eventSeq：事件流水號（跳號）；batchSession：插件批次／session（C）
 */
export interface Ch3RawLogRow {
  id: string;
  eventSeq: string;
  batchSession: string;
  time: string;
  venue: string;
  venueCode: 'W' | 'R';
  operator: string;
  actionSummary: string;
}

export const ch3LogCompareRawRows: Ch3RawLogRow[] = [
  {
    id: 'raw_1',
    eventSeq: 'EVT-1041',
    batchSession: 'PLG-7.2.1 / sess·A8',
    time: '22:41',
    venue: '城市影城',
    venueCode: 'W',
    operator: '高文傑（操作員）',
    actionSummary: '手動覆寫：散場延後照明（本機面板）',
  },
  {
    id: 'raw_2',
    eventSeq: 'EVT-1043',
    batchSession: 'PLG-7.2.1 / sess·A8',
    time: '22:43',
    venue: '光芒影城',
    venueCode: 'R',
    operator: '高文傑（同帳號）',
    actionSummary: '插件版本序列確認→與 W 幾乎同秒跳版',
  },
  {
    id: 'raw_3',
    eventSeq: 'EVT-1047',
    batchSession: 'PLG-7.2.4',
    time: '22:51',
    venue: '城市影城',
    venueCode: 'W',
    operator: '高文傑',
    actionSummary: '區域排程：節能→手動（覆寫前後值成對）',
  },
  {
    id: 'raw_4',
    eventSeq: 'EVT-1052',
    batchSession: 'PLG-7.2.4',
    time: '22:54',
    venue: '光芒影城',
    venueCode: 'R',
    operator: '高文傑',
    actionSummary: '遠端推送觸發：散場前切換（節點與 W 同子網段）',
  },
  {
    id: 'raw_5',
    eventSeq: 'EVT-1056',
    batchSession: 'PLG-7.3.0',
    time: '23:02',
    venue: '城市影城',
    venueCode: 'W',
    operator: '高文傑',
    actionSummary: '失敗登入重試×2（來源欄在殘留邊角可見「192…」）',
  },
  {
    id: 'raw_6',
    eventSeq: 'EVT-1061',
    batchSession: 'PLG-7.3.0',
    time: '23:08',
    venue: '光芒影城',
    venueCode: 'R',
    operator: '高文傑',
    actionSummary: '維護通道審核通過（與 W 共用維護序號跳號區間）',
  },
  {
    id: 'raw_7',
    eventSeq: 'EVT-1068',
    batchSession: 'PLG-7.3.2 / sess·B1',
    time: '23:15',
    venue: '城市影城',
    venueCode: 'W',
    operator: '高文傑',
    actionSummary: '帳號切回一般模式；若無「操作來源」無法判本機或遠端',
  },
];

/** 序號跳號說明（給玩家推理用，不直接寫答案） */
export const ch3LogCompareSeqGapNote =
  '事件序號並非連號（1041→1043→1047…），中間缺號對應到未列印／被合併的列；插件批次 PLG-7.2.x 與 7.3.x 交錯，代表不是單一路徑進機。';

/** 雙館對照提示（B） */
export const ch3LogCompareCrossVenueNote =
  '同一帳號「高文傑」在短時間內於城市（W）與光芒（R）交替出現；沒有「從哪裡進來」欄，就只能寫成「他有操作」，寫不成「他從哪條線跨館」。';

export const ch3LogCompareRawResidueBullets: string[] = [
  ch3LogCompareCrossVenueNote,
  ch3LogCompareSeqGapNote,
  '顧乃謙手寫：沒有操作來源／節點欄，本機與遠端無法分流；整理版把故事收斂成「單館結論」。',
  '紙邊殘墨可辨：「…源…192…節點…」——拼回欄名才知道要問誰、問哪一條線。',
];

export const ch3LogCompareWrongMessage =
  '不對。沒有「操作／來源／IP」這條欄名，你就無法把高文傑在 W 與 R 的成對紀錄，接回同一條進線證據。';

export const ch3LogComparePanelIntro =
  '下方是機房撈出的七條痕跡：高文傑帳號、雙館交錯、序號與批次都不連續——這正是「缺欄」會害你問錯人的原因。對照張景衡的節錄後，把被裁掉的欄位標題用三格字塊還原。';

/** 三格還原正確後、關閉面板前顯示 */
export const ch3LogCompareSuccessTitle = '欄位還原完成';

export const ch3LogCompareSuccessMessage =
  '「操作／來源／IP」對上了——沒有這條欄名，就接不回高文傑在 W 與 R 的成對進線。';

/** 成功態主按鈕（再呼叫 onSolved） */
export const ch3LogCompareSuccessContinueLabel = '繼續';

/** 機房表表頭（欄位盡量精簡以利手機橫向捲動） */
export const ch3LogCompareRawTableHeaders = [
  '事件序號',
  '批次／Session',
  '時間',
  '館別',
  '操作／帳號',
  '動作摘要',
] as const;
