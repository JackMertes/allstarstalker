import React from 'react';
import { formatDateTime } from '../../utils/formatters';

function TrackingList({ trackings, onRemove, onToggleNotification }) {
  if (trackings.length === 0) {
    return (
      <div className="tracking-list" style={{ background: 'white', padding: '24px', borderRadius: '8px' }}>
        <h2 style={{ marginTop: 0 }}>Your Tracked Items (0)</h2>
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#7f8c8d' }}>
          <p style={{ fontSize: '48px', margin: '0 0 16px 0' }}>📋</p>
          <p>No tracked items yet. Add one above to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tracking-list" style={{ background: 'white', padding: '24px', borderRadius: '8px' }}>
      <h2 style={{ marginTop: 0 }}>Your Tracked Items ({trackings.length})</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {trackings.map(tracking => (
          <div
            key={tracking.trackingId}
            style={{
              padding: '16px',
              background: '#f8f9fa',
              borderRadius: '6px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                {tracking.type === 'entity' && `${tracking.entityName} (${tracking.entityType})`}
                {tracking.type === 'aircraft' && `${tracking.tailNumber} - ${tracking.aircraftType}`}
                {tracking.type === 'flight' && `Flight ${tracking.flightNumber}`}
              </div>
              <div style={{ fontSize: '14px', color: '#7f8c8d' }}>
                Added: {formatDateTime(tracking.createdAt)}
              </div>
              <div style={{ fontSize: '14px', marginTop: '4px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={tracking.notificationEnabled}
                    onChange={() => onToggleNotification(tracking.trackingId)}
                  />
                  Enable notifications
                </label>
              </div>
            </div>
            <button
              onClick={() => onRemove(tracking.trackingId)}
              style={{
                background: '#e74c3c',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrackingList;