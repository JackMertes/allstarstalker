import React, { useState } from 'react';
import teamService from '../services/teamService';
import trackingService from '../services/trackingService';
import useTracking from '../hooks/useTracking';

// ── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ enabled }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, letterSpacing: '0.5px',
      padding: '3px 8px', borderRadius: 999,
      background: enabled ? 'rgba(34,197,94,0.12)' : 'rgba(107,114,128,0.12)',
      color: enabled ? '#16a34a' : '#6b7280',
      border: `1px solid ${enabled ? 'rgba(34,197,94,0.25)' : 'rgba(107,114,128,0.2)'}`,
    }}>
      {enabled ? '● Active' : '○ Paused'}
    </span>
  );
}

// ── Single tracked item row ──────────────────────────────────────────────────
function TrackedRow({ tracking, onRemove, onToggle }) {
  const label =
    tracking.team                ? tracking.team :
    tracking.entityName          ? `${tracking.entityName} (${tracking.entityType})` :
    tracking.flightNumber        ? `Flight ${tracking.flightNumber}` :
    'Unknown';

  const sub =
    tracking.category ? `${tracking.category} · ${tracking.callsign || ''}` :
    tracking.callsign  ? tracking.callsign : '';

  return (
    <div style={RS.row}>
      {/* Left icon */}
      <div style={RS.iconWrap}>
        {'🏀'}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={RS.label}>{label}</div>
        {sub && <div style={RS.sub}>{sub}</div>}
      </div>

      {/* Notification toggle */}
      <button
        onClick={() => onToggle(tracking.trackingId)}
        title={tracking.notificationEnabled ? 'Disable notifications' : 'Enable notifications'}
        style={{
          ...RS.notifBtn,
          color: tracking.notificationEnabled ? '#FBBF24' : '#6b7280',
          filter: tracking.notificationEnabled ? 'none' : 'grayscale(1) opacity(0.5)',
        }}
      >
        🔔
      </button>

      {/* Status */}
      <StatusBadge enabled={tracking.notificationEnabled} />

      {/* Remove */}
      <button onClick={() => onRemove(tracking.callsign)} style={RS.removeBtn}>
        Remove
      </button>
    </div>
  );
}

const RS = {
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '14px 16px',
    borderRadius: 10,
    border: '1px solid var(--cloud-gray, #e5e7eb)',
    background: 'var(--off-white, #f8fafc)',
    transition: 'border-color 0.15s',
    flexWrap: 'wrap',
  },
  iconWrap: {
    fontSize: 22,
    flexShrink: 0,
    width: 36,
    textAlign: 'center',
  },
  label: {
    fontWeight: 700,
    fontSize: 15,
    color: 'var(--charcoal, #111)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  sub: {
    fontSize: 12,
    color: 'var(--runway-gray, #6b7280)',
    marginTop: 2,
  },
  notifBtn: {
    background: 'none',
    border: 'none',
    fontSize: 18,
    cursor: 'pointer',
    padding: '2px 4px',
    borderRadius: 6,
    transition: 'transform 0.15s',
    flexShrink: 0,
  },
  removeBtn: {
    background: 'none',
    border: '1px solid #fca5a5',
    color: '#dc2626',
    borderRadius: 6,
    padding: '5px 11px',
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
    flexShrink: 0,
  },
};

// ── Add tracking input ───────────────────────────────────────────────────────
function AddTrackingBar({ onAdd }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onAdd(value.trim());
      setValue('');
    }
  };

  return (
    <div style={AT.wrap}>
      <h2 style={AT.title}>Add New Tracking</h2>
      <form onSubmit={handleSubmit} style={AT.form}>
        <input
          className="search-input"
          type="text"
          placeholder="Enter flight number, tail number, or team name…"
          value={value}
          onChange={e => setValue(e.target.value)}
          style={AT.input}
        />
        <button type="submit" className="btn btn-primary" style={AT.btn}>
          Add Tracking
        </button>
      </form>
    </div>
  );
}

