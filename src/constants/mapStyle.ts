import type { MapStyleElement } from 'react-native-maps';

export const MODERN_MAP_STYLE: MapStyleElement[] = [
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'transit',
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#ffffff' }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [{ color: '#f1f5f9' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#dbeafe' }],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{ color: '#f8fafc' }],
  },
];

export const MAP_DELTA = 0.05;
export const MAP_FOCUS_DELTA = 0.015;
export const MAP_SHEET_LATITUDE_OFFSET = 0.008;
