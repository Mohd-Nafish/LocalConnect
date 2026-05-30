import { useCallback, useEffect, useState } from 'react';

import { getCachedPlaceDetails } from '../services/placesCache';
import type { Place } from '../types/place';

type PlaceDetailsStatus = 'loading' | 'success' | 'error';

type UsePlaceDetailsResult = {
  place: Place;
  status: PlaceDetailsStatus;
  retry: () => Promise<void>;
};

export function usePlaceDetails(
  placeId: string,
  initialPlace: Place,
): UsePlaceDetailsResult {
  const [place, setPlace] = useState<Place>(initialPlace);
  const [status, setStatus] = useState<PlaceDetailsStatus>('loading');

  const loadDetails = useCallback(async () => {
    setStatus('loading');

    try {
      const details = await getCachedPlaceDetails(placeId);
      if (details) {
        setPlace(details);
      }
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }, [placeId]);

  useEffect(() => {
    void loadDetails();
  }, [loadDetails]);

  return {
    place,
    status,
    retry: loadDetails,
  };
}
