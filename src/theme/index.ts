import { MD3LightTheme } from 'react-native-paper';

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1976D2',
    primaryContainer: '#BBDEFB',
    secondary: '#2196F3',
    secondaryContainer: '#E3F2FD',
    tertiary: '#0D47A1',
    error: '#D32F2F',
    errorContainer: '#FFCDD2',
    background: '#F5F7FA',
    surface: '#FFFFFF',
    surfaceVariant: '#E3F2FD',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onBackground: '#1A1C1E',
    onSurface: '#1A1C1E',
    outline: '#90CAF9',
  },
};

export const colors = {
  primary: '#1976D2',
  primaryLight: '#42A5F5',
  primaryDark: '#0D47A1',
  secondary: '#2196F3',
  accent: '#03A9F4',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  background: '#F5F7FA',
  surface: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
  shadow: '#000000',
};
