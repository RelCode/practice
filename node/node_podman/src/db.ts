import mysql from 'mysql2';
import fs from 'fs';
import path from 'path';
import { Connection } from 'mysql2/typings/mysql/lib/Connection';

interface Database {
    query: (query: string, values: any[], callback: (err: mysql.QueryError, result?: any) => void) => void;
}

interface Callback {
    (): void;
}

export const dbConn = (): Connection => {
    const db = mysql.createConnection({
        host: process.env.MYSQL_HOST || '127.0.0.1',
        port: parseInt(process.env.MYSQL_PORT || '3306'),
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MSYQL_PASSWORD || 'password',
        database: process.env.MYSQL_DATABASE || 'database'
    });
    
    db.connect((err: mysql.QueryError) => {
        if (err) {
            throw new Error(err.message);
        }
    });

    return db;
}

export const createDB = (db: Connection, cb?: Callback): void => {
    const sql = fs.readFileSync(path.join(__dirname, './database/createDB.sql'), 'utf-8');
    const multipleQueries = sql.split(';').filter(q => q.trim().length);
    try {
        multipleQueries.forEach(query => {
            db.query(query, [], (err: mysql.QueryError) => {
                if (err) {
                    throw new Error(err.message);
                }
            });
        });
        cb && cb();
    } catch (error) {
        throw new Error((error as Error).message);
    }
};

export const checkForDbUpdates = (db: Connection): void => {
    try {
        const folders = fs.readdirSync(path.join(__dirname, './database/')).filter(file => !file.includes(".sql"));
        folders.forEach(folder => {
            try {
                const files = fs.readdirSync(path.join(__dirname, `./database/${folder}/`));
                if (files.length > 0) {
                    db.query("SELECT * FROM installed_versions WHERE content_section = ? AND version_installed = ?", [folder, files[0]], (err: mysql.QueryError, result: any[]) => {
                        if (err) {
                            throw new Error(err.message);
                        }
                        if (result.length === 0) { // meaning the installed version is different from the one found in folder
                            try {
                                const sql = fs.readFileSync(path.join(__dirname, `./database/${folder}/${files[0]}`), 'utf-8');
                                const multipleQueries = sql.split(';').filter(q => q.trim().length);
                                multipleQueries.forEach(query => {
                                    db.query(query, [], (err: mysql.QueryError) => {
                                        if (err) {
                                            throw new Error(err.message);
                                        }
                                    });
                                });
                                try {
                                    db.query("INSERT INTO installed_versions (content_section, version_installed) VALUES (?, ?) ON DUPLICATE KEY UPDATE version_installed = VALUES(version_installed)", [folder, files[0]], (err: mysql.QueryError) => {
                                        if (err) {
                                            throw new Error(err.message);
                                        }
                                    });
                                } catch (error) {
                                    throw new Error((error as Error).message);
                                }
                            } catch (error) {
                                throw new Error((error as Error).message);
                            }
                        }
                    });
                }
            } catch (error) {
                throw new Error((error as Error).message);
            }
        });
    } catch (error) {
        throw new Error((error as Error).message);
    }
};
