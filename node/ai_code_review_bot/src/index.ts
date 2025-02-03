import express from "express";
import { Webhooks } from "@octokit/webhooks";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const webhooks = new Webhooks({ secret: process.env.GITHUB_WEBHOOK_SECRET || "" });

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
                headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` },
            }
        );

        let codeToReview = "";
        files.forEach((file: any) => {
            if (file.filename.endsWith(".ts") || file.filename.endsWith(".js")) {
                codeToReview += `\nFile: ${file.filename}\n${file.patch}`;
            }
        });

        // Cap the codeToReview length to 8000 tokens
        const maxTokens = 8000;
        if (codeToReview.length > maxTokens) {
            codeToReview = codeToReview.substring(0, maxTokens);
        }

        if (codeToReview) {
            // Send to OpenAI for review
            const response = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: "gpt-4-turbo",
                    messages: [{ role: "system", content: "Analyze this code for improvements" }, { role: "user", content: codeToReview }]
                },
                {
                    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
                }
            );

            const reviewComments = response.data.choices[0].message.content;
            console.log(`AI Review:\n${reviewComments}`);

            // Post comments on GitHub PR
            await axios.post(
                `${payload.pull_request._links.comments.href}`,
                { body: reviewComments },
                { headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` } }
            );
        }
    }

    res.sendStatus(200);
});

app.listen(PORT, () => console.log(`🚀 /====0000-0000====/ Server running on port ${PORT}`));
