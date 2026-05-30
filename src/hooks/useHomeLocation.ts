import { useCurrentLocation } from './useCurrentLocation';
import { useLocationContext } from '../context/LocationContext';

/** @deprecated Use useCurrentLocation instead */
export function useHomeLocation() {
  const { greeting } = useLocationContext();
  const { location, city, loading, error, refreshLocation } = useCurrentLocation();

  return {
    coordinates: location,
    cityLabel: city,
    greeting,
    loading,
    error,
    refreshLocation,
  };
}
