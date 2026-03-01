import client from './client';
import { Employee } from '../types';

export const employeesApi = {
  getAll: async (): Promise<Employee[]> => {
    const { data } = await client.get('/employees');
    return data;
  },

  getById: async (id: string): Promise<Employee> => {
    const { data } = await client.get(`/employees/${id}`);
    return data;
  },

  create: async (employee: Partial<Employee>): Promise<Employee> => {
    const { data } = await client.post('/employees', employee);
    return data;
  },

  update: async (id: string, employee: Partial<Employee>): Promise<Employee> => {
    const { data } = await client.patch(`/employees/${id}`, employee);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await client.delete(`/employees/${id}`);
  },
};
