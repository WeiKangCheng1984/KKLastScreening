/**
 * 第三章：頭像第一次點擊對應與場景熱點相同的 oneTime 劇情事件（triggerEvent）。
 * 事件已觸發過時由 engine.triggerEvent 回傳 null，交由既有閒聊／敏感門檻／劉隊流程接續。
 */

const CH3_PORTRAIT_INTRO_BY_SCENE: Record<string, Record<string, string>> = {
  scene_ch3_lobby_front: {
    npc_liu: 'talk_liu_ch3_task',
  },
  scene_ch3_brand_room: {
    npc_song_yazhen: 'talk_song_ch3',
    npc_zhang_jingheng: 'talk_zhang_ch3',
    npc_gu_naiqian: 'talk_gu_brand_ch3',
    npc_lin_ruitang: 'talk_lin_ch3',
    npc_zhou_jie: 'talk_zhou_jie_ch3',
    npc_ashun: 'talk_ashun_ch3_server',
    npc_xiaozhang: 'talk_xiazhang_ch3',
  },
};

export function getCh3PortraitIntroEventId(sceneId: string, npcId: string): string | null {
  const row = CH3_PORTRAIT_INTRO_BY_SCENE[sceneId];
  if (!row) return null;
  return row[npcId] ?? null;
}
