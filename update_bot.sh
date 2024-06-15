#!/bin/bash

# Switch to the dev_test branch
git checkout dev_test

# Pull the latest changes from the dev_test branch
output=$(git pull origin dev_test)

# Check if the output contains "Already up to date."
if [[ $output == *"Already up to date."* ]]; then
    echo "No updates available."
else
    echo "Updates pulled from dev_test branch, restarting bot..."
    sleep 3
    # Restart the bot using pm2
    pm2 restart Bot
fi
