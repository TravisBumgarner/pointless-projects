#!/bin/bash

# Load environment variables from .env file
if [ -f .env.nfs ]; then
    export $(cat .env.nfs | grep -v '#' | xargs)
else
    echo "Error: .env.nfs file not found"
    exit 1
fi

# Define variables
SERVER_USER="${DEPLOY_SERVER_USER}"
SERVER_HOST="${DEPLOY_SERVER_HOST}"
REMOTE_DIR="/home/protected"
NODE_VERSION="18"

# Create remote directory if it doesn't exist
echo "Creating remote directory $REMOTE_DIR if it doesn't exist"
ssh $SERVER_USER@$SERVER_HOST "mkdir -p $REMOTE_DIR"

# Create or update .nvmrc file on server
echo "Setting up Node.js environment..."
ssh $SERVER_USER@$SERVER_HOST "echo $NODE_VERSION > $REMOTE_DIR/.nvmrc"

# Delete existing private directory on server
echo "Cleaning up existing deployment..."
ssh $SERVER_USER@$SERVER_HOST "rm -rf $REMOTE_DIR/*"

# Upload the build files
echo "Uploading build to the server..."
scp -r run.sh index.js package.json yarn.lock $SERVER_USER@$SERVER_HOST:$REMOTE_DIR

# # Setup and start the application
echo "Setting up the application..."
ssh $SERVER_USER@$SERVER_HOST "cd $REMOTE_DIR && yarn install --production && chmod +x run.sh"

echo "Deployment complete!"