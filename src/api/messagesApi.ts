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
    // Transform to backend format
    let payload: any = { message: message.message };
    
    if (message.receiverId) {
      payload.targetType = 'USER';
      payload.receiverId = message.receiverId;
    } else if (message.branchId) {
      payload.targetType = 'BRANCH';
      payload.receiverBranchId = message.branchId;
    } else if (message.toOrganization) {
      payload.targetType = 'ALL_BRANCHES';
    }
    
    const { data } = await client.post('/messages', payload);
    return data;
  },

  getUnread: async (): Promise<number> => {
    const { data } = await client.get('/messages/unread-count');
    return data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await client.patch(`/messages/${id}/read`);
  },

  getConversation: async (userId: string): Promise<Message[]> => {
    const { data } = await client.get(`/messages/conversation/${userId}`);
    return data;
  },
};
