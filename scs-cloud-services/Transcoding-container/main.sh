#!/bin/bash

export VIDEO_KEY="$VIDEO_KEY"
export MY_ACCESS_KEY_ID="$MY_ACCESS_KEY_ID"
export MY_SECRET_ACCESS_KEY="$MY_SECRET_ACCESS_KEY"
export MY_BUCKET_NAME="$MY_BUCKET_NAME"
export USER_ACCESS_KEY_ID="$USER_ACCESS_KEY_ID"
export USER_SECRET_ACCESS_KEY="$USER_SECRET_ACCESS_KEY"
export USER_BUCKET_NAME="$USER_BUCKET_NAME"
export QUEUE_HOST="$QUEUE_HOST"
export QUEUE_USER="$QUEUE_USER"
export QUEUE_PASSWORD="$QUEUE_PASSWORD"
export USER_EMAIL="$USER_EMAIL"



exec node download.js




