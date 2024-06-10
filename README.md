<img src = "https://i.pinimg.com/originals/72/e9/c3/72e9c33f3327bfb2485c80b3188e41fb.gif">

# Simple WhatsApp Bot with Baileys

Welcome to the Simple WhatsApp Bot project! This bot leverages the Baileys library to interact with WhatsApp Web, offering basic automation and messaging capabilities. 
<br>
<br>

**Please note that this project is still under development and not yet finished.**

## Features

- Connect to WhatsApp Web using Baileys
- Send and receive messages
- Basic command handling


## Installation

To get started with the Simple WhatsApp Bot, follow these steps:

- Install git, ffmpeg, and curl:

      sudo apt -y update && sudo apt -y upgrade
      sudo apt -y install git ffmpeg curl

- Install nodejs:

      sudo apt -y remove nodejs
      curl -fsSl https://deb.nodesource.com/setup_lts.x | sudo bash - && sudo apt -y install nodejs


- Install pm2:

      npm install -g pm2

- Clone the repository and install packages:

      git clone https://github.com/sacreations/WhatsappBot WhatsappBot
      cd WhatsappBot
      npm i

- Rename config.env.example to config.env
  
- Edit the `config.env` using nano or any text editor

       nano config.env

- Start the bot:

      npm start

- Stop and Restart:

  You can stop and restart using pm2 commands (replace 0 with your pm2 process id)

  For Stop -

      pm2 stop 0

  For Restart -
  
      pm2 restart 0


       
