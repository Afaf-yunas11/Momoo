import apiClient from '../apiClient';

export const milkService = {
  getRecords: async (params) => {
    const response = await apiClient.get('/milk-records', { params });
    return response.data;
  },
  
  createRecord: async (data) => {
    const response = await apiClient.post('/milk-records', data);
    return response.data;
  },
  
  getSummary: async () => {
    const response = await apiClient.get('/milk-records/summary');
    return response.data;
  },
  
  getTrends: async (animalId) => {
    const response = await apiClient.get(`/milk-records/trends/${animalId}`);
    return response.data;
  }
};
