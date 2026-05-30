export function getGooglePlacesApiKey(): string {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    throw new Error(
      'EXPO_PUBLIC_GOOGLE_MAPS_API_KEY is not set. Add it to your .env file.',
    );
  }

  return apiKey;
}
