import { SafeAreaProvider } from 'react-native-safe-area-context';

import { FavoritesProvider, LocationProvider } from './src/context';
import { RootNavigator } from './src/navigation';

export default function App() {
  return (
    <SafeAreaProvider>
      <LocationProvider>
        <FavoritesProvider>
          <RootNavigator />
        </FavoritesProvider>
      </LocationProvider>
    </SafeAreaProvider>
  );
}
