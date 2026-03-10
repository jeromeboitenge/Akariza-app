import client from './client';
import { Customer } from '../types';

export const customersApi = {
  getAll: async (): Promise<Customer[]> => {
    const { data } = await client.get('/customers');
    return data;
  },

  getById: async (id: string): Promise<Customer> => {
    const { data } = await client.get(`/customers/${id}`);
    return data;
  },

  create: async (customer: Partial<Customer>): Promise<Customer> => {
    const { data } = await client.post('/customers', customer);
    return data;
  },

  update: async (id: string, customer: Partial<Customer>): Promise<Customer> => {
    const { data } = await client.patch(`/customers/${id}`, customer);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await client.delete(`/customers/${id}`);
  },

  getPurchases: async (id: string): Promise<any[]> => {
    const { data } = await client.get(`/customers/${id}/purchases`);
    return data;
  },

  // Loyalty program
  addLoyaltyPoints: async (id: string, points: number, reason?: string): Promise<any> => {
    const { data } = await client.post(`/customers/${id}/loyalty/add`, { points, reason });
    return data;
  },

  redeemLoyaltyPoints: async (id: string, points: number): Promise<any> => {
    const { data } = await client.post(`/customers/${id}/loyalty/redeem`, { points });
    return data;
  },

  getLoyaltyBalance: async (id: string): Promise<any> => {
    const { data } = await client.get(`/customers/${id}/loyalty`);
    return data;
  },

  // Customer transactions
  getTransactions: async (id: string, startDate?: string, endDate?: string): Promise<any[]> => {
    const { data } = await client.get(`/customers/${id}/transactions`, {
      params: { startDate, endDate },
    });
    return data;
  },

  addTransaction: async (id: string, transaction: any): Promise<any> => {
    const { data } = await client.post(`/customers/${id}/transactions`, transaction);
    return data;
  },
};
