const express = require("express");
const bodyParser = require("body-parser");
const { db, createDB, checkForDbUpdates } = require("./db");
const articles = require("./routes/articlesRoute");
const landmarks = require("./routes/landmarksRoute");

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/api/articles', articles);
app.use('/api/landmarks', landmarks);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    // Remove the use of DB for now
    // createDB(() => {
    //     checkForDbUpdates();
    // });
});