const express = require("express");
const router = express.Router();
const landmarksController = require("../controllers/landmarksController");


router.get("/", landmarksController.getAllLandmarks);


module.exports = router;