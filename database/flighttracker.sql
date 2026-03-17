-- ============================================================
-- NBA Team Flight Tracker - FULL CLEAN INIT FILE
-- Idempotent (safe to rerun)
-- MySQL 8+
-- ============================================================

CREATE DATABASE IF NOT EXISTS nba_flight_tracker
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_0900_ai_ci;

USE nba_flight_tracker;

-- ============================================================
-- DROP (ORDER MATTERS)
-- ============================================================

DROP PROCEDURE IF EXISTS sp_get_team_flights;
DROP PROCEDURE IF EXISTS sp_get_flight_details;

DROP VIEW IF EXISTS v_team_flight_list;
DROP VIEW IF EXISTS v_flight_details;

DROP TABLE IF EXISTS flight_positions;
DROP TABLE IF EXISTS ingestion_events;
DROP TABLE IF EXISTS data_sources;
DROP TABLE IF EXISTS team_flights;
DROP TABLE IF EXISTS flights;
DROP TABLE IF EXISTS airports;
DROP TABLE IF EXISTS teams;

-- ============================================================
-- TEAMS
-- ============================================================

CREATE TABLE teams (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nba_team_id   VARCHAR(32),
  name          VARCHAR(80) NOT NULL,
  abbreviation  VARCHAR(8) NOT NULL,
  city          VARCHAR(80) NOT NULL,
  conference    ENUM('East','West'),
  division      VARCHAR(40),
  callsign      VARCHAR(16) NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_team_abbrev (abbreviation),
  UNIQUE KEY uq_team_name (name),
  UNIQUE KEY uq_team_callsign (callsign)
) ENGINE=InnoDB;

-- ============================================================
-- AIRPORTS
-- ============================================================

CREATE TABLE airports (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  iata_code   CHAR(3) NOT NULL,
  icao_code   CHAR(4),
  name        VARCHAR(120),
  city        VARCHAR(80),
  region      VARCHAR(80),
  country     VARCHAR(80),
  latitude    DECIMAL(9,6),
  longitude   DECIMAL(9,6),
  timezone    VARCHAR(64),
  UNIQUE KEY uq_airport_iata (iata_code)
) ENGINE=InnoDB;

-- ============================================================
-- FLIGHTS
-- ============================================================

