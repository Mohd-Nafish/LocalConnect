import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { colors } from '../theme';
import type { PlaceCategory } from '../types/place';
import { PlaceImagePlaceholder } from './PlaceBadges';

type PlacePhotoProps = {
  photoUrl?: string;
  category: PlaceCategory;
  height: number;
};

export function PlacePhoto({ photoUrl, category, height }: PlacePhotoProps) {
  if (!photoUrl) {
    return <PlaceImagePlaceholder category={category} height={height} />;
  }

  return (
    <View style={[styles.container, { height }]}>
      <Image
        source={{ uri: photoUrl }}
        style={styles.image}
        contentFit="cover"
        transition={200}
        placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.borderLight,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
