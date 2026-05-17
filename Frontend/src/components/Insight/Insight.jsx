import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Insight() {
  const [data, setData] = useState({
    total_books: 0,
    total_categories: 0,
    active_borrows: 0
  });

  const fetchStats = async () => {
    try {
      // Nhớ thêm token nếu bạn để permission Backend là IsAuthenticated
      const token = localStorage.getItem('access_token');
      const res = await axios.get('http://127.0.0.1:8000/api/books/stats/', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setData(res.data);
    } catch (err) {
      console.error("Lỗi lấy thống kê:", err);
    }
  };

  useEffect(() => {
    fetchStats();
    // (Tùy chọn) Có thể thiết lập interval để cập nhật số liệu sau mỗi 30s
    // const interval = setInterval(fetchStats, 30000);
    // return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: "Tổng số sách trong kho", value: data.total_books, color: "primary", icon: "📚" },
    { label: "Thể loại sách", value: data.total_categories, color: "success", icon: "📂" },
    { label: "Sách đang được mượn", value: data.active_borrows, color: "warning", icon: "⏳" }
  ];

  return (
    <div className="row g-4 mb-4">
      {stats.map((item, index) => (
        <div className="col-md-4" key={index}>
          <div className="card border-0 shadow-sm p-4 h-100" style={{ borderRadius: '15px' }}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted mb-1 fw-bold text-uppercase small">{item.label}</p>
                <h2 className={`text-${item.color} mb-0 fw-bold`}>
                  {/* Nếu số < 10 thì thêm số 0 phía trước, nếu >= 100 thì hiện bình thường */}
                  {item.value < 10 && item.value >= 0 ? `0${item.value}` : item.value}
                </h2>
              </div>
              <span style={{ fontSize: '2.5rem', opacity: 0.8 }}>{item.icon}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Insight;