/**
 * Aramaic Verb Conjugation Engine
 * 
 * Generates conjugation tables for Aramaic (Babylonian Talmudic) verbs
 * based on the tri-literal root system and standard binyan patterns.
 */

// Sofit (final form) to regular form mapping
const SOFIT_TO_REGULAR = {
  '\u05DA': '\u05DB', // ך → כ
  '\u05DD': '\u05DE', // ם → מ
  '\u05DF': '\u05E0', // ן → נ
  '\u05E3': '\u05E4', // ף → פ
  '\u05E5': '\u05E6', // ץ → צ
};

// Map dictionary abbreviations to full binyan names and our internal keys
const BINYAN_MAP = {
  // Aramaic binyanim
  'Pa.': { key: 'pael', fullName: "Pa'el", type: 'aramaic' },
  'Pa. .': { key: 'pael', fullName: "Pa'el", type: 'aramaic' },
  'Af.': { key: 'afel', fullName: "Af'el", type: 'aramaic' },
  'Af. .': { key: 'afel', fullName: "Af'el", type: 'aramaic' },
  'Ithpe.': { key: 'ithpeel', fullName: "Ithpe'el", type: 'aramaic' },
  ' Ithpe.': { key: 'ithpeel', fullName: "Ithpe'el", type: 'aramaic' },
  'Ithpa.': { key: 'ithpaal', fullName: "Ithpa'al", type: 'aramaic' },
  'Ittaf.': { key: 'ittafal', fullName: "Ittaf'al", type: 'aramaic' },
  'Ishtaf.': { key: 'ishtafal', fullName: "Ishtaf'al", type: 'aramaic' },
  'Palp.': { key: 'palpal', fullName: "Palpal", type: 'aramaic' },
  'Ithpalp.': { key: 'ithpalpal', fullName: "Ithpalpal", type: 'aramaic' },
  'Pe.': { key: 'peal', fullName: "Pe'al", type: 'aramaic' },
  // Hebrew binyanim
  'Nif.': { key: 'nifal', fullName: "Nif'al", type: 'hebrew' },
  'Pi.': { key: 'piel', fullName: "Pi'el", type: 'hebrew' },
  'Pu.': { key: 'pual', fullName: "Pu'al", type: 'hebrew' },
  'Hif.': { key: 'hifil', fullName: "Hif'il", type: 'hebrew' },
  'Hof.': { key: 'hofal', fullName: "Hof'al", type: 'hebrew' },
  'Hithpa.': { key: 'hitpael', fullName: "Hitpa'el", type: 'hebrew' },
  'Nithpa.': { key: 'nitpael', fullName: "Nitpa'el", type: 'hebrew' },
};

/**
 * Normalize a sofit (final form) letter to its regular form.
 * When a root letter appears at the end of a word, Hebrew uses final forms,
 * but for conjugation we need the regular form.
 */
function normalizeSofit(letter) {
  return SOFIT_TO_REGULAR[letter] || letter;
}

/**
 * Extract the consonantal root from a headword by stripping nikkud.
 * Converts final-form (sofit) letters to their regular form for conjugation.
 */
export function extractRoot(headword) {
  if (!headword) return null;
  
  // Strip all Hebrew nikkud/vowel marks and cantillation
  const stripped = headword
    .replace(/[\u0591-\u05C7]/g, '') // strip nikkud and cantillation
    .replace(/[\s,.*()\/-]/g, '')    // strip whitespace and punctuation
    .replace(/[^\u05D0-\u05EA]/g, ''); // keep only Hebrew consonants
  
  // For standard tri-literal roots, we expect 2-4 consonants
  if (stripped.length >= 2 && stripped.length <= 4) {
    // Normalize sofit letters (especially the last one which is most common)
    return stripped.split('').map(normalizeSofit);
  }
  
  return null;
}

/**
 * Check if a binyan name is an Aramaic binyan we can conjugate
 */
export function isAramaicBinyan(binyanName) {
  const trimmed = binyanName.trim();
  return BINYAN_MAP.hasOwnProperty(trimmed) || BINYAN_MAP.hasOwnProperty(binyanName);
}

/**
 * Get binyan info from its dictionary abbreviation
 */
export function getBinyanInfo(binyanName) {
  const trimmed = binyanName.trim();
  return BINYAN_MAP[trimmed] || BINYAN_MAP[binyanName] || null;
}

/**
 * Check if a binyan is Hebrew (not Aramaic)
 */
export function isHebrewBinyan(binyanName) {
  const info = getBinyanInfo(binyanName);
  return info ? info.type === 'hebrew' : false;
}

// ============================================================
// CONJUGATION TEMPLATES
// Each template takes root consonants [R1, R2, R3] and returns
// the conjugated form with nikkud.
// ============================================================

const TENSE_LABELS = {
  past: 'Past (Perfect)',
  future: 'Future (Imperfect)',
  imperative: 'Imperative',
  activeParticiple: 'Active Participle',
  passiveParticiple: 'Passive Participle',
};

const PERSON_LABELS = {
  '3ms': { label: 'He', hebrew: 'הוא', person: '3rd', gender: 'masc.', number: 'sg.' },
  '3fs': { label: 'She', hebrew: 'היא', person: '3rd', gender: 'fem.', number: 'sg.' },
  '2ms': { label: 'You (m.)', hebrew: 'אַתְּ', person: '2nd', gender: 'masc.', number: 'sg.' },
  '2fs': { label: 'You (f.)', hebrew: 'אַתִּי', person: '2nd', gender: 'fem.', number: 'sg.' },
  '1cs': { label: 'I', hebrew: 'אֲנָא', person: '1st', gender: 'common', number: 'sg.' },
  '3cp': { label: 'They', hebrew: 'אִנּוּן', person: '3rd', gender: 'common', number: 'pl.' },
  '2mp': { label: 'You all (m.)', hebrew: 'אַתּוּן', person: '2nd', gender: 'masc.', number: 'pl.' },
  '2fp': { label: 'You all (f.)', hebrew: 'אַתֵּין', person: '2nd', gender: 'fem.', number: 'pl.' },
  '1cp': { label: 'We', hebrew: 'אֲנַחְנָא', person: '1st', gender: 'common', number: 'pl.' },
  'ms': { label: 'Masc. sg.', person: '', gender: 'masc.', number: 'sg.' },
  'fs': { label: 'Fem. sg.', person: '', gender: 'fem.', number: 'sg.' },
  'mp': { label: 'Masc. pl.', person: '', gender: 'masc.', number: 'pl.' },
  'fp': { label: 'Fem. pl.', person: '', gender: 'fem.', number: 'pl.' },
};

