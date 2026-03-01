import client from './client';
import { Sale } from '../types';

export const salesApi = {
  getAll: async (): Promise<Sale[]> => {
    const { data } = await client.get('/sales');
    return data;
  },

  getById: async (id: string): Promise<Sale> => {
    const { data } = await client.get(`/sales/${id}`);
    return data;
  },

  create: async (sale: any): Promise<Sale> => {
    const { data } = await client.post('/sales', sale);
    return data;
  },

  getMySales: async (): Promise<Sale[]> => {
    const { data } = await client.get('/sales/my-sales');
    return data;
  },
};
