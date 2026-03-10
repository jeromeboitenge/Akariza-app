import client from './client';

export const usersApi = {
  getAll: async (): Promise<any[]> => {
    const { data } = await client.get('/users');
    return data;
  },

  getById: async (id: string): Promise<any> => {
    const { data } = await client.get(`/users/${id}`);
    return data;
  },

  create: async (userData: any): Promise<any> => {
    const { data } = await client.post('/users', userData);
    return data;
  },

  update: async (id: string, userData: any): Promise<any> => {
    const { data } = await client.patch(`/users/${id}`, userData);
    return data;
  },

  deactivate: async (id: string): Promise<void> => {
    await client.delete(`/users/${id}`);
  },

  // Password management
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await client.patch('/users/change-password', { currentPassword, newPassword });
  },

  resetPassword: async (id: string, newPassword: string): Promise<void> => {
    await client.patch(`/users/${id}/reset-password`, { newPassword });
  },

  // User activity
  getActivity: async (id: string, startDate?: string, endDate?: string): Promise<any[]> => {
    const { data } = await client.get(`/users/${id}/activity`, {
      params: { startDate, endDate },
    });
    return data;
  },
};
