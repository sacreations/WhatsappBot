const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const {ytvdl,ytadl} = require('./Functions/Download_Functions/youtubedl');
const tiktokdl = require('./Functions/Download_Functions/tiktokdl');
const { updateDatabase } = require('./Database/mysql');
const message = require('./messageHandler');


ffmpeg.setFfmpegPath(ffmpegPath);


// Main Function

async function handleAutoReply(m, sock ,msg ,number) {

    try {
        if(msg.startsWith(".")){
            return;
        }else{
            // Media Downloads

            if(m.key.remoteJid.endsWith('@g.us')){
                number = m.key.participant.split('@')[0];
            }else{
                number = m.key.remoteJid.split('@')[0];
            }
            
            // for mysql database
            const table = "Downloads";
            
            // Youtube Audio

            if (msg.split(' ')[0] === "yta") {
                const link = msg.match(/\bhttps?:\/\/\S+/gi)[0];  
                const service = "Yt Audio";
                updateDatabase(link, service, number ,table);
                message.react('⏳',m ,sock);
                const { filePath ,title} = await ytadl(link);
                message.reply(`Downloading..\n ${title} (Audio Only)` , m, sock);
                return message.sendAudio(filePath,m,sock);

                    
            }

            // Youtube Video

            else if (msg.includes("http") && msg.includes("youtu")) {
                const link = msg.match(/\bhttps?:\/\/\S+/gi)[0];  
                const service = "Youtube";
                updateDatabase(link, service, number ,table);
                console.log(msg);
                message.react('⏳',m ,sock);
                const { filePath, title } = await ytvdl(link);
                return message.sendVideo(filePath,title,m,sock);

            }

            // Tiktok Video

            if (msg.includes("http") && msg.includes("tiktok")) {
                const link = msg.match(/\bhttps?:\/\/\S+/gi)[0];  
                const service = "Tiktok";
                message.react('⏳',m ,sock);
                updateDatabase(link, service, number ,table);
                let resultUrl = await tiktokdl(link);
                return message.sendVideo(resultUrl,null,m,sock);

            }
        }

    } catch (error) {
        console.error("Error handling auto-reply:", error);
    }
}

module.exports = { handleAutoReply };


