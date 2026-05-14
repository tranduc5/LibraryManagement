import React from 'react';

function SideBar() {
  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style={{ width: '280px', minHeight: '100vh' }}>
      <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        <span className="fs-4 fw-bold">📚 LMS Admin</span>
      </a>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item mb-2">
          <a href="#" className="nav-link active" aria-current="page">🏠 Tổng quan</a>
        </li>
        <li className="mb-2">
          <a href="#" className="nav-link text-white">📖 Quản lý sách</a>
        </li>
        <li className="mb-2">
          <a href="#" className="nav-link text-white">🏷️ Thể loại</a>
        </li>
      </ul>
      <hr />
      <div className="dropdown">
        <strong className="text-info">Chào Trần Đức!</strong>
      </div>
    </div>
  );
}

export default SideBar;