// Pe'al conjugation templates
const PEAL = {
  past: [
    { person: '3ms', form: (r) => `${r[0]}\u05B0${r[1]}\u05B7${r[2]}` },
    { person: '3fs', form: (r) => `${r[0]}\u05B0${r[1]}\u05B8${r[2]}\u05B7\u05EA` },
    { person: '2ms', form: (r) => `${r[0]}\u05B0${r[1]}\u05B7${r[2]}\u05B0\u05EA\u05BC` },
    { person: '2fs', form: (r) => `${r[0]}\u05B0${r[1]}\u05B7${r[2]}\u05B0\u05EA\u05BC\u05B4\u05D9` },
    { person: '1cs', form: (r) => `${r[0]}\u05B0${r[1]}\u05B7${r[2]}\u05B4\u05D9\u05EA` },
    { person: '3cp', form: (r) => `${r[0]}\u05B0${r[1]}\u05B7${r[2]}\u05D5\u05BC` },
    { person: '2mp', form: (r) => `${r[0]}\u05B0${r[1]}\u05B7${r[2]}\u05B0\u05EA\u05BC\u05D5\u05BC\u05DF` },
    { person: '2fp', form: (r) => `${r[0]}\u05B0${r[1]}\u05B7${r[2]}\u05B0\u05EA\u05BC\u05B5\u05D9\u05DF` },
    { person: '1cp', form: (r) => `${r[0]}\u05B0${r[1]}\u05B7${r[2]}\u05B0\u05E0\u05B8\u05D0` },
  ],
  future: [
    { person: '3ms', form: (r) => `\u05D9\u05B4${r[0]}\u05B0${r[1]}\u05D5\u05B9${r[2]}` },
    { person: '3fs', form: (r) => `\u05EA\u05BC\u05B4${r[0]}\u05B0${r[1]}\u05D5\u05B9${r[2]}` },
    { person: '2ms', form: (r) => `\u05EA\u05BC\u05B4${r[0]}\u05B0${r[1]}\u05D5\u05B9${r[2]}` },
    { person: '2fs', form: (r) => `\u05EA\u05BC\u05B4${r[0]}\u05B0${r[1]}\u05B0${r[2]}\u05B4\u05D9\u05DF` },
    { person: '1cs', form: (r) => `\u05D0\u05B6${r[0]}\u05B0${r[1]}\u05D5\u05B9${r[2]}` },
    { person: '3cp', form: (r) => `\u05D9\u05B4${r[0]}\u05B0${r[1]}\u05B0${r[2]}\u05D5\u05BC\u05DF` },
    { person: '2mp', form: (r) => `\u05EA\u05BC\u05B4${r[0]}\u05B0${r[1]}\u05B0${r[2]}\u05D5\u05BC\u05DF` },
    { person: '2fp', form: (r) => `\u05EA\u05BC\u05B4${r[0]}\u05B0${r[1]}\u05B0${r[2]}\u05B8\u05DF` },
    { person: '1cp', form: (r) => `\u05E0\u05B4${r[0]}\u05B0${r[1]}\u05D5\u05B9${r[2]}` },
  ],
  imperative: [
    { person: '2ms', form: (r) => `${r[0]}\u05B0${r[1]}\u05D5\u05B9${r[2]}` },
    { person: '2fs', form: (r) => `${r[0]}\u05B4${r[1]}\u05B0${r[2]}\u05B4\u05D9` },
    { person: '2mp', form: (r) => `${r[0]}\u05B4${r[1]}\u05B0${r[2]}\u05D5\u05BC` },
    { person: '2fp', form: (r) => `${r[0]}\u05B0${r[1]}\u05D5\u05B9${r[2]}\u05B8\u05DF` },
  ],
  activeParticiple: [
    { person: 'ms', form: (r) => `${r[0]}\u05B8${r[1]}\u05B5${r[2]}` },
    { person: 'fs', form: (r) => `${r[0]}\u05B8${r[1]}\u05B0${r[2]}\u05B8\u05D0` },
    { person: 'mp', form: (r) => `${r[0]}\u05B8${r[1]}\u05B0${r[2]}\u05B4\u05D9\u05DF` },
    { person: 'fp', form: (r) => `${r[0]}\u05B8${r[1]}\u05B0${r[2]}\u05B8\u05DF` },
  ],
  passiveParticiple: [
    { person: 'ms', form: (r) => `${r[0]}\u05B0${r[1]}\u05B4\u05D9${r[2]}` },
    { person: 'fs', form: (r) => `${r[0]}\u05B0${r[1]}\u05B4\u05D9${r[2]}\u05B8\u05D0` },
    { person: 'mp', form: (r) => `${r[0]}\u05B0${r[1]}\u05B4\u05D9${r[2]}\u05B4\u05D9\u05DF` },
    { person: 'fp', form: (r) => `${r[0]}\u05B0${r[1]}\u05B4\u05D9${r[2]}\u05B8\u05DF` },
  ],
};

// Pa'el conjugation templates
const PAEL = {
  past: [
    { person: '3ms', form: (r) => `${r[0]}\u05B7${r[1]}\u05BC\u05B5${r[2]}` },
    { person: '3fs', form: (r) => `${r[0]}\u05B7${r[1]}\u05BC\u05B0${r[2]}\u05B7\u05EA` },
    { person: '2ms', form: (r) => `${r[0]}\u05B7${r[1]}\u05BC\u05B5${r[2]}\u05B0\u05EA\u05BC` },
    { person: '2fs', form: (r) => `${r[0]}\u05B7${r[1]}\u05BC\u05B5${r[2]}\u05B0\u05EA\u05BC\u05B4\u05D9` },
    { person: '1cs', form: (r) => `${r[0]}\u05B7${r[1]}\u05BC\u05B5${r[2]}\u05B4\u05D9\u05EA` },
    { person: '3cp', form: (r) => `${r[0]}\u05B7${r[1]}\u05BC\u05B5${r[2]}\u05D5\u05BC` },
    { person: '2mp', form: (r) => `${r[0]}\u05B7${r[1]}\u05BC\u05B5${r[2]}\u05B0\u05EA\u05BC\u05D5\u05BC\u05DF` },
    { person: '2fp', form: (r) => `${r[0]}\u05B7${r[1]}\u05BC\u05B5${r[2]}\u05B0\u05EA\u05BC\u05B5\u05D9\u05DF` },
    { person: '1cp', form: (r) => `${r[0]}\u05B7${r[1]}\u05BC\u05B5${r[2]}\u05B0\u05E0\u05B8\u05D0` },
  ],
  future: [
    { person: '3ms', form: (r) => `\u05D9\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B5${r[2]}` },
    { person: '3fs', form: (r) => `\u05EA\u05BC\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B5${r[2]}` },
    { person: '2ms', form: (r) => `\u05EA\u05BC\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B5${r[2]}` },
    { person: '2fs', form: (r) => `\u05EA\u05BC\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B0${r[2]}\u05B4\u05D9\u05DF` },
    { person: '1cs', form: (r) => `\u05D0\u05B2${r[0]}\u05B7${r[1]}\u05BC\u05B5${r[2]}` },
    { person: '3cp', form: (r) => `\u05D9\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B0${r[2]}\u05D5\u05BC\u05DF` },
    { person: '2mp', form: (r) => `\u05EA\u05BC\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B0${r[2]}\u05D5\u05BC\u05DF` },
    { person: '2fp', form: (r) => `\u05EA\u05BC\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B0${r[2]}\u05B8\u05DF` },
    { person: '1cp', form: (r) => `\u05E0\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B5${r[2]}` },
  ],
  imperative: [
    { person: '2ms', form: (r) => `${r[0]}\u05B7${r[1]}\u05BC\u05B5${r[2]}` },
    { person: '2fs', form: (r) => `${r[0]}\u05B7${r[1]}\u05BC\u05B0${r[2]}\u05B4\u05D9` },
    { person: '2mp', form: (r) => `${r[0]}\u05B7${r[1]}\u05BC\u05B0${r[2]}\u05D5\u05BC` },
    { person: '2fp', form: (r) => `${r[0]}\u05B7${r[1]}\u05BC\u05B5${r[2]}\u05B8\u05DF` },
  ],
  activeParticiple: [
    { person: 'ms', form: (r) => `\u05DE\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B5${r[2]}` },
    { person: 'fs', form: (r) => `\u05DE\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B0${r[2]}\u05B8\u05D0` },
    { person: 'mp', form: (r) => `\u05DE\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B0${r[2]}\u05B4\u05D9\u05DF` },
    { person: 'fp', form: (r) => `\u05DE\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B0${r[2]}\u05B8\u05DF` },
  ],
};

