import apiClient from '../apiClient';

export const healthService = {
  getAlerts: async (params) => {
    const response = await apiClient.get('/ai-alerts', { params });
    return response.data;
  },
  
  reviewAlert: async (id, reviewedBy = 'manager') => {
    const response = await apiClient.put(`/ai-alerts/${id}/review`, null, {
      params: { reviewedBy }
    });
    return response.data;
  },
  
  getVaccinations: async (animalId) => {
    const response = await apiClient.get('/vaccinations', { params: { animalId } });
    return response.data;
  },
  
  addVaccination: async (animalId, data) => {
    const response = await apiClient.post('/vaccinations', data, {
      params: { animalId }
    });
    return response.data;
  },
  
  getDiseaseRecords: async () => {
    const response = await apiClient.get('/disease-records');
    return response.data;
  },
  
  addDiseaseRecord: async (animalId, data) => {
    const response = await apiClient.post('/disease-records', data, {
      params: { animalId }
    });
    return response.data;
  }
};
