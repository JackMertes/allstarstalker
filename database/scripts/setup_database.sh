#!/bin/bash

# Database configuration
DB_NAME="flight_tracker"
DB_USER="root"
DB_PASS=""

echo "Setting up Flight Tracker Database..."

# Create database
mysql -u $DB_USER -p$DB_PASS -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"

# Run schema files
echo "Creating tables..."
mysql -u $DB_USER -p$DB_PASS $DB_NAME < schema/01_create_tables.sql

echo "Creating indexes..."
mysql -u $DB_USER -p$DB_PASS $DB_NAME < schema/02_create_indexes.sql

echo "Creating views..."
mysql -u $DB_USER -p$DB_PASS $DB_NAME < schema/03_create_views.sql

echo "Creating procedures..."
mysql -u $DB_USER -p$DB_PASS $DB_NAME < schema/04_create_procedures.sql

# Run seed files
echo "Seeding data..."
mysql -u $DB_USER -p$DB_PASS $DB_NAME < seeds/01_seed_aircraft.sql
mysql -u $DB_USER -p$DB_PASS $DB_NAME < seeds/02_seed_tracked_entities.sql
mysql -u $DB_USER -p$DB_PASS $DB_NAME < seeds/03_seed_sample_flights.sql

echo "Database setup complete!"