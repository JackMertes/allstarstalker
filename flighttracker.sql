CREATE DATABASE IF NOT EXISTS nba_flight_tracker
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_0900_ai_ci;

USE nba_flight_tracker;

SET FOREIGN_KEY_CHECKS = 0;

DROP PROCEDURE IF EXISTS sp_get_team_flights;
DROP PROCEDURE IF EXISTS sp_get_flight_details;
DROP PROCEDURE IF EXISTS sp_upsert_flight_live_sample;

DROP VIEW IF EXISTS v_team_flight_list;
DROP VIEW IF EXISTS v_flight_details;

DROP TABLE IF EXISTS api_payloads;
DROP TABLE IF EXISTS provider_flights;
DROP TABLE IF EXISTS api_providers;

DROP TABLE IF EXISTS flight_positions;
DROP TABLE IF EXISTS flight_live_samples;

DROP TABLE IF EXISTS team_flights;
DROP TABLE IF EXISTS flights;
DROP TABLE IF EXISTS airports;
DROP TABLE IF EXISTS teams;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE teams (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nba_team_id VARCHAR(32),
  name VARCHAR(80) NOT NULL,
  abbreviation VARCHAR(8) NOT NULL,
  city VARCHAR(80) NOT NULL,
  conference ENUM('East','West'),
  division VARCHAR(40),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_teams_abbrev (abbreviation),
  UNIQUE KEY uq_teams_name (name)
) ENGINE=InnoDB;

INSERT INTO teams (nba_team_id, name, abbreviation, city, conference, division) VALUES
('ATL','Atlanta Hawks','ATL','Atlanta','East','Southeast'),
('BOS','Boston Celtics','BOS','Boston','East','Atlantic'),
('BKN','Brooklyn Nets','BKN','Brooklyn','East','Atlantic'),
('CHA','Charlotte Hornets','CHA','Charlotte','East','Southeast'),
('CHI','Chicago Bulls','CHI','Chicago','East','Central'),
('CLE','Cleveland Cavaliers','CLE','Cleveland','East','Central'),
('DAL','Dallas Mavericks','DAL','Dallas','West','Southwest'),
('DEN','Denver Nuggets','DEN','Denver','West','Northwest'),
('DET','Detroit Pistons','DET','Detroit','East','Central'),
('GSW','Golden State Warriors','GSW','San Francisco','West','Pacific'),
('HOU','Houston Rockets','HOU','Houston','West','Southwest'),
('IND','Indiana Pacers','IND','Indianapolis','East','Central'),
('LAC','LA Clippers','LAC','Los Angeles','West','Pacific'),
('LAL','Los Angeles Lakers','LAL','Los Angeles','West','Pacific'),
('MEM','Memphis Grizzlies','MEM','Memphis','West','Southwest'),
('MIA','Miami Heat','MIA','Miami','East','Southeast'),
('MIL','Milwaukee Bucks','MIL','Milwaukee','East','Central'),
('MIN','Minnesota Timberwolves','MIN','Minneapolis','West','Northwest'),
('NOP','New Orleans Pelicans','NOP','New Orleans','West','Southwest'),
('NYK','New York Knicks','NYK','New York','East','Atlantic'),
('OKC','Oklahoma City Thunder','OKC','Oklahoma City','West','Northwest'),
('ORL','Orlando Magic','ORL','Orlando','East','Southeast'),
('PHI','Philadelphia 76ers','PHI','Philadelphia','East','Atlantic'),
('PHX','Phoenix Suns','PHX','Phoenix','West','Pacific'),
('POR','Portland Trail Blazers','POR','Portland','West','Northwest'),
('SAC','Sacramento Kings','SAC','Sacramento','West','Pacific'),
('SAS','San Antonio Spurs','SAS','San Antonio','West','Southwest'),
('TOR','Toronto Raptors','TOR','Toronto','East','Atlantic'),
('UTA','Utah Jazz','UTA','Salt Lake City','West','Northwest'),
('WAS','Washington Wizards','WAS','Washington','East','Southeast')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  city = VALUES(city),
  conference = VALUES(conference),
  division = VALUES(division);

