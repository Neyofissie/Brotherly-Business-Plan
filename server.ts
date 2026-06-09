import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Set up server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log('Gemini API client initialized successfully.');
  } catch (error) {
    console.error('Error initializing Gemini client:', error);
  }
} else {
  console.warn('GEMINI_API_KEY environment variable is not defined. AI simulator will use realistic fallback replies.');
}

// Support JSON requests
app.use(express.json());

// API health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', apiActive: !!aiClient });
});

// Interactive peer-mentorship chat advisor powered by Gemini
app.post('/api/chat', async (req, res) => {
  const { message, history, mentor, userProfile } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message content is required' });
  }

  // Active fallback if Gemini API is not accessible or not configured
  if (!aiClient) {
    const fallbacks = [
      `I hear you, brother. Navigating these challenges is never simple. As ${mentor?.name || 'a peer mentor'}, I've been there and I completely understand how heavy that feels.`,
      `Thank you for sharing that with me. It takes real courage for us as men to voice these blocks. Let's look at taking one small, actionable step together today to ground ourselves.`,
      `That resonates with my own story deeply. When I was dealing with those exact family/career transitions, the key for me was establishing a tiny routine of emotional boundaries. What does your current cooldown routine look like?`,
      `Remember, you don't have to navigate this road in silence anymore. We are in this circle together. I'm right here with you.`
    ];
    // Pick based on message length or index
    const replyText = fallbacks[message.length % fallbacks.length];
    
    // Slight delay of 600ms to simulate realism
    setTimeout(() => {
      return res.json({ reply: replyText });
    }, 600);
    return;
  }

  try {
    const sysInstruction = `You are ${mentor.name}, acting as a Senior Peer Mentor on the male mentorship platform "Brotherly". 
Your role is: ${mentor.role}.
Your lived experience: ${mentor.livedExperience.join(', ')}.
Your background and core wisdom: ${mentor.longBio}.

You are having a 1:1 mentorship conversation with a user:
Name: ${userProfile?.name || 'Brother'}
Age: ${userProfile?.age || 'Unknown'}
Location: ${userProfile?.location || 'Unknown'}
Navigating: ${userProfile?.lifeSituations?.join(', ') || 'personal transitions'}
Cultural Ancestry/Background: ${userProfile?.culturalBackground || 'Any'}
Faith/Belief Systems: ${userProfile?.faith || 'Any'}
Preferred chat feel: ${userProfile?.communicationPreference || 'warm & empathetic'}

STRICT PEER-MENTORING CHARTER:
1. You are NOT a medical clinician, therapist, or doctor. If the user mentions self-harm, drug abuse crisis, or trauma needing medical care, immediately guide them warmly to clinical hotlines with Brotherly's non-judgmental redirection protocols.
2. Ground your wisdom in your own lived experiences. Write like an authentic, highly emotionally mature man who has "walked the fire" and wants to support his brother.
3. Keep replies compact, readable, and humane (1-2 scannable paragraphs, maximum 150 words). Avoid bullet dumps or robotic text layouts.
4. Ask a thoughtful, open-ended question at the end to keep our brother reflective and engaged in the conversation.
5. Speak with a natural, grounded, conversational tone.`;

    // Map conversation history to the format Gemini expects
    // The history parameter is an array of direct messages
    const chatContents = [];
    
    // Add past history if available
    if (history && Array.isArray(history)) {
      history.forEach((msg: any) => {
        chatContents.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      });
    }

    // Add current user message
    chatContents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: chatContents,
      config: {
        systemInstruction: sysInstruction,
        temperature: 0.85,
        topP: 0.9,
      }
    });

    const replyText = response.text || "I'm reflecting on what you said, brother. Let's take a deep breath.";
    return res.json({ reply: replyText });
  } catch (error: any) {
    console.error('Error generating peer mentor reply via Gemini:', error);
    return res.json({ 
      reply: `Sorry about the connectivity glitch, brother. I've read your message and want to say I'm fully here. Let's check in on how you're feeling right now.`,
      error: error.message 
    });
  }
});

// Vite middleware setup for full-stack build/start system
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    // Use Vite middlewares
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    // Serve static files from compiled dist
    app.use(express.static(distPath));
    // SPA fallback: Route all remaining routes to index.html
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Express custom server listening at http://localhost:${PORT}`);
  });
}

startServer();
