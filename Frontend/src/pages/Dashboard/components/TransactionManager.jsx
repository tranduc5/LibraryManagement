import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionManager = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchStudentCode, setSearchStudentCode] = useState('');
  const [statusFilter, setStatusFilter] = useState('Đang mượn'); // Mặc định khớp theo bộ lọc hiển thị ban đầu của bạn

  const token = localStorage.getItem('access_token');

  // 1. Hàm tải toàn bộ giao dịch mượn/trả của hệ thống dành cho Admin
  const fetchTransactions = async () => {
    if (!token) return;
    try {
      const params = new URLSearchParams();
      
      // Gửi từ khóa tìm kiếm mã sinh viên / tên lên Django
      if (searchStudentCode && searchStudentCode.trim() !== '') {
        params.append('search', searchStudentCode.trim());
      }
      
      // Gửi bộ lọc trạng thái (Đang mượn / Đã trả) lên Django
      if (statusFilter) {
        params.append('status', statusFilter);
      }

      const url = `http://127.0.0.1:8000/api/transactions/${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Đón nhận dữ liệu mảng linh hoạt (có hoặc không phân trang)
      const rawData = res.data.results || res.data || [];
      setTransactions(rawData);
    } catch (err) {
      console.error("Lỗi khi tải danh sách giao dịch phía Admin:", err);
    }
  };

  // Tự động re-fetch dữ liệu khi Admin gõ tìm kiếm hoặc thay đổi bộ lọc trạng thái
  useEffect(() => {
    fetchTransactions();
  }, [searchStudentCode, statusFilter]);

  // 2. Hàm xử lý Nhận trả sách thông thường (Trong hạn - Nút màu Tím)
  const handleReturnBook = async (transactionId, bookTitle) => {
    if (window.confirm(`Xác nhận thu hồi sách "${bookTitle}" về kho?`)) {
      try {
        await axios.post(`http://127.0.0.1:8000/api/transactions/${transactionId}/return_book/`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Đã nhận trả sách và hoàn số lượng về kho thành công!");
        fetchTransactions(); // Làm mới bảng
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.error || "Gặp lỗi khi xử lý hoàn trả sách!");
      }
    }
  };

  // 3. Hàm xử lý Thu phạt & Nhận trả sách (Quá hạn - Nút màu Xanh biển)
  const handlePayFineAndReturn = async (transactionId, bookTitle, fineAmount) => {
    const confirmMsg = `Phiếu mượn sách "${bookTitle}" đã quá hạn.\nTổng số tiền phạt: ${fineAmount.toLocaleString()} đ.\nXác nhận ĐÃ THU TIỀN PHẠT và thu hồi sách về kho?`;
    
    if (window.confirm(confirmMsg)) {
      try {
        await axios.post(`http://127.0.0.1:8000/api/transactions/${transactionId}/return_book/`, {
          pay_fine: true,
          amount_paid: fineAmount
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Đã hoàn tất thu phạt và nhận trả sách thành công!");
        fetchTransactions(); // Làm mới bảng
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.error || "Gặp lỗi khi xử lý thu phạt!");
      }
    }
  };

  return (
    <div>
      {/* Tiêu đề trang quản lý */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold m-0" style={{ color: '#111827' }}>Quản Lý Giao Dịch Mượn/Trả</h3>
        <button 
          className="btn btn-success fw-semibold px-4 py-2" 
          style={{ backgroundColor: '#22c55e', border: 'none', borderRadius: '6px' }}
          onClick={() => alert("Admin có thể lập phiếu mượn trực tiếp tại đây...")}
        >
          + Tạo Phiếu Mượn
        </button>
      </div>

      {/* Thanh bộ lọc dữ liệu */}
      <div className="bg-white p-4 rounded-3 shadow-sm border">
        <div className="d-flex gap-3 mb-4 align-items-center">
          <input 
            type="text" 
            className="form-control border bg-light text-muted" 
            placeholder="Tìm theo Mã SV..." 
            value={searchStudentCode}
            onChange={(e) => setSearchStudentCode(e.target.value)}
            style={{ width: '280px', borderRadius: '6px' }}
          />
          
          <div className="d-flex align-items-center gap-2 ms-2">
            <span className="text-secondary small fw-semibold text-nowrap">Trạng thái:</span>
            <select 
              className="form-select border bg-light text-muted" 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: '180px', borderRadius: '6px' }}
            >
              <option value="Đang mượn">Đang mượn</option>
              <option value="Đã trả">Đã trả</option>
            </select>
          </div>
        </div>

        {/* Bảng danh sách phiếu mượn */}
        <div className="table-responsive">
          <table className="table table-hover align-middle m-0">
            <thead>
              <tr className="text-secondary" style={{ backgroundColor: '#fafafa', fontSize: '14px' }}>
                <th className="py-3 px-3" style={{ width: '110px' }}>Mã Phiếu</th>
                <th className="py-3">Độc giả</th>
                <th className="py-3">Sách mượn</th>
                <th className="py-3">Thể loại</th>
                <th className="py-3">Ngày mượn</th>
                <th className="py-3">Hạn trả</th>
                <th className="py-3">Tiền phạt</th>
                <th className="py-3 text-center" style={{ width: '180px' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '14px' }}>
              {transactions.length > 0 ? (
                transactions.map((item) => {
                  // Trích xuất dữ liệu an toàn tránh lỗi dữ liệu lồng nhau (Nested object chaining)
                  const pCode = item.code || `PM00${item.id}`;
                  const studentCode = item.user_detail?.username || item.student_code || 'B22DCCNxxx';
                  const studentName = item.user_detail?.first_name || item.student_name || 'Độc giả';
                  const bookTitle = item.book_detail?.title || item.book_title || 'Tên sách';
                  const catName = item.book_detail?.category_detail?.name || item.category || 'Chưa phân loại';
                  
                  const fine = parseInt(item.fine_amount || item.fine) || 0;
                  const isOverdue = fine > 0;

                  return (
                    <tr key={item.id}>
                      <td className="py-3 px-3 fw-bold text-dark">{pCode}</td>
                      <td className="py-3 text-secondary">
                        <div className="fw-bold text-dark" style={{ fontSize: '13px' }}>{studentCode}</div>
                        <div className="text-muted small">{studentName}</div>
                      </td>
                      <td className="py-3 fw-bold text-dark">{bookTitle}</td>
                      <td className="py-3 text-muted">{catName}</td>
                      <td className="py-3 text-secondary">{item.borrow_date || item.created_at}</td>
                      <td className={`py-3 ${isOverdue ? 'text-danger fw-bold' : 'text-secondary'}`}>
                        {item.due_date}
                      </td>
                      <td className="py-3">
                        {isOverdue ? (
                          <span className="text-danger fw-bold">{fine.toLocaleString()} đ</span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td className="py-3 text-center">
                        {item.status === 'Đã trả' ? (
                          <span className="badge bg-light text-success border border-success-subtle px-3 py-1.5 rounded-pill fw-medium">
                            Đã trả sách
                          </span>
                        ) : isOverdue ? (
                          /* Nút Thu Phạt màu xanh biển giống ảnh mẫu của Đức */
                          <button 
                            type="button" 
                            className="btn btn-sm btn-primary fw-semibold px-3 py-1.5 shadow-sm w-100 text-nowrap"
                            style={{ backgroundColor: '#4f46e5', border: 'none', borderRadius: '6px', fontSize: '12px' }}
                            onClick={() => handlePayFineAndReturn(item.id, bookTitle, fine)}
                          >
                            Thu phạt & Nhận trả
                          </button>
                        ) : (
                          /* Nút Nhận Trả Sách thông thường màu Tím giống ảnh mẫu của Đức */
                          <button 
                            type="button" 
                            className="btn btn-sm text-white fw-semibold px-3 py-1.5 shadow-sm w-100 text-nowrap"
                            style={{ backgroundColor: '#6366f1', border: 'none', borderRadius: '6px', fontSize: '12px' }}
                            onClick={() => handleReturnBook(item.id, bookTitle)}
                          >
                            Nhận trả sách
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-5 text-muted small">
                    Hệ thống hiện tại chưa ghi nhận giao dịch mượn/trả nào phù hợp...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionManager;