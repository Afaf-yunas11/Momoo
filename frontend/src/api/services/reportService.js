import apiClient from '../apiClient';

export const reportService = {
  getReports: async () => {
    const response = await apiClient.get('/reports');
    return response.data;
  },
  
  generateReport: async (data) => {
    const response = await apiClient.post('/reports/generate', data);
    return response.data;
  },
  
  downloadReport: async (id) => {
    // This usually returns a blob or a URL
    const response = await apiClient.get(`/reports/${id}/download`, {
      responseType: 'blob'
    });
    return response.data;
  }
};
