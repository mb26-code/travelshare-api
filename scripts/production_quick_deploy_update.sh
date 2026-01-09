#!/bin/bash

echo "Deploying API in production..."

set -e
#stop script execution if a command fails

echo "  Pulling latest API source code from remote repository..."
git pull

echo "  Installing dependencies..."
npm install

echo "  Ensuring that the database is running..."
docker compose up -d
#does nothing if it's already running
#starts the DB if it's down (container not started) using the "docker-compose.yaml" configuration

echo "  Restarting Node server application..."
pm2 restart travelshare-api

echo "  Saving PM2 process list..."
pm2 save

echo "Deployment finished successfully."

echo "Here are some logs:"
pm2 logs travelshare-api --lines 20

