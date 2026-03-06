import apiClient from './client';

export const adminBranchesApi = {
  // Create branch (admin)
  create: async (data: {
    name: string;
    organizationId: string;
    address?: string;
    phone?: string;
    email?: string;
  }) => {
    const response = await apiClient.post('/admin/branches', data);
    return response.data;
  },

  // Get all branches (admin)
  getAll: async () => {
    const response = await apiClient.get('/admin/branches');
    return response.data;
  },

  // Get branches by organization
  getByOrganization: async (orgId: string) => {
    const response = await apiClient.get(`/admin/branches/organization/${orgId}`);
    return response.data;
  },

  // Get branch by ID (admin)
  getById: async (id: string) => {
    const response = await apiClient.get(`/admin/branches/${id}`);
    return response.data;
  },

  // Update branch (admin)
  update: async (id: string, data: any) => {
    const response = await apiClient.patch(`/admin/branches/${id}`, data);
    return response.data;
  },

  // Delete/deactivate branch (admin)
  delete: async (id: string) => {
    const response = await apiClient.delete(`/admin/branches/${id}`);
    return response.data;
  },

  // Activate branch (admin)
  activate: async (id: string) => {
    const response = await apiClient.patch(`/admin/branches/${id}/activate`);
    return response.data;
  },
};
