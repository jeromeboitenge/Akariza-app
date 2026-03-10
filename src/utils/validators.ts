/**
 * Comprehensive data validation utilities
 */
export class Validators {
  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number
   */
  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  }

  /**
   * Validate password strength
   */
  static isStrongPassword(password: string): {
    isStrong: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) score++;
    else feedback.push('Password should be at least 8 characters');

    if (password.length >= 12) score++;

    if (/[a-z]/.test(password)) score++;
    else feedback.push('Password should contain lowercase letters');

    if (/[A-Z]/.test(password)) score++;
    else feedback.push('Password should contain uppercase letters');

    if (/\d/.test(password)) score++;
    else feedback.push('Password should contain numbers');

    if (/[!@#$%^&*]/.test(password)) score++;
    else feedback.push('Password should contain special characters');

    return {
      isStrong: score >= 4,
      score,
      feedback,
    };
  }

  /**
   * Validate URL format
   */
  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate number range
   */
  static isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }

  /**
   * Validate string length
   */
  static isValidLength(str: string, min: number, max?: number): boolean {
    if (str.length < min) return false;
    if (max && str.length > max) return false;
    return true;
  }

  /**
   * Validate required field
   */
  static isRequired(value: any): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string' && value.trim() === '') return false;
    if (Array.isArray(value) && value.length === 0) return false;
    return true;
  }

  /**
   * Validate number
   */
  static isValidNumber(value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  /**
   * Validate positive number
   */
  static isPositiveNumber(value: any): boolean {
    return this.isValidNumber(value) && parseFloat(value) > 0;
  }

  /**
   * Validate non-negative number
   */
  static isNonNegativeNumber(value: any): boolean {
    return this.isValidNumber(value) && parseFloat(value) >= 0;
  }

  /**
   * Validate integer
   */
  static isInteger(value: any): boolean {
    return Number.isInteger(parseFloat(value));
  }

  /**
   * Validate date format
   */
  static isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }

  /**
   * Validate date is in future
   */
  static isFutureDate(dateString: string): boolean {
    if (!this.isValidDate(dateString)) return false;
    return new Date(dateString) > new Date();
  }

  /**
   * Validate date is in past
   */
  static isPastDate(dateString: string): boolean {
    if (!this.isValidDate(dateString)) return false;
    return new Date(dateString) < new Date();
  }

  /**
   * Validate date range
   */
  static isValidDateRange(startDate: string, endDate: string): boolean {
    if (!this.isValidDate(startDate) || !this.isValidDate(endDate)) return false;
    return new Date(startDate) <= new Date(endDate);
  }

  /**
   * Validate credit card number (Luhn algorithm)
   */
  static isValidCreditCard(cardNumber: string): boolean {
    const digits = cardNumber.replace(/\D/g, '');
    if (digits.length < 13 || digits.length > 19) return false;

    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i], 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  /**
   * Validate SKU format
   */
  static isValidSKU(sku: string): boolean {
    return /^[A-Z0-9\-]{3,}$/.test(sku);
  }

  /**
   * Validate currency amount
   */
  static isValidCurrency(amount: any): boolean {
    if (!this.isNonNegativeNumber(amount)) return false;
    const decimal = parseFloat(amount);
    return decimal.toFixed(2) === parseFloat(decimal.toFixed(2)).toString();
  }

  /**
   * Validate percentage
   */
  static isValidPercentage(value: any): boolean {
    return this.isInRange(parseFloat(value), 0, 100);
  }

  /**
   * Validate array of items
   */
  static isValidArray(arr: any, minLength: number = 1): boolean {
    return Array.isArray(arr) && arr.length >= minLength;
  }

  /**
   * Validate object has required fields
   */
  static hasRequiredFields(obj: any, fields: string[]): boolean {
    return fields.every((field) => this.isRequired(obj[field]));
  }

  /**
   * Validate enum value
   */
  static isValidEnum(value: any, enumValues: any[]): boolean {
    return enumValues.includes(value);
  }

  /**
   * Validate product data
   */
  static isValidProduct(product: any): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!this.isRequired(product.name)) errors.push('Product name is required');
    if (!this.isRequired(product.sku)) errors.push('SKU is required');
    if (!this.isValidSKU(product.sku)) errors.push('Invalid SKU format');
    if (!this.isPositiveNumber(product.costPrice)) errors.push('Cost price must be positive');
    if (!this.isPositiveNumber(product.sellingPrice)) errors.push('Selling price must be positive');
    if (product.costPrice >= product.sellingPrice) errors.push('Selling price must be greater than cost price');
    if (!this.isNonNegativeNumber(product.currentStock)) errors.push('Stock cannot be negative');

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate sale data
   */
  static isValidSale(sale: any): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!this.isValidArray(sale.items)) errors.push('Sale must have at least one item');
    if (!this.isRequired(sale.paymentMethod)) errors.push('Payment method is required');
    if (!this.isPositiveNumber(sale.amountPaid)) errors.push('Amount paid must be positive');

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate customer data
   */
  static isValidCustomer(customer: any): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!this.isRequired(customer.name)) errors.push('Customer name is required');
    if (customer.email && !this.isValidEmail(customer.email)) errors.push('Invalid email format');
    if (customer.phone && !this.isValidPhone(customer.phone)) errors.push('Invalid phone format');

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate user data
   */
  static isValidUser(user: any): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!this.isRequired(user.email)) errors.push('Email is required');
    if (!this.isValidEmail(user.email)) errors.push('Invalid email format');
    if (!this.isRequired(user.fullName)) errors.push('Full name is required');
    if (user.password && !this.isStrongPassword(user.password).isStrong) {
      errors.push('Password is not strong enough');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Sanitize string input
   */
  static sanitizeString(str: string): string {
    return str.trim().replace(/[<>]/g, '');
  }

  /**
   * Sanitize object
   */
  static sanitizeObject(obj: any): any {
    if (typeof obj === 'string') {
      return this.sanitizeString(obj);
    }
    if (typeof obj === 'object' && obj !== null) {
      return Object.keys(obj).reduce((acc, key) => {
        acc[key] = this.sanitizeObject(obj[key]);
        return acc;
      }, {} as any);
    }
    return obj;
  }
}
