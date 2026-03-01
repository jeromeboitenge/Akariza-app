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
            const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
            await AsyncStorage.setItem('accessToken', data.accessToken);
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
            return Promise.reject(refreshError);
          }
        }
        
        // Add user-friendly error messages
        if (error.response) {
          const status = error.response.status;
          const data = error.response.data;
          
          // Enhance error message based on status code
          if (status === 400) {
            console.log('❌ Bad Request:', data.message || 'Invalid data provided');
          } else if (status === 403) {
            console.log('❌ Forbidden:', 'You do not have permission to perform this action');
          } else if (status === 404) {
            console.log('❌ Not Found:', data.message || 'Resource not found');
          } else if (status === 409) {
            console.log('❌ Conflict:', data.message || 'Resource already exists');
          } else if (status >= 500) {
            console.log('❌ Server Error:', 'Server error. Please try again later.');
          }
        } else if (error.request) {
          console.log('❌ Network Error:', 'No response from server. Check your connection.');
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
