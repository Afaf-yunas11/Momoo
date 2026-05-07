import apiClient from '../apiClient';

export const animalService = {
  getAnimals: async (params) => {
    const response = await apiClient.get('/animals', { params });
    return response.data;
  },
  
  getAnimal: async (id) => {
    const response = await apiClient.get(`/animals/${id}`);
    return response.data;
  },
  
  createAnimal: async (data) => {
    const response = await apiClient.post('/animals', data);
    return response.data;
  },
  
  updateAnimal: async (id, data) => {
    const response = await apiClient.put(`/animals/${id}`, data);
    return response.data;
  },
  
  deleteAnimal: async (id) => {
    const response = await apiClient.delete(`/animals/${id}`);
    return response.data;
  },
  
  getWeightHistory: async (id) => {
    const response = await apiClient.get(`/animals/${id}/weights`);
    return response.data;
  },
  
  addWeight: async (id, data) => {
    const response = await apiClient.post(`/animals/${id}/weights`, data);
    return response.data;
  },
  
  getAnimalInsights: async (id) => {
    const response = await apiClient.get(`/animals/${id}/ai-insights`);
    return response.data;
  }
};
