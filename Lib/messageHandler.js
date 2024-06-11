const message = {
    react: async (text, m, sock) => {
        try {
            return await sock.sendMessage(m.key.remoteJid, { react: { text: `${text}`, key: m.key } });
        } catch (error) {
            console.error("An error occurred:", error);
            
        }
    },
    reply: async (text, m, sock) => {
        try {
            return await sock.sendMessage(m.key.remoteJid, { text: `${text}`},{ quoted: m });
        } catch (error) {
            console.error("An error occurred:", error);
            
        }
    },

    sendMessage: async (text, sock, number = null, m = null ) => {
        try {
            if (m) {
                return await sock.sendMessage(m.key.remoteJid, { text: text });
            } else if (number) {
                return await sock.sendMessage(number, { text: text });
            } else {
                throw new Error("No recipient information provided.");
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    },


    sendVideo: async (link, caption = null, m, sock) => {
        try {
            return await sock.sendMessage(
                m.key.remoteJid,
                {
                    video: { url: link },
                    mimetype: 'video/mp4',
                    caption: caption
                },
                { quoted: m }
            );
        } catch (error) {
            console.error("An error occurred:", error);
            
        }
    },

    sendAudio: async (link,m,sock) => {
        try {
            return await sock.sendMessage(
                m.key.remoteJid,
                {
                    audio: { url: link },
                    mimetype: 'audio/mpeg'
                },
                { quoted: m }
            );
        } catch (error) {
            console.error("An error occurred:", error);
            
        }
    }
};

module.exports = message;
