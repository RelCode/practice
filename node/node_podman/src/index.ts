import express from "express";
import mysql from "mysql";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT as string),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("MySQL connected");
    }
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () : void => {
    console.log(`Server is running on port ${port}`);
});