import client from './client';
import { Employee } from '../types';

export const employeesApi = {
  getAll: async (): Promise<Employee[]> => {
    const { data } = await client.get('/employees');
    return data;
  },

  getById: async (id: string): Promise<Employee> => {
    const { data } = await client.get(`/employees/${id}`);
    return data;
  },

  create: async (employee: Partial<Employee>): Promise<Employee> => {
    const { data } = await client.post('/employees', employee);
    return data;
  },

  update: async (id: string, employee: Partial<Employee>): Promise<Employee> => {
    const { data } = await client.patch(`/employees/${id}`, employee);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await client.delete(`/employees/${id}`);
  },

  // Attendance endpoints
  recordAttendance: async (id: string, attendance: { date: string; status: 'PRESENT' | 'ABSENT' | 'LATE' }): Promise<any> => {
    const { data } = await client.post(`/employees/${id}/attendance`, attendance);
    return data;
  },

  getAttendance: async (id: string, startDate?: string, endDate?: string): Promise<any[]> => {
    const { data } = await client.get(`/employees/${id}/attendance`, {
      params: { startDate, endDate },
    });
    return data;
  },

  // Targets endpoints
  setTarget: async (id: string, target: { month: string; targetAmount: number }): Promise<any> => {
    const { data } = await client.post(`/employees/${id}/targets`, target);
    return data;
  },

  getTargets: async (id: string): Promise<any[]> => {
    const { data } = await client.get(`/employees/${id}/targets`);
    return data;
  },

  updateTargetProgress: async (id: string, progress: { month: string; achievedAmount: number }): Promise<any> => {
    const { data } = await client.patch(`/employees/${id}/targets`, progress);
    return data;
  },
};
