import React from 'react';

function Insight() {
  // Dữ liệu mẫu, sau này mình sẽ dùng axios để lấy từ Backend
  const stats = [
    { label: "Tổng số sách", value: "120", color: "primary", icon: "📚" },
    { label: "Thể loại", value: "08", color: "success", icon: "📂" },
    { label: "Sách đang mượn", value: "45", color: "warning", icon: "⏳" }
  ];

  return (
    <div className="row g-4">
      {stats.map((item, index) => (
        <div className="col-md-4" key={index}>
          <div className="card border-0 shadow-sm p-4 h-100">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted mb-1 fw-bold">{item.label}</p>
                <h2 className={`text-${item.color} mb-0`}>{item.value}</h2>
              </div>
              <span style={{ fontSize: '2.5rem' }}>{item.icon}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Insight;