-- ============================================================
-- V1: Baseline tables for NBA Flight Tracker.
-- Flyway runs this in the DB from spring.datasource.url.
-- Do not add CREATE DATABASE / USE; do not add DROP (Flyway runs once per version).
-- ============================================================

-- NBA teams (e.g. MIL, GSW). Used for team–flight associations.
CREATE TABLE teams (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nba_team_id   VARCHAR(32),
  name          VARCHAR(80) NOT NULL,
  abbreviation  VARCHAR(8) NOT NULL,
  city          VARCHAR(80) NOT NULL,
  conference    ENUM('East','West'),
  division      VARCHAR(40),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_team_abbrev (abbreviation),
  UNIQUE KEY uq_team_name (name)
) ENGINE=InnoDB;

-- Airports (IATA/ICAO). Referenced by flights as departure/arrival.
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

-- Flights (charter/scheduled). Links departure/arrival airports; status and times.
CREATE TABLE flights (
  id                      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  external_flight_id      VARCHAR(64),
  tail_number             VARCHAR(16),
  callsign                VARCHAR(16),
  airline_icao            CHAR(3),
  flight_number           VARCHAR(16),
  aircraft_type           VARCHAR(16),
  departure_airport_id    BIGINT UNSIGNED NOT NULL,
  arrival_airport_id      BIGINT UNSIGNED NOT NULL,
  scheduled_departure_utc DATETIME,
  scheduled_arrival_utc   DATETIME,
  actual_departure_utc    DATETIME,
  actual_arrival_utc      DATETIME,
  status ENUM('SCHEDULED','ACTIVE','LANDED','CANCELLED','DIVERTED','UNKNOWN') DEFAULT 'UNKNOWN',
  distance_km DECIMAL(8,2),
  duration_minutes INT,
  notes VARCHAR(255),
  UNIQUE KEY uq_external (external_flight_id),
  KEY idx_dep_time (departure_airport_id, scheduled_departure_utc),
  KEY idx_arr_time (arrival_airport_id, scheduled_arrival_utc),
  CONSTRAINT fk_dep_airport FOREIGN KEY (departure_airport_id) REFERENCES airports(id),
  CONSTRAINT fk_arr_airport FOREIGN KEY (arrival_airport_id) REFERENCES airports(id)
) ENGINE=InnoDB;

-- Many-to-many: which team is on which flight (e.g. TEAM_CHARTER, confidence).
CREATE TABLE team_flights (
  team_id BIGINT UNSIGNED,
  flight_id BIGINT UNSIGNED,
  role ENUM('TEAM_CHARTER','SHARED_CHARTER','UNKNOWN') DEFAULT 'TEAM_CHARTER',
  confidence TINYINT UNSIGNED,
  PRIMARY KEY (team_id, flight_id),
  CONSTRAINT fk_tf_team FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
  CONSTRAINT fk_tf_flight FOREIGN KEY (flight_id) REFERENCES flights(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Historical position samples per flight (lat/lon, altitude_ft, ground_speed_kt).
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

-- External data source registry (e.g. API providers). Referenced by ingestion_events.
CREATE TABLE data_sources (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(60) UNIQUE
) ENGINE=InnoDB;

-- Audit log of ingested payloads (external_id, payload_json) per data source.
CREATE TABLE ingestion_events (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  data_source_id BIGINT UNSIGNED,
  external_id VARCHAR(128),
  payload_json JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ingest_source FOREIGN KEY (data_source_id) REFERENCES data_sources(id)
) ENGINE=InnoDB;
