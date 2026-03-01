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

  update: async (id: string, userData: any): Promise<any> => {
    const { data } = await client.patch(`/users/${id}`, userData);
    return data;
  },

  deactivate: async (id: string): Promise<void> => {
    await client.delete(`/users/${id}`);
  },
};
