import apiClient from '../apiClient';

export const adminService = {
    getSystemConfig: async () => {
        const response = await apiClient.get('/admin/config');
        return response.data;
    },
    
    updateSystemConfig: async (data) => {
        const response = await apiClient.put('/admin/config', data);
        return response.data;
    },
    
    getUsers: async () => {
        const response = await apiClient.get('/admin/users');
        return response.data;
    },
    
    createUser: async (data) => {
        const response = await apiClient.post('/admin/users', data);
        return response.data;
    },
    
    getAuditLogs: async (params) => {
        const response = await apiClient.get('/admin/audit-logs', { params });
        return response.data;
    }
};
