import { useState, useEffect } from 'react';
import trackingService from '../services/trackingService';

const useTracking = (userId) => {
  const [trackings, setTrackings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrackings = async () => {
      try {
        setLoading(true);
        const data = userId
          ? await trackingService.getUserTrackings(userId)
          : await trackingService.getTrackings();
        setTrackings(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        setTrackings([]);
        setError(err.message || 'Failed to fetch trackings');
      } finally {
        setLoading(false);
      }
    };

    fetchTrackings();
  }, [userId]);

  return { trackings, setTrackings, loading, error };
};

export default useTracking;
