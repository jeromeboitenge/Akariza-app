/**
 * Comprehensive logging utility for debugging and monitoring
 * OTA Update Test - Using eas update --auto
 */

enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: string;
  message: string;
  data?: any;
  error?: any;
}

export class Logger {
  private static logs: LogEntry[] = [];
  private static maxLogs = 1000;
  private static isDevelopment = __DEV__;

  /**
   * Log debug message
   */
  static debug(category: string, message: string, data?: any): void {
    this.log(LogLevel.DEBUG, category, message, data);
  }

  /**
   * Log info message
   */
  static info(category: string, message: string, data?: any): void {
    this.log(LogLevel.INFO, category, message, data);
  }

  /**
   * Log warning message
   */
  static warn(category: string, message: string, data?: any): void {
    this.log(LogLevel.WARN, category, message, data);
  }

  /**
   * Log error message
   */
  static error(category: string, message: string, error?: any): void {
    this.log(LogLevel.ERROR, category, message, undefined, error);
  }

  /**
   * Internal log method
   */
  private static log(
    level: LogLevel,
    category: string,
    message: string,
    data?: any,
    error?: any
  ): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data,
      error,
    };

    // Add to logs array
    this.logs.push(entry);

    // Keep logs size manageable
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output
    if (this.isDevelopment) {
      this.consoleLog(entry);
    }
  }

  /**
   * Console output with formatting
   */
  private static consoleLog(entry: LogEntry): void {
    const prefix = this.getPrefix(entry.level);
    const timestamp = entry.timestamp.split('T')[1].split('.')[0];

    console.log(
      `${prefix} [${timestamp}] ${entry.category}: ${entry.message}`,
      entry.data || entry.error || ''
    );
  }

  /**
   * Get console prefix based on log level
   */
  private static getPrefix(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG:
        return '🔍';
      case LogLevel.INFO:
        return 'ℹ️';
      case LogLevel.WARN:
        return '⚠️';
      case LogLevel.ERROR:
        return '❌';
      default:
        return '📝';
    }
  }

  /**
   * Get all logs
   */
  static getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs by level
   */
  static getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter((log) => log.level === level);
  }

  /**
   * Get logs by category
   */
  static getLogsByCategory(category: string): LogEntry[] {
    return this.logs.filter((log) => log.category === category);
  }

  /**
   * Get recent logs
   */
  static getRecentLogs(count: number = 50): LogEntry[] {
    return this.logs.slice(-count);
  }

  /**
   * Clear all logs
   */
  static clearLogs(): void {
    this.logs = [];
    console.log('📝 Logs cleared');
  }

  /**
   * Export logs as JSON
   */
  static exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Log API request
   */
  static logApiRequest(method: string, endpoint: string, data?: any): void {
    this.info('API', `${method.toUpperCase()} ${endpoint}`, data);
  }

  /**
   * Log API response
   */
  static logApiResponse(endpoint: string, status: number, data?: any): void {
    this.info('API', `Response from ${endpoint} (${status})`, data);
  }

  /**
   * Log API error
   */
  static logApiError(endpoint: string, error: any): void {
    this.error('API', `Error from ${endpoint}`, error);
  }

  /**
   * Log screen navigation
   */
  static logNavigation(screenName: string, params?: any): void {
    this.info('Navigation', `Navigating to ${screenName}`, params);
  }

  /**
   * Log user action
   */
  static logUserAction(action: string, details?: any): void {
    this.info('User', action, details);
  }

  /**
   * Log data store update
   */
  static logStoreUpdate(storeName: string, action: string, data?: any): void {
    this.debug('Store', `${storeName} - ${action}`, data);
  }

  /**
   * Log authentication event
   */
  static logAuthEvent(event: string, details?: any): void {
    this.info('Auth', event, details);
  }

  /**
   * Log sync event
   */
  static logSyncEvent(event: string, details?: any): void {
    this.info('Sync', event, details);
  }

  /**
   * Log cache event
   */
  static logCacheEvent(event: string, key: string, details?: any): void {
    this.debug('Cache', `${event} - ${key}`, details);
  }

  /**
   * Log performance metric
   */
  static logPerformance(operation: string, duration: number): void {
    this.info('Performance', `${operation} took ${duration}ms`);
  }

  /**
   * Log validation error
   */
  static logValidationError(field: string, error: string): void {
    this.warn('Validation', `${field}: ${error}`);
  }

  /**
   * Create performance timer
   */
  static createTimer(label: string) {
    const startTime = Date.now();
    return {
      end: () => {
        const duration = Date.now() - startTime;
        this.logPerformance(label, duration);
        return duration;
      },
    };
  }

  /**
   * Get log statistics
   */
  static getStatistics() {
    const stats = {
      total: this.logs.length,
      byLevel: {
        debug: this.getLogsByLevel(LogLevel.DEBUG).length,
        info: this.getLogsByLevel(LogLevel.INFO).length,
        warn: this.getLogsByLevel(LogLevel.WARN).length,
        error: this.getLogsByLevel(LogLevel.ERROR).length,
      },
      categories: {} as Record<string, number>,
    };

    // Count by category
    this.logs.forEach((log) => {
      stats.categories[log.category] = (stats.categories[log.category] || 0) + 1;
    });

    return stats;
  }

  /**
   * Print log statistics
   */
  static printStatistics(): void {
    const stats = this.getStatistics();
    console.group('📊 Log Statistics');
    console.log('Total logs:', stats.total);
    console.log('By level:', stats.byLevel);
    console.log('By category:', stats.categories);
    console.groupEnd();
  }

  /**
   * Group related logs
   */
  static groupLogs(category: string): void {
    const logs = this.getLogsByCategory(category);
    console.group(`📝 ${category} (${logs.length} logs)`);
    logs.forEach((log) => {
      console.log(`[${log.timestamp}] ${log.message}`, log.data || log.error || '');
    });
    console.groupEnd();
  }

  /**
   * Enable/disable development mode
   */
  static setDevelopmentMode(enabled: boolean): void {
    this.isDevelopment = enabled;
  }

  /**
   * Set max logs to keep
   */
  static setMaxLogs(max: number): void {
    this.maxLogs = max;
  }
}

// Export singleton instance
export default Logger;
