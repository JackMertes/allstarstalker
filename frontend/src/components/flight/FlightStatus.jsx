import React from 'react';
import '../../styles/Common.css';
import {
  STATUS_COLORS, STATUS_LABELS
} from '../../utils/constants';
import { normalizeFlightStatus } from '../../utils/flightStatus';

function FlightStatus({ status }) {
  const normalizedStatus = normalizeFlightStatus(status);

  /* Get color or default gray */
  const color =
    STATUS_COLORS[normalizedStatus]
    || '#9ca3af';

  /* Get label or fallback */
  const label =
    STATUS_LABELS[normalizedStatus]
    || normalizedStatus
    || 'Unknown';

  /* Pick icon based on status */
  const icon = {
    ACTIVE: '🟢',
    DIVERTED: '↪️',
    LANDED: '🛬',
    SCHEDULED: '📅',
    DELAYED: '⚠️',
    CANCELLED: '❌',
    NOT_FLYING: '📍',
    UNKNOWN: '❓',
  }[normalizedStatus] || '❓';

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
      {label}
    </span>
  );
}

export default FlightStatus;
