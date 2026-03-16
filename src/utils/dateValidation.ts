import { isValid, parseISO, format, isBefore, isAfter, startOfDay, endOfDay } from 'date-fns';

export class DateValidation {
  /**
   * Validate if a date string is a valid date
   */
  static isValidDate(dateString: string | Date | null | undefined): boolean {
    if (!dateString) return false;
    
    try {
      const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
      return isValid(date);
    } catch {
      return false;
    }
  }

  /**
   * Validate if a date is not in the future
   */
  static isNotFutureDate(dateString: string | Date): boolean {
    if (!this.isValidDate(dateString)) return false;
    
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    const today = endOfDay(new Date());
    
    return !isAfter(date, today);
  }

  /**
   * Validate if a date is not too far in the past (e.g., more than 5 years)
   */
  static isReasonableDate(dateString: string | Date, maxYearsBack: number = 5): boolean {
    if (!this.isValidDate(dateString)) return false;
    
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - maxYearsBack);
    
    return !isBefore(date, startOfDay(minDate));
  }

  /**
   * Validate date range (start <= end)
   */
  static isValidDateRange(startDate: string | Date, endDate: string | Date): boolean {
    if (!this.isValidDate(startDate) || !this.isValidDate(endDate)) return false;
    
    const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
    const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
    
    return !isAfter(start, end);
  }

  /**
   * Sanitize and format date for API submission (YYYY-MM-DD format)
   */
  static formatForAPI(date: Date | string): string {
    if (!this.isValidDate(date)) {
      throw new Error('Invalid date provided');
    }
    
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    // Send in YYYY-MM-DD format as expected by backend
    return format(dateObj, 'yyyy-MM-dd');
  }

  /**
   * Validate expense date (not future, not too old)
   */
  static validateExpenseDate(date: string | Date): { isValid: boolean; error?: string } {
    if (!this.isValidDate(date)) {
      return { isValid: false, error: 'Invalid date format' };
    }

    if (!this.isNotFutureDate(date)) {
      return { isValid: false, error: 'Expense date cannot be in the future' };
    }

    if (!this.isReasonableDate(date, 2)) {
      return { isValid: false, error: 'Expense date cannot be more than 2 years old' };
    }

    return { isValid: true };
  }

  /**
   * Validate task due date (can be future, but reasonable)
   */
  static validateDueDate(date: string | Date): { isValid: boolean; error?: string } {
    if (!date) return { isValid: true }; // Due date is optional
    
    if (!this.isValidDate(date)) {
      return { isValid: false, error: 'Invalid date format' };
    }

    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const maxFutureDate = new Date();
    maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 5);

    if (isAfter(dateObj, maxFutureDate)) {
      return { isValid: false, error: 'Due date cannot be more than 5 years in the future' };
    }

    return { isValid: true };
  }

  /**
   * Validate promotion date range
   */
  static validatePromotionDates(startDate: string | Date, endDate: string | Date): { isValid: boolean; error?: string } {
    if (!this.isValidDate(startDate) || !this.isValidDate(endDate)) {
      return { isValid: false, error: 'Invalid date format' };
    }

    if (!this.isValidDateRange(startDate, endDate)) {
      return { isValid: false, error: 'End date must be after start date' };
    }

    const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
    const maxFutureDate = new Date();
    maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 2);

    if (isAfter(start, maxFutureDate)) {
      return { isValid: false, error: 'Promotion cannot be scheduled more than 2 years in advance' };
    }

    return { isValid: true };
  }

  /**
   * Get today's date in YYYY-MM-DD format for input fields
   */
  static getTodayString(): string {
    return format(new Date(), 'yyyy-MM-dd');
  }

  /**
   * Get date string for input field (handles null/undefined)
   */
  static getDateString(date: Date | string | null | undefined): string {
    if (!date) return '';
    
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      return isValid(dateObj) ? format(dateObj, 'yyyy-MM-dd') : '';
    } catch {
      return '';
    }
  }

  /**
   * Format date for display - Enhanced for Prisma DateTime fields
   */
  static formatForDisplay(date: Date | string | null | undefined): string {
    if (!date) return '-';
    
    // Handle empty objects that come from backend serialization issues
    if (typeof date === 'object' && !(date instanceof Date)) {
      if (Object.keys(date).length === 0) {
        // For now, return a placeholder until backend is fixed
        return 'Date pending';
      }
    }
    
    try {
      let dateObj: Date;
      
      if (typeof date === 'string') {
        // Handle various date string formats
        if (date.includes('T') || date.includes('Z')) {
          // ISO string format (2026-03-13T11:24:25.432Z) - Common from Prisma
          dateObj = new Date(date);
        } else if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
          // YYYY-MM-DD format
          dateObj = parseISO(date);
        } else if (date.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/)) {
          // YYYY-MM-DD HH:mm:ss format (SQL datetime)
          dateObj = new Date(date.replace(' ', 'T'));
        } else {
          // Fallback to Date constructor for other formats
          dateObj = new Date(date);
        }
      } else if (date instanceof Date) {
        dateObj = date;
      } else {
        // Handle other object types - return placeholder for now
        return 'Date pending';
      }
      
      // Check if the date is valid
      if (isNaN(dateObj.getTime()) || !isValid(dateObj)) {
        return 'Date pending';
      }
      
      return format(dateObj, 'MMM dd, yyyy');
    } catch (error) {
      // Return placeholder instead of error for better UX
      return 'Date pending';
    }
  }
}