# 🌐 Services Layer Documentation

Lớp services giúp **"giấu" và centralize** tất cả API calls, tạo abstraction layer cho việc giao tiếp với backend.

## 📁 Cấu trúc

```
src/services/
├── httpClient.js      # HTTP client với error handling
├── orchidService.js   # API calls cho orchids
├── categoryService.js # API calls cho categories
├── index.js          # Export tất cả services
└── README.md         # Documentation này
```

## 🔧 HttpClient Service

### Tính năng chính:

- **Centralized error handling** với messages tiếng Việt
- **Timeout management** (10 giây)
- **Status code mapping** với error messages cụ thể
- **Automatic response parsing** cho format API của backend
- **TypeScript-ready** structure

### Sử dụng:

```javascript
import { apiClient } from "../services";

// GET request
const response = await apiClient.get("/Orchid");

// POST request
const response = await apiClient.post("/Orchid", orchidData);

// PUT request
const response = await apiClient.put("/Orchid/1", updatedData);

// DELETE request
const response = await apiClient.delete("/Orchid/1");
```

## 🌺 OrchidService

### Methods:

- `getAllOrchids()` - Lấy tất cả orchids
- `getOrchidById(id)` - Lấy orchid theo ID
- `searchOrchids(searchTerm)` - Tìm kiếm orchids
- `getOrchidsByCategory(categoryName)` - Lấy orchids theo category
- `createOrchid(orchidData)` - Tạo orchid mới
- `updateOrchid(id, orchidData)` - Cập nhật orchid
- `deleteOrchid(id)` - Xóa orchid

### Sử dụng:

```javascript
import { orchidService } from "../services";

// Trong component
const orchids = await orchidService.getAllOrchids();
const orchid = await orchidService.getOrchidById(1);
```

## 📂 CategoryService

### Methods:

- `getAllCategories()` - Lấy tất cả categories (có "Tất cả" option)
- `getCategoryById(id)` - Lấy category theo ID
- `createCategory(categoryData)` - Tạo category mới
- `updateCategory(id, categoryData)` - Cập nhật category
- `deleteCategory(id)` - Xóa category
- `getCategoriesWithCount()` - Lấy categories kèm số lượng orchids

## ⚙️ Configuration

File `src/config/api.js` chứa:

- **Base URLs** cho dev/production
- **Timeout settings**
- **Status codes**
- **Error messages** tiếng Việt
- **API endpoints**

## 💡 Lợi ích của Services Layer

### ✅ **"Giấu" API Details:**

- Component không cần biết URL, headers, error handling
- Thay đổi API không ảnh hưởng đến component

### ✅ **Centralized Error Handling:**

- Error messages nhất quán trên toàn app
- Dễ dàng thay đổi error handling logic

### ✅ **Code Reusability:**

- Tránh duplicate code cho API calls
- Methods có thể reuse ở nhiều components

### ✅ **Type Safety:**

- Response structure được đảm bảo
- IntelliSense support tốt hơn

### ✅ **Testing:**

- Dễ dàng mock services trong unit tests
- Tách biệt logic component và API calls

## 🚀 Migration từ Direct Fetch

### Trước (Direct Fetch):

```javascript
// Trong HomePage.jsx - trước khi refactor
const response = await fetch(`${apiBaseUrl}/Orchid`);
if (!response.ok) {
  // handle error manually
}
const data = await response.json();
if (data.status === 200) {
  setOrchids(data.data);
}
```

### Sau (Services):

```javascript
// Trong HomePage.jsx - sau khi refactor
import { orchidService, categoryService } from "../../services";

const [orchids, categories] = await Promise.all([
  orchidService.getAllOrchids(),
  categoryService.getAllCategories(),
]);

setOrchids(orchids);
setCategories(categories);
```

## 🔮 Future Extensions

Services layer có thể mở rộng thêm:

- **Authentication service** cho login/logout
- **LocalStorage service** cho caching
- **Notification service** cho toast messages
- **File upload service** cho image uploads
- **Real-time service** cho WebSocket connections

## 📖 Ví dụ sử dụng trong Component

```javascript
import React, { useState, useEffect } from "react";
import { orchidService, categoryService } from "../services";

function MyComponent() {
  const [orchids, setOrchids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await orchidService.getAllOrchids();
        setOrchids(data);
      } catch (err) {
        setError(err.message); // Error messages đã được format sẵn
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Component render...
}
```

---

_Services layer giúp code sạch hơn, maintainable hơn và "giấu" được các chi tiết API phức tạp!_ 🌺
