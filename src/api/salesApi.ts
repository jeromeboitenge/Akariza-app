import apiClient from './client';

export const salesApi = {
  createSale: async (saleData: any) => {
    return apiClient.post('/sales', saleData);
  },

  getSales: async () => {
    return apiClient.get('/sales');
  },

  getMySales: async () => {
    return apiClient.get('/sales/my-sales');
  }
};
