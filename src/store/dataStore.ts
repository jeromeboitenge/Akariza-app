import { create } from 'zustand';
import { Product, Sale, Purchase, Customer, Supplier } from '../types';

interface DataState {
  products: Product[];
  sales: Sale[];
  purchases: Purchase[];
  customers: Customer[];
  suppliers: Supplier[];
  setProducts: (products: Product[]) => void;
  setSales: (sales: Sale[]) => void;
  setPurchases: (purchases: Purchase[]) => void;
  setCustomers: (customers: Customer[]) => void;
  setSuppliers: (suppliers: Supplier[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  addSale: (sale: Sale) => void;
  addPurchase: (purchase: Purchase) => void;
  addCustomer: (customer: Customer) => void;
  addSupplier: (supplier: Supplier) => void;
  clear: () => void;
}

export const useDataStore = create<DataState>((set) => ({
  products: [],
  sales: [],
  purchases: [],
  customers: [],
  suppliers: [],

  setProducts: (products) => set({ products }),
  setSales: (sales) => set({ sales }),
  setPurchases: (purchases) => set({ purchases }),
  setCustomers: (customers) => set({ customers }),
  setSuppliers: (suppliers) => set({ suppliers }),

  addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
  updateProduct: (id, updates) => set((state) => ({
    products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
  })),

  addSale: (sale) => set((state) => ({ sales: [sale, ...state.sales] })),
  addPurchase: (purchase) => set((state) => ({ purchases: [purchase, ...state.purchases] })),
  addCustomer: (customer) => set((state) => ({ customers: [...state.customers, customer] })),
  addSupplier: (supplier) => set((state) => ({ suppliers: [...state.suppliers, supplier] })),

  clear: () => set({ products: [], sales: [], purchases: [], customers: [], suppliers: [] }),
}));
