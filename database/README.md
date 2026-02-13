# Flight Tracker Database

## Quick Setup

### Prerequisites
- MySQL 8.0 or higher
- MySQL client tools

### Setup Instructions

1. **Create database and run schema:**
```bash
   cd database
   chmod +x scripts/setup_database.sh
   ./scripts/setup_database.sh
```

2. **Or manual setup:**
```bash
   mysql -u root -p
   CREATE DATABASE flight_tracker;
   USE flight_tracker;
   SOURCE schema/01_create_tables.sql;
   SOURCE schema/02_create_indexes.sql;
   SOURCE schema/03_create_views.sql;
   SOURCE schema/04_create_procedures.sql;
   SOURCE seeds/01_seed_aircraft.sql;
   SOURCE seeds/02_seed_tracked_entities.sql;
   SOURCE seeds/03_seed_sample_flights.sql;
```

## Database Structure

### Core Tables
- `aircraft` - Aircraft information
- `tracked_entity` - Entities to track (celebrities, companies)
- `entity_aircraft` - Links entities to aircraft
- `flight` - Flight records
- `flight_position` - Real-time position data
- `user_tracking` - User tracking preferences
- `api_request_log` - API usage logs

### Views
- `active_flights_view` - All active flights with entity info
- `flight_history_view` - Historical flight data

### Stored Procedures
- `cleanup_old_positions()` - Remove old position data
- `cleanup_old_api_logs()` - Remove old API logs
- `get_flight_statistics()` - Flight statistics report

## Maintenance

Run cleanup procedures weekly:
```sql
CALL cleanup_old_positions();
CALL cleanup_old_api_logs();
```

## Backup & Restore

**Backup:**
```bash
./scripts/backup_database.sh
```

**Restore:**
```bash
./scripts/restore_database.sh backup_file.sql
```