const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'image/jpeg', 'image/png'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('ไฟล์ประเภทนี้ไม่อนุญาต'));
    }
  }
});

// In-memory database (can be replaced with MongoDB)
const db = {
  users: [
    { id: 1, name: 'Admin', email: 'admin@test.com', password: 'admin123', role: 'admin' },
    { id: 2, name: 'Room Owner', email: 'owner@test.com', password: 'owner123', role: 'owner' },
    { id: 3, name: 'User', email: 'user@test.com', password: 'user123', role: 'user' }
  ],
  rooms: [
    { id: 1, name: 'ห้อง A', capacity: 10, ownerId: 2, description: 'ห้องประชุมขนาดเล็ก' },
    { id: 2, name: 'ห้อง B', capacity: 20, ownerId: 2, description: 'ห้องประชุมขนาดกลาง' },
    { id: 3, name: 'ห้อง C', capacity: 50, ownerId: 2, description: 'ห้องประชุมขนาดใหญ่' }
  ],
  bookings: [
    { 
      id: 1, 
      roomId: 1, 
      userId: 3, 
      userName: 'User',
      title: 'ประชุมทีม',
      description: 'ประชุมวางแผนโปรเจค',
      startTime: '2026-06-10T10:00:00',
      endTime: '2026-06-10T12:00:00',
      attendees: 5,
      attachments: [],
      status: 'pending', // pending, approved, rejected
      approvedBy: null,
      approvedAt: null,
      createdAt: '2026-06-09T08:00:00'
    }
  ]
};

let nextBookingId = 2;

// Routes

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find(u => u.email === email && u.password === password);
  
  if (user) {
    res.json({ 
      success: true, 
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } else {
    res.status(401).json({ success: false, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
  }
});

// Get all rooms
app.get('/api/rooms', (req, res) => {
  res.json(db.rooms);
});

// Get room by ID
app.get('/api/rooms/:id', (req, res) => {
  const room = db.rooms.find(r => r.id === parseInt(req.params.id));
  if (room) {
    res.json(room);
  } else {
    res.status(404).json({ message: 'ไม่พบห้อง' });
  }
});

// Create booking
app.post('/api/bookings', upload.array('attachments', 5), (req, res) => {
  const { userId, userName, roomId, title, description, startTime, endTime, attendees } = req.body;
  
  const attachments = req.files ? req.files.map(f => ({
    filename: f.filename,
    originalName: f.originalname,
    size: f.size,
    url: `/uploads/${f.filename}`
  })) : [];

  const booking = {
    id: nextBookingId++,
    userId: parseInt(userId),
    userName,
    roomId: parseInt(roomId),
    title,
    description,
    startTime,
    endTime,
    attendees: parseInt(attendees),
    attachments,
    status: 'pending',
    approvedBy: null,
    approvedAt: null,
    createdAt: new Date().toISOString()
  };

  db.bookings.push(booking);
  res.status(201).json(booking);
});

// Get all bookings
app.get('/api/bookings', (req, res) => {
  res.json(db.bookings);
});

// Get bookings by room ID
app.get('/api/bookings/room/:roomId', (req, res) => {
  const bookings = db.bookings.filter(b => b.roomId === parseInt(req.params.roomId));
  res.json(bookings);
});

// Get pending approvals for room owner
app.get('/api/approvals/:ownerId', (req, res) => {
  const ownerId = parseInt(req.params.ownerId);
  const ownerRooms = db.rooms.filter(r => r.ownerId === ownerId).map(r => r.id);
  const pendingBookings = db.bookings.filter(b => 
    ownerRooms.includes(b.roomId) && b.status === 'pending'
  );
  res.json(pendingBookings);
});

// Approve booking
app.put('/api/bookings/:id/approve', (req, res) => {
  const { approvedBy } = req.body;
  const booking = db.bookings.find(b => b.id === parseInt(req.params.id));
  
  if (booking) {
    booking.status = 'approved';
    booking.approvedBy = approvedBy;
    booking.approvedAt = new Date().toISOString();
    res.json(booking);
  } else {
    res.status(404).json({ message: 'ไม่พบการจอง' });
  }
});

// Reject booking
app.put('/api/bookings/:id/reject', (req, res) => {
  const { approvedBy } = req.body;
  const booking = db.bookings.find(b => b.id === parseInt(req.params.id));
  
  if (booking) {
    booking.status = 'rejected';
    booking.approvedBy = approvedBy;
    booking.approvedAt = new Date().toISOString();
    res.json(booking);
  } else {
    res.status(404).json({ message: 'ไม่พบการจอง' });
  }
});

// Download file
app.get('/uploads/:filename', (req, res) => {
  const filepath = path.join(uploadsDir, req.params.filename);
  res.download(filepath);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
