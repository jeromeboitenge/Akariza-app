import client from './client';
import { DashboardStats } from '../types';

export const dashboardApi = {
  // Get role-based dashboard data
  getDashboard: async (): Promise<DashboardStats> => {
    const { data } = await client.get('/dashboard');
    return data;
  },

  // Admin dashboard endpoints
  getAdminOverview: async (): Promise<any> => {
    const { data } = await client.get('/admin/dashboard/overview');
    return data;
  },

  getOrganizationStats: async (): Promise<any> => {
    const { data } = await client.get('/admin/dashboard/organizations/stats');
    return data;
  },

  getOrganizationDetailStats: async (orgId: string): Promise<any> => {
    const { data } = await client.get(`/admin/dashboard/organizations/${orgId}/stats`);
    return data;
  },

  getAdminSalesStats: async (startDate?: string, endDate?: string): Promise<any> => {
    const { data } = await client.get('/admin/dashboard/sales', {
      params: { startDate, endDate },
    });
    return data;
  },

  getTopSellingProducts: async (limit: number = 10): Promise<any[]> => {
    const { data } = await client.get('/admin/dashboard/products/top-selling', {
      params: { limit },
    });
    return data;
  },

  getUserActivity: async (): Promise<any> => {
    const { data } = await client.get('/admin/dashboard/users/activity');
    return data;
  },

  getBranchStats: async (): Promise<any> => {
    const { data } = await client.get('/admin/dashboard/branches/stats');
    return data;
  },
};
