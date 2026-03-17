'use client';

import { useState, useMemo, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, FileText, Clock, Layers, MessageSquare, Lock } from 'lucide-react';
import OverlayCard from '@/components/OverlayCard';
import ReportFillBlank from '@/components/ReportFillBlank';
import type { TwoBlankFillConfig } from '@/components/FloatingFillBlankCore';
import type { GameState, Effect, DialogChoice } from '@/types/game';

type Ch1EvidenceCategory = 'TimeAnchor' | 'ProcessAnchor' | 'PhysicalTrace';

type Ch1AttitudeWordCategory = 'procedure' | 'evidence' | 'human';

interface Ch1EvidenceCard {
  itemId: string;
  category: Ch1EvidenceCategory;
  titleShort: string;
  reportLine: string;
  kkComment: string;
}

interface Ch1TimelineEvent {
  id: string;
  label: string;
}

interface Ch1ReportEvidenceConfig {
  evidenceCards: Ch1EvidenceCard[];
  missingCategoryHints: Record<Ch1EvidenceCategory, string>;
  evidenceSlots?: { count: number };
}

interface Ch1ReportTimelineConfig {
  events: Ch1TimelineEvent[];
  correctOrder: string[];
  errorMessages: string[];
  crimeTimeRange: { startMinutes: number; endMinutes: number };
}

interface Ch1ReportVersionConfig {
  playerLineOptions: { id: string; text: string }[];
}

interface Ch1AttitudeChoice {
  id: string;
  text: string;
  insightTarget: 'procedure_insight' | 'human_insight' | 'evidence_insight';
  insightDelta: number;
  insightTarget2?: 'procedure_insight' | 'human_insight' | 'evidence_insight';
  insightDelta2?: number;
}

interface Ch1AttitudeContainer {
  id: string;
  label: string;
}

interface Ch1AttitudeWord {
  id: string;
  text: string;
  category: Ch1AttitudeWordCategory;
}

interface Ch1AttitudePhraseSlot {
  slotId: string;
  correctWordIds: string[];
  acceptableWordIds?: string[];
}

interface Ch1AttitudePhraseStructure {
  id: string;
  template: string;
  slots: Ch1AttitudePhraseSlot[];
  candidateWordIds?: string[];
}

interface Ch1AttitudePhrasePuzzleConfig {
  structures: Ch1AttitudePhraseStructure[];
  wordBank: Ch1AttitudeWord[];
}

interface Ch1ReportAttitudeConfig {
  attitudeContainers: Ch1AttitudeContainer[];
  attitudeContentCards: Ch1AttitudeChoice[];
  choices: Ch1AttitudeChoice[];
  requireInMemoCardId?: string;
  phrasePuzzle?: Ch1AttitudePhrasePuzzleConfig;
  attitudeFillBlanks?: TwoBlankFillConfig[];
  closingInferenceByDimension: {
    procedure_insight: string;
    human_insight: string;
    evidence_insight: string;
  };
}

interface Ch1ReportConfig {
  evidence: Ch1ReportEvidenceConfig;
  timeline: Ch1ReportTimelineConfig;
  version: Ch1ReportVersionConfig;
  attitude: Ch1ReportAttitudeConfig;
}

const CH1_EVIDENCE_CATEGORIES: Record<string, Ch1EvidenceCategory> = {
  item_ticket_stub: 'TimeAnchor',
  item_schedule_modified: 'TimeAnchor',
  item_light_control_note: 'ProcessAnchor',
  item_projector_notes: 'ProcessAnchor',
  item_black_plastic_fragment: 'PhysicalTrace',
  item_cleaning_note: 'PhysicalTrace',
};

const CH1_ITEM_ID_TO_DISCOVER_FLAG: Record<string, string> = {
  item_schedule_modified: 'schedule_modified_found',
  item_light_control_note: 'clue_manual_light_control',
  item_projector_notes: 'projector_notes_found',
  item_cleaning_note: 'clue_clean_trash',
};

