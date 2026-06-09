# 📅 Meeting Room Booking System

ระบบจองห้องประชุมแบบฟรี ที่มีฟีเจอร์ครบครัน

## ✨ ฟีเจอร์

✅ **จองห้องประชุม** - ระบบการจองห้องแบบสมบูรณ์  
✅ **แนบไฟล์** - สามารถแนบเอกสาร, สไลด์, รูปภาพ ได้  
✅ **ลงรับการจอง** - ทั้งผู้จองและเจ้าของห้องสามารถลงรับได้  
✅ **Responsive Design** - ใช้ได้ทั้ง Web และ Mobile  
✅ **ฟรีใช้งาน** - Open Source  

## 🚀 วิธีติดตั้ง

### Backend Setup

```bash
cd backend
npm install
npm start
```

เซิร์ฟเวอร์จะรันที่ http://localhost:5000

### Frontend Setup

ใช้ Live Server เพื่อรัน `frontend/index.html`

```bash
# ถ้าใช้ VS Code
# 1. Install Live Server extension
# 2. Right-click on index.html
# 3. Select "Open with Live Server"
```

แอป Frontend จะรันที่ http://localhost:3000 (หรือ port ที่ Live Server กำหนด)

## 🧪 Test Accounts

| บทบาท | อีเมล | รหัสผ่าน |
|------|-------|----------|
| Admin | admin@test.com | admin123 |
| Room Owner | owner@test.com | owner123 |
| User | user@test.com | user123 |

## 📂 โครงสร้างไฟล์

```
meeting-room-booking/
├── backend/
│   ├── server.js          # Server หลัก
│   ├── package.json       # Dependencies
│   ├── .env               # Environment variables
│   └── uploads/           # โฟลเดอร์สำหรับเก็บไฟล์ที่แนบ
├── frontend/
│   ├── index.html         # HTML หลัก
│   ├── main.jsx           # React App
│   └── index.css          # Styling
└── README.md
```

## 🔧 ฟีเจอร์รายละเอียด

### สำหรับผู้ใช้ทั่วไป
- ดูรายชื่อห้องประชุมที่มีอยู่
- จองห้องประชุมตามวันเวลาที่ต้องการ
- เพิ่มรายละเอียดและแนบไฟล์ประกอบ
- ดูสถานะการจอง (รอลงรับ/ลงรับแล้ว/ปฏิเสธ)

### สำหรับเจ้าของห้อง
- ดูการจองทั้งหมดของห้องที่เป็นเจ้าของ
- ลงรับหรือปฏิเสธการจอง
- ดูรายละเอียดและไฟล์แนบของการจอง

## 🛠 Tech Stack

- **Frontend:** React 18, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** In-memory (สามารถเปลี่ยนเป็น MongoDB ได้)
- **File Upload:** Multer
- **Styling:** Tailwind CSS

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - เข้าสู่ระบบ

### Rooms
- `GET /api/rooms` - ดูรายชื่อห้องทั้งหมด
- `GET /api/rooms/:id` - ดูรายละเอียดห้อง

### Bookings
- `POST /api/bookings` - สร้างการจอง
- `GET /api/bookings` - ดูการจองทั้งหมด
- `GET /api/bookings/room/:roomId` - ดูการจองของห้องที่กำหนด
- `PUT /api/bookings/:id/approve` - ลงรับการจอง
- `PUT /api/bookings/:id/reject` - ปฏิเสธการจอง

### Approvals
- `GET /api/approvals/:ownerId` - ดูการจองที่รอลงรับ

## 📦 File Upload

สามารถแนบไฟล์ประเภท:
- PDF (.pdf)
- Word (.doc, .docx)
- Excel (.xls, .xlsx)
- รูปภาพ (.jpg, .png)

ขนาดไฟล์สูงสุด: **50MB**

## 🚀 ขั้นตอนแรก

1. Clone Repository
   ```bash
   git clone https://github.com/Nattapon150745/meeting-room-booking.git
   ```

2. ติดตั้ง Backend Dependencies
   ```bash
   cd backend
   npm install
   ```

3. สตาร์ท Backend
   ```bash
   npm start
   ```

4. เปิด Frontend ด้วย Live Server
   - Backend: http://localhost:5000
   - Frontend: http://localhost:5500 (หรือ port ที่ Live Server ใช้)

5. ลองใช้ Account ทดสอบ
   - Email: user@test.com
   - Password: user123

## 📄 License

MIT License - ใช้งานได้อย่างอิสระ

## 👨‍💻 Author

สร้างโดย Nattapon150745

---

**สนใจพัฒนาเพิ่มเติมหรือมีข้อเสนอแนะ?** ✉️
