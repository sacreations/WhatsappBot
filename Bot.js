const pino = require('pino');
const path = require('path');
const { makeWASocket, useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore ,Browsers } = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const { handleAutoReply } = require('./Lib/autoReply');
const config = require('./Config');
const { bot, handleMessage } = require('./Lib/commandHandler'); // Add this line
const fs = require('fs');



const startbot = async () => {
    try {
      
        const logger = pino({ level: 'silent' });
        await startWhatsAppBot(logger);

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
        isOnline = true;
        console.log('Connection opened!', '✅');
        socket.ev.on('creds.update', saveCreds);
        await socket.sendPresenceUpdate('unavailable');
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

        // await greetings(socket, update);
    });

    socket.ev.on('messages.upsert', async ({ messages }) => {
        try {
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
            if (config.auto_reply){
                await handleAutoReply(m, socket ,msg ,number);
            }
            
            await handleMessage(m, socket);

        } catch (error) {
            console.error('Error handling message upsert:', error);
        }
    });
};



module.exports = { startbot };
