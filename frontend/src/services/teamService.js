import apiClient from './api';
import { normalizeTeamsFromApi } from '../utils/teamApiMapper';

const teamService = {
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
    try {
      const response = await apiClient.get(`/checkStatus/${callsign}`);
      return response.data;
    } catch (error) {
      throw error;
    }
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