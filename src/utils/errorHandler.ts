import { ApiService } from '../services/apiService';

/**
 * Centralized error handling utility
 */
export class ErrorHandler {
  /**
   * Handle API error and return user-friendly message
   */
  static handleApiError(error: any): string {
    return ApiService.formatError(error);
  }

  /**
   * Handle API error with logging
   */
  static handleApiErrorWithLog(error: any, context?: string): string {
    const message = this.handleApiError(error);
    console.error(`❌ ${context || 'API Error'}:`, message);
    return message;
  }

  /**
   * Handle form validation error
   */
  static handleValidationError(error: any): Record<string, string> {
    const errors: Record<string, string> = {};

    if (ApiService.isValidationError(error)) {
      const validationErrors = ApiService.getValidationErrors(error);
      Object.entries(validationErrors).forEach(([field, messages]) => {
        errors[field] = Array.isArray(messages) ? messages[0] : messages;
      });
    } else {
      errors.general = this.handleApiError(error);
    }

    return errors;
  }

  /**
   * Handle network error
   */
  static handleNetworkError(error: any): string {
    if (ApiService.isNetworkError(error)) {
      return 'Network error. Please check your internet connection.';
    }
    return this.handleApiError(error);
  }

  /**
   * Handle authentication error
   */
  static handleAuthError(error: any): string {
    if (ApiService.isAuthError(error)) {
      return 'Your session has expired. Please login again.';
    }
    return this.handleApiError(error);
  }

  /**
   * Handle permission error
   */
  static handlePermissionError(error: any): string {
    if (ApiService.isPermissionError(error)) {
      return 'You do not have permission to perform this action.';
    }
    return this.handleApiError(error);
  }

  /**
   * Handle server error
   */
  static handleServerError(error: any): string {
    const status = error?.response?.status;
    if (status && status >= 500) {
      return 'Server error. Please try again later.';
    }
    return this.handleApiError(error);
  }

  /**
   * Get error details for debugging
   */
  static getErrorDetails(error: any): {
    message: string;
    status?: number;
    data?: any;
    isNetwork: boolean;
    isAuth: boolean;
    isPermission: boolean;
    isValidation: boolean;
    isServer: boolean;
  } {
    return {
      message: this.handleApiError(error),
      status: error?.response?.status,
      data: error?.response?.data,
      isNetwork: ApiService.isNetworkError(error),
      isAuth: ApiService.isAuthError(error),
      isPermission: ApiService.isPermissionError(error),
      isValidation: ApiService.isValidationError(error),
      isServer: (error?.response?.status || 0) >= 500,
    };
  }

  /**
   * Log error details for debugging
   */
  static logErrorDetails(error: any, context?: string): void {
    const details = this.getErrorDetails(error);
    console.group(`❌ Error Details${context ? ` - ${context}` : ''}`);
    console.log('Message:', details.message);
    console.log('Status:', details.status);
    console.log('Data:', details.data);
    console.log('Type:', {
      network: details.isNetwork,
      auth: details.isAuth,
      permission: details.isPermission,
      validation: details.isValidation,
      server: details.isServer,
    });
    console.groupEnd();
  }

  /**
   * Retry operation with exponential backoff
   */
  static async retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000
  ): Promise<T> {
    let lastError: any;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        // Don't retry on 4xx errors (except 429)
        if (error?.response?.status && error.response.status >= 400 && error.response.status < 500) {
          if (error.response.status !== 429) {
            throw error;
          }
        }

        if (attempt < maxRetries - 1) {
          const delay = delayMs * Math.pow(2, attempt);
          console.log(`🔄 Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  }

  /**
   * Handle error in try-catch block
   */
  static catch(error: any, defaultMessage: string = 'An error occurred'): string {
    try {
      return this.handleApiError(error);
    } catch {
      return defaultMessage;
    }
  }

  /**
   * Create error object for state management
   */
  static createErrorState(error: any, context?: string) {
    return {
      hasError: true,
      error: this.handleApiError(error),
      context,
      timestamp: new Date().toISOString(),
      details: this.getErrorDetails(error),
    };
  }

  /**
   * Clear error state
   */
  static clearErrorState() {
    return {
      hasError: false,
      error: null,
      context: null,
      timestamp: null,
      details: null,
    };
  }

  /**
   * Handle multiple errors
   */
  static handleMultipleErrors(errors: any[]): string[] {
    return errors.map((error) => this.handleApiError(error));
  }

  /**
   * Combine multiple error messages
   */
  static combineErrors(errors: any[]): string {
    const messages = this.handleMultipleErrors(errors);
    return messages.join('; ');
  }

  /**
   * Check if error should be retried
   */
  static shouldRetry(error: any): boolean {
    // Retry on network errors
    if (ApiService.isNetworkError(error)) return true;

    // Retry on 429 (rate limit)
    if (error?.response?.status === 429) return true;

    // Retry on 5xx errors
    if ((error?.response?.status || 0) >= 500) return true;

    // Don't retry on 4xx errors
    if (error?.response?.status && error.response.status >= 400 && error.response.status < 500) {
      return false;
    }

    return false;
  }

  /**
   * Get retry delay based on error
   */
  static getRetryDelay(error: any, attempt: number = 0): number {
    // For rate limit errors, use Retry-After header if available
    if (error?.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'];
      if (retryAfter) {
        return parseInt(retryAfter) * 1000;
      }
    }

    // Exponential backoff
    return 1000 * Math.pow(2, attempt);
  }
}
