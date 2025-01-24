const { db } = require("../db");

const getAllArticles = (req, res) => {
    db.query("SELECT * FROM articles", (err, result) => {
        if(err){
            console.log("Error getting articles: ", err.message);
            res.status(500).send("Error getting articles");
            return;
        }
        res.json(result);
    })
}

module.exports = { getAllArticles };