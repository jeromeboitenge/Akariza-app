import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { theme } from './src/theme';
import { ErrorBoundary } from './src/components';

export default function App() {
  return (
    <ErrorBoundary>
      <PaperProvider theme={theme}>
        <StatusBar style="light" backgroundColor="#1C6FB7" />
        <AppNavigator />
      </PaperProvider>
    </ErrorBoundary>
  );
}
