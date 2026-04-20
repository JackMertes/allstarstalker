import apiClient from './api';

const trackingService = {
  // Get all trackings
  getTracking: async () => {
    try {
      const response = await apiClient.get('/tracking');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user trackings
  getUserTrackings: async (userId) => {
    try {
      const response = await apiClient.get(`/tracking/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add tracking
  addTracking: async (trackingData) => {
    try {
      const response = await apiClient.post('/tracking', trackingData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Remove tracking
  removeTracking: async (callsign) => {
    try {
      const response = await apiClient.delete('/tracking', {
        params: { callsign },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateTracking: async (trackingId, updates) => {
    try {
      const response = await apiClient.patch(`/tracking/${trackingId}`, updates);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default trackingService;
