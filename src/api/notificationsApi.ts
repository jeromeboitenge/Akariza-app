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

  markAsRead: async (id: string): Promise<void> => {
    await client.patch(`/notifications/${id}/read`);
  },

  delete: async (id: string): Promise<void> => {
    await client.delete(`/notifications/${id}`);
  },
};
