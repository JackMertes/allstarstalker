-- ============================================================
-- V6: Align Flyway-managed schema with the fields persisted by JPA entities.
-- Keeps clean MySQL databases consistent with production expectations.
-- ============================================================

SET @teams_callsign_sql = IF(
  EXISTS(
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = DATABASE()
      AND table_name = 'teams'
      AND column_name = 'callsign'
  ),
  'SELECT 1',
  'ALTER TABLE teams ADD COLUMN callsign VARCHAR(16)'
);
PREPARE teams_callsign_stmt FROM @teams_callsign_sql;
EXECUTE teams_callsign_stmt;
DEALLOCATE PREPARE teams_callsign_stmt;

SET @flights_live_updated_sql = IF(
  EXISTS(
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = DATABASE()
      AND table_name = 'flights'
      AND column_name = 'live_updated_utc'
  ),
  'SELECT 1',
  'ALTER TABLE flights ADD COLUMN live_updated_utc DATETIME'
);
PREPARE flights_live_updated_stmt FROM @flights_live_updated_sql;
EXECUTE flights_live_updated_stmt;
DEALLOCATE PREPARE flights_live_updated_stmt;

SET @flights_live_latitude_sql = IF(
  EXISTS(
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = DATABASE()
      AND table_name = 'flights'
      AND column_name = 'live_latitude'
  ),
  'SELECT 1',
  'ALTER TABLE flights ADD COLUMN live_latitude DECIMAL(9,6)'
);
PREPARE flights_live_latitude_stmt FROM @flights_live_latitude_sql;
EXECUTE flights_live_latitude_stmt;
DEALLOCATE PREPARE flights_live_latitude_stmt;

SET @flights_live_longitude_sql = IF(
  EXISTS(
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = DATABASE()
      AND table_name = 'flights'
      AND column_name = 'live_longitude'
  ),
  'SELECT 1',
  'ALTER TABLE flights ADD COLUMN live_longitude DECIMAL(9,6)'
);
PREPARE flights_live_longitude_stmt FROM @flights_live_longitude_sql;
EXECUTE flights_live_longitude_stmt;
DEALLOCATE PREPARE flights_live_longitude_stmt;

SET @flights_last_seen_sql = IF(
  EXISTS(
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = DATABASE()
      AND table_name = 'flights'
      AND column_name = 'last_seen_utc'
  ),
  'SELECT 1',
  'ALTER TABLE flights ADD COLUMN last_seen_utc DATETIME'
);
PREPARE flights_last_seen_stmt FROM @flights_last_seen_sql;
EXECUTE flights_last_seen_stmt;
DEALLOCATE PREPARE flights_last_seen_stmt;

SET @flights_live_altitude_sql = IF(
  EXISTS(
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = DATABASE()
      AND table_name = 'flights'
      AND column_name = 'live_altitude_ft'
  ),
  'SELECT 1',
  'ALTER TABLE flights ADD COLUMN live_altitude_ft INT'
);
PREPARE flights_live_altitude_stmt FROM @flights_live_altitude_sql;
EXECUTE flights_live_altitude_stmt;
DEALLOCATE PREPARE flights_live_altitude_stmt;

SET @flights_live_ground_speed_sql = IF(
  EXISTS(
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = DATABASE()
      AND table_name = 'flights'
      AND column_name = 'live_ground_speed_kt'
  ),
  'SELECT 1',
  'ALTER TABLE flights ADD COLUMN live_ground_speed_kt DECIMAL(8,1)'
);
PREPARE flights_live_ground_speed_stmt FROM @flights_live_ground_speed_sql;
EXECUTE flights_live_ground_speed_stmt;
DEALLOCATE PREPARE flights_live_ground_speed_stmt;

SET @flights_live_heading_sql = IF(
  EXISTS(
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = DATABASE()
      AND table_name = 'flights'
      AND column_name = 'live_heading_deg'
  ),
  'SELECT 1',
  'ALTER TABLE flights ADD COLUMN live_heading_deg DECIMAL(6,2)'
);
PREPARE flights_live_heading_stmt FROM @flights_live_heading_sql;
EXECUTE flights_live_heading_stmt;
DEALLOCATE PREPARE flights_live_heading_stmt;

ALTER TABLE flights
  MODIFY COLUMN departure_airport_id BIGINT UNSIGNED NULL,
  MODIFY COLUMN arrival_airport_id BIGINT UNSIGNED NULL;
