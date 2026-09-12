const ROBOT = /espeak|festival|compact|dummy|robot|novelty|zarvox|trinoids|boing|bubbles|cellos|deranged|hysterical|whisper|junior|pipe organ|bad news|good news|superstar|albert|bahh|bells|organ/i;
const HUMANISH =
  /google|natural|neural|premium|enhanced|online|samantha|alex|daniel|karen|moira|tessa|fiona|rishi|siri|aria|guy|jenny|davis|jane|nancy|sonia|george|susan|tom|zira|mark|david desktop|hazel/i;

export function isRoboticVoiceName(name = "", uri = "") {
  return ROBOT.test(`${name} ${uri}`);
}

export function scoreDeviceVoice(voice = {}) {
  const name = String(voice.name || "");
  const uri = String(voice.voiceURI || voice.uri || "");
  const lang = String(voice.lang || "");
  let score = 0;
  if (/^en/i.test(lang)) score += 20;
  if (/en-US/i.test(lang)) score += 4;
  if (/en-GB/i.test(lang)) score += 3;
  if (voice.localService === false) score += 18;
  if (/google/i.test(name) || /google/i.test(uri)) score += 24;
  if (HUMANISH.test(name) || HUMANISH.test(uri)) score += 16;
  if (isRoboticVoiceName(name, uri)) score -= 40;
  if (/compact/i.test(name)) score -= 12;
  return score;
}

export function rankDeviceVoices(voices = []) {
  return [...voices].sort((a, b) => scoreDeviceVoice(b) - scoreDeviceVoice(a) || String(a.name).localeCompare(String(b.name)));
}

export function bestDeviceVoice(voices = []) {
  const ranked = rankDeviceVoices(voices).filter((voice) => !isRoboticVoiceName(voice.name, voice.voiceURI || voice.uri));
  return ranked[0] || rankDeviceVoices(voices)[0] || null;
}
