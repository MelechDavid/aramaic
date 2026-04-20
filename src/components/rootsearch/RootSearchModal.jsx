import React, { useState, useEffect, useRef, useCallback } from 'react';
import dictionaryIndex from '../../utils/DictionaryIndex';
import EntryDetails from '../layouts/EntryDetails';
import InfiniteScroll from '../ui/InfiniteScroll';
import HeartButton from '../buttons/HeartButton';
import { useFavoritesContext } from '../../context/FavoritesContext';

const RESULTS_PER_PAGE = 50;

const HEBREW_LETTERS = [
  'א','ב','ג','ד','ה','ו','ז','ח','ט','י',
  'כ','ל','מ','נ','ס','ע','פ','צ','ק','ר','ש','ת',
];

const RootSearchModal = ({ isOpen, onClose }) => {
  const [r1, setR1] = useState('');
  const [r2, setR2] = useState('');
  const [r3, setR3] = useState('');
  const [activeBox, setActiveBox] = useState(0); // 0=R1, 1=R2, 2=R3
  const [results, setResults] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [slideAnimation, setSlideAnimation] = useState(false);
  const [isLoadingEntry, setIsLoadingEntry] = useState(false);
  const pendingEntryRef = useRef(null);
  const searchParamsRef = useRef({ r1: '', r2: '', r3: '' });
  const { addRecentEntry } = useFavoritesContext();

  const boxes = [
    { val: r1, set: setR1 },
    { val: r2, set: setR2 },
    { val: r3, set: setR3 },
  ];

  // Lock body scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [isOpen]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setR1(''); setR2(''); setR3('');
      setActiveBox(0);
      setResults([]); setTotalCount(0);
      setSearched(false); setLoadingMore(false);
      setSelectedEntry(null);
      setSlideAnimation(false);
    }
  }, [isOpen]);

  const handleSearch = async () => {
    if (!r1 && !r2 && !r3) return;
    setLoading(true);
    setSearched(true);
    setResults([]);
    searchParamsRef.current = { r1, r2, r3 };
    try {
      const res = await dictionaryIndex.rootSearch(r1, r2, r3, RESULTS_PER_PAGE, 0);
      setResults(res.results);
      setTotalCount(res.totalCount);
    } catch (err) {
      console.error('Root search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = useCallback(async () => {
    if (loadingMore || loading) return;
    setLoadingMore(true);
    try {
      const { r1: sr1, r2: sr2, r3: sr3 } = searchParamsRef.current;
      const res = await dictionaryIndex.rootSearch(sr1, sr2, sr3, RESULTS_PER_PAGE, results.length);
      setResults(prev => [...prev, ...res.results]);
    } catch (err) {
      console.error('Root search load more error:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, loading, results.length]);

  const handleClear = () => {
    setR1(''); setR2(''); setR3('');
    setActiveBox(0);
    setResults([]); setTotalCount(0);
    setSearched(false); setLoadingMore(false);
  };

  const handleEntryClick = async (entry) => {
    if (isLoadingEntry) return;
    setIsLoadingEntry(true);
    pendingEntryRef.current = entry;
    addRecentEntry({ id: entry.id, headwords: entry.headwords, englishTerms: entry.englishTerms });
    setSelectedEntry({ ...entry, definition: 'Loading...' });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setSlideAnimation(true));
    });
    try {
      const details = await dictionaryIndex.getEntryDetails(entry.id);
      if (pendingEntryRef.current?.id === entry.id) {
        setSelectedEntry(prev => ({ ...prev, ...details }));
      }
    } catch (err) {
      console.error('Error loading entry details:', err);
    } finally {
      setIsLoadingEntry(false);
    }
  };

  const handleEntryBack = () => {
    setSlideAnimation(false);
    setTimeout(() => {
      setSelectedEntry(null);
      pendingEntryRef.current = null;
    }, 200);
  };

  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const refs = [ref1, ref2, ref3];

  // Handle keyboard input — only allow a single Hebrew letter per box
  const handleLetterInput = (e, boxIndex) => {
    const val = e.target.value;
    const ch = val.slice(-1);
    if (/[\u05D0-\u05EA]/.test(ch)) {
      boxes[boxIndex].set(ch);
      // Auto-advance to next box
      if (boxIndex < 2) {
        setActiveBox(boxIndex + 1);
        refs[boxIndex + 1].current?.focus();
      }
    } else if (val === '') {
      boxes[boxIndex].set('');
    }
  };

  // Handle backspace to go to previous field
  const handleKeyDown = (e, boxIndex) => {
    if (e.key === 'Backspace' && e.target.value === '' && boxIndex > 0) {
      setActiveBox(boxIndex - 1);
      refs[boxIndex - 1].current?.focus();
    }
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle tapping a letter in the picker — insert into the active box
  const handleLetterPick = (letter) => {
    boxes[activeBox].set(letter);
    // Auto-advance to next box if not on the last one
    if (activeBox < 2) {
      const next = activeBox + 1;
      setActiveBox(next);
      refs[next].current?.focus();
    }
  };

  const slideClass = isOpen ? 'translate-x-0' : 'translate-x-full';
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-white dark:bg-gray-900 z-50 transform transition-transform duration-200 ease-in-out ${slideClass}`}
      style={{ willChange: 'transform' }}
    >
      {/* Scrollable content area */}
      <div className="h-full overflow-y-auto">
        {/* Back button */}
        <div className="sticky top-0 left-0 z-[51] bg-gradient-to-b from-white dark:from-gray-900 to-transparent pb-8 pointer-events-none" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          <button
            onClick={onClose}
            className="absolute left-4 p-2 bg-pink-600 text-white rounded-full shadow-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all hover:scale-110 pointer-events-auto"
            style={{ top: 'calc(env(safe-area-inset-top) + 1rem)' }}
            aria-label="Back to dictionary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </div>

        <div className="max-w-xl mx-auto px-4 pb-10" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 4rem)' }}>
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
            Root Search
          </h2>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
            Tap a box, then type or pick a letter. Leave blank to match any letter.
          </p>

          {/* Root letter inputs — displayed RTL */}
          <div className="flex justify-center items-center gap-3 mb-4" dir="rtl">
            {[
              { label: 'R1', idx: 0 },
              { label: 'R2', idx: 1 },
              { label: 'R3', idx: 2 },
            ].map(({ label, idx }) => (
              <div key={label} className="flex flex-col items-center">
                <span className="text-xs text-gray-400 dark:text-gray-500 mb-1">{label}</span>
                <input
                  ref={refs[idx]}
                  type="text"
                  value={boxes[idx].val}
                  onChange={(e) => handleLetterInput(e, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  onFocus={() => setActiveBox(idx)}
                  className={`w-14 h-14 text-center text-2xl font-bold rounded-lg border-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none transition-colors ${
                    activeBox === idx
                      ? 'border-pink-500 ring-2 ring-pink-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  dir="rtl"
                  autoCorrect="off"
                  autoCapitalize="off"
                  autoComplete="off"
                  spellCheck={false}
                  maxLength={2}
                />
              </div>
            ))}
          </div>

          {/* Quick letter picker */}
          <div className="flex flex-wrap justify-center gap-1.5 mb-6 px-2" dir="rtl">
            {HEBREW_LETTERS.map(letter => (
              <button
                key={letter}
                type="button"
                onClick={() => handleLetterPick(letter)}
                className="w-8 h-8 text-sm font-semibold rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-pink-100 dark:hover:bg-pink-900/30 hover:text-pink-700 dark:hover:text-pink-400 transition-colors"
              >
                {letter}
              </button>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-3 mb-8">
            <button
              onClick={handleSearch}
              disabled={(!r1 && !r2 && !r3) || loading}
              className="px-6 py-2.5 bg-pink-600 text-white font-semibold rounded-lg shadow hover:bg-pink-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
            <button
              onClick={handleClear}
              className="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Clear
            </button>
          </div>

          {/* Results */}
          {searched && !loading && (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">
              {totalCount === 0 ? 'No entries found.' : `Found ${totalCount} ${totalCount === 1 ? 'entry' : 'entries'}`}
            </p>
          )}

          <InfiniteScroll
            hasMore={results.length < totalCount}
            loading={loadingMore}
            onLoadMore={handleLoadMore}
          >
            <div className="space-y-2">
              {results.map(entry => (
                <button
                  key={entry.id}
                  onClick={() => handleEntryClick(entry)}
                  className="w-full text-right p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors border border-gray-200 dark:border-gray-700"
                  dir="rtl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-lg font-bold text-gray-900 dark:text-white truncate">
                        {entry.headwords[0]}
                      </span>
                      {entry.headwords.length > 1 && (
                        <span className="text-sm text-gray-400 dark:text-gray-500 truncate">
                          {entry.headwords.slice(1).join(', ')}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 mr-2" dir="ltr">
                      <HeartButton entry={entry} />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 text-left" dir="ltr">
                    {entry.englishTerms.slice(0, 3).join(', ')}
                  </p>
                </button>
              ))}
            </div>
          </InfiniteScroll>
        </div>
      </div>

      {/* Entry detail slide-in — same pattern as FavoritesModal */}
      {selectedEntry && (
        <div className={`absolute inset-0 z-[52] transition-transform duration-200 ease-in-out ${slideAnimation ? 'translate-x-0' : 'translate-x-full'}`}>
          <EntryDetails
            entry={selectedEntry}
            onBack={handleEntryBack}
            isSlideIn={true}
            skipScrollLock={true}
          />
        </div>
      )}
    </div>
  );
};

export default RootSearchModal;
