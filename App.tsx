import React, { useEffect, useState } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import * as Updates from 'expo-updates';
import AppNavigator from './src/navigation/AppNavigator';
import { useAuthStore } from './src/store/authStore';
import { theme } from './src/theme';
import { ErrorBoundary } from './src/components';

export default function App() {
  const loadUser = useAuthStore((state) => state.loadUser);
  const [isCheckingUpdates, setIsCheckingUpdates] = useState(true);

  useEffect(() => {
    loadUser();
    checkForUpdates();
  }, []);

  const checkForUpdates = async () => {
    try {
      // Only check for updates in production builds
      if (!__DEV__) {
        const update = await Updates.checkForUpdateAsync();
        
        if (update.isAvailable) {
          console.log('Update available, downloading...');
          await Updates.fetchUpdateAsync();
          console.log('Update downloaded, reloading app...');
          await Updates.reloadAsync();
        } else {
          console.log('App is up to date');
        }
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
    } finally {
      setIsCheckingUpdates(false);
    }
  };

  // Show loading screen while checking for updates
  if (isCheckingUpdates && !__DEV__) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976D2" />
        <Text style={styles.loadingText}>Checking for updates...</Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <PaperProvider theme={theme}>
        <StatusBar style="light" backgroundColor="#1976D2" />
        <AppNavigator />
      </PaperProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});
