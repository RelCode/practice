const express = require("express");
const path = require("path");
const fs = require("fs");

const getAllLandmarks = (req, res) => {
    console.log("HERE!!!")
    // get images from the uploads folder
    const directoryPath = path.join(__dirname, "./../uploads/landmarks");
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return res.status(500).send({
                message: "Unable to scan directory",
            });
        }
        const landmarks = files.map((file) => {
            return {
                name: file,
                imageUrl: `${process.env.API_ENDPOINT}/${file}`,
            };
        });
        res.json(landmarks);
    });
}

module.exports = { getAllLandmarks };