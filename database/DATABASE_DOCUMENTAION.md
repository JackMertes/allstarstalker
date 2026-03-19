# NBA Team Flight Tracker — Database Documentation

## Overview
The NBA Team Flight Tracker database is designed to track NBA team charter flights, including scheduling, live flight data, airport information, and data ingestion from external sources.

This system supports:
- Tracking team travel via charter flights
- Monitoring live flight positions
- Storing historical flight data
- Integrating external aviation data sources

## Database Schema Summary

The database consists of the following components:

- Core Entities: teams, airports, flights
- Relationship Mapping: team_flights
- Tracking Data: flight_positions
- Data Ingestion: data_sources, ingestion_events
- Views: v_flight_details, v_team_flight_list
- Stored Procedures: sp_get_team_flights, sp_get_flight_details

## Tables

### teams
Stores NBA team information.

Columns:
- id (BIGINT, Primary Key): Unique team ID
- nba_team_id (VARCHAR): External NBA ID
- name (VARCHAR): Full team name
- abbreviation (VARCHAR): Team code (e.g., MIL)
- city (VARCHAR): Home city
- conference (ENUM): East or West
- division (VARCHAR): Division name
- callsign (VARCHAR): Charter aircraft callsign

Constraints:
- Unique: abbreviation, name, callsign

### airports
Stores airport reference data.

Columns:
- id (BIGINT, Primary Key): Unique airport ID
- iata_code (CHAR(3)): Airport code (e.g., LAX)
- icao_code (CHAR(4)): ICAO code
- name (VARCHAR): Airport name
- city (VARCHAR): City
- country (VARCHAR): Country

Constraints:
- Unique: iata_code

### flights
Stores flight schedules, status, and live tracking data.

Columns:
- id (BIGINT, Primary Key): Unique flight ID
- external_flight_id (VARCHAR): External provider ID
- tail_number (VARCHAR): Aircraft registration
- callsign (VARCHAR): Flight callsign
- departure_airport_id (FK): Departure airport
- arrival_airport_id (FK): Arrival airport
- scheduled_departure_utc (DATETIME): Scheduled departure
- scheduled_arrival_utc (DATETIME): Scheduled arrival
- actual_departure_utc (DATETIME): Actual departure
- actual_arrival_utc (DATETIME): Actual arrival
- status (ENUM): Flight status
- live_latitude (DECIMAL): Current latitude
- live_longitude (DECIMAL): Current longitude

Constraints:
- Foreign keys to airports
- Unique: external_flight_id, callsign

### team_flights
Maps teams to flights (many-to-many relationship).

Columns:
- team_id (FK): Team reference
- flight_id (FK): Flight reference
- role (ENUM): Charter type
- confidence (TINYINT): Match confidence

Primary Key:
- (team_id, flight_id)

### flight_positions
Stores historical flight tracking points.

Columns:
- id (BIGINT, Primary Key): Unique record ID
- flight_id (FK): Flight reference
- position_utc (DATETIME): Timestamp
- latitude (DECIMAL): Latitude
- longitude (DECIMAL): Longitude
- altitude_ft (INT): Altitude

Relationship:
- One flight can have many position records

### data_sources
Stores external data providers.

Columns:
- id (BIGINT, Primary Key): Source ID
- name (VARCHAR): Provider name

### ingestion_events
Stores raw ingestion logs from data sources.

Columns:
- id (BIGINT, Primary Key): Event ID
- data_source_id (FK): Source reference
- external_id (VARCHAR): External event ID
- payload_json (JSON): Raw data payload
- created_at (TIMESTAMP): Timestamp

## Relationships

- A team can be linked to many flights via team_flights
- A flight can be associated with multiple teams
- A flight has one departure airport and one arrival airport
- A flight has many position records
- A data source can generate many ingestion events

## Views

### v_flight_details
Combines flight data with airport information.

Includes:
- Airport codes and cities
- Scheduled and actual times
- Live tracking data
- Calculated durations

### v_team_flight_list
Combines team information, flight mappings, and detailed flight data.

## Stored Procedures

### sp_get_team_flights
Parameters:
- p_team_abbrev: Team code
- p_start_utc: Optional start date
- p_end_utc: Optional end date

Description:
Returns flights for a team within a date range.

### sp_get_flight_details
Parameters:
- p_flight_id

Description:
Returns detailed information for a specific flight.

## Business Rules and Assumptions

- Each team has a unique abbreviation and name
- Callsigns are unique per team
- Flights may not always have live tracking data
- Team-flight relationships include a confidence score
- Airports are uniquely identified by IATA code
- Flight status is limited to predefined ENUM values

## Example Queries

Get flights for a team:
CALL sp_get_team_flights('MIL', NULL, NULL);

Get flight details:
CALL sp_get_flight_details(1);

View all flights:
SELECT * FROM v_flight_details;

View team flight list:
SELECT * FROM v_team_flight_list;

## Seed Data

The database includes:
- NBA teams
- Sample airports (MKE, SFO, LAX)
- A demo flight
- A mapped Milwaukee Bucks flight

## Notes

- The schema is idempotent and safe to rerun
- Uses InnoDB for referential integrity
- Designed for extensibility

## Conclusion

This database provides a structured and scalable approach to tracking NBA team travel, combining static reference data with dynamic flight tracking and ingestion pipelines.
