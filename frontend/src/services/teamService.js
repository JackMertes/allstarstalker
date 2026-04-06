import apiClient from './api';
import { normalizeTeamsFromApi } from '../utils/teamApiMapper';

// Coalesce concurrent status lookups per callsign (helps in React StrictMode/dev).
const pendingStatusRequests = new Map();

const teamService = {
  // Get all teams (normalized for TeamCard: team, callsign, category, status, …)
  getAllTeams: async () => {
    try {
      const response = await apiClient.get('/teams');
      return normalizeTeamsFromApi(response.data);
    } catch (error) {
      throw error;
    }
  },

  // Check flight status for a team
  checkStatus: async (callsign) => {
    const key = String(callsign || '').trim().toUpperCase();
    if (!key) {
      throw new Error('callsign is required');
    }

    if (pendingStatusRequests.has(key)) {
      return pendingStatusRequests.get(key);
    }

    const request = apiClient
      .get(`/checkStatus/${key}`)
      .then((response) => response.data)
      .finally(() => {
        pendingStatusRequests.delete(key);
      });

    pendingStatusRequests.set(key, request);
    return request;
  },

  // Add team to tracking
  addTracking: async (callsign) => {
    try {
      const response = await apiClient.post(`/addTracking/${callsign}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default teamService;