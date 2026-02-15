import React, { useState } from 'react';

function AddTracking({ onAdd }) {
  const [newTracking, setNewTracking] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTracking.trim()) return;

    // Pass the new tracking value to parent
    onAdd(newTracking.trim());

    // Clear input
    setNewTracking('');
  };

  return (
    <div style={{ background: 'white', padding: '24px', borderRadius: '8px', marginBottom: '24px' }}>
      <h3 style={{ marginTop: 0 }}>Add New Tracking</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px' }}>
        <input
          type="text"
          placeholder="Enter flight number, tail number, or entity name..."
          value={newTracking}
          onChange={(e) => setNewTracking(e.target.value)}
          className="search-input"
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn btn-primary">
          Add Tracking
        </button>
      </form>
    </div>
  );
}

export default AddTracking;