const { bot } = require('../Lib/commandHandler');
const message = require('../Lib/messageHandler');
const {ytvdl,ytadl} = require('../Lib/Functions/Download_Functions/youtubedl');

// Youtube Audio Download
bot({ 
    pattern: 'yta', 
    fromMe: false 
    }, 
    async (m, sock, match) => {
        if(match){
            console.log(match);
            const link = match.match(/\bhttps?:\/\/\S+/gi)[0];  // Extract the link
            await sock.sendMessage(m.key.remoteJid, { react: { text: '⏳', key: m.key } });
            const { filePath } = await ytadl(link);
            message.sendAudio(filePath,m,sock);
        }else{
            message.reply("Please Provide valid Youtube Link to Download", m, sock);
        }
        
    
});

// Youtube Video  Download
bot({ 
    pattern: 'video', 
    fromMe: false 
    }, 
    async (m, sock, match) => {
        if(match){
            console.log(match);
            const link = match.match(/\bhttps?:\/\/\S+/gi)[0];  // Extract the link
            await sock.sendMessage(m.key.remoteJid, { react: { text: '⏳', key: m.key } });
            const { filePath, title } = await ytvdl(link);
            message.sendVideo(filePath,title,m,sock);
        }else{
            message.reply("Please Provide valid Youtube Link to Download", m, sock);
        }
        
    
});
