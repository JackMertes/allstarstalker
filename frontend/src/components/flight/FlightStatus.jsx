import React from 'react';
import '../../styles/Common.css';
import { STATUS_COLORS, STATUS_LABELS } from '../../utils/constants';

function FlightStatus({ status }) {
  const color = STATUS_COLORS[status] || '#9ca3af';
  const label = STATUS_LABELS[status] || status || 'Unknown';

  return (
    <span
      className="flight-status-badge"
      style={{
        backgroundColor: color,
        color: 'white',
        padding: '4px 12px',
        borderRadius: '4px',
        fontWeight: '600',
        fontSize: '12px',
        textTransform: 'uppercase'
      }}
    >
      {label}
    </span>
  );
}

export default FlightStatus;