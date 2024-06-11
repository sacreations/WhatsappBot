// lib/bot.js
const config = require('../Config');
const commands = [];

const bot = (command, handler) => {
    commands.push({ command, handler });
};

const handleMessage = async (message, sock) => {
    const msg = (message.message?.conversation || message.message?.extendedTextMessage?.text || "").trim();
    for (const { command, handler } of commands) {
        const regex = new RegExp(`^${config.PREFIX}${command.pattern}`, 'i');
        const match = msg.match(regex);
        if (match && (command.fromMe ? message.key.fromMe : true)) {
            await handler(message, sock); // Pass `sock` to the command handler
            return;
        }
    }
};

module.exports = { bot, handleMessage };