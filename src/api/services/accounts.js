import { apiClient } from '../client';

export const accountsApi = {
  /**
   * Fetch the list of pending or active accounts.
   * API Endpoint: GET /admin/accounts
   */
  getAccounts: async (filters = {}) => {
    const response = await apiClient.get('/admin/accounts', { params: filters });
    return response.data;
  },

  /**
   * Submit an admin intervention decision (Approve/Suspend).
   * API Endpoint: POST /admin/accounts/{id}/decisions
   */
  submitDecision: async (entityId, decisionPayload) => {
    // decisionPayload includes: { actionType, reasonCode, notes, timestamp }
    const response = await apiClient.post(`/admin/accounts/${entityId}/decisions`, decisionPayload);
    return response.data;
  }
};