# Hướng dẫn tích hợp Gemini API cho ChatBot

## 1. Cài đặt package cần thiết

```bash
npm install @google/generative-ai
```

## 2. Tạo file .env để lưu API key

Tạo file `.env` trong thư mục root của project:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

## 3. Tạo service để gọi Gemini API

Tạo file `src/services/geminiService.js`:

```javascript
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const callGeminiAPI = async (message) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
    Bạn là trợ lý ảo của Orchid Shop - cửa hàng chuyên bán hoa lan.
    Hãy trả lời câu hỏi của khách hàng một cách thân thiện và chuyên nghiệp.
    
    Thông tin về shop:
    - Chuyên bán các loại hoa lan: Dendrobium, Hồ Điệp, Cattleya, Oncidium
    - Giá từ 200,000 - 2,000,000 VNĐ
    - Giao hàng toàn quốc 2-3 ngày
    - Miễn phí ship với đơn hàng trên 500,000 VNĐ trong TP.HCM
    - Hotline: (028) 3123 4567
    - Địa chỉ: 123 Đường Hoa Lan, Quận 1, TP.HCM
    
    Câu hỏi của khách hàng: ${message}
    
    Hãy trả lời ngắn gọn, dễ hiểu và có emoji phù hợp.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Xin lỗi, tôi gặp sự cố kỹ thuật. Vui lòng thử lại sau.");
  }
};
```

## 4. Cập nhật ChatBot component

Thay thế hàm `generateBotResponse` trong `src/components/ChatBot.jsx`:

```javascript
import { callGeminiAPI } from "../services/geminiService";

// Thay thế phần xử lý tin nhắn
const handleSendMessage = async (e) => {
  e.preventDefault();
  if (!inputMessage.trim()) return;

  // Add user message
  const userMessage = {
    id: Date.now(),
    text: inputMessage,
    sender: "user",
    timestamp: new Date().toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  setMessages((prev) => [...prev, userMessage]);
  const currentMessage = inputMessage;
  setInputMessage("");
  setIsLoading(true);

  try {
    // Call Gemini API
    const botResponseText = await callGeminiAPI(currentMessage);

    const botResponse = {
      id: Date.now() + 1,
      text: botResponseText,
      sender: "bot",
      timestamp: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, botResponse]);
  } catch (error) {
    const errorResponse = {
      id: Date.now() + 1,
      text: error.message,
      sender: "bot",
      timestamp: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, errorResponse]);
  } finally {
    setIsLoading(false);
  }
};
```

## 5. Cách lấy Gemini API Key

1. Truy cập: https://makersuite.google.com/app/apikey
2. Đăng nhập tài khoản Google
3. Tạo API key mới
4. Copy API key và dán vào file `.env`

## 6. Lưu ý bảo mật

- Không commit file `.env` lên git
- Thêm `.env` vào `.gitignore`
- Sử dụng environment variables trên production

## 7. Test ChatBot

Sau khi tích hợp, bạn có thể test với các câu hỏi:

- "Giá hoa lan như thế nào?"
- "Cách chăm sóc hoa lan"
- "Có những loại nào?"
- "Chính sách giao hàng"

ChatBot sẽ sử dụng AI để trả lời thông minh và tự nhiên hơn!
