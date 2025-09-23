#!/bin/bash

LOCAL_DIR="build/"
REMOTE_HOST="nfs_seis" # This value comes from ~/.ssh/config
REMOTE_DIR="/home/public"

rsync -avz --delete "$LOCAL_DIR" "$REMOTE_HOST:$REMOTE_DIR"
echo "Files uploaded successfully to $REMOTE_HOST:$REMOTE_DIR"