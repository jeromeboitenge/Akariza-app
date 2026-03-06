import apiClient from './client';

export const orgChatApi = {
  // Send organization chat message
  sendMessage: async (data: {
    recipientId?: string;
    content: string;
    type?: 'DM' | 'BRANCH' | 'ALL_BRANCHES';
  }) => {
    const response = await apiClient.post('/org-chat/send', data);
    return response.data;
  },

  // Get organization chat messages
  getMessages: async (limit: number = 50) => {
    const response = await apiClient.get('/org-chat/messages', { params: { limit } });
    return response.data;
  },

  // Get conversation with specific user
  getConversation: async (userId: string) => {
    const response = await apiClient.get(`/org-chat/conversation/${userId}`);
    return response.data;
  },

  // Get users for organization chat
  getUsers: async () => {
    const response = await apiClient.get('/org-chat/users');
    return response.data;
  },

  // Mark message as read
  markAsRead: async (messageId: string) => {
    const response = await apiClient.post(`/org-chat/${messageId}/read`);
    return response.data;
  },

  // Get unread count
  getUnreadCount: async () => {
    const response = await apiClient.get('/org-chat/unread-count');
    return response.data;
  },

  // Delete message
  deleteMessage: async (messageId: string) => {
    const response = await apiClient.delete(`/org-chat/${messageId}`);
    return response.data;
  },
};
