import { useLocationContext } from '../context/LocationContext';
import type { CurrentLocationState } from '../types/location';

type UseCurrentLocationResult = CurrentLocationState;

export function useCurrentLocation(): UseCurrentLocationResult {
  const { location, city, loading, error, refreshLocation } = useLocationContext();

  return {
    location,
    city,
    loading,
    error,
    refreshLocation,
  };
}
