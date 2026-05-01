import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize OpenAI to use Google's Gemini API (since you provided a Gemini key!)
const openai = new OpenAI({
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    apiKey: process.env.OPENAI_API_KEY,
});

const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.post('/api/ai-agent', async (req, res) => {
    const { userMessage, dashboardData } = req.body;

    const systemPrompt = "You are an AI business assistant. Analyze the data provided and answer the user's query.";
    const userPrompt = `${userMessage}. Dashboard Data: ${JSON.stringify(dashboardData)}`;

    try {
        const response = await openai.chat.completions.create({
            model: "gemini-2.5-flash", // Using Google's Gemini 2.5 Flash model
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ]
        });

        // Handle empty response
        if (!response.choices || response.choices.length === 0) {
            return res.status(500).json({ error: "No response from AI assistant" });
        }

        const aiResponse = response.choices[0].message?.content?.trim() || "No response from AI assistant";
        res.json({ aiResponse });

    } catch (error) {
        console.error("Error calling OpenAI:", error);
        res.status(500).json({ error: "Failed to get response from AI assistant" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});