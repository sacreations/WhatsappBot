const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const {ytvdl,ytadl} = require('./Functions/Download_Functions/youtubedl');
const tiktokdl = require('./Functions/Download_Functions/tiktokdl');
const message = require('./messageHandler');


ffmpeg.setFfmpegPath(ffmpegPath);

allowed_groups = "@g.us";


// Main Function

async function handleAutoReply(m, sock ,msg ,number) {

    try {
        if(msg.startsWith(".")){
            return;
        }else{
            // Media Downloads

            if(m.key.remoteJid.includes(allowed_groups)){

                
                // Youtube Audio

                if (msg.split(' ')[0] === "yta") {
                    const link = msg.match(/\bhttps?:\/\/\S+/gi)[0];  
                    message.react('⏳',m ,sock);
                    const { filePath ,title} = await ytadl(link);
                    message.reply(`Downloading..\n ${title} (Audio Only)` , m, sock);
                    return message.sendAudio(filePath,m,sock);

                        
                }

                // Youtube Video

                else if (msg.includes("http") && msg.includes("youtu")) {
                    const link = msg.match(/\bhttps?:\/\/\S+/gi)[0];  
                    console.log(msg);
                    message.react('⏳',m ,sock);
                    const { filePath, title } = await ytvdl(link);
                    return message.sendVideo(filePath,title,m,sock);

                }

                // Tiktok Video

                if (msg.includes("http") && msg.includes("tiktok")) {
                    const link = msg.match(/\bhttps?:\/\/\S+/gi)[0];  
                    message.react('⏳',m ,sock);
                    let resultUrl = await tiktokdl(link);
                    return message.sendVideo(resultUrl,null,m,sock);

                }


            }
            
        }

    } catch (error) {
        console.error("Error handling auto-reply:", error);
    }
}

module.exports = { handleAutoReply };


