const express = require("express");
const bodyParser = require("body-parser");
const { db, createDB, checkForDbUpdates } = require("./db");
const articles = require("./routes/articlesRoute");

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/api/articles', articles);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    createDB(() => {
        checkForDbUpdates();
        //db.updateDatabase(); will run here every time the server starts
    });
});