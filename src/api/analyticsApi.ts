import client from './client';
import { DashboardStats, StockTransaction, Report } from '../types';

export const analyticsApi = {
  getDashboard: async (): Promise<DashboardStats> => {
    try {
      const { data } = await client.get('/analytics/dashboard');
      // Backend returns data in summary object, extract it
      return data.summary || data;
    } catch (error: any) {
      console.warn('Analytics dashboard failed, trying fallback endpoints:', error.message);
      
      // Fallback: Use basic endpoints to build dashboard data
      try {
        const [salesData, expensesData, productsData] = await Promise.all([
          client.get('/sales').catch(() => ({ data: [] })),
          client.get('/expenses').catch(() => ({ data: [] })),
          client.get('/products').catch(() => ({ data: [] })),
        ]);
        
        const sales = Array.isArray(salesData.data) ? salesData.data : [];
        const expenses = Array.isArray(expensesData.data) ? expensesData.data : [];
        const products = Array.isArray(productsData.data) ? productsData.data : [];
        
        // Calculate basic stats
        const today = new Date().toISOString().split('T')[0];
        const todaySales = sales.filter((s: any) => s.createdAt?.startsWith(today));
        const todayRevenue = todaySales.reduce((sum: number, s: any) => sum + (s.finalAmount || 0), 0);
        const todayProfit = todaySales.reduce((sum: number, s: any) => sum + ((s.finalAmount || 0) - (s.totalCost || 0)), 0);
        const lowStockProducts = products.filter((p: any) => p.currentStock <= (p.minStockLevel || 0));
        
        return {
          todaySales: todayRevenue,
          todayProfit: todayProfit,
          todayTransactions: todaySales.length,
          lowStockCount: lowStockProducts.length,
          totalProducts: products.length,
          totalCustomers: 0, // Will be 0 in fallback
          pendingTasks: 0,
          unreadMessages: 0,
        };
      } catch (fallbackError) {
        console.error('Fallback dashboard also failed:', fallbackError);
        throw error; // Throw original error
      }
    }
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
