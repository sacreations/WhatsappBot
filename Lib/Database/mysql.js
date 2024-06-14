const mysql = require('mysql');
const config = require('../../Config');


isupdatedtodatabase = config.db_update;

// MySQL Connection Pool
if(isupdatedtodatabase){
    const pool = mysql.createPool({
    connectionLimit: 10,
    host: config.db_host,
    user: config.db_user,
    password: config.db_password,
    database: config.db_database,
    port: config.db_port,
    charset: 'utf8mb4' // Set the character set to support emojis
});
}


// Functions

// Update Database 
function updateDatabase(url, sname, number ,table) {
    if (isupdatedtodatabase) {
            pool.getConnection((err, connection) => {
            if (err) {
                console.error("Error connecting to database:", err);
                return;
            }
            
            const sql = `INSERT INTO ${table}(service, link, number) VALUES (?, ?, ?)`;
            const values = [sname, url, number];
            
            connection.query(sql, values, (err, result) => {
                if (err) {
                    console.error("Error inserting into database:", err);
                } else {
                    console.log("Number of records inserted:", result.affectedRows);
                }
                connection.release(); 
            });
        });
    }
    
}

module.exports = { updateDatabase };