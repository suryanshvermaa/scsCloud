#!/bin/bash

export GIT_URL="$GIT_URL"
export MY_BUCKET_NAME="$MY_BUCKET_NAME"
export MY_ACCESS_KEY_ID="$MY_ACCESS_KEY_ID"
export MY_SECRET_ACCESS_KEY="$MY_SECRET_ACCESS_KEY"
export WEB_URL="$WEB_URL"


git clone "$GIT_URL" /home/app/output

exec node index.js