CREATE TABLE airports (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  iata_code CHAR(3) NOT NULL,
  icao_code CHAR(4),
  name VARCHAR(120),
  city VARCHAR(80),
  region VARCHAR(80),
  country VARCHAR(80),
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  timezone VARCHAR(64),
  UNIQUE KEY uq_airports_iata (iata_code),
  UNIQUE KEY uq_airports_icao (icao_code)
) ENGINE=InnoDB;

CREATE TABLE flights (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  external_flight_id VARCHAR(64),
  flight_date DATE,
  flight_status_raw VARCHAR(16),
  tail_number VARCHAR(16),
  callsign VARCHAR(16),
  airline_icao CHAR(3),
  airline_iata CHAR(2),
  flight_number VARCHAR(16),
  flight_iata VARCHAR(16),
  flight_icao VARCHAR(16),
  aircraft_type VARCHAR(16),
  departure_airport_id BIGINT UNSIGNED NOT NULL,
  arrival_airport_id BIGINT UNSIGNED NOT NULL,
  departure_scheduled_utc DATETIME,
  arrival_scheduled_utc DATETIME,
  status ENUM('SCHEDULED','ACTIVE','LANDED','CANCELLED','DIVERTED','INCIDENT','REDIRECTED','UNKNOWN') DEFAULT 'UNKNOWN',
  total_flight_time_min INT,
  live_updated_utc DATETIME,
  live_latitude DECIMAL(9,6),
  live_longitude DECIMAL(9,6),
  live_altitude_m DECIMAL(10,3),
  max_altitude_m DECIMAL(10,3),
  last_seen_utc DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_flights_external (external_flight_id),
  KEY idx_flights_dep_time (departure_airport_id, departure_scheduled_utc),
  KEY idx_flights_arr_time (arrival_airport_id, arrival_scheduled_utc),
  CONSTRAINT fk_flights_dep_airport FOREIGN KEY (departure_airport_id) REFERENCES airports(id),
  CONSTRAINT fk_flights_arr_airport FOREIGN KEY (arrival_airport_id) REFERENCES airports(id)
) ENGINE=InnoDB;

