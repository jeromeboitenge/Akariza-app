import client from './client';

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

export interface CreatePurchaseOrderDto {
  supplierId: string;
  items: {
    productId: string;
    quantity: number;
    estimatedCost: number;
    notes?: string;
  }[];
  notes?: string;
}

export interface UpdatePurchaseOrderDto {
  supplierId?: string;
  items?: {
    productId: string;
    quantity: number;
    estimatedCost: number;
    notes?: string;
  }[];
  notes?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

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
  create: async (purchaseOrder: CreatePurchaseOrderDto): Promise<PurchaseOrder> => {
    const { data } = await client.post('/purchase-orders', purchaseOrder);
    return data;
  },

  /**
   * Update purchase order
   */
  update: async (id: string, purchaseOrder: UpdatePurchaseOrderDto): Promise<PurchaseOrder> => {
    const { data } = await client.patch(`/purchase-orders/${id}`, purchaseOrder);
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
   * This creates an actual purchase from the approved purchase order
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
   * Delete purchase order (only if PENDING)
   */
  delete: async (id: string): Promise<void> => {
    await client.delete(`/purchase-orders/${id}`);
  },

  /**
   * Get purchase orders by status
   */
  getByStatus: async (status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CONVERTED'): Promise<PurchaseOrder[]> => {
    const { data } = await client.get('/purchase-orders', { params: { status } });
    return data;
  },

  /**
   * Get my purchase orders (created by current user)
   */
  getMyOrders: async (): Promise<PurchaseOrder[]> => {
    const { data } = await client.get('/purchase-orders/my-orders');
    return data;
  },
};
