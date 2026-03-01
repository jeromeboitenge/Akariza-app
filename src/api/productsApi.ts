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
};
