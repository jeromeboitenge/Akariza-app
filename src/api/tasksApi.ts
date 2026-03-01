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
};
