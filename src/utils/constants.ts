// Using local backend (change to your machine's IP for phone testing)
export const API_URL = 'http://172.31.87.12:3000/api/v1';
// For emulator use: http://10.0.2.2:3000/api/v1
// For Render deployment: https://akariza-backend.onrender.com/api/v1

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
  info: '#2196F3',
  pending: '#FFC107',
};

// Role permissions
export const ROLE_PERMISSIONS = {
  SYSTEM_ADMIN: ['*'],
  BOSS: ['*'],
  MANAGER: ['products', 'purchases', 'suppliers', 'expenses', 'reports', 'branches'],
  CASHIER: ['sales', 'customers', 'products:read'],
};
