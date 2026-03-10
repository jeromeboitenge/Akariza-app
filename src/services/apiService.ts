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

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  delayMs: 1000,
  backoffMultiplier: 2,
};

/**
 * Wraps API calls with error handling, retry logic, and user-friendly messages
 */
export class ApiService {
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
   * Clear authentication data
   */
  static async clearAuth(): Promise<void> {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
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
}
