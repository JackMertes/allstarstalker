#!/bin/bash

DB_NAME="flight_tracker"
DB_USER="root"
DB_PASS=""

echo "WARNING: This will delete all data in $DB_NAME database!"
read -p "Are you sure? (yes/no): " confirm

if [ "$confirm" = "yes" ]; then
    mysql -u $DB_USER -p$DB_PASS -e "DROP DATABASE IF EXISTS $DB_NAME;"
    ./setup_database.sh
    echo "Database reset complete!"
else
    echo "Operation cancelled."
fi