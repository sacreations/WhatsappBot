require('dotenv').config({ path: './config.env' });

const config = {

    // Bot Info
    bot_number:process.env.BOT_NUMBER || "",
    bot_name:process.env.BOT_NAME || "WhatsappBot",
    bot_owner:process.env.BOT_OWNER || "SA_Creations",

    // Options
    
    auto_reply:process.env.AUTO_REPLY || false,
    disable_start_message:process.env.DISABLE_START_MESSAGE || false,
    PREFIX:process.env.PREFIX || ".",


    // Databases


    // API 
    apiKey: process.env.API_KEY,
    api_Url: process.env.API_URL || "https://api.sacreations.me",
};

module.exports = config;