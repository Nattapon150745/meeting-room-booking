import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Login Component
function Login({ onLogin }) {
  const [email, setEmail] = useState('user@test.com');
  const [password, setPassword] = useState('user123');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    if (data.success) {
      onLogin(data.user);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">จองห้องประชุม</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">อีเมล</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="user@test.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">รหัสผ่าน</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="user123"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            เข้าสู่ระบบ
          </button>
        </form>
        <div className="mt-6 p-4 bg-gray-100 rounded-lg text-sm">
          <p className="font-bold mb-2">🧪 Test Accounts:</p>
          <p>👤 Admin: admin@test.com / admin123</p>
          <p>🏢 Owner: owner@test.com / owner123</p>
          <p>👥 User: user@test.com / user123</p>
        </div>
      </div>
    </div>
  );
}

// Dashboard Component
function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('rooms');
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    fetchRooms();
    fetchBookings();
    if (user.role === 'owner') {
      fetchApprovals();
    }
  }, []);

  const fetchRooms = async () => {
    const response = await fetch('http://localhost:5000/api/rooms');
    const data = await response.json();
    setRooms(data);
  };

  const fetchBookings = async () => {
    const response = await fetch('http://localhost:5000/api/bookings');
    const data = await response.json();
    setBookings(data);
  };

  const fetchApprovals = async () => {
    const response = await fetch(`http://localhost:5000/api/approvals/${user.id}`);
    const data = await response.json();
    setApprovals(data);
  };

  const handleApprove = async (bookingId) => {
    await fetch(`http://localhost:5000/api/bookings/${bookingId}/approve`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approvedBy: user.name })
    });
    fetchApprovals();
    fetchBookings();
  };

  const handleReject = async (bookingId) => {
    await fetch(`http://localhost:5000/api/bookings/${bookingId}/reject`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approvedBy: user.name })
    });
    fetchApprovals();
    fetchBookings();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">📅 ระบบจองห้องประชุม</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">👤 {user.name} ({user.role})</span>
            <button
              onClick={onLogout}
              className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg transition"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex gap-4 px-4">
          <button
            onClick={() => setActiveTab('rooms')}
            className={`px-4 py-3 font-medium transition ${
              activeTab === 'rooms'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🏢 ห้องประชุม
          </button>
          <button
            onClick={() => setActiveTab('booking')}
            className={`px-4 py-3 font-medium transition ${
              activeTab === 'booking'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ✏️ จองห้อง
          </button>
          <button
            onClick={() => setActiveTab('myBookings')}
            className={`px-4 py-3 font-medium transition ${
              activeTab === 'myBookings'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📋 การจองของฉัน
          </button>
          {user.role === 'owner' && (
            <button
              onClick={() => setActiveTab('approvals')}
              className={`px-4 py-3 font-medium transition relative ${
                activeTab === 'approvals'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              ✅ ลงรับ {approvals.length > 0 && <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{approvals.length}</span>}
            </button>
          )}
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto p-4">
        {/* Rooms Tab */}
        {activeTab === 'rooms' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">🏢 ห้องประชุมที่ใช้ได้</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map(room => (
                <div key={room.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                  <h3 className="text-xl font-bold mb-2">{room.name}</h3>
                  <p className="text-gray-600 mb-3">{room.description}</p>
                  <p className="text-sm text-gray-500 mb-4">👥 ความจุ: {room.capacity} คน</p>
                  <button
                    onClick={() => {
                      setSelectedRoom(room);
                      setActiveTab('booking');
                    }}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    จองห้องนี้
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Booking Form Tab */}
        {activeTab === 'booking' && <BookingForm user={user} rooms={rooms} selectedRoom={selectedRoom} onSuccess={() => { setActiveTab('myBookings'); fetchBookings(); }} />}

        {/* My Bookings Tab */}
        {activeTab === 'myBookings' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">📋 การจองของฉัน</h2>
            <div className="space-y-4">
              {bookings.filter(b => b.userId === user.id).map(booking => (
                <BookingCard key={booking.id} booking={booking} rooms={rooms} />
              ))}
            </div>
          </div>
        )}

        {/* Approvals Tab */}
        {activeTab === 'approvals' && user.role === 'owner' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">✅ การลงรับการจอง</h2>
            <div className="space-y-4">
              {approvals.map(booking => (
                <div key={booking.id} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{booking.title}</h3>
                      <p className="text-gray-600">ผู้จอง: {booking.userName}</p>
                      <p className="text-sm text-gray-500">ห้อง: {rooms.find(r => r.id === booking.roomId)?.name}</p>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">รอลงรับ</span>
                  </div>
                  <p className="text-gray-600 mb-2">📝 {booking.description}</p>
                  <p className="text-sm text-gray-500 mb-2">⏰ {new Date(booking.startTime).toLocaleString('th-TH')} - {new Date(booking.endTime).toLocaleTimeString('th-TH')}</p>
                  <p className="text-sm text-gray-500 mb-4">👥 จำนวนผู้เข้าร่วม: {booking.attendees} คน</p>
                  
                  {booking.attachments.length > 0 && (
                    <div className="mb-4 p-3 bg-gray-100 rounded-lg">
                      <p className="text-sm font-medium mb-2">📎 ไฟล์แนบ:</p>
                      {booking.attachments.map((file, idx) => (
                        <a key={idx} href={`http://localhost:5000${file.url}`} className="text-blue-600 hover:underline text-sm block">
                          📄 {file.originalName}
                        </a>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(booking.id)}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      ✅ ลงรับ
                    </button>
                    <button
                      onClick={() => handleReject(booking.id)}
                      className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                    >
                      ❌ ปฏิเสธ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Booking Form Component
function BookingForm({ user, rooms, selectedRoom, onSuccess }) {
  const [formData, setFormData] = useState({
    roomId: selectedRoom?.id || '',
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    attendees: ''
  });
  const [files, setFiles] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataObj = new FormData();
    formDataObj.append('userId', user.id);
    formDataObj.append('userName', user.name);
    formDataObj.append('roomId', formData.roomId);
    formDataObj.append('title', formData.title);
    formDataObj.append('description', formData.description);
    formDataObj.append('startTime', formData.startTime);
    formDataObj.append('endTime', formData.endTime);
    formDataObj.append('attendees', formData.attendees);
    
    files.forEach(file => {
      formDataObj.append('attachments', file);
    });

    const response = await fetch('http://localhost:5000/api/bookings', {
      method: 'POST',
      body: formDataObj
    });

    if (response.ok) {
      alert('✅ จองห้องสำเร็จ!');
      onSuccess();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">✏️ จองห้องประชุม</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">เลือกห้องประชุม</label>
          <select
            value={formData.roomId}
            onChange={(e) => setFormData({...formData, roomId: e.target.value})}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- เลือกห้อง --</option>
            {rooms.map(room => (
              <option key={room.id} value={room.id}>{room.name} (ความจุ {room.capacity} คน)</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">หัวข้อการประชุม</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="เช่น ประชุมวางแผนโปรเจค"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">รายละเอียด</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="รายละเอียดของการประชุม"
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">วันเวลาเริ่มต้น</label>
            <input
              type="datetime-local"
              value={formData.startTime}
              onChange={(e) => setFormData({...formData, startTime: e.target.value})}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">วันเวลาสิ้นสุด</label>
            <input
              type="datetime-local"
              value={formData.endTime}
              onChange={(e) => setFormData({...formData, endTime: e.target.value})}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">จำนวนผู้เข้าร่วม</label>
          <input
            type="number"
            value={formData.attendees}
            onChange={(e) => setFormData({...formData, attendees: e.target.value})}
            required
            min="1"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">📎 แนบไฟล์ (ไม่บังคับ)</label>
          <input
            type="file"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files))}
            className="w-full px-4 py-2 border rounded-lg"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
          />
          <p className="text-xs text-gray-500 mt-1">ได้รับ: PDF, Word, Excel, รูปภาพ (สูงสุด 50MB)</p>
          {files.length > 0 && (
            <div className="mt-2 space-y-1">
              {files.map((file, idx) => (
                <p key={idx} className="text-sm text-gray-600">✓ {file.name}</p>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          ส่งการจอง
        </button>
      </form>
    </div>
  );
}

// Booking Card Component
function BookingCard({ booking, rooms }) {
  const room = rooms.find(r => r.id === booking.roomId);
  const statusColor = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold">{booking.title}</h3>
          <p className="text-gray-600">ห้อง: {room?.name}</p>
        </div>
        <span className={`${statusColor[booking.status]} px-3 py-1 rounded-full text-sm font-medium`}>
          {booking.status === 'pending' && '⏳ รอลงรับ'}
          {booking.status === 'approved' && '✅ ลงรับแล้ว'}
          {booking.status === 'rejected' && '❌ ปฏิเสธ'}
        </span>
      </div>
      <p className="text-gray-600 mb-2">📝 {booking.description}</p>
      <p className="text-sm text-gray-500 mb-2">⏰ {new Date(booking.startTime).toLocaleString('th-TH')} - {new Date(booking.endTime).toLocaleTimeString('th-TH')}</p>
      <p className="text-sm text-gray-500 mb-2">👥 จำนวนผู้เข้าร่วม: {booking.attendees} คน</p>
      
      {booking.attachments.length > 0 && (
        <div className="p-3 bg-gray-100 rounded-lg">
          <p className="text-sm font-medium mb-2">📎 ไฟล์แนบ:</p>
          {booking.attachments.map((file, idx) => (
            <a key={idx} href={`http://localhost:5000${file.url}`} className="text-blue-600 hover:underline text-sm block">
              📄 {file.originalName}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// Main App
function App() {
  const [user, setUser] = useState(null);

  return user ? (
    <Dashboard user={user} onLogout={() => setUser(null)} />
  ) : (
    <Login onLogin={setUser} />
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
