const ffmpeg = require('fluent-ffmpeg');
const {ytvdl,ytadl} = require('./Functions/Download_Functions/youtubedl');
const tiktokdl = require('./Functions/Download_Functions/tiktokdl');
const { updateDatabase } = require('./Database/mysql');
const message = require('./messageHandler');


allowed_groups = "@g.us";

allowed_groups2 = "@g.us";


async function mentionAllParticipants(m, sock) {
    try {
        const groupMetadata = await sock.groupMetadata(m.key.remoteJid);
        console.log("Group Metadata:", groupMetadata);

        const participants = groupMetadata.participants.map(participant => {
            console.log("Participant:", participant);
            if (participant.id && participant.id._serialized) {
                return participant.id._serialized;
            } else {
                throw new Error(`Invalid participant data: ${JSON.stringify(participant)}`);
            }
        });

        const mentionsText = participants.map(participant => `@${participant.split('@')[0]}`).join(' ');

        return { mentionsText, participants };
    } catch (error) {
        console.error("Error fetching group participants:", error);
        return null;
    }
}



// Main Function

async function handleAutoReply(m, sock ,msg ,number) {

    try {
        if(msg.startsWith(".")){
            return;
        }else{
            // Media Downloads

            if(m.key.remoteJid.includes(allowed_groups)){

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

            if(m.key.remoteJid.includes(allowed_groups2)){
                if (msg === "@everyone") {
                    const mentions = await mentionAllParticipants(m, sock);
                    if (mentions) {
                        await sock.sendMessage(m.key.remoteJid, { text: mentions.mentionsText, mentions: mentions.participants });
                    } else {
                        // 
                    }
                }
            }
            
        }

    } catch (error) {
        console.error("Error handling auto-reply:", error);
    }
}

module.exports = { handleAutoReply };