const ch1AttitudeFillBlanks: TwoBlankFillConfig[] = [
  {
    id: 'ch1_att_q1',
    sentenceParts: [
      '散場後燈沒有立刻亮起。那三分鐘的',
      '，不是疏漏，是有人刻意',
      '的。',
    ],
    blank1: {
      hintLabel: '第一格：那三分鐘是什麼？',
      options: [
        { id: 'q1_1a', label: '黑暗', fullText: '黑暗', x: 0.2, y: 0.18, rotation: -8 },
        { id: 'q1_1b', label: '空窗', fullText: '空窗', x: 0.45, y: 0.14, rotation: 6 },
        { id: 'q1_1c', label: '延遲', fullText: '延遲', x: 0.72, y: 0.2, rotation: -5 },
        { id: 'q1_1d', label: '等待', fullText: '等待', x: 0.28, y: 0.36, rotation: 10 },
        { id: 'q1_1e', label: '沉默', fullText: '沉默', x: 0.58, y: 0.32, rotation: -9 },
        { id: 'q1_1f', label: '混亂', fullText: '混亂', x: 0.82, y: 0.38, rotation: 7 },
        { id: 'q1_1g', label: '盲區', fullText: '盲區', x: 0.35, y: 0.5, rotation: -6 },
        { id: 'q1_1h', label: '緩衝', fullText: '緩衝', x: 0.65, y: 0.48, rotation: 8 },
        // ── KUSO 誤導選項 ──
        { id: 'q1_1k1', label: '上廁所時間', fullText: '上廁所時間', x: 0.18, y: 0.62, rotation: -12 },
        { id: 'q1_1k2', label: 'KK幻覺', fullText: 'KK幻覺', x: 0.5, y: 0.66, rotation: 9 },
        { id: 'q1_1k3', label: '冥王星公轉', fullText: '冥王星公轉', x: 0.78, y: 0.6, rotation: -7 },
        { id: 'q1_1k4', label: '老闆開會中', fullText: '老闆開會中', x: 0.35, y: 0.74, rotation: 11 },
      ],
      correctIds: ['q1_1b', 'q1_1g'],
      replyOnCorrect: '對。那三分鐘不是意外，是有人算好的窗口。',
      wrongRepliesByChoiceId: {
        q1_1k1: '如果每場都為上廁所多留三分鐘，我們現在查的大概是水費不是命案。',
        q1_1k2: '我做過的白日夢不少，但這筆延後是寫在排程表上，不是在我腦子裡。',
        q1_1k3: '宇宙很浪漫，但這顆燈是接電箱，不是接冥王星公轉。',
        q1_1k4: '老闆愛開長會，跟這三分鐘很合拍，但開關還是在牆上那顆。',
      },
    },
    blank2: {
      hintLabel: '第二格：有人刻意做了什麼？',
      options: [
        { id: 'q1_2a', label: '爭取', fullText: '爭取', x: 0.22, y: 0.2, rotation: -7 },
        { id: 'q1_2b', label: '製造', fullText: '製造', x: 0.5, y: 0.16, rotation: 9 },
        { id: 'q1_2c', label: '延長', fullText: '延長', x: 0.78, y: 0.22, rotation: -8 },
        { id: 'q1_2d', label: '保留', fullText: '保留', x: 0.3, y: 0.38, rotation: 6 },
        { id: 'q1_2e', label: '利用', fullText: '利用', x: 0.6, y: 0.34, rotation: -10 },
        { id: 'q1_2f', label: '安排', fullText: '安排', x: 0.85, y: 0.4, rotation: 7 },
        { id: 'q1_2g', label: '控制', fullText: '控制', x: 0.4, y: 0.52, rotation: -6 },
        { id: 'q1_2h', label: '預留', fullText: '預留', x: 0.68, y: 0.5, rotation: 8 },
        // ── KUSO 誤導選項 ──
        { id: 'q1_2k1', label: '訂外賣', fullText: '訂外賣', x: 0.2, y: 0.63, rotation: -11 },
        { id: 'q1_2k2', label: '放空摸魚', fullText: '放空摸魚', x: 0.52, y: 0.67, rotation: 8 },
        { id: 'q1_2k3', label: '伸懶腰', fullText: '伸懶腰', x: 0.8, y: 0.62, rotation: -9 },
        { id: 'q1_2k4', label: '開直播記錄', fullText: '開直播記錄', x: 0.38, y: 0.75, rotation: 13 },
      ],
      correctIds: ['q1_2c', 'q1_2f'],
      replyOnCorrect: '延長或安排黑暗的人，知道燈什麼時候會亮。',
      wrongRepliesByChoiceId: {
        q1_2k1: '要是只是訂外賣，外送員應該比兇手先上新聞。',
        q1_2k2: '放空摸魚會拖時間沒錯，但這裡的三分鐘太剛好，不像發呆。',
        q1_2k3: '伸懶腰不會寫進排程表，改亮燈時間才會。',
        q1_2k4: '開直播記錄很有紀念價值，但兇手更需要一段不被看到的空檔。',
      },
    },
    bothCorrectDialogue: {
      kk: '流程上有疏漏很方便——可如果有人刻意把黑暗延長，那三分鐘留下的就不是浪漫。',
      liu: '排程表跟燈控我們都會追。你先把報告交上來。',
    },
    wrongFallback: '再想想現場的線索：誰能決定燈什麼時候亮？那三分鐘對誰有利？（提示：別選「上廁所時間」……）',
  },
  {
    id: 'ch1_att_q2',
    sentenceParts: [
      '亮燈時間被塗改，燈控又採',
      '，代表能決定何時亮燈的，是',
      '的人。',
    ],
    blank1: {
      hintLabel: '第一格：燈控採什麼模式？',
      options: [
        { id: 'q2_1a', label: '手動', fullText: '手動', x: 0.25, y: 0.16, rotation: -9 },
        { id: 'q2_1b', label: '自動', fullText: '自動', x: 0.52, y: 0.12, rotation: 7 },
        { id: 'q2_1c', label: '遠端', fullText: '遠端', x: 0.78, y: 0.18, rotation: -6 },
        { id: 'q2_1d', label: '定時', fullText: '定時', x: 0.28, y: 0.34, rotation: 10 },
        { id: 'q2_1e', label: '節能', fullText: '節能', x: 0.58, y: 0.3, rotation: -8 },
        { id: 'q2_1f', label: '緊急', fullText: '緊急', x: 0.82, y: 0.36, rotation: 5 },
        { id: 'q2_1g', label: '排程', fullText: '排程', x: 0.38, y: 0.48, rotation: -7 },
        { id: 'q2_1h', label: '預設', fullText: '預設', x: 0.68, y: 0.46, rotation: 9 },
        // ── KUSO 誤導選項 ──
        { id: 'q2_1k1', label: '心情模式', fullText: '心情模式', x: 0.22, y: 0.62, rotation: -13 },
        { id: 'q2_1k2', label: '通靈感應', fullText: '通靈感應', x: 0.55, y: 0.66, rotation: 10 },
        { id: 'q2_1k3', label: '遙控器不見了', fullText: '遙控器不見了', x: 0.82, y: 0.61, rotation: -8 },
        { id: 'q2_1k4', label: '佛系省電', fullText: '佛系省電', x: 0.38, y: 0.74, rotation: 12 },
      ],
      correctIds: ['q2_1a'],
      replyOnCorrect: '手動模式代表：當晚有人親自碰過開關。',
      wrongRepliesByChoiceId: {
        q2_1k1: '如果燈照心情開，我們現在應該去找那份「心情表」誰簽名。',
        q2_1k2: '有人信通靈，有人信流程。這一條目前還是寫在流程上。',
        q2_1k3: '遙控器不見可以怪健忘，亮燈晚三分鐘得有人負責。',
        q2_1k4: '佛系省電聽起來很環保，但這三分鐘省得有點精準。',
      },
    },
    blank2: {
      hintLabel: '第二格：什麼樣的人能決定亮燈？',
      options: [
        { id: 'q2_2a', label: '在場', fullText: '在場', x: 0.2, y: 0.2, rotation: -8 },
        { id: 'q2_2b', label: '有權限', fullText: '有權限', x: 0.48, y: 0.15, rotation: 8 },
        { id: 'q2_2c', label: '懂設備', fullText: '懂設備', x: 0.74, y: 0.22, rotation: -5 },
        { id: 'q2_2d', label: '值夜', fullText: '值夜', x: 0.3, y: 0.36, rotation: 11 },
        { id: 'q2_2e', label: '負責', fullText: '負責', x: 0.6, y: 0.32, rotation: -9 },
        { id: 'q2_2f', label: '操作', fullText: '操作', x: 0.84, y: 0.38, rotation: 6 },
        { id: 'q2_2g', label: '知情', fullText: '知情', x: 0.35, y: 0.5, rotation: -7 },
        { id: 'q2_2h', label: '經手', fullText: '經手', x: 0.65, y: 0.48, rotation: 10 },
        // ── KUSO 誤導選項 ──
        { id: 'q2_2k1', label: '跟燈很有感情', fullText: '跟燈很有感情', x: 0.18, y: 0.63, rotation: -12 },
        { id: 'q2_2k2', label: '怕鬼不敢黑暗', fullText: '怕鬼不敢黑暗', x: 0.5, y: 0.67, rotation: 9 },
        { id: 'q2_2k3', label: '愛管閒事', fullText: '愛管閒事', x: 0.8, y: 0.62, rotation: -7 },
        { id: 'q2_2k4', label: '燈神信徒', fullText: '燈神信徒', x: 0.37, y: 0.75, rotation: 14 },
      ],
      correctIds: ['q2_2b', 'q2_2f', 'q2_2g'],
      replyOnCorrect: '有權限、能操作、或知情的人，才能把「疏失」演得像真的。',
      wrongRepliesByChoiceId: {
        q2_2k1: '跟燈很有感情可以，但真正決定開關的是那雙手。',
        q2_2k2: '怕鬼不敢黑暗的是觀眾，能決定黑不黑的是值班的人。',
        q2_2k3: '愛管閒事的人很多，能碰控制面板的只會是少數。',
        q2_2k4: '燈神信徒我們尊重，但預算裡沒有編「神明負責照明」。',
      },
    },
    bothCorrectDialogue: {
      kk: '排程表、手動模式、便條上的「燈不用急著開」——流程這次站在兇手那邊。',
      liu: '這條線我們會查。你繼續。',
    },
    wrongFallback: '回想播映室：燈控面板旁的紀錄、誰能碰那顆開關。（「燈神信徒」不在本案調查範圍內。）',
  },
  {
    id: 'ch1_att_q3',
    sentenceParts: [
      '放映員的便條寫著「燈不用急著開」——那不是',
      '，是有人透過',
      '下的指示。',
    ],
    blank1: {
      hintLabel: '第一格：那不是什麼？',
      options: [
        { id: 'q3_1a', label: '疏失', fullText: '疏失', x: 0.22, y: 0.18, rotation: -8 },
        { id: 'q3_1b', label: '建議', fullText: '建議', x: 0.5, y: 0.14, rotation: 7 },
        { id: 'q3_1c', label: '慣例', fullText: '慣例', x: 0.76, y: 0.2, rotation: -6 },
        { id: 'q3_1d', label: '筆記', fullText: '筆記', x: 0.28, y: 0.34, rotation: 10 },
        { id: 'q3_1e', label: '牢騷', fullText: '牢騷', x: 0.58, y: 0.3, rotation: -9 },
        { id: 'q3_1f', label: '提醒', fullText: '提醒', x: 0.82, y: 0.36, rotation: 5 },
        { id: 'q3_1g', label: '備忘', fullText: '備忘', x: 0.38, y: 0.48, rotation: -7 },
        { id: 'q3_1h', label: '口誤', fullText: '口誤', x: 0.66, y: 0.46, rotation: 8 },
        // ── KUSO 誤導選項 ──
        { id: 'q3_1k1', label: '愛的叮嚀', fullText: '愛的叮嚀', x: 0.2, y: 0.62, rotation: -11 },
        { id: 'q3_1k2', label: '放映員的詩', fullText: '放映員的詩', x: 0.52, y: 0.66, rotation: 8 },
        { id: 'q3_1k3', label: '情書草稿', fullText: '情書草稿', x: 0.8, y: 0.61, rotation: -10 },
        { id: 'q3_1k4', label: '月老指示', fullText: '月老指示', x: 0.36, y: 0.74, rotation: 13 },
      ],
      correctIds: ['q3_1a', 'q3_1b'],
      replyOnCorrect: '「疏失」兩個字最好用——寫進報告，就沒人追誰下的指示。建議？便條不像建議，更像掩護。',
      wrongRepliesByChoiceId: {
        q3_1k1: '如果這是愛的叮嚀，對象大概叫兇手——浪漫得有點致命。',
        q3_1k2: '放映員要寫詩可以，寫到燈不用急著開就不是文青，是案件。',
        q3_1k3: '情書會寫名字，這張連署名都不敢留，更像是在擋子彈。',
        q3_1k4: '月老管姻緣，這張便條管的是誰不用負責。',
      },
    },
    blank2: {
      hintLabel: '第二格：透過什麼下的指示？',
      options: [
        { id: 'q3_2a', label: '口頭', fullText: '口頭', x: 0.24, y: 0.16, rotation: -7 },
        { id: 'q3_2b', label: '書面', fullText: '書面', x: 0.5, y: 0.12, rotation: 9 },
        { id: 'q3_2c', label: '電話', fullText: '電話', x: 0.76, y: 0.18, rotation: -6 },
        { id: 'q3_2d', label: '簡訊', fullText: '簡訊', x: 0.28, y: 0.34, rotation: 10 },
        { id: 'q3_2e', label: '當面', fullText: '當面', x: 0.58, y: 0.3, rotation: -8 },
        { id: 'q3_2f', label: '轉達', fullText: '轉達', x: 0.82, y: 0.36, rotation: 6 },
        { id: 'q3_2g', label: '管道', fullText: '管道', x: 0.36, y: 0.48, rotation: -9 },
        { id: 'q3_2h', label: '關係', fullText: '關係', x: 0.64, y: 0.46, rotation: 7 },
        // ── KUSO 誤導選項 ──
        { id: 'q3_2k1', label: '心電感應', fullText: '心電感應', x: 0.22, y: 0.62, rotation: -12 },
        { id: 'q3_2k2', label: '用眼神傳送', fullText: '用眼神傳送', x: 0.54, y: 0.67, rotation: 9 },
        { id: 'q3_2k3', label: '夢境占卜', fullText: '夢境占卜', x: 0.82, y: 0.63, rotation: -8 },
        { id: 'q3_2k4', label: '空氣振動頻率', fullText: '空氣振動頻率', x: 0.38, y: 0.75, rotation: 15 },
      ],
      correctIds: ['q3_2a', 'q3_2e'],
      replyOnCorrect: '沒有署名、沒有紀錄的口頭或當面指示，最適合事後推給「疏失」。',
      wrongRepliesByChoiceId: {
        q3_2k1: '心電感應收不到錄音，事後也找不到誰下的命令。',
        q3_2k2: '眼神可以傳八卦，傳不了責任歸屬。',
        q3_2k3: '夢境占卜頂多當直覺，報告上還是要有人講過那句話。',
        q3_2k4: '空氣會振動沒錯，但沒有紀錄的指示最後都會被寫成「疏失」。',
      },
    },
    bothCorrectDialogue: {
      kk: '有人說、有人做，報告裡只會剩下「流程疏失」。',
      liu: '便條我們會留證。誰轉達的，繼續查。',
    },
    wrongFallback: '想想便條的性質：沒署名、沒時間，最容易被歸類成什麼？（心電感應不算有效的指示媒介……）',
  },
  {
    id: 'ch1_att_q4',
    sentenceParts: [
      '監視器裡有人在燈亮前就',
      '離開——那幾十秒的',
      '，就是兇手給自己的退路。',
    ],
    blank1: {
      hintLabel: '第一格：那個人怎麼離開？',
      options: [
        { id: 'q4_1a', label: '快速', fullText: '快速', x: 0.22, y: 0.18, rotation: -8 },
        { id: 'q4_1b', label: '匆忙', fullText: '匆忙', x: 0.48, y: 0.14, rotation: 7 },
        { id: 'q4_1c', label: '從容', fullText: '從容', x: 0.74, y: 0.2, rotation: -6 },
        { id: 'q4_1d', label: '低調', fullText: '低調', x: 0.28, y: 0.34, rotation: 10 },
        { id: 'q4_1e', label: '單獨', fullText: '單獨', x: 0.56, y: 0.3, rotation: -9 },
        { id: 'q4_1f', label: '趁黑', fullText: '趁黑', x: 0.82, y: 0.36, rotation: 5 },
        { id: 'q4_1g', label: '沿牆', fullText: '沿牆', x: 0.35, y: 0.48, rotation: -7 },
        { id: 'q4_1h', label: '回頭', fullText: '回頭', x: 0.64, y: 0.46, rotation: 8 },
        // ── KUSO 誤導選項 ──
        { id: 'q4_1k1', label: '倒退嚕', fullText: '倒退嚕', x: 0.2, y: 0.62, rotation: -13 },
        { id: 'q4_1k2', label: '翻筋斗', fullText: '翻筋斗', x: 0.52, y: 0.66, rotation: 10 },
        { id: 'q4_1k3', label: '假裝在掃地', fullText: '假裝在掃地', x: 0.8, y: 0.62, rotation: -9 },
        { id: 'q4_1k4', label: '踩滑板逃逸', fullText: '踩滑板逃逸', x: 0.38, y: 0.75, rotation: 14 },
      ],
      correctIds: ['q4_1a', 'q4_1d', 'q4_1f'],
      replyOnCorrect: '快速、低調、趁黑——在燈亮前離開的人，知道燈什麼時候會亮。',
      wrongRepliesByChoiceId: {
        q4_1k1: '要是有人倒退嚕離開現場，技術組早就把那段存成表情包了。',
        q4_1k2: '翻筋斗離開的是特技演員，不是怕被拍到的人。',
        q4_1k3: '假裝在掃地可以演得很用心，但畫面裡那個人比打掃還冷靜。',
        q4_1k4: '踩滑板逃跑很帥，可惜監視器裡的是命案，不是運動攝影機。',
      },
    },
    blank2: {
      hintLabel: '第二格：那幾十秒是什麼？',
      options: [
        { id: 'q4_2a', label: '空檔', fullText: '空檔', x: 0.2, y: 0.2, rotation: -7 },
        { id: 'q4_2b', label: '盲區', fullText: '盲區', x: 0.46, y: 0.16, rotation: 8 },
        { id: 'q4_2c', label: '緩衝', fullText: '緩衝', x: 0.72, y: 0.22, rotation: -6 },
        { id: 'q4_2d', label: '距離', fullText: '距離', x: 0.28, y: 0.36, rotation: 11 },
        { id: 'q4_2e', label: '時間', fullText: '時間', x: 0.58, y: 0.32, rotation: -9 },
        { id: 'q4_2f', label: '餘裕', fullText: '餘裕', x: 0.84, y: 0.38, rotation: 6 },
        { id: 'q4_2g', label: '掩護', fullText: '掩護', x: 0.34, y: 0.5, rotation: -8 },
        { id: 'q4_2h', label: '窗口', fullText: '窗口', x: 0.62, y: 0.48, rotation: 9 },
        // ── KUSO 誤導選項 ──
        { id: 'q4_2k1', label: '下班倒數計時', fullText: '下班倒數計時', x: 0.18, y: 0.63, rotation: -12 },
        { id: 'q4_2k2', label: '靈魂出竅', fullText: '靈魂出竅', x: 0.5, y: 0.67, rotation: 9 },
        { id: 'q4_2k3', label: '摸魚黃金時段', fullText: '摸魚黃金時段', x: 0.8, y: 0.61, rotation: -10 },
        { id: 'q4_2k4', label: '尬聊空間', fullText: '尬聊空間', x: 0.36, y: 0.76, rotation: 13 },
      ],
      correctIds: ['q4_2a', 'q4_2f', 'q4_2g'],
      replyOnCorrect: '那幾十秒的空檔、餘裕、掩護，證明他熟悉動線與時間。',
      wrongRepliesByChoiceId: {
        q4_2k1: '大家都在等下班，只有他算準了可以先消失的那幾秒。',
        q4_2k2: '靈魂出竅交給恐怖片，這裡只看誰真的踩著點離開。',
        q4_2k3: '摸魚黃金時段會拖工作，這幾秒拖的是追查時間。',
        q4_2k4: '尬聊空間可能會有，但兇手要的是「剛好看不到他」的那塊空白。',
      },
    },
    bothCorrectDialogue: {
      kk: '監視器不會說謊，只會讓人以為「沒拍到」就沒事。',
      liu: '畫面我們技術組再拉。你推論的這條我們記下了。',
    },
    wrongFallback: '回想監視器畫面：那個人離開的時機與速度代表什麼？（靈魂出竅雖然很省電，但不在法醫報告的選項裡。）',
  },
  {
    id: 'ch1_att_q5',
    sentenceParts: [
      '廁所被清得太乾淨，但洗手台下的',
      '沒被帶走——',
      '的人，總會漏掉自以為不重要的東西。',
    ],
    blank1: {
      hintLabel: '第一格：洗手台下有什麼？',
      options: [
        { id: 'q5_1a', label: '碎片', fullText: '碎片', x: 0.24, y: 0.16, rotation: -8 },
        { id: 'q5_1b', label: '痕跡', fullText: '痕跡', x: 0.5, y: 0.12, rotation: 7 },
        { id: 'q5_1c', label: '手套', fullText: '手套', x: 0.76, y: 0.18, rotation: -6 },
        { id: 'q5_1d', label: '毛髮', fullText: '毛髮', x: 0.28, y: 0.34, rotation: 10 },
        { id: 'q5_1e', label: '指紋', fullText: '指紋', x: 0.56, y: 0.3, rotation: -9 },
        { id: 'q5_1f', label: '血跡', fullText: '血跡', x: 0.82, y: 0.36, rotation: 5 },
        { id: 'q5_1g', label: '證物', fullText: '證物', x: 0.34, y: 0.48, rotation: -7 },
        { id: 'q5_1h', label: '殘留', fullText: '殘留', x: 0.64, y: 0.46, rotation: 8 },
        // ── KUSO 誤導選項 ──
        { id: 'q5_1k1', label: '命運之石', fullText: '命運之石', x: 0.22, y: 0.62, rotation: -12 },
        { id: 'q5_1k2', label: '硬幣收藏品', fullText: '硬幣收藏品', x: 0.54, y: 0.66, rotation: 9 },
        { id: 'q5_1k3', label: '貓毛（無主）', fullText: '貓毛', x: 0.82, y: 0.62, rotation: -8 },
        { id: 'q5_1k4', label: '洗碗精靈魂', fullText: '洗碗精靈魂', x: 0.38, y: 0.75, rotation: 15 },
      ],
      correctIds: ['q5_1a', 'q5_1h'],
      replyOnCorrect: '黑色塑膠碎片——或說殘留——邊緣不規則，像手套破裂時留下的。',
      wrongRepliesByChoiceId: {
        q5_1k1: '要是每塊碎片都叫命運之石，鑑識科大概得先申請加班費。',
        q5_1k2: '硬幣收藏品會放家裡，躲在洗手台下的比較像他不想被看到的東西。',
        q5_1k3: '現場真有貓的話，牠可能比兇手早被PO上網。',
        q5_1k4: '洗碗精靈魂也許很潔癖，但這塊碎片是拿去驗材質的那一種。',
      },
    },
    blank2: {
      hintLabel: '第二格：什麼樣的人會漏掉？',
      options: [
        { id: 'q5_2a', label: '擦地板', fullText: '擦地板', x: 0.22, y: 0.18, rotation: -7 },
        { id: 'q5_2b', label: '滅證', fullText: '滅證', x: 0.48, y: 0.14, rotation: 8 },
        { id: 'q5_2c', label: '清理', fullText: '清理', x: 0.74, y: 0.2, rotation: -6 },
        { id: 'q5_2d', label: '收尾', fullText: '收尾', x: 0.28, y: 0.34, rotation: 10 },
        { id: 'q5_2e', label: '掩蓋', fullText: '掩蓋', x: 0.58, y: 0.3, rotation: -9 },
        { id: 'q5_2f', label: '善後', fullText: '善後', x: 0.82, y: 0.36, rotation: 6 },
        { id: 'q5_2g', label: '毀跡', fullText: '毀跡', x: 0.36, y: 0.48, rotation: -8 },
        { id: 'q5_2h', label: '心虛', fullText: '心虛', x: 0.64, y: 0.46, rotation: 9 },
        // ── KUSO 誤導選項 ──
        { id: 'q5_2k1', label: '邊唱歌邊收尾', fullText: '邊唱歌邊收尾', x: 0.2, y: 0.63, rotation: -11 },
        { id: 'q5_2k2', label: '腦子想著便當', fullText: '腦子想著便當', x: 0.52, y: 0.67, rotation: 10 },
        { id: 'q5_2k3', label: '靈魂不在場', fullText: '靈魂不在場', x: 0.8, y: 0.62, rotation: -9 },
        { id: 'q5_2k4', label: '職業選手水準（所以不用洗）', fullText: '職業選手', x: 0.38, y: 0.76, rotation: 14 },
      ],
      correctIds: ['q5_2a', 'q5_2b', 'q5_2e', 'q5_2g'],
      replyOnCorrect: '急著把現場弄乾淨的人——管你叫擦地板、滅證、掩蓋還是毀跡——多半有東西不能留。',
      wrongRepliesByChoiceId: {
        q5_2k1: '邊唱歌邊收尾的人很多，會忘記撿碎片的通常心裡比較急。',
        q5_2k2: '腦子想著便當可以理解，問題是他想得太快，手就會漏東西。',
        q5_2k3: '靈魂不在場，手卻很認真在擦，這種人最會漏自己以為小的東西。',
        q5_2k4: '職業選手也要收尾，真專業的是不留破綻，不是不用洗。',
      },
    },
    bothCorrectDialogue: {
      kk: '這種「乾淨」本身就很可疑。碎片比血跡難處理，他忘了。',
      liu: '洗手台與清潔紀錄我們都會查。報告先交。',
    },
    wrongFallback: '回想廁所：周姊發現了什麼？清潔備忘上垃圾桶那欄寫得怎樣？（「腦子想著便當」雖然很理解，但不算法律上的犯罪動機。）',
  },
];

