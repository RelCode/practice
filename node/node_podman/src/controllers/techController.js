const { dbConn } = require("../db");

const getAllArticles = (req, res) => {
    console.log("Getting all articles", req);
    const db = dbConn();
    db.query("SELECT * FROM tech_news", (err, result) => {
        if(err){
            res.status(500).send("Error getting articles");
            return;
        }
        console.log("Result: ", result);
        res.json(result);
    })
}

module.exports = { getAllArticles };