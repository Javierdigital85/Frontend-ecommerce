import React, { useState, useEffect, useRef } from "react";
import { FaRobot, FaPaperPlane, FaTimes, FaCommentDots } from "react-icons/fa";
import type { Message } from "../../interfaces/Chat";
import { postMessage, postThreadId } from "../../services/chatService";
import { useLanguage } from "../../context/useLanguage";

const TypingIndicator = () => (
  <div className="mb-3 flex justify-start">
    <div className="bg-white text-gray-500 shadow-sm px-4 py-3 rounded-lg flex items-center gap-1">
      <span
        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
        style={{ animationDelay: "0ms" }}
      />
      <span
        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
        style={{ animationDelay: "150ms" }}
      />
      <span
        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
        style={{ animationDelay: "300ms" }}
      />
    </div>
  </div>
);

const formatTime = (date: Date) =>
  date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initialMessage = {
      text:
        language === "es"
          ? "¡Hola! Soy tu asistente de compras. ¿Cómo puedo ayudarte hoy? 🛍️"
          : "Hi! I'm your shopping assistant. How can I help you today? 🛍️",
      isAgent: true,
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Auto-focus input when chat opens
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setMessages((prev) => [
      ...prev,
      { text: userMessage, isAgent: false, timestamp: new Date() },
    ]);
    setInputValue("");
    setIsLoading(true);

    try {
      let data;
      if (threadId) {
        data = await postThreadId(threadId, userMessage, language);
      } else {
        data = await postMessage(userMessage, language);
        setThreadId(data.threadId);
      }

      setMessages((prev) => [
        ...prev,
        { text: data.response, isAgent: true, timestamp: new Date() },
      ]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          text: error.message || "Something went wrong. Please try again.",
          isAgent: true,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 h-[500px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in">
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <FaRobot className="text-lg" />
              <div>
                <h3 className="font-semibold text-sm">Shop Assistant</h3>
                <span className="text-xs text-blue-200">Online</span>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="text-white hover:text-gray-200 transition-colors p-1"
            >
              <FaTimes />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 px-4 py-3 overflow-y-auto bg-gray-50 space-y-1">
            {messages.map((message, index) => (
              <div key={index}>
                <div
                  className={`flex ${message.isAgent ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-lg text-sm whitespace-pre-wrap break-words ${
                      message.isAgent
                        ? "bg-white text-gray-800 shadow-sm border border-gray-100"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
                <div
                  className={`flex ${message.isAgent ? "justify-start" : "justify-end"} mt-0.5 mb-2`}
                >
                  <span className="text-[10px] text-gray-400 px-1">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSendMessage}
            className="px-4 py-3 bg-white border-t shrink-0"
          >
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                placeholder={
                  isLoading ? "Waiting for response..." : "Type your message..."
                }
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FaPaperPlane className="text-sm" />
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
        {isOpen ? (
          <FaTimes className="text-xl" />
        ) : (
          <FaCommentDots className="text-xl" />
        )}
      </button>
    </div>
  );
};

export default ChatWidget;
