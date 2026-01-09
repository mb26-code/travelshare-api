#!/bin/bash

#stop execution if a command fails
set -e

#load environment variables from .env
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
else
    echo "Error: '.env' file not found."
    exit 1
fi

echo "Starting database reset for $DB_NAME..."

#check for schema file location
if [ -f "sql/schema.sql" ]; then
    SCHEMA_FILE="sql/schema.sql"
else
    echo "Error: 'schema.sql' file not found in 'sql/'."
    exit 1
fi

echo "	Applying schema from '$SCHEMA_FILE'"

#execute schema import
cat "$SCHEMA_FILE" | sudo docker exec -i travelshare-db mysql -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME"

echo "Database reset completed successfully."
