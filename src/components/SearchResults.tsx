import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';
import type { Place, PlaceWithDistance } from '../types/place';
import { PlaceCard } from './PlaceCard';

type SearchResultsProps = {
  query: string;
  results: PlaceWithDistance[];
  isSearching: boolean;
  hasSearched: boolean;
  onPlacePress: (place: Place) => void;
};

export function SearchResults({
  query,
  results,
  isSearching,
  hasSearched,
  onPlacePress,
}: SearchResultsProps) {
  if (isSearching) {
    return (
      <View style={styles.stateContainer}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={styles.stateText}>Searching...</Text>
      </View>
    );
  }

  if (hasSearched && results.length === 0) {
    return (
      <View style={styles.stateContainer}>
        <View style={styles.iconCircle}>
          <Ionicons name="search-outline" size={32} color={colors.primary} />
        </View>
        <Text style={styles.emptyTitle}>No places found</Text>
        <Text style={styles.stateText}>
          No results for &quot;{query}&quot;. Try a different search.
        </Text>
      </View>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <View style={styles.results}>
      <Text style={styles.resultsTitle}>Search Results</Text>
      <View style={styles.cardList}>
        {results.map((place) => (
          <PlaceCard
            key={place.id}
            place={place}
            onPress={() => onPlacePress(place)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  results: {
    gap: spacing.xs,
  },
  resultsTitle: {
    ...typography.sectionTitle,
  },
  cardList: {
    gap: spacing.sm,
  },
  stateContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  iconCircle: {
    width: spacing.lg * 2,
    height: spacing.lg * 2,
    borderRadius: spacing.lg,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  emptyTitle: {
    ...typography.sectionTitle,
    textAlign: 'center',
  },
  stateText: {
    ...typography.caption,
    textAlign: 'center',
    color: colors.textSecondary,
  },
});
