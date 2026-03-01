import client from './client';
import { Purchase } from '../types';

export const purchasesApi = {
  getAll: async (): Promise<Purchase[]> => {
    const { data } = await client.get('/purchases');
    return data;
  },

  getById: async (id: string): Promise<Purchase> => {
    const { data } = await client.get(`/purchases/${id}`);
    return data;
  },

  create: async (purchase: any): Promise<Purchase> => {
    const { data } = await client.post('/purchases', purchase);
    return data;
  },
};
