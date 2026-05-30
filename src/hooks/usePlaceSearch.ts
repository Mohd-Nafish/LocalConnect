import { useCallback, useEffect, useRef, useState } from 'react';

import { SEARCH_DEBOUNCE_MS, SEARCH_MIN_QUERY_LENGTH } from '../constants/placeCategories';
import { searchPlacesByText } from '../services/placesService';
import type { UserCoordinates } from '../types/location';
import type { Place } from '../types/place';

type UsePlaceSearchResult = {
  query: string;
  setQuery: (text: string) => void;
  results: Place[];
  isSearching: boolean;
  hasSearched: boolean;
  clearSearch: () => void;
};

export function usePlaceSearch(
  location: UserCoordinates | null,
  hasValidLocation: boolean,
): UsePlaceSearchResult {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Place[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const requestIdRef = useRef(0);

  const clearSearch = useCallback(() => {
    requestIdRef.current += 1;
    setQuery('');
    setResults([]);
    setHasSearched(false);
    setIsSearching(false);
  }, []);

  const runSearch = useCallback(
    async (text: string) => {
      const trimmed = text.trim();

      if (!hasValidLocation || !location) {
        setResults([]);
        setHasSearched(false);
        setIsSearching(false);
        return;
      }

      if (trimmed.length < SEARCH_MIN_QUERY_LENGTH) {
        setResults([]);
        setHasSearched(false);
        setIsSearching(false);
        return;
      }

      const requestId = ++requestIdRef.current;
      setIsSearching(true);

      try {
        const places = await searchPlacesByText(trimmed, location);

        if (requestId !== requestIdRef.current) {
          return;
        }

        setResults(places);
        setHasSearched(true);
      } catch {
        if (requestId !== requestIdRef.current) {
          return;
        }

        setResults([]);
        setHasSearched(true);
      } finally {
        if (requestId === requestIdRef.current) {
          setIsSearching(false);
        }
      }
    },
    [hasValidLocation, location],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      void runSearch(query);
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
    };
  }, [query, runSearch]);

  return {
    query,
    setQuery,
    results,
    isSearching,
    hasSearched,
    clearSearch,
  };
}
