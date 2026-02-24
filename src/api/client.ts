import axios from 'axios';
import { API_URL } from '../utils/constants';

let authToken: string | null = null;

export const setAuthToken = (token: string) => {
  authToken = token;
};

export const clearAuthToken = () => {
  authToken = null;
};

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use(config => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

export default apiClient;
