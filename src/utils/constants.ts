// API Configuration
// Production backend URL
export const API_URL = 'https://akariza-backend.onrender.com/api/v1';

// For local development, uncomment one of these:
// export const API_URL = 'http://localhost:5000/api/v1'; // Same machine
// export const API_URL = 'http://10.0.2.2:5000/api/v1'; // Android emulator
// export const API_URL = 'http://172.31.150.43:5000/api/v1'; // Physical device on network

export const SYNC_INTERVAL = 300000; // 5 minutes
export const MAX_OFFLINE_RECORDS = 1000;

// App Configuration
export const APP_NAME = 'Akariza';
export const APP_VERSION = '1.0.0';

// Pagination
export const PAGE_SIZE = 20;

// Debounce delays
export const SEARCH_DEBOUNCE_MS = 500;

// Cache durations
export const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

// Status colors
export const STATUS_COLORS = {
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#5C6BF2',
  pending: '#FFC107',
};

// Role permissions
export const ROLE_PERMISSIONS = {
  SYSTEM_ADMIN: ['*'],
  BOSS: ['*'],
  MANAGER: ['products', 'purchases', 'suppliers', 'expenses', 'reports', 'branches'],
  CASHIER: ['sales', 'customers', 'products:read'],
};
