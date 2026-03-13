import client from './client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse } from '../types';

export const authApi = {
  login: async (email: string, password: string): Promise<{ message?: string; requiresOtp?: boolean } | AuthResponse> => {
    const { data } = await client.post('/auth/login', { email, password });
    return data;
  },

  getProfile: async (): Promise<{ user: any; accessToken?: string; refreshToken?: string }> => {
    const { data } = await client.get('/auth/profile');
    return data;
  },

  verifyOtp: async (email: string, otpCode: string): Promise<AuthResponse> => {
    const { data } = await client.post('/auth/verify-otp', { email, otpCode });
    return data;
  },

  logout: async (): Promise<void> => {
    // Get refresh token from storage to send with logout request
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (refreshToken) {
      await client.post('/auth/logout', { refreshToken });
    } else {
      // If no refresh token, just make a simple logout call
      await client.post('/auth/logout');
    }
  },

  refresh: async (refreshToken: string): Promise<{ accessToken: string }> => {
    const { data } = await client.post('/auth/refresh', { refreshToken });
    return data;
  },

  forgotPassword: async (data: { email: string }) => {
    const response = await client.post('/auth/forgot-password', data);
    return response.data;
  },

  verifyResetOTP: async (data: { email: string; otpCode: string }) => {
    const response = await client.post('/auth/verify-reset-otp', data);
    return response.data;
  },

  resetPassword: async (data: { email: string; otpCode: string; newPassword: string }) => {
    const response = await client.post('/auth/reset-password', data);
    return response.data;
  },
};
