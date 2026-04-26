import { API_BASE_URL } from './config';
import { useAuthStore } from '../store/useAuthStore';

const getHeaders = () => {
  const token = useAuthStore.getState().token;
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const enterpriseApi = {
  // Teams
  getTeams: async () => {
    const response = await fetch(`${API_BASE_URL}/api/v1/teams/`, { headers: getHeaders() });
    return response.json();
  },
  createTeam: async (name: string, description: string) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/teams/create`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ name, description })
    });
    return response.json();
  },

  // Audit Logs
  getAuditLogs: async (skip = 0, limit = 100) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/audit/logs?skip=${skip}&limit=${limit}`, { headers: getHeaders() });
    return response.json();
  },

  // API Keys
  getApiKeys: async () => {
    const response = await fetch(`${API_BASE_URL}/api/v1/apikeys/`, { headers: getHeaders() });
    return response.json();
  },
  createApiKey: async (name: string) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/apikeys/create`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ name })
    });
    return response.json();
  },
  deleteApiKey: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/apikeys/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return response.json();
  },

  // Billing
  getBillingUsage: async () => {
    const response = await fetch(`${API_BASE_URL}/api/v1/billing/usage`, { headers: getHeaders() });
    return response.json();
  },

  // Settings
  getSettings: async () => {
    const response = await fetch(`${API_BASE_URL}/api/v1/settings/`, { headers: getHeaders() });
    return response.json();
  },
  updateSettings: async (settings: any) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/settings/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(settings)
    });
    return response.json();
  }
};
