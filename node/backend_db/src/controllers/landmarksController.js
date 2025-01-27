const { db } = require("../db");

const getAllLandmarks = (req, res) => {
    db.query("SELECT * FROM articles", (err, result) => {
        if(err){
            res.status(500).send("Error getting articles");
            return;
        }
        res.json(result);
    })
}

module.exports = { getAllLandmarks };