CREATE TABLE team_flights (
  team_id BIGINT UNSIGNED NOT NULL,
  flight_id BIGINT UNSIGNED NOT NULL,
  role ENUM('TEAM_CHARTER','SHARED_CHARTER','UNKNOWN') DEFAULT 'TEAM_CHARTER',
  confidence TINYINT UNSIGNED,
  PRIMARY KEY (team_id, flight_id),
  CONSTRAINT fk_tf_team FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
  CONSTRAINT fk_tf_flight FOREIGN KEY (flight_id) REFERENCES flights(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE flight_live_samples (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  flight_id BIGINT UNSIGNED NOT NULL,
  sample_utc DATETIME NOT NULL,
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  altitude_m DECIMAL(10,3),
  direction_deg DECIMAL(10,3),
  speed_horizontal_kmh DECIMAL(10,3),
  speed_vertical_kmh DECIMAL(10,3),
  is_ground BOOLEAN,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_flight_sample (flight_id, sample_utc),
  KEY idx_flight_samples_time (flight_id, sample_utc),
  CONSTRAINT fk_samples_flight FOREIGN KEY (flight_id) REFERENCES flights(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE flight_positions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  flight_id BIGINT UNSIGNED NOT NULL,
  position_utc DATETIME NOT NULL,
  latitude DECIMAL(9,6) NOT NULL,
  longitude DECIMAL(9,6) NOT NULL,
  altitude_m DECIMAL(10,3),
  ground_speed_kmh DECIMAL(10,3),
  heading_deg SMALLINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_flight_pos (flight_id, position_utc),
  KEY idx_positions_time (flight_id, position_utc),
  CONSTRAINT fk_pos_flight FOREIGN KEY (flight_id) REFERENCES flights(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE api_providers (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(64) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE provider_flights (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  provider_id BIGINT UNSIGNED NOT NULL,
  provider_flight_id VARCHAR(128) NOT NULL,
  flight_id BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_provider_flight (provider_id, provider_flight_id),
  CONSTRAINT fk_pf_provider FOREIGN KEY (provider_id) REFERENCES api_providers(id),
  CONSTRAINT fk_pf_flight FOREIGN KEY (flight_id) REFERENCES flights(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE api_payloads (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  provider_name VARCHAR(64) DEFAULT 'aviationstack',
  endpoint VARCHAR(64) NOT NULL,
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  request_params_json JSON,
  response_json JSON NOT NULL,
  KEY idx_payloads_time (requested_at)
) ENGINE=InnoDB;

CREATE VIEW v_flight_details AS
SELECT
  f.id AS flight_id,
  f.flight_date,
  f.flight_status_raw,
  f.status,
  f.flight_iata,
  dep.iata_code AS departure_iata,
  arr.iata_code AS arrival_iata,
  f.departure_scheduled_utc,
  f.arrival_scheduled_utc,
  f.live_updated_utc,
  f.live_latitude,
  f.live_longitude,
  f.live_altitude_m,
  f.max_altitude_m,
  f.total_flight_time_min,
  f.last_seen_utc
FROM flights f
JOIN airports dep ON dep.id = f.departure_airport_id
JOIN airports arr ON arr.id = f.arrival_airport_id;

CREATE VIEW v_team_flight_list AS
SELECT
  t.abbreviation AS team_abbreviation,
  t.name AS team_name,
  tf.role,
  tf.confidence,
  d.*
FROM team_flights tf
JOIN teams t ON t.id = tf.team_id
JOIN v_flight_details d ON d.flight_id = tf.flight_id;

DELIMITER $$

CREATE PROCEDURE sp_get_team_flights(
  IN p_team_abbrev VARCHAR(8),
  IN p_start_utc DATETIME,
  IN p_end_utc DATETIME
)
BEGIN
  SELECT *
  FROM v_team_flight_list
  WHERE team_abbreviation = p_team_abbrev
    AND (p_start_utc IS NULL OR departure_scheduled_utc >= p_start_utc)
    AND (p_end_utc IS NULL OR departure_scheduled_utc < p_end_utc)
  ORDER BY departure_scheduled_utc DESC, flight_id DESC;
END$$

CREATE PROCEDURE sp_get_flight_details(IN p_flight_id BIGINT)
BEGIN
  SELECT * FROM v_flight_details WHERE flight_id = p_flight_id;
END$$

CREATE PROCEDURE sp_upsert_flight_live_sample(
  IN p_flight_id BIGINT UNSIGNED,
  IN p_sample_utc DATETIME,
  IN p_lat DECIMAL(9,6),
  IN p_lon DECIMAL(9,6),
  IN p_alt_m DECIMAL(10,3),
  IN p_is_ground BOOLEAN
)
BEGIN
  INSERT INTO flight_live_samples (flight_id, sample_utc, latitude, longitude, altitude_m, is_ground)
  VALUES (p_flight_id, p_sample_utc, p_lat, p_lon, p_alt_m, p_is_ground)
  ON DUPLICATE KEY UPDATE
    latitude = VALapi_providersapi_providersUES(latitude),
    longitude = VALUES(longitude),
    altitude_m = VALUES(altitude_m),
    is_ground = VALUES(is_ground);

  UPDATE flights
  SET
    live_updated_utc = p_sample_utc,
    live_latitude = p_lat,
    live_longitude = p_lon,
    live_altitude_m = p_alt_m,
    last_seen_utc = p_sample_utc,
    max_altitude_m = CASE
      WHEN max_altitude_m IS NULL THEN p_alt_m
      WHEN p_alt_m IS NULL THEN max_altitude_m
      ELSE GREATEST(max_altitude_m, p_alt_m)
    END
  WHERE id = p_flight_id;
END$$

DELIMITER ;

INSERT INTO api_providers(name)
VALUES ('aviationstack') AS new
ON DUPLICATE KEY UPDATE name = new.name;