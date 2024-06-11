// commands/ping.js
const { bot } = require('../Lib/commandHandler');

// Example command definition
bot({ 
    pattern: 'ping', 
    fromMe: false 

    }, 
    async (message, sock) => {
    console.log("test");
    const response = 'Hello there!';
    // Send the response back to the sender
    await sock.sendMessage(message.key.remoteJid, { react: { text: '⏳', key: message.key } });
});
