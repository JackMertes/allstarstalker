import React, { useEffect, useState } from 'react';
import { TrackingList, AddTracking } from './../components/tracking';
import { mockUserTrackings } from './../utils/mockData';

function TrackingPage() {
  const [trackings, setTrackings] = useState([]);

  // 🔹 Fetch from backend on mount
  useEffect(() => {
    const fetchTrackings = async () => {
      try {
        const base = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';
        const response = await fetch(`${base}/tracked`);
        const data = await response.json();

        if (data && data.length > 0) {
          setTrackings(data);
        } else {
          setTrackings(mockUserTrackings);
        }
      } catch (error) {
        console.error('Error fetching trackings:', error);
        console.log('Using mock data for trackings');
        setTrackings(mockUserTrackings);
      }
    };

    fetchTrackings();
  }, []);

  const handleAddTracking = (trackingValue) => {
    const newItem = {
      trackingId: trackings.length + 1,
      type: 'flight',
      flightNumber: trackingValue.toUpperCase(),
      notificationEnabled: false,
      createdAt: new Date().toISOString()
    };

    setTrackings([...trackings, newItem]);
  };

  const handleRemoveTracking = (trackingId) => {
    setTrackings(trackings.filter(t => t.trackingId !== trackingId));
  };

  const handleToggleNotification = (trackingId) => {
    setTrackings(trackings.map(t =>
      t.trackingId === trackingId
        ? { ...t, notificationEnabled: !t.notificationEnabled }
        : t
    ));
  };

  return (
    <div className="tracking-page">
      <h1>My Tracking</h1>
      <p style={{ color: '#7f8c8d', marginBottom: '32px' }}>
        Keep track of your favorite flights, aircraft, and entities
      </p>

      <AddTracking onAdd={handleAddTracking} />

      <TrackingList
        trackings={trackings}
        onRemove={handleRemoveTracking}
        onToggleNotification={handleToggleNotification}
      />
    </div>
  );
}

export default TrackingPage;