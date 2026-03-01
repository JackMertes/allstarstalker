import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

/**
 * AppProvider - global state for the app.
 *
 * Stores:
 *   loading / error     - global async state
 *   searchTerm          - last search query, preserved when navigating back
 *   searchResults       - last set of results, preserved when navigating back
 */
export const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Persist search state so the user doesn't lose their results when they
  // navigate to a flight detail page and press Back.
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null); // null = not yet searched

  const clearError = () => setError(null);

  const value = {
    loading,
    setLoading,
    error,
    setError,
    clearError,
    searchTerm,
    setSearchTerm,
    searchResults,
    setSearchResults,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export default AppContext;
