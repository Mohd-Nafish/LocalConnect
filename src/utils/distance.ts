import type { UserCoordinates } from '../types/location';

const EARTH_RADIUS_KM = 6371;

export function calculateDistanceKm(
  from: UserCoordinates,
  to: UserCoordinates,
): number {
  const latDelta = toRadians(to.latitude - from.latitude);
  const lonDelta = toRadians(to.longitude - from.longitude);
  const fromLat = toRadians(from.latitude);
  const toLat = toRadians(to.latitude);

  const a =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(fromLat) * Math.cos(toLat) * Math.sin(lonDelta / 2) ** 2;

  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(distanceKm: number | null): string {
  if (distanceKm === null) {
    return '—';
  }

  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }

  return `${distanceKm.toFixed(1)} km`;
}

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}
