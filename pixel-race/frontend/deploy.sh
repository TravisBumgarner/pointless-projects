#!/bin/bash

# Load environment variables from .env file
if [ -f ../.env.nfs ]; then
    export $(cat ../.env.nfs | grep -v '#' | xargs)
else
    echo "Error: .env.nfs file not found"
    exit 1
fi


LOCAL_DIR="build/"
SERVER_USER="${DEPLOY_SERVER_USER}"
SERVER_HOST="${DEPLOY_SERVER_HOST}"

REMOTE_DIR="/home/protected/frontend"

# Create remote directory if it doesn't exist
echo "Creating remote directory $REMOTE_DIR if it doesn't exist"
ssh $SERVER_USER@$SERVER_HOST "mkdir -p $REMOTE_DIR"

echo "Cleaning up remote directory $REMOTE_DIR"
ssh $SERVER_USER@$SERVER_HOST "rm -rf $REMOTE_DIR/*"

echo "Uploading files to $SERVER_HOST:$REMOTE_DIR"

rsync -avz --delete "$LOCAL_DIR" "$SERVER_USER@$SERVER_HOST:$REMOTE_DIR/build"
rsync -avz "run.sh" "$SERVER_USER@$SERVER_HOST:$REMOTE_DIR/run.sh"
rsync -avz "package.json" "$SERVER_USER@$SERVER_HOST:$REMOTE_DIR/package.json"
rsync -avz "yarn.lock" "$SERVER_USER@$SERVER_HOST:$REMOTE_DIR/yarn.lock"

echo "Files uploaded successfully to $SERVER_HOST:$REMOTE_DIR"

ssh $SERVER_USER@$SERVER_HOST "cd $REMOTE_DIR && yarn install --production && chmod +x run.sh"

echo "Deployment completed successfully"