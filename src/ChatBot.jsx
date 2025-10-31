import React, { useState } from "react";
import axios from "axios";
import { MessageCircle } from "lucide-react";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { sender: "user", text: userInput }];
    setMessages(newMessages);
    setUserInput("");

    try {
      // Requête vers ton backend Node.js
      const response = await axios.post("http://localhost:5000/chat", {
        message: userInput,
      });

      const botReply = response.data?.reply || "Je n’ai pas compris 😅";
      setMessages([...newMessages, { sender: "bot", text: botReply }]);
    } catch (error) {
      console.error("Erreur backend/API:", error);
      setMessages([...newMessages, { sender: "bot", text: "Erreur de connexion ❌" }]);
    }
  };

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition"
      >
        <MessageCircle size={24} />
      </button>

      {/* Fenêtre du chatbot */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 bg-white border rounded-2xl shadow-xl p-4 flex flex-col">
          <h2 className="text-lg font-bold mb-2 text-blue-600">🤖 ChatBot</h2>
          <div className="flex-1 overflow-y-auto mb-2 border p-2 rounded-lg">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`my-1 ${
                  m.sender === "user" ? "text-right" : "text-left text-blue-600"
                }`}
              >
                <span
                  className={`inline-block px-3 py-1 rounded-lg ${
                    m.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  {m.text}
                </span>
              </div>
            ))}
          </div>
          <div className="flex">
            <input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-grow border rounded-l-lg p-2 outline-none"
              placeholder="Écris un message..."
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white px-4 rounded-r-lg hover:bg-blue-700"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
