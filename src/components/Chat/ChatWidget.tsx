import React, { useState, useEffect, useRef } from "react";
import { FaRobot, FaPaperPlane, FaTimes, FaCommentDots } from "react-icons/fa";
import type { Message } from "../../interfaces/Chat";
import { postMessage, postThreadId } from "../../services/chatService";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! I'm your shopping assistant. How can I help you today?",
      isAgent: true,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [threadId, setThreadId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    const message = {
      text: userMessage,
      isAgent: false,
    };

    setMessages((prevMessages) => [...prevMessages, message]);
    setInputValue("");

    try {
      let data;

      if (threadId) {
        // Conversación existente
        data = await postThreadId(threadId, userMessage);
      } else {
        // Nueva conversación
        data = await postMessage(userMessage);
        setThreadId(data.threadId);
      }

      const agentResponse = {
        text: data.response,
        isAgent: true,
      };

      setMessages((prevMessages) => [...prevMessages, agentResponse]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = {
        text: "Sorry, I'm having trouble connecting. Please try again.",
        isAgent: true,
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  return (
    <div className="relative">
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaRobot className="text-lg" />
              <h3 className="font-semibold">Shop Assistant</h3>
            </div>
            <button
              onClick={toggleChat}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <FaTimes />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-3 flex ${
                  message.isAgent ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    message.isAgent
                      ? "bg-white text-gray-800 shadow-sm"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your message..."
                value={inputValue}
                onChange={handleInputChange}
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FaPaperPlane />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center hover:scale-105"
      >
        <FaCommentDots className="text-xl" />
      </button>
    </div>
  );
};

export default ChatWidget;
