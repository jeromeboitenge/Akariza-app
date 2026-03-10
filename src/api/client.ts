import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../utils/constants';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // Handle 401 - Unauthorized (token refresh)
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const refreshToken = await AsyncStorage.getItem('refreshToken');
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }
            
            const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
            
            if (data.accessToken) {
              await AsyncStorage.setItem('accessToken', data.accessToken);
              if (data.refreshToken) {
                await AsyncStorage.setItem('refreshToken', data.refreshToken);
              }
              originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Clear all auth data and redirect to login
            await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
            console.log('🔒 Session expired. Please login again.');
            return Promise.reject(refreshError);
          }
        }
        
        // Enhanced error handling with user-friendly messages
        if (error.response) {
          const status = error.response.status;
          const data = error.response.data;
          
          let errorMessage = data?.message || 'An error occurred';
          
          switch (status) {
            case 400:
              console.log('❌ Bad Request:', errorMessage);
              break;
            case 403:
              console.log('❌ Forbidden:', 'You do not have permission to perform this action');
              errorMessage = 'You do not have permission to perform this action';
              break;
            case 404:
              console.log('❌ Not Found:', errorMessage);
              break;
            case 409:
              console.log('❌ Conflict:', errorMessage);
              break;
            case 422:
              console.log('❌ Validation Error:', errorMessage);
              break;
            case 500:
            case 502:
            case 503:
              console.log('❌ Server Error:', 'Server error. Please try again later.');
              errorMessage = 'Server error. Please try again later.';
              break;
            default:
              console.log('❌ Error:', errorMessage);
          }
          
          // Attach user-friendly message to error
          error.userMessage = errorMessage;
        } else if (error.request) {
          console.log('❌ Network Error:', 'No response from server. Check your connection.');
          error.userMessage = 'No response from server. Check your internet connection.';
        } else {
          console.log('❌ Error:', error.message);
          error.userMessage = error.message || 'An unexpected error occurred';
        }
        
        return Promise.reject(error);
      }
    );
  }

  getInstance(): AxiosInstance {
    return this.client;
  }
}

export default new ApiClient().getInstance();
