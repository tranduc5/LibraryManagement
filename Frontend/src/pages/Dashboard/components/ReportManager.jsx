import React, { useState } from 'react';

const ReportManager = () => {
  // Mock dữ liệu thống kê tổng hợp cho hệ thống thư viện
  const [kpis] = useState({
    totalBorrows: 142,
    onTimeReturns: 115,
    overdueTickets: 12,
    totalFines: 450000
  });

  const [topBooks] = useState([
    { id: 1, title: 'Lập trình C++', borrows: 45, category: 'Công nghệ thông tin' },
    { id: 2, title: 'Lập trình Python', borrows: 32, category: 'Công nghệ thông tin' },
    { id: 3, title: 'Toán học rời rạc', borrows: 28, category: 'Khoa học cơ bản' }
  ]);

  const [detailedStats] = useState([
    { criteria: 'Sách được mượn nhiều nhất', value: 'Lập trình C++', change: '+15%', status: 'Đang tăng', statusColor: 'text-success' },
    { criteria: 'Người mượn tích cực nhất', value: 'Nguyễn Văn A', change: '8 cuốn', status: 'Tiềm năng', statusColor: 'text-primary' },
    { criteria: 'Tiền phạt đã thu', value: '450,000 đ', change: '-5%', status: 'Ổn định', statusColor: 'text-secondary' },
    { criteria: 'Số lượt mượn mới', value: '142 lượt', change: '+12%', status: 'Vượt mục tiêu', statusColor: 'text-success' }
  ]);

  const handleExportExcel = () => {
    alert("Hệ thống đang trích xuất file Excel báo cáo thống kê...");
  };

  return (
    <div>
      {/* Tiêu đề trang & Nút xuất báo cáo */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold m-0" style={{ color: '#111827', fontSize: '24px' }}>Báo Cáo Thống Kê Hoạt Động</h3>
        <button 
          className="btn btn-outline-primary fw-semibold px-4 py-2 d-flex align-items-center gap-2"
          onClick={handleExportExcel}
          style={{ borderRadius: '6px', fontSize: '14px' }}
        >
          <i className="bi bi-file-earmark-excel"></i> Xuất Báo Cáo Excel
        </button>
      </div>

      {/* 1. Hàng thẻ chỉ số tổng quan (KPI Cards) */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <div className="text-muted small text-uppercase fw-semibold tracking-wider mb-2">Tổng lượt mượn</div>
            <div className="d-flex align-items-baseline gap-2">
              <span className="fs-2 fw-bold text-dark">{kpis.totalBorrows}</span>
              <span className="text-success small fw-semibold"><i className="bi bi-arrow-up"></i> +12%</span>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <div className="text-muted small text-uppercase fw-semibold tracking-wider mb-2">Trả đúng hạn</div>
            <div className="d-flex align-items-baseline gap-2">
              <span className="fs-2 fw-bold text-dark">{kpis.onTimeReturns}</span>
              <span className="text-muted small fw-semibold">Tỷ lệ: 80.9%</span>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <div className="text-muted small text-uppercase fw-semibold tracking-wider mb-2">Đang quá hạn</div>
            <div className="d-flex align-items-baseline gap-2">
              <span className="fs-2 fw-bold text-danger">{kpis.overdueTickets}</span>
              <span className="text-danger small fw-semibold"><i className="bi bi-arrow-down"></i> -3%</span>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <div className="text-muted small text-uppercase fw-semibold tracking-wider mb-2">Tổng tiền phạt thu</div>
            <div className="d-flex align-items-baseline gap-2">
              <span className="fs-2 fw-bold text-success">{kpis.totalFines.toLocaleString()} đ</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Khối đồ thị trực quan & Top sách mượn nhiều nhất */}
      <div className="row g-4 mb-4">
        {/* Biểu đồ SVG xu hướng mượn sách */}
        <div className="col-12 col-lg-8">
          <div className="card border shadow-sm rounded-3 p-4 bg-white h-100">
            <h5 className="fw-bold text-dark mb-4" style={{ fontSize: '16px' }}>Xu Hướng Mượn / Trả Sách Theo Tuần</h5>
            
            <div className="w-100 d-flex justify-content-center align-items-center" style={{ minHeight: '260px' }}>
              <svg viewBox="0 0 800 260" className="w-100 h-100">
                <defs>
                  <linearGradient id="chart-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.15 }} />
                    <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0 }} />
                  </linearGradient>
                </defs>
                {/* Lưới tọa độ ngang */}
                <line x1="50" y1="50" x2="750" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="50" y1="120" x2="750" y2="120" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="50" y1="190" x2="750" y2="190" stroke="#f1f5f9" strokeWidth="1" />
                
                {/* Đường vùng và đường vẽ xu hướng (Mượn sách) */}
                <path d="M 50 180 Q 250 80 450 140 T 750 60 L 750 190 L 50 190 Z" fill="url(#chart-grad)" />
                <path d="M 50 180 Q 250 80 450 140 T 750 60" fill="none" stroke="#3b82f6" strokeWidth="3.5" strokeLinecap="round" />
                
                {/* Đường nét đứt xu hướng (Trả sách) */}
                <path d="M 50 150 Q 250 140 450 160 T 750 110" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="6,4" />
                
                {/* Trục hoành tên các tuần */}
                <g fill="#94a3b8" fontSize="13" textAnchor="middle">
                  <text x="50" y="225">Tuần 1</text>
                  <text x="283" y="225">Tuần 2</text>
                  <text x="516" y="225">Tuần 3</text>
                  <text x="750" y="225">Tuần 4</text>
                </g>
              </svg>
            </div>
            <div className="d-flex gap-4 justify-content-center mt-2 small text-secondary">
              <span className="d-flex align-items-center gap-1.5"><span className="rounded-circle bg-primary" style={{ width: '10px', height: '10px', display:'inline-block' }}></span> Số lượt mượn</span>
              <span className="d-flex align-items-center gap-1.5"><span className="rounded" style={{ width: '15px', height: '3px', backgroundColor: '#94a3b8', display:'inline-block' }}></span> Số lượt trả</span>
            </div>
          </div>
        </div>

        {/* Cột danh sách Top Sách */}
        <div className="col-12 col-lg-4">
          <div className="card border shadow-sm rounded-3 p-4 bg-white h-100">
            <h5 className="fw-bold text-dark mb-4" style={{ fontSize: '16px' }}>Top Đầu Sách Mượn Nhiều</h5>
            
            <div className="d-flex flex-column gap-3">
              {topBooks.map((book) => (
                <div key={book.id} className="d-flex align-items-center justify-content-between p-2 rounded-2 bg-light-subtle border-bottom">
                  <div className="d-flex align-items-center gap-3">
                    <span 
                      className="d-flex align-items-center justify-content-center fw-bold rounded-circle text-white"
                      style={{ 
                        width: '30px', 
                        height: '30px', 
                        fontSize: '13px',
                        backgroundColor: book.id === 1 ? '#ef4444' : book.id === 2 ? '#f59e0b' : '#3b82f6' 
                      }}
                    >
                      {book.id}
                    </span>
                    <div>
                      <div className="fw-bold text-dark" style={{ fontSize: '14px' }}>{book.title}</div>
                      <div className="text-muted" style={{ fontSize: '12px' }}>{book.category}</div>
                    </div>
                  </div>
                  <span className="badge bg-secondary-subtle text-secondary px-2.5 py-1.5 rounded fw-semibold" style={{ fontSize: '13px' }}>
                    {book.borrows} lượt
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bảng phân tích chi tiết dữ liệu hoạt động */}
      <div className="bg-white p-4 rounded-3 shadow-sm border">
        <h5 className="fw-bold text-dark mb-4" style={{ fontSize: '16px' }}>Bảng Phân Tích Chỉ Số Chi Tiết</h5>
        
        <div className="table-responsive">
          <table className="table table-hover align-middle m-0">
            <thead>
              <tr className="text-secondary" style={{ backgroundColor: '#f9fafb', fontSize: '14px' }}>
                <th className="py-3 px-3 fw-semibold">Chỉ số hoạt động</th>
                <th className="py-3 fw-semibold">Chi tiết ghi nhận</th>
                <th className="py-3 fw-semibold">Thay đổi định kỳ</th>
                <th className="py-3 fw-semibold">Đánh giá trạng thái</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '14px' }}>
              {detailedStats.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-3 px-3 fw-semibold text-dark">{item.criteria}</td>
                  <td className="py-3 text-secondary">{item.value}</td>
                  <td className="py-3 fw-bold text-dark">{item.change}</td>
                  <td className="py-3">
                    <span className={`fw-semibold ${item.statusColor}`}>
                      • {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportManager;