"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { sendChatMessage } from "../services/chatbotService"; 

const Chatbot = () => {
  const { user, isAuthenticated } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    {
      sender: "bot",
      type: "welcome",
    },
  ]);
  const [input, setInput] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [typing, setTyping] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const emailToUse = isAuthenticated ? user?.email : guestEmail;

    // Guest validation
    if (!isAuthenticated) {
      if (!guestEmail) {
        setEmailError("Email is required");
        return;
      }

      if (!validateEmail(guestEmail)) {
        setEmailError("Enter a valid email address");
        return;
      }
    }

    setEmailError("");

    const newMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setTyping(true);

    try {
      await sendChatMessage({
        email: emailToUse as string,
        message: input,
      });

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Message sent successfully! 🚀" },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Something went wrong. Please try again." },
      ]);
    }

    setTyping(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
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
            <div className="bg-[#00bf63] text-white px-4 py-2">
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
                    className={`px-3 py-2 rounded-lg max-w-[70%] shadow ${
                      msg.sender === "user"
                        ? "bg-[#00bf63] text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {msg.type === "welcome" ? (
                      <div className="space-y-2">
                        <p>
                          Hi 👋 I'm here to help with your frontend journey!
                        </p>
                        <p className="text-xs">
                          Or reach out to us at{" "}
                          <a
                            href="mailto:support@codebazeacademy.com?subject=CodeBaze Support Request"
                            className="text-[#00bf63] underline hover:text-[#009e52]"
                          >
                            support@codebazeacademy.com
                          </a>
                        </p>
                      </div>
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex justify-start">
                  <div className="px-3 py-2 rounded-lg bg-gray-200 shadow flex gap-1">
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

            {/* Input Section */}
            <div className="border-t p-3 flex flex-col gap-2">
              {!isAuthenticated && (
                <div className="flex flex-col">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="rounded-lg px-3 py-2 text-base text-black focus:outline-none focus:ring-2 focus:ring-[#00bf63] placeholder:text-gray-400"
                  />
                  {emailError && (
                    <span className="text-xs text-red-500 mt-1">
                      {emailError}
                    </span>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 rounded-lg px-3 py-2 text-base text-black focus:outline-none focus:ring-2 focus:ring-[#00bf63]"
                />
                <button
                  onClick={handleSend}
                  className="bg-[#00bf63] text-white px-3 rounded-lg hover:bg-[#00a54a] transition"
                >
                  Send
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#00bf63] text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:-translate-y-1"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
};

export default Chatbot;
