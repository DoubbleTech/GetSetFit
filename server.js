import express from 'express';
import cors from 'cors';
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from the React app build folder
app.use(express.static(path.join(__dirname, 'dist')));

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend is fully operational' });
});

app.post('/api/generate-job-description', async (req, res) => {
    const { title, experience, location } = req.body;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Write a structured job description for ${title} (${experience} exp) in ${location}. Max 200 words.`,
        });
        res.json({ description: response.text });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/rank-candidates', async (req, res) => {
    const { job, candidates } = req.body;
    const resumes = candidates.map(c => `ID: ${c.id}\nRESUME: ${c.resume}`).join('\n---\n');
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Rank these candidates for the job: ${job.title}. Job Desc: ${job.description}\n\nResumes:\n${resumes}`,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            candidateId: { type: Type.NUMBER },
                            reasoning: { type: Type.STRING }
                        },
                        required: ['candidateId', 'reasoning']
                    }
                }
            }
        });
        res.json(JSON.parse(response.text || "[]"));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/generate-offer-letter', async (req, res) => {
    const { job, candidate } = req.body;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Write a professional offer letter for ${candidate.name} as ${job.title}.`,
        });
        res.json({ offerLetter: response.text });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// All remaining requests to index.html for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server launched on port ${PORT}`);
});