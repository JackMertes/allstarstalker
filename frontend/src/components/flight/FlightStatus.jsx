import React from 'react';
import '../../styles/Common.css';
import { STATUS_COLORS } from '../../utils/constants';

function FlightStatus({ status }) {
  const color = STATUS_COLORS[status] || '#95a5a6';

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
      {status}
    </span>
  );
}

export default FlightStatus;