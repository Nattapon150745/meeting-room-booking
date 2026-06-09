# 📅 ระบบจองห้องประชุม (Meeting Room Booking System)

## ⚙️ คุณสมบัติ

- 👤 **ระบบล็อกอิน** - สามารถสร้างบัญชีและเข้าสู่ระบบได้
- 🏢 **จัดเตียนห้องประชุม** - แสดงรายการห้องประชุมทั้งหมด
- ✏️ **จองห้องประชุม** - ผู้ใช้สามารถจองห้องประชุมได้
- 📎 **แนบไฟล์** - สามารถแนบไฟล์ (PDF, Word, Excel, รูปภาพ) ได้
- ✅ **ลงรับการจอง** - เจ้าของห้องสามารถลงรับหรือปฏิเสธการจองได้
- 📋 **ติดตามการจอง** - ผู้ใช้สามารถดูสถานะการจองของตัวเองได้

## 🛠️ Stack

**Backend:**
- Node.js + Express
- Multer (File Upload)
- CORS

**Frontend:**
- React 18
- Tailwind CSS
- Fetch API

## 📦 Installation

### Backend Setup

```bash
cd backend
npm install
npm start
```

Server จะรันที่: `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npx http-server
```

Frontend จะรันที่: `http://localhost:8080`

## 🧪 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@test.com | admin123 |
| Owner | owner@test.com | owner123 |
| User | user@test.com | user123 |

## 📁 Project Structure

```
meeting-room-booking/
├── backend/
│   ├── server.js          # Express server
│   ├── package.json       # Dependencies
│   ├── .env               # Environment variables
│   └── uploads/           # Uploaded files
├── frontend/
│   ├── index.html         # Main HTML
│   ├── main.jsx           # React components
│   ├── index.css          # Styles
└── README.md              # Documentation
```

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/login` - เข้าสู่ระบบ

### Rooms
- `GET /api/rooms` - ดูห้องทั้งหมด
- `GET /api/rooms/:id` - ดูรายละเอียดห้อง

### Bookings
- `POST /api/bookings` - สร้างการจอง (พร้อมแนบไฟล์)
- `GET /api/bookings` - ดูกการจองทั้งหมด
- `GET /api/bookings/room/:roomId` - ดูการจองของห้องที่เฉพาะเจาะจง

### Approvals
- `GET /api/approvals/:ownerId` - ดูการจองที่รอลงรับ
- `PUT /api/bookings/:id/approve` - ลงรับการจอง
- `PUT /api/bookings/:id/reject` - ปฏิเสธการจอง

### Files
- `GET /uploads/:filename` - ดาวน์โหลดไฟล์

## 💡 Usage

### ผู้ใช้ (User)
1. เข้าสู่ระบบ
2. ดูห้องประชุมที่ใช้ได้
3. เลือกห้องและจอง
4. สามารถแนบไฟล์ได้
5. ติดตามสถานะการจองใน แท็บ "การจองของฉัน"

### เจ้าของห้อง (Owner)
1. เข้าสู่ระบบเป็น Owner
2. ไปยังแท็บ "ลงรับ"
3. ดูการจองที่รอลงรับ
4. ดูไฟล์แนบจากผู้จอง
5. ลงรับหรือปฏิเสธการจอง

## 📝 Notes

- ไฟล์จะถูกเก็บในโฟลเดอร์ `backend/uploads/`
- ฐานข้อมูลเป็นแบบ In-Memory (สามารถเปลี่ยนเป็น MongoDB ได้)
- สูงสุด 5 ไฟล์ต่อการจอง
- ขนาดไฟล์สูงสุด 50MB

## 🤝 Contributing

ยินดีต้อนรับการสนับสนุนและปรับปรุง!

## 📄 License

MIT License