// Af'el conjugation templates
const AFEL = {
  past: [
    { person: '3ms', form: (r) => `\u05D0\u05B7${r[0]}\u05B0${r[1]}\u05B5${r[2]}` },
    { person: '3fs', form: (r) => `\u05D0\u05B7${r[0]}\u05B0${r[1]}\u05B0${r[2]}\u05B7\u05EA` },
    { person: '2ms', form: (r) => `\u05D0\u05B7${r[0]}\u05B0${r[1]}\u05B5${r[2]}\u05B0\u05EA\u05BC` },
    { person: '2fs', form: (r) => `\u05D0\u05B7${r[0]}\u05B0${r[1]}\u05B5${r[2]}\u05B0\u05EA\u05BC\u05B4\u05D9` },
    { person: '1cs', form: (r) => `\u05D0\u05B7${r[0]}\u05B0${r[1]}\u05B5${r[2]}\u05B4\u05D9\u05EA` },
    { person: '3cp', form: (r) => `\u05D0\u05B7${r[0]}\u05B0${r[1]}\u05B5${r[2]}\u05D5\u05BC` },
    { person: '2mp', form: (r) => `\u05D0\u05B7${r[0]}\u05B0${r[1]}\u05B5${r[2]}\u05B0\u05EA\u05BC\u05D5\u05BC\u05DF` },
    { person: '2fp', form: (r) => `\u05D0\u05B7${r[0]}\u05B0${r[1]}\u05B5${r[2]}\u05B0\u05EA\u05BC\u05B5\u05D9\u05DF` },
    { person: '1cp', form: (r) => `\u05D0\u05B7${r[0]}\u05B0${r[1]}\u05B5${r[2]}\u05B0\u05E0\u05B8\u05D0` },
  ],
  future: [
    { person: '3ms', form: (r) => `\u05D9\u05B7${r[0]}\u05B0${r[1]}\u05B5${r[2]}` },
    { person: '3fs', form: (r) => `\u05EA\u05BC\u05B7${r[0]}\u05B0${r[1]}\u05B5${r[2]}` },
    { person: '2ms', form: (r) => `\u05EA\u05BC\u05B7${r[0]}\u05B0${r[1]}\u05B5${r[2]}` },
    { person: '2fs', form: (r) => `\u05EA\u05BC\u05B7${r[0]}\u05B0${r[1]}\u05B0${r[2]}\u05B4\u05D9\u05DF` },
    { person: '1cs', form: (r) => `\u05D0\u05B7${r[0]}\u05B0${r[1]}\u05B5${r[2]}` },
    { person: '3cp', form: (r) => `\u05D9\u05B7${r[0]}\u05B0${r[1]}\u05B0${r[2]}\u05D5\u05BC\u05DF` },
    { person: '2mp', form: (r) => `\u05EA\u05BC\u05B7${r[0]}\u05B0${r[1]}\u05B0${r[2]}\u05D5\u05BC\u05DF` },
    { person: '2fp', form: (r) => `\u05EA\u05BC\u05B7${r[0]}\u05B0${r[1]}\u05B0${r[2]}\u05B8\u05DF` },
    { person: '1cp', form: (r) => `\u05E0\u05B7${r[0]}\u05B0${r[1]}\u05B5${r[2]}` },
  ],
  imperative: [
    { person: '2ms', form: (r) => `\u05D0\u05B7${r[0]}\u05B0${r[1]}\u05B5${r[2]}` },
    { person: '2fs', form: (r) => `\u05D0\u05B7${r[0]}\u05B0${r[1]}\u05B0${r[2]}\u05B4\u05D9` },
    { person: '2mp', form: (r) => `\u05D0\u05B7${r[0]}\u05B0${r[1]}\u05B0${r[2]}\u05D5\u05BC` },
    { person: '2fp', form: (r) => `\u05D0\u05B7${r[0]}\u05B0${r[1]}\u05B5${r[2]}\u05B8\u05DF` },
  ],
  activeParticiple: [
    { person: 'ms', form: (r) => `\u05DE\u05B7${r[0]}\u05B0${r[1]}\u05B5${r[2]}` },
    { person: 'fs', form: (r) => `\u05DE\u05B7${r[0]}\u05B0${r[1]}\u05B0${r[2]}\u05B8\u05D0` },
    { person: 'mp', form: (r) => `\u05DE\u05B7${r[0]}\u05B0${r[1]}\u05B0${r[2]}\u05B4\u05D9\u05DF` },
    { person: 'fp', form: (r) => `\u05DE\u05B7${r[0]}\u05B0${r[1]}\u05B0${r[2]}\u05B8\u05DF` },
  ],
};

// Ithpe'el conjugation templates
const ITHPEEL = {
  past: [
    { person: '3ms', form: (r) => `\u05D0\u05B4\u05EA\u05B0${r[0]}\u05B0${r[1]}\u05B5${r[2]}` },
    { person: '3fs', form: (r) => `\u05D0\u05B4\u05EA\u05B0${r[0]}\u05B0${r[1]}\u05B4${r[2]}\u05B7\u05EA` },
    { person: '2ms', form: (r) => `\u05D0\u05B4\u05EA\u05B0${r[0]}\u05B0${r[1]}\u05B5${r[2]}\u05B0\u05EA\u05BC` },
    { person: '2fs', form: (r) => `\u05D0\u05B4\u05EA\u05B0${r[0]}\u05B0${r[1]}\u05B5${r[2]}\u05B0\u05EA\u05BC\u05B4\u05D9` },
    { person: '1cs', form: (r) => `\u05D0\u05B4\u05EA\u05B0${r[0]}\u05B0${r[1]}\u05B5${r[2]}\u05B4\u05D9\u05EA` },
    { person: '3cp', form: (r) => `\u05D0\u05B4\u05EA\u05B0${r[0]}\u05B0${r[1]}\u05B5${r[2]}\u05D5\u05BC` },
    { person: '2mp', form: (r) => `\u05D0\u05B4\u05EA\u05B0${r[0]}\u05B0${r[1]}\u05B5${r[2]}\u05B0\u05EA\u05BC\u05D5\u05BC\u05DF` },
    { person: '2fp', form: (r) => `\u05D0\u05B4\u05EA\u05B0${r[0]}\u05B0${r[1]}\u05B5${r[2]}\u05B0\u05EA\u05BC\u05B5\u05D9\u05DF` },
    { person: '1cp', form: (r) => `\u05D0\u05B4\u05EA\u05B0${r[0]}\u05B0${r[1]}\u05B5${r[2]}\u05B0\u05E0\u05B8\u05D0` },
  ],
  future: [
    { person: '3ms', form: (r) => `\u05D9\u05B4\u05EA\u05B0${r[0]}\u05B0${r[1]}\u05B5${r[2]}` },
    { person: '3fs', form: (r) => `\u05EA\u05BC\u05B4\u05EA\u05B0${r[0]}\u05B0${r[1]}\u05B5${r[2]}` },
    { person: '2ms', form: (r) => `\u05EA\u05BC\u05B4\u05EA\u05B0${r[0]}\u05B0${r[1]}\u05B5${r[2]}` },
    { person: '2fs', form: (r) => `\u05EA\u05BC\u05B4\u05EA\u05B0${r[0]}\u05B0${r[1]}\u05B0${r[2]}\u05B4\u05D9\u05DF` },
    { person: '1cs', form: (r) => `\u05D0\u05B6\u05EA\u05B0${r[0]}\u05B0${r[1]}\u05B5${r[2]}` },
    { person: '3cp', form: (r) => `\u05D9\u05B4\u05EA\u05B0${r[0]}\u05B0${r[1]}\u05B0${r[2]}\u05D5\u05BC\u05DF` },
    { person: '2mp', form: (r) => `\u05EA\u05BC\u05B4\u05EA\u05B0${r[0]}\u05B0${r[1]}\u05B0${r[2]}\u05D5\u05BC\u05DF` },
    { person: '2fp', form: (r) => `\u05EA\u05BC\u05B4\u05EA\u05B0${r[0]}\u05B0${r[1]}\u05B0${r[2]}\u05B8\u05DF` },
    { person: '1cp', form: (r) => `\u05E0\u05B4\u05EA\u05B0${r[0]}\u05B0${r[1]}\u05B5${r[2]}` },
  ],
  activeParticiple: [
    { person: 'ms', form: (r) => `\u05DE\u05B4\u05EA\u05B0${r[0]}\u05B0${r[1]}\u05B5${r[2]}` },
    { person: 'fs', form: (r) => `\u05DE\u05B4\u05EA\u05B0${r[0]}\u05B0${r[1]}\u05B0${r[2]}\u05B8\u05D0` },
    { person: 'mp', form: (r) => `\u05DE\u05B4\u05EA\u05B0${r[0]}\u05B0${r[1]}\u05B0${r[2]}\u05B4\u05D9\u05DF` },
    { person: 'fp', form: (r) => `\u05DE\u05B4\u05EA\u05B0${r[0]}\u05B0${r[1]}\u05B0${r[2]}\u05B8\u05DF` },
  ],
};

// Ithpa'al conjugation templates
const ITHPAAL = {
  past: [
    { person: '3ms', form: (r) => `\u05D0\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B7${r[2]}` },
    { person: '3fs', form: (r) => `\u05D0\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B0${r[2]}\u05B7\u05EA` },
    { person: '2ms', form: (r) => `\u05D0\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B7${r[2]}\u05B0\u05EA\u05BC` },
    { person: '2fs', form: (r) => `\u05D0\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B7${r[2]}\u05B0\u05EA\u05BC\u05B4\u05D9` },
    { person: '1cs', form: (r) => `\u05D0\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B7${r[2]}\u05B4\u05D9\u05EA` },
    { person: '3cp', form: (r) => `\u05D0\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B7${r[2]}\u05D5\u05BC` },
    { person: '2mp', form: (r) => `\u05D0\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B7${r[2]}\u05B0\u05EA\u05BC\u05D5\u05BC\u05DF` },
    { person: '2fp', form: (r) => `\u05D0\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B7${r[2]}\u05B0\u05EA\u05BC\u05B5\u05D9\u05DF` },
    { person: '1cp', form: (r) => `\u05D0\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B7${r[2]}\u05B0\u05E0\u05B8\u05D0` },
  ],
  future: [
    { person: '3ms', form: (r) => `\u05D9\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B7${r[2]}` },
    { person: '3fs', form: (r) => `\u05EA\u05BC\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B7${r[2]}` },
    { person: '2ms', form: (r) => `\u05EA\u05BC\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B7${r[2]}` },
    { person: '2fs', form: (r) => `\u05EA\u05BC\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B0${r[2]}\u05B4\u05D9\u05DF` },
    { person: '1cs', form: (r) => `\u05D0\u05B6\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B7${r[2]}` },
    { person: '3cp', form: (r) => `\u05D9\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B0${r[2]}\u05D5\u05BC\u05DF` },
    { person: '2mp', form: (r) => `\u05EA\u05BC\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B0${r[2]}\u05D5\u05BC\u05DF` },
    { person: '2fp', form: (r) => `\u05EA\u05BC\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B0${r[2]}\u05B8\u05DF` },
    { person: '1cp', form: (r) => `\u05E0\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B7${r[2]}` },
  ],
  activeParticiple: [
    { person: 'ms', form: (r) => `\u05DE\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B7${r[2]}` },
    { person: 'fs', form: (r) => `\u05DE\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B0${r[2]}\u05B8\u05D0` },
    { person: 'mp', form: (r) => `\u05DE\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B0${r[2]}\u05B4\u05D9\u05DF` },
    { person: 'fp', form: (r) => `\u05DE\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B0${r[2]}\u05B8\u05DF` },
  ],
};

