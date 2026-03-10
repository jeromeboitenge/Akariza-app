import { create } from 'zustand';
import { Product, Sale, Purchase, Customer, Supplier } from '../types';

interface CacheMetadata {
  lastUpdated: number;
  isLoading: boolean;
  error: string | null;
}

interface DataState {
  // Data
  products: Product[];
  sales: Sale[];
  purchases: Purchase[];
  customers: Customer[];
  suppliers: Supplier[];
  
  // Cache metadata
  productsMeta: CacheMetadata;
  salesMeta: CacheMetadata;
  purchasesMeta: CacheMetadata;
  customersMeta: CacheMetadata;
  suppliersMeta: CacheMetadata;
  
  // Setters
  setProducts: (products: Product[], error?: string | null) => void;
  setSales: (sales: Sale[], error?: string | null) => void;
  setPurchases: (purchases: Purchase[], error?: string | null) => void;
  setCustomers: (customers: Customer[], error?: string | null) => void;
  setSuppliers: (suppliers: Supplier[], error?: string | null) => void;
  
  // Loading states
  setProductsLoading: (loading: boolean) => void;
  setSalesLoading: (loading: boolean) => void;
  setPurchasesLoading: (loading: boolean) => void;
  setCustomersLoading: (loading: boolean) => void;
  setSuppliersLoading: (loading: boolean) => void;
  
  // Mutations
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  addSale: (sale: Sale) => void;
  addPurchase: (purchase: Purchase) => void;
  addCustomer: (customer: Customer) => void;
  addSupplier: (supplier: Supplier) => void;
  
  // Utilities
  isCacheValid: (meta: CacheMetadata, maxAge?: number) => boolean;
  clear: () => void;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useDataStore = create<DataState>((set, get) => ({
  // Data
  products: [],
  sales: [],
  purchases: [],
  customers: [],
  suppliers: [],
  
  // Cache metadata
  productsMeta: { lastUpdated: 0, isLoading: false, error: null },
  salesMeta: { lastUpdated: 0, isLoading: false, error: null },
  purchasesMeta: { lastUpdated: 0, isLoading: false, error: null },
  customersMeta: { lastUpdated: 0, isLoading: false, error: null },
  suppliersMeta: { lastUpdated: 0, isLoading: false, error: null },
  
  // Setters with metadata
  setProducts: (products, error = null) => set({
    products,
    productsMeta: { lastUpdated: Date.now(), isLoading: false, error },
  }),
  setSales: (sales, error = null) => set({
    sales,
    salesMeta: { lastUpdated: Date.now(), isLoading: false, error },
  }),
  setPurchases: (purchases, error = null) => set({
    purchases,
    purchasesMeta: { lastUpdated: Date.now(), isLoading: false, error },
  }),
  setCustomers: (customers, error = null) => set({
    customers,
    customersMeta: { lastUpdated: Date.now(), isLoading: false, error },
  }),
  setSuppliers: (suppliers, error = null) => set({
    suppliers,
    suppliersMeta: { lastUpdated: Date.now(), isLoading: false, error },
  }),
  
  // Loading states
  setProductsLoading: (loading) => set((state) => ({
    productsMeta: { ...state.productsMeta, isLoading: loading },
  })),
  setSalesLoading: (loading) => set((state) => ({
    salesMeta: { ...state.salesMeta, isLoading: loading },
  })),
  setPurchasesLoading: (loading) => set((state) => ({
    purchasesMeta: { ...state.purchasesMeta, isLoading: loading },
  })),
  setCustomersLoading: (loading) => set((state) => ({
    customersMeta: { ...state.customersMeta, isLoading: loading },
  })),
  setSuppliersLoading: (loading) => set((state) => ({
    suppliersMeta: { ...state.suppliersMeta, isLoading: loading },
  })),
  
  // Mutations
  addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
  updateProduct: (id, updates) => set((state) => ({
    products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
  })),
  deleteProduct: (id) => set((state) => ({
    products: state.products.filter((p) => p.id !== id),
  })),
  
  addSale: (sale) => set((state) => ({ sales: [sale, ...state.sales] })),
  addPurchase: (purchase) => set((state) => ({ purchases: [purchase, ...state.purchases] })),
  addCustomer: (customer) => set((state) => ({ customers: [...state.customers, customer] })),
  addSupplier: (supplier) => set((state) => ({ suppliers: [...state.suppliers, supplier] })),
  
  // Utilities
  isCacheValid: (meta, maxAge = CACHE_DURATION) => {
    return !meta.isLoading && Date.now() - meta.lastUpdated < maxAge;
  },
  
  clear: () => set({
    products: [],
    sales: [],
    purchases: [],
    customers: [],
    suppliers: [],
    productsMeta: { lastUpdated: 0, isLoading: false, error: null },
    salesMeta: { lastUpdated: 0, isLoading: false, error: null },
    purchasesMeta: { lastUpdated: 0, isLoading: false, error: null },
    customersMeta: { lastUpdated: 0, isLoading: false, error: null },
    suppliersMeta: { lastUpdated: 0, isLoading: false, error: null },
  }),
}));
