"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi 👋 I'm here to help with your frontend journey!" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setTyping(true);

    // Simulate bot reply after delay
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Thanks for your message!" },
      ]);
      setTyping(false);
    }, 1500);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {/* Chatbot window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25 }}
            className="w-80 h-96 bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#00bf63] text-white flex items-center justify-between px-4 py-2">
              <h3 className="font-semibold">CodeBaze Chatbot</h3>
            </div>

            {/* Messages */}
            <div className="flex-1 p-3 space-y-2 overflow-y-auto text-sm">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-3 py-2 rounded-lg max-w-[70%] shadow text-sm ${
                      msg.sender === "user"
                        ? "bg-[#00bf63] text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <div className="flex justify-start">
                  <div className="px-3 py-2 rounded-lg bg-gray-200 text-gray-800 text-sm shadow flex items-center gap-1">
                    <motion.span
                      className="w-2 h-2 bg-gray-500 rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    />
                    <motion.span
                      className="w-2 h-2 bg-gray-500 rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                    />
                    <motion.span
                      className="w-2 h-2 bg-gray-500 rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t p-2 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                className="flex-1 rounded-lg px-3 py-2 text-base text-black focus:outline-none focus:ring-2 focus:ring-[#00bf63] placeholder:text-gray-400"
              />
              <button
                onClick={handleSend}
                className="bg-[#00bf63] text-white px-3 rounded-lg hover:bg-[#00a54a] transition"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#00bf63] text-white p-4 rounded-full shadow-lg cursor-pointer transition-all duration-300 ease-in-out transform hover:-translate-y-1"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
};

export default Chatbot;
