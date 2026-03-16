import { MD3LightTheme } from 'react-native-paper';

// Professional Blue Theme - Matching Web Application
export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1C5AA3',
    primaryContainer: '#E8F1FF',
    secondary: '#2563EB',
    secondaryContainer: '#EFF6FF',
    tertiary: '#0EA5E9',
    error: '#DC2626',
    errorContainer: '#FEE2E2',
    background: '#FAFBFF',
    surface: '#FFFFFF',
    surfaceVariant: '#F1F5F9',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onBackground: '#0F172A',
    onSurface: '#0F172A',
    outline: '#CBD5E1',
    info: '#0EA5E9',
    success: '#059669',
    warning: '#D97706',
  },
};

export const colors = {
  // Professional Blue Brand Colors
  primary: '#1C5AA3',
  primaryLight: '#2563EB',
  primaryDark: '#1E40AF',
  
  // Professional Blue Variants
  blue50: '#EFF6FF',
  blue100: '#DBEAFE',
  blue200: '#BFDBFE',
  blue300: '#93C5FD',
  blue400: '#60A5FA',
  blue500: '#3B82F6',
  blue600: '#2563EB',
  blue700: '#1D4ED8',
  blue800: '#1E40AF',
  blue900: '#1E3A8A',
  
  // Dashboard Card Colors - Professional Blue Theme
  revenue: '#EFF6FF',
  revenueIcon: '#2563EB',
  orders: '#F0F9FF',
  ordersIcon: '#0EA5E9',
  customers: '#ECFDF5',
  customersIcon: '#059669',
  products: '#FEF3C7',
  productsIcon: '#D97706',
  
  // Semantic Colors
  success: '#059669',
  successLight: '#ECFDF5',
  warning: '#D97706',
  warningLight: '#FEF3C7',
  error: '#DC2626',
  errorLight: '#FEE2E2',
  info: '#0EA5E9',
  infoLight: '#F0F9FF',
  
  // Background & Surface - Professional
  background: '#FAFBFF',
  backgroundGradientStart: '#FAFBFF',
  backgroundGradientEnd: '#F1F5F9',
  surface: '#FFFFFF',
  surfaceHeader: '#F8FAFC',
  surfaceElevated: '#FFFFFF',
  
  // Text Colors - Professional
  text: '#0F172A',
  textSecondary: '#475569',
  textLight: '#64748B',
  textMuted: '#94A3B8',
  
  // Border & Divider - Subtle
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  divider: '#F1F5F9',
  
  // Professional Status Colors
  statusActive: '#059669',
  statusInactive: '#6B7280',
  statusPending: '#D97706',
  statusError: '#DC2626',
  
  // Shadow
  shadow: '#0F172A',
  shadowLight: '#64748B',
};

// Professional spacing and sizing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

// Professional typography
export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    color: colors.text,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    color: colors.text,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    color: colors.text,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    color: colors.text,
  },
  bodySecondary: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: colors.textSecondary,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    color: colors.textLight,
  },
};