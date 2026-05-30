import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { loadStoredFavorites, saveStoredFavorites } from '../services/favoritesStorage';
import type { Place } from '../types/place';

type FavoritesContextValue = {
  favorites: Place[];
  isLoaded: boolean;
  isFavorite: (placeId: string) => boolean;
  addFavorite: (place: Place) => void;
  removeFavorite: (placeId: string) => void;
  toggleFavorite: (place: Place) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

type FavoritesProviderProps = {
  children: ReactNode;
};

async function persistFavorites(favorites: Place[]): Promise<void> {
  await saveStoredFavorites(favorites);
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favorites, setFavorites] = useState<Place[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    void loadStoredFavorites().then((storedFavorites) => {
      if (isMounted) {
        setFavorites(storedFavorites);
        setIsLoaded(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const isFavorite = useCallback(
    (placeId: string) => favorites.some((place) => place.id === placeId),
    [favorites],
  );

  const addFavorite = useCallback((place: Place) => {
    setFavorites((current) => {
      const withoutDuplicate = current.filter((item) => item.id !== place.id);
      const nextFavorites = [...withoutDuplicate, place];
      void persistFavorites(nextFavorites);
      return nextFavorites;
    });
  }, []);

  const removeFavorite = useCallback((placeId: string) => {
    setFavorites((current) => {
      const nextFavorites = current.filter((item) => item.id !== placeId);
      void persistFavorites(nextFavorites);
      return nextFavorites;
    });
  }, []);

  const toggleFavorite = useCallback(
    (place: Place) => {
      if (isFavorite(place.id)) {
        removeFavorite(place.id);
        return;
      }

      addFavorite(place);
    },
    [addFavorite, isFavorite, removeFavorite],
  );

  const value = useMemo(
    () => ({
      favorites,
      isLoaded,
      isFavorite,
      addFavorite,
      removeFavorite,
      toggleFavorite,
    }),
    [favorites, isLoaded, isFavorite, addFavorite, removeFavorite, toggleFavorite],
  );

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
