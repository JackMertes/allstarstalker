-- Indexes for aircraft table
CREATE INDEX idx_tail_number ON aircraft(tail_number);

-- Indexes for tracked_entity table
CREATE INDEX idx_entity_name ON tracked_entity(name);
CREATE INDEX idx_entity_type ON tracked_entity(entity_type);

-- Indexes for entity_aircraft table
CREATE INDEX idx_entity ON entity_aircraft(entity_id);
CREATE INDEX idx_aircraft ON entity_aircraft(aircraft_id);
CREATE INDEX idx_active ON entity_aircraft(is_active);

-- Indexes for flight table
CREATE INDEX idx_flight_number ON flight(flight_number);
CREATE INDEX idx_external_id ON flight(external_flight_id);
CREATE INDEX idx_status ON flight(flight_status);
CREATE INDEX idx_departure_time ON flight(departure_time);
CREATE INDEX idx_aircraft_flight ON flight(aircraft_id);
CREATE INDEX idx_origin_airport ON flight(origin_airport);
CREATE INDEX idx_destination_airport ON flight(destination_airport);

-- Indexes for flight_position table
CREATE INDEX idx_flight_timestamp ON flight_position(flight_id, timestamp);
CREATE INDEX idx_timestamp ON flight_position(timestamp);

-- Indexes for user_tracking table
CREATE INDEX idx_user ON user_tracking(user_identifier);
CREATE INDEX idx_entity_tracking ON user_tracking(entity_id);
CREATE INDEX idx_aircraft_tracking ON user_tracking(aircraft_id);

-- Indexes for api_request_log table
CREATE INDEX idx_api_timestamp ON api_request_log(api_name, request_timestamp);
CREATE INDEX idx_request_timestamp ON api_request_log(request_timestamp);