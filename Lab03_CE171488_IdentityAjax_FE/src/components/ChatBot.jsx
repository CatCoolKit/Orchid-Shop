import React, { useState, useRef, useEffect } from "react";
import "./ChatBot.css";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Xin chào! 👋 Tôi là trợ lý ảo của Orchid Shop. Tôi có thể giúp bạn tìm hiểu về các loài hoa lan và tư vấn mua hàng. Bạn cần hỗ trợ gì không?",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Lưu tin nhắn trước khi clear input
    const messageText = inputMessage.trim();

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: "user",
      timestamp: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // TODO: Replace with Gemini API call
    // For now, simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: generateBotResponse(messageText), // Sử dụng messageText thay vì inputMessage
        sender: "bot",
        timestamp: new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
    }, 1500);
  };

  // Temporary function to simulate bot responses - will be replaced with Gemini API
  const generateBotResponse = (userInput) => {
    const input = userInput.toLowerCase();

    if (input.includes("giá") || input.includes("bao nhiêu")) {
      return "💰 Giá các loài hoa lan của chúng tôi dao động từ 200,000 - 2,000,000 VNĐ tùy theo loại và kích thước. Bạn quan tâm đến loại hoa lan nào cụ thể không?";
    } else if (input.includes("chăm sóc") || input.includes("trồng")) {
      return "🌱 Hoa lan cần ánh sáng gián tiếp, độ ẩm 60-80%, tưới nước 2-3 lần/tuần. Bạn có muốn tôi tư vấn chi tiết cho loại hoa lan cụ thể không?";
    } else if (input.includes("giao hàng") || input.includes("ship")) {
      return "🚚 Chúng tôi giao hàng toàn quốc trong 2-3 ngày. Miễn phí ship với đơn hàng trên 500,000 VNĐ trong nội thành TP.HCM.";
    } else if (input.includes("loại") || input.includes("phân loại")) {
      return "🌺 Chúng tôi có 4 loại chính: Lan Dendrobium, Lan Hồ Điệp, Lan Cattleya, và Lan Oncidium. Mỗi loại đều có vẻ đẹp riêng biệt!";
    } else {
      return "🌸 Cảm ơn bạn đã hỏi! Tôi sẽ tìm hiểu thông tin này cho bạn. Bạn có thể liên hệ hotline (028) 3123 4567 để được tư vấn chi tiết hơn nhé!";
    }
  };

  const quickQuestions = [
    "Giá hoa lan như thế nào?",
    "Cách chăm sóc hoa lan",
    "Có những loại nào?",
    "Chính sách giao hàng",
  ];

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  return (
    <div className="chatbot-container">
      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-title">
              <div className="bot-avatar">🤖</div>
              <div className="chat-info">
                <h4>Orchid Assistant</h4>
                <span className="status">Đang hoạt động</span>
              </div>
            </div>
            <button className="close-btn" onClick={toggleChat}>
              ✕
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${
                  message.sender === "user" ? "user-message" : "bot-message"
                }`}
              >
                <div className="message-content">
                  <p>{message.text}</p>
                  <span className="message-time">{message.timestamp}</span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="message bot-message">
                <div className="message-content">
                  <div className="typing-indicator">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="quick-questions">
              <p className="quick-title">Câu hỏi thường gặp:</p>
              <div className="quick-buttons">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    className="quick-btn"
                    onClick={() => handleQuickQuestion(question)}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form className="chat-input-form" onSubmit={handleSendMessage}>
            <div className="input-wrapper">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Nhập câu hỏi của bạn..."
                className="chat-input"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="send-btn"
                disabled={!inputMessage.trim() || isLoading}
              >
                <span className="send-icon">📤</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        className={`chatbot-toggle ${isOpen ? "active" : ""}`}
        onClick={toggleChat}
        aria-label="Chat với trợ lý ảo"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 9999,
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: isOpen
            ? "#dc3545"
            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          fontSize: "1.5rem",
          boxShadow: "0 8px 25px rgba(102, 126, 234, 0.4)",
        }}
      >
        {isOpen ? (
          <span className="close-icon">✕</span>
        ) : (
          <>
            <span className="chat-icon">💬</span>
            <div className="notification-dot"></div>
          </>
        )}
      </button>
    </div>
  );
};

export default ChatBot;
