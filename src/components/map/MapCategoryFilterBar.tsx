import { ScrollView, StyleSheet, View } from 'react-native';

import { PLACE_CATEGORIES } from '../../constants/placeCategories';
import { colors, spacing } from '../../theme';
import type { PlaceCategory } from '../../types/place';
import { CategoryChip } from '../CategoryChip';

type MapCategoryFilterBarProps = {
  selectedCategory: PlaceCategory | null;
  onSelectCategory: (category: PlaceCategory | null) => void;
};

export function MapCategoryFilterBar({
  selectedCategory,
  onSelectCategory,
}: MapCategoryFilterBarProps) {
  const handlePress = (category: PlaceCategory) => {
    onSelectCategory(selectedCategory === category ? null : category);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {PLACE_CATEGORIES.map((category) => (
          <CategoryChip
            key={category}
            label={category}
            selected={selectedCategory === category}
            onPress={() => handlePress(category)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: spacing.cardRadius,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  scrollContent: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    gap: spacing.xs,
  },
});
