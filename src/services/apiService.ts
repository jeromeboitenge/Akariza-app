import { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface RetryConfig {
  maxRetries: number;
  delayMs: number;
  backoffMultiplier: number;
}

interface CacheConfig {
  key: string;
  ttl: number; // in milliseconds
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  delayMs: 1000,
  backoffMultiplier: 2,
};

const DEFAULT_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Wraps API calls with error handling, retry logic, and user-friendly messages
 */
export class ApiService {
  /**
   * Execute API call with retry logic
   */
  static async executeWithRetry<T>(
    apiCall: () => Promise<T>,
    config: Partial<RetryConfig> = {}
  ): Promise<ApiResponse<T>> {
    const retryConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
    let lastError: any;

    for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
      try {
        const data = await apiCall();
        return { success: true, data };
      } catch (error: any) {
        lastError = error;

        // Don't retry on 4xx errors (except 429 - rate limit)
        if (error.response?.status && error.response.status >= 400 && error.response.status < 500) {
          if (error.response.status !== 429) {
            break;
          }
        }

        // Don't retry on last attempt
        if (attempt === retryConfig.maxRetries) {
          break;
        }

        // Calculate delay with exponential backoff
        const delay = retryConfig.delayMs * Math.pow(retryConfig.backoffMultiplier, attempt);
        console.log(`🔄 Retry attempt ${attempt + 1}/${retryConfig.maxRetries} after ${delay}ms`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    // Handle error response
    const errorMessage = this.getErrorMessage(lastError);
    console.error('❌ API Error:', errorMessage);

    return {
      success: false,
      error: errorMessage,
      message: lastError?.response?.data?.message || errorMessage,
    };
  }

  /**
   * Execute API call with caching
   */
  static async executeWithCache<T>(
    apiCall: () => Promise<T>,
    cacheConfig: CacheConfig
  ): Promise<ApiResponse<T>> {
    try {
      // Try to get from cache
      const cached = await this.getFromCache<T>(cacheConfig.key);
      if (cached) {
        console.log(`💾 Cache hit for ${cacheConfig.key}`);
        return { success: true, data: cached };
      }

      // Fetch from API
      const data = await apiCall();

      // Store in cache
      await this.setInCache(cacheConfig.key, data, cacheConfig.ttl);

      return { success: true, data };
    } catch (error: any) {
      const errorMessage = this.getErrorMessage(error);
      console.error('❌ API Error:', errorMessage);

      return {
        success: false,
        error: errorMessage,
        message: error?.response?.data?.message || errorMessage,
      };
    }
  }

  /**
   * Get data from cache
   */
  static async getFromCache<T>(key: string): Promise<T | null> {
    try {
      const cached = await AsyncStorage.getItem(`cache_${key}`);
      if (!cached) return null;

      const { data, timestamp, ttl } = JSON.parse(cached);

      // Check if cache is expired
      if (Date.now() - timestamp > ttl) {
        await AsyncStorage.removeItem(`cache_${key}`);
        return null;
      }

      return data as T;
    } catch (error) {
      console.error('❌ Cache read error:', error);
      return null;
    }
  }

  /**
   * Store data in cache
   */
  static async setInCache<T>(key: string, data: T, ttl: number = DEFAULT_CACHE_TTL): Promise<void> {
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
        ttl,
      };
      await AsyncStorage.setItem(`cache_${key}`, JSON.stringify(cacheData));
    } catch (error) {
      console.error('❌ Cache write error:', error);
    }
  }

  /**
   * Clear specific cache
   */
  static async clearCache(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`cache_${key}`);
      console.log(`🗑️ Cache cleared for ${key}`);
    } catch (error) {
      console.error('❌ Cache clear error:', error);
    }
  }

  /**
   * Clear all cache
   */
  static async clearAllCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter((key) => key.startsWith('cache_'));
      await AsyncStorage.multiRemove(cacheKeys);
      console.log(`🗑️ All cache cleared (${cacheKeys.length} items)`);
    } catch (error) {
      console.error('❌ Clear all cache error:', error);
    }
  }

  /**
   * Extract user-friendly error message from API error
   */
  static getErrorMessage(error: any): string {
    if (!error) return 'An unexpected error occurred';

    // Network error
    if (error.message === 'Network Error' || !error.response) {
      return 'Network error. Please check your internet connection.';
    }

    const status = error.response?.status;
    const data = error.response?.data;

    // Use backend message if available
    if (data?.message) {
      return data.message;
    }

    // Status-based messages
    switch (status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Session expired. Please login again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'Resource not found.';
      case 409:
        return 'This resource already exists.';
      case 422:
        return 'Validation error. Please check your input.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
      case 502:
      case 503:
        return 'Server error. Please try again later.';
      default:
        return error.message || 'An error occurred. Please try again.';
    }
  }

  /**
   * Check if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem('accessToken');
    return !!token;
  }

  /**
   * Get current user from storage
   */
  static async getCurrentUser(): Promise<any> {
    const userJson = await AsyncStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }

  /**
   * Get current user role
   */
  static async getUserRole(): Promise<string | null> {
    const user = await this.getCurrentUser();
    return user?.role || null;
  }

  /**
   * Check if user has specific role
   */
  static async hasRole(role: string): Promise<boolean> {
    const userRole = await this.getUserRole();
    return userRole === role;
  }

  /**
   * Check if user has any of the specified roles
   */
  static async hasAnyRole(roles: string[]): Promise<boolean> {
    const userRole = await this.getUserRole();
    return roles.includes(userRole || '');
  }

  /**
   * Clear authentication data
   */
  static async clearAuth(): Promise<void> {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
    console.log('🔒 Authentication cleared');
  }

  /**
   * Log API call for debugging
   */
  static logApiCall(method: string, endpoint: string, data?: any): void {
    console.log(`📡 ${method.toUpperCase()} ${endpoint}`, data ? JSON.stringify(data, null, 2) : '');
  }

  /**
   * Log API response for debugging
   */
  static logApiResponse(endpoint: string, data: any): void {
    console.log(`✅ Response from ${endpoint}:`, JSON.stringify(data, null, 2));
  }

  /**
   * Format API error for display
   */
  static formatError(error: any): string {
    if (typeof error === 'string') return error;
    if (error?.userMessage) return error.userMessage;
    if (error?.message) return error.message;
    return this.getErrorMessage(error);
  }

  /**
   * Check if error is network error
   */
  static isNetworkError(error: any): boolean {
    return !error?.response || error.message === 'Network Error';
  }

  /**
   * Check if error is authentication error
   */
  static isAuthError(error: any): boolean {
    return error?.response?.status === 401;
  }

  /**
   * Check if error is permission error
   */
  static isPermissionError(error: any): boolean {
    return error?.response?.status === 403;
  }

  /**
   * Check if error is validation error
   */
  static isValidationError(error: any): boolean {
    return error?.response?.status === 422 || error?.response?.status === 400;
  }

  /**
   * Get validation errors from response
   */
  static getValidationErrors(error: any): Record<string, string[]> {
    if (error?.response?.data?.errors) {
      return error.response.data.errors;
    }
    return {};
  }
}

