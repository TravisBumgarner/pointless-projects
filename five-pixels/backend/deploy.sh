#!/bin/bash

# Load environment variables from .env file
if [ -f ../.env.nfs ]; then
    export $(cat ../.env.nfs | grep -v '#' | xargs)
else
    echo "Error: .env.nfs file not found"
    exit 1
fi

# Define variables
SERVER_USER="${DEPLOY_SERVER_USER}"
SERVER_HOST="${DEPLOY_SERVER_HOST}"
BACKEND_DIR="/home/protected/backend"
NODE_VERSION="18"

# Create remote directory if it doesn't exist
echo "Creating remote directory $BACKEND_DIR if it doesn't exist"
ssh $SERVER_USER@$SERVER_HOST "mkdir -p $BACKEND_DIR"

# Build the Next.js app locally
echo "Building the Express app..."
yarn run build

# Create or update .nvmrc file on server
echo "Setting up Node.js environment..."
ssh $SERVER_USER@$SERVER_HOST "echo $NODE_VERSION > $BACKEND_DIR/.nvmrc"

# Delete existing private directory on server
echo "Cleaning up existing deployment..."
ssh $SERVER_USER@$SERVER_HOST "rm -rf $BACKEND_DIR/*"

# Throw error if .env.production file doesn't exist
if [ ! -f .env.production ]; then
    echo "Error: .env.production file not found"
    exit 1
fi

# Upload the build files
echo "Uploading build to the server..."
scp -r .env.production run.sh build package.json yarn.lock $SERVER_USER@$SERVER_HOST:$BACKEND_DIR

# # Setup and start the application
echo "Setting up the application..."
ssh $SERVER_USER@$SERVER_HOST "cd $BACKEND_DIR && yarn install --production && chmod +x run.sh"

echo "Deployment complete!"