#!/bin/bash

REMOTE_HOST="nfs_pointless_landing" # This value comes from ~/.ssh/config
REMOTE_DIR="/home/public"
LOCAL_DIR="."

echo "Uploading files to $REMOTE_HOST:$REMOTE_DIR"
rsync -avz --delete "$LOCAL_DIR" "$REMOTE_HOST:$REMOTE_DIR"

echo "Files uploaded successfully to $REMOTE_HOST:$REMOTE_DIR"