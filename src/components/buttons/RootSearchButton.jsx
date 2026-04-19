import React from "react";
import { useRootSearchContext } from "../../context/RootSearchContext";

const RootSearchButton = () => {
  const { openRootSearch } = useRootSearchContext();

  return (
    <button
      onClick={openRootSearch}
      className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-700 dark:bg-secondary text-white shadow-md hover:bg-opacity-90 transition-all duration-300"
      title="Root Search"
      aria-label="Open Root Search"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>
    </button>
  );
};

export default RootSearchButton;
