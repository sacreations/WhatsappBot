#!/bin/bash

# Pull the latest changes from the repository
output=$(git pull)

# Check if the output contains "Already up to date."
if [[ $output == *"Already up to date."* ]]; then
    echo "No updates available."
else
    echo "Updates pulled, restarting bot..."
    sleep 3
    # Restart the bot using pm2
    pm2 restart Bot
fi