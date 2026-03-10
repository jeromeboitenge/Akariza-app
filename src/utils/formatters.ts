import { format, parse, formatDistanceToNow, isValid } from 'date-fns';

/**
 * Comprehensive data formatting utilities
 */
export class Formatters {
  /**
   * Format currency
   */
  static formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  }

  /**
   * Format number with thousand separators
   */
  static formatNumber(num: number, decimals: number = 0): string {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  }

  /**
   * Format percentage
   */
  static formatPercentage(value: number, decimals: number = 1): string {
    return `${this.formatNumber(value, decimals)}%`;
  }

  /**
   * Format date
   */
  static formatDate(date: Date | string, formatStr: string = 'MMM dd, yyyy'): string {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return isValid(dateObj) ? format(dateObj, formatStr) : 'Invalid date';
    } catch {
      return 'Invalid date';
    }
  }

  /**
   * Format date and time
   */
  static formatDateTime(date: Date | string, formatStr: string = 'MMM dd, yyyy HH:mm'): string {
    return this.formatDate(date, formatStr);
  }

  /**
   * Format time only
   */
  static formatTime(date: Date | string, formatStr: string = 'HH:mm'): string {
    return this.formatDate(date, formatStr);
  }

  /**
   * Format relative time (e.g., "2 hours ago")
   */
  static formatRelativeTime(date: Date | string): string {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return isValid(dateObj) ? formatDistanceToNow(dateObj, { addSuffix: true }) : 'Invalid date';
    } catch {
      return 'Invalid date';
    }
  }

  /**
   * Format phone number
   */
  static formatPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    if (cleaned.length === 11) {
      return `+${cleaned[0]} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  }

  /**
   * Format address
   */
  static formatAddress(address: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  }): string {
    const parts = [address.street, address.city, address.state, address.zip, address.country].filter(
      Boolean
    );
    return parts.join(', ');
  }

  /**
   * Format name (capitalize first letter of each word)
   */
  static formatName(name: string): string {
    return name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * Format email (lowercase)
   */
  static formatEmail(email: string): string {
    return email.toLowerCase().trim();
  }

  /**
   * Format SKU (uppercase)
   */
  static formatSKU(sku: string): string {
    return sku.toUpperCase().trim();
  }

  /**
   * Format file size
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Format duration (milliseconds to readable format)
   */
  static formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }

  /**
   * Format JSON with indentation
   */
  static formatJSON(obj: any, indent: number = 2): string {
    return JSON.stringify(obj, null, indent);
  }

  /**
   * Format URL slug
   */
  static formatSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  /**
   * Format initials from name
   */
  static formatInitials(name: string): string {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  /**
   * Format product name with category
   */
  static formatProductName(name: string, category?: string): string {
    if (category) {
      return `${name} (${category})`;
    }
    return name;
  }

  /**
   * Format inventory status
   */
  static formatInventoryStatus(current: number, min: number, max: number): string {
    if (current === 0) return 'Out of Stock';
    if (current <= min) return 'Low Stock';
    if (current >= max) return 'Overstocked';
    return 'In Stock';
  }

  /**
   * Format payment status
   */
  static formatPaymentStatus(status: string): string {
    const statusMap: Record<string, string> = {
      PAID: '✅ Paid',
      PENDING: '⏳ Pending',
      PARTIAL: '⚠️ Partial',
      OVERDUE: '❌ Overdue',
    };
    return statusMap[status] || status;
  }

  /**
   * Format order status
   */
  static formatOrderStatus(status: string): string {
    const statusMap: Record<string, string> = {
      PENDING: '⏳ Pending',
      CONFIRMED: '✅ Confirmed',
      SHIPPED: '📦 Shipped',
      DELIVERED: '🎉 Delivered',
      CANCELLED: '❌ Cancelled',
    };
    return statusMap[status] || status;
  }

  /**
   * Format role name
   */
  static formatRole(role: string): string {
    const roleMap: Record<string, string> = {
      SYSTEM_ADMIN: 'System Admin',
      BOSS: 'Boss',
      MANAGER: 'Manager',
      CASHIER: 'Cashier',
    };
    return roleMap[role] || role;
  }

  /**
   * Format boolean as yes/no
   */
  static formatBoolean(value: boolean): string {
    return value ? 'Yes' : 'No';
  }

  /**
   * Format array as comma-separated string
   */
  static formatArray(arr: any[], separator: string = ', '): string {
    return arr.join(separator);
  }

  /**
   * Format object as key-value pairs
   */
  static formatObject(obj: Record<string, any>): string {
    return Object.entries(obj)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
  }

  /**
   * Truncate text
   */
  static truncate(text: string, length: number = 50, suffix: string = '...'): string {
    if (text.length <= length) return text;
    return text.slice(0, length - suffix.length) + suffix;
  }

  /**
   * Highlight text (add markers around search term)
   */
  static highlight(text: string, searchTerm: string): string {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '**$1**');
  }

  /**
   * Format markdown bold
   */
  static bold(text: string): string {
    return `**${text}**`;
  }

  /**
   * Format markdown italic
   */
  static italic(text: string): string {
    return `*${text}*`;
  }

  /**
   * Format markdown code
   */
  static code(text: string): string {
    return `\`${text}\``;
  }

  /**
   * Format markdown link
   */
  static link(text: string, url: string): string {
    return `[${text}](${url})`;
  }

  /**
   * Format list item
   */
  static listItem(text: string, level: number = 0): string {
    const indent = '  '.repeat(level);
    return `${indent}- ${text}`;
  }

  /**
   * Format heading
   */
  static heading(text: string, level: number = 1): string {
    return `${'#'.repeat(level)} ${text}`;
  }

  /**
   * Safe format (handles null/undefined)
   */
  static safe(value: any, defaultValue: string = 'N/A'): string {
    if (value === null || value === undefined || value === '') {
      return defaultValue;
    }
    return String(value);
  }

  /**
   * Format with fallback
   */
  static withFallback(value: any, fallback: string = 'N/A'): string {
    return this.safe(value, fallback);
  }
}

// Export commonly used formatters
export const {
  formatCurrency,
  formatNumber,
  formatDate,
  formatDateTime,
  formatTime,
  formatPhone,
  formatEmail,
  formatSKU,
  formatFileSize,
  formatDuration,
  formatInitials,
  formatPaymentStatus,
  formatOrderStatus,
  formatRole,
  truncate,
} = Formatters;
