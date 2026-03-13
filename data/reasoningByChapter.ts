/**
 * 每章推理分析題目（ch1～ch6）
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
      question: '關於城市影城大廳的「口徑管理」，你認為背後最主要的意圖是？',
      options: [
        { id: 'A', text: '阻止「三起事故」這個說法被媒體串起來' },
        { id: 'B', text: '保護品牌形象，避免個別員工被過度指責' },
        { id: 'C', text: '爭取更多時間完成內部調查，再決定怎麼說' },
      ],
    },
    q2: {
      question: '根據顧乃謙的說法，整理版 log 與原始 log 的差異是什麼？請用一句話描述這個差異對案件調查的影響。',
      type: 'input',
      placeholder: '例如：少了操作來源 IP，無法確認是本機還是遠端操作…',
    },
    q3: {
      question: '請將左側線索與右側意義配對。',
      leftItems: [
        { id: 'whiteboard', label: '交接白板（重寫兩次）' },
        { id: 'filtered_log', label: '張景衡整理版 log' },
        { id: 'cross_venue_sync', label: '跨館同步異常片段' },
      ],
      rightItems: [
        { id: 'cover_up', label: '刻意覆蓋操作痕跡的行為' },
        { id: 'missing_field', label: '遺漏了操作來源與覆寫前原始值' },
        { id: 'shared_access', label: '兩館共用操作入口或同一操作人' },
      ],
      correctPairs: [
        ['whiteboard', 'cover_up'],
        ['filtered_log', 'missing_field'],
        ['cross_venue_sync', 'shared_access'],
      ],
    },
    police: {
      introLine:
        '品牌和技術組都來了，每個人都有一個版本。你去看一下大廳、會議室和機房，告訴我——哪一個版本少了什麼。',
      outroStandard:
        '目前可寫進報告的是：場控系統具備分區自動排程功能，與現場說法不符，存在資訊落差。整理版 log 缺少操作來源 IP 及覆寫前原始值，無法完整還原操作路徑。城市 W 與光芒 R 設備位於同一子網段，版本更新記錄具時間相關性，不排除跨館操作存在。',
      outroPlayerLines: [
        {
          id: 'ch3_extra_procedure',
          text: '補一句：整理版 log 的欄位缺失屬選擇性遺漏，非格式問題，建議調取原始檔進行比對。',
        },
        {
          id: 'ch3_extra_human',
          text: '補一句：宋雅甄及張景衡的應對話術草稿顯示，「三起事故」一詞被刻意迴避，建議列為敘事管理的調查對象。',
        },
        {
          id: 'ch3_extra_evidence',
          text: '至少寫進去：跨館同步操作記錄在案發三週前已存在，應調取顧乃謙遠端登入紀錄進行比對。',
        },
      ],
    },
  },
  ch4: {
    q1: {
      question: '節能燈提前切換的那 3 分鐘，對你而言代表什麼？',
      options: [
        { id: 'ch4_q1_a', text: '這是操作失誤，屬偶發事故，沒有針對性。' },
        { id: 'ch4_q1_b', text: '這是一個窗口：黑暗、人群移動、沒有廣播——事故的條件被刻意製造。' },
        { id: 'ch4_q1_c', text: '這是節能政策執行不當，主要是管理問題，與案件無直接關係。' },
      ],
    },
    q2: {
      question: '陳佑誠送出三份風險回報，每份格式正確、優先級標準，但每份都消失在審核流程裡。這件事告訴你什麼？',
      type: 'input',
      placeholder: '有些擱置不是遺忘，是……',
    },
    q3: {
      question: '把下列線索與它所揭露的意涵配對',
      leftItems: [
        { id: 'ch4_clue_1', label: '節能燈提前切換記錄' },
        { id: 'ch4_clue_2', label: '與城市影城同版插件截圖' },
        { id: 'ch4_clue_3', label: '被擱置的三份風險回報' },
        { id: 'ch4_clue_4', label: '面板手動切換區域指紋' },
      ],
      rightItems: [
        { id: 'ch4_mean_1', label: '黑暗是被安排的，不是意外' },
        { id: 'ch4_mean_2', label: '同一漏洞可在多館同步被利用' },
        { id: 'ch4_mean_3', label: '有人不希望漏洞被修掉' },
        { id: 'ch4_mean_4', label: '操作者知道目標位置，且準備好脫身路線' },
      ],
      correctPairs: [
        ['ch4_clue_1', 'ch4_mean_1'],
        ['ch4_clue_2', 'ch4_mean_2'],
        ['ch4_clue_3', 'ch4_mean_3'],
        ['ch4_clue_4', 'ch4_mean_4'],
      ],
    },
    police: {
      introLine:
        '光芒影城那次沒有人死，所以上面很快就關案了。但你看了樓梯間的記錄，和陳佑誠講過之後，我想聽你怎麼說。',
      outroStandard:
        '目前可寫進報告的是：光芒影城散場事故中，燈控操作時間與正常流程有 3 分鐘落差，不符合節能設定邏輯。插件版本與城市影城一致，遠端推送帳號為共用系統維護帳號，無法排除跨館遠端操作可能性。維護技術員陳佑誠前後三次提交風險回報均未獲批示，回報紀錄顯示其知悉遠端燈控觸發漏洞，應調查回報流程中止的決策鏈。',
      outroPlayerLines: [
        {
          id: 'ch4_extra_procedure',
          text: '補一句：三份風險回報的批示鏈中止點應列入調查，若為刻意擱置而非系統性疏漏，可能涉及知情不報。',
        },
        {
          id: 'ch4_extra_human',
          text: '補一句：梁以安的現場證詞與陳佑誠的技術分析互相補強，建議作為第二起事故「非意外」判定的並列佐證。',
        },
        {
          id: 'ch4_extra_evidence',
          text: '至少寫進去：面板手動切換區域指紋與側門鞋印的方向性，指向一名操作後快速脫身的人——不是維修人員的行動模式。',
        },
      ],
    },
  },
  ch5: {
    q1: {
      question: '高文傑的登入紀錄與命案時間「接近但不完全吻合」。這個描述，對你而言代表什麼？',
      options: [
        { id: 'ch5_q1_a', text: '「接近」已足夠，登入紀錄是直接證據，可以押人。' },
        { id: 'ch5_q1_b', text: '「接近」不夠——帳號在場不等於靈魂在場，需要原始 log 的來源欄位才能確認。' },
        { id: 'ch5_q1_c', text: '「接近」是故意設計的：讓他看起來最可疑，而真正的人不在紀錄裡。' },
      ],
    },
    q2: {
      question: '整理版 log 比原始版少了哪四類欄位？這四個欄位的共同作用是什麼？',
      type: 'input',
      placeholder: '能說清楚誰在哪裡做了什麼的欄位，剛好都不見了……',
    },
    q3: {
      question: '把下列線索與它在嫌疑矩陣中揭露的意涵配對',
      leftItems: [
        { id: 'ch5_clue_1', label: '高文傑登入紀錄（接近但不完整吻合）' },
        { id: 'ch5_clue_2', label: '插件權限樹（頂端靠近技術長）' },
        { id: 'ch5_clue_3', label: 'Unknown 訊息語感 ≈ 張景衡文件語感' },
        { id: 'ch5_clue_4', label: '林子睿通話三次說「管理落後不是陰謀」' },
      ],
      rightItems: [
        { id: 'ch5_mean_1', label: '好用的替身，不是真正的操作者' },
        { id: 'ch5_mean_2', label: '能動插件的人不是在執行層，而在決策層' },
        { id: 'ch5_mean_3', label: 'Unknown 可能是一種職能，不是一個人' },
        { id: 'ch5_mean_4', label: '風險框架被習慣性地壓低，是模式不是失誤' },
      ],
      correctPairs: [
        ['ch5_clue_1', 'ch5_mean_1'],
        ['ch5_clue_2', 'ch5_mean_2'],
        ['ch5_clue_3', 'ch5_mean_3'],
        ['ch5_clue_4', 'ch5_mean_4'],
      ],
    },
    police: {
      introLine:
        '嫌疑矩陣上面要，但我想知道你看完那張表之後的看法——不是表上面寫的，是你自己判斷的。',
      outroStandard:
        '目前可寫進報告的是：高文傑登入紀錄與命案時間有接近性，但整理版 log 缺少操作來源 IP、失敗登入記錄與遠端節點識別碼，無法確認帳號持有者為操作者本人。插件授權結構顯示高文傑層級無插件修改或多館部署權限，該層級授權靠近技術長職位。Unknown 訊息語感與張景衡公關文件具語感相似性，不排除訊息框架來源為同一個利益方向。',
      outroPlayerLines: [
        {
          id: 'ch5_extra_procedure',
          text: '補一句：陳佑誠三份風險回報的批示鏈中止點，應與插件授權結構頂層對應人員進行比對，確認是否存在知情不處理的決策責任。',
        },
        {
          id: 'ch5_extra_human',
          text: '補一句：高文傑的說法具體且自洽，且主動提供追查方向（共用帳號登入來源），行為模式不符合預謀犯罪者的典型迴避模式。',
        },
        {
          id: 'ch5_extra_evidence',
          text: '至少寫進去：若能取得原始 log，應立即核驗操作來源 IP 及失敗登入記錄，這兩個欄位能直接區分「帳號在場」與「操作者在場」。',
        },
      ],
    },
  },
  ch6: {
    q1: {
      question: '張景衡把說帖裡「遠端操作存在可能性」這整句話刪掉了。這個刪除，代表什麼？',
      options: [
        { id: 'ch6_q1_a', text: '公關稿不需要技術細節，這是正常的編輯決策。' },
        { id: 'ch6_q1_b', text: '刪掉這句話，讓整個敘事框架從「有人操作」變成「系統問題」——這是刻意的。' },
        { id: 'ch6_q1_c', text: '他在替林子睿製造口徑：操作者消失了，剩下一個讓人沒辦法追責的版本。' },
      ],
    },
    q2: {
      question: '林子睿說：「我讓一個已經存在的洞繼續存在，等它在對的時機被看見。」這句話的真正意思是什麼？',
      type: 'input',
      placeholder: '沉默也是一種指令……',
    },
    q3: {
      question: '把下列最終關鍵線索與它在案件中的功能配對',
      leftItems: [
        { id: 'ch6_clue_1', label: '中控室原始 log（D7 封存的意義）' },
        { id: 'ch6_clue_2', label: '張景衡說帖刪除「遠端操作可能性」' },
        { id: 'ch6_clue_3', label: '林子睿「等危機把舊結構燒掉」' },
        { id: 'ch6_clue_4', label: '第三起事故與第二起相同序列' },
      ],
      rightItems: [
        { id: 'ch6_mean_1', label: '唯一能確認操作者身分的物證' },
        { id: 'ch6_mean_2', label: '敘事層的剪裁：讓文字版本取代真相版本' },
        { id: 'ch6_mean_3', label: '結構性動機：用代價換系統升級' },
        { id: 'ch6_mean_4', label: '第三起是驗證，不是意外重演' },
      ],
      correctPairs: [
        ['ch6_clue_1', 'ch6_mean_1'],
        ['ch6_clue_2', 'ch6_mean_2'],
        ['ch6_clue_3', 'ch6_mean_3'],
        ['ch6_clue_4', 'ch6_mean_4'],
      ],
    },
    police: {
      introLine:
        '記者會在等，宋雅甄在等，張景衡在等。你先跟我說你看到了什麼——然後我們再一起決定這份報告裡要寫什麼。',
      outroStandard:
        '目前可寫進報告的是：第三起事故時間序列與第二起高度吻合，面板記錄遠端連線節點識別碼，指向非本地操作。中控室門禁異常顯示事故前後有人進出但未記錄身分。張景衡修改說帖刪除「遠端操作存在可能性」，涉嫌操控對外敘事框架。林子睿於訪談中承認對陳佑誠三份風險回報的擱置為「決定」而非疏漏，且對部分操作時機「不排除非巧合」，應列為重要關係人繼續調查。',
      outroPlayerLines: [
        {
          id: 'ch6_extra_raw',
          text: '補一句：若中控室原始 log 已封存，建議立即與整理版比對遠端節點完整識別碼，此欄位可直接對應操作者連線來源。',
        },
        {
          id: 'ch6_extra_lin',
          text: '補一句：林子睿對「沉默是否等同決定」的回答具體且自指，建議以「知情不處理」為方向展開對其決策鏈的正式調查。',
        },
        {
          id: 'ch6_extra_zhang',
          text: '至少寫進去：張景衡說帖的修改版本與 Unknown 訊息的語感特徵高度吻合，建議將張景衡列為「敘事管理鏈」的重要節點，而非單純的公關執行者。',
        },
      ],
    },
  },
};
