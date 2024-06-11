// lib/bot.js
const config = require('../Config');
const commands = [];

const bot = (command, handler) => {
    commands.push({ command, handler });
};

const handleMessage = async (m, sock) => {
    const msg = (m.message?.conversation || m.message?.extendedTextMessage?.text || "").trim();
    for (const { command, handler } of commands) {
        const regex = new RegExp(`^${config.PREFIX}${command.pattern}`, 'i');
        const match_regex = msg.match(regex);
        const match = msg.split(" ").slice(1)[0];
        if (match_regex && (command.fromMe ? message.key.fromMe : true)) {
            await handler(m, sock, match);
            return;
        }
    }
};

module.exports = { bot, handleMessage };