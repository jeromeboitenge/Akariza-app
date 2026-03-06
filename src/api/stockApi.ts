import apiClient from './client';

export const stockApi = {
  // Get stock transactions
  getTransactions: async (productId?: string) => {
    const params = productId ? { productId } : {};
    const response = await apiClient.get('/stock/transactions', { params });
    return response.data;
  },

  // Adjust stock
  adjustStock: async (data: {
    productId: string;
    quantity: number;
    type: 'ADD' | 'REMOVE';
    reason: string;
  }) => {
    const response = await apiClient.post('/stock/adjust', data);
    return response.data;
  },

  // Get stock valuation
  getValuation: async () => {
    const response = await apiClient.get('/stock/valuation');
    return response.data;
  },
};
