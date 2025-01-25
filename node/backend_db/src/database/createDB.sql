-- Check if the database 'node_db' exists, if not create it
CREATE DATABASE IF NOT EXISTS node_db;

-- Use the 'node_db' database
USE node_db;

-- Check if the table 'installed_versions' exists, if not create it
CREATE TABLE IF NOT EXISTS installed_versions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content_section VARCHAR(255) NOT NULL,
    version_installed VARCHAR(50) NOT NULL,
    date_installed TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
