import client from './client';
import { AuthResponse } from '../types';

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await client.post('/auth/login', { email, password });
    return data;
  },

  logout: async (): Promise<void> => {
    await client.post('/auth/logout');
  },

  refresh: async (refreshToken: string): Promise<{ accessToken: string }> => {
    const { data } = await client.post('/auth/refresh', { refreshToken });
    return data;
  },
};
