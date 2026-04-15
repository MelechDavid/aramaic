import React, { useState, useMemo } from 'react';
import { conjugateVerb, extractRoot, getAvailableBinyanim } from '../../utils/AramaicConjugation';

const ConjugationModal = ({ entry, onClose }) => {
  const [selectedBinyan, setSelectedBinyan] = useState(null);
  const [selectedTense, setSelectedTense] = useState(null);

  // Extract root from the first headword
  const root = useMemo(() => {
    if (!entry || !entry.headwords || entry.headwords.length === 0) return null;
    return extractRoot(entry.headwords[0]);
  }, [entry]);

  // Get available binyanim
  const availableBinyanim = useMemo(() => {
    if (!entry) return [];
    return getAvailableBinyanim(entry.binyanim || [], entry.isAramaic);
  }, [entry]);

  // Generate conjugation when a binyan is selected
  const conjugation = useMemo(() => {
    if (!root || !selectedBinyan) return null;
    return conjugateVerb(root, selectedBinyan);
  }, [root, selectedBinyan]);

  // Get tense keys from conjugation
  const tenseKeys = useMemo(() => {
    if (!conjugation) return [];
    return Object.keys(conjugation);
  }, [conjugation]);

  // Auto-select first tense when binyan changes
  React.useEffect(() => {
    if (tenseKeys.length > 0 && !selectedTense) {
      setSelectedTense(tenseKeys[0]);
    }
  }, [tenseKeys, selectedTense]);

  if (!entry || !root || availableBinyanim.length === 0) {
    return null;
  }

  const rootDisplay = root.join('.');

  const handleBinyanSelect = (key) => {
    setSelectedBinyan(key);
    setSelectedTense(null); // Reset tense when switching binyan
  };

  const handleBack = () => {
    if (selectedBinyan) {
      setSelectedBinyan(null);
      setSelectedTense(null);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[70] flex items-end sm:items-center justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white dark:bg-gray-900 w-full sm:w-[500px] sm:max-w-[95vw] max-h-[85vh] sm:rounded-2xl rounded-t-2xl overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-pink-600 to-pink-700">
          <button
            onClick={handleBack}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
            aria-label="Back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="text-center flex-1">
            <h2 className="text-white font-bold text-lg">
              {selectedBinyan ? availableBinyanim.find(b => b.key === selectedBinyan)?.name : 'Verb Conjugation'}
            </h2>
            <p className="text-pink-100 text-sm">
              Root: <span className="font-semibold text-white" dir="rtl">{rootDisplay}</span>
              {' '}({entry.headwords[0]})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {!selectedBinyan ? (
            /* Binyan selection */
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Select a verb form (binyan) to see its full conjugation:
              </p>
              <div className="grid grid-cols-1 gap-3">
                {availableBinyanim.map((binyan) => (
                  <button
                    key={binyan.key}
                    onClick={() => handleBinyanSelect(binyan.key)}
                    className="flex items-center justify-between p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-pink-400 dark:hover:border-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-all group text-left"
                  >
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-pink-700 dark:group-hover:text-pink-400">
                        {binyan.name}
                        <span className="text-gray-400 dark:text-gray-500 text-sm ml-2 font-normal">({binyan.abbreviation})</span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{binyan.description}</div>
                      {binyan.form && (
                        <div className="text-lg mt-1 text-gray-700 dark:text-gray-300" dir="rtl">{binyan.form}</div>
                      )}
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          ) : conjugation ? (
            /* Conjugation table */
            <div>
              {/* Tense tabs */}
              <div className="flex gap-1.5 overflow-x-auto pb-3 mb-4 -mx-1 px-1 scrollbar-hide">
                {tenseKeys.map((tenseKey) => (
                  <button
                    key={tenseKey}
                    onClick={() => setSelectedTense(tenseKey)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      selectedTense === tenseKey
                        ? 'bg-pink-600 text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {conjugation[tenseKey].label}
                  </button>
                ))}
              </div>

              {/* Conjugation forms */}
              {selectedTense && conjugation[selectedTense] && (
                <div className="space-y-2">
                  {conjugation[selectedTense].forms.map((form, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                          {form.label}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {form.person} {form.gender} {form.number}
                        </span>
                        {form.hebrew && (
                          <span className="text-xs text-pink-600 dark:text-pink-400 mt-0.5" dir="rtl">
                            {form.hebrew}
                          </span>
                        )}
                      </div>
                      <div
                        className="text-2xl font-semibold text-gray-900 dark:text-white"
                        dir="rtl"
                      >
                        {form.aramaic}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Note about regular conjugation */}
              <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50">
                <p className="text-xs text-amber-800 dark:text-amber-200">
                  <strong>Note:</strong> These conjugations follow the regular (strong verb) paradigm. 
                  Weak roots and irregular verbs may have different forms in actual Talmudic usage.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Unable to generate conjugation for this root.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConjugationModal;
