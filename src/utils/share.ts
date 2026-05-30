import { Share } from 'react-native';

type SharePlaceParams = {
  name: string;
  address: string;
  website?: string;
};

export async function sharePlace({
  name,
  address,
  website,
}: SharePlaceParams): Promise<void> {
  const message = website
    ? `Check out ${name} at ${address}\n${website}`
    : `Check out ${name} at ${address}`;

  await Share.share({ message, title: name });
}
