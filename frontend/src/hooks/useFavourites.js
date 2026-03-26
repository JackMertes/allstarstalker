import { useState, useCallback } from 'react';

const STORAGE_KEY = 'star-stalker-favourites';

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
 * Manages a persisted Set of favourite team callsigns.
 * Returns { favourites, toggle, isFavourite, count }
 */
export function useFavourites() {
  const [favourites, setFavourites] = useState(load);

  const toggle = useCallback((callsign) => {
    setFavourites(prev => {
      const next = new Set(prev);
      next.has(callsign) ? next.delete(callsign) : next.add(callsign);
      save(next);
      return next;
    });
  }, []);

  const isFavourite = useCallback(
    (callsign) => favourites.has(callsign),
    [favourites]
  );

  return { favourites, toggle, isFavourite, count: favourites.size };
}
