import apiClient from './client';

export const syncApi = {
  syncSales: async (sales: any[]) => {
    return apiClient.post('/sync/sales', { sales });
  },

  syncPurchases: async (purchases: any[]) => {
    return apiClient.post('/sync/purchases', { purchases });
  },

  getProducts: async (lastSyncedAt?: number) => {
    return apiClient.get('/sync/products', {
      params: { lastSyncedAt }
    });
  },

  getSuppliers: async (lastSyncedAt?: number) => {
    return apiClient.get('/sync/suppliers', {
      params: { lastSyncedAt }
    });
  }
};
