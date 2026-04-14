import apiClient from './api';

const flightService = {
  // Search flights by flight number
  searchByFlightNumber: async (flightNumber) => {
    try {
      const response = await apiClient.get(`/flights/search`, {
        params: { searchTerm: flightNumber }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get flight by ID
  getFlightById: async (flightId) => {
    try {
      const response = await apiClient.get(`/flights/${flightId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get flight details with positions
  getFlightDetails: async (flightId) => {
    try {
      const response = await apiClient.get(`/flights/${flightId}/details`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get active flights
  getActiveFlights: async () => {
    try {
      const response = await apiClient.get('/flights/active');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get flight positions
  getFlightPositions: async (flightId) => {
    try {
      const response = await apiClient.get(`/flights/${flightId}/positions`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default flightService;
