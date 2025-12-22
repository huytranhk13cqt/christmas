# 🎄 Christmas Gift Reveal 🎁

Một ứng dụng web Giáng sinh với slider hộp quà, animation mở quà, lá thư chúc mừng và nhạc nền.

## 📁 Cấu trúc dự án

```
christmas-gift/
├── client/                 # Frontend (React + Vite)
│   ├── public/
│   │   ├── images/        # 👈 Thêm ảnh quà vào đây
│   │   └── music/         # 👈 Thêm nhạc MP3 vào đây
│   └── src/
│       ├── components/
│       │   ├── GiftSlider.jsx
│       │   ├── GiftBox.jsx
│       │   ├── ChristmasLetter.jsx
│       │   └── MusicPlayer.jsx
│       ├── App.jsx
│       └── ...
├── server/                 # Backend (Node.js + Express)
│   └── index.js
└── package.json
```

## 🚀 Cài đặt và Chạy

### 1. Cài đặt dependencies

```bash
cd christmas-gift

# Cài đặt cho cả client và server
npm run install:all

# Hoặc cài đặt riêng từng phần
cd client && npm install
cd ../server && npm install
```

### 2. Thêm ảnh và nhạc

**Ảnh quà (bắt buộc):**

- Đặt ảnh vào: `client/public/images/`
- Định dạng hỗ trợ: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`
- Số lượng hộp quà = số lượng ảnh

**Nhạc nền (tùy chọn):**

- Đặt file nhạc vào: `client/public/music/`
- Định dạng hỗ trợ: `.mp3`, `.wav`, `.ogg`
- Nhạc sẽ phát tự động theo vòng hoặc ngẫu nhiên

### 3. Chạy ứng dụng

**Development mode:**

```bash
# Chạy cả client và server (từ thư mục gốc)
npm run dev

# Hoặc chạy riêng
# Terminal 1: Server
cd server && npm run dev

# Terminal 2: Client
cd client && npm run dev
```

**Production mode:**

```bash
# Build client
npm run build

# Chạy server
npm start
```

### 4. Truy cập

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001

## 🎮 Cách sử dụng

1. **Chọn hộp quà:** Kéo slider hoặc click vào hộp quà
2. **Nút "Ngẫu Nhiên":** Chọn ngẫu nhiên một hộp quà
3. **Nút "Mở Quà":** Xác nhận và mở hộp quà đã chọn
4. **Xem quà:** Hộp quà sẽ mở ra với animation đẹp mắt
5. **Đọc thư:** Nhấn vào phong bì để mở thư chúc mừng
6. **Chơi lại:** Nhấn nút để chọn món quà khác

## 🎵 Điều khiển nhạc

- Click vào icon 🎵 góc phải để mở/đóng panel
- ▶ Phát / ⏸ Tạm dừng
- ⏮ ⏭ Chuyển bài
- 🔀 Bật/tắt phát ngẫu nhiên
- Thanh trượt điều chỉnh âm lượng

## 🎨 Tính năng

- ✅ Image slider với các hộp quà nhiều màu sắc
- ✅ Animation mở hộp quà 3D
- ✅ Lá thư chúc mừng với animation bóc thư chân thật
- ✅ Nhạc nền Giáng sinh (loop/shuffle)
- ✅ Tự động scale theo số lượng ảnh/nhạc
- ✅ Hiệu ứng tuyết rơi
- ✅ Theme Giáng sinh đẹp mắt
- ✅ Responsive design

## 🛠️ Tùy chỉnh

### Chỉnh sửa nội dung thư

Mở file `client/src/components/ChristmasLetter.jsx` và chỉnh sửa phần:

```jsx
<div className="letter-text">
  <p>// Thay đổi nội dung thư ở đây</p>
</div>
```

### Chỉnh sửa màu sắc

Mở file `client/src/index.css` và chỉnh sửa các biến CSS:

```css
:root {
  --christmas-red: #c41e3a;
  --christmas-green: #228b22;
  --christmas-gold: #ffd700;
  /* ... */
}
```

### Chỉnh sửa màu hộp quà

Mở file `client/src/components/GiftSlider.jsx` và chỉnh sửa mảng `GIFT_COLORS`.

## 📝 API Endpoints

| Endpoint      | Method | Mô tả              |
| ------------- | ------ | ------------------ |
| `/api/images` | GET    | Lấy danh sách ảnh  |
| `/api/music`  | GET    | Lấy danh sách nhạc |
| `/api/health` | GET    | Health check       |

## 🎄 Chúc bạn một mùa Giáng sinh vui vẻ! 🎄
