import React, { useEffect } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { useAuthStore } from './src/store/authStore';
import { theme } from './src/theme';
import { ErrorBoundary } from './src/components';

export default function App() {
  const loadUser = useAuthStore((state) => state.loadUser);

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <ErrorBoundary>
      <PaperProvider theme={theme}>
        <StatusBar style="light" backgroundColor="#1976D2" />
        <AppNavigator />
      </PaperProvider>
    </ErrorBoundary>
  );
}
