#!/bin/sh
set -e

echo "Waiting for database..."
until nc -z "${POSTGRES_HOST}" "${POSTGRES_PORT}"; do
  sleep 1
done
echo "Database is ready."

echo "Running database migrations..."
node packages/db/dist/migrate.cjs

echo "Starting API..."
exec node packages/api/dist/index.cjs
