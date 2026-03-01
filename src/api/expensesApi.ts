import client from './client';
import { Expense } from '../types';

export const expensesApi = {
  getAll: async (): Promise<Expense[]> => {
    const { data } = await client.get('/expenses');
    return data;
  },

  getById: async (id: string): Promise<Expense> => {
    const { data } = await client.get(`/expenses/${id}`);
    return data;
  },

  create: async (expense: Partial<Expense>): Promise<Expense> => {
    const { data } = await client.post('/expenses', expense);
    return data;
  },

  update: async (id: string, expense: Partial<Expense>): Promise<Expense> => {
    const { data } = await client.patch(`/expenses/${id}`, expense);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await client.delete(`/expenses/${id}`);
  },
};
