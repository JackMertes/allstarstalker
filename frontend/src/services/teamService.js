import apiClient from './api';

const teamService = {
  // Get all teams
  getAllTeams: async () => {
    try {
      console.log("Fetching all teams from backend...");
      const response = await apiClient.get('/teams');
      console.log(JSON.stringify(response.data));
      return response.data;
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