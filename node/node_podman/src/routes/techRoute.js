const express = require("express");
const router = express.Router();
const techController = require("../controllers/techController");


router.get("/", techController.getAllArticles);


module.exports = router;