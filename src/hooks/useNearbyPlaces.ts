import { useCallback, useEffect, useState } from 'react';

import { getCachedNearbyPlaces } from '../services/placesCache';
import { PlacesApiError } from '../services/placesService';
import type { UserCoordinates } from '../types/location';
import type { Place } from '../types/place';

export type NearbyPlacesStatus = 'idle' | 'loading' | 'success' | 'error';

type UseNearbyPlacesResult = {
  places: Place[];
  status: NearbyPlacesStatus;
  isRefreshing: boolean;
  errorMessage: string | null;
  retry: (options?: { refresh?: boolean }) => Promise<void>;
};

export function useNearbyPlaces(
  location: UserCoordinates | null,
  hasValidLocation: boolean,
): UseNearbyPlacesResult {
  const [places, setPlaces] = useState<Place[]>([]);
  const [status, setStatus] = useState<NearbyPlacesStatus>('idle');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadPlaces = useCallback(
    async (options?: { refresh?: boolean }) => {
      if (!hasValidLocation || !location) {
        setPlaces([]);
        setStatus('idle');
        setErrorMessage(null);
        return;
      }

      const isRefresh = options?.refresh ?? false;

      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setStatus('loading');
      }

      setErrorMessage(null);

      try {
        const nearbyPlaces = await getCachedNearbyPlaces(location, isRefresh);
        setPlaces(nearbyPlaces);
        setStatus('success');
      } catch (error) {
        if (!isRefresh) {
          setPlaces([]);
        }

        if (error instanceof PlacesApiError) {
          setErrorMessage(error.message);
        } else if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage('Unable to load nearby places. Please try again.');
        }

        setStatus('error');
      } finally {
        setIsRefreshing(false);
      }
    },
    [location],
  );

  useEffect(() => {
    if (!hasValidLocation) {
      return;
    }

    void loadPlaces();
  }, [hasValidLocation, loadPlaces]);

  return {
    places,
    status,
    isRefreshing,
    errorMessage,
    retry: loadPlaces,
  };
}
