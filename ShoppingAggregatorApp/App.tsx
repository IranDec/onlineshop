import './src/localization/i18n'; // Initialize i18next
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store'; // Assuming store is configured in src/store/index.ts
import AppNavigator from './src/navigation/AppNavigator';
import { ActivityIndicator, View } from 'react-native'; // For PersistGate loading

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
        <AppNavigator />
      </PersistGate>
    </Provider>
  );
}

// Optional: Add a basic loading indicator style if needed, or rely on default
// const styles = StyleSheet.create({
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   }
// });

export default App;
