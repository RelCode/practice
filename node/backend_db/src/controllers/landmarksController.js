const express = require("express");
const path = require("path");
const fs = require("fs").promises;

const getAllLandmarks = async (req, res) => {
    try {
        // Get the directory path
        const directoryPath = path.join(__dirname, "./../uploads/landmarks");

        // Read directory contents
        const files = await fs.readdir(directoryPath);

        // Read all images as base64
        const landmarks = await Promise.all(
            files.map(async (file) => {
                const data = await fs.readFile(`${directoryPath}/${file}`);
                return {
                    name: file,
                    base64: Buffer.from(data).toString("base64"),
                };
            })
        );
        // Send response
        res.json(landmarks);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving images", error: error.message });
    }
}

module.exports = { getAllLandmarks };