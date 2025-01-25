const { db } = require("../db");

const getAllArticles = (req, res) => {
    db.query("SELECT * FROM articles", (err, result) => {
        if(err){
            res.status(500).send("Error getting articles");
            return;
        }
        res.json(result);
    })
}

module.exports = { getAllArticles };