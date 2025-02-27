const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 5000;
const OPENAI_KEY = process.env.OPENAI_KEY;

const app = express();
app.use(express.json());
app.use(cors());

app.post("/api/summarize", async(req,res) => {
    const { text } = req.body;
    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",{
                model: "gpt-4",
                messages: [{role: "user", content: `Summarize: ${text}`}]
            },{
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${OPENAI_KEY}`
                }
            });
            res.json({ summary: response.data.choices[0].message.content });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

app.get("api/summaries", async(req, res) => {
    res.json({ summaries: [] });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} 🫡`);
})
