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
        throw new Error(err);
    }
})

const createDB = (cb) => {
    const sql = fs.readFileSync(path.join(__dirname, './database/createDB.sql'), 'utf-8');
    const multipleQueries = sql.split(';').filter(q => q.trim().length);
    try {
        multipleQueries.forEach(query => {
            db.query(query, (err) => {
                if (err){
                    throw new Error(err);
                }
            });
        });
        cb && cb();
    } catch (error) {
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
                            throw new Error(err);
                        }
                        if (result.length === 0) { // meaning the installed version is different from the one found in folder
                            try {
                                const sql = fs.readFileSync(path.join(__dirname, `./database/${folder}/${files[0]}`), 'utf-8');
                                const multipleQueries = sql.split(';').filter(q => q.trim().length);
                                multipleQueries.forEach(query => {
                                    db.query(query, (err) => {
                                        if (err) {
                                            throw new Error(err);
                                        }
                                    });
                                });
                                try {
                                    db.query("INSERT INTO installed_versions (content_section, version_installed) VALUES (?, ?) ON DUPLICATE KEY UPDATE version_installed = VALUES(version_installed)", [folder, files[0]], (err) => {
                                        if (err) {
                                            throw new Error(err);
                                        }
                                    })
                                } catch (error) {
                                    throw new Error(error);
                                    
                                }
                            } catch (error) {
                                throw new Error(error);
                            }
                        }
                    });
                }
            } catch (error) {
                throw new Error(error);
            }
        });
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = { db, createDB, checkForDbUpdates };