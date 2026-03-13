import client from './client';
import { Promotion } from '../types';

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplier?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
  items: PurchaseOrderItem[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CONVERTED';
  totalAmount: number;
  notes?: string;
  requestedBy: string;
  requestedByUser?: {
    id: string;
    fullName: string;
    email: string;
  };
  approvedBy?: string;
  approvedByUser?: {
    id: string;
    fullName: string;
    email: string;
  };
  approvedAt?: string;
  convertedToPurchaseId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderItem {
  id?: string;
  productId: string;
  product?: {
    id: string;
    name: string;
    sku?: string;
  };
  quantity: number;
  estimatedCost: number;
  notes?: string;
}

export const promotionsApi = {
  getAll: async (): Promise<Promotion[]> => {
    const { data } = await client.get('/promotions');
    return data;
  },

  getActive: async (): Promise<Promotion[]> => {
    const { data } = await client.get('/promotions/active');
    return data;
  },

  getById: async (id: string): Promise<Promotion> => {
    const { data } = await client.get(`/promotions/${id}`);
    return data;
  },

  create: async (promotion: Partial<Promotion>): Promise<Promotion> => {
    const { data } = await client.post('/promotions', promotion);
    return data;
  },

  update: async (id: string, promotion: Partial<Promotion>): Promise<Promotion> => {
    const { data } = await client.patch(`/promotions/${id}`, promotion);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await client.delete(`/promotions/${id}`);
  },
};

export const purchaseOrdersApi = {
  /**
   * Get all purchase orders
   */
  getAll: async (): Promise<PurchaseOrder[]> => {
    const { data } = await client.get('/purchase-orders');
    return data;
  },

  /**
   * Get purchase order by ID
   */
  getById: async (id: string): Promise<PurchaseOrder> => {
    const { data } = await client.get(`/purchase-orders/${id}`);
    return data;
  },

  /**
   * Create new purchase order
   */
  create: async (purchaseOrder: {
    supplierId: string;
    expectedDate?: string;
    items: {
      productId: string;
      quantity: number;
      unitPrice: number;
      notes?: string;
    }[];
    notes?: string;
  }): Promise<PurchaseOrder> => {
    const { data} = await client.post('/purchase-orders', purchaseOrder);
    return data;
  },

  /**
   * Update purchase order
   */
  update: async (id: string, purchaseOrder: {
    supplierId?: string;
    expectedDate?: string;
    items?: {
      productId: string;
      quantity: number;
      unitPrice: number;
      notes?: string;
    }[];
    notes?: string;
    status?: 'PENDING' | 'APPROVED' | 'ORDERED' | 'RECEIVED' | 'COMPLETED' | 'CANCELLED';
  }): Promise<PurchaseOrder> => {
    const { data } = await client.patch(`/purchase-orders/${id}`, purchaseOrder);
    return data;
  },

  /**
   * Update purchase order status
   */
  updateStatus: async (id: string, status: 'PENDING' | 'APPROVED' | 'ORDERED' | 'RECEIVED' | 'COMPLETED' | 'CANCELLED'): Promise<PurchaseOrder> => {
    const { data } = await client.patch(`/purchase-orders/${id}/status`, { status });
    return data;
  },

  /**
   * Approve purchase order
   */
  approve: async (id: string): Promise<PurchaseOrder> => {
    const { data } = await client.post(`/purchase-orders/${id}/approve`);
    return data;
  },

  /**
   * Reject purchase order
   */
  reject: async (id: string, reason?: string): Promise<PurchaseOrder> => {
    const { data } = await client.post(`/purchase-orders/${id}/reject`, { reason });
    return data;
  },

  /**
   * Convert purchase order to purchase
   */
  convert: async (id: string, conversionData?: {
    actualCosts?: { productId: string; actualCost: number }[];
    paymentStatus?: 'PAID' | 'PARTIAL' | 'UNPAID';
    amountPaid?: number;
    notes?: string;
  }): Promise<{ purchase: any; purchaseOrder: PurchaseOrder }> => {
    const { data } = await client.post(`/purchase-orders/${id}/convert`, conversionData);
    return data;
  },

  /**
   * Delete purchase order
   */
  delete: async (id: string): Promise<void> => {
    await client.delete(`/purchase-orders/${id}`);
  },

  /**
   * Get purchase orders by status
   */
  getByStatus: async (status: 'PENDING' | 'APPROVED' | 'ORDERED' | 'RECEIVED' | 'COMPLETED' | 'CANCELLED'): Promise<PurchaseOrder[]> => {
    const { data } = await client.get('/purchase-orders', { params: { status } });
    return data;
  },

  /**
   * Get my purchase orders
   */
  getMyOrders: async (): Promise<PurchaseOrder[]> => {
    const { data } = await client.get('/purchase-orders/my-orders');
    return data;
  },
};