// Ittaf'al conjugation templates
const ITTAFAL = {
  past: [
    { person: '3ms', form: (r) => `\u05D0\u05B4\u05EA\u05BC\u05B7${r[0]}\u05B0${r[1]}\u05B7${r[2]}` },
    { person: '3fs', form: (r) => `\u05D0\u05B4\u05EA\u05BC\u05B7${r[0]}\u05B0${r[1]}\u05B0${r[2]}\u05B7\u05EA` },
    { person: '2ms', form: (r) => `\u05D0\u05B4\u05EA\u05BC\u05B7${r[0]}\u05B0${r[1]}\u05B7${r[2]}\u05B0\u05EA\u05BC` },
    { person: '2fs', form: (r) => `\u05D0\u05B4\u05EA\u05BC\u05B7${r[0]}\u05B0${r[1]}\u05B7${r[2]}\u05B0\u05EA\u05BC\u05B4\u05D9` },
    { person: '1cs', form: (r) => `\u05D0\u05B4\u05EA\u05BC\u05B7${r[0]}\u05B0${r[1]}\u05B7${r[2]}\u05B4\u05D9\u05EA` },
    { person: '3cp', form: (r) => `\u05D0\u05B4\u05EA\u05BC\u05B7${r[0]}\u05B0${r[1]}\u05B7${r[2]}\u05D5\u05BC` },
    { person: '2mp', form: (r) => `\u05D0\u05B4\u05EA\u05BC\u05B7${r[0]}\u05B0${r[1]}\u05B7${r[2]}\u05B0\u05EA\u05BC\u05D5\u05BC\u05DF` },
    { person: '2fp', form: (r) => `\u05D0\u05B4\u05EA\u05BC\u05B7${r[0]}\u05B0${r[1]}\u05B7${r[2]}\u05B0\u05EA\u05BC\u05B5\u05D9\u05DF` },
    { person: '1cp', form: (r) => `\u05D0\u05B4\u05EA\u05BC\u05B7${r[0]}\u05B0${r[1]}\u05B7${r[2]}\u05B0\u05E0\u05B8\u05D0` },
  ],
  future: [
    { person: '3ms', form: (r) => `\u05D9\u05B4\u05EA\u05BC\u05B7${r[0]}\u05B0${r[1]}\u05B7${r[2]}` },
    { person: '3fs', form: (r) => `\u05EA\u05BC\u05B4\u05EA\u05BC\u05B7${r[0]}\u05B0${r[1]}\u05B7${r[2]}` },
    { person: '2ms', form: (r) => `\u05EA\u05BC\u05B4\u05EA\u05BC\u05B7${r[0]}\u05B0${r[1]}\u05B7${r[2]}` },
    { person: '2fs', form: (r) => `\u05EA\u05BC\u05B4\u05EA\u05BC\u05B7${r[0]}\u05B0${r[1]}\u05B0${r[2]}\u05B4\u05D9\u05DF` },
    { person: '1cs', form: (r) => `\u05D0\u05B6\u05EA\u05BC\u05B7${r[0]}\u05B0${r[1]}\u05B7${r[2]}` },
    { person: '3cp', form: (r) => `\u05D9\u05B4\u05EA\u05BC\u05B7${r[0]}\u05B0${r[1]}\u05B0${r[2]}\u05D5\u05BC\u05DF` },
    { person: '2mp', form: (r) => `\u05EA\u05BC\u05B4\u05EA\u05BC\u05B7${r[0]}\u05B0${r[1]}\u05B0${r[2]}\u05D5\u05BC\u05DF` },
    { person: '2fp', form: (r) => `\u05EA\u05BC\u05B4\u05EA\u05BC\u05B7${r[0]}\u05B0${r[1]}\u05B0${r[2]}\u05B8\u05DF` },
    { person: '1cp', form: (r) => `\u05E0\u05B4\u05EA\u05BC\u05B7${r[0]}\u05B0${r[1]}\u05B7${r[2]}` },
  ],
  activeParticiple: [
    { person: 'ms', form: (r) => `\u05DE\u05B4\u05EA\u05BC\u05B7${r[0]}\u05B0${r[1]}\u05B7${r[2]}` },
    { person: 'fs', form: (r) => `\u05DE\u05B4\u05EA\u05BC\u05B7${r[0]}\u05B0${r[1]}\u05B0${r[2]}\u05B8\u05D0` },
    { person: 'mp', form: (r) => `\u05DE\u05B4\u05EA\u05BC\u05B7${r[0]}\u05B0${r[1]}\u05B0${r[2]}\u05B4\u05D9\u05DF` },
    { person: 'fp', form: (r) => `\u05DE\u05B4\u05EA\u05BC\u05B7${r[0]}\u05B0${r[1]}\u05B0${r[2]}\u05B8\u05DF` },
  ],
};

// ============================================================
// HEBREW PERSON LABELS
// ============================================================

const HEBREW_PERSON_LABELS = {
  '3ms': { label: 'He', hebrew: 'הוּא', person: '3rd', gender: 'masc.', number: 'sg.' },
  '3fs': { label: 'She', hebrew: 'הִיא', person: '3rd', gender: 'fem.', number: 'sg.' },
  '2ms': { label: 'You (m.)', hebrew: 'אַתָּה', person: '2nd', gender: 'masc.', number: 'sg.' },
  '2fs': { label: 'You (f.)', hebrew: 'אַתְּ', person: '2nd', gender: 'fem.', number: 'sg.' },
  '1cs': { label: 'I', hebrew: 'אֲנִי', person: '1st', gender: 'common', number: 'sg.' },
  '3mp': { label: 'They (m.)', hebrew: 'הֵם', person: '3rd', gender: 'masc.', number: 'pl.' },
  '3fp': { label: 'They (f.)', hebrew: 'הֵן', person: '3rd', gender: 'fem.', number: 'pl.' },
  '2mp': { label: 'You all (m.)', hebrew: 'אַתֶּם', person: '2nd', gender: 'masc.', number: 'pl.' },
  '2fp': { label: 'You all (f.)', hebrew: 'אַתֶּן', person: '2nd', gender: 'fem.', number: 'pl.' },
  '1cp': { label: 'We', hebrew: 'אֲנַחְנוּ', person: '1st', gender: 'common', number: 'pl.' },
  'ms': { label: 'Masc. sg.', person: '', gender: 'masc.', number: 'sg.' },
  'fs': { label: 'Fem. sg.', person: '', gender: 'fem.', number: 'sg.' },
  'mp': { label: 'Masc. pl.', person: '', gender: 'masc.', number: 'pl.' },
  'fp': { label: 'Fem. pl.', person: '', gender: 'fem.', number: 'pl.' },
};

// ============================================================
// HEBREW CONJUGATION TEMPLATES
// Standard Biblical Hebrew strong verb (regular) paradigms
// ============================================================

