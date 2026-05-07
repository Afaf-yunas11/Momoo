import apiClient from '../apiClient';

export const financeService = {
  getRevenue: async (params) => {
    const response = await apiClient.get('/revenue', { params });
    return response.data;
  },
  
  addRevenue: async (data) => {
    const response = await apiClient.post('/revenue', data);
    return response.data;
  },
  
  getExpenses: async (params) => {
    const response = await apiClient.get('/expenses', { params });
    return response.data;
  },
  
  addExpense: async (data) => {
    const response = await apiClient.post('/expenses', data);
    return response.data;
  },
  
  getProfitSummary: async () => {
    const response = await apiClient.get('/finance/profit-summary');
    return response.data;
  }
};
