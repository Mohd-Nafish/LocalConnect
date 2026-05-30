import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { ComponentProps } from 'react';
import { StyleSheet } from 'react-native';

import {
  FavoritesScreen,
  HomeScreen,
  MapScreen,
  TrendingScreen,
} from '../screens';
import { colors, spacing, typography } from '../theme';
import type { BottomTabParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<BottomTabParamList>();

type TabIconName = ComponentProps<typeof Ionicons>['name'];

const tabIcons: Record<keyof BottomTabParamList, { active: TabIconName; inactive: TabIconName }> = {
  Home: { active: 'home', inactive: 'home-outline' },
  Map: { active: 'map', inactive: 'map-outline' },
  Favorites: { active: 'heart', inactive: 'heart-outline' },
  Trending: { active: 'flame', inactive: 'flame-outline' },
};

export function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ focused, color, size }) => {
          const icons = tabIcons[route.name];
          const iconName = focused ? icons.active : icons.inactive;
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Trending" component={TrendingScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.borderLight,
    borderTopWidth: 1,
    paddingTop: spacing.xs,
    height: spacing.touchTarget + spacing.md,
  },
  tabLabel: {
    ...typography.tabLabel,
  },
});
