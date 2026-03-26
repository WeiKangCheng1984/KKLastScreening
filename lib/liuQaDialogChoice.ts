import type { Dialog, DialogChoice } from '@/types/game';
import type { GameEngine } from '@/lib/gameEngine';

export interface LiuQaDialogContext {
  engine: GameEngine;
  setCurrentDialog: (d: Dialog | null) => void;
}

/**
 * 劉隊章尾「殘句 QA」對話鏈（ch3～ch6）：自 page 抽出，避免 play 頁無限膨脹。
 * 回傳 true 表示已處理且應中止 handleDialogChoice。
 */
export function tryHandleLiuQaDialogChoice(choice: DialogChoice, ctx: LiuQaDialogContext): boolean {
  const { engine, setCurrentDialog } = ctx;

  if (
    choice.id?.startsWith('ch3_q1_') ||
    choice.id?.startsWith('ch3_q2_') ||
    choice.id?.startsWith('ch3_q3_') ||
    choice.id?.startsWith('ch3_qa_') ||
    choice.id?.startsWith('ch3_outro_')
  ) {
    engine.handleDialogChoice(choice);

    const st = engine.getState();
    const flags = st.flags || {};

    if (choice.id?.startsWith('ch3_q1_')) {
      const answer = flags.ch3_q1_answer as string;
      let replyText =
        '劉隊說：「周姊說得比你清楚：第一次是為了改，第二次是為了像沒改。兩個動作，先做後掩。」';
      if (answer === 'A')
        replyText =
          '劉隊點頭：「對。改了，然後把改的痕跡也抹掉。這是兩個動作，不是一個。」\n\n「有人很清楚——只要讓它看起來像從來沒動過，就不會有人回頭追。」';
      else if (answer === 'F')
        replyText =
          '劉隊說：「掩飾不太對，但方向抓到了。重點是第二次的動機——不是要讓別人看不到，是要讓人以為從來就這樣。」';
      setCurrentDialog({
        text: replyText,
        type: 'character',
        characterId: 'npc_liu',
        characterName: '劉隊',
        characterExpression: 1,
        characterPosition: 'right',
        choices: [{ id: 'ch3_q1_next', text: '（繼續下一題）' }],
      });
      return true;
    }

    if (choice.id === 'ch3_q1_next') {
      setCurrentDialog({
        text:
          '劉隊翻到下一頁：「顧乃謙說整理版和原始 log 有差異。」\n\n「殘句：『這份 log 的問題，不在它說了什麼，而在它______了什麼。』」',
        type: 'character',
        characterId: 'npc_liu',
        characterName: '劉隊',
        characterExpression: 1,
        characterPosition: 'right',
        choices: [
          {
            id: 'ch3_q2_A',
            text: 'A. 漏記',
            effects: [
              { type: 'setFlag', flag: 'ch3_q2_answer', value: 'A' },
              { type: 'setFlag', flag: 'ch3_q2_partial_correct', value: true },
              { type: 'setFlag', flag: 'ch3_q2_done', value: true },
            ],
          },
          {
            id: 'ch3_q2_B',
            text: 'B. 選擇性地遺漏',
            effects: [
              { type: 'setFlag', flag: 'ch3_q2_answer', value: 'B' },
              { type: 'setFlag', flag: 'ch3_q2_main_correct', value: true },
              { type: 'setFlag', flag: 'ch3_q2_done', value: true },
            ],
          },
          {
            id: 'ch3_q2_C',
            text: 'C. 誇大',
            effects: [
              { type: 'setFlag', flag: 'ch3_q2_answer', value: 'C' },
              { type: 'setFlag', flag: 'ch3_q2_done', value: true },
            ],
          },
          {
            id: 'ch3_q2_D',
            text: 'D. 偽造',
            effects: [
              { type: 'setFlag', flag: 'ch3_q2_answer', value: 'D' },
              { type: 'setFlag', flag: 'ch3_q2_done', value: true },
            ],
          },
          {
            id: 'ch3_q2_G',
            text: 'G. 刪除',
            effects: [
              { type: 'setFlag', flag: 'ch3_q2_answer', value: 'G' },
              { type: 'setFlag', flag: 'ch3_q2_partial_correct', value: true },
              { type: 'setFlag', flag: 'ch3_q2_done', value: true },
            ],
          },
        ],
      });
      return true;
    }

    if (choice.id?.startsWith('ch3_q2_')) {
      const answer = flags.ch3_q2_answer as string;
      let replyText =
        '劉隊說：「顧乃謙說，操作來源 IP 和覆寫前的原始值，整理版裡都沒有。缺的剛好能讓你問清楚那個操作從哪裡發出來的幾個欄位。」';
      if (answer === 'B')
        replyText =
          '劉隊說：「對。不是全部沒有，是選了哪些要、哪些不要。」\n\n「問題就在『選擇』這個動作上，這不是錯誤，這是決定。」';
      else if (answer === 'A' || answer === 'G')
        replyText =
          '劉隊說：「接近了。但不是全部被拿走，是有人決定某幾個欄位不重要——而那幾個欄位，剛好能讓案件說清楚遠端操作的事。」';
      setCurrentDialog({
        text: replyText,
        type: 'character',
        characterId: 'npc_liu',
        characterName: '劉隊',
        characterExpression: 1,
        characterPosition: 'right',
        choices: [{ id: 'ch3_q2_next', text: '（繼續下一題）' }],
      });
      return true;
    }

    if (choice.id === 'ch3_q2_next') {
      setCurrentDialog({
        text:
          '劉隊翻到最後一頁：「顧乃謙說城市 W 和光芒 R 在同一插件版本序列。」\n\n「殘句：『這代表這不是______，而是______。』」',
        type: 'character',
        characterId: 'npc_liu',
        characterName: '劉隊',
        characterExpression: 1,
        characterPosition: 'right',
        choices: [
          {
            id: 'ch3_q3_A',
            text: 'A. 單點故障 / 系統性問題',
            effects: [
              { type: 'setFlag', flag: 'ch3_q3_answer', value: 'A' },
              { type: 'setFlag', flag: 'ch3_q3_main_correct', value: true },
              { type: 'setFlag', flag: 'ch3_q3_done', value: true },
            ],
          },
          {
            id: 'ch3_q3_B',
            text: 'B. 偶發事件 / 有人刻意安排的結果',
            effects: [
              { type: 'setFlag', flag: 'ch3_q3_answer', value: 'B' },
              { type: 'setFlag', flag: 'ch3_q3_partial_correct', value: true },
              { type: 'setFlag', flag: 'ch3_q3_done', value: true },
            ],
          },
          {
            id: 'ch3_q3_C',
            text: 'C. 資安漏洞 / 人為疏失',
            effects: [
              { type: 'setFlag', flag: 'ch3_q3_answer', value: 'C' },
              { type: 'setFlag', flag: 'ch3_q3_done', value: true },
            ],
          },
          {
            id: 'ch3_q3_E',
            text: 'E. 孤立事件 / 有跨館聯繫的操作',
            effects: [
              { type: 'setFlag', flag: 'ch3_q3_answer', value: 'E' },
              { type: 'setFlag', flag: 'ch3_q3_partial_correct', value: true },
              { type: 'setFlag', flag: 'ch3_q3_done', value: true },
            ],
          },
          {
            id: 'ch3_q3_G',
            text: 'G. 個人行為 / 組織行為',
            effects: [
              { type: 'setFlag', flag: 'ch3_q3_answer', value: 'G' },
              { type: 'setFlag', flag: 'ch3_q3_done', value: true },
            ],
          },
        ],
      });
      return true;
    }

    if (choice.id?.startsWith('ch3_q3_')) {
      const answer = flags.ch3_q3_answer as string;
      let replyText =
        '劉隊說：「顧乃謙說：跨館同步不是故障，那比較像有人知道哪裡會一起響。不是單點，不是巧合，是有人同時在兩邊動手——而且知道怎麼動。」';
      if (answer === 'A')
        replyText =
          '劉隊說：「對。單點故障可以獨立處理，但版本序列一致，代表背後有共同的操作入口或共同的人。」\n\n「這是系統性問題的定義：不是一個地方壞掉，是有人知道哪裡會一起響。」';
      else if (answer === 'B' || answer === 'E')
        replyText =
          '劉隊說：「方向有了，但要更精確一點。重點不是它是不是刻意的，而是它的結構——兩個館，同一條線，這個結構本身就不是單點的問題。」';
      setCurrentDialog({
        text: replyText,
        type: 'character',
        characterId: 'npc_liu',
        characterName: '劉隊',
        characterExpression: 1,
        characterPosition: 'right',
        choices: [{ id: 'ch3_qa_complete', text: '（完成推理討論）' }],
      });
      return true;
    }

    if (choice.id === 'ch3_qa_complete') {
      setCurrentDialog({
        text:
          '劉隊把記錄本合上：「log 能被整理。」\n\n「這句話寫進去，還是不寫進去，我現在問你。」\n\n他等著你的決定。',
        type: 'character',
        characterId: 'npc_liu',
        characterName: '劉隊',
        characterExpression: 1,
        characterPosition: 'right',
        choices: [
          {
            id: 'ch3_outro_write_in',
            text: '寫進去——「log 被整理過，原始欄位遺失，跨館操作痕跡無法重建。」',
            effects: [{ type: 'setFlag', flag: 'ch3_outro_write_raw', value: true }],
          },
          {
            id: 'ch3_outro_use_filtered',
            text: '先用整理版——「現有資料指向個別操作，尚無跨館系統性問題之直接證據。」',
            effects: [{ type: 'setFlag', flag: 'ch3_outro_use_filtered', value: true }],
          },
        ],
      });
      return true;
    }

    if (choice.id === 'ch3_outro_write_in' || choice.id === 'ch3_outro_use_filtered') {
      const isRaw = choice.id === 'ch3_outro_write_in';
      const replyText = isRaw
        ? '劉隊把那行字寫進去，然後說：「這種句子寫進去，今晚有些人的手機會響。」\n\n「我知道。但它是真的。」'
        : '劉隊把那行字寫進去，然後說：「這樣的話，今晚大家都能回家睡覺。」\n\n他停了一下：「但那兩個欄位，我會自己記著。」';
      setCurrentDialog({
        text: replyText,
        type: 'character',
        characterId: 'npc_liu',
        characterName: '劉隊',
        characterExpression: 1,
        characterPosition: 'right',
        choices: [
          {
            id: 'ch3_outro_done',
            text: '（結束本章）',
            effects: [{ type: 'setFlag', flag: 'ch3_reasoning_done', value: true }],
          },
        ],
      });
      return true;
    }

    if (choice.id === 'ch3_outro_done') {
      engine.handleDialogChoice(choice);
      setCurrentDialog(null);
      return true;
    }

    return true;
  }

  if (
    choice.id?.startsWith('ch6_q1_') ||
    choice.id?.startsWith('ch6_q2_') ||
    choice.id?.startsWith('ch6_q3_') ||
    choice.id?.startsWith('ch6_qa_') ||
    choice.id?.startsWith('ch6_final_') ||
    choice.id === 'ch6_outro_done'
  ) {
    engine.handleDialogChoice(choice);

    const st = engine.getState();
    const flags = st.flags || {};

    if (choice.id?.startsWith('ch6_q1_')) {
      const answer = flags.ch6_q1_answer as string;
      let replyText = '劉隊說：「張景衡改的那幾個字，剛好都是讓案件能繼續被追的字。不是疏忽，是選擇。」';
      if (answer === 'ch6_q1_c')
        replyText =
          '劉隊點頭：「對。林子睿提供框架，張景衡製成口徑。那句話刪掉之後，整個敘事就從『有人這樣做』變成『系統本來就這樣』。」\n\n「繼續。」';
      else if (answer === 'ch6_q1_b')
        replyText =
          '劉隊說：「方向對了。刪掉技術細節，是讓責任從個人行為變成系統性問題——而系統性問題沒有人要負責。」';
      setCurrentDialog({
        text: replyText,
        type: 'character',
        characterId: 'npc_liu',
        characterName: '劉隊',
        characterExpression: 1,
        characterPosition: 'right',
        choices: [{ id: 'ch6_q1_next', text: '（繼續）' }],
      });
      return true;
    }
    if (choice.id === 'ch6_q1_next') {
      setCurrentDialog({
        text:
          '劉隊說：「林子睿說的那句話——」\n\n「殘句：『我讓一個已經存在的洞繼續存在，等它在對的時機被看見。這句話的意思是：______。』」',
        type: 'character',
        characterId: 'npc_liu',
        characterName: '劉隊',
        characterExpression: 1,
        characterPosition: 'right',
        choices: [
          {
            id: 'ch6_q2_A',
            text: 'A. 沉默也是一種授權——他讓漏洞可利用，不阻止就等於允許',
            effects: [
              { type: 'setFlag', flag: 'ch6_q2_answer', value: 'A' },
              { type: 'setFlag', flag: 'ch6_q2_main_correct', value: true },
              { type: 'setFlag', flag: 'ch6_q2_done', value: true },
            ],
          },
          {
            id: 'ch6_q2_B',
            text: 'B. 他在等一個更大的結構性改革——代價是他預期的副產品',
            effects: [
              { type: 'setFlag', flag: 'ch6_q2_answer', value: 'B' },
              { type: 'setFlag', flag: 'ch6_q2_partial_correct', value: true },
              { type: 'setFlag', flag: 'ch6_q2_done', value: true },
            ],
          },
          {
            id: 'ch6_q2_C',
            text: 'C. 他只是疏忽了，沒有主動意圖',
            effects: [
              { type: 'setFlag', flag: 'ch6_q2_answer', value: 'C' },
              { type: 'setFlag', flag: 'ch6_q2_done', value: true },
            ],
          },
        ],
      });
      return true;
    }
    if (choice.id?.startsWith('ch6_q2_')) {
      const answer = flags.ch6_q2_answer as string;
      let replyText =
        '劉隊說：「他說得很清楚：讓它繼續存在是決定，等它在對的時機是期待。這兩個動作合在一起，在法律上怎麼定義是另一回事，但在現實裡，它不是疏忽。」';
      if (answer === 'A')
        replyText =
          '劉隊說：「對。他沒有指令叫人操作，但他讓操作成為可能、讓漏洞保持開著。」\n\n「在那個位置，沉默不是中立，沉默是決策。」';
      else if (answer === 'B')
        replyText =
          '劉隊說：「B 和 A 其實可以同時成立。他等的是改革，但他知道代價是什麼——他只是沒有說出口，也沒有阻止它發生。」';
      setCurrentDialog({
        text: replyText,
        type: 'character',
        characterId: 'npc_liu',
        characterName: '劉隊',
        characterExpression: 1,
        characterPosition: 'right',
        choices: [{ id: 'ch6_q2_next', text: '（最後一題）' }],
      });
      return true;
    }
    if (choice.id === 'ch6_q2_next') {
      setCurrentDialog({
        text:
          '劉隊說：「最後一題，不是給你的，是你給我的。」\n\n「章尾釘句：「你也能被剪裁。」」\n\n「你怎麼回應這句話？」',
        type: 'character',
        characterId: 'npc_liu',
        characterName: '劉隊',
        characterExpression: 1,
        characterPosition: 'right',
        choices: [
          {
            id: 'ch6_q3_A',
            text: 'A. 那就讓我的版本先出去——把我找到的，說清楚，說完整。',
            effects: [
              { type: 'setFlag', flag: 'ch6_q3_answer', value: 'A' },
              { type: 'setFlag', flag: 'ch6_q3_done', value: true },
            ],
          },
          {
            id: 'ch6_q3_B',
            text: 'B. 先確保那份原始 log 不消失——真相在資料裡，不在誰先說。',
            effects: [
              { type: 'setFlag', flag: 'ch6_q3_answer', value: 'B' },
              { type: 'setFlag', flag: 'ch6_q3_done', value: true },
            ],
          },
          {
            id: 'ch6_q3_C',
            text: 'C. 我知道了。這就夠了。不是每個真相都能說出去的形狀。',
            effects: [
              { type: 'setFlag', flag: 'ch6_q3_answer', value: 'C' },
              { type: 'setFlag', flag: 'ch6_q3_done', value: true },
            ],
          },
        ],
      });
      return true;
    }

    if (choice.id?.startsWith('ch6_q3_')) {
      const hasRawLog = !!flags.ch6_raw_log_secured;
      const d6Lin = !!flags.ch5_d6_lin;
      const linConfronted = !!flags.npc_lin_ch6_confrontation_done;

      let endingTitle = '';
      let endingText = '';

      if (hasRawLog && d6Lin && linConfronted) {
        endingTitle = '完整揭露';
        endingText =
          '劉隊把記錄本放下，說：「原始 log 在，林子睿的話有記錄，插件權限樹的頂端對上了。」\n\n「這份報告，我今晚就送出去。有些人的手機今晚會響，有些電話明天就不好打了。」\n\n他停頓了一下：「但這份東西是真的。不是說法，不是口徑，不是說帖第三版。」\n\n「KK——你沒有讓它被剪裁。」\n\n窗外記者會的燈光亮起，然後又滅了。\n\n有些事結束了。有些事才剛開始說清楚。';
      } else if (hasRawLog && !d6Lin) {
        endingTitle = '程序完成，真相待續';
        endingText =
          '劉隊說：「高文傑的案子，程序上走得下去。」\n\n「原始 log 在，比對結果你看到了。林子睿在技術層的位置——我寫進去了，但現在還不夠壓他。」\n\n「你做了一個可以走的選擇。不是最完整的，但不是錯的。」\n\n他把報告合上：「有些案子，第一份報告只是起點。」\n\n窗外的記者會開始了，宋雅甄在說話，措辭比張景衡的說帖乾淨一點點。\n\n不是你要的那種結束。但今晚有東西留下來了。';
      } else if (!hasRawLog && d6Lin) {
        endingTitle = '追到了，但資料沒了';
        endingText =
          '劉隊說：「林子睿那邊，你有對話記錄，有他的承認。但整理版 log 是張景衡的版本，原始檔沒有封存。」\n\n「你追到了腦，但能拿出去的，比你找到的少一截。」\n\n阿蘇說：「這個缺口，以後還能追。但以後比現在難。」\n\n窗外的記者會正在進行，宋雅甄的稿子是張景衡的版本。今晚說出去的，是那個版本。\n\n「你也能被剪裁。」\n林子睿說過那句話。今晚，它有了一個具體的形狀。';
      } else {
        endingTitle = '現場平安，真相之後';
        endingText =
          '劉隊說：「觀眾都出去了。沒有重傷。」\n\n「這是你今晚做到的最清楚的一件事。」\n\n他停了一下：「log 的部分，比較麻煩。整理版是張景衡的版本。原始檔的狀況……阿蘇說她在想辦法。」\n\n「不是你不好。是今晚有太多事要同時決定，你選了讓人先安全。」\n\n記者會正在播出，外面的版本，不是你的版本。\n\n但今晚有幾個人活著走出去了。這也是一種答案。';
      }

      engine.applyEffect({ type: 'setFlag', flag: 'ch6_ending_triggered', value: true });

      setCurrentDialog({
        text: `【${endingTitle}】\n\n${endingText}`,
        type: 'narrator',
        choices: [{ id: 'ch6_qa_complete', text: '（繼續）' }],
      });
      return true;
    }

    if (choice.id === 'ch6_qa_complete') {
      setCurrentDialog({
        text:
          '劉隊說：「你也能被剪裁。」\n\n「但那要看你讓誰先拿到你找到的東西。」\n\n他把記錄本合上，遞給你。\n\n「這是你的。從頭到尾，都是你的判斷。」',
        type: 'character',
        characterId: 'npc_liu',
        characterName: '劉隊',
        characterExpression: 1,
        characterPosition: 'right',
        choices: [{ id: 'ch6_final_reflection', text: '（最後一句話）' }],
      });
      return true;
    }

    if (choice.id === 'ch6_final_reflection') {
      const q3 = flags.ch6_q3_answer as string;
      let reflectionText = '「我知道了。這就夠了。」';
      if (q3 === 'A') reflectionText = '「讓我的版本先出去。」\n\n說完，你拿起記錄本，往記者會的方向走去。';
      else if (q3 === 'B')
        reflectionText = '「真相在資料裡。不在說法裡。」\n\n那份原始 log，你知道它在哪裡。你知道它說了什麼。';
      else if (q3 === 'C')
        reflectionText =
          '「我知道了。這就夠了。」\n\n不是每個真相都能說出去的形狀。但你知道它的形狀。這件事，沒有人能從你身上剪裁走。';
      setCurrentDialog({
        text: reflectionText,
        type: 'narrator',
        choices: [
          {
            id: 'ch6_outro_done',
            text: '（完成遊戲）',
            effects: [
              { type: 'setFlag', flag: 'ch6_reasoning_done', value: true },
              { type: 'setFlag', flag: 'game_completed', value: true },
            ],
          },
        ],
      });
      return true;
    }

    if (choice.id === 'ch6_outro_done') {
      engine.handleDialogChoice(choice);
      setCurrentDialog({
        text:
          '——KK 流程偵探：最後一場放映——\n\n感謝你把這個案件調查到底。\n\n你找到的每一個字、每一份記錄、每一個不對的時間點，都在這裡。\n\n「你也能被剪裁。」\n但你沒有。',
        type: 'narrator',
      });
      return true;
    }

    return true;
  }

  if (
    choice.id?.startsWith('ch5_q1_') ||
    choice.id?.startsWith('ch5_q2_') ||
    choice.id?.startsWith('ch5_q3_') ||
    choice.id?.startsWith('ch5_qa_') ||
    choice.id?.startsWith('ch5_outro_')
  ) {
    engine.handleDialogChoice(choice);

    const st = engine.getState();
    const flags = st.flags || {};

    if (choice.id?.startsWith('ch5_q1_')) {
      const answer = flags.ch5_q1_answer as string;
      let replyText =
        '劉隊說：「阿蘇說得清楚：登入紀錄只證明帳號在場，不保證靈魂也在場。『接近』需要來源欄位才能說清楚。」';
      if (answer === 'ch5_q1_b')
        replyText =
          '劉隊點頭：「對。帳號在場，不代表操作者在場。整理版少了那幾個欄位，就是讓你只能說到『接近』這個程度。」\n\n「繼續。」';
      else if (answer === 'ch5_q1_c')
        replyText =
          '劉隊說：「C 是可能的方向，但要能站得住腳，需要找到那個讓高文傑看起來最可疑的人——以及他這樣做的理由。繼續推。」';
      else if (answer === 'ch5_q1_a')
        replyText =
          '劉隊說：「如果接近就夠，阿蘇不會特別提『帳號在場不代表靈魂在場』。那句話是在提醒你，光憑現有資料，押人站不住。」';
      setCurrentDialog({
        text: replyText,
        type: 'character',
        characterId: 'npc_liu',
        characterName: '劉隊',
        characterExpression: 1,
        characterPosition: 'right',
        choices: [{ id: 'ch5_q1_next', text: '（繼續下一題）' }],
      });
      return true;
    }

    if (choice.id === 'ch5_q1_next') {
      setCurrentDialog({
        text: '劉隊說：「整理版 log 比原始版少了四類欄位。」\n\n「殘句：『少的那些欄位，剛好能說清楚______。』」',
        type: 'character',
        characterId: 'npc_liu',
        characterName: '劉隊',
        characterExpression: 1,
        characterPosition: 'right',
        choices: [
          {
            id: 'ch5_q2_A',
            text: 'A. 誰在哪裡做了什麼',
            effects: [
              { type: 'setFlag', flag: 'ch5_q2_answer', value: 'A' },
              { type: 'setFlag', flag: 'ch5_q2_main_correct', value: true },
              { type: 'setFlag', flag: 'ch5_q2_done', value: true },
            ],
          },
          {
            id: 'ch5_q2_B',
            text: 'B. 系統為什麼崩潰',
            effects: [
              { type: 'setFlag', flag: 'ch5_q2_answer', value: 'B' },
              { type: 'setFlag', flag: 'ch5_q2_done', value: true },
            ],
          },
          {
            id: 'ch5_q2_C',
            text: 'C. 高文傑的真實動機',
            effects: [
              { type: 'setFlag', flag: 'ch5_q2_answer', value: 'C' },
              { type: 'setFlag', flag: 'ch5_q2_done', value: true },
            ],
          },
          {
            id: 'ch5_q2_D',
            text: 'D. log 是不是被偽造過',
            effects: [
              { type: 'setFlag', flag: 'ch5_q2_answer', value: 'D' },
              { type: 'setFlag', flag: 'ch5_q2_partial_correct', value: true },
              { type: 'setFlag', flag: 'ch5_q2_done', value: true },
            ],
          },
        ],
      });
      return true;
    }

    if (choice.id?.startsWith('ch5_q2_')) {
      const answer = flags.ch5_q2_answer as string;
      let replyText =
        '劉隊說：「四個欄位：來源 IP、失敗登入、遠端節點、覆寫前原始值。這四個加在一起，就能說清楚那個操作從哪裡來、由誰發出。整理版把這四個拿掉，你就只剩下一個不完整的故事。」';
      if (answer === 'A')
        replyText =
          '劉隊說：「對。那四個欄位——操作來源、失敗紀錄、遠端節點、原始值——合在一起就是一份能說清楚誰在哪裡動了什麼的證據。」\n\n「少了它們，你有的只是一份說法很順、但卡不住追問的報告。」';
      else if (answer === 'D')
        replyText =
          '劉隊說：「偽造是可能的，但更精確的說法是：選擇性遺漏。不是全部拿走，是把能追到操作者的那幾個欄位拿走，讓它看起來還是一份正常的 log。」';
      setCurrentDialog({
        text: replyText,
        type: 'character',
        characterId: 'npc_liu',
        characterName: '劉隊',
        characterExpression: 1,
        characterPosition: 'right',
        choices: [{ id: 'ch5_q2_next', text: '（繼續下一題）' }],
      });
      return true;
    }

    if (choice.id === 'ch5_q2_next') {
      setCurrentDialog({
        text:
          '劉隊說：「插件權限樹的頂層授權靠近技術長職位。」\n\n「殘句：『高文傑能按下執行，但能決定執行什麼的人，在______。』」',
        type: 'character',
        characterId: 'npc_liu',
        characterName: '劉隊',
        characterExpression: 1,
        characterPosition: 'right',
        choices: [
          {
            id: 'ch5_q3_A',
            text: 'A. 更高的授權層級，靠近技術長的位置',
            effects: [
              { type: 'setFlag', flag: 'ch5_q3_answer', value: 'A' },
              { type: 'setFlag', flag: 'ch5_q3_main_correct', value: true },
              { type: 'setFlag', flag: 'ch5_q3_done', value: true },
            ],
          },
          {
            id: 'ch5_q3_B',
            text: 'B. 警方目前還沒查到的第三方',
            effects: [
              { type: 'setFlag', flag: 'ch5_q3_answer', value: 'B' },
              { type: 'setFlag', flag: 'ch5_q3_done', value: true },
            ],
          },
          {
            id: 'ch5_q3_C',
            text: 'C. 高文傑上面的直屬主管',
            effects: [
              { type: 'setFlag', flag: 'ch5_q3_answer', value: 'C' },
              { type: 'setFlag', flag: 'ch5_q3_partial_correct', value: true },
              { type: 'setFlag', flag: 'ch5_q3_done', value: true },
            ],
          },
          {
            id: 'ch5_q3_D',
            text: 'D. Unknown 的實際身份',
            effects: [
              { type: 'setFlag', flag: 'ch5_q3_answer', value: 'D' },
              { type: 'setFlag', flag: 'ch5_q3_done', value: true },
            ],
          },
        ],
      });
      return true;
    }

    if (choice.id?.startsWith('ch5_q3_')) {
      const answer = flags.ch5_q3_answer as string;
      let replyText =
        '劉隊說：「顧乃謙說得清楚：真正能改插件的人，不需要每次自己登入。能在多館部署的那個層級，只有一個職位的帳號可以觸及——而那個位置，靠近技術長。」';
      if (answer === 'A')
        replyText =
          '劉隊點頭：「對。插件邏輯不是在執行層決定的，是在授權的頂層定義的。」\n\n「高文傑是手，但決定手要做什麼的人，在另一個層級。」';
      else if (answer === 'C')
        replyText =
          '劉隊說：「接近了，但層級更高。直屬主管不一定有插件頂層授權——這個案子的結構，讓決定者和操作者分了很遠。」';
      setCurrentDialog({
        text: replyText,
        type: 'character',
        characterId: 'npc_liu',
        characterName: '劉隊',
        characterExpression: 1,
        characterPosition: 'right',
        choices: [{ id: 'ch5_qa_complete', text: '（完成推理討論）' }],
      });
      return true;
    }

    if (choice.id === 'ch5_qa_complete') {
      setCurrentDialog({
        text: '劉隊把記錄本合上：「動機能被剪裁。」\n\n「現在上面要一個名字。你要給哪一個？」',
        type: 'character',
        characterId: 'npc_liu',
        characterName: '劉隊',
        characterExpression: 1,
        characterPosition: 'right',
        choices: [
          {
            id: 'ch5_outro_gao',
            text: '先押高文傑——登入紀錄在，程序可以走，之後再繼續追林子睿。',
            effects: [{ type: 'setFlag', flag: 'ch5_d6_gao', value: true }],
          },
          {
            id: 'ch5_outro_lin',
            text: '盯林子睿——插件頂層授權在他那裡，先押高文傑會讓真正的人跑掉。',
            effects: [{ type: 'setFlag', flag: 'ch5_d6_lin', value: true }],
          },
        ],
      });
      return true;
    }

    if (choice.id === 'ch5_outro_gao' || choice.id === 'ch5_outro_lin') {
      const isGao = choice.id === 'ch5_outro_gao';
      const replyText = isGao
        ? '劉隊說：「高文傑的名字先進去。」\n\n「程序走得動，報告好寫。」\n\n他停頓了一下：「林子睿那邊，我自己記著。你繼續查，別讓這件事在這裡結束。」'
        : '劉隊說：「盯林子睿，這很難。他的職位讓他有足夠的理由跟程序溝通。」\n\n「但你問的問題方向是對的：手和腦分開的案子，先押手，腦就有機會消失。」\n\n「我們需要找到原始 log。」';
      setCurrentDialog({
        text: replyText,
        type: 'character',
        characterId: 'npc_liu',
        characterName: '劉隊',
        characterExpression: 1,
        characterPosition: 'right',
        choices: [
          {
            id: 'ch5_outro_done',
            text: '（結束本章）',
            effects: [{ type: 'setFlag', flag: 'ch5_reasoning_done', value: true }],
          },
        ],
      });
      return true;
    }

    if (choice.id === 'ch5_outro_done') {
      engine.handleDialogChoice(choice);
      setCurrentDialog(null);
      return true;
    }

    return true;
  }

  if (
    choice.id?.startsWith('ch4_q1_') ||
    choice.id?.startsWith('ch4_q2_') ||
    choice.id?.startsWith('ch4_q3_') ||
    choice.id?.startsWith('ch4_qa_') ||
    choice.id?.startsWith('ch4_outro_')
  ) {
    engine.handleDialogChoice(choice);

    const st = engine.getState();
    const flags = st.flags || {};

    if (choice.id?.startsWith('ch4_q1_')) {
      const answer = flags.ch4_q1_answer as string;
      let replyText = '劉隊說：「梁以安說得清楚——黑下去的時間不對。燈不是壞了，是被安排在那個時機點亮下去的。」';
      if (answer === 'ch4_q1_b')
        replyText =
          '劉隊點頭：「對。3 分鐘不是意外值，是操作窗口。在那段時間裡，黑暗是有人準備的條件，不是意外的結果。」\n\n「繼續。」';
      else if (answer === 'ch4_q1_a')
        replyText =
          '劉隊說：「如果是失誤，那份風險回報不需要被三次擱置。有人不希望這個洞被修掉，這不是失誤的邏輯，這是利用的邏輯。」';
      setCurrentDialog({
        text: replyText,
        type: 'character',
        characterId: 'npc_liu',
        characterName: '劉隊',
        characterExpression: 1,
        characterPosition: 'right',
        choices: [{ id: 'ch4_q1_next', text: '（繼續下一題）' }],
      });
      return true;
    }

    if (choice.id === 'ch4_q1_next') {
      setCurrentDialog({
        text:
          '劉隊說：「陳佑誠送了三次回報單，每次都消失在流程裡。」\n\n「殘句：『不是每個擱置都是遺忘，有些擱置是______。』」',
        type: 'character',
        characterId: 'npc_liu',
        characterName: '劉隊',
        characterExpression: 1,
        characterPosition: 'right',
        choices: [
          {
            id: 'ch4_q2_A',
            text: 'A. 決策',
            effects: [
              { type: 'setFlag', flag: 'ch4_q2_answer', value: 'A' },
              { type: 'setFlag', flag: 'ch4_q2_main_correct', value: true },
              { type: 'setFlag', flag: 'ch4_q2_done', value: true },
            ],
          },
          {
            id: 'ch4_q2_B',
            text: 'B. 程序問題',
            effects: [
              { type: 'setFlag', flag: 'ch4_q2_answer', value: 'B' },
              { type: 'setFlag', flag: 'ch4_q2_done', value: true },
            ],
          },
          {
            id: 'ch4_q2_C',
            text: 'C. 忽略',
            effects: [
              { type: 'setFlag', flag: 'ch4_q2_answer', value: 'C' },
              { type: 'setFlag', flag: 'ch4_q2_partial_correct', value: true },
              { type: 'setFlag', flag: 'ch4_q2_done', value: true },
            ],
          },
          {
            id: 'ch4_q2_D',
            text: 'D. 共謀',
            effects: [
              { type: 'setFlag', flag: 'ch4_q2_answer', value: 'D' },
              { type: 'setFlag', flag: 'ch4_q2_done', value: true },
            ],
          },
        ],
      });
      return true;
    }

    if (choice.id?.startsWith('ch4_q2_')) {
      const answer = flags.ch4_q2_answer as string;
      let replyText =
        '劉隊說：「陳佑誠的回報格式正確、優先級正確，卻三次沒有批示。這條批示鏈的決定，在某個地方就停下來了。」';
      if (answer === 'A')
        replyText =
          '劉隊說：「對。不是沒人看到，是有人決定不動。」\n\n「三份回報，三次決定。這不是程序疏漏，這是一個一致的選擇。」';
      else if (answer === 'C')
        replyText =
          '劉隊說：「接近，但忽略還能是無意識的。這三次很一致，一致到它更像一個有意的選擇。」';
      setCurrentDialog({
        text: replyText,
        type: 'character',
        characterId: 'npc_liu',
        characterName: '劉隊',
        characterExpression: 1,
        characterPosition: 'right',
        choices: [{ id: 'ch4_q2_next', text: '（繼續下一題）' }],
      });
      return true;
    }

    if (choice.id === 'ch4_q2_next') {
      setCurrentDialog({
        text:
          '劉隊說：「光芒 R 和城市 W 用的是同一個 patch 版本的插件。」\n\n「殘句：『這讓本來需要______的事，變成只需要______。』」',
        type: 'character',
        characterId: 'npc_liu',
        characterName: '劉隊',
        characterExpression: 1,
        characterPosition: 'right',
        choices: [
          {
            id: 'ch4_q3_A',
            text: 'A. 分別進入兩個館 / 一個入口就能觸及兩個館',
            effects: [
              { type: 'setFlag', flag: 'ch4_q3_answer', value: 'A' },
              { type: 'setFlag', flag: 'ch4_q3_main_correct', value: true },
              { type: 'setFlag', flag: 'ch4_q3_done', value: true },
            ],
          },
          {
            id: 'ch4_q3_B',
            text: 'B. 特殊技術能力 / 基本的系統存取權',
            effects: [
              { type: 'setFlag', flag: 'ch4_q3_answer', value: 'B' },
              { type: 'setFlag', flag: 'ch4_q3_partial_correct', value: true },
              { type: 'setFlag', flag: 'ch4_q3_done', value: true },
            ],
          },
          {
            id: 'ch4_q3_C',
            text: 'C. 很多人合謀 / 只需要一個知道入口的人',
            effects: [
              { type: 'setFlag', flag: 'ch4_q3_answer', value: 'C' },
              { type: 'setFlag', flag: 'ch4_q3_partial_correct', value: true },
              { type: 'setFlag', flag: 'ch4_q3_done', value: true },
            ],
          },
          {
            id: 'ch4_q3_D',
            text: 'D. 兩次不同的計畫 / 一個計畫複用兩次',
            effects: [
              { type: 'setFlag', flag: 'ch4_q3_answer', value: 'D' },
              { type: 'setFlag', flag: 'ch4_q3_done', value: true },
            ],
          },
        ],
      });
      return true;
    }

    if (choice.id?.startsWith('ch4_q3_')) {
      const answer = flags.ch4_q3_answer as string;
      let replyText =
        '劉隊說：「陳佑誠說得清楚：同一個 patch，意味著同一個漏洞，同一種觸發方式。不需要去兩個地方，只需要知道怎麼用那個共同的入口。」';
      if (answer === 'A')
        replyText =
          '劉隊點頭：「對。兩個館，一條線。操作者不需要兩個計畫，只需要一個知道怎麼進去的辦法。」\n\n「這讓規模擴大的成本，低到像只是多打一個指令。」';
      else if (answer === 'B' || answer === 'C')
        replyText =
          '劉隊說：「接近了。重點不是人數或技術高低，是那個 patch 讓兩個館變成同一個攻擊面——進一個，等於進兩個。」';
      setCurrentDialog({
        text: replyText,
        type: 'character',
        characterId: 'npc_liu',
        characterName: '劉隊',
        characterExpression: 1,
        characterPosition: 'right',
        choices: [{ id: 'ch4_qa_complete', text: '（完成推理討論）' }],
      });
      return true;
    }

    if (choice.id === 'ch4_qa_complete') {
      setCurrentDialog({
        text: '劉隊把記錄本合上：「人群能被當測試。」\n\n「這句話——你想怎麼寫進報告？」',
        type: 'character',
        characterId: 'npc_liu',
        characterName: '劉隊',
        characterExpression: 1,
        characterPosition: 'right',
        choices: [
          {
            id: 'ch4_outro_direct',
            text: '直接寫：「第二起事故具備人為操作條件，建議重新調查，不維持偶發認定。」',
            effects: [{ type: 'setFlag', flag: 'ch4_outro_direct_flag', value: true }],
          },
          {
            id: 'ch4_outro_cautious',
            text: '謹慎寫：「現有物證顯示燈控異常具備人為可能，建議待更多技術比對後再行定性。」',
            effects: [{ type: 'setFlag', flag: 'ch4_outro_cautious_flag', value: true }],
          },
        ],
      });
      return true;
    }

    if (choice.id === 'ch4_outro_direct' || choice.id === 'ch4_outro_cautious') {
      const isDirect = choice.id === 'ch4_outro_direct';
      const replyText = isDirect
        ? '劉隊寫進去，說：「這樣寫，上面今晚會打電話過來。」\n\n「我知道。但這是目前最接近真的說法。」\n\n他合上記錄本，頓了一下：「陳佑誠三份回報的批示鏈，我會另外追。」'
        : '劉隊寫進去，說：「這樣的話，程序上比較好走。」\n\n他停頓了一下：「但梁以安說黑得太早，陳佑誠說漏洞被刻意留著——這些，我自己記著。」';
      setCurrentDialog({
        text: replyText,
        type: 'character',
        characterId: 'npc_liu',
        characterName: '劉隊',
        characterExpression: 1,
        characterPosition: 'right',
        choices: [
          {
            id: 'ch4_outro_done',
            text: '（結束本章）',
            effects: [{ type: 'setFlag', flag: 'ch4_reasoning_done', value: true }],
          },
        ],
      });
      return true;
    }

    if (choice.id === 'ch4_outro_done') {
      engine.handleDialogChoice(choice);
      setCurrentDialog(null);
      return true;
    }

    return true;
  }

  return false;
}
