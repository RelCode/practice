const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

const db = mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'password',
    database: process.env.DB_NAME || 'node_db'
});

db.connect((err) => {
    if (err){
        console.log("Error connecting to database: ", err.message);
        throw new Error(err);
    }
})

const createDB = (cb) => {
    const sql = fs.readFileSync(path.join(__dirname, './database/createDB.sql'), 'utf-8');
    const multipleQueries = sql.split(';').filter(q => q.trim().length);
    try {
        multipleQueries.forEach(query => {
            db.query(query, (err, result) => {
                if (err){
                    console.log("Error creating database: ", err.message);
                    throw new Error(err);
                }
            });
        });
        cb && cb();
    } catch (error) {
        console.log("Error creating database: ", error.message);
        throw new Error(error);
    }
}

module.exports = { db, createDB };