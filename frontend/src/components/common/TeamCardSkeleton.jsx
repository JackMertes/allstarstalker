import React from 'react';

/* Shimmer keyframes injected once */
const STYLE = `
  @keyframes skeletonShimmer {
    0%   { background-position: -400px 0; }
    100% { background-position:  400px 0; }
  }
  .sk-shimmer {
    background: linear-gradient(
      90deg,
      var(--sk-base, #e8ecf1) 25%,
      var(--sk-shine, #f4f6f9) 50%,
      var(--sk-base, #e8ecf1) 75%
    );
    background-size: 800px 100%;
    animation: skeletonShimmer 1.4s ease-in-out infinite;
    border-radius: 6px;
  }
`;

let injected = false;
function injectStyle() {
  if (injected || typeof document === 'undefined') return;
  const tag = document.createElement('style');
  tag.textContent = STYLE;
  document.head.appendChild(tag);
  injected = true;
}

/**
 * Single skeleton card — matches the visual footprint of TeamCard.
 */
function TeamCardSkeleton() {
  injectStyle();

  const line = (w, h = 14, mb = 0) => ({
    width: w,
    height: h,
    borderRadius: 6,
    marginBottom: mb,
  });

  return (
    <div style={{
      background: 'var(--sk-card-bg, white)',
      border: '1px solid var(--sk-border, #e8ecf0)',
      borderRadius: 12,
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    }}>
      {/* Card header bar */}
      <div style={{
        background: 'var(--sk-header, #dce3ec)',
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
      }}>
        <div className="sk-shimmer" style={line('55%', 16)} />
        <div className="sk-shimmer" style={{ ...line(52, 22), borderRadius: 999 }} />
      </div>

      {/* Card body */}
      <div style={{ padding: '16px 20px 12px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="sk-shimmer" style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div className="sk-shimmer" style={line('40%', 11, 6)} />
          <div className="sk-shimmer" style={line('65%', 14)} />
        </div>
      </div>

      {/* Toggle button placeholder */}
      <div style={{ padding: '0 20px 12px' }}>
        <div className="sk-shimmer" style={{ ...line('100%', 34), borderRadius: 8 }} />
      </div>

      {/* Action buttons */}
      <div style={{ padding: '12px 20px 16px', display: 'flex', gap: 10 }}>
        <div className="sk-shimmer" style={{ ...line('55%', 36), borderRadius: 8 }} />
        <div className="sk-shimmer" style={{ ...line('40%', 36), borderRadius: 8 }} />
      </div>
    </div>
  );
}

/**
 * Renders `count` skeleton cards in a responsive grid.
 * Drop-in replacement wherever <LoadingSpinner /> was used on a team grid.
 *
 * Usage:
 *   import { TeamGridSkeleton } from '../components/common';
 *   {loading && <TeamGridSkeleton count={8} />}
 */
export function TeamGridSkeleton({ count = 6 }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
      gap: 20,
    }}>
      {Array.from({ length: count }, (_, i) => (
        <TeamCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default TeamCardSkeleton;
