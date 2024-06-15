#!/bin/bash

# Ensure the script is run on a system with the apt package manager
if ! [ -x "$(command -v apt)" ]; then
    echo -e "\e[31mThis script is intended for use on Linux systems with the apt package manager.\e[0m"
    exit 1
fi

echo -e "\e[36mStarting the update process for the dev_test branch...\e[0m"


# Ensure we are on the dev_test branch
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
