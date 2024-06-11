const message = {
    react: async (text, m, socket) => {
        try {
            return await socket.sendMessage(m.key.remoteJid, { react: { text: `${text}`, key: m.key } });
        } catch (error) {
            console.error("An error occurred:", error);
            
        }
    },

    sendMessage: async (content, m, socket, number = null) => {
        try {
            if (m) {
                return await socket.sendMessage(
                    m.key.remoteJid,
                    content,
                    { quoted: m }
                );
            }
        } catch (error) {
            console.error("An error occurred:", error);
            
        }
    },

    sendVideo: async (link, caption, m, socket) => {
        try {
            return await socket.sendMessage(
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

    sendAudio: async (link,m, socket) => {
        try {
            return await socket.sendMessage(
                m.key.remoteJid,
                {
                    video: { url: link },
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
