import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import { PlaceDetailsScreen } from '../screens/PlaceDetailsScreen';
import type { RootStackParamList } from '../types/navigation';
import { BottomTabNavigator } from './BottomTabNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
        <Stack.Screen name="PlaceDetails" component={PlaceDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