// Qal (Pa'al) — basic active
const QAL = {
  past: [
    { person: '3ms', form: (r) => `${r[0]}\u05B8${r[1]}\u05B7${r[2]}` },
    { person: '3fs', form: (r) => `${r[0]}\u05B8${r[1]}\u05B0${r[2]}\u05B8\u05D4` },
    { person: '2ms', form: (r) => `${r[0]}\u05B8${r[1]}\u05B7${r[2]}\u05B0\u05EA\u05BC\u05B8` },
    { person: '2fs', form: (r) => `${r[0]}\u05B8${r[1]}\u05B7${r[2]}\u05B0\u05EA\u05BC` },
    { person: '1cs', form: (r) => `${r[0]}\u05B8${r[1]}\u05B7${r[2]}\u05B0\u05EA\u05BC\u05B4\u05D9` },
    { person: '3cp', form: (r) => `${r[0]}\u05B8${r[1]}\u05B0${r[2]}\u05D5\u05BC` },
    { person: '2mp', form: (r) => `${r[0]}\u05B0${r[1]}\u05B7${r[2]}\u05B0\u05EA\u05BC\u05B6\u05DD` },
    { person: '2fp', form: (r) => `${r[0]}\u05B0${r[1]}\u05B7${r[2]}\u05B0\u05EA\u05BC\u05B6\u05DF` },
    { person: '1cp', form: (r) => `${r[0]}\u05B8${r[1]}\u05B7${r[2]}\u05B0\u05E0\u05D5\u05BC` },
  ],
  future: [
    { person: '3ms', form: (r) => `\u05D9\u05B4${r[0]}\u05B0${r[1]}\u05B9${r[2]}` },
    { person: '3fs', form: (r) => `\u05EA\u05BC\u05B4${r[0]}\u05B0${r[1]}\u05B9${r[2]}` },
    { person: '2ms', form: (r) => `\u05EA\u05BC\u05B4${r[0]}\u05B0${r[1]}\u05B9${r[2]}` },
    { person: '2fs', form: (r) => `\u05EA\u05BC\u05B4${r[0]}\u05B0${r[1]}\u05B0${r[2]}\u05B4\u05D9` },
    { person: '1cs', form: (r) => `\u05D0\u05B6${r[0]}\u05B0${r[1]}\u05B9${r[2]}` },
    { person: '3mp', form: (r) => `\u05D9\u05B4${r[0]}\u05B0${r[1]}\u05B0${r[2]}\u05D5\u05BC` },
    { person: '3fp', form: (r) => `\u05EA\u05BC\u05B4${r[0]}\u05B0${r[1]}\u05B9${r[2]}\u05B0\u05E0\u05B8\u05D4` },
    { person: '2mp', form: (r) => `\u05EA\u05BC\u05B4${r[0]}\u05B0${r[1]}\u05B0${r[2]}\u05D5\u05BC` },
    { person: '2fp', form: (r) => `\u05EA\u05BC\u05B4${r[0]}\u05B0${r[1]}\u05B9${r[2]}\u05B0\u05E0\u05B8\u05D4` },
    { person: '1cp', form: (r) => `\u05E0\u05B4${r[0]}\u05B0${r[1]}\u05B9${r[2]}` },
  ],
  imperative: [
    { person: '2ms', form: (r) => `${r[0]}\u05B0${r[1]}\u05B9${r[2]}` },
    { person: '2fs', form: (r) => `${r[0]}\u05B4${r[1]}\u05B0${r[2]}\u05B4\u05D9` },
    { person: '2mp', form: (r) => `${r[0]}\u05B4${r[1]}\u05B0${r[2]}\u05D5\u05BC` },
    { person: '2fp', form: (r) => `${r[0]}\u05B0${r[1]}\u05B9${r[2]}\u05B0\u05E0\u05B8\u05D4` },
  ],
  activeParticiple: [
    { person: 'ms', form: (r) => `${r[0]}\u05B9${r[1]}\u05B5${r[2]}` },
    { person: 'fs', form: (r) => `${r[0]}\u05B9${r[1]}\u05B6${r[2]}\u05B6\u05EA` },
    { person: 'mp', form: (r) => `${r[0]}\u05B9${r[1]}\u05B0${r[2]}\u05B4\u05D9\u05DD` },
    { person: 'fp', form: (r) => `${r[0]}\u05B9${r[1]}\u05B0${r[2]}\u05D5\u05B9\u05EA` },
  ],
  passiveParticiple: [
    { person: 'ms', form: (r) => `${r[0]}\u05B8${r[1]}\u05D5\u05BC${r[2]}` },
    { person: 'fs', form: (r) => `${r[0]}\u05B0${r[1]}\u05D5\u05BC${r[2]}\u05B8\u05D4` },
    { person: 'mp', form: (r) => `${r[0]}\u05B0${r[1]}\u05D5\u05BC${r[2]}\u05B4\u05D9\u05DD` },
    { person: 'fp', form: (r) => `${r[0]}\u05B0${r[1]}\u05D5\u05BC${r[2]}\u05D5\u05B9\u05EA` },
  ],
};

// Nif'al — passive/reflexive of Qal
const NIFAL = {
  past: [
    { person: '3ms', form: (r) => `\u05E0\u05B4${r[0]}\u05B0${r[1]}\u05B7${r[2]}` },
    { person: '3fs', form: (r) => `\u05E0\u05B4${r[0]}\u05B0${r[1]}\u05B0${r[2]}\u05B8\u05D4` },
    { person: '2ms', form: (r) => `\u05E0\u05B4${r[0]}\u05B0${r[1]}\u05B7${r[2]}\u05B0\u05EA\u05BC\u05B8` },
    { person: '2fs', form: (r) => `\u05E0\u05B4${r[0]}\u05B0${r[1]}\u05B7${r[2]}\u05B0\u05EA\u05BC` },
    { person: '1cs', form: (r) => `\u05E0\u05B4${r[0]}\u05B0${r[1]}\u05B7${r[2]}\u05B0\u05EA\u05BC\u05B4\u05D9` },
    { person: '3cp', form: (r) => `\u05E0\u05B4${r[0]}\u05B0${r[1]}\u05B0${r[2]}\u05D5\u05BC` },
    { person: '2mp', form: (r) => `\u05E0\u05B4${r[0]}\u05B0${r[1]}\u05B7${r[2]}\u05B0\u05EA\u05BC\u05B6\u05DD` },
    { person: '2fp', form: (r) => `\u05E0\u05B4${r[0]}\u05B0${r[1]}\u05B7${r[2]}\u05B0\u05EA\u05BC\u05B6\u05DF` },
    { person: '1cp', form: (r) => `\u05E0\u05B4${r[0]}\u05B0${r[1]}\u05B7${r[2]}\u05B0\u05E0\u05D5\u05BC` },
  ],
  future: [
    { person: '3ms', form: (r) => `\u05D9\u05B4${r[0]}\u05BC\u05B8${r[1]}\u05B5${r[2]}` },
    { person: '3fs', form: (r) => `\u05EA\u05BC\u05B4${r[0]}\u05BC\u05B8${r[1]}\u05B5${r[2]}` },
    { person: '2ms', form: (r) => `\u05EA\u05BC\u05B4${r[0]}\u05BC\u05B8${r[1]}\u05B5${r[2]}` },
    { person: '2fs', form: (r) => `\u05EA\u05BC\u05B4${r[0]}\u05BC\u05B8${r[1]}\u05B0${r[2]}\u05B4\u05D9` },
    { person: '1cs', form: (r) => `\u05D0\u05B6${r[0]}\u05BC\u05B8${r[1]}\u05B5${r[2]}` },
    { person: '3mp', form: (r) => `\u05D9\u05B4${r[0]}\u05BC\u05B8${r[1]}\u05B0${r[2]}\u05D5\u05BC` },
    { person: '3fp', form: (r) => `\u05EA\u05BC\u05B4${r[0]}\u05BC\u05B8${r[1]}\u05B5${r[2]}\u05B0\u05E0\u05B8\u05D4` },
    { person: '2mp', form: (r) => `\u05EA\u05BC\u05B4${r[0]}\u05BC\u05B8${r[1]}\u05B0${r[2]}\u05D5\u05BC` },
    { person: '2fp', form: (r) => `\u05EA\u05BC\u05B4${r[0]}\u05BC\u05B8${r[1]}\u05B5${r[2]}\u05B0\u05E0\u05B8\u05D4` },
    { person: '1cp', form: (r) => `\u05E0\u05B4${r[0]}\u05BC\u05B8${r[1]}\u05B5${r[2]}` },
  ],
  imperative: [
    { person: '2ms', form: (r) => `\u05D4\u05B4${r[0]}\u05BC\u05B8${r[1]}\u05B5${r[2]}` },
    { person: '2fs', form: (r) => `\u05D4\u05B4${r[0]}\u05BC\u05B8${r[1]}\u05B0${r[2]}\u05B4\u05D9` },
    { person: '2mp', form: (r) => `\u05D4\u05B4${r[0]}\u05BC\u05B8${r[1]}\u05B0${r[2]}\u05D5\u05BC` },
    { person: '2fp', form: (r) => `\u05D4\u05B4${r[0]}\u05BC\u05B8${r[1]}\u05B5${r[2]}\u05B0\u05E0\u05B8\u05D4` },
  ],
  activeParticiple: [
    { person: 'ms', form: (r) => `\u05E0\u05B4${r[0]}\u05B0${r[1]}\u05B8${r[2]}` },
    { person: 'fs', form: (r) => `\u05E0\u05B4${r[0]}\u05B0${r[1]}\u05B6${r[2]}\u05B6\u05EA` },
    { person: 'mp', form: (r) => `\u05E0\u05B4${r[0]}\u05B0${r[1]}\u05B8${r[2]}\u05B4\u05D9\u05DD` },
    { person: 'fp', form: (r) => `\u05E0\u05B4${r[0]}\u05B0${r[1]}\u05B8${r[2]}\u05D5\u05B9\u05EA` },
  ],
};

