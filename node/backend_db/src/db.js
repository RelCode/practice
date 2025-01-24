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

module.exports = { db };