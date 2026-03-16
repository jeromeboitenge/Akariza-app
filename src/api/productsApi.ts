import client from './client';
import { Product } from '../types';

export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const { data } = await client.get('/products');
    return data;
  },

  getById: async (id: string): Promise<Product> => {
    const { data } = await client.get(`/products/${id}`);
    return data;
  },

  create: async (product: Partial<Product>): Promise<Product> => {
    const { data } = await client.post('/products', product);
    return data;
  },

  update: async (id: string, product: Partial<Product>): Promise<Product> => {
    const { data } = await client.patch(`/products/${id}`, product);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await client.delete(`/products/${id}`);
  },

  getLowStock: async (): Promise<Product[]> => {
    const { data } = await client.get('/products/low-stock');
    return data;
  },

  // Get products by type
  getByType: async (type: 'REGULAR' | 'FAST_MOVING'): Promise<Product[]> => {
    const { data } = await client.get(`/products/type/${type}`);
    return data;
  },

  // Search products
  search: async (query: string): Promise<Product[]> => {
    const { data } = await client.get('/products/search', { params: { q: query } });
    return data;
  },

  // Get product stock levels
  getStockLevels: async (id: string): Promise<any> => {
    const { data } = await client.get(`/products/${id}/stock`);
    return data;
  },

  // Adjust product stock
  adjustStock: async (id: string, adjustment: {
    newStock: number;
    adjustmentType: 'increase' | 'decrease' | 'set';
    quantity: number;
    reason?: string;
  }): Promise<Product> => {
    const { data } = await client.post(`/products/${id}/adjust-stock`, adjustment);
    return data;
  },

  // Get product cost history
  getCostHistory: async (id: string): Promise<any[]> => {
    const { data } = await client.get(`/products/${id}/cost-history`);
    return data;
  },

  // Get product cost statistics
  getCostStatistics: async (id: string): Promise<any> => {
    const { data } = await client.get(`/products/${id}/cost-statistics`);
    return data;
  },
};

