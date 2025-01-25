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

const checkForDbUpdates = () => {
    try {
        const folders = fs.readdirSync(path.join(__dirname, './database/')).filter(file => !file.includes(".sql"));
        folders.forEach(folder => {
            try {
                const files = fs.readdirSync(path.join(__dirname, `./database/${folder}/`));
                if (files.length > 0) {
                    db.query("SELECT * FROM installed_versions WHERE content_section = ? AND version_installed = ?", [folder, files[0]], (err, result) => {
                        if (err) {
                            console.log("Error checking for db updates: ", err.message);
                            throw new Error(err);
                        }
                        if (result.length === 0) { // meaning the installed version is different from the one found in folder
                            try {
                                const sql = fs.readFileSync(path.join(__dirname, `./database/${folder}/${files[0]}`), 'utf-8');
                                const multipleQueries = sql.split(';').filter(q => q.trim().length);
                                multipleQueries.forEach(query => {
                                    db.query(query, (err, result) => {
                                        if (err) {
                                            console.log("Error updating database: ", err.message);
                                            throw new Error(err);
                                        }
                                    });
                                });
                            } catch (error) {
                                console.log("Error reading or executing SQL file: ", error.message);
                                throw new Error(error);
                            }
                        }
                    });
                }
            } catch (error) {
                console.log("Error reading folder or files: ", error.message);
                throw new Error(error);
            }
        });
    } catch (error) {
        console.log("Error reading database directory: ", error.message);
        throw new Error(error);
    }
}

module.exports = { db, createDB, checkForDbUpdates };