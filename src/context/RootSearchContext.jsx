import React, { createContext, useContext, useState } from 'react';

const RootSearchContext = createContext();

export const useRootSearchContext = () => {
  const context = useContext(RootSearchContext);
  if (!context) {
    throw new Error('useRootSearchContext must be used within a RootSearchContextProvider');
  }
  return context;
};

export const RootSearchContextProvider = ({ children }) => {
  const [isRootSearchOpen, setIsRootSearchOpen] = useState(false);

  const openRootSearch = () => setIsRootSearchOpen(true);
  const closeRootSearch = () => setIsRootSearchOpen(false);

  const value = { isRootSearchOpen, openRootSearch, closeRootSearch };

  return <RootSearchContext.Provider value={value}>{children}</RootSearchContext.Provider>;
};

export default RootSearchContextProvider;
