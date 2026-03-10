import client from './client';
import { Task } from '../types';

export const tasksApi = {
  getAll: async (): Promise<Task[]> => {
    const { data } = await client.get('/tasks');
    return data;
  },

  getById: async (id: string): Promise<Task> => {
    const { data } = await client.get(`/tasks/${id}`);
    return data;
  },

  create: async (task: Partial<Task>): Promise<Task> => {
    const { data } = await client.post('/tasks', task);
    return data;
  },

  update: async (id: string, task: Partial<Task>): Promise<Task> => {
    const { data } = await client.patch(`/tasks/${id}`, task);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await client.delete(`/tasks/${id}`);
  },

  complete: async (id: string): Promise<Task> => {
    const { data } = await client.patch(`/tasks/${id}/complete`);
    return data;
  },

  // Get user's tasks
  getMyTasks: async (): Promise<Task[]> => {
    const { data } = await client.get('/tasks/my-tasks');
    return data;
  },

  // Get tasks for specific user
  getByUser: async (userId: string): Promise<Task[]> => {
    const { data } = await client.get('/tasks', { params: { userId } });
    return data;
  },

  // Task comments
  addComment: async (id: string, comment: string): Promise<any> => {
    const { data } = await client.post(`/tasks/${id}/comments`, { comment });
    return data;
  },

  getComments: async (id: string): Promise<any[]> => {
    const { data } = await client.get(`/tasks/${id}/comments`);
    return data;
  },
};

