const { bot } = require('../Lib/commandHandler');
const message = require('../Lib/messageHandler');

// Example command definition
bot({ 
    pattern: 'ping', 
    fromMe: false 
    }, 
    async (m, sock, match) => {
    const start = new Date().getTime()
    const end = new Date().getTime()
    return await message.reply('*Pong!*\n ```' + (end - start) + '``` *ms*' , m, sock);
});
