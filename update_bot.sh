#!/bin/bash

# Ensure the script is run on a system with the apt package manager
if ! [ -x "$(command -v apt)" ]; then
    echo -e "\e[31mThis script is intended for use on Linux systems with the apt package manager.\e[0m"
    exit 1
fi

echo -e "\e[36mStarting the update process for the dev_test branch...\e[0m"


# Pull the latest changes from the dev_test branch
output=$(git pull origin dev_test 2>&1)

# Check if the output contains "Already up to date."
if [[ $output == *"Current branch dev_test is up to date."* ]]; then
    message="No updates available."
else
    echo "Updates pulled from dev_test branch, restarting bot..."
    message="updating."
    pm2 restart Bot
fi
