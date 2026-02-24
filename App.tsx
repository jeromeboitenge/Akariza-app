import React, { useEffect } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { initDatabase } from './src/database';

export default function App() {
  useEffect(() => {
    initDatabase().catch(console.error);
  }, []);

  return (
    <PaperProvider>
      <AppNavigator />
      <StatusBar style="auto" />
    </PaperProvider>
  );
}
