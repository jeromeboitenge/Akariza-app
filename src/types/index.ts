export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'BOSS' | 'MANAGER' | 'CASHIER';
  organizationId: string;
}

export interface Product {
  id: string;
  organizationId: string;
  name: string;
  sku: string;
  category: string;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  currentStock: number;
  minStockLevel: number;
}

export interface Supplier {
  id: string;
  organizationId: string;
  name: string;
  contactPerson: string;
  phone: string;
  email?: string;
  address: string;
}

export interface SaleItem {
  productId: string;
  quantity: number;
  sellingPrice: number;
  costPrice: number;
  total: number;
}

export interface Sale {
  id: string;
  organizationId: string;
  saleNumber: string;
  items: SaleItem[];
  totalAmount: number;
  paymentMethod: 'CASH' | 'MOBILE_MONEY' | 'CARD';
  customerName?: string;
  createdAt: number;
  syncStatus: 'PENDING' | 'SYNCED' | 'FAILED';
}

export interface PurchaseItem {
  productId: string;
  quantity: number;
  costPrice: number;
  total: number;
}

export interface Purchase {
  id: string;
  organizationId: string;
  purchaseNumber: string;
  supplierId: string;
  items: PurchaseItem[];
  totalAmount: number;
  paymentStatus: 'PAID' | 'PARTIAL' | 'UNPAID';
  amountPaid: number;
  notes?: string;
  createdAt: number;
  syncStatus: 'PENDING' | 'SYNCED' | 'FAILED';
}
