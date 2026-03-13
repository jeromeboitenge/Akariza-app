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
      console.log('🔍 Full login response data:', JSON.stringify(data, null, 2));
      
      // If no OTP is required and we have user data, complete the login
      if (!data.requiresOtp && (data as any).user && (data as any).accessToken) {
        console.log('✅ Direct login successful with user data');
        const authData = data as any as AuthResponse;
        await AsyncStorage.setItem('accessToken', authData.accessToken);
        await AsyncStorage.setItem('refreshToken', authData.refreshToken);
        await AsyncStorage.setItem('user', JSON.stringify(authData.user));
        set({ 
          user: authData.user, 
          accessToken: authData.accessToken, 
          refreshToken: authData.refreshToken,
          pendingEmail: null,
          isLoading: false 
        });
        return { requiresOtp: false };
      }
      
      // If OTP is required, set pending email
      if (data.requiresOtp === true) {
        console.log('🔑 OTP required, setting pending email');
        set({ pendingEmail: email, isLoading: false });
        return { requiresOtp: true };
      }
      
      // If no OTP required (undefined or false), try to get user profile
      if (data.requiresOtp === undefined || data.requiresOtp === false) {
        console.log('⚠️ No OTP required but no user data in response. Fetching user profile...');
        console.log('🔍 Response keys:', Object.keys(data));
        
        try {
          console.log('📡 Attempting to fetch user profile...');
          const profileData = await authApi.getProfile();
          console.log('👤 Profile data received:', JSON.stringify(profileData, null, 2));
          
          if (profileData.user) {
            // Use tokens from profile response if available, otherwise we might already have them
            const accessToken = profileData.accessToken || (data as any).accessToken;
            const refreshToken = profileData.refreshToken || (data as any).refreshToken;
            
            if (accessToken) {
              await AsyncStorage.setItem('accessToken', accessToken);
            }
            if (refreshToken) {
              await AsyncStorage.setItem('refreshToken', refreshToken);
            }
            await AsyncStorage.setItem('user', JSON.stringify(profileData.user));
            
            set({ 
              user: profileData.user, 
              accessToken: accessToken, 
              refreshToken: refreshToken,
              pendingEmail: null,
              isLoading: false 
            });
            console.log('✅ Login completed with profile data');
            return { requiresOtp: false };
          }
        } catch (profileError: any) {
          console.error('❌ Failed to fetch user profile:', profileError);
          set({ error: 'Login successful but failed to load user profile', isLoading: false });
          throw profileError;
        }
      }
      
      set({ pendingEmail: email, isLoading: false });
      return { requiresOtp: data.requiresOtp || false };
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
