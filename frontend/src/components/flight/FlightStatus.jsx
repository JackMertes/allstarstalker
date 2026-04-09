import React from 'react';
import '../../styles/Common.css';
import {
  STATUS_COLORS, STATUS_LABELS
} from '../../utils/constants';

function FlightStatus({ status }) {
  /* Get color or default gray */
  const color =
    STATUS_COLORS[status]
    || '#9ca3af';

  /* Get label or fallback */
  const label =
    STATUS_LABELS[status]
    || status
    || 'Unknown';

  /* Pick icon based on status */
  const icon = {
    flying: '🟢',
    landed: '🛬',
    scheduled: '📅',
    delayed: '⚠️',
    cancelled: '❌',
    unknown: '❓',
  }[status] || '❓';

  return (
    <span
      className="flight-status-badge"
      style={{
        backgroundColor: color,
        color: 'white',
        padding: '5px 14px',
        borderRadius: '20px',
        fontWeight: '600',
        fontSize: '12px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        boxShadow:
          `0 2px 6px ${color}40`,
      }}
    >
      {icon} {label}
    </span>
  );
}

export default FlightStatus;