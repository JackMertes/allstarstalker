-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS api_request_log;
DROP TABLE IF EXISTS user_tracking;
DROP TABLE IF EXISTS flight_position;
DROP TABLE IF EXISTS flight;
DROP TABLE IF EXISTS entity_aircraft;
DROP TABLE IF EXISTS tracked_entity;
DROP TABLE IF EXISTS aircraft;

-- Create tables
CREATE TABLE aircraft (
    aircraft_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tail_number VARCHAR(20) UNIQUE NOT NULL,
    aircraft_type VARCHAR(100),
    manufacturer VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE tracked_entity (
    entity_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    entity_type ENUM('CELEBRITY', 'COMPANY', 'GOVERNMENT', 'OTHER') NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE entity_aircraft (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    entity_id BIGINT NOT NULL,
    aircraft_id BIGINT NOT NULL,
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (entity_id) REFERENCES tracked_entity(entity_id) ON DELETE CASCADE,
    FOREIGN KEY (aircraft_id) REFERENCES aircraft(aircraft_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE flight (
    flight_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    flight_number VARCHAR(20),
    aircraft_id BIGINT,
    origin_airport VARCHAR(10),
    destination_airport VARCHAR(10),
    departure_time DATETIME,
    arrival_time DATETIME,
    estimated_arrival_time DATETIME,
    flight_status ENUM('SCHEDULED', 'ACTIVE', 'LANDED', 'CANCELLED', 'DELAYED') NOT NULL,
    external_flight_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (aircraft_id) REFERENCES aircraft(aircraft_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE flight_position (
    position_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    flight_id BIGINT NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    altitude INT,
    ground_speed INT,
    heading INT,
    timestamp DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (flight_id) REFERENCES flight(flight_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE user_tracking (
    tracking_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_identifier VARCHAR(255) NOT NULL,
    entity_id BIGINT,
    aircraft_id BIGINT,
    flight_number VARCHAR(20),
    notification_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (entity_id) REFERENCES tracked_entity(entity_id) ON DELETE CASCADE,
    FOREIGN KEY (aircraft_id) REFERENCES aircraft(aircraft_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE api_request_log (
    log_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    api_name VARCHAR(50) NOT NULL,
    endpoint VARCHAR(255),
    request_params TEXT,
    response_status INT,
    request_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    response_time_ms INT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;