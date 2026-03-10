import client from './client';
import { Notification } from '../types';

export const notificationsApi = {
  getAll: async (): Promise<Notification[]> => {
    const { data } = await client.get('/notifications');
    return data;
  },

  getUnread: async (): Promise<Notification[]> => {
    const { data } = await client.get('/notifications/unread');
    return data;
  },

  getUnreadCount: async (): Promise<number> => {
    const { data } = await client.get('/notifications/unread-count');
    return data.count || 0;
  },

  markAsRead: async (id: string): Promise<void> => {
    await client.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await client.patch('/notifications/read-all');
  },

  delete: async (id: string): Promise<void> => {
    await client.delete(`/notifications/${id}`);
  },

  deleteAll: async (): Promise<void> => {
    await client.delete('/notifications');
  },

  // Notification triggers
  checkLowStock: async (): Promise<any> => {
    const { data } = await client.post('/notifications/check-low-stock');
    return data;
  },

  checkExpiring: async (): Promise<any> => {
    const { data } = await client.post('/notifications/check-expiring');
    return data;
  },

  checkDebt: async (): Promise<any> => {
    const { data } = await client.post('/notifications/check-debt');
    return data;
  },

  checkDeadlines: async (): Promise<any> => {
    const { data } = await client.post('/notifications/check-deadlines');
    return data;
  },
};

