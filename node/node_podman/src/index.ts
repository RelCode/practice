import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import tech from "./routes/techRoute.js"
import { createDB, checkForDbUpdates, dbConn } from "./db";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/api/tech', tech);

app.listen(port, () : void => {
    console.log(`Server is running on port ${port}`);
    const db = dbConn();
    createDB(db, () :void => {
        checkForDbUpdates(db);
    })
});