#!/bin/bash

# Navigate to the bot's directory


# Pull the latest changes from the repository
output=$(git pull)

# Check if the output contains "Already up to date."
if [[ $output == *"Already up to date."* ]]; then
    echo "No updates available."
else
    echo "Updates pulled, restarting bot..."
    # Restart the bot using pm2
    pm2 restart 0
fi