import client from './client';
import { Promotion, PurchaseOrder } from '../types';

export const promotionsApi = {
  getAll: async (): Promise<Promotion[]> => {
    const { data } = await client.get('/promotions');
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
  getAll: async (): Promise<PurchaseOrder[]> => {
    const { data } = await client.get('/purchase-orders');
    return data;
  },

  getById: async (id: string): Promise<PurchaseOrder> => {
    const { data } = await client.get(`/purchase-orders/${id}`);
    return data;
  },

  create: async (po: any): Promise<PurchaseOrder> => {
    const { data } = await client.post('/purchase-orders', po);
    return data;
  },

  update: async (id: string, po: any): Promise<PurchaseOrder> => {
    const { data } = await client.patch(`/purchase-orders/${id}`, po);
    return data;
  },

  receive: async (id: string): Promise<any> => {
    const { data } = await client.post(`/purchase-orders/${id}/receive`);
    return data;
  },
};