// Pi'el — intensive active
const PIEL = {
  past: [
    { person: '3ms', form: (r) => `${r[0]}\u05B4${r[1]}\u05BC\u05B5${r[2]}` },
    { person: '3fs', form: (r) => `${r[0]}\u05B4${r[1]}\u05BC\u05B0${r[2]}\u05B8\u05D4` },
    { person: '2ms', form: (r) => `${r[0]}\u05B4${r[1]}\u05BC\u05B7${r[2]}\u05B0\u05EA\u05BC\u05B8` },
    { person: '2fs', form: (r) => `${r[0]}\u05B4${r[1]}\u05BC\u05B7${r[2]}\u05B0\u05EA\u05BC` },
    { person: '1cs', form: (r) => `${r[0]}\u05B4${r[1]}\u05BC\u05B7${r[2]}\u05B0\u05EA\u05BC\u05B4\u05D9` },
    { person: '3cp', form: (r) => `${r[0]}\u05B4${r[1]}\u05BC\u05B0${r[2]}\u05D5\u05BC` },
    { person: '2mp', form: (r) => `${r[0]}\u05B4${r[1]}\u05BC\u05B7${r[2]}\u05B0\u05EA\u05BC\u05B6\u05DD` },
    { person: '2fp', form: (r) => `${r[0]}\u05B4${r[1]}\u05BC\u05B7${r[2]}\u05B0\u05EA\u05BC\u05B6\u05DF` },
    { person: '1cp', form: (r) => `${r[0]}\u05B4${r[1]}\u05BC\u05B7${r[2]}\u05B0\u05E0\u05D5\u05BC` },
  ],
  future: [
    { person: '3ms', form: (r) => `\u05D9\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B5${r[2]}` },
    { person: '3fs', form: (r) => `\u05EA\u05BC\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B5${r[2]}` },
    { person: '2ms', form: (r) => `\u05EA\u05BC\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B5${r[2]}` },
    { person: '2fs', form: (r) => `\u05EA\u05BC\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B0${r[2]}\u05B4\u05D9` },
    { person: '1cs', form: (r) => `\u05D0\u05B2${r[0]}\u05B7${r[1]}\u05BC\u05B5${r[2]}` },
    { person: '3mp', form: (r) => `\u05D9\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B0${r[2]}\u05D5\u05BC` },
    { person: '3fp', form: (r) => `\u05EA\u05BC\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B5${r[2]}\u05B0\u05E0\u05B8\u05D4` },
    { person: '2mp', form: (r) => `\u05EA\u05BC\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B0${r[2]}\u05D5\u05BC` },
    { person: '2fp', form: (r) => `\u05EA\u05BC\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B5${r[2]}\u05B0\u05E0\u05B8\u05D4` },
    { person: '1cp', form: (r) => `\u05E0\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B5${r[2]}` },
  ],
  imperative: [
    { person: '2ms', form: (r) => `${r[0]}\u05B7${r[1]}\u05BC\u05B5${r[2]}` },
    { person: '2fs', form: (r) => `${r[0]}\u05B7${r[1]}\u05BC\u05B0${r[2]}\u05B4\u05D9` },
    { person: '2mp', form: (r) => `${r[0]}\u05B7${r[1]}\u05BC\u05B0${r[2]}\u05D5\u05BC` },
    { person: '2fp', form: (r) => `${r[0]}\u05B7${r[1]}\u05BC\u05B5${r[2]}\u05B0\u05E0\u05B8\u05D4` },
  ],
  activeParticiple: [
    { person: 'ms', form: (r) => `\u05DE\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B5${r[2]}` },
    { person: 'fs', form: (r) => `\u05DE\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B6${r[2]}\u05B6\u05EA` },
    { person: 'mp', form: (r) => `\u05DE\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B0${r[2]}\u05B4\u05D9\u05DD` },
    { person: 'fp', form: (r) => `\u05DE\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B0${r[2]}\u05D5\u05B9\u05EA` },
  ],
};

// Pu'al — passive of Pi'el
const PUAL = {
  past: [
    { person: '3ms', form: (r) => `${r[0]}\u05BB${r[1]}\u05BC\u05B7${r[2]}` },
    { person: '3fs', form: (r) => `${r[0]}\u05BB${r[1]}\u05BC\u05B0${r[2]}\u05B8\u05D4` },
    { person: '2ms', form: (r) => `${r[0]}\u05BB${r[1]}\u05BC\u05B7${r[2]}\u05B0\u05EA\u05BC\u05B8` },
    { person: '2fs', form: (r) => `${r[0]}\u05BB${r[1]}\u05BC\u05B7${r[2]}\u05B0\u05EA\u05BC` },
    { person: '1cs', form: (r) => `${r[0]}\u05BB${r[1]}\u05BC\u05B7${r[2]}\u05B0\u05EA\u05BC\u05B4\u05D9` },
    { person: '3cp', form: (r) => `${r[0]}\u05BB${r[1]}\u05BC\u05B0${r[2]}\u05D5\u05BC` },
    { person: '2mp', form: (r) => `${r[0]}\u05BB${r[1]}\u05BC\u05B7${r[2]}\u05B0\u05EA\u05BC\u05B6\u05DD` },
    { person: '2fp', form: (r) => `${r[0]}\u05BB${r[1]}\u05BC\u05B7${r[2]}\u05B0\u05EA\u05BC\u05B6\u05DF` },
    { person: '1cp', form: (r) => `${r[0]}\u05BB${r[1]}\u05BC\u05B7${r[2]}\u05B0\u05E0\u05D5\u05BC` },
  ],
  future: [
    { person: '3ms', form: (r) => `\u05D9\u05B0${r[0]}\u05BB${r[1]}\u05BC\u05B7${r[2]}` },
    { person: '3fs', form: (r) => `\u05EA\u05BC\u05B0${r[0]}\u05BB${r[1]}\u05BC\u05B7${r[2]}` },
    { person: '2ms', form: (r) => `\u05EA\u05BC\u05B0${r[0]}\u05BB${r[1]}\u05BC\u05B7${r[2]}` },
    { person: '2fs', form: (r) => `\u05EA\u05BC\u05B0${r[0]}\u05BB${r[1]}\u05BC\u05B0${r[2]}\u05B4\u05D9` },
    { person: '1cs', form: (r) => `\u05D0\u05B2${r[0]}\u05BB${r[1]}\u05BC\u05B7${r[2]}` },
    { person: '3mp', form: (r) => `\u05D9\u05B0${r[0]}\u05BB${r[1]}\u05BC\u05B0${r[2]}\u05D5\u05BC` },
    { person: '3fp', form: (r) => `\u05EA\u05BC\u05B0${r[0]}\u05BB${r[1]}\u05BC\u05B7${r[2]}\u05B0\u05E0\u05B8\u05D4` },
    { person: '2mp', form: (r) => `\u05EA\u05BC\u05B0${r[0]}\u05BB${r[1]}\u05BC\u05B0${r[2]}\u05D5\u05BC` },
    { person: '2fp', form: (r) => `\u05EA\u05BC\u05B0${r[0]}\u05BB${r[1]}\u05BC\u05B7${r[2]}\u05B0\u05E0\u05B8\u05D4` },
    { person: '1cp', form: (r) => `\u05E0\u05B0${r[0]}\u05BB${r[1]}\u05BC\u05B7${r[2]}` },
  ],
  activeParticiple: [
    { person: 'ms', form: (r) => `\u05DE\u05B0${r[0]}\u05BB${r[1]}\u05BC\u05B8${r[2]}` },
    { person: 'fs', form: (r) => `\u05DE\u05B0${r[0]}\u05BB${r[1]}\u05BC\u05B6${r[2]}\u05B6\u05EA` },
    { person: 'mp', form: (r) => `\u05DE\u05B0${r[0]}\u05BB${r[1]}\u05BC\u05B8${r[2]}\u05B4\u05D9\u05DD` },
    { person: 'fp', form: (r) => `\u05DE\u05B0${r[0]}\u05BB${r[1]}\u05BC\u05B8${r[2]}\u05D5\u05B9\u05EA` },
  ],
};

