import { useState, useCallback } from 'react';

const STORAGE_KEY = 'star-stalker-favorites';

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function save(set) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch { /* storage blocked */ }
}

/**
 * Manages a persisted Set of favorite team callsigns.
 * Returns { favorites, toggle, isFavorite, count }
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState(load);

  const toggle = useCallback((callsign) => {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(callsign) ? next.delete(callsign) : next.add(callsign);
      save(next);
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (callsign) => favorites.has(callsign),
    [favorites]
  );

  return { favorites, toggle, isFavorite, count: favorites.size };
}
