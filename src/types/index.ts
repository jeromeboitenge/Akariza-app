export interface User {
  id: string;
  email: string;
  name: string;
  fullName: string;
  role: 'SYSTEM_ADMIN' | 'BOSS' | 'MANAGER' | 'CASHIER';
  organizationId?: string;
  branchId?: string;
  isActive: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  currentStock: number;
  minStockLevel: number;
  maxStockLevel: number;
  reorderPoint: number;
  hasExpiry: boolean;
  trackBatch: boolean;
  trackSerial: boolean;
  isActive: boolean;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Sale {
  id: string;
  organizationId?: string;
  saleNumber: string;
  totalAmount: number;
  discount: number;
  tax: number;
  finalAmount: number;
  paymentMethod: string;
  paymentStatus: 'PAID' | 'PARTIAL' | 'UNPAID';
  amountPaid?: number;
  cashAmount?: number;
  mobileMoneyAmount?: number;
  changeAmount?: number;
  debtAmount?: number;
  customerName?: string;
  customerId?: string;
  items: SaleItem[];
  createdAt: string;
  syncedFromMobile?: boolean;
  mobileRecordId?: string;
}

export interface SaleItem {
  id: string;
  productId: string;
  quantity: number;
  sellingPrice: number;
  costPrice: number;
  total: number;
  product?: Product;
}

export interface Purchase {
  id: string;
  purchaseNumber: string;
  supplierId: string;
  totalAmount: number;
  discount: number;
  tax: number;
  finalAmount: number;
  paymentStatus: string;
  amountPaid: number;
  notes?: string;
  items: PurchaseItem[];
  supplier?: Supplier;
  createdAt: string;
}

export interface PurchaseItem {
  id: string;
  productId: string;
  quantity: number;
  costPrice: number;
  total: number;
  product?: Product;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email?: string;
  address: string;
  rating: number;
  creditLimit: number;
  paymentTerms?: string;
  isActive: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  customerType: string;
  loyaltyPoints: number;
  creditLimit: number;
  currentDebt: number;
  notes?: string;
  isActive: boolean;
}

export interface Organization {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  subscriptionPlan?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    branches: number;
    employees: number;
    products: number;
  };
}

export interface Organization {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  subscriptionPlan?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    branches: number;
    employees: number;
    products: number;
  };
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  email?: string;
  isActive: boolean;
  isMainBranch: boolean;
  organizationId?: string;
  _count?: {
    employees: number;
    products: number;
  };
}

export interface Employee {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: 'BOSS' | 'MANAGER' | 'CASHIER';
  employeeCode: string;
  department?: string;
  position?: string;
  salary?: number;
  commissionRate: number;
  hireDate: string;
  isActive: boolean;
  user?: User;
  branch?: Branch;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  paymentMethod?: string;
  receiptUrl?: string;
}

export interface Promotion {
  id: string;
  name: string;
  description?: string;
  type: string;
  discountType: string;
  discountValue: number;
  startDate: string;
  endDate: string;
  minPurchaseAmount?: number;
  isActive: boolean;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  status: string;
  totalAmount: number;
  notes?: string;
  expectedDate?: string;
  items: PurchaseOrderItem[];
  supplier?: Supplier;
}

export interface PurchaseOrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
  product?: Product;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  assignedTo?: string | User;
  assignedToId?: string;
  assignedBy: string;
  status: string;
  priority: string;
  dueDate?: string;
  completedAt?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId?: string;
  subject?: string;
  content: string;
  message: string;
  read: boolean;
  isRead: boolean;
  createdAt: string;
  sender?: User;
  receiver?: User;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  read: boolean;
  isRead: boolean;
  createdAt: string;
}

export interface DashboardStats {
  todaySales: number;
  todayProfit: number;
  todayTransactions: number;
  lowStockCount: number;
  totalProducts: number;
  totalCustomers: number;
  pendingTasks: number;
  unreadMessages: number;
  totalBranches?: number;
  totalEmployees?: number;
  totalRevenue?: number;
  totalSales?: number;
  totalPurchases?: number;
  totalExpenses?: number;
  topProduct?: {
    id: string;
    name: string;
    soldCount: number;
    revenue: number;
  };
}

export interface StockTransaction {
  id: string;
  productId: string;
  type: string;
  quantity: number;
  referenceType: string;
  referenceId: string;
  balanceAfter: number;
  notes?: string;
  createdAt: string;
  product?: Product;
}

export interface Report {
  startDate: string;
  endDate: string;
  totalSales?: number;
  totalPurchases?: number;
  totalExpenses?: number;
  profit?: number;
  items?: any[];
}
