require('dotenv').config({ path: './config.env' });

const config = {
    apiKey: process.env.API_KEY,
    api_Url: process.env.API_URL,
    db_host: process.env.DB_HOST,
    db_user: process.env.DB_USER ,
    db_password: process.env.DB_PASSWORD, 
    db_database: process.env.DB_DATABASE,
    db_port: process.env.DB_PORT,
    db_update:process.env.DB_UPDATE,
    bot_number:process.env.BOT_NUMBER
};

module.exports = config;