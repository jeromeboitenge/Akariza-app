import { User } from '../types';

export type UserRole = 'SYSTEM_ADMIN' | 'BOSS' | 'MANAGER' | 'CASHIER';

export const PERMISSIONS = {
  // Products
  VIEW_PRODUCTS: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER', 'CASHIER'],
  CREATE_PRODUCTS: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER'],
  EDIT_PRODUCTS: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER'],
  DELETE_PRODUCTS: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER'],

  // Sales
  VIEW_SALES: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER', 'CASHIER'],
  CREATE_SALES: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER', 'CASHIER'],
  EDIT_SALES: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER'],
  DELETE_SALES: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER'],

  // Purchases
  VIEW_PURCHASES: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER', 'CASHIER'],
  CREATE_PURCHASES: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER', 'CASHIER'],
  EDIT_PURCHASES: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER'],
  DELETE_PURCHASES: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER'],

  // Purchase Orders
  VIEW_PURCHASE_ORDERS: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER'],
  CREATE_PURCHASE_ORDERS: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER'],
  EDIT_PURCHASE_ORDERS: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER'],
  DELETE_PURCHASE_ORDERS: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER'],
  APPROVE_PURCHASE_ORDERS: ['SYSTEM_ADMIN', 'BOSS'],

  // Stock
  VIEW_STOCK: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER'],
  MANAGE_STOCK: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER'],
  ADJUST_STOCK: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER'],
  TRANSFER_STOCK: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER'],

  // Customers
  VIEW_CUSTOMERS: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER', 'CASHIER'],
  CREATE_CUSTOMERS: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER', 'CASHIER'],
  EDIT_CUSTOMERS: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER'],
  DELETE_CUSTOMERS: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER'],
  MANAGE_LOYALTY: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER', 'CASHIER'],

  // Suppliers
  VIEW_SUPPLIERS: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER', 'CASHIER'],
  CREATE_SUPPLIERS: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER'],
  EDIT_SUPPLIERS: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER'],
  DELETE_SUPPLIERS: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER'],

  // Employees
  VIEW_EMPLOYEES: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER'],
  CREATE_EMPLOYEES: ['SYSTEM_ADMIN', 'BOSS'],
  EDIT_EMPLOYEES: ['SYSTEM_ADMIN', 'BOSS'],
  DELETE_EMPLOYEES: ['SYSTEM_ADMIN', 'BOSS'],
  SET_TARGETS: ['SYSTEM_ADMIN', 'BOSS'],

  // Users
  VIEW_USERS: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER', 'CASHIER'],
  CREATE_USERS: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER'],
  EDIT_USERS: ['SYSTEM_ADMIN', 'BOSS'],
  DELETE_USERS: ['SYSTEM_ADMIN', 'BOSS'],
  RESET_PASSWORDS: ['SYSTEM_ADMIN', 'BOSS'],

  // Expenses
  VIEW_EXPENSES: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER', 'CASHIER'],
  CREATE_EXPENSES: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER', 'CASHIER'],
  EDIT_EXPENSES: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER', 'CASHIER'],
  DELETE_EXPENSES: ['SYSTEM_ADMIN', 'BOSS'],

  // Promotions
  VIEW_PROMOTIONS: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER'],
  CREATE_PROMOTIONS: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER'],
  EDIT_PROMOTIONS: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER'],
  DELETE_PROMOTIONS: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER'],

  // Reports & Analytics
  VIEW_REPORTS: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER'],
  VIEW_ANALYTICS: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER'],

  // Communication
  VIEW_NOTIFICATIONS: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER', 'CASHIER'],
  TRIGGER_NOTIFICATIONS: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER'],
  VIEW_TASKS: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER', 'CASHIER'],
  CREATE_TASKS: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER'],
  UPDATE_TASKS: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER', 'CASHIER'],
  DELETE_TASKS: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER'],
  VIEW_MESSAGES: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER', 'CASHIER'],
  SEND_MESSAGES: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER', 'CASHIER'],
  BROADCAST_MESSAGES: ['SYSTEM_ADMIN', 'BOSS'],
  VIEW_ORG_CHAT: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER', 'CASHIER'],

  // Organizations & Branches
  VIEW_ORGANIZATIONS: ['SYSTEM_ADMIN', 'BOSS'],
  CREATE_ORGANIZATIONS: ['SYSTEM_ADMIN'],
  EDIT_ORGANIZATIONS: ['SYSTEM_ADMIN', 'BOSS'],
  DELETE_ORGANIZATIONS: ['SYSTEM_ADMIN'],

  VIEW_BRANCHES: ['SYSTEM_ADMIN', 'BOSS', 'MANAGER', 'CASHIER'],
  CREATE_BRANCHES: ['SYSTEM_ADMIN', 'BOSS'],
  EDIT_BRANCHES: ['SYSTEM_ADMIN', 'BOSS'],
  DELETE_BRANCHES: ['SYSTEM_ADMIN', 'BOSS'],
  APPROVE_TRANSFERS: ['SYSTEM_ADMIN', 'BOSS'],

  // Admin
  VIEW_ADMIN_PANEL: ['SYSTEM_ADMIN'],
  VIEW_ADMIN_DASHBOARD: ['SYSTEM_ADMIN'],
  VIEW_SYNC_TOOLS: ['SYSTEM_ADMIN'],
  MANAGE_ALL_ORGANIZATIONS: ['SYSTEM_ADMIN'],
} as const;

export type Permission = keyof typeof PERMISSIONS;

export function hasPermission(user: User | null, permission: Permission): boolean {
  if (!user || !user.role) return false;
  return (PERMISSIONS[permission] as readonly string[]).includes(user.role);
}

export function hasAnyPermission(user: User | null, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(user, permission));
}

export function hasAllPermissions(user: User | null, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(user, permission));
}

// Helper to check if user is SYSTEM_ADMIN
export function isSystemAdmin(user: User | null): boolean {
  return user?.role === 'SYSTEM_ADMIN';
}

// Helper to check if user is BOSS
export function isBoss(user: User | null): boolean {
  return user?.role === 'BOSS';
}

// Helper to check if user is MANAGER
export function isManager(user: User | null): boolean {
  return user?.role === 'MANAGER';
}

// Helper to check if user is CASHIER
export function isCashier(user: User | null): boolean {
  return user?.role === 'CASHIER';
}
