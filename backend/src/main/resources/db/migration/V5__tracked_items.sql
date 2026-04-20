-- ============================================================
-- V5: Tracking list storage for user-managed flight tracking items.
-- Added in a new migration so existing Flyway-managed databases validate cleanly.
-- ============================================================

CREATE TABLE tracked_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED,
  team VARCHAR(80),
  callsign VARCHAR(16),
  notification_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO tracked_items (user_id, team, callsign, notification_enabled)
SELECT 1, 'Milwaukee Bucks', 'DAL8932', TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM tracked_items WHERE user_id = 1 AND callsign = 'DAL8932'
);

INSERT INTO tracked_items (user_id, team, callsign, notification_enabled)
SELECT 1, 'Boston Celtics', 'DAL8919', TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM tracked_items WHERE user_id = 1 AND callsign = 'DAL8919'
);

INSERT INTO tracked_items (user_id, team, callsign, notification_enabled)
SELECT 2, 'Los Angeles Lakers', 'DAL8929', FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM tracked_items WHERE user_id = 2 AND callsign = 'DAL8929'
);

INSERT INTO tracked_items (user_id, team, callsign, notification_enabled)
SELECT 2, 'Golden State Warriors', 'DAL8926', TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM tracked_items WHERE user_id = 2 AND callsign = 'DAL8926'
);
