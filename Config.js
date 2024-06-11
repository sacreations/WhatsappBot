require('dotenv').config({ path: './config.env' });

const config = {

    // Bot Info
    bot_number:process.env.BOT_NUMBER,
    bot_name:process.env.BOT_NAME,
    bot_owner:process.env.BOT_OWNER,

    // Options
    db_update:process.env.DB_UPDATE,
    auto_reply:process.env.AUTO_REPLY,
    start_message:process.env.DISABLE_START_MESSAGE,


    // Databases

    // MYSQL
    db_host: process.env.DB_HOST,
    db_user: process.env.DB_USER ,
    db_password: process.env.DB_PASSWORD, 
    db_database: process.env.DB_DATABASE,
    db_port: process.env.DB_PORT,

    // API 
    apiKey: process.env.API_KEY,
    api_Url: process.env.API_URL,
};

module.exports = config;