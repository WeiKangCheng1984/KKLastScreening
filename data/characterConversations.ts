import { CharacterConversation } from '@/types/game';

/**
 * 角色對話鏈配置
 * 這個文件定義了所有角色的完整對話流程
 * 使用新的 CharacterConversation 系統，支持自動連續播放
 */

export const characterConversations: Record<string, CharacterConversation> = {
  // 第一章 - 客廳 - 模糊人影
  character_1_conversation: {
    id: 'character_1_conversation',
    turns: [
      {
        id: 'turn_1',
        text: '「你來了。」',
        characterId: 'shadow_person',
        characterName: '模糊的人影',
        characterPortrait: '/svg/characters/shadow_person.svg',
        characterPosition: 'left',
        speaker: 'character',
        autoAdvanceDelay: 1500,
      },
      {
        id: 'turn_2',
        text: '「你是誰？」',
        characterId: 'shadow_person',
        characterName: '模糊的人影',
        characterPortrait: '/svg/characters/shadow_person.svg',
        characterPosition: 'left',
        speaker: 'player',
        autoAdvanceDelay: 1500,
      },
      {
        id: 'turn_3',
        text: '「我是誰不重要。重要的是，你為什麼會在這裡？」',
        characterId: 'shadow_person',
        characterName: '模糊的人影',
        characterPortrait: '/svg/characters/shadow_person.svg',
        characterPosition: 'left',
        speaker: 'character',
        autoAdvanceDelay: 2000,
      },
      {
        id: 'turn_4',
        text: '「我不知道...我只是走進來了。」',
        characterId: 'shadow_person',
        characterName: '模糊的人影',
        characterPortrait: '/svg/characters/shadow_person.svg',
        characterPosition: 'left',
        speaker: 'player',
        autoAdvanceDelay: 2000,
      },
      {
        id: 'turn_5',
        text: '「沒有人阻止你，對吧？這個空間接納了你。\n\n你會留下來嗎？」',
        characterId: 'shadow_person',
        characterName: '模糊的人影',
        characterPortrait: '/svg/characters/shadow_person.svg',
        characterPosition: 'left',
        speaker: 'character',
        autoAdvance: false, // 最後一段不自動推進，等待選擇
      },
    ],
    finalChoices: [
      {
        id: 'choice_stay_accept',
        text: '我會留下來',
        weight: 10,
      },
      {
        id: 'choice_stay_hesitate',
        text: '我還不確定',
        weight: 5,
      },
      {
        id: 'choice_leave',
        text: '我想離開',
        weight: -5,
      },
    ],
    onComplete: {
      setFlag: 'character_1_complete',
    },
  },

  // 第一章 - 廚房 - 聲音
  character_2_conversation: {
    id: 'character_2_conversation',
    turns: [
      {
        id: 'turn_1',
        text: '「你來了。」',
        characterId: 'kitchen_voice',
        characterName: '聲音',
        characterPortrait: '/svg/characters/kitchen_voice.svg',
        characterPosition: 'right',
        speaker: 'character',
        autoAdvanceDelay: 1500,
      },
      {
        id: 'turn_2',
        text: '「這裡需要你。瓦斯爐、冰箱、漏水...都需要處理。」',
        characterId: 'kitchen_voice',
        characterName: '聲音',
        characterPortrait: '/svg/characters/kitchen_voice.svg',
        characterPosition: 'right',
        speaker: 'character',
        autoAdvanceDelay: 2000,
      },
      {
        id: 'turn_3',
        text: '「為什麼是我？」',
        characterId: 'kitchen_voice',
        characterName: '聲音',
        characterPortrait: '/svg/characters/kitchen_voice.svg',
        characterPosition: 'right',
        speaker: 'player',
        autoAdvanceDelay: 1500,
      },
      {
        id: 'turn_4',
        text: '「因為你來了。因為你看到了。這就是責任感的開始。」',
        characterId: 'kitchen_voice',
        characterName: '聲音',
        characterPortrait: '/svg/characters/kitchen_voice.svg',
        characterPosition: 'right',
        speaker: 'character',
        autoAdvanceDelay: 2000,
      },
      {
        id: 'turn_5',
        text: '「你會處理這些問題嗎？」',
        characterId: 'kitchen_voice',
        characterName: '聲音',
        characterPortrait: '/svg/characters/kitchen_voice.svg',
        characterPosition: 'right',
        speaker: 'character',
        autoAdvance: false,
      },
    ],
    finalChoices: [
      {
        id: 'choice_handle_responsibility',
        text: '我會處理',
        weight: 10,
      },
      {
        id: 'choice_handle_partial',
        text: '我會試試看',
        weight: 5,
      },
      {
        id: 'choice_refuse',
        text: '這不是我的責任',
        weight: -10,
      },
    ],
    onComplete: {
      setFlag: 'character_2_complete',
    },
  },

  // 第一章 - 臥室 - 人影
  person_conversation: {
    id: 'person_conversation',
    turns: [
      {
        id: 'turn_1',
        text: '「你來了。」',
        characterId: 'bedroom_shadow',
        characterName: '模糊的人影',
        characterPortrait: '/svg/characters/bedroom_shadow.svg',
        characterPosition: 'left',
        speaker: 'character',
        autoAdvanceDelay: 1500,
      },
      {
        id: 'turn_2',
        text: '「這裡需要你。」',
        characterId: 'bedroom_shadow',
        characterName: '模糊的人影',
        characterPortrait: '/svg/characters/bedroom_shadow.svg',
        characterPosition: 'left',
        speaker: 'character',
        autoAdvanceDelay: 1500,
      },
      {
        id: 'turn_3',
        text: '「這些都是為你準備的。」',
        characterId: 'bedroom_shadow',
        characterName: '模糊的人影',
        characterPortrait: '/svg/characters/bedroom_shadow.svg',
        characterPosition: 'left',
        speaker: 'character',
        autoAdvanceDelay: 2000,
      },
      {
        id: 'turn_4',
        text: '「為什麼要留下來？」',
        characterId: 'bedroom_shadow',
        characterName: '模糊的人影',
        characterPortrait: '/svg/characters/bedroom_shadow.svg',
        characterPosition: 'left',
        speaker: 'player',
        autoAdvanceDelay: 1500,
      },
      {
        id: 'turn_5',
        text: '「世界第一次不問你是誰，只假設你會留下。這就是這個空間的規則。」',
        characterId: 'bedroom_shadow',
        characterName: '模糊的人影',
        characterPortrait: '/svg/characters/bedroom_shadow.svg',
        characterPosition: 'left',
        speaker: 'character',
        autoAdvance: false,
      },
    ],
    finalChoices: [
      {
        id: 'choice_accept_assumption',
        text: '我接受，我會留下',
        weight: 10,
      },
      {
        id: 'choice_hesitate_assumption',
        text: '我還需要時間思考',
        weight: 5,
      },
      {
        id: 'choice_reject_assumption',
        text: '這不公平，我想離開',
        weight: -10,
      },
    ],
    onComplete: {
      setFlag: 'person_complete',
    },
  },
};
