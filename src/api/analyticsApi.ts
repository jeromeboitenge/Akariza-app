import client from './client';
import { DashboardStats, StockTransaction, Report } from '../types';

export const analyticsApi = {
  getDashboard: async (): Promise<DashboardStats> => {
    const { data } = await client.get('/analytics/dashboard');
    return data;
  },

  getSalesTrends: async (period: 'daily' | 'weekly' | 'monthly'): Promise<any> => {
    const { data } = await client.get('/analytics/sales-trends', { params: { period } });
    return data;
  },

  getTopProducts: async (limit?: number): Promise<any[]> => {
    const { data } = await client.get('/analytics/top-products', { params: { limit } });
    return data;
  },

  getLowStockAlerts: async (): Promise<any[]> => {
    const { data } = await client.get('/analytics/low-stock-alerts');
    return data;
  },
};

export const stockApi = {
  getTransactions: async (productId?: string): Promise<StockTransaction[]> => {
    const { data } = await client.get('/stock/transactions', { params: { productId } });
    return data;
  },

  adjust: async (adjustment: { productId: string; quantity: number; notes?: string }): Promise<void> => {
    await client.post('/stock/adjust', adjustment);
  },

  getValuation: async (): Promise<{ totalValue: number; items: any[] }> => {
    const { data } = await client.get('/stock/valuation');
    return data;
  },
};

export const reportsApi = {
  getSales: async (startDate: string, endDate: string): Promise<Report> => {
    // Use daily sales endpoint for date range
    const { data } = await client.get('/reports/sales/daily', { params: { date: startDate } });
    return data;
  },

  getPurchases: async (startDate: string, endDate: string): Promise<Report> => {
    // Purchases report - use profit endpoint as fallback
    const { data } = await client.get('/reports/profit', { params: { startDate, endDate } });
    return data;
  },

  getStock: async (): Promise<any> => {
    // Use low-stock endpoint
    const { data } = await client.get('/reports/low-stock');
    return data;
  },

  getProfit: async (startDate: string, endDate: string): Promise<Report> => {
    const { data } = await client.get('/reports/profit', { params: { startDate, endDate } });
    return data;
  },
  
  getBestSelling: async (limit: number = 10): Promise<any> => {
    const { data } = await client.get('/reports/best-selling', { params: { limit } });
    return data;
  },
};
