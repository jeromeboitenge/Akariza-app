import apiClient from './client';

// Products API
export const productsApi = {
  getAll: async () => {
    const response = await apiClient.get('/products');
    return response.data;
  },
  
  create: async (data: any) => {
    const response = await apiClient.post('/products', data);
    return response.data;
  },
  
  getLowStock: async () => {
    const response = await apiClient.get('/products/low-stock');
    return response.data;
  }
};

// Sales API
export const salesApi = {
  create: async (data: any) => {
    const response = await apiClient.post('/sales', data);
    return response.data;
  },
  
  getAll: async () => {
    const response = await apiClient.get('/sales');
    return response.data;
  },
  
  getMySales: async () => {
    const response = await apiClient.get('/sales/my-sales');
    return response.data;
  }
};

// Purchases API
export const purchasesApi = {
  create: async (data: any) => {
    const response = await apiClient.post('/purchases', data);
    return response.data;
  },
  
  getAll: async () => {
    const response = await apiClient.get('/purchases');
    return response.data;
  }
};

// Customers API
export const customersApi = {
  getAll: async () => {
    const response = await apiClient.get('/customers');
    return response.data;
  },
  
  create: async (data: any) => {
    const response = await apiClient.post('/customers', data);
    return response.data;
  }
};

// Suppliers API
export const suppliersApi = {
  getAll: async () => {
    const response = await apiClient.get('/suppliers');
    return response.data;
  },
  
  create: async (data: any) => {
    const response = await apiClient.post('/suppliers', data);
    return response.data;
  }
};

// Reports API
export const reportsApi = {
  getDailySales: async (date?: string) => {
    const response = await apiClient.get('/reports/sales/daily', {
      params: { date }
    });
    return response.data;
  },
  
  getMonthlySales: async (month?: string) => {
    const response = await apiClient.get('/reports/sales/monthly', {
      params: { month }
    });
    return response.data;
  },
  
  getProfit: async (startDate?: string, endDate?: string) => {
    const response = await apiClient.get('/reports/profit', {
      params: { startDate, endDate }
    });
    return response.data;
  },
  
  getBestSelling: async (limit = 10) => {
    const response = await apiClient.get('/reports/best-selling', {
      params: { limit }
    });
    return response.data;
  }
};

// Stock API
export const stockApi = {
  getTransactions: async (productId?: string) => {
    const response = await apiClient.get('/stock/transactions', {
      params: { productId }
    });
    return response.data;
  },
  
  adjust: async (data: any) => {
    const response = await apiClient.post('/stock/adjust', data);
    return response.data;
  },
  
  getValuation: async () => {
    const response = await apiClient.get('/stock/valuation');
    return response.data;
  }
};

// Organization Chat API
export const orgChatApi = {
  sendMessage: async (message: string, recipientId?: string) => {
    const response = await apiClient.post('/org-chat/send', {
      message,
      recipientId
    });
    return response.data;
  },
  
  getMessages: async (limit = 50) => {
    const response = await apiClient.get('/org-chat/messages', {
      params: { limit }
    });
    return response.data;
  },
  
  getConversation: async (userId: string) => {
    const response = await apiClient.get(`/org-chat/conversation/${userId}`);
    return response.data;
  },
  
  getUsers: async () => {
    const response = await apiClient.get('/org-chat/users');
    return response.data;
  },
  
  markAsRead: async (messageId: string) => {
    const response = await apiClient.post(`/org-chat/${messageId}/read`);
    return response.data;
  },
  
  getUnreadCount: async () => {
    const response = await apiClient.get('/org-chat/unread-count');
    return response.data;
  }
};
