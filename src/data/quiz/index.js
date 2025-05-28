// Import existing quiz categories
import { binyanim } from './binyanim';
import { nouns } from './nouns';
// import { particles } from './particles';
// import { pronouns } from './pronouns';
import { verbforms } from './verbforms';
import { verbsuffixes } from './verbsuffixes';
import { verbtense } from './verbtense';

// Prepare imports for future categories (uncomment as you add them)
import { aramaicconnectives } from './aramaicconnectives';
import { aramaicprefixes } from './aramaicprefixes';
import { aramaicsuffixes } from './aramaicsuffixes';
import { demonstratives } from './demonstratives';
import { dialecticalvariations } from './dialecticalvariations';
import { grammaticalterms } from './grammaticalterms';
import { hermeneutics } from './hermeneutics';
import { independentpronouns } from './independentpronouns';
import { infinitives } from './infinitives';
import { loanwords } from './loanwords';
import { numbers } from './numbers';
import { participles } from './participles';
import { pronominalsuffixes } from './pronominalsuffixes';
import { syntax } from './syntax';
import { talmudicliterature } from './talmudicliterature';
import { talmudicphrases } from './talmudicphrases';
import { talmudicterminology } from './talmudicterminology';

// Combine all quiz categories
export const quizData = [
  ...binyanim,
  ...nouns,
//   ...particles,
//   ...pronouns,
  ...verbforms,
  ...verbsuffixes,
  ...verbtense,
  // Add these as you create the files
  ...aramaicconnectives,
  ...aramaicprefixes,
  ...aramaicsuffixes,
  ...demonstratives,
  ...dialecticalvariations,
  ...grammaticalterms,
  ...hermeneutics,
  ...independentpronouns,
  ...infinitives,
  ...loanwords,
  ...numbers,
  ...participles,
  ...pronominalsuffixes,
  ...syntax,
  ...talmudicliterature,
  ...talmudicphrases,
  ...talmudicterminology,
];

// Export individual categories
export {
  binyanim,
  nouns,
//   particles,
//   pronouns,
  verbforms,
  verbsuffixes,
  verbtense,
  // Uncomment these exports as you create the files
  aramaicconnectives,
  aramaicprefixes,
  aramaicsuffixes,
  demonstratives,
  dialecticalvariations,
  grammaticalterms,
  hermeneutics,
  independentpronouns,
  infinitives,
  loanwords,
  numbers,
  participles,
  pronominalsuffixes,
  syntax,
  talmudicliterature,
  talmudicphrases,
  talmudicterminology,
};