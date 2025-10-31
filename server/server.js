import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Route pour le chat
app.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ reply: "Message vide" });
  }
  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent",
      {
        prompt: { text: message },
        model: "gemini-2.5-flash"
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`
        }
      }
    );
    const botReply = response.data?.output?.text || "Je n’ai pas compris 😅";
    res.json({ reply: botReply });
  } catch (error) {
    console.error("Erreur Gemini API:", error.response?.data || error.message);
    res.status(500).json({ reply: "Erreur de connexion ❌" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur backend lancé sur le port ${PORT}`);
});