const AT = {
  wrap:  { background: 'var(--white, white)', borderRadius: 10, padding: '20px 24px', border: '1px solid var(--cloud-gray, #e5e7eb)', marginBottom: 20 },
  title: { fontSize: 16, fontWeight: 700, color: 'var(--jet-navy, #0B2545)', marginBottom: 14, marginTop: 0 },
  form:  { display: 'flex', gap: 10, flexWrap: 'wrap' },
  input: { flex: '1 1 260px' },
  btn:   { flexShrink: 0 },
};

// ── Page ─────────────────────────────────────────────────────────────────────
function TrackingPage() {
  const { trackings, setTrackings, loading, error } = useTracking();

  const handleAdd = async (value) => {
    try {
      const teams = await teamService.getAllTeams();
      const input = value.toLowerCase();
      const match = teams.find(
        t => (t.team && t.team.toLowerCase() === input) ||
             (t.callsign && t.callsign.toLowerCase() === input)
      );
      if (match) {
        // Prevent duplicate team tracking
        const alreadyTracked = trackings.some(
          t => (
            (t.team && t.team.toLowerCase() === match.team.toLowerCase()) ||
            (t.callsign && t.callsign.toLowerCase() === match.callsign.toLowerCase())
          )
        );
        if (alreadyTracked) {
          alert(`Team: ${match.team} (${match.callsign}) is already being tracked.`);
          return;
        }
        // Actually add tracking via API
        try {
          const trackingData = {
            team: match.team,
            userId:1,
            callsign: match.callsign,
            notificationEnabled: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          console.log(trackingData);
          const apiResult = await trackingService.addTracking(trackingData);
          console.log(apiResult);
          setTrackings(prev => [
            ...prev,
            apiResult,
          ]);
        } catch (err) {
          alert('Failed to add tracking to server.');
        }
      } else {
        alert(`Team or callsign: ${value} does not exist.`);
      }
    } catch (err) {
      alert('Failed to validate team. Please try again.');
    }
  };

  const handleRemove = async (callsign) => {
    if (!callsign) {
      alert('Unable to remove tracking: callsign is missing.');
      return;
    }

    try {
      console.log("Attempting to remove tracking for callsign:", callsign);
      const response = await trackingService.removeTracking(callsign);
      console.log("remove response:", response);
      if (response?.status === 204) {
        setTrackings(prev => prev.filter(t =>
          String(t.callsign || '').toLowerCase() !== String(callsign).toLowerCase()
        ));
      }
    } catch {
      // Keep UI unchanged when remove request fails.
    }
  };

  const handleToggle = async (id) => {
    const current = trackings.find(t => String(t.trackingId) === String(id));
    if (!current) {
      return;
    }

    try {
      const updated = await trackingService.updateTracking(id, {
        notificationEnabled: !current.notificationEnabled,
      });
      setTrackings(prev => prev.map(t =>
        String(t.trackingId) === String(id) ? updated : t
      ));
    } catch {
      alert('Failed to update notification settings.');
    }
  };

  return (
    <div className="tracking-page">
      <h1>My Tracking</h1>
      <p style={{ color: 'var(--runway-gray)', marginBottom: 28, fontSize: 15 }}>
        Keep track of your favourite teams, flights, and aircraft.
      </p>

      <AddTrackingBar onAdd={handleAdd} />

      {/* Tracked items list */}
      <div className="tracking-list">
        <h2 style={{ marginTop: 0, marginBottom: 16, fontSize: 18, fontWeight: 700 }}>
          Your Tracked Items ({loading ? '…' : trackings.length})
        </h2>

        {error && (
          <div style={{ marginBottom: 16, color: '#b91c1c', fontSize: 14 }}>
            Could not load tracking data.
          </div>
        )}

        {loading ? (
          <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--runway-gray)' }}>
            Loading…
          </div>
        ) : trackings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--runway-gray)' }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>📋</div>
            <p style={{ margin: 0 }}>No tracked items yet. Add one above to get started!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {trackings.map(t => (
              <TrackedRow
                key={t.trackingId}
                tracking={t}
                onRemove={handleRemove}
                onToggle={handleToggle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TrackingPage;