// Hif'il — causative active
const HIFIL = {
  past: [
    { person: '3ms', form: (r) => `\u05D4\u05B4${r[0]}\u05B0${r[1]}\u05B4\u05D9${r[2]}` },
    { person: '3fs', form: (r) => `\u05D4\u05B4${r[0]}\u05B0${r[1]}\u05B4\u05D9${r[2]}\u05B8\u05D4` },
    { person: '2ms', form: (r) => `\u05D4\u05B4${r[0]}\u05B0${r[1]}\u05B7${r[2]}\u05B0\u05EA\u05BC\u05B8` },
    { person: '2fs', form: (r) => `\u05D4\u05B4${r[0]}\u05B0${r[1]}\u05B7${r[2]}\u05B0\u05EA\u05BC` },
    { person: '1cs', form: (r) => `\u05D4\u05B4${r[0]}\u05B0${r[1]}\u05B7${r[2]}\u05B0\u05EA\u05BC\u05B4\u05D9` },
    { person: '3cp', form: (r) => `\u05D4\u05B4${r[0]}\u05B0${r[1]}\u05B4\u05D9${r[2]}\u05D5\u05BC` },
    { person: '2mp', form: (r) => `\u05D4\u05B4${r[0]}\u05B0${r[1]}\u05B7${r[2]}\u05B0\u05EA\u05BC\u05B6\u05DD` },
    { person: '2fp', form: (r) => `\u05D4\u05B4${r[0]}\u05B0${r[1]}\u05B7${r[2]}\u05B0\u05EA\u05BC\u05B6\u05DF` },
    { person: '1cp', form: (r) => `\u05D4\u05B4${r[0]}\u05B0${r[1]}\u05B7${r[2]}\u05B0\u05E0\u05D5\u05BC` },
  ],
  future: [
    { person: '3ms', form: (r) => `\u05D9\u05B7${r[0]}\u05B0${r[1]}\u05B4\u05D9${r[2]}` },
    { person: '3fs', form: (r) => `\u05EA\u05BC\u05B7${r[0]}\u05B0${r[1]}\u05B4\u05D9${r[2]}` },
    { person: '2ms', form: (r) => `\u05EA\u05BC\u05B7${r[0]}\u05B0${r[1]}\u05B4\u05D9${r[2]}` },
    { person: '2fs', form: (r) => `\u05EA\u05BC\u05B7${r[0]}\u05B0${r[1]}\u05B4\u05D9${r[2]}\u05B4\u05D9` },
    { person: '1cs', form: (r) => `\u05D0\u05B7${r[0]}\u05B0${r[1]}\u05B4\u05D9${r[2]}` },
    { person: '3mp', form: (r) => `\u05D9\u05B7${r[0]}\u05B0${r[1]}\u05B4\u05D9${r[2]}\u05D5\u05BC` },
    { person: '3fp', form: (r) => `\u05EA\u05BC\u05B7${r[0]}\u05B0${r[1]}\u05B5${r[2]}\u05B0\u05E0\u05B8\u05D4` },
    { person: '2mp', form: (r) => `\u05EA\u05BC\u05B7${r[0]}\u05B0${r[1]}\u05B4\u05D9${r[2]}\u05D5\u05BC` },
    { person: '2fp', form: (r) => `\u05EA\u05BC\u05B7${r[0]}\u05B0${r[1]}\u05B5${r[2]}\u05B0\u05E0\u05B8\u05D4` },
    { person: '1cp', form: (r) => `\u05E0\u05B7${r[0]}\u05B0${r[1]}\u05B4\u05D9${r[2]}` },
  ],
  imperative: [
    { person: '2ms', form: (r) => `\u05D4\u05B7${r[0]}\u05B0${r[1]}\u05B5${r[2]}` },
    { person: '2fs', form: (r) => `\u05D4\u05B7${r[0]}\u05B0${r[1]}\u05B4\u05D9${r[2]}\u05B4\u05D9` },
    { person: '2mp', form: (r) => `\u05D4\u05B7${r[0]}\u05B0${r[1]}\u05B4\u05D9${r[2]}\u05D5\u05BC` },
    { person: '2fp', form: (r) => `\u05D4\u05B7${r[0]}\u05B0${r[1]}\u05B5${r[2]}\u05B0\u05E0\u05B8\u05D4` },
  ],
  activeParticiple: [
    { person: 'ms', form: (r) => `\u05DE\u05B7${r[0]}\u05B0${r[1]}\u05B4\u05D9${r[2]}` },
    { person: 'fs', form: (r) => `\u05DE\u05B7${r[0]}\u05B0${r[1]}\u05B6${r[2]}\u05B6\u05EA` },
    { person: 'mp', form: (r) => `\u05DE\u05B7${r[0]}\u05B0${r[1]}\u05B4\u05D9${r[2]}\u05B4\u05D9\u05DD` },
    { person: 'fp', form: (r) => `\u05DE\u05B7${r[0]}\u05B0${r[1]}\u05B4\u05D9${r[2]}\u05D5\u05B9\u05EA` },
  ],
};

// Hof'al — passive of Hif'il
const HOFAL = {
  past: [
    { person: '3ms', form: (r) => `\u05D4\u05BB${r[0]}\u05B0${r[1]}\u05B7${r[2]}` },
    { person: '3fs', form: (r) => `\u05D4\u05BB${r[0]}\u05B0${r[1]}\u05B0${r[2]}\u05B8\u05D4` },
    { person: '2ms', form: (r) => `\u05D4\u05BB${r[0]}\u05B0${r[1]}\u05B7${r[2]}\u05B0\u05EA\u05BC\u05B8` },
    { person: '2fs', form: (r) => `\u05D4\u05BB${r[0]}\u05B0${r[1]}\u05B7${r[2]}\u05B0\u05EA\u05BC` },
    { person: '1cs', form: (r) => `\u05D4\u05BB${r[0]}\u05B0${r[1]}\u05B7${r[2]}\u05B0\u05EA\u05BC\u05B4\u05D9` },
    { person: '3cp', form: (r) => `\u05D4\u05BB${r[0]}\u05B0${r[1]}\u05B0${r[2]}\u05D5\u05BC` },
    { person: '2mp', form: (r) => `\u05D4\u05BB${r[0]}\u05B0${r[1]}\u05B7${r[2]}\u05B0\u05EA\u05BC\u05B6\u05DD` },
    { person: '2fp', form: (r) => `\u05D4\u05BB${r[0]}\u05B0${r[1]}\u05B7${r[2]}\u05B0\u05EA\u05BC\u05B6\u05DF` },
    { person: '1cp', form: (r) => `\u05D4\u05BB${r[0]}\u05B0${r[1]}\u05B7${r[2]}\u05B0\u05E0\u05D5\u05BC` },
  ],
  future: [
    { person: '3ms', form: (r) => `\u05D9\u05BB${r[0]}\u05B0${r[1]}\u05B7${r[2]}` },
    { person: '3fs', form: (r) => `\u05EA\u05BC\u05BB${r[0]}\u05B0${r[1]}\u05B7${r[2]}` },
    { person: '2ms', form: (r) => `\u05EA\u05BC\u05BB${r[0]}\u05B0${r[1]}\u05B7${r[2]}` },
    { person: '2fs', form: (r) => `\u05EA\u05BC\u05BB${r[0]}\u05B0${r[1]}\u05B0${r[2]}\u05B4\u05D9` },
    { person: '1cs', form: (r) => `\u05D0\u05BB${r[0]}\u05B0${r[1]}\u05B7${r[2]}` },
    { person: '3mp', form: (r) => `\u05D9\u05BB${r[0]}\u05B0${r[1]}\u05B0${r[2]}\u05D5\u05BC` },
    { person: '3fp', form: (r) => `\u05EA\u05BC\u05BB${r[0]}\u05B0${r[1]}\u05B7${r[2]}\u05B0\u05E0\u05B8\u05D4` },
    { person: '2mp', form: (r) => `\u05EA\u05BC\u05BB${r[0]}\u05B0${r[1]}\u05B0${r[2]}\u05D5\u05BC` },
    { person: '2fp', form: (r) => `\u05EA\u05BC\u05BB${r[0]}\u05B0${r[1]}\u05B7${r[2]}\u05B0\u05E0\u05B8\u05D4` },
    { person: '1cp', form: (r) => `\u05E0\u05BB${r[0]}\u05B0${r[1]}\u05B7${r[2]}` },
  ],
  activeParticiple: [
    { person: 'ms', form: (r) => `\u05DE\u05BB${r[0]}\u05B0${r[1]}\u05B8${r[2]}` },
    { person: 'fs', form: (r) => `\u05DE\u05BB${r[0]}\u05B0${r[1]}\u05B6${r[2]}\u05B6\u05EA` },
    { person: 'mp', form: (r) => `\u05DE\u05BB${r[0]}\u05B0${r[1]}\u05B8${r[2]}\u05B4\u05D9\u05DD` },
    { person: 'fp', form: (r) => `\u05DE\u05BB${r[0]}\u05B0${r[1]}\u05B8${r[2]}\u05D5\u05B9\u05EA` },
  ],
};

