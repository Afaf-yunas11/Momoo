import apiClient from '../apiClient';

export const feedService = {
  getRecords: async () => {
    const response = await apiClient.get('/feed-records');
    return response.data;
  },

  createRecord: async (params, data) => {
    const response = await apiClient.post('/feed-records', data, { params });
    return response.data;
  },

  getFeedTypes: async () => {
    const response = await apiClient.get('/feed-types');
    return response.data;
  },

  createFeedType: async (data) => {
    const response = await apiClient.post('/feed-types', data);
    return response.data;
  },

  getInventory: async () => {
    const response = await apiClient.get('/feed-inventory');
    return response.data;
  },

  updateInventory: async (id, data) => {
    const response = await apiClient.put(`/feed-inventory/${id}`, data);
    return response.data;
  },

  getAiRecommendation: async (animalId) => {
    const response = await apiClient.post(`/feed/ai-recommend/${animalId}`);
    return response.data;
  }
};
