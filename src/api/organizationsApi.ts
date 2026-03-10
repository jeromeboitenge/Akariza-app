import client from './client';
import { Organization } from '../types';

export const organizationsApi = {
  getAll: async (): Promise<Organization[]> => {
    const { data } = await client.get('/organizations');
    return data;
  },

  getById: async (id: string): Promise<Organization> => {
    const { data } = await client.get(`/organizations/${id}`);
    return data;
  },

  create: async (org: any): Promise<Organization> => {
    const { data } = await client.post('/organizations', org);
    return data;
  },

  update: async (id: string, org: Partial<Organization>): Promise<Organization> => {
    const { data } = await client.patch(`/organizations/${id}`, org);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await client.delete(`/organizations/${id}`);
  },

  // Organization management
  activate: async (id: string): Promise<Organization> => {
    const { data } = await client.patch(`/organizations/${id}/activate`, {});
    return data;
  },

  getStats: async (id: string): Promise<any> => {
    const { data } = await client.get(`/organizations/${id}/stats`);
    return data;
  },

  // Branches under organization
  getBranches: async (id: string): Promise<any[]> => {
    const { data } = await client.get(`/organizations/${id}/branches`);
    return data;
  },

  // Users in organization
  getUsers: async (id: string): Promise<any[]> => {
    const { data } = await client.get(`/organizations/${id}/users`);
    return data;
  },
};
