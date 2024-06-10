## HOW TO USE

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


       
