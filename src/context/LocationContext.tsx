import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { getUserLocationWithCity } from '../services/locationService';
import type {
  CurrentLocationState,
  LocationErrorReason,
  UserCoordinates,
} from '../types/location';
import { getTimeGreeting } from '../utils/greeting';

const LocationContext = createContext<CurrentLocationState | null>(null);

type LocationProviderProps = {
  children: ReactNode;
};

export function LocationProvider({ children }: LocationProviderProps) {
  const [location, setLocation] = useState<UserCoordinates | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<LocationErrorReason | null>(null);
  const greeting = getTimeGreeting();

  const refreshLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await getUserLocationWithCity();

    if (result.ok) {
      setLocation(result.location.coordinates);
      setCity(result.location.address.label);
      setError(null);
    } else {
      setLocation(null);
      setCity(null);
      setError(result.reason);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    void refreshLocation();
  }, [refreshLocation]);

  const value = useMemo(
    () => ({
      location,
      city,
      loading,
      error,
      refreshLocation,
      greeting,
    }),
    [location, city, loading, error, refreshLocation, greeting],
  );

  return (
    <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
  );
}

type LocationContextValue = CurrentLocationState & {
  greeting: string;
};

export function useLocationContext(): LocationContextValue {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context as LocationContextValue;
}
