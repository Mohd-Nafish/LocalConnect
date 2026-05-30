import type {
  BottomTabNavigationProp,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp, CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';

import type { Place } from './place';

export type RootStackParamList = {
  MainTabs: undefined;
  PlaceDetails: { place: Place };
};

export type BottomTabParamList = {
  Home: undefined;
  Map: undefined;
  Favorites: undefined;
  Trending: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type BottomTabScreenPropsFor<T extends keyof BottomTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<BottomTabParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;

export type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export type FavoritesScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList, 'Favorites'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export type TrendingScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList, 'Trending'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export type MapScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList, 'Map'>,
  NativeStackNavigationProp<RootStackParamList>
>;
