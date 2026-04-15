/**
 * Aramaic Verb Conjugation Engine
 * 
 * Generates conjugation tables for Aramaic (Babylonian Talmudic) verbs
 * based on the tri-literal root system and standard binyan patterns.
 */

// Map dictionary abbreviations to full binyan names and our internal keys
const BINYAN_MAP = {
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
};

// Hebrew binyanim (we won't conjugate these but will detect them)
const HEBREW_BINYANIM = ['Pi.', 'Hif.', 'Nif.', 'Hithpa.', 'Nithpa.', 'Hof.', 'Pu.', 'Polel.', 'Hithpol.'];

/**
 * Extract the consonantal root from an Aramaic headword by stripping nikkud
 */
export function extractRoot(headword) {
  if (!headword) return null;
  
  // Strip all Hebrew nikkud/vowel marks and cantillation
  const stripped = headword
    .replace(/[\u0591-\u05C7]/g, '') // strip nikkud and cantillation
    .replace(/[\s,.*()\/\-]/g, '')    // strip whitespace and punctuation
    .replace(/[^\u05D0-\u05EA]/g, ''); // keep only Hebrew consonants
  
  // For standard tri-literal roots, we expect 3 consonants
  if (stripped.length >= 2 && stripped.length <= 4) {
    return stripped.split('');
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
  return HEBREW_BINYANIM.includes(binyanName.trim());
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

// Map of binyan keys to their templates
const CONJUGATION_TEMPLATES = {
  peal: PEAL,
  pael: PAEL,
  afel: AFEL,
  ithpeel: ITHPEEL,
  ithpaal: ITHPAAL,
  ittafal: ITTAFAL,
};

/**
 * Generate the full conjugation table for a given root and binyan.
 * 
 * @param {string[]} root - Array of root consonants [R1, R2, R3]
 * @param {string} binyanKey - Internal binyan key (e.g., 'peal', 'pael')
 * @returns {object|null} Conjugation tables organized by tense
 */
export function conjugateVerb(root, binyanKey) {
  const template = CONJUGATION_TEMPLATES[binyanKey];
  if (!template || !root || root.length < 3) return null;
  
  const r = root.slice(0, 3); // Use first 3 consonants
  
  const result = {};
  
  for (const [tenseKey, forms] of Object.entries(template)) {
    result[tenseKey] = {
      label: TENSE_LABELS[tenseKey] || tenseKey,
      forms: forms.map(({ person, form }) => ({
        person,
        ...PERSON_LABELS[person],
        aramaic: form(r),
      })),
    };
  }
  
  return result;
}

/**
 * Get the list of available conjugation binyanim for an entry.
 * This analyzes the entry's binyan data and determines which ones we can conjugate.
 * 
 * @param {object} entryBinyanim - Array of {name, form} from the entry
 * @param {boolean} isAramaic - Whether the entry is Aramaic
 * @returns {object[]} Array of available binyanim with their info
 */
export function getAvailableBinyanim(entryBinyanim, isAramaic) {
  if (!isAramaic || !entryBinyanim || entryBinyanim.length === 0) return [];
  
  const available = [];
  
  // Always include Pe'al as the base form for Aramaic entries
  available.push({
    key: 'peal',
    name: "Pe'al",
    abbreviation: 'Pe.',
    description: 'Basic active form',
  });
  
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
    peal: 'Basic active form',
    pael: 'Intensive active form',
    afel: 'Causative active form',
    ithpeel: 'Passive/reflexive of Pe\'al',
    ithpaal: 'Passive/reflexive of Pa\'el',
    ittafal: 'Passive/reflexive of Af\'el',
    ishtafal: 'Passive of Shaf\'el',
    palpal: 'Quadriliteral form',
    ithpalpal: 'Reflexive quadriliteral form',
  };
  return descriptions[key] || '';
}

export { TENSE_LABELS, PERSON_LABELS, BINYAN_MAP };
