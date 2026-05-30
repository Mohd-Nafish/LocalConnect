import { Linking, Platform } from 'react-native';

type OpenDirectionsParams = {
  latitude: number;
  longitude: number;
  label: string;
};

export async function openDirections({
  latitude,
  longitude,
  label,
}: OpenDirectionsParams): Promise<void> {
  const encodedLabel = encodeURIComponent(label);
  const destination = `${latitude},${longitude}`;

  const url =
    Platform.select({
      ios: `http://maps.apple.com/?daddr=${destination}&q=${encodedLabel}`,
      android: `geo:0,0?q=${destination}(${encodedLabel})`,
      default: `https://www.google.com/maps/dir/?api=1&destination=${destination}`,
    }) ?? `https://www.google.com/maps/dir/?api=1&destination=${destination}`;

  const canOpen = await Linking.canOpenURL(url);
  if (canOpen) {
    await Linking.openURL(url);
    return;
  }

  await Linking.openURL(
    `https://www.google.com/maps/dir/?api=1&destination=${destination}`,
  );
}

export async function openWebsite(url: string): Promise<void> {
  await Linking.openURL(url);
}

export async function openPhone(phone: string): Promise<void> {
  await Linking.openURL(`tel:${phone.replace(/\s/g, '')}`);
}
