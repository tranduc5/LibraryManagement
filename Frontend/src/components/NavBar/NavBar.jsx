import React from 'react';

const NavBar = ({ onSearch }) => {

  const handleLogout = () => {
    const confirmLogout = window.confirm("Trần Đức chắc chắn muốn đăng xuất chứ?");
    if (confirmLogout) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('is_staff');
      window.location.href = "/login";
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4 py-3">
      <div className="container-fluid">
        {/* Ô tìm kiếm sách */}
        <input 
          type="text" 
          className="form-control w-25 border-0 bg-light px-3 py-2" 
          placeholder="Tìm kiếm sách..." 
          onChange={(e) => {
            if (onSearch) {
              onSearch(e.target.value); // Gọi hàm an toàn
            }
          }}
          style={{ borderRadius: '8px' }}
        />
        
        <div className="d-flex align-items-center">
          <span className="me-4 fw-bold text-muted small">
            15/05/2026
          </span>
          
          <button 
            type="button"
            className="btn btn-outline-danger btn-sm fw-bold shadow-sm px-3 py-2"
            onClick={handleLogout}
            style={{ borderRadius: '8px' }}
          >
            Đăng xuất
          </button>

          <div className="ms-3 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '38px', height: '38px', fontSize: '14px' }}>
            A 
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;