import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BorrowedBooks = () => {
  const [loading, setLoading] = useState(true);
  const [studentInfo, setStudentInfo] = useState({
    name: 'Sinh viên',
    borrowingCount: 0,
    returnedCount: 0,
    fineAmount: 0
  });
  const [borrowedList, setBorrowedList] = useState([]);

  // Lấy mã Token từ trình duyệt để xác thực danh tính sinh viên với Django
  const token = localStorage.getItem('access_token');

  const fetchStudentData = async () => {
    if (!token) {
      console.error("Không tìm thấy token đăng nhập!");
      setLoading(false);
      return;
    }

    try {
      // Gọi API lấy toàn bộ các giao dịch mượn trả của riêng sinh viên này
      const res = await axios.get('http://127.0.0.1:8000/api/transactions/', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const allTransactions = res.data.results || res.data || [];

      // 1. Phân loại mảng dữ liệu để tính toán số liệu cho 3 khối thẻ thống kê
      const currentBorrowing = allTransactions.filter(item => item.status === 'Đang mượn');
      const historyReturned = allTransactions.filter(item => item.status === 'Đã trả');

      // Cộng dồn tính tổng tiền phạt tích lũy từ các phiếu quá hạn
      const totalFine = currentBorrowing.reduce((sum, item) => {
        return sum + (parseInt(item.fine_amount || item.fine) || 0);
      }, 0);

      // Lấy tên hiển thị của Sinh viên từ log bản ghi đầu tiên gửi về
      let studentName = "Độc giả PTIT";
      if (allTransactions.length > 0) {
        const firstRecord = allTransactions[0];
        studentName = firstRecord.user_detail?.first_name || firstRecord.student_name || "Nguyễn Văn A";
      }

      setStudentInfo({
        name: studentName,
        borrowingCount: currentBorrowing.length,
        returnedCount: historyReturned.length,
        fineAmount: totalFine
      });

      // 2. Định dạng lại danh sách sách đang mượn thực tế để đổ xuống bảng động
      const formattedList = currentBorrowing.map(item => {
        const fine = parseInt(item.fine_amount || item.fine) || 0;
        
        let statusText = 'Đang trong hạn';
        let statusClass = 'bg-success-subtle text-success border border-success-subtle';
        let isOverdue = false;

        // Nếu trường phạt tiền > 0, chứng tỏ hệ thống Backend đã tính toán quá hạn
        if (fine > 0) {
          isOverdue = true;
          statusClass = 'bg-danger-subtle text-danger border border-danger-subtle fw-bold';
          
          // Kiểm tra xem Backend có trả kèm số ngày quá hạn cụ thể hay không
          if (item.overdue_days) {
            statusText = `Quá hạn ${item.overdue_days} ngày`;
          } else {
            statusText = `Quá hạn`;
          }
        } else if (item.is_near_due || item.status_label === 'Sắp đến hạn') {
          // Logic kiểm tra trạng thái sắp đến hạn
          statusText = 'Sắp đến hạn';
          statusClass = 'bg-warning-subtle text-warning border border-warning-subtle fw-semibold';
        }

        return {
          id: item.id,
          title: item.book_detail?.title || item.book_title || 'Tên đầu sách',
          borrowDate: item.borrow_date || item.created_at,
          dueDate: item.due_date,
          statusText: statusText,
          statusClass: statusClass,
          isOverdue: isOverdue
        };
      });

      setBorrowedList(formattedList);
      setLoading(false);
    } catch (err) {
      console.error("Lỗi nghiêm trọng khi tải thông tin hồ sơ sinh viên:", err);
      setLoading(false);
    }
  };

  // Kích hoạt hàm fetch dữ liệu ngay khi sinh viên truy cập vào menu Tab
  useEffect(() => {
    fetchStudentData();
  }, []);

  if (loading) {
    return <div className="p-5 text-center text-muted small fw-semibold">Đang tải dữ liệu hồ sơ cá nhân...</div>;
  }

  return (
    <div>
      <h3 className="fw-bold mb-4 text-dark" style={{ fontSize: '22px' }}>Hồ sơ cá nhân: {studentInfo.name}</h3>

      {/* KHỐI 3 THẺ SỐ LIỆU THỐNG KÊ TOÀN DIỆN */}
      <div className="row g-3 mb-4">
        {/* Thẻ 1: Đang mượn */}
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-4 bg-white text-center">
            <div className="text-muted small mb-2 fw-medium">Đang mượn</div>
            <div className="d-flex align-items-baseline justify-content-center gap-1">
              <span className="fs-1 fw-bold text-primary">{studentInfo.borrowingCount}</span>
              <span className="text-muted small">cuốn</span>
            </div>
          </div>
        </div>
        
        {/* Thẻ 2: Đã trả (Lịch sử) */}
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-4 bg-white text-center">
            <div className="text-muted small mb-2 fw-medium">Đã trả (Lịch sử)</div>
            <div className="d-flex align-items-baseline justify-content-center gap-1">
              <span className="fs-1 fw-bold text-success">{studentInfo.returnedCount}</span>
              <span className="text-muted small">cuốn</span>
            </div>
          </div>
        </div>

        {/* Thẻ 3: Nợ phạt tích lũy */}
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-4 bg-white text-center">
            <div className="text-muted small mb-2 fw-medium text-danger">Nợ phạt</div>
            <div className="d-flex align-items-baseline justify-content-center gap-1">
              <span className="fs-1 fw-bold text-danger">{studentInfo.fineAmount.toLocaleString()}</span>
              <span className="text-danger small fw-semibold">VNĐ</span>
            </div>
          </div>
        </div>
      </div>

      {/* BẢNG DANH SÁCH CHI TIẾT SÁCH THỰC TẾ SINH VIÊN ĐANG GIỮ */}
      <div className="bg-white p-4 rounded-3 shadow-sm border">
        <div className="d-flex align-items-center gap-2 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#2563eb" className="bi bi-clock-history" viewBox="0 0 16 16">
            <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7 7 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342zm1.37.71a7 7 0 0 0-.439-.27l.493-.87a8 8 0 0 1 .979.654l-.615.789a7 7 0 0 0-.418-.302zm1.834 1.79a7 7 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 2.118a7 7 0 0 0-.307-.442l.774-.634c.144.175.275.361.392.555zm.415 1.45a7 7 0 0 0-.115-.435l.947-.326c.047.137.087.276.12.417zm.154 1.496a7 7 0 0 0-.025-.433l.994-.11c.01.043.018.087.024.131zm-.025 1.05a7 7 0 0 0 .025-.433l.996.11a8 8 0 0 1-.024.13zm-.115 1.015c.044-.14.084-.28.115-.435l.947.326c-.04.14-.087.278-.131.413zm-.307 1.012c.144-.176.275-.361.392-.555l.774.634a8 8 0 0 1-.442.548zm-.653.796c.27-.285.52-.59.747-.91l.818.576a8 8 0 0 1-.61.737zm-.78.615a7 7 0 0 0-.419-.303l.493-.87c.28.16.547.338.802.533zm-1.015.439a7 7 0 0 0-.44-.271l.22-.975c.35.08.694.184 1.025.312zm-1.05.253c.14-.044.282-.085.42-.115l.327.948a8 8 0 0 1-.413.13zm-1.45.115a7 7 0 0 0-.434-.025l.11-.994c.137.015.275.023.414.024zm-1.497-.025c.043 0 .087-.003.13-.008l.11.996a8 8 0 0 1-.131.024zm-1.012-.115c.14-.04.28-.083.413-.13l.327.948a8 8 0 0 1-.435.115zm-1.015-.307c.144-.174.275-.36.392-.554l.774.634a8 8 0 0 1-.442.547zm-.796-.654c.272-.285.521-.59.747-.91l.818.576a8 8 0 0 1-.611.738zm-.616-.779c.086-.11.168-.22.247-.333l.817.577c-.11.155-.226.305-.35.45zm-.44-1.015a7 7 0 0 0-.272-.44l.493-.87c.16.28.337.547.532.801zm-.271-1.05a7 7 0 0 0-.115-.435l.22-.975c.08.35.184.694.312 1.026zm-.115-1.45a7 7 0 0 0-.025-.434l.11-.994c.015.137.023.275.024.414zm-.025-1.497c0-.043.003-.087.008-.13l.11.996a8 8 0 0 1-.024.131zm.115-1.012c.04-.14.083-.28.13-.413l.327.948a8 8 0 0 1-.115.435zm.307-1.015c.144-.174.36-.275.554-.392l.774.634a8 8 0 0 1-.547.442zm.654-.796c.285-.272.59-.521.91-.747l.818.576a8 8 0 0 1-.738.611zm.779-.616c.11-.086.22-.168.333-.247l.577.817c-.155.11-.305.226-.45.35zm1.015-.44a7 7 0 0 0 .44-.272l.87.493a8 8 0 0 1-.801.532zm1.05-.271a7 7 0 0 0 .435-.115l.975.22c-.35.08-.694.184-1.026.312zm1.45-.115c.043 0 .087-.003.13-.008l.11.996a8 8 0 0 1-.131-.024z"/>
            <path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
          </svg>
          <h5 className="fw-bold text-dark m-0" style={{ fontSize: '16px' }}>Danh sách sách đang mượn</h5>
        </div>

        <div className="table-responsive">
          <table className="table align-middle m-0">
            <thead>
              <tr className="text-secondary" style={{ backgroundColor: '#f9fafb', fontSize: '14px' }}>
                <th className="py-3 px-3 fw-medium">Tên sách</th>
                <th className="py-3 fw-medium">Ngày mượn</th>
                <th className="py-3 fw-medium">Hạn trả</th>
                <th className="py-3 fw-medium">Tình trạng</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '14px' }}>
              {borrowedList.length > 0 ? (
                borrowedList.map((item) => (
                  <tr key={item.id}>
                    <td className="py-3 px-3 fw-bold text-dark">{item.title}</td>
                    <td className="py-3 text-secondary">{item.borrowDate}</td>
                    <td className={`py-3 ${item.isOverdue ? 'text-danger fw-bold' : 'text-secondary'}`}>
                      {item.dueDate}
                    </td>
                    <td className="py-3">
                      <span className={`badge border px-3 py-1.5 rounded-pill ${item.statusClass}`}>
                        {item.isOverdue && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-exclamation-triangle-fill me-1" viewBox="0 0 16 16">
                            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                          </svg>
                        )}
                        {item.statusText}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-muted py-4 small">
                    Đức ơi, tài khoản sinh viên này hiện tại không có cuốn sách nào đang mượn nhé!
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

export default BorrowedBooks;