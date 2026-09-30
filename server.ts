import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    })
  : null;

// Server-side AI Trade Matchmaker & Corridor Trading Copilot API
app.post('/api/ai/match', async (req, res) => {
  try {
    const {
      question,
      partnerCategory,
      regionalMarket,
      language = 'en',
      symbolContext,
      smeContext,
      history = []
    } = req.body;

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key not configured',
        fallback: true
      });
    }

    const recentTurnsText = Array.isArray(history) && history.length > 0
      ? `\nPrevious Conversational Turns in this Session:\n${history
          .slice(-6)
          .map((turn: { role: string; content: string }, idx: number) => `${idx + 1}. [${turn.role.toUpperCase()}]: ${turn.content}`)
          .join('\n')}\n`
      : '';

    const systemPrompt = `You are Trade Square AI, an OpenAI-grade executive trade & commodity market copilot built for the Ministry of Trade and Industry (MINICOM) of Rwanda.
Your mission is to assist Rwandan SMEs in analyzing real-time Northern Corridor (Kigali–Gatuna–Malaba–Nairobi) commodity spreads, landed pricing, and verified Kenyan trading partners.

Context:
- Active Rwandan SME: ${smeContext || 'Registered Rwandan Pilot Exporter'}
- Active Commodity / Symbol: ${symbolContext || 'All Northern Corridor Pilot Commodities (Beans HS 0713, Maize Flour HS 1102, Avocado HS 0804, Honey HS 0409)'}
- Selected Partner Category: ${partnerCategory || 'Verified Kenyan Buyers & Distributors'}
- Target Regional Market: ${regionalMarket || 'Kenya (Nairobi / Mombasa / Nakuru / Kisumu)'}
- Language: ${language === 'rw' ? 'Ikinyarwanda' : 'English'}${recentTurnsText}

Provide a crisp, structured, high-signal response (under 140 words):
1. Direct market & landed-price insight (comparing Kigali Ex-Works RWF/kg vs Nairobi Wholesale KES/kg at 1 KES = 9.85 RWF and ~85 RWF/kg corridor freight).
2. Top recommended Kenyan counterparty profile & verification status (KRA PIN, RSB S-Mark, EAC Rules of Origin 0% tariff).
3. Concrete next step (e.g. submitting an export signal or requesting a MINICOM facilitation letter).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents:
        question ||
        `Analyze the Northern Corridor market spread and top verified Kenyan buyers for ${symbolContext || partnerCategory}.`,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.65
      }
    });

    const text = response.text || 'Unable to generate match advice at this time.';
    res.json({ answer: text, success: true });
  } catch (error: any) {
    console.error('Gemini Trade Matcher Error:', error?.message || error);
    res.status(500).json({
      error: error?.message || 'Server error generating match recommendation',
      fallback: true
    });
  }
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Trade Square AI Matchmaker' });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Trade Square Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
