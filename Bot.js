const pino = require('pino');
const path = require('path');
const { makeWASocket, useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore ,Browsers } = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const { handleAutoReply } = require('./Lib/autoReply');
const config = require('./Config');
const { bot, handleMessage } = require('./Lib/commandHandler'); // Add this line
const fs = require('fs');
const { exec } = require('child_process'); // Ensure exec is imported
let lastActivityTime = Date.now();
const maxInactivityTime = 3600000; // 1 hour in milliseconds


// check last activity time
const updateLastActivityTime = () => {
    lastActivityTime = Date.now();
};

const cleanDownloadFolder = (folderPath, maxAgeInMillis) => {
    const files = fs.readdirSync(folderPath);

    files.forEach(file => {
        const filePath = path.join(folderPath, file);
        const stats = fs.statSync(filePath);
        const now = Date.now();

        if (now - stats.mtimeMs > maxAgeInMillis) {
            fs.unlinkSync(filePath);
            console.log(`Deleted old file: ${filePath}`);
        }
    });
};

// Function to check for inactivity and clean the download folder
const checkInactivity = () => {
    const downloadFolderPath = path.join(__dirname, '../../downloads');
    const maxFileAge = 360000; // 10 minutes in milliseconds

    setInterval(() => {
        if (Date.now() - lastActivityTime > maxInactivityTime) {
            console.log('Bot has been inactive for 1 hour, cleaning download folder...');
            cleanDownloadFolder(downloadFolderPath, maxFileAge);
            lastActivityTime = Date.now(); // Reset activity time 
        }
    }, 60000); // Check every minute
};

// Function to update the bot 
const updateBot = () => {
    setInterval(() => {
        console.log('Checking for bot updates...');
        exec('./update_bot.sh', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error updating bot: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`Git pull stderr: ${stderr}`);
                return;
            }
            console.log(`${stdout}`);
        });
    }, 60000); 
};


const startbot = async () => {
    try {
      
        const logger = pino({ level: 'silent' });
        await startWhatsAppBot(logger); // Start the WhatsAppBot
        checkInactivity(); // Start the inactivity check
        updateBot(); // Start the bot update check function

    } catch (error) {
        console.error('Error starting WhatsApp bot:', error);
    }
};

const startWhatsAppBot = async (logger) => {
    const sessionDir = path.join(__dirname, './Session');
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

    console.log('Trying to connect Using session directory ✨');

    const sockConfig = {
        printQRInTerminal: true,
        markOnlineOnConnect:false, 
        version: [2, 3000, 1014080102],
        logger,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, logger),
        },
    };

    try {
        const socket = makeWASocket(sockConfig);

        socket.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update;
            if (qr) {
                console.log('QR code received, scan to log in ', qr);
            }
            handleConnectionUpdate(socket, connection, lastDisconnect, logger, saveCreds);
        });

        await handleAllEvents(socket);

        socket.ev.on('creds.update', async () => {
            console.log('Credentials updated, saving... ');
            await saveCreds();
            console.log('Credentials saved ✅');
        });

    } catch (error) {
        console.error('Error starting WhatsApp bot:', error.message);
    }
};

const handleConnectionUpdate = async (socket, connection, lastDisconnect, logger, saveCreds) => {
    if (connection === "open") {
        console.log('Connection opened!', '✅');
        socket.ev.on('creds.update', saveCreds);
        await socket.sendPresenceUpdate('unavailable');
        if(config.start_message){
            const recipient = `${config.bot_number}@s.whatsapp.net`;
            const message = 'Bot has started successfully!';
            await socket.sendMessage(recipient, { text: message });
        }
    } else {
        const code = lastDisconnect?.error?.output?.statusCode;
        if (connection === "close" || code) {
            handleDisconnection( socket, lastDisconnect, logger, saveCreds);
        }
    }
};

const handleDisconnection = async (socket, lastDisconnect, logger, saveCreds) => {
    const reason = lastDisconnect?.error ? new Boom(lastDisconnect.error).output.statusCode : 500;
    switch (reason) {
        case DisconnectReason.connectionClosed:
        case DisconnectReason.connectionLost:
        case DisconnectReason.restartRequired:
        case DisconnectReason.timedOut:
        default:
            await restartBot(logger, saveCreds);
            break;
    }
};

const restartBot = async (logger, saveCreds) => {
    await startWhatsAppBot(logger);
};

const handleAllEvents = async (socket) => {

    const commandFiles = fs.readdirSync(path.join(__dirname, 'plugins')).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        require(`./plugins/${file}`);
    }

    socket.ev.on('group-participants.update', async (update) => {
        updateLastActivityTime();

        // await greetings(socket, update);
    });

    socket.ev.on('messages.upsert', async ({ messages }) => {
        try {
            updateLastActivityTime();
            const m = messages[0];
            const msg = (m.message?.conversation || m.message?.extendedTextMessage?.text || "").trim();
            let number;
            if(m.key.remoteJid.endsWith('@g.us')){
                number = m.key.participant.split('@')[0];
            }else{
                number = m.key.remoteJid.split('@')[0];
            }

            // console log number and text message
            if(number !== config.bot_number && msg){
                console.log(`Number - ${number} |||| message - ${msg}`);
            }


            await handleMessage(m, socket);
  

 
            if (config.auto_reply) {
                await handleAutoReply(m, socket, msg, number);
            }


            

        } catch (error) {
            console.error('Error handling message upsert:', error);
        }
    });
};

// test


module.exports = { startbot };