CREATE TABLE flights (
  id                      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  external_flight_id      VARCHAR(64),
  tail_number             VARCHAR(16),
  callsign                VARCHAR(16),
  airline_icao            CHAR(3),
  flight_number           VARCHAR(16),
  aircraft_type           VARCHAR(16),
  departure_airport_id    BIGINT UNSIGNED NULL,
  arrival_airport_id      BIGINT UNSIGNED NULL,

  scheduled_departure_utc DATETIME,
  scheduled_arrival_utc   DATETIME,
  actual_departure_utc    DATETIME,
  actual_arrival_utc      DATETIME,

  status ENUM('SCHEDULED','ACTIVE','LANDED','CANCELLED','DIVERTED','UNKNOWN')
         DEFAULT 'UNKNOWN',

  live_updated_utc DATETIME(3) NULL,
  live_latitude DECIMAL(9,6) NULL,
  live_longitude DECIMAL(9,6) NULL,
  live_altitude_ft INT NULL,
  live_ground_speed_kt DECIMAL(8,1) NULL,
  live_heading_deg DECIMAL(6,2) NULL,
  last_seen_utc DATETIME(3) NULL,

  distance_km DECIMAL(8,2),
  duration_minutes INT,
  notes VARCHAR(255),

  UNIQUE KEY uq_external (external_flight_id),
  UNIQUE KEY uq_callsign (callsign),
  KEY idx_dep_time (departure_airport_id, scheduled_departure_utc),
  KEY idx_arr_time (arrival_airport_id, scheduled_arrival_utc),

  CONSTRAINT fk_dep_airport FOREIGN KEY (departure_airport_id) REFERENCES airports(id) ON DELETE SET NULL,
  CONSTRAINT fk_arr_airport FOREIGN KEY (arrival_airport_id) REFERENCES airports(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- TEAM_FLIGHTS
-- ============================================================

CREATE TABLE team_flights (
  team_id BIGINT UNSIGNED,
  flight_id BIGINT UNSIGNED,
  role ENUM('TEAM_CHARTER','SHARED_CHARTER','UNKNOWN') DEFAULT 'TEAM_CHARTER',
  confidence TINYINT UNSIGNED,
  PRIMARY KEY (team_id, flight_id),
  CONSTRAINT fk_tf_team FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
  CONSTRAINT fk_tf_flight FOREIGN KEY (flight_id) REFERENCES flights(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- FLIGHT_POSITIONS
-- ============================================================

CREATE TABLE flight_positions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  flight_id BIGINT UNSIGNED NOT NULL,
  position_utc DATETIME NOT NULL,
  latitude DECIMAL(9,6) NOT NULL,
  longitude DECIMAL(9,6) NOT NULL,
  altitude_ft INT,
  ground_speed_kt INT,
  heading_deg SMALLINT,
  KEY idx_pos (flight_id, position_utc),
  CONSTRAINT fk_pos_flight FOREIGN KEY (flight_id) REFERENCES flights(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- DATA SOURCES + INGESTION
-- ============================================================

CREATE TABLE data_sources (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(60) UNIQUE
) ENGINE=InnoDB;

CREATE TABLE ingestion_events (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  data_source_id BIGINT UNSIGNED,
  external_id VARCHAR(128),
  payload_json JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ingest_source FOREIGN KEY (data_source_id) REFERENCES data_sources(id)
) ENGINE=InnoDB;

-- ============================================================
-- VIEWS
-- ============================================================

CREATE VIEW v_flight_details AS
SELECT
  f.id AS flight_id,
  f.external_flight_id,
  f.tail_number,
  f.callsign,
  f.flight_number,
  f.aircraft_type,

  dep.iata_code AS departure_iata,
  dep.city AS departure_city,
  arr.iata_code AS arrival_iata,
  arr.city AS arrival_city,

  f.scheduled_departure_utc,
  f.scheduled_arrival_utc,
  f.actual_departure_utc,
  f.actual_arrival_utc,
  f.status,
  f.distance_km,

  f.live_updated_utc,
  f.live_latitude,
  f.live_longitude,
  f.live_altitude_ft,
  f.live_ground_speed_kt,
  f.live_heading_deg,
  f.last_seen_utc,

  TIMESTAMPDIFF(MINUTE, f.scheduled_departure_utc, f.scheduled_arrival_utc) AS scheduled_duration_min,
  TIMESTAMPDIFF(MINUTE, f.actual_departure_utc, f.actual_arrival_utc) AS actual_duration_min

FROM flights f
LEFT JOIN airports dep ON dep.id = f.departure_airport_id
LEFT JOIN airports arr ON arr.id = f.arrival_airport_id;

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

-- ============================================================
-- STORED PROCEDURES
-- ============================================================

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
    AND (p_start_utc IS NULL OR scheduled_departure_utc >= p_start_utc)
    AND (p_end_utc IS NULL OR scheduled_departure_utc < p_end_utc)
  ORDER BY scheduled_departure_utc DESC;
END$$

CREATE PROCEDURE sp_get_flight_details(IN p_flight_id BIGINT)
BEGIN
  SELECT * FROM v_flight_details WHERE flight_id = p_flight_id;
END$$

DELIMITER ;

-- ============================================================
-- SEED DATA
-- ============================================================

INSERT INTO teams (nba_team_id, name, abbreviation, city, conference, callsign)
VALUES
('ATL','Atlanta Hawks','ATL','Atlanta','East','DAL8918'),
('BOS','Boston Celtics','BOS','Boston','East','DAL8919'),
('BKN','Brooklyn Nets','BKN','Brooklyn','East','DAL8920'),
('CHA','Charlotte Hornets','CHA','Charlotte','East','DAL8921'),
('CHI','Chicago Bulls','CHI','Chicago','East','DAL8922'),
('CLE','Cleveland Cavaliers','CLE','Cleveland','East','DAL8923'),
('DEN','Denver Nuggets','DEN','Denver','West','DAL8924'),
('DET','Detroit Pistons','DET','Detroit','East','DAL8925'),
('GSW','Golden State Warriors','GSW','San Francisco','West','DAL8926'),
('IND','Indiana Pacers','IND','Indianapolis','East','DAL8927'),
('LAC','Los Angeles Clippers','LAC','Los Angeles','West','DAL8928'),
('LAL','Los Angeles Lakers','LAL','Los Angeles','West','DAL8929'),
('MEM','Memphis Grizzlies','MEM','Memphis','West','DAL8930'),
('MIA','Miami Heat','MIA','Miami','East','DAL8931'),
('MIL','Milwaukee Bucks','MIL','Milwaukee','East','DAL8932'),
('MIN','Minnesota Timberwolves','MIN','Minneapolis','West','DAL8933'),
('NOP','New Orleans Pelicans','NOP','New Orleans','West','DAL8934'),
('NYK','New York Knicks','NYK','New York','East','DAL8935'),
('OKC','Oklahoma City Thunder','OKC','Oklahoma City','West','DAL8936'),
('ORL','Orlando Magic','ORL','Orlando','East','DAL8937'),
('PHI','Philadelphia 76ers','PHI','Philadelphia','East','DAL8938'),
('PHX','Phoenix Suns','PHX','Phoenix','West','DAL8939'),
('POR','Portland Trail Blazers','POR','Portland','West','DAL8940'),
('SAC','Sacramento Kings','SAC','Sacramento','West','DAL8941'),
('SAS','San Antonio Spurs','SAS','San Antonio','West','DAL8942'),
('TOR','Toronto Raptors','TOR','Toronto','East','DAL8943'),
('UTA','Utah Jazz','UTA','Salt Lake City','West','DAL8944'),
('WAS','Washington Wizards','WAS','Washington','East','DAL8945')
ON DUPLICATE KEY UPDATE callsign = VALUES(callsign);

INSERT INTO airports (iata_code, name, city, country)
VALUES
('MKE','Milwaukee Mitchell Intl','Milwaukee','US'),
('SFO','San Francisco Intl','San Francisco','US'),
('LAX','Los Angeles Intl','Los Angeles','US');

INSERT INTO flights (
external_flight_id, departure_airport_id, arrival_airport_id,
scheduled_departure_utc, scheduled_arrival_utc, status)
SELECT 'demo1', d.id, a.id, '2026-02-26 01:00:00', '2026-02-26 04:00:00','SCHEDULED'
FROM airports d JOIN airports a WHERE d.iata_code='MKE' AND a.iata_code='SFO';

INSERT INTO team_flights
SELECT t.id, f.id, 'TEAM_CHARTER', 95
FROM teams t JOIN flights f
WHERE t.abbreviation='MIL' AND f.external_flight_id='demo1';

-- ============================================================
-- DONE
-- ============================================================