const ch1ReportConfig: Ch1ReportConfig = {
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
            'att_guanqiang', 'att_xiaodongxi', 'att_jianshiqi', 'att_piaogen', 'att_biandangxie', 'att_baomihuaji', 'att_caodiban',
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

export interface Ch1ReportEditorProps {
  engine: {
    getState: () => GameState;
    applyEffect: (effect: Effect) => void;
    handleDialogChoice: (choice: DialogChoice) => void;
    setReasoningComplete: (chapterId: string) => void;
  };
  onComplete: () => void;
  onClose: () => void;
}

const STEPS = [
  { id: 0, label: '證據桌', icon: FileText },
  { id: 1, label: '時間線', icon: Clock },
  { id: 2, label: '版本深度', icon: Layers },
  { id: 3, label: '態度宣言', icon: MessageSquare },
];
/** 目前只顯示時間線與態度宣言 */
const VISIBLE_STEPS = [
  { id: 1, label: '時間線', icon: Clock },
  { id: 3, label: '態度宣言', icon: MessageSquare },
];

function getMissingCategory(
  selectedIds: string[],
  categories: Record<string, Ch1EvidenceCategory>
): Ch1EvidenceCategory | null {
  const hasTime = selectedIds.some((id) => categories[id] === 'TimeAnchor');
  const hasProcess = selectedIds.some((id) => categories[id] === 'ProcessAnchor');
  const hasPhysical = selectedIds.some((id) => categories[id] === 'PhysicalTrace');
  if (!hasTime) return 'TimeAnchor';
  if (!hasProcess) return 'ProcessAnchor';
  if (!hasPhysical) return 'PhysicalTrace';
  return null;
}

/** 單一數字翻牌（0–9），翻轉時以 3D 翻下顯示新數字 */
function FlipDigit({ digit }: { digit: number }) {
  const [displayed, setDisplayed] = useState(digit);
  const [flip, setFlip] = useState(false);
  useEffect(() => {
    if (digit !== displayed && !flip) setFlip(true);
  }, [digit, displayed, flip]);

  return (
    <div
      className="relative h-14 w-11 overflow-hidden rounded-lg bg-gradient-to-b from-gray-800/90 to-gray-900/95 shadow-inner"
      style={{
        perspective: '140px',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.25)',
        border: '1px solid rgba(251,146,60,0.25)',
      }}
    >
      <m.div
        className="absolute inset-0 flex origin-bottom items-center justify-center rounded-lg font-mono text-3xl font-semibold tabular-nums tracking-tight text-orange-100"
        style={{ backfaceVisibility: 'hidden', textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
        animate={{ rotateX: flip ? -90 : 0 }}
        transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {displayed}
      </m.div>
      <m.div
        className="absolute inset-0 flex origin-top items-center justify-center rounded-lg font-mono text-3xl font-semibold tabular-nums tracking-tight text-orange-100"
        style={{ backfaceVisibility: 'hidden', rotateX: 90, textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
        animate={{ rotateX: flip ? 0 : 90 }}
        transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
        onAnimationComplete={() => {
          if (flip) {
            setDisplayed(digit);
            setFlip(false);
          }
        }}
      >
        {digit}
      </m.div>
    </div>
  );
}
/** 固定種子打亂陣列，同 session 內順序穩定 */
function shuffleStable<T extends { itemId: string }>(arr: T[]): T[] {
  const hash = (s: string) => s.split('').reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) | 0, 0);
  return [...arr].sort((a, b) => (hash(a.itemId) % 1000) - (hash(b.itemId) % 1000));
}

const PHRASE_CATEGORY_COLORS: Record<Ch1AttitudeWordCategory, string> = {
  procedure: 'amber',   // 流程/體制 橙
  evidence: 'teal',    // 證據/現場 青
  human: 'rose',       // 人/動機 玫瑰
};

export default function Ch1ReportEditor({
  engine,
  onComplete,
  onClose,
}: Ch1ReportEditorProps) {
  const [step, setStep] = useState(1);
  const [slotEvidenceIds, setSlotEvidenceIds] = useState<(string | null)[]>(() => [null, null, null]);
  const [slotUnlocked, setSlotUnlocked] = useState<boolean[]>([false, false, false]);
  const [pendingEvidenceId, setPendingEvidenceId] = useState<string | null>(null);
  const [timelineSequence, setTimelineSequence] = useState<string[]>([]);
  const [timeMinutes, setTimeMinutes] = useState(0);
  const [timeHour, setTimeHour] = useState(0);
  const [selectedPoliceNoteId, setSelectedPoliceNoteId] = useState<string | null>(null);
  const [reportContainerIds, setReportContainerIds] = useState<string[]>([]);
  const [memoContainerIds, setMemoContainerIds] = useState<string[]>([]);
  const [selectedAttitudeId, setSelectedAttitudeId] = useState<string | null>(null);
  /** 詞組填空：當前第幾句（0～5） */
  const [phraseStructureIndex, setPhraseStructureIndex] = useState(0);
  /** 詞組填空：每句每個空槽填的 wordId */
  const [phraseFills, setPhraseFills] = useState<Record<string, Record<string, string>>>({});
  /** 詞組填空：當前選中的空槽（再點詞即填入） */
  const [selectedPhraseSlot, setSelectedPhraseSlot] = useState<{ structureId: string; slotId: string } | null>(null);
  /** 五題雙格填空：當前題號（0～4 顯示 ReportFillBlank，5 表示全部完成） */
  const [attitudeFillBlankIndex, setAttitudeFillBlankIndex] = useState(0);
  const [showClosing, setShowClosing] = useState(false);
  const [evidenceError, setEvidenceError] = useState('');
  const [timelineError, setTimelineError] = useState('');
  const [timelineErrorIndex, setTimelineErrorIndex] = useState(0);
  const [attitudeError, setAttitudeError] = useState('');

  const state = engine.getState();
  const inventory = state.inventory ?? [];
  const policeConfig = undefined;
  const config = ch1ReportConfig;

  useEffect(() => {
    engine.applyEffect({
      type: 'setFlag',
      flag: 'ch1_report_evidence',
      value: config.evidence.evidenceCards.slice(0, 3).map((c) => c.itemId),
    });
    engine.applyEffect({
      type: 'setFlag',
      flag: 'ch1_police_note',
      value: 'none',
    });
  }, []);

  const attitudeFillBlanks = config.attitude.attitudeFillBlanks;
  const useAttitudeFillBlanks = Boolean(attitudeFillBlanks && attitudeFillBlanks.length >= 5);
  /** 五題填空全完成後也要顯示結尾（不依賴 useEffect 時機） */
  const showClosingView = showClosing || (useAttitudeFillBlanks && attitudeFillBlankIndex >= 5);
  useEffect(() => {
    if (!useAttitudeFillBlanks || attitudeFillBlankIndex < 5) return;
    engine.applyEffect({ type: 'setFlag', flag: 'ch1_attitude_declared', value: true });
    setSelectedAttitudeId('ch1_attitude_both');
    setShowClosing(true);
  }, [useAttitudeFillBlanks, attitudeFillBlankIndex, engine]);

  const evidenceCards = config.evidence.evidenceCards;
  const shuffledEvidenceCards = useMemo(() => shuffleStable(evidenceCards), [evidenceCards]);
  const slotCount = config.evidence.evidenceSlots?.count ?? 3;
  const flags = state.flags ?? {};
  /** 證據卡可選條件：背包擁有 或 該線索已發現（檢視時設定的 flag） */
  const canUseEvidenceCard = (itemId: string) =>
    inventory.includes(itemId) ||
    (!!CH1_ITEM_ID_TO_DISCOVER_FLAG[itemId] && !!flags[CH1_ITEM_ID_TO_DISCOVER_FLAG[itemId]]);
  const usedEvidenceIds = slotEvidenceIds.filter((id): id is string => id != null);

  const unlockSlot = (index: number) => {
    if (slotUnlocked[index]) return;
    setEvidenceError('');
    setSlotUnlocked((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  };

  const putEvidenceInSlot = (itemId: string, slotIndex: number) => {
    if (!CH1_EVIDENCE_CATEGORIES[itemId] || slotEvidenceIds[slotIndex] != null || !slotUnlocked[slotIndex]) return;
    setEvidenceError('');
    setSlotEvidenceIds((prev) => {
      const next = [...prev];
      next[slotIndex] = itemId;
      return next;
    });
    setPendingEvidenceId(null);
  };

  const removeEvidenceFromSlot = (slotIndex: number) => {
    if (slotEvidenceIds[slotIndex] == null) return;
    setEvidenceError('');
    setSlotEvidenceIds((prev) => {
      const next = [...prev];
      next[slotIndex] = null;
      return next;
    });
  };

  const handleEvidenceCardClick = (itemId: string) => {
    if (!canUseEvidenceCard(itemId) || usedEvidenceIds.includes(itemId)) return;
    if (pendingEvidenceId === itemId) {
      setPendingEvidenceId(null);
      return;
    }
    setPendingEvidenceId(itemId);
    setEvidenceError('');
  };

  const handleSlotClick = (slotIndex: number) => {
    if (!slotUnlocked[slotIndex]) {
      unlockSlot(slotIndex);
      return;
    }
    if (slotEvidenceIds[slotIndex] != null) {
      removeEvidenceFromSlot(slotIndex);
      return;
    }
    if (pendingEvidenceId != null) {
      putEvidenceInSlot(pendingEvidenceId, slotIndex);
    }
  };

  const handleEvidenceNext = () => {
    const filled = slotEvidenceIds.filter((id): id is string => id != null);
    if (filled.length !== slotCount) {
      setEvidenceError('請在三個槽位各放入一張證據。');
      return;
    }
    const missing = getMissingCategory(filled, CH1_EVIDENCE_CATEGORIES);
    if (missing) {
      setEvidenceError(config.evidence.missingCategoryHints[missing]);
      return;
    }
    engine.applyEffect({ type: 'setFlag', flag: 'ch1_report_evidence', value: filled });
    setStep(1);
    setTimelineError('');
  };

  const handleTimelineNext = () => {
    const range = config.timeline.crimeTimeRange;
    const hourOk = timeHour === 0;
    const minuteOk = timeMinutes >= range.startMinutes && timeMinutes <= range.endMinutes;
    if (!hourOk || !minuteOk) {
      const msg = config.timeline.errorMessages[timelineErrorIndex % config.timeline.errorMessages.length];
      const hh = String(timeHour).padStart(2, '0');
      const mm = String(timeMinutes).padStart(2, '0');
      setTimelineError(`${msg} 你選的是 ${hh}:${mm}。`);
      setTimelineErrorIndex((i) => i + 1);
      return;
    }
    engine.applyEffect({
      type: 'setFlag',
      flag: 'ch1_report_timeline',
      value: { type: 'crime_time', minutes: timeMinutes },
    });
    setStep(3);
    setTimelineError('');
  };

  const handleVersionNext = () => {
    engine.applyEffect({
      type: 'setFlag',
      flag: 'ch1_police_note',
      value: selectedPoliceNoteId ?? 'none',
    });
    setStep(3);
  };

  const handleAttitudeConfirm = () => {
    setAttitudeError('');
    if (reportContainerIds.length < 1) {
      setAttitudeError('請在警用報告封套中至少放入一項。');
      return;
    }
    if (memoContainerIds.length < 1) {
      setAttitudeError('請在 KK 私人備忘錄中至少放入一項。');
      return;
    }
    const requireInMemo = config.attitude.requireInMemoCardId;
    if (requireInMemo != null && !memoContainerIds.includes(requireInMemo)) {
      setAttitudeError('有一項內容必須放進 KK 的備忘裡（留底的那句）。');
      return;
    }
    const choiceId = reportContainerIds.length > 0 ? reportContainerIds[0] : memoContainerIds[0];
    const att = config.attitude.attitudeContentCards.find((c) => c.id === choiceId) ?? config.attitude.choices.find((c) => c.id === choiceId);
    if (!att) return;
    const choice: DialogChoice = {
      id: att.id,
      text: att.text,
      insightEffects: [
        { target: att.insightTarget, delta: att.insightDelta },
        ...(att.insightTarget2 && att.insightDelta2 != null
          ? [{ target: att.insightTarget2, delta: att.insightDelta2 }]
          : []),
      ],
      effects: [{ type: 'setFlag', flag: 'ch1_attitude_declared', value: true }],
    };
    engine.handleDialogChoice(choice);
    setSelectedAttitudeId(choiceId);
    setShowClosing(true);
  };

  const phrasePuzzle = config.attitude.phrasePuzzle;
  const isPhrasePuzzle = Boolean(phrasePuzzle);

  /** 檢查單一空槽填寫是否過關（正確或嚴肅但錯） */
  const isSlotPass = (structureId: string, slotId: string, wordId: string): boolean => {
    if (!phrasePuzzle) return false;
    const structure = phrasePuzzle.structures.find((s) => s.id === structureId);
    const slot = structure?.slots.find((s) => s.slotId === slotId);
    if (!slot) return false;
    const correct = slot.correctWordIds.includes(wordId);
    const acceptable = slot.acceptableWordIds?.includes(wordId) ?? false;
    return correct || acceptable;
  };

  const handlePhraseSlotClick = (structureId: string, slotId: string) => {
    setSelectedPhraseSlot((prev) =>
      prev?.structureId === structureId && prev?.slotId === slotId ? null : { structureId, slotId }
    );
    setAttitudeError('');
  };

  const handlePhraseWordClick = (wordId: string) => {
    if (!selectedPhraseSlot || !phrasePuzzle) return;
    const currentStructureFills = phraseFills[selectedPhraseSlot.structureId] ?? {};
    const usedInThisSentence = new Set<string>(Object.values(currentStructureFills));
    const currentInSlot = currentStructureFills[selectedPhraseSlot.slotId];
    if (usedInThisSentence.has(wordId) && currentInSlot !== wordId) return;
    const { structureId, slotId } = selectedPhraseSlot;
    setPhraseFills((prev) => ({
      ...prev,
      [structureId]: {
        ...(prev[structureId] ?? {}),
        [slotId]: wordId,
      },
    }));
    setSelectedPhraseSlot(null);
    setAttitudeError('');
  };

  /** 檢查單一結構（一句）是否全部過關 */
  const validateStructure = (structureId: string): { ok: boolean; message?: string } => {
    if (!phrasePuzzle) return { ok: false, message: '' };
    const structure = phrasePuzzle.structures.find((s) => s.id === structureId);
    if (!structure) return { ok: false };
    const fills = phraseFills[structureId] ?? {};
    for (const slot of structure.slots) {
      const wordId = fills[slot.slotId];
      if (!wordId) return { ok: false, message: '這段還缺一筆。' };
      if (!isSlotPass(structureId, slot.slotId, wordId)) {
        return { ok: false, message: '這樣寫交不出去。' };
      }
    }
    return { ok: true };
  };

  const handlePhraseNext = () => {
    if (!phrasePuzzle) return;
    const structure = phrasePuzzle.structures[phraseStructureIndex];
    if (!structure) return;
    const result = validateStructure(structure.id);
    if (!result.ok) {
      setAttitudeError(result.message ?? '這段先寫完再說。');
      return;
    }
    setAttitudeError('');
    if (phraseStructureIndex < phrasePuzzle.structures.length - 1) {
      setPhraseStructureIndex((i) => i + 1);
    }
  };

  const handlePhraseConfirm = () => {
    if (!phrasePuzzle) return;
    const structure = phrasePuzzle.structures[phraseStructureIndex];
    if (!structure) return;
    const result = validateStructure(structure.id);
    if (!result.ok) {
      setAttitudeError(result.message ?? '這段先寫完。');
      return;
    }
    setAttitudeError('');
    const attBoth = config.attitude.attitudeContentCards.find((c) => c.id === 'ch1_attitude_both')
      ?? config.attitude.choices.find((c) => c.id === 'ch1_attitude_both');
    if (attBoth) {
      const choice: DialogChoice = {
        id: attBoth.id,
        text: attBoth.text,
        insightEffects: [
          { target: attBoth.insightTarget, delta: attBoth.insightDelta },
          ...(attBoth.insightTarget2 && attBoth.insightDelta2 != null
            ? [{ target: attBoth.insightTarget2, delta: attBoth.insightDelta2 }]
            : []),
        ],
        effects: [{ type: 'setFlag', flag: 'ch1_attitude_declared', value: true }],
      };
      engine.handleDialogChoice(choice);
    } else {
      engine.applyEffect({ type: 'setFlag', flag: 'ch1_attitude_declared', value: true });
    }
    setSelectedAttitudeId('ch1_attitude_both');
    setShowClosing(true);
  };

  const handleAttitudeDragStart = (e: React.DragEvent, cardId: string) => {
    e.dataTransfer.setData('text/plain', cardId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleAttitudeDrop = (e: React.DragEvent, container: 'report' | 'memo') => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('text/plain');
    if (!cardId || !config.attitude.attitudeContentCards.some((c) => c.id === cardId)) return;
    if (container === 'report') {
      setReportContainerIds((prev) => (prev.includes(cardId) ? prev : [...prev.filter((id) => id !== cardId), cardId]));
      setMemoContainerIds((prev) => prev.filter((id) => id !== cardId));
    } else {
      setMemoContainerIds((prev) => (prev.includes(cardId) ? prev : [...prev.filter((id) => id !== cardId), cardId]));
      setReportContainerIds((prev) => prev.filter((id) => id !== cardId));
    }
    setAttitudeError('');
  };

  const handleAttitudeDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const attitudeCards = config.attitude.attitudeContentCards ?? config.attitude.choices;
  const pooledCardIds = attitudeCards
    .map((c) => c.id)
    .filter((id) => !reportContainerIds.includes(id) && !memoContainerIds.includes(id));

  const handleEnterCh2 = () => {
    engine.setReasoningComplete('ch1');
    onComplete();
  };

  const closingText = useMemo(() => {
    if (!showClosingView) return '';
    const st = engine.getState();
    const insights = st.insights ?? {
      procedure_insight: 0,
      human_insight: 0,
      evidence_insight: 0,
    };
    const p = insights.procedure_insight ?? 0;
    const h = insights.human_insight ?? 0;
    const e = insights.evidence_insight ?? 0;
    const maxVal = Math.max(p, h, e);
    const key =
      maxVal === p ? 'procedure_insight' : maxVal === e ? 'evidence_insight' : 'human_insight';
    return config.attitude.closingInferenceByDimension[key];
  }, [showClosingView, engine]);

  return (
    <>
      {step === 3 && useAttitudeFillBlanks && attitudeFillBlankIndex < 5 && attitudeFillBlanks && (
        <ReportFillBlank
          key={`att-q-${attitudeFillBlankIndex}`}
          config={attitudeFillBlanks[attitudeFillBlankIndex]}
          onComplete={() => setAttitudeFillBlankIndex((i) => i + 1)}
        />
      )}
      <OverlayCard
        tone="system"
        size="lg"
        className="w-full max-w-4xl max-h-[90vh] min-h-[70vh] p-6 md:p-8 flex flex-col"
      >
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-orange-500/30">
        <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
          向劉隊報告
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {VISIBLE_STEPS.map((s) => (
          <span
            key={s.id}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm ${
              step === s.id ? 'bg-orange-500/40 text-white' : 'bg-white/5 text-gray-400'
            }`}
          >
            <s.icon size={14} />
            {s.label}
          </span>
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pr-1">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <m.div
              key="step1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-gray-200 mb-6">報告裡總得寫上一筆：事情發生在幾點。劉隊會問的。</p>
              <div className="flex flex-col items-center gap-6">
                <div
                  className="rounded-2xl border border-orange-500/20 bg-gradient-to-b from-gray-800/60 to-gray-900/80 px-8 py-6"
                  style={{
                    boxShadow: 'inset 0 1px 0 rgba(251,146,60,0.06), 0 12px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.2)',
                  }}
                >
                  <div className="flex items-center justify-center gap-3">
                    <div className="flex gap-0.5">
                      <FlipDigit digit={Math.floor(timeHour / 10)} />
                      <FlipDigit digit={timeHour % 10} />
                    </div>
                    <span
                      className="pb-2 font-mono text-2xl font-light text-orange-500/70"
                      style={{ textShadow: '0 0 12px rgba(251,146,60,0.2)' }}
                    >
                      :
                    </span>
                    <div className="flex gap-0.5">
                      <FlipDigit digit={Math.floor(timeMinutes / 10)} />
                      <FlipDigit digit={timeMinutes % 10} />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-4">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        aria-label="減少一小時"
                        onClick={() => {
                          setTimeHour((h) => (h - 1 + 24) % 24);
                          setTimelineError('');
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-orange-500/25 bg-gray-800/60 text-orange-400/80 text-sm transition hover:border-orange-400/40 hover:bg-orange-500/10 active:scale-95"
                      >
                        −
                      </button>
                      <button
                        type="button"
                        aria-label="增加一小時"
                        onClick={() => {
                          setTimeHour((h) => (h + 1) % 24);
                          setTimelineError('');
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-orange-500/25 bg-gray-800/60 text-orange-400/80 text-sm transition hover:border-orange-400/40 hover:bg-orange-500/10 active:scale-95"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        aria-label="減少一分鐘"
                        onClick={() => {
                          setTimeMinutes((m) => (m - 1 + 60) % 60);
                          setTimelineError('');
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-orange-500/25 bg-gray-800/60 text-orange-400/80 text-sm transition hover:border-orange-400/40 hover:bg-orange-500/10 active:scale-95"
                      >
                        −
                      </button>
                      <button
                        type="button"
                        aria-label="增加一分鐘"
                        onClick={() => {
                          setTimeMinutes((m) => (m + 1) % 60);
                          setTimelineError('');
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-orange-500/25 bg-gray-800/60 text-orange-400/80 text-sm transition hover:border-orange-400/40 hover:bg-orange-500/10 active:scale-95"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {timelineError && <p className="mt-4 text-red-400 text-sm">{timelineError}</p>}
            </m.div>
          )}

          {step === 3 && !showClosing && !useAttitudeFillBlanks && isPhrasePuzzle && phrasePuzzle && (
            <m.div
              key="step3phrase"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-gray-200 mb-3">能交出去的報告，無非三件事：誰能動手、現場留下什麼、誰在怕。底下是能寫進去的用語——選你認為寫得上去的。</p>
              <div className="flex flex-wrap items-center gap-3 mb-2 text-xs text-gray-400">
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-amber-500/80" aria-hidden />
                  流程／體制
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-teal-500/80" aria-hidden />
                  證據／現場
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-rose-500/80" aria-hidden />
                  人／動機
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-3">第 {phraseStructureIndex + 1} 段／共 6 段</p>
              <div className="mb-6 p-5 rounded-xl border border-orange-500/25 bg-gray-800/40 min-h-[100px]">
                {(() => {
                  const structure = phrasePuzzle.structures[phraseStructureIndex];
                  if (!structure) return null;
                  const parts = structure.template.split(/(__\d+__)/g);
                  const fills = phraseFills[structure.id] ?? {};
                  return (
                    <p className="text-gray-200 text-base md:text-lg leading-relaxed">
                      {parts.map((part, i) => {
                        const match = part.match(/^__(\d+)__$/);
                        if (match) {
                          const slotIndex = Number(match[1]);
                          const slot = structure.slots[slotIndex];
                          if (!slot) return part;
                          const wordId = fills[slot.slotId];
                          const word = phrasePuzzle.wordBank.find((w) => w.id === wordId);
                          const isSelected = selectedPhraseSlot?.structureId === structure.id && selectedPhraseSlot?.slotId === slot.slotId;
                          return (
                            <button
                              key={`${structure.id}-${slot.slotId}`}
                              type="button"
                              onClick={() => handlePhraseSlotClick(structure.id, slot.slotId)}
                              className={`inline-block mx-0.5 px-2 py-1 rounded border-2 min-w-[4rem] text-center ${
                                isSelected
                                  ? 'border-orange-400 bg-orange-500/30 text-white'
                                  : wordId
                                    ? 'border-orange-500/40 bg-orange-500/15 text-orange-100'
                                    : 'border-dashed border-orange-500/40 bg-white/5 text-gray-500'
                              }`}
                            >
                              {word ? word.text : '⋯'}
                            </button>
                          );
                        }
                        return <span key={i}>{part}</span>;
                      })}
                    </p>
                  );
                })()}
              </div>
              <p className="text-gray-500 text-sm mb-2">報告用語（同一段裡每個只用一次）</p>
              <div className="flex flex-wrap gap-2">
                {(() => {
                  const structure = phrasePuzzle.structures[phraseStructureIndex];
                  const wordsToShow = structure?.candidateWordIds?.length
                    ? phrasePuzzle.wordBank.filter((w) => structure.candidateWordIds!.includes(w.id))
                    : phrasePuzzle.wordBank;
                  const currentStructureId = structure?.id;
                  const fillsThisSentence = phraseFills[currentStructureId ?? ''] ?? {};
                  const usedWordIds = new Set<string>(Object.values(fillsThisSentence));
                  const selectedSlotWord = selectedPhraseSlot?.structureId === currentStructureId
                    ? fillsThisSentence[selectedPhraseSlot.slotId]
                    : undefined;
                  return wordsToShow.map((w) => {
                    const used = usedWordIds.has(w.id) && selectedSlotWord !== w.id;
                  const color = PHRASE_CATEGORY_COLORS[w.category];
                  const colorClass =
                    color === 'amber'
                      ? 'border-amber-500/40 bg-amber-500/10 text-amber-200 hover:border-amber-400'
                      : color === 'teal'
                        ? 'border-teal-500/40 bg-teal-500/10 text-teal-200 hover:border-teal-400'
                        : 'border-rose-500/40 bg-rose-500/10 text-rose-200 hover:border-rose-400';
                  return (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => handlePhraseWordClick(w.id)}
                      disabled={used}
                      className={`px-3 py-2 rounded-lg border-2 text-sm transition ${colorClass} ${
                        used ? 'opacity-40 cursor-not-allowed line-through' : ''
                      }`}
                    >
                      {w.text}
                    </button>
                  );
                  });
                })()}
              </div>
              {attitudeError && <p className="text-red-400 text-sm mt-4">{attitudeError}</p>}
            </m.div>
          )}

          {step === 3 && !showClosing && !useAttitudeFillBlanks && !isPhrasePuzzle && (
            <m.div
              key="step3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-gray-200 mb-3">報告要交出去，備忘留給自己。哪些內容放進哪一邊？拖曳內容卡到對應區域，至少放入一項後可確認。</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {config.attitude.attitudeContainers.map((cont, idx) => {
                  const isReport = cont.id === 'ch1_report_envelope';
                  const ids = isReport ? reportContainerIds : memoContainerIds;
                  return (
                    <div
                      key={cont.id}
                      onDragOver={handleAttitudeDragOver}
                      onDrop={(e) => handleAttitudeDrop(e, isReport ? 'report' : 'memo')}
                      className="min-h-[120px] p-4 rounded-xl border-2 border-dashed border-orange-500/40 bg-dark-surface/60"
                    >
                      <p className="text-gray-400 text-sm mb-2 font-medium">{cont.label}</p>
                      <div className="space-y-2">
                        {ids.map((cardId) => {
                          const card = attitudeCards.find((c) => c.id === cardId);
                          if (!card) return null;
                          return (
                            <div
                              key={cardId}
                              draggable
                              onDragStart={(e) => handleAttitudeDragStart(e, cardId)}
                              className="px-3 py-2 rounded-lg bg-orange-500/20 border border-orange-500/50 text-gray-200 text-sm cursor-grab active:cursor-grabbing"
                            >
                              {card.text}
                            </div>
                          );
                        })}
                        {ids.length === 0 && (
                          <p className="text-gray-500 text-sm">拖曳內容卡到這裡</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-gray-400 text-sm mb-2">內容卡（拖曳到上方區域）</p>
              <div className="flex flex-wrap gap-2">
                {pooledCardIds.map((cardId) => {
                  const card = attitudeCards.find((c) => c.id === cardId);
                  if (!card) return null;
                  return (
                    <div
                      key={cardId}
                      draggable
                      onDragStart={(e) => handleAttitudeDragStart(e, cardId)}
                      className="px-4 py-3 rounded-xl border-2 border-orange-500/30 bg-dark-surface text-gray-200 text-sm cursor-grab active:cursor-grabbing hover:border-orange-400"
                    >
                      {card.text}
                    </div>
                  );
                })}
                {pooledCardIds.length === 0 && (
                  <p className="text-gray-500 text-sm">所有內容卡已放入報告或備忘</p>
                )}
              </div>
              {attitudeError && <p className="text-red-400 text-sm mt-2">{attitudeError}</p>}
            </m.div>
          )}

          {step === 3 && showClosingView && (
            <m.div
              key="closing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-gray-200 mb-6 whitespace-pre-line">{closingText}</p>
              <button
                type="button"
                onClick={handleEnterCh2}
                className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-medium flex items-center justify-center gap-2"
              >
                進入第二章
                <ChevronRight size={20} />
              </button>
            </m.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-400 hover:text-white border border-gray-600 rounded-lg"
        >
          關閉
        </button>
        {step === 1 && (
          <button
            type="button"
            onClick={handleTimelineNext}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg"
          >
            下一頁
          </button>
        )}
        {step === 3 && !showClosing && !useAttitudeFillBlanks && isPhrasePuzzle && (
          <>
            {phraseStructureIndex > 0 ? (
              <button
                type="button"
                onClick={() => setPhraseStructureIndex((i) => i - 1)}
                className="px-4 py-2 text-gray-400 hover:text-white border border-gray-600 rounded-lg"
              >
                上一句
              </button>
            ) : (
              <span />
            )}
            {phraseStructureIndex < (phrasePuzzle?.structures.length ?? 0) - 1 ? (
              <button
                type="button"
                onClick={handlePhraseNext}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg"
              >
                下一句
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePhraseConfirm}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg"
              >
                確認
              </button>
            )}
          </>
        )}
        {step === 3 && !showClosing && !isPhrasePuzzle && (
          <button
            type="button"
            onClick={handleAttitudeConfirm}
            disabled={
              reportContainerIds.length < 1 ||
              memoContainerIds.length < 1 ||
              (config.attitude.requireInMemoCardId != null &&
                !memoContainerIds.includes(config.attitude.requireInMemoCardId))
            }
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg"
          >
            確認
          </button>
        )}
      </div>
    </OverlayCard>
    </>
  );
}
