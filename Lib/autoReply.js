const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const {ytvdl,ytadl} = require('./Functions/Download_Functions/youtubedl');
const tiktokdl = require('./Functions/Download_Functions/tiktokdl');
const { updateDatabase } = require('./Database/mysql');


ffmpeg.setFfmpegPath(ffmpegPath);


// Main Function

async function handleAutoReply(m, sock ,msg ,number) {
    try {
        if(m.key.remoteJid.endsWith('@g.us')){
            number = m.key.participant.split('@')[0];
        }else{
            number = m.key.remoteJid.split('@')[0];
        }
        const table = "Downloads";
        
        // Youtube Audio

        if (msg.split(' ')[0] === "yta") {
            const link = msg.match(/\bhttps?:\/\/\S+/gi)[0];  // Extract the link
            const service = "Yt Audio";
            updateDatabase(link, service, number ,table);
            await sock.sendMessage(m.key.remoteJid, { react: { text: '⏳', key: m.key } });
            
            const { filePath, title } = await ytadl(link);
            console.log(filePath);
                
                await sock.sendMessage(
                    m.key.remoteJid,
                    {
                        audio: { url: filePath },
                        mimetype: 'audio/mpeg',
                        caption: title

                    },
                    { quoted: m }
                );                  
            
        }

        // Youtube Video

        else if (msg.includes("http") && msg.includes("youtu")) {
            const link = msg.match(/\bhttps?:\/\/\S+/gi)[0];  // Extract the link
            const service = "Youtube";
            updateDatabase(link, service, number ,table);
            console.log(msg);
            await sock.sendMessage(m.key.remoteJid, { react: { text: '⏳', key: m.key } });

            const { filePath, title } = await ytvdl(link);

            return await sock.sendMessage(
                m.key.remoteJid,
                {
                    video: { url: filePath },
                    mimetype: 'video/mp4',
                    caption: title
                },
                { quoted: m }
            );

        }

        // Tiktok Video

        if (msg.includes("http") && msg.includes("tiktok")) {
            const link = msg.match(/\bhttps?:\/\/\S+/gi)[0];  // Extract the link
            const service = "Tiktok";
            await sock.sendMessage(m.key.remoteJid, { react: { text: '⏳', key: m.key } });
            updateDatabase(link, service, number ,table);

            let resultUrl = await tiktokdl(link);

            await sock.sendMessage(
                m.key.remoteJid,
                {
                    video: { url: resultUrl },
                    mimetype: 'video/mp4'
                    
                },
                { quoted: m }
            );
        }


    } catch (error) {
        console.error("Error handling auto-reply:", error);
    }
}


module.exports = { handleAutoReply };
