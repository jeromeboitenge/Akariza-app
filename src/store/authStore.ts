import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthResponse } from '../types';
import { authApi } from '../api';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  pendingEmail: string | null;
  login: (email: string, password: string) => Promise<{ requiresOtp: boolean }>;
  verifyOtp: (otpCode: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,
  pendingEmail: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authApi.login(email, password);
      set({ pendingEmail: email, isLoading: false });
      return { requiresOtp: data.requiresOtp };
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Login failed', isLoading: false });
      throw error;
    }
  },

  verifyOtp: async (otpCode: string) => {
    const { pendingEmail } = get();
    if (!pendingEmail) {
      set({ error: 'No pending login. Please login again.' });
      throw new Error('No pending login');
    }

    set({ isLoading: true, error: null });
    try {
      const data: AuthResponse = await authApi.verifyOtp(pendingEmail, otpCode);
      await AsyncStorage.setItem('accessToken', data.accessToken);
      await AsyncStorage.setItem('refreshToken', data.refreshToken);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      set({ 
        user: data.user, 
        accessToken: data.accessToken, 
        refreshToken: data.refreshToken,
        pendingEmail: null,
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'OTP verification failed', isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
      set({ user: null, accessToken: null, refreshToken: null, pendingEmail: null });
    }
  },

  loadUser: async () => {
    try {
      const [accessToken, refreshToken, userStr] = await AsyncStorage.multiGet([
        'accessToken',
        'refreshToken',
        'user',
      ]);
      if (accessToken[1] && userStr[1]) {
        set({
          accessToken: accessToken[1],
          refreshToken: refreshToken[1],
          user: JSON.parse(userStr[1]),
        });
      }
    } catch (error) {
      console.error('Load user error:', error);
    }
  },

  clearError: () => set({ error: null }),
}));
