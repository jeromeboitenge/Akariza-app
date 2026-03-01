import client from './client';
import { Message } from '../types';

export const messagesApi = {
  getAll: async (): Promise<Message[]> => {
    const { data } = await client.get('/messages');
    return data;
  },

  send: async (message: { 
    receiverId?: string; 
    branchId?: string; 
    toOrganization?: boolean; 
    message: string 
  }): Promise<Message> => {
    const { data } = await client.post('/messages', message);
    return data;
  },

  getUnread: async (): Promise<number> => {
    const { data } = await client.get('/messages/unread');
    return data.count;
  },

  markAsRead: async (id: string): Promise<void> => {
    await client.patch(`/messages/${id}/read`);
  },

  getOrgChat: async (): Promise<Message[]> => {
    const { data } = await client.get('/messages/org-chat');
    return data;
  },

  getConversation: async (userId: string): Promise<Message[]> => {
    const { data } = await client.get(`/messages/conversation/${userId}`);
    return data;
  },
};
