/**
 * Strip Nikkud (vowel points) and cantillation marks from Hebrew/Aramaic text.
 * Removes Unicode range U+0591–U+05C7.
 */
export const stripNikkud = (text) => text.replace(/[\u0591-\u05C7]/g, '');

/**
 * Speak Hebrew/Aramaic text using the built-in iOS Hebrew TTS voice.
 * Works fully offline — no network required.
 */
export const speakHebrew = (text) => {
  if (!('speechSynthesis' in window)) return;
  // Cancel any ongoing speech first
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'he-IL';
  utterance.rate = 0.85;
  window.speechSynthesis.speak(utterance);
};
