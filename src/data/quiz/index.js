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

// Category map for filtering
export const quizCategories = {
  'Binyanim': binyanim,
  'Nouns': nouns,
  'Verb Forms': verbforms,
  'Verb Suffixes': verbsuffixes,
  'Verb Tense': verbtense,
  'Aramaic Connectives': aramaicconnectives,
  'Aramaic Prefixes': aramaicprefixes,
  'Aramaic Suffixes': aramaicsuffixes,
  'Demonstratives': demonstratives,
  'Dialectical Variations': dialecticalvariations,
  'Grammatical Terms': grammaticalterms,
  'Hermeneutics': hermeneutics,
  'Independent Pronouns': independentpronouns,
  'Infinitives': infinitives,
  'Loanwords': loanwords,
  'Numbers': numbers,
  'Participles': participles,
  'Pronominal Suffixes': pronominalsuffixes,
  'Syntax': syntax,
  'Talmudic Literature': talmudicliterature,
  'Talmudic Phrases': talmudicphrases,
  'Talmudic Terminology': talmudicterminology,
};

// Combine all quiz categories
export const quizData = Object.values(quizCategories).flat();

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