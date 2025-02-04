import express from "express";
import { Webhooks } from "@octokit/webhooks";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Listen for PR events
app.post("/webhook", async (req, res) => {
    const payload = req.body;

    if (payload.action === "opened" || payload.action === "synchronize") {
        const prNumber = payload.pull_request.number;
        const repo = payload.repository.full_name;
        console.log(`New PR detected: #${prNumber} in ${repo}`);


        // Fetch PR changes
        const { data: files } = await axios.get(
            payload.pull_request._links.self.href + "/files",
            {
                headers: { 
                    Authorization: `token ${process.env.GITHUB_TOKEN}`,
                    "User-Agent": "ai-code-review-bot"
                },
            }
        );

        let codeToReview = "";
        files.forEach((file: any) => {
            if (file.filename.endsWith(".ts") || file.filename.endsWith(".js")) {
                codeToReview += `\nFile: ${file.filename}\n${file.patch}`;
            }
        });

        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        { role: "system", content: "Analyze this code for improvements" },
                        { role: "user", content: codeToReview }
                    ],
                    temperature: 1,
                    max_tokens: 2048,
                    top_p: 1,
                    frequency_penalty: 0,
                    presence_penalty: 0
                })
            });
        
            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
            }
        
            const data = await response.json();
            console.log("AI Response: ", data.choices?.[0]?.message?.content || "No response from AI");
        } catch (error) {
            console.error("Error calling OpenAI API:", error);
        }
        
    }

    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
});
