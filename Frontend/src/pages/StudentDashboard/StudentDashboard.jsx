import React, { useState } from 'react';
import BookSearch from './components/BookSearch';
import BorrowedBooks from './components/BorrowedBooks';

const StudentDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('tra-cuu');

  const handleLogout = () => {
    if(window.confirm("Bạn chắc chắn muốn đăng xuất chứ?")) {
      localStorage.clear();
      window.location.href = '/login';
    }
  };

  return (
    <div className="d-flex">
      {/* 1. SIDEBAR ĐỘC GIẢ (USER SIDEBAR) */}
      <div className="text-white flex-shrink-0" style={{ width: '260px', minHeight: '100vh', backgroundColor: '#1e293b' }}>
        <div className="p-4 border-bottom border-secondary-subtle">
          <h4 className="fw-bold m-0 tracking-wide text-info" style={{ fontSize: '20px' }}>LMS Admin</h4>
        </div>
        
        <div className="d-flex flex-column gap-1 p-3">
          <button 
            className={`btn w-100 text-start py-2.5 px-3 border-0 d-flex align-items-center gap-3 rounded-2 text-white ${activeMenu === 'tra-cuu' ? 'bg-primary fw-bold' : 'bg-transparent opacity-75'}`}
            onClick={() => setActiveMenu('tra-cuu')}
            style={{ fontSize: '14px' }}
          >
            <i className="bi bi-search"></i> Tra cứu sách
          </button>
          
          <button 
            className={`btn w-100 text-start py-2.5 px-3 border-0 d-flex align-items-center gap-3 rounded-2 text-white ${activeMenu === 'dang-muon' ? 'bg-primary fw-bold' : 'bg-transparent opacity-75'}`}
            onClick={() => setActiveMenu('dang-muon')}
            style={{ fontSize: '14px' }}
          >
            <i className="bi bi-book-half"></i> Sách đang mượn
          </button>
        </div>
      </div>

      {/* 2. VÙNG NỘI DUNG CHÍNH (CONTENT AREA) */}
      <div className="flex-grow-1 bg-light min-vh-100 d-flex flex-column">
        {/* Topbar của Độc giả */}
        <div className="navbar bg-white border-bottom px-4 py-2.5 d-flex justify-content-between align-items-center shadow-sm">
          <div className="d-flex align-items-center" style={{ width: '300px' }}>
            <input type="text" className="form-control border bg-light small" placeholder="Tìm kiếm sách..." disabled />
            <button className="btn btn-primary btn-sm ms-2" disabled>Tìm</button>
          </div>
          
          <div className="d-flex align-items-center gap-3">
            <span className="text-secondary small fw-medium">15/05/2026</span>
            <button className="btn btn-outline-danger btn-sm fw-semibold px-3" onClick={handleLogout}>Đăng xuất</button>
            {/* Avatar vòng tròn xanh lá chữ SV */}
            <div 
              className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold shadow-sm"
              style={{ width: '38px', height: '38px', backgroundColor: '#22c55e', fontSize: '14px' }}
            >
              SV
            </div>
          </div>
        </div>

        {/* Thân trang hiển thị động */}
        <div className="p-4 flex-grow-1">
          {activeMenu === 'tra-cuu' && <BookSearch />}
          {activeMenu === 'dang-muon' && <BorrowedBooks />}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;