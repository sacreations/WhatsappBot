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
        if(m.key.remoteJid.endsWith('@g.us')){
            number = m.key.participant.split('@')[0];
        }else{
            number = m.key.remoteJid.split('@')[0];
        }
        // for mysql database
        const table = "Downloads";
        
        // Youtube Audio

        if (msg.split(' ')[0] === "yta") {
            const link = msg.match(/\bhttps?:\/\/\S+/gi)[0];  // Extract the link
            const service = "Yt Audio";
            updateDatabase(link, service, number ,table);
            await sock.sendMessage(m.key.remoteJid, { react: { text: '⏳', key: m.key } });
            const { filePath } = await ytadl(link);
            message.sendAudio(filePath,m,sock);

                
        }

        // Youtube Video

        else if (msg.includes("http") && msg.includes("youtu")) {
            const link = msg.match(/\bhttps?:\/\/\S+/gi)[0];  // Extract the link
            const service = "Youtube";
            updateDatabase(link, service, number ,table);
            console.log(msg);
            await sock.sendMessage(m.key.remoteJid, { react: { text: '⏳', key: m.key } });
            const { filePath, title } = await ytvdl(link);
            message.sendVideo(filePath,title,m,sock);

        }

        // Tiktok Video

        if (msg.includes("http") && msg.includes("tiktok")) {
            const link = msg.match(/\bhttps?:\/\/\S+/gi)[0];  // Extract the link
            const service = "Tiktok";
            message.react('⏳',m ,sock);
            updateDatabase(link, service, number ,table);
            let resultUrl = await tiktokdl(link);
            let caption = ""
            message.sendVideo(resultUrl,caption,m,sock);

        }

    } catch (error) {
        console.error("Error handling auto-reply:", error);
    }
}

module.exports = { handleAutoReply };


