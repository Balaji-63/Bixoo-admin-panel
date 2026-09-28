import { apiClient } from '../client';

export const accountsApi = {
  /**
   * Fetch the list of pending or active accounts.
   * API Endpoint: GET /admin/accounts
   */
  getAccounts: async (filters = {}) => {
    const response = await apiClient.get('/api/v1/admin/accounts', { params: filters });
    return response.data;
  },

  submitDecision: async (entityId, decisionPayload) => {
    const response = await apiClient.post(`/api/v1/admin/accounts/${entityId}/decisions`, decisionPayload);
    return response.data;
  }
};