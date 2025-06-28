// Backend: Express server + Gemini integration + MongoDB logging
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// 🔸 NEW: MongoDB
import mongoose from 'mongoose';

dotenv.config();

// 🔸 NEW: connect to MongoDB once at startup
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// 🔸 NEW: simple schema to record what was asked
const QuizRequestSchema = new mongoose.Schema(
  {
    paragraph: { type: String, required: true },
    level: { type: String, default: 'medium' },
  },
  { timestamps: true }
);

const QuizRequest = mongoose.model('QuizRequest', QuizRequestSchema);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '8mb' }));

// Generate 15-question MCQ quiz
app.post('/api/generate-quiz', async (req, res) => {
  try {
    const { paragraph, level } = req.body;
    if (!paragraph) {
      return res.status(400).json({ error: 'Paragraph is required' });
    }

    // 🔸 NEW: fire-and-forget Mongo write (don’t block the quiz generation)
    QuizRequest.create({ paragraph, level }).catch((err) =>
      console.error('❗ QuizRequest save error:', err)
    );

    const prompt = `
You are an education assistant. Generate a quiz of exactly 15 multiple-choice questions based on the following NCERT paragraph. 
Difficulty level: ${level || 'medium'}. 
Return the result as valid JSON array. Each element must have:
  "question": string,
  "options": array of 4 strings,
  "correctIndex": integer (0-3, pointing to the correct option).

Paragraph:
\"\"\"${paragraph}\"\"\"
`;

    const response = await model.generateContent(prompt);
    let text = response.response.text().trim();

    // Strip code fences if present
    if (text.startsWith('```')) {
      text = text.replace(/```[\s\S]*?\n/, '').replace(/```$/, '');
    }

    // Attempt JSON parse
    let questions;
    try {
      questions = JSON.parse(text);
    } catch {
      const match = text.match(/\[.*\]/s);
      if (match) {
        questions = JSON.parse(match[0]);
      } else {
        throw new Error('Unable to parse Gemini response');
      }
    }

    res.json({ questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Serve frontend build in production
const __dirname = path.dirname(fileURLToPath(import.meta.url));
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, 'client', 'dist');
  app.use(express.static(clientDist));
  app.get('*', (_, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
