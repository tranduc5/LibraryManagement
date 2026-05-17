import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookSearch = () => {
  const [books, setBooks] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');

  // Lấy mã Token xác thực từ localStorage để đính kèm vào Header khi gửi yêu cầu mượn
  const token = localStorage.getItem('access_token');

  // 1. Hàm tải danh sách sách từ Django Backend về cho Độc giả
  const fetchStudentBooks = async () => {
    try {
      const params = new URLSearchParams();
      if (searchKeyword && searchKeyword.trim() !== '') {
        params.append('search', searchKeyword.trim());
      }

      const url = `http://127.0.0.1:8000/api/books/${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await axios.get(url);
      
      const data = res.data.results || res.data || [];
      setBooks(data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách sách phía độc giả:", err);
    }
  };

  // Tự động tải lại danh sách sách mỗi khi sinh viên gõ từ khóa (Real-time Search)
  useEffect(() => {
    fetchStudentBooks();
  }, [searchKeyword]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStudentBooks();
  };

  // 🚀 2. HÀM XỬ LÝ MƯỢN SÁCH ONLINE KẾT NỐI API BACKEND
  const handleStudentBorrow = async (bookId, bookTitle) => {
    if (!token) {
      alert("Đức ơi, phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại để thực hiện mượn sách nhé!");
      return;
    }

    const confirmBorrow = window.confirm(`Bạn có chắc chắn muốn đăng ký mượn online cuốn "${bookTitle}" không?`);
    
    if (confirmBorrow) {
      try {
        // Gửi request POST lên API mượn sách của Backend
        await axios.post(
          'http://127.0.0.1:8000/api/transactions/borrow_book/', 
          { book_id: bookId }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        alert(`Đăng ký mượn online thành công!\nĐức hãy qua thư viện để nhận sách vật lý trong thời gian sớm nhất nhé.`);
        fetchStudentBooks(); // Tải lại danh sách để cập nhật số lượng kho thời gian thực
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.error || "Gặp lỗi hệ thống khi đăng ký mượn sách online!");
      }
    }
  };

  return (
    <div>
      {/* BANNER TÌM KIẾM TRỰC QUAN LỚN */}
      <div 
        className="text-white text-center p-5 rounded-4 mb-5 shadow-sm d-flex flex-column align-items-center justify-content-center"
        style={{ backgroundColor: '#2563eb', backgroundImage: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }}
      >
        <h2 className="fw-bold mb-2" style={{ fontSize: '28px' }}>Tìm kiếm tri thức của bạn</h2>
        <p className="opacity-75 mb-4" style={{ fontSize: '15px' }}>Hơn 10.000 đầu sách đang chờ bạn khám phá tại Thư viện PTIT</p>
        
        <form onSubmit={handleSearchSubmit} className="d-flex w-100 px-3" style={{ maxWidth: '650px' }}>
          <div className="input-group shadow border border-light-subtle rounded-3 overflow-hidden">
            <input 
              type="text" 
              className="form-control border-0 py-3 px-4 bg-white text-dark shadow-none" 
              placeholder="Nhập tên sách, tác giả hoặc từ khóa..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              style={{ fontSize: '15px' }}
            />
            <button 
              className="btn text-white fw-bold px-4 d-flex align-items-center gap-2 border-0" 
              type="submit"
              style={{ backgroundColor: '#1e293b' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
              </svg>
              Tìm kiếm
            </button>
          </div>
        </form>
      </div>

      {/* DANH SÁCH SÁCH MỚI CẬP NHẬT */}
      <h5 className="fw-bold text-dark mb-4 px-1" style={{ fontSize: '18px' }}>Sách Mới Cập Nhật</h5>
      
      <div className="row g-4">
        {books.length > 0 ? (
          books.map((book) => {
            const isAvailable = parseInt(book.stock || 0) > 0;

            return (
              <div key={book.id} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100 border-0 shadow-sm rounded-4 p-3 bg-white d-flex flex-column">
                  
                  {/* Khung bọc hiển thị ảnh bìa sách */}
                  <div 
                    className="bg-light rounded-3 d-flex align-items-center justify-content-center border mb-3 overflow-hidden" 
                    style={{ height: '240px' }}
                  >
                    {book.image ? (
                      <img 
                        src={book.image} 
                        alt={book.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    ) : (
                      <div className="text-center text-muted opacity-50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-book mb-2" viewBox="0 0 16 16">
                          <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783"/>
                        </svg>
                        <div className="small fw-semibold">No Cover Available</div>
                      </div>
                    )}
                  </div>
                  
                  {/* Nội dung thông tin sách */}
                  <h6 className="fw-bold text-dark m-0 mb-1" style={{ fontSize: '16px', lineHeight: '1.4' }}>{book.title}</h6>
                  <p className="text-secondary small mb-3">Tác giả: <span className="fw-medium">{book.author || 'Chưa cập nhật'}</span></p>
                  
                  {/* Khối Trạng thái kho */}
                  <div className="mb-3">
                    {isAvailable ? (
                      <span className="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1.5 rounded fw-bold" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                        CÒN SÁCH
                      </span>
                    ) : (
                      <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2.5 py-1.5 rounded fw-bold" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                        HẾT SÁCH
                      </span>
                    )}
                  </div>

                  {/* 🚀 ĐOẠN ĐÃ SỬA ĐỔI: Tách đôi hành động - Chi tiết nằm bên trái, Mượn sách nằm bên phải */}
                  <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top border-light-subtle">
                    {/* Giữ nguyên nút Xem Chi Tiết cũ của bạn */}
                    <button 
                      type="button"
                      className="btn btn-link p-0 text-primary fw-bold text-decoration-none small shadow-none"
                      onClick={() => alert(`Đầu sách: ${book.title}\nThể loại: ${book.category_detail?.name || 'Chưa phân loại'}\nSố lượng trong kho: ${book.stock} cuốn.`)}
                      style={{ fontSize: '14px' }}
                    >
                      Chi tiết
                    </button>
                    
                    {/* Thêm nút Mượn Sách Online ngay bên cạnh */}
                    <button 
                      type="button"
                      className={`btn btn-sm fw-bold px-3 py-1.5 shadow-sm ${isAvailable ? 'btn-primary' : 'btn-secondary'}`}
                      disabled={!isAvailable}
                      onClick={() => handleStudentBorrow(book.id, book.title)}
                      style={{ borderRadius: '6px', fontSize: '13px' }}
                    >
                      {isAvailable ? 'Mượn sách' : 'Hết sách'}
                    </button>
                  </div>

                </div>
              </div>
            );
          })
        ) : (
          <div className="col-12 text-center py-5 text-muted small">
            Không tìm thấy đầu sách nào phù hợp với từ khóa truy tìm của bạn...
          </div>
        )}
      </div>
    </div>
  );
};

export default BookSearch;