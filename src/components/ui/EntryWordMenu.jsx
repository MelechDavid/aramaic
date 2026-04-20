import React, { useEffect, useRef } from "react";
import { speakHebrew, stripNikkud } from "../../utils/textUtils";

const EntryWordMenu = ({ headwords, englishTerms, definition, onClose }) => {
  const menuRef = useRef(null);
  const headwordText = headwords.join(", ");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    // Delay listener so the opening click doesn't immediately close it
    const timer = setTimeout(() => {
      document.addEventListener("click", handleClickOutside, true);
    }, 10);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [onClose]);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for older WebView versions
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    onClose();
  };

  const handleShare = async (text) => {
    try {
      const { Share } = await import("@capacitor/share");
      await Share.share({ text });
    } catch {
      // Fallback to Web Share API if Capacitor not available
      if (navigator.share) {
        await navigator.share({ text });
      }
    }
    onClose();
  };

  const handlePronounce = () => {
    speakHebrew(headwordText);
    onClose();
  };

  // Build a plain-text version of the definition (strip HTML)
  const plainDefinition = definition && definition !== "Loading..."
    ? definition.replace(/<[^>]*>/g, "").trim()
    : "";

  const entryDetailsText = `${headwordText}\n${englishTerms.join(", ")}${plainDefinition ? "\n\n" + plainDefinition : ""}`;

  const menuItems = [
    {
      label: "Pronounce",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M11 5L6 9H2v6h4l5 4V5z" />
        </svg>
      ),
      action: handlePronounce,
    },
    {
      label: "Copy with Nikkud",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      action: () => copyToClipboard(headwordText),
    },
    {
      label: "Copy without Nikkud",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      action: () => copyToClipboard(stripNikkud(headwordText)),
    },
    {
      label: "Share Entry Word",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      ),
      action: () => handleShare(headwordText),
    },
    {
      label: "Share Entry Details",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      ),
      action: () => handleShare(entryDetailsText),
    },
  ];

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/30" onClick={onClose}>
      <div
        ref={menuRef}
        className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-t-2xl shadow-2xl pb-safe animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
        </div>

        {/* Header showing the word */}
        <div className="px-6 pb-3 border-b border-gray-200 dark:border-gray-700">
          <p dir="rtl" className="text-xl font-bold text-gray-900 dark:text-white text-center">
            {headwordText}
          </p>
        </div>

        {/* Menu items */}
        <div className="py-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="w-full flex items-center gap-4 px-6 py-3.5 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 transition-colors"
            >
              <span className="text-pink-600 dark:text-pink-400">{item.icon}</span>
              <span className="text-base font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Cancel button */}
        <div className="px-6 pb-6 pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-semibold text-base hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EntryWordMenu;
