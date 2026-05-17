import React from 'react';

const SideBar = ({ activeMenu, setActiveMenu }) => {
  // Đồng bộ chuẩn 5 menu chính xác theo hình ảnh thực tế của bạn
  const menuItems = [
    { id: 'tong-quan', label: 'Tổng quan', icon: 'bi-house-door' },
    { id: 'quan-ly-sach', label: 'Quản lý sách', icon: 'bi-book' },
    { id: 'quan-ly-doc-gia', label: 'Quản lý độc giả', icon: 'bi-people' },
    { id: 'quan-ly-muon-tra', label: 'Quản lý mượn/trả', icon: 'bi-arrow-left-right' },
    { id: 'bao-cao-thong-ke', label: 'Báo cáo Thống kê', icon: 'bi-pie-chart' },
  ];

  return (
    <div className="bg-dark text-white vh-100 p-3 shadow" style={{ width: '260px', position: 'sticky', top: 0 }}>
      <div className="d-flex align-items-center mb-4 px-2 py-3">
        <span className="fs-4 fw-bold text-info">LMS Admin</span>
      </div>
      <hr className="text-secondary" />
      <ul className="nav nav-pills flex-column mb-auto">
        {menuItems.map((item) => (
          <li className="nav-item mb-2" key={item.id}>
            <button
              type="button"
              onClick={() => setActiveMenu(item.id)} // Truyền id menu lên trang cha Dashboard xử lý
              className={`nav-link w-100 text-start border-0 px-3 py-2 ${
                activeMenu === item.id ? 'active bg-primary text-white' : 'text-white'
              }`}
              style={{ borderRadius: '8px', transition: 'all 0.2s' }}
            >
              <i className={`bi ${item.icon} me-2`}></i>
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideBar;