const { bot } = require('../Lib/commandHandler');
const message = require('../Lib/messageHandler');


bot({ 
    pattern: 'groupid', 
    fromMe: false 
    }, 
    async (m, sock, match) => {
        if(m.key.remoteJid.endsWith('@g.us')){
            let group_id = m.key.remoteJid;
            return await message.reply(`Group ID: ${group_id}`, m, sock);
        }else{
            return await message.reply(`This is not a group`, m, sock);
        }
        
});

bot({ 
    pattern: 'mynumber', 
    fromMe: false 
    }, 
    async (m, sock, match) => {
        let number;
        if(m.key.remoteJid.endsWith('@g.us')){
            number = m.key.participant.split('@')[0];
        }else{
            number = m.key.remoteJid.split('@')[0];
        }
        return await message.reply(`Your Number: ${number}`, m, sock);
        
});


