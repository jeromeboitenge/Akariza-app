import client from './client';
import { Supplier } from '../types';

export const suppliersApi = {
  getAll: async (): Promise<Supplier[]> => {
    const { data } = await client.get('/suppliers');
    return data;
  },

  getById: async (id: string): Promise<Supplier> => {
    const { data } = await client.get(`/suppliers/${id}`);
    return data;
  },

  create: async (supplier: Partial<Supplier>): Promise<Supplier> => {
    const { data } = await client.post('/suppliers', supplier);
    return data;
  },

  update: async (id: string, supplier: Partial<Supplier>): Promise<Supplier> => {
    const { data } = await client.patch(`/suppliers/${id}`, supplier);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await client.delete(`/suppliers/${id}`);
  },
};
