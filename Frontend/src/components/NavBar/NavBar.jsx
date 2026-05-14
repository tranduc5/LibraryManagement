import React from 'react';

function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4 py-3">
      <div className="container-fluid">
        <form className="d-flex" style={{ width: '400px' }}>
          <input className="form-control me-2 border-0 bg-light" type="search" placeholder="Tìm kiếm sách..." aria-label="Search" />
        </form>
        <div className="d-flex align-items-center">
          <span className="me-3 text-muted">Hôm nay: 27/03/2026</span>
          <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
            TĐ
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;