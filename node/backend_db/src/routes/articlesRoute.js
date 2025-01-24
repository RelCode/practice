const express = require("express");
const router = express.Router();
const articlesController = require("../controllers/articlesController");


router.get("/", articlesController.getAllArticles);


module.exports = router;