// Hitpa'el — reflexive of Pi'el
const HITPAEL = {
  past: [
    { person: '3ms', form: (r) => `\u05D4\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B5${r[2]}` },
    { person: '3fs', form: (r) => `\u05D4\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B0${r[2]}\u05B8\u05D4` },
    { person: '2ms', form: (r) => `\u05D4\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B7${r[2]}\u05B0\u05EA\u05BC\u05B8` },
    { person: '2fs', form: (r) => `\u05D4\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B7${r[2]}\u05B0\u05EA\u05BC` },
    { person: '1cs', form: (r) => `\u05D4\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B7${r[2]}\u05B0\u05EA\u05BC\u05B4\u05D9` },
    { person: '3cp', form: (r) => `\u05D4\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B0${r[2]}\u05D5\u05BC` },
    { person: '2mp', form: (r) => `\u05D4\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B7${r[2]}\u05B0\u05EA\u05BC\u05B6\u05DD` },
    { person: '2fp', form: (r) => `\u05D4\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B7${r[2]}\u05B0\u05EA\u05BC\u05B6\u05DF` },
    { person: '1cp', form: (r) => `\u05D4\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B7${r[2]}\u05B0\u05E0\u05D5\u05BC` },
  ],
  future: [
    { person: '3ms', form: (r) => `\u05D9\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B5${r[2]}` },
    { person: '3fs', form: (r) => `\u05EA\u05BC\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B5${r[2]}` },
    { person: '2ms', form: (r) => `\u05EA\u05BC\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B5${r[2]}` },
    { person: '2fs', form: (r) => `\u05EA\u05BC\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B0${r[2]}\u05B4\u05D9` },
    { person: '1cs', form: (r) => `\u05D0\u05B6\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B5${r[2]}` },
    { person: '3mp', form: (r) => `\u05D9\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B0${r[2]}\u05D5\u05BC` },
    { person: '3fp', form: (r) => `\u05EA\u05BC\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B5${r[2]}\u05B0\u05E0\u05B8\u05D4` },
    { person: '2mp', form: (r) => `\u05EA\u05BC\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B0${r[2]}\u05D5\u05BC` },
    { person: '2fp', form: (r) => `\u05EA\u05BC\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B5${r[2]}\u05B0\u05E0\u05B8\u05D4` },
    { person: '1cp', form: (r) => `\u05E0\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B5${r[2]}` },
  ],
  imperative: [
    { person: '2ms', form: (r) => `\u05D4\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B5${r[2]}` },
    { person: '2fs', form: (r) => `\u05D4\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B0${r[2]}\u05B4\u05D9` },
    { person: '2mp', form: (r) => `\u05D4\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B0${r[2]}\u05D5\u05BC` },
    { person: '2fp', form: (r) => `\u05D4\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B5${r[2]}\u05B0\u05E0\u05B8\u05D4` },
  ],
  activeParticiple: [
    { person: 'ms', form: (r) => `\u05DE\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B5${r[2]}` },
    { person: 'fs', form: (r) => `\u05DE\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B6${r[2]}\u05B6\u05EA` },
    { person: 'mp', form: (r) => `\u05DE\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B0${r[2]}\u05B4\u05D9\u05DD` },
    { person: 'fp', form: (r) => `\u05DE\u05B4\u05EA\u05B0${r[0]}\u05B7${r[1]}\u05BC\u05B0${r[2]}\u05D5\u05B9\u05EA` },
  ],
};

// Nitpa'el — variant of Hitpa'el (uses same patterns)
const NITPAEL = HITPAEL;

// Map of binyan keys to their templates
const CONJUGATION_TEMPLATES = {
  // Aramaic
  peal: PEAL,
  pael: PAEL,
  afel: AFEL,
  ithpeel: ITHPEEL,
  ithpaal: ITHPAAL,
  ittafal: ITTAFAL,
  // Hebrew
  qal: QAL,
  nifal: NIFAL,
  piel: PIEL,
  pual: PUAL,
  hifil: HIFIL,
  hofal: HOFAL,
  hitpael: HITPAEL,
  nitpael: NITPAEL,
};

/**
 * Generate the full conjugation table for a given root and binyan.
 * 
 * @param {string[]} root - Array of root consonants [R1, R2, R3]
 * @param {string} binyanKey - Internal binyan key (e.g., 'peal', 'pael', 'qal', 'nifal')
 * @returns {object|null} Conjugation tables organized by tense
 */
export function conjugateVerb(root, binyanKey) {
  const template = CONJUGATION_TEMPLATES[binyanKey];
  if (!template || !root || root.length < 3) return null;
  
  const r = root.slice(0, 3); // Use first 3 consonants
  
  // Determine which person labels to use based on binyan type
  const info = Object.values(BINYAN_MAP).find(b => b.key === binyanKey);
  const isHeb = info && info.type === 'hebrew';
  const personLabels = isHeb ? HEBREW_PERSON_LABELS : PERSON_LABELS;
  
  const result = {};
  
  for (const [tenseKey, forms] of Object.entries(template)) {
    result[tenseKey] = {
      label: TENSE_LABELS[tenseKey] || tenseKey,
      forms: forms.map(({ person, form }) => ({
        person,
        ...(personLabels[person] || PERSON_LABELS[person] || {}),
        aramaic: form(r),
      })),
    };
  }
  
  return result;
}

/**
 * Get the list of available conjugation binyanim for an entry.
 * Works for both Aramaic and Hebrew (b. h.) entries.
 * 
 * @param {object} entryBinyanim - Array of {name, form} from the entry
 * @param {boolean} isAramaic - Whether the entry is Aramaic (ch.)
 * @param {boolean} isHebrew - Whether the entry is Biblical Hebrew (b. h.)
 * @returns {object[]} Array of available binyanim with their info
 */
export function getAvailableBinyanim(entryBinyanim, isAramaic, isHebrew) {
  if ((!isAramaic && !isHebrew) || !entryBinyanim || entryBinyanim.length === 0) return [];
  
  const available = [];
  
  if (isAramaic) {
    // Always include Pe'al as the base form for Aramaic entries
    available.push({
      key: 'peal',
      name: "Pe'al",
      abbreviation: 'Pe.',
      description: 'Basic active form',
    });
  } else if (isHebrew) {
    // Always include Qal as the base form for Hebrew entries
    available.push({
      key: 'qal',
      name: "Qal (Pa'al)",
      abbreviation: 'Qal',
      description: 'Basic active form',
    });
  }
  
  // Check which binyanim from the entry we can conjugate
  for (const binyan of entryBinyanim) {
    const info = getBinyanInfo(binyan.name);
    if (info && CONJUGATION_TEMPLATES[info.key]) {
      // Don't add duplicates
      if (!available.some(b => b.key === info.key)) {
        available.push({
          key: info.key,
          name: info.fullName,
          abbreviation: binyan.name.trim(),
          form: binyan.form,
          description: getBinyanDescription(info.key),
        });
      }
    }
  }
  
  return available;
}

/**
 * Get a human-readable description for a binyan
 */
function getBinyanDescription(key) {
  const descriptions = {
    // Aramaic
    peal: 'Basic active form',
    pael: 'Intensive active form',
    afel: 'Causative active form',
    ithpeel: 'Passive/reflexive of Pe\'al',
    ithpaal: 'Passive/reflexive of Pa\'el',
    ittafal: 'Passive/reflexive of Af\'el',
    ishtafal: 'Passive of Shaf\'el',
    palpal: 'Quadriliteral form',
    ithpalpal: 'Reflexive quadriliteral form',
    // Hebrew
    qal: 'Basic active form',
    nifal: 'Passive/reflexive of Qal',
    piel: 'Intensive active form',
    pual: 'Passive of Pi\'el',
    hifil: 'Causative active form',
    hofal: 'Passive of Hif\'il',
    hitpael: 'Reflexive/reciprocal form',
    nitpael: 'Reflexive (variant of Hitpa\'el)',
  };
  return descriptions[key] || '';
}

export { TENSE_LABELS, PERSON_LABELS, HEBREW_PERSON_LABELS, BINYAN_MAP };
