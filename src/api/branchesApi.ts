import client from './client';
import { Branch } from '../types';

export const branchesApi = {
  getAll: async (): Promise<Branch[]> => {
    const { data } = await client.get('/branches');
    return data;
  },

  getById: async (id: string): Promise<Branch> => {
    const { data } = await client.get(`/branches/${id}`);
    return data;
  },

  getByOrganization: async (orgId: string): Promise<Branch[]> => {
    const { data } = await client.get(`/organizations/${orgId}/branches`);
    return data;
  },

  create: async (branch: Partial<Branch>): Promise<Branch> => {
    const { data } = await client.post('/branches', branch);
    return data;
  },

  update: async (id: string, branch: Partial<Branch>): Promise<Branch> => {
    const { data } = await client.patch(`/branches/${id}`, branch);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await client.delete(`/branches/${id}`);
  },

  getInventory: async (id: string): Promise<any[]> => {
    const { data } = await client.get(`/branches/${id}/inventory`);
    return data;
  },

  transfer: async (id: string, transfer: any): Promise<any> => {
    const { data } = await client.post(`/branches/${id}/transfer`, transfer);
    return data;
